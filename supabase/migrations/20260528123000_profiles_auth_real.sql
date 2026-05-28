alter table public.profiles
  add column if not exists account_type text default 'PF' check (account_type in ('PF', 'PJ'));

alter table public.profiles
  add column if not exists business_name text;

alter table public.profiles
  add column if not exists username text unique;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    name,
    username,
    account_type,
    business_name
  )
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'username',
    coalesce(new.raw_user_meta_data->>'account_type', 'PF'),
    new.raw_user_meta_data->>'business_name'
  )
  on conflict (id) do update
    set name = excluded.name,
        username = excluded.username,
        account_type = excluded.account_type,
        business_name = excluded.business_name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());
