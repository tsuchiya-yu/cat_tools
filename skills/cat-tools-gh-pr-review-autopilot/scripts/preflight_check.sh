#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "使い方: $0 <pr-url>" >&2
  exit 1
fi

pr_url="$1"
if [[ ! "$pr_url" =~ ^https://github\.com/([^/]+)/([^/]+)/pull/([0-9]+)$ ]]; then
  echo "エラー: pr-url は https://github.com/<owner>/<repo>/pull/<number> 形式で指定してください" >&2
  exit 1
fi

owner="${BASH_REMATCH[1]}"
repo="${BASH_REMATCH[2]}"
number="${BASH_REMATCH[3]}"

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

head_ref="$(gh pr view "$number" --repo "$owner/$repo" --json headRefName --jq '.headRefName')"
current_branch="$(git branch --show-current)"

if [[ -n "$(git status --porcelain)" ]]; then
  worktree_state="dirty"
else
  worktree_state="clean"
fi

if [[ "$current_branch" == "$head_ref" ]]; then
  branch_alignment="ok"
else
  branch_alignment="mismatch"
fi

cat <<REPORT
# 事前チェック結果

- gh auth: ok
- jq: ok
- ワークツリー状態: $worktree_state
- PR ヘッドブランチ: $head_ref
- 現在のローカルブランチ: $current_branch
- ブランチ整合: $branch_alignment

ブランチ整合が mismatch の場合、修正前に PR ヘッドブランチへ checkout すること。
ワークツリーが dirty の場合、無関係な変更は保持し、破壊的な git 操作を避けること。
REPORT
