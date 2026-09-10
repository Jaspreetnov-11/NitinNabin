-- Nitin Nabin site — schema (v2, matches nitinnabin-final.html)
-- Run this in Supabase → SQL Editor (or `supabase db push`).
-- If you ran an older version of this file, run supabase/reset.sql first.

create extension if not exists pgcrypto;

-- ---------- Content tables (public read) ----------

create table if not exists public.updates (
  id          uuid primary key default gen_random_uuid(),
  event_date  date not null,
  kind_en     text not null default 'Event',
  kind_hi     text not null default 'कार्यक्रम',
  title_en    text not null,
  title_hi    text not null,
  summary_en  text not null default '',
  summary_hi  text not null default '',
  place_en    text not null default '',
  place_hi    text not null default '',
  image_url   text,
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.milestones (
  id          uuid primary key default gen_random_uuid(),
  year        text not null,
  kind_en     text not null,
  kind_hi     text not null,
  title_en    text not null,
  title_hi    text not null,
  place_en    text not null default '',
  place_hi    text not null default '',
  body_en     text not null,
  body_hi     text not null,
  record_en   text not null default '',
  record_hi   text not null default '',
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.speeches (
  id          uuid primary key default gen_random_uuid(),
  event_date  date not null,
  kind_en     text not null default 'Organisation',
  kind_hi     text not null default 'संगठन',
  title_en    text not null,
  title_hi    text not null,
  venue_en    text not null default '',
  venue_hi    text not null default '',
  video_url   text,                       -- set to show a "Watch" link instead of the "no video" badge
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.gallery (
  id          uuid primary key default gen_random_uuid(),
  image_url   text not null,
  caption_en  text not null default '',
  caption_hi  text not null default '',
  sub_en      text not null default '',
  sub_hi      text not null default '',
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.social_posts (
  id          uuid primary key default gen_random_uuid(),
  platform    text not null check (platform in ('fb','x','ig','yt')),
  image_url   text,
  text_en     text not null,
  text_hi     text not null,
  label_en    text not null default '',   -- e.g. "Tiranga Yatra", or video duration "18:42"
  label_hi    text not null default '',
  when_en     text not null default '',   -- "18 Aug 2026" or "3 days ago"
  when_hi     text not null default '',
  stats       text not null default '',   -- "👍 4.8K", "🔁 1.8K ❤️ 9.4K", "94K views"
  post_url    text,                       -- link to the actual post (optional)
  published   boolean not null default true,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------- Contact form inbox (write-only from the site) ----------

create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  contact     text not null,
  message     text not null,
  user_agent  text,
  is_read     boolean not null default false,
  created_at  timestamptz not null default now()
);

-- ---------- Indexes ----------

create index if not exists updates_published_date_idx   on public.updates (published, event_date desc);
create index if not exists milestones_sort_idx          on public.milestones (published, sort_order);
create index if not exists speeches_published_date_idx  on public.speeches (published, event_date desc);
create index if not exists gallery_sort_idx             on public.gallery (published, sort_order);
create index if not exists social_posts_platform_idx    on public.social_posts (published, platform, sort_order);
create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);

-- ---------- Row Level Security ----------

alter table public.updates          enable row level security;
alter table public.milestones       enable row level security;
alter table public.speeches         enable row level security;
alter table public.gallery          enable row level security;
alter table public.social_posts     enable row level security;
alter table public.contact_messages enable row level security;

-- Anyone can read published content. (drop-then-create so this file is safe to re-run)
drop policy if exists "public read updates"      on public.updates;
drop policy if exists "public read milestones"   on public.milestones;
drop policy if exists "public read speeches"     on public.speeches;
drop policy if exists "public read gallery"      on public.gallery;
drop policy if exists "public read social_posts" on public.social_posts;
create policy "public read updates"      on public.updates      for select to anon, authenticated using (published);
create policy "public read milestones"   on public.milestones   for select to anon, authenticated using (published);
create policy "public read speeches"     on public.speeches     for select to anon, authenticated using (published);
create policy "public read gallery"      on public.gallery      for select to anon, authenticated using (published);
create policy "public read social_posts" on public.social_posts for select to anon, authenticated using (published);

-- Anyone can submit a contact message; nobody (except service role / dashboard) can read them.
drop policy if exists "public insert contact" on public.contact_messages;
create policy "public insert contact" on public.contact_messages for insert to anon, authenticated with check (true);

-- No insert/update/delete policies on content tables: edit them from the
-- Supabase dashboard (Table Editor) or with the service-role key only.
