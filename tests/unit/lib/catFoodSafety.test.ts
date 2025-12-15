import { searchCatFood } from '@/lib/catFoodSafety';

describe('searchCatFood', () => {
  it('returns exact match for kanji input', () => {
    const results = searchCatFood('玉ねぎ');
    expect(results[0]).toMatchObject({
      name: '玉ねぎ',
      status: '危険',
    });
  });

  it('handles hiragana input for katakana data', () => {
    const results = searchCatFood('にんにく');
    expect(results.some((item) => item.name === 'ニンニク')).toBe(true);
  });

  it('supports partial matches within combined names', () => {
    const results = searchCatFood('コーヒー');
    expect(results[0]).toMatchObject({
      name: expect.stringContaining('コーヒー'),
    });
  });

  it('returns empty array when no food is found', () => {
    expect(searchCatFood('存在しない食材')).toHaveLength(0);
  });
});
