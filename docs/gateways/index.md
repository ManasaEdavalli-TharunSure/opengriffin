# Gateways

OpenGriffin runs the same brain across 7 free-pricing platforms. Each gateway normalizes platform events into a single `Message` shape.

| Platform | Setup difficulty | Status | Doc |
|---|---|---|---|
| Telegram | ⭐ easy | canonical | [telegram.md](telegram.md) |
| Discord | ⭐ easy | full features | [discord.md](discord.md) |
| Slack | ⭐⭐ medium | full features | [slack.md](slack.md) |
| Email (IMAP/SMTP) | ⭐⭐ medium | poll-based, async | [email.md](email.md) |
| iMessage (macOS) | ⭐⭐ medium | macOS only | [imessage.md](imessage.md) |
| Signal | ⭐⭐⭐ hard | requires signal-cli + Java | [signal.md](signal.md) |
| Matrix | ⭐⭐ medium | works with any homeserver | [matrix.md](matrix.md) |

## Architecture

Each gateway is a Python module under `src/opengriffin/gateways/` implementing the `Gateway` protocol:

```python
class Gateway(Protocol):
    name: str
    async def start(self, handler: Handler) -> None: ...
    async def stop(self) -> None: ...
```

`handler` is a callback that takes a normalized `Message` and returns a `Reply`:

```python
@dataclass
class Message:
    platform: str           # "telegram" | "discord" | ...
    user_id: str            # platform-specific stable id
    user_handle: str        # display name
    chat_id: str            # platform-specific channel/DM id
    text: str               # message body
    voice_bytes: bytes | None
    is_dm: bool
    raw: object             # original event for adapters that need it

@dataclass
class Reply:
    text: str
    media_paths: list[str]
```

The bot's main message loop owns the brain (memory, skills, providers); gateways are purely platform plumbing.

## Running multiple gateways

You can enable any combination by setting their env vars in `.env`. The bot starts every gateway whose required env is present. They run in the same asyncio event loop, share one MCP server set, one memory directory.

## Cross-platform identity

If you message the bot from Telegram AND Discord with separate platform IDs, by default they're separate users. Link them via:

```
mcp__identity__identity_create handle=alice
mcp__identity__identity_link_code handle=alice            # → 6-char code
# Send the code from a NEW platform; it's consumed and that platform_id links to alice
mcp__identity__identity_list                               # shows all linkages
```

Once linked, both platforms share `MEMORY.md`, `USER.md`, `SOUL.md`, kanban, and Echo Memory.

## Adding a new gateway

See [CONTRIBUTING.md](../../CONTRIBUTING.md#adding-a-new-gateway). The pattern is well-trodden — telegram.py is the canonical reference.

## Why these 7 (and not WhatsApp, SMS, Teams)

Free-pricing only. WhatsApp Business API is paid (~$0.005-0.05 per message via Meta or Twilio). SMS via Twilio is paid. Microsoft Teams requires Azure infrastructure. We may add them later as opt-in extras, but the OSS Core stays free-to-run.
