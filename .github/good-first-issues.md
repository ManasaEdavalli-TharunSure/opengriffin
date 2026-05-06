# 10 ready-to-paste good-first-issue stubs

For each: copy title + body into a new issue at https://github.com/greentarallc/opengriffin/issues/new?labels=good+first+issue. Add the `good first issue` label.

These are all small, well-scoped, and unblock real value. Not just busywork.

---

## 1. Add a Vertex AI provider adapter

**Labels**: `good first issue`, `enhancement`, `area:providers`

Google's Vertex AI hosts the same Gemini models but with VPC-SC + IAM (different auth than the public Gemini API). Many B2B users are required to use Vertex.

**Where**: `src/opengriffin/providers/vertex.py` — copy the `gemini.py` shape but use `google-cloud-aiplatform` SDK with service-account auth.

**Acceptance**: registers `OPENGRIFFIN_PROVIDER=vertex`; reads `GOOGLE_APPLICATION_CREDENTIALS` env; passes the test in `tests/providers/test_vertex.py` (mock the HTTP call).

**Why this is a good first issue**: provider adapters are mechanical — copy a similar one and rewire auth + base URL. ~150 lines of code + tests.

---

## 2. Add a Telegram-style group-chat support flag to Discord/Slack/Matrix

**Labels**: `good first issue`, `enhancement`, `area:gateways`

Currently the gateways treat group chats and DMs identically. Some users want the bot quiet in groups unless explicitly mentioned.

**Where**: `src/opengriffin/gateways/{discord,slack,matrix}.py`

**Acceptance**: env var `<PLATFORM>_GROUP_MENTION_ONLY=1` makes the bot only respond when @-mentioned in a group; DMs always respond.

**Why this is a good first issue**: small change in 3 files, easy to test manually.

---

## 3. Add 3 more bundled skills: `git-worktrees`, `dockerfile-best-practices`, `terraform-modules`

**Labels**: `good first issue`, `documentation`, `area:skills`

We ship 20 bundled Apache-2.0 skills. These three are obvious gaps.

**Where**: `bundled_skills/<name>/SKILL.md`

**Acceptance**: each skill is concrete (commands + examples), Apache-2.0 frontmatter, original content. See `bundled_skills/github-pr/SKILL.md` for shape.

**Why this is a good first issue**: pure markdown. No code. Tests not required (skills don't have tests).

---

## 4. Implement `replay --diff` flag for side-by-side comparison

**Labels**: `good first issue`, `enhancement`, `area:tooling`

The `replay` MCP tool runs a past session through a different model and returns the new transcript. There's no built-in side-by-side comparison.

**Where**: `src/opengriffin/replay.py` and the `griffin replay` CLI command (add to `cli.py`).

**Acceptance**: `griffin replay <session_id> --model gpt-4o --diff` shows the original and replayed turns in two columns or unified diff format.

**Why this is a good first issue**: pure presentation logic; existing `replay` API does the heavy lifting.

---

## 5. Add export to `griffin export` CLI

**Labels**: `good first issue`, `enhancement`, `area:cli`

For privacy/portability users want to export everything OpenGriffin knows about them.

**Where**: `src/opengriffin/cli.py` — new `export` subcommand.

**Acceptance**: `griffin export --output mydata.tar.gz` produces a tar.gz containing `~/.opengriffin/memories/`, `~/.opengriffin/journal/`, `usage.jsonl`, `kanban.json`, and a manifest with timestamps. Tokens / secrets in any file are pre-redacted.

**Why this is a good first issue**: filesystem packing + redaction call exists in `redact.py`. ~80 lines.

---

## 6. Add a `griffin reset --confirm` command

**Labels**: `good first issue`, `enhancement`, `area:cli`

Sometimes you want to start fresh. Currently you'd `rm -rf ~/.opengriffin/` manually.

**Where**: `src/opengriffin/cli.py`.

**Acceptance**: prompts for confirmation, lists what will be deleted, supports `--keep memory` / `--keep skills` flags. Defaults to interactive confirmation; `--force` skips.

**Why this is a good first issue**: well-scoped destructive op with safety belts.

---

## 7. Smoke test on Linux (currently only macOS-tested)

**Labels**: `good first issue`, `bug`, `area:install`

`scripts/install.sh` is mac-tested but not Linux-tested. There may be paper cuts.

**Where**: GitHub Actions workflow + a bug report with findings.

**Acceptance**: a CI job that runs `scripts/install.sh` on Ubuntu and Debian and reports failures. PR fixes any actual bugs found.

**Why this is a good first issue**: introduces you to the install path AND CI.

---

## 8. Add a `--quiet` flag to `opengriffin run`

**Labels**: `good first issue`, `enhancement`, `area:cli`

The default log volume is verbose. For production, users want WARN+ only.

**Where**: `src/opengriffin/bot.py` — set `logging.basicConfig(level=...)` based on a CLI flag.

**Acceptance**: `opengriffin run --quiet` shows only WARN/ERROR logs; `--debug` shows DEBUG; default unchanged (INFO).

**Why this is a good first issue**: small CLI plumbing change.

---

## 9. Add `tests/test_zk_proofs.py`

**Labels**: `good first issue`, `tests`, `area:security`

`zk_proofs.py` (Merkle-tree audit log) has no test coverage.

**Where**: `tests/test_zk_proofs.py`

**Acceptance**: tests for `append → commit_root → inclusion_proof → verify_proof` round-trip. At least one negative test (a tampered leaf produces an invalid proof).

**Why this is a good first issue**: tight scope, clear API to exercise.

---

## 10. Add a `griffin journal --search <query>` flag

**Labels**: `good first issue`, `enhancement`, `area:cli`

`griffin journal` shows the last N entries; there's no way to search older ones.

**Where**: `src/opengriffin/cli.py` and `src/opengriffin/self_improve.py`.

**Acceptance**: `griffin journal --search "skill"` returns matching entries with their dates.

**Why this is a good first issue**: text search over a file. ~20 lines.
