const {
  classifyFailure,
  collectRightSideLines,
  normalizeReviewResult,
  orchestrateReview,
  parseJunieOutput,
  validateFindingsAgainstDiff,
} = require('../../../scripts/openrouter-review/review-core');

const cleanReview = {
  status: 'clean',
  summary: 'レビューを完了しました。',
  findings: [],
};

describe('OpenRouter review fallback', () => {
  test('does not call fallback after primary succeeds', async () => {
    const execute = jest.fn().mockResolvedValue({ ok: true, review: cleanReview });
    const result = await orchestrateReview(execute);
    expect(result.ok).toBe(true);
    expect(result.selected).toBe('primary');
    expect(execute).toHaveBeenCalledTimes(1);
  });

  test('calls fallback once for the known missing choices/model response', async () => {
    const failure = classifyFailure({
      errors: ['OpenAI: Can not parse response. Fields [choices, model] are required but they were missing'],
    });
    const execute = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, failure })
      .mockResolvedValueOnce({ ok: true, review: cleanReview });
    const result = await orchestrateReview(execute);
    expect(failure).toMatchObject({ code: 'missing_completion_fields', retryable: true });
    expect(result.selected).toBe('fallback');
    expect(execute).toHaveBeenCalledTimes(2);
  });

  test.each([
    'HTTP 401 Unauthorized',
    'HTTP 402 insufficient credits',
    'HTTP 403 budget limit exceeded',
    'invalid model profile',
    'maximum context length exceeded',
  ])('fails closed without fallback for %s', async (message) => {
    const failure = classifyFailure({ errors: [message] });
    const execute = jest.fn().mockResolvedValue({ ok: false, failure });
    const result = await orchestrateReview(execute);
    expect(failure.retryable).toBe(false);
    expect(result.ok).toBe(false);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  test.each(['HTTP 429 rate limit', 'HTTP 502', 'HTTP 503', 'HTTP 504', 'network connection reset']) (
    'allows one fallback for %s',
    async (message) => {
      const failure = classifyFailure({ errors: [message] });
      const execute = jest.fn().mockResolvedValue({ ok: false, failure });
      const result = await orchestrateReview(execute);
      expect(failure.retryable).toBe(true);
      expect(result.ok).toBe(false);
      expect(execute).toHaveBeenCalledTimes(2);
    },
  );

  test('fails closed for an unknown error', async () => {
    const failure = classifyFailure({ errors: ['unexpected provider behavior'] });
    expect(failure).toMatchObject({ kind: 'unknown', retryable: false });
  });

  test('does not fallback after a worktree side effect', async () => {
    const failure = classifyFailure({ worktreeChanged: true });
    const execute = jest.fn().mockResolvedValue({ ok: false, failure });
    const result = await orchestrateReview(execute);
    expect(result.ok).toBe(false);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  test('does not fallback when Junie cannot start', async () => {
    const failure = classifyFailure({ executionStartFailed: true, outputState: 'missing' });
    const execute = jest.fn().mockResolvedValue({ ok: false, failure });
    const result = await orchestrateReview(execute);
    expect(failure).toMatchObject({ code: 'execution_start_failed', retryable: false });
    expect(result.ok).toBe(false);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  test('does not let a missing output mask a configuration error', () => {
    const failure = classifyFailure({
      exitCode: 1,
      stderr: 'Custom model profile was not found',
      outputState: 'missing',
    });
    expect(failure.retryable).toBe(false);
  });
});

describe('Junie output normalization', () => {
  test('accepts a structured clean result', () => {
    const parsed = parseJunieOutput(
      JSON.stringify({ errors: [], result: JSON.stringify(cleanReview) }),
      0,
    );
    expect(parsed).toEqual({ ok: true, review: cleanReview });
  });

  test('accepts a single JSON code fence emitted around a structured result', () => {
    const parsed = parseJunieOutput(
      JSON.stringify({ errors: [], result: `\`\`\`json\n${JSON.stringify(cleanReview)}\n\`\`\`` }),
      0,
    );
    expect(parsed).toEqual({ ok: true, review: cleanReview });
  });

  test('accepts exactly one structured JSON object from a Junie prose wrapper', () => {
    const parsed = parseJunieOutput(
      JSON.stringify({ errors: [], result: `review result:\n${JSON.stringify(cleanReview)}` }),
      0,
    );
    expect(parsed).toEqual({ ok: true, review: cleanReview });
  });

  test('rejects a response containing multiple JSON objects', () => {
    const parsed = parseJunieOutput(
      JSON.stringify({
        errors: [],
        result: `${JSON.stringify(cleanReview)}\n${JSON.stringify(cleanReview)}`,
      }),
      0,
    );
    expect(parsed).toMatchObject({
      ok: false,
      failure: { code: 'malformed_response', detail: 'invalid_result_json' },
    });
  });

  test('reports only a safe schema validation reason for invalid structured output', () => {
    const parsed = parseJunieOutput(
      JSON.stringify({ errors: [], result: JSON.stringify({ ...cleanReview, status: 'unknown' }) }),
      0,
    );
    expect(parsed).toMatchObject({
      ok: false,
      failure: {
        code: 'malformed_response',
        detail: 'invalid_review_schema: status must be clean or findings',
      },
    });
  });

  test.each([undefined, ''])('treats a successful empty response as transient', (output) => {
    const parsed = parseJunieOutput(output, 0);
    expect(parsed.ok).toBe(false);
    expect(parsed.failure.retryable).toBe(true);
  });

  test('treats malformed JSON output as transient', () => {
    const parsed = parseJunieOutput('{broken', 1);
    expect(parsed.ok).toBe(false);
    expect(parsed.failure.retryable).toBe(true);
  });

  test('fails closed when Junie fails without a classifiable response', () => {
    const parsed = parseJunieOutput(undefined, 1);
    expect(parsed.ok).toBe(false);
    expect(parsed.failure).toMatchObject({ kind: 'unknown', retryable: false });
  });

  test('requires findings bodies to match their severity', () => {
    expect(() => normalizeReviewResult({
      status: 'findings',
      summary: '問題があります。',
      findings: [{ severity: 'P2', path: 'src/a.ts', line: 3, body: '[P1] mismatch' }],
    })).toThrow('body must start with its severity');
  });

  test('rejects unsafe finding paths', () => {
    expect(() => normalizeReviewResult({
      status: 'findings',
      summary: '問題があります。',
      findings: [{ severity: 'P2', path: '../secret', line: 3, body: '[P2] 問題です。' }],
    })).toThrow('invalid path');
  });
});

describe('PR diff validation', () => {
  const patch = [
    '@@ -10,3 +10,4 @@',
    ' context',
    '-removed',
    '+added',
    '+another',
    ' context two',
  ].join('\n');

  test('collects only valid right-side lines', () => {
    expect([...collectRightSideLines(patch)]).toEqual([10, 11, 12, 13]);
  });

  test('converts a validated finding to a GitHub review comment', () => {
    const review = normalizeReviewResult({
      status: 'findings',
      summary: '1件あります。',
      findings: [{ severity: 'P2', path: 'src/a.ts', line: 12, startLine: 11, body: '[P2] 問題です。' }],
    });
    expect(validateFindingsAgainstDiff(review, [{ filename: 'src/a.ts', patch }])).toEqual([
      {
        path: 'src/a.ts',
        line: 12,
        side: 'RIGHT',
        start_line: 11,
        start_side: 'RIGHT',
        body: '[P2] 問題です。',
      },
    ]);
  });

  test.each([
    [{ filename: 'src/a.ts', patch }, 'src/missing.ts', 11],
    [{ filename: 'src/a.ts', patch }, 'src/a.ts', 99],
    [{ filename: 'src/a.ts' }, 'src/a.ts', 11],
  ])('fails closed for a missing or invalid diff location', (file, findingPath, line) => {
    const review = normalizeReviewResult({
      status: 'findings',
      summary: '1件あります。',
      findings: [{ severity: 'P2', path: findingPath, line, body: '[P2] 問題です。' }],
    });
    expect(() => validateFindingsAgainstDiff(review, [file])).toThrow();
  });

  test('rejects duplicate findings', () => {
    const finding = { severity: 'P2', path: 'src/a.ts', line: 11, body: '[P2] 問題です。' };
    const review = normalizeReviewResult({ status: 'findings', summary: '重複です。', findings: [finding, finding] });
    expect(() => validateFindingsAgainstDiff(review, [{ filename: 'src/a.ts', patch }])).toThrow('duplicate');
  });
});
