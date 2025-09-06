'use client';

import { useState, useEffect } from 'react';
import { calculateCatAge } from '@/lib/catAge';
import { CatAgeResult } from '@/types';
import DateInput from '@/components/DateInput';
import AgeResult from '@/components/AgeResult';
import FAQ from '@/components/FAQ';

export default function CatAgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<CatAgeResult | null>(null);
  const [error, setError] = useState('');

  // URL パラメータから初期値を設定
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dobParam = params.get('dob');
    if (dobParam) {
      setBirthDate(dobParam);
      handleCalculate(dobParam);
    }
  }, []);

  const handleCalculate = (dateValue: string) => {
    setError('');
    
    if (!dateValue) {
      setError('誕生日を入力してください。');
      setResult(null);
      return;
    }

    const birthDateObj = new Date(dateValue);
    const today = new Date();
    
    if (birthDateObj > today) {
      setError('未来日は指定できません。');
      setResult(null);
      return;
    }

    try {
      const calculatedResult = calculateCatAge(dateValue);
      setResult(calculatedResult);
      
      // URL を更新
      const url = new URL(window.location.href);
      url.searchParams.set('dob', dateValue);
      window.history.replaceState(null, '', url.toString());
    } catch (err) {
      setError('計算中にエラーが発生しました。');
      setResult(null);
    }
  };

  const handleDateChange = (value: string) => {
    setBirthDate(value);
    handleCalculate(value);
  };

  return (
    <>
      <main className="container max-w-3xl mx-auto px-6 pb-10">
        {/* Hero Section */}
        <section className="section mt-6">
          <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 opacity-85 mt-6">
            猫の年齢を人間年齢に換算
          </p>
          <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
            猫の年齢計算ツール
          </h1>
          <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
            誕生日を入力するだけで、人間年齢・ライフステージ・次の誕生日までを表示します。
          </p>

          <div className="surface p-6 border-none border-b border-gray-200 overflow-hidden">
            <DateInput
              value={birthDate}
              onChange={handleDateChange}
              error={error}
            />
          </div>
        </section>

        {/* Result Section */}
        <AgeResult 
          result={result!} 
          isVisible={!!result} 
        />

        {/* FAQ Section */}
        <FAQ />

        {/* Footer */}
        <footer className="section text-gray-500 text-sm mt-10">
          © {new Date().getFullYear()} CAT LINK tools
        </footer>
      </main>

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
    </>
  );
}
