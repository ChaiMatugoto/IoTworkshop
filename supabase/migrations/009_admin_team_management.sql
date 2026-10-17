begin;
create or replace function public.map_admin_reset_team(p_event uuid,p_team uuid,p_password text) returns boolean
language plpgsql security definer set search_path='' as $$
begin
 perform private.map_require_admin_password(p_password);
 delete from public.map_teams where id=p_team and event_id=p_event;
 return found;
end;
$$;
create or replace function public.map_admin_rename_team(p_event uuid,p_team uuid,p_name text,p_password text) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform private.map_require_admin_password(p_password);
 if p_name is null or length(btrim(p_name)) not between 1 and 30 then raise exception 'INVALID_NAME'; end if;
 update public.map_teams set team_name=btrim(p_name),updated_at=now() where id=p_team and event_id=p_event;
 if not found then raise exception 'TEAM_NOT_FOUND'; end if;
 return (select value from jsonb_array_elements(private.map_admin_teams_data(p_event)) where value->>'id'=p_team::text);
end;
$$;
revoke all on function public.map_admin_reset_team(uuid,uuid,text),public.map_admin_rename_team(uuid,uuid,text,text) from public;
grant execute on function public.map_admin_reset_team(uuid,uuid,text),public.map_admin_rename_team(uuid,uuid,text,text) to anon,authenticated;
commit;
