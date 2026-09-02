import { test, expect } from '@playwright/test';

const PAGE = '/calculate-cat-water-intake';
const SHARE_TEXT = 'うちの猫の器からの飲水目安は、1日93.6〜173.6mLでした🐾';

test.describe('猫の必要給水量計算 E2E', () => {
  test('入力前に体重別の総水分量早見表が表示される', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.getByRole('heading', { name: '猫の体重別・1日の総水分量早見表' })).toBeVisible();

    const table = page.getByRole('table', { name: '猫の体重2kgから8kgまでの1日の総水分量参考表' });
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader', { name: '体重' })).toHaveAttribute('scope', 'col');
    await expect(table.getByRole('columnheader', { name: '総水分量の参考幅' })).toHaveAttribute('scope', 'col');
    await expect(table.getByRole('columnheader', { name: '中央目安' })).toHaveAttribute('scope', 'col');

    const expectedRows = [
      { weight: '2kg', range: '80〜120mL/日', mid: '100mL/日' },
      { weight: '4kg', range: '160〜240mL/日', mid: '200mL/日' },
      { weight: '8kg', range: '320〜480mL/日', mid: '400mL/日' },
    ];

    for (const expectedRow of expectedRows) {
      const row = table.getByRole('row', { name: new RegExp(`^${expectedRow.weight}`) });
      await expect(row.getByRole('rowheader', { name: expectedRow.weight })).toHaveAttribute('scope', 'row');
      await expect(row).toContainText(expectedRow.range);
      await expect(row).toContainText(expectedRow.mid);
    }

    await expect(page.getByText('食事に含まれる水分も合わせた量であり')).toBeVisible();
    await expect(page.getByText('器から飲む水の量そのものではありません')).toBeVisible();
    await expect(page.getByRole('heading', { name: '体重とフード量から詳しく計算する' })).toBeVisible();
    await expect(page.locator('#weightInput')).toHaveValue('');
  });

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

    const journalLink = page.getByRole('link', {
      name: 'Journal of Animal Science: 猫の水分摂取に関するスコーピングレビュー',
    });
    await expect(journalLink).toHaveAttribute(
      'href',
      'https://academic.oup.com/jas/article/doi/10.1093/jas/skaf434/8379605',
    );
    await expect(journalLink).toHaveAttribute('target', '_blank');
    await expect(journalLink).toHaveAttribute('rel', 'noopener noreferrer');

    const aahaLink = page.getByRole('link', { name: '2024 AAHA Fluid Therapy Guidelines for Dogs and Cats' });
    await expect(aahaLink).toHaveAttribute(
      'href',
      'https://www.aaha.org/resources/2024-aaha-fluid-therapy-guidelines-for-dogs-and-cats/',
    );
    await expect(aahaLink).toHaveAttribute('target', '_blank');
    await expect(aahaLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('入力・計算結果・URL同期が従来どおり動作する', async ({ page }) => {
    await page.goto(PAGE);

    await expect(page.getByRole('button', { name: '共有メニューを開く' })).toHaveCount(0);

    await page.locator('#weightInput').fill('4');
    await expect(page).toHaveURL(/weight=4/);
    await page.locator('#dryFoodInput').fill('40');
    await expect(page).toHaveURL(/dry=40/);
    await page.locator('#wetFoodInput').fill('80');

    await expect(page).toHaveURL(`${PAGE}?weight=4&dry=40&wet=80`);
    await expect(page.locator('#totalWaterResult')).toContainText('160〜240 mL');
    await expect(page.getByText('中央目安 200 mL', { exact: true })).toBeVisible();
    await expect(page.locator('#foodWaterResult')).toContainText('66.4 mL');
    await expect(page.locator('#drinkTargetResult')).toContainText('93.6〜173.6');
    await expect(page.getByRole('button', { name: '共有メニューを開く' })).toBeVisible();
  });

  test('復元した結果をXへ正しい文面・URL・ハッシュタグで共有できる', async ({ page }) => {
    await page.goto(`${PAGE}?weight=4&dry=40&wet=80`);

    await expect(page.locator('#drinkTargetResult')).toContainText('93.6〜173.6');
    await page.getByRole('button', { name: '共有メニューを開く' }).click();

    const xShare = page.getByRole('menuitem', { name: 'Xでシェア' });
    const href = await xShare.getAttribute('href');
    expect(href).not.toBeNull();

    const intentUrl = new URL(href!);
    expect(intentUrl.origin + intentUrl.pathname).toBe('https://x.com/intent/post');
    expect(intentUrl.searchParams.get('text')).toBe(SHARE_TEXT);
    expect(intentUrl.searchParams.get('url')).toBe(
      'http://127.0.0.1:3000/calculate-cat-water-intake?weight=4&dry=40&wet=80',
    );
    expect(intentUrl.searchParams.get('hashtags')).toBe('ねこツールズ,猫の給水量計算');
    expect(intentUrl.searchParams.getAll('text')).toHaveLength(1);
    expect(intentUrl.searchParams.getAll('url')).toHaveLength(1);
    expect(intentUrl.searchParams.getAll('hashtags')).toHaveLength(1);
  });

  test('Web Share APIにはハッシュタグを含めず、コピーはURLだけを渡す', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'share', {
        configurable: true,
        value: (data: ShareData) => {
          (window as typeof window & { __shareData?: ShareData }).__shareData = data;
          return Promise.resolve();
        },
      });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: (value: string) => {
            (window as typeof window & { __copiedText?: string }).__copiedText = value;
            return Promise.resolve();
          },
        },
      });
    });
    await page.goto(`${PAGE}?weight=4`);

    const shareButton = page.getByRole('button', { name: '共有メニューを開く' });
    await shareButton.click();
    await page.getByRole('menuitem', { name: '共有する' }).click();

    const nativePayload = await page.evaluate(() =>
      (window as typeof window & { __shareData?: ShareData }).__shareData,
    );
    expect(nativePayload).toEqual({
      title: '猫の必要給水量計算',
      text: 'うちの猫の器からの飲水目安は、1日160〜240mLでした🐾',
      url: 'http://127.0.0.1:3000/calculate-cat-water-intake?weight=4',
    });
    expect(nativePayload?.text).not.toContain('#');

    await shareButton.click();
    await page.getByRole('menuitem', { name: 'リンクをコピー' }).click();
    const copiedText = await page.evaluate(() =>
      (window as typeof window & { __copiedText?: string }).__copiedText,
    );
    expect(copiedText).toBe('http://127.0.0.1:3000/calculate-cat-water-intake?weight=4');
  });

  test('共有メニューが画面幅からはみ出さない', async ({ page }) => {
    await page.goto(`${PAGE}?weight=4&dry=40&wet=80`);
    await page.getByRole('button', { name: '共有メニューを開く' }).click();

    const menu = page.getByRole('menu', { name: '共有メニュー' });
    await expect(menu).toBeVisible();
    const box = await menu.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport!.width);
  });
});
