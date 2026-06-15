create or replace function public.claim_admin_access()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text;
  has_any_admin boolean;
begin
  if auth.uid() is null then
    return false;
  end if;

  select coalesce(auth.jwt() ->> 'email', '') into current_email;

  if exists(select 1 from public.admin_users where user_id = auth.uid()) then
    return true;
  end if;

  select exists(select 1 from public.admin_users) into has_any_admin;

  if not has_any_admin then
    insert into public.admin_users (user_id, email)
    values (auth.uid(), current_email)
    on conflict (email) do update
      set user_id = excluded.user_id;

    return true;
  end if;

  if current_email <> '' then
    update public.admin_users
    set user_id = auth.uid()
    where email = current_email;
  end if;

  return exists(select 1 from public.admin_users where user_id = auth.uid());
end;
$$;
