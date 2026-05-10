import { test, expect } from '@playwright/test';

const PAGE = '/calculate-cat-water-intake';

test.describe('猫の必要給水量計算 E2E', () => {
  test('参考情報セクションと外部リンクが表示される', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.getByRole('heading', { name: '猫の1日に必要な水分量はどう決まる？' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '水を飲みすぎるときは注意' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '計算方法の参考情報' })).toBeVisible();

    const merckLink = page.getByRole('link', {
      name: 'Merck Veterinary Manual: Nutritional Requirements of Small Animals',
    });
    await expect(merckLink).toHaveAttribute(
      'href',
      'https://www.merckvetmanual.com/management-and-nutrition/nutrition-small-animals/nutritional-requirements-of-small-animals',
    );
    await expect(merckLink).toHaveAttribute('target', '_blank');
    await expect(merckLink).toHaveAttribute('rel', 'noopener noreferrer');

    const cornellLink = page.getByRole('link', { name: 'Cornell Feline Health Center: Hydration' });
    await expect(cornellLink).toHaveAttribute(
      'href',
      'https://www.vet.cornell.edu/departments-centers-and-institutes/cornell-feline-health-center/health-information/feline-health-topics/hydration',
    );
    await expect(cornellLink).toHaveAttribute('target', '_blank');
    await expect(cornellLink).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
