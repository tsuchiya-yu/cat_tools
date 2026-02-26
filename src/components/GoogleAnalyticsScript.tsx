'use client';

import Script from 'next/script';
import { flushQueuedPageviews, GA_MEASUREMENT_ID } from '@/lib/gtag';

export default function GoogleAnalyticsScript() {
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
          window.gtag('js', new Date());
          window.gtag('config', '${GA_MEASUREMENT_ID}', {
            send_page_view: false,
          });
        `}
      </Script>
      <Script
        id="ga4-script"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        onLoad={() => {
          flushQueuedPageviews();
        }}
      />
    </>
  );
}
