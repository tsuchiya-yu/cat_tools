import Link from 'next/link';
import { getToolById } from '@/lib/guides';

type RelatedToolsProps = {
  toolIds: string[];
};

export default function RelatedTools({ toolIds }: RelatedToolsProps) {
  if (toolIds.length === 0) return null;

  const tools = toolIds
    .map((toolId) => {
      const tool = getToolById(toolId);
      return tool ? { id: toolId, ...tool } : null;
    })
    .filter((tool): tool is NonNullable<typeof tool> => tool !== null);

  if (tools.length === 0) return null;

  return (
    <section className="section mt-10" aria-labelledby="related-tools-title">
      <h2
        id="related-tools-title"
        className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight"
      >
        関連ツール
      </h2>
      <ul className="space-y-3">
        {tools.map((tool) => (
          <li key={tool.id}>
            <Link
              href={tool.href}
              prefetch={false}
              aria-label={tool.ariaLabel}
              className="block rounded-xl border border-[var(--border)] bg-white p-4 no-underline transition-shadow hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600"
            >
              <span className="text-base font-bold text-[var(--text)]">{tool.title}</span>
              <span className="mt-1.5 block text-sm text-gray-600 leading-relaxed">
                {tool.description}
              </span>
              <span className="mt-2 inline-block text-sm font-semibold text-pink-600">
                使ってみる →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
