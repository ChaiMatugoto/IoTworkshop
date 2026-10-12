import type { Building } from '../data/map';
export function BuildingVariant({b,index}:{b:Building;index:number}){
 const {w,h}=b;const industrial=b.kind==='factory'||b.kind==='warehouse';const shop=b.kind==='shop'||b.kind==='restaurant';
 const sign=(y:number)=><g><rect x={w/2-Math.min(w-16,Math.max(54,(b.label?.length||4)*9))/2} y={y} width={Math.min(w-16,Math.max(54,(b.label?.length||4)*9))} height="16" fill="#f4e7c7"/><text x={w/2} y={y+11} textAnchor="middle" fontSize="9" fill="#4d6261">{b.label}</text></g>;
 return <g transform={`translate(${b.x} ${b.y})`} shapeRendering="crispEdges">
 <rect x="7" y="7" width={w} height={h} fill="#385e5133"/>
 {industrial?<>
 <rect y="33" width={w} height={h-33} fill={b.kind==='factory'?'#bb9d83':'#bbc2b4'}/><rect x={w-12} y="33" width="12" height={h-33} fill="#88988c"/>
 {b.kind==='factory'?<><path d={`M0 33V16l${w/3} -14v14l${w/3} -14v14l${w/3} -14v31z`} fill="#637e82"/><path d={`M5 18l${w/3-10} -10M${w/3+5} 18l${w/3-10} -10M${w*2/3+5} 18l${w/3-10} -10`} stroke="#a6b6ad" strokeWidth="4"/><rect x={w-26} y="0" width="13" height="30" fill="#9c7663"/><rect x={w-29} width="19" height="5" fill="#b6987e"/><path d={`M${w-26} 10h13M${w-26} 20h13`} stroke="#c1a18c" strokeWidth="3"/></>:<><path d={`M0 33V17L${w/2} 0 ${w} 17v16z`} fill="#738e8b"/><path d={`M5 18L${w/2} 5 ${w-5} 18`} fill="none" stroke="#a9bab0" strokeWidth="4"/>{Array.from({length:Math.floor(w/12)},(_,i)=><path key={i} d={`M${6+i*12} 23v10`} stroke="#526f71" strokeWidth="2"/>)}</>}
 <path d={`M0 33h${w}`} stroke="#425f65" strokeWidth="5"/>
 {Array.from({length:Math.floor((w-16)/27)},(_,i)=><g key={i}><rect x={9+i*27} y="44" width="22" height="18" fill="#5d8289"/><path d={`M${20+i*27} 44v18M${9+i*27} 53h22`} stroke="#b0c8bb" strokeWidth="2"/></g>)}
 {Array.from({length:Math.floor((h-65)/13)},(_,i)=><path key={i} d={`M3 ${69+i*13}h${w-18}`} stroke={b.kind==='factory'?'#a68773':'#a0afa1'} strokeWidth="2"/>)}
 <rect x={w/2-24} y={h-43} width="48" height="41" fill="#51696b"/><rect x={w/2-21} y={h-40} width="42" height="35" fill="#93a8a0"/>{Array.from({length:5},(_,i)=><path key={i} d={`M${w/2-21} ${h-35+i*6}h42`} stroke="#657e7b" strokeWidth="2"/>)}
 {sign(67)}<rect x="6" y={h-22} width="18" height="20" fill="#b99b6c"/><path d={`M15 ${h-22}v20`} stroke="#e1c492" strokeWidth="3"/>
 {b.kind==='factory'&&<path d={`M${w-18} 67v${h-87}h-12v16`} fill="none" stroke="#637d78" strokeWidth="5"/>}
 </>:shop?<>
 <rect y="23" width={w} height={h-23} fill={b.kind==='restaurant'?'#e1c8a0':'#e5d9ba'}/><rect y="3" width={w} height="23" fill={b.kind==='restaurant'?'#8d6b57':'#587e7d'}/><path d={`M5 8h${w-10}M5 18h${w-10}`} stroke={b.kind==='restaurant'?'#ae8b6a':'#7e9f96'} strokeWidth="3"/>
 {sign(29)}<rect x="8" y="51" width={w-16} height={h-55} fill="#648c91"/><rect x={w/2-12} y="53" width="24" height={h-57} fill="#425c60"/><rect x={w/2-9} y="56" width="18" height={h-65} fill="#a5c6bc"/>
 <path d={`M8 53h${w-16}v9H8z`} fill={b.kind==='restaurant'?'#d3a066':'#d17f68'}/>{Array.from({length:Math.floor((w-16)/16)},(_,i)=><rect key={i} x={8+i*16} y="53" width="8" height="12" fill="#f5e4be"/>)}
 <rect x="8" y={h-7} width={w-16} height="5" fill="#9e8260"/>
 {b.kind==='restaurant'?<g><rect x="18" y={h-36} width="24" height="3" fill="#efe4c4"/><rect x="25" y={h-43} width="10" height="7" fill="#d5b17b"/><path d={`M${w-30} ${h-36}h15M${w-23} ${h-42}v15`} stroke="#e7d8b0" strokeWidth="3"/></g>:<g><rect x="15" y={h-24} width="15" height="13" fill="#b89169"/><rect x="18" y={h-28} width="9" height="5" fill="#8ba781"/></g>}
 </>:<>
 <rect width={w} height={h} fill={b.kind==='public'?'#ddd8bd':'#c6bbaa'}/><rect x={w-10} width="10" height={h} fill="#9aa79a"/><rect width={w} height="24" fill="#66838b"/><rect x="4" y="4" width={w-8} height="13" fill="#99aaa5"/><rect x="8" y="7" width="22" height="6" fill="#c1cec2"/>
 {b.kind==='public'&&<><rect x={w/2-21} y="5" width="42" height="13" fill="#c7d4c5"/><path d={`M${w/2} 7v5h6`} fill="none" stroke="#526d70" strokeWidth="2"/></>}
 {Array.from({length:Math.max(1,Math.floor((h-60)/28))},(_,row)=><g key={row}>{Array.from({length:Math.floor((w-15)/27)},(_,col)=><g key={col}><rect x={10+col*27} y={33+row*28} width="18" height="17" fill="#628b95"/><rect x={12+col*27} y={35+row*28} width="7" height="6" fill="#b4d3ca"/>{b.kind==='apartment'&&<><rect x={7+col*27} y={48+row*28} width="24" height="5" fill="#9baaa1"/><path d={`M${8+col*27} ${45+row*28}h22`} stroke="#5a7877" strokeWidth="2"/></>}</g>)}</g>)}
 <rect x={w/2-12} y={h-30} width="24" height="28" fill="#526f71"/><rect x={w/2-8} y={h-27} width="16" height="15" fill="#a6c4bc"/>
 {b.kind==='public'&&<><rect x="8" y={h-30} width="8" height="28" fill="#ebe4cc"/><rect x={w-26} y={h-30} width="8" height="28" fill="#ebe4cc"/>{sign(h-51)}</>}
 {index%2===0&&<><rect x={w-33} y="8" width="20" height="8" fill="#657c7b"/><path d={`M${w-30} 11h14M${w-30} 14h14`} stroke="#aebcb0" strokeWidth="1"/></>}
 </>}
 </g>;
}
