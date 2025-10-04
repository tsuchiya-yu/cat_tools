/**
 * 猫のカロリー計算ユーティリティ
 */

import { 
  calculateCatCalorie,
  calculateRER,
  getCalorieFactor,
  round1 as round1Prod,
} from '../../../src/lib/catCalorie';
import type { LifeStage, Goal as GoalType, CalorieFactorResult } from '../../../src/types';

export type Stage = LifeStage;
export type Goal = GoalType;

export type Factor = CalorieFactorResult;

export interface CalcResult {
  kcal: number;
  range: string;
  factor: string;
}

// 本番実装をそのまま利用してDRYに
export const round1 = (x: number) => round1Prod(x);
export const rer = (weight: number) => calculateRER(weight);
export const pickFactor = (stage: Stage, goal: Goal, neutered: boolean): Factor =>
  getCalorieFactor(stage, goal, neutered);

export function expected(
  weight: number,
  stage: Stage,
  goal: Goal,
  neutered: boolean
): CalcResult {
  const res = calculateCatCalorie(weight, stage, goal, neutered);
  return { kcal: res.kcal, range: res.range, factor: res.factor };
}

/**
 * 体重バリデーション
 */
export function isValidWeight(weight: number): boolean {
  return weight >= 0.5 && weight <= 12;
}

/**
 * URLパラメータを生成
 */
export function buildUrlParams(
  weight: number,
  stage: Stage,
  goal: Goal,
  neutered: boolean
): string {
  const params = new URLSearchParams();
  params.set('w', weight.toString());
  params.set('s', stage);
  params.set('g', goal);
  params.set('n', neutered ? '1' : '0');
  return params.toString();
}

/**
 * URLパラメータを解析
 */
export function parseUrlParams(search: string): {
  weight: number;
  stage: Stage;
  goal: Goal;
  neutered: boolean;
} | null {
  const params = new URLSearchParams(search);
  
  const w = params.get('w');
  const s = params.get('s') as Stage;
  const g = params.get('g') as Goal;
  const n = params.get('n');

  if (!w || !s || !g || n === null) {
    return null;
  }

  const weight = parseFloat(w);
  if (isNaN(weight)) {
    return null;
  }

  const validStages: Stage[] = ['kitten', 'adult', 'senior'];
  const validGoals: Goal[] = ['maintain', 'loss', 'gain'];

  if (!validStages.includes(s) || !validGoals.includes(g)) {
    return null;
  }

  return {
    weight,
    stage: s,
    goal: g,
    neutered: n === '1'
  };
}
