import { remarkRestrictMdxJsx } from '@/lib/guides/remarkRestrictMdxJsx';

/**
 * next-mdx-remote の安全寄りの既定を明示固定する。
 * @see https://github.com/hashicorp/next-mdx-remote
 */
export const guideMdxRemoteOptions = {
  blockJS: true,
  blockDangerousJS: true,
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [remarkRestrictMdxJsx],
  },
};
