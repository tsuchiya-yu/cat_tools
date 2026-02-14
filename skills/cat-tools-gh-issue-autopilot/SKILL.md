---
name: cat-tools-gh-issue-autopilot
description: Automate GitHub issue-driven delivery in the cat_tools project using gh CLI. Use when the user provides an Issue URL and asks for end-to-end execution from clarification, branch creation, implementation, and PR creation. Always perform a strict clarification gate before implementation: if unresolved questions exist, ask the user and stop implementation until answers are provided.
---

# cat-tools-gh-issue-autopilot

Execute this workflow when given a GitHub Issue URL for this repository.

## Required workflow

1. Parse and summarize the issue with `scripts/intake_issue.sh <issue-url>`.
2. Run preflight checks with `scripts/preflight_check.sh <issue-url>`.
3. Evaluate ambiguity using `references/question-checklist.md`.
4. If any required detail is missing, ask concise blocking questions and stop implementation.
5. After clarification is complete, create branch using:
   - `codex/issue-<number>-<slug>`
6. Implement the requested change.
7. Validate with the smallest meaningful test/lint scope for changed files.
8. Commit and push.
9. Create a PR to `main` with `references/pr-template.md`.

## Non-negotiable rules

- Use `gh` CLI for issue and PR operations.
- Do not start implementation when blocking questions remain.
- Keep PR base branch fixed to `main`.
- Include `Closes #<issue-number>` in PR body when applicable.
- If repository has unrelated local changes, do not revert them.

## Resources

- Issue intake: `scripts/intake_issue.sh`
- Preflight checks: `scripts/preflight_check.sh`
- Clarification checklist: `references/question-checklist.md`
- PR body template: `references/pr-template.md`
