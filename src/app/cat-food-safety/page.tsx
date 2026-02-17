import type { Metadata } from 'next';
import CatFoodSafetyChecker from './CatFoodSafetyChecker';
import JsonLdScript from '@/components/JsonLdScript';
import { CAT_FOOD_SAFETY_PATH } from '@/constants/paths';
import { CAT_FOOD_SAFETY_META, CAT_FOOD_SAFETY_TEXT, STRUCTURED_DATA } from '@/constants/text';
import { createPageBreadcrumbList } from '@/lib/breadcrumbStructuredData';
import { getAllCatFoods } from '@/lib/catFoodSafety';
import { getSingleParam } from '@/lib/searchParams';

export const metadata: Metadata = {
  title: CAT_FOOD_SAFETY_META.TITLE,
  description: CAT_FOOD_SAFETY_META.DESCRIPTION,
  keywords: CAT_FOOD_SAFETY_META.KEYWORDS,
  openGraph: {
    title: CAT_FOOD_SAFETY_META.OG.TITLE,
    description: CAT_FOOD_SAFETY_META.OG.DESCRIPTION,
    type: 'website',
    locale: 'ja_JP',
    url: CAT_FOOD_SAFETY_META.OG.URL,
    siteName: CAT_FOOD_SAFETY_META.OG.SITE_NAME,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: CAT_FOOD_SAFETY_META.OG.TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: CAT_FOOD_SAFETY_META.OG.TITLE,
    description: CAT_FOOD_SAFETY_META.OG.DESCRIPTION,
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/cat-food-safety',
  },
};

type PageProps = {
  searchParams?: {
    food?: string | string[];
  };
};

const catFoodSafetyBreadcrumbStructuredData = createPageBreadcrumbList({
  name: CAT_FOOD_SAFETY_TEXT.BREADCRUMBS.CAT_FOOD_SAFETY,
  path: CAT_FOOD_SAFETY_PATH,
});

const catFoodSafetyFaqStructuredData = {
  '@context': 'https://schema.org',
  '@type': STRUCTURED_DATA.CAT_FOOD_SAFETY_FAQ.TYPE,
  mainEntity: STRUCTURED_DATA.CAT_FOOD_SAFETY_FAQ.ITEMS,
};

export default function Page({ searchParams }: PageProps) {
  const allFoods = getAllCatFoods();
  const initialFood = getSingleParam(searchParams?.food).trim();
  return (
    <>
      <JsonLdScript data={catFoodSafetyBreadcrumbStructuredData} />
      <JsonLdScript data={catFoodSafetyFaqStructuredData} />
      <CatFoodSafetyChecker allFoods={allFoods} initialFood={initialFood} />
    </>
  );
}
