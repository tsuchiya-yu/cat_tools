import { test, expect } from '@playwright/test';

const SITE_URL = 'https://cat-tools.catnote.tokyo';

type JsonLdObject = Record<string, unknown>;

function flattenJsonLd(payload: unknown): JsonLdObject[] {
  if (Array.isArray(payload)) {
    return payload.flatMap(flattenJsonLd);
  }
  if (payload && typeof payload === 'object') {
    return [payload as JsonLdObject];
  }
  return [];
}

const targetPages = [
  {
    path: '/',
    description:
      '猫の年齢換算、1日の必要カロリー・給餌量・水分量の計算、食べ物の安全性チェックを無料で使える「ねこツールズ」。各ツールの計算方法や参考情報も確認でき、愛猫の健康管理や日々のお世話の目安として利用できます。',
    canonical: SITE_URL,
    socialDescription:
      '飼い主さんのために猫に関する便利なツールを集めています。愛猫との生活をより豊かにするためのWebアプリケーション集です。',
  },
  {
    path: '/calculate-cat-age',
    description:
      '猫の誕生日から実年齢を人間年齢の目安に換算し、ライフステージと次の誕生日までの日数を確認できる無料ツールです。保護猫など誕生日が不明な場合も、推定日を入力して今後のケアを考える目安にできます。',
    canonical: `${SITE_URL}/calculate-cat-age`,
    socialDescription: '誕生日を入れるだけで、猫の年齢を人間年齢に換算。ライフステージも表示。',
  },
  {
    path: '/calculate-cat-water-intake',
    description:
      '猫の体重から1日の総水分目標を参考幅で計算。ドライ・ウェットフードの量を入力すると、食事由来の水分量を差し引き、器から飲む水の目安も確認できます。飲水記録やフード変更後の見直しに使える無料ツールです。',
    canonical: `${SITE_URL}/calculate-cat-water-intake`,
    socialDescription: '体重とフード量から、猫の1日の総水分目標と器からの飲水目安を計算します。',
  },
  {
    path: '/cat-food-safety',
    description:
      '玉ねぎやチョコレートなど200種類以上の食材を検索し、猫にとっての安全性を「安全・注意・危険」の目安で確認できます。危険な理由、起こりやすい症状、与える際の注意点も掲載。誤食や体調不良時は獣医師へ相談してください。',
    canonical: `${SITE_URL}/cat-food-safety`,
    socialDescription: '食材名を入れるだけで、猫にとって安全かどうかを判定します。',
  },
  {
    path: '/about',
    description:
      '猫の年齢・カロリー・給餌量・水分量・食べ物の安全性を確認できる「ねこツールズ」の目的、開発のきっかけ、運営者「つくしの飼い主」、参考情報の扱い、ご利用時の注意点を紹介します。',
    canonical: `${SITE_URL}/about`,
  },
  {
    path: '/terms',
    description:
      'ねこツールズが提供する猫向け計算・チェックツールの利用条件を定めた規約です。サービス内容、医療判断に関する注意、禁止事項、知的財産権、サービス停止、免責事項、共有機能の注意などを確認できます。',
    canonical: `${SITE_URL}/terms`,
  },
  {
    path: '/privacy',
    description:
      'ねこツールズで取得するお問い合わせ情報・アクセス情報とその利用目的、Google AnalyticsやCookie、外部サービス、第三者提供、情報管理、共有URLに関する注意、お問い合わせ方法を定めたプライバシーポリシーです。',
    canonical: `${SITE_URL}/privacy`,
  },
] as const;

test.describe('主要ページのmetadata', () => {
  for (const targetPage of targetPages) {
    test(`${targetPage.path} に固有のdescriptionとcanonicalが出力される`, async ({ page }) => {
      await page.goto(targetPage.path);

      const description = page.locator('meta[name="description"]');
      await expect(description).toHaveCount(1);
      await expect(description).toHaveAttribute('content', targetPage.description);
      expect((await description.getAttribute('content'))?.trim()).not.toBe('');

      const canonical = page.locator('link[rel="canonical"]');
      await expect(canonical).toHaveCount(1);
      await expect(canonical).toHaveAttribute('href', targetPage.canonical);

      if ('socialDescription' in targetPage) {
        await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
          'content',
          targetPage.socialDescription,
        );
        await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
          'content',
          targetPage.socialDescription,
        );
      }
    });
  }

  test('カロリー計算のdescriptionは変更されていない', async ({ page }) => {
    await page.goto('/calculate-cat-calorie');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      '猫の体重、ライフステージ、去勢/避妊、維持・減量・増量の目標から、1日に必要なカロリー（kcal/日）を自動計算。標準値と参考幅を表示し、フード量を見直す目安として使えます。',
    );
  });

  test('トップページのWebSite JSON-LDは新しいdescriptionを使用する', async ({ page }) => {
    await page.goto('/');

    const jsonLdObjects = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) => flattenJsonLd(JSON.parse(text)));
    const website = jsonLdObjects.find((item) => item['@type'] === 'WebSite');

    expect(website).toMatchObject({
      '@type': 'WebSite',
      description: targetPages[0].description,
    });
  });

  test('AboutのmetadataとAboutPage・ProfilePage JSON-LDでdescriptionが一致する', async ({ page }) => {
    await page.goto('/about');

    const description = targetPages.find((targetPage) => targetPage.path === '/about')?.description;
    expect(description).toBeTruthy();

    const jsonLdObjects = (
      await page.locator('script[type="application/ld+json"]').allTextContents()
    ).flatMap((text) => flattenJsonLd(JSON.parse(text)));
    const graph = jsonLdObjects.flatMap((item) => flattenJsonLd(item['@graph']));

    for (const type of ['AboutPage', 'ProfilePage']) {
      expect(graph.find((item) => item['@type'] === type)).toMatchObject({
        '@type': type,
        description,
      });
    }
  });
});
