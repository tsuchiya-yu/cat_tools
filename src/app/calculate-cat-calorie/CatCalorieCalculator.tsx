'use client';

import { useState, useEffect, useCallback } from 'react';
import { LifeStage, Goal, CatCalorieResult } from '@/types';
import { calculateCatCalorie } from '@/lib/catCalorie';
import { CALORIE_UI_TEXT } from '@/constants/text';
import { LIFE_STAGES, GOALS } from '@/constants/options';
import CalorieInput from '@/components/CalorieInput';
import CalorieResult from '@/components/CalorieResult';
import CalorieFAQ from '@/components/CalorieFAQ';
import GuideSection from '@/components/GuideSection';
import Breadcrumbs from '@/components/Breadcrumbs';

function CalorieSupplementaryContent() {
  const supplementaryText = CALORIE_UI_TEXT.SUPPLEMENTARY;

  return (
    <>
      <section className="section mt-10" aria-labelledby="calorie-result-guide">
        <h2
          id="calorie-result-guide"
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

      <section className="section mt-10" aria-labelledby="calorie-basics">
        <h2
          id="calorie-basics"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.BASICS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.BASICS.INTRO}
        </p>
        <div className="mt-5 space-y-5">
          {supplementaryText.BASICS.FACTORS.map((item) => (
            <article key={item.TITLE} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">{item.BODY}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="calorie-feeding-steps">
        <h2
          id="calorie-feeding-steps"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.FEEDING_STEPS.TITLE}
        </h2>
        <p className="text-sm text-gray-700 leading-relaxed text-pretty">
          {supplementaryText.FEEDING_STEPS.INTRO}
        </p>
        <div className="mt-5 space-y-6">
          {supplementaryText.FEEDING_STEPS.ITEMS.map((item) => (
            <div key={item.TITLE}>
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">{item.BODY}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="calorie-pitfalls">
        <h2
          id="calorie-pitfalls"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.PITFALLS.TITLE}
        </h2>
        <div className="mt-5 space-y-5">
          {supplementaryText.PITFALLS.ITEMS.map((item) => (
            <article key={item.TITLE} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 text-balance">{item.TITLE}</h3>
              <p className="mt-2 text-sm text-gray-700 leading-relaxed text-pretty">{item.BODY}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section mt-10" aria-labelledby="calorie-vet-signs">
        <h2
          id="calorie-vet-signs"
          className="my-4 pt-4 font-extrabold text-xl md:text-2xl tracking-tight text-balance"
        >
          {supplementaryText.VET_SIGNS.TITLE}
        </h2>
        <div className="space-y-3">
          {supplementaryText.VET_SIGNS.BODY.map((paragraph) => (
            <p key={paragraph} className="text-sm text-gray-700 leading-relaxed text-pretty">
              {paragraph}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}

export default function CatCalorieCalculator() {
  const [weight, setWeight] = useState('');
  const [lifeStage, setLifeStage] = useState<LifeStage>('adult');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [neutered, setNeutered] = useState(true);
  const [result, setResult] = useState<CatCalorieResult | null>(null);
  const [error, setError] = useState('');

  

  const handleCalculate = useCallback((
    weightValue: string,
    stageValue: LifeStage,
    goalValue: Goal,
    neuteredValue: boolean
  ) => {
    setError('');
    
    const weightNum = parseFloat(weightValue);
    if (!weightValue || !(weightNum > 0)) {
      setResult(null);
      return;
    }

    // 体重の範囲チェック
    if (weightNum < 0.5 || weightNum > 12) {
      setError(CALORIE_UI_TEXT.INPUT.ERROR.WEIGHT_RANGE);
      setResult(null);
      return;
    }

    try {
      const formatted = calculateCatCalorie(weightNum, stageValue, goalValue, neuteredValue);
      setResult(formatted);
    } catch {
      setError('計算中にエラーが発生しました。');
      setResult(null);
    }
  }, []);

  const syncURL = useCallback((
    weightValue: string,
    stageValue: LifeStage,
    goalValue: Goal,
    neuteredValue: boolean
  ) => {
    const url = new URL(window.location.href);
    url.searchParams.set('w', weightValue || '');
    url.searchParams.set('s', stageValue);
    url.searchParams.set('g', goalValue);
    url.searchParams.set('n', neuteredValue ? '1' : '0');
    window.history.replaceState(null, '', url.toString());
  }, []);

  const buildShareUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('w', weight || '');
    url.searchParams.set('s', lifeStage);
    url.searchParams.set('g', goal);
    url.searchParams.set('n', neutered ? '1' : '0');
    return url.toString();
  }, [weight, lifeStage, goal, neutered]);

  const handleWeightChange = useCallback((value: string) => {
    setWeight(value);
    handleCalculate(value, lifeStage, goal, neutered);
  }, [lifeStage, goal, neutered, handleCalculate]);

  const handleLifeStageChange = useCallback((stage: LifeStage) => {
    setLifeStage(stage);
    handleCalculate(weight, stage, goal, neutered);
  }, [weight, goal, neutered, handleCalculate]);

  const handleGoalChange = useCallback((newGoal: Goal) => {
    setGoal(newGoal);
    handleCalculate(weight, lifeStage, newGoal, neutered);
  }, [weight, lifeStage, neutered, handleCalculate]);

  const handleNeuteredChange = useCallback((isNeutered: boolean) => {
    setNeutered(isNeutered);
    handleCalculate(weight, lifeStage, goal, isNeutered);
  }, [weight, lifeStage, goal, handleCalculate]);

  // URL パラメータから初期値を設定（ハンドラ定義後に実行）
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const weightParam = params.get('w');
    const stageParam = params.get('s');
    const goalParam = params.get('g');
    const neuteredParam = params.get('n');

    const validStage =
      stageParam && (LIFE_STAGES as readonly string[]).includes(stageParam as LifeStage)
        ? (stageParam as LifeStage)
        : null;
    const validGoal =
      goalParam && (GOALS as readonly string[]).includes(goalParam as Goal)
        ? (goalParam as Goal)
        : null;
    // '0' の場合のみ false、それ以外（'1', null, 不正値）はデフォルトの true とする
    const validNeutered = neuteredParam !== '0';

    if (weightParam) {
      setWeight(weightParam);
    }
    if (validStage) {
      setLifeStage(validStage);
    }
    if (validGoal) {
      setGoal(validGoal);
    }
    // neuteredParam が存在する場合のみ state を更新
    if (neuteredParam !== null) {
      setNeutered(validNeutered);
    }

    // 初期計算
    if (weightParam) {
      handleCalculate(
        weightParam,
        validStage || 'adult',
        validGoal || 'maintain',
        validNeutered
      );
    }
  }, [handleCalculate]);

  // state 変更時に URL を同期
  useEffect(() => {
    if (weight) { // weight が空文字列でない場合のみ同期
      syncURL(weight, lifeStage, goal, neutered);
    }
  }, [weight, lifeStage, goal, neutered, syncURL]);

  return (
    <main className="container max-w-3xl mx-auto px-6 pb-10">
      <Breadcrumbs
        items={[
          { label: CALORIE_UI_TEXT.BREADCRUMBS.HOME, href: '/' },
          { label: CALORIE_UI_TEXT.BREADCRUMBS.CAT_CALORIE_CALCULATOR },
        ]}
        className="mt-4"
        tabbable={false}
      />
      {/* Hero Section */}
      <section className="section mt-6">
        <p className="eyebrow text-sm tracking-wider uppercase text-pink-600 mt-6">
          {CALORIE_UI_TEXT.HEADER.EYECATCH}
        </p>
        <h1 className="text-3xl md:text-4xl leading-tight font-bold mt-1.5 mb-0">
          {CALORIE_UI_TEXT.HEADER.TITLE}
        </h1>
        <p className="lead text-sm text-gray-600 mt-2.5 mb-6 leading-relaxed">
          {CALORIE_UI_TEXT.HEADER.DESCRIPTION}
        </p>

        <CalorieInput
          weight={weight}
          onWeightChange={handleWeightChange}
          lifeStage={lifeStage}
          onLifeStageChange={handleLifeStageChange}
          goal={goal}
          onGoalChange={handleGoalChange}
          neutered={neutered}
          onNeuteredChange={handleNeuteredChange}
          error={error}
        />
      </section>

      {/* Result Section */}
      <CalorieResult 
        result={result}
        isVisible={!!result}
        shareUrl={typeof window !== 'undefined' ? buildShareUrl() : undefined}
      />

      <CalorieSupplementaryContent />

      {/* FAQ Section */}
      <CalorieFAQ />

      <GuideSection
        className="mt-8"
        whatTitle={CALORIE_UI_TEXT.GUIDE.WHAT_TITLE}
        whatDescription={CALORIE_UI_TEXT.GUIDE.WHAT_DESCRIPTION}
        usageTitle={CALORIE_UI_TEXT.GUIDE.USAGE_TITLE}
        usageItems={CALORIE_UI_TEXT.GUIDE.USAGE_ITEMS}
      />
    </main>
  );
}
