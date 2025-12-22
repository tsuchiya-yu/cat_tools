/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * @typedef {{ href: string; ariaLabel: string; title: string; description: string; }} Tool
 * @type {Tool[]}
 */
const tools = require('./src/constants/tools.json');
const { defaultSitemapTransformer } = require('next-sitemap/dist/cjs/utils/defaults.js');

const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  throw new Error('SITE_URL is not set. Please configure SITE_URL or NEXT_PUBLIC_BASE_URL.');
}

const siteUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl.replace(/^\/\//, '')}`;
const toolPaths = new Set(tools.map((tool) => tool.href));

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    const defaultEntry = await defaultSitemapTransformer(config, path);
    if (!defaultEntry) {
      return defaultEntry;
    }

    const priority = path === '/' ? 1 : toolPaths.has(path) ? 0.8 : defaultEntry.priority;

    return {
      ...defaultEntry,
      priority,
    };
  },
};
