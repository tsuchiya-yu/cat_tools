export const ALLOWED_GUIDE_MDX_JSX_NAMES = ['RelatedTool', 'GuideNote'] as const;

type MdxJsxNode = {
  type?: string;
  name?: string | null;
  children?: MdxJsxNode[];
};

function walk(node: MdxJsxNode, visit: (node: MdxJsxNode) => void) {
  visit(node);
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    walk(child, visit);
  }
}

/**
 * MDX本文中の明示JSXを allowlist のみに制限する。
 * Markdown由来の要素（h2/a/table等）は対象外で、component map 経由で描画する。
 */
export function remarkRestrictMdxJsx() {
  const allowed = new Set<string>(ALLOWED_GUIDE_MDX_JSX_NAMES);

  return (tree: unknown) => {
    walk(tree as MdxJsxNode, (node) => {
      if (node.type !== 'mdxJsxFlowElement' && node.type !== 'mdxJsxTextElement') {
        return;
      }

      const name = node.name;
      if (!name || !allowed.has(name)) {
        throw new Error(
          `[guides] MDX JSX element <${name ?? 'unknown'}> is not allowed. ` +
            `Allowed components: ${ALLOWED_GUIDE_MDX_JSX_NAMES.join(', ')}. ` +
            'Use Markdown for links/headings/tables instead of raw HTML/JSX tags.',
        );
      }
    });
  };
}
