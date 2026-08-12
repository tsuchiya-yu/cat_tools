import * as submitIndexNowModule from '../../../scripts/submit-indexnow';
const {
  INDEXNOW_KEY,
  INDEXNOW_ENDPOINT,
  KEY_LOCATION,
  SITEMAP_URL,
  collectSitemapUrls,
  extractLocs,
  getSitemapUrl,
  postIndexNow,
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

  test('Vercel固有URLからsitemap indexとnested sitemapを取得する', async () => {
    const deploymentUrl = 'https://cat-tools-example.vercel.app';
    const deploymentSitemapUrl = `${deploymentUrl}/sitemap.xml`;
    const deploymentNestedUrl = `${deploymentUrl}/sitemap-0.xml`;
    const fetchImpl = jest.fn(async (url: string | URL | Request) => {
      const value = String(url);
      if (value === deploymentSitemapUrl) {
        return response(`
          <sitemapindex>
            <sitemap><loc>https://cat-tools.catnote.tokyo/sitemap-0.xml</loc></sitemap>
          </sitemapindex>
        `);
      }
      if (value === deploymentNestedUrl) {
        return response(`
          <urlset>
            <url><loc>https://cat-tools.catnote.tokyo/new-page</loc></url>
          </urlset>
        `);
      }
      return response('unexpected URL', 500);
    });

    await expect(
      collectSitemapUrls(deploymentSitemapUrl, fetchImpl as typeof fetch)
    ).resolves.toEqual(['https://cat-tools.catnote.tokyo/new-page']);
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      deploymentNestedUrl,
      expect.any(Object)
    );
    expect(fetchImpl).not.toHaveBeenCalledWith(
      'https://cat-tools.catnote.tokyo/sitemap-0.xml',
      expect.anything()
    );
  });

  test('許可されないoriginのnested sitemapはfetch前に拒否する', async () => {
    const fetchImpl = jest.fn(async () =>
      response(`
        <sitemapindex>
          <sitemap><loc>https://example.com/sitemap.xml</loc></sitemap>
        </sitemapindex>
      `)
    );

    await expect(
      collectSitemapUrls(SITEMAP_URL, fetchImpl as typeof fetch)
    ).rejects.toThrow('Refusing to fetch a nested sitemap outside');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  test('DEPLOYMENT_URLがなければProduction sitemapへfallbackする', () => {
    expect(getSitemapUrl(undefined)).toBe(SITEMAP_URL);
    expect(getSitemapUrl('')).toBe(SITEMAP_URL);
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

  test('今回デプロイされたsitemapのProduction URLをIndexNowへ一括送信する', async () => {
    const deploymentUrl = 'https://cat-tools-example.vercel.app';
    const deploymentSitemapUrl = `${deploymentUrl}/sitemap.xml`;
    const fetchImpl = jest.fn(async (url: string | URL | Request, init?: RequestInit) => {
      const value = String(url);
      if (value === KEY_LOCATION) return response(INDEXNOW_KEY);
      if (value === deploymentSitemapUrl) {
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
      submitIndexNow({
        fetchImpl: fetchImpl as typeof fetch,
        deploymentUrl,
        sleepImpl: jest.fn().mockResolvedValue(undefined),
      })
    ).resolves.toEqual({ status: 202, urlCount: 2 });
  });

  test('IndexNowの429と5xxを待機して再試行する', async () => {
    const fetchImpl = jest
      .fn()
      .mockResolvedValueOnce(response('rate limited', 429))
      .mockResolvedValueOnce(response('temporary failure', 503))
      .mockResolvedValueOnce(response('', 200));
    const sleepImpl = jest.fn().mockResolvedValue(undefined);

    await expect(
      postIndexNow(
        { host: 'cat-tools.catnote.tokyo', urlList: [] },
        {
          fetchImpl: fetchImpl as typeof fetch,
          attempts: 3,
          intervalMs: 0,
          sleepImpl,
        }
      )
    ).resolves.toMatchObject({ status: 200 });
    expect(fetchImpl).toHaveBeenCalledTimes(3);
    expect(sleepImpl).toHaveBeenCalledTimes(2);
  });

  test('IndexNowの恒久的な4xxは再試行しない', async () => {
    const fetchImpl = jest.fn().mockResolvedValue(response('invalid key', 403));
    const sleepImpl = jest.fn().mockResolvedValue(undefined);

    await expect(
      postIndexNow(
        { host: 'cat-tools.catnote.tokyo', urlList: [] },
        {
          fetchImpl: fetchImpl as typeof fetch,
          attempts: 3,
          intervalMs: 0,
          sleepImpl,
        }
      )
    ).rejects.toThrow('IndexNow submission failed (403): invalid key');
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(sleepImpl).not.toHaveBeenCalled();
  });
});
