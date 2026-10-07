import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {METRO_STATIONS,METRO_RAMPS,METRO_HALL,metroRampFloor,metroPaidHall} from '../game/metro-layout.js';
import {createMetro} from '../game/metro.js';

const world=new VoxelWorld(),old=globalThis.document,p={x:0,y:26,z:0};
globalThis.document={hidden:false,body:{append(){}},createElement:()=>({setAttribute(){},getContext:()=>({fillRect(){},fillText(){}})})};
try{
 const metro=createMetro({scene:new THREE.Scene(),getPos:()=>p,place:q=>Object.assign(p,q),setView(){},notify(){},getSound:()=>false});
 const blocked=(x,y,z)=>{const h=metroRampFloor(x,z);return metro.collides(x,y,z)||h!==null&&y<h-.015||overlaps(world,x,h!==null?Math.max(y,Math.ceil(h)):y,z);};
 function hallPath(s,start,target){
  const queue=[start],seen=new Set(),parents=new Map();let end=null;
  const key=q=>q.x+','+q.z;seen.add(key(start));
  for(let i=0;i<queue.length;i++){const a=queue[i];if(Math.hypot(a.x-target.x,a.z-target.z)<.5){end=a;break;}
   for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const b={x:a.x+dx,y:16,z:a.z+dz},k=key(b),h=metroRampFloor(b.x,b.z);
    if(seen.has(k)||Math.abs(b.x-s.x)>34.5||Math.abs(b.z-s.z)>14||h!==null&&Math.abs(h-16)>.01||METRO_RAMPS.some(r=>Math.abs(b.z-r.z)<r.width+.1&&(b.x-r.x)*r.dir>=-2&&(b.x-r.x)*r.dir<=r.length+2&&Math.abs((metroRampFloor(b.x,r.z)??16)-16)>.01)||blocked(b.x,16,b.z)||!world.get(Math.floor(b.x),15,Math.floor(b.z)))continue;
    seen.add(k);parents.set(k,a);queue.push(b);
   }
  }
  if(!end)return null;const path=[];while(end){path.push(end);end=parents.get(key(end));}return path.reverse();
 }
 for(const s of METRO_STATIONS){const state=metro.stations.find(a=>a.id===s.id),gx=s.x+METRO_HALL.gateX,gz=s.z+METRO_HALL.gateZ;
  for(const e of s.exits){metro.restore(null);const ramp=METRO_RAMPS.find(r=>r.station===s.id&&r.exit===e.number);
   for(let u=0;u<=20;u+=.1){const x=ramp.x+ramp.dir*u,y=metroRampFloor(x,ramp.z);assert(!blocked(x,y,ramp.z),'Street ramp blocked '+s.id+':'+e.number+' at '+u);}
   const start={x:ramp.x+ramp.dir*20,y:16,z:ramp.z};assert(!metroPaidHall(s,start.x,start.z),'Street entrance must land in unpaid B1');
   const path=hallPath(s,start,{x:s.x-22,z:s.z-10.4});assert(path,'Cannot walk from entrance '+s.id+':'+e.number+' to security');
   assert(!hallPath(s,start,{x:gx+1,z:s.z+2}),'Entrance bypasses the closed fare boundary into B2');
   for(const q of path){Object.assign(p,q);metro.tick(0);}metro.use();metro.tick(3.1);assert(state.checked&&!state.paid);
   const toGate=hallPath(s,p,{x:gx-1,z:gz});assert(toGate,'Security cannot reach the gate');for(const q of toGate)Object.assign(p,q);
   metro.use();assert(state.gatePass?.entering);assert(!state.paid,'Ticket permission begins after crossing');
   for(let x=gx-1;x<=gx+1;x+=.1){assert(!blocked(x,16,gz),'Entry gate blocks passage');Object.assign(p,{x,y:16,z:gz});metro.tick(0);}
   assert(state.paid&&!state.gatePass);assert(blocked(gx,16,gz),'Paid ticket must not keep the gate open');
   for(let z=gz;z<=s.z+3;z+=.1)assert(!blocked(gx+2,16,z),'Gate cannot reach B2 escalator');
   assert(blocked(s.x,16,s.z-4),'Paid hall must not escape into the street entrance corridor');
   // Return travel can stay inside the fare area without another security check.
   assert(state.checked&&state.paid);
   Object.assign(p,{x:gx+1,y:16,z:gz});metro.use();assert(state.gatePass&&!state.gatePass.entering);
   for(let x=gx+1;x>=gx-1;x-=.1){assert(!blocked(x,16,gz),'Exit gate blocks passage');Object.assign(p,{x,y:16,z:gz});metro.tick(0);}
   assert(!state.checked&&!state.paid);assert(blocked(gx,16,gz));metro.use();assert(!state.gatePass,'Re-entry without screening must fail');
   assert(hallPath(s,p,start),'Exit gate cannot reach the original street ramp');
   Object.assign(p,{x:s.x-22,y:16,z:s.z-10.4});metro.use();metro.tick(3.1);Object.assign(p,{x:gx-1,y:16,z:gz});metro.use();metro.tick(4.1);
   assert(state.checked&&!state.paid&&!state.gatePass,'Expired gate must leave the passenger safely outside');
   console.log('PASS: '+s.id+' exit '+e.number+' street/B1/security/closed boundary/entry/B2/exit/re-entry/timeout');
  }
 }
}finally{globalThis.document=old;}
