import { test, expect } from '@playwright/test';

const SITE_URL = 'https://cat-tools.catnote.tokyo';
const SLUG = 'cat-food-amount';
const TITLE = '猫のご飯の量は1日何グラム？体重別早見表と適量の計算方法';

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

test.describe('猫のご飯量ガイド (/guides/cat-food-amount)', () => {
  test('/guides 一覧から記事へ遷移できる', async ({ page }) => {
    await page.goto('/guides');
    await expect(page.getByRole('heading', { level: 1, name: 'ガイド・読みもの' })).toBeVisible();
    await page.getByRole('link', { name: new RegExp(TITLE) }).click();
    await expect(page).toHaveURL(new RegExp(`/guides/${SLUG}$`));
    await expect(page.locator('main h1')).toHaveText(TITLE);
  });

  test('内部リンク・relatedTools・References が表示される', async ({ page }) => {
    await page.goto(`/guides/${SLUG}`);

    await expect(
      page.getByRole('link', { name: '→ 猫のカロリー計算で必要カロリーを確認する' }),
    ).toHaveAttribute('href', '/calculate-cat-calorie');
    await expect(
      page.getByRole('link', { name: '→ 猫の給餌量計算で実際のグラム数を確認する' }),
    ).toHaveAttribute('href', '/calculate-cat-feeding');
    await expect(
      page.getByRole('article').getByRole('link', { name: '猫の食事管理ガイド' }),
    ).toHaveAttribute('href', '/cat-meal-management');

    const relatedTools = page.locator('#related-tools-title').locator('..');
    await expect(relatedTools.getByRole('link', { name: '猫のカロリー計算ツールを開く' })).toBeVisible();
    await expect(relatedTools.getByRole('link', { name: '猫の給餌量計算ツールを開く' })).toBeVisible();

    await expect(page.getByRole('heading', { name: '参考情報' })).toBeVisible();
    await expect(page.getByRole('link', { name: /WSAVA/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /AAHA Nutrition and Weight Management/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Feline Life Stage Guidelines/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /AAFCO/ })).toBeVisible();
  });

  test('metadata / Article JSON-LD / BreadcrumbList が正しい', async ({ page }) => {
    await page.goto(`/guides/${SLUG}`);

    await expect(page).toHaveTitle(new RegExp(TITLE));
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `${SITE_URL}/guides/${SLUG}`,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );

    const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    await expect(breadcrumb).toContainText('ホーム');
    await expect(breadcrumb).toContainText('ガイド・読みもの');
    await expect(breadcrumb).toContainText(TITLE);

    const jsonLd = await readJsonLd(page);
    const article = jsonLd.find((item) => item['@type'] === 'Article');
    const breadcrumbList = jsonLd.find((item) => item['@type'] === 'BreadcrumbList');

    expect(article).toMatchObject({
      headline: TITLE,
      datePublished: '2026-09-04',
      dateModified: '2026-09-04',
    });

    const elements = breadcrumbList?.itemListElement as Array<{ name: string }> | undefined;
    expect(elements?.map((item) => item.name)).toEqual([
      'ねこツールズ',
      'ガイド・読みもの',
      TITLE,
    ]);
  });

  test('モバイルで早見表がレイアウトを破壊しない', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile project only');

    await page.goto(`/guides/${SLUG}`);
    await expect(page.getByText('約200〜210kcal')).toBeVisible();
    await expect(page.getByText('9段階BCS')).toBeVisible();

    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = page.viewportSize()?.width ?? 0;
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
});
