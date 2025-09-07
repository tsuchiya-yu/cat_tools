import { CatAgeResult } from '@/types';

/**
 * 日付文字列（YYYY-MM-DD）をローカル日付に変換
 */
export function toLocalDate(yyyyMMdd: string): Date {
  const [y, m, d] = yyyyMMdd.split('-').map(Number);
  const dt = new Date();
  dt.setHours(0, 0, 0, 0);
  dt.setFullYear(y, m - 1, d);
  return dt;
}

/**
 * 日付の時間部分を削除
 */
export function stripTime(date: Date): Date {
  const x = new Date(date);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * 2つの日付間の月数の差を計算
 */
export function diffInMonths(startDate: Date, endDate: Date): number {
  let months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
               (endDate.getMonth() - startDate.getMonth());
  
  if (endDate.getDate() < startDate.getDate()) {
    months--;
  }
  
  return Math.max(0, months);
}

/**
 * 猫の月齢から人間年齢（小数）を計算
 */
export function humanAgeYearsDecimal(months: number): number {
  if (months <= 0) return 0;
  if (months < 12) return 15 * (months / 12);
  if (months < 24) return 15 + 9 * ((months - 12) / 12);
  return 24 + 4 * ((months - 24) / 12);
}

/**
 * 人間年齢からライフステージを判定
 */
export function lifeStage(humanAge: number, years: number, months: number): string {
  // 実年齢からライフステージを判定
  const realAge = years + months / 12;
  
  if (realAge <= 1) return '子猫(0–1歳)';
  if (realAge <= 6) return '若年成猫(1–6歳)';
  if (realAge <= 10) return '成熟成猫(7–10歳)';
  return 'シニア(11歳〜)';
}

/**
 * 次の誕生日までの日数を計算
 */
export function daysUntilNextBirthday(birthDate: Date, today: Date): number {
  const next = new Date(today);
  next.setHours(0, 0, 0, 0);
  next.setMonth(birthDate.getMonth(), birthDate.getDate());
  
  if (next <= today) {
    next.setFullYear(today.getFullYear() + 1);
  }
  
  return Math.ceil((next.getTime() - stripTime(today).getTime()) / 86400000);
}

/**
 * 猫の年齢を計算するメイン関数
 */
export function calculateCatAge(birthDateString: string): CatAgeResult {
  const birthDate = toLocalDate(birthDateString);
  const today = new Date();
  
  // 実年齢（月）
  const months = diffInMonths(birthDate, today);
  const realAgeYears = Math.floor(months / 12);
  const realAgeMonths = months % 12;
  
  // 人間年齢（年の小数）→ 年＋月に変換（四捨五入で最も近い月）
  const humanYears = humanAgeYearsDecimal(months);
  const hmTotal = Math.round(humanYears * 12);
  const humanAgeYears = Math.floor(hmTotal / 12);
  const humanAgeMonths = hmTotal % 12;
  
  // ライフステージ
  const stage = lifeStage(humanYears, realAgeYears, realAgeMonths);
  
  // 次の誕生日まで
  const days = daysUntilNextBirthday(birthDate, today);
  
  return {
    humanAgeYears,
    humanAgeMonths,
    realAgeYears,
    realAgeMonths,
    lifeStage: stage,
    daysUntilBirthday: days
  };
}

/**
 * 今日の日付をYYYY-MM-DD形式で取得
 */
export function getTodayString(): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}
