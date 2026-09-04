/**
 * @jest-environment node
 */
import {
  getHomeFeaturedGuides,
  HOME_FEATURED_GUIDE_LIMIT,
} from '@/lib/guides/homeFeatured';

describe('getHomeFeaturedGuides', () => {
  it('本番向けガイドのみを新しい順で最大3件返す（fixture を含めない）', () => {
    const guides = getHomeFeaturedGuides();

    expect(guides.length).toBeGreaterThanOrEqual(2);
    expect(guides.length).toBeLessThanOrEqual(HOME_FEATURED_GUIDE_LIMIT);

    const hrefs = guides.map((guide) => guide.href);
    expect(hrefs).toContain('/guides/cat-food-amount');
    expect(hrefs).toContain('/cat-meal-management');
    expect(hrefs.every((href) => !href.includes('mdx-foundation'))).toBe(true);

    // 新しい順: ご飯量 (2026-09-04) → 食事管理 (2026-08-27)
    expect(guides[0]?.href).toBe('/guides/cat-food-amount');
    expect(guides[1]?.href).toBe('/cat-meal-management');

    for (let i = 1; i < guides.length; i += 1) {
      expect(guides[i - 1].publishedAt >= guides[i].publishedAt).toBe(true);
    }
  });
});
