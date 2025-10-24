以下のレビュー指摘に対応しました。ご確認ください。再レビューをお願いします。

- r2440654844: `FEEDING_RANGE` をコンポーネント外（constants）へ移動し、再レンダリング時に再生成されないようにしました。
  - 参照先: `src/constants/text.ts` の `FEEDING_RANGE`

- r2440654846: `tabIndex={tabbable ? undefined : -1}` に簡素化し、冗長な型アサーションを除去しました。
  - 対象: `src/components/Breadcrumbs.tsx`

- r2440654854: `normalizeNumberInput` の不要な `String(s)` を除去し、`s.replace(...).trim()` に簡素化しました。
  - 対象: `src/lib/feed.ts`

@gemini-code-assist /gemini review  
@cursor 再レビューをお願いします。

