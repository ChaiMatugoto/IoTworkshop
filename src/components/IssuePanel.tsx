import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PixelPerson } from './PixelSprites';
import { IssueIllustration } from './IssueIllustration';
import { PartsList } from './PartsList';
import { HintsList } from './HintsList';
import { residentStories } from '../data/residents';
import { type Issue } from '../data/issues';
export function IssuePanel({issue,completed,onRedeem,onClose}:{issue:Issue;completed:boolean;onRedeem:(password:string)=>Promise<boolean>;onClose:()=>void}){
 const panelRef=useRef<HTMLElement>(null);
 const story=residentStories[issue.id];const [line,setLine]=useState(0);const [reading,setReading]=useState(!completed);
 useLayoutEffect(()=>{
  if(!reading)return;
  const panel=panelRef.current;const dialog=panel?.closest<HTMLElement>('.issue-dialog');
  const marker=document.querySelector<SVGGElement>(`[data-issue-anchor="${issue.id}"]`);
  if(!dialog||!marker)return;
  const place=()=>{
   const pin=marker.getBoundingClientRect();
   const box=dialog.getBoundingClientRect();
   const header=document.querySelector('.participant-header')?.getBoundingClientRect().bottom||0;
   const center=pin.left+pin.width/2;
   const left=Math.max(12,Math.min(window.innerWidth-box.width-12,center-box.width/2));
   const top=Math.max(header+8,Math.min(window.innerHeight-box.height-12,pin.bottom+12));
   dialog.style.setProperty('--dialogue-left',`${left}px`);
   dialog.style.setProperty('--dialogue-top',`${top}px`);
  };
  place();const observer=new ResizeObserver(place);observer.observe(dialog);
  const map=document.querySelector('.city');if(map)observer.observe(map);
  window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
  return()=>{observer.disconnect();window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);dialog.style.removeProperty('--dialogue-left');dialog.style.removeProperty('--dialogue-top');};
 },[reading,issue.id]);
 useEffect(()=>{
  if(!reading)return;
  const navigate=(event:KeyboardEvent)=>{
   const target=event.target as HTMLElement|null;
   if(event.isComposing||event.altKey||event.ctrlKey||event.metaKey||target?.closest('input,textarea,select,[contenteditable="true"]'))return;
   if(!['ArrowRight','ArrowDown','ArrowLeft','ArrowUp'].includes(event.key))return;
   event.preventDefault();
   if(event.repeat)return;
   if(event.key==='ArrowLeft'||event.key==='ArrowUp')setLine(n=>Math.max(0,n-1));
   else if(line<story.lines.length-1)setLine(n=>n+1);
   else setReading(false);
  };
  window.addEventListener('keydown',navigate);
  return()=>window.removeEventListener('keydown',navigate);
 },[reading,line,story]);
 const [reference,setReference]=useState<'hints'|'parts'|null>(null);
 const [enteringPassword,setEnteringPassword]=useState(false);const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 const speaker=<div className="request-heading"><span className="request-avatar" aria-hidden="true"><svg viewBox="0 0 44 52"><PixelPerson position={{x:22,y:41}} npc tone={issue.level-1}/></svg></span><div><h3>{story.name}</h3></div></div>;
 return <section ref={panelRef} className={`issue-panel ${reading?'':'task-sheet'}`}>
  {reading?<>
   <div className="panel-top"><button autoFocus onClick={onClose} aria-label="課題を閉じる（Esc / E）">✕</button></div>
   <h2 id="issue-title" className="sr-only">{issue.title}</h2>
   <div className="resident-dialogue">
    <div className="resident-speaker"><span aria-hidden="true">●</span>{story.name}</div>
    <p className="resident-line" key={line} aria-live="polite">「{story.lines[line]}」</p>
    <div className="resident-dialogue-footer"><span>{line+1} / {story.lines.length}</span><button onClick={()=>{if(line<story.lines.length-1)setLine(n=>n+1);else setReading(false);}}>{line<story.lines.length-1?'次へ':'お願いを聞く'} <span aria-hidden="true">▸</span></button></div>
   </div>
  </>:<>
   <header className="task-sheet-header">
    <div className="task-heading-copy"><span className={`level-label level-${issue.level}`}>レベル{issue.level} · {issue.points}pt</span><h2 id="issue-title">{issue.title}</h2></div>
    <button autoFocus className="task-close" onClick={onClose} aria-label="課題を閉じる（Esc / E）">✕</button>
   </header>
   <div className="task-sheet-body">
    <div className="task-setting"><div className="task-scene"><IssueIllustration scene={issue.scene} id={issue.id}/></div>{speaker}<nav className="task-reference-links" aria-label="課題の資料"><button type="button" aria-pressed={reference==='hints'} aria-controls="task-reading" onClick={()=>setReference(v=>v==='hints'?null:'hints')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c1 1-1 2-1 2H9s0-1-1-2Z"/></svg><span>ヒント</span><span aria-hidden="true">→</span></button><button type="button" aria-pressed={reference==='parts'} aria-controls="task-reading" onClick={()=>setReference(v=>v==='parts'?null:'parts')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="5" y="5" width="14" height="14" rx="3"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3"/></svg><span>センサ一覧</span><span aria-hidden="true">→</span></button></nav></div>
    <div className="task-reading" id="task-reading">{reference?<section className="task-reference-panel"><button className="task-reference-back" onClick={()=>setReference(null)}>← 課題に戻る</button><h3 className="task-section-title">{reference==='hints'?'ヒント':'センサ一覧'}</h3>{reference==='hints'?<HintsList/>:<PartsList/>}</section>:<><section className="resident-request"><h3 className="task-section-title">住民の声</h3><div className="resident-request-copy">{story.request.split("\n\n").slice(0,-1).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div></section>
    <section className="resident-wish"><h3 className="task-section-title">目指すこと</h3><p>{story.request.split("\n\n").at(-1)}</p></section></>}</div>
   </div>
   <footer className="task-completion">
    {completed?<div className="task-completed" role="status"><span className="task-completed-icon" aria-hidden="true">✓</span><div><strong>この課題はクリア済み</strong><span>{issue.points}ポイント獲得</span></div></div>:<div className="completion-inline"><div className="completion-heading">課題をクリアする</div><div className="completion-input-slot">{!enteringPassword?<button className="completion-start" onClick={()=>setEnteringPassword(true)}>パスワードを入力 <span aria-hidden="true">→</span></button>:<>     <form className="password-form inline-password-form" onSubmit={async e=>{e.preventDefault();if(busy||password.length!==4)return;setBusy(true);setError('');try{await onRedeem(password);setPassword('');}catch(e){setError(e instanceof Error?e.message:'確認できませんでした。再試行してください。');}finally{setBusy(false);}}}>
      <label className="sr-only" htmlFor="issue-password">4桁のパスワード</label>
      <div className="password-row"><input autoFocus id="issue-password" disabled={busy} type="text" inputMode="numeric" autoComplete="off" maxLength={4} pattern="[0-9]{4}" value={password} onChange={e=>{setPassword(e.target.value.replace(/[^0-9]/g,''));setError('');}} placeholder="••••" aria-invalid={!!error} aria-describedby={error?'password-error':undefined}/><button className="primary" disabled={password.length!==4||busy} type="submit">{busy?'確認中…':'確認'}</button><button type="button" className="password-cancel" aria-label="パスワード入力を閉じる" disabled={busy} onClick={()=>{setEnteringPassword(false);setError('');}}>✕</button></div>
      {error&&<p id="password-error" role="alert" className="warning">{error}</p>}
     </form>
    </>}</div></div>}
   </footer>
  </>}
 </section>;
}
