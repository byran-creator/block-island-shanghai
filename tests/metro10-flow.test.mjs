import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createMetroNetwork} from '../game/metro-network.js';
import {LINE10_STATIONS,LINE10_RAMPS,line10ToWorld,line10RampFloor,line10RampAt} from '../game/metro-line10-layout.js';
const previous=globalThis.document,ctx=new Proxy({},{get:(_,key)=>key==='measureText'?text=>({width:text.length*16}):()=>{}});globalThis.document={hidden:false,body:{append(){},classList:{toggle(){}}},createElement:()=>({hidden:true,setAttribute(){},getContext:()=>ctx})};
try{
 const world=new VoxelWorld(),pos={x:0,y:26,z:0},metro=createMetroNetwork({scene:new THREE.Scene(),getPos:()=>pos,place:p=>Object.assign(pos,p),setView(){},notify(){},getSound:()=>false});
 const tick=dt=>metro.tick(dt,{playing:true,sound:false}),set=p=>Object.assign(pos,line10ToWorld(p));
 function blocked(p){const q=line10ToWorld(p),h=line10RampFloor(p.x,p.z);return metro.collides(q.x,q.y,q.z)||overlaps(world,q.x,h!==null?Math.max(q.y,Math.ceil(h)):q.y,q.z);}
 function path(s,a,b){const queue=[a],seen=new Set([a.x+','+a.z]),parents=new Map();let end=null;
  for(let i=0;i<queue.length;i++){const p=queue[i];if(Math.hypot(p.x-b.x,p.z-b.z)<.51){end=p;break;}for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const q={x:p.x+dx,y:16,z:p.z+dz},key=q.x+','+q.z,h=line10RampFloor(q.x,q.z),r=line10RampAt(q.x,q.z);if(seen.has(key)||Math.abs(q.x-s.x)>34.5||Math.abs(q.z)>14||h!==null&&Math.abs(h-16)>.01||r&&(q.x-r.x)*r.dir>=-2&&(q.x-r.x)*r.dir<=r.length+2&&Math.abs(h-16)>.01||blocked(q))continue;seen.add(key);parents.set(key,p);queue.push(q);}}
  if(!end)return null;const out=[];while(end){out.push(end);end=parents.get(end.x+','+end.z);}return out.reverse();
 }
 for(const s of LINE10_STATIONS)for(const e of s.exits){metro.restore(null);set({x:e.x,y:26,z:e.z});tick(0);const r=LINE10_RAMPS.find(r=>r.station===s.id&&r.exit===e.number),state=metro.lines[10].stations.find(a=>a.id===s.id),gx=s.x-14;
  for(let d=0;d<=20;d+=.1){const q={x:r.x+r.dir*d,y:line10RampFloor(r.x+r.dir*d,r.z),z:r.z};assert(!blocked(q),s.id+':'+e.number+' street ramp blocks at '+d);}
  const start={x:r.x+r.dir*20,y:16,z:r.z};assert(start.z<-4,'Surface entry must land in the unpaid strip');
  const toScan=path(s,start,{x:s.x-22,y:16,z:-10.4});assert(toScan,s.id+':'+e.number+' cannot reach scanner');for(const q of toScan)set(q);assert(metro.use());tick(3.1);assert(state.checked&&!state.paid);
  const toGate=path(s,toScan.at(-1),{x:gx-1,y:16,z:0});assert(toGate);for(const q of toGate)set(q);assert(metro.use());assert(state.gatePass?.entering);for(let x=gx-1;x<=gx+1;x+=.1){assert(!blocked({x,y:16,z:0}));set({x,y:16,z:0});tick(0);}assert(state.paid);
  const toPlatform=path(s,{x:gx+1,y:16,z:0},{x:s.x-12,y:16,z:3});assert(toPlatform,'Paid gate must reach down escalator');
  for(let d=0;d<=18;d+=.1)assert(!blocked({x:s.x-12+d,y:16-10*d/18,z:3}));
  // Return to B1 and leave only after the exit gate accepts the ticket.
  set({x:gx+1,y:16,z:0});assert(metro.use());assert(state.gatePass&&!state.gatePass.entering);for(let x=gx+1;x>=gx-1;x-=.1){assert(!blocked({x,y:16,z:0}));set({x,y:16,z:0});tick(0);}assert(!state.checked&&!state.paid);assert(!path(s,{x:gx-1,y:16,z:0},{x:gx+2,y:16,z:3}),'Closed unpaid gate must not bypass security');assert(path(s,{x:gx-1,y:16,z:0},start),'Exit gate must reach the same street ramp');
  console.log('PASS: 10号线 '+s.id+' exit '+e.number+' street/unpaid hall/security/gate/platform/exit/re-entry');
 }
}finally{globalThis.document=previous;}
