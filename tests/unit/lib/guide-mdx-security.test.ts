import React from 'react';
import RelatedTool from '@/components/guides/RelatedTool';
import { remarkRestrictMdxJsx } from '@/lib/guides/remarkRestrictMdxJsx';

describe('guide MDX security boundaries', () => {
  it('不正な RelatedTool tool ID は描画時に失敗する', () => {
    expect(() =>
      React.createElement(RelatedTool, { tool: 'not-a-real-tool' }),
    ).not.toThrow();

    // Server Component 相当の同期実行（関数本体で throw）
    expect(() => RelatedTool({ tool: 'not-a-real-tool' })).toThrow(/unknown tool id/);
  });

  it('許可されていない明示 JSX は remark プラグインで失敗する', () => {
    const plugin = remarkRestrictMdxJsx();
    const tree = {
      type: 'root',
      children: [
        { type: 'mdxJsxFlowElement', name: 'a' },
        { type: 'mdxJsxTextElement', name: 'script' },
      ],
    };

    expect(() => plugin(tree)).toThrow(/not allowed/);
  });

  it('RelatedTool / GuideNote は許可する', () => {
    const plugin = remarkRestrictMdxJsx();
    const tree = {
      type: 'root',
      children: [
        { type: 'mdxJsxFlowElement', name: 'RelatedTool' },
        { type: 'mdxJsxFlowElement', name: 'GuideNote' },
      ],
    };

    expect(() => plugin(tree)).not.toThrow();
  });
});
