import type { Metadata } from 'next';
import GuideCard from '@/components/guides/GuideCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLdScript from '@/components/JsonLdScript';
import { GUIDES_PATH } from '@/constants/paths';
import { getPublishedGuides } from '@/lib/guides';
import { createPageBreadcrumbList } from '@/lib/breadcrumbStructuredData';

const GUIDES_TITLE = 'ガイド・読みもの';
const GUIDES_DESCRIPTION =
  '猫との暮らしで迷いやすい食事・年齢・食べ物などについて、ねこツールズの関連ツールとあわせて解説するガイド・読みものです。';

export const metadata: Metadata = {
  title: GUIDES_TITLE,
  description: GUIDES_DESCRIPTION,
  alternates: {
    canonical: GUIDES_PATH,
  },
  openGraph: {
    title: GUIDES_TITLE,
    description: GUIDES_DESCRIPTION,
    type: 'website',
    locale: 'ja_JP',
    url: GUIDES_PATH,
    siteName: 'ねこツールズ',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: GUIDES_TITLE,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: GUIDES_TITLE,
    description: GUIDES_DESCRIPTION,
    images: ['/og.png'],
  },
};

const breadcrumbStructuredData = createPageBreadcrumbList({
  name: GUIDES_TITLE,
  path: GUIDES_PATH,
});

export default function GuidesIndexPage() {
  const guides = getPublishedGuides();

  return (
    <>
      <JsonLdScript data={breadcrumbStructuredData} />
      <main className="container max-w-3xl mx-auto px-6 pb-12">
        <Breadcrumbs
          items={[{ label: 'ホーム', href: '/' }, { label: GUIDES_TITLE }]}
          className="mt-4"
        />

        <section className="section mt-6" aria-labelledby="guides-index-title">
          <h1
            id="guides-index-title"
            className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0"
          >
            {GUIDES_TITLE}
          </h1>
          <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
            {GUIDES_DESCRIPTION}
          </p>
        </section>

        <section className="section mt-4 space-y-4" aria-label="公開ガイド一覧">
          {guides.length === 0 ? (
            <p className="text-sm text-gray-600 leading-relaxed">
              公開中のガイドはまだありません。近日公開予定です。
            </p>
          ) : (
            guides.map((guide) => <GuideCard key={guide.slug} guide={guide} />)
          )}
        </section>
      </main>
    </>
  );
}
