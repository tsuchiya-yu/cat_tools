const TRANSIENT_ERROR = 'transient';
const PERMANENT_ERROR = 'permanent';
const UNKNOWN_ERROR = 'unknown';

const MAX_REVIEW_BODY_LENGTH = 60_000;
const MAX_COMMENT_BODY_LENGTH = 60_000;

function asErrorText(errors) {
  if (!Array.isArray(errors)) return '';
  return errors
    .map((error) => {
      if (typeof error === 'string') return error;
      if (error && typeof error === 'object') {
        return [error.code, error.type, error.message].filter(Boolean).join(' ');
      }
      return String(error ?? '');
    })
    .join('\n');
}

function classifyFailure({
  exitCode = 1,
  errors = [],
  stderr = '',
  outputState = 'present',
  timedOut = false,
  worktreeChanged = false,
  executionStartFailed = false,
}) {
  if (worktreeChanged) {
    return { kind: PERMANENT_ERROR, code: 'worktree_changed', retryable: false };
  }

  if (executionStartFailed) {
    return { kind: PERMANENT_ERROR, code: 'execution_start_failed', retryable: false };
  }

  if (timedOut) {
    return { kind: TRANSIENT_ERROR, code: 'timeout', retryable: true };
  }

  const text = `${asErrorText(errors)}\n${stderr}`.toLowerCase();

  const permanentPatterns = [
    /\b(?:401|402|403)\b/,
    /unauthori[sz]ed|forbidden|authentication|invalid (?:api )?key/,
    /insufficient (?:credits?|balance)|budget|quota (?:exceeded|exhausted)/,
    /missing (?:environment variable|api key)|profile .*not found|invalid model/,
    /context (?:length|window|limit)|maximum context/,
    /moderation|content policy|policy refusal/,
  ];

  if (permanentPatterns.some((pattern) => pattern.test(text))) {
    return { kind: PERMANENT_ERROR, code: 'non_retryable_provider_error', retryable: false };
  }

  const missingCompletionFields =
    /can not parse response/.test(text) &&
    /fields? \[choices, model\].*(?:missing|required)/.test(text);
  if (missingCompletionFields) {
    return { kind: TRANSIENT_ERROR, code: 'missing_completion_fields', retryable: true };
  }

  const transientPatterns = [
    /\b429\b|rate limit/,
    /\b(?:502|503|504)\b/,
    /timed? out|timeout/,
    /network|connection (?:reset|refused|closed)|socket hang up/,
    /provider .*unavailable|model .*unavailable|service unavailable/,
  ];

  if (transientPatterns.some((pattern) => pattern.test(text))) {
    return { kind: TRANSIENT_ERROR, code: 'temporary_provider_error', retryable: true };
  }

  if (outputState === 'missing' || outputState === 'empty') {
    if (exitCode === 0) {
      return { kind: TRANSIENT_ERROR, code: 'empty_response', retryable: true };
    }
    return { kind: UNKNOWN_ERROR, code: 'unknown_execution_error', retryable: false };
  }

  if (outputState === 'invalid_json' || outputState === 'invalid_review_json') {
    return { kind: TRANSIENT_ERROR, code: 'malformed_response', retryable: true };
  }

  return {
    kind: UNKNOWN_ERROR,
    code: exitCode === 0 ? 'unknown_output_error' : 'unknown_execution_error',
    retryable: false,
  };
}

function isSafeRelativePath(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= 1_024 &&
    !value.startsWith('/') &&
    !value.includes('\\') &&
    !value.split('/').includes('..')
  );
}

function normalizeReviewResult(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('review result must be an object');
  }

  const { status, summary, findings } = value;
  if (status !== 'clean' && status !== 'findings') {
    throw new Error('status must be clean or findings');
  }
  if (typeof summary !== 'string' || summary.trim() === '' || summary.length > MAX_REVIEW_BODY_LENGTH) {
    throw new Error('summary is missing or too long');
  }
  if (!Array.isArray(findings)) {
    throw new Error('findings must be an array');
  }
  if (status === 'clean' && findings.length !== 0) {
    throw new Error('clean reviews cannot contain findings');
  }
  if (status === 'findings' && findings.length === 0) {
    throw new Error('findings reviews must contain at least one finding');
  }

  const normalizedFindings = findings.map((finding, index) => {
    if (!finding || typeof finding !== 'object' || Array.isArray(finding)) {
      throw new Error(`finding ${index} must be an object`);
    }
    if (!['P0', 'P1', 'P2', 'P3'].includes(finding.severity)) {
      throw new Error(`finding ${index} has an invalid severity`);
    }
    if (!isSafeRelativePath(finding.path)) {
      throw new Error(`finding ${index} has an invalid path`);
    }
    if (!Number.isInteger(finding.line) || finding.line < 1) {
      throw new Error(`finding ${index} has an invalid line`);
    }
    if (
      finding.startLine !== undefined &&
      (!Number.isInteger(finding.startLine) || finding.startLine < 1 || finding.startLine > finding.line)
    ) {
      throw new Error(`finding ${index} has an invalid startLine`);
    }
    if (
      typeof finding.body !== 'string' ||
      finding.body.trim() === '' ||
      finding.body.length > MAX_COMMENT_BODY_LENGTH
    ) {
      throw new Error(`finding ${index} has an invalid body`);
    }
    if (!finding.body.trimStart().startsWith(`[${finding.severity}]`)) {
      throw new Error(`finding ${index} body must start with its severity`);
    }

    return {
      severity: finding.severity,
      path: finding.path,
      line: finding.line,
      ...(finding.startLine === undefined ? {} : { startLine: finding.startLine }),
      body: finding.body.trim(),
    };
  });

  return {
    status,
    summary: summary.trim(),
    findings: normalizedFindings,
  };
}

