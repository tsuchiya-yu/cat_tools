import { getSiteUrl } from '@/config/site';
import { SITE_CONFIG } from '@/config/site';
import type { GuideAuthor } from '@/lib/guides/types';

type CreateArticleStructuredDataInput = {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  author: GuideAuthor;
};

export function createArticleStructuredData({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  author,
}: CreateArticleStructuredDataInput) {
  const pageUrl = new URL(path, getSiteUrl()).toString();
  const authorUrl = new URL(author.url, getSiteUrl()).toString();

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    author: {
      '@type': 'Person',
      name: author.name,
      url: authorUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.NAME,
    },
  };
}
