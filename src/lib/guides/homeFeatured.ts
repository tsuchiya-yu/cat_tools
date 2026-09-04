import path from 'path';
import { CAT_MEAL_MANAGEMENT_PATH, GUIDES_PATH } from '@/constants/paths';
import { getPublishedGuides } from '@/lib/guides';

export const HOME_FEATURED_GUIDE_LIMIT = 3;

export type HomeFeaturedGuide = {
  href: string;
  title: string;
  description: string;
  ariaLabel: string;
  publishedAt: string;
};

/**
 * MDX 化前のガイド。ホーム掲載用の公開日は初回公開コミット日に合わせる。
 */
const LEGACY_HOME_GUIDES: HomeFeaturedGuide[] = [
  {
    href: CAT_MEAL_MANAGEMENT_PATH,
    title: '猫の食事管理ガイド',
    description:
      '必要カロリー・給餌量・水分量の違いと、確認するおすすめの順番をまとめています。',
    ariaLabel: '猫の食事管理ガイドを読む',
    publishedAt: '2026-08-27',
  },
];

function sortByPublishedAtDesc(guides: HomeFeaturedGuide[]): HomeFeaturedGuide[] {
  return [...guides].sort((a, b) => {
    if (a.publishedAt !== b.publishedAt) {
      return a.publishedAt < b.publishedAt ? 1 : -1;
    }
    return a.href < b.href ? -1 : a.href > b.href ? 1 : 0;
  });
}

/**
 * ホーム「ガイド・読みもの」用。本番向け content/guides のみ（fixture は含めない）。
 * 新しい順で最大 HOME_FEATURED_GUIDE_LIMIT 件。
 */
export function getHomeFeaturedGuides(): HomeFeaturedGuide[] {
  const productionGuidesDir = path.join(process.cwd(), 'content', 'guides');
  const mdxGuides = getPublishedGuides({
    directories: [productionGuidesDir],
    includeContent: false,
  }).map((guide) => ({
    href: `${GUIDES_PATH}/${guide.slug}`,
    title: guide.metadata.title,
    description: guide.metadata.description,
    ariaLabel: `${guide.metadata.title}を読む`,
    publishedAt: guide.metadata.publishedAt,
  }));

  return sortByPublishedAtDesc([...mdxGuides, ...LEGACY_HOME_GUIDES]).slice(
    0,
    HOME_FEATURED_GUIDE_LIMIT,
  );
}
