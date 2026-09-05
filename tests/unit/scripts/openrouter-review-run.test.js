const { orchestrateReview } = require('../../../scripts/openrouter-review/review-core');
const { runOpenRouterAttempt } = require('../../../scripts/openrouter-review/run-review');

const cleanReview = {
  status: 'clean',
  summary: 'レビューを完了しました。',
  findings: [],
};

function mockResponse(body, status = 200) {
  return {
    status,
    text: jest.fn().mockResolvedValue(typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

function completion(model) {
  return {
    model,
    choices: [{ message: { content: JSON.stringify(cleanReview) }, finish_reason: 'stop' }],
  };
}

describe('direct OpenRouter review attempt', () => {
  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = 'test-only-key';
  });

  afterEach(() => {
    delete process.env.OPENROUTER_API_KEY;
  });

  test('sends one strict, tool-free request for a successful primary attempt', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      mockResponse(completion('openai/gpt-5.6-luna')),
    );
    const result = await runOpenRouterAttempt({
      kind: 'primary',
      guidelines: 'Review carefully.',
      context: 'untrusted diff',
      fetchImpl,
    });

    expect(result).toMatchObject({ ok: true, model: 'openai/gpt-5.6-luna' });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const request = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(request.model).toBe('openai/gpt-5.6-luna');
    expect(request.response_format.json_schema.strict).toBe(true);
    expect(request.provider).toEqual({
      require_parameters: true,
      zdr: true,
      data_collection: 'deny',
    });
    expect(request).not.toHaveProperty('tools');
    expect(request).not.toHaveProperty('models');
  });

  test('uses exactly one primary and one fallback request for malformed primary output', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(mockResponse({ id: 'missing-completion-fields' }))
      .mockResolvedValueOnce(mockResponse(completion('google/gemini-3.7-flash')));

    const result = await orchestrateReview((kind) => runOpenRouterAttempt({
      kind,
      guidelines: 'Review carefully.',
      context: 'untrusted diff',
      fetchImpl,
    }));

    expect(result).toMatchObject({ ok: true, selected: 'fallback' });
    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const models = fetchImpl.mock.calls.map((call) => JSON.parse(call[1].body).model);
    expect(models).toEqual(['openai/gpt-5.6-luna', 'google/gemini-3.7-flash']);
  });

  test('does not call fallback for a structured authorization failure', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(
      mockResponse({ error: { code: 403, type: 'authorization_error' } }, 403),
    );

    const result = await orchestrateReview((kind) => runOpenRouterAttempt({
      kind,
      guidelines: 'Review carefully.',
      context: 'untrusted diff',
      fetchImpl,
    }));

    expect(result.ok).toBe(false);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
