# Skills

Skills are markdown files that teach the agent how to do a specific job. They live at `~/.claude/skills/<name>/SKILL.md` and auto-load on every session.

## Anatomy of a skill

```markdown
---
name: github-pr
description: Use when the user wants to create, update, or manage a GitHub pull request via the gh CLI.
license: Apache-2.0
author: OpenGriffin
---

# GitHub PRs

When the user asks to create or manage a GitHub PR, use the `gh` CLI for everything. Don't open the GitHub web UI.

## Create a PR

git push -u origin HEAD
gh pr create --title "short imperative title" --body "..."

...
```

The key parts:

- **Frontmatter `name`**: kebab-case, matches the directory name
- **Frontmatter `description`**: how Claude decides whether to invoke this skill
- **Frontmatter `license`**: required for redistribution
- **Frontmatter `author`**: required attribution if license is permissive
- **Body**: instructions Claude reads when the skill is loaded

## How skills load

The Claude Agent SDK reads `~/.claude/skills/` on every session start. Each skill's frontmatter is parsed; the body is loaded into context lazily — only when Claude decides to invoke the skill (or when the user explicitly mentions it).

So the cost of having 200 skills installed is small (~50 chars of frontmatter per skill in the system prompt index). The cost of *invoking* a skill is the body.

## Bundled skills (this repo)

OpenGriffin ships 20 Apache-2.0 starter skills in `bundled_skills/`:

| Skill | What |
|---|---|
| `writing-plans` | Forces a structured plan.md before non-trivial coding tasks |
| `systematic-debugging` | 4-phase reproduce → hypothesize → test → fix loop |
| `tdd-workflow` | Red-green-refactor TDD enforcement |
| `code-review` | Severity-rated review template |
| `github-pr` / `github-issues` | gh CLI wrappers |
| `linear-task` | Linear GraphQL API |
| `notion-page` | Notion API |
| `obsidian-vault` | Local vault read/write |
| `web-research` / `web-scrape` | Multi-source research, scraping etiquette |
| `pdf-extract` | pymupdf + pdfplumber + OCR fallback |
| `python-testing` | pytest patterns |
| `docker-compose` | Multi-service stack templates |
| `secret-scan` | gitleaks/trufflehog patterns |
| `dependency-audit` | pip-audit / npm audit / cargo audit |
| `brand-voice` | Voice extraction from samples |
| `rest-api-design` | Status codes, pagination, error shapes |
| `database-migrations` | Safe migration patterns |
| `kubernetes-manifest` | Pinned tags, resource limits, probes |

Installed automatically by `scripts/install.sh`.

## Installing community skills

Use Skill Hub:

```
mcp__skill_hub__skill_hub_install source=github://owner/repo/path/to/skill
mcp__skill_hub__skill_hub_install source=github-org://owner/repo            # all skills in the repo
mcp__skill_hub__skill_hub_install source=https://example.com/my-skill.md
```

Skill Hub:
- Reads the source repo's LICENSE file
- Refuses non-permissive licenses (Apache, MIT, BSD pass) unless `allow_unknown_license=true`
- Records source, signature, install time in `~/.opengriffin/skill_hub.json`
- Tracks reputation by usage outcome (use_count, age, uninstalls)

## Authoring a new skill

1. Create `~/.claude/skills/<name>/SKILL.md` with the frontmatter shown above
2. Body should be **instructions to Claude**, not documentation for humans:
   - "When the user asks for X, first do Y"
   - "Avoid Z"
   - Concrete commands and expected outputs
3. Test by asking Claude to do the task — does it pick up your skill? Does it follow the instructions?
4. Iterate until it does

The agent itself can author new skills via:

```
mcp__bot_tools__skill_create name=my-skill description="..." body="..."
mcp__bot_tools__skill_edit name=my-skill body="..." description=...
mcp__bot_tools__skill_delete name=my-skill
```

So a common workflow is: ask the bot to do something repetitive, after a few times say "make this a skill," let the agent author it. New skills appear in `~/.claude/skills/` immediately.

## Skill format reference

### Frontmatter fields

| Field | Required | What |
|---|---|---|
| `name` | yes | Kebab-case skill id |
| `description` | yes | One-line — drives auto-invocation |
| `license` | recommended | Apache-2.0, MIT, BSD, etc. |
| `author` | recommended | Required attribution for redistribution |
| `version` | optional | Semantic version |
| `metadata` | optional | Free-form YAML (tags, categories) |
| `prerequisites` | optional | `commands: [foo, bar]` — required CLI tools |

### Body content

- **Plain markdown**. Headings, lists, code blocks all work.
- **Code blocks** marked with their language render cleanly in IDEs and diffs.
- **External assets**: store at `~/.claude/skills/<name>/scripts/`, reference by relative path. The Claude Agent SDK passes them through.
- **References**: link to authoritative docs at the top so the agent can deep-dive when needed.

### Invocation triggers

Claude invokes a skill when the user's request matches the skill's `description` semantically. To force invocation:

```
> Use the github-pr skill to draft a PR for X
```

Or in the system prompt: `When the user mentions PRs, always invoke the github-pr skill.`

## Self-healing skills

When a skill fails 3+ times in a 7-day window, the `self_healing` module:

1. Reads the failure traces from `skill_failures.jsonl`
2. Asks Claude (with NO prompt context) to propose an updated SKILL.md
3. Writes the proposal to `~/.opengriffin/skill_proposals/<name>.md`
4. Notifies you via Telegram

Apply with:

```
mcp__self_healing__skill_heal_accept name=<skill>
```

Backs up the original to `<skill>.md.bak`. Roll back if the proposal made things worse.

## Skill graph strategy

The `skill_strategy` module reads your usage to recommend:

- **Top-used** skills (worth investing in customizing)
- **Never-used** skills (candidates to remove)
- **Suggested** skills (frequently co-used with what you have, but missing)

```
mcp__skill_strategy__skill_strategy
```

## License compliance

OpenGriffin's bundled skills are Apache-2.0 — safe to redistribute commercially with attribution. Community skills installed via Skill Hub may have different licenses. Check `~/.opengriffin/skill_hub.json`'s `license` field per skill before redistributing.

If you author a skill, license it permissively (Apache-2.0 or MIT). Restrictive licenses limit who can use your skill.

## Anti-patterns

- ❌ Skills longer than 200 lines (split them)
- ❌ Skills that try to do many things (one job per skill)
- ❌ Skills that hardcode user paths or secrets
- ❌ Skills without a clear `description` (Claude can't decide when to use them)
- ❌ Skills that duplicate what bundled skills already do (PR an improvement instead)
- ❌ Skills that don't tell Claude what to AVOID
