# 猫のカロリー計算 - E2Eテスト

このプロジェクトは、猫のカロリー計算ページの包括的なE2Eテストスイートです。TypeScriptとPlaywrightを使用して実装されています。

## 📋 テスト概要

### 対象ページ
- **URL**: `playwright.config.ts` の `baseURL` を使用（デフォルト: `http://localhost:3000`）。外部環境を対象にする場合のみ `BASE_URL` で上書き可能。
- **種類**: 単一ページの静的HTML（JavaScript動作）

### テスト範囲
- ✅ 基本機能（初期表示、FAQ、メタタグ、アクセシビリティ）
- ✅ 計算ロジック（全組み合わせのテーブルテスト）
- ✅ UI制御（セグメント選択、バリデーション、URL同期）
- ✅ 共有機能（Web Share API、Xシェア、クリップボード）
- ✅ レスポンシブデザイン（デスクトップ・モバイル）

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
# Playwrightのインストール
npm install -D @playwright/test

# ブラウザのインストール
npx playwright install
```

### 2. 環境変数の設定（必要な場合のみ）

ローカル実行では設定不要です（`playwright.config.ts` の `webServer` が自動で `http://127.0.0.1:3000` を起動します）。

外部環境（例: 本番URL）を対象にする場合のみ、下記のように `BASE_URL` を上書きできます。

```bash
export BASE_URL=https://cat-tools.catnote.tokyo
```

## 🧪 テスト実行

### 基本的な実行

```bash
# 全テストの実行
npx playwright test

# 特定のテストファイルのみ
npx playwright test calorie.basic.spec.ts

# ヘッドレスモードを無効化（ブラウザを表示）
npx playwright test --headed

# デバッグモード
npx playwright test --debug
```

### 環境別実行

```bash
# ローカル環境（推奨）: 設定不要。devサーバーは自動起動されます。
npx playwright test

# 外部環境に対して実行したい場合のみ
BASE_URL=https://cat-tools.catnote.tokyo npx playwright test
```

### プロジェクト別実行

```bash
# デスクトップのみ
npx playwright test --project=desktop-chromium

# モバイルのみ
npx playwright test --project=mobile-chromium

# 両方
npx playwright test --project=desktop-chromium --project=mobile-chromium
```

### 並列実行の制御

```bash
# ワーカー数を指定
npx playwright test --workers=2

# シーケンシャル実行
npx playwright test --workers=1
```

## 📁 ファイル構成

```
tests/e2e/
├── utils/
│   └── calc.ts                    # 計算ユーティリティ
└── specs/
    ├── calc-utils.spec.ts         # ユーティリティの単体テスト
    ├── calorie.basic.spec.ts      # 基本機能テスト
    ├── calorie.compute.spec.ts    # 計算ロジックテスト
    ├── calorie.ui.spec.ts         # UI制御テスト
    ├── calorie.share.spec.ts      # 共有機能テスト
    ├── calculator.spec.ts         # 既存：計算機テスト
    └── navigation.spec.ts         # 既存：ナビゲーションテスト

playwright.config.ts               # Playwright設定
```

## 🔧 設定詳細

### playwright.config.ts
- **testDir**: `./tests/e2e/specs`（既存構成に統一）
- **baseURL**: `process.env.BASE_URL ?? 'http://localhost:3000'`
- **webServer**: `npm run dev -- --port 3000` を起動し、`http://127.0.0.1:3000` へ接続（ローカルでは手動設定不要）
- **プロジェクト**: desktop-chromium, mobile-chromium
- **リトライ**: CI環境で2回、ローカルで0回
- **レポーター**: HTML形式

### テストプロジェクト
- **desktop-chromium**: 1280x720のデスクトップ表示
- **mobile-chromium**: Pixel 5相当のモバイル表示

## 📊 テストケース詳細

### 1. 基本機能テスト (`calorie.basic.spec.ts`)
- ページの初期表示確認
- デフォルト選択状態
- FAQ セクション（4件の構造化データ）
- メタタグ（OGP、Twitterカード）
- アクセシビリティ基本確認
- キーボードナビゲーション

