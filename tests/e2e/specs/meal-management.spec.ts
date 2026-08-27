import { test, expect } from '@playwright/test';

const SITE_URL = 'https://cat-tools.catnote.tokyo';

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

test.describe('猫の食事管理ガイド (/cat-meal-management)', () => {
  test('初期HTMLにH1と主要3リンクが含まれる', async ({ request }) => {
    const response = await request.get('/cat-meal-management');
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    expect(html).toContain('猫の食事管理ガイド');
    expect(html).toContain('href="/calculate-cat-calorie"');
    expect(html).toContain('href="/calculate-cat-feeding"');
    expect(html).toContain('href="/calculate-cat-water-intake"');
    expect(html).toContain('実際に3つのツールを使うときの流れ');
    expect(html).toContain('参考情報');
  });

  test('ページが正しく表示され、h1と3つの主要カードが存在する', async ({ page }) => {
    await page.goto('/cat-meal-management');

    // H1の確認
    const h1 = page.locator('main h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('猫の食事管理ガイド');

    // パンくずの確認
    const breadcrumb = page.locator('nav[aria-label="breadcrumb"]');
    await expect(breadcrumb).toBeVisible();
    await expect(breadcrumb).toContainText('ホーム');
    await expect(breadcrumb).toContainText('猫の食事管理ガイド');

    // 3つの主要カードリンク
    const calorieCard = page.getByRole('link', { name: /1日に必要なカロリーを知りたい/ });
    const feedingCard = page.getByRole('link', { name: /フードを何g与えればよいか知りたい/ });
    const waterCard = page.getByRole('link', { name: /必要水分量の目安を知りたい/ });

    await expect(calorieCard).toBeVisible();
    await expect(feedingCard).toBeVisible();
    await expect(waterCard).toBeVisible();

    await expect(calorieCard).toHaveAttribute('href', '/calculate-cat-calorie');
    await expect(feedingCard).toHaveAttribute('href', '/calculate-cat-feeding');
    await expect(waterCard).toHaveAttribute('href', '/calculate-cat-water-intake');
  });

  test('メタデータ、canonical、OGP、Twitterカードが正しく出力される', async ({ page }) => {
    await page.goto('/cat-meal-management');

    // Title & Description
    await expect(page).toHaveTitle(
      '猫の食事管理ガイド｜カロリー・給餌量・水分量の使い分け | ねこツールズ',
    );
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute(
      'content',
      '猫の食事管理で確認したい必要カロリー・給餌量・水分量の違いと、ねこツールズ内の計算ツールを使う順番を案内します。',
    );

    // Canonical
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', `${SITE_URL}/cat-meal-management`);

    // OpenGraph
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      '猫の食事管理ガイド｜カロリー・給餌量・水分量の使い分け',
    );
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content',
      '猫の食事管理で確認したい必要カロリー・給餌量・水分量の違いと、ねこツールズ内の計算ツールを使う順番を案内します。',
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      `${SITE_URL}/cat-meal-management`,
    );

    // Twitter
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content',
      '猫の食事管理ガイド｜カロリー・給餌量・水分量の使い分け',
    );
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content',
      '猫の食事管理で確認したい必要カロリー・給餌量・水分量の違いと、ねこツールズ内の計算ツールを使う順番を案内します。',
    );

    // noindex が設定されていないこと
    const robots = page.locator('meta[name="robots"]');
    if (await robots.count() > 0) {
      const content = await robots.getAttribute('content');
      expect(content).not.toContain('noindex');
    }
  });

  test('BreadcrumbList JSON-LDが出力され、FAQPage JSON-LDは含まれない', async ({ page }) => {
    await page.goto('/cat-meal-management');

    const jsonLdScripts = page.locator('script[type="application/ld+json"]');
    const rawTexts = await jsonLdScripts.allTextContents();
    const allObjects = rawTexts.flatMap((text) => flattenJsonLd(JSON.parse(text)));

    const breadcrumbList = allObjects.find((item) => item['@type'] === 'BreadcrumbList');
    expect(breadcrumbList).toBeDefined();

    const items = breadcrumbList?.itemListElement as Array<{
      position: number;
      name: string;
      item: string;
    }>;
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[0].item).toBe(`${SITE_URL}/`);
    expect(items[1].position).toBe(2);
    expect(items[1].name).toBe('猫の食事管理ガイド');
    expect(items[1].item).toBe(`${SITE_URL}/cat-meal-management`);

    const faqPage = allObjects.find((item) => item['@type'] === 'FAQPage');
    expect(faqPage).toBeUndefined();
  });

  test('補助リンク（年齢・食べ物安全性・サイトについて）が表示され遷移可能', async ({ page }) => {
    await page.goto('/cat-meal-management');

    const ageAuxLink = page.locator('main a[href="/calculate-cat-age"]');
    const safetyAuxLink = page.locator('main a[href="/cat-food-safety"]');
    const aboutAuxLink = page.locator('main a[href="/about"]');

    await expect(ageAuxLink).toHaveAttribute('href', '/calculate-cat-age');
    await expect(safetyAuxLink).toHaveAttribute('href', '/cat-food-safety');
    await expect(aboutAuxLink).toHaveAttribute('href', '/about');
  });

  test('具体的な利用例と代表的な参考情報が表示される', async ({ page }) => {
    await page.goto('/cat-meal-management');

    const exampleSection = page.locator('section[aria-labelledby="usage-example-title"]');
    await expect(
      exampleSection.getByRole('heading', { name: '実際に3つのツールを使うときの流れ' }),
    ).toBeVisible();
    await expect(exampleSection).toContainText('4kg・去勢済みの成猫');
    await expect(exampleSection.getByRole('listitem')).toHaveCount(6);

    const referencesSection = page.locator('section[aria-labelledby="references-title"]');
    await expect(referencesSection.getByRole('heading', { name: '参考情報' })).toBeVisible();
    await expect(
      referencesSection.getByRole('link', { name: /Merck Veterinary Manual/ }),
    ).toBeVisible();
    await expect(
      referencesSection.getByRole('link', { name: /Pet Nutrition Alliance/ }),
    ).toBeVisible();
    await expect(
      referencesSection.getByRole('link', { name: /AAHA Nutrition and Weight Management Guidelines/ }),
    ).toBeVisible();
  });

  test('主要カードからカロリー計算ページへ遷移できる', async ({ page }) => {
    await page.goto('/cat-meal-management');
    const calorieCard = page.getByRole('link', { name: /1日に必要なカロリーを知りたい/ });
    await calorieCard.click();
    await expect(page).toHaveURL(/\/calculate-cat-calorie$/);
  });
});

