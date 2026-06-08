"""Render a nightly journal entry into a shareable, screenshot-able card.

The daily self-improvement loop (`self_improve.py`) writes a markdown entry to
``JOURNAL.md`` every night. That entry is the most *shareable* thing OpenGriffin
produces — "here's what my agent learned about me while I slept" is a story; a
feature list is not. This module turns one entry into a branded portrait card
(SVG, optionally rasterised to PNG) in the project's orange/amber-on-OLED look,
sized 1080×1350 for social.

Zero new dependencies: the SVG is built by hand and PNG conversion shells out to
whatever rasteriser is already on the machine (macOS ``sips``, ``rsvg-convert``,
``cairosvg``, or ``inkscape``). If none is present you still get the SVG, which
screenshots fine from any browser.

CLI: ``griffin card`` (see ``cli.py``).
"""

from __future__ import annotations

import datetime as dt
import re
import shutil
import subprocess
import textwrap
from pathlib import Path
from xml.sax.saxutils import escape

from . import paths

# --- card geometry / palette ---

WIDTH = 1080
MARGIN = 80
CONTENT_W = WIDTH - 2 * MARGIN

BG_OUTER = "#0a0a0a"
BG_GLOW = "#1f1003"
ACCENT_FROM = "#fbbf24"  # amber
ACCENT_TO = "#f97316"  # orange
WHITE = "#ffffff"
SUBTLE = "#cbd5e1"
MUTED = "#94a3b8"

REPO_URL = "github.com/ManasaEdavalli-TharunSure/opengriffin"

# The griffin glyph, lifted from assets/social-card.svg (same path data).
GLYPH_PATH = (
    "M40 0 L8 16 v22 c0 18 12 33 30 38 18-5 30-20 30-38 V16 Z M40 24 l11 7 v11 l-11 7 -11-7 V31 Z"
)

_SECTION_RE = re.compile(r"^\*\*(?P<label>[^:*]+):\*\*\s*(?P<value>.*)$")


# --- parsing ---


def parse_entry(md: str) -> dict:
    """Parse one journal entry (a single ``## <date>`` block) into a dict.

    Returns ``{"date": str, "sections": {label_lower: value}}``. Section values
    may span multiple lines (joined with spaces); list-style sections keep their
    line breaks collapsed to a single string — callers wrap as needed.
    """
    date = ""
    sections: dict[str, str] = {}
    current: str | None = None
    for raw in md.splitlines():
        line = raw.rstrip()
        if line.startswith("## "):
            date = line[3:].strip()
            continue
        m = _SECTION_RE.match(line.strip())
        if m:
            current = m.group("label").strip().lower()
            sections[current] = m.group("value").strip()
        elif current and line.strip():
            sections[current] = (sections[current] + " " + line.strip()).strip()
    return {"date": date, "sections": sections}


def _latest_entry(journal_text: str, date: str | None = None) -> str:
    """Return the markdown for one entry — the given date, or the most recent."""
    parts = journal_text.split("\n## ")
    blocks = []
    for i, p in enumerate(parts):
        block = p if (i == 0 and p.startswith("## ")) else ("## " + p if i > 0 else p)
        if block.lstrip().startswith("## "):
            blocks.append(block.strip())
    if not blocks:
        return ""
    if date:
        for b in blocks:
            if b.lstrip().startswith(f"## {date}"):
                return b
        return ""
    return blocks[-1]


# --- svg building ---


def _wrap(text: str, width: int) -> list[str]:
    out: list[str] = []
    for para in text.split("  "):
        out.extend(textwrap.wrap(para, width=width) or [""])
    return out


def _text(x: int, y: int, s: str, cls: str, anchor: str = "start", extra: str = "") -> str:
    return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}"{extra}>{escape(s)}</text>'


