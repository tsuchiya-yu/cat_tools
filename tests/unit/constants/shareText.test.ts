import {
  CALORIE_UI_TEXT,
  CAT_FOOD_SAFETY_TEXT,
  FEEDING_UI_TEXT,
  UI_TEXT,
} from '@/constants/text';

describe('X share hashtags', () => {
  it.each([
    ['猫の年齢計算', UI_TEXT.SHARE.X_HASHTAGS, ['#ねこツールズ', '#猫の年齢計算']],
    ['猫のカロリー計算', CALORIE_UI_TEXT.SHARE.X_HASHTAGS, ['#ねこツールズ', '#猫のカロリー計算']],
    ['猫の給餌量計算', FEEDING_UI_TEXT.SHARE.X_HASHTAGS, ['#ねこツールズ', '#猫の給餌量計算']],
    [
      '猫の食べ物安全性チェック',
      CAT_FOOD_SAFETY_TEXT.SHARE.X_HASHTAGS,
      ['#ねこツールズ', '#猫の食べ物安全性'],
    ],
  ])('%s uses the brand hashtag followed by its page hashtag', (_pageName, actual, expected) => {
    expect(actual).toEqual(expected);
  });

  it('keeps the age share text free of URLs and X-only hashtags', () => {
    const shareText = UI_TEXT.SHARE.SHARE_TEXT(7, 6);

    expect(shareText).toContain('7歳6か月');
    expect(shareText).not.toMatch(/https?:\/\//);
    expect(shareText).not.toContain('#');
  });

  it('keeps the food safety share text free of X-only hashtags', () => {
    const shareText = CAT_FOOD_SAFETY_TEXT.SHARE.FORMAT_TEXT(
      '玉ねぎ',
      ['危険'],
      'https://example.com/cat-food-safety?food=%E7%8E%89%E3%81%AD%E3%81%8E',
    );

    expect(shareText).not.toContain('#');
  });
});
