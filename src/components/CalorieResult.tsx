'use client';

import { useMemo } from 'react';
import { CatCalorieResult } from '@/types';
import { CALORIE_UI_TEXT } from '@/constants/text';
import ShareMenu from './ShareMenu';

interface CalorieResultProps {
  result: CatCalorieResult | null;
  isVisible: boolean;
  shareUrl?: string;
}

export default function CalorieResult({ result, isVisible, shareUrl }: CalorieResultProps) {
  if (!isVisible || !result) return null;

  const shareText = useMemo(
    () => CALORIE_UI_TEXT.SHARE.SHARE_TEXT(result.kcal.toString(), result.range),
    [result.kcal, result.range],
  );

  return (
    <section className="section mt-10" aria-live="polite">
      <div className="result relative text-center py-2 pb-6 border-b border-gray-200">
        <div className="text-gray-600 mb-1.5 tracking-wide text-sm">
          {CALORIE_UI_TEXT.RESULT.TITLE}
        </div>

        <div className="big flex items-baseline justify-center gap-3.5 text-[0] flex-wrap">
          <span className="age-group flex items-baseline gap-1.5">
            <span id="kcal" className="numeral text-5xl md:text-7xl font-extrabold text-pink-600 font-mono tracking-tight">
              {result.kcal}
            </span>
            <span className="unit text-lg md:text-xl text-gray-900 relative -top-2 md:-top-2.5">
              {CALORIE_UI_TEXT.RESULT.UNIT}
            </span>
          </span>
        </div>

        {/* 共有ボタン */}
        <ShareMenu
          shareText={shareText}
          shareUrl={shareUrl}
          shareTitle={CALORIE_UI_TEXT.HEADER.TITLE}
          buttonId="shareBtn"
          menuId="shareMenu"
          buttonClassName="absolute right-0 top-0 -translate-y-3/5"
          menuClassName="top-12 border-gray-300 min-w-[220px]"
        />

        {/* モバイルでは縦並び、PCでは横並び */}
        <div className="flex flex-col sm:grid sm:grid-cols-3 mt-8">
          
          {/* 参考幅 */}
          <div className="py-4 sm:py-0">
            <div className="text-sm text-gray-500 mb-1.5">{CALORIE_UI_TEXT.RESULT.DETAILS.RANGE}</div>
            <div id="range" className="font-extrabold text-2xl sm:text-xl">
              {result.range}
            </div>
          </div>

          {/* 係数 */}
          <div className="py-4 sm:py-0 border-t sm:border-t-0 border-pink-100">
            <div className="text-sm text-gray-500 mb-1.5">{CALORIE_UI_TEXT.RESULT.DETAILS.FACTOR}</div>
            <div id="factor" className="font-extrabold text-2xl sm:text-xl">
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
