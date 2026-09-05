'use strict';

const fs = require('fs');
const path = require('path');
const {
  shouldIncludeGuideFixtures,
  getPublishedGuidesForSitemap,
} = require('../src/lib/guides/meta.cjs');

function fail(message) {
  console.error(`[verify-guides-sitemap] ${message}`);
  process.exit(1);
}

function readSitemapXml() {
  const candidates = [
    path.join(process.cwd(), 'public', 'sitemap-0.xml'),
    path.join(process.cwd(), 'public', 'sitemap.xml'),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return { filePath: candidate, xml: fs.readFileSync(candidate, 'utf8') };
    }
  }
  fail('sitemap XML not found under public/');
}

function extractUrlEntries(xml) {
  const entries = [];
  const urlBlocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
  for (const block of urlBlocks) {
    const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1];
    if (!loc) continue;
    entries.push({ loc, lastmod });
  }
  return entries;
}

function main() {
  const { filePath, xml } = readSitemapXml();
  const entries = extractUrlEntries(xml);
  const byPath = new Map();

  for (const entry of entries) {
    let pathname;
    try {
      pathname = new URL(entry.loc).pathname.replace(/\/$/, '') || '/';
    } catch {
      fail(`invalid loc URL: ${entry.loc}`);
    }

    if (byPath.has(pathname)) {
      fail(`duplicate sitemap URL: ${pathname}`);
    }
    byPath.set(pathname, entry);
  }

  if (!byPath.has('/guides')) {
    fail('/guides is missing from sitemap');
  }

  const published = getPublishedGuidesForSitemap();
  for (const guide of published) {
    const routePath = `/guides/${guide.slug}`;
    const entry = byPath.get(routePath);
    if (!entry) {
      fail(`published guide missing from sitemap: ${routePath}`);
    }
    const expectedLastmod = `${guide.updatedAt}T00:00:00.000Z`;
    if (entry.lastmod !== expectedLastmod) {
      fail(
        `unexpected lastmod for ${routePath}: got ${entry.lastmod}, expected ${expectedLastmod}`,
      );
    }
  }

  if (byPath.has('/guides/mdx-foundation-draft')) {
    fail('draft guide must not appear in sitemap');
  }

  if (!shouldIncludeGuideFixtures()) {
    for (const slug of ['mdx-foundation-sample', 'mdx-foundation-related', 'mdx-foundation-draft']) {
      if (byPath.has(`/guides/${slug}`)) {
        fail(`fixture slug leaked into production sitemap: /guides/${slug}`);
      }
    }
  }

  console.log(
    `[verify-guides-sitemap] ok (${path.basename(filePath)}, guides=${published.length}, fixtures=${shouldIncludeGuideFixtures()})`,
  );
}

main();
