const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cat-tools.catnote.tokyo';
const siteUrl = /^https?:\/\//.test(baseUrl) ? baseUrl : `https://${baseUrl}`;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    const overrides = {
      '/': { priority: 1 },
      '/calculate-cat-age': { priority: 0.8 },
      '/calculate-cat-calorie': { priority: 0.8 },
      '/calculate-cat-feeding': { priority: 0.8 },
      '/cat-food-safety': { priority: 0.8 },
    };

    const override = overrides[path];

    return {
      loc: path,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      changefreq: config.changefreq,
      priority: override?.priority ?? config.priority,
    };
  },
};
