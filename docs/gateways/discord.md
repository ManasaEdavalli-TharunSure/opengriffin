# Discord

## Setup

1. Go to https://discord.com/developers/applications → **New Application**
2. **Bot** tab → **Reset Token** → copy
3. Enable **Message Content Intent** (Privileged Gateway Intents)
4. **OAuth2 → URL Generator** → scopes: `bot`, `applications.commands`; permissions: `Send Messages`, `Read Message History`, `Use Slash Commands`
5. Open the generated URL → invite the bot to your server
6. Find your Discord user id: enable Developer Mode (User Settings → Advanced), right-click your name → Copy User ID

## Configure `.env`

```bash
DISCORD_BOT_TOKEN=                      # from step 2
DISCORD_ALLOWED_USERS=                  # comma-separated numeric user ids
```

## Install + run

```bash
pip install 'opengriffin[discord]'      # pulls discord.py
opengriffin run
```

DM your bot, or @-mention it in a channel.

## Limitations

- Discord caps messages at 2000 chars; OpenGriffin auto-splits longer replies
- File attachments work for the agent's outputs (e.g. `MEDIA:/path/to/file.png` in a reply)
- Voice channels are not yet supported (text-only DMs and channels)
- Slash commands are not yet wired — use plain text and @-mentions

## Troubleshooting

If the bot connects but doesn't respond to messages, the most common cause is the **Message Content Intent** isn't enabled. Recheck step 3.
