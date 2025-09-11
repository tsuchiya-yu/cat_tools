'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { pageview, isGAEnabled } from '@/lib/gtag';

/**
 * Google Analytics ページビュー追跡コンポーネント
 * App Routerでのクライアントサイドナビゲーションを追跡
 */
export default function Analytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isGAEnabled) return;

    const url = pathname + searchParams.toString();
    pageview(url);
  }, [pathname, searchParams]);

  return null;
}
