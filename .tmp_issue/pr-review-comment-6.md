以下のレビュー指摘に対応しました／方針を共有します。再レビューをお願いします。

- r2440667197（a11y: aria-describedbyの参照先不足）
  - 対応: kcal補助テキストに `id="kcalHelp"` を付与し、`aria-describedby="kcalHelp kcalWarn"` が有効になるよう修正しました。
  - 対象: `src/components/CatFeedingCalculator.tsx`

- r2440667194（給餌入力のDRY化）
  - 影響が広く、他の入力にも波及するため、本PRから切り出して別Issueで対応します。
  - Issue: #27（FeedingInputコンポーネント抽出）

@gemini-code-assist /gemini review  
@cursor 再レビューをお願いします。

