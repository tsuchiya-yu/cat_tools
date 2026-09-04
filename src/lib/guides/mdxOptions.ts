import remarkGfm from 'remark-gfm';
import { remarkRestrictMdxJsx } from '@/lib/guides/remarkRestrictMdxJsx';

/**
 * next-mdx-remote の安全寄りの既定を明示固定する。
 * remark-gfm: 記事の Markdown 表（早見表等）を HTML table として描画するために必要。
 * @see https://github.com/hashicorp/next-mdx-remote
 */
export const guideMdxRemoteOptions = {
  blockJS: true,
  blockDangerousJS: true,
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkRestrictMdxJsx],
  },
};