def render_svg(entry: dict, stats: dict | None = None) -> str:
    """Render a parsed entry to an SVG string. Height grows with content."""
    sec = entry.get("sections", {})
    date = entry.get("date") or dt.date.today().isoformat()

    recap = sec.get("recap", "").strip()
    skills = sec.get("suggested skills", "").strip()
    failures = sec.get("failures", "").strip()
    memory = sec.get("memory", "").strip()

    body: list[str] = []
    y = 330  # below the header + title block (title baseline is 232, 60px tall)

    # --- recap (the hero body) ---
    if recap:
        for ln in _wrap(recap, 46)[:8]:
            body.append(_text(MARGIN, y, ln, "body"))
            y += 50
        y += 24

    # --- labelled highlights ---
    def block(label: str, value: str, wrap_w: int = 60, max_lines: int = 3) -> None:
        nonlocal y
        if not value or value.lower() in {"none", "no new entries.", "—"}:
            return
        body.append(_text(MARGIN, y, label.upper(), "label"))
        y += 38
        for ln in _wrap(value, wrap_w)[:max_lines]:
            body.append(_text(MARGIN, y, ln, "small"))
            y += 34
        y += 22

    block("✦ Skills it proposed", skills)
    block("⚠ Failures it caught", failures)
    block("◆ Memory it updated", memory)

    # --- stat chips ---
    if stats and stats.get("runs"):
        chips = [
            (str(stats.get("runs", 0)), "turns"),
            (f"${stats.get('cost_usd', 0):.2f}", "spent"),
            (f"{(stats.get('output_tokens', 0) // 1000)}k", "tokens out"),
        ]
        cx = MARGIN
        chip_y = y + 10
        for num, lab in chips:
            body.append(_text(cx, chip_y + 44, num, "stat-num"))
            body.append(_text(cx, chip_y + 78, lab, "stat-lab"))
            cx += 300
        y = chip_y + 120

    height = max(1350, y + 150)
    footer_y = height - 80

    parts = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{WIDTH}" height="{height}" '
        f'viewBox="0 0 {WIDTH} {height}">',
        "  <defs>",
        '    <radialGradient id="bg" cx="0.5" cy="0.0" r="1.1">',
        f'      <stop offset="0%" stop-color="{BG_GLOW}"/>',
        f'      <stop offset="55%" stop-color="{BG_OUTER}"/>',
        "    </radialGradient>",
        '    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">',
        f'      <stop offset="0%" stop-color="{ACCENT_FROM}"/>',
        f'      <stop offset="100%" stop-color="{ACCENT_TO}"/>',
        "    </linearGradient>",
        '    <filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/>'
        '<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>',
        "    <style>",
        '      .wm   { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        " font-weight: 700; font-size: 34px; fill: #ffffff; }",
        f'      .tag  {{ font-family: "SF Mono", Menlo, monospace; font-weight: 500;'
        f" font-size: 20px; fill: {MUTED}; }}",
        f'      .meta {{ font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        f" font-weight: 600; font-size: 22px; fill: {ACCENT_FROM};"
        " letter-spacing: 0.16em; }",
        '      .ti   { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        " font-weight: 700; font-size: 60px; fill: #ffffff; }",
        f'      .body {{ font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        f" font-weight: 400; font-size: 36px; fill: {SUBTLE}; }}",
        f'      .label {{ font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        f" font-weight: 700; font-size: 22px; fill: {ACCENT_FROM};"
        " letter-spacing: 0.08em; }",
        f'      .small {{ font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        f" font-weight: 400; font-size: 26px; fill: {MUTED}; }}",
        '      .stat-num { font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        " font-weight: 700; font-size: 52px; fill: url(#accent); }",
        f'      .stat-lab {{ font-family: -apple-system, "Helvetica Neue", Arial, sans-serif;'
        f" font-weight: 500; font-size: 20px; fill: {MUTED};"
        " letter-spacing: 0.06em; }",
        "    </style>",
        "  </defs>",
        f'  <rect width="{WIDTH}" height="{height}" fill="url(#bg)"/>',
        # header: glyph + wordmark + url
        f'  <g transform="translate({MARGIN},70) scale(0.62)" filter="url(#glow)">'
        f'<path d="{GLYPH_PATH}" fill="url(#accent)"/></g>',
        _text(MARGIN + 66, 112, "OpenGriffin", "wm"),
        _text(WIDTH - MARGIN, 112, "opengriffin.com", "tag", anchor="end"),
        # meta + title
        _text(MARGIN, 175, f"✦ NIGHTLY JOURNAL · {date}", "meta"),
        _text(MARGIN, 232, "While you slept.", "ti"),
    ]
    parts.extend("  " + b for b in body)
    parts.append(
        _text(MARGIN, footer_y, "OpenGriffin — the agent that learns while you sleep", "tag")
    )
    parts.append(_text(WIDTH - MARGIN, footer_y, REPO_URL, "tag", anchor="end"))
    parts.append("</svg>")
    return "\n".join(parts) + "\n"


# --- png rasterisation (best-effort, uses whatever is installed) ---


def _to_png(svg_path: Path, png_path: Path) -> bool:
    """Try to rasterise SVG→PNG with any available system tool. Best-effort."""
    attempts: list[list[str]] = []
    if shutil.which("rsvg-convert"):
        attempts.append(["rsvg-convert", "-o", str(png_path), str(svg_path)])
    if shutil.which("cairosvg"):
        attempts.append(["cairosvg", str(svg_path), "-o", str(png_path)])
    if shutil.which("inkscape"):
        attempts.append(["inkscape", str(svg_path), "--export-filename", str(png_path)])
    if shutil.which("sips"):
        attempts.append(["sips", "-s", "format", "png", str(svg_path), "--out", str(png_path)])
    for cmd in attempts:
        try:
            subprocess.run(cmd, check=True, capture_output=True, timeout=60)
            if png_path.is_file():
                return True
        except Exception:
            continue
    return False


# --- public entrypoint ---


def make_card(
    date: str | None = None,
    output: str | None = None,
    png: bool = False,
    journal_text: str | None = None,
    stats: dict | None = None,
) -> dict:
    """Build a journal card. Returns ``{"svg": path, "png": path|None, "date": str}``.

    ``journal_text`` / ``stats`` are injectable for testing; in normal use they're
    read from ``JOURNAL.md`` and the self-improvement usage stats.
    """
    if journal_text is None:
        # Read the same journal `griffin journal` shows (self_improve owns it).
        from .self_improve import JOURNAL_FILE

        journal_text = JOURNAL_FILE.read_text() if JOURNAL_FILE.is_file() else ""

    block = _latest_entry(journal_text, date)
    if not block:
        raise ValueError(
            f"no journal entry found for {date!r}"
            if date
            else "journal is empty — run `griffin improve` first"
        )

    entry = parse_entry(block)
    if stats is None:
        try:
            from .self_improve import yesterday_stats

            stats = yesterday_stats()
        except Exception:
            stats = None

    svg = render_svg(entry, stats)

    out = Path(output).expanduser() if output else (paths.MEM_DIR / f"card-{entry['date']}.svg")
    out = out.with_suffix(".svg")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(svg)

    png_path: Path | None = None
    if png:
        candidate = out.with_suffix(".png")
        if _to_png(out, candidate):
            png_path = candidate

    return {"svg": str(out), "png": str(png_path) if png_path else None, "date": entry["date"]}
