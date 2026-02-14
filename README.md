# ねこツールズ（Cat Tools）

猫に関する便利な計算ツールをまとめた Web アプリです。Next.js 15 + React 19 + TypeScript で実装しています。

## 機能

- 猫の年齢計算（誕生日から人間年齢・ライフステージ・次の誕生日までを表示）
- 猫のカロリー計算（体重・条件から 1 日の必要カロリーと目安幅を算出）
- 猫の給餌量計算（必要 kcal とフード密度から 1 日量と朝/夜の目安を算出）
- 猫の食べ物安全性チェック（200種類の食材データから安全・注意・危険を判定）
- 共有機能（URL・X・クリップボード）
- SEO 最適化（OGP、構造化データ、メタ情報）
- レスポンシブ対応、アクセシビリティ配慮

対応ルート:
- `/` トップ（ツール一覧）
- `/cat-food-safety` 猫の食べ物安全性チェック
- `/calculate-cat-age` 猫の年齢計算
- `/calculate-cat-calorie` 猫のカロリー計算
- `/calculate-cat-feeding` 猫の給餌量計算

## 技術スタック

- Next.js `15.x`（App Router、Turbopack）
- React `19.x`
- TypeScript `5.x`
- Tailwind CSS `4.x`
- MUI `@mui/material` `7.x` + Emotion
- date-fns `4.x`
- テスト: Jest + Testing Library、Playwright
- Lint: ESLint 9（`eslint-config-next`）

## 必要環境

- Node.js 22 LTS 以上を推奨
  - 依存ライブラリで最新の正規表現機能などを使用しているため、古い Node では動作しません
- npm v10 以上

（Node の切替には `nodebrew` または `nvm` の利用を推奨）

## セットアップ

1. 依存関係のインストール
   - `npm install`
2. 環境変数の設定（GA4 任意）
   - `cp .env.local.example .env.local`
   - `.env.local` に `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX` を設定（任意）
3. 開発サーバー起動
   - `npm run dev`
   - http://localhost:3000 を開く
4. E2E テスト準備（任意）
   - 初回のみ Playwright のブラウザをインストール: `npx playwright install`

## Codex Skill の自動同期（任意）

このリポジトリでは `skills/` 配下のカスタム Skill を、`main` ブランチで merge/pull したときに `~/.codex/skills` へ自動同期できます。

1. Git hooks のパスを有効化（初回のみ）
   - `git config core.hooksPath .githooks`
2. `main` ブランチで pull/merge すると `post-merge` が実行される
3. フックは `scripts/sync-codex-skills.sh` を呼び出し、`skills/*/SKILL.md` を持つ Skill を同期する

補足:
- 同期先は `${CODEX_HOME:-~/.codex}/skills`
- `main` 以外のブランチでは同期しません

## スクリプト

- `npm run dev`: 開発サーバー（Turbopack）
- `npm run build`: 本番ビルド（Turbopack）
- `npm run start`: 本番サーバー起動
- `npm run lint`: ESLint 実行
- `npm run test`: 単体テスト（Jest）
- `npm run test:watch`: ウォッチモード
- `npm run test:coverage`: カバレッジ取得
- `npm run test:e2e`: E2E テスト（Playwright）
- `npm run test:e2e:ui`: Playwright UI モード
- `npm run test:e2e:headed`: ヘッドあり実行
- `npm run test:e2e:debug`: デバッグモードで実行

E2E 詳細は `README-playwright.md` を参照してください。

## Google Analytics 4 (任意)

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` を `.env.local` に設定すると、ページビューとイベントを計測できます。
- 実装: `src/components/Analytics.tsx` と `src/lib/gtag.ts`
- 本番は Vercel の環境変数として設定してください。

## ディレクトリ構成（抜粋）

- `src/app` … App Router ルート、`/calculate-cat-*` 各ページ
- `src/components` … UI コンポーネント（計算フォーム、共有、FAQ など）
- `src/constants` … 画面文言、メタ情報、ツール一覧
- `src/lib` … 計算ロジック・ユーティリティ（GA、給餌量など）
- `tests` … Playwright E2E / Jest テスト

## デプロイ

- Vercel を想定
- ビルドコマンド: `npm run build`
- 実行コマンド: `npm run start`
- 主要環境変数: `NEXT_PUBLIC_GA_MEASUREMENT_ID`（任意）

### SITE_URL ガード（本番ビルド）

`npm run build` 実行時に `prebuild` で `scripts/validate-site-url.js` が走り、`NODE_ENV=production` の場合は `SITE_URL`（未設定なら `NEXT_PUBLIC_BASE_URL`）を検証します。

次の場合はビルドを失敗させます。
- 空文字
- URLとして不正
- `https://` 以外（`http://` を含む）
- ローカル系ホスト（`localhost`, `127.0.0.1`, `0.0.0.0`, `*.local`）

本番では必ず公開 `https://` URL を設定してください。

## Issue / PR 運用

- Issue テンプレートを用意しています
  - 不具合: `bug:`、機能追加: `feat:`、改善: `improve:`
- PR 作成時は関連 Issue を `Close #123` / `Ref #456` でリンク
- 動作確認チェックリストとスクリーンショットの添付を推奨

## ライセンス / 注意事項

- 本リポジトリの情報は一般的な参考情報です。愛猫の健康状態やアレルギーなどを考慮し、最終判断はかかりつけの獣医師にご相談ください。

質問や相談は Discussions をご利用ください。
