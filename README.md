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

### Supabase migrations (run once in the SQL editor)

Posted deals save their 15-question condition report to a `scope_of_work`
jsonb column. If the column doesn't exist yet, run this once in the Supabase
SQL editor (posting still works without it — the scope is just dropped):

```sql
alter table deals add column if not exists scope_of_work jsonb;

-- Real engagement: one view per user per deal, hearts saved per user
create table if not exists deal_views (
  deal_id text not null, user_key text not null,
  created_at timestamptz default now(), primary key (deal_id, user_key));
create table if not exists deal_hearts (
  deal_id text not null, user_key text not null,
  created_at timestamptz default now(), primary key (deal_id, user_key));

-- Direct messages (cross-device)
create table if not exists dms (
  id bigint generated always as identity primary key,
  from_key text not null, to_key text not null, text text not null,
  created_at timestamptz default now());
create index if not exists dms_pair on dms (from_key, to_key, created_at);

alter table deal_views  enable row level security;
alter table deal_hearts enable row level security;
alter table dms         enable row level security;
create policy "anon views"  on deal_views  for all using (true) with check (true);
create policy "anon hearts" on deal_hearts for all using (true) with check (true);
create policy "anon dms"    on dms         for all using (true) with check (true);
```

Everything degrades gracefully to localStorage until these exist — the UI
never breaks, but views/hearts/DMs only become cross-device after the
migration runs.

## Layout

| Path | What lives there |
| --- | --- |
| `src/pages/` | One file per route (Marketplace is the homepage; LiveTours/LiveRoom are the live-streaming section) |
| `src/components/` | Shared UI: Navbar, DealCard, BuyBoxModal, CallOverlay, modals, US map |
| `src/data/` | Demo deals/users/posts + `scopeOfWork.js` (the 15 questions) + `liveTours.js` |
| `src/lib/` | Supabase client, deals CRUD, DM history, inbox/unread state, activity log |
| `src/context/` | Auth + toast providers |
| `src/hooks/`, `src/utils/` | `useSEO`, mobile detection, slug + address helpers |
