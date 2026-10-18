import type { Point } from '../data/issues';

/** 街のごみ箱。課題の完了後は起きた状態になる。 */
export function PixelWasteBin({position, restored}:{position:Point;restored:boolean}) {
 return <g transform={`translate(${position.x} ${position.y})`} shapeRendering="crispEdges" role="img" aria-label={restored?'起こされたごみ箱':'倒れてごみがこぼれたごみ箱'}>
  <rect x="-38" y="-15" width="78" height="36" rx="2" fill="#c2c7ae"/>
  <path d="M-33 13h60v5h-60z" fill="#72856a" opacity=".35"/>
  <g transform={restored?'translate(0 9)':'translate(-12 8) rotate(72)'}>
   <rect x="-13" y="-33" width="26" height="32" fill="#507a77"/>
   <rect x="-10" y="-31" width="5" height="27" fill="#7ca29a"/>
   <rect x="9" y="-31" width="4" height="30" fill="#3a5e5d"/>
   <path d="M-2-27v20M5-27v20" stroke="#91b3a5" strokeWidth="2"/>
   <rect x="-16" y="-38" width="32" height="6" fill="#355855"/>
   <rect x="-6" y="-42" width="12" height="4" fill="#436b65"/>
   <rect x="-6" y="-24" width="12" height="10" fill="#e5d7a8"/>
   <path d="M-3-21h6v4h-6z" fill="#6c9178"/>
   <rect x="-10" y="-1" width="5" height="5" fill="#344d49"/>
   <rect x="6" y="-1" width="5" height="5" fill="#344d49"/>
  </g>
  {!restored&&<><path d="M18 9h9v5h-9zM29 0h6v7h-6zM10 18h7v3h-7z" fill="#f0e6c7"/><path d="M23 19h8v3h-8z" fill="#c49b6a"/></>}
 </g>;
}
