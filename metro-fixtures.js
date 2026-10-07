import {METRO_HALL} from './metro-layout.js';

// The rendered equipment and columns share these bounds for players and passengers.
export function metroFixtures(s){
 const bounds=[];
 const add=(x,z,w,d,y,top)=>bounds.push({x:s.x+x,z:s.z+z,w:w/2,d:d/2,y,top});
 add(-22,-8,5,2,16,18.8);
 for(const floor of [6,16])for(const x of [-28,-14,0,14,28])add(x,floor===16?-11:-.4,1.3,1.3,floor,floor+4.5);
 for(const x of [-28,28])add(x,0,4,1.06,6,7.4);
 add(METRO_HALL.gateX,-11.225,.1,9.25,16,17.9);
 add(METRO_HALL.gateX,5.775,.1,20.35,16,17.9);
 for(const z of [METRO_HALL.gateZ-2,METRO_HALL.gateZ+2])add(METRO_HALL.gateX,z,2,.48,16,17.25);
 return bounds;
}
export function fixtureCollision(bounds,x,y,z,radius=.29,height=1.75){
 return bounds.some(b=>y+height>b.y+.01&&y<b.top&&Math.abs(x-b.x)<b.w+radius&&Math.abs(z-b.z)<b.d+radius);
}

// Relocate only the initial placement, then keep the entire walking envelope clear.
export function passengerSpot(s,x,z,y,clear){
 for(let r=0;r<=8;r+=.5)for(const dz of (r?[r,-r]:[0]))for(const dx of (r?[r,0,-r]:[0])){
  const p={x:x+dx,z:z+dz,y};
  if(Math.abs(p.x-s.x)>32||Math.abs(p.z-s.z)>(y===16?12.8:3.35))continue;
  if([-.65,0,.65].every(d=>clear(p.x+d,y,p.z)))return p;
 }
 return null;
}
