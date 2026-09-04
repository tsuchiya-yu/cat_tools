import Link from 'next/link';
import type { Guide } from '@/lib/guides';
import { GUIDES_PATH } from '@/constants/paths';

type RelatedGuidesProps = {
  guides: Array<Pick<Guide, 'slug' | 'metadata'>>;
};

export default function RelatedGuides({ guides }: RelatedGuidesProps) {
  if (guides.length === 0) return null;

  return (
    <section className="section mt-10" aria-labelledby="related-guides-title">
      <h2
        id="related-guides-title"
        className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
      >
        関連記事
      </h2>
      <ul className="space-y-3">
        {guides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`${GUIDES_PATH}/${guide.slug}`}
              prefetch={false}
              className="block rounded-xl border border-[var(--border)] bg-white p-4 no-underline transition-shadow hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
            >
              <span className="text-base font-bold text-[var(--text)]">
                {guide.metadata.title}
              </span>
              <span className="mt-1.5 block text-sm text-gray-600 leading-relaxed">
                {guide.metadata.description}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
