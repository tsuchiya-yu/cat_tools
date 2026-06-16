import { test, expect } from '@playwright/test';

type JsonLdObject = Record<string, unknown>;

type WebApplication = JsonLdObject & {
  '@type': 'WebApplication';
  name: string;
  url: string;
  description: string;
  applicationCategory: string;
  operatingSystem: string;
  inLanguage: string;
  isAccessibleForFree: boolean;
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
  };
};

const toolPages = [
  {
    path: '/calculate-cat-age',
    name: '猫の年齢計算',
    url: 'https://cat-tools.catnote.tokyo/calculate-cat-age',
    description: '誕生日から猫の年齢を人間年齢の目安に換算し、ライフステージも確認できます。',
    applicationCategory: 'UtilitiesApplication',
    hasFaq: true,
  },
  {
    path: '/calculate-cat-calorie',
    name: '猫のカロリー計算',
    url: 'https://cat-tools.catnote.tokyo/calculate-cat-calorie',
    description:
      '猫の体重、ライフステージ、去勢/避妊、維持・減量・増量の目標から、1日に必要なカロリー（kcal/日）を自動計算。標準値と参考幅を表示し、フード量を見直す目安として使えます。',
    applicationCategory: 'UtilitiesApplication',
    hasFaq: true,
  },
  {
    path: '/calculate-cat-feeding',
    name: '猫の給餌量計算',
    url: 'https://cat-tools.catnote.tokyo/calculate-cat-feeding',
    description: '1日の必要カロリーとフードのカロリー密度から、1日量と朝夜の目安量を計算します。',
    applicationCategory: 'UtilitiesApplication',
    hasFaq: false,
  },
  {
    path: '/calculate-cat-water-intake',
    name: '猫の必要給水量計算',
    url: 'https://cat-tools.catnote.tokyo/calculate-cat-water-intake',
    description: '体重とフード量から、総水分目標・食事由来水分・器からの飲水目標を計算します。',
    applicationCategory: 'UtilitiesApplication',
    hasFaq: true,
  },
  {
    path: '/cat-food-safety',
    name: '猫の食べ物安全性チェック',
    url: 'https://cat-tools.catnote.tokyo/cat-food-safety',
    description: '食材名から猫にとって安全・注意・危険の目安を確認できます。',
    applicationCategory: 'ReferenceApplication',
    hasFaq: true,
  },
] as const;

function flattenJsonLd(payload: unknown): JsonLdObject[] {
  if (Array.isArray(payload)) {
    return payload.flatMap(flattenJsonLd);
  }
  if (payload && typeof payload === 'object') {
    return [payload as JsonLdObject];
  }
  return [];
}

function isWebApplication(value: JsonLdObject): value is WebApplication {
  return value['@type'] === 'WebApplication';
}

test.describe('WebApplication JSON-LD', () => {
  for (const toolPage of toolPages) {
    test(`${toolPage.path} に統一形式の WebApplication が出力される`, async ({ page }) => {
      await page.goto(toolPage.path);

      const jsonLdObjects = (
        await page.locator('script[type="application/ld+json"]').allTextContents()
      ).flatMap((text) => flattenJsonLd(JSON.parse(text)));

      const webApplications = jsonLdObjects.filter(isWebApplication);
      expect(webApplications).toHaveLength(1);
      expect(webApplications[0]).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: toolPage.name,
        url: toolPage.url,
        description: toolPage.description,
        applicationCategory: toolPage.applicationCategory,
        operatingSystem: 'Any',
        inLanguage: 'ja',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'JPY',
        },
      });
      expect(jsonLdObjects.some((item) => item['@type'] === 'BreadcrumbList')).toBe(true);
      expect(jsonLdObjects.some((item) => item['@type'] === 'FAQPage')).toBe(toolPage.hasFaq);
    });
  }
});
