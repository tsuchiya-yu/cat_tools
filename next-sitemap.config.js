const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://cat-tools.catnote.tokyo';
const siteUrl = /^https?:\/\//.test(baseUrl) ? baseUrl : `https://${baseUrl}`;

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
};
