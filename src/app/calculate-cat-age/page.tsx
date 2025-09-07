import type { Metadata } from "next";
import CatAgeCalculator from './CatAgeCalculator';
import { META, STRUCTURED_DATA } from '@/constants/text';

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
  },
  twitter: {
    card: "summary",
    title: META.OG.TITLE,
    description: META.OG.DESCRIPTION,
  },
  alternates: {
    canonical: '/calculate-cat-age',
  },
  other: {
    'application/ld+json': JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "猫の年齢計算ツール",
        "url": "https://tools.catnote.tokyo/calculate-cat-age",
        "description": "誕生日を入力するだけで、猫の年齢を人間年齢に換算。ライフステージと次の誕生日までの日数も表示します。",
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
        "@type": STRUCTURED_DATA.FAQ.TYPE,
        "mainEntity": STRUCTURED_DATA.FAQ.ITEMS
      }
    ])
  }
};

export default function Page() {
  return <CatAgeCalculator />;
}