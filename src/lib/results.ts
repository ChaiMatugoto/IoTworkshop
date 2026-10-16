import type { RemoteTeam } from './cloudContract';
export type RankedTeam=RemoteTeam&{rank:number};
export type ResultSlide={kind:'intro'}|{kind:'rank'|'team'|'score';team:RankedTeam}|{kind:'summary';teams:RankedTeam[];page:number;pages:number};
export function rankTeams(teams:RemoteTeam[]):RankedTeam[]{
 let rank=0;let previous:number|undefined;
 return [...teams].sort((a,b)=>b.total_points-a.total_points||a.team_name.localeCompare(b.team_name,'ja')||a.id.localeCompare(b.id)).map((team,index)=>{if(team.total_points!==previous)rank=index+1;previous=team.total_points;return {...team,completed:[...team.completed],rank};});
}
export function buildResultSlides(teams:RemoteTeam[]):ResultSlide[]{
 const ranked=rankTeams(teams);const slides:ResultSlide[]=[{kind:'intro'}];
 const ranks=[...new Set(ranked.map(t=>t.rank))].reverse();
 for(const rank of ranks)for(const team of ranked.filter(t=>t.rank===rank))for(const kind of ['rank','team','score'] as const)slides.push({kind,team});
 const pages=Math.ceil(ranked.length/8);
 for(let page=0;page<pages;page++)slides.push({kind:'summary',teams:ranked.slice(page*8,page*8+8),page:page+1,pages});
 return slides;
}
