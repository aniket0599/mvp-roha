-- Around — Supabase / Postgres schema
-- Run once in the Supabase SQL editor (or `psql`) before first use with
-- Supabase configured. The app self-seeds the Blue Tokai space + sample
-- regulars on first request if the tables are empty.

create table if not exists spaces (
  id         text primary key,
  venue_id   text unique not null,
  name       text not null,
  image_url  text
);

create table if not exists profiles (
  id               text primary key,          -- anonymous user id
  space_id         text not null references spaces(id) on delete cascade,
  name             text not null,
  age              int,
  profession       text,
  avatar_emoji     text,
  interests        text[]      not null default '{}',
  current_activity text,
  now_lines        jsonb       not null default '[]',
  interesting      text        not null default '',
  ask_me_about     text[]      not null default '{}',
  looking_for      text[]      not null default '{}',
  recently         text        not null default '',
  social_mode      text        not null default 'open',
  visible          boolean     not null default true,
  usually_here     text,
  is_seed          boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists profiles_space_visible_idx on profiles (space_id, visible);

create table if not exists analytics_events (
  id                text primary key,
  name              text not null,
  user_id           text,
  space_id          text,
  target_profile_id text,
  category          text,
  timestamp         timestamptz not null default now()
);
create index if not exists analytics_space_idx on analytics_events (space_id);

create table if not exists connections (
  id              text primary key,
  user_id         text not null,
  other_user_id   text not null,
  other_user_name text not null,
  space_id        text not null,
  space_name      text not null,
  types           text[] not null default '{}',
  note            text not null default '',
  created_at      timestamptz not null default now()
);
create index if not exists connections_user_idx on connections (user_id);

-- The app connects with the service-role key from server-side routes only, so
-- row-level security is not required for the MVP. If you expose the anon key to
-- the browser instead, enable RLS and add policies before going live.
