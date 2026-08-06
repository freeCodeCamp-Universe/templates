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
  .claude/
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
  package-lock.json
  platform.yaml
  pnpm-lock.yaml
  pnpm-workspace.yaml
  skills-lock.json
)

truncate_deps() {
  local file="$1"
  local filter='
    def truncate_version:
      if test("^\\^?[0-9]+\\.[0-9]+\\.[0-9]+$") then
        ltrimstr("^") | split(".") |
        if .[0] == "0" then "^" + .[0] + "." + .[1]
        else "^" + .[0] end
      else . end;
    def process: map_values(truncate_version);
    (if .dependencies then .dependencies |= process else . end) |
    (if .devDependencies then .devDependencies |= process else . end) |
    (if .peerDependencies then .peerDependencies |= process else . end) |
    (if .optionalDependencies then .optionalDependencies |= process else . end)
  '
  local tmp
  tmp=$(jq "$filter" "$file") && printf '%s\n' "$tmp" > "$file"
}

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

declare -A synced_files
count=0
while IFS= read -r file; do
  [[ -z "$file" ]] && continue
  should_ignore "$file" && continue
  src="$source_abs/$file"
  dst="$dest_dir/$file"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
  if [[ "$(basename "$file")" == "package.json" ]]; then
    truncate_deps "$dst"
  fi
  synced_files["$file"]=1
  count=$((count + 1))
done <<< "$files"

# Delete files in dest that are not in source
deleted=0
while IFS= read -r dst_file; do
  rel="${dst_file#"$dest_dir"/}"
  # Keep .gitkeep files (directory placeholders)
  [[ "$(basename "$rel")" == ".gitkeep" ]] && continue
  # Keep files that exist in source
  [[ -e "$source_abs/$rel" ]] && continue
  rm "$dst_file"
  deleted=$((deleted + 1))
done < <(find "$dest_dir" -type f)

# Remove empty directories left after deletion
find "$dest_dir" -mindepth 1 -type d -empty -delete 2>/dev/null || true

echo "Synced $count files from '$source_dir' to '$dest_dir' ($deleted deleted)"
