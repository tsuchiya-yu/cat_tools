'use client';

import { CatAgeResult } from '@/types';
import ShareMenu from './ShareMenu';

interface AgeResultProps {
  result: CatAgeResult;
  isVisible: boolean;
}

export default function AgeResult({ result, isVisible }: AgeResultProps) {
  if (!isVisible) return null;

  return (
    <section className="section" aria-live="polite">
      <div className="result relative text-center py-6">
        <div className="text-gray-600 mb-1.5 tracking-wide text-sm">人間に換算すると</div>

        <div className="big flex items-baseline justify-center gap-2.5 text-[0]">
          <span className="age-group flex items-baseline gap-1">
            <span className="numeral text-5xl md:text-7xl font-extrabold text-pink-600 font-mono tracking-tight">
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
          humanAgeYears={result.humanAgeYears}
          humanAgeMonths={result.humanAgeMonths}
        />

        {/* モバイルでは縦並び、PCでは横並び */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 mt-8">
          {/* PCでの区切り線 */}
          <div className="hidden sm:block absolute left-1/3 top-1/2 -translate-y-1/2 w-px h-16 bg-pink-200"></div>
          <div className="hidden sm:block absolute left-2/3 top-1/2 -translate-y-1/2 w-px h-16 bg-pink-200"></div>

          {/* 実年齢 */}
          <div className="py-4 sm:py-0">
            <div className="text-sm text-gray-500 mb-1.5">実年齢</div>
            <div className="font-extrabold text-2xl sm:text-xl font-mono">
              {result.realAgeYears}年{result.realAgeMonths}か月
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
