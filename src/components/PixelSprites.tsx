import { useEffect, useRef, useState } from 'react';
import type { Point } from '../data/issues';
import type { Building } from '../data/map';
import { BuildingVariant } from './BuildingVariants';

export function PixelTree({x,y,variant=0}:{x:number;y:number;variant?:number}){
 return <g transform={`translate(${x} ${y})`} shapeRendering="crispEdges">
 <path d="M-16 10h36v8h-36z" fill="#315c5133"/><path d="M-4-5H6v24H-4z" fill="#6c5745"/><path d="M0-5H4v24H0z" fill="#99734e"/>
 <path d="M-10-40h20v4h8v8h6v20h-6v8h-8v4h-20v-4h-8v-8h-6v-20h6v-8h8z" fill={variant%3===0?'#356c58':'#427c59'}/>
 <path d="M-10-38h20v6h8v14h-6v6H-8v-4h-12v-12h10z" fill={variant%3===0?'#5c9c66':'#6aab69'}/>
 <path d="M-8-36h12v6H-8zm-10 12h8v6h-8zm18 8h10v4H0z" fill="#8abc79"/>
 <path d="M-12-8h8v4h-8zm20-8h8v4H8zm4-16h4v4h-4z" fill="#315f4c"/>
 </g>;
}
export function PixelBuilding({b,index}:{b:Building;index:number}){
 if(b.kind!=='house'&&b.kind!=='office')return <BuildingVariant b={b} index={index}/>;
 const roof=index%3===0?'#b65f4c':index%3===1?'#4e7d83':'#6a7694';
 const light=index%3===0?'#d58160':index%3===1?'#75a3a2':'#8f99b0';
 const roofHeight=b.kind==='house'?Math.min(48,b.h*.48):Math.min(38,b.h*.4);
 return <g transform={`translate(${b.x} ${b.y})`} shapeRendering="crispEdges">
 <path d={`M8 8h${b.w}v${b.h}H8z`} fill="#385e5133"/>
 <rect y={roofHeight-3} width={b.w} height={b.h-roofHeight+3} fill="#776955"/>
 <rect x="4" y={roofHeight} width={b.w-8} height={b.h-roofHeight-5} fill={'#ead7ac'}/>
 <rect x={b.w-15} y={roofHeight} width="11" height={b.h-roofHeight-5} fill="#c3b08a"/>
 {[0,1,2,3].map(k=><path key={k} d={`M4 ${roofHeight+7+k*12}h${b.w-19}`} stroke="#d9c399" strokeWidth="2"/>)}
 <path d={`M-5 ${roofHeight}V${roofHeight-10}H0V${roofHeight-20}H6V${roofHeight-30}H12V0H${b.w-12}V${roofHeight-30}H${b.w-6}V${roofHeight-20}H${b.w}V${roofHeight-10}H${b.w+5}V${roofHeight}z`} fill={roof}/>
 {Array.from({length:Math.floor(roofHeight/8)},(_,k)=><g key={k}><path d={`M${Math.max(-2,12-k*4)} ${5+k*8}H${b.w-Math.max(-2,12-k*4)}`} stroke={light} strokeWidth="3"/>{Array.from({length:Math.floor(b.w/18)},(_,j)=><path key={j} d={`M${14+j*18+(k%2)*8} ${7+k*8}v4`} stroke="#243b4833" strokeWidth="2"/>)}</g>)}
 <path d={`M-5 ${roofHeight}h${b.w+10}v5H-5z`} fill="#384b50"/>
 <rect x={b.w/2-9} y={b.h-31} width="18" height="29" fill="#4b5b59"/><rect x={b.w/2-5} y={b.h-28} width="10" height="15" fill="#8bacac"/><rect x={b.w/2+3} y={b.h-11} width="2" height="2" fill="#e7c27e"/>
 {[12,b.w-32].map((x,j)=><g key={j}><rect x={x-3} y={roofHeight+12} width="23" height="25" fill="#f7e8c6"/><rect x={x} y={roofHeight+15} width="17" height="19" fill="#4c7e8c"/><rect x={x+2} y={roofHeight+17} width="6" height="7" fill="#a5d0cb"/><path d={`M${x+9} ${roofHeight+15}v19M${x} ${roofHeight+25}h17`} stroke="#e5ce9f" strokeWidth="2"/><rect x={x-3} y={roofHeight+36} width="23" height="4" fill="#90775b"/></g>)}
 {index%2===0&&<><rect x={b.w-26} y="8" width="10" height="21" fill="#9c7461"/><rect x={b.w-28} y="7" width="14" height="4" fill="#c49e81"/></>}
 {index%3===1&&<><rect x="18" y="8" width="27" height="14" fill="#3e637b"/><path d="M27 8v14M36 8v14M18 15h27" stroke="#7cabb6" strokeWidth="1"/></>}
 <rect x={b.w/2-16} y={b.h-1} width="32" height="5" fill="#aa9f87"/><rect x={b.w/2-20} y={b.h+4} width="40" height="4" fill="#c4b89c"/>
 {b.label&&<><rect x={b.w/2-23} y={roofHeight+7} width="46" height="17" fill="#f7efda"/><text x={b.w/2} y={roofHeight+19} fontSize="10" fill="#435f66" textAnchor="middle">{b.label||'市民センター'}</text></>}
 {b.kind==='office'&&<><rect x="9" y={roofHeight-2} width={b.w-18} height="9" fill="#e9c484"/><path d={`M9 ${roofHeight+2}h${b.w-18}`} stroke="#c27760" strokeWidth="4" strokeDasharray="9 9"/></>}
 </g>;
}
export function PixelPerson({position,npc=false,tone=0}:{position:Point;npc?:boolean;tone?:number}){
 const previous=useRef(position);const [direction,setDirection]=useState('down');const [walking,setWalking]=useState(false);
 useEffect(()=>{const dx=position.x-previous.current.x,dy=position.y-previous.current.y;previous.current=position;if(!dx&&!dy)return;setDirection(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');setWalking(true);const t=setTimeout(()=>setWalking(false),100);return()=>clearTimeout(t);},[position]);
 const step=walking?(Math.floor((position.x+position.y)/9)%2?2:-2):0;
 const shirt=npc?(tone%2?'#aa6657':'#718268'):'#2f6687';
 return <g transform={`translate(${Math.round(position.x)} ${Math.round(position.y)})`} shapeRendering="crispEdges" className={npc?'npc-sprite':'player-sprite'}>
 <path d="M-12 4h24v6h-24z" fill="#294f483b"/>
 <g transform="translate(-12 -38)">
 <rect x="6" y="0" width="12" height="4" fill="#344449"/><rect x="4" y="4" width="16" height="8" fill="#344449"/>
 <rect x="6" y="9" width="12" height="9" fill="#d7ac83"/><rect x="6" y="8" width="12" height="3" fill="#344449"/>
 {direction!=='up'&&<><rect x={direction==='right'?15:7} y="12" width="2" height="2" fill="#33424a"/>{direction==='down'&&<rect x="15" y="12" width="2" height="2" fill="#33424a"/>}</>}
 <rect x="4" y="18" width="16" height="15" fill={shirt}/><rect x="7" y="18" width="3" height="12" fill="#70a0ac"/><rect x="2" y={20-step/2} width="4" height="12" fill={shirt}/><rect x="18" y={20+step/2} width="4" height="12" fill={shirt}/><rect x="2" y={30-step/2} width="4" height="4" fill="#d7ac83"/><rect x="18" y={30+step/2} width="4" height="4" fill="#d7ac83"/>
 {direction==='up'&&<><rect x="8" y="19" width="9" height="12" fill="#c79b59"/><rect x="9" y="20" width="7" height="3" fill="#e1be81"/></>}
 <rect x="6" y="33" width="5" height={8+step} fill="#434a55"/><rect x="13" y="33" width="5" height={8-step} fill="#434a55"/><rect x="4" y={39+step} width="7" height="3" fill="#293c43"/><rect x="13" y={39-step} width="7" height="3" fill="#293c43"/>
 </g></g>;
}
export function PixelBench({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`} shapeRendering="crispEdges"><rect x="-18" y="-10" width="36" height="4" fill="#ad8057"/><rect x="-18" y="-4" width="36" height="5" fill="#c99c66"/><path d="M-13 1v7M13 1v7M-13-10v6M13-10v6" stroke="#526457" strokeWidth="3"/></g>}
export function PixelLamp({x,y}:{x:number;y:number}){return <g transform={`translate(${x} ${y})`} shapeRendering="crispEdges"><rect x="-2" y="-34" width="4" height="34" fill="#526b6a"/><rect x="-5" y="-39" width="10" height="9" fill="#f6db99"/><path d="M-7-40H7v3H-7zM-4 0h8v3h-8z" fill="#3e5b5d"/></g>}
