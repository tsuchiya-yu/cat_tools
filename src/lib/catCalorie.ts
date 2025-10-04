import { LifeStage, Goal, CalorieFactorResult, CatCalorieResult, CatCalorieRawResult } from '@/types';

// RER（安静時必要量）の計算
export function calculateRER(weight: number): number {
  return 70 * Math.pow(weight, 0.75);
}

// ステージ/目標/去勢 から 係数の標準値と幅（min,max）を返す
const FACTORS = {
  LOSS: { c: 0.85, min: 0.8, max: 1.0, label: '減量の目安' },
  GAIN: { c: 1.3, min: 1.2, max: 1.4, label: '増量の目安' },
  KITTEN: { c: 2.5, min: 2.0, max: 3.0, label: '子猫の成長' },
  SENIOR: { c: 1.2, min: 1.1, max: 1.4, label: 'シニアの目安' },
  ADULT_NEUTERED: { c: 1.2, min: 1.0, max: 1.6, label: '成猫・去勢/避妊済' },
  ADULT_INTACT: { c: 1.4, min: 1.2, max: 1.6, label: '成猫・未去勢/未避妊' },
} as const satisfies Record<string, CalorieFactorResult>;

export function getCalorieFactor(stage: LifeStage, goal: Goal, neutered: boolean): CalorieFactorResult {
  // goalが最優先（減量/増量）
  if (goal === 'loss') {
    return FACTORS.LOSS;
  }
  if (goal === 'gain') {
    return FACTORS.GAIN;
  }
  
  // 維持
  if (stage === 'kitten') {
    return FACTORS.KITTEN;
  }
  if (stage === 'senior') {
    return FACTORS.SENIOR;
  }
  
  // 成猫
  if (neutered) {
    return FACTORS.ADULT_NEUTERED;
  }
  return FACTORS.ADULT_INTACT;
}

// メモの生成
export function generateNote(stage: LifeStage, goal: Goal): string {
  if (goal === 'loss') {
    return '減量はゆっくりが安全。1〜2週ごとに体重を確認し、与える量を5〜10%ずつ調整しましょう。';
  }
  if (goal === 'gain') {
    return '増量は体調を見ながら少しずつ。食欲や活動量の変化も併せて確認を。';
  }
  if (stage === 'kitten') {
    return '子猫は月齢で必要量が変わります。月齢が進むにつれて少しずつ減らしていきます。';
  }
  if (stage === 'senior') {
    return 'シニアは個体差が大きい時期。体重・食欲・飲水をこまめに観察しましょう。';
  }
  return 'まずは標準値で始め、週1〜2回の体重記録で5〜10%ずつ微調整するのがおすすめ。';
}

// 小数点第1位で四捨五入
export function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

// 生データを返す計算関数（UIフォーマットは担当しない）
export function computeCatCalorie(
  weight: number,
  stage: LifeStage,
  goal: Goal,
  neutered: boolean
): CatCalorieRawResult {
  const rer = calculateRER(weight);
  const factor = getCalorieFactor(stage, goal, neutered);

  const center = rer * factor.c;
  const min = rer * factor.min;
  const max = rer * factor.max;

  return {
    centerKcal: round1(center),
    minKcal: round1(min),
    maxKcal: round1(max),
    factor,
    note: generateNote(stage, goal),
  };
}

// メインの計算関数
export function calculateCatCalorie(
  weight: number,
  stage: LifeStage,
  goal: Goal,
  neutered: boolean
): CatCalorieResult {
  const raw = computeCatCalorie(weight, stage, goal, neutered);
  return {
    kcal: raw.centerKcal,
    range: `${raw.minKcal}〜${raw.maxKcal} kcal/日`,
    factor: `× ${raw.factor.c.toFixed(2)}（${raw.factor.label}）`,
    note: raw.note,
  };
}