function parseReviewJson(result) {
  const trimmed = result.trim();
  const fenced = /^```(?:json)?\s*\n([\s\S]*?)\n```$/i.exec(trimmed);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function parseJunieOutput(rawOutput, exitCode, stderr = '') {
  if (rawOutput === undefined) {
    return { ok: false, failure: classifyFailure({ exitCode, stderr, outputState: 'missing' }) };
  }
  if (rawOutput.trim() === '') {
    return { ok: false, failure: classifyFailure({ exitCode, stderr, outputState: 'empty' }) };
  }

  let output;
  try {
    output = JSON.parse(rawOutput);
  } catch {
    return { ok: false, failure: classifyFailure({ exitCode, stderr, outputState: 'invalid_json' }) };
  }

  const errors = Array.isArray(output.errors) ? output.errors : [];
  if (exitCode !== 0 || errors.length > 0) {
    return { ok: false, failure: classifyFailure({ exitCode, errors, stderr }) };
  }
  if (typeof output.result !== 'string' || output.result.trim() === '' || output.result === 'Empty') {
    return { ok: false, failure: classifyFailure({ exitCode, errors, stderr, outputState: 'empty' }) };
  }

  try {
    const review = normalizeReviewResult(parseReviewJson(output.result));
    return { ok: true, review };
  } catch {
    return {
      ok: false,
      failure: classifyFailure({ exitCode, errors, stderr, outputState: 'invalid_review_json' }),
    };
  }
}

async function orchestrateReview(executeAttempt) {
  const attempts = [];
  const primary = await executeAttempt('primary');
  attempts.push(primary);
  if (primary.ok) return { ok: true, selected: 'primary', review: primary.review, attempts };
  if (!primary.failure.retryable) return { ok: false, failure: primary.failure, attempts };

  const fallback = await executeAttempt('fallback');
  attempts.push(fallback);
  if (fallback.ok) return { ok: true, selected: 'fallback', review: fallback.review, attempts };
  return { ok: false, failure: fallback.failure, attempts };
}

function collectRightSideLines(patch) {
  const validLines = new Set();
  if (typeof patch !== 'string') return validLines;

  let newLine = 0;
  let inHunk = false;
  for (const line of patch.split('\n')) {
    const hunk = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/.exec(line);
    if (hunk) {
      newLine = Number(hunk[2]);
      inHunk = true;
      continue;
    }
    if (!inHunk || line.startsWith('\\ No newline')) continue;
    if (line.startsWith('+') && !line.startsWith('+++')) {
      validLines.add(newLine);
      newLine += 1;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
    } else if (line.startsWith(' ')) {
      validLines.add(newLine);
      newLine += 1;
    }
  }
  return validLines;
}

function validateFindingsAgainstDiff(review, changedFiles) {
  const linesByPath = new Map();
  for (const file of changedFiles) {
    if (typeof file.filename === 'string' && typeof file.patch === 'string') {
      linesByPath.set(file.filename, collectRightSideLines(file.patch));
    }
  }

  const seen = new Set();
  for (const finding of review.findings) {
    const validLines = linesByPath.get(finding.path);
    if (!validLines) throw new Error(`finding path is not available in the PR diff: ${finding.path}`);
    const startLine = finding.startLine ?? finding.line;
    for (let line = startLine; line <= finding.line; line += 1) {
      if (!validLines.has(line)) {
        throw new Error(`finding line is not available on the right side of the PR diff: ${finding.path}:${line}`);
      }
    }
    const key = `${finding.path}\0${startLine}\0${finding.line}\0${finding.body}`;
    if (seen.has(key)) throw new Error('duplicate finding');
    seen.add(key);
  }

  return review.findings.map((finding) => ({
    path: finding.path,
    line: finding.line,
    side: 'RIGHT',
    ...(finding.startLine === undefined
      ? {}
      : { start_line: finding.startLine, start_side: 'RIGHT' }),
    body: finding.body,
  }));
}

module.exports = {
  PERMANENT_ERROR,
  TRANSIENT_ERROR,
  UNKNOWN_ERROR,
  classifyFailure,
  collectRightSideLines,
  normalizeReviewResult,
  orchestrateReview,
  parseJunieOutput,
  validateFindingsAgainstDiff,
};
