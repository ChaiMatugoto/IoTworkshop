import test from 'node:test';
import assert from 'node:assert/strict';
import { fresh, points, restore } from './storage';
import { issues } from './data/issues';
import { canWalk, move, START, river, bridges } from './data/map';
test('thirteen public tasks have correct points without password exposure',()=>{
 assert.equal(issues.length,13);assert.equal(new Set(issues.map(i=>i.id)).size,13);
 for(const [level,count,score] of [[1,7,10],[2,4,25],[3,2,40]]){const group=issues.filter(i=>i.level===level);assert.equal(group.length,count);for(const i of group){assert.equal(i.points,score);assert.equal('password' in i,false);}}
});
test('legacy local progress totals derive from unique valid IDs and survive reload',()=>{const s=restore(JSON.stringify({...fresh(),completed:issues.map(i=>i.id)}));assert.equal(points(s),250);assert.deepEqual(restore(JSON.stringify(s)),s);assert.equal(points(fresh()),0);});
test('corrupt saves and duplicate, unknown, or retired task IDs are safe',()=>{
 for(const raw of ['{','null','{}','{"version":3}'])assert.deepEqual(restore(raw),fresh());const s=restore(JSON.stringify({version:2,completed:[issues[0].id,issues[0].id,'unknown','lighting','traffic'],answers:{},position:{x:river.x+50,y:100}}));assert.equal(points(s),10);assert.deepEqual(s.position,START);
 const old=restore(JSON.stringify({version:2,completed:['lighting','traffic','heat','flood','waste'],position:START}));assert.equal(points(old),0);assert.deepEqual(old.position,START);
});
test('buildings and river block walking; both bridges allow passage',()=>{assert.equal(canWalk({x:130,y:150}),false);assert.equal(canWalk({x:river.x+50,y:200}),false);assert.equal(canWalk({x:-2,y:600}),false);const edge={x:river.x-15,y:200};assert.deepEqual(move(edge,30,0),edge);for(const b of bridges){const p={x:river.x-15,y:b.y+b.h/2};assert.equal(canWalk({x:river.x+50,y:p.y}),true);assert.deepEqual(move(p,30,0),{x:p.x+30,y:p.y});}});
test('task markers are separated enough that interaction zones do not overlap',()=>{for(let a=0;a<issues.length;a++)for(let b=a+1;b<issues.length;b++)assert.ok(Math.hypot(issues[a].x-issues[b].x,issues[a].y-issues[b].y)>=240,`${issues[a].id} and ${issues[b].id} are too close`);});
test('every task can be reached from start via walkable ground and the bridge',()=>{
 const queue=[START];const visited=new Set([`${START.x},${START.y}`]);
 for(let n=0;n<queue.length;n++){const p=queue[n];for(const [dx,dy] of [[5,0],[-5,0],[0,5],[0,-5]]){const next={x:p.x+dx,y:p.y+dy};const key=`${next.x},${next.y}`;if(!visited.has(key)&&canWalk(next)){visited.add(key);queue.push(next);}}}
 for(const i of issues){assert.ok(canWalk(i),`marker ${i.id} is on walkable ground`);assert.ok(queue.some(p=>Math.hypot(i.x-p.x,i.y-p.y)<20),`task ${i.id} is reachable`);}
});
test('team name survives reload, validates legacy data, and resets with progress',()=>{const s={...fresh(),completed:[issues[0].id],teamName:'こもれびチーム'};assert.deepEqual(restore(JSON.stringify(s)),s);assert.equal(restore(JSON.stringify({...s,teamName:'  街チーム  '})).teamName,'街チーム');assert.equal(restore(JSON.stringify({...s,teamName:123})).teamName,'');assert.equal(restore(JSON.stringify({...s,teamName:'a'.repeat(50)})).teamName.length,30);assert.equal(fresh().teamName,'');assert.equal(points(fresh()),0);});
