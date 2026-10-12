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
