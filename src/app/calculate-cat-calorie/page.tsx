import type { Metadata } from "next";
import CatCalorieCalculator from './CatCalorieCalculator';
import JsonLdScript from '@/components/JsonLdScript';
import { CALCULATE_CAT_CALORIE_PATH } from '@/constants/paths';
import { CALORIE_META, CALORIE_UI_TEXT, STRUCTURED_DATA } from '@/constants/text';
import { createPageBreadcrumbList } from '@/lib/breadcrumbStructuredData';

const calorieFaqStructuredData = {
  "@context": "https://schema.org",
  "@type": STRUCTURED_DATA.CALORIE_FAQ.TYPE,
  mainEntity: STRUCTURED_DATA.CALORIE_FAQ.ITEMS,
};

const calorieBreadcrumbStructuredData = createPageBreadcrumbList({
  name: CALORIE_UI_TEXT.BREADCRUMBS.CAT_CALORIE_CALCULATOR,
  path: CALCULATE_CAT_CALORIE_PATH,
});

export const metadata: Metadata = {
  title: CALORIE_META.TITLE,
  description: CALORIE_META.DESCRIPTION,
  keywords: CALORIE_META.KEYWORDS,
  openGraph: {
    title: CALORIE_META.OG.TITLE,
    description: CALORIE_META.OG.DESCRIPTION,
    type: "website",
    locale: "ja_JP",
    url: CALORIE_META.OG.URL,
    siteName: CALORIE_META.OG.SITE_NAME,
    images: [
      {
        url: '/og-cat-calorie.png',
        width: 1200,
        height: 630,
        alt: CALORIE_META.OG.TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: CALORIE_META.OG.TITLE,
    description: CALORIE_META.OG.DESCRIPTION,
    images: ['/og-cat-calorie.png'],
  },
  alternates: {
    canonical: '/calculate-cat-calorie',
  },
};

export default function Page() {
  return (
    <>
      <JsonLdScript data={[calorieFaqStructuredData, calorieBreadcrumbStructuredData]} />
      <CatCalorieCalculator />
    </>
  );
}
