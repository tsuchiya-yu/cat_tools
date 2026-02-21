/**
 * @param {string} hostname
 * @returns {boolean}
 */
function isLocalHost(hostname) {
  const host = hostname.toLowerCase();
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '0.0.0.0' ||
    host === '::1' ||
    host === '[::1]' ||
    host.endsWith('.local')
  );
}

/**
 * @param {string | undefined} siteUrl
 * @returns {void}
 */
function validateSiteUrlForProduction(siteUrl) {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  if (!siteUrl || siteUrl.trim() === '') {
    throw new Error('SITE_URL is required for production build.');
  }

  let parsed;
  try {
    parsed = new URL(siteUrl);
  } catch {
    throw new Error(`SITE_URL must be a valid URL in production: "${siteUrl}"`);
  }

  if (parsed.protocol !== 'https:') {
    throw new Error('SITE_URL must start with https:// in production.');
  }

  if (isLocalHost(parsed.hostname)) {
    throw new Error(
      `SITE_URL host must not be local in production: "${parsed.hostname}"`
    );
  }
}

/**
 * @returns {void}
 */
function run() {
  const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;
  validateSiteUrlForProduction(siteUrl);
}

if (require.main === module) {
  run();
}

module.exports = { validateSiteUrlForProduction, isLocalHost };
