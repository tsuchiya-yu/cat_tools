import { test, expect } from '@playwright/test';

const CTA_LABEL = '猫の給餌量計算で、1日に与えるグラム数を確認する';

test.describe('カロリー計算結果の給餌量CTA', () => {
  test('計算結果のkcalを給餌量計算へ引き継ぐ', async ({ page }) => {
    await page.goto('/calculate-cat-calorie');

    const cta = page.getByRole('link', { name: CTA_LABEL });
    await expect(cta).toHaveCount(0);

    await page.fill('#weight', '4.2');

    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute(
      'href',
      '/calculate-cat-feeding?kcal=246.4',
    );

    await cta.click();

    await expect(page).toHaveURL(/\/calculate-cat-feeding\?kcal=246\.4$/);
    await expect(page.locator('#kcalInput')).toHaveValue('246.4');
    await expect(page.locator('#densityInput')).toHaveValue('');
  });
});
