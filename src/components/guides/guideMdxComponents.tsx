import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import RelatedTool, { GuideNote } from '@/components/guides/RelatedTool';

function isExternalHref(href: string | undefined): boolean {
  if (!href) return false;
  return /^https?:\/\//i.test(href) || href.startsWith('//');
}

function GuideLink({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) {
  const resolvedHref = href ?? '#';

  if (resolvedHref.startsWith('javascript:')) {
    return <span className="text-gray-700">{children}</span>;
  }

  if (isExternalHref(resolvedHref)) {
    return (
      <a
        {...props}
        href={resolvedHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-pink-600 underline underline-offset-2 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded break-all"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={resolvedHref}
      prefetch={false}
      className="text-pink-600 underline underline-offset-2 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded break-all"
    >
      {children}
    </Link>
  );
}

function GuideTable({ children }: { children?: ReactNode }) {
  return (
    <div className="my-6 w-full overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="min-w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export const guideMdxComponents = {
  h2: (props: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      {...props}
      className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
    />
  ),
  h3: (props: ComponentPropsWithoutRef<'h3'>) => (
    <h3 {...props} className="mt-6 mb-2 text-lg font-bold tracking-tight text-balance" />
  ),
  p: (props: ComponentPropsWithoutRef<'p'>) => (
    <p {...props} className="my-3 text-sm leading-relaxed text-gray-800 text-pretty" />
  ),
  ul: (props: ComponentPropsWithoutRef<'ul'>) => (
    <ul {...props} className="my-3 list-disc space-y-1 pl-5 text-sm leading-relaxed text-gray-800" />
  ),
  ol: (props: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      {...props}
      className="my-3 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-gray-800"
    />
  ),
  li: (props: ComponentPropsWithoutRef<'li'>) => <li {...props} className="leading-relaxed" />,
  strong: (props: ComponentPropsWithoutRef<'strong'>) => (
    <strong {...props} className="font-bold text-[var(--text)]" />
  ),
  a: GuideLink,
  blockquote: (props: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      {...props}
      className="my-4 border-l-4 border-pink-200 bg-pink-50/50 px-4 py-3 text-sm leading-relaxed text-gray-800"
    />
  ),
  table: GuideTable,
  thead: (props: ComponentPropsWithoutRef<'thead'>) => (
    <thead {...props} className="bg-gray-50 text-left" />
  ),
  th: (props: ComponentPropsWithoutRef<'th'>) => (
    <th
      {...props}
      className="border-b border-[var(--border)] px-3 py-2 font-semibold text-[var(--text)] whitespace-nowrap"
    />
  ),
  td: (props: ComponentPropsWithoutRef<'td'>) => (
    <td {...props} className="border-b border-[var(--border)] px-3 py-2 text-gray-800" />
  ),
  code: (props: ComponentPropsWithoutRef<'code'>) => (
    <code
      {...props}
      className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[0.85em] text-gray-900 break-all"
    />
  ),
  pre: (props: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      {...props}
      className="my-4 overflow-x-auto rounded-xl bg-gray-900 p-4 text-sm text-gray-100"
    />
  ),
  RelatedTool,
  GuideNote,
};
