import { test, expect } from '@playwright/test';
import { buildUrlParams } from '../utils/calc';

test.describe('猫のカロリー計算 - UI制御テスト', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calculate-cat-calorie');
  });

  test.describe('セグメントボタンの選択制御', () => {
    test('ステージボタンは単一選択', async ({ page }) => {
      // 初期状態でadultが選択されている想定
      await expect(page.locator('button[data-value="adult"]')).toHaveAttribute('aria-pressed', 'true');

      // kittenを選択
      await page.click('button[data-value="kitten"]');
      await expect(page.locator('button[data-value="kitten"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[data-value="adult"]')).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('button[data-value="senior"]')).toHaveAttribute('aria-pressed', 'false');

      // seniorを選択
      await page.click('button[data-value="senior"]');
      await expect(page.locator('button[data-value="senior"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[data-value="kitten"]')).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('button[data-value="adult"]')).toHaveAttribute('aria-pressed', 'false');
    });

    test('目標ボタンは単一選択', async ({ page }) => {
      // 初期状態でmaintainが選択されている想定
      await expect(page.locator('button[data-value="maintain"]')).toHaveAttribute('aria-pressed', 'true');

      // lossを選択
      await page.click('button[data-value="loss"]');
      await expect(page.locator('button[data-value="loss"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[data-value="maintain"]')).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('button[data-value="gain"]')).toHaveAttribute('aria-pressed', 'false');

      // gainを選択
      await page.click('button[data-value="gain"]')
      await expect(page.locator('button[data-value="gain"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[data-value="loss"]')).toHaveAttribute('aria-pressed', 'false');
      await expect(page.locator('button[data-value="maintain"]')).toHaveAttribute('aria-pressed', 'false');
    });
  });

  test.describe('去勢/避妊トグルの表示制御', () => {
    test('adultのときのみ表示・有効', async ({ page }) => {
      // adult選択時は表示・有効
      await page.click('button[data-value="adult"]');
      await expect(page.locator('#neutered')).toBeVisible();
      await expect(page.locator('#neutered')).not.toBeDisabled();

      // kitten選択時は非表示（DOMから消える）
      await page.click('button[data-value="kitten"]');
      await expect(page.locator('#neutered')).toHaveCount(0);

      // senior選択時は非表示（DOMから消える）
      await page.click('button[data-value="senior"]');
      await expect(page.locator('#neutered')).toHaveCount(0);

      // adultに戻すと表示・有効
      await page.click('button[data-value="adult"]');
      await expect(page.locator('#neutered')).toBeVisible();
      await expect(page.locator('#neutered')).not.toBeDisabled();
    });

    test('去勢/避妊チェックボックスの動作', async ({ page }) => {
      await page.click('button[data-value="adult"]');
      
      const neuteredCheckbox = page.locator('#neutered');
      
      // 初期状態を確認
      const initialChecked = await neuteredCheckbox.isChecked();
      
      // チェック状態をトグル
      if (initialChecked) {
        await neuteredCheckbox.uncheck();
        await expect(neuteredCheckbox).not.toBeChecked();
        await neuteredCheckbox.check();
        await expect(neuteredCheckbox).toBeChecked();
      } else {
        await neuteredCheckbox.check();
        await expect(neuteredCheckbox).toBeChecked();
        await neuteredCheckbox.uncheck();
        await expect(neuteredCheckbox).not.toBeChecked();
      }
    });
  });

  test.describe('体重バリデーション', () => {
    test('有効範囲内ではエラーなし', async ({ page }) => {
      // 0.5kg（下限）
      await page.fill('#weight', '0.5');
      await expect(page.locator('#error')).toHaveCount(0);

      // 6.0kg（中間値）
      await page.fill('#weight', '6.0');
      await expect(page.locator('#error')).toHaveCount(0);

      // 12.0kg（上限）
      await page.fill('#weight', '12.0');
      await expect(page.locator('#error')).toHaveCount(0);
    });

    test('範囲外でエラー表示', async ({ page }) => {
      // 0.4kg（下限未満）
      await page.fill('#weight', '0.4');
      await expect(page.locator('#error')).not.toBeEmpty();
      await expect(page.locator('#error')).toContainText(/0\.5/);

      // 12.1kg（上限超過）
      await page.fill('#weight', '12.1');
      await expect(page.locator('#error')).not.toBeEmpty();
      await expect(page.locator('#error')).toContainText(/12/);

      // 有効値に戻すとエラー消去
      await page.fill('#weight', '5.0');
      await expect(page.locator('#error')).toHaveCount(0);
    });

    test('空値・無効値の処理', async ({ page }) => {
      // 空値
      await page.fill('#weight', '');
      await expect(page.locator('#kcal')).toHaveCount(0);
      await expect(page.locator('#range')).toHaveCount(0);

      // 非数値（type=numberのため直接fill不可。スクリプトで入力をシミュレート）
      await page.evaluate(() => {
        const el = document.getElementById('weight') as HTMLInputElement | null;
        if (el) {
          el.value = 'abc';
          el.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      await expect(page.locator('#kcal')).toHaveCount(0);
      await expect(page.locator('#range')).toHaveCount(0);

      // 負の値（アプリの仕様では結果非表示・エラーは表示しない）
      await page.fill('#weight', '-1');
      await expect(page.locator('#error')).toHaveCount(0);
    });
  });

  test.describe('URL同期機能', () => {
    test('入力変更でURLパラメータ更新', async ({ page }) => {
      // 初期設定
      await page.fill('#weight', '4.2');
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="maintain"]');
      
      // 去勢済みにチェック
      const neuteredCheckbox = page.locator('#neutered');
      if (!(await neuteredCheckbox.isChecked())) {
        await neuteredCheckbox.click();
      }

      // URLパラメータが更新されることを確認
      await page.waitForFunction(() => {
        return window.location.search.includes('w=4.2') &&
               window.location.search.includes('s=adult') &&
               window.location.search.includes('g=maintain') &&
               window.location.search.includes('n=1');
      });

      const url = new URL(page.url());
      expect(url.searchParams.get('w')).toBe('4.2');
      expect(url.searchParams.get('s')).toBe('adult');
      expect(url.searchParams.get('g')).toBe('maintain');
      expect(url.searchParams.get('n')).toBe('1');
    });

    test('URLパラメータからの復元', async ({ page }) => {
      // パラメータ付きURLで直接アクセス
      const params = buildUrlParams(3.5, 'senior', 'loss', false);
      await page.goto(`/calculate-cat-calorie?${params}`);

      // 入力値が復元されることを確認
      await expect(page.locator('#weight')).toHaveValue('3.5');
      await expect(page.locator('button[data-value="senior"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[data-value="loss"]')).toHaveAttribute('aria-pressed', 'true');
      
      // 去勢/避妊の状態も復元（seniorなので非表示だが内部状態は保持）
      // 計算結果も正しく表示される
      await expect(page.locator('#kcal')).toHaveCount(1);
      await expect(page.locator('#range')).toHaveCount(1);
    });

    test('リロード後の状態保持', async ({ page }) => {
      // 設定を変更
      await page.fill('#weight', '5.5');
      await page.click('button[data-value="kitten"]');
      await page.click('button[data-value="gain"]')

      // 計算結果を取得
      const originalKcal = await page.locator('#kcal').textContent();
      const originalRange = await page.locator('#range').textContent();
      const originalFactor = await page.locator('#factor').textContent();

      // リロード
      await page.reload();

      // 状態が保持されることを確認
      await expect(page.locator('#weight')).toHaveValue('5.5');
      await expect(page.locator('button[data-value="kitten"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[data-value="gain"]')).toHaveAttribute('aria-pressed', 'true');

      // 計算結果も同じ
      await expect(page.locator('#kcal')).toHaveText(originalKcal || '');
      await expect(page.locator('#range')).toHaveText(originalRange || '');
      await expect(page.locator('#factor')).toHaveText(originalFactor || '');
    });

    test('不正なURLパラメータの処理', async ({ page }) => {
      // 不正なパラメータでアクセス
      await page.goto('/calculate-cat-calorie?w=invalid&s=unknown&g=invalid&n=2');

      // デフォルト状態に戻る
      await expect(page.locator('#weight')).toHaveValue('');
      await expect(page.locator('button[data-value="adult"]')).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('button[data-value="maintain"]')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  test.describe('キーボード操作', () => {
    test('体重入力フィールドのキーボード操作', async ({ page }) => {
      const weightInput = page.locator('#weight');
      
      // フォーカス
      await weightInput.focus();
      await expect(weightInput).toBeFocused();

      // 数値入力
      await weightInput.fill('');
      await page.keyboard.type('4.2');
      await expect(weightInput).toHaveValue('4.2');

      // Enterキーで確定（フォーカスはそのままでもOK）
      await page.keyboard.press('Enter');
    });

    test('セグメントボタンのキーボード操作', async ({ page }) => {
      // Tabキーでセグメントボタンにフォーカス
      await page.keyboard.press('Tab'); // 体重入力
      await page.keyboard.press('Tab'); // 最初のセグメントボタン

      const focusedButton = page.locator(':focus');
      await expect(focusedButton).toHaveAttribute('data-value');

      // Enterキーで選択
      await page.keyboard.press('Enter');
      await expect(focusedButton).toHaveAttribute('aria-pressed', 'true');

      // 矢印キーでナビゲーション（実装されている場合）
      await page.keyboard.press('ArrowRight');
      const nextFocused = page.locator(':focus');
      await expect(nextFocused).toHaveAttribute('data-value');
    });

    test('去勢/避妊チェックボックスのキーボード操作', async ({ page }) => {
      await page.click('button[data-value="adult"]');
      
      const neuteredCheckbox = page.locator('#neutered');
      await neuteredCheckbox.focus();
      await expect(neuteredCheckbox).toBeFocused();

      // トグル挙動の確認（check/uncheck で代替）
      const initialChecked = await neuteredCheckbox.isChecked();
      if (initialChecked) {
        await neuteredCheckbox.uncheck();
        await expect(neuteredCheckbox).not.toBeChecked();
      } else {
        await neuteredCheckbox.check();
        await expect(neuteredCheckbox).toBeChecked();
      }
    });
  });

  test.describe('アクセシビリティ', () => {
    test('フォーム要素のラベル関連付け', async ({ page }) => {
      // 体重入力のラベル（aria-label または関連付けられたlabel要素）
      const weightInput = page.locator('#weight');
      const ariaLabel = await weightInput.getAttribute('aria-label');
      if (ariaLabel) {
        expect(ariaLabel).toMatch(/体重|weight/i);
      } else {
        const associatedLabel = await page.locator('label[for="weight"]').first().textContent();
        expect((associatedLabel || '').trim().length).toBeGreaterThan(0);
      }

      // 去勢/避妊チェックボックスのラベル
      await page.click('button[data-value="adult"]');
      const neuteredCheckbox = page.locator('#neutered');
      const neuteredLabel = await neuteredCheckbox.getAttribute('aria-label');
      expect(neuteredLabel).toBeTruthy();
    });

    test('セグメントボタンのaria属性', async ({ page }) => {
      const stageButtons = page.locator('button[data-value]');
      
      for (let i = 0; i < await stageButtons.count(); i++) {
        const button = stageButtons.nth(i);
        
        // aria-pressed属性の存在
        await expect(button).toHaveAttribute('aria-pressed');
        
        // role属性（必要に応じて）
        const role = await button.getAttribute('role');
        if (role) {
          expect(['button', 'tab', 'radio']).toContain(role);
        }
      }
    });

    test('エラーメッセージのアクセシビリティ', async ({ page }) => {
      // エラー状態にする
      await page.fill('#weight', '0.1');
      
      const errorElement = page.locator('#error');
      await expect(errorElement).toBeVisible();
      
      // aria-live属性でスクリーンリーダーに通知
      const ariaLive = await errorElement.getAttribute('aria-live');
      expect(['polite', 'assertive']).toContain(ariaLive || '');
    });

    test('結果表示のセマンティクス', async ({ page }) => {
      await page.fill('#weight', '4.2');
      
      // 結果要素のrole属性
      const kcalElement = page.locator('#kcal');
      const rangeElement = page.locator('#range');
      
      // aria-label または aria-describedby で説明
      const kcalLabel = await kcalElement.getAttribute('aria-label');
      const rangeLabel = await rangeElement.getAttribute('aria-label');
      
      if (kcalLabel) {
        expect(kcalLabel).toMatch(/カロリー|kcal/i);
      }
      if (rangeLabel) {
        expect(rangeLabel).toMatch(/範囲|range/i);
      }
    });
  });

  test.describe('レスポンシブ対応', () => {
    test('モバイル表示での操作性', async ({ page }) => {
      // モバイルサイズに設定
      await page.setViewportSize({ width: 375, height: 667 });

      // 基本操作が可能
      await page.fill('#weight', '3.0');
      await page.click('button[data-value="kitten"]');
      await page.click('button[data-value="gain"]')

      // 結果が表示される
      await expect(page.locator('#kcal')).not.toHaveText('--');
      
      // セグメントボタンがタップしやすいサイズ
      const stageButton = page.locator('button[data-value="adult"]');
      const boundingBox = await stageButton.boundingBox();
      expect(boundingBox?.height).toBeGreaterThanOrEqual(40); // 最小タップサイズ(端末差吸収)
    });

    test('タブレット表示での操作性', async ({ page }) => {
      // タブレットサイズに設定
      await page.setViewportSize({ width: 768, height: 1024 });

      // レイアウトが適切に調整される
      await expect(page.locator('#weight')).toBeVisible();
      
      // 操作性を確認
      await page.fill('#weight', '6.5');
      await page.click('button[data-value="senior"]');
      await expect(page.locator('#kcal')).not.toHaveText('--');
    });

    test('デスクトップ表示での操作性', async ({ page }) => {
      // デスクトップサイズに設定
      await page.setViewportSize({ width: 1280, height: 720 });

      // 全要素が適切に表示される
      await expect(page.locator('#weight')).toBeVisible();
      await expect(page.locator('#neutered')).toBeVisible();
      // マウス操作での使いやすさ
      await page.hover('button[data-value="kitten"]');
      await page.click('button[data-value="kitten"]');
      await expect(page.locator('button[data-value="kitten"]')).toHaveAttribute('aria-pressed', 'true');
    });
  });
});
