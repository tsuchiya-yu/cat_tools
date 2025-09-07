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
    <main className="container max-w-3xl mx-auto px-6 pb-10">
        {/* Hero Section */}
        <section className="section mt-6">
          <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 opacity-85 mt-6">
            猫の年齢を人間年齢に換算
          </p>
          <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
            猫の年齢計算ツール
          </h1>
          <p className="lead text-sm text-gray-600 mt-2.5 mb-0 leading-relaxed">
            誕生日を入力するだけで、人間年齢・ライフステージ・次の誕生日までを表示します。
          </p>

          <div className="surface p-4 border-none overflow-hidden">
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
  );
}
