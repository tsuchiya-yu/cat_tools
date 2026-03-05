"use client";

import React from "react";
import { calcGramsPerDay, normalizeNumberInput, splitMorningNight } from "@/lib/feed";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import FeedingFAQ from "@/components/FeedingFAQ";
import GuideSection from "@/components/GuideSection";
import ShareMenu from "@/components/ShareMenu";
import { FEEDING_UI_TEXT, FEEDING_RANGE } from "@/constants/text";
import { useRouter } from "next/navigation";

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

function FeedingSupplementaryContent() {
  const supplementaryText = FEEDING_UI_TEXT.SUPPLEMENTARY;

  return (
    <>
      <section className="section mt-10" aria-labelledby="feeding-basics">
        <h2
          id="feeding-basics"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.BASICS.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.BASICS.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <p className="text-sm text-pink-900 leading-relaxed text-pretty">
            {supplementaryText.BASICS.NOTE}
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-formula">
        <h2
          id="feeding-formula"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.FORMULA.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.FORMULA.INTRO}
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5 shadow-sm">
          <p className="text-base font-bold text-gray-900 leading-relaxed text-balance">
            {supplementaryText.FORMULA.EQUATION}
          </p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty mt-5">
          {supplementaryText.FORMULA.EXAMPLE}
        </p>
        <div className="space-y-3 mt-5">
          {supplementaryText.FORMULA.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-conditions">
        <h2
          id="feeding-conditions"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.CONDITIONS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.CONDITIONS.INTRO}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {supplementaryText.CONDITIONS.ITEMS.map((item) => (
            <article key={item.TITLE} className="h-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-700 leading-relaxed text-pretty">{item.BODY.join(' ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-adjustment">
        <h2
          id="feeding-adjustment"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.ADJUSTMENT.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.ADJUSTMENT.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-5 space-y-6">
          {supplementaryText.ADJUSTMENT.ITEMS.map((item) => (
            <div key={item.TITLE}>
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <div className="space-y-3 mt-3">
                {item.BODY.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <p className="text-sm text-pink-900 leading-relaxed text-pretty">
            {supplementaryText.ADJUSTMENT.NOTE}
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-food-types">
        <h2
          id="feeding-food-types"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.FOOD_TYPES.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.FOOD_TYPES.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-5 space-y-6">
          {supplementaryText.FOOD_TYPES.ITEMS.map((item) => (
            <div key={item.TITLE}>
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <div className="space-y-3 mt-3">
                {item.BODY.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-examples">
        <h2
          id="feeding-examples"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.EXAMPLES.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.EXAMPLES.INTRO}
        </p>
        <div className="mt-5 space-y-6">
          {supplementaryText.EXAMPLES.ITEMS.map((item) => (
            <div key={item.TITLE}>
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <div className="space-y-3 mt-3">
                {item.BODY.map((paragraph) => (
                  <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="feeding-related-tools">
        <h2
          id="feeding-related-tools"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.RELATED_TOOLS.TITLE}
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            {supplementaryText.RELATED_TOOLS.INTRO_BEFORE_LINK}
            <Link href="/calculate-cat-calorie" className="text-pink-600 font-bold">
              {FEEDING_UI_TEXT.LINKS.CALORIE_PAGE}
            </Link>
            {supplementaryText.RELATED_TOOLS.INTRO_AFTER_LINK}
          </p>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            {supplementaryText.RELATED_TOOLS.BODY}
          </p>
        </div>
      </section>
    </>
  );
}

type CatFeedingCalculatorProps = {
  initialKcal?: string;
  initialDensity?: string;
};

const FEEDING_PATH = "/calculate-cat-feeding";

export default function CatFeedingCalculator({ initialKcal = "", initialDensity = "" }: CatFeedingCalculatorProps) {
  const router = useRouter();
  const [dailyKcal, setDailyKcal] = React.useState<string>(initialKcal);
  const [density, setDensity] = React.useState<string>(initialDensity);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const syncFromLocation = () => {
      const url = new URL(window.location.href);
      setDailyKcal(url.searchParams.get("kcal") ?? "");
      setDensity(url.searchParams.get("d") ?? "");
    };
    syncFromLocation();
    window.addEventListener("popstate", syncFromLocation);
    return () => window.removeEventListener("popstate", syncFromLocation);
  }, []);

  const buildPathWithQuery = React.useCallback(
    (kcalValue: string, densityValue: string) => {
      const params = new URLSearchParams();
      if (kcalValue) params.set('kcal', kcalValue);
      if (densityValue) params.set('d', densityValue);
      const queryString = params.toString();
      return queryString ? `${FEEDING_PATH}?${queryString}` : FEEDING_PATH;
    },
    [],
  );

  const pathWithQuery = React.useMemo(
    () => buildPathWithQuery(dailyKcal, density),
    [buildPathWithQuery, dailyKcal, density],
  );

  const syncUrl = React.useCallback(
    (nextDailyKcal: string, nextDensity: string) => {
      const nextPath = buildPathWithQuery(nextDailyKcal, nextDensity);
      if (!nextPath || nextPath === pathWithQuery) return;
      router.replace(nextPath, { scroll: false });
    },
    [buildPathWithQuery, pathWithQuery, router],
  );

  const handleDailyKcalChange = React.useCallback(
    (value: string) => {
      setDailyKcal(value);
      syncUrl(value, density);
    },
    [syncUrl, density],
  );

  const handleDensityChange = React.useCallback(
    (value: string) => {
      setDensity(value);
      syncUrl(dailyKcal, value);
    },
    [syncUrl, dailyKcal],
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
        <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
          {FEEDING_UI_TEXT.HEADER.DESCRIPTION}
        </p>

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
              <ShareMenu
                shareText={FEEDING_UI_TEXT.SHARE.TEXT(split.totalInt, split.morning, split.night)}
                shareUrl={shareUrl}
                shareTitle={FEEDING_UI_TEXT.HEADER.TITLE}
                buttonId="shareBtn"
                menuId="shareMenu"
                buttonClassName="absolute right-0 top-0 -translate-y-3/5"
                menuClassName="top-12 border-gray-300 min-w-[220px]"
              />
            )}
          </div>
        </section>
      )}

      <FeedingSupplementaryContent />

      {/* FAQ */}
      <FeedingFAQ />

      <GuideSection
        className="mt-8"
        whatTitle={FEEDING_UI_TEXT.GUIDE.WHAT_TITLE}
        whatDescription={FEEDING_UI_TEXT.GUIDE.WHAT_DESCRIPTION}
        usageTitle={FEEDING_UI_TEXT.GUIDE.USAGE_TITLE}
        usageItems={FEEDING_UI_TEXT.GUIDE.USAGE_ITEMS}
      />

      <section className="section mt-8" aria-label="免責事項">
        <p className="text-sm text-gray-600 leading-relaxed text-pretty">
          {FEEDING_UI_TEXT.SUPPLEMENTARY.DISCLAIMER}
        </p>
      </section>
    </main>
  );
}
