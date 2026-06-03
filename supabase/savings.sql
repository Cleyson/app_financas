-- Cofrinho (Piggy Bank) — run this in Supabase SQL Editor

create table if not exists public.savings (
  id          uuid default uuid_generate_v4() primary key,
  user_id     uuid references auth.users(id) on delete cascade not null,
  amount      numeric(12, 2) not null,          -- positive = deposit, negative = withdrawal
  description text,
  created_at  timestamptz default now() not null
);

alter table public.savings enable row level security;

create policy "savings: select own" on public.savings
  for select using (auth.uid() = user_id);

create policy "savings: insert own" on public.savings
  for insert with check (auth.uid() = user_id);

create policy "savings: delete own" on public.savings
  for delete using (auth.uid() = user_id);

create index if not exists idx_savings_user_id on public.savings(user_id);
