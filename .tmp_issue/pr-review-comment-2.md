レビュー指摘（r2440604365 ほか）への対応を反映しました。再レビューをお願いします。

変更点

- URL同期ロジックのDRY化: `shareUrl`（useMemo）に「クエリの追加/削除」を含め、`useEffect` は `[shareUrl]` 依存で `replaceState` するみに統一
- クリア時のクエリ削除を担保: 入力が空のときは `kcal`/`d` を `URLSearchParams.delete` するように修正
- 未計算時の戻り値の統一: `split` の未計算時を `undefined` に変更し、`feed.ts` の方針（undefined 優先）に統一

注記

- 共有メニューのロジック共通化（DRY化）は、影響が広いため本PRから切り出して別Issue（#26）で対応します。現PRでは動作に関わる修正と最小限の整理に留めています。

@gemini-code-assist /gemini review  
@cursor 再レビューをお願いします。

