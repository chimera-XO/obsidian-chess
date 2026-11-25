-- Run this in your Supabase SQL Editor to set up Obsidian Chess Auth Profiles & PvP Rooms
-- Also disable "Confirm email" in Supabase Dashboard -> Authentication -> Providers -> Email
-- so username + password sign-ups log in immediately.

-- 1. User Profiles (Username mapping for Auth users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_profiles_username_lower
  on public.profiles (lower(username));

alter table public.profiles enable row level security;

drop policy if exists "Authenticated users can read profiles" on public.profiles;
create policy "Authenticated users can read profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile row on sign-up from user metadata
create or replace function public.handle_new_chess_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  desired_username text;
begin
  desired_username := coalesce(
    nullif(trim(new.raw_user_meta_data->>'username'), ''),
    'player_' || substr(new.id::text, 1, 8)
  );
  insert into public.profiles (id, username)
  values (new.id, desired_username)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_chess on auth.users;
create trigger on_auth_user_created_chess
after insert on auth.users
for each row execute function public.handle_new_chess_user();

-- 2. PvP Chess Rooms
create table if not exists public.chess_rooms (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  fen text not null default 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  moves jsonb not null default '[]'::jsonb,
  turn text not null default 'w' check (turn in ('w', 'b')),
  status text not null default 'waiting' check (status in ('waiting', 'active', 'finished')),
  winner text check (winner in ('w', 'b', 'draw') or winner is null),
  end_reason text,
  draw_offer_by text check (draw_offer_by in ('w', 'b') or draw_offer_by is null),

  white_player_id text,
  white_player_name text,
  black_player_id text,
  black_player_name text,

  time_control_id text not null default 'blitz-3-2',
  time_control_label text not null default '3+2 Blitz',
  base_time_ms integer not null default 180000,
  increment_ms integer not null default 2000,
  white_time_ms integer not null default 180000,
  black_time_ms integer not null default 180000,
  last_move_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_chess_rooms_code on public.chess_rooms (code);

create or replace function public.set_chess_rooms_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_chess_rooms_updated_at on public.chess_rooms;
create trigger trg_chess_rooms_updated_at
before update on public.chess_rooms
for each row execute function public.set_chess_rooms_updated_at();

alter table public.chess_rooms enable row level security;

drop policy if exists "Allow read chess_rooms" on public.chess_rooms;
drop policy if exists "Allow create chess_rooms" on public.chess_rooms;
drop policy if exists "Allow update chess_rooms" on public.chess_rooms;

create policy "Authenticated users can read chess_rooms"
  on public.chess_rooms
  for select
  to authenticated
  using (true);

create policy "Authenticated users can create chess_rooms"
  on public.chess_rooms
  for insert
  to authenticated
  with check (
    white_player_id = auth.uid()::text
    or black_player_id = auth.uid()::text
  );

create policy "Authenticated users can update chess_rooms"
  on public.chess_rooms
  for update
  to authenticated
  using (
    white_player_id = auth.uid()::text
    or black_player_id = auth.uid()::text
    or white_player_id is null
    or black_player_id is null
  )
  with check (true);

-- Enable Supabase Realtime replication for instant move sync
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chess_rooms'
  ) then
    alter publication supabase_realtime add table public.chess_rooms;
  end if;
end $$;
