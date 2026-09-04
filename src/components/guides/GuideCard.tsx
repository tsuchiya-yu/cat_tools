import Link from 'next/link';
import {
  formatGuideDate,
  getCategoryLabel,
  type Guide,
} from '@/lib/guides';
import { GUIDES_PATH } from '@/constants/paths';

type GuideCardProps = {
  guide: Pick<Guide, 'slug' | 'metadata'>;
};

export default function GuideCard({ guide }: GuideCardProps) {
  const { metadata, slug } = guide;
  const showUpdated = metadata.updatedAt !== metadata.publishedAt;

  return (
    <Link
      href={`${GUIDES_PATH}/${slug}`}
      prefetch={false}
      className="block rounded-xl border border-[var(--border)] bg-white p-5 no-underline transition-shadow hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
    >
      <p className="text-xs font-semibold tracking-wide text-pink-600">
        {getCategoryLabel(metadata.category)}
      </p>
      <h2 className="mt-2 text-xl font-bold text-[var(--text)]">{metadata.title}</h2>
      <p className="mt-1.5 text-sm text-gray-600 leading-relaxed">{metadata.description}</p>
      <p className="mt-3 text-xs text-gray-500">
        公開日: {formatGuideDate(metadata.publishedAt)}
        {showUpdated ? ` ／ 更新日: ${formatGuideDate(metadata.updatedAt)}` : ''}
      </p>
      <span className="mt-3 inline-block text-sm font-semibold text-pink-600">読む →</span>
    </Link>
  );
}
