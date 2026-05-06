# OpenGriffin Roadmap

The OSS Core (this repo) is the foundation. This document captures the future
hosted / paid-tier vision — the product that the original `opengriffin.com`
landing page was positioning before we pivoted to the OSS-first launch.

The OSS will always be free. Paid tiers wrap Core with managed infrastructure
and convenience features that aren't worth a user self-hosting.

---

## The original SaaS positioning (preserved for future)

> **"16+ AI Models. One AI Workspace."**
>
> Every AI model. One workspace. Nothing lost.
>
> Claude, GPT, Gemini, DeepSeek — all in one place. Switch models
> mid-conversation without losing a word. One subscription, 16+ models,
> memory that never resets.

This positioning is preserved here as the **OpenGriffin Cloud** spec — the
hosted product to build once OSS demand is validated.

---

## Pricing tiers (paid-product spec)

The OSS Core stays free forever. Cloud tiers below are aspirational —
target shape when the hosted product ships.

### Free / OSS Core
- $0 forever. Self-hosted. BYO key.
- All 30 features. All 21 providers.
- 7 platform gateways. Full feature parity with Cloud.
- License: Apache 2.0.

### Cloud Starter — $19/mo
- 100K words/month included
- "Route to DeepSeek at 0.1× and that's effectively 1M words"
- All 16+ chat models
- Image & video generation
- Persistent cross-model memory
- Built-in tool calling
- Usage analytics

### Cloud Pro — $39/mo (Popular)
- 500K words/month
- Everything in Starter
- Priority support
- Top-up credits ($5/$10/$20)
- Usage analytics by model
- Higher rate limits

### Cloud Agency — $79/mo
- 2M words/month
- Everything in Pro
- Custom agent development
- MCP integrations
- Multi-user support
- Dedicated Slack channel

### Word-based billing math
- `(input_words + output_words) × model_multiplier`
- DeepSeek V3 at 0.1× costs 10× fewer words than GPT-4o
- 40× fewer than GPT-5 at 4.0×
- Cancel anytime, no contracts
- 7-day post-cancellation data retention, then permanent delete

---

## Model roster (Cloud)

| Model | Multiplier | Use case |
|---|---|---|
| DeepSeek V3 | 0.1× | Drafts, summaries, bulk tasks |
| Gemini 2.5 Flash | 0.15× | Fast responses, million-token context |
| GPT-4o Mini | 0.2× | Simple queries, structured output |
| Claude Haiku 4.5 | 0.3× | Quick questions, light reasoning |
| GPT-4o | 1.0× | Reliable baseline, vision tasks |
| Claude Sonnet 4 | 1.0× | Writing, nuanced analysis, coding |
| Gemini 2.5 Pro | 1.2× | Deep research, million-token context |
| Claude Opus 4 | 3.0× | Complex research, hard reasoning |
| GPT-5 | 4.0× | Frontier tasks, maximum capability |

Also: DeepSeek R1, Llama 4 Maverick, Llama 3.3 70B, Mistral Large, Grok 3 Mini,
Qwen 2.5 72B, Perplexity Sonar Pro.

**Image models (6)**: FLUX Pro, Recraft V3, Ideogram, Stable Diffusion, +2 TBD
**Video models (4)**: Kling, Hailuo, Wan, LTX

**Auto mode**: a classifier picks the right model per message based on prompt
characteristics. (Already partially built — see `routing.py` Tier-0/1/2/3
classifier.)

---

## Hero claims to preserve / rebuild for Cloud

- "Every AI model. One workspace. Nothing lost."
- "Switch models mid-conversation without losing a word"
- "One subscription, 16+ models, memory that never resets"
- "0.1× cheapest model · 40× cost spread"
- "100K word plan behaves like 1M with DeepSeek routing"
- "Auto mode selects the right model per message"
- "Cross-model memory: one memory layer across all 16 models"
- "Built-in tools — models that act, not just answer"
- "Image & video generation, all without leaving your conversation"
- "Up and running in five minutes"
- "Privacy by design: never used for training, never sold, never shared"

---

## Gap analysis — what Cloud needs that OSS Core doesn't have

