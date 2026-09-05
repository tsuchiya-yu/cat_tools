const { publishReview } = require('../../../scripts/openrouter-review/publish-review');

const HEAD_SHA = 'a'.repeat(40);
const basePayload = {
  version: 1,
  headSha: HEAD_SHA,
  selected: 'primary',
  model: 'openai/gpt-5.6-luna',
  review: {
    status: 'findings',
    summary: '1件の指摘があります。',
    findings: [
      { severity: 'P2', path: 'src/a.ts', line: 2, body: '[P2] 問題があります。' },
    ],
  },
};

function createRequest({ reviews = [], headSha = HEAD_SHA, postError } = {}) {
  return jest.fn(async (path, options = {}) => {
    if (path.includes('/reviews?')) return reviews;
    if (path.includes('/files?')) {
      return [{ filename: 'src/a.ts', patch: '@@ -1,2 +1,2 @@\n context\n+added' }];
    }
    if (path.endsWith('/pulls/7')) return { head: { sha: headSha } };
    if (path.endsWith('/reviews') && options.method === 'POST') {
      if (postError) throw postError;
      return { id: 1 };
    }
    throw new Error(`unexpected request: ${path}`);
  });
}

describe('OpenRouter review publisher', () => {
  test('publishes the summary and findings in one Create Review request', async () => {
    const request = createRequest();
    const result = await publishReview({
      payload: basePayload,
      repository: 'owner/repo',
      pullNumber: 7,
      runId: '123',
      request,
    });
    expect(result.status).toBe('published');
    const postCalls = request.mock.calls.filter(([, options = {}]) => options.method === 'POST');
    expect(postCalls).toHaveLength(1);
    const sent = JSON.parse(postCalls[0][1].body);
    expect(sent).toMatchObject({ commit_id: HEAD_SHA, event: 'COMMENT' });
    expect(sent.comments).toEqual([
      { path: 'src/a.ts', line: 2, side: 'RIGHT', body: '[P2] 問題があります。' },
    ]);
    expect(sent.body).toContain('run=123');
  });

  test('does not publish when the PR head changed', async () => {
    const request = createRequest({ headSha: 'b'.repeat(40) });
    const result = await publishReview({
      payload: basePayload,
      repository: 'owner/repo',
      pullNumber: 7,
      runId: '123',
      request,
    });
    expect(result.status).toBe('stale');
    expect(request.mock.calls.some(([, options = {}]) => options.method === 'POST')).toBe(false);
  });

  test('does not republish an existing run and head SHA', async () => {
    const marker = `<!-- cat-tools-openrouter-review:run=123:sha=${HEAD_SHA} -->`;
    const request = createRequest({ reviews: [{ body: marker }] });
    const result = await publishReview({
      payload: basePayload,
      repository: 'owner/repo',
      pullNumber: 7,
      runId: '123',
      request,
    });
    expect(result.status).toBe('already_published');
    expect(request).toHaveBeenCalledTimes(1);
  });

  test('does not retry a 422 response with guessed locations', async () => {
    const error = new Error('validation failed');
    error.status = 422;
    const request = createRequest({ postError: error });
    await expect(publishReview({
      payload: basePayload,
      repository: 'owner/repo',
      pullNumber: 7,
      runId: '123',
      request,
    })).rejects.toThrow('refusing to guess');
    expect(request.mock.calls.filter(([, options = {}]) => options.method === 'POST')).toHaveLength(1);
  });

  test('publishes an explicit clean summary without inline comments', async () => {
    const request = createRequest();
    const payload = {
      ...basePayload,
      review: { status: 'clean', summary: 'レビューを完了しました。', findings: [] },
    };
    await publishReview({ payload, repository: 'owner/repo', pullNumber: 7, runId: '123', request });
    const post = request.mock.calls.find(([, options = {}]) => options.method === 'POST');
    const sent = JSON.parse(post[1].body);
    expect(sent.comments).toEqual([]);
    expect(sent.body).toContain('指摘はありませんでした。');
  });
});
