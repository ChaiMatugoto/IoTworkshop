import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Issue } from '../data/issues';
import type { RemoteTeam } from '../lib/cloudContract';
export default function AdminIssueCell({team,issue,onAward}:{team:RemoteTeam;issue:Issue;onAward:(undo:boolean)=>void}){
 const done=team.completed.includes(issue.id);const [position,setPosition]=useState<{x:number;y:number}|null>(null);const cell=useRef<HTMLTableCellElement>(null);const menu=useRef<HTMLDivElement>(null);
 const close=useCallback(()=>{setPosition(null);cell.current?.focus({preventScroll:true});},[]);
 useEffect(()=>{if(!position)return;menu.current?.querySelector('button')?.focus();const outside=(e:PointerEvent)=>{if(e.target instanceof Node&&!menu.current?.contains(e.target))close();};const key=(e:KeyboardEvent)=>{if(e.key==='Escape'||e.key==='Tab'){if(e.key==='Escape')e.preventDefault();close();}};window.addEventListener('pointerdown',outside,true);window.addEventListener('keydown',key);window.addEventListener('scroll',close,true);window.addEventListener('resize',close);window.addEventListener('blur',close);return()=>{window.removeEventListener('pointerdown',outside,true);window.removeEventListener('keydown',key);window.removeEventListener('scroll',close,true);window.removeEventListener('resize',close);window.removeEventListener('blur',close);};},[position,close]);
 useEffect(()=>{setPosition(null);},[done]);
 const open=(x:number,y:number)=>setPosition({x:Math.max(8,Math.min(x,window.innerWidth-248)),y:Math.max(8,Math.min(y,window.innerHeight-130))});
 return <td ref={cell} tabIndex={0} className={`admin-issue-cell${done?' task-done':''}`}  aria-label={`${issue.title}: ${done?'完了':'未完了'}`} aria-haspopup="menu" aria-expanded={!!position} onContextMenu={e=>{e.preventDefault();open(e.clientX,e.clientY);}} onKeyDown={e=>{if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();const rect=e.currentTarget.getBoundingClientRect();open(rect.left,rect.bottom);}}}>
  {done?'✓':'—'}
  {position&&createPortal(<div ref={menu} className="admin-issue-menu" role="menu" aria-label={`${team.team_name}・${issue.label}`} style={{left:position.x,top:position.y}}><div className="admin-issue-menu-caption">{team.team_name}<span>{issue.label}</span></div><button role="menuitem" onClick={()=>{close();onAward(done);}}>{done?'不正解にする':'正解にする'}</button></div>,document.body)}
 </td>;
}
