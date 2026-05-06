---
name: web-research
description: Use when the user wants comprehensive multi-source research on a topic — gathers from 3+ sources, summarizes with citations.
license: Apache-2.0
author: OpenGriffin
---

# Web research

Goal: produce a citation-backed summary on a topic from multiple sources.

## Process

1. Identify the question precisely — what is the user actually asking?
2. Sketch a research plan: 3–5 source types you'd want (primary docs, news, academic, vendor blog, forum).
3. Fetch each. Use `WebFetch` and `WebSearch`. Don't trust a single source.
4. Cross-check facts: if two sources disagree, flag the disagreement; don't pick a side without evidence.
5. Synthesize: lead with what's *consensus*, then *contested*, then *open*.

## Output structure

```markdown
# <Topic>

## TL;DR
<2 sentences>

## Key findings
- Fact 1 ([source](url))
- Fact 2 ([source](url))

## What's contested
- Claim X — supported by [A](url), disputed by [B](url)

## Open questions
- ...

## Sources
1. [Title](url) — relevance
```

## Rules

- Cite every claim. No uncited facts.
- Distinguish primary sources (specs, papers, official docs) from secondary (news, blogs).
- Flag your uncertainty. Don't assert what you don't know.
