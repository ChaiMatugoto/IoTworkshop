import { parseTeamDetails } from './lib/teamDetails';
import test from 'node:test';
import assert from 'node:assert/strict';
import { parseTeam, serverError } from './lib/cloudContract';
import { generateTaskCodes } from '../scripts/taskCodes';
import { issues } from './data/issues';
test('cloud team contract accepts authoritative progress and rejects malformed responses',()=>{
 const team={id:'team',team_name:'街チーム',completed:[issues[0].id],total_points:10,updated_at:'2026-10-12T00:00:00Z'};
 assert.deepEqual(parseTeam(team),team);
 for(const v of [null,{}, {...team,completed:null},{...team,completed:[123]},{...team,total_points:NaN},{...team,total_points:'10'}])assert.throws(()=>parseTeam(v));
});
test('server errors provide actionable Japanese messages',()=>{
 assert.match(serverError('INVALID_PASSWORD'),/パスワード/);assert.match(serverError('RATE_LIMIT'),/1分/);assert.match(serverError('FORBIDDEN'),/権限/);assert.match(serverError('unknown'),/接続/);
});
test('operator codes cover all tasks with distinct four digit values',()=>{
 const codes=generateTaskCodes();
 assert.deepEqual(Object.keys(codes).sort(),issues.map(i=>i.id).sort());assert.equal(new Set(Object.values(codes)).size,13);for(const code of Object.values(codes))assert.match(code,/^\d{4}$/);
});

test('team history validates timestamps and entry metadata',()=>{
 const details={team_id:'a',team_name:'班',entries:[{task_id:'l1-noise',title:'騒音',level:1,points:10,completed_at:'2026-10-17T01:00:00Z'}]};
 assert.deepEqual(parseTeamDetails(details),details);assert.equal(parseTeamDetails({...details,entries:[]}).entries.length,0);
 for(const value of [null,{}, {...details,entries:[null]},{...details,entries:[{...details.entries[0],completed_at:'bad'}]},{...details,entries:[{...details.entries[0],level:4}]}])assert.throws(()=>parseTeamDetails(value));
});

import { createParticipantRequests } from './lib/participantRequests';
import type { SupabaseClient } from '@supabase/supabase-js';
test('participant requests renew before expiry and after 401 without reload or a new identity', async()=>{
 let renewals=0, signups=0, time=0, calls=0;
 let rejectOnce=false, failRefresh=false;
 const session={user:{id:'existing-team-user'},expires_at:9999999999};
 const client={auth:{
  getSession:async()=>({data:{session},error:null}),
  refreshSession:async()=>{renewals++;return {data:{session:failRefresh?null:session},error:failRefresh?new Error('offline'):null};},
  signInAnonymously:async()=>{signups++;throw new Error('must not replace identity');},
 },rpc:async(name:string)=>{calls++;if(rejectOnce){rejectOnce=false;return {status:401,error:{code:'PGRST301'},data:null};}return {status:200,error:null,data:{name,user:session.user.id}};}} as unknown as SupabaseClient;
 const request=createParticipantRequests(client,()=>time);
 const initial=await Promise.all(Array.from({length:4},()=>request('map_my_team',{})));
 assert.equal(renewals,1);assert.equal(signups,0);assert.ok(initial.every(r=>r.status===200));
 time=300001;
 await request('map_my_team',{});assert.equal(renewals,2);
 rejectOnce=true;
 const recovered=await request('map_redeem',{});
 assert.equal(recovered.status,200);assert.equal(renewals,3);assert.equal(calls,7);assert.equal(signups,0);
 failRefresh=true;time+=300001;
 await assert.rejects(request('map_my_team',{}),/offline/);
 failRefresh=false;
 assert.equal((await request('map_my_team',{})).status,200);
 assert.equal(signups,0);
});
