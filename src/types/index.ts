export interface CatAgeResult {
  humanAgeYears: number;
  humanAgeMonths: number;
  realAgeYears: number;
  realAgeMonths: number;
  lifeStage: string;
  daysUntilBirthday: number;
}

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

// カロリー計算関連の型定義
export type LifeStage = 'kitten' | 'adult' | 'senior';
export type Goal = 'maintain' | 'loss' | 'gain';

export interface CalorieFactorResult {
  c: number;
  min: number;
  max: number;
  label: string;
}

export interface CatCalorieResult {
  kcal: number;
  range: string;
  factor: string;
  note: string;
}

// カロリー計算の生データ（UI整形前）
export interface CatCalorieRawResult {
  centerKcal: number;
  minKcal: number;
  maxKcal: number;
  factor: CalorieFactorResult;
  note: string;
}

export type CatFoodSafetyStatus = '安全' | '注意' | '危険';

export interface CatFoodItem {
  name: string;
  status: CatFoodSafetyStatus;
  description: string;
  notes: string;
}
