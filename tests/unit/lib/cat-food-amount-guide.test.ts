/**
 * @jest-environment node
 */
import { getGuideBySlug, getPublishedGuides } from '@/lib/guides';

const SLUG = 'cat-food-amount';

describe('cat-food-amount guide content', () => {
  it('公開記事として frontmatter が確定値と一致する', () => {
    const guide = getGuideBySlug(SLUG);
    expect(guide).not.toBeNull();
    expect(guide?.metadata).toMatchObject({
      title: '猫のご飯の量は1日何グラム？体重別早見表と適量の計算方法',
      description:
        '猫のご飯は1日何グラムが目安？3kg・4kg・5kg・6kgの成猫について、必要カロリーと給餌量の参考値を体重別に紹介。フードのカロリーから愛猫に合ったご飯量を計算する方法も解説します。',
      category: 'nutrition',
      publishedAt: '2026-09-04',
      updatedAt: '2026-09-04',
      author: 'tsuchiya-yu',
      relatedTools: ['calculate-cat-calorie', 'calculate-cat-feeding'],
      relatedGuides: [],
      draft: false,
    });
    expect(guide?.metadata.references).toHaveLength(4);

    const published = getPublishedGuides({ includeContent: false });
    expect(published.some((item) => item.slug === SLUG)).toBe(true);
  });

  it('重要数値・安全性表現が確定原稿どおり維持される', () => {
    const guide = getGuideBySlug(SLUG);
    const content = guide?.content ?? '';

    expect(content).toContain('| 3kg | 約200〜210kcal | 約50〜53g |');
    expect(content).toContain('| 4kg | 約225〜250kcal | 約56〜63g |');
    expect(content).toContain('| 5kg | 約250〜290kcal | 約63〜73g |');
    expect(content).toContain('| 6kg | 約265〜330kcal | 約66〜83g |');
    expect(content).toContain('400kcal / 100g');
    expect(content).toContain('RER = 70 × 体重(kg)^0.75');
    expect(content).toContain('240 ÷ 400 × 100 = 60g');
    expect(content).toContain('240 ÷ 350 × 100 ≒ 69g');
    expect(content).toContain('280 ÷ 400 × 100 = 70g');
    expect(content).toContain('280 ÷ 350 × 100 = 80g');
    expect(content).toContain('9段階BCS');
    expect(content).toContain('| 1〜3 | 痩せ気味 |');
    expect(content).toContain('| 4〜5 | 概ね適正 |');
    expect(content).toContain('| 6〜7 | 太り気味 |');
    expect(content).toContain('| 8〜9 | 肥満 |');
    expect(content).toContain('1日の総摂取カロリーの10%以下');
    expect(content).toContain('「4kgなら必ず60g前後」という意味ではありません。');
  });

  it('指定の内部リンクのみを持つ', () => {
    const guide = getGuideBySlug(SLUG);
    const content = guide?.content ?? '';

    expect(content).toContain('[→ 猫のカロリー計算で必要カロリーを確認する](/calculate-cat-calorie)');
    expect(content).toContain('[→ 猫の給餌量計算で実際のグラム数を確認する](/calculate-cat-feeding)');
    expect(content).toContain('[→ 猫のカロリー計算](/calculate-cat-calorie)');
    expect(content).toContain('[→ 猫の給餌量計算](/calculate-cat-feeding)');
    expect(content).toContain('[猫の食事管理ガイド](/cat-meal-management)');
    expect(content).not.toContain('/guides/cat-meal-management');
    expect(content).not.toContain('/cat-bcs-check');
  });
});
