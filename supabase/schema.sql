-- YashilKoʻz: dala jurnali jadvali.
-- Supabase → SQL Editor ga toʻliq qoʻyib, "Run" bosing.

create table if not exists public.journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  crop_hint text,
  note text,
  result jsonb not null,
  thumb text
);

create index if not exists journal_user_created_idx on public.journal (user_id, created_at desc);

-- Har bir foydalanuvchi faqat oʻz yozuvlarini koʻradi, qoʻshadi va oʻchiradi.
alter table public.journal enable row level security;

drop policy if exists "journal_select_own" on public.journal;
create policy "journal_select_own" on public.journal
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "journal_insert_own" on public.journal;
create policy "journal_insert_own" on public.journal
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "journal_delete_own" on public.journal;
create policy "journal_delete_own" on public.journal
  for delete to authenticated using (auth.uid() = user_id);
