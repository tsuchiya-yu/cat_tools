"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import GuideSection from '@/components/GuideSection';
import WaterIntakeFAQ from '@/components/WaterIntakeFAQ';
import { WATER_INTAKE_UI_TEXT } from '@/constants/text';
import { calculateCatWaterIntake, formatMl } from '@/lib/catWaterIntake';

const WATER_INTAKE_PATH = '/calculate-cat-water-intake';

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
    return query ? `${WATER_INTAKE_PATH}?${query}` : WATER_INTAKE_PATH;
  }, []);

  const pathWithQuery = useMemo(
    () => buildPathWithQuery(weight, dryFood, wetFood),
    [buildPathWithQuery, weight, dryFood, wetFood],
  );

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

        <div className="surface border-none overflow-hidden border-b border-gray-200">
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

      {result && (
        <section className="section mt-6" aria-live="polite">
          <div className="result relative text-center py-2 pb-6 border-b border-gray-200">
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

      <WaterIntakeFAQ />

      <GuideSection
        className="mt-8"
        whatTitle={WATER_INTAKE_UI_TEXT.GUIDE.WHAT_TITLE}
        whatDescription={WATER_INTAKE_UI_TEXT.GUIDE.WHAT_DESCRIPTION}
        usageTitle={WATER_INTAKE_UI_TEXT.GUIDE.USAGE_TITLE}
        usageItems={WATER_INTAKE_UI_TEXT.GUIDE.USAGE_ITEMS}
      />
    </main>
  );
}
