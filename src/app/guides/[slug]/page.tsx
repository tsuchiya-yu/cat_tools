import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import GuideArticle from '@/components/guides/GuideArticle';
import JsonLdScript from '@/components/JsonLdScript';
import { SITE_CONFIG } from '@/config/site';
import { GUIDES_PATH } from '@/constants/paths';
import {
  getAuthorById,
  getGuideBySlug,
  getPublishedGuides,
  isSafeSlug,
} from '@/lib/guides';
import { createArticleStructuredData } from '@/lib/guideStructuredData';
import { createBreadcrumbList } from '@/lib/breadcrumbStructuredData';

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getPublishedGuides({ includeContent: false }).map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isSafeSlug(slug)) {
    return {};
  }

  const guide = getGuideBySlug(slug);
  if (!guide) {
    return {};
  }

  const { metadata } = guide;
  const canonicalPath = `${GUIDES_PATH}/${slug}`;
  const author = getAuthorById(metadata.author);

  return {
    title: metadata.title,
    description: metadata.description,
    authors: author ? [{ name: author.name, url: author.url }] : undefined,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'article',
      locale: 'ja_JP',
      url: canonicalPath,
      siteName: SITE_CONFIG.NAME,
      publishedTime: metadata.publishedAt,
      modifiedTime: metadata.updatedAt,
      images: [
        {
          url: '/og.png',
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: ['/og.png'],
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  if (!isSafeSlug(slug)) {
    notFound();
  }

  const guide = getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  const author = getAuthorById(guide.metadata.author);
  if (!author) {
    notFound();
  }

  const canonicalPath = `${GUIDES_PATH}/${slug}`;
  const articleStructuredData = createArticleStructuredData({
    headline: guide.metadata.title,
    description: guide.metadata.description,
    path: canonicalPath,
    datePublished: guide.metadata.publishedAt,
    dateModified: guide.metadata.updatedAt,
    author,
  });

  const breadcrumbStructuredData = createBreadcrumbList([
    { name: 'ねこツールズ', path: '/' },
    { name: 'ガイド・読みもの', path: GUIDES_PATH },
    { name: guide.metadata.title, path: canonicalPath },
  ]);

  return (
    <>
      <JsonLdScript data={[articleStructuredData, breadcrumbStructuredData]} />
      <main className="container max-w-3xl mx-auto px-6 pb-12">
        <GuideArticle guide={guide} />
      </main>
    </>
  );
}
