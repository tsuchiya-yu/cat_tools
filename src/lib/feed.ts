export function normalizeNumberInput(s: string): number | undefined {
  const ascii = s.replace(/[０-９．－]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0));
  const t = ascii.replace(/,/g, '').trim();
  if (t === '') return undefined; // 空文字は undefined
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

export function calcGramsPerDay(
  dailyKcal: number,
  kcalPer100g: number
): number | undefined {
  if (!(dailyKcal > 0) || !(kcalPer100g > 0)) return undefined;
  return (dailyKcal / kcalPer100g) * 100;
}

export function splitMorningNight(totalGrams: number): {
  morning: number;
  night: number;
  totalInt: number;
} {
  const totalInt = Math.round(totalGrams);
  const morning = Math.round(totalInt / 2);
  const night = totalInt - morning; // 合計との差分は夜側で吸収
  return { morning, night, totalInt };
}

export type FoodRatioInput = {
  kcalPer100g: number;
  ratioGrams: number;
};

export type FoodAmountResult = {
  gramsPerDay: number;
};

/**
 * 複数フードの重量比を保ったまま、1日の必要カロリーに合う各フードの給餌量(g)を求める。
 * 途中では丸めない。不正値では undefined を返す（NaN / Infinity を返さない）。
 */
export function calcMultiFoodGrams(
  dailyKcal: number,
  foods: FoodRatioInput[],
): FoodAmountResult[] | undefined {
  if (!Array.isArray(foods) || foods.length === 0) return undefined;
  if (!(dailyKcal > 0) || !Number.isFinite(dailyKcal)) return undefined;

  for (const food of foods) {
    if (!(food.kcalPer100g > 0) || !Number.isFinite(food.kcalPer100g)) return undefined;
    if (!(food.ratioGrams > 0) || !Number.isFinite(food.ratioGrams)) return undefined;
  }

  let baseKcal = 0;
  for (const food of foods) {
    baseKcal += (food.ratioGrams * food.kcalPer100g) / 100;
  }
  if (!(baseKcal > 0) || !Number.isFinite(baseKcal)) return undefined;

  const scale = dailyKcal / baseKcal;
  if (!Number.isFinite(scale)) return undefined;

  return foods.map((food) => ({
    gramsPerDay: food.ratioGrams * scale,
  }));
}

/** 表示用に 0.1g 単位へ丸める（内部計算では使わない） */
export function roundGrams1(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * 複数フード用の朝夜分割。
 * 未丸めの1日量を半分にしてから表示用に丸め、夜側で表示合計との差分を吸収する。
 */
export function splitMorningNightTenths(gramsPerDay: number): {
  total: number;
  morning: number;
  night: number;
} {
  const total = roundGrams1(gramsPerDay);
  const morning = roundGrams1(gramsPerDay / 2);
  const night = roundGrams1(total - morning);
  return { total, morning, night };
}

/** 結果グラムから合計カロリーを求める（表示用。途中丸めなし） */
export function calcTotalKcalFromGrams(
  foods: FoodRatioInput[],
  amounts: FoodAmountResult[],
): number | undefined {
  if (foods.length !== amounts.length || foods.length === 0) return undefined;
  let total = 0;
  for (let i = 0; i < foods.length; i += 1) {
    const kcal = (amounts[i].gramsPerDay * foods[i].kcalPer100g) / 100;
    if (!Number.isFinite(kcal)) return undefined;
    total += kcal;
  }
  if (!Number.isFinite(total)) return undefined;
  return total;
}
