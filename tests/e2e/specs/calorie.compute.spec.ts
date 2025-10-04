import { test, expect } from '@playwright/test';
import { expected, type Stage, type Goal } from '../utils/calc';

test.describe('猫のカロリー計算 - 計算ロジックテスト', () => {
  test.beforeEach(async ({ page }) => {
      await page.goto('/calculate-cat-calorie', { timeout: 90000 }); // タイムアウトを直接指定
    });

  // 組み合わせ網羅のテストデータ
  const testWeights = [2.0, 4.2, 7.0];
  
  const testCases = [
    // maintain: kitten (去勢無関係)
    { goal: 'maintain' as Goal, stage: 'kitten' as Stage, neutered: false, name: 'maintain/kitten' },
    
    // maintain: adult × neutered
    { goal: 'maintain' as Goal, stage: 'adult' as Stage, neutered: true, name: 'maintain/adult/去勢済' },
    { goal: 'maintain' as Goal, stage: 'adult' as Stage, neutered: false, name: 'maintain/adult/未去勢' },
    
    // maintain: senior (去勢無関係)
    { goal: 'maintain' as Goal, stage: 'senior' as Stage, neutered: false, name: 'maintain/senior' },
    
    // loss: stage 3パターン (goal優先で係数同一)
    { goal: 'loss' as Goal, stage: 'kitten' as Stage, neutered: false, name: 'loss/kitten' },
    { goal: 'loss' as Goal, stage: 'adult' as Stage, neutered: true, name: 'loss/adult' },
    { goal: 'loss' as Goal, stage: 'senior' as Stage, neutered: false, name: 'loss/senior' },
    
    // gain: stage 3パターン (goal優先で係数同一)
    { goal: 'gain' as Goal, stage: 'kitten' as Stage, neutered: false, name: 'gain/kitten' },
    { goal: 'gain' as Goal, stage: 'adult' as Stage, neutered: true, name: 'gain/adult' },
    { goal: 'gain' as Goal, stage: 'senior' as Stage, neutered: false, name: 'gain/senior' },
  ];

  // 全組み合わせのテーブルテスト
  for (const weight of testWeights) {
    for (const testCase of testCases) {
      test(`体重${weight}kg - ${testCase.name}`, async ({ page }) => {
        // 入力設定
        await page.fill('#weight', weight.toString());
        await page.click(`button[data-value="${testCase.stage}"]`);
        await page.click(`button[data-value="${testCase.goal}"]`);
        
        // adultの場合のみ去勢/避妊設定
        if (testCase.stage === 'adult') {
          const neuteredCheckbox = page.locator('#neutered');
          const isChecked = await neuteredCheckbox.isChecked();
          if (testCase.neutered !== isChecked) {
            await neuteredCheckbox.click({ force: true });
          }
        }

        // 結果が表示されるまで待つ
        await expect(page.locator('#kcal')).toBeVisible();

        // 期待値計算
        const expectedResult = expected(weight, testCase.stage, testCase.goal, testCase.neutered);

        // 結果確認（数値は±0.1kcal許容）
        const actualKcal = await page.locator('#kcal').textContent();
        const actualKcalNum = parseFloat(actualKcal || '0');
        expect(actualKcalNum).toBeCloseTo(expectedResult.kcal, 1);

        // 範囲とファクターは文字列完全一致
        await expect(page.locator('#range')).toHaveText(expectedResult.range);
        await expect(page.locator('#factor')).toHaveText(expectedResult.factor);
      });
    }
  }

  test.describe('体重4.2kgの具体例（仕様書サンプル）', () => {
    const weight = 4.2;

    test('maintain/kitten', async ({ page }) => {
      await page.fill('#weight', weight.toString());
      await page.click('button[data-value="kitten"]');
      await page.click('button[data-value="maintain"]');

      const expectedResult = expected(weight, 'kitten', 'maintain', false);

      await expect(page.locator('#kcal')).toHaveText(expectedResult.kcal.toString());
      await expect(page.locator('#range')).toHaveText(expectedResult.range);
      await expect(page.locator('#factor')).toHaveText(expectedResult.factor);
    });

    test('maintain/adult/去勢済', async ({ page }) => {
      await page.fill('#weight', weight.toString());
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="maintain"]');
      
      // 去勢済みにチェック
      const neuteredCheckbox = page.locator('#neutered');
      if (!(await neuteredCheckbox.isChecked())) {
        await neuteredCheckbox.click();
      }

      await expect(page.locator('#kcal')).toHaveText('246.4');
      await expect(page.locator('#range')).toHaveText('205.4〜328.6 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 1.20（成猫・去勢/避妊済）');
    });

    test('maintain/adult/未去勢', async ({ page }) => {
      await page.fill('#weight', weight.toString());
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="maintain"]');
      
      // 未去勢にする
      const neuteredCheckbox = page.locator('#neutered');
      if (await neuteredCheckbox.isChecked()) {
        await neuteredCheckbox.click();
      }

      await expect(page.locator('#kcal')).toHaveText('287.5');
      await expect(page.locator('#range')).toHaveText('246.4〜328.6 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 1.40（成猫・未去勢/未避妊）');
    });

    test('maintain/senior', async ({ page }) => {
      await page.fill('#weight', weight.toString());
      await page.click('button[data-value="senior"]');
      await page.click('button[data-value="maintain"]');

      await expect(page.locator('#kcal')).toHaveText('246.4');
      await expect(page.locator('#range')).toHaveText('225.9〜287.5 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 1.20（シニアの目安）');
    });

    test('loss（stage無関係）', async ({ page }) => {
      await page.fill('#weight', weight.toString());
      
      // kitten + loss
      await page.click('button[data-value="kitten"]');
      await page.click('button[data-value="loss"]');
      
      await expect(page.locator('#kcal')).toHaveText('174.6');
      await expect(page.locator('#range')).toHaveText('164.3〜205.4 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 0.85（減量の目安）');

      // adult + loss でも同じ結果
      await page.click('button[data-value="adult"]');
      await expect(page.locator('#kcal')).toHaveText('174.6');
      await expect(page.locator('#range')).toHaveText('164.3〜205.4 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 0.85（減量の目安）');

      // senior + loss でも同じ結果
      await page.click('button[data-value="senior"]');
      await expect(page.locator('#kcal')).toHaveText('174.6');
      await expect(page.locator('#range')).toHaveText('164.3〜205.4 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 0.85（減量の目安）');
    });

    test('gain（stage無関係）', async ({ page }) => {
      await page.fill('#weight', weight.toString());
      
      // kitten + gain
      await page.click('button[data-value="kitten"]');
      await page.click('button[data-value="gain"]');
      
      const kcalKitten = await page.locator('#kcal').textContent();
      expect(parseFloat(kcalKitten || '0')).toBe(267.0);
      await expect(page.locator('#range')).toHaveText('246.4〜287.5 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 1.30（増量の目安）');

      // adult + gain でも同じ結果
      await page.click('button[data-value="adult"]');
      const kcalAdult = await page.locator('#kcal').textContent();
      expect(parseFloat(kcalAdult || '0')).toBe(267.0);
      await expect(page.locator('#range')).toHaveText('246.4〜287.5 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 1.30（増量の目安）');

      // senior + gain でも同じ結果
      await page.click('button[data-value="senior"]');
      const kcalSenior = await page.locator('#kcal').textContent();
      expect(parseFloat(kcalSenior || '0')).toBe(267.0);
      await expect(page.locator('#range')).toHaveText('246.4〜287.5 kcal/日');
      await expect(page.locator('#factor')).toHaveText('× 1.30（増量の目安）');
    });
  });

  test.describe('goal優先の確認', () => {
    test('loss選択時は去勢状態に関係なく同じ結果', async ({ page }) => {
      await page.fill('#weight', '4.2');
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="loss"]');

      // 去勢済みの場合
      const neuteredCheckbox = page.locator('#neutered');
      if (!(await neuteredCheckbox.isChecked())) {
        await neuteredCheckbox.click();
      }
      
      const kcalNeutered = await page.locator('#kcal').textContent();
      const rangeNeutered = await page.locator('#range').textContent();
      const factorNeutered = await page.locator('#factor').textContent();

      // 未去勢の場合
      await neuteredCheckbox.click();
      
      const kcalNotNeutered = await page.locator('#kcal').textContent();
      const rangeNotNeutered = await page.locator('#range').textContent();
      const factorNotNeutered = await page.locator('#factor').textContent();

      // 結果が同じであることを確認
      expect(kcalNeutered).toBe(kcalNotNeutered);
      expect(rangeNeutered).toBe(rangeNotNeutered);
      expect(factorNeutered).toBe(factorNotNeutered);
      
      // 期待値との一致確認
      expect(kcalNeutered).toBe('174.6');
      expect(rangeNeutered).toBe('164.3〜205.4 kcal/日');
      expect(factorNeutered).toBe('× 0.85（減量の目安）');
    });

    test('gain選択時は去勢状態に関係なく同じ結果', async ({ page }) => {
      await page.fill('#weight', '4.2');
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="gain"]');

      // 去勢済みの場合
      const neuteredCheckbox = page.locator('#neutered');
      if (!(await neuteredCheckbox.isChecked())) {
        await neuteredCheckbox.click();
      }
      
      const kcalNeutered = await page.locator('#kcal').textContent();
      const rangeNeutered = await page.locator('#range').textContent();
      const factorNeutered = await page.locator('#factor').textContent();

      // 未去勢の場合
      await neuteredCheckbox.click();
      
      const kcalNotNeutered = await page.locator('#kcal').textContent();
      const rangeNotNeutered = await page.locator('#range').textContent();
      const factorNotNeutered = await page.locator('#factor').textContent();

      // 結果が同じであることを確認
      expect(kcalNeutered).toBe(kcalNotNeutered);
      expect(rangeNeutered).toBe(rangeNotNeutered);
      expect(factorNeutered).toBe(factorNotNeutered);
      
      // 期待値との一致確認
      const kcalNeuteredNum = parseFloat(kcalNeutered || '0');
      expect(kcalNeuteredNum).toBe(267.0);
      expect(rangeNeutered).toBe('246.4〜287.5 kcal/日');
      expect(factorNeutered).toBe('× 1.30（増量の目安）');
    });
  });

  test.describe('リアルタイム計算更新', () => {
    test('体重入力でリアルタイム更新', async ({ page }) => {
      // 初期設定
      await page.click('button[data-value="adult"]');
      await page.click('button[data-value="maintain"]');
      
      // 体重を段階的に入力
      await page.fill('#weight', '2');
      await expect(page.locator('#kcal')).not.toHaveText('--');
      
      await page.fill('#weight', '2.5');
      const kcal25 = await page.locator('#kcal').textContent();
      
      await page.fill('#weight', '5.0');
      const kcal50 = await page.locator('#kcal').textContent();
      
      // 体重が増えるとカロリーも増える
      expect(parseFloat(kcal50 || '0')).toBeGreaterThan(parseFloat(kcal25 || '0'));
    });

    test('ステージ変更でリアルタイム更新', async ({ page }) => {
      await page.fill('#weight', '4.2');
      await page.click('button[data-value="maintain"]');
      
      // kitten
      await page.click('button[data-value="kitten"]');
      const kcalKitten = await page.locator('#kcal').textContent();
      
      // adult
      await page.click('button[data-value="adult"]');
      const kcalAdult = await page.locator('#kcal').textContent();
      
      // senior
      await page.click('button[data-value="senior"]');
      const kcalSenior = await page.locator('#kcal').textContent();
      
      // kittenが最も高い
      expect(parseFloat(kcalKitten || '0')).toBeGreaterThan(parseFloat(kcalAdult || '0'));
      expect(parseFloat(kcalKitten || '0')).toBeGreaterThan(parseFloat(kcalSenior || '0'));
    });

    test('目標変更でリアルタイム更新', async ({ page }) => {
      await page.fill('#weight', '4.2');
      await page.click('button[data-value="adult"]');
      
      // maintain
      await page.click('button[data-value="maintain"]');
      const kcalMaintain = await page.locator('#kcal').textContent();
      
      // loss
      await page.click('button[data-value="loss"]');
      const kcalLoss = await page.locator('#kcal').textContent();
      
      // gain
      await page.click('button[data-value="gain"]');
      const kcalGain = await page.locator('#kcal').textContent();
      
      // loss < maintain < gain の順序
      expect(parseFloat(kcalLoss || '0')).toBeLessThan(parseFloat(kcalMaintain || '0'));
      expect(parseFloat(kcalMaintain || '0')).toBeLessThan(parseFloat(kcalGain || '0'));
    });
  });
});
