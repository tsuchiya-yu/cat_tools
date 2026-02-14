#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <issue-url>" >&2
  exit 1
fi

issue_url="$1"
if [[ ! "$issue_url" =~ ^https://github\.com/([^/]+)/([^/]+)/issues/([0-9]+)$ ]]; then
  echo "Error: issue-url must be like https://github.com/<owner>/<repo>/issues/<number>" >&2
  exit 1
fi

issue_number="${BASH_REMATCH[3]}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Error: gh CLI is required" >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "Error: gh auth is not ready" >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "Error: jq is required" >&2
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
# Preflight Check

- gh auth: ok
- jq: ok
- Worktree: $worktree_state
- Suggested branch: $branch_name
- Base branch: main

If Worktree is dirty, keep unrelated changes and avoid destructive git operations.
REPORT
