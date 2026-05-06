# Security

OpenGriffin runs arbitrary tool calls on your machine. The agent has access to your filesystem, your shell, your AI provider keys, and (if you add gateways) your messengers. This page describes every layer of defense and how to operate them.

## Threat model

Realistic threats, ordered by likelihood:

1. **Prompt injection** — content the agent reads (a webpage, an email, tool output) tries to override its instructions
2. **Goal misgeneralization** — the agent does something *related* to your request but harmful (deletes the wrong file, posts the wrong message)
3. **Bad skills** — a community skill you installed contains malicious instructions or runs a payload
4. **Hostile peers** — A2A delegation to a peer that returns malicious output
5. **Compromised provider key** — leaked key being used to spend on your behalf
6. **Bot impersonation** — someone messaging your bot's Telegram pretending to be you

Each layer below addresses one or more of these.

## Layered defenses

### 1. CONSTRAINTS.md (override-proof rules)

`memories/CONSTRAINTS.md` is loaded at the **top of every system prompt** with explicit "violating these is a failure" framing. Use it for hard rules:

```markdown
- Never push to main without explicit approval in this chat
- Never spend more than $5 in a single action without confirming
- Never share my home address, phone number, or government ID
- Never delete files outside my project workspaces
```

Constraints take precedence over MEMORY.md, USER.md, SOUL.md, and per-chat sysprompts. They cannot be silently overridden by a clever prompt.

### 2. Pre-execution scanner (`security_scan`)

Pattern-matches every consequential action *before* it runs. Catches:

- **Prompt injection patterns**: "ignore previous instructions", `</system>`, DAN mode, jailbreak phrases
- **Dangerous shell**: `rm -rf /`, fork bombs, `mkfs`, `dd if=… of=/dev/sd*`, `curl … | sh`, `git push --force`, `chmod -R 777`, `drop table`
- **Hardcoded secrets**: AWS keys, GitHub PATs, OpenAI/Anthropic/Slack/Telegram tokens, private keys
- **Exfiltration URLs**: long base64 chunks in querystrings
- **Homograph attacks**: Cyrillic/Greek lookalikes inside URLs
- **Egress allowlist**: hosts not in your configured allowlist trip a flag

Default allowlist includes `api.anthropic.com`, `api.openai.com`, GitHub, Telegram, HuggingFace, Wikipedia, PyPI, npm, localhost. Add more with `egress_allow` tool or by editing `~/.opengriffin/egress_allowlist.json`.

Hardline patterns (fork bomb, `rm -rf /`, `mkfs`, `dd to /dev/sd*`) **cannot be allowed** — even by the user. They're severity `block`.

### 3. Capability tokens (`capabilities`)

Every consequential tool can be gated by signed, scoped, expiring tokens. Mint one with:

```
mcp__capabilities__capability_mint scope=Bash:git* ttl_seconds=3600 cap_usd=null note="merge cleanup"
```

The token:
- Is signed by a per-installation HMAC secret in `~/.opengriffin/cap_secret`
- Carries a scope (exact match or fnmatch — `Bash:git*` covers `Bash:git push`)
- Expires (default 1 hour)
- Carries an optional dollar cap for wallet operations
- Tracks consumption (use_count, consumed_usd)

The agent presents the token's id when calling a gated tool; verification reconstructs the HMAC and compares.

### 4. Critic — adversarial twin (`critic`)

A second agent reviews proposed actions before execution. Critically: **it does NOT see the user's original prompt**. This prevents shared goal-misgeneralization (where the actor and reviewer fail in correlated ways).

Output: `{verdict: approve|deny|escalate, reasoning, risk_score: 0-10}`. Logged to `critic.jsonl` for audit.

Use it before:
- Wallet payments
- Network POST to unknown hosts
- Bulk file deletion
- Outbound messages to large groups

### 5. Quorum (`quorum`)

For *very* high-stakes actions, run an N-of-M independent vote:

```
mcp__quorum__quorum_vote action="Send tax docs to accountant@example.com" n=2 m=3
```

