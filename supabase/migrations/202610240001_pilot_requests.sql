-- Run in the Supabase SQL editor or apply through the Supabase CLI.
-- No public insert/read policies: only the server service-role can access requests.
create table if not exists public.pilot_requests (
  request_id uuid primary key,
  first_name text not null check (char_length(first_name) between 1 and 60),
  email text not null check (char_length(email) between 3 and 254),
  everyday_action text not null check (char_length(everyday_action) between 3 and 300),
  seven_days_possible text not null check (seven_days_possible in ('yes', 'unsure', 'no')),
  contact_consent boolean not null check (contact_consent = true),
  consent_version text not null,
  created_at timestamptz not null default now()
);

alter table public.pilot_requests enable row level security;
revoke all on table public.pilot_requests from public, anon, authenticated;
grant select, insert on table public.pilot_requests to service_role;
comment on table public.pilot_requests is 'Private pilot-detail requests; not enrollment, payment, or evidence of paid demand.';