### Already in OSS Core ✅
- 21 AI providers (more than the 16 advertised)
- Persistent cross-session memory (MEMORY/USER/SOUL/JOURNAL/Echo)
- Tool calling (33 MCP servers, hundreds of tools — exceeds the "11" claim)
- Per-chat model switching (`/model` command)
- Usage analytics (`/usage`, `/insights`)
- Routing classifier (Tier-0/1/2/3 fallback chains)
- BYO-key billing (you're billed by your providers)
- A2A peer-to-peer agent calls
- Skill marketplace (local-file directory)

### Need to build for Cloud ❌

#### Hosted infrastructure
- [ ] Multi-tenant SaaS backend (Supabase + Postgres OR Cloudflare D1)
- [ ] User account system (signup, login, password reset, OAuth via Google/GitHub)
- [ ] Per-user encrypted secret store (AES-256 at rest)
- [ ] Stripe billing integration with word-based metering
- [ ] Top-up credit system ($5/$10/$20 add-ons)
- [ ] Per-user resource isolation (containers / namespace)
- [ ] Email/SMS for transactional notifications
- [ ] Beta waitlist signup form + email automation
- [ ] Privacy/terms/contact pages
- [ ] Customer support workflow

#### Web workspace UI
- [ ] Web app frontend (Next.js / SvelteKit)
- [ ] Chat thread UI with mid-thread model swap (the killer UX)
- [ ] Model picker dropdown showing multipliers
- [ ] Image/video generation panel
- [ ] Memory browser (view/edit MEMORY/USER/SOUL/Echo)
- [ ] Skill catalog browser + one-click install
- [ ] Kanban board UI
- [ ] Live observability dashboard (already built; needs auth)
- [ ] Usage analytics dashboard with cost-per-model breakdown
- [ ] Settings: provider keys, allowlists, constraints, SOUL editor
- [ ] Mobile-responsive design

#### Word-based billing engine
- [ ] Token-to-word conversion per model
- [ ] Multiplier table maintained per model
- [ ] Per-message billing with running balance
- [ ] Hard limits at plan cap (graceful, no mid-period delete)
- [ ] Top-up flow
- [ ] Usage forecasts ("at this rate you'll hit cap in 8 days")

#### Image + Video generation gaps
Currently OSS has: FAL.ai wrapper for FLUX (basic). Need to add:
- [ ] FLUX Pro provider (paid tier on FAL or direct)
- [ ] Recraft V3 provider
- [ ] Ideogram provider
- [ ] Stable Diffusion provider (any of: Replicate, fal-ai, Stability)
- [ ] Kling video provider
- [ ] Hailuo video provider
- [ ] Wan video provider
- [ ] LTX video provider
- [ ] Unified `image_generate` / `video_generate` tools that pick the right
      provider based on prompt + budget

#### Mid-thread model switching
Currently: `/model <provider>` switches per-chat (works OSS).
Cloud version needs:
- [ ] Mid-thread swap that carries the full conversation context to the new model
- [ ] Provider-agnostic conversation format (translate Claude tool calls ↔ GPT
      function calls ↔ Gemini parts)
- [ ] Cost preview before swap ("this conversation has 12K input tokens, GPT-5
      will cost X words")
- [ ] Smooth UI animation in chat thread

#### Auto-mode routing
Currently: `routing.py` classifies tier 0–3 with fallback chain. Need to wire:
- [ ] Per-message classification before send
- [ ] Visible "decided to use Groq because this is a lookup" rationale
- [ ] User override / pin-model toggle
- [ ] Quality regression detection (if cheap-tier output is bad, escalate)

#### Compliance / B2B
- [ ] SOC 2 Type II readiness
- [ ] GDPR data export + delete endpoints
- [ ] AES-256 at-rest encryption layer
- [ ] Per-organization tenancy (Agency tier "multi-user support")
- [ ] SSO / SAML for enterprise
- [ ] Audit log export (already built — `attest_log.jsonl` and `zk_audit.jsonl`
      need to be exposed via authenticated API)
- [ ] Privacy policy + ToS legal review

#### Marketing / growth
- [ ] Beta waitlist with email capture (currently the OSS site has a "Star
      on GitHub" CTA — Cloud needs the waitlist signup the original site had)
- [ ] Onboarding email sequence
- [ ] Referral program
- [ ] Dedicated Slack workspace for Agency-tier customers

---

## Sequencing — when to build what

### Phase 0 — OSS launch (now, this repo)
Validate that the agent itself is loved. Build: nothing more on Cloud yet.

### Phase 1 — Cloud MVP (~3 months after OSS launch IF demand is clear)
Targets the "Starter" tier. Minimum:
- Web workspace UI (chat + model picker + memory browser)
- User accounts + Stripe word-based billing
- Per-user containerized agent runtime
- Mid-thread model switching with context carryover
- One image generation (FLUX Pro) + one video (Kling)
- Beta waitlist conversion flow

### Phase 2 — Cloud Pro (~6 months)
- All 4 image models (FLUX, Recraft, Ideogram, SD)
- All 4 video models (Kling, Hailuo, Wan, LTX)
- Top-up credits flow
- Per-model analytics
- Higher rate limits

### Phase 3 — Cloud Agency (~12 months)
- Multi-user / team workspaces
- Custom agent development tools (visual builder?)
- SOC 2 audit
- Dedicated Slack support
- SSO

---

## What we will NEVER do

These were considered and explicitly rejected to preserve OSS soul:

- ❌ Lock features behind paid tiers if they exist in Core
- ❌ Telemetry-by-default in OSS (privacy is the moat)
- ❌ Force users to a hosted product for any feature
- ❌ Train on user data
- ❌ Sell user data
- ❌ Closed-source the agent runtime

The OSS contract: every Cloud feature must EITHER (a) be available in
self-hosted Core, or (b) be infrastructure (multi-tenant DB, billing) that's
genuinely impractical to self-host at single-user scale.

---

## Open questions for the future build

1. Which hosting? Cloudflare Workers + D1 + R2 is cheapest. Fly.io for
   per-user containers is more realistic for the agent runtime. Consider:
   stateless API on Workers, agent containers on Fly.
2. Mid-thread model switching with tool calls is technically tricky —
   different providers serialize tool use differently. Need a translation
   layer or constraint to "tools available only on tool-capable models."
3. Word-based billing: definition of "word" needs to be public + stable.
   Use whitespace tokenization on input + output, or compute via a
   reference tokenizer per model and convert?
4. Privacy: encrypt customer data with their own key (BYOK encryption)
   or platform-managed? The original site claimed AES-256 + Supabase —
   that's platform-managed. Decide.
5. OSS stays Apache-2.0. Cloud product code stays proprietary. Cloud
   could be a thin wrapper over the OSS Core; the Core is the substrate.

---

*Last updated: 2026-05-06. Captured from the original opengriffin.com SaaS
landing page audit before the OSS-first launch pivot.*
