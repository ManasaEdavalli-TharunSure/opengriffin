# Signal

Wraps `signal-cli`. Hardest of the gateways — Signal Foundation doesn't ship a public API; signal-cli reverse-engineers the protocol.

## Setup

### 1. Install signal-cli

```bash
brew install signal-cli                         # macOS
# or download release JAR: https://github.com/AsamK/signal-cli/releases
```

Requires Java 21+.

### 2. Register a Signal account

You'll need a phone number that **isn't already on Signal**. Signal allows only one device per number for primary registration, so don't use your existing Signal number unless you're prepared to lose it.

```bash
signal-cli -a +15551234567 register
# SMS verification arrives at +15551234567
signal-cli -a +15551234567 verify <code-from-sms>
```

### 3. Test sending manually

```bash
echo "test" | signal-cli -a +15551234567 send +15555555555
```

If that works, the bot will too.

## Configure `.env`

```bash
SIGNAL_NUMBER=+15551234567                      # the bot's number
SIGNAL_ALLOWED_NUMBERS=+15555555555,+15556666666
```

## Run

```bash
opengriffin run
```

## Caveats

- **signal-cli is JVM-based and slow to start.** First message after a quiet period can lag a few seconds.
- **Group chats are limited.** Some operations (creating groups, adding members) require fresh group state which signal-cli sometimes mis-syncs.
- **Linking to a primary device** is an alternative if you don't want a dedicated number; see signal-cli docs for `signal-cli link`.
- **Disappearing messages**: respected (the bot doesn't break the timer).

## Troubleshooting

- **"User registered too recently"**: Signal rate-limits new registrations. Wait 24h.
- **"Captcha required"**: solve at https://signalcaptchas.org/registration/generate.html and use the resulting URL via `signal-cli register --captcha <url>`
- **JSON parse errors**: signal-cli sometimes outputs partial JSON. The gateway re-spawns the receive subprocess on stream end.
- **Java not found**: install OpenJDK 21+; `brew install openjdk@21` on macOS.

If signal-cli is more pain than it's worth, the **Matrix** gateway is friendlier — Matrix bridges to Signal exist if you want both.
