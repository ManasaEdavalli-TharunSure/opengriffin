---
name: brand-voice
description: Use when the user wants to extract a writing-voice profile from existing samples and apply it to new content.
license: Apache-2.0
author: OpenGriffin
---

# Brand voice extraction

Goal: take samples of someone's writing (essays, posts, docs, marketing) and produce a reusable voice spec that future writing can be checked against.

## Inputs

3–10 representative pieces, ideally:
- One short post (≤300 words)
- One long essay (≥1500 words)
- One transactional piece (announcement, doc, FAQ)
- Diverse topics, same author/brand

## What to extract

1. **Vocabulary**: average sentence length, lexical density, contractions, jargon level (1–5), profanity tolerance, specific recurring phrases.
2. **Cadence**: short-then-long sentence rhythms, paragraph length, use of one-line paragraphs for emphasis.
3. **Stance**: opinionated vs. neutral, hedge frequency, first-person vs. second-person.
4. **Structure**: how the piece opens (anecdote / claim / question), how it closes (CTA / reflection / open question).
5. **Anti-patterns**: phrases the author NEVER uses (e.g., "leverage", "synergy", "unlock value").

## Output spec

Produce a `voice.md` that future writing references:

```markdown
# Voice profile: <name>

**Sentence length**: avg X words, range A-B.
**Tone**: <e.g. dry, technical, warm>.
**Stance**: opinionated; uses "I" freely; rarely hedges.
**Recurring phrases**: "the truth is", "consider that".
**Avoid**: ["unlock", "synergize", "leverage" as verb, em-dash overuse].
**Opening style**: anecdote → claim.
**Closing style**: open question to reader.
```

## Apply

When asked to write in this voice: load `voice.md` into context. After drafting, verify:
- Sentence-length distribution roughly matches.
- No avoided phrases used.
- Opening and closing style align.

If it's clearly off, rewrite — don't ship a half-imitation.
