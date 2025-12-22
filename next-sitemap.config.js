const tools = require('./src/constants/tools.json');

const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://cat-tools.catnote.tokyo';
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
    const priority = path === '/' ? 1 : toolPaths.has(path) ? 0.8 : config.priority;

    return {
      loc: path,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      changefreq: config.changefreq,
      priority,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: config.trailingSlash,
    };
  },
};
