# `apps/web` — opengriffin.com landing

Marketing landing page for [opengriffin.com](https://opengriffin.com). Lives in this repo but is intentionally separate from the Python agent — no shared runtime, no shared deps.

## Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS + framer-motion
- Deployed as a static export (`apps/web/out/`) via Vercel

## Develop

```bash
cd apps/web
npm install
npm run dev          # http://localhost:3000
npm run build        # static export → apps/web/out
npm run start        # serve a prod build
npm run lint
```

## Deeper docs

- Stack, layout, deploy config: [`docs/site.md`](../../docs/site.md)
- House rules for editing this Next.js (newer than common training data): [`AGENTS.md`](AGENTS.md)
- Per-gateway content surfaced on the landing: [`src/components/sections/gateways.tsx`](src/components/sections/gateways.tsx)
