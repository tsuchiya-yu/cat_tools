const { formatISO } = require('date-fns');
/** @type {import('./src/types/tool').Tool[]} */
const TOOLS = require('./src/constants/tools.json');

const BASE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error('SITE_URL is not set. Please configure SITE_URL or NEXT_PUBLIC_BASE_URL.');
}

const url = new URL(
  BASE_URL.startsWith('http') ? BASE_URL : `https://${BASE_URL.replace(/^\/\//, '')}`
);
url.protocol = 'https:';
const siteUrl = url.origin;
const TOOL_PATHS = new Set(TOOLS.map((tool) => tool.href));
const HOME_PAGE_PRIORITY = 1;
const TOOL_PAGE_PRIORITY = 0.8;
const buildSitemapField = (config, routePath) => ({
  loc: routePath,
  changefreq: config.changefreq,
  priority: config.priority,
  lastmod: config.autoLastmod ? formatISO(Date.now()) : undefined,
  alternateRefs: config.alternateRefs ?? [],
  trailingSlash: config.trailingSlash,
});

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  appDir: true,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, routePath) => {
    const priority =
      routePath === '/'
        ? HOME_PAGE_PRIORITY
        : TOOL_PATHS.has(routePath)
          ? TOOL_PAGE_PRIORITY
          : config.priority;
    const sitemapField = buildSitemapField(config, routePath);

    return {
      ...sitemapField,
      priority,
    };
  },
};
