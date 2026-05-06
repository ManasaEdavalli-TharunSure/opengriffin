# Slack

Uses Slack Bolt's **Socket Mode** — no public webhook URL needed. Free for any Slack workspace where you can install apps.

## Setup

1. Go to https://api.slack.com/apps → **Create New App** → from scratch
2. **Socket Mode** → Enable → Generate App-Level Token with `connections:write` scope. Save token (`xapp-...`)
3. **OAuth & Permissions** → Bot Token Scopes:
   - `chat:write`
   - `im:history`, `im:read`, `im:write`
   - `channels:history`, `channels:read`
   - `app_mentions:read`
4. **Event Subscriptions** → Enable → Subscribe to bot events: `message.im`, `app_mention`
5. **Install App to Workspace** → copy the bot token (`xoxb-...`)

## Configure `.env`

```bash
SLACK_BOT_TOKEN=xoxb-...
SLACK_APP_TOKEN=xapp-...
SLACK_ALLOWED_USERS=                    # comma-separated Slack user ids; empty = open to workspace
```

## Install + run

```bash
pip install 'opengriffin[slack]'
opengriffin run
```

DM the bot or @-mention it in any channel where it's been added.

## Notes

- Slack message limit: 40,000 chars (effectively no limit for chat replies)
- Socket Mode means your bot runs locally; no public URL needed
- Threading: replies stay in the thread context they came from
- For Enterprise Grid: you may need to install per-workspace
