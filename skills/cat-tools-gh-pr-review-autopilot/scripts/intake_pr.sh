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

pr_json="$(gh pr view "$number" --repo "$owner/$repo" --json number,title,body,url,headRefName,baseRefName,reviewDecision,isDraft)"
title="$(echo "$pr_json" | jq -r '.title')"
body="$(echo "$pr_json" | jq -r '.body')"
head_ref="$(echo "$pr_json" | jq -r '.headRefName')"
base_ref="$(echo "$pr_json" | jq -r '.baseRefName')"
review_decision="$(echo "$pr_json" | jq -r '.reviewDecision // ""')"
is_draft="$(echo "$pr_json" | jq -r '.isDraft')"

threads_json="$(gh api graphql \
  -f query='query($owner:String!, $repo:String!, $number:Int!) { repository(owner:$owner, name:$repo) { pullRequest(number:$number) { reviewThreads(first:100) { nodes { id isResolved comments(first:1) { nodes { author { login } body url } } } } } } }' \
  -f owner="$owner" \
  -f repo="$repo" \
  -F number="$number")"

total_threads="$(echo "$threads_json" | jq -r '.data.repository.pullRequest.reviewThreads.nodes | length')"
unresolved_threads="$(echo "$threads_json" | jq -r '[.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved == false)] | length')"
first_unresolved_reviewer="$(echo "$threads_json" | jq -r '[.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved == false) | .comments.nodes[0].author.login][0] // ""')"

has_acceptance="no"
has_scope="no"

if echo "$body" | grep -qiE '完了条件|受け入れ条件|acceptance criteria'; then
  has_acceptance="yes"
fi
if echo "$body" | grep -qiE '対象|範囲|scope'; then
  has_scope="yes"
fi

cat <<REPORT
# PR 取り込み結果

- URL: $pr_url
- リポジトリ: $owner/$repo
- 番号: #$number
- タイトル: $title
- ベースブランチ: $base_ref
- ヘッドブランチ: $head_ref
- Draft: $is_draft
- Review decision: $review_decision
- スレッド数: $total_threads
- 未解決スレッド数: $unresolved_threads
- 未解決スレッド先頭レビューア: ${first_unresolved_reviewer:-N/A}

## 本文

$body

## 不明点判定シグナル（簡易）

- 受け入れ条件の記載: $has_acceptance
- 対象範囲の記載: $has_scope
- 未解決スレッド: $unresolved_threads
REPORT
