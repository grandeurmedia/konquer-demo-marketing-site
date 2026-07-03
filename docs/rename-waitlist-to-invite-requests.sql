-- Migration: rename `waitlist` table to `invite_requests`
-- Run this in the Supabase SQL editor (or via MCP apply_migration) once the project is active.
-- After applying, update app/api/request-invite/route.ts to POST to /rest/v1/invite_requests.

alter table public.waitlist rename to invite_requests;

-- Postgres keeps the old constraint name on rename; align it with the new table name.
alter table public.invite_requests rename constraint waitlist_email_unique to invite_requests_email_unique;

comment on table public.invite_requests is 'Invite requests from the Konquer marketing site.';

-- Note: if RLS policies were enabled on `waitlist`, they carry over automatically.
-- PostgREST picks up the rename immediately; the old /rest/v1/waitlist endpoint stops working.
