---
name: systematic-debugging
description: Use when a bug, test failure, or unexpected behavior is reported and the cause is not obvious. Forces a hypothesis-driven debugging loop instead of random patching.
license: Apache-2.0
author: OpenGriffin
---

# Systematic debugging

Random patches waste time and create new bugs. Always find the root cause before proposing a fix.

## The four-phase loop

### Phase 1 — Reproduce
- Get the exact failing input. Don't theorize without a reproducer.
- Capture the failing output verbatim.
- Note environment: OS, version, deps, recent changes.
- If you can't reproduce it locally, ask for the steps that triggered it and stop.

### Phase 2 — Hypothesize
- List candidate causes ranked by prior probability.
- For each, write the prediction it would make: "if it's X, then Y should fail / Z should hold."
- Discard hypotheses that contradict observed behavior.

### Phase 3 — Test
- Run the cheapest experiment that distinguishes between top hypotheses (often a `print`, a `grep`, or a one-line assertion).
- Don't change behavior — observe it.
- Update the hypothesis ranking based on results.

### Phase 4 — Fix
- Only fix once you can name the root cause in one sentence.
- Write a regression test that fails before the fix and passes after.
- Verify nothing else regressed.

## Anti-patterns

- "Try adding a try/except and see" — that's hiding bugs, not fixing them.
- Editing config or restarting services hoping it goes away.
- Multi-change "let's try this" patches without an experiment design.
- Skipping the regression test because "it's a small fix".
