# Matrix

Works with any Matrix homeserver: matrix.org (free public), self-hosted Synapse, Beeper, Element Server Suite, etc.

## Setup

### 1. Create a bot account

Easiest: register at https://element.io with a fresh username for the bot (e.g. `mybot:matrix.org`).

For self-hosted Synapse, use the admin API or `register_new_matrix_user`.

### 2. (Optional) Get an access token instead of password

Element → Settings → Help & About → Advanced → Access Token. Or use the API directly:

```bash
curl -X POST https://matrix.org/_matrix/client/v3/login \
  -H 'Content-Type: application/json' \
  -d '{"type":"m.login.password","user":"mybot","password":"..."}'
```

The response contains `access_token`. Storing it instead of the password avoids re-login.

## Configure `.env`

```bash
MATRIX_HOMESERVER=https://matrix.org
MATRIX_USER_ID=@mybot:matrix.org
MATRIX_PASSWORD=                                # OR set MATRIX_ACCESS_TOKEN
MATRIX_ACCESS_TOKEN=
MATRIX_ALLOWED_USERS=@you:matrix.org,@boss:matrix.org
```

## Install + run

```bash
pip install 'opengriffin[matrix]'              # pulls matrix-nio[e2e]
opengriffin run
```

Open a DM with `@mybot:matrix.org` and message it.

## End-to-end encryption

The `matrix-nio[e2e]` extra includes Olm/Megolm for E2E. The bot's first message in a new room sends a key request; once exchanged, all messages are encrypted to the bot's device.

For E2E to work cleanly:
- The bot's device must be **verified** (the first time you DM the bot, click verify in Element)
- Or accept unverified sessions in your client settings

If you don't need E2E, install plain `matrix-nio` (without `[e2e]`) and the bot reads/writes plaintext rooms.

## Notes

- Matrix is federated: the homeserver in your handle (`@mybot:**matrix.org**`) determines where the bot logs in. Other users can be from any server (`@friend:gnome.org` works fine).
- Bridges (Telegram, Discord, Signal, WhatsApp via mautrix) work — your bot can be in a Matrix room that's bridged to those platforms.
- Sync is via `client.sync_forever`; the bot stays connected as long as the process runs.

## Troubleshooting

- **"M_FORBIDDEN: Invalid password"**: confirm `MATRIX_PASSWORD` exactly. Some clients store hashed; you need the raw login password.
- **Bot connects but doesn't reply**: check `MATRIX_ALLOWED_USERS` includes the sender's full Matrix handle. Empty allowed list = open access.
- **E2E "unable to decrypt"**: the bot's device isn't verified yet. From Element, verify the bot device or accept unverified.
- **Sync timeouts**: increase the sync timeout in `gateways/matrix.py` (default 30s).
