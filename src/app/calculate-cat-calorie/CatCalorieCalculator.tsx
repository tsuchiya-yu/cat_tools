'use client';

import { useState, useEffect, useCallback } from 'react';
import { LifeStage, Goal, CatCalorieResult } from '@/types';
import { calculateCatCalorie } from '@/lib/catCalorie';
import { CALORIE_UI_TEXT } from '@/constants/text';
import { LIFE_STAGES, GOALS } from '@/constants/options';
import CalorieInput from '@/components/CalorieInput';
import CalorieResult from '@/components/CalorieResult';
import CalorieFAQ from '@/components/CalorieFAQ';
import Breadcrumbs from '@/components/Breadcrumbs';

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
        disableTabbing
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

      {/* FAQ Section */}
      <CalorieFAQ />
    </main>
  );
}
