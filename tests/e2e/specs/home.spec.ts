import { test, expect } from '@playwright/test';

test.describe('Home (/)', () => {
  test('ヒーローと2つのカードが表示される（順序: 年齢→カロリー）', async ({ page }) => {
    await page.goto('/');

    // h1: タイトル
    await expect(page.locator('main h1')).toHaveText('ねこツールズ');

    // h2: カード見出し（順序を確認）
    const h2 = page.locator('main h2');
    await expect(h2).toHaveCount(2);
    await expect(h2.nth(0)).toHaveText('猫の年齢計算');
    await expect(h2.nth(1)).toHaveText('猫のカロリー計算');
  });

  test('カードはキーボード操作で遷移できる（Tab/Enter相当）', async ({ page }) => {
    await page.goto('/');

    // 1枚目（年齢計算）
    await page.getByRole('link', { name: '猫の年齢計算ツールを開く' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/calculate-cat-age$/);

    // 2枚目（カロリー計算）
    await page.goto('/');
    await page.getByRole('link', { name: '猫のカロリー計算ツールを開く' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/calculate-cat-calorie$/);
  });

  test('見出し階層: h1→h2 の降順', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('main h2')).toHaveCount(2);
  });
});

