# Content Automation Design

## First milestone

The first production-safe milestone is not automatic publishing. Cron jobs ingest external content into Supabase, and public pages read records that are ready to show. New records start as `draft`, so they can be reviewed, categorized, and promoted later.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
CRON_SECRET=

YOUTUBE_API_KEY=
YOUTUBE_PLAYLIST_ID=
YOUTUBE_CHANNEL_HANDLE=@mine_ocean-quest
YOUTUBE_INGEST_LIMIT=12

NOTE_RSS_URL=https://note.com/gentle_moraea373/m/me280dc72ba27/rss
OPENAI_API_KEY=
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is used for page reads. `SUPABASE_SERVICE_ROLE_KEY` is used only from server-side cron routes.
For YouTube, `YOUTUBE_PLAYLIST_ID` is preferred when it is set. If it is empty, the app resolves `YOUTUBE_CHANNEL_HANDLE` to the channel uploads playlist through YouTube Data API.

## Supabase schema

```sql
create extension if not exists pgcrypto;

create table if not exists public.external_contents (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('youtube', 'note', 'ebook')),
  source_id text not null,
  source_url text not null,
  title text not null,
  description text,
  thumbnail_url text,
  published_at timestamptz,
  status text not null default 'draft' check (status in ('draft', 'review', 'published', 'archived')),
  category text,
  audience text default 'all',
  metadata jsonb not null default '{}'::jsonb,
  source_content_id uuid references public.external_contents(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source, source_id)
);

create index if not exists external_contents_source_status_published_idx
  on public.external_contents (source, status, published_at desc);

create index if not exists external_contents_source_content_id_idx
  on public.external_contents (source_content_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_external_contents_updated_at on public.external_contents;

create trigger set_external_contents_updated_at
before update on public.external_contents
for each row
execute function public.set_updated_at();

alter table public.external_contents enable row level security;

drop policy if exists "Public can read visible external contents" on public.external_contents;

create policy "Public can read visible external contents"
on public.external_contents
for select
using (status in ('draft', 'review', 'published'));
```

The first milestone intentionally allows `draft`, `review`, and `published` reads so the page can display DB-saved content before the editorial workflow is finished. Tighten this policy to `status = 'published'` when review operations are in place.

## Flow

1. Vercel Cron calls `/api/cron/ingest-youtube` hourly.
2. The route checks `Authorization: Bearer $CRON_SECRET` when `CRON_SECRET` is configured.
3. The route fetches playlist items from YouTube Data API.
4. Items are normalized into `external_contents` records.
5. Supabase upserts by `(source, source_id)` so repeated cron runs are safe.
6. `/videos` reads Supabase and renders saved records.

## Next milestones

- Add `/api/cron/ingest-note` to parse `NOTE_RSS_URL` and upsert `source = 'note'`.
- Add an internal route or script to generate `source = 'ebook'` drafts from selected note records, linked by `source_content_id`.
- Add thumbnail generation metadata to eBook records, then store approved thumbnail URLs in `thumbnail_url`.
- Add an editorial admin surface or Supabase view to move records from `draft` to `published`.
