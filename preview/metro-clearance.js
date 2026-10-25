import {line10MaintainedCell} from './metro-line10-layout.js';
import {METRO_STATIONS,METRO_RAMPS,metroLineZ} from './metro-layout.js';
export function metroMaintainedCell(x,y,z){
 if(line10MaintainedCell(x,y,z))return true;
 for(const s of METRO_STATIONS){
  if(Math.abs(x-s.x)<=36&&Math.abs(z-s.z)<=16&&y>=15&&y<=22)return true;
  if(Math.abs(x-s.x)<=36&&Math.abs(z-s.z)<=12&&y>=2&&y<=11)return true;
 }
 if(x>=-133&&x<=213&&y>=2&&y<=10&&Math.abs(z-Math.round(metroLineZ(x)))<=12)return true;
 for(const r of METRO_RAMPS){const d=(x-r.x)*r.dir;if(d<-3||d>r.length+3||z<Math.floor(r.z-r.width)||z>Math.floor(r.z+r.width))continue;
  const h=r.from+(r.to-r.from)*Math.max(0,Math.min(1,d/r.length));if(y>=Math.floor(h)-1&&y<=Math.ceil(h)+3)return true;
 }
 return false;
}
// Reconcile edits to the canonical metro only; unrelated player edits remain.
// A manual repair identical to the canonical cell is harmless and may stay.
export function blocksMetroClearance(x,y,z,id,baseId){return id!==baseId&&metroMaintainedCell(x,y,z);}
