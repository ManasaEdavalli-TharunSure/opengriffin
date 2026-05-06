---
name: github-issues
description: Use when the user wants to create, triage, or close GitHub issues via the gh CLI.
license: Apache-2.0
author: OpenGriffin
---

# GitHub issues

```bash
gh issue create --title "..." --body "..." --label bug
gh issue list --state open --label bug
gh issue view 42
gh issue comment 42 --body "..."
gh issue close 42 --reason completed
```

## Good issue body structure

- **What I expected**
- **What happened**
- **Repro steps**
- **Environment**: version, OS, browser
- **Logs / screenshots** if any

If you're triaging:
- Add labels: severity (P0/P1/P2/P3), type (bug/feat/chore), area (auth/billing/...).
- Reproduce before assigning.
- Close as `not_planned` if it's out of scope; close as `completed` only if fixed.
