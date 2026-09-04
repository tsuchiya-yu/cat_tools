/**
 * ガイド本文リンクの許可判定（scheme allowlist）。
 * 許可: サイト内パス (/...), アンカー (#), クエリ (?), http:, https:
 */
export function classifyGuideHref(href: string): 'internal' | 'external' | 'invalid' {
  const trimmed = href.trim();
  if (!trimmed) return 'invalid';

  // protocol-relative は外部として扱わず拒否（'/' 判定より先に見る）
  if (trimmed.startsWith('//')) return 'invalid';

  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('?')) {
    return 'internal';
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return 'external';
    }
    return 'invalid';
  } catch {
    return 'invalid';
  }
}

export function isAllowedGuideHref(href: string): boolean {
  return classifyGuideHref(href) !== 'invalid';
}
