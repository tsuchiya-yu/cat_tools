import Link from 'next/link';
import type { ReactNode } from 'react';
import { createGuideError, getToolById } from '@/lib/guides';

type RelatedToolProps = {
  tool: string;
};

export default function RelatedTool({ tool }: RelatedToolProps) {
  const toolData = getToolById(tool);
  if (!toolData) {
    throw createGuideError(`unknown tool id in RelatedTool: ${tool}`, undefined, 'tool');
  }

  return (
    <aside className="my-6 rounded-xl border border-pink-200 bg-pink-50/70 p-4">
      <p className="text-xs font-semibold tracking-wide text-pink-700">関連ツール</p>
      <Link
        href={toolData.href}
        prefetch={false}
        className="mt-2 block no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded"
      >
        <span className="text-base font-bold text-[var(--text)]">{toolData.title}</span>
        <span className="mt-1 block text-sm text-gray-700 leading-relaxed">
          {toolData.description}
        </span>
        <span className="mt-2 inline-block text-sm font-semibold text-pink-600">
          使ってみる →
        </span>
      </Link>
    </aside>
  );
}

type GuideNoteProps = {
  children: ReactNode;
};

export function GuideNote({ children }: GuideNoteProps) {
  return (
    <aside
      className="my-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950"
      role="note"
    >
      {children}
    </aside>
  );
}
