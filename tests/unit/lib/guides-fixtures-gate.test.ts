describe('shouldIncludeGuideFixtures', () => {
  const ORIGINAL_ENV = { ...process.env };

  afterEach(() => {
    process.env = { ...ORIGINAL_ENV };
    jest.resetModules();
  });

  function loadShouldInclude() {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/lib/guides/meta.cjs').shouldIncludeGuideFixtures as () => boolean;
  }

  it('VERCEL_ENV=production + INCLUDE_GUIDE_FIXTURES=1 → false', () => {
    process.env.VERCEL_ENV = 'production';
    process.env.INCLUDE_GUIDE_FIXTURES = '1';
    process.env.NODE_ENV = 'production';
    expect(loadShouldInclude()()).toBe(false);
  });

  it('NODE_ENV=production + VERCEL_ENV未設定 → false', () => {
    delete process.env.VERCEL_ENV;
    delete process.env.INCLUDE_GUIDE_FIXTURES;
    delete process.env.CAT_TOOLS_PRODUCTION;
    process.env.NODE_ENV = 'production';
    expect(loadShouldInclude()()).toBe(false);
  });

  it('VERCEL_ENV=preview → true', () => {
    process.env.VERCEL_ENV = 'preview';
    process.env.NODE_ENV = 'production';
    delete process.env.INCLUDE_GUIDE_FIXTURES;
    expect(loadShouldInclude()()).toBe(true);
  });

  it('production では fixture slug が published に混入しない', () => {
    process.env.VERCEL_ENV = 'production';
    process.env.INCLUDE_GUIDE_FIXTURES = '1';
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const meta = require('@/lib/guides/meta.cjs') as typeof import('@/lib/guides/meta.cjs');
    const slugs = meta.getPublishedGuides({ includeContent: false }).map((guide) => guide.slug);
    expect(slugs).not.toContain('mdx-foundation-sample');
    expect(slugs).not.toContain('mdx-foundation-related');
    expect(slugs).not.toContain('mdx-foundation-draft');
  });
});
