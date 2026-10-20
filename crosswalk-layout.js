import {BUND_STREETS,roadX,westSpine} from './city-layout.js';
import {PEDESTRIAN_CROSSINGS} from './pedestrian-crossings.js';

// East-west walking routes cross each north-south carriageway once. Use the
// pedestrian road edges at Nanjing, covering the cycle-lane approaches too.
export const BUND_CROSSWALKS=BUND_STREETS.flatMap(s=>['bund','stele'].map(bank=>{
 const id=bank+'-'+s.z,admission=PEDESTRIAN_CROSSINGS.find(c=>c.id===id);
 const center=(bank==='bund'?roadX(s.z):westSpine(s.z))+.5;
 const west=Math.min(admission?.roadWest??center-4,center-4),east=Math.max(admission?.roadEast??center+4,center+4);
 const count=Math.floor((east-west)/1.1),spacing=(east-west)/count;
 return {id,west,east,z:admission?.z??s.z+.5,depth:5.2,
  stripes:Array.from({length:count},(_,i)=>west+(i+.5)*spacing)};
}));

export const crosswalkContains=(c,x,z)=>x>=c.west-.2&&x<=c.east+.2&&Math.abs(z-c.z)<=c.depth/2+.65;
