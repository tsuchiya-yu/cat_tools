import fs from 'fs';
import os from 'os';
import path from 'path';

describe('guides sitemap helper', () => {
  it('公開ガイドの updatedAt を返し draft を含めない', () => {
    jest.resetModules();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const meta = require('@/lib/guides/meta.cjs') as typeof import('@/lib/guides/meta.cjs');

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'cat-tools-sitemap-guides-'));
    try {
      fs.writeFileSync(
        path.join(tempDir, 'published.mdx'),
        `---
title: "公開"
description: "説明"
category: food
publishedAt: 2026-08-01
updatedAt: 2026-08-10
author: tsuchiya-yu
relatedTools: []
relatedGuides: []
references: []
draft: false
---

body
`,
        'utf8',
      );
      fs.writeFileSync(
        path.join(tempDir, 'draft.mdx'),
        `---
title: "下書き"
description: "説明"
category: food
publishedAt: 2026-08-01
updatedAt: 2026-08-10
author: tsuchiya-yu
relatedTools: []
relatedGuides: []
references: []
draft: true
---

body
`,
        'utf8',
      );

      const entries = meta.getPublishedGuidesForSitemap({ directories: [tempDir] });
      expect(entries).toEqual([
        {
          slug: 'published',
          publishedAt: '2026-08-01',
          updatedAt: '2026-08-10',
        },
      ]);
    } finally {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });
});
