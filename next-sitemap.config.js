/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/** @type {import('./src/types/tool').Tool[]} */
const tools = require('./src/constants/tools.json');

const baseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;

if (!baseUrl) {
  throw new Error('SITE_URL is not set. Please configure SITE_URL or NEXT_PUBLIC_BASE_URL.');
}

const siteUrl = baseUrl.startsWith('http') ? baseUrl : `https://${baseUrl.replace(/^\/\//, '')}`;
const toolPaths = new Set(tools.map((tool) => tool.href));
const buildTimestamp = new Date().toISOString();

const getLastmodForPath = (routePath) => {
  const normalizedPath = routePath !== '/' && routePath.endsWith('/') ? routePath.slice(0, -1) : routePath;
  const pagePath = normalizedPath === '/' ? 'src/app/page.tsx' : `src/app${normalizedPath}/page.tsx`;
  const absolutePath = path.resolve(__dirname, pagePath);

  if (!fs.existsSync(absolutePath)) {
    return buildTimestamp;
  }

  try {
    const gitLog = execSync(`git log -1 --format=%cI -- "${absolutePath}"`, {
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();

    return gitLog || buildTimestamp;
  } catch {
    return buildTimestamp;
  }
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  changefreq: 'monthly',
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, routePath) => {
    const priority = routePath === '/' ? 1 : toolPaths.has(routePath) ? 0.8 : config.priority;

    return {
      loc: routePath,
      lastmod: config.autoLastmod ? getLastmodForPath(routePath) : undefined,
      changefreq: config.changefreq,
      priority,
      alternateRefs: config.alternateRefs ?? [],
      trailingSlash: config.trailingSlash,
    };
  },
};
