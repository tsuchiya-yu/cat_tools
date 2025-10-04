/**
 * 猫のカロリー計算ユーティリティ
 */

export type Stage = 'kitten' | 'adult' | 'senior';
export type Goal = 'maintain' | 'loss' | 'gain';

export interface Factor {
  c: number;      // center coefficient
  min: number;    // minimum coefficient
  max: number;    // maximum coefficient
  label: string;  // display label
}

export interface CalcResult {
  kcal: number;
  range: string;
  factor: string;
}

/**
 * 小数点第1位で四捨五入
 */
export function round1(x: number): number {
  return Math.round(x * 10) / 10;
}

/**
 * RER (Resting Energy Requirement) を計算
 * RER = 70 * (weight ** 0.75)
 */
export function rer(weight: number): number {
  return 70 * Math.pow(weight, 0.75);
}

/**
 * ライフステージ・目標・去勢状態に基づいて係数を選択
 */
export function pickFactor(stage: Stage, goal: Goal, neutered: boolean): Factor {
  // goal が loss/gain の場合は最優先（stage/neutered は無視）
  if (goal === 'loss') {
    return {
      c: 0.85,
      min: 0.8,
      max: 1.0,
      label: '減量の目安'
    };
  }

  if (goal === 'gain') {
    return {
      c: 1.3,
      min: 1.2,
      max: 1.4,
      label: '増量の目安'
    };
  }

  // goal === 'maintain' の場合のみ stage と neutered を使用
  if (stage === 'kitten') {
    return {
      c: 2.5,
      min: 2.0,
      max: 3.0,
      label: '子猫の成長'
    };
  }

  if (stage === 'senior') {
    return {
      c: 1.2,
      min: 1.1,
      max: 1.4,
      label: 'シニアの目安'
    };
  }

  // stage === 'adult'
  if (neutered) {
    return {
      c: 1.2,
      min: 1.0,
      max: 1.6,
      label: '成猫・去勢/避妊済'
    };
  } else {
    return {
      c: 1.4,
      min: 1.2,
      max: 1.6,
      label: '成猫・未去勢/未避妊'
    };
  }
}

/**
 * 期待値を計算（表示形式に整形）
 */
export function expected(
  weight: number,
  stage: Stage,
  goal: Goal,
  neutered: boolean
): CalcResult {
  const R = rer(weight);
  const f = pickFactor(stage, goal, neutered);

  const kcal = round1(R * f.c);
  const range = `${round1(R * f.min)}〜${round1(R * f.max)} kcal/日`;
  const factor = `× ${f.c.toFixed(2)}（${f.label}）`;

  return { kcal, range, factor };
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
