import type { Metadata, Viewport } from "next";
import { Zen_Kaku_Gothic_New, Outfit } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { GA_MEASUREMENT_ID } from '@/lib/gtag';
import { Suspense } from 'react';
import Analytics from '@/components/Analytics';
import {
  CALCULATE_CAT_AGE_PATH,
  CALCULATE_CAT_CALORIE_PATH,
  CALCULATE_CAT_FEEDING_PATH,
  CAT_FOOD_SAFETY_PATH,
} from '@/constants/paths';
import { FOOTER_TEXT } from '@/constants/text';

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-zen-kaku',
  display: 'swap',
});

const outfit = Outfit({
  weight: ['600', '800'],
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | ねこツールズ',
    default: 'ねこツールズ｜飼い主さんのための猫ツール集',
  },
  description: "飼い主さんのために猫に関する便利なツールを集めています。年齢計算、健康管理、お世話のサポートなど、愛猫との生活をより豊かにするためのWebアプリケーション集です。",
  keywords: "猫, ペット, ツール, 飼い主, 年齢計算, 健康管理, お世話",
  authors: [{ name: "ねこツールズ" }],
  creator: "ねこツールズ",
  publisher: "ねこツールズ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://cat-tools.catnote.tokyo'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: "ねこツールズ｜飼い主さんのための猫ツール集",
    description: "飼い主さんのために猫に関する便利なツールを集めています。愛猫との生活をより豊かにするためのWebアプリケーション集です。",
    type: "website",
    locale: "ja_JP",
    url: "https://cat-tools.catnote.tokyo",
    siteName: "ねこツールズ",
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ねこツールズ｜飼い主さんのための猫ツール集',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ねこツールズ｜飼い主さんのための猫ツール集",
    description: "飼い主さんのために猫に関する便利なツールを集めています。愛猫との生活をより豊かにするためのWebアプリケーション集です。",
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Analytics 4 */}
        {GA_MEASUREMENT_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        
        {/* サイト全体の構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "ねこツールズ",
              "url": "https://cat-tools.catnote.tokyo",
              "description": "飼い主さんのために猫に関する便利なツールを集めています。年齢計算、健康管理、お世話のサポートなど、愛猫との生活をより豊かにするためのWebアプリケーション集です。",
              "publisher": {
                "@type": "Organization",
                "name": "ねこツールズ"
              }
            })
          }}
        />
        
      </head>
      <body
        className={`${zenKakuGothicNew.variable} ${outfit.variable} antialiased`}
      >
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        {children}
        <footer className="section text-gray-500 text-sm mt-10 pb-10">
          <div className="container max-w-3xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ツール */}
              <div>
                <h2 className="font-bold mb-2">{FOOTER_TEXT.TOOLS.TITLE}</h2>
                <ul className="space-y-2">
                  <li>
                    <Link href={CAT_FOOD_SAFETY_PATH} className="hover:text-pink-600 transition-colors">
                      {FOOTER_TEXT.TOOLS.LINKS.CAT_FOOD_SAFETY}
                    </Link>
                  </li>
                  <li>
                    <Link href={CALCULATE_CAT_AGE_PATH} className="hover:text-pink-600 transition-colors">
                      {FOOTER_TEXT.TOOLS.LINKS.CALCULATE_CAT_AGE}
                    </Link>
                  </li>
                  <li>
                    <Link href={CALCULATE_CAT_CALORIE_PATH} className="hover:text-pink-600 transition-colors">
                      {FOOTER_TEXT.TOOLS.LINKS.CALCULATE_CAT_CALORIE}
                    </Link>
                  </li>
                  <li>
                    <Link href={CALCULATE_CAT_FEEDING_PATH} className="hover:text-pink-600 transition-colors">
                      {FOOTER_TEXT.TOOLS.LINKS.CALCULATE_CAT_FEEDING}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* 規約 */}
              <div>
                <h2 className="font-bold mb-2">規約</h2>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://cat-link.catnote.tokyo/terms" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-pink-600 transition-colors"
                    >
                      利用規約
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://cat-link.catnote.tokyo/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-pink-600 transition-colors"
                    >
                      プライバシーポリシー
                    </a>
                  </li>
                </ul>
              </div>

              {/* お問い合わせ・SNS */}
              <div>
                <h2 className="font-bold mb-2">お問い合わせ・SNS</h2>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="https://docs.google.com/forms/d/e/1FAIpQLSeGH6AykLYDuxFasGFDUGGuCv72Ejfm1P1SDfPh2Q2RZVOzkg/viewform" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-pink-600 transition-colors"
                    >
                      お問い合わせ
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://x.com/CATLINK_PR" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-pink-600 transition-colors"
                    >
                      SNS
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="text-center mt-8">
              © {new Date().getFullYear()} ねこツールズ
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