Each voter has a different persona (skeptical security reviewer, pragmatic engineer, patient ethicist). Action proceeds only if `n` agree. Logged to `quorum_log.jsonl`.

Reduces single-point prompt-injection failure: an attacker would have to fool all 3 personas simultaneously.

### 6. Approval inline buttons

For Bash commands matching dangerous patterns (and not pre-approved by capability token), the bot sends a Telegram message with inline buttons:

- ✅ **Allow once** — runs this command, doesn't change anything else
- 🟢 **Session** — allows this tool until `/reset`
- 🔵 **Always** — adds to permanent allowlist
- ❌ **Deny**

Times out at 60 seconds. Default on timeout: deny.

### 7. Hardware-attested signing (`attest`)

Every consequential action gets a tamper-evident signature using:

- **macOS**: Secure Enclave via Keychain
- **Linux**: TPM 2.0 via tpm2-tools (when available)
- **Fallback**: Ed25519 software key in `~/.opengriffin/attest.key`

Signed records go to `attest_log.jsonl`. Tamper-evident: any change to past entries breaks the chain.

### 8. ZK-style audit log (`zk_proofs`)

Hash-chained Merkle log of consequential actions. Periodically `commit_root` snapshots the current Merkle root — share this hash anywhere immutable (a tweet, a public Gist) to lock the audit state.

Later, `zk_proof <index>` produces a Merkle inclusion proof letting you reveal one action *without* exposing other entries. Verifiers reconstruct the root from the proof and compare.

This is **not** zkSNARKs — it's selective disclosure via Merkle trees. The action's *content* isn't private until you choose to reveal it; only the *content of other actions* stays hidden during a single proof.

### 9. Checkpoints + rollback

Every `Write`, `Edit`, `MultiEdit`, `NotebookEdit` snapshots the file first to `~/.opengriffin/checkpoints/<timestamp>/`. Recover with:

```
/rollback
```

Restores the most recent snapshot. Tested in `tests/test_checkpoints.py`.

### 10. Dead-man's switch (`deadman`)

If no user message arrives for **N days** (default 7):

1. Outbound actions lock
2. Bot sends a recovery code daily via Telegram
3. After 14 days (configurable), the recovery code is sent to a trusted contact

On your return, message the recovery code to unlock. Configure via `deadman_configure`.

Useful if you fall ill, lose your phone, or are otherwise incommunicado. Stops the agent from acting on stale instructions.

### 11. Skill Hub license + signature checks

`skill_hub_install` from a GitHub URL:
- Reads the source repo's LICENSE file. Refuses non-permissive licenses unless `allow_unknown_license=true`.
- Records the install with a SHA-256 signature of the SKILL.md
- Tracks reputation by *outcome* (use_count over age, factoring uninstalls)

You always know where a skill came from and whether it's been modified.

### 12. Secret redaction (`redact`)

Outbound messages from the agent to Telegram are scrubbed for known secret patterns (Anthropic, OpenAI, AWS, GitHub, Slack, Telegram tokens, private keys). If a tool accidentally surfaces a secret in its output, redaction kicks in before the user sees it.

## Operational guidance

### Default-deny postures

Set these in `.env` for tighter operation:

```bash
# Block Playwright MCP if you don't browse
CLAUDE_BOT_DISABLE_PLAYWRIGHT=1

# Lock down egress
OPENGRIFFIN_EGRESS_ALLOWLIST_STRICT=1   # roadmap

# Wallet caps
WALLET_DAILY_USD_CAP=1
WALLET_AUTO_APPROVE_USD=0   # always ask, never auto-pay
```

### Audit cadence

- Daily (automatic): drift detection at 5am, dream cycle at 3am
- Weekly: review `~/.opengriffin/critic.jsonl` for any `verdict=deny` entries
- Monthly: rotate provider keys, regenerate Telegram bot token via @BotFather
- Quarterly: review CONSTRAINTS.md (have any become stale?)

### Reporting a vulnerability

Email `security@opengriffin.com`. We'll respond within 72 hours with a triage decision and coordinated disclosure timeline. **Do not file public issues for security bugs.**
