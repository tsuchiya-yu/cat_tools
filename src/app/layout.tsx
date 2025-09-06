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
  title: "猫の年齢計算｜誕生日から人間年齢に換算【無料ツール】",
  description: "誕生日を入力するだけで、猫の年齢を人間年齢に換算。ライフステージと次の誕生日までの日数も表示します。入力はブラウザ内のみで安全。",
  keywords: "猫, 年齢計算, 人間年齢, ライフステージ, 誕生日, ペット",
  authors: [{ name: "CAT LINK tools" }],
  creator: "CAT LINK tools",
  publisher: "CAT LINK tools",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://tools.catnote.tokyo'),
  alternates: {
    canonical: '/calculate-cat-age',
  },
  openGraph: {
    title: "猫の年齢計算｜人間年齢に換算",
    description: "誕生日を入れるだけで、猫の年齢を人間年齢に換算。ライフステージも表示。",
    type: "website",
    locale: "ja_JP",
    url: "https://tools.catnote.tokyo/calculate-cat-age",
    siteName: "CAT LINK tools",
  },
  twitter: {
    card: "summary",
    title: "猫の年齢計算｜人間年齢に換算",
    description: "誕生日を入れるだけで、猫の年齢を人間年齢に換算。ライフステージも表示。",
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
      </head>
      <body
        className={`${zenKakuGothicNew.variable} ${outfit.variable} antialiased`}
      >
        {children}
        
        {/* 構造化データ */}
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
      </body>
    </html>
  );
}
