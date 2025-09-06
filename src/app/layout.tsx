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
        
        {/* ページ固有の構造化データ（猫の年齢計算ツール） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "猫の年齢計算ツール",
                "url": "https://tools.catnote.tokyo/calculate-cat-age",
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
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "誕生日がはっきり分からないときは？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "だいたいで大丈夫です。月だけ分かるならその月の1日や15日、年だけならその年の7/1など、近い日を入れて目安として使ってください。"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "入力を変えるとすぐ計算されますか？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "はい。日付を変更すると結果が自動で更新されます。"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "どうやって換算しているの？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "目安として、1歳=人の15歳、2歳=24歳、以降は1年ごとに+4歳で計算し、月はなめらかに補間しています。"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "ライフステージは何の役に立つ？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "成長のだいたいの段階が分かります。子猫→若年成猫→成猫→シニアの目安で、遊びや体重管理、無理のない運動などの参考にしてください。"
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "結果は共有できますか？プライバシーは？",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "右上の共有ボタンからURLをコピー・共有できます。サーバーには何も送信されず、URLに含まれるのは誕生日の日付だけです。"
                    }
                  }
                ]
              }
            ])
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
