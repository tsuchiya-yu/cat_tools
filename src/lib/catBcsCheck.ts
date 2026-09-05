export type Score = 1 | 2 | 3 | 4 | 5;

export type CatBcsAnswers = {
  ribs: Score;
  waist: Score;
  abdomen: Score;
};

export type AdjacentResult =
  | { type: 'adjacent'; lower: 1; upper: 2 }
  | { type: 'adjacent'; lower: 2; upper: 3 }
  | { type: 'adjacent'; lower: 3; upper: 4 }
  | { type: 'adjacent'; lower: 4; upper: 5 };

export type CatBcsResult =
  | { type: 'match'; score: Score }
  | AdjacentResult
  | {
      type: 'unresolved';
      reason: 'palpation_vs_visual' | 'inconsistent_visuals' | 'spread';
    };

export type CatBcsGuidanceBand = 'lean' | 'ideal' | 'heavy' | 'unresolved';

const SCORES: readonly Score[] = [1, 2, 3, 4, 5];

function isScore(value: number): value is Score {
  return SCORES.includes(value as Score);
}

function toScore(value: number): Score {
  if (!isScore(value)) {
    throw new Error(`Invalid BCS score: ${value}`);
  }
  return value;
}

function toAdjacentResult(lower: Score, upper: Score): AdjacentResult {
  if (upper - lower !== 1) {
    throw new Error(`Adjacent BCS range must differ by 1: ${lower}-${upper}`);
  }
  return { type: 'adjacent', lower, upper } as AdjacentResult;
}

/**
 * Q1（肋骨触診）を candidate とし、Q2/Q3 の身体所見との一致を照合する。
 * 平均・中央値・加重平均による BCS 算出は行わない。
 */
export function evaluateCatBcs({ ribs, waist, abdomen }: CatBcsAnswers): CatBcsResult {
  const candidate = ribs;
  const dWaist = Math.abs(waist - candidate);
  const dAbdomen = Math.abs(abdomen - candidate);
  const maxDev = Math.max(dWaist, dAbdomen);
  const visualSpan = Math.abs(waist - abdomen);
  const lo = toScore(Math.min(ribs, waist, abdomen));
  const hi = toScore(Math.max(ribs, waist, abdomen));

  // Rule A — 高い一致
  if (dWaist === 0 && dAbdomen === 0) {
    return { type: 'match', score: candidate };
  }

  // Rule B — 隣接段階の境界
  if (maxDev <= 1 && visualSpan <= 1 && hi - lo === 1) {
    return toAdjacentResult(lo, hi);
  }

  // Rule C — 触診と見た目の食い違い（見た目の多数決で Q1 を上書きしない）
  if (visualSpan === 0 && maxDev >= 2) {
    return { type: 'unresolved', reason: 'palpation_vs_visual' };
  }

  // Rule D — その他
  // Issue #175 のテスト表に合わせる:
  // - Q2/Q3 が大きく分かれ、かつ候補の両側または双方が候補と異なる → inconsistent_visuals
  // - 片方は候補と一致しもう片方が離れる / 段階的なずれ → spread
  if (visualSpan >= 2) {
    const waistDelta = waist - candidate;
    const abdomenDelta = abdomen - candidate;
    const oppositeSidesOfCandidate = waistDelta * abdomenDelta < 0;
    const bothDifferFromCandidate = waist !== candidate && abdomen !== candidate;

    if (oppositeSidesOfCandidate || bothDifferFromCandidate) {
      return { type: 'unresolved', reason: 'inconsistent_visuals' };
    }
  }

  return { type: 'unresolved', reason: 'spread' };
}

/** 結果後の注意・導線切替用。ユーザー向けの確定 BCS としては扱わない。 */
export function getCatBcsGuidanceBand(result: CatBcsResult): CatBcsGuidanceBand {
  if (result.type === 'unresolved') {
    return 'unresolved';
  }

  if (result.type === 'match') {
    if (result.score <= 2) return 'lean';
    if (result.score >= 4) return 'heavy';
    return 'ideal';
  }

  // adjacent: 隣接2段階のみ
  if (result.upper <= 2) return 'lean';
  if (result.lower >= 4) return 'heavy';
  return 'ideal';
}
