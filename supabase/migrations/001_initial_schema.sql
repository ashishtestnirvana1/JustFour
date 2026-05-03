-- ============================================================
-- JustFour — Initial Schema v1
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================

create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS
-- Extends auth.users. Stores application-level data only.
-- ============================================================
create table public.users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null unique,
  first_name    text,
  is_paid       boolean not null default false,
  payment_ref   text,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- SESSIONS
-- One per user (enforced by unique constraint).
-- ============================================================
create table public.sessions (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null unique references public.users(id) on delete cascade,
  stage         int not null default 0,
  context       jsonb not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- MESSAGES
-- Every conversation message, saved as it arrives.
-- ============================================================
create table public.messages (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid not null references public.sessions(id) on delete cascade,
  role          text not null check (role in ('user', 'assistant', 'system')),
  content       text not null,
  stage         int not null,
  token_count   int,
  created_at    timestamptz not null default now()
);

create index idx_messages_session on public.messages(session_id, created_at);

-- ============================================================
-- DASHBOARDS
-- Generated once at end of Stage 3. Stored as JSON.
-- ============================================================
create table public.dashboards (
  id            uuid primary key default uuid_generate_v4(),
  session_id    uuid not null unique references public.sessions(id) on delete cascade,
  user_id       uuid not null unique references public.users(id) on delete cascade,
  focus_wall    jsonb not null default '[]',
  parking_lot   jsonb not null default '{}',
  this_week     jsonb not null default '[]',
  version       int not null default 1,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY — every user sees only their own data
-- ============================================================
alter table public.users enable row level security;
alter table public.sessions enable row level security;
alter table public.messages enable row level security;
alter table public.dashboards enable row level security;

create policy "Users see own row"
  on public.users for select using (auth.uid() = id);

create policy "Users insert own row"
  on public.users for insert with check (auth.uid() = id);

create policy "Sessions belong to user"
  on public.sessions for all using (auth.uid() = user_id);

create policy "Messages belong to user session"
  on public.messages for all using (
    session_id in (select id from public.sessions where user_id = auth.uid())
  );

create policy "Dashboards belong to user"
  on public.dashboards for all using (auth.uid() = user_id);

-- ============================================================
-- AUTO-UPDATE updated_at
-- ============================================================
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger sessions_updated_at
  before update on public.sessions
  for each row execute function public.update_updated_at();

create trigger dashboards_updated_at
  before update on public.dashboards
  for each row execute function public.update_updated_at();
