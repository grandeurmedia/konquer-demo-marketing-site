-- Run once in Supabase SQL Editor (Dashboard → SQL → New query).
-- Creates the table used by POST /api/waitlist.

create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  company text,
  created_at timestamptz not null default now(),
  constraint waitlist_email_unique unique (email)
);

comment on table public.waitlist is 'Landing waitlist signups from the Konquer prototype.';

-- Service role (used by Next.js API route) bypasses RLS. If you use the anon key instead,
-- add a policy allowing insert only, e.g.:
-- alter table public.waitlist enable row level security;
-- create policy "Allow public insert" on public.waitlist for insert with check (true);
