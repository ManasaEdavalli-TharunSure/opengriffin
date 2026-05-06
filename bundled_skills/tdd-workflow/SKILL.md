---
name: tdd-workflow
description: Use when implementing a new feature or fixing a bug — enforces red-green-refactor cycle.
license: Apache-2.0
author: OpenGriffin
---

# Test-driven development

Always write a failing test FIRST, then the minimum code to make it pass, then refactor.

## The cycle

1. **RED** — Write a single failing test. Run it. See it fail. If it doesn't fail, the test is wrong.
2. **GREEN** — Write the smallest amount of code that makes the test pass. Don't generalize yet.
3. **REFACTOR** — With tests green, clean up: extract names, remove duplication, improve readability. Tests stay green throughout.

## Rules

- One assertion per test, ideally. Multiple assertions per test = harder to localize the failure.
- Test the **behavior**, not the implementation. If the implementation changes but behavior stays the same, the test should still pass.
- Don't write production code without a failing test for it. If you're tempted, the test you should have written is the one that would catch the case you're worried about.
- Run the full test suite before each commit. If anything is red, you can't commit.

## When NOT to use TDD

- Throwaway exploration / spikes (use the `spike` skill).
- UI tweaks where the test would be more code than the change.
- Migrations or one-shot scripts.
