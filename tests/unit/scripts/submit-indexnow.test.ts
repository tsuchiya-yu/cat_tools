import * as submitIndexNowModule from '../../../scripts/submit-indexnow';
const {
  INDEXNOW_KEY,
  INDEXNOW_ENDPOINT,
  KEY_LOCATION,
  SITEMAP_URL,
  collectSitemapUrls,
  extractLocs,
  submitIndexNow,
  validateSubmittedUrls,
  waitForPublishedKey,
} = submitIndexNowModule;

const response = (body: string, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  text: async () => body,
});

describe('submit-indexnow', () => {
  test('sitemapのlocをXMLエンティティ込みで抽出する', () => {
    expect(
      extractLocs(
        '<urlset><url><loc>https://cat-tools.catnote.tokyo/page?a=1&amp;b=2</loc></url></urlset>'
      )
    ).toEqual(['https://cat-tools.catnote.tokyo/page?a=1&b=2']);
  });

  test('sitemap indexを再帰的に読み、URLを重複排除する', async () => {
    const fetchImpl = jest.fn(async (url: string | URL | Request) => {
      const value = String(url);
      if (value === SITEMAP_URL) {
        return response(`
          <sitemapindex>
            <sitemap><loc>https://cat-tools.catnote.tokyo/sitemap-0.xml</loc></sitemap>
          </sitemapindex>
        `);
      }
      return response(`
        <urlset>
          <url><loc>https://cat-tools.catnote.tokyo/</loc></url>
          <url><loc>https://cat-tools.catnote.tokyo/about</loc></url>
          <url><loc>https://cat-tools.catnote.tokyo/about</loc></url>
        </urlset>
      `);
    });

    await expect(collectSitemapUrls(SITEMAP_URL, fetchImpl as typeof fetch)).resolves.toEqual([
      'https://cat-tools.catnote.tokyo/',
      'https://cat-tools.catnote.tokyo/about',
    ]);
  });

  test('サイト外URLの送信を拒否する', () => {
    expect(() =>
      validateSubmittedUrls(['https://example.com/page'])
    ).toThrow('Refusing to submit a URL outside');
  });

  test('公開キーが一致するまで再試行する', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(response('not-ready', 404))
      .mockResolvedValueOnce(response(INDEXNOW_KEY));
    const sleepImpl = jest.fn().mockResolvedValue(undefined);

    await expect(
      waitForPublishedKey({
        fetchImpl: fetchImpl as typeof fetch,
        attempts: 2,
        intervalMs: 0,
        sleepImpl,
      })
    ).resolves.toBeUndefined();
    expect(sleepImpl).toHaveBeenCalledTimes(1);
  });

  test('公開sitemapのURLをIndexNowへ一括送信する', async () => {
    const fetchImpl = jest.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const value = String(url);
      if (value === KEY_LOCATION) return response(INDEXNOW_KEY);
      if (value === SITEMAP_URL) {
        return response(`
          <urlset>
            <url><loc>https://cat-tools.catnote.tokyo/</loc></url>
            <url><loc>https://cat-tools.catnote.tokyo/about</loc></url>
          </urlset>
        `);
      }
      if (value === INDEXNOW_ENDPOINT) {
        const payload = JSON.parse(String(init?.body));
        expect(payload).toEqual({
          host: 'cat-tools.catnote.tokyo',
          key: INDEXNOW_KEY,
          keyLocation: KEY_LOCATION,
          urlList: [
            'https://cat-tools.catnote.tokyo/',
            'https://cat-tools.catnote.tokyo/about',
          ],
        });
        return response('', 202);
      }
      return response('unexpected URL', 500);
    });

    await expect(
      submitIndexNow({ fetchImpl: fetchImpl as typeof fetch })
    ).resolves.toEqual({ status: 202, urlCount: 2 });
  });
});
