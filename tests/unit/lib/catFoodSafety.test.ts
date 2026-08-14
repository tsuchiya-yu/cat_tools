import { searchCatFood } from '@/lib/catFoodSafety';

describe('searchCatFood', () => {
  it('returns exact match for kanji input', async () => {
    const results = await searchCatFood('玉ねぎ');
    expect(results[0]).toMatchObject({
      name: '玉ねぎ',
      status: '危険',
    });
  });

  it('handles hiragana input for katakana data', async () => {
    const results = await searchCatFood('にんにく');
    expect(results.some((item) => item.name === 'ニンニク')).toBe(true);
  });

  it('supports partial matches within combined names', async () => {
    const results = await searchCatFood('コーヒー');
    expect(results[0]).toMatchObject({
      name: expect.stringContaining('コーヒー'),
    });
  });

  it('returns empty array when no food is found', async () => {
    expect(await searchCatFood('存在しない食材')).toHaveLength(0);
  });

  it('犬で確認された毒性と猫での限定的な知見を区別する', async () => {
    const [grape] = await searchCatFood('ぶどう・レーズン');
    const [xylitol] = await searchCatFood('人工甘味料（キシリトール）');
    const [macadamia] = await searchCatFood('マカダミアナッツ');

    expect(grape).toMatchObject({ status: '危険' });
    expect(grape.description).toContain('主に犬で報告');
    expect(grape.description).toContain('猫13頭');
    expect(grape.description).toContain('急性腎障害は確認されませんでした');
    expect(grape.description).toContain('猫に安全とは判断できません');

    expect(xylitol).toMatchObject({ status: '注意' });
    expect(xylitol.description).toContain('犬で重い低血糖や肝障害');
    expect(xylitol.description).toContain('健康な猫6匹');

    expect(macadamia).toMatchObject({ status: '注意' });
    expect(macadamia.description).toContain('犬で報告');
    expect(macadamia.description).toContain('猫で同じ症状が確認された報告はありません');
  });

  it('加工食品で犬のキシリトール中毒を猫の症状として扱わない', async () => {
    const [gumAndCandy] = await searchCatFood('ガム・キャンディ');

    expect(gumAndCandy).toMatchObject({ status: '注意' });
    expect(gumAndCandy.description).toContain('製品によって原材料や形状が大きく異なり');
    expect(gumAndCandy.description).toContain('犬で知られています');
    expect(gumAndCandy.description).toContain('猫で同じ影響は確認されていません');
    expect(gumAndCandy.description).not.toContain('猫に低血糖や肝障害');
  });

  it.each([
    ['ピーナッツバター', /犬で知られています/, /猫で同じ影響は確認されていません/],
    ['ガム・キャンディ', /犬で知られています/, /猫で同じ影響は確認されていません/],
    ['ヨーグルトレーズン・チョコレートがけ菓子', /主に犬で報告/, /猫での根拠は限られています/],
    ['ドライフルーツ（デーツ・イチジクなど）', /主に犬で報告/, /猫での根拠は限られます/],
  ])('%sで犬の知見と猫の限定的な知見を区別する', async (name, dogEvidence, catEvidence) => {
    const [food] = await searchCatFood(name);

    expect(food.description + food.notes).toMatch(dogEvidence);
    expect(food.description + food.notes).toMatch(catEvidence);
  });

  it.each([
    ['ナッツ類（アーモンド、クルミ、ピーナッツなど）', /マカダミアナッツの特有の中毒症状は犬での報告/],
    ['エナジーバー・プロテインバー', /猫にも有害なチョコレートやカフェイン/],
  ])('%sで原材料ごとのリスクを区別する', async (name, expectedMeaning) => {
    const [food] = await searchCatFood(name);

    expect(food.description + food.notes).toMatch(expectedMeaning);
  });
});
