const SITE_URL = 'https://cat-tools.catnote.tokyo';
const INDEXNOW_KEY = '8541fb6911ebee21baedd14e76f5e0db';
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS_PER_REQUEST = 10_000;
const KEY_CHECK_ATTEMPTS = 12;
const KEY_CHECK_INTERVAL_MS = 5_000;
const INDEXNOW_ATTEMPTS = 3;
const INDEXNOW_RETRY_INTERVAL_MS = 2_000;

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
 * @param {string | undefined} deploymentUrl
 * @returns {string}
 */
function getSitemapUrl(deploymentUrl) {
  const sourceUrl = new URL(deploymentUrl?.trim() || SITE_URL);
  if (sourceUrl.protocol !== 'https:') {
    throw new Error(`The sitemap source must use HTTPS: ${sourceUrl.href}`);
  }

  return new URL('/sitemap.xml', sourceUrl.origin).href;
}

/**
 * next-sitemap writes canonical production URLs into the sitemap index even
 * when the file is served from a Vercel deployment URL. Preserve the nested
 * path, but fetch it from the same deployment as the index.
 *
 * @param {string} nestedUrl
 * @param {string} sitemapSourceOrigin
 * @param {string} siteUrl
 * @returns {string}
 */
function resolveNestedSitemapUrl(
  nestedUrl,
  sitemapSourceOrigin,
  siteUrl = SITE_URL
) {
  const nested = new URL(nestedUrl);
  const source = new URL(sitemapSourceOrigin);
  const site = new URL(siteUrl);

  if (nested.origin !== source.origin && nested.origin !== site.origin) {
    throw new Error(
      `Refusing to fetch a nested sitemap outside ${source.origin} or ${site.origin}: ${nestedUrl}`
    );
  }

  return new URL(`${nested.pathname}${nested.search}`, source.origin).href;
}

/**
 * @param {string} sitemapUrl
 * @param {typeof fetch} fetchImpl
 * @param {Set<string>} visitedSitemaps
 * @param {string} sitemapSourceOrigin
 * @returns {Promise<string[]>}
 */
async function collectSitemapUrls(
  sitemapUrl,
  fetchImpl = fetch,
  visitedSitemaps = new Set(),
  sitemapSourceOrigin = new URL(sitemapUrl).origin
) {
  const currentUrl = new URL(sitemapUrl);
  if (currentUrl.origin !== new URL(sitemapSourceOrigin).origin) {
    throw new Error(
      `Refusing to fetch a sitemap outside ${new URL(sitemapSourceOrigin).origin}: ${sitemapUrl}`
    );
  }

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
      locs.map((loc) =>
        collectSitemapUrls(
          resolveNestedSitemapUrl(loc, sitemapSourceOrigin),
          fetchImpl,
          visitedSitemaps,
          sitemapSourceOrigin
        )
      )
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
 * @param {number} status
 * @returns {boolean}
 */
function isRetryableIndexNowStatus(status) {
  return status === 429 || (status >= 500 && status <= 599);
}

/**
 * @param {object} payload
 * @param {{ fetchImpl?: typeof fetch, attempts?: number, intervalMs?: number, sleepImpl?: typeof sleep }} options
 * @returns {Promise<Response>}
 */
async function postIndexNow(
  payload,
  {
    fetchImpl = fetch,
    attempts = INDEXNOW_ATTEMPTS,
    intervalMs = INDEXNOW_RETRY_INTERVAL_MS,
    sleepImpl = sleep,
  } = {}
) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const response = await fetchImpl(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    });

    if (response.status === 200 || response.status === 202) {
      return response;
    }

    if (isRetryableIndexNowStatus(response.status) && attempt < attempts) {
      await sleepImpl(intervalMs);
      continue;
    }

    const responseBody = (await response.text()).slice(0, 500);
    throw new Error(
      `IndexNow submission failed (${response.status})${responseBody ? `: ${responseBody}` : ''}`
    );
  }

  throw new Error('IndexNow submission failed after all retry attempts.');
}

/**
 * @param {{ fetchImpl?: typeof fetch, deploymentUrl?: string, sleepImpl?: typeof sleep, indexNowAttempts?: number, indexNowRetryIntervalMs?: number }} options
 * @returns {Promise<{ status: number, urlCount: number }>}
 */
async function submitIndexNow({
  fetchImpl = fetch,
  deploymentUrl = process.env.DEPLOYMENT_URL,
  sleepImpl = sleep,
  indexNowAttempts = INDEXNOW_ATTEMPTS,
  indexNowRetryIntervalMs = INDEXNOW_RETRY_INTERVAL_MS,
} = {}) {
  await waitForPublishedKey({ fetchImpl, sleepImpl });

  const sitemapUrl = getSitemapUrl(deploymentUrl);
  const sitemapUrls = await collectSitemapUrls(sitemapUrl, fetchImpl);
  const urlList = validateSubmittedUrls(sitemapUrls);
  const site = new URL(SITE_URL);

  const response = await postIndexNow(
    {
      host: site.host,
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList,
    },
    {
      fetchImpl,
      attempts: indexNowAttempts,
      intervalMs: indexNowRetryIntervalMs,
      sleepImpl,
    }
  );

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
  getSitemapUrl,
  postIndexNow,
  resolveNestedSitemapUrl,
  submitIndexNow,
  validateSubmittedUrls,
  waitForPublishedKey,
};
