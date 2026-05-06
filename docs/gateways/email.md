# Email

IMAP polling for inbound, SMTP for outbound. Stdlib only — no extra deps.

## Setup

You need credentials for an IMAP + SMTP server. Most email providers work; for Gmail/Workspace you'll need an **App Password** (not your account password) due to 2FA.

### Gmail / Google Workspace

1. https://myaccount.google.com/security → enable 2FA if not already
2. https://myaccount.google.com/apppasswords → create an "App password" for Mail
3. Use the 16-character app password as `EMAIL_IMAP_PASS` / `EMAIL_SMTP_PASS`

### iCloud Mail

Same flow — use https://account.apple.com/account/manage → Sign-In and Security → App-Specific Passwords.

### Anything else

Most providers expose IMAP at port 993 (SSL) and SMTP at port 587 (STARTTLS).

## Configure `.env`

```bash
EMAIL_IMAP_HOST=imap.gmail.com
EMAIL_IMAP_PORT=993
EMAIL_IMAP_USER=you@example.com
EMAIL_IMAP_PASS=app-password-here

EMAIL_SMTP_HOST=smtp.gmail.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=you@example.com         # defaults to IMAP_USER if blank
EMAIL_SMTP_PASS=app-password-here       # defaults to IMAP_PASS if blank

EMAIL_FROM_ADDR=you@example.com
EMAIL_ALLOWED_SENDERS=trusted@example.com,boss@example.com
```

## Run

```bash
opengriffin run
```

The gateway polls IMAP every 60 seconds. Send the bot an email; it replies inline (preserving the message-id chain so threading works in your client).

## Workflow style

Email is async — perfect for:

- "Hey bot, here's a 30-page PDF, summarize it" (attachment handling tbd)
- Long-form requests where you want a thoughtful response, not chat
- Workflows that originate from external systems (Zapier, Make.com, etc.) emailing the bot

## Caveats

- Polling is 60s by default (no IMAP IDLE in stdlib). For sub-second response, use the Telegram or Discord gateways.
- The gateway only processes messages from senders in `EMAIL_ALLOWED_SENDERS`. Leave empty to disable filtering.
- HTML email bodies are stripped to plain text. Multipart messages take the `text/plain` part if available.
- Subject and body are concatenated into the prompt: `Subject: ...\n\n<body>`.

## Troubleshooting

- **Authentication failed**: confirm app-specific password (not account password) for Gmail/iCloud
- **Bot replies but in spam**: check SMTP `From` address matches a verified domain; SPF/DKIM may flag
- **No replies from bot**: check `EMAIL_ALLOWED_SENDERS` includes your sender address (case-insensitive)
- **TLS errors**: try port 465 (implicit TLS) instead of 587 (STARTTLS)
