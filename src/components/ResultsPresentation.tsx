import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { admin, eventId, parseTeam, type RemoteTeam } from '../lib/cloud';
import { buildResultSlides, levelCompletions } from '../lib/results';
import '../results.css';
export default function ResultsPresentation(){
 const [teams,setTeams]=useState<RemoteTeam[]>([]);
 const [loading,setLoading]=useState(true);
 const [error,setError]=useState('');
 const [index,setIndex]=useState(0);
 const root=useRef<HTMLDivElement>(null);
 const slides=useMemo(()=>buildResultSlides(teams),[teams]);
 const slide=slides[index]||slides[0];
 const ready=!loading&&!error&&teams.length>0;
 useEffect(()=>{
  let active=true;
  (async()=>{try{
   if(!admin)throw new Error('共有サーバーが未設定です。');
   const {data,error}=await admin.rpc('map_admin_teams',{p_event:eventId});
   if(error)throw new Error('結果を取得できませんでした。接続を確認して再読み込みしてください。');
   if(!Array.isArray(data))throw new Error('結果の形式を確認できませんでした。');
   const next=data.map(parseTeam);if(active)setTeams(next);
  }catch(e){if(active)setError(e instanceof Error?e.message:'結果を取得できませんでした。');}
  finally{if(active)setLoading(false);}})();
  return()=>{active=false;};
 },[]);
 const next=useCallback(()=>{if(ready)setIndex(i=>Math.min(i+1,slides.length-1));},[ready,slides.length]);
 const previous=useCallback(()=>setIndex(i=>Math.max(0,i-1)),[]);
 const fullscreen=useCallback(async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await root.current?.requestFullscreen?.();}catch{/* Browser fullscreen remains available. */}},[]);
 useEffect(()=>{
  const handle=(e:KeyboardEvent)=>{
   if(e.altKey||e.ctrlKey||e.metaKey||e.isComposing||e.repeat)return;
   if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable]'))return;
   if(['ArrowRight','ArrowDown','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();next();}
   else if(['ArrowLeft','ArrowUp','PageUp','Backspace'].includes(e.key)){e.preventDefault();previous();}
   else if(e.key==='Home'){e.preventDefault();setIndex(0);}
   else if(e.key.toLowerCase()==='f'){e.preventDefault();void fullscreen();}
  };
  window.addEventListener('keydown',handle);return()=>window.removeEventListener('keydown',handle);
 },[next,previous,fullscreen]);
 return <div className="results-show" ref={root} onClick={next}>
  <main className="results-stage" aria-label="結果発表スライド">
   <div className="results-ambient" aria-hidden="true"/>
   <section className={`results-slide results-slide-${slide.kind}`} key={index} aria-live="polite" aria-atomic="true">
    {slide.kind==='intro'?<>
     <h1 className="results-title">結果発表</h1>
     {loading?<p className="results-status" role="status">結果を取得しています…</p>:error?<p className="results-status" role="alert">{error}</p>:!teams.length?<p className="results-status">参加チームはまだありません。</p>:null}
    </>:slide.kind==='rank'?<h1 className={`results-place ${slide.team.rank===1?'results-first':''}`}><span>第</span><strong>{slide.team.rank}</strong><span>位</span></h1>:<>
     <h1 className={`results-team-name${Array.from(slide.team.team_name).length>14?' results-team-long':''}`}>{slide.team.team_name}</h1>
     <div className="results-score"><strong>{slide.team.total_points}</strong><span>pt</span></div>
     <div className="results-levels">{levelCompletions(slide.team.completed).map(({level,count,total})=><div className={`results-level results-level-${level}`} key={level}><span className="results-level-label"><i aria-hidden="true"/>レベル{level}</span><p><strong>{count}</strong><span> / {total}</span></p><div className="results-level-track" aria-hidden="true"><span style={{width:`${count/total*100}%`}}/></div></div>)}</div>
    </>}
   </section>
  </main>
 </div>;
}
