import {WUKANG_HUAIHAI} from './wukang-layout.js';
import {PUXI_SOUTH_ROADS} from './puxi-south-layout.js';
import {JINGAN_ROADS} from './jingan-layout.js';

// Street lengths are compressed to the game map. Each street is defined once
// for paving, map lines, plot clearance, and lane paint.
export function westStreets(westSpine,routeSamples){
 const east=z=>Math.round(westSpine(z));
 // Keep the historic short streets near the river. Beijing and Jiujiang carry
 // east-west traffic on opposite sides of Nanjing's pedestrian corridor.
 return [
  ['west-beijing','北京东路西向',-206,14,east(14),14,2],
  ['west-xizang-middle','西藏中路联络段',-206,14,-206,99,3],
  ['west-jiujiang','九江路西向',-206,99,east(99),99,2],
  ['west-hankou','汉口路西向',-121,126,-13,126,2],
  ['west-hankou-turn','汉口路接线',-13,126,-13,116,2],
  ['west-hankou-east','汉口路东侧接线',-13,116,east(116),116,2],
  ['west-xizang-south','西藏南路联络段',-121,126,-121,195,3],
  ['west-taicang','太仓路',-211,145,-121,145,2],
  ['west-madang','马当路',-211,145,-211,302,2],
  ...WUKANG_HUAIHAI,
  ...PUXI_SOUTH_ROADS,
  ...JINGAN_ROADS
 ].map(([id,name,ax,az,bx,bz,width])=>({
  id,name,ax,az,bx,bz,width,westGrid:true,samples:routeSamples([[ax,az],[bx,bz]])
 }));
}
export function westRoadAt(road,x,z,padding=0){
 const reach=road.width+padding;
 return x>=Math.min(road.ax,road.bx)-reach&&x<=Math.max(road.ax,road.bx)+reach&&
  z>=Math.min(road.az,road.bz)-reach&&z<=Math.max(road.az,road.bz)+reach;
}
export function westRoadPlot(roads,plot){
 return roads.some(r=>{
  const reach=r.width+2;
  return plot.x+plot.rx>=Math.min(r.ax,r.bx)-reach&&plot.x-plot.rx<=Math.max(r.ax,r.bx)+reach&&
   plot.z+plot.rz>=Math.min(r.az,r.bz)-reach&&plot.z-plot.rz<=Math.max(r.az,r.bz)+reach;
 });
}
export function buildWestStreets(w,roads){
 for(const r of roads){
  const reach=r.width+2;
  for(let x=Math.min(r.ax,r.bx)-reach;x<=Math.max(r.ax,r.bx)+reach;x++){
   for(let z=Math.min(r.az,r.bz)-reach;z<=Math.max(r.az,r.bz)+reach;z++){
    if(westRoadAt(r,x,z))w.set(x,25,z,3);
    else if(w.get(x,25,z)!==3)w.set(x,25,z,9);
   }
  }
 }
}
