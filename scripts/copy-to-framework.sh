#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <framework> <source-dir>" >&2
  echo "Example: $0 astro-react ../../something" >&2
  exit 1
fi

framework="$1"
source_dir="$2"

script_dir="$(cd "$(dirname "$0")" && pwd)"
project_root="$(cd "$script_dir/.." && pwd)"
dest_dir="$project_root/files/framework/$framework"

if [[ ! -d "$source_dir" ]]; then
  echo "Error: source directory '$source_dir' does not exist" >&2
  exit 1
fi

if [[ ! -d "$dest_dir" ]]; then
  echo "Error: framework directory '$dest_dir' does not exist" >&2
  exit 1
fi

source_abs="$(cd "$source_dir" && pwd)"

# Files and directories that should not be copied into templates
IGNORE_PATTERNS=(
  .agents/
  .devcontainer/
  .dockerignore
  .gitignore
  .prettierignore
  .prettierrc.json
  .vscode/
  Dockerfile
  LICENSE
  Procfile
  README.md
  compose.yaml
  donation-config.json
  fake
  package-lock.json
  platform.yaml
  pnpm-lock.yaml
  pnpm-workspace.yaml
  skills-lock.json
)

should_ignore() {
  local file="$1"
  for pattern in "${IGNORE_PATTERNS[@]}"; do
    if [[ "$pattern" == */ ]]; then
      # Directory pattern: match if file starts with it
      [[ "$file" == "$pattern"* || "$file" == */"$pattern"* ]] && return 0
    else
      # File pattern: match basename
      [[ "$(basename "$file")" == "$pattern" ]] && return 0
    fi
  done
  return 1
}

# Use git ls-files to respect .gitignore from the source repo
files=$(git -C "$source_abs" ls-files --cached --others --exclude-standard)

if [[ -z "$files" ]]; then
  echo "No files found in '$source_dir'" >&2
  exit 1
fi

count=0
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  should_ignore "$file" && continue
  src="$source_abs/$file"
  dst="$dest_dir/$file"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
  count=$((count + 1))
done <<< "$files"

echo "Copied $count files from '$source_dir' to '$dest_dir'"
