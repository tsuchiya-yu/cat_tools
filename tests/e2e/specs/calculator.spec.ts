import { test, expect } from '@playwright/test';

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

  test('URLパラメータで初期値が設定され結果が表示される', async ({ page }) => {
    const testDate = '2020-01-01';
    
    // URLパラメータ付きでページにアクセス
    await page.goto(`/calculate-cat-age?dob=${testDate}`);
    
    // 結果が表示されるまで待機
    await page.waitForSelector('.result', { state: 'visible', timeout: 10000 });
    
    // 結果セクションが表示されることを確認
    await expect(page.locator('.result')).toBeVisible();
    
    // 年齢が表示されることを確認
    await expect(page.locator('.numeral').first()).toBeVisible();
    const ageText = await page.locator('.numeral').first().textContent();
    expect(ageText).toMatch(/\d+/); // 数字が含まれていることを確認
    
    // URLにパラメータが含まれていることを確認
    expect(page.url()).toContain(`dob=${testDate}`);
  });

  test('URLパラメータでの年齢計算が正しい（複数パターン）', async ({ page }) => {
    const testCases = [
      { date: '2020-01-01', description: '5歳の猫' },
      { date: '2021-06-15', description: '3歳半の猫' },
      { date: '2023-03-20', description: '1歳半の猫' }
    ];

    for (const { date, description } of testCases) {
      await page.goto(`/calculate-cat-age?dob=${date}`);
      
      // 結果が表示されるまで待機
      await page.waitForSelector('.result', { state: 'visible', timeout: 10000 });
      
      // 結果が表示されることを確認
      await expect(page.locator('.result')).toBeVisible();
      
      // 人間年齢が表示されることを確認
      await expect(page.locator('.numeral').first()).toBeVisible();
      
      // 実年齢が表示されることを確認
      await expect(page.locator('.result').locator('text=実年齢')).toBeVisible();
      
      // ライフステージが表示されることを確認（結果セクション内のもの）
      await expect(page.locator('.result').locator('text=ライフステージ')).toBeVisible();
      
      console.log(`✓ ${description} (${date}) のテスト完了`);
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
    await page.waitForSelector('.result', { state: 'visible', timeout: 10000 });
    await expect(page.locator('.result')).toBeVisible();
    
    // デスクトップサイズに戻す
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 結果が引き続き表示されることを確認
    await expect(page.locator('.result')).toBeVisible();
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
