const {
  buildReviewRequest,
  classifyFailure,
  collectRightSideLines,
  normalizeReviewResult,
  orchestrateReview,
  parseOpenRouterResponse,
  validateFindingsAgainstDiff,
} = require('../../../scripts/openrouter-review/review-core');

const cleanReview = {
  status: 'clean',
  summary: 'レビューを完了しました。指摘はありません。',
  findings: [],
};

function completion(review = cleanReview) {
  return JSON.stringify({
    id: 'generation-id',
    model: 'openai/gpt-5.6-luna',
    choices: [{ message: { content: JSON.stringify(review) }, finish_reason: 'stop' }],
  });
}

describe('OpenRouter review fallback', () => {
  test('does not call fallback after primary succeeds', async () => {
    const execute = jest.fn().mockResolvedValue({ ok: true, review: cleanReview });
    const result = await orchestrateReview(execute);
    expect(result.ok).toBe(true);
    expect(result.selected).toBe('primary');
    expect(execute).toHaveBeenCalledTimes(1);
  });

  test('calls fallback once for a response missing choices/model', async () => {
    const failure = classifyFailure({ outputState: 'missing_completion_fields' });
    const execute = jest
      .fn()
      .mockResolvedValueOnce({ ok: false, failure })
      .mockResolvedValueOnce({ ok: true, review: cleanReview });
    const result = await orchestrateReview(execute);
    expect(failure).toMatchObject({ code: 'missing_completion_fields', retryable: true });
    expect(result.selected).toBe('fallback');
    expect(execute).toHaveBeenCalledTimes(2);
  });

  test.each([400, 401, 402, 403, 404, 413, 422])(
    'fails closed without fallback for HTTP %s',
    async (httpStatus) => {
      const failure = classifyFailure({ httpStatus });
      const execute = jest.fn().mockResolvedValue({ ok: false, failure });
      const result = await orchestrateReview(execute);
      expect(failure.retryable).toBe(false);
      expect(result.ok).toBe(false);
      expect(execute).toHaveBeenCalledTimes(1);
    },
  );

  test.each([408, 429, 500, 502, 503, 504])(
    'allows one fallback for HTTP %s',
    async (httpStatus) => {
      const failure = classifyFailure({ httpStatus });
      const execute = jest.fn().mockResolvedValue({ ok: false, failure });
      const result = await orchestrateReview(execute);
      expect(failure.retryable).toBe(true);
      expect(result.ok).toBe(false);
      expect(execute).toHaveBeenCalledTimes(2);
    },
  );

  test('uses structured provider error codes instead of message matching', () => {
    expect(classifyFailure({ errorCode: 'provider_unavailable' })).toMatchObject({ retryable: true });
    expect(classifyFailure({ errorType: 'insufficient_credits' })).toMatchObject({ retryable: false });
    expect(classifyFailure({ errorType: 'unexpected provider behavior' })).toMatchObject({
      kind: 'unknown',
      retryable: false,
    });
  });

  test.each(['ECONNRESET', 'ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT'])(
    'allows fallback for known network failure %s',
    (networkErrorCode) => {
      expect(classifyFailure({ networkErrorCode })).toMatchObject({
        code: 'network_error',
        retryable: true,
      });
    },
  );

  test('fails closed for an unknown network failure', () => {
    expect(classifyFailure({ networkErrorCode: 'UNEXPECTED' })).toMatchObject({
      code: 'unknown_network_error',
      retryable: false,
    });
  });

  test('fails closed when deterministic review context exceeds the cap', () => {
    expect(classifyFailure({ contextTooLarge: true })).toMatchObject({
      code: 'context_too_large',
      retryable: false,
    });
  });
});

describe('OpenRouter structured output', () => {
  test('builds a strict schema request with privacy and endpoint capability requirements', () => {
    const request = buildReviewRequest({
      model: 'openai/gpt-5.6-luna',
      guidelines: 'Review carefully.',
      context: 'diff data',
    });
    expect(request).toMatchObject({
      model: 'openai/gpt-5.6-luna',
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'cat_tools_pr_review', strict: true },
      },
      provider: {
        require_parameters: true,
        zdr: true,
        data_collection: 'deny',
      },
      stream: false,
    });
    expect(request).not.toHaveProperty('models');
    expect(request).not.toHaveProperty('tools');
    expect(request.response_format.json_schema.schema.required).toEqual([
      'status',
      'summary',
      'findings',
    ]);
  });

  test('accepts a schema-conforming clean completion', () => {
    expect(parseOpenRouterResponse(completion(), 200)).toEqual({ ok: true, review: cleanReview });
  });

  test('treats missing choices/model as transient even when HTTP status is 200', () => {
    expect(parseOpenRouterResponse(JSON.stringify({ id: 'bad' }), 200)).toMatchObject({
      ok: false,
      failure: { code: 'missing_completion_fields', retryable: true },
    });
  });

  test.each(['', '{broken'])('treats an empty or malformed success response as transient', (body) => {
    expect(parseOpenRouterResponse(body, 200)).toMatchObject({
      ok: false,
      failure: { retryable: true },
    });
  });

  test('treats malformed structured content as transient without exposing it', () => {
    const body = JSON.stringify({
      model: 'openai/gpt-5.6-luna',
      choices: [{ message: { content: 'not json and must not appear in diagnostics' } }],
    });
    expect(parseOpenRouterResponse(body, 200)).toMatchObject({
      ok: false,
      failure: { code: 'malformed_response', detail: 'invalid_result_json' },
    });
  });

  test('uses a structured HTTP error and does not expose its message', () => {
    const result = parseOpenRouterResponse(JSON.stringify({
      error: { code: 403, type: 'budget_error', message: 'sensitive upstream message' },
    }), 403);
    expect(result).toEqual({
      ok: false,
      failure: { kind: 'permanent', code: 'non_retryable_provider_error', retryable: false },
    });
  });

  test('fails closed without fallback for a structured model refusal', () => {
    const body = JSON.stringify({
      model: 'openai/gpt-5.6-luna',
      choices: [{ message: { refusal: 'not returned to diagnostics', content: '' } }],
    });
    expect(parseOpenRouterResponse(body, 200)).toEqual({
      ok: false,
      failure: { kind: 'permanent', code: 'non_retryable_provider_error', retryable: false },
    });
  });

  test('rejects invalid review schema', () => {
    const result = parseOpenRouterResponse(completion({ ...cleanReview, status: 'unknown' }), 200);
    expect(result).toMatchObject({
      ok: false,
      failure: {
        code: 'malformed_response',
        detail: 'invalid_review_schema: status must be clean or findings',
      },
    });
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
