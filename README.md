# 猫の年齢計算ツール

Next.js + TypeScriptで作成された猫の年齢を人間年齢に換算するWebアプリケーションです。

## 機能

- 猫の誕生日から人間年齢を計算
- ライフステージの表示
- 次の誕生日までの日数表示
- 結果の共有機能（URL、X、クリップボード）
- レスポンシブデザイン
- SEO対応

## 技術スタック

- Next.js 15
- TypeScript
- Tailwind CSS
- React Hooks

## 開発

### 環境設定

1. 依存関係のインストール：
```bash
npm install
```

2. 環境変数の設定：
`.env.local`ファイルを作成し、Google Analytics 4の測定IDを設定してください：
```bash
cp .env.local.example .env.local
```

`.env.local`を編集して、GA4の測定IDを設定：
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. 開発サーバーの起動：
```bash
npm run dev
```

### Google Analytics 4 (GA4) の設定

1. [Google Analytics](https://analytics.google.com/)でプロパティを作成
2. 測定IDをコピー（`G-XXXXXXXXXX`の形式）
3. `.env.local`ファイルに測定IDを設定
4. プロダクション環境では、Vercelの環境変数として設定

GA4の機能：
- ページビューの自動追跡
- クライアントサイドナビゲーションの追跡
- カスタムイベント追跡（`/src/lib/gtag.ts`のevent関数を使用）

## デプロイ

Vercelでホスティング予定