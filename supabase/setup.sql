-- ============================================================
-- Forge & Fable — Supabase Database Setup
-- Run this in your Supabase SQL Editor (supabase.com/dashboard → SQL Editor)
-- ============================================================

-- 1. Create the characters table
create table if not exists public.characters (
  id          uuid default gen_random_uuid() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  race        text not null default 'human',
  subrace     text default '',
  class_name  text not null default 'fighter',
  level       integer not null default 1 check (level >= 1 and level <= 20),
  background  text not null default 'acolyte',
  ability_scores  jsonb not null default '{"strength":10,"dexterity":10,"constitution":10,"intelligence":10,"wisdom":10,"charisma":10}',
  hit_points      jsonb not null default '{"max":10,"current":10,"temporary":0}',
  armor_class     integer not null default 10,
  speed           integer not null default 30,
  saving_throws   jsonb default '[]',
  skill_proficiencies jsonb default '[]',
  equipment       jsonb default '[]',
  spells          jsonb default '[]',
  notes           text default '',
  player_name     text default '',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.characters enable row level security;

-- 3. Users can only see their own characters
create policy "Users can view own characters"
  on public.characters for select
  using (auth.uid() = user_id);

-- 4. Users can insert their own characters
create policy "Users can insert own characters"
  on public.characters for insert
  with check (auth.uid() = user_id);

-- 5. Users can update their own characters
create policy "Users can update own characters"
  on public.characters for update
  using (auth.uid() = user_id);

-- 6. Users can delete their own characters
create policy "Users can delete own characters"
  on public.characters for delete
  using (auth.uid() = user_id);

-- 7. Auto-update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_characters_updated
  before update on public.characters
  for each row execute function public.handle_updated_at();
