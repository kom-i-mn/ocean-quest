create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.analytics_reports (
  id uuid primary key default gen_random_uuid(),
  report_date date not null unique,
  source text not null default 'ga4_search_console',
  summary jsonb not null default '{}'::jsonb,
  channel_groups jsonb not null default '[]'::jsonb,
  search_queries jsonb not null default '[]'::jsonb,
  landing_pages jsonb not null default '[]'::jsonb,
  events jsonb not null default '[]'::jsonb,
  insights jsonb not null default '[]'::jsonb,
  recommended_actions jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists analytics_reports_report_date_idx
  on public.analytics_reports (report_date desc);

drop trigger if exists set_analytics_reports_updated_at on public.analytics_reports;

create trigger set_analytics_reports_updated_at
before update on public.analytics_reports
for each row
execute function public.set_updated_at();

alter table public.analytics_reports enable row level security;

drop policy if exists "Public can read analytics reports" on public.analytics_reports;

create policy "Public can read analytics reports"
on public.analytics_reports
for select
using (true);
