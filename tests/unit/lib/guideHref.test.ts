import { classifyGuideHref, isAllowedGuideHref } from '@/lib/guides/guideHref';

describe('guideHref', () => {
  it('内部パス / アンカーを許可する', () => {
    expect(classifyGuideHref('/guides')).toBe('internal');
    expect(classifyGuideHref('#section')).toBe('internal');
    expect(isAllowedGuideHref('/about')).toBe(true);
  });

  it('http/https のみ外部として許可する', () => {
    expect(classifyGuideHref('https://example.com')).toBe('external');
    expect(classifyGuideHref('http://example.com')).toBe('external');
  });

  it('危険な scheme / protocol-relative を拒否する', () => {
    expect(classifyGuideHref('javascript:alert(1)')).toBe('invalid');
    expect(classifyGuideHref('JAVAScript:alert(1)')).toBe('invalid');
    expect(classifyGuideHref('  javascript:alert(1)  ')).toBe('invalid');
    expect(classifyGuideHref('//evil.example')).toBe('invalid');
    expect(classifyGuideHref('data:text/html,hi')).toBe('invalid');
    expect(isAllowedGuideHref('javascript:alert(1)')).toBe(false);
  });
});
