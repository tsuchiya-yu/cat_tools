import Link from 'next/link';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Breadcrumbs from '@/components/Breadcrumbs';
import GuideReferences from '@/components/guides/GuideReferences';
import RelatedGuides from '@/components/guides/RelatedGuides';
import RelatedTools from '@/components/guides/RelatedTools';
import { guideMdxComponents } from '@/components/guides/guideMdxComponents';
import { ABOUT_PATH, GUIDES_PATH } from '@/constants/paths';
import {
  formatGuideDate,
  getAuthorById,
  getCategoryLabel,
  getPublishedGuides,
  type Guide,
} from '@/lib/guides';

type GuideArticleProps = {
  guide: Guide;
};

export default async function GuideArticle({ guide }: GuideArticleProps) {
  const { metadata, content } = guide;
  const author = getAuthorById(metadata.author);
  if (!author) {
    throw new Error(`Unknown author: ${metadata.author}`);
  }

  const publishedBySlug = new Map(
    getPublishedGuides({ includeContent: false }).map((item) => [item.slug, item]),
  );
  const relatedGuides = metadata.relatedGuides
    .map((relatedSlug) => publishedBySlug.get(relatedSlug))
    .filter((item): item is Guide => item !== undefined);

  const showUpdated = metadata.updatedAt !== metadata.publishedAt;

  return (
    <article>
      <Breadcrumbs
        items={[
          { label: 'ホーム', href: '/' },
          { label: 'ガイド・読みもの', href: GUIDES_PATH },
          { label: metadata.title },
        ]}
        className="mt-4"
      />

      <header className="section mt-6">
        <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
          {getCategoryLabel(metadata.category)}
        </p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
          {metadata.title}
        </h1>
        <p className="lead text-sm text-gray-600 mt-2.5 mb-4 leading-relaxed">
          {metadata.description}
        </p>
        <p className="text-xs text-gray-500 leading-relaxed">
          公開日: {formatGuideDate(metadata.publishedAt)}
          {showUpdated ? ` ／ 更新日: ${formatGuideDate(metadata.updatedAt)}` : ''}
          {' ／ '}
          著者:{' '}
          <Link
            href={author.url}
            prefetch={false}
            className="text-pink-600 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded"
          >
            {author.name}
          </Link>
        </p>
      </header>

      <div className="guide-prose section mt-8">
        <MDXRemote source={content} components={guideMdxComponents} />
      </div>

      <GuideReferences references={metadata.references} />
      <RelatedTools toolIds={metadata.relatedTools} />
      <RelatedGuides guides={relatedGuides} />

      <section className="section mt-10 rounded-xl border border-gray-200 bg-gray-50/80 p-5">
        <h2 className="text-base font-bold text-[var(--text)]">ご利用にあたって</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          この記事の内容は一般的な情報の整理であり、獣医学的な診断・治療・投薬判断を行うものではありません。
          愛猫の体調や食事に不安がある場合は、自己判断せず獣医師へ相談してください。
        </p>
        <p className="mt-3 text-sm">
          <Link
            href={ABOUT_PATH}
            prefetch={false}
            className="font-semibold text-pink-600 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded"
          >
            ねこツールズについて →
          </Link>
        </p>
      </section>
    </article>
  );
}
