const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cat-tools.catnote.tokyo';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: false,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
};
