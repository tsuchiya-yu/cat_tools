import { test, expect, type Page } from '@playwright/test';

const PAGE = '/cat-bcs-check';

async function answerQuestion(page: Page, questionKey: 'ribs' | 'waist' | 'abdomen', score: number) {
  await page.locator(`#${questionKey}-option-${score}`).check();
}

test.describe('猫の肥満度チェック（BCS） E2E', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('ページが表示され、導入・注意・触診ガイドがある', async ({ page }) => {
    await page.goto(PAGE);

    const h1 = page.getByRole('heading', {
      level: 1,
      name: '猫の肥満度チェック｜BCS（ボディコンディションスコア）',
    });
    await expect(h1).toBeVisible();
    await expect(h1).toHaveClass(/text-pretty/);
    await expect(page.getByRole('heading', { name: 'チェックする前に' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '触診のしかた' })).toBeVisible();
    await expect(page.getByText('お腹のたるみ（プライモーディアルポーチ）について')).toBeVisible();
    await expect(page.getByRole('heading', { name: '5段階BCSの参考図' })).toBeVisible();
    await expect(page.getByRole('img', { name: /ボディコンディションスコア/ }).first()).toBeVisible();
    await expect(
      page.getByText('出典: 環境省「飼い主のためのペットフード・ガイドライン」'),
    ).toBeVisible();
    await expect(page.getByText(/ねこツールズ作成/)).toHaveCount(0);
    await expect(
      page.getByRole('link', { name: '環境省「飼い主のためのペットフード・ガイドライン」' }).first(),
    ).toHaveAttribute(
      'href',
      'https://www.env.go.jp/nature/dobutsu/aigo/2_data/pamph/petfood_guide_1808/pdf/6.pdf',
    );
  });

  test('参考図を拡大表示し、キーボードで操作して閉じるとフォーカスが戻る', async ({ page }) => {
    await page.goto(PAGE);

    const trigger = page.getByRole('button', { name: 'BCS参考図を拡大表示' });
    await trigger.focus();
    await page.keyboard.press('Enter');

    const dialog = page.getByRole('dialog', { name: '5段階BCSの参考図（拡大表示）' });
    await expect(dialog).toBeVisible();
    const closeButton = page.getByRole('button', { name: '拡大表示を閉じる' });
    const scroller = dialog.getByRole('group', { name: /スクロールして拡大部分を確認/ });
    await expect(scroller).toBeVisible();
    await expect(closeButton).toBeFocused();

    // 前方Tab: 閉じるボタン → スクロール領域 → 閉じるボタンへループ
    await page.keyboard.press('Tab');
    await expect(scroller).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();
    // 後方Tab: 閉じるボタン → スクロール領域へループ
    await page.keyboard.press('Shift+Tab');
    await expect(scroller).toBeFocused();

    // 方向キーで画像を横スクロールできる
    await scroller.evaluate((el) => {
      (el as HTMLElement).scrollLeft = 0;
    });
    await page.keyboard.press('ArrowRight');
    await expect
      .poll(() => scroller.evaluate((el) => (el as HTMLElement).scrollLeft))
      .toBeGreaterThan(0);

    // Escapeで閉じ、フォーカスはトリガーへ戻り、bodyスクロールが復元される
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('閉じるボタンで閉じられる', async ({ page }) => {
    await page.goto(PAGE);
    await page.getByRole('button', { name: 'BCS参考図を拡大表示' }).click();

    const dialog = page.getByRole('dialog', { name: '5段階BCSの参考図（拡大表示）' });
    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: '拡大表示を閉じる' }).click();
    await expect(dialog).toBeHidden();
  });

  test('参考図はバックスドロップクリックでも閉じられる', async ({ page }) => {
    await page.goto(PAGE);
    await page.getByRole('button', { name: 'BCS参考図を拡大表示' }).click();

    const dialog = page.getByRole('dialog', { name: '5段階BCSの参考図（拡大表示）' });
    await expect(dialog).toBeVisible();
    await page.locator('div.fixed.inset-0').click({ position: { x: 2, y: 2 } });
    await expect(dialog).toBeHidden();
  });

  test('モバイルで画像を末尾まで横スクロールしても閉じるボタンが表示・クリック可能', async ({
    page,
  }) => {
    await page.goto(PAGE);
    await page.getByRole('button', { name: 'BCS参考図を拡大表示' }).click();

    const dialog = page.getByRole('dialog', { name: '5段階BCSの参考図（拡大表示）' });
    await expect(dialog).toBeVisible();
    const closeButton = page.getByRole('button', { name: '拡大表示を閉じる' });
    const scroller = dialog.getByRole('group', { name: /スクロールして拡大部分を確認/ });

    // 拡大表示の画像はインライン画像より確実に大きい
    const inlineBox = await page
      .getByRole('img', { name: /ボディコンディションスコア/ })
      .first()
      .boundingBox();
    const zoomBox = await dialog
      .getByRole('img', { name: /ボディコンディションスコア/ })
      .boundingBox();
    expect(zoomBox).not.toBeNull();
    expect(inlineBox).not.toBeNull();
    expect(zoomBox!.width).toBeGreaterThan(inlineBox!.width);

    // 画像を末尾まで横スクロールしても、閉じるボタンは表示されクリック可能なまま
    await scroller.evaluate((el) => {
      const scrollEl = el as HTMLElement;
      scrollEl.scrollLeft = scrollEl.scrollWidth;
    });
    const scrolled = await scroller.evaluate((el) => (el as HTMLElement).scrollLeft);
    expect(scrolled).toBeGreaterThan(0);
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    await expect(dialog).toBeHidden();
  });

  test('結果に共有ボタンがあり、内訳は縦並び', async ({ page }) => {
    await page.goto(PAGE);
    await answerQuestion(page, 'ribs', 3);
    await answerQuestion(page, 'waist', 3);
    await answerQuestion(page, 'abdomen', 3);

    const result = page.getByTestId('bcs-result');
    await expect(result.locator('#bcsShareBtn')).toBeVisible();
    await expect(result.getByText('肋骨（触診）')).toBeVisible();
    await expect(result.getByText('腰（真上）')).toBeVisible();
    await expect(result.getByText('腹部（横）')).toBeVisible();
  });

  test('match 結果と回答内訳・関連ツール導線が表示される', async ({ page }) => {
    await page.goto(PAGE);

    await answerQuestion(page, 'ribs', 3);
    await answerQuestion(page, 'waist', 3);
    await answerQuestion(page, 'abdomen', 3);

    const result = page.getByTestId('bcs-result');
    await expect(result).toHaveAttribute('data-result-type', 'match');
    await expect(result).toContainText('段階の目安');
    await expect(result).toContainText('理想的な体型の目安');
    await expect(result).toContainText('肋骨（触診）');
    await expect(result).toContainText('3');
    await expect(result).not.toContainText('近い特徴が見られます');
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
    await expect(result).toContainText('3〜4');
    await expect(result).toContainText('理想的な体型〜やや肥満の境界付近の可能性があります');
    await expect(result).not.toContainText('近い特徴が見られます');
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
    await expect(page.getByLabel('免責事項')).toContainText('家庭での体型観察の目安');
    await expect(
      page.getByRole('link', { name: '環境省「飼い主のためのペットフード・ガイドライン」' }).first(),
    ).toBeVisible();
  });
});
