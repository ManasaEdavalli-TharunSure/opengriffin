---
name: code-review
description: Use when reviewing your own or someone else's code before merge — produces a structured review focused on root causes, not nits.
license: Apache-2.0
author: OpenGriffin
---

# Code review

Reviewing code is about catching bugs, design issues, and maintainability problems before merge — not about formatting (let the linter do that).

## What to look for, in order

1. **Correctness** — does it do what it claims? Trace one happy path and one edge case.
2. **Security** — injection, secrets, auth bypass, SSRF, missing rate limits.
3. **Failure modes** — what happens on network failure, partial writes, concurrent edits, retries?
4. **Performance** — N+1 queries, unnecessary work in hot paths, missing pagination.
5. **API design** — names, defaults, error shapes. Is this the API the *caller* wants?
6. **Testability** — is the code testable in isolation? Are there tests?
7. **Readability** — would a new engineer understand this in 6 months?

## What to skip

- Style nits the linter doesn't catch (unless it's actively confusing).
- Personal preference rewrites that don't fix a real problem.
- "Have you considered..." without a concrete proposal.

## Format

For each finding:
- **Severity**: blocker | important | nit
- **Where**: file:line
- **What**: one-sentence summary of the issue
- **Why**: the failure mode it permits, or the cost it imposes
- **Suggestion**: a concrete fix or pointer
