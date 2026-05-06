# iMessage

macOS only. Reads the local Messages.app SQLite database directly; sends via AppleScript.

## Setup

### 1. Grant Full Disk Access

System Settings → Privacy & Security → Full Disk Access → add your terminal application (Terminal.app, iTerm, or whatever shell you launch the bot from). Without this, the bot can't read `~/Library/Messages/chat.db`.

### 2. Get the Apple IDs / phone numbers you'll allow

Open Messages.app, open a conversation with someone you want the bot to respond to. The handle (in the address bar) is what you'll add. Format: `+15551234567` or `you@example.com`.

## Configure `.env`

```bash
IMESSAGE_ALLOWED_HANDLES=+15551234567,boss@example.com
IMESSAGE_DB_PATH=                               # default ~/Library/Messages/chat.db
```

`IMESSAGE_ALLOWED_HANDLES` is **required** — there's no "open" mode for iMessage because misuse is too easy.

## Run

```bash
opengriffin run
```

The gateway polls the chat.db every 3 seconds. Send the bot an iMessage from one of the allowed handles; it replies via AppleScript through Messages.app (so replies appear as if they came from your iMessage account).

## Notes

- macOS only. WSL / Linux / Windows: not supported.
- The bot runs as your user, sending iMessages from your account. Use only with handles you trust.
- iMessage doesn't support inline buttons, so the approval flow falls back to text confirmation.
- Group chats are not yet supported — only DMs.

## Optional: imsg CLI

Some users prefer the `imsg` CLI (https://github.com/steipete/imsg) for sending. The bot uses AppleScript by default (no extra install), but `imsg` is a friendlier interface for hand-testing.

```bash
brew install steipete/tap/imsg
echo "test" | imsg send +15551234567
```

## Troubleshooting

- **"chat.db not found"**: your terminal lacks Full Disk Access. Re-add and **restart the terminal session** (the permission isn't picked up by an already-running process).
- **Replies fail silently**: AppleScript automation may need permission. System Settings → Privacy → Automation → grant your terminal access to Messages.app.
- **Polling too slow**: default 3s is a balance between responsiveness and CPU. Drop to 1s if you have spare cycles.
