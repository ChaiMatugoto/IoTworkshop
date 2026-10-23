import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFileSync, readdirSync } from 'node:fs';
import { issues } from '../../src/data/issues';

// Concurrent application requests, serialized by PGlite's transaction queue.
// This tests production SQL and identity isolation, not network/Auth capacity.
test('five concurrent simulated teams remain isolated and score each task once', async () => {
 const db = new PGlite();
 const event = '10000000-0000-0000-0000-000000000005';
 try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create schema extensions;
   create table auth.users(id uuid primary key);
   create function auth.uid() returns uuid language sql as $$select nullif(current_setting('test.uid',true),'')::uuid$$;
   create function auth.jwt() returns jsonb language sql as $$select '{"is_anonymous":true}'::jsonb$$;
   create function extensions.gen_salt(text,integer) returns text language sql as $$select 'salt'::text$$;
   create function extensions.crypt(text,text) returns text language sql as $$select $1$$;
   grant usage on schema public,auth to authenticated;`);
  const directory = new URL('../migrations/', import.meta.url);
  for (const file of readdirSync(directory).filter(f=>f.endsWith('.sql')).sort()) {
   let sql=readFileSync(new URL(file,directory),'utf8');
   if(file.startsWith('001')) sql=sql.replace('create extension if not exists pgcrypto with schema extensions;','').replace(/do \$\$ begin[\s\S]*?end \$\$;/,'');
   await db.exec(sql);
  }
  await db.query('insert into private.map_events(id,name,join_hash) values($1,$2,$3)',[event,'Five simulated PCs','TEST']);
  for(const issue of issues){
   await db.query('insert into public.map_tasks(id,title,level,points) values($1,$2,$3,$4)',[issue.id,issue.title,issue.level,issue.points]);
   await db.query('insert into private.map_passwords values($1,$2)',[issue.id,'2468']);
  }
  const users=Array.from({length:5},(_,i)=>`00000000-0000-0000-0000-${String(i+1).padStart(12,'0')}`);
  for(const id of users) await db.query('insert into auth.users values($1)',[id]);
  const call=(uid:string,expression:string,args:unknown[])=>db.transaction(async tx=>{
   await tx.query("select set_config('test.uid',$1,true)",[uid]);
   await tx.exec('set local role authenticated');
   return (await tx.query<{v:any}>(`select ${expression} as v`,args)).rows[0].v;
  });
  const teams=await Promise.all(users.map((uid,i)=>call(uid,'public.map_register($1,$2)',[event,`テスト班${i+1}`])));
  assert.equal(new Set(teams.map(t=>t.id)).size,5);
  await Promise.all(users.map(async(uid,i)=>{
   for(const issue of issues.slice(0,i+1)) {
    await Promise.all(Array.from({length:3},()=>call(uid,'public.map_redeem($1,$2,$3)',[teams[i].id,issue.id,'2468'])));
   }
  }));
  const snapshots=await Promise.all(users.map(uid=>call(uid,'public.map_my_team($1)',[event])));
  snapshots.forEach((team,i)=>{
   assert.equal(team.id,teams[i].id);
   assert.equal(team.team_name,`テスト班${i+1}`);
   assert.equal(team.completed.length,i+1);
   assert.equal(team.total_points,issues.slice(0,i+1).reduce((sum,q)=>sum+q.points,0));
  });
  await Promise.all(users.map((uid,i)=>assert.rejects(call(uid,'public.map_redeem($1,$2,$3)',[teams[(i+1)%5].id,issues[0].id,'2468']),/FORBIDDEN/)));
  const admin=(await db.query<{v:any}>('select public.map_admin_teams($1,$2) as v',[event,'1111'])).rows[0].v;
  assert.equal(admin.length,5);
  assert.equal(admin.reduce((sum:number,t:any)=>sum+t.total_points,0),150);
 } finally {await db.close();}
});
