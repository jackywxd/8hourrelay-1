-- https://supabase.com/docs/guides/auth/managing-user-data

drop trigger if exists on_auth_user_created on auth.users;

drop function if exists handle_new_user;

----------------------------------------------------------------

create or replace function handle_new_user()
returns trigger
security definer set search_path = public
as $function$
begin
  insert into "8hourrelay_dev_users" (uid, email, "avatarUrl")
  select
    new.id,
    new.email,
    coalesce(
      jsonb_extract_path_text(new.raw_user_meta_data,'photoURL'),
      jsonb_extract_path_text(new.raw_user_meta_data,'avatar_url'),
      jsonb_extract_path_text(new.raw_user_meta_data,'fbuser','photoURL'),
      NULL
    ) as "avatarUrl";

  return NEW;
end;
$function$ 
language plpgsql;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();
