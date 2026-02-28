import { calculateCatWaterIntake, formatMl, round1 } from '@/lib/catWaterIntake';

describe('catWaterIntake', () => {
  test('体重のみで総水分目標を計算できる', () => {
    const result = calculateCatWaterIntake({ weightKg: 4.2 });

    expect(result.totalWaterMl).toEqual({ min: 168, mid: 210, max: 252 });
    expect(result.foodWaterMl).toBe(0);
    expect(result.drinkTargetMl).toEqual({ min: 168, mid: 210, max: 252 });
  });

  test('食事由来水分を差し引いて飲水目標を計算できる', () => {
    const result = calculateCatWaterIntake({
      weightKg: 4.2,
      dryFoodG: 40,
      wetFoodG: 80,
    });

    expect(result.foodWaterMl).toBe(66.4);
    expect(result.drinkTargetMl).toEqual({ min: 101.6, mid: 143.6, max: 185.6 });
  });

  test('食事由来水分が総目標を超える場合は0未満にならない', () => {
    const result = calculateCatWaterIntake({
      weightKg: 2,
      wetFoodG: 200,
    });

    expect(result.totalWaterMl).toEqual({ min: 80, mid: 100, max: 120 });
    expect(result.foodWaterMl).toBe(156);
    expect(result.drinkTargetMl).toEqual({ min: 0, mid: 0, max: 0 });
  });

  test('不正な入力を拒否する', () => {
    expect(() => calculateCatWaterIntake({ weightKg: 0 })).toThrow('weight must be > 0');
    expect(() => calculateCatWaterIntake({ weightKg: 4, dryFoodG: -1 })).toThrow('dryFoodG must be >= 0');
    expect(() => calculateCatWaterIntake({ weightKg: 4, wetFoodG: -1 })).toThrow('wetFoodG must be >= 0');
  });

  test('表示用フォーマットが整数と小数を整形できる', () => {
    expect(round1(12.34)).toBe(12.3);
    expect(formatMl(120)).toBe('120');
    expect(formatMl(120.25)).toBe('120.3');
  });
});
