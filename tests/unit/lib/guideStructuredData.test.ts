import { createArticleStructuredData } from '@/lib/guideStructuredData';
import {
  createBreadcrumbList,
  createHomeBreadcrumbList,
  createPageBreadcrumbList,
} from '@/lib/breadcrumbStructuredData';

describe('guideStructuredData', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://cat-tools.catnote.tokyo';
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });

  it('Article JSON-LD を実データから生成する', () => {
    const data = createArticleStructuredData({
      headline: 'サンプル記事',
      description: '説明',
      path: '/guides/sample',
      datePublished: '2026-09-01',
      dateModified: '2026-09-02',
      author: {
        name: 'つくしの飼い主',
        url: '/about',
      },
    });

    expect(data).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'サンプル記事',
      description: '説明',
      datePublished: '2026-09-01',
      dateModified: '2026-09-02',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': 'https://cat-tools.catnote.tokyo/guides/sample',
      },
      author: {
        '@type': 'Person',
        name: 'つくしの飼い主',
        url: 'https://cat-tools.catnote.tokyo/about',
      },
      publisher: {
        '@type': 'Organization',
        name: 'ねこツールズ',
      },
    });
  });
});

describe('breadcrumbStructuredData', () => {
  const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://cat-tools.catnote.tokyo';
  });

  afterAll(() => {
    process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl;
  });

  it('既存 home / page helper の挙動を維持する', () => {
    expect(createHomeBreadcrumbList().itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ねこツールズ',
        item: 'https://cat-tools.catnote.tokyo/',
      },
    ]);

    expect(
      createPageBreadcrumbList({ name: '猫の年齢計算', path: '/calculate-cat-age' })
        .itemListElement,
    ).toHaveLength(2);
  });

  it('ガイド記事向けに3階層 BreadcrumbList を作れる', () => {
    const data = createBreadcrumbList([
      { name: 'ねこツールズ', path: '/' },
      { name: 'ガイド・読みもの', path: '/guides' },
      { name: 'サンプル', path: '/guides/sample' },
    ]);

    expect(data.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'ねこツールズ',
        item: 'https://cat-tools.catnote.tokyo/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'ガイド・読みもの',
        item: 'https://cat-tools.catnote.tokyo/guides',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'サンプル',
        item: 'https://cat-tools.catnote.tokyo/guides/sample',
      },
    ]);
  });
});
