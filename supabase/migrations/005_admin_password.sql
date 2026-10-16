begin;
create table private.map_admin_access (
 singleton boolean primary key default true check(singleton),
 password_hash text not null
);
insert into private.map_admin_access(singleton,password_hash)
values(true,extensions.crypt('1111',extensions.gen_salt('bf',8)));
revoke all on private.map_admin_access from public,anon,authenticated;
-- Move unprotected endpoints out of the exposed API schema.
alter function public.map_admin_teams(uuid) set schema private;
alter function private.map_admin_teams(uuid) rename to map_admin_teams_data;
alter function public.map_admin_reset(uuid) set schema private;
alter function private.map_admin_reset(uuid) rename to map_admin_reset_data;
revoke all on function private.map_admin_teams_data(uuid),private.map_admin_reset_data(uuid) from public,anon,authenticated;
create function private.map_require_admin_password(p_password text) returns void
language plpgsql security definer set search_path='' as $$
declare v_hash text;
begin
 select password_hash into v_hash from private.map_admin_access where singleton;
 if p_password is null or length(p_password)>100 or v_hash is null or extensions.crypt(p_password,v_hash)<>v_hash then
  raise exception 'INVALID_ADMIN_PASSWORD';
 end if;
end;
$$;
revoke all on function private.map_require_admin_password(text) from public,anon,authenticated;
create function public.map_admin_teams(p_event uuid,p_password text) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform private.map_require_admin_password(p_password);
 return private.map_admin_teams_data(p_event);
end;
$$;
create function public.map_admin_reset(p_event uuid,p_password text) returns integer
language plpgsql security definer set search_path='' as $$
begin
 perform private.map_require_admin_password(p_password);
 return private.map_admin_reset_data(p_event);
end;
$$;
revoke all on function public.map_admin_teams(uuid,text),public.map_admin_reset(uuid,text) from public;
grant execute on function public.map_admin_teams(uuid,text),public.map_admin_reset(uuid,text) to anon,authenticated;
commit;
