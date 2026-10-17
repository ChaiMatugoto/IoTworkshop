begin;
create or replace function public.map_admin_complete(p_event uuid,p_team uuid,p_task text,p_password text) returns jsonb
language plpgsql security definer set search_path='' as $$
begin
 perform private.map_require_admin_password(p_password);
 perform 1 from public.map_teams where id=p_team and event_id=p_event for update;
 if not found then raise exception 'TEAM_NOT_FOUND'; end if;
 if not exists(select 1 from private.map_events where id=p_event and active) then raise exception 'EVENT_CLOSED'; end if;
 if not exists(select 1 from public.map_tasks where id=p_task) then raise exception 'INVALID_TASK'; end if;
 insert into public.map_completions(team_id,task_id) values(p_team,p_task) on conflict do nothing;
 if found then update public.map_teams set updated_at=now() where id=p_team; end if;
 return (select value from jsonb_array_elements(private.map_admin_teams_data(p_event)) where value->>'id'=p_team::text);
end;
$$;
revoke all on function public.map_admin_complete(uuid,uuid,text,text) from public;
grant execute on function public.map_admin_complete(uuid,uuid,text,text) to anon,authenticated;
commit;
