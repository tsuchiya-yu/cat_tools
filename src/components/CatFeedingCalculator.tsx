"use client";

import React from "react";
import { calcGramsPerDay, normalizeNumberInput, splitMorningNight } from "@/lib/feed";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FeedingFAQ from "@/components/FeedingFAQ";
import FeedingShareMenu from "@/components/FeedingShareMenu";

const RANGE = {
  kcal: { min: 50, max: 1000 },
  density: { min: 50, max: 600 },
};

export default function CatFeedingCalculator() {
  const [dailyKcal, setDailyKcal] = React.useState<string>("");
  const [density, setDensity] = React.useState<string>("");

  // 初期化：URLクエリから復元
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const kcalQ = p.get("kcal");
    const dQ = p.get("d");
    if (kcalQ) setDailyKcal(kcalQ);
    if (dQ) setDensity(dQ);
  }, []);

  // URL 同期（replaceState）
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const k = dailyKcal || "";
    const d = density || "";
    if (k) url.searchParams.set("kcal", k);
    else url.searchParams.delete("kcal");
    if (d) url.searchParams.set("d", d);
    else url.searchParams.delete("d");
    window.history.replaceState(null, "", url);
  }, [dailyKcal, density]);

  // 計算
  const kcalNum = normalizeNumberInput(dailyKcal);
  const densityNum = normalizeNumberInput(density);
  const hasKcalInput = dailyKcal.trim() !== "";
  const hasDensityInput = density.trim() !== "";
  const gramsRaw =
    kcalNum != null &&
    densityNum != null &&
    kcalNum > 0 &&
    densityNum > 0
      ? calcGramsPerDay(kcalNum, densityNum)
      : null;

  const split = gramsRaw != null ? splitMorningNight(gramsRaw) : null;

  const kcalWarnText =
    hasKcalInput &&
    kcalNum != null &&
    (kcalNum < RANGE.kcal.min || kcalNum > RANGE.kcal.max)
      ? `目安の範囲（${RANGE.kcal.min}〜${RANGE.kcal.max}kcal/日）から外れています。結果は参考としてご利用ください。`
      : "";

  const densityWarnText =
    hasDensityInput &&
    densityNum != null &&
    (densityNum < RANGE.density.min || densityNum > RANGE.density.max)
      ? `目安の範囲（${RANGE.density.min}〜${RANGE.density.max}kcal/100g）から外れています。結果は参考としてご利用ください。`
      : "";

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-10">
      {/* Hero */}
      <Breadcrumbs
        items={[
          { label: "ホーム", href: "/" },
          { label: "猫の給餌量計算" },
        ]}
        className="mt-4"
      />

      <section className="section mt-6">
        <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
          必要カロリーから与える量を計算
        </p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">猫の給餌量計算</h1>
        <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
          1日の必要カロリーと、フードのカロリー密度（kcal/100g）から、与える目安量を自動計算します。
        </p>

        {/* 入力セクション：下線 */}
        <div className="surface border-none overflow-hidden border-b border-gray-200">
          <div className="row flex flex-col gap-4">
            {/* kcal */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="kcalInput" className="text-base font-bold text-gray-900">1日の必要カロリー（kcal）</label>
              <input
                id="kcalInput"
                type="number"
                inputMode="decimal"
                placeholder="例：230"
                aria-describedby="kcalHelp kcalWarn"
                value={dailyKcal}
                onChange={(e) => setDailyKcal(e.target.value)}
                className="w-full h-14 px-6 border-2 border-pink-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
              />
              {/* 必要カロリーリンク（ここに移動） */}
              <div className="text-xs text-gray-500">
                必要カロリーが分からない方は
                <Link href="/calculate-cat-calorie" className="text-pink-600 font-bold ml-1">
                  こちら（カロリー計算ツール）
                </Link>
              </div>
              <div id="kcalWarn" className="text-red-700 text-xs mt-1.5 min-h-[1.2em]" aria-live="polite">
                {kcalWarnText}
              </div>
            </div>

            {/* 密度 */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="densityInput" className="text-base font-bold text-gray-900">フードのカロリー（kcal/100g）</label>
              <input
                id="densityInput"
                type="number"
                inputMode="decimal"
                placeholder="例：390"
                aria-describedby="densityHelp densityWarn"
                value={density}
                onChange={(e) => setDensity(e.target.value)}
                className="w-full h-14 px-6 border-2 border-pink-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
              />
              <div id="densityHelp" className="text-xs text-gray-500">
                パッケージの「代謝エネルギー（kcal/100g）」を入力してください
              </div>
              <div id="densityWarn" className="text-red-700 text-xs mt-1.5 min-h-[1.2em]" aria-live="polite">
                {densityWarnText}
              </div>
            </div>

            {/* 画面中段の導線は上（kcal欄）に移動しました */}
          </div>
        </div>
      </section>

      {/* Result（両方入力されたら表示） */}
      {hasKcalInput && hasDensityInput && (
        <section className="section mt-6" aria-live="polite">
          <div className="relative pt-6 pb-4 border-b border-gray-200">
            <div className="text-gray-600 text-[12px] tracking-[0.04em]">1日に与える目安量</div>
            <div className="text-center mt-2">
              <span id="dailyGram" className="numeral tracking-[-.01em] text-5xl md:text-6xl font-extrabold text-pink-600">
                {split ? String(split.totalInt) : "--"}
              </span>
              <span className="text-[18px] md:text-[20px] text-gray-900 relative -top-2 md:-top-3 ml-1">g</span>
            </div>

            <div id="perMeal" className="text-center mt-2 text-[16px] font-bold text-gray-900">
              {split ? `朝 ${split.morning} g / 夜 ${split.night} g` : "朝 -- g / 夜 -- g"}
            </div>
            <div id="note" className="text-center mt-2 text-xs text-gray-500">
              ※あくまで目安です。猫の体型や活動量に合わせて少しずつ調整してください。
            </div>

            {/* 例と補足は下部FAQに移動 */}
            {split && (
              <FeedingShareMenu
                shareText={`うちの猫の給餌量は 1日 ${split.totalInt} g（朝 ${split.morning} g / 夜 ${split.night} g）でした🐾`}
                shareUrl={typeof window !== 'undefined' ? window.location.href : undefined}
              />
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      <FeedingFAQ />
    </main>
  );
}
