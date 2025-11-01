"use client";

import React from "react";
import { calcGramsPerDay, normalizeNumberInput, splitMorningNight } from "@/lib/feed";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FeedingFAQ from "@/components/FeedingFAQ";
import FeedingShareMenu from "@/components/FeedingShareMenu";
import { FEEDING_UI_TEXT, FEEDING_RANGE } from "@/constants/text";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type FeedingInputGroupProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  help: React.ReactNode;
  warnText: string;
  helpId?: string;
  warnId?: string;
};

function FeedingInputGroup({
  id,
  label,
  placeholder,
  value,
  onChange,
  help,
  warnText,
  helpId,
  warnId,
}: FeedingInputGroupProps) {
  const resolvedHelpId = helpId ?? `${id}Help`;
  const resolvedWarnId = warnId ?? `${id}Warn`;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-bold text-gray-900">{label}</label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        aria-describedby={`${resolvedHelpId} ${resolvedWarnId}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-6 border-2 border-pink-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
      />
      <div id={resolvedHelpId} className="text-xs text-gray-500">
        {help}
      </div>
      <div id={resolvedWarnId} className="text-red-700 text-xs mt-1.5 min-h-[1.2em]" aria-live="polite">
        {warnText}
      </div>
    </div>
  );
}

export default function CatFeedingCalculator() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const dailyKcalFromURL = searchParams.get("kcal") ?? "";
  const densityFromURL = searchParams.get("d") ?? "";

  const [dailyKcal, setDailyKcal] = React.useState<string>(dailyKcalFromURL);
  const [density, setDensity] = React.useState<string>(densityFromURL);

  // URL変更（戻る/進む等）に合わせて state を同期
  React.useEffect(() => {
    setDailyKcal((current) => (current === dailyKcalFromURL ? current : dailyKcalFromURL));
  }, [dailyKcalFromURL]);

  React.useEffect(() => {
    setDensity((current) => (current === densityFromURL ? current : densityFromURL));
  }, [densityFromURL]);

  const updateQueryParam = React.useCallback(
    (key: string, value: string) => {
      if (typeof window === "undefined" || !pathname) return;

      const params = new URLSearchParams(window.location.search);
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const nextQuery = params.toString();
      const nextPath = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      if (nextPath === pathname + window.location.search) return;
      router.replace(nextPath, { scroll: false });
    },
    [pathname, router],
  );

  const handleDailyKcalChange = React.useCallback(
    (value: string) => {
      setDailyKcal(value);
      updateQueryParam("kcal", value);
    },
    [updateQueryParam],
  );

  const handleDensityChange = React.useCallback(
    (value: string) => {
      setDensity(value);
      updateQueryParam("d", value);
    },
    [updateQueryParam],
  );

  // 計算（useMemoで最小化）
  const kcalNum = React.useMemo(() => normalizeNumberInput(dailyKcal), [dailyKcal]);
  const densityNum = React.useMemo(() => normalizeNumberInput(density), [density]);
  const hasKcalInput = React.useMemo(() => dailyKcal.trim() !== "", [dailyKcal]);
  const hasDensityInput = React.useMemo(() => density.trim() !== "", [density]);
  const gramsRaw = React.useMemo(() => {
    if (kcalNum == null || densityNum == null) return undefined;
    if (!(kcalNum > 0) || !(densityNum > 0)) return undefined;
    return calcGramsPerDay(kcalNum, densityNum);
  }, [kcalNum, densityNum]);

  const split = React.useMemo(() => (gramsRaw != null ? splitMorningNight(gramsRaw) : undefined), [gramsRaw]);

  const kcalWarnText = React.useMemo(() => (
    hasKcalInput &&
    kcalNum != null &&
    (kcalNum < FEEDING_RANGE.kcal.min || kcalNum > FEEDING_RANGE.kcal.max)
      ? FEEDING_UI_TEXT.WARNINGS.KCAL_RANGE(FEEDING_RANGE.kcal.min, FEEDING_RANGE.kcal.max)
      : ""
  ), [hasKcalInput, kcalNum]);

  const densityWarnText = React.useMemo(() => (
    hasDensityInput &&
    densityNum != null &&
    (densityNum < FEEDING_RANGE.density.min || densityNum > FEEDING_RANGE.density.max)
      ? FEEDING_UI_TEXT.WARNINGS.DENSITY_RANGE(FEEDING_RANGE.density.min, FEEDING_RANGE.density.max)
      : ""
  ), [hasDensityInput, densityNum]);

  const pathWithQuery = React.useMemo(() => {
    if (!pathname) return '';
    const params = new URLSearchParams();
    if (dailyKcal) params.set('kcal', dailyKcal);
    if (density) params.set('d', density);
    const queryString = params.toString();
    return queryString ? `${pathname}?${queryString}` : pathname;
  }, [pathname, dailyKcal, density]);

  // 共有URL（メモ化）
  const shareUrl = React.useMemo(() => {
    if (!pathWithQuery || typeof window === 'undefined') return '';
    return `${window.location.origin}${pathWithQuery}`;
  }, [pathWithQuery]);

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-10">
      {/* Hero */}
      <Breadcrumbs
        items={[
          { label: FEEDING_UI_TEXT.BREADCRUMBS.HOME, href: "/" },
          { label: FEEDING_UI_TEXT.BREADCRUMBS.FEEDING_CALCULATOR },
        ]}
        className="mt-4"
      />

      <section className="section mt-6">
        <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
          {FEEDING_UI_TEXT.HEADER.EYECATCH}
        </p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">{FEEDING_UI_TEXT.HEADER.TITLE}</h1>
        <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">{FEEDING_UI_TEXT.HEADER.DESCRIPTION}</p>

        {/* 入力セクション：下線 */}
        <div className="surface border-none overflow-hidden border-b border-gray-200">
          <div className="row flex flex-col gap-4">
            {/* kcal */}
            <FeedingInputGroup
              id="kcalInput"
              label="1日の必要カロリー（kcal）"
              placeholder="例：230"
              value={dailyKcal}
              onChange={handleDailyKcalChange}
              help={
                <>
                  必要カロリーが分からない方は
                  <Link href="/calculate-cat-calorie" className="text-pink-600 font-bold ml-1">
                    {FEEDING_UI_TEXT.LINKS.CALORIE_TOOL}
                  </Link>
                </>
              }
              warnText={kcalWarnText}
              helpId="kcalHelp"
              warnId="kcalWarn"
            />

            {/* 密度 */}
            <FeedingInputGroup
              id="densityInput"
              label="フードのカロリー（kcal/100g）"
              placeholder="例：390"
              value={density}
              onChange={handleDensityChange}
              help="パッケージの「代謝エネルギー（kcal/100g）」を入力してください"
              warnText={densityWarnText}
              helpId="densityHelp"
              warnId="densityWarn"
            />

            {/* 画面中段の導線は上（kcal欄）に移動しました */}
          </div>
        </div>
      </section>

      {/* Result（両方入力されたら表示） */}
      {hasKcalInput && hasDensityInput && (
        <section className="section mt-6" aria-live="polite">
          <div className="relative pt-6 pb-4 border-b border-gray-200">
            <div className="text-gray-600 text-[12px] tracking-[0.04em]">{FEEDING_UI_TEXT.RESULT.TITLE}</div>
            <div className="text-center mt-2">
              <span id="dailyGram" className="numeral tracking-[-.01em] text-5xl md:text-6xl font-extrabold text-pink-600">
                {split ? String(split.totalInt) : "--"}
              </span>
              <span className="text-[18px] md:text-[20px] text-gray-900 relative -top-2 md:-top-3 ml-1">g</span>
            </div>

            <div id="perMeal" className="text-center mt-2 text-[16px] font-bold text-gray-900">
              {split ? `朝 ${split.morning} g / 夜 ${split.night} g` : "朝 -- g / 夜 -- g"}
            </div>
            <div id="note" className="text-center mt-2 text-xs text-gray-500">{FEEDING_UI_TEXT.RESULT.NOTE}</div>

            {/* 例と補足は下部FAQに移動 */}
            {split && (
              <FeedingShareMenu
                shareText={FEEDING_UI_TEXT.SHARE.TEXT(split.totalInt, split.morning, split.night)}
                shareUrl={shareUrl}
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
