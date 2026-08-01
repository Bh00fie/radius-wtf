# radius.wtf

A daily, no-login browser game in the spirit of [angle.wtf](https://angle.wtf/) and Wordle —
instead of guessing an angle or a word, you guess a circle's **radius**, in abstract "game units,"
using a fixed scale-bar legend as your only reference. One circle a day, up to 4 numeric guesses
with higher/lower feedback, a Wordle-style `X/4` result, and a streak that only continues on
consecutive daily wins.

## How it works

- Everything renders in a fixed SVG `viewBox`, so all math happens in stable game units instead of
  raw pixels (see `src/lib/constants.ts`).
- Each day's puzzle (one circle) is generated deterministically from the UTC date
  (`src/lib/game.ts`), so every player gets the same radius, and it rolls over to a new one at UTC
  midnight.
- The true circle is visible the whole time — there's no drag-to-match overlay, since that made
  matching trivial by eye. You type a numeric radius guess; each guess shows a score band and a
  "too high"/"too low" direction cue. You win by guessing the exact radius within
  `MAX_GUESSES` (4) tries; running out of guesses reveals the answer.
- Progress/streaks persist in `localStorage` only — no accounts yet. `src/lib/storage.ts` defines a
  `StatsStorage` interface so a future Supabase-backed adapter can be swapped in without touching
  game logic, once accounts are added.
- `src/components/AdSlot.tsx` reserves space for a future Google AdSense unit.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.local.example` to `.env.local` and set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to enable Google
Analytics locally (optional — the app runs fine without it).

## Testing

```bash
npm test
```

Unit tests (`src/lib/game.test.ts`) cover the scoring formula and streak logic, including
consecutive-day, skipped-day, and same-day-replay cases.

## SEO

- `src/app/layout.tsx` sets title/description/keywords, Open Graph + Twitter card metadata, a
  canonical URL, and `WebApplication` JSON-LD structured data.
- `src/app/opengraph-image.tsx` generates the social-preview image dynamically (`next/og`) — no
  static asset to keep in sync.
- `src/app/sitemap.ts` and `src/app/robots.ts` generate `/sitemap.xml` and `/robots.txt`.
- All of the above read `SITE_URL` from `src/lib/constants.ts`, which is
  `NEXT_PUBLIC_SITE_URL` if set, otherwise a placeholder. **Set `NEXT_PUBLIC_SITE_URL` in Netlify's
  environment variables to the real deployed URL** (or custom domain) so metadata/canonical/sitemap
  links point at the right place — see Deployment below.

To actually get indexed by Google (can't be automated — needs your Google account):

1. Go to [Google Search Console](https://search.google.com/search-console) and add the site as a
   property (the "URL prefix" method with your Netlify URL is simplest).
2. Verify ownership — Search Console will offer an HTML meta tag or DNS TXT record option; a DNS
   TXT record on a custom domain is the least fragile if you have one.
3. Once verified, submit `https://<your-site>/sitemap.xml` under Sitemaps in the Search Console
   sidebar.
4. Optionally use "Request Indexing" on the URL Inspection tool to speed up the first crawl instead
   of waiting for Google to discover it on its own.

## Deployment

Deploys to [Netlify](https://www.netlify.com/) via `@netlify/plugin-nextjs` (see `netlify.toml`).
In the Netlify site's environment variables, set:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` — enables Google Analytics in production.
- `NEXT_PUBLIC_SITE_URL` — your real deployed URL (e.g. `https://radius-wtf.netlify.app` or a
  custom domain), used for SEO metadata, the sitemap, and robots.txt.
