import type { RemoteTeam } from './cloudContract';
import { issues } from '../data/issues';
export type RankedTeam=RemoteTeam&{rank:number};
export type ResultSlide={kind:'intro'}|{kind:'rank'|'result';team:RankedTeam};
export function rankTeams(teams:RemoteTeam[]):RankedTeam[]{
 let rank=0;let previous:number|undefined;
 return [...teams].sort((a,b)=>b.total_points-a.total_points||a.team_name.localeCompare(b.team_name,'ja')||a.id.localeCompare(b.id)).map((team,index)=>{if(team.total_points!==previous)rank=index+1;previous=team.total_points;return {...team,completed:[...team.completed],rank};});
}
export function levelCompletions(completed:string[]){
 const done=new Set(completed);
 return ([1,2,3] as const).map(level=>({level,count:issues.filter(i=>i.level===level&&done.has(i.id)).length,total:issues.filter(i=>i.level===level).length}));
}
export function buildResultSlides(teams:RemoteTeam[]):ResultSlide[]{
 const ranked=rankTeams(teams);const slides:ResultSlide[]=[{kind:'intro'}];
 const ranks=[...new Set(ranked.map(t=>t.rank))].reverse();
 for(const rank of ranks)for(const team of ranked.filter(t=>t.rank===rank))slides.push({kind:'rank',team},{kind:'result',team});
 return slides;
}
