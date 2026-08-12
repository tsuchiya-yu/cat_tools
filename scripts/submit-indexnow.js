const SITE_URL = 'https://cat-tools.catnote.tokyo';
const INDEXNOW_KEY = '8541fb6911ebee21baedd14e76f5e0db';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_REQUEST = 10_000;
const KEY_CHECK_ATTEMPTS = 12;
const KEY_CHECK_INTERVAL_MS = 5_000;

/**
 * @param {string} value
 * @returns {string}
 */
function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

/**
 * @param {string} xml
 * @returns {string[]}
 */
function extractLocs(xml) {
  return [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/giu)].map((match) =>
    decodeXml(match[1].trim())
  );
}

/**
 * @param {string} sitemapUrl
 * @param {typeof fetch} fetchImpl
 * @param {Set<string>} visitedSitemaps
 * @returns {Promise<string[]>}
 */
async function collectSitemapUrls(
  sitemapUrl,
  fetchImpl = fetch,
  visitedSitemaps = new Set()
) {
  if (visitedSitemaps.has(sitemapUrl)) {
    return [];
  }
  visitedSitemaps.add(sitemapUrl);

  const response = await fetchImpl(sitemapUrl, {
    headers: { accept: 'application/xml, text/xml' },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap (${response.status}): ${sitemapUrl}`);
  }

  const xml = await response.text();
  const locs = extractLocs(xml);

  if (/<sitemapindex\b/iu.test(xml)) {
    const nestedUrls = await Promise.all(
      locs.map((loc) => collectSitemapUrls(loc, fetchImpl, visitedSitemaps))
    );
    return [...new Set(nestedUrls.flat())];
  }

  return [...new Set(locs)];
}

/**
 * @param {string[]} urls
 * @param {string} siteUrl
 * @returns {string[]}
 */
function validateSubmittedUrls(urls, siteUrl = SITE_URL) {
  const site = new URL(siteUrl);
  const uniqueUrls = [...new Set(urls)];

  if (uniqueUrls.length === 0) {
    throw new Error('The sitemap did not contain any URLs to submit.');
  }
  if (uniqueUrls.length > MAX_URLS_PER_REQUEST) {
    throw new Error(
      `The sitemap contains ${uniqueUrls.length} URLs; IndexNow accepts at most ${MAX_URLS_PER_REQUEST} per request.`
    );
  }

  for (const value of uniqueUrls) {
    const url = new URL(value);
    if (url.protocol !== site.protocol || url.host !== site.host) {
      throw new Error(`Refusing to submit a URL outside ${site.origin}: ${value}`);
    }
  }

  return uniqueUrls;
}

/**
 * @param {number} milliseconds
 * @returns {Promise<void>}
 */
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * @param {{ fetchImpl?: typeof fetch, attempts?: number, intervalMs?: number, sleepImpl?: typeof sleep }} options
 * @returns {Promise<void>}
 */
async function waitForPublishedKey({
  fetchImpl = fetch,
  attempts = KEY_CHECK_ATTEMPTS,
  intervalMs = KEY_CHECK_INTERVAL_MS,
  sleepImpl = sleep,
} = {}) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchImpl(KEY_LOCATION, { cache: 'no-store' });
      if (response.ok && (await response.text()).trim() === INDEXNOW_KEY) {
        return;
      }
    } catch {
      // The production alias can take a few seconds to point to the new deployment.
    }

    if (attempt < attempts) {
      await sleepImpl(intervalMs);
    }
  }

  throw new Error(`IndexNow key is not publicly available at ${KEY_LOCATION}`);
}

/**
 * @param {{ fetchImpl?: typeof fetch }} options
 * @returns {Promise<{ status: number, urlCount: number }>}
 */
async function submitIndexNow({ fetchImpl = fetch } = {}) {
  await waitForPublishedKey({ fetchImpl });

  const sitemapUrls = await collectSitemapUrls(SITEMAP_URL, fetchImpl);
  const urlList = validateSubmittedUrls(sitemapUrls);
  const site = new URL(SITE_URL);

  const response = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: site.host,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    }),
  });

  if (response.status !== 200 && response.status !== 202) {
    const responseBody = (await response.text()).slice(0, 500);
    throw new Error(
      `IndexNow submission failed (${response.status})${responseBody ? `: ${responseBody}` : ''}`
    );
  }

  return { status: response.status, urlCount: urlList.length };
}

async function run() {
  const result = await submitIndexNow();
  console.log(
    `IndexNow accepted ${result.urlCount} URLs with HTTP ${result.status}.`
  );
}

if (require.main === module) {
  run().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}

module.exports = {
  INDEXNOW_KEY,
  INDEXNOW_ENDPOINT,
  KEY_LOCATION,
  SITEMAP_URL,
  collectSitemapUrls,
  extractLocs,
  submitIndexNow,
  validateSubmittedUrls,
  waitForPublishedKey,
};
