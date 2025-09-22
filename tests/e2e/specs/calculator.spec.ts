import { test, expect } from '@playwright/test';
import testData from '../fixtures/test-data.json';

const VISIBILITY_TIMEOUT = 10000;

test.describe('猫の年齢計算機', () => {
  test('ページが正しく表示される', async ({ page }) => {
    await page.goto('/calculate-cat-age');
    
    // タイトルとヘッダーの確認
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('h1')).toContainText('猫の年齢');
    
    // 説明文の確認
    await expect(page.locator('.lead')).toBeVisible();
    
    // 入力フィールドの確認
    await expect(page.locator('#dob')).toBeVisible();
  });

  test.describe('URLパラメータでの年齢計算が正しい（複数パターン）', () => {
      for (const { date, expectedHumanAge, description } of testData.validBirthDates) {
        test(description, async ({ page }) => {
          // テスト実行日を2025-01-01に固定
          await page.context().clock(new Date('2025-01-01T00:00:00'), ['Date']);

          // URLパラメータを使ってページにアクセス
          await page.goto(`/calculate-cat-age?dob=${date}`);
        
        // 結果が表示されるまで待機
        await expect(page.getByTestId('calculation-result')).toBeVisible({ timeout: VISIBILITY_TIMEOUT });
        
        // 人間年齢が正しいことを確認
        await expect(page.getByTestId('human-age-value')).toHaveText(String(expectedHumanAge));
        
        // 実年齢とライフステージが表示されることを確認
        await expect(page.getByTestId('calculation-result').locator('text=実年齢')).toBeVisible();
        await expect(page.getByTestId('calculation-result').locator('text=ライフステージ')).toBeVisible();
      });
    }
  });

  test('未来の日付でエラーが表示される', async ({ page }) => {
    const futureDate = '2030-01-01';
    
    // 未来の日付でアクセス
    await page.goto(`/calculate-cat-age?dob=${futureDate}`);
    
    // エラーメッセージが表示されるまで待機
    await page.waitForSelector('#error, .error', { state: 'visible', timeout: 5000 });
    
    // エラーメッセージの確認
    await expect(page.locator('#error, .error')).toBeVisible();
    await expect(page.locator('#error, .error')).toContainText('未来');
  });

  test('レスポンシブ表示の確認', async ({ page }) => {
    // モバイルサイズに変更
    await page.setViewportSize({ width: 375, height: 667 });
    
    // ページにアクセス
    await page.goto('/calculate-cat-age?dob=2020-01-01');
    
    // 基本要素が表示されることを確認
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#dob')).toBeVisible();
    
    // 結果が表示されることを確認
    await expect(page.getByTestId('calculation-result')).toBeVisible({ timeout: VISIBILITY_TIMEOUT });
    
    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 結果が引き続き表示されることを確認
    await expect(page.getByTestId('calculation-result')).toBeVisible();
  });

  test('ページのメタ情報が正しく設定されている', async ({ page }) => {
    await page.goto('/calculate-cat-age');
    
    // ページタイトルの確認
    const title = await page.title();
    expect(title).toContain('猫');
    
    // h1タグの確認
    await expect(page.locator('h1')).toContainText('猫の年齢');
  });
});
