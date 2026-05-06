# Telegram

The canonical OpenGriffin gateway. All other gateways are modeled after this.

## Setup (~2 minutes)

### 1. Create a bot with @BotFather

1. Open Telegram, search **@BotFather**, start a chat
2. Send `/newbot`
3. Pick a display name (e.g. "My Personal Bot")
4. Pick a username ending in `bot` (e.g. `mybot_bot`)
5. BotFather replies with a token like `1234567890:AAH...` — save this

Optional one-time settings while you're there:

- `/setprivacy` → **Disable** if you want it to read all group messages, **Enable** for DM/mention-only (default; safer)
- `/setdescription` for a profile description
- `/setuserpic` for an avatar
- `/setcommands` to register the command menu (or use the API call below)

### 2. Find your Telegram user id

Message **@userinfobot** with anything — it replies with your numeric user id.

### 3. Configure `.env`

```bash
TELEGRAM_BOT_TOKEN=1234567890:AAH...your-token-here
TELEGRAM_ALLOWED_USERS=987654321         # your numeric user id; comma-separated for multiple
TELEGRAM_HOME_CHANNEL=987654321          # default chat for cron deliveries
```

### 4. Run

```bash
opengriffin run
```

Send your bot any message. You should see a typing indicator + reply.

## Built-in commands

```
/start            Show menu and verify bot is online
/status           In-flight request progress
/cancel           Abort current request
/reset            Clear current topic's session
/topic <name>     Switch sub-conversation
/topics           List sub-conversations
/recall <query>   Search past sessions
/sessions         List archived past sessions
/resume <id>      Resume archived session
/journal [n]      Show daily journal entries
/improve          Run self-improvement turn now
/insights         Token + cost breakdown
/memory           View persistent memory
/personality      Apply SOUL preset
/sysprompt        Per-chat system prompt
/aliases          List quick-command aliases
/alias <name>=<template>   Define alias
/run <name>       Run an alias
/jobs             List cron jobs
/runjob <id>      Fire a cron job now
/kanban           View task board
/usage            Token + cost summary
/rollback         Restore most recent file checkpoint
/whoami           Your Telegram id + auth status
```

## Register the command menu (one-time)

This makes commands appear in the Telegram chat's `/` autocomplete:

```bash
TOKEN="$TELEGRAM_BOT_TOKEN"
curl -s -X POST "https://api.telegram.org/bot${TOKEN}/setMyCommands" \
  -H 'Content-Type: application/json' \
  -d '{
    "commands": [
      {"command": "start",    "description": "Show menu and verify bot is online"},
      {"command": "status",   "description": "In-flight request progress"},
      {"command": "cancel",   "description": "Abort current request"},
      {"command": "reset",    "description": "Clear current topic session"},
      {"command": "topic",    "description": "Switch sub-conversation"},
      {"command": "topics",   "description": "List sub-conversations"},
      {"command": "recall",   "description": "Search past sessions"},
      {"command": "sessions", "description": "List archived sessions"},
      {"command": "resume",   "description": "Resume archived session"},
      {"command": "journal",  "description": "Show daily journal"},
      {"command": "improve",  "description": "Run self-improvement now"},
      {"command": "insights", "description": "Token + cost breakdown"},
      {"command": "memory",   "description": "View persistent memory"},
      {"command": "personality", "description": "Apply SOUL preset"},
      {"command": "sysprompt", "description": "Per-chat system prompt"},
      {"command": "aliases",  "description": "List quick-command aliases"},
      {"command": "alias",    "description": "Define alias"},
      {"command": "run",      "description": "Run an alias"},
      {"command": "jobs",     "description": "List cron jobs"},
      {"command": "runjob",   "description": "Run a cron job now"},
      {"command": "kanban",   "description": "View task board"},
      {"command": "usage",    "description": "Token + cost summary"},
      {"command": "rollback", "description": "Restore last checkpoint"},
      {"command": "whoami",   "description": "Show your Telegram id"}
    ]
  }'
```

## Voice messages

Telegram voice notes (`.ogg` format) are auto-transcribed by `faster-whisper` at first use (downloads a ~150MB model on first invocation). The transcribed text is treated as a normal message; the agent's reply gets TTS-rendered via `edge-tts` and sent back as a voice note.

Default voice: `en-US-AvaNeural`. Override with `TTS_VOICE` env var. Some good alternatives:

- `en-US-GuyNeural` (warm male)
- `en-GB-RyanNeural` (British male)
- `en-US-JennyNeural` (clear, neutral)

See [edge-tts voice list](https://github.com/rany2/edge-tts) for 100+ options across languages.

## Troubleshooting

### Bot doesn't respond

```bash
opengriffin doctor
```

Check: is the token set? Is the provider configured? Is the bot process running?

### "Unauthorized message from..."

Your `TELEGRAM_ALLOWED_USERS` doesn't include the user id messaging the bot. Either add their id (comma-separated) or leave the variable empty for open access.

### "Conflict: terminated by other getUpdates request"

Another instance of your bot is also polling. Either kill the duplicate or rotate the token via `/revoke` in BotFather.

### Bot replies but messages disappear

Check if you have the SDK call running with a session that was reset. The `/sessions` command shows what's archived. `/topics` shows current topic state.

### Webhook conflicts

OpenGriffin uses long-polling, not webhooks. If you have a webhook configured (from a previous bot setup), the bot's startup auto-deletes it. Check the log for `deleteWebhook` returning OK.

## Group chats

If you add the bot to a group:

- Default privacy mode (`/setprivacy = Enable`): bot only sees messages mentioning it (`@yourbot`) or replying to its messages
- Privacy disabled: bot sees every message in the group

Group conversations get their own `chat_id` and thus their own session, topic, memory namespace. The bot answers in-line.
