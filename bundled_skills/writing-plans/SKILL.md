---
name: writing-plans
description: Use when the user has a multi-step engineering task and wants a written plan before any code is touched. Produces a structured implementation plan in plan.md.
license: Apache-2.0
author: OpenGriffin
---

# Writing implementation plans

When you accept a non-trivial coding task — anything that touches more than two files or could plausibly take more than an hour — write a plan first. Read the existing code, then write `plan.md` in the project root with this structure:

## Required sections

1. **Goal** — one sentence describing the desired end state.
2. **Constraints** — what must NOT change, performance budgets, deprecation rules.
3. **Steps** — ordered list of bite-sized changes, each independently verifiable.
4. **Verification** — how each step is confirmed (tests, type checks, manual smoke).
5. **Open questions** — assumptions you made; flag for the user to confirm.

## Rules

- Each step should be 5–30 minutes of work for a competent engineer.
- Cite specific file paths and line numbers in steps.
- Don't bundle steps. If two changes can fail independently, list them independently.
- Open questions go AT THE END so the plan reads top-to-bottom without disclaimers.
- After writing, ask the user to confirm or revise the plan before starting work.

## Anti-patterns

- "Refactor X" without specific file paths and target shape.
- Steps that say "if needed" — decide first, write the plan after.
- Inline TODO comments instead of structured open questions.

When the user later tells you to execute, follow the plan step-by-step, marking each one done as you go.
