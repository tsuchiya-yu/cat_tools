import type { Guide, GuideAuthor, GuideMetadata, GuideTool } from './types';

// CommonJS meta module — shared with next-sitemap.config.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const meta = require('./meta.cjs') as {
  GUIDE_CATEGORIES: readonly string[];
  GUIDE_CATEGORY_LABELS: Record<string, string>;
  GUIDE_AUTHORS: Record<string, GuideAuthor>;
  TOOL_IDS: readonly string[];
  shouldIncludeGuideFixtures: () => boolean;
  getGuideDirectories: (cwd?: string) => string[];
  isSafeSlug: (slug: string) => boolean;
  parseFrontmatter: (data: unknown, filePath: string) => GuideMetadata;
  loadAllGuides: (options?: {
    directories?: string[];
    includeContent?: boolean;
  }) => Guide[];
  sortGuidesByPublishedAtDesc: <T extends { slug: string; metadata: { publishedAt: string } }>(
    guides: T[],
  ) => T[];
  getPublishedGuides: (options?: {
    directories?: string[];
    includeContent?: boolean;
  }) => Guide[];
  getGuideBySlug: (
    slug: string,
    options?: {
      directories?: string[];
      includeContent?: boolean;
      includeDrafts?: boolean;
    },
  ) => Guide | null;
  getPublishedGuidesForSitemap: (options?: {
    directories?: string[];
  }) => Array<{ slug: string; updatedAt: string; publishedAt: string }>;
  getToolById: (toolId: string) => GuideTool | null;
  getAuthorById: (authorId: string) => GuideAuthor | null;
  getCategoryLabel: (category: string) => string;
  createGuideError: (message: string, filePath?: string, field?: string) => Error;
};

export const GUIDE_CATEGORIES = meta.GUIDE_CATEGORIES;
export const GUIDE_CATEGORY_LABELS = meta.GUIDE_CATEGORY_LABELS;
export const GUIDE_AUTHORS = meta.GUIDE_AUTHORS;
export const TOOL_IDS = meta.TOOL_IDS;

export const shouldIncludeGuideFixtures = meta.shouldIncludeGuideFixtures;
export const getGuideDirectories = meta.getGuideDirectories;
export const isSafeSlug = meta.isSafeSlug;
export const parseFrontmatter = meta.parseFrontmatter;
export const loadAllGuides = meta.loadAllGuides;
export const sortGuidesByPublishedAtDesc = meta.sortGuidesByPublishedAtDesc;
export const getPublishedGuides = meta.getPublishedGuides;
export const getGuideBySlug = meta.getGuideBySlug;
export const getPublishedGuidesForSitemap = meta.getPublishedGuidesForSitemap;
export const getToolById = meta.getToolById;
export const getAuthorById = meta.getAuthorById;
export const getCategoryLabel = meta.getCategoryLabel;
export const createGuideError = meta.createGuideError;

export function formatGuideDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return `${year}年${month}月${day}日`;
}

export type { Guide, GuideAuthor, GuideMetadata, GuideTool };
