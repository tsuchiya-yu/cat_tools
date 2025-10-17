import { test, expect } from '@playwright/test';

const PAGE = '/calculate-cat-feeding';

test.describe('猫の給餌量計算 E2E', () => {
  test('初期表示: 入力があり、結果は非表示、警告は出ない', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.locator('#kcalInput')).toBeVisible();
    await expect(page.locator('#densityInput')).toBeVisible();

    // 結果セクションは両入力が揃うまで表示しない
    await expect(page.locator('section[aria-live="polite"]')).toHaveCount(0);

    // 警告テキストは初期は空
    await expect(page.locator('#kcalWarn')).toHaveText('');
    await expect(page.locator('#densityWarn')).toHaveText('');
  });

  test('URLクエリ: kcal のみ指定で復元される（dは未入力）', async ({ page }) => {
    await page.goto(`${PAGE}?kcal=230`);

    await expect(page.locator('#kcalInput')).toHaveValue('230');
    await expect(page.locator('#densityInput')).toHaveValue('');

    // 結果はまだ非表示
    await expect(page.locator('section[aria-live="polite"]')).toHaveCount(0);
  });

  test('計算: kcal=230, d=390 → 1日59g（朝30/夜29）', async ({ page }) => {
    await page.goto(PAGE);

    await page.fill('#kcalInput', '230');
    await page.fill('#densityInput', '390');

    // 結果セクションが表示され、aria-liveが設定されている
    const resultSection = page.locator('section[aria-live="polite"]');
    await expect(resultSection).toHaveCount(1);

    await expect(page.locator('#dailyGram')).toHaveText('59');
    await expect(page.locator('#perMeal')).toHaveText('朝 30 g / 夜 29 g');

    // URLクエリに同期される
    await expect.poll(() => page.url()).toContain('kcal=230');
    await expect.poll(() => page.url()).toContain('d=390');

    // 共有ボタンが表示される
    await expect(page.locator('#shareBtn')).toBeVisible();
  });

  test('入力を消すとプレースホルダに戻り、結果セクションは非表示', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#kcalInput', '230');
    await page.fill('#densityInput', '390');
    await expect(page.locator('section[aria-live="polite"]').first()).toBeVisible();

    // kcalをクリア
    await page.fill('#kcalInput', '');
    // 非表示に戻る
    await expect(page.locator('section[aria-live="polite"]')).toHaveCount(0);
  });

  test('範囲外の入力で注意文が出るが計算は実行される', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#kcalInput', '5'); // 推奨範囲外（小さすぎる）
    await page.fill('#densityInput', '500');

    // 警告表示（kcal側のみ）
    await expect(page.locator('#kcalWarn')).not.toHaveText('');
    await expect(page.locator('#densityWarn')).toHaveText('');

    // 結果は表示される（計算は実行）
    await expect(page.locator('section[aria-live="polite"]')).toHaveCount(1);
  });

  test('リンク: カロリー計算ページへの導線が存在', async ({ page }) => {
    await page.goto(PAGE);
    const link = page.locator('a[href="/calculate-cat-calorie"]');
    await expect(link).toBeVisible();
  });
});

