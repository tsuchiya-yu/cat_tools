## 概要
参照HTML（`calculate-cat-feeding-calculator.html`）を厳密な仕様として、React + TypeScript + Tailwind に移植しました。URLクエリ復元/同期、アクセシビリティ（`aria-live`、`label`/`aria-describedby`）、即時計算、注意表示（ブロックなし）を実装し、既存のトンマナに合わせてスタイルも調整しています。

## 主な変更
- ロジック関数: `src/lib/feed.ts`（`normalizeNumberInput` / `calcGramsPerDay` / `splitMorningNight`）
- UI: `src/components/CatFeedingCalculator.tsx`（入力/警告/結果、URL復元・同期、A11y、両入力時のみ結果表示、パンくず、FAQ、共有ボタン）
- ページ: `src/app/calculate-cat-feeding/page.tsx`
- FAQ: `src/components/FeedingFAQ.tsx`（初見向けに5件へ整理、`/calculate-cat-calorie`へリンク化）
- 共有: `src/components/FeedingShareMenu.tsx`（ネイティブ共有 / X / リンクコピー）
- スタイル: `src/app/globals.css`（`.surface` の余白方針、角丸8pxの統一、見切れ対策）
- 導線: `src/constants/text.ts`（ホームのツール一覧に「猫の給餌量計算」を追加）
- E2E: `tests/e2e/specs/feeding.spec.ts`

## 受け入れ基準
1) `?kcal=230` で kcal が自動入力（密度待ち）
2) 密度 `390` で 1日 ≈ 59 g（朝30g / 夜29g）
3) 空/無効時は `-- g`、結果セクションは非表示
4) 範囲外は注意表示するが計算は継続
5) `/calculate-cat-calorie` へのリンクが存在
6) `kcal` / `d` のクエリ同期・復元
7) 結果は `aria-live="polite"` で更新

## 実行・テスト
- Node v18.17+（推奨 v20+）
- `npm ci` → `npm run test:e2e`

---
Closes #24
