-- ============================================================================
-- AllStreet Live — initial schema
-- Run this in Supabase → SQL Editor → New query → paste → Run.
--
-- NOTE: these are PROTOTYPE policies. They let anyone with the anon key read
-- and insert deals + upload photos, which is fine while there is no real
-- auth yet. Once Supabase Auth is wired, tighten the policies (TODOs below).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ── Deals ───────────────────────────────────────────────────────────────────
create table if not exists public.deals (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  title            text not null,
  deal_type        text,
  address          text,
  city             text,
  state            text,
  zip              text,
  beds             numeric,
  baths            numeric,
  sqft             numeric,
  year_built       integer,
  contracted_price numeric,
  listing_price    numeric,
  arv              numeric,
  rehab_low        numeric,
  rehab_high       numeric,
  description      text,
  youtube_url      text,
  photos           jsonb not null default '[]'::jsonb,
  seller_id        text,
  seller_name      text,
  status           text not null default 'available'
);

alter table public.deals enable row level security;

drop policy if exists "deals public read"   on public.deals;
drop policy if exists "deals public insert" on public.deals;

-- TODO (after auth): replace `true` with `auth.role() = 'authenticated'`
create policy "deals public read"   on public.deals for select using (true);
create policy "deals public insert" on public.deals for insert with check (true);

-- ── Photo storage bucket ────────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('deal-photos', 'deal-photos', true)
on conflict (id) do nothing;

drop policy if exists "deal photos public read"   on storage.objects;
drop policy if exists "deal photos public upload" on storage.objects;

create policy "deal photos public read"
  on storage.objects for select
  using (bucket_id = 'deal-photos');

-- TODO (after auth): add `and auth.role() = 'authenticated'`
create policy "deal photos public upload"
  on storage.objects for insert
  with check (bucket_id = 'deal-photos');
