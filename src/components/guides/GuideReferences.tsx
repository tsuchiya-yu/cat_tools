import type { GuideReference } from '@/lib/guides/types';

type GuideReferencesProps = {
  references: GuideReference[];
};

export default function GuideReferences({ references }: GuideReferencesProps) {
  if (references.length === 0) return null;

  return (
    <section className="section mt-10" aria-labelledby="guide-references-title">
      <h2
        id="guide-references-title"
        className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
      >
        参考情報
      </h2>
      <ul className="space-y-3">
        {references.map((reference) => (
          <li key={`${reference.label}-${reference.url}`} className="text-sm leading-relaxed">
            <a
              href={reference.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex max-w-full flex-col gap-0.5 text-pink-600 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded break-all"
            >
              <span className="font-semibold break-words">{reference.label}</span>
              <span className="text-xs text-gray-500 break-all">{reference.url}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
