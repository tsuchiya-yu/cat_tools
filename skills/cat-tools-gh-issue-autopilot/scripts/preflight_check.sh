#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "使い方: $0 <issue-url>" >&2
  exit 1
fi

issue_url="$1"
if [[ ! "$issue_url" =~ ^https://github\.com/([^/]+)/([^/]+)/issues/([0-9]+)$ ]]; then
  echo "エラー: issue-url は https://github.com/<owner>/<repo>/issues/<number> 形式で指定してください" >&2
  exit 1
fi

issue_number="${BASH_REMATCH[3]}"

if ! command -v gh >/dev/null 2>&1; then
  echo "エラー: gh CLI が必要です" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "エラー: gh auth が未設定です" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "エラー: jq が必要です" >&2
  exit 1
fi

title="$(gh issue view "$issue_number" --json title --jq '.title')"
slug="$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+//; s/-+$//; s/-+/-/g')"
if [[ -z "$slug" ]]; then
  slug="task"
fi

branch_name="codex/issue-${issue_number}-${slug}"

if [[ -n "$(git status --porcelain)" ]]; then
  worktree_state="dirty"
else
  worktree_state="clean"
fi

cat <<REPORT
# 事前チェック結果

- gh auth: ok
- jq: ok
- ワークツリー状態: $worktree_state
- 推奨ブランチ名: $branch_name
- ベースブランチ: main

ワークツリーが dirty の場合、無関係な変更は保持し、破壊的な git 操作を避けること。
REPORT
