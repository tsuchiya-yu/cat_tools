/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('./src/types/tool').Tool[]} */
const tools = require('./src/constants/tools.json');

const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  throw new Error('SITE_URL is not set. Please configure SITE_URL or NEXT_PUBLIC_BASE_URL.');
}

const siteUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl.replace(/^\/\//, '')}`;
const toolPaths = new Set(tools.map((tool) => tool.href));

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  appDir: true,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, routePath) => {
    const priority = routePath === '/' ? 1 : toolPaths.has(routePath) ? 0.8 : config.priority;

    return {
      loc: routePath,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      changefreq: config.changefreq,
      priority,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: config.trailingSlash,
    };
  },
};
