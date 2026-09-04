import fs from 'fs';
import os from 'os';
import path from 'path';

type MetaModule = typeof import('@/lib/guides/meta.cjs');

function loadMeta(): MetaModule {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/lib/guides/meta.cjs') as MetaModule;
}

function writeGuide(dir: string, slug: string, frontmatter: string, body = '本文') {
  fs.writeFileSync(
    path.join(dir, `${slug}.mdx`),
    `---\n${frontmatter}\n---\n\n${body}\n`,
    'utf8',
  );
}

function baseFrontmatter(overrides: Record<string, string | boolean | string[]> = {}) {
  const data = {
    title: 'テスト記事',
    description: '説明文',
    category: 'food',
    publishedAt: '2026-09-01',
    updatedAt: '2026-09-01',
    author: 'tsuchiya-yu',
    relatedTools: [] as string[],
    relatedGuides: [] as string[],
    references: [] as Array<{ label: string; url: string }>,
    draft: false,
    ...overrides,
  };

  const lines = [
    `title: ${JSON.stringify(data.title)}`,
    `description: ${JSON.stringify(data.description)}`,
    `category: ${data.category}`,
    `publishedAt: ${data.publishedAt}`,
    `updatedAt: ${data.updatedAt}`,
    `author: ${data.author}`,
    'relatedTools:',
    ...(Array.isArray(data.relatedTools) && data.relatedTools.length > 0
      ? data.relatedTools.map((id) => `  - ${id}`)
      : ['  []']),
    'relatedGuides:',
    ...(Array.isArray(data.relatedGuides) && data.relatedGuides.length > 0
      ? data.relatedGuides.map((id) => `  - ${id}`)
      : ['  []']),
    'references:',
    ...(Array.isArray(data.references) && data.references.length > 0
      ? data.references.flatMap((ref) => [
          `  - label: ${JSON.stringify(ref.label)}`,
          `    url: ${JSON.stringify(ref.url)}`,
        ])
      : ['  []']),
    `draft: ${data.draft}`,
  ];

  return lines.join('\n');
}

describe('guides meta loader', () => {
  let tempDir: string;
  let meta: MetaModule;

  beforeEach(() => {
    jest.resetModules();
    meta = loadMeta();
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cat-tools-guides-'));
  });

  afterEach(() => {
    fs.rmSync(tempDir, { recursive: true, force: true });
  });

  it('正常な frontmatter を読み込める', () => {
    writeGuide(
      tempDir,
      'ok-guide',
      baseFrontmatter({
        relatedTools: ['calculate-cat-feeding'],
        references: [{ label: 'Example', url: 'https://example.com' }],
      }),
    );

    const guides = meta.loadAllGuides({ directories: [tempDir] });
    expect(guides).toHaveLength(1);
    expect(guides[0].slug).toBe('ok-guide');
    expect(guides[0].metadata.title).toBe('テスト記事');
    expect(guides[0].metadata.relatedTools).toEqual(['calculate-cat-feeding']);
  });

  it('必須項目欠落で失敗する', () => {
    writeGuide(
      tempDir,
      'missing-title',
      baseFrontmatter().split('\n').filter((line) => !line.startsWith('title:')).join('\n'),
    );

    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=title/);
  });

  it('不正 category で失敗する', () => {
    writeGuide(tempDir, 'bad-category', baseFrontmatter({ category: 'unknown' }));
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=category/);
  });

  it('不正日付で失敗する', () => {
    writeGuide(tempDir, 'bad-date', baseFrontmatter({ publishedAt: '2026/09/01' }));
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=publishedAt/);
  });

  it('updatedAt < publishedAt で失敗する', () => {
    writeGuide(
      tempDir,
      'bad-range',
      baseFrontmatter({ publishedAt: '2026-09-10', updatedAt: '2026-09-01' }),
    );
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=updatedAt/);
  });

  it('不正 author で失敗する', () => {
    writeGuide(tempDir, 'bad-author', baseFrontmatter({ author: 'unknown-author' }));
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=author/);
  });

  it('不正 relatedTools で失敗する', () => {
    writeGuide(
      tempDir,
      'bad-tool',
      baseFrontmatter({ relatedTools: ['not-a-real-tool'] }),
    );
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=relatedTools/);
  });

  it('存在しない relatedGuides で失敗する', () => {
    writeGuide(
      tempDir,
      'missing-related',
      baseFrontmatter({ relatedGuides: ['does-not-exist'] }),
    );
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=relatedGuides/);
  });

  it('self reference で失敗する', () => {
    writeGuide(
      tempDir,
      'self-ref',
      baseFrontmatter({ relatedGuides: ['self-ref'] }),
    );
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/self reference/);
  });

  it('duplicate slug で失敗する', () => {
    const dirA = path.join(tempDir, 'a');
    const dirB = path.join(tempDir, 'b');
    fs.mkdirSync(dirA);
    fs.mkdirSync(dirB);
    writeGuide(dirA, 'dup', baseFrontmatter());
    writeGuide(dirB, 'dup', baseFrontmatter({ title: '別タイトル' }));

    expect(() => meta.loadAllGuides({ directories: [dirA, dirB] })).toThrow(/duplicate slug/);
  });

  it('draft は getPublishedGuides から除外される', () => {
    writeGuide(tempDir, 'pub', baseFrontmatter({ title: '公開' }));
    writeGuide(tempDir, 'draft', baseFrontmatter({ title: '下書き', draft: true }));

    const published = meta.getPublishedGuides({ directories: [tempDir] });
    expect(published.map((guide) => guide.slug)).toEqual(['pub']);
    expect(meta.getGuideBySlug('draft', { directories: [tempDir] })).toBeNull();
  });

  it('publishedAt 降順 + slug で stable sort する', () => {
    writeGuide(tempDir, 'b-guide', baseFrontmatter({ publishedAt: '2026-09-01', updatedAt: '2026-09-01' }));
    writeGuide(tempDir, 'a-guide', baseFrontmatter({ publishedAt: '2026-09-01', updatedAt: '2026-09-01' }));
    writeGuide(tempDir, 'newer', baseFrontmatter({ publishedAt: '2026-09-05', updatedAt: '2026-09-05' }));

    const published = meta.getPublishedGuides({ directories: [tempDir] });
    expect(published.map((guide) => guide.slug)).toEqual(['newer', 'a-guide', 'b-guide']);
  });

  it('公開記事から draft への relatedGuides は失敗する', () => {
    writeGuide(tempDir, 'draft-guide', baseFrontmatter({ draft: true }));
    writeGuide(
      tempDir,
      'public-guide',
      baseFrontmatter({ relatedGuides: ['draft-guide'] }),
    );

    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/cannot reference draft/);
  });

  it('不正な reference URL で失敗する', () => {
    writeGuide(
      tempDir,
      'bad-ref',
      baseFrontmatter({
        references: [{ label: 'Bad', url: 'javascript:alert(1)' }],
      }),
    );
    expect(() => meta.loadAllGuides({ directories: [tempDir] })).toThrow(/field=references/);
  });

  it('unsafe slug は resolve できない', () => {
    expect(meta.resolveGuideFilePath('../etc/passwd', [tempDir])).toBeNull();
    expect(meta.resolveGuideFilePath('foo/bar', [tempDir])).toBeNull();
    expect(meta.isSafeSlug('mdx-foundation-sample')).toBe(true);
  });
});
