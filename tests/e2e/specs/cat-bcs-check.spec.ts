import { test, expect, type Page } from '@playwright/test';

const PAGE = '/cat-bcs-check';

async function answerQuestion(page: Page, questionKey: 'ribs' | 'waist' | 'abdomen', score: number) {
  await page.locator(`#${questionKey}-option-${score}`).check();
}

test.describe('猫の肥満度チェック（BCS） E2E', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('ページが表示され、導入・注意・触診ガイドがある', async ({ page }) => {
    await page.goto(PAGE);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: '猫の肥満度チェック｜BCS（ボディコンディションスコア）',
      }),
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: 'チェックの前に' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '触診のしかた' })).toBeVisible();
    await expect(page.locator('aside').getByText('プライモーディアルポーチ')).toBeVisible();
    await expect(page.getByRole('heading', { name: '5段階BCSの参考図' })).toBeVisible();
  });

  test('match 結果と回答内訳・関連ツール導線が表示される', async ({ page }) => {
    await page.goto(PAGE);

    await answerQuestion(page, 'ribs', 3);
    await answerQuestion(page, 'waist', 3);
    await answerQuestion(page, 'abdomen', 3);

    const result = page.getByTestId('bcs-result');
    await expect(result).toHaveAttribute('data-result-type', 'match');
    await expect(result).toContainText('5段階BCSの「3」に近い特徴が見られます');
    await expect(result).toContainText('理想的な体型の目安');
    await expect(result).toContainText('肋骨（触診）');
    await expect(result).toContainText('3');
    await expect(result).not.toContainText('BCS3と判定');
    await expect(result).not.toContainText('あなたの猫のBCSは');

    const guidance = page.getByRole('region', { name: '理想付近・境界付近の場合' });
    await expect(guidance.getByRole('link', { name: '猫のカロリー計算' })).toBeVisible();
    await expect(guidance.getByRole('link', { name: '猫の給餌量計算' })).toBeVisible();
  });

  test('adjacent 結果が表示される（3/4/4）', async ({ page }) => {
    await page.goto(PAGE);

    await answerQuestion(page, 'ribs', 3);
    await answerQuestion(page, 'waist', 4);
    await answerQuestion(page, 'abdomen', 4);

    const result = page.getByTestId('bcs-result');
    await expect(result).toHaveAttribute('data-result-type', 'adjacent');
    await expect(result).toContainText('5段階BCSの「3〜4」に近い特徴が見られます');
    await expect(result).toContainText('理想的な体型〜やや肥満の境界付近の可能性があります');
    await expect(result).not.toContainText('BCS4と判定');
  });

  test('unresolved 結果が表示される（2/4/4）', async ({ page }) => {
    await page.goto(PAGE);

    await answerQuestion(page, 'ribs', 2);
    await answerQuestion(page, 'waist', 4);
    await answerQuestion(page, 'abdomen', 4);

    const result = page.getByTestId('bcs-result');
    await expect(result).toHaveAttribute('data-result-type', 'unresolved');
    await expect(result).toContainText('観察結果に差があり、体型の目安を絞れませんでした');
    await expect(result).toContainText('触診と見た目の印象が食い違っています');
    await expect(result).not.toContainText('BCS4と判定');
    await expect(
      page.getByLabel('目安を絞れなかった場合').getByRole('link', { name: '猫のカロリー計算' }),
    ).toHaveCount(0);
  });

  test('ホームから遷移できる', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '猫の肥満度チェック（BCS）を開く' }).click();
    await expect(page).toHaveURL(PAGE);
  });

  test('FAQ・免責・出典が表示される', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.getByRole('heading', { name: 'よくある質問' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'BCSでは筋肉量までは分かりません' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '参考情報・出典' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '免責事項' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: '環境省「飼い主のためのペットフード・ガイドライン」' }).first(),
    ).toBeVisible();
  });
});
