import { test, expect } from '@playwright/test';

const SITE_URL = 'https://cat-tools.catnote.tokyo';
const SAMPLE_SLUG = 'mdx-foundation-sample';

type JsonLdObject = Record<string, unknown>;

function flattenJsonLd(payload: unknown): JsonLdObject[] {
  if (Array.isArray(payload)) {
    return payload.flatMap(flattenJsonLd);
  }
  if (payload && typeof payload === 'object') {
    return [payload as JsonLdObject];
  }
  return [];
}

async function readJsonLd(page: import('@playwright/test').Page) {
  const scripts = page.locator('script[type="application/ld+json"]');
  const count = await scripts.count();
  const items: JsonLdObject[] = [];
  for (let i = 0; i < count; i += 1) {
    const raw = await scripts.nth(i).textContent();
    if (!raw) continue;
    items.push(...flattenJsonLd(JSON.parse(raw)));
  }
  return items;
}

test.describe('ガイド基盤 (/guides)', () => {
  test('ホームから /guides → fixture 記事 → related tool へ遷移できる', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'すべてのガイドを見る' }).click();
    await expect(page).toHaveURL(/\/guides$/);
    await expect(page.locator('main h1')).toHaveText('ガイド・読みもの');

    await page.getByRole('link', { name: /MDX基盤サンプル：表と関連ツールの確認/ }).click();
    await expect(page).toHaveURL(new RegExp(`/guides/${SAMPLE_SLUG}$`));
    await expect(page.locator('main h1')).toHaveText('MDX基盤サンプル：表と関連ツールの確認');

    await page.getByRole('link', { name: '猫の給餌量計算ツールを開く' }).click();
    await expect(page).toHaveURL(/\/calculate-cat-feeding$/);
  });

  test('不明 slug / draft slug は 404', async ({ request }) => {
    const missing = await request.get('/guides/does-not-exist');
    expect(missing.status()).toBe(404);

    const draft = await request.get('/guides/mdx-foundation-draft');
    expect(draft.status()).toBe(404);
  });

  test('記事 metadata / canonical / Article JSON-LD / 3階層 Breadcrumb がある', async ({
    page,
  }) => {
    await page.goto(`/guides/${SAMPLE_SLUG}`);

    await expect(page).toHaveTitle(/MDX基盤サンプル：表と関連ツールの確認/);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', `${SITE_URL}/guides/${SAMPLE_SLUG}`);

    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );

    const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    await expect(breadcrumb).toContainText('ホーム');
    await expect(breadcrumb).toContainText('ガイド・読みもの');
    await expect(breadcrumb).toContainText('MDX基盤サンプル：表と関連ツールの確認');

    const jsonLd = await readJsonLd(page);
    const article = jsonLd.find((item) => item['@type'] === 'Article');
    const breadcrumbList = jsonLd.find((item) => item['@type'] === 'BreadcrumbList');

    expect(article).toMatchObject({
      headline: 'MDX基盤サンプル：表と関連ツールの確認',
      datePublished: '2026-09-03',
      dateModified: '2026-09-04',
    });

    const elements = breadcrumbList?.itemListElement as Array<{ name: string }> | undefined;
    expect(elements?.map((item) => item.name)).toEqual([
      'ねこツールズ',
      'ガイド・読みもの',
      'MDX基盤サンプル：表と関連ツールの確認',
    ]);

    await expect(page.getByRole('heading', { name: '参考情報' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '関連ツール', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: '関連記事' })).toBeVisible();
  });

  test('モバイル viewport で table がレイアウトを破壊しない', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile project only');

    await page.goto(`/guides/${SAMPLE_SLUG}`);
    const tableWrapper = page.locator('.guide-prose .overflow-x-auto').first();
    await expect(tableWrapper).toBeVisible();

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 0;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});
