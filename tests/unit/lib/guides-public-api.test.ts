/**
 * @jest-environment node
 */
import { getPublishedGuides, getGuideBySlug, isSafeSlug } from '@/lib/guides';

describe('guides public API (fixtures)', () => {
  it('fixture の公開記事だけを一覧できる', () => {
    const guides = getPublishedGuides({ includeContent: false });
    const slugs = guides.map((guide) => guide.slug);

    expect(slugs).toContain('mdx-foundation-sample');
    expect(slugs).toContain('mdx-foundation-related');
    expect(slugs).not.toContain('mdx-foundation-draft');
  });

  it('draft / 不明 slug は null', () => {
    expect(getGuideBySlug('mdx-foundation-draft')).toBeNull();
    expect(getGuideBySlug('does-not-exist')).toBeNull();
    expect(isSafeSlug('../secret')).toBe(false);
  });

  it('公開 fixture の metadata / related を解決できる', () => {
    const guide = getGuideBySlug('mdx-foundation-sample');
    expect(guide).not.toBeNull();
    expect(guide?.metadata.relatedTools).toContain('calculate-cat-feeding');
    expect(guide?.metadata.relatedGuides).toContain('mdx-foundation-related');
    expect(guide?.metadata.references.length).toBeGreaterThan(0);
    expect(guide?.metadata.updatedAt).toBe('2026-09-04');
  });
});
