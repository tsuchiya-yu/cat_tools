'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageview, isGAEnabled } from '@/lib/gtag';

/**
 * Google Analytics ページビュー追跡コンポーネント
 * App Routerでのクライアントサイドナビゲーションを追跡
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isGAEnabled() || !pathname) return;

    pageview(pathname);
  }, [pathname]);

  return null;
}
