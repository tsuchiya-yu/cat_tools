#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
current_branch="$(git -C "$repo_root" branch --show-current)"

if [[ "$current_branch" != "main" ]]; then
  exit 0
fi

src_dir="$repo_root/skills"
dest_root="${CODEX_HOME:-$HOME/.codex}/skills"

if [[ ! -d "$src_dir" ]]; then
  exit 0
fi

mkdir -p "$dest_root"

shopt -s nullglob
for skill_dir in "$src_dir"/*; do
  [[ -d "$skill_dir" ]] || continue
  [[ -f "$skill_dir/SKILL.md" ]] || continue

  skill_name="$(basename "$skill_dir")"
  dest_dir="$dest_root/$skill_name"

  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "$skill_dir/" "$dest_dir/"
  else
    rm -rf "$dest_dir"
    mkdir -p "$dest_dir"
    cp -R "$skill_dir/"* "$dest_dir/"
  fi

  echo "Skillを同期しました: $skill_name"
done
