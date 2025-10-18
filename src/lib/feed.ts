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
  const night = totalInt - morning; // 合計ズレは朝側で吸収
  return { morning, night, totalInt };
}
