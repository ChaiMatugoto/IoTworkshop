import { issues, type Point } from './data/issues';
import { canWalk, START } from './data/map';
export const STORAGE_KEY='urban-issue-map:v1';
export type Save={version:2;teamName:string;completed:string[];answers:Record<string,string>;position:Point};
export const fresh=():Save=>({version:2,teamName:'',completed:[],answers:{},position:{...START}});
export function restore(raw:string|null):Save{
 if(!raw)return fresh();
 try{const v=JSON.parse(raw);if(!v||(v.version!==1&&v.version!==2))return fresh();
 const answers:Record<string,string>={};for(const i of issues){if(typeof v.answers?.[i.id]==='string')answers[i.id]=v.answers[i.id];}
 // Previous answer-only completions do not award password-based points.
 const completed=v.version===2?issues.filter(i=>Array.isArray(v.completed)&&v.completed.includes(i.id)).map(i=>i.id):[];
 const p=v.position;const position=p&&Number.isFinite(p.x)&&Number.isFinite(p.y)&&canWalk(p)?{x:p.x,y:p.y}:{...START};
 const teamName=typeof v.teamName==='string'?v.teamName.trim().slice(0,30):'';
 return {version:2,teamName,completed,answers,position};}catch{return fresh();}
}
export function submit(s:Save,id:string,answer:string):Save{
 if(!answer.trim()||!issues.some(i=>i.id===id))return s;
 return {...s,answers:{...s.answers,[id]:answer.trim()}};
}
export const points=(s:Save)=>issues.filter(i=>s.completed.includes(i.id)).reduce((sum,i)=>sum+i.points,0);
