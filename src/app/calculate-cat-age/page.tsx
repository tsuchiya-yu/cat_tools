import type { Metadata } from "next";
import CatAgeCalculator from './CatAgeCalculator';

export const metadata: Metadata = {
  title: "猫の年齢計算｜誕生日から人間年齢に換算【無料ツール】",
  description: "誕生日を入力するだけで、猫の年齢を人間年齢に換算。ライフステージと次の誕生日までの日数も表示します。入力はブラウザ内のみで安全。",
  keywords: "猫, 年齢計算, 人間年齢, ライフステージ, 誕生日, ペット",
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
  alternates: {
    canonical: '/calculate-cat-age',
  },
  other: {
    'application/ld+json': JSON.stringify([
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
  }
};

export default function Page() {
  return <CatAgeCalculator />;
}