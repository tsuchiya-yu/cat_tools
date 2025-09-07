# Cat Tools - Makefile
# 猫の年齢計算ツールの開発・テスト・デプロイ用コマンド

.PHONY: help install dev build start test test-watch test-coverage lint lint-fix clean setup

# デフォルトターゲット: ヘルプを表示
help:
	@echo "Cat Tools - 利用可能なコマンド:"
	@echo ""
	@echo "📦 セットアップ・インストール:"
	@echo "  make setup        - 初回セットアップ（依存関係インストール）"
	@echo "  make install      - 依存関係をインストール"
	@echo ""
	@echo "🚀 開発・実行:"
	@echo "  make dev          - 開発サーバーを起動"
	@echo "  make build        - プロダクション用ビルド"
	@echo "  make start        - プロダクションサーバーを起動"
	@echo ""
	@echo "🧪 テスト:"
	@echo "  make test         - テストを実行"
	@echo "  make test-watch   - ウォッチモードでテスト実行"
	@echo "  make test-coverage - カバレッジレポート付きでテスト実行"
	@echo ""
	@echo "🔍 コード品質:"
	@echo "  make lint         - ESLintでコードチェック"
	@echo "  make lint-fix     - ESLintで自動修正可能な問題を修正"
	@echo ""
	@echo "🧹 クリーンアップ:"
	@echo "  make clean        - 生成ファイルを削除"
	@echo ""

# 初回セットアップ
setup: install
	@echo "✅ セットアップが完了しました！"
	@echo "開発を開始するには: make dev"

# 依存関係のインストール
install:
	@echo "📦 依存関係をインストール中..."
	npm install --legacy-peer-deps

# 開発サーバーの起動
dev:
	@echo "🚀 開発サーバーを起動中..."
	npm run dev

# プロダクション用ビルド
build:
	@echo "🏗️  プロダクション用ビルドを実行中..."
	npm run build

# プロダクションサーバーの起動
start:
	@echo "🌟 プロダクションサーバーを起動中..."
	npm run start

# テストの実行
test:
	@echo "🧪 テストを実行中..."
	npm test

# ウォッチモードでテスト実行
test-watch:
	@echo "👀 ウォッチモードでテストを実行中..."
	npm run test:watch

# カバレッジレポート付きでテスト実行
test-coverage:
	@echo "📊 カバレッジレポート付きでテストを実行中..."
	npm run test:coverage
	@echo "📈 カバレッジレポートが coverage/ ディレクトリに生成されました"

# ESLintでコードチェック
lint:
	@echo "🔍 ESLintでコードをチェック中..."
	npm run lint

# ESLintで自動修正
lint-fix:
	@echo "🔧 ESLintで自動修正中..."
	npm run lint -- --fix

# 生成ファイルのクリーンアップ
clean:
	@echo "🧹 生成ファイルを削除中..."
	rm -rf .next
	rm -rf coverage
	rm -rf node_modules/.cache
	@echo "✅ クリーンアップが完了しました"

# 完全なクリーンアップ（node_modulesも削除）
clean-all: clean
	@echo "🗑️  node_modules を削除中..."
	rm -rf node_modules
	rm -f package-lock.json
	@echo "✅ 完全なクリーンアップが完了しました"
	@echo "再セットアップするには: make setup"

# 開発環境の確認
check:
	@echo "🔍 開発環境を確認中..."
	@echo "Node.js バージョン:"
	@node --version
	@echo "npm バージョン:"
	@npm --version
	@echo "プロジェクト情報:"
	@npm list --depth=0 2>/dev/null || echo "依存関係が未インストールです。make install を実行してください。"

# 全体的な開発フロー（テスト→リント→ビルド）
ci: test lint build
	@echo "✅ CI パイプラインが正常に完了しました"

# 開発開始用のクイックスタート
quick-start: install dev

# プロダクション準備（テスト→リント→ビルド）
production-ready: test-coverage lint build
	@echo "🚀 プロダクション準備が完了しました"
