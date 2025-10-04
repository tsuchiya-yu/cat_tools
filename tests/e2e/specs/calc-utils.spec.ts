import { test, expect } from '@playwright/test';
import {
  round1,
  rer,
  pickFactor,
  expected,
  isValidWeight,
  buildUrlParams,
  parseUrlParams
} from '../utils/calc';

test.describe('計算ユーティリティのテスト', () => {
  test.describe('round1', () => {
    test('小数点第1位で四捨五入', () => {
      expect(round1(123.45)).toBe(123.5);
      expect(round1(123.44)).toBe(123.4);
      expect(round1(123.46)).toBe(123.5);
      expect(round1(123.0)).toBe(123.0);
      expect(round1(0.05)).toBe(0.1);
      expect(round1(0.04)).toBe(0.0);
    });
  });

  test.describe('rer', () => {
    test('RER計算の精度確認', () => {
      // RER = 70 * (weight ** 0.75)
      expect(rer(1.0)).toBe(70.0);
      expect(round1(rer(4.2))).toBe(205.4);
      expect(round1(rer(10.0))).toBe(393.6);
    });
  });

  test.describe('pickFactor', () => {
    test('goal=loss の場合は stage/neutered を無視', () => {
      const factor = pickFactor('adult', 'loss', true);
      expect(factor).toEqual({
        c: 0.85,
        min: 0.8,
        max: 1.0,
        label: '減量の目安'
      });

      // 他の組み合わせでも同じ結果
      expect(pickFactor('kitten', 'loss', false)).toEqual(factor);
      expect(pickFactor('senior', 'loss', true)).toEqual(factor);
    });

    test('goal=gain の場合は stage/neutered を無視', () => {
      const factor = pickFactor('adult', 'gain', true);
      expect(factor).toEqual({
        c: 1.3,
        min: 1.2,
        max: 1.4,
        label: '増量の目安'
      });

      // 他の組み合わせでも同じ結果
      expect(pickFactor('kitten', 'gain', false)).toEqual(factor);
      expect(pickFactor('senior', 'gain', true)).toEqual(factor);
    });

    test('goal=maintain の場合は stage/neutered を使用', () => {
      // kitten
      expect(pickFactor('kitten', 'maintain', true)).toEqual({
        c: 2.5,
        min: 2.0,
        max: 3.0,
        label: '子猫の成長'
      });

      // senior
      expect(pickFactor('senior', 'maintain', false)).toEqual({
        c: 1.2,
        min: 1.1,
        max: 1.4,
        label: 'シニアの目安'
      });

      // adult + neutered
      expect(pickFactor('adult', 'maintain', true)).toEqual({
        c: 1.2,
        min: 1.0,
        max: 1.6,
        label: '成猫・去勢/避妊済'
      });

      // adult + not neutered
      expect(pickFactor('adult', 'maintain', false)).toEqual({
        c: 1.4,
        min: 1.2,
        max: 1.6,
        label: '成猫・未去勢/未避妊'
      });
    });
  });

  test.describe('expected', () => {
    test('体重4.2kgの期待値サンプル', () => {
      const weight = 4.2;
      const RER = rer(weight); // rer()を直接呼び出す

      // maintain + kitten
      const kittenFactor = pickFactor('kitten', 'maintain', false);
      const kitten = expected(weight, 'kitten', 'maintain', false);
      expect(kitten.kcal).toBe(round1(RER * kittenFactor.c));
      expect(kitten.range).toBe(`${round1(RER * kittenFactor.min)}〜${round1(RER * kittenFactor.max)} kcal/日`);
      expect(kitten.factor).toBe(`× ${kittenFactor.c.toFixed(2)}（${kittenFactor.label}）`);

      // maintain + adult + neutered
      const adultNeuteredFactor = pickFactor('adult', 'maintain', true);
      const adultNeutered = expected(weight, 'adult', 'maintain', true);
      expect(adultNeutered.kcal).toBe(round1(RER * adultNeuteredFactor.c));
      expect(adultNeutered.range).toBe(`${round1(RER * adultNeuteredFactor.min)}〜${round1(RER * adultNeuteredFactor.max)} kcal/日`);
      expect(adultNeutered.factor).toBe(`× ${adultNeuteredFactor.c.toFixed(2)}（${adultNeuteredFactor.label}）`);

      // maintain + adult + not neutered
      const adultNotNeuteredFactor = pickFactor('adult', 'maintain', false);
      const adultNotNeutered = expected(weight, 'adult', 'maintain', false);
      expect(adultNotNeutered.kcal).toBe(round1(RER * adultNotNeuteredFactor.c));
      expect(adultNotNeutered.range).toBe(`${round1(RER * adultNotNeuteredFactor.min)}〜${round1(RER * adultNotNeuteredFactor.max)} kcal/日`);
      expect(adultNotNeutered.factor).toBe(`× ${adultNotNeuteredFactor.c.toFixed(2)}（${adultNotNeuteredFactor.label}）`);

      // maintain + senior
      const seniorFactor = pickFactor('senior', 'maintain', false);
      const senior = expected(weight, 'senior', 'maintain', false);
      expect(senior.kcal).toBe(round1(RER * seniorFactor.c));
      expect(senior.range).toBe(`${round1(RER * seniorFactor.min)}〜${round1(RER * seniorFactor.max)} kcal/日`);
      expect(senior.factor).toBe(`× ${seniorFactor.c.toFixed(2)}（${seniorFactor.label}）`);

      // loss (stage無関係)
      const lossFactor = pickFactor('adult', 'loss', true);
      const loss = expected(weight, 'adult', 'loss', true);
      expect(loss.kcal).toBe(round1(RER * lossFactor.c));
      expect(loss.range).toBe(`${round1(RER * lossFactor.min)}〜${round1(RER * lossFactor.max)} kcal/日`);
      expect(loss.factor).toBe(`× ${lossFactor.c.toFixed(2)}（${lossFactor.label}）`);

      // gain (stage無関係)
      const gainFactor = pickFactor('senior', 'gain', false);
      const gain = expected(weight, 'senior', 'gain', false);
      expect(gain.kcal).toBe(round1(RER * gainFactor.c));
      expect(gain.range).toBe(`${round1(RER * gainFactor.min)}〜${round1(RER * gainFactor.max)} kcal/日`);
      expect(gain.factor).toBe(`× ${gainFactor.c.toFixed(2)}（${gainFactor.label}）`);
    });
  });

  test.describe('isValidWeight', () => {
    test('体重バリデーション', () => {
      expect(isValidWeight(0.4)).toBe(false);
      expect(isValidWeight(0.5)).toBe(true);
      expect(isValidWeight(6.0)).toBe(true);
      expect(isValidWeight(12.0)).toBe(true);
      expect(isValidWeight(12.1)).toBe(false);
    });
  });

  test.describe('URLパラメータ', () => {
    test('buildUrlParams', () => {
      const params = buildUrlParams(4.2, 'adult', 'maintain', true);
      expect(params).toBe('w=4.2&s=adult&g=maintain&n=1');

      const params2 = buildUrlParams(2.5, 'kitten', 'loss', false);
      expect(params2).toBe('w=2.5&s=kitten&g=loss&n=0');
    });

    test('parseUrlParams', () => {
      const result = parseUrlParams('w=4.2&s=adult&g=maintain&n=1');
      expect(result).toEqual({
        weight: 4.2,
        stage: 'adult',
        goal: 'maintain',
        neutered: true
      });

      const result2 = parseUrlParams('w=2.5&s=kitten&g=loss&n=0');
      expect(result2).toEqual({
        weight: 2.5,
        stage: 'kitten',
        goal: 'loss',
        neutered: false
      });

      // 不正なパラメータ
      expect(parseUrlParams('w=invalid&s=adult&g=maintain&n=1')).toBeNull();
      expect(parseUrlParams('w=4.2&s=invalid&g=maintain&n=1')).toBeNull();
      expect(parseUrlParams('w=4.2&s=adult&g=invalid&n=1')).toBeNull();
      expect(parseUrlParams('incomplete')).toBeNull();
    });
  });
});
