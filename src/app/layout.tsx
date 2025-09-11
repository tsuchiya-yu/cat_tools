import type { Metadata, Viewport } from "next";
import { Zen_Kaku_Gothic_New, Outfit } from "next/font/google";
import "./globals.css";
import { STRUCTURED_DATA } from '@/constants/text';

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
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://cat-tools.catnote.tokyo/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
        
        {/* ページ固有の構造化データ（猫の年齢計算ツール） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "ねこツールズ",
                    "item": "https://cat-tools.catnote.tokyo"
                  }
                ]
              },
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "猫の年齢計算ツール",
                "url": "https://cat-tools.catnote.tokyo/calculate-cat-age",
                "description": "誕生日を入力するだけで、猫の年齢を人間年齢に換算。ライフステージと次の誕生日までの日数も表示します。",
                "applicationCategory": "CalculatorApplication",
                "operatingSystem": "Any",
                "browserRequirements": "Requires JavaScript",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "JPY"
                }
              },
              {
                "@context": "https://schema.org",
                "@type": STRUCTURED_DATA.FAQ.TYPE,
                "mainEntity": STRUCTURED_DATA.FAQ.ITEMS
              }
            ])
          }}
        />
      </head>
      <body
        className={`${zenKakuGothicNew.variable} ${outfit.variable} antialiased`}
      >
        {children}
        <footer className="section text-gray-500 text-sm mt-10 pb-10">
          <div className="container max-w-3xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
