"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import GuideSection from '@/components/GuideSection';
import WaterIntakeFAQ from '@/components/WaterIntakeFAQ';
import { CALCULATE_CAT_WATER_INTAKE_PATH } from '@/constants/paths';
import { WATER_INTAKE_UI_TEXT } from '@/constants/text';
import { calculateCatWaterIntake, formatMl } from '@/lib/catWaterIntake';

const WATER_INTAKE_FACTOR_CARDS = [
  {
    title: '体重',
    description: '猫の必要水分量は、体重が増えるほど1日の総水分目標も増えるのが基本です。',
  },
  {
    title: '食事の種類',
    description: 'ドライフード中心か、ウェットフード中心かで、食事から取れる水分量が大きく変わります。',
  },
  {
    title: '運動量',
    description: 'よく動く猫は水分消費も増えやすく、飲水量の目安が上がることがあります。',
  },
  {
    title: '室温や季節',
    description: '暑い時期や乾燥しやすい時期は、普段より水を必要とすることがあります。',
  },
  {
    title: '年齢',
    description: '子猫からシニアまで、生活リズムや体の変化に応じて飲み方にも個体差が出ます。',
  },
  {
    title: '体調',
    description: '体調の変化でも飲水量は上下します。普段と違う状態が続くかを見てください。',
  },
] as const;

const DEHYDRATION_SIGN_ITEMS = [
  '尿量やトイレ回数がいつもより少ない',
  '便がかたく、出しにくそうに見える',
  '口の中や歯ぐきが乾いているように見える',
  'なんとなく元気がない時間が増えた',
  '食欲が落ちている',
] as const;

const QUICK_HYDRATION_TIPS = [
  '水飲み場を複数用意して、移動先でも飲めるようにする',
  '水はこまめに交換して、においやほこりを減らす',
  '器の素材や形を変えて、飲みやすいものを探す',
  '自動給水器を試して、動く水を好むか確認する',
  'ウェットフードを取り入れて、食事由来の水分を増やす',
] as const;

const BOWL_AND_PLACE_TIPS = [
  'ひげが当たりにくい広めの器にする',
  '静かな場所に置き、落ち着いて飲める環境をつくる',
  'トイレや食事場所のすぐ横は避け、少し距離を取る',
  '飲む場所を変えたら1つずつ試して、好みを見極める',
] as const;

const OVERDRINKING_CHECK_ITEMS = [
  '尿量が増えている',
  '体重が減ってきた',
  '食欲に変化がある',
  '以前より元気がない',
  '毛づやの変化が気になる',
] as const;

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

function WaterIntakeSupplementaryContent() {
  return (
    <>
      <section className="section mt-10" aria-labelledby="water-intake-result-guide">
        <h2
          id="water-intake-result-guide"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          計算結果の見方
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            このページに表示される数値は、猫の必要水分量の目安です。器から飲む水だけではなく、フードに含まれる
            水分も合わせて、猫の1日の水の量を考える前提で使います。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            ウェットフードの比率が高い場合は、器からの飲水量が少なく見えても総水分は足りていることがあります。
            反対に、ドライフード中心では食事から取れる水分が少ないため、器からの飲水目標を意識しやすくなります。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            猫 給水量 計算の結果は、毎日ぴったり同じ量を守るための数字ではありません。1日だけで判断せず、数日から
            1週間ほどの傾向で見て、猫の飲水量の目安と普段の差をつかむ使い方が現実的です。
          </p>
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <p className="text-sm text-pink-900 leading-relaxed text-pretty">
            表示値は一般的な目安です。暑さ、活動量、年齢、体調でも上下します。大きく外れる日が1日あるだけで急いで
            判断せず、普段との違いが続くかを見てください。
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-basics">
        <h2
          id="water-intake-basics"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          猫の1日に必要な水分量はどう決まる？
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            猫の必要水分量は、一般的に体重1kgあたり40〜60mL程度がひとつの目安です。ただし、実際の猫の1日の水の量は、
            体格だけでなく生活環境や食事内容でも変わります。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            とくにドライフード 水分は少なく、ウェットフード 水分は多いため、器から飲むべき量は同じ猫でも食事次第で
            変わります。このツールは、食事由来の水分を差し引いたうえで、器からの飲水量の目安を見やすくしています。
          </p>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {WATER_INTAKE_FACTOR_CARDS.map((item) => (
            <article key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">{item.description}</p>
            </article>
          ))}
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mt-5">
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            まずは総水分目標を確認し、そのうえでフードからどれだけ水分を取れているかを見ると、器からの飲水目標を
            無理なく解釈しやすくなります。
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-low-signs">
        <h2
          id="water-intake-low-signs"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          水分不足かもしれないときのサイン
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          猫 水を飲まないように見えても、飲水量の変化は日ごとには気づきにくいものです。心配なときは、その日の量だけで
          なく、普段との違いを複数のサインで確認するのが大切です。
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 text-balance">チェックしたい変化</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {DEHYDRATION_SIGN_ITEMS.map((item) => (
              <li key={item} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed text-pretty">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-pink-200 bg-pink-50 p-4 mt-5">
          <h3 className="text-base font-bold text-pink-900 text-balance">受診を考えたいタイミング</h3>
          <p className="mt-2 text-sm text-pink-900 leading-relaxed text-pretty">
            こうした変化が続く場合や、嘔吐、体重減少などを伴う場合は受診を検討してください。このページは診断ではなく、
            日々の健康管理の目安として使う内容です。
          </p>
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="water-intake-tips">
        <h2
          id="water-intake-tips"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          猫にしっかり水を飲んでもらうコツ
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          飲水量を増やしたいときは、量だけでなく、飲みやすい環境づくりも同じくらい重要です。猫ごとに好みが違うため、
          ひとつずつ試して反応を見ると続けやすくなります。
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 text-balance">すぐ試しやすい工夫</h3>
            <ul className="mt-4 space-y-3">
              {QUICK_HYDRATION_TIPS.map((item) => (
                <li key={item} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed text-pretty">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 text-balance">器や置き場所を見直すポイント</h3>
            <ul className="mt-4 space-y-3">
              {BOWL_AND_PLACE_TIPS.map((item) => (
                <li key={item} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed text-pretty">
                  {item}
                </li>
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
          水を飲みすぎるときは注意
        </h2>
        <div className="space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            猫 水を飲みすぎるように見える場合も、見逃さずに様子を見たいポイントです。暑い時期や食事内容の変化で増える
            ことはありますが、以前より明らかに増えた状態が続くなら注意が必要です。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed text-pretty">
            飲水量は多すぎても少なすぎても、健康状態を知る手がかりになります。普段のおおよその飲み方を把握しておくと、
            変化に気づきやすくなります。
          </p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 mt-5 shadow-sm">
          <h3 className="text-base font-bold text-gray-900 text-balance">あわせて確認したい変化</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {OVERDRINKING_CHECK_ITEMS.map((item) => (
              <li key={item} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-700 leading-relaxed text-pretty">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-5 text-sm text-gray-600 leading-relaxed text-pretty">
          ここでの情報は受診の目安を整理するための補足です。急な変化が続く場合は、早めに動物病院へ相談してください。
        </p>
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

      <WaterIntakeSupplementaryContent />

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
