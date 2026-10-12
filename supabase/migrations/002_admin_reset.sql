begin;
create or replace function public.map_admin_reset(p_event uuid) returns integer
language plpgsql security definer set search_path='' as $$
declare v_count integer;
begin
 if not private.map_is_admin(p_event) then raise exception 'FORBIDDEN'; end if;
 -- Serialize registration and completion changes while removing this event's teams.
 lock table public.map_teams in share row exclusive mode;
 delete from public.map_teams where event_id=p_event;
 get diagnostics v_count = row_count;
 return v_count;
end;
$$;
revoke all on function public.map_admin_reset(uuid) from public,anon;
grant execute on function public.map_admin_reset(uuid) to authenticated;
commit;
