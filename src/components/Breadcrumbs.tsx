import Link from 'next/link';
import React from 'react';

export type BreadcrumbItem = {
  label: string;
  href?: string; // undefined for current page
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  ariaLabel?: string;
  tabbable?: boolean; // false の場合はリンクをタブ移動対象にしない
};

export default function Breadcrumbs({
  items,
  className = '',
  ariaLabel = 'breadcrumb',
  tabbable = true,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className={`${className} text-sm text-gray-600`}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;

          return (
            <React.Fragment key={item.label}>
              <li
                aria-current={item.href ? undefined : 'page'}
                className={
                  isLast
                    ? 'min-w-0 max-w-full break-words'
                    : 'shrink-0 whitespace-nowrap'
                }
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-pink-600 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded"
                    tabIndex={tabbable ? undefined : -1}
                  >
                    {item.label}
                  </Link>
                ) : (
                  item.label
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true" className="shrink-0 text-gray-400">
                  /
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
