import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {BRIDGES} from '../game/shanghai-map.js';
import {ALL_BUILDINGS,CAR_ROUTES,roadContains} from '../game/city-layout.js';
import {createCityTraffic} from '../game/city-traffic.js';
import {routePose,waterfrontParapetSpans} from '../game/bund.js';
import {nanpuSurfaceAt} from '../game/bridge-road.js';
import {createStaticSolids} from '../game/static-solids.js';

const oldDocument=globalThis.document;
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};
try{
 const world=new VoxelWorld(),solids=createStaticSolids();
 const traffic=createCityTraffic({scene:new THREE.Scene(),world,getPos:()=>({x:0,y:26,z:0}),routePose,cars:[],solids});
 const poles=createStaticSolids();
 for(const signal of traffic.signals){
  assert.equal(signal.posts.length,signal.id==='bund-66'||signal.id==='stele-66'?1:4,signal.id);
  for(const post of signal.posts){const {x,z}=post.position;
   for(const [dx,dz] of [[0,0],[-.5,0],[.5,0],[0,-.5],[0,.5]])assert(!roadContains(x+dx,z+dz),signal.id);
   assert(world.get(Math.floor(x),25,Math.floor(z)),signal.id+' must stand on ground');
   assert(solids.collides(x,26,z,.03,1),signal.id+' must have a collision box');
   poles.add(x-.075,26,z-.075,x+.075,31.4,z+.075,'pole');
  }
 }
 for(const route of CAR_ROUTES)for(let i=0;i<route.samples.length;i+=2)for(const [lane,w,l] of [[-2.2,.93,2.45],[2.2,.93,2.45],[4,.45,1.06]]){
  const p=routePose(route.samples,route.samples[i].d,lane);
  assert(!poles.vehicleCollides(p.x+.5,p.y,p.z+.5,p.yaw,w,l),route.id+' hits a signal post');
 }
 for(let z=-148;z<=240;z+=8)for(const [a,b] of waterfrontParapetSpans(z,150,110)){
  if(nanpuSurfaceAt(150,206.5)!==null)assert(b<=202.5||a>=210.5,'Parapet blocks the bridge');
 }
 for(const bridge of BRIDGES.filter(b=>b.id==='sand'||b.id==='home')){
  for(const b of ALL_BUILDINGS)assert(!bridge.samples.some(p=>Math.abs(p.x-b.x)<=b.rx+bridge.width+1&&Math.abs(p.z-b.z)<=b.rz+bridge.width+1),bridge.id+' blocked by '+b.id);
  for(let i=0;i<bridge.samples.length;i+=3){const p=bridge.samples[i];let clear=false;
   for(let y=Math.floor(p.y)-1;y<=Math.ceil(p.y)+2;y++)if(world.get(Math.floor(p.x),y-1,Math.floor(p.z))&&!overlaps(world,p.x+.5,y,p.z+.5)){clear=true;break;}
   assert(clear,bridge.id+' blocked near '+p.x+','+p.z);
  }
 }
}finally{globalThis.document=oldDocument;}
console.log('PASS: signal poles, vehicle lanes, bridge parapet and island approaches.');
