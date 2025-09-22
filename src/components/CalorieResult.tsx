'use client';

import { CatCalorieResult } from '@/types';
import { CALORIE_UI_TEXT } from '@/constants/text';
import CalorieShareMenu from './CalorieShareMenu';

interface CalorieResultProps {
  result: CatCalorieResult | null;
  isVisible: boolean;
}

export default function CalorieResult({ result, isVisible }: CalorieResultProps) {
  if (!isVisible || !result) return null;

  return (
    <section className="section mt-10" aria-live="polite">
      <div className="result relative text-center py-2 pb-6 border-b border-gray-200">
        <div className="text-gray-600 mb-1.5 tracking-wide text-sm">
          {CALORIE_UI_TEXT.RESULT.TITLE}
        </div>

        <div className="big flex items-baseline justify-center gap-3.5 text-[0] flex-wrap">
          <span className="age-group flex items-baseline gap-1.5">
            <span className="numeral text-5xl md:text-7xl font-extrabold text-pink-600 font-mono tracking-tight">
              {result.kcal}
            </span>
            <span className="unit text-lg md:text-xl text-gray-900 relative -top-2 md:-top-2.5">
              {CALORIE_UI_TEXT.RESULT.UNIT}
            </span>
          </span>
        </div>

        {/* 共有ボタン */}
        <CalorieShareMenu 
          kcal={result.kcal.toString()}
          range={result.range}
        />

        {/* モバイルでは縦並び、PCでは横並び */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 mt-8">
          
          {/* 参考幅 */}
          <div className="py-4 sm:py-0">
            <div className="text-sm text-gray-500 mb-1.5">{CALORIE_UI_TEXT.RESULT.DETAILS.RANGE}</div>
            <div className="font-extrabold text-2xl sm:text-xl">
              {result.range}
            </div>
          </div>

          {/* 係数 */}
          <div className="py-4 sm:py-0 border-t sm:border-t-0 border-pink-100">
            <div className="text-sm text-gray-500 mb-1.5">{CALORIE_UI_TEXT.RESULT.DETAILS.FACTOR}</div>
            <div className="font-extrabold text-2xl sm:text-xl">
              {result.factor}
            </div>
          </div>

          {/* 計算式 */}
          <div className="py-4 sm:py-0 border-t sm:border-t-0 border-pink-100">
            <div className="text-sm text-gray-500 mb-1.5">{CALORIE_UI_TEXT.RESULT.DETAILS.FORMULA}</div>
            <div className="font-extrabold text-2xl sm:text-xl">
              {CALORIE_UI_TEXT.RESULT.FORMULA_TEXT}
            </div>
          </div>

          {/* メモ（全幅） */}
          <div className="py-4 sm:py-0 border-t border-pink-100 sm:col-span-3 sm:border-t-2 sm:pt-6 sm:mt-4">
            <div className="text-sm text-gray-500 mb-1.5">{CALORIE_UI_TEXT.RESULT.DETAILS.NOTE}</div>
            <div className="text-lg">
              {result.note}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
