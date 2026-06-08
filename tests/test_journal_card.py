"""Tests for the shareable journal-card renderer."""

from __future__ import annotations

from opengriffin import journal_card

SAMPLE = """\
## 2026-05-06

**Recap:** Drafted my own README, JOURNEY.md, and the dashboard server module. \
Three kanban tasks created, executed, completed in 5m 5s wall clock.

**Memory:** No new entries — driver ran in containment mode.

**Failures:** Initial run overwrote artifact files. Fixed driver to require RAW content.

**Suggested skills:** none

**Stalled kanban:** none

**Notes:** The bot wrote itself.
"""

MULTI = """\
# Bot Daily Journal

## 2026-05-05
**Recap:** Older entry.

## 2026-05-06
**Recap:** Newer entry recap.
**Suggested skills:** morning-briefing
"""


def test_parse_entry_extracts_date_and_sections():
    e = journal_card.parse_entry(SAMPLE)
    assert e["date"] == "2026-05-06"
    assert "Drafted my own README" in e["sections"]["recap"]
    assert e["sections"]["suggested skills"] == "none"
    assert "RAW content" in e["sections"]["failures"]


def test_parse_entry_multiline_recap_joins():
    e = journal_card.parse_entry(SAMPLE)
    # The recap spans two source lines; they should be joined into one value.
    assert "wall clock" in e["sections"]["recap"]
    assert "\n" not in e["sections"]["recap"]


def test_render_svg_is_wellformed_and_branded():
    e = journal_card.parse_entry(SAMPLE)
    svg = journal_card.render_svg(e)
    assert svg.startswith("<?xml")
    assert svg.rstrip().endswith("</svg>")
    # palette + brand present
    assert "#f97316" in svg and "#fbbf24" in svg
    assert "OpenGriffin" in svg
    assert "2026-05-06" in svg
    # recap text made it in (XML-escaped, so check a clean substring)
    assert "Drafted my own README" in svg


def test_render_svg_escapes_xml():
    e = {"date": "2026-01-01", "sections": {"recap": "tools <write> & <read> a > b"}}
    svg = journal_card.render_svg(e)
    assert "&lt;write&gt;" in svg
    assert "&amp;" in svg
    assert "<write>" not in svg  # raw angle brackets must not leak into markup


def test_render_svg_includes_stat_chips_when_stats_present():
    e = journal_card.parse_entry(SAMPLE)
    stats = {"runs": 12, "cost_usd": 0.34, "output_tokens": 45000}
    svg = journal_card.render_svg(e, stats)
    assert "12" in svg
    assert "$0.34" in svg
    assert "45k" in svg


def test_make_card_writes_svg(tmp_path):
    out = tmp_path / "card.svg"
    res = journal_card.make_card(output=str(out), journal_text=MULTI, stats={"runs": 0})
    assert res["date"] == "2026-05-06"  # picks the latest entry
    assert out.is_file()
    assert "Newer entry recap" in out.read_text()
    assert res["png"] is None  # png not requested


def test_make_card_specific_date(tmp_path):
    out = tmp_path / "card.svg"
    res = journal_card.make_card(date="2026-05-05", output=str(out), journal_text=MULTI)
    assert res["date"] == "2026-05-05"
    assert "Older entry" in out.read_text()


def test_make_card_empty_journal_raises(tmp_path):
    out = tmp_path / "card.svg"
    try:
        journal_card.make_card(output=str(out), journal_text="")
    except ValueError as e:
        assert "empty" in str(e)
    else:  # pragma: no cover
        raise AssertionError("expected ValueError on empty journal")
