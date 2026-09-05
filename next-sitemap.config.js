const { formatISO } = require('date-fns');
/** @type {import('./src/types/tool').Tool[]} */
const TOOLS = require('./src/constants/tools.json');
const {
  getPublishedGuidesForSitemap,
} = require('./src/lib/guides/meta.cjs');

const BUILD_DATE = formatISO(new Date());

const BASE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!BASE_URL) {
  throw new Error('SITE_URL is not set. Please configure SITE_URL or NEXT_PUBLIC_BASE_URL.');
}

let url;
try {
  url = new URL(
    BASE_URL.startsWith('http') ? BASE_URL : `https://${BASE_URL.replace(/^\/\//, '')}`
  );
} catch {
  throw new Error(
    `Invalid URL provided for SITE_URL or NEXT_PUBLIC_BASE_URL: "${BASE_URL}". It should be a valid domain or full URL.`
  );
}
url.protocol = 'https:';
const SITE_URL = url.href.replace(/\/$/, '');
const TOOL_PATHS = new Set(TOOLS.map((tool) => tool.href));
const CORE_PATHS = ['/', ...TOOLS.map((tool) => tool.href)];
const HOME_PAGE_PRIORITY = 1;
const TOOL_PAGE_PRIORITY = 0.8;
const GUIDES_INDEX_PATH = '/guides';

const publishedGuides = getPublishedGuidesForSitemap();
const GUIDE_LASTMOD_BY_PATH = new Map(
  publishedGuides.map((guide) => [
    `/guides/${guide.slug}`,
    `${guide.updatedAt}T00:00:00.000Z`,
  ]),
);

const buildSitemapField = (config, routePath, priority, lastmod = BUILD_DATE) => ({
  loc: `${SITE_URL}${routePath}`,
  changefreq: config.changefreq,
  priority,
  lastmod: config.autoLastmod ? lastmod : undefined,
  alternateRefs: config.alternateRefs ?? [],
  trailingSlash: config.trailingSlash,
});

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  appDir: true,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, routePath) => {
    if (GUIDE_LASTMOD_BY_PATH.has(routePath)) {
      // App Router が拾ったガイド記事は frontmatter updatedAt を使う
      return buildSitemapField(
        config,
        routePath,
        config.priority,
        GUIDE_LASTMOD_BY_PATH.get(routePath),
      );
    }

    const priority =
      routePath === '/'
        ? HOME_PAGE_PRIORITY
        : TOOL_PATHS.has(routePath)
          ? TOOL_PAGE_PRIORITY
          : config.priority;
    return buildSitemapField(config, routePath, priority);
  },
  additionalPaths: async (config) => {
    const guideIndexField = await buildSitemapField(config, GUIDES_INDEX_PATH, config.priority);
    const guideArticleFields = publishedGuides.map((guide) =>
      buildSitemapField(
        config,
        `/guides/${guide.slug}`,
        config.priority,
        `${guide.updatedAt}T00:00:00.000Z`,
      ),
    );

    const fields = await Promise.all([
      ...CORE_PATHS.map((routePath) => config.transform(config, routePath)),
      Promise.resolve(guideIndexField),
      ...guideArticleFields.map((field) => Promise.resolve(field)),
    ]);
    return fields.filter(Boolean);
  },
};
