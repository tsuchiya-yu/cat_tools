const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cat-tools.catnote.tokyo';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: false,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, path) => {
    const lastmod = new Date().toISOString();
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
      lastmod,
      changefreq: 'monthly',
      priority: override?.priority ?? config.priority,
    };
  },
};
