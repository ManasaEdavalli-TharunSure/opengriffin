#!/usr/bin/env bash
# OpenGriffin one-line install — BYO compute.
# Usage:  curl -fsSL https://raw.githubusercontent.com/ManasaEdavalli-TharunSure/opengriffin/main/scripts/install.sh | bash

set -euo pipefail

INSTALL_DIR="${OPENGRIFFIN_HOME:-$HOME/opengriffin}"
PY_MIN_MAJOR=3
PY_MIN_MINOR=11

echo "🦅  OpenGriffin installer"
echo

# 1. Find a Python ≥ 3.11 anywhere on PATH.
find_python() {
    for candidate in python3.13 python3.12 python3.11 python3 python; do
        if command -v "$candidate" >/dev/null 2>&1; then
            local ver
            ver=$("$candidate" -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")' 2>/dev/null || echo "0.0")
            local major minor
            major=$(echo "$ver" | cut -d. -f1)
            minor=$(echo "$ver" | cut -d. -f2)
            if [ "${major:-0}" -gt "$PY_MIN_MAJOR" ] || \
               { [ "${major:-0}" -eq "$PY_MIN_MAJOR" ] && [ "${minor:-0}" -ge "$PY_MIN_MINOR" ]; }; then
                echo "$candidate"
                return 0
            fi
        fi
    done
    return 1
}

PY=""
if PY=$(find_python); then
    PY_VER=$("$PY" -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")')
    echo "✓ Found Python $PY_VER at $(command -v "$PY")"
else
    # No suitable Python — try uv to fetch one.
    if command -v uv >/dev/null 2>&1; then
        echo "ℹ  No Python ${PY_MIN_MAJOR}.${PY_MIN_MINOR}+ on PATH; uv will fetch one"
    else
        echo "✗ Need Python ${PY_MIN_MAJOR}.${PY_MIN_MINOR}+. Either install it (https://www.python.org/downloads/)"
        echo "  or install uv first (https://docs.astral.sh/uv/getting-started/installation/) and rerun."
        exit 1
    fi
fi

# 2. Prefer uv (handles its own Python).
if command -v uv >/dev/null 2>&1; then
    echo "✓ uv detected — using uv for venv + install"
    INSTALLER="uv"
else
    echo "ℹ  uv not found; using pip + venv (uv is faster — install from https://docs.astral.sh/uv/)"
    INSTALLER="pip"
fi

# 3. Clone or update.
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "ℹ  $INSTALL_DIR exists; pulling latest"
    git -C "$INSTALL_DIR" pull --ff-only
else
    echo "→ Cloning into $INSTALL_DIR"
    git clone https://github.com/ManasaEdavalli-TharunSure/opengriffin.git "$INSTALL_DIR"
fi

# 4. Install.
cd "$INSTALL_DIR"
if [ "$INSTALLER" = "uv" ]; then
    uv venv --python "${PY_MIN_MAJOR}.${PY_MIN_MINOR}" .venv 2>&1 | tail -1 || true
    uv pip install -e . --python ".venv/bin/python"
else
    "$PY" -m venv .venv
    ./.venv/bin/pip install --upgrade pip
    ./.venv/bin/pip install -e .
fi
echo "✓ Installed core (run with .venv/bin/opengriffin)"

# 5. .env.
if [ ! -f "$INSTALL_DIR/.env" ]; then
    cp "$INSTALL_DIR/.env.example" "$INSTALL_DIR/.env"
    echo "→ Created $INSTALL_DIR/.env from template — edit it with your keys"
fi

# 6. Bundled skills → ~/.claude/skills.
mkdir -p "$HOME/.claude/skills"
copied=0
for d in "$INSTALL_DIR/bundled_skills"/*/; do
    name=$(basename "$d")
    if [ ! -d "$HOME/.claude/skills/$name" ]; then
        cp -R "$d" "$HOME/.claude/skills/$name"
        copied=$((copied+1))
    fi
done
echo "✓ Skills bundled into ~/.claude/skills/  (added $copied new)"

# 7. Verify install.
echo
echo "→ Running doctor…"
"$INSTALL_DIR/.venv/bin/opengriffin" doctor || true

# 8. Next steps.
cat <<EOF

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✓ OpenGriffin installed at $INSTALL_DIR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Next:

  1. Edit your config:
       \$EDITOR $INSTALL_DIR/.env

  2. (Pick at least one) Add a provider key:
       ANTHROPIC_API_KEY=sk-ant-...      # for Claude API
       OPENAI_API_KEY=sk-...             # for GPT
       GEMINI_API_KEY=...                # for Gemini
       (… see .env.example for 21 providers)

  3. (Pick at least one) Configure a gateway:
       TELEGRAM_BOT_TOKEN=...            # message @BotFather to create one
       DISCORD_BOT_TOKEN=...             # discord.com/developers/applications
       SLACK_BOT_TOKEN=... + SLACK_APP_TOKEN=...

  4. Run:
       cd $INSTALL_DIR && .venv/bin/opengriffin run
       # or  .venv/bin/opengriffin doctor   to check the setup

  5. Optional — start at boot:
       Linux: sudo cp scripts/opengriffin.service /etc/systemd/system/
       macOS: cp scripts/opengriffin.plist ~/Library/LaunchAgents/

Docs:  https://opengriffin.com/docs
Repo:  https://github.com/ManasaEdavalli-TharunSure/opengriffin
EOF
