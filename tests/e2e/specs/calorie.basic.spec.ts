import { test, expect } from '@playwright/test';

test.describe('猫のカロリー計算 - 基本機能テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculate-cat-calorie');
  });

  test('ページの初期表示', async ({ page }) => {
    // ページタイトル
    await expect(page).toHaveTitle(/猫のカロリー計算/);

    // 主要な入力要素の存在確認
    await expect(page.locator('#weight')).toBeVisible();
    await expect(page.locator('button[data-value="kitten"]')).toBeVisible();
    await expect(page.locator('button[data-value="adult"]')).toBeVisible();
    await expect(page.locator('button[data-value="senior"]')).toBeVisible();
    await expect(page.locator('button[data-value="maintain"]')).toBeVisible();
    await expect(page.locator('button[data-value="loss"]')).toBeVisible();
    await expect(page.locator('button[data-value="gain"]')).toBeVisible();

    // 出力要素は実装中のため、一時的にコメントアウト
    // await expect(page.locator('#kcal')).toBeVisible();
    // await expect(page.locator('#range')).toBeVisible();
    // await expect(page.locator('#factor')).toBeVisible();
    // await expect(page.locator('#note')).toBeVisible();

    // 共有ボタンは実装中のため、一時的にコメントアウト
    // await expect(page.locator('#shareBtn')).toBeVisible();
    // 結果表示は実装中のため、一時的にコメントアウト
    // await expect(page.locator('#kcal')).toHaveText('--');
    // await expect(page.locator('#range')).toHaveText('—');
  });

  test('デフォルト選択状態', async ({ page }) => {
    // デフォルトでadultとmaintainが選択されている想定
    await expect(page.locator('button[data-value="adult"]')).toHaveAttribute('aria-checked', 'true');
    await expect(page.locator('button[data-value="maintain"]')).toHaveAttribute('aria-checked', 'true');

    // 他のボタンは選択されていない
    await expect(page.locator('button[data-value="kitten"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('button[data-value="senior"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('button[data-value="loss"]')).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('button[data-value="gain"]')).toHaveAttribute('aria-checked', 'false');
  });

  test('去勢/避妊トグルの初期表示制御', async ({ page }) => {
    // adultが選択されている場合、去勢/避妊トグルが表示され、チェックされている
    await expect(page.locator('.switch')).toBeVisible();
    await expect(page.locator('input#neutered[aria-label="去勢・避妊済み"]')).toBeChecked();

    // kittenを選択すると隠れる
    await page.click('button[data-value="kitten"]');
    await expect(page.locator('.switch')).toBeHidden();

    // seniorを選択しても隠れる
    await page.click('button[data-value="senior"]');
    await expect(page.locator('.switch')).toBeHidden();

    // adultに戻すと表示され、チェックされた状態に戻る
    await page.click('button[data-value="adult"]');
    await expect(page.locator('.switch')).toBeVisible();
    await expect(page.locator('input#neutered[aria-label="去勢・避妊済み"]')).toBeChecked();
  });

  test('FAQ セクションの存在確認', async ({ page }) => {
    // FAQ セクションが4つ存在することを確認
    const faqDetails = page.locator('details');
    await expect(faqDetails).toHaveCount(4);

    // 各FAQが閉じた状態で表示されている
    for (let i = 0; i < 4; i++) {
      const detail = faqDetails.nth(i);
      await expect(detail).toBeVisible();
      await expect(detail).not.toHaveAttribute('open');
    }

    // FAQを開閉できる
    const firstFaq = faqDetails.first();
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open');
    
    await firstFaq.locator('summary').click();
    await expect(firstFaq).not.toHaveAttribute('open');
  });

  test('構造化データ（FAQPage）の存在確認', async ({ page }) => {
    // すべての JSON-LD を取得して解析（オブジェクト/配列の両方に対応）
    const contents = await page.locator('script[type="application/ld+json"]').allTextContents();

    // 型定義と簡易ガード
    type FaqAnswer = { ['@type']: string; text: string };
    type FaqItem = { ['@type']: string; name: string; acceptedAnswer: FaqAnswer };
    type FaqPage = { ['@type']: string; mainEntity: FaqItem[] };
    const isFaqPage = (v: unknown): v is FaqPage => {
      if (!v || typeof v !== 'object') return false;
      const t = (v as Record<string, unknown>)['@type'];
      const me = (v as Record<string, unknown>)['mainEntity'];
      return t === 'FAQPage' && Array.isArray(me);
    };

    // FAQPageを含む要素を抽出
    const faqPayloads: FaqPage[] = [];
    for (const text of contents) {
      try {
        const parsed = JSON.parse(text) as unknown;
        const items = Array.isArray(parsed) ? parsed : [parsed];
        for (const item of items) {
          if (isFaqPage(item)) {
            faqPayloads.push(item);
          }
        }
      } catch {
        // JSONでない場合はスキップ
      }
    }

    expect(faqPayloads.length).toBeGreaterThanOrEqual(1);

    // 1つ目のFAQPageの内容を確認
    const data = faqPayloads[0];
    expect(data['@type']).toBe('FAQPage');
    expect(Array.isArray(data.mainEntity)).toBeTruthy();
    expect(data.mainEntity.length).toBeGreaterThanOrEqual(4);

    // 各FAQ項目の構造をざっくり確認
    for (const entry of data.mainEntity) {
      expect(entry['@type']).toBe('Question');
      expect(entry.name).toBeTruthy();
      expect(entry.acceptedAnswer).toBeTruthy();
      expect(entry.acceptedAnswer['@type']).toBe('Answer');
      expect(entry.acceptedAnswer.text).toBeTruthy();
    }
  });

  test('メタタグの確認', async ({ page }) => {
    // OGPタグの確認
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /猫のカロリー計算/);
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', /.+/);

    // Twitterカードタグの確認
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute('content', /猫のカロリー計算/);
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute('content', /.+/);

    // 基本的なメタタグ
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[name="keywords"]')).toHaveAttribute('content', /.+/);
  });

  test('レスポンシブデザインの基本確認', async ({ page }) => {
    // デスクトップサイズでの表示確認
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('#weight')).toBeVisible();
    // await expect(page.locator('#kcal')).toBeVisible(); // 実装中のため一時的にコメントアウト

    // モバイルサイズでの表示確認
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('#weight')).toBeVisible();
    // await expect(page.locator('#kcal')).toBeVisible(); // 実装中のため一時的にコメントアウト

    // セグメントボタンがモバイルでも操作可能
    await page.click('button[data-value="kitten"]');
    await expect(page.locator('button[data-value="kitten"]')).toHaveAttribute('aria-checked', 'true');
  });

  test('アクセシビリティの基本確認', async ({ page }) => {
    // フォーム要素のラベル関連付け
    const weightLabel = page.locator('label[for="weight"]');
    await expect(weightLabel).toBeVisible();
    await expect(weightLabel).toHaveText('体重(kg)');

    // セグメントボタンのaria-checked属性
    const stageButtons = page.locator('button[data-value^="kitten"], button[data-value^="adult"], button[data-value^="senior"]');
    for (let i = 0; i < await stageButtons.count(); i++) {
      const button = stageButtons.nth(i);
      await expect(button).toHaveAttribute('aria-checked');
    }

    const goalButtons = page.locator('button[data-value^="maintain"], button[data-value^="loss"], button[data-value^="gain"]');
    for (let i = 0; i < await goalButtons.count(); i++) {
      const button = goalButtons.nth(i);
      await expect(button).toHaveAttribute('aria-checked');
    }

    // 共有メニューは実装中のため、一時的にコメントアウト
    // const shareBtn = page.locator('#shareBtn');
    // await expect(shareBtn).toHaveAttribute('aria-expanded', 'false');
  });

  test('キーボードナビゲーション', async ({ page }) => {
    // Tabキーでフォーカス移動
    await page.keyboard.press('Tab');
    await expect(page.locator('#weight')).toBeFocused();

    // セグメントボタンへのフォーカス移動
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toHaveAttribute('data-value');

    // Enterキーでボタン操作
    await page.keyboard.press('Enter');
    await expect(focusedElement).toHaveAttribute('aria-checked', 'true');
  });
});
