---
name: github-pr
description: Use when the user wants to create, update, or manage a GitHub pull request via the gh CLI.
license: Apache-2.0
author: OpenGriffin
---

# GitHub PRs

Use the `gh` CLI for everything. Don't open the GitHub web UI.

## Create a PR

```bash
git push -u origin HEAD
gh pr create --title "short imperative title" --body "$(cat <<'EOF'
## Summary
- bullet 1
- bullet 2

## Test plan
- [ ] manual smoke
- [ ] CI green
EOF
)"
```

Title = imperative ("Add X", not "Added X" or "Adds X"). Under 60 chars.
Body = WHY (the user-visible motivation), not WHAT (the diff already shows that).

## Read a PR

```bash
gh pr view 123 --json title,body,state,reviews,comments
gh pr diff 123
gh pr checks 123
```

## Update a PR

```bash
gh pr edit 123 --title "..." --body "..."
gh pr ready 123    # mark ready for review
gh pr merge 123 --squash --delete-branch
```

## Anti-patterns

- Pushing without a PR.
- PRs over 500 lines (split them).
- PRs whose title doesn't match the change.
- Letting CI fail and pushing again hoping it passes.
