import { randomUUID } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { issues } from '../src/data/issues';
import { generateTaskCodes } from './taskCodes';
if(existsSync('supabase/seed.local.sql')||existsSync('supabase/codes.local.md'))throw new Error('既存の開催回ファイルがあります。新規開催回が必要な場合は運営用ファイルを別の場所に保管してから実行してください。');
if(!existsSync('scripts/task-codes.json'))writeFileSync('scripts/task-codes.json',JSON.stringify(generateTaskCodes(),null,2)+'\n',{mode:0o600});
const codes=JSON.parse(readFileSync(new URL('./task-codes.json',import.meta.url),'utf8')) as Record<string,string>;
const eventId=randomUUID();
const quote=(s:string)=>`'${s.replaceAll("'","''")}'`;
const sql=['begin;',`insert into private.map_events(id,name,join_hash) values('${eventId}','都市課題マップ WS','unused');`];
for(const i of issues){const code=codes[i.id];if(!/^\d{4}$/.test(code))throw new Error(`Invalid code: ${i.id}`);sql.push(`insert into public.map_tasks(id,title,level,points) values(${quote(i.id)},${quote(i.title)},${i.level},${i.points}) on conflict(id) do update set title=excluded.title,level=excluded.level,points=excluded.points;`,`insert into private.map_passwords(task_id,password_hash) values(${quote(i.id)},extensions.crypt('${code}',extensions.gen_salt('bf',8))) on conflict(task_id) do update set password_hash=excluded.password_hash;`);}
sql.push('commit;');writeFileSync('supabase/seed.local.sql',sql.join('\n')+'\n',{mode:0o600});
writeFileSync('supabase/codes.local.md',`# 運営用コード一覧\n\n開催回ID: ${eventId}\n\n| 課題 | コード |\n| --- | --- |\n`+issues.map(i=>`| ${i.label} | ${codes[i.id]} |`).join('\n')+'\n',{mode:0o600});
console.log('supabase/seed.local.sql と supabase/codes.local.md を作成しました。開催回IDは codes.local.md で確認してください。');
