'use strict';

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { z } = require('zod');

/** @type {import('../../types/tool').Tool[]} */
const TOOLS = require('../../constants/tools.json');

const GUIDE_CATEGORIES = ['food', 'nutrition', 'life-stage', 'food-safety'];

const GUIDE_CATEGORY_LABELS = {
  food: '食事',
  nutrition: '栄養',
  'life-stage': 'ライフステージ',
  'food-safety': '食べ物の安全性',
};

const GUIDE_AUTHORS = {
  'tsuchiya-yu': {
    name: 'つくしの飼い主',
    url: '/about',
  },
};

const TOOL_IDS = TOOLS.map((tool) => tool.href.replace(/^\//, ''));
const TOOL_BY_ID = Object.fromEntries(
  TOOLS.map((tool) => [tool.href.replace(/^\//, ''), tool]),
);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/**
 * gray-matter / js-yaml が日付を Date にした場合、UTC の YYYY-MM-DD に戻す。
 * @param {unknown} value
 */
function toIsoDateString(value) {
  if (typeof value === 'string') return value;
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const year = value.getUTCFullYear();
    const month = String(value.getUTCMonth() + 1).padStart(2, '0');
    const day = String(value.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return value;
}

/**
 * @param {Record<string, unknown>} data
 */
function normalizeFrontmatterData(data) {
  return {
    ...data,
    publishedAt: toIsoDateString(data.publishedAt),
    updatedAt: toIsoDateString(data.updatedAt),
  };
}

/**
 * @param {string} value
 * @returns {boolean}
 */
function isValidIsoDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/**
 * Production (VERCEL_ENV=production) では fixture を読まない。
 * INCLUDE_GUIDE_FIXTURES=0/1 で明示上書き可能。
 * @returns {boolean}
 */
function shouldIncludeGuideFixtures() {
  if (process.env.INCLUDE_GUIDE_FIXTURES === '0') return false;
  if (process.env.INCLUDE_GUIDE_FIXTURES === '1') return true;
  if (process.env.VERCEL_ENV === 'production') return false;
  return true;
}

/**
 * @param {string} [cwd]
 * @returns {string[]}
 */
function getGuideDirectories(cwd = process.cwd()) {
  const directories = [path.join(cwd, 'content', 'guides')];
  if (shouldIncludeGuideFixtures()) {
    directories.push(path.join(cwd, 'content', 'guide-fixtures'));
  }
  return directories;
}

/**
 * @param {string} slug
 * @returns {boolean}
 */
function isSafeSlug(slug) {
  return typeof slug === 'string' && SLUG_PATTERN.test(slug);
}

/**
 * @param {string} message
 * @param {string} [filePath]
 * @param {string} [field]
 */
function createGuideError(message, filePath, field) {
  const parts = [];
  if (filePath) parts.push(`file=${filePath}`);
  if (field) parts.push(`field=${field}`);
  const prefix = parts.length > 0 ? `[guides:${parts.join(', ')}] ` : '[guides] ';
  return new Error(`${prefix}${message}`);
}

const referenceSchema = z.object({
  label: z.string().min(1),
  url: z.string().url().refine((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }, 'URL must use http or https'),
});

const frontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.enum(GUIDE_CATEGORIES),
    publishedAt: z.string().refine(isValidIsoDate, 'must be YYYY-MM-DD'),
    updatedAt: z.string().refine(isValidIsoDate, 'must be YYYY-MM-DD'),
    author: z.string().min(1),
    relatedTools: z.array(z.string()).default([]),
    relatedGuides: z.array(z.string()).default([]),
    references: z.array(referenceSchema).default([]),
    draft: z.boolean().default(false),
  })
  .superRefine((value, ctx) => {
    if (value.updatedAt < value.publishedAt) {
      ctx.addIssue({
        code: 'custom',
        path: ['updatedAt'],
        message: 'updatedAt must be >= publishedAt',
      });
    }

    if (!(value.author in GUIDE_AUTHORS)) {
      ctx.addIssue({
        code: 'custom',
        path: ['author'],
        message: `unknown author id: ${value.author}`,
      });
    }

    value.relatedTools.forEach((toolId, index) => {
      if (!TOOL_IDS.includes(toolId)) {
        ctx.addIssue({
          code: 'custom',
          path: ['relatedTools', index],
          message: `unknown tool id: ${toolId}`,
        });
      }
    });
  });

/**
 * @param {unknown} data
 * @param {string} filePath
 */
function parseFrontmatter(data, filePath) {
  const result = frontmatterSchema.safeParse(data);
  if (!result.success) {
    const issue = result.error.issues[0];
    const field = issue?.path?.join('.') || 'frontmatter';
    throw createGuideError(issue?.message || 'invalid frontmatter', filePath, field);
  }
  return result.data;
}

/**
 * @param {string} slug
 * @param {string[]} directories
 * @returns {string | null}
 */
function resolveGuideFilePath(slug, directories) {
  if (!isSafeSlug(slug)) return null;

  for (const directory of directories) {
    const resolvedDir = path.resolve(directory);
    const candidate = path.resolve(resolvedDir, `${slug}.mdx`);
    const relative = path.relative(resolvedDir, candidate);
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      continue;
    }
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return candidate;
    }
  }
  return null;
}

/**
 * @param {{ slug: string, filePath: string, content?: boolean }} input
 */
function loadGuideFromFile({ slug, filePath, content = true }) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(raw);
  const metadata = parseFrontmatter(normalizeFrontmatterData(parsed.data), filePath);

  return {
    slug,
    filePath,
    metadata,
    content: content ? parsed.content : '',
  };
}

/**
 * @param {{ directories?: string[], includeContent?: boolean }} [options]
 */
function loadAllGuides(options = {}) {
  const directories = options.directories ?? getGuideDirectories();
  const includeContent = options.includeContent !== false;
  /** @type {Map<string, { slug: string, filePath: string, metadata: any, content: string }>} */
  const guidesBySlug = new Map();

  for (const directory of directories) {
    if (!fs.existsSync(directory)) continue;
    const entries = fs.readdirSync(directory).filter((name) => name.endsWith('.mdx'));

    for (const entry of entries) {
      const slug = entry.replace(/\.mdx$/, '');
      if (!isSafeSlug(slug)) {
        throw createGuideError(
          `invalid slug derived from filename: ${entry}`,
          path.join(directory, entry),
          'slug',
        );
      }

      const filePath = path.join(directory, entry);
      if (guidesBySlug.has(slug)) {
        const existing = guidesBySlug.get(slug);
        throw createGuideError(
          `duplicate slug "${slug}" (also in ${existing.filePath})`,
          filePath,
          'slug',
        );
      }

      guidesBySlug.set(
        slug,
        loadGuideFromFile({ slug, filePath, content: includeContent }),
      );
    }
  }

  const guides = Array.from(guidesBySlug.values());
  validateGuideRelations(guides);
  return guides;
}

/**
 * @param {Array<{ slug: string, filePath: string, metadata: any }>} guides
 */
function validateGuideRelations(guides) {
  const bySlug = new Map(guides.map((guide) => [guide.slug, guide]));

  for (const guide of guides) {
    const { relatedGuides, draft } = guide.metadata;

    relatedGuides.forEach((relatedSlug, index) => {
      const field = `relatedGuides.${index}`;

      if (relatedSlug === guide.slug) {
        throw createGuideError(
          'relatedGuides must not include self reference',
          guide.filePath,
          field,
        );
      }

      if (!isSafeSlug(relatedSlug)) {
        throw createGuideError(
          `invalid relatedGuides slug: ${relatedSlug}`,
          guide.filePath,
          field,
        );
      }

      const related = bySlug.get(relatedSlug);
      if (!related) {
        throw createGuideError(
          `relatedGuides references unknown slug: ${relatedSlug}`,
          guide.filePath,
          field,
        );
      }

      // 公開記事から draft へのリンクは禁止。draft 同士の参照は許可。
      if (!draft && related.metadata.draft) {
        throw createGuideError(
          `published guide cannot reference draft guide: ${relatedSlug}`,
          guide.filePath,
          field,
        );
      }
    });
  }
}

/**
 * publishedAt 降順。同日は slug 昇順で stable。
 * @param {Array<{ slug: string, metadata: { publishedAt: string } }>} guides
 */
function sortGuidesByPublishedAtDesc(guides) {
  return [...guides].sort((a, b) => {
    if (a.metadata.publishedAt !== b.metadata.publishedAt) {
      return a.metadata.publishedAt < b.metadata.publishedAt ? 1 : -1;
    }
    if (a.slug === b.slug) return 0;
    return a.slug < b.slug ? -1 : 1;
  });
}

/**
 * @param {{ directories?: string[], includeContent?: boolean }} [options]
 */
function getPublishedGuides(options = {}) {
  const guides = loadAllGuides(options).filter((guide) => !guide.metadata.draft);
  return sortGuidesByPublishedAtDesc(guides);
}

/**
 * @param {string} slug
 * @param {{ directories?: string[], includeContent?: boolean, includeDrafts?: boolean }} [options]
 */
function getGuideBySlug(slug, options = {}) {
  if (!isSafeSlug(slug)) return null;

  const directories = options.directories ?? getGuideDirectories();
  const filePath = resolveGuideFilePath(slug, directories);
  if (!filePath) return null;

  // 関係バリデーション込みで全体を読む（単体取得でも整合性を保証）
  const guides = loadAllGuides({
    directories,
    includeContent: options.includeContent !== false,
  });
  const guide = guides.find((item) => item.slug === slug) ?? null;
  if (!guide) return null;
  if (guide.metadata.draft && !options.includeDrafts) return null;
  return guide;
}

/**
 * sitemap 用。published のみ。
 * @param {{ directories?: string[] }} [options]
 */
function getPublishedGuidesForSitemap(options = {}) {
  return getPublishedGuides({
    directories: options.directories,
    includeContent: false,
  }).map((guide) => ({
    slug: guide.slug,
    updatedAt: guide.metadata.updatedAt,
    publishedAt: guide.metadata.publishedAt,
  }));
}

/**
 * @param {string} toolId
 */
function getToolById(toolId) {
  return TOOL_BY_ID[toolId] ?? null;
}

/**
 * @param {string} authorId
 */
function getAuthorById(authorId) {
  return GUIDE_AUTHORS[authorId] ?? null;
}

/**
 * @param {string} category
 */
function getCategoryLabel(category) {
  return GUIDE_CATEGORY_LABELS[category] ?? category;
}

module.exports = {
  GUIDE_CATEGORIES,
  GUIDE_CATEGORY_LABELS,
  GUIDE_AUTHORS,
  TOOL_IDS,
  SLUG_PATTERN,
  shouldIncludeGuideFixtures,
  getGuideDirectories,
  isSafeSlug,
  isValidIsoDate,
  parseFrontmatter,
  resolveGuideFilePath,
  loadGuideFromFile,
  loadAllGuides,
  validateGuideRelations,
  sortGuidesByPublishedAtDesc,
  getPublishedGuides,
  getGuideBySlug,
  getPublishedGuidesForSitemap,
  getToolById,
  getAuthorById,
  getCategoryLabel,
  createGuideError,
};
