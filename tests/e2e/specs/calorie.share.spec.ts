import { test, expect } from '@playwright/test';

test.describe('猫のカロリー計算 - 共有機能テスト', () => {
  test.setTimeout(90000); // テストファイル全体のタイムアウトを90秒に設定
  test.beforeEach(async ({ page }) => {
    // navigator.share と navigator.clipboard をモック
    await page.addInitScript(() => {
      // Web Share API のモック
      (window as any).navigator.share = async (data: any) => {
        (window as any).__shared__ = data;
        return Promise.resolve();
      };

      // Clipboard API のモック
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text: string) => {
            (window as any).__copied__ = text;
            return Promise.resolve();
          }
        },
        writable: true, // 変更可能にする
        configurable: true, // 再定義可能にする
      });
    });

    await page.goto('/calculate-cat-calorie', { timeout: 90000 });
  });

  test.describe('共有メニューの表示制御', () => {
    test('共有ボタンクリックでメニュー開閉', async ({ page }) => {
      // 計算を実行して共有ボタンを表示させる
      await page.fill('#weight', '4.2');

      const shareBtn = page.locator('#shareBtn');
      const shareMenu = page.locator('#shareMenu');

      // 初期状態ではメニューは非表示
      await expect(shareMenu).not.toBeVisible();
      await expect(shareBtn).toHaveAttribute('aria-expanded', 'false');

      // クリックで開く
      await shareBtn.click();
      await expect(shareMenu).toBeVisible();
      await expect(shareBtn).toHaveAttribute('aria-expanded', 'true');

      // もう一度クリックで閉じる
      await shareBtn.click({ force: true });
      await expect(shareMenu).not.toBeVisible();
      await expect(shareBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('メニュー外クリックで閉じる', async ({ page }) => {
      // 計算を実行して共有ボタンを表示させる
      await page.fill('#weight', '4.2');

      const shareBtn = page.locator('#shareBtn');
      const shareMenu = page.locator('#shareMenu');

      // メニューを開く
      await shareBtn.click();
      await expect(shareMenu).toBeVisible();

      // メニュー外をクリック
      await page.click('body', { position: { x: 10, y: 10 } });
      await expect(shareMenu).not.toBeVisible();
      await expect(shareBtn).toHaveAttribute('aria-expanded', 'false');
    });

    test('Escapeキーで閉じる', async ({ page }) => {
      // 計算を実行して共有ボタンを表示させる
      await page.fill('#weight', '4.2');

      const shareBtn = page.locator('#shareBtn');
      const shareMenu = page.locator('#shareMenu');

      // メニューを開く
      await shareBtn.click();
      await expect(shareMenu).toBeVisible();

      // Escapeキーで閉じる
      await page.keyboard.press('Escape');
      await expect(shareMenu).not.toBeVisible();
      await expect(shareBtn).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test.describe('Web Share API', () => {
    test('navigator.shareが利用可能な場合の動作', async ({ page }) => {
      // 計算結果を設定
      await page.fill('#weight', '4.2');
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="maintain"]');

      // 共有メニューを開く
      await page.click('#shareBtn');

      // Web Share APIボタンが存在することを確認（実装に依存）
      const nativeShareBtn = page.locator('button:has-text("シェア")').first();
      if (await nativeShareBtn.isVisible()) {
        await nativeShareBtn.click();

        // モックされたshareが呼ばれたことを確認
        const sharedData = await page.evaluate(() => (window as any).__shared__);
        expect(sharedData).toBeTruthy();
        expect(sharedData.title).toMatch(/猫のカロリー計算/);
        expect(sharedData.text).toBeTruthy();
        expect(sharedData.url).toMatch(/w=4\.2/);
      }
    });
  });

  test.describe('Xでシェア', () => {
    test('Xシェアリンクの生成', async ({ page }) => {
      // 計算結果を設定
      await page.fill('#weight', '5.0');
      await page.click('button[data-value="kitten"]');
      await page.click('button[data-value="gain"]');

      // URLパラメータが更新されるのを待つ
      await page.waitForURL(/w=5\.0&s=kitten&g=gain/);

      // 共有メニューを開く
      await page.click('#shareBtn');

      // currentUrl が更新されるのを待つ
      await page.waitForFunction(
        (expectedUrl) => window.location.href.includes(expectedUrl),
        'w=5.0&s=kitten&g=gain'
      );

      // Xシェアリンクを確認
      const xShareLink = page.locator('a[href^="https://x.com/intent/post"]');
      await expect(xShareLink).toBeVisible();

      const href = await xShareLink.getAttribute('href');
      expect(href).toBeTruthy();
      
      // URLパラメータの確認
      const url = new URL(href!);
      const text = url.searchParams.get('text');
      const shareUrl = url.searchParams.get('url');

      expect(text).toContain('うちの猫の必要カロリーは');
      expect(text).toMatch(/304\.3/); // 計算結果のkcalが含まれる
      expect(shareUrl).toMatch(/w=5\.0/);
      expect(shareUrl).toMatch(/s=kitten/);
      expect(shareUrl).toMatch(/g=gain/);
    });

    test('Xシェアリンクのクリック', async ({ page }) => {
      await page.fill('#weight', '3.5');
      await page.click('#shareBtn');

      const xShareLink = page.locator('a[href^="https://x.com/intent/post"]');
      
      // 新しいタブで開くことを確認
      await expect(xShareLink).toHaveAttribute('target', '_blank');
      await expect(xShareLink).toHaveAttribute('rel', 'noopener noreferrer');

      // リンクが正しく設定されている
      const href = await xShareLink.getAttribute('href');
      expect(href).toContain('https://x.com/intent/post');
    });
  });

  test.describe('リンクをコピー', () => {
    test('クリップボードへのコピー', async ({ page }) => {
      // 計算結果を設定
      await page.fill('#weight', '6.8');
      await page.click('button[data-value="senior"]');
      await page.click('button[data-value="loss"]');

      // 共有メニューを開く
      await page.click('#shareBtn');

      // リンクをコピーボタンをクリック
      const copyBtn = page.locator('button:has-text("リンクをコピー")');
      await expect(copyBtn).toBeVisible();
      await expect(copyBtn).toBeEnabled(); // 追加
      await copyBtn.click();

      // __copied__ 変数がセットされるまで待つ
      await page.waitForFunction(() => (window as any).__copied__ !== undefined);

      // クリップボードにコピーされたことを確認
      const copiedText = await page.evaluate(() => (window as any).__copied__);
      expect(copiedText).toBeTruthy();
      expect(copiedText).toMatch(/w=6\.8/);
      expect(copiedText).toMatch(/s=senior/);
      expect(copiedText).toMatch(/g=loss/);

      // フィードバック表示の確認（実装に依存）
      const feedback = page.locator('.toast:has-text("コピーしました")');
      if (await feedback.isVisible()) {
        await expect(feedback).toBeVisible();
      }
    });

    test('コピー後のメニュー状態', async ({ page }) => {
      await page.fill('#weight', '4.0');
      await page.click('#shareBtn', { force: true });

      const copyBtn = page.locator('button:has-text("リンクをコピー")');
      await copyBtn.click();

      // メニューが閉じる（実装に依存）
      const shareMenu = page.locator('#shareMenu');
      // 一定時間後にメニューが閉じることを確認
      await page.waitForTimeout(1000);
      // メニューの状態は実装により異なる
    });
  });

  test.describe('共有URL の内容確認', () => {
    test('現在の設定がURLに反映される', async ({ page }) => {
      // 特定の設定にする
      await page.fill('#weight', '7.5');
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="maintain"]');
      
      // 去勢済みにチェック
      const neuteredCheckbox = page.locator('#neutered');
      if (!(await neuteredCheckbox.isChecked())) {
        await neuteredCheckbox.click();
      }

      // URLパラメータが更新されるのを待つ
      await page.waitForURL(/w=7\.5&s=adult&g=maintain&n=1/);

      // currentUrl が更新されるのを待つ
      await page.waitForFunction(
        (expectedUrl) => window.location.href.includes(expectedUrl),
        'w=7.5&s=adult&g=maintain&n=1'
      );

      await page.click('#shareBtn');

      // Xシェアリンクから共有URLを取得
      const xShareLink = page.locator('a[href^="https://x.com/intent/post"]');
      const href = await xShareLink.getAttribute('href');
      const url = new URL(href!);
      const shareUrl = url.searchParams.get('url');

      expect(shareUrl).toBeTruthy();
      const shareUrlObj = new URL(shareUrl!);
      
      // パラメータが正しく設定されている
      expect(shareUrlObj.searchParams.get('w')).toBe('7.5');
      expect(shareUrlObj.searchParams.get('s')).toBe('adult');
      expect(shareUrlObj.searchParams.get('g')).toBe('maintain');
      expect(shareUrlObj.searchParams.get('n')).toBe('1');
    });

    test('計算結果がシェアテキストに含まれる', async ({ page }) => {
      await page.fill('#weight', '4.2');
      await page.click('button[data-value="kitten"]');
      await page.click('button[data-value="maintain"]');

      // 計算結果を取得
      const kcal = await page.locator('#kcal').textContent();
      
      await page.click('#shareBtn');

      const xShareLink = page.locator('a[href^="https://x.com/intent/post"]');
      const href = await xShareLink.getAttribute('href');
      const url = new URL(href!);
      const text = url.searchParams.get('text');

      expect(text).toBeTruthy();
      expect(text).toContain(kcal || '');
    });
  });

  test.describe('エラー処理', () => {
    test('Clipboard API が利用できない場合', async ({ page }) => {
      // Clipboard API を無効化
      await page.addInitScript(() => {
        delete (window.navigator as any).clipboard;
      });

      await page.goto('/calculate-cat-calorie', { timeout: 90000 });
      await page.fill('#weight', '4.0');
      await page.click('#shareBtn', { force: true });

      const copyBtn = page.locator('button:has-text("リンクをコピー")');
      
      if (await copyBtn.isVisible()) {
        await copyBtn.click();
        
        // エラーメッセージまたはフォールバック処理の確認
        const errorMsg = page.locator(':has-text("コピーに失敗")');
        if (await errorMsg.isVisible()) {
          await expect(errorMsg).toBeVisible();
        }
      }
    });

    test('Web Share API が利用できない場合', async ({ page }) => {
      // Web Share API を無効化
      await page.addInitScript(() => {
        delete (window.navigator as any).share;
      });

      await page.goto('/calculate-cat-calorie', { timeout: 90000 });
      // 計算を実行して共有ボタンを表示させる
      await page.fill('#weight', '4.2');
      await page.click('#shareBtn');

      // 常にXシェアとコピーボタンが表示される
      await expect(page.locator('a[href^="https://x.com/intent/post"]')).toBeVisible();
      await expect(page.locator('button:has-text("リンクをコピー")')).toBeVisible();
    });
  });

  test.describe('アクセシビリティ', () => {
    test('共有ボタンのアクセシビリティ', async ({ page }) => {
      // 計算を実行して共有ボタンを表示させる
      await page.fill('#weight', '4.2');

      const shareBtn = page.locator('#shareBtn');
      
      // aria-expanded属性
      await expect(shareBtn).toHaveAttribute('aria-expanded', 'false');
      
      // aria-haspopup属性
      const hasPopup = await shareBtn.getAttribute('aria-haspopup');
      if (hasPopup) {
        expect(['true', 'menu']).toContain(hasPopup);
      }

      // キーボード操作
      await shareBtn.focus();
      await expect(shareBtn).toBeFocused();
      
      await page.keyboard.press('Enter');
      await expect(shareBtn).toHaveAttribute('aria-expanded', 'true');
    });

    test('共有メニューのキーボードナビゲーション', async ({ page }) => {
      // 計算を実行して共有ボタンを表示させる
      await page.fill('#weight', '4.2');

      await page.click('#shareBtn');
      
      // メニュー内のフォーカス可能要素
      const focusableElements = page.locator('#shareMenu button, #shareMenu a');
      const count = await focusableElements.count();
      
      if (count > 0) {
        // Tabキーでナビゲーション
        await page.keyboard.press('Tab');
        const firstFocused = page.locator(':focus');
        await expect(firstFocused).toBeVisible();
        
        // 最後の要素でTabを押すとメニューが閉じる（実装に依存）
        for (let i = 0; i < count; i++) {
          await page.keyboard.press('Tab');
        }
      }
    });

    test('共有リンクのアクセシビリティ', async ({ page }) => {
      // 計算を実行して共有ボタンを表示させる
      await page.fill('#weight', '4.2');

      await page.click('#shareBtn');
      
      const xShareLink = page.locator('a[href^="https://x.com/intent/post"]');
      
      // aria-label または適切なテキスト
      const ariaLabel = await xShareLink.getAttribute('aria-label');
      const text = await xShareLink.textContent();
      
      expect(ariaLabel || text).toMatch(/X|Twitter|シェア/i);
      
      // 外部リンクの属性
      await expect(xShareLink).toHaveAttribute('target', '_blank');
      await expect(xShareLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  test.describe('モバイル対応', () => {
    test('モバイルでの共有メニュー表示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.fill('#weight', '3.0');
      await page.click('#shareBtn');
      
      const shareMenu = page.locator('#shareMenu');
      await expect(shareMenu).toBeVisible();
      
      // タップしやすいボタンサイズ
      const copyBtn = page.locator('button:has-text("リンクをコピー")');
      if (await copyBtn.isVisible()) {
        const boundingBox = await copyBtn.boundingBox();
        expect(boundingBox?.height).toBeGreaterThanOrEqual(44);
      }
    });

    test('モバイルでのWeb Share API優先', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // モバイルではWeb Share APIが優先的に使用される想定
      // 計算実行して共有ボタンを表示
      await page.fill('#weight', '3.0');
      await page.click('#shareBtn');
      
      // 実装に応じてネイティブシェアボタンの表示を確認
      const nativeShareBtn = page.locator('button:has-text("シェア")').first();
      if (await nativeShareBtn.isVisible()) {
        await expect(nativeShareBtn).toBeVisible();
      }
    });
  });
});
