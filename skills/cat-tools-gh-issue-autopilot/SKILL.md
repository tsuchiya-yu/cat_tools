---
name: cat-tools-gh-issue-autopilot
description: cat_tools リポジトリで、Issue URL を起点に gh CLI を使った作業フロー（不明点確認、ブランチ作成、実装、PR 作成）を実行する。Issue 対応の自動化依頼時に使用する。実装前に不明点が残る場合は必ず質問し、回答が揃うまで実装を停止する。
---

# cat-tools-gh-issue-autopilot

このリポジトリの GitHub Issue URL を受け取ったとき、次の手順で実行する。

## 実行前提（パス解決）

- `scripts/` と `references/` は、**skill ディレクトリ基準**で参照する。
- 基本は `SKILL.md` と同じ階層を基準に、`scripts/intake_issue.sh` / `scripts/preflight_check.sh` / `references/question-checklist.md` を読む。
- リポジトリ直下（`<repo>/scripts` など）に同名ファイルがあっても、まずは skill ディレクトリ側を優先する。

## 必須フロー

1. `scripts/intake_issue.sh <issue-url>` で Issue を取得して要約する。
2. `scripts/preflight_check.sh <issue-url>` で事前チェックを行う。
3. `references/question-checklist.md` で不明点を判定する。
4. 必須項目に未確定事項があれば、短く具体的な質問を行い、実装を停止する。
5. 不明点が解消されたら、次の命名規則でブランチを作成する。
   - `codex/issue-<number>-<slug>`
6. 依頼内容を実装する。
7. 変更に対して最小十分な lint/test を実行する。
8. commit と push を行う。
9. `main` 向けに PR を作成する。PR本文は `/.github/pull_request_template.md` に従う。

## 厳守ルール

- Issue / PR 操作は `gh` CLI を使う。
- 不明点が残っている状態で実装を開始しない。
- PR の base は常に `main` に固定する。
- 該当 Issue を閉じる場合は PR 本文に `Closes #<issue-number>` を含める。
- リポジトリに無関係なローカル変更がある場合でも、勝手に巻き戻さない。

## デフォルト方針（未指定時はこれを採用）

- 検証方法:
  - 必ず `npm run lint` と `npm run test` を実行する。
  - 画面変更（UI/文言/スタイル/構造化データ表示含む）がある場合、Playwright MCP で対象ページのキャプチャを取得する。
- 制約:
  - 原則として、Issue 対応に必要な最小変更のみ行う。
  - 無関係なリファクタ・命名変更・ファイル移動・整形のみ変更は行わない。

## 追加ルール（質問の抑制）

- `検証方法` は上記デフォルトが適用可能なら未確認でも実装を進める。
- `制約` は上記デフォルト（最小変更）が適用可能なら未確認でも実装を進める。
- ただし、Issue本文で明示的に別要件がある場合はそちらを優先する。

## リソース

- Issue 取得と要約: `scripts/intake_issue.sh`
- 事前チェック: `scripts/preflight_check.sh`
- 不明点チェックリスト: `references/question-checklist.md`
- PR テンプレート: `/.github/pull_request_template.md`
