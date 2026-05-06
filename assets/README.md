# Brand assets

## Social card (1200×630)

`social-card.svg` — open in any browser, "Save as PNG" or screenshot at 100% zoom for a 1200×630 PNG to upload to GitHub Settings → Social preview.

Or convert from CLI:

```bash
# Using inkscape
inkscape --export-type=png --export-width=1200 --export-height=630 \
  --export-filename=social-card.png assets/social-card.svg

# Using rsvg-convert (brew install librsvg)
rsvg-convert -w 1200 -h 630 assets/social-card.svg -o assets/social-card.png
```

## Logo glyph

The griffin shield in the SVG (top-left corner) is also the favicon-able mark. Extract it as a standalone SVG by copying the `<g transform="translate(80,80)" filter="url(#glow)">…</g>` group with the gradient defs.

## Color palette

| Use | Hex |
|---|---|
| Background top | `#1e1b4b` (indigo-950) |
| Background bottom | `#0a0a0a` (near-black) |
| Accent (primary) | `#7c3aed` (violet-600) |
| Accent (highlight) | `#a78bfa` (violet-400) |
| Body text | `#cbd5e1` (slate-300) |
| Subtle text | `#94a3b8` (slate-400) |

Keep these consistent across landing site, README badges, social card, and any docs imagery.
