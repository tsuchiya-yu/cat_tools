import { test, expect } from '@playwright/test';

test.describe('猫の食べ物安全性チェック', () => {
  test('既知の危険食材を検索できる', async ({ page }) => {
    await page.goto('/cat-food-safety');

    await expect(page.getByRole('heading', { name: '猫の食べ物安全性チェック' })).toBeVisible();

    await page.getByLabel('食材名').fill('玉ねぎ');
    await page.getByRole('button', { name: '安全性を調べる' }).click();

    const firstResult = page.locator('article').first();
    await expect(firstResult.getByRole('heading', { name: '玉ねぎ', exact: true })).toBeVisible();
    await expect(firstResult.getByText('●危険', { exact: true })).toBeVisible();
  });

  test('データにない食材では未検出メッセージを表示する', async ({ page }) => {
    await page.goto('/cat-food-safety');

    const keyword = 'テスト用食材';
    await page.getByLabel('食材名').fill(keyword);
    await page.getByRole('button', { name: '安全性を調べる' }).click();

    await expect(page.getByText(`「${keyword}」に該当するデータは見つかりませんでした。`)).toBeVisible();
  });

  test('URLのfoodクエリに応じて結果が同期される', async ({ page }) => {
    await page.goto('/cat-food-safety?food=玉ねぎ');
    const firstResult = page.locator('article').first();
    await expect(firstResult.getByRole('heading', { name: '玉ねぎ', exact: true })).toBeVisible();

    await page.goto('/cat-food-safety?food=コーヒー');
    await expect(page.locator('article').first().getByText(/コーヒー/)).toBeVisible();

    await page.goBack();
    await expect(firstResult.getByRole('heading', { name: '玉ねぎ', exact: true })).toBeVisible();
  });
});
