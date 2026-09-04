import { evaluateCatBcs, getCatBcsGuidanceBand, type Score } from '@/lib/catBcsCheck';

const score = (value: number) => value as Score;

describe('evaluateCatBcs', () => {
  const cases: Array<{
    ribs: number;
    waist: number;
    abdomen: number;
    expected: ReturnType<typeof evaluateCatBcs>;
  }> = [
    { ribs: 3, waist: 3, abdomen: 3, expected: { type: 'match', score: 3 } },
    { ribs: 1, waist: 1, abdomen: 1, expected: { type: 'match', score: 1 } },
    { ribs: 5, waist: 5, abdomen: 5, expected: { type: 'match', score: 5 } },
    { ribs: 3, waist: 3, abdomen: 4, expected: { type: 'adjacent', lower: 3, upper: 4 } },
    { ribs: 3, waist: 4, abdomen: 4, expected: { type: 'adjacent', lower: 3, upper: 4 } },
    { ribs: 2, waist: 3, abdomen: 3, expected: { type: 'adjacent', lower: 2, upper: 3 } },
    { ribs: 5, waist: 4, abdomen: 4, expected: { type: 'adjacent', lower: 4, upper: 5 } },
    { ribs: 1, waist: 1, abdomen: 2, expected: { type: 'adjacent', lower: 1, upper: 2 } },
    {
      ribs: 3,
      waist: 2,
      abdomen: 4,
      expected: { type: 'unresolved', reason: 'inconsistent_visuals' },
    },
    {
      ribs: 2,
      waist: 4,
      abdomen: 4,
      expected: { type: 'unresolved', reason: 'palpation_vs_visual' },
    },
    {
      ribs: 3,
      waist: 5,
      abdomen: 5,
      expected: { type: 'unresolved', reason: 'palpation_vs_visual' },
    },
    {
      ribs: 4,
      waist: 2,
      abdomen: 5,
      expected: { type: 'unresolved', reason: 'inconsistent_visuals' },
    },
    { ribs: 3, waist: 3, abdomen: 5, expected: { type: 'unresolved', reason: 'spread' } },
    { ribs: 3, waist: 4, abdomen: 5, expected: { type: 'unresolved', reason: 'spread' } },
  ];

  it.each(cases)(
    'Q1=$ribs / Q2=$waist / Q3=$abdomen → $expected',
    ({ ribs, waist, abdomen, expected }) => {
      expect(
        evaluateCatBcs({
          ribs: score(ribs),
          waist: score(waist),
          abdomen: score(abdomen),
        }),
      ).toEqual(expected);
    },
  );

  it('does not adopt visual majority when Q1 differs by 2+ stages', () => {
    expect(
      evaluateCatBcs({
        ribs: 2,
        waist: 4,
        abdomen: 4,
      }),
    ).toEqual({ type: 'unresolved', reason: 'palpation_vs_visual' });
  });
});

describe('getCatBcsGuidanceBand', () => {
  it('maps match scores to lean / ideal / heavy', () => {
    expect(getCatBcsGuidanceBand({ type: 'match', score: 1 })).toBe('lean');
    expect(getCatBcsGuidanceBand({ type: 'match', score: 2 })).toBe('lean');
    expect(getCatBcsGuidanceBand({ type: 'match', score: 3 })).toBe('ideal');
    expect(getCatBcsGuidanceBand({ type: 'match', score: 4 })).toBe('heavy');
    expect(getCatBcsGuidanceBand({ type: 'match', score: 5 })).toBe('heavy');
  });

  it('maps adjacent ranges without inventing wide bands', () => {
    expect(getCatBcsGuidanceBand({ type: 'adjacent', lower: 1, upper: 2 })).toBe('lean');
    expect(getCatBcsGuidanceBand({ type: 'adjacent', lower: 2, upper: 3 })).toBe('ideal');
    expect(getCatBcsGuidanceBand({ type: 'adjacent', lower: 3, upper: 4 })).toBe('ideal');
    expect(getCatBcsGuidanceBand({ type: 'adjacent', lower: 4, upper: 5 })).toBe('heavy');
  });

  it('maps unresolved to unresolved guidance', () => {
    expect(
      getCatBcsGuidanceBand({ type: 'unresolved', reason: 'palpation_vs_visual' }),
    ).toBe('unresolved');
  });
});
