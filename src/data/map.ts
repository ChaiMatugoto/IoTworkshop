import type { Point } from './issues';
export const WIDTH=2100, HEIGHT=1575;
export const START:Point={x:562,y:591};
export type Building={x:number;y:number;w:number;h:number;kind:'house'|'office'|'public'|'factory'|'warehouse'|'shop'|'restaurant'|'apartment';label?:string};
export const buildings:Building[]=[
 {x:98,y:103,w:90,h:110,kind:'house'}, {x:267,y:103,w:90,h:110,kind:'house'},
 {x:145,y:366,w:170,h:85,kind:'shop',label:'こもれび商店'},
 {x:666,y:141,w:125,h:150,kind:'factory',label:'まちの工場'},
 {x:947,y:253,w:140,h:140,kind:'warehouse',label:'倉庫'},
 {x:1791,y:216,w:180,h:165,kind:'public',label:'街灯管理室'},
 {x:103,y:684,w:90,h:110,kind:'house'},
 {x:192,y:769,w:90,h:110,kind:'house'},
 {x:333,y:736,w:95,h:110,kind:'house'},
 {x:75,y:994,w:160,h:120,kind:'factory',label:'ものづくり工房'},
 {x:745,y:1116,w:185,h:145,kind:'warehouse',label:'保管倉庫'},
 {x:1022,y:1397,w:105,h:110,kind:'house',label:'見守り住宅'},
 {x:1781,y:1162,w:180,h:155,kind:'restaurant',label:'フードコート'},
 {x:1978,y:1416,w:90,h:110,kind:'house'},
 {x:736,y:1388,w:110,h:125,kind:'house'},
 {x:1762,y:647,w:95,h:115,kind:'apartment'},
 {x:1941,y:652,w:100,h:110,kind:'apartment'},
 {x:1036,y:112,w:100,h:110,kind:'apartment'},
 {x:1762,y:98,w:100,h:85,kind:'office'},
 {x:80,y:1416,w:100,h:110,kind:'apartment'},
];
export const river={x:1378,w:225};
export const bridges=[{y:919,h:94},{y:525,h:94}];
export const roads='M553 0V1575M0 562H1378M0 1247H1266M1266 562V966H2100M1266 966V1247M1669 562V1575M1669 1462H2100M1603 572H2100';
export const trafficSignals=[{x:509,y:1203},{x:1713,y:922}];
export const parking={x:84,y:1303,w:340,h:220};
export function onRoad(p:Point){return Math.abs(p.x-553)<56||Math.abs(p.y-562)<56||Math.abs(p.y-1247)<56&&p.x<1312||Math.abs(p.x-1266)<56&&p.y>516&&p.y<1303||Math.abs(p.y-966)<56&&p.x>1219||Math.abs(p.x-1669)<56&&p.y>516||Math.abs(p.y-1462)<56&&p.x>1612;}
export function canWalk(p:Point){
 if(p.x<12||p.x>WIDTH-12||p.y<12||p.y>HEIGHT-12)return false;
 if(p.x>river.x-10&&p.x<river.x+river.w+10 && !bridges.some(b=>p.y>b.y+10&&p.y<b.y+b.h-10))return false;
 return !buildings.some(b=>p.x>b.x-10&&p.x<b.x+b.w+10&&p.y>b.y-10&&p.y<b.y+b.h+10);
}
export function move(p:Point,dx:number,dy:number):Point{
 const a={x:p.x+dx,y:p.y}; const next=canWalk(a)?a:p;
 const b={x:next.x,y:next.y+dy};return canWalk(b)?b:next;
}
