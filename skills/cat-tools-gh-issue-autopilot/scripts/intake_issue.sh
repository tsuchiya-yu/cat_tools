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

owner="${BASH_REMATCH[1]}"
repo="${BASH_REMATCH[2]}"
number="${BASH_REMATCH[3]}"

json="$(gh issue view "$number" --repo "$owner/$repo" --json number,title,body,url,labels)"
title="$(echo "$json" | jq -r '.title')"
body="$(echo "$json" | jq -r '.body')"

has_acceptance="no"
has_scope="no"
has_validation="no"

if echo "$body" | rg -qi '完了条件|受け入れ条件|acceptance criteria'; then
  has_acceptance="yes"
fi
if echo "$body" | rg -qi '対象|範囲|scope'; then
  has_scope="yes"
fi
if echo "$body" | rg -qi 'テスト|確認方法|validation|verify'; then
  has_validation="yes"
fi

cat <<REPORT
# Issue 取り込み結果

- URL: $issue_url
- リポジトリ: $owner/$repo
- 番号: #$number
- タイトル: $title

## 本文

$body

## 不明点判定シグナル（簡易）

- 受け入れ条件の記載: $has_acceptance
- 対象範囲の記載: $has_scope
- 検証方法の記載: $has_validation
REPORT
