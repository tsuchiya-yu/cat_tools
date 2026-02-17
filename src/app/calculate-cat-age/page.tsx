import type { Metadata } from "next";
import CatAgeCalculator from './CatAgeCalculator';
import JsonLdScript from '@/components/JsonLdScript';
import { CALCULATE_CAT_AGE_PATH } from '@/constants/paths';
import { META, FAQ_ITEMS, UI_TEXT } from '@/constants/text';
import { createPageBreadcrumbList } from '@/lib/breadcrumbStructuredData';

const ageBreadcrumbStructuredData = createPageBreadcrumbList({
  name: UI_TEXT.BREADCRUMBS.CAT_AGE_CALCULATOR,
  path: CALCULATE_CAT_AGE_PATH,
});

const ageStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "猫の年齢計算ツール",
    "url": META.OG.URL,
    "description": META.DESCRIPTION,
    "applicationCategory": "CalculatorApplication",
    "operatingSystem": "Any",
    "browserRequirements": "Requires JavaScript",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQ_ITEMS.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  },
  ageBreadcrumbStructuredData,
];

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
  return (
    <>
      <JsonLdScript data={ageStructuredData} />
      <CatAgeCalculator />
    </>
  );
}
