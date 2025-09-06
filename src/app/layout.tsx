import type { Metadata } from "next";
import { Zen_Kaku_Gothic_New, Outfit } from "next/font/google";
import "./globals.css";

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
    template: '%s | CAT LINK tools',
    default: 'CAT LINK tools｜飼い主さんのための猫ツール集',
  },
  description: "飼い主さんのために猫に関する便利なツールを集めています。年齢計算、健康管理、お世話のサポートなど、愛猫との生活をより豊かにするためのWebアプリケーション集です。",
  keywords: "猫, ペット, ツール, 飼い主, 年齢計算, 健康管理, お世話",
  authors: [{ name: "CAT LINK tools" }],
  creator: "CAT LINK tools",
  publisher: "CAT LINK tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tools.catnote.tokyo'),
  openGraph: {
    title: "CAT LINK tools｜飼い主さんのための猫ツール集",
    description: "飼い主さんのために猫に関する便利なツールを集めています。愛猫との生活をより豊かにするためのWebアプリケーション集です。",
    type: "website",
    locale: "ja_JP",
    url: "https://tools.catnote.tokyo",
    siteName: "CAT LINK tools",
  },
  twitter: {
    card: "summary",
    title: "CAT LINK tools｜飼い主さんのための猫ツール集",
    description: "飼い主さんのために猫に関する便利なツールを集めています。愛猫との生活をより豊かにするためのWebアプリケーション集です。",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* サイト全体の構造化データ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CAT LINK tools",
              "url": "https://tools.catnote.tokyo",
              "description": "飼い主さんのために猫に関する便利なツールを集めています。年齢計算、健康管理、お世話のサポートなど、愛猫との生活をより豊かにするためのWebアプリケーション集です。",
              "publisher": {
                "@type": "Organization",
                "name": "CAT LINK tools"
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://tools.catnote.tokyo/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body
        className={`${zenKakuGothicNew.variable} ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
