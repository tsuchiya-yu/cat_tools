'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { pageview, isGAEnabled } from '@/lib/gtag';

/**
 * Google Analytics ページビュー追跡コンポーネント
 * 初回ページビューはGoogleAnalyticsScriptに任せ、
 * App Routerでのクライアントサイドナビゲーションのみ追跡する
 */
export default function Analytics() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (!pathname) return;

    const previousPath = previousPathname.current;
    previousPathname.current = pathname;

    if (!isGAEnabled() || !previousPath || previousPath === pathname) return;

    pageview(pathname);
  }, [pathname]);

  return null;
}