### 2. 計算ロジックテスト (`calorie.compute.spec.ts`)
- **テーブルテスト**: 体重3点 × 組み合わせ10パターン = 30ケース
- **体重**: 2.0kg, 4.2kg, 7.0kg
- **組み合わせ**:
  - maintain: kitten(1) + adult×neutered(2) + senior(1) = 4パターン
  - loss: stage 3パターン（goal優先）
  - gain: stage 3パターン（goal優先）
- **4.2kgサンプル**: 仕様書の期待値表を完全実装
- **goal優先確認**: loss/gain選択時の係数統一

### 3. UI制御テスト (`calorie.ui.spec.ts`)
- セグメントボタンの単一選択制御
- 去勢/避妊トグルの表示制御（adultのみ）
- 体重バリデーション（0.5〜12kg）
- URL同期（パラメータ更新・復元・リロード保持）
- キーボード操作・アクセシビリティ
- レスポンシブデザイン確認

### 4. 共有機能テスト (`calorie.share.spec.ts`)
- 共有メニューの開閉制御
- Web Share API モック検証
- Xシェアリンク生成・内容確認
- クリップボードコピー機能
- エラー処理（API利用不可時）
- モバイル対応確認

## 🧮 計算仕様

### RER計算
```typescript
RER = 70 * (weight ** 0.75)
```

### 係数選択ロジック
1. **goal優先**: `loss`/`gain`選択時はstage/neuteredを無視
2. **maintain時**: stage と neutered の組み合わせで決定

### 期待値生成
```typescript
// 例: 体重4.2kg, adult, maintain, 去勢済み
const result = expected(4.2, 'adult', 'maintain', true);
// => { kcal: 246.4, range: "205.4〜328.6 kcal/日", factor: "× 1.20（成猫・去勢/避妊済）" }
```

## 🎯 テスト戦略

### データ駆動テスト
- 組み合わせ漏れを防ぐテーブルテスト
- 期待値は計算式で生成（ハードコード回避）
- 小数1桁丸めで比較（±0.1kcal許容）

### モック戦略
- `navigator.share`: `window.__shared__`に記録
- `navigator.clipboard.writeText`: `window.__copied__`に記録
- `page.addInitScript`で事前注入

### 安定性確保
- 日本語テキストは整形関数で生成
- セレクタはid優先（`#kcal`, `#range`, `#factor`）
- `toHaveText`で完全一致、数値は`toBeCloseTo`で許容範囲

## 🐛 トラブルシューティング

### よくある問題

1. **ブラウザが見つからない**
   ```bash
   npx playwright install
   ```

2. **テストがタイムアウト**
   ```bash
   # タイムアウト時間を延長
   npx playwright test --timeout=60000
   ```

3. **BASE_URLが設定されていない**
   ```bash
   # 環境変数を確認
   echo $BASE_URL
   
   # 直接指定
   BASE_URL=http://localhost:5173 npx playwright test
   ```

4. **モバイルテストが失敗**
   ```bash
   # モバイル用ブラウザを再インストール
   npx playwright install --with-deps chromium
   ```

### デバッグ方法

```bash
# ステップ実行
npx playwright test --debug

# スクリーンショット付きレポート
npx playwright test --reporter=html

# トレース記録
npx playwright test --trace=on
```

## 📈 レポート

### HTML レポート
```bash
# テスト実行後に自動生成
npx playwright show-report
```

### CI/CD での実行
```yaml
# GitHub Actions例
- name: Run Playwright tests
  run: |
    BASE_URL=https://cat-tools.catnote.tokyo/calculate-cat-calorie \
    npx playwright test
  env:
    CI: true
```

## 🔄 継続的改善

### テスト追加時の指針
1. **新機能**: 対応するテストファイルに追加
2. **回帰テスト**: 既存テストの拡張
3. **パフォーマンス**: 新しいテストファイル作成
4. **アクセシビリティ**: calorie.basic.spec.ts に追加

### メンテナンス
- セレクタ変更時は該当テストを更新
- 計算仕様変更時は `tests/e2e/utils/calc.ts` と対応テストを更新
- 新しいブラウザサポート時は `playwright.config.ts` を更新

---

## 📞 サポート

テストに関する質問や問題がある場合は、以下を確認してください：

1. [Playwright公式ドキュメント](https://playwright.dev/)
2. このREADMEのトラブルシューティング
3. テストファイル内のコメント
4. `tests/e2e/utils/calc.ts`の型定義とJSDoc

**Happy Testing! 🎭**
