"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import GuideSection from '@/components/GuideSection';
import ShareMenu from '@/components/ShareMenu';
import WaterIntakeFAQ from '@/components/WaterIntakeFAQ';
import { CALCULATE_CAT_WATER_INTAKE_PATH, CAT_MEAL_MANAGEMENT_PATH } from '@/constants/paths';
import { WATER_INTAKE_UI_TEXT } from '@/constants/text';
import { calculateCatWaterIntake, formatMl } from '@/lib/catWaterIntake';

const WATER_INTAKE_REFERENCE_ROWS = [2, 3, 4, 5, 6, 7, 8].map((weightKg) => ({
  weightKg,
  totalWaterMl: calculateCatWaterIntake({ weightKg }).totalWaterMl,
}));

function parsePositiveOrZero(value: string) {
  const parsed = Number.parseFloat(value);
  if (!value.trim()) return null;
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function parseRequiredPositive(value: string) {
  const parsed = Number.parseFloat(value);
  if (!value.trim()) return null;
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function WaterIntakeReferenceTable() {
  const tableText = WATER_INTAKE_UI_TEXT.REFERENCE_TABLE;

  return (
    <section className="mt-8" aria-labelledby="water-intake-reference-table-title">
      <h2
        id="water-intake-reference-table-title"
        className="text-xl md:text-2xl font-extrabold text-gray-900 text-balance"
      >
        {tableText.TITLE}
      </h2>
      <p className="mt-3 text-sm text-gray-700 leading-relaxed text-pretty">
        {tableText.DESCRIPTION}
      </p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-sm text-left tabular-nums">
          <caption className="sr-only">{tableText.CAPTION}</caption>
          <thead>
            <tr className="border-b-2 border-pink-200 bg-pink-50">
              <th scope="col" className="px-3 py-3 font-bold text-gray-900 whitespace-nowrap">
                {tableText.HEADERS.WEIGHT}
              </th>
              <th scope="col" className="px-3 py-3 font-bold text-gray-900 whitespace-nowrap">
                {tableText.HEADERS.RANGE}
              </th>
              <th scope="col" className="px-3 py-3 font-bold text-gray-900 whitespace-nowrap">
                {tableText.HEADERS.MID}
              </th>
            </tr>
          </thead>
          <tbody>
            {WATER_INTAKE_REFERENCE_ROWS.map(({ weightKg, totalWaterMl }) => (
              <tr key={weightKg} className="border-b border-gray-200">
                <th scope="row" className="px-3 py-3 font-semibold text-gray-900 whitespace-nowrap">
                  {weightKg}kg
                </th>
                <td className="px-3 py-3 text-gray-700 whitespace-nowrap">
                  {formatMl(totalWaterMl.min)}〜{formatMl(totalWaterMl.max)}mL/日
                </td>
                <td className="px-3 py-3 font-semibold text-gray-900 whitespace-nowrap">
                  {formatMl(totalWaterMl.mid)}mL/日
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 rounded-xl border border-pink-200 bg-pink-50 p-4 text-sm text-pink-900 leading-relaxed text-pretty">
        {tableText.NOTE}
      </p>
    </section>
  );
}

function WaterIntakeSupplementaryContent() {
  const supplementaryText = WATER_INTAKE_UI_TEXT.SUPPLEMENTARY;

  return (
    <>
      <section className="section mt-10" aria-labelledby="water-intake-result-guide">
        <h2
          id="water-intake-result-guide"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.RESULT_GUIDE.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.RESULT_GUIDE.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <p className="text-sm text-pink-900 leading-relaxed text-pretty">
            {supplementaryText.RESULT_GUIDE.NOTE}
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-basics">
        <h2
          id="water-intake-basics"
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
        <div
          className="mt-6 grid"
          style={{
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: 'calc(var(--spacing) * 2)',
          }}
        >
          {supplementaryText.BASICS.FACTORS.map((item) => (
            <article key={item.title} className="h-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm">
              <h3 className="text-sm sm:text-base font-bold text-gray-900 text-balance">{item.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-gray-700 leading-relaxed text-pretty">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-5">
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            {supplementaryText.BASICS.NOTE}
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-low-signs">
        <h2
          id="water-intake-low-signs"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.LOW_SIGNS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.LOW_SIGNS.INTRO}
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 text-balance">{supplementaryText.LOW_SIGNS.CHECK_TITLE}</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed text-pretty">
            {supplementaryText.LOW_SIGNS.ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <h3 className="text-base font-bold text-pink-900 text-balance">{supplementaryText.LOW_SIGNS.NOTE_TITLE}</h3>
          <p className="mt-2 text-sm text-pink-900 leading-relaxed text-pretty">
            {supplementaryText.LOW_SIGNS.NOTE}
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-tips">
        <h2
          id="water-intake-tips"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.TIPS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.TIPS.INTRO}
        </p>
        <div className="mt-5 space-y-6">
          <div>
            <h3 className="text-base font-bold text-gray-900 text-balance">{supplementaryText.TIPS.QUICK_TITLE}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed text-pretty">
              {supplementaryText.TIPS.QUICK_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 text-balance">{supplementaryText.TIPS.PLACE_TITLE}</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed text-pretty">
              {supplementaryText.TIPS.PLACE_ITEMS.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-overdrinking">
        <h2
          id="water-intake-overdrinking"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.OVERDRINKING.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.OVERDRINKING.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 text-balance">{supplementaryText.OVERDRINKING.CHECK_TITLE}</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed text-pretty">
            {supplementaryText.OVERDRINKING.ITEMS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-related-guide">
        <h2
          id="water-intake-related-guide"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          食事管理と水分補給の流れ
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          カロリー計算・給餌量計算とあわせた食事管理全体の進め方は、
          <Link href={CAT_MEAL_MANAGEMENT_PATH} className="text-pink-600 font-bold">
            猫の食事管理ガイド
          </Link>
          で詳しく解説しています。
        </p>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-references">
        <h2
          id="water-intake-references"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.REFERENCES.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.REFERENCES.BODY.map((paragraph, index) => (
            <p key={`water-intake-reference-body-${index}`} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 leading-relaxed mt-4">
          {supplementaryText.REFERENCES.LINKS.map((source) => (
            <li key={source.URL}>
              <a
                href={source.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-700 hover:text-pink-800 underline underline-offset-2 break-all"
              >
                {source.LABEL}
              </a>
              <span className="text-gray-600"> — {source.NOTE}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function CatWaterIntakeCalculator() {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [dryFood, setDryFood] = useState('');
  const [wetFood, setWetFood] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const syncFromLocation = () => {
      const url = new URL(window.location.href);
      setWeight(url.searchParams.get('weight') ?? '');
      setDryFood(url.searchParams.get('dry') ?? '');
      setWetFood(url.searchParams.get('wet') ?? '');
    };

    syncFromLocation();
    window.addEventListener('popstate', syncFromLocation);
    return () => window.removeEventListener('popstate', syncFromLocation);
  }, []);

  const buildPathWithQuery = useCallback((nextWeight: string, nextDry: string, nextWet: string) => {
    const params = new URLSearchParams();
    if (nextWeight) params.set('weight', nextWeight);
    if (nextDry) params.set('dry', nextDry);
    if (nextWet) params.set('wet', nextWet);

    const query = params.toString();
    return query ? `${CALCULATE_CAT_WATER_INTAKE_PATH}?${query}` : CALCULATE_CAT_WATER_INTAKE_PATH;
  }, []);

  const pathWithQuery = useMemo(
    () => buildPathWithQuery(weight, dryFood, wetFood),
    [buildPathWithQuery, weight, dryFood, wetFood],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}${pathWithQuery}`;
  }, [pathWithQuery]);

  const syncUrl = useCallback((nextWeight: string, nextDry: string, nextWet: string) => {
    const nextPath = buildPathWithQuery(nextWeight, nextDry, nextWet);
    if (!nextPath || nextPath === pathWithQuery) return;
    router.replace(nextPath, { scroll: false });
  }, [buildPathWithQuery, pathWithQuery, router]);

  const onWeightChange = useCallback((value: string) => {
    setWeight(value);
    syncUrl(value, dryFood, wetFood);
  }, [syncUrl, dryFood, wetFood]);

  const onDryFoodChange = useCallback((value: string) => {
    setDryFood(value);
    syncUrl(weight, value, wetFood);
  }, [syncUrl, weight, wetFood]);

  const onWetFoodChange = useCallback((value: string) => {
    setWetFood(value);
    syncUrl(weight, dryFood, value);
  }, [syncUrl, weight, dryFood]);

  const weightNum = useMemo(() => parseRequiredPositive(weight), [weight]);
  const dryFoodNum = useMemo(() => parsePositiveOrZero(dryFood), [dryFood]);
  const wetFoodNum = useMemo(() => parsePositiveOrZero(wetFood), [wetFood]);

  const errors = useMemo(() => {
    return {
      weight:
        weight.trim() === ''
          ? ''
          : weightNum === null || Number.isNaN(weightNum)
            ? WATER_INTAKE_UI_TEXT.INPUT.ERROR.NUMBER
            : weightNum <= 0
              ? WATER_INTAKE_UI_TEXT.INPUT.ERROR.WEIGHT_POSITIVE
              : '',
      dryFood:
        dryFood.trim() === ''
          ? ''
          : dryFoodNum === null || Number.isNaN(dryFoodNum)
            ? WATER_INTAKE_UI_TEXT.INPUT.ERROR.NUMBER
            : dryFoodNum < 0
              ? WATER_INTAKE_UI_TEXT.INPUT.ERROR.NON_NEGATIVE
              : '',
      wetFood:
        wetFood.trim() === ''
          ? ''
          : wetFoodNum === null || Number.isNaN(wetFoodNum)
            ? WATER_INTAKE_UI_TEXT.INPUT.ERROR.NUMBER
            : wetFoodNum < 0
              ? WATER_INTAKE_UI_TEXT.INPUT.ERROR.NON_NEGATIVE
              : '',
    };
  }, [weight, weightNum, dryFood, dryFoodNum, wetFood, wetFoodNum]);

  const result = useMemo(() => {
    if (weightNum == null || Number.isNaN(weightNum) || weightNum <= 0) return null;

    const normalizedDryFood = dryFoodNum == null || Number.isNaN(dryFoodNum) ? 0 : dryFoodNum;
    const normalizedWetFood = wetFoodNum == null || Number.isNaN(wetFoodNum) ? 0 : wetFoodNum;

    if (normalizedDryFood < 0 || normalizedWetFood < 0) return null;

    return calculateCatWaterIntake({
      weightKg: weightNum,
      dryFoodG: normalizedDryFood,
      wetFoodG: normalizedWetFood,
    });
  }, [weightNum, dryFoodNum, wetFoodNum]);

  const hasFoodInput = dryFood.trim() !== '' || wetFood.trim() !== '';

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-10">
      <Breadcrumbs
        items={[
          { label: WATER_INTAKE_UI_TEXT.BREADCRUMBS.HOME, href: '/' },
          { label: WATER_INTAKE_UI_TEXT.BREADCRUMBS.WATER_INTAKE_CALCULATOR },
        ]}
        className="mt-4"
      />

      <section className="section mt-6">
        <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
          {WATER_INTAKE_UI_TEXT.HEADER.EYECATCH}
        </p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
          {WATER_INTAKE_UI_TEXT.HEADER.TITLE}
        </h1>
        <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
          {WATER_INTAKE_UI_TEXT.HEADER.DESCRIPTION}
        </p>

        <WaterIntakeReferenceTable />

        <section className="mt-10" aria-labelledby="water-intake-calculator-title">
          <h2
            id="water-intake-calculator-title"
            className="text-xl md:text-2xl font-extrabold text-gray-900 text-balance"
          >
            {WATER_INTAKE_UI_TEXT.CALCULATOR.TITLE}
          </h2>
          <p className="mt-3 text-sm text-gray-700 leading-relaxed text-pretty">
            {WATER_INTAKE_UI_TEXT.CALCULATOR.DESCRIPTION}
          </p>

          <div className="surface mt-5 border-none overflow-hidden border-b border-gray-200">
            <div className="row flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="weightInput" className="text-base font-bold text-gray-900">
                  {WATER_INTAKE_UI_TEXT.INPUT.WEIGHT_LABEL}
                </label>
                <input
                  id="weightInput"
                  type="text"
                  inputMode="decimal"
                  placeholder="例: 4.2"
                  value={weight}
                  onChange={(e) => onWeightChange(e.target.value)}
                  className="w-full h-14 px-6 border-2 border-pink-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
                />
                <div className="text-red-700 text-xs mt-1 min-h-[1.2em]" aria-live="polite">{errors.weight}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="dryFoodInput" className="text-base font-bold text-gray-900">
                  {WATER_INTAKE_UI_TEXT.INPUT.DRY_FOOD_LABEL}
                </label>
                <input
                  id="dryFoodInput"
                  type="text"
                  inputMode="decimal"
                  placeholder="例: 40"
                  value={dryFood}
                  onChange={(e) => onDryFoodChange(e.target.value)}
                  className="w-full h-14 px-6 border-2 border-pink-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
                />
                <div className="text-xs text-gray-500">{WATER_INTAKE_UI_TEXT.INPUT.OPTIONAL_HINT}</div>
                <div className="text-red-700 text-xs mt-1 min-h-[1.2em]" aria-live="polite">{errors.dryFood}</div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="wetFoodInput" className="text-base font-bold text-gray-900">
                  {WATER_INTAKE_UI_TEXT.INPUT.WET_FOOD_LABEL}
                </label>
                <input
                  id="wetFoodInput"
                  type="text"
                  inputMode="decimal"
                  placeholder="例: 80"
                  value={wetFood}
                  onChange={(e) => onWetFoodChange(e.target.value)}
                  className="w-full h-14 px-6 border-2 border-pink-200 rounded-lg text-base text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-pink-600 focus:ring-opacity-35"
                />
                <div className="text-xs text-gray-500">{WATER_INTAKE_UI_TEXT.INPUT.OPTIONAL_HINT}</div>
                <div className="text-red-700 text-xs mt-1 min-h-[1.2em]" aria-live="polite">{errors.wetFood}</div>
              </div>
            </div>
          </div>
        </section>
      </section>

      {result && (
        <section className="section mt-6" aria-live="polite">
          <div className="result relative text-center py-2 pb-6 border-b border-gray-200">
            <ShareMenu
              shareText={WATER_INTAKE_UI_TEXT.SHARE.TEXT(
                formatMl(result.drinkTargetMl.min),
                formatMl(result.drinkTargetMl.max),
              )}
              shareUrl={shareUrl}
              shareTitle={WATER_INTAKE_UI_TEXT.HEADER.TITLE}
              xHashtags={WATER_INTAKE_UI_TEXT.SHARE.X_HASHTAGS}
              buttonId="shareBtn"
              menuId="shareMenu"
              buttonClassName="absolute right-0 top-0 -translate-y-3/5"
              menuClassName="top-12 border-gray-300 min-w-[220px]"
            />
            <div className="text-gray-600 mb-1.5 tracking-wide text-sm">
              {WATER_INTAKE_UI_TEXT.RESULT.DRINK_TARGET_TITLE}
            </div>
            <div id="drinkTargetResult" className="numeral text-4xl md:text-6xl font-extrabold text-pink-600 tracking-tight">
              {formatMl(result.drinkTargetMl.min)}〜{formatMl(result.drinkTargetMl.max)}
              <span className="text-lg md:text-2xl text-gray-900 ml-2">mL</span>
            </div>
            <div className="text-sm text-gray-500 mt-2">
              中央目安 {formatMl(result.drinkTargetMl.mid)} mL
            </div>

            <div className={`mt-8 flex flex-col gap-4 ${hasFoodInput ? 'sm:flex-row' : ''}`}>
              <div className="py-4 border-t border-pink-100 sm:flex-1">
                <div className="text-sm text-gray-500 mb-1.5">{WATER_INTAKE_UI_TEXT.RESULT.TOTAL_WATER_TITLE}</div>
                <div id="totalWaterResult" className="font-extrabold text-2xl text-gray-900">
                  {formatMl(result.totalWaterMl.min)}〜{formatMl(result.totalWaterMl.max)} mL
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  中央目安 {formatMl(result.totalWaterMl.mid)} mL
                </div>
              </div>

              {hasFoodInput && (
                <div className="py-4 border-t border-pink-100 sm:flex-1">
                  <div className="text-sm text-gray-500 mb-1.5">{WATER_INTAKE_UI_TEXT.RESULT.FOOD_WATER_TITLE}</div>
                  <div id="foodWaterResult" className="font-extrabold text-2xl text-gray-900">
                    {formatMl(result.foodWaterMl)} mL
                  </div>
                </div>
              )}
            </div>

            <ul className="list-disc pl-6 text-sm text-gray-600 mt-5 space-y-1 text-left">
              {WATER_INTAKE_UI_TEXT.RESULT.NOTES.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <WaterIntakeSupplementaryContent />

      <WaterIntakeFAQ />

      <GuideSection
        className="mt-8"
        whatTitle={WATER_INTAKE_UI_TEXT.GUIDE.WHAT_TITLE}
        whatDescription={WATER_INTAKE_UI_TEXT.GUIDE.WHAT_DESCRIPTION}
        usageTitle={WATER_INTAKE_UI_TEXT.GUIDE.USAGE_TITLE}
        usageItems={WATER_INTAKE_UI_TEXT.GUIDE.USAGE_ITEMS}
      />

      <section className="section mt-8" aria-label="免責事項">
        <p className="text-sm text-gray-600 leading-relaxed text-pretty">
          {WATER_INTAKE_UI_TEXT.SUPPLEMENTARY.DISCLAIMER}
        </p>
      </section>
    </main>
  );
}
