import { useEffect, useRef } from 'react';
import type { Point } from '../data/issues';
import { move } from '../data/map';
export function useMovement(position:Point,onMove:(p:Point)=>void,paused:boolean,onOpen:()=>void){
 const keys=useRef(new Set<string>());const current=useRef(position);current.current=position;
 const callback=useRef(onMove);callback.current=onMove;const open=useRef(onOpen);open.current=onOpen;
 useEffect(()=>{const down=(e:KeyboardEvent)=>{if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable]'))return;
 const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e'].includes(k)){e.preventDefault();if(k==='e'){if(!e.repeat&&!paused)open.current();}else if(!paused)keys.current.add(k);}};
 const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());const clear=()=>keys.current.clear();
 window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);
 let frame=0,last=0;function tick(t:number){const dt=Math.min((t-last)/1000,0.04);last=t;if(!paused){const k=keys.current;let dx=Number(k.has('d')||k.has('arrowright'))-Number(k.has('a')||k.has('arrowleft'));let dy=Number(k.has('s')||k.has('arrowdown'))-Number(k.has('w')||k.has('arrowup'));const len=Math.hypot(dx,dy);if(len){dx=dx/len*160*dt;dy=dy/len*160*dt;const p=move(current.current,dx,dy);current.current=p;callback.current(p);}}frame=requestAnimationFrame(tick);}frame=requestAnimationFrame(tick);
 return()=>{cancelAnimationFrame(frame);clear();window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);};},[paused]);
 return (key:string,pressed:boolean)=>{if(pressed&&!paused)keys.current.add(key);else keys.current.delete(key);};
}
