import { test, expect } from '@playwright/test';

test.describe('ナビゲーション', () => {
  test('ルートから猫年齢計算ページにリダイレクトされる', async ({ page }) => {
    // ルートページにアクセス
    await page.goto('/');
    
    // 猫年齢計算ページにリダイレクトされることを確認
    await page.waitForURL('/calculate-cat-age');
    expect(page.url()).toContain('/calculate-cat-age');
    
    // ページタイトルが正しいことを確認
    await expect(page.locator('h1')).toBeVisible();
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
    
    // 404ステータスまたは404ページが表示されることを確認
    expect(response?.status()).toBe(404);
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
