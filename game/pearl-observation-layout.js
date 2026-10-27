import {PEARL} from './shanghai-map.js';

// Coordinates shared by the generator, collision, interaction and save migration.
export const PEARL_DECK={x:PEARL.x,z:PEARL.z,y:70,radius:4.25,arrival:{x:PEARL.x+.1,y:70,z:PEARL.z-.7},exit:{x:PEARL.x+.1,y:70,z:PEARL.z-.7},snacks:{x:PEARL.x+2.3,y:70,z:PEARL.z+1.8},crystal:{x:PEARL.x-2.1,y:71.5,z:PEARL.z+1.3}};
export function buildPearlObservationWorld(w){
 // Clear the old external landing and open the middle observation ring.
 w.fill(PEARL.x-1,69,48,PEARL.x+1,72,50,0);
 for(let x=PEARL.x-5;x<=PEARL.x+5;x++)for(let z=PEARL.z-5;z<=PEARL.z+5;z++){
  const r=Math.hypot(x-PEARL.x,z-PEARL.z);
  if(r<=4.6)for(let y=70;y<=71;y++)w.set(x,y,z,0);
  if(r<=3.2)w.set(x,72,z,0);
  if(r<=3.8)for(let y=68;y<=69;y++)w.set(x,y,z,0);
 }
 // Keep the original core below the glass ring so the upper globe stays supported.
 w.fill(PEARL.x-1,68,PEARL.z-1,PEARL.x+1,69,PEARL.z+1,9);
}
export function pearlObservationCollides(x,y,z){
 // Most collision queries are at street level; avoid a distance calculation there.
 if(y<=68.09||y>=73||Math.abs(x-PEARL.x)>=5.1||Math.abs(z-PEARL.z)>=5.1)return false;
 const r=Math.hypot(x-PEARL.x,z-PEARL.z);
 if(y<70&&y+1.75>69.84&&r<4.0)return true;
 if(y<73&&y+1.75>70&&r>3.75&&r<5.1)return true;
 const s=PEARL_DECK.snacks;return y<71.15&&y+1.75>70&&Math.abs(x-s.x)<.85&&Math.abs(z-s.z)<.58;
}
export function oldPearlLanding(p){return !!p&&p.y>=68.5&&p.y<=72&&Math.abs(p.x-PEARL.x)<4&&p.z>=47&&p.z<=51;}
