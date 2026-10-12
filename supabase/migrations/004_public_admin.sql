begin;
-- Deliberately public administration, as requested by the workshop operator.
create or replace function public.map_admin_teams(p_event uuid) returns jsonb
language sql stable security definer set search_path='' as $$
 select coalesce(jsonb_agg(jsonb_build_object(
  'id',t.id,'team_name',t.team_name,'updated_at',t.updated_at,
  'completed',coalesce((select jsonb_agg(c.task_id order by c.completed_at) from public.map_completions c where c.team_id=t.id),'[]'::jsonb),
  'total_points',coalesce((select sum(q.points) from public.map_completions c join public.map_tasks q on q.id=c.task_id where c.team_id=t.id),0)
 ) order by t.team_name,t.id),'[]'::jsonb)
 from public.map_teams t where t.event_id=p_event;
$$;
create or replace function public.map_admin_reset(p_event uuid) returns integer
language plpgsql security definer set search_path='' as $$
declare v_count integer;
begin
 lock table public.map_teams in share row exclusive mode;
 delete from public.map_teams where event_id=p_event;
 get diagnostics v_count = row_count;
 return v_count;
end;
$$;
revoke all on function public.map_admin_teams(uuid),public.map_admin_reset(uuid) from public;
grant execute on function public.map_admin_teams(uuid),public.map_admin_reset(uuid) to anon,authenticated;
commit;
