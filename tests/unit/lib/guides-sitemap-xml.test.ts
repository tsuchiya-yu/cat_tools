import fs from 'fs';
import path from 'path';

/**
 * postbuild 後の sitemap XML を検証する。
 * `INCLUDE_GUIDE_FIXTURES=1 npm run build` 後に実行されることを想定。
 * XML が無い場合は skip（jest 単体実行時）。
 */
describe('generated guides sitemap XML', () => {
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap-0.xml');

  function readEntries() {
    const xml = fs.readFileSync(sitemapPath, 'utf8');
    const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) ?? [];
    return blocks.map((block) => {
      const loc = block.match(/<loc>(.*?)<\/loc>/)?.[1] ?? '';
      const lastmod = block.match(/<lastmod>(.*?)<\/lastmod>/)?.[1] ?? '';
      const pathname = new URL(loc).pathname.replace(/\/$/, '') || '/';
      return { pathname, lastmod };
    });
  }

  it('公開ガイド・/guides・updatedAt lastmod・draft不在・重複なしを満たす', () => {
    if (!fs.existsSync(sitemapPath)) {
      console.warn('skip: public/sitemap-0.xml not found (run INCLUDE_GUIDE_FIXTURES=1 npm run build)');
      return;
    }

    const entries = readEntries();
    const paths = entries.map((entry) => entry.pathname);
    const unique = new Set(paths);
    expect(unique.size).toBe(paths.length);

    expect(paths).toContain('/guides');
    expect(paths).not.toContain('/guides/mdx-foundation-draft');

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const meta = require('@/lib/guides/meta.cjs') as typeof import('@/lib/guides/meta.cjs');
    if (!meta.shouldIncludeGuideFixtures()) {
      expect(paths).not.toContain('/guides/mdx-foundation-sample');
      return;
    }

    expect(paths).toContain('/guides/mdx-foundation-sample');
    const sample = entries.find((entry) => entry.pathname === '/guides/mdx-foundation-sample');
    expect(sample?.lastmod).toBe('2026-09-04T00:00:00.000Z');
  });
});
