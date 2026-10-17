begin;
create or replace function public.map_admin_team_details(p_event uuid,p_team uuid,p_password text) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare v_team public.map_teams;
begin
 perform private.map_require_admin_password(p_password);
 select * into v_team from public.map_teams where id=p_team and event_id=p_event;
 if not found then raise exception 'TEAM_NOT_FOUND'; end if;
 return jsonb_build_object('team_id',v_team.id,'team_name',v_team.team_name,
  'entries',coalesce((select jsonb_agg(jsonb_build_object('task_id',c.task_id,'title',q.title,'level',q.level,'points',q.points,'completed_at',c.completed_at) order by c.completed_at,c.task_id)
   from public.map_completions c join public.map_tasks q on q.id=c.task_id where c.team_id=p_team),'[]'::jsonb));
end;
$$;
revoke all on function public.map_admin_team_details(uuid,uuid,text) from public;
grant execute on function public.map_admin_team_details(uuid,uuid,text) to anon,authenticated;
commit;
