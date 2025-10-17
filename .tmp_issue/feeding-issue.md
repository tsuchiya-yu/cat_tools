## 概要
- 参照HTML（`calculate-cat-feeding-calculator.html`）を厳密な仕様として、React + TypeScript + Tailwind に移植しました。
- URLクエリ同期、アクセシビリティ（`aria-live`、`label`/`aria-describedby`）、即時計算、注意表示（ブロックなし）を再現。
- 既存トンマナに合わせてスタイルを調整（角丸、余白、見切れ対策など）。
- トップページの導線追加、FAQ刷新、共有ボタン実装、E2Eテスト追加。

## 変更点
### ロジック（再利用関数）
- `src/lib/feed.ts`
  - `normalizeNumberInput(s: string): number | null`
  - `calcGramsPerDay(dailyKcal: number, kcalPer100g: number): number | null`
  - `splitMorningNight(totalGrams: number)`

### コンポーネント / ページ
- `src/components/CatFeedingCalculator.tsx`
  - 入力: `#kcalInput`, `#densityInput` / 警告: `#kcalWarn`, `#densityWarn` / 出力: `#dailyGram`, `#perMeal`, `#note`
  - 初回マウントで URL 復元（`kcal`, `d`）
  - 入力変更で `history.replaceState` によるクエリ同期
  - アクセシビリティ: `label` + `aria-describedby`、結果セクションは `aria-live="polite"`
  - 結果セクションは「両入力が埋まった時のみ」表示
  - パンくず・FAQ（初見向け5件）・共有ボタン（`FeedingShareMenu`）を追加
- `src/app/calculate-cat-feeding/page.tsx`: 新規ページ（メタ含む）
- `src/components/FeedingFAQ.tsx`: FAQ刷新、`/calculate-cat-calorie` へリンク化
- `src/components/FeedingShareMenu.tsx`: ネイティブ共有 / X / リンクコピー（トースト）

### スタイル調整
- `src/app/globals.css`
  - `.surface` は上下 `var(--s-3)` のみ、左右0／`overflow: visible` にして見切れ防止
  - 入力の角丸を 8px に統一（基本四角で少し丸い）
- `src/components/CalorieInput.tsx` / `src/components/CatFeedingCalculator.tsx` / `src/components/DateInput.tsx`
  - 入力の角丸を `rounded-lg` に統一、既存トーンに合わせて微調整

### 導線
- `src/constants/text.ts`: ホームの `TOOLS` に「猫の給餌量計算」を追加

### E2E テスト
- `tests/e2e/specs/feeding.spec.ts`
  - 初期表示（結果非表示・警告空）
  - URLクエリ復元（`?kcal=230`）
  - 計算確認（`230/390` → `59g`、朝30/夜29、URL同期、共有ボタン）
  - 入力クリアで結果非表示
  - 範囲外時に注意表示しつつ計算継続
  - `/calculate-cat-calorie` へのリンク存在

## 受け入れ基準
1. `?kcal=230` で必要カロリーが自動入力（密度待ち）
2. 密度 `390` で「1日 ≈ 59 g」「朝30g/夜29g」
3. 無効/空で `-- g`／結果セクション非表示
4. 範囲外は赤い注意文を表示（計算は継続）
5. `/calculate-cat-calorie` のリンクが存在
6. `kcal` / `d` のクエリ同期・復元
7. 結果は `aria-live="polite"` で更新

## 実行 / テスト
- Node v18.17+（推奨 v20+）
- `npm ci` → `npm run test:e2e`

## メモ
- 共有文言は必要に応じて微調整可能です。
