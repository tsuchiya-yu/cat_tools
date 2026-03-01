import type { CatFoodItem } from '@/types';
import { pickFeaturedCatFoods } from '@/lib/catFoodFeaturedContent';

const sampleFoods: CatFoodItem[] = [
  {
    name: '玉ねぎ',
    status: '危険',
    description: 'desc',
    notes: 'notes',
  },
  {
    name: '牛乳・乳製品',
    status: '注意',
    description: 'desc',
    notes: 'notes',
  },
  {
    name: 'チョコレート',
    status: '危険',
    description: 'desc',
    notes: 'notes',
  },
];

describe('pickFeaturedCatFoods', () => {
  it('指定順を維持して一致する食材だけを返す', () => {
    const result = pickFeaturedCatFoods(
      sampleFoods,
      ['チョコレート', '存在しない食材', '玉ねぎ'],
      '危険'
    );

    expect(result.map((item) => item.name)).toEqual(['チョコレート', '玉ねぎ']);
  });

  it('ステータス不一致の食材を除外する', () => {
    const result = pickFeaturedCatFoods(sampleFoods, ['牛乳・乳製品'], '危険');

    expect(result).toEqual([]);
  });

  it('maxItems 上限を超えない', () => {
    const result = pickFeaturedCatFoods(sampleFoods, ['玉ねぎ', 'チョコレート'], '危険', 1);

    expect(result.map((item) => item.name)).toEqual(['玉ねぎ']);
  });

  it('development では未存在やステータス不一致を警告する', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    try {
      process.env.NODE_ENV = 'development';

      pickFeaturedCatFoods(sampleFoods, ['存在しない食材', '牛乳・乳製品'], '危険');

      expect(warnSpy).toHaveBeenCalledTimes(2);
    } finally {
      warnSpy.mockRestore();
      process.env.NODE_ENV = originalNodeEnv;
    }
  });
});
