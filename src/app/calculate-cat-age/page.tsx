import type { Metadata } from "next";
import CatAgeCalculator from './CatAgeCalculator';
import { META } from '@/constants/text';

export const metadata: Metadata = {
  title: META.TITLE,
  description: META.DESCRIPTION,
  keywords: META.KEYWORDS,
  openGraph: {
    title: META.OG.TITLE,
    description: META.OG.DESCRIPTION,
    type: "website",
    locale: "ja_JP",
    url: META.OG.URL,
    siteName: META.OG.SITE_NAME,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: META.OG.TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: META.OG.TITLE,
    description: META.OG.DESCRIPTION,
    images: ['/og.png'],
  },
  alternates: {
    canonical: '/calculate-cat-age',
  },
};

export default function Page() {
  return <CatAgeCalculator />;
}