import type { Metadata } from 'next';
import JsonLdScript from '@/components/JsonLdScript';
import {
  STRUCTURED_DATA,
  WATER_INTAKE_META,
  WATER_INTAKE_UI_TEXT,
} from '@/constants/text';
import { CALCULATE_CAT_WATER_INTAKE_PATH } from '@/constants/paths';
import { createPageBreadcrumbList } from '@/lib/breadcrumbStructuredData';
import { createWebApplicationStructuredData } from '@/lib/webApplicationStructuredData';
import CatWaterIntakeCalculator from './CatWaterIntakeCalculator';

const waterIntakeFaqStructuredData = {
  '@context': 'https://schema.org',
  '@type': STRUCTURED_DATA.WATER_INTAKE_FAQ.TYPE,
  mainEntity: STRUCTURED_DATA.WATER_INTAKE_FAQ.ITEMS,
};

const waterIntakeBreadcrumbStructuredData = createPageBreadcrumbList({
  name: WATER_INTAKE_UI_TEXT.BREADCRUMBS.WATER_INTAKE_CALCULATOR,
  path: CALCULATE_CAT_WATER_INTAKE_PATH,
});

const waterIntakeWebApplicationStructuredData = createWebApplicationStructuredData({
  name: '猫の必要給水量計算',
  url: WATER_INTAKE_META.OG.URL,
  description: '体重とフード量から、総水分目標・食事由来水分・器からの飲水目標を計算します。',
  applicationCategory: 'UtilitiesApplication',
});

export const metadata: Metadata = {
  title: WATER_INTAKE_META.TITLE,
  description: WATER_INTAKE_META.DESCRIPTION,
  keywords: WATER_INTAKE_META.KEYWORDS,
  openGraph: {
    title: WATER_INTAKE_META.OG.TITLE,
    description: WATER_INTAKE_META.OG.DESCRIPTION,
    type: 'website',
    locale: 'ja_JP',
    url: WATER_INTAKE_META.OG.URL,
    siteName: WATER_INTAKE_META.OG.SITE_NAME,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: WATER_INTAKE_META.OG.TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: WATER_INTAKE_META.OG.TITLE,
    description: WATER_INTAKE_META.OG.DESCRIPTION,
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/calculate-cat-water-intake',
  },
};

export default function Page() {
  return (
    <>
      <JsonLdScript
        data={[
          waterIntakeWebApplicationStructuredData,
          waterIntakeFaqStructuredData,
          waterIntakeBreadcrumbStructuredData,
        ]}
      />
      <CatWaterIntakeCalculator />
    </>
  );
}
