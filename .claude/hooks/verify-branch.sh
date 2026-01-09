#!/bin/bash
set -euo pipefail
input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# Warn if committing directly to main/master
if [[ "$command" =~ ^git[[:space:]]+commit ]]; then
    branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
    if [[ "$branch" =~ ^(main|master)$ ]]; then
        echo "⚠️  WARNING: Committing to $branch. Create a feature branch first:" >&2
        echo "   git checkout -b feature/story-{ID}-description" >&2
    fi
fi

# Warn if creating PR against main instead of dev
if [[ "$command" =~ ^gh.*pr[[:space:]]+create ]]; then
    if ! [[ "$command" =~ (--base(=|[[:space:]]+)dev|-B[[:space:]]*dev) ]]; then
        echo "⚠️  WARNING: PRs must target 'dev' branch, not 'main'." >&2
        echo "   Use: gh pr create --base dev" >&2
    fi
fi

exit 0
