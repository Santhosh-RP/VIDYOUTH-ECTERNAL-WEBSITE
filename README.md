# Vidyouth External Website

The public marketing + docs site for **vidyouthintelligence.com** — a Next.js app
that builds to a fully static site, so it can be hosted for free on any static
host (Cloudflare Pages, Netlify, Vercel) independently of the main app/backend.

## Tech
- **Next.js** (App Router) with `output: "export"` → emits a static `out/` folder
- `trailingSlash: true`, `images.unoptimized: true` (required for static export)
- Pages: `/` (landing) and `/docs` (getting-started, learners, vendors, mentors)

## Develop locally
```bash
npm install
npm run dev        # http://localhost:3000
```

## Build (static export)
```bash
npm run build      # outputs the static site to ./out
```

## Deploy to a static host
Connect this repo and use these settings:

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | 18+ |

- **Cloudflare Pages / Netlify / Vercel:** point at this repo, set the build command
  and output dir above, deploy. Every push to `main` redeploys automatically.
- **No-build option:** run `npm run build` locally and drag the `out/` folder to
  app.netlify.com/drop for an instant deploy.

## Custom domain
After the first deploy, add `vidyouthintelligence.com` in the host dashboard and
point the domain's DNS/nameservers at the host (at your registrar).
