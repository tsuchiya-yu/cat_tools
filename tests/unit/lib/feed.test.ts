import {
  calcGramsPerDay,
  calcMultiFoodGrams,
  calcTotalKcalFromGrams,
  roundGrams1,
  splitMorningNightTenths,
} from '@/lib/feed';

describe('calcGramsPerDay（1種類）', () => {
  test('200kcal / 400kcal/100g => 50g', () => {
    expect(calcGramsPerDay(200, 400)).toBe(50);
  });

  test('不正値では undefined', () => {
    expect(calcGramsPerDay(0, 400)).toBeUndefined();
    expect(calcGramsPerDay(200, 0)).toBeUndefined();
    expect(calcGramsPerDay(-1, 400)).toBeUndefined();
    expect(calcGramsPerDay(200, -1)).toBeUndefined();
    expect(calcGramsPerDay(Number.NaN, 400)).toBeUndefined();
  });
});

describe('calcMultiFoodGrams', () => {
  test('2種類 2:1（Issue #184 計算例）', () => {
    const result = calcMultiFoodGrams(200, [
      { kcalPer100g: 400, ratioGrams: 40 },
      { kcalPer100g: 360, ratioGrams: 20 },
    ]);

    expect(result).toBeDefined();
    expect(result![0].gramsPerDay).toBeCloseTo(34.4827586, 5);
    expect(result![1].gramsPerDay).toBeCloseTo(17.2413793, 5);
    expect(result![0].gramsPerDay / result![1].gramsPerDay).toBeCloseTo(2, 5);

    const totalKcal = calcTotalKcalFromGrams(
      [
        { kcalPer100g: 400, ratioGrams: 40 },
        { kcalPer100g: 360, ratioGrams: 20 },
      ],
      result!,
    );
    expect(totalKcal).toBeCloseTo(200, 5);

    expect(roundGrams1(result![0].gramsPerDay)).toBe(34.5);
    expect(roundGrams1(result![1].gramsPerDay)).toBe(17.2);
    expect(roundGrams1(result![0].gramsPerDay + result![1].gramsPerDay)).toBe(51.7);
  });

  test('2種類 1:1（異なるカロリー密度でも重量比は1:1）', () => {
    const result = calcMultiFoodGrams(200, [
      { kcalPer100g: 400, ratioGrams: 10 },
      { kcalPer100g: 300, ratioGrams: 10 },
    ]);

    expect(result).toBeDefined();
    expect(result![0].gramsPerDay).toBeCloseTo(result![1].gramsPerDay, 10);
    expect(result![0].gramsPerDay / result![1].gramsPerDay).toBeCloseTo(1, 10);

    const totalKcal = calcTotalKcalFromGrams(
      [
        { kcalPer100g: 400, ratioGrams: 10 },
        { kcalPer100g: 300, ratioGrams: 10 },
      ],
      result!,
    );
    expect(totalKcal).toBeCloseTo(200, 5);
  });

  test('同等比率（2g:1g と 40g:20g）は同じ結果', () => {
    const a = calcMultiFoodGrams(200, [
      { kcalPer100g: 400, ratioGrams: 2 },
      { kcalPer100g: 360, ratioGrams: 1 },
    ]);
    const b = calcMultiFoodGrams(200, [
      { kcalPer100g: 400, ratioGrams: 40 },
      { kcalPer100g: 360, ratioGrams: 20 },
    ]);

    expect(a![0].gramsPerDay).toBeCloseTo(b![0].gramsPerDay, 10);
    expect(a![1].gramsPerDay).toBeCloseTo(b![1].gramsPerDay, 10);
  });

  test('3種類でも比率と総カロリーが成立する', () => {
    const inputs = [
      { kcalPer100g: 400, ratioGrams: 40 },
      { kcalPer100g: 360, ratioGrams: 20 },
      { kcalPer100g: 200, ratioGrams: 10 },
    ];
    const result = calcMultiFoodGrams(250, inputs);

    expect(result).toHaveLength(3);
    expect(result![0].gramsPerDay / result![1].gramsPerDay).toBeCloseTo(2, 5);
    expect(result![1].gramsPerDay / result![2].gramsPerDay).toBeCloseTo(2, 5);
    expect(calcTotalKcalFromGrams(inputs, result!)).toBeCloseTo(250, 5);
  });

  test('5種類まで計算できる', () => {
    const inputs = [
      { kcalPer100g: 400, ratioGrams: 10 },
      { kcalPer100g: 380, ratioGrams: 10 },
      { kcalPer100g: 360, ratioGrams: 10 },
      { kcalPer100g: 340, ratioGrams: 10 },
      { kcalPer100g: 320, ratioGrams: 10 },
    ];
    const result = calcMultiFoodGrams(300, inputs);

    expect(result).toHaveLength(5);
    for (let i = 1; i < 5; i += 1) {
      expect(result![i].gramsPerDay).toBeCloseTo(result![0].gramsPerDay, 10);
    }
    expect(calcTotalKcalFromGrams(inputs, result!)).toBeCloseTo(300, 5);
  });

  test('invalid では undefined（NaN / Infinity を返さない）', () => {
    const validFood = { kcalPer100g: 400, ratioGrams: 40 };

    expect(calcMultiFoodGrams(0, [validFood])).toBeUndefined();
    expect(calcMultiFoodGrams(200, [{ kcalPer100g: 0, ratioGrams: 40 }])).toBeUndefined();
    expect(calcMultiFoodGrams(200, [{ kcalPer100g: 400, ratioGrams: 0 }])).toBeUndefined();
    expect(calcMultiFoodGrams(-10, [validFood])).toBeUndefined();
    expect(calcMultiFoodGrams(200, [{ kcalPer100g: -1, ratioGrams: 40 }])).toBeUndefined();
    expect(calcMultiFoodGrams(200, [{ kcalPer100g: 400, ratioGrams: -1 }])).toBeUndefined();
    expect(calcMultiFoodGrams(Number.NaN, [validFood])).toBeUndefined();
    expect(calcMultiFoodGrams(200, [{ kcalPer100g: Number.NaN, ratioGrams: 40 }])).toBeUndefined();
    expect(calcMultiFoodGrams(200, [])).toBeUndefined();
  });
});

describe('splitMorningNightTenths', () => {
  test('未丸め値を半分にしてから 0.1g 表示し、夜側で差分を吸収する', () => {
    const split = splitMorningNightTenths(34.4827586);
    expect(split.total).toBe(34.5);
    expect(split.morning).toBe(17.2);
    expect(split.night).toBe(17.3);
    expect(roundGrams1(split.morning + split.night)).toBe(split.total);
  });
});
