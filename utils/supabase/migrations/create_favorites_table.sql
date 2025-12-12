-- Create a table for user favorites
create table if not exists public.favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  evidence_id text not null, -- Assuming evidence IDs are strings (e.g. from JSON/CSV import)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, evidence_id) -- Prevent duplicate favorites for same evidence
);

-- Set up Row Level Security (RLS)
alter table public.favorites enable row level security;

create policy "Users can view their own favorites." on public.favorites
  for select using ((select auth.uid()) = user_id);

create policy "Users can insert their own favorites." on public.favorites
  for insert with check ((select auth.uid()) = user_id);

create policy "Users can delete their own favorites." on public.favorites
  for delete using ((select auth.uid()) = user_id);
