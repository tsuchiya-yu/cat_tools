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
};

export default function Page() {
  return <CatAgeCalculator />;
}