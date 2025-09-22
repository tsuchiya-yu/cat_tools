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
  center: number;
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
