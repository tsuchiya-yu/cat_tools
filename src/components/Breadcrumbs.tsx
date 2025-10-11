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
};

export default function Breadcrumbs({
  items,
  className = 'mt-4',
  ariaLabel = 'breadcrumb',
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label={ariaLabel} className={`${className} text-sm text-gray-600`}>
      <ol className="flex items-center gap-2">
        {items.map((item, idx) => (
          <React.Fragment key={`${item.label}-${idx}`}>
            <li aria-current={item.href ? undefined : 'page'} className={item.href ? undefined : 'text-gray-600'}>
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-pink-600 hover:text-pink-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-600 rounded"
                >
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </li>
            {idx < items.length - 1 && (
              <li aria-hidden="true" className="text-gray-400">
                /
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

