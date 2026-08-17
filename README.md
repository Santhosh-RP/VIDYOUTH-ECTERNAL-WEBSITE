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

## Deploy on AWS Amplify (primary)
This repo ships an `amplify.yml` build spec, so Amplify configures itself on
connect. Steps in the AWS Console:

1. **Amplify → Create new app → Deploy with GitHub** → authorize → pick
   `Santhosh-RP/VIDYOUTH-ECTERNAL-WEBSITE`, branch `main`.
2. Amplify reads `amplify.yml` automatically (build `npm run build`, output `out`).
   Confirm and **Save and deploy**.
3. You get a live `https://main.<appid>.amplifyapp.com` URL in ~3 min. Every push
   to `main` auto-redeploys.

Build settings (already encoded in `amplify.yml`):

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `out` |
| Node version | 18+ |

## Custom domain (vidyouthintelligence.com)
In Amplify → **Hosting → Custom domains → Add domain** → `vidyouthintelligence.com`
(add `www` and root). Amplify issues the SSL cert and gives you the DNS records
(or auto-manages them if the domain's DNS is in Route 53). Point the domain's
DNS/nameservers accordingly at your registrar.

> Deep-link 404s: this is a static multi-page export with `trailingSlash`, so
> routes resolve as `/route/index.html` and work by default. If a host needs it,
> add a rewrite of `/<*>` → `/404.html` (404) in the console.

## Other hosts (no AWS needed)
Same build settings work on **Cloudflare Pages / Netlify / Vercel** (free), or run
`npm run build` locally and drag `out/` to app.netlify.com/drop for an instant deploy.
