import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { PixelPerson } from './PixelSprites';
import { IssueIllustration } from './IssueIllustration';
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
 const [password,setPassword]=useState('');const [error,setError]=useState('');const [busy,setBusy]=useState(false);
 return <section ref={panelRef} className="issue-panel"><div className="panel-top"><span className={`level-label level-${issue.level}`}>レベル{issue.level} · {issue.points}pt</span><button autoFocus onClick={onClose} aria-label="課題を閉じる（Esc / E）">✕</button></div><h2 id="issue-title">{issue.title}</h2><div className="issue-art"><IssueIllustration scene={issue.scene} id={issue.id}/></div>{reading?<div className="resident-dialogue"><div className="resident-speaker"><span aria-hidden="true">●</span>{story.name}</div><p className="resident-line" key={line} aria-live="polite">「{story.lines[line]}」</p><div className="resident-dialogue-footer"><span>{line+1} / {story.lines.length}</span><button onClick={()=>{if(line<story.lines.length-1)setLine(n=>n+1);else setReading(false);}}>{line<story.lines.length-1?'次へ':'お願いを聞く'} <span aria-hidden="true">▸</span></button></div></div>:<><section className="resident-request"><div className="request-heading"><span className="request-avatar" aria-hidden="true"><svg viewBox="0 0 44 52"><PixelPerson position={{x:22,y:41}} npc tone={issue.level-1}/></svg></span><div><span className="request-eyebrow">住民のお願い</span><h3>{story.name}</h3></div></div><div className="resident-request-copy">{story.request.split("\n\n").slice(0,-1).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div><div className="resident-wish"><span>目指すこと</span><p>{story.request.split("\n\n").at(-1)}</p></div></section><details className="issue-password-toggle"><summary>課題の4桁パスワード{completed&&<span>✓ 獲得済み</span>}</summary><form className="password-form" onSubmit={async e=>{e.preventDefault();if(busy)return;setBusy(true);setError('');try{await onRedeem(password);setPassword('');}catch(e){setError(e instanceof Error?e.message:'確認できませんでした。再試行してください。');}finally{setBusy(false);}}}><label className="sr-only" htmlFor="issue-password">課題の4桁パスワード</label>{completed?<p role="status" className="redeemed">✓ {issue.points}ポイント獲得済み</p>:<div className="password-row"><input id="issue-password" disabled={busy} type="text" inputMode="numeric" autoComplete="off" maxLength={4} pattern="[0-9]{4}" value={password} onChange={e=>{setPassword(e.target.value.replace(/[^0-9]/g,''));setError('');}} placeholder="0000" aria-invalid={!!error} aria-describedby={error?'password-error':undefined}/><button className="primary" disabled={password.length!==4||busy} type="submit">{busy?'確認中…':'パスワードを確認'} <span>+{issue.points} pt</span></button></div>}{error&&<p id="password-error" role="alert" className="warning">{error}</p>}</form></details></>}</section>;
}