test.describe('トップページおよび計算機からの食事管理ガイド導線', () => {
  test('トップページのツール一覧外にガイド・読みものセクションが存在し遷移できる', async ({ page }) => {
    await page.goto('/');

    const toolsSection = page.locator('section[aria-label="ツール一覧"]');
    const guideHeading = page.locator('main').getByRole('heading', {
      name: 'ガイド・読みもの',
      level: 2,
    });
    await expect(guideHeading).toBeVisible();

    // ツール一覧の外にあること
    await expect(toolsSection.getByRole('link', { name: '猫の食事管理ガイドを読む' })).toHaveCount(0);

    const guideLink = page.getByRole('link', { name: '猫の食事管理ガイドを読む' });
    await expect(guideLink).toHaveAttribute('href', '/cat-meal-management');
    await guideLink.click();
    await expect(page).toHaveURL(/\/cat-meal-management$/);
  });

  test('トップページの初期HTMLにツール一覧と分離したガイドリンクが含まれる', async ({ request }) => {
    const response = await request.get('/');
    expect(response.ok()).toBeTruthy();

    const html = await response.text();
    expect(html).toContain('ガイド・読みもの');
    expect(html).toContain('href="/cat-meal-management"');
  });

  test('フッターにガイド・読みものカテゴリと食事管理ガイドへのリンクが存在する', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer.getByRole('heading', { name: 'ガイド・読みもの' })).toBeVisible();
    await expect(footer.getByRole('link', { name: '猫の食事管理ガイド' })).toHaveAttribute(
      'href',
      '/cat-meal-management',
    );
  });

  test('カロリー計算ページから食事管理ガイドへの文脈リンクが存在する', async ({ page }) => {
    await page.goto('/calculate-cat-calorie');
    const guideLink = page.locator('main').getByRole('link', { name: '猫の食事管理ガイド' });
    await expect(guideLink).toBeVisible();
    await expect(guideLink).toHaveAttribute('href', '/cat-meal-management');
  });

  test('給餌量計算ページから食事管理ガイドへの文脈リンクが存在する', async ({ page }) => {
    await page.goto('/calculate-cat-feeding');
    const guideLink = page.locator('main').getByRole('link', { name: '猫の食事管理ガイド' });
    await expect(guideLink).toBeVisible();
    await expect(guideLink).toHaveAttribute('href', '/cat-meal-management');
  });

  test('給水量計算ページから食事管理ガイドへの文脈リンクが存在する', async ({ page }) => {
    await page.goto('/calculate-cat-water-intake');
    const guideLink = page.locator('main').getByRole('link', { name: '猫の食事管理ガイド' });
    await expect(guideLink).toBeVisible();
    await expect(guideLink).toHaveAttribute('href', '/cat-meal-management');
  });
});
