'use client';

import { useMemo } from 'react';
import { CatAgeResult } from '@/types';
import ShareMenu from './ShareMenu';
import { UI_TEXT } from '@/constants/text';

interface AgeResultProps {
  result: CatAgeResult;
  isVisible: boolean;
}

export default function AgeResult({ result, isVisible }: AgeResultProps) {
  const shareText = useMemo(() => {
    const baseUrl =
      typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}${window.location.pathname}`
        : 'https://cat-tools.catnote.tokyo/calculate-cat-age';
    return UI_TEXT.SHARE.SHARE_TEXT(result.humanAgeYears, result.humanAgeMonths, baseUrl);
  }, [result.humanAgeYears, result.humanAgeMonths]);

  if (!isVisible) return null;

  return (
    <section className="section" aria-live="polite">
      <div className="result relative text-center py-6" data-testid="calculation-result">
        <div className="text-gray-600 mb-1.5 tracking-wide text-sm">人間に換算すると</div>

        <div className="big flex items-baseline justify-center text-[0]">
          <span className="age-group flex items-baseline gap-1">
            <span className="numeral text-5xl md:text-7xl font-extrabold text-pink-600 font-mono tracking-tight" data-testid="human-age-value">
              {result.humanAgeYears}
            </span>
            <span className="unit text-lg md:text-xl text-gray-900 relative -top-2 md:-top-2.5">歳</span>
          </span>
          <span className="age-group flex items-baseline gap-1">
            <span className="numeral text-5xl md:text-7xl font-extrabold text-pink-600 font-mono tracking-tight">
              {result.humanAgeMonths}
            </span>
            <span className="unit text-lg md:text-xl text-gray-900 relative -top-2 md:-top-2.5">か月</span>
          </span>
        </div>

        <ShareMenu
          shareText={shareText}
          shareTitle={UI_TEXT.HEADER.TITLE}
          buttonClassName="absolute right-0 top-8 -translate-y-1/2"
          menuClassName="top-8 -translate-y-1/10 min-w-[200px]"
        />

        {/* モバイルでは縦並び、PCでは横並び */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 mt-8">

          {/* 実年齢 */}
          <div className="py-4 sm:py-0">
            <div className="text-sm text-gray-500 mb-1.5">実年齢</div>
            <div className="font-extrabold text-2xl sm:text-xl font-mono">
              {result.realAgeYears}歳{result.realAgeMonths}か月
            </div>
          </div>

          {/* ライフステージ */}
          <div className="py-4 sm:py-0 border-t sm:border-t-0 border-pink-100">
            <div className="text-sm text-gray-500 mb-1.5">ライフステージ</div>
            <div className="font-extrabold text-2xl sm:text-xl">
              {result.lifeStage}
            </div>
          </div>

          {/* 次の誕生日まで */}
          <div className="py-4 sm:py-0 border-t sm:border-t-0 border-pink-100">
            <div className="text-sm text-gray-500 mb-1.5">次の誕生日まで</div>
            <div className="font-extrabold text-2xl sm:text-xl font-mono">
              {result.daysUntilBirthday}日
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
