import { test, expect } from '@playwright/test';

test.describe('Home (/)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('ヒーローと3つのカードが表示される（順序: 年齢→カロリー→給餌量）', async ({ page }) => {
    // h1: タイトル
    await expect(page.locator('main h1')).toHaveText('ねこツールズ');

    // h2: カード見出し（順序を確認）
    const h2 = page.locator('main h2');
    await expect(h2).toHaveCount(3);
    await expect(h2.nth(0)).toHaveText('猫の年齢計算');
    await expect(h2.nth(1)).toHaveText('猫のカロリー計算');
    await expect(h2.nth(2)).toHaveText('猫の給餌量計算');
  });

  test('年齢計算カードはキーボード操作で遷移できる', async ({ page }) => {
    await page.getByRole('link', { name: '猫の年齢計算ツールを開く' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/calculate-cat-age$/);
  });

  test('カロリー計算カードはキーボード操作で遷移できる', async ({ page }) => {
    await page.getByRole('link', { name: '猫のカロリー計算ツールを開く' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/calculate-cat-calorie$/);
  });

  test('見出し階層: h1→h2 の降順', async ({ page }) => {
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h2')).toHaveCount(3);
  });
});
