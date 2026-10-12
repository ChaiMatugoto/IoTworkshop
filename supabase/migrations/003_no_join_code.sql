begin;
-- Replace the old registration endpoint, removing participation-code validation.
drop function if exists public.map_register(uuid,text,text);
create or replace function public.map_register(p_event uuid,p_name text) returns jsonb
language plpgsql security definer set search_path='' as $$
declare v_id uuid;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if p_name is null or length(btrim(p_name)) not between 1 and 30 then
  return jsonb_build_object('error','INVALID_NAME');
 end if;
 if not exists(select 1 from private.map_events where id=p_event and active) then
  return jsonb_build_object('error','EVENT_CLOSED');
 end if;
 insert into public.map_teams(event_id,user_id,team_name)
 values(p_event,auth.uid(),btrim(p_name))
 on conflict(event_id,user_id) do nothing returning id into v_id;
 if v_id is null then select id into v_id from public.map_teams where event_id=p_event and user_id=auth.uid(); end if;
 return private.map_snapshot(v_id);
end;
$$;
revoke all on function public.map_register(uuid,text) from public,anon;
grant execute on function public.map_register(uuid,text) to authenticated;
commit;
