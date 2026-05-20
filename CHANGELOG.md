# Changelog

All notable changes to OpenGriffin are tracked here. Format loosely follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [SemVer](https://semver.org/spec/v2.0.0.html).

The OSS Core (this repo) is what's shipped. Cloud-tier plans live in [ROADMAP.md](ROADMAP.md).

## [Unreleased]

### Added

- `docs+site` all-gateway onboarding: README "First-time setup — pick your messenger" section + new `Gateways` section on opengriffin.com covering Telegram, Discord, Slack, Email, iMessage, Matrix, Signal — each with detailed setup steps. (#16)
- `docs/site.md` — Next.js 16 / static-export deploy reference for `apps/web`.
- `docs/providers.md` "Image generation" section documenting the `image_generate` (FAL.ai/FLUX) tool.

### Changed

- Dependabot bumps in `apps/web`: `@types/node` 25.7→25.9, `lucide-react` 1.14→1.16, `framer-motion` 12.38→12.39, `eslint` 10.3→10.4. (#17–#20)

### Security

- Enabled Dependabot security updates and secret scanning (with push protection) at the repo level.

## [0.1.0] — 2026-05

Initial public release.

### Highlights

- Long-running personal agent process on top of the [Claude Agent SDK](https://github.com/anthropics/claude-agent-sdk-python).
- **21 AI providers** behind a single `OPENGRIFFIN_PROVIDER` env var (Claude Max OAuth, Anthropic, OpenAI, OpenRouter, Azure, Gemini, Mistral, Cohere, Groq, Together, Fireworks, DeepSeek, HuggingFace, Perplexity, xAI, Bedrock, Cerebras, NVIDIA NIM, Lambda, Novita, Ollama).
- **7 messenger gateways**: Telegram, Discord, Slack, Email, iMessage, Matrix, Signal — same brain across all of them, with cross-platform identity linking.
- **Persistent memory layer**: `MEMORY.md` / `USER.md` / `SOUL.md` / `CONSTRAINTS.md` + the autobiographical Echo Memory (vivid → recent → fading → ancient) with citation receipts.
- **Nightly auto-loops** including the 04:30 self-improvement loop, dream cycle, drift detection, world-model retrain, mesa-cognition report, causal discovery, and weekly voice-card refresh.
- **Skill graph** — agent authors, edits, and retires its own skills from `~/.claude/skills/` at runtime. Skill Hub for installing from GitHub URLs with license / signing / reputation tracking.
- **Frontier modules** shipped in the same release: personal world model, living twin, verifiable refusal + provable forgetting (Merkle proofs), generative UI, mesa-cognition supervisor, capability-scoped skill leases, personal causal layer, adversarial improvement market.
- **Security**: capability tokens, adversarial critic, pre-execution scanner, hardware-attested action signing (`attest_log.jsonl`), ZK-style Merkle audit log (`zk_audit.jsonl`), dead-man's switch, N-of-M quorum on high-stakes actions, inline-button approvals with 60-second auto-deny, file checkpoints with one-command rollback.
- **Apps**: `apps/web` Next.js 16 + framer-motion landing page deployed at [opengriffin.com](https://opengriffin.com) as a static export via Vercel.
- **Docs**: full `docs/` tree covering architecture, providers, gateways, security, memory, cron + triggers, migration, configuration, and frontier-module designs.

### Tooling

- One-line installer (`scripts/install.sh`) with `uv` preferred and pip fallback.
- `griffin` / `opengriffin` Typer CLI: `run`, `doctor`, `improve`, `migrate`, plus per-feature subcommands.
- CI on Python 3.11 + 3.12 (`.github/workflows/ci.yml`), ruff lint + format baseline.
- Dependabot version updates for pip + npm + GitHub Actions.

[Unreleased]: https://github.com/ManasaEdavalli-TharunSure/opengriffin/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/ManasaEdavalli-TharunSure/opengriffin/releases/tag/v0.1.0
