# Cron + Triggers

OpenGriffin has two scheduling layers: **cron jobs** (deterministic recurring work) and **triggers** (signal-driven event handlers).

## Built-in cron jobs (auto-installed)

Eleven jobs run automatically inside the bot process. None require setup.

| Time | Job | What |
|---|---|---|
| 02:30 | predictive pattern detection | Re-scans message timing patterns from the last 30 days |
| every 15 min | predictive pre-compute | For patterns firing in the next hour, pre-runs the prompt |
| 03:00 | dream cycle | Counterfactual reflection on yesterday's interesting sessions, distill lessons → MEMORY |
| 04:00 | daily session reset | Archives current sessions; new sessions start in the morning |
| 04:30 | self-improvement | Reads yesterday's transcripts, consolidates MEMORY/USER, writes JOURNAL.md |
| 04:45 | echo memory consolidation | Rolls vivid → recent → fading → ancient |
| 05:00 | drift detection | Surfaces USER.md vs recent-behavior contradictions |
| 06:00 | dead-man's switch check | If no user activity for N days, lock outbound + send recovery |
| 07:00 | (any user-defined) |  |
| 09:00 | (any user-defined, weekday only) |  |
| Sun 05:00 | voice card refresh | Re-extracts writing voice from past week's chats |

Disable any of these by removing the `add_job(...)` call in `bot.py`'s `_post_init`. They're all opt-out, not opt-in.

## User-defined cron jobs

Defined in `~/.opengriffin/jobs.json`. Schema:

```json
{
  "jobs": [
    {
      "id": "morning-summary",
      "name": "Morning summary",
      "schedule": "0 7 * * *",
      "enabled": true,
      "deliver_to": "1234567890",
      "prompt": "Compile a 5-bullet morning summary..."
    }
  ]
}
```

| Field | Meaning |
|---|---|
| `id` | Unique kebab-case id. Used for `/runjob <id>` and to remove later. |
| `name` | Human-readable. Shown in `/jobs` and Telegram messages. |
| `schedule` | Cron expression: `min hour day month dow`. Standard 5-field format. |
| `enabled` | If false, skipped (kept for history). |
| `deliver_to` | Telegram chat id to deliver to. Use `"home"` for your configured home channel. |
| `prompt` | The full prompt the agent runs at fire time. |
| `pre_script` | (optional) Path to a Python script run first; its stdout prepends to the prompt. |

### `[SILENT]` prefix

Prefix a prompt with `[SILENT]` to suppress delivery — the job still runs (and writes to memory, kanban, etc.), but no Telegram message is sent:

```json
{
  "prompt": "[SILENT] Internally review last week's journal..."
}
```

### Cron syntax cheatsheet

| Schedule | Expression |
|---|---|
| Every weekday at 9am | `0 9 * * 1-5` |
| Every Sunday at 5am | `0 5 * * 0` |
| Every hour during business | `0 9-17 * * 1-5` |
| Every 15 minutes | `*/15 * * * *` |
| First of every month at noon | `0 12 1 * *` |
| Every 3 hours, 9am to 9pm | `0 9-21/3 * * *` |

### Editing jobs at runtime

The agent can manage jobs via tools — no need to edit JSON by hand:

```
mcp__bot_tools__cronjob_create id=daily-news schedule="0 6 * * *" prompt="..." deliver_to=home
mcp__bot_tools__cronjob_pause id=daily-news
mcp__bot_tools__cronjob_resume id=daily-news
mcp__bot_tools__cronjob_run_now id=daily-news
mcp__bot_tools__cronjob_remove id=daily-news
mcp__bot_tools__cronjob_list
```

Or in Telegram: `/jobs`, `/runjob <id>`.

## Triggers — the ambient mesh

Cron is "every X." Triggers are "when Y happens." Three sources, optional LLM predicate, then action.

Defined in `~/.opengriffin/triggers.json`:

```json
{
  "triggers": [
    {
      "id": "stripe-revenue-drop",
      "enabled": true,
      "source": {"kind": "webhook", "route": "stripe"},
      "predicate": "Did weekly revenue drop more than 10% week-over-week?",
      "action": {
        "kind": "agent",
        "prompt": "Investigate the drop. Pull recent transactions...",
        "deliver_to": "home"
      }
    }
  ]
}
```

### Source kinds

| `kind` | Config | Fires when |
|---|---|---|
| `cron` | `expr: "0 9 * * 1-5"` | At cron time |
| `webhook` | `route: "stripe"` | A `POST /hooks/stripe` arrives (HMAC-validated) |
| `poll` | `url: "https://...", interval_sec: 300` | Every interval, fetch URL, run predicate on response |

### Predicates

`predicate` is an optional yes/no question Claude evaluates on the source payload. Action only fires if the verdict starts with `yes`. Examples:

- `"Is this commit on the main branch?"`
- `"Are there any new mentions with sentiment=negative in the response?"`
- `"Did weekly revenue drop more than 10% week-over-week?"`

Skip `predicate` (or set empty string) to fire unconditionally.

### Action kinds

| `kind` | What |
|---|---|
| `agent` | Runs the prompt through Claude; result delivered to `deliver_to` |
| `send` | Just sends `text` to `deliver_to`; no LLM cost |

### The full DAG

```
[ cron expr ]                 ┐
[ webhook   ]  → predicate? → action(agent|send) → deliver_to
[ poll url  ]                 ┘
```

Composable in any combination. The whole mesh is reloaded on bot restart.

## Time-locked actions

Distinct from cron + triggers: a one-shot action committed at a future absolute time. You (or the agent) commits to it; the user can `/veto <id>` before fire time but otherwise it fires irreversibly.

```
mcp__timelock__timelock_create when_iso="2026-05-10T15:00" action_kind=send payload_json='{"chat_id":"home","text":"Reminder: ship by EOD"}'
mcp__timelock__timelock_list
mcp__timelock__timelock_veto id=abc12345
```

Useful for self-imposed deadlines and dead-man-style delivery.

## Predictive pre-compute

The `predictive` module learns recurring query patterns by time-of-day and pre-computes likely answers 15 minutes early. When you ask, the cached answer returns instantly while the actual run still happens for cache freshness.

> "I noticed you check NVDA every weekday morning at 8:30 — here it is."

Patterns require 3+ occurrences at the same weekday-and-hour to register. View detected patterns:

```
mcp__predictive__predictive_detect       # re-scan now
mcp__predictive__predictive_run          # pre-compute due patterns
```

Stored in `~/.opengriffin/predictions/patterns.json`.

## Debugging cron + triggers

| Command | What |
|---|---|
| `/jobs` | List all scheduled cron jobs with next fire time |
| `/runjob <id>` | Fire a job immediately (in addition to its schedule) |
| `mcp__triggers__trigger_list` | List ambient triggers |
| `tail -f bot.err.log` | Watch the bot log for fire events |
| `cat ~/.opengriffin/usage.jsonl` | Per-run cost log; cron runs have `job_id` set |

If a job didn't fire when expected, the most common causes are:

- The bot wasn't running at fire time (check `launchctl list | grep claude` on macOS)
- The schedule expression is wrong (test at https://crontab.guru)
- `enabled` is `false` in `jobs.json`
- The job was created in the *running* memory but the file wasn't saved (use `cronjob_create` tool, not direct edit)
- A predicate denied the trigger (look in the bot log for `predicate eval` lines)
