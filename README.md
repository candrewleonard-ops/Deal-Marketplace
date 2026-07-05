# AllStreet Live — Deal Marketplace

The code behind [allstreetlive.com](https://allstreetlive.com) — an off-market real
estate deal marketplace: listings with scope-of-work condition reports, a deal
calculator, live property tours, DMs with in-app calls, groups, meetups,
contractor directory, education hub, and admin tooling.

## Stack

- **React 19 + Vite** single-page app, styled with **Tailwind CSS 4** tokens +
  inline styles (Robinhood-inspired near-black/green/gold theme in `src/index.css`)
- **Supabase** (Postgres + Storage) for user-posted deals & photos — public
  client keys are baked into `src/lib/supabase.js`, RLS enforces access;
  seed/demo content lives in `src/data/`
- **react-router-dom** — routes in `src/App.jsx`; listing URLs are SEO slugs
  (`/marketplace/phoenix-fixer-hot-market-deal-2`, see `src/utils/slug.js`)
- **react-simple-maps** for the marketplace state map, **lucide-react** icons
- Deployed on **Cloudflare Pages** (`public/_redirects` handles SPA routing);
  the production branch is configured in the Cloudflare dashboard

## Develop

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # production build to dist/
npm run lint
```

## Environment

Copy `.env.example` to `.env.local` (or set in Cloudflare Pages → Settings →
Environment variables): `VITE_GOOGLE_MAPS_API_KEY` for address autocomplete +
Street View, `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` to override the
baked-in database.

### Supabase migration for Scope of Work

Posted deals save their 15-question condition report to a `scope_of_work`
jsonb column. If the column doesn't exist yet, run this once in the Supabase
SQL editor (posting still works without it — the scope is just dropped):

```sql
alter table deals add column if not exists scope_of_work jsonb;
```

## Layout

| Path | What lives there |
| --- | --- |
| `src/pages/` | One file per route (Marketplace is the homepage; LiveTours/LiveRoom are the live-streaming section) |
| `src/components/` | Shared UI: Navbar, DealCard, BuyBoxModal, CallOverlay, modals, US map |
| `src/data/` | Demo deals/users/posts + `scopeOfWork.js` (the 15 questions) + `liveTours.js` |
| `src/lib/` | Supabase client, deals CRUD, DM history, inbox/unread state, activity log |
| `src/context/` | Auth + toast providers |
| `src/hooks/`, `src/utils/` | `useSEO`, mobile detection, slug + address helpers |
