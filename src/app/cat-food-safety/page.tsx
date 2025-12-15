import type { Metadata } from 'next';
import CatFoodSafetyChecker from './CatFoodSafetyChecker';
import { CAT_FOOD_SAFETY_META } from '@/constants/text';

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

export default function Page() {
  return <CatFoodSafetyChecker />;
}
