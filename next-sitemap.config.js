const TOOLS = (() => {
  const tools = require('./src/constants/tools.json');

  if (
    !Array.isArray(tools) ||
    !tools.every((tool) => tool && typeof tool.href === 'string')
  ) {
    throw new Error(
      'Invalid structure in src/constants/tools.json. It must be an array of objects with an href string property.'
    );
  }

  return tools;
})();

const BASE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error('SITE_URL is not set. Please configure SITE_URL or NEXT_PUBLIC_BASE_URL.');
}

const siteUrl = (
  BASE_URL.startsWith('http') ? BASE_URL : `https://${BASE_URL.replace(/^\/\//, '')}`
).replace(/\/$/, '');
const TOOL_PATHS = new Set(TOOLS.map((tool) => tool.href));
const HOME_PAGE_PRIORITY = 1;
const TOOL_PAGE_PRIORITY = 0.8;
const { defaultSitemapTransformer } = require('next-sitemap/dist/cjs/utils/defaults.js');

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
    const sitemapField = await defaultSitemapTransformer(config, routePath);

    return {
      ...sitemapField,
      priority,
    };
  },
};
