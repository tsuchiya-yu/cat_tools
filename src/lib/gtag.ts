/**
 * Google Analytics 4 (GA4) ユーティリティ
 */

// GA4測定ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

// GA4が有効かチェック
export const isGAEnabled = GA_MEASUREMENT_ID && typeof window !== 'undefined';

// ページビューをトラッキング
export const pageview = (url: string) => {
  if (!isGAEnabled) return;
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

// イベントをトラッキング
export const event = ({ action, category, label, value }: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!isGAEnabled) return;

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// gtag関数の型定義
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
      }
    ) => void;
  }
}
