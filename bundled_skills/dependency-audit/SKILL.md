---
name: dependency-audit
description: Use when the user wants to check Python/JS/Rust dependencies for known vulnerabilities or out-of-date versions.
license: Apache-2.0
author: OpenGriffin
---

# Dependency audit

## Python

```bash
pip-audit                              # CVEs in installed deps
pip list --outdated                     # version drift
deptry .                                # unused / missing imports
```

For a project using `pyproject.toml`:
```bash
uv pip compile pyproject.toml --upgrade   # show possible upgrades
```

## JavaScript / TypeScript

```bash
npm audit                              # CVEs
npm outdated                            # version drift
npx depcheck                            # unused deps
```

For yarn / pnpm:
```bash
pnpm audit
yarn audit
```

## Rust

```bash
cargo audit                            # cargo install cargo-audit first
cargo outdated                          # cargo install cargo-outdated first
```

## Triage rules

- **CVE in transitive dep**: try `npm overrides` / `cargo update -p <crate>` to force a patched version.
- **CVE in direct dep with no patch**: file an issue upstream; workaround temporarily.
- **License mismatch (e.g. GPL in commercial)**: replace.
- **Outdated by 1 major**: schedule upgrade in the next iteration.
- **Outdated by 2+ majors**: high-risk, write a plan first.

## Anti-patterns

- Auto-merging Dependabot PRs without reading the changelog.
- Ignoring CVEs because "we don't use that codepath" — the surface area is the lib, not the function you call.
