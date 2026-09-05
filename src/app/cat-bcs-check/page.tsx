import type { Metadata } from 'next';
import JsonLdScript from '@/components/JsonLdScript';
import { CAT_BCS_CHECK_PATH } from '@/constants/paths';
import {
  CAT_BCS_CHECK_META,
  CAT_BCS_CHECK_UI_TEXT,
  STRUCTURED_DATA,
} from '@/constants/text';
import { createPageBreadcrumbList } from '@/lib/breadcrumbStructuredData';
import { createWebApplicationStructuredData } from '@/lib/webApplicationStructuredData';
import CatBcsCheck from './CatBcsCheck';

export const metadata: Metadata = {
  title: CAT_BCS_CHECK_META.TITLE,
  description: CAT_BCS_CHECK_META.DESCRIPTION,
  keywords: CAT_BCS_CHECK_META.KEYWORDS,
  openGraph: {
    title: CAT_BCS_CHECK_META.OG.TITLE,
    description: CAT_BCS_CHECK_META.OG.DESCRIPTION,
    type: 'website',
    locale: 'ja_JP',
    url: CAT_BCS_CHECK_META.OG.URL,
    siteName: CAT_BCS_CHECK_META.OG.SITE_NAME,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: CAT_BCS_CHECK_META.OG.TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: CAT_BCS_CHECK_META.OG.TITLE,
    description: CAT_BCS_CHECK_META.OG.DESCRIPTION,
    images: ['/og.png'],
  },
  alternates: {
    canonical: CAT_BCS_CHECK_PATH,
  },
};

const breadcrumbStructuredData = createPageBreadcrumbList({
  name: CAT_BCS_CHECK_UI_TEXT.BREADCRUMBS.CAT_BCS_CHECK,
  path: CAT_BCS_CHECK_PATH,
});

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': STRUCTURED_DATA.CAT_BCS_CHECK_FAQ.TYPE,
  mainEntity: STRUCTURED_DATA.CAT_BCS_CHECK_FAQ.ITEMS,
};

const webApplicationStructuredData = createWebApplicationStructuredData({
  name: '猫の肥満度チェック（BCS）',
  url: CAT_BCS_CHECK_META.OG.URL,
  description: '肋骨・腰・お腹の観察から、猫の体型（BCS）の目安を家庭で確認できます。',
  applicationCategory: 'UtilitiesApplication',
});

export default function Page() {
  return (
    <>
      <JsonLdScript
        data={[webApplicationStructuredData, faqStructuredData, breadcrumbStructuredData]}
      />
      <CatBcsCheck />
    </>
  );
}
