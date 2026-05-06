---
name: obsidian-vault
description: Use when the user wants to read, create, or search notes in a local Obsidian vault.
license: Apache-2.0
author: OpenGriffin
---

# Obsidian vault operations

A vault is just a directory of markdown files. No special tooling needed.

## Common operations

- **Find notes**: `find $VAULT -name "*.md" -newer ...`
- **Search**: `grep -r "term" $VAULT --include="*.md"`
- **Create note**: write `$VAULT/<folder>/<title>.md` with frontmatter:
  ```markdown
  ---
  date: 2026-05-06
  tags: [project, note]
  ---
  # Title
  body…
  ```
- **Daily notes**: `$VAULT/Daily/YYYY-MM-DD.md`

## Backlinks

Use `[[Other Note]]` to wikilink. Obsidian builds the backlink graph from these.

## Templates

Look for `$VAULT/.obsidian/templates/`. Append a template file to a new note when scaffolding.

## Anti-patterns

- Editing notes that are open in the Obsidian UI — Obsidian will overwrite your changes on focus.
- Creating notes in subdirs that don't exist (Obsidian shows them but warns).
