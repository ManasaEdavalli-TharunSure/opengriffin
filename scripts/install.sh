#!/usr/bin/env bash
# OpenGriffin one-line install — BYO compute.
# Usage:  curl -fsSL https://raw.githubusercontent.com/opengriffin/opengriffin/main/scripts/install.sh | bash

set -euo pipefail

INSTALL_DIR="${OPENGRIFFIN_HOME:-$HOME/opengriffin}"
PY_MIN="3.11"

echo "🦅  OpenGriffin installer"
echo

# 1. Python check
if ! command -v python3 >/dev/null 2>&1; then
    echo "✗ python3 not found. Install Python ${PY_MIN}+ first: https://www.python.org/downloads/"
    exit 1
fi
PY_VER=$(python3 -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")')
PY_MAJ=$(echo "$PY_VER" | cut -d. -f1)
PY_MIN_HAVE=$(echo "$PY_VER" | cut -d. -f2)
if [ "$PY_MAJ" -lt 3 ] || { [ "$PY_MAJ" -eq 3 ] && [ "$PY_MIN_HAVE" -lt 11 ]; }; then
    echo "✗ Python $PY_VER detected. Need ${PY_MIN}+."
    exit 1
fi
echo "✓ Python $PY_VER"

# 2. uv (preferred) or pip
if command -v uv >/dev/null 2>&1; then
    echo "✓ uv detected"
    INSTALLER="uv"
else
    echo "ℹ  uv not found, will use pip (uv is faster — install from https://docs.astral.sh/uv/)"
    INSTALLER="pip"
fi

# 3. Clone or update
if [ -d "$INSTALL_DIR/.git" ]; then
    echo "ℹ  $INSTALL_DIR exists; pulling latest"
    git -C "$INSTALL_DIR" pull
else
    echo "→ Cloning into $INSTALL_DIR"
    git clone https://github.com/opengriffin/opengriffin.git "$INSTALL_DIR"
fi

# 4. Install
cd "$INSTALL_DIR"
if [ "$INSTALLER" = "uv" ]; then
    uv venv --python "$PY_VER" .venv 2>/dev/null || true
    uv pip install -e . --python ".venv/bin/python"
else
    python3 -m venv .venv
    ./.venv/bin/pip install --upgrade pip
    ./.venv/bin/pip install -e .
fi
echo "✓ Installed core (run with .venv/bin/opengriffin)"

# 5. .env
if [ ! -f "$INSTALL_DIR/.env" ]; then
    cp "$INSTALL_DIR/.env.example" "$INSTALL_DIR/.env"
    echo "→ Created $INSTALL_DIR/.env from template — edit it with your keys"
fi

# 6. Bundled skills → ~/.claude/skills
mkdir -p "$HOME/.claude/skills"
for d in "$INSTALL_DIR/bundled_skills"/*/; do
    name=$(basename "$d")
    if [ ! -d "$HOME/.claude/skills/$name" ]; then
        cp -R "$d" "$HOME/.claude/skills/$name"
    fi
done
echo "✓ Skills bundled into ~/.claude/skills/"

# 7. Next steps
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
       (… 18 more options in .env.example)

  3. (Pick at least one) Configure a gateway:
       TELEGRAM_BOT_TOKEN=...            # message @BotFather to create one
       DISCORD_BOT_TOKEN=...             # discord.com/developers/applications
       SLACK_BOT_TOKEN=... + SLACK_APP_TOKEN=...

  4. Run:
       cd $INSTALL_DIR && .venv/bin/opengriffin run
       # or  .venv/bin/opengriffin doctor   to check the setup

  5. Optional — start at boot:
       Linux: cp scripts/opengriffin.service /etc/systemd/system/
       macOS: cp scripts/opengriffin.plist ~/Library/LaunchAgents/

Docs:  https://opengriffin.com/docs
Repo:  https://github.com/opengriffin/opengriffin
EOF
