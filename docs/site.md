# Site (`apps/web`)

The marketing landing page at [opengriffin.com](https://opengriffin.com) lives in `apps/web`. It is intentionally separate from the Python agent — no shared runtime, no shared deps.

## Stack

- Next.js 16 (App Router) + React 19.2.6
- TypeScript
- Tailwind CSS + framer-motion
- Built as a **static export** (`apps/web/out/`) so it deploys as static files

## Local development

```
cd apps/web
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → apps/web/out
npm run start    # serve a prod build
npm run lint
```

## Structure

```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx           Composes the landing sections
│   │   └── globals.css        Palette tokens (orange/amber on OLED dark)
│   └── components/
│       ├── sections/          Nav, Hero, Why, Features, Providers,
│       │                      Install, Migration, Faq, Cta, Footer
│       └── motion/            SectionDivider and other framer-motion bits
└── package.json
```

The current site is **landing-only** — there is no chat workspace, model picker, memory browser, or signed-in surface. Those are tracked under "Web workspace UI" in [ROADMAP.md](../ROADMAP.md) and are gated on Cloud-tier demand.

## Deploy (Vercel)

`vercel.json` at the repo root drives the build:

```json
{
  "buildCommand": "cd apps/web && npm install && npm run build",
  "outputDirectory": "apps/web/out",
  "framework": null,
  "cleanUrls": true,
  "trailingSlash": false
}
```

`framework: null` is deliberate — the output is static HTML/CSS/JS, not a Next.js server runtime on Vercel.

## House rules

`apps/web/AGENTS.md` warns that this Next.js version has breaking changes from older training data. Before touching it, read the relevant guide under `apps/web/node_modules/next/dist/docs/` and respect deprecation notices.
