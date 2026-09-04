import { test, expect } from '@playwright/test';

const PAGE = '/calculate-cat-feeding';

test.describe('猫の給餌量計算 E2E', () => {
  test('初期表示: 入力があり、結果は非表示、警告は出ない', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.locator('#kcalInput')).toBeVisible();
    await expect(page.locator('#densityInput')).toBeVisible();
    await expect(page.getByRole('button', { name: '＋ フードを追加' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'フード名（任意）' })).toHaveCount(0);
    await expect(page.getByRole('textbox', { name: '与えたい配分（g）' })).toHaveCount(0);

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

  test('既存URL: kcal と d が復元される', async ({ page }) => {
    await page.goto(`${PAGE}?kcal=246.4&d=400`);

    await expect(page.locator('#kcalInput')).toHaveValue('246.4');
    await expect(page.locator('#densityInput')).toHaveValue('400');
    await expect(page.locator('#dailyGram')).toHaveText('62');
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
    // 入力セクションの導線リンクを検証（文言で特定）
    const link = page.getByRole('link', { name: 'こちら（カロリー計算ツール）' });
    await expect(link).toBeVisible();
  });

  test('補助本文と追加FAQが表示され、下部に関連ツール導線がある', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.getByRole('heading', { name: '猫の1日の給餌量はどう決まる？' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '給餌量の計算式と考え方' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '2種類以上のキャットフードを混ぜる場合' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '猫の状態によって給餌量が変わる理由' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '計算結果をどう調整するか' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ドライフード・ウェットフード・おやつの考え方' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '給餌量の具体例' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '関連ツール' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '計算方法の参考情報' })).toBeVisible();

    await expect(page.getByText('ウェットフードだけでも同じように計算できる？')).toBeVisible();
    await expect(page.getByText('フードを変えたら給餌量も変えるべき？')).toBeVisible();
    await expect(page.getByText('2種類以上のキャットフードを混ぜても計算できますか？')).toBeVisible();
    await expect(page.getByText('「与えたい配分（g）」とは何ですか？')).toBeVisible();
    await expect(page.getByText('ドライフードとウェットフードを一緒に計算できますか？')).toBeVisible();

    const relatedToolLink = page.getByRole('link', { name: '猫のカロリー計算ページ' });
    await expect(relatedToolLink).toBeVisible();
    await expect(relatedToolLink).toHaveAttribute('href', '/calculate-cat-calorie');

    const aafcoLabelLink = page.getByRole('link', { name: 'AAFCO: Reading Labels' });
    await expect(aafcoLabelLink).toHaveAttribute('href', 'https://www.aafco.org/consumers/understanding-pet-food/reading-labels/');
    await expect(aafcoLabelLink).toHaveAttribute('target', '_blank');
    await expect(aafcoLabelLink).toHaveAttribute('rel', 'noopener noreferrer');

    await expect(page.getByRole('link', { name: 'AAFCO: Calorie Content' })).toHaveAttribute(
      'href',
      'https://www.aafco.org/resources/startups/calorie-content/',
    );
    await expect(page.getByRole('link', { name: 'WSAVA: Global Nutrition Guidelines' })).toHaveAttribute(
      'href',
      'https://wsava.org/global-guidelines/global-nutrition-guidelines/',
    );
    await expect(page.getByRole('link', { name: 'FelineVMA / AAFP: Feline Feeding Programs' })).toHaveAttribute(
      'href',
      'https://catvets.com/resource/how-to-feed-how-to-feed-a-cat-consensus-statement/',
    );
  });

  test('canonical はクエリなしの /calculate-cat-feeding', async ({ page }) => {
    await page.goto(`${PAGE}?kcal=200&d=400&g1=40&d2=360&g2=20`);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    await expect(canonical).toHaveAttribute('href', /\/calculate-cat-feeding$/);
  });

  test('複数フード: 追加・最大5件・6件目不可・削除で単一UIへ戻る', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#kcalInput', '200');
    await page.fill('#densityInput', '400');

    const addButton = page.getByRole('button', { name: '＋ フードを追加' });
    await addButton.click();

    await expect(page.getByTestId('food-group-1')).toBeVisible();
    await expect(page.getByTestId('food-group-2')).toBeVisible();
    await expect(page.locator('#densityInput')).toHaveValue('400');
    await expect(page.getByLabel('フード名（任意）')).toHaveCount(2);
    await expect(page.getByLabel('与えたい配分（g）')).toHaveCount(2);
    await expect(page.locator('section[aria-live="polite"]')).toHaveCount(0);

    for (let i = 0; i < 3; i += 1) {
      await addButton.click();
    }
    await expect(page.getByTestId('food-group-5')).toBeVisible();
    await expect(addButton).toBeDisabled();
    await expect(page.getByText('最大5種類まで追加できます')).toBeVisible();

    await page.getByRole('button', { name: 'フード5を削除' }).click();
    await expect(page.getByTestId('food-group-5')).toHaveCount(0);

    await page.getByRole('button', { name: 'フード4を削除' }).click();
    await page.getByRole('button', { name: 'フード3を削除' }).click();
    await page.getByRole('button', { name: 'フード2を削除' }).click();

    await expect(page.getByTestId('food-group-2')).toHaveCount(0);
    await expect(page.locator('#densityInput')).toHaveValue('400');
    await expect(page.getByRole('textbox', { name: 'フード名（任意）' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: '＋ フードを追加' })).toBeEnabled();
  });

  test('複数フード: 不完全入力では結果非表示、40:20で計算・名前反映', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#kcalInput', '200');
    await page.fill('#densityInput', '400');
    await page.getByRole('button', { name: '＋ フードを追加' }).click();

    const ratioInputs = page.getByLabel('与えたい配分（g）');
    await ratioInputs.nth(0).fill('40');
    await ratioInputs.nth(1).fill('20');
    await expect(page.getByTestId('multi-food-result')).toHaveCount(0);

    const densityLabels = page.getByLabel('カロリー（kcal / 100g）');
    await densityLabels.nth(1).fill('360');

    const result = page.getByTestId('multi-food-result');
    await expect(result).toBeVisible();
    await expect(page.locator('#multiTotalGrams')).toHaveText('合計: 約51.7g');
    await expect(page.locator('#multiTotalKcal')).toHaveText('合計カロリー: 約200kcal');

    const food1Result = page.getByTestId('food-result-1');
    await expect(food1Result).toContainText('フード1');
    await expect(food1Result).toContainText('1日: 約34.5g');
    await expect(food1Result).toContainText('朝: 約17.2g');
    await expect(food1Result).toContainText('夜: 約17.3g');

    const food2Result = page.getByTestId('food-result-2');
    await expect(food2Result).toContainText('フード2');
    await expect(food2Result).toContainText('1日: 約17.2g');

    const nameInputs = page.getByLabel('フード名（任意）');
    await nameInputs.nth(0).fill('フードA');
    await nameInputs.nth(1).fill('フードB');
    await expect(food1Result).toContainText('フードA');
    await expect(food2Result).toContainText('フードB');
  });

  test('複数フード: URL同期・復元・ShareMenu・Back/Forward', async ({ page }) => {
    await page.goto(PAGE);
    await page.fill('#kcalInput', '200');
    await page.fill('#densityInput', '400');
    await page.getByRole('button', { name: '＋ フードを追加' }).click();

    const densityLabels = page.getByLabel('カロリー（kcal / 100g）');
    const ratioInputs = page.getByLabel('与えたい配分（g）');
    const nameInputs = page.getByLabel('フード名（任意）');

    await ratioInputs.nth(0).fill('40');
    await nameInputs.nth(0).fill('フードA');
    await densityLabels.nth(1).fill('360');
    await ratioInputs.nth(1).fill('20');
    await nameInputs.nth(1).fill('フードB');

    await expect.poll(() => page.url()).toContain('kcal=200');
    await expect.poll(() => page.url()).toContain('d=400');
    await expect.poll(() => page.url()).toContain('g1=40');
    await expect.poll(() => page.url()).toContain('d2=360');
    await expect.poll(() => page.url()).toContain('g2=20');
    await expect.poll(() => decodeURIComponent(page.url())).toContain('n1=フードA');
    await expect.poll(() => decodeURIComponent(page.url())).toContain('n2=フードB');

    await page.locator('#shareBtn').click();
    await expect(page.getByRole('menuitem', { name: 'リンクをコピー' })).toBeVisible();
    await expect(page.locator('#shareMenu')).toBeVisible();

    await page.goto(
      `${PAGE}?kcal=200&d=400&g1=40&n1=${encodeURIComponent('フードA')}&d2=360&g2=20&n2=${encodeURIComponent('フードB')}`,
    );
    await expect(page.locator('#kcalInput')).toHaveValue('200');
    await expect(page.locator('#densityInput')).toHaveValue('400');
    await expect(page.getByTestId('food-group-2')).toBeVisible();
    await expect(page.getByTestId('multi-food-result')).toBeVisible();
    await expect(page.getByTestId('food-result-1')).toContainText('フードA');
    await expect(page.getByTestId('food-result-2')).toContainText('フードB');

    await page.goto(`${PAGE}?kcal=200&d=400`);
    await expect(page.getByTestId('food-group-2')).toHaveCount(0);
    await expect(page.locator('#dailyGram')).toHaveText('50');

    await page.goBack();
    await expect(page.getByTestId('food-group-2')).toBeVisible();
    await expect(page.getByTestId('food-result-1')).toContainText('フードA');

    await page.goForward();
    await expect(page.getByTestId('food-group-2')).toHaveCount(0);
    await expect(page.locator('#dailyGram')).toHaveText('50');
  });

  test('複数フード: keyboardで追加・削除できる', async ({ page }) => {
    await page.goto(PAGE);
    await page.locator('#kcalInput').fill('200');
    await page.locator('#densityInput').fill('400');

    await page.getByRole('button', { name: '＋ フードを追加' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('food-group-2')).toBeVisible();

    await page.getByRole('button', { name: 'フード2を削除' }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('food-group-2')).toHaveCount(0);
  });

  test('mobile幅でも横スクロールが発生しない', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(PAGE);
    await page.fill('#kcalInput', '200');
    await page.fill('#densityInput', '400');
    await page.getByRole('button', { name: '＋ フードを追加' }).click();

    const densityLabels = page.getByLabel('カロリー（kcal / 100g）');
    const ratioInputs = page.getByLabel('与えたい配分（g）');
    await ratioInputs.nth(0).fill('40');
    await densityLabels.nth(1).fill('360');
    await ratioInputs.nth(1).fill('20');

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
  });
});
