/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('./src/types/tool').Tool[]} */
const TOOLS = require('./src/constants/tools.json');

const BASE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error('SITE_URL is not set. Please configure SITE_URL or NEXT_PUBLIC_BASE_URL.');
}

const siteUrl = BASE_URL.startsWith('http')
  ? BASE_URL
  : `https://${BASE_URL.replace(/^\/\//, '')}`;
const TOOL_PATHS = new Set(TOOLS.map((tool) => tool.href));

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  appDir: true,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, routePath, lastmod) => {
    const priority = routePath === '/' ? 1 : TOOL_PATHS.has(routePath) ? 0.8 : config.priority;

    return {
      loc: routePath,
      lastmod,
      changefreq: config.changefreq,
      priority,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: config.trailingSlash,
    };
  },
};
