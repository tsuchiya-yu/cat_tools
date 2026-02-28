import { test, expect } from '@playwright/test';

test.describe('ナビゲーション', () => {
  test('ルートページが表示されリンクで年齢計算へ遷移できる', async ({ page }) => {
    // ルートページにアクセスし、ホームのUIが表示される
    await page.goto('/');
    await expect(page.locator('main h1')).toHaveText('ねこツールズ');
    const h2 = page.locator('main h2');
    await expect(h2).toHaveCount(5);
    await expect(h2.nth(0)).toHaveText('猫の食べ物安全性チェック');
    await expect(h2.nth(1)).toHaveText('猫の年齢計算');
    await expect(h2.nth(2)).toHaveText('猫のカロリー計算');
    await expect(h2.nth(3)).toHaveText('猫の給餌量計算');
    await expect(h2.nth(4)).toHaveText('猫の必要給水量計算');

    // 年齢計算カードのリンクで遷移できる
    await page.getByRole('link', { name: '猫の年齢計算ツールを開く' }).click();
    await expect(page).toHaveURL(/\/calculate-cat-age$/);
    await expect(page.locator('h1')).toContainText('猫の年齢');
  });

  test('直接猫年齢計算ページにアクセスできる', async ({ page }) => {
    // 直接ページにアクセス
    await page.goto('/calculate-cat-age');
    
    // ページが正しく表示されることを確認
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#dob')).toBeVisible();
  });

  test('存在しないページで404が表示される', async ({ page }) => {
    // 存在しないページにアクセス
    const response = await page.goto('/non-existent-page');
    
    // 404ステータスと404ページが表示されることを確認
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('404');
  });

  test('ページのメタ情報が正しく設定されている', async ({ page }) => {
    await page.goto('/calculate-cat-age');
    
    // ページタイトルの確認
    const title = await page.title();
    expect(title).toContain('猫');
    
    // メタデスクリプションの確認（存在する場合）
    const metaDescription = page.locator('meta[name="description"]');
    if (await metaDescription.count() > 0) {
      const description = await metaDescription.getAttribute('content');
      expect(description).toBeTruthy();
    }
  });
});
