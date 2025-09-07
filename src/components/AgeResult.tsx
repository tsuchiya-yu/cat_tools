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

        <div className="grid grid-cols-3 gap-0 mt-4.5">
          <div className="cell bg-transparent border-l border-pink-200 px-4 py-3.5 first:border-l-0">
            <div className="k text-xs uppercase tracking-wide text-gray-500 text-center">実年齢</div>
            <div className="v font-bold text-base text-center mt-1.5">
              {result.realAgeYears}年{result.realAgeMonths}か月
            </div>
          </div>
          <div className="cell bg-transparent border-l border-pink-200 px-4 py-3.5">
            <div className="k text-xs uppercase tracking-wide text-gray-500 text-center">ライフステージ</div>
            <div className="v font-bold text-base text-center mt-1.5">{result.lifeStage}</div>
          </div>
          <div className="cell bg-transparent border-l border-pink-200 px-4 py-3.5">
            <div className="k text-xs uppercase tracking-wide text-gray-500 text-center">次の誕生日まで</div>
            <div className="v font-bold text-base text-center mt-1.5">{result.daysUntilBirthday}日</div>
          </div>
        </div>
      </div>
    </section>
  );
}
