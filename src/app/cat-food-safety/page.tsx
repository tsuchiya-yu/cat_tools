import type { Metadata } from 'next';
import CatFoodSafetyChecker from './CatFoodSafetyChecker';
import { CAT_FOOD_SAFETY_META } from '@/constants/text';
import { getAllCatFoods } from '@/lib/catFoodSafety';

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

const getSingleParam = (value?: string | string[]) => (Array.isArray(value) ? value[0] ?? '' : value ?? '');

export default function Page({ searchParams }: PageProps) {
  const allFoods = getAllCatFoods();
  const initialFood = getSingleParam(searchParams?.food).trim();
  return <CatFoodSafetyChecker allFoods={allFoods} initialFood={initialFood} />;
}
