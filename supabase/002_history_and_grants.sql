-- Run this in your Supabase SQL Editor to add Game History & ensure table permissions

create table if not exists public.game_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null check (mode in ('play', 'pvp')),
  opponent_name text not null,
  player_color text not null check (player_color in ('w', 'b')),
  result text not null check (result in ('win', 'loss', 'draw')),
  end_reason text not null default 'finished',
  time_control_label text not null default '3+2 Blitz',
  moves jsonb not null default '[]'::jsonb,
  final_fen text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_game_history_user_created
  on public.game_history (user_id, created_at desc);

alter table public.game_history enable row level security;

drop policy if exists "Users can read own game_history" on public.game_history;
create policy "Users can read own game_history"
  on public.game_history for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own game_history" on public.game_history;
create policy "Users can insert own game_history"
  on public.game_history for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own game_history" on public.game_history;
create policy "Users can delete own game_history"
  on public.game_history for delete to authenticated
  using (auth.uid() = user_id);

grant usage on schema public to authenticated, anon;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update on table public.chess_rooms to authenticated;
grant select, insert, delete on table public.game_history to authenticated;
