---
name: secret-scan
description: Use when the user wants to scan a repo or directory for accidentally committed secrets.
license: Apache-2.0
author: OpenGriffin
---

# Secret scanning

Goal: find API keys, tokens, private keys, passwords accidentally committed.

## Tools

1. **gitleaks** — most accurate, scans git history.
   ```bash
   brew install gitleaks
   gitleaks detect --source . --report-format json --report-path leaks.json
   ```
2. **trufflehog** — better at high-entropy detection.
   ```bash
   trufflehog git file://. --json
   ```
3. **Plain regex** as a fallback (less accurate):
   ```bash
   grep -rE 'sk-(ant-)?[A-Za-z0-9_-]{32,}|AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}' .
   ```

## Patterns to know

| Vendor | Pattern |
|---|---|
| AWS Access Key | `AKIA[0-9A-Z]{16}` |
| AWS Secret | 40-char base64 (high entropy) |
| GitHub PAT | `ghp_[A-Za-z0-9]{36}` |
| GitHub Fine-Grained | `github_pat_[A-Za-z0-9_]{60,}` |
| OpenAI | `sk-[A-Za-z0-9_-]{40,}` |
| Anthropic | `sk-ant-(api03\|oat01)-[A-Za-z0-9_-]{40,}` |
| Slack | `xox[abops]-[A-Za-z0-9-]{20,}` |
| Stripe | `sk_(live\|test)_[A-Za-z0-9]{24}` |

## If you find a leaked secret

1. **Rotate it IMMEDIATELY** — do this before doing anything else, even before deleting from git.
2. **Audit access logs** for the period it was exposed.
3. Use `git filter-repo` or BFG to remove from history.
4. Force-push (with team approval).
5. Notify your security team / customers if applicable.

## Prevention

- Pre-commit hooks (gitleaks/trufflehog).
- `.gitignore` for `.env`, `*.pem`, `*.key`.
- Use a secret manager (1Password, AWS Secrets Manager, Vault) — never plaintext in code.
