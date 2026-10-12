begin;
create schema if not exists private;
create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;
create table private.map_events (id uuid primary key default gen_random_uuid(), name text not null, join_hash text not null, active boolean not null default true);
create table private.map_admins (event_id uuid references private.map_events on delete cascade, user_id uuid references auth.users on delete cascade, primary key(event_id,user_id));
create table public.map_tasks (id text primary key, title text not null, level integer not null check(level between 1 and 3), points integer not null check(points in (10,25,40)));
create table private.map_passwords (task_id text primary key references public.map_tasks, password_hash text not null);
create table public.map_teams (id uuid primary key default gen_random_uuid(), event_id uuid not null references private.map_events, user_id uuid not null references auth.users, team_name text not null check(length(btrim(team_name)) between 1 and 30), updated_at timestamptz not null default now(), unique(event_id,user_id));
create table public.map_completions (team_id uuid references public.map_teams on delete cascade, task_id text references public.map_tasks, completed_at timestamptz not null default now(), primary key(team_id,task_id));
create table private.map_attempts (user_id uuid primary key references auth.users on delete cascade, window_start timestamptz not null default now(), failures integer not null default 0);
create table private.map_code_attempts (team_id uuid primary key references public.map_teams on delete cascade, window_start timestamptz not null default now(), failures integer not null default 0);

create function private.map_is_admin(p_event uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from private.map_admins where event_id=p_event and user_id=auth.uid()) and coalesce((auth.jwt()->>'is_anonymous')::boolean,false)=false;
$$;
create function private.map_snapshot(p_team uuid) returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('id',t.id,'team_name',t.team_name,'updated_at',t.updated_at,'completed',coalesce((select jsonb_agg(c.task_id order by c.completed_at) from public.map_completions c where c.team_id=t.id),'[]'::jsonb),'total_points',coalesce((select sum(q.points) from public.map_completions c join public.map_tasks q on q.id=c.task_id where c.team_id=t.id),0)) from public.map_teams t where t.id=p_team and (t.user_id=auth.uid() or private.map_is_admin(t.event_id));
$$;
alter table public.map_tasks enable row level security;
alter table public.map_teams enable row level security;
alter table public.map_completions enable row level security;
create policy tasks_read on public.map_tasks for select to authenticated using(true);
create policy teams_read on public.map_teams for select to authenticated using(user_id=auth.uid() or private.map_is_admin(event_id));
create policy completions_read on public.map_completions for select to authenticated using(exists(select 1 from public.map_teams t where t.id=team_id));
revoke all on all tables in schema private from public,anon,authenticated;
revoke all on public.map_teams,public.map_tasks,public.map_completions from anon,authenticated;
grant select on public.map_teams,public.map_tasks,public.map_completions to authenticated;
revoke all on all functions in schema private from public,anon,authenticated;
grant usage on schema private to authenticated;
grant execute on function private.map_is_admin(uuid) to authenticated;

create function public.map_my_team(p_event uuid) returns jsonb language sql stable security definer set search_path='' as $$
 select private.map_snapshot(id) from public.map_teams where event_id=p_event and user_id=auth.uid();
