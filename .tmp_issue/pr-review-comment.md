レビュー対応を反映しました。再レビューをお願いします。

主な対応

- 共有URLの最新化と同期: `shareUrl` を `useMemo` で生成し、`replaceState` は `dailyKcal`/`density` の変更で再計算したURLに同期
- パフォーマンス最適化: 入力正規化・計算・警告文生成などを `useMemo` 化
- 定数整理: `FEEDING_RANGE`（命名見直し）、`FEEDING_UI_TEXT`（給餌量の文言集約）、`SHARE_UI_TEXT`（共有UIの汎用文言）
- FAQスタイル/構造: Tailwind 非標準 `py-4.5` → `py-4`、`<details>` 内の条件分岐を削除して簡素化
- 値の一貫性: `feed.ts` の戻り値を `null` → `undefined` に統一（呼び出し側も対応済み）

共有メニューのロジック完全共通化（DRY化）は影響範囲が広いため、本PRからは切り出して別Issueで対応します。

- Issue: #26（共有メニューの汎用コンポーネント化）

再レビューのお願い

@gemini-code-assist /gemini review  
@cursor 再レビューをお願いします。

