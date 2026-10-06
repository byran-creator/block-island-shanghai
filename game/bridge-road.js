import {BUND_SHIFT} from './shanghai-map.js';

// One continuous height profile for the visible deck, traffic and player vehicles.
export function nanpuSurfaceAt(x,z){
 if(x>=120-.5&&x<=283&&z>=203&&z<=210){
  const xx=x-.5,start=192-BUND_SHIFT;
  return xx<start?26:xx<212?26+(xx-start)/(212-start)*5:xx<=255?31:Math.max(26,31-(xx-255)/20*5);
 }
 if(x>=117&&x<=124&&z>=187&&z<=210)return 26;
 return null;
}
export function nanpuFloor(world,x,z){
 const y=nanpuSurfaceAt(x,z),ix=Math.floor(x),iz=Math.floor(z),column=nanpuSurfaceAt(ix+.5,iz+.5);
 return y!==null&&column!==null&&world.get(ix,Math.floor(column+1e-6)-1,iz)===9?y:null;
}
export function nanpuDeckCell(x,y,z){const h=nanpuSurfaceAt(x+.5,z+.5);return h!==null&&y===Math.floor(h+1e-6)-1;}