$$;
create function public.map_register(p_event uuid,p_name text,p_join_code text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_hash text; v_id uuid; v_fail private.map_attempts;
begin
 if auth.uid() is null then raise exception 'AUTH_REQUIRED'; end if;
 if length(btrim(p_name)) not between 1 and 30 or p_name is null then return jsonb_build_object('error','INVALID_NAME'); end if;
 select id into v_id from public.map_teams where event_id=p_event and user_id=auth.uid();
 if v_id is not null then return private.map_snapshot(v_id); end if;
 insert into private.map_attempts(user_id) values(auth.uid()) on conflict do nothing;
 select * into v_fail from private.map_attempts where user_id=auth.uid() for update;
 if v_fail.window_start<now()-interval '1 minute' then update private.map_attempts set window_start=now(),failures=0 where user_id=auth.uid(); v_fail.failures:=0; end if;
 if v_fail.failures>=5 then return jsonb_build_object('error','RATE_LIMIT'); end if;
 select join_hash into v_hash from private.map_events where id=p_event and active;
 if v_hash is null or p_join_code is null or length(p_join_code)>100 or extensions.crypt(p_join_code,v_hash)<>v_hash then
  update private.map_attempts set failures=failures+1 where user_id=auth.uid(); return jsonb_build_object('error','INVALID_JOIN_CODE');
 end if;
 insert into public.map_teams(event_id,user_id,team_name) values(p_event,auth.uid(),btrim(p_name)) on conflict(event_id,user_id) do nothing returning id into v_id;
 if v_id is null then select id into v_id from public.map_teams where event_id=p_event and user_id=auth.uid(); end if;
 return private.map_snapshot(v_id);
end;
$$;
create function public.map_redeem(p_team uuid,p_task text,p_password text) returns jsonb language plpgsql security definer set search_path='' as $$
declare v_team public.map_teams; v_hash text; v_fail private.map_code_attempts;
begin
 select * into v_team from public.map_teams where id=p_team and user_id=auth.uid() for update;
 if not found then raise exception 'FORBIDDEN'; end if;
 if not exists(select 1 from private.map_events where id=v_team.event_id and active) then return jsonb_build_object('error','EVENT_CLOSED'); end if;
 if exists(select 1 from public.map_completions where team_id=p_team and task_id=p_task) then return private.map_snapshot(p_team); end if;
 insert into private.map_code_attempts(team_id) values(p_team) on conflict do nothing;
 select * into v_fail from private.map_code_attempts where team_id=p_team for update;
 if v_fail.window_start<now()-interval '1 minute' then update private.map_code_attempts set window_start=now(),failures=0 where team_id=p_team; v_fail.failures:=0; end if;
 if v_fail.failures>=5 then return jsonb_build_object('error','RATE_LIMIT'); end if;
 select password_hash into v_hash from private.map_passwords where task_id=p_task;
 if v_hash is null or p_password is null or p_password!~'^[0-9]{4}$' or extensions.crypt(p_password,v_hash)<>v_hash then
  update private.map_code_attempts set failures=failures+1 where team_id=p_team; return jsonb_build_object('error','INVALID_PASSWORD');
 end if;
 insert into public.map_completions(team_id,task_id) values(p_team,p_task) on conflict do nothing;
 update public.map_teams set updated_at=now() where id=p_team;
 return private.map_snapshot(p_team);
end;
$$;
create function public.map_reset(p_team uuid) returns boolean language plpgsql security definer set search_path='' as $$
begin
 perform 1 from public.map_teams where id=p_team and user_id=auth.uid() for update;
 if not found then raise exception 'FORBIDDEN'; end if;
 delete from public.map_completions where team_id=p_team;
 update public.map_teams set updated_at=now() where id=p_team;
 return true;
end;
$$;
create function public.map_admin_teams(p_event uuid) returns jsonb language plpgsql stable security definer set search_path='' as $$
begin
 if not private.map_is_admin(p_event) then raise exception 'FORBIDDEN'; end if;
 return coalesce((select jsonb_agg(private.map_snapshot(id) order by team_name,id) from public.map_teams where event_id=p_event),'[]'::jsonb);
end;
$$;
revoke all on function public.map_my_team(uuid),public.map_register(uuid,text,text),public.map_redeem(uuid,text,text),public.map_reset(uuid),public.map_admin_teams(uuid) from public,anon;
grant execute on function public.map_my_team(uuid),public.map_register(uuid,text,text),public.map_redeem(uuid,text,text),public.map_reset(uuid),public.map_admin_teams(uuid) to authenticated;
do $$ begin
 if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='map_teams') then alter publication supabase_realtime add table public.map_teams; end if;
end $$;
commit;
