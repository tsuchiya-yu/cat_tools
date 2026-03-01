import { test, expect } from '@playwright/test';

test.describe('猫の食べ物安全性チェック', () => {
  test('本文セクションと出典情報が指定順で表示される', async ({ page }) => {
    await page.goto('/cat-food-safety');

    const expectedHeadings = [
      '猫が危険な食べ物を口にしたかもしれないときの対応',
      '猫に絶対に与えないでほしい食材',
      '猫に与えるときに注意が必要な食材',
      '食べ物以外で猫が口にしやすい危険物',
      '判定基準とこのページの使い方',
      '出典',
    ] as const;

    for (const heading of expectedHeadings) {
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    }

    await expect(page.getByText('自己判断で吐かせない')).toBeVisible();
    await expect(page.getByText('ネギ類は加熱しても危険')).toBeVisible();
    await expect(page.getByText('人間向け味付け・加工食品は別問題')).toBeVisible();
    const h2Texts = await page.locator('main h2').allTextContents();
    const faqIndex = h2Texts.indexOf('よくある質問');
    const guideIndex = h2Texts.indexOf('このツールでできること');

    for (const heading of expectedHeadings) {
      const currentIndex = h2Texts.indexOf(heading);
      expect(currentIndex).toBeGreaterThan(-1);
      expect(currentIndex).toBeLessThan(faqIndex);
      expect(currentIndex).toBeLessThan(guideIndex);
    }

    await expect(page.getByRole('heading', { level: 3, name: '危険・注意が必要な食べ物の参考' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 3, name: '誤食時の対応の参考' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: /環境省: 飼い主のためのペットフード・ガイドライン/ })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /FDA: Potentially Dangerous Items for Your Pet/ })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /ASPCA: People Foods to Avoid Feeding Your Pets/ })
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: /ASPCA: What to Do if Your Pet Is Poisoned/ })
    ).toBeVisible();
    await expect(page.locator('a[href=\"https://www.aspca.org/pet-care/aspca-poison-control\"]')).toHaveCount(0);
    await expect(
      page.locator('a[href=\"https://www.maff.go.jp/j/syouan/tikusui/petfood/index.html\"]')
    ).toHaveCount(0);
    await expect(
      page.locator('a[href=\"https://www.merckvetmanual.com/special-pet-topics/poisoning/introduction-to-poisoning\"]')
    ).toHaveCount(0);
    await expect(
      page.locator('a[href=\"https://www.fda.gov/animal-veterinary/animal-health-literacy/healthy-habits-feeding-your-pet\"]')
    ).toHaveCount(0);
    await expect(
      page.getByText(
        '本コンテンツは一般的な情報提供であり、診断・治療を行うものではありません。体調不良や判断に迷う症状がある場合は、獣医師の診察を受けてください。'
      )
    ).toBeVisible();
  });

  test('既知の危険食材を検索できる', async ({ page }) => {
    await page.goto('/cat-food-safety');

    await expect(page.getByRole('heading', { name: '猫の食べ物安全性チェック' })).toBeVisible();

    const searchButton = page.getByRole('button', { name: '安全性を調べる' });
    await expect(searchButton).toBeEnabled();

    await page.getByLabel('食材名').fill('玉ねぎ');
    await searchButton.click();

    const firstResult = page.locator('article').first();
    await expect(firstResult.getByRole('heading', { name: '玉ねぎ', exact: true })).toBeVisible();
    await expect(firstResult.getByText('●危険', { exact: true })).toBeVisible();
  });

  test('データにない食材では未検出メッセージを表示する', async ({ page }) => {
    await page.goto('/cat-food-safety');

    const searchButton = page.getByRole('button', { name: '安全性を調べる' });
    await expect(searchButton).toBeEnabled();

    const keyword = 'テスト用食材';
    await page.getByLabel('食材名').fill(keyword);
    await searchButton.click();

    await expect(page.getByText(`「${keyword}」に該当するデータは見つかりませんでした。`)).toBeVisible();
  });

  test('URLのfoodクエリに応じて結果が同期される', async ({ page }) => {
    await page.goto('/cat-food-safety?food=玉ねぎ');
    const firstResult = page.locator('article').first();
    await expect(firstResult.getByRole('heading', { name: '玉ねぎ', exact: true })).toBeVisible();

    await page.goto('/cat-food-safety?food=コーヒー');
    await expect(page.locator('article').first().getByRole('heading', { name: 'コーヒー・紅茶・緑茶', exact: true })).toBeVisible();

    await page.goBack();
    await expect(firstResult.getByRole('heading', { name: '玉ねぎ', exact: true })).toBeVisible();
  });
});
