export type CompletionEntry={task_id:string;title:string;level:1|2|3;points:number;completed_at:string};
export type TeamDetails={team_id:string;team_name:string;entries:CompletionEntry[]};
export function parseTeamDetails(value:unknown):TeamDetails{
 const data=value as TeamDetails;
 if(!data||typeof data.team_id!=='string'||typeof data.team_name!=='string'||!Array.isArray(data.entries)||!data.entries.every(e=>e&&typeof e.task_id==='string'&&typeof e.title==='string'&&[1,2,3].includes(e.level)&&Number.isSafeInteger(e.points)&&e.points>=0&&typeof e.completed_at==='string'&&Number.isFinite(Date.parse(e.completed_at))))throw new Error('詳細データの形式を確認できませんでした。');
 return data;
}
