# radius.wtf

A daily, no-login browser game in the spirit of [angle.wtf](https://angle.wtf/) — instead of
guessing an angle, you guess a circle's **radius**, in abstract "game units," using a fixed
scale-bar legend as your only reference. Five rounds a day, a Wordle-style emoji share grid, and
a streak that resets on a UTC-midnight puzzle rollover.

## How it works

- Everything renders in a fixed SVG `viewBox`, so all math happens in stable game units instead of
  raw pixels (see `src/lib/constants.ts`).
- Each day's puzzle is generated deterministically from the UTC date (`src/lib/game.ts`), so every
  player gets the same 5 radii.
- Drag the dashed guess circle's handle (or type a number) to match the hidden circle's size, then
  submit to reveal the true circle and your score (0–100, percent-error based).
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

## Deployment

Deploys to [Netlify](https://www.netlify.com/) via `@netlify/plugin-nextjs` (see `netlify.toml`).
Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the Netlify site's environment variables to enable analytics
in production.
