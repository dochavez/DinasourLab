create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 24),
  created_at timestamptz not null default now()
);

create table public.puzzle_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  dinosaur_id text not null check (dinosaur_id in ('spinosaurus', 'tyrannosaurus', 'triceratops', 'parasaurus', 'pteranodon', 'brachiosaurus', 'ankylosaurus', 'mammoth')),
  status text not null default 'playing' check (status in ('playing', 'completed', 'expired')),
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  completion_seconds integer check (completion_seconds between 1 and 150),
  constraint puzzle_runs_completion_shape check (
    (status = 'playing' and completed_at is null and completion_seconds is null)
    or (status = 'completed' and completed_at is not null and completion_seconds is not null)
    or (status = 'expired' and completed_at is not null and completion_seconds is null)
  )
);

create index puzzle_runs_leaderboard_idx on public.puzzle_runs (dinosaur_id, completion_seconds asc, completed_at asc) where status = 'completed';
create index puzzle_runs_active_idx on public.puzzle_runs (status, started_at desc) where status = 'playing';

alter table public.profiles enable row level security;
alter table public.puzzle_runs enable row level security;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.puzzle_runs from anon, authenticated;
grant select on table public.profiles to authenticated;
grant select on table public.puzzle_runs to authenticated;

create policy "Authenticated players can view profiles"
on public.profiles for select to authenticated
using (true);

create policy "Authenticated players can view puzzle activity"
on public.puzzle_runs for select to authenticated
using (true);
