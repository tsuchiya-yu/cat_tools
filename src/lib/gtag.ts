/**
 * Google Analytics 4 (GA4) ユーティリティ
 */

type GtagConfigParams = {
  page_path?: string;
  send_page_view?: boolean;
  event_category?: string;
  event_label?: string;
  value?: number;
};

type GtagEventParams = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

// GA4測定ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

const queuedPageviews: string[] = [];
const queuedEvents: GtagEventParams[] = [];

const canUseWindow = () => typeof window !== 'undefined';
const hasMeasurementId = () => Boolean(GA_MEASUREMENT_ID);
const hasGtag = () => canUseWindow() && typeof window.gtag === 'function';

const sendPageview = (url: string) => {
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

const sendEvent = ({ action, category, label, value }: GtagEventParams) => {
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

// GA4が有効かチェック
export const isGAEnabled = () => hasMeasurementId() && canUseWindow();

// 遅延ロード中に溜めた pageview を送信
export const flushQueuedPageviews = () => {
  if (!hasMeasurementId() || !hasGtag() || queuedPageviews.length === 0) return;

  const pendingPageviews = queuedPageviews.splice(0, queuedPageviews.length);

  for (const url of pendingPageviews) {
    sendPageview(url);
  }
};

// 遅延ロード中に溜めた event を送信
export const flushQueuedEvents = () => {
  if (!hasMeasurementId() || !hasGtag() || queuedEvents.length === 0) return;

  const pendingEvents = queuedEvents.splice(0, queuedEvents.length);

  for (const queuedEvent of pendingEvents) {
    sendEvent(queuedEvent);
  }
};

// ページビューをトラッキング
export const pageview = (url: string) => {
  if (!isGAEnabled()) return;

  if (!hasGtag()) {
    queuedPageviews.push(url);
    return;
  }

  // 先にキューを送って順序を保つ
  flushQueuedPageviews();
  sendPageview(url);
};

// イベントをトラッキング
export const event = ({ action, category, label, value }: GtagEventParams) => {
  if (!isGAEnabled()) return;

  const eventParams = { action, category, label, value };
  if (!hasGtag()) {
    queuedEvents.push(eventParams);
    return;
  }

  flushQueuedEvents();
  sendEvent(eventParams);
};

// gtag関数の型定義
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      target: string,
      config?: GtagConfigParams
    ) => void;
    dataLayer?: unknown[];
  }
}
