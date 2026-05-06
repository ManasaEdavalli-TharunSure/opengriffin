Homebrew Node 24 is installed at /opt/homebrew/opt/node@24/bin, but default PATH resolves node to bundled Node 22; project commands require prepending PATH="/opt/homebrew/opt/node@24/bin:$PATH" and using corepack pnpm 10.x.
§
The production deploy uses Cloudflare Workers + R2; staging uses Vercel preview URLs. Always test against staging before promoting.
§
PR titles must follow the conventional commit format: <type>(<scope>): <subject>. CI rejects others.
