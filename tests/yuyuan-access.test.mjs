import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {DENSE_BUILDINGS} from '../game/city-layout.js';
import {METRO_STATIONS} from '../game/metro-layout.js';
import {LINE10_WORLD_STATIONS} from '../game/metro-line10-layout.js';
import {YUYUAN,YUYUAN_SHIFT,GARDEN_BEDS,WATER_CORRIDOR} from '../game/yuyuan-layout.js';
import {yuyuanWalkRoute} from '../game/yuyuan-access.js';
import {createBund} from '../game/bund.js';
import {vehicleContact} from '../game/vehicle-dynamics.js';
const world=new VoxelWorld();assert.equal(DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-')).length,22);assert(DENSE_BUILDINGS.some(b=>b.id==='nanjing-infill-1--87'));
assert.deepEqual(METRO_STATIONS[0].exits.map(e=>[e.number,e.x,e.z]),[[1,-135,61.35],[4,-107,70.65]]);assert.equal(LINE10_WORLD_STATIONS[0].exits.length,0,'No extra street portal may replace Nanjing shops');assert.deepEqual(LINE10_WORLD_STATIONS[1].exits.map(e=>[e.x,e.z]),[[-86,212],[-86,262]]);
const route=yuyuanWalkRoute(world);assert(route.length>3);assert.equal(yuyuanWalkRoute(world),route,'Reuse one street route instead of rebuilding it every map frame');for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.12);for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n;assert(!overlaps(world,x,26,z)&&world.get(Math.floor(x),25,Math.floor(z)));}}
assert(world.get(-60,25,180+YUYUAN_SHIFT),'The water corridor must have a solid deck');assert(!world.get(-57,25,180+YUYUAN_SHIFT),'Water must surround the corridor');assert(world.get(-61,23,176+YUYUAN_SHIFT),'The water corridor must have supporting piers');assert(GARDEN_BEDS.reduce((n,b)=>n+(b.x2-b.x1+1)*(b.z2-b.z1+1),0)>550);
const old=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})};try{const city=createBund({scene:new THREE.Scene(),world,getPos:()=>({x:0,y:26,z:0})}),stop=city.traffic.stops.find(s=>s.name==='南京路石碑');assert(stop&&Math.hypot(stop.root.position.x+35,stop.root.position.z-66)<10);assert(city.traffic.buses.some(b=>b.stopDs?.includes(stop.d)));for(let i=0;i<600;i++){city.traffic.tick(.1);for(let a=0;a<city.traffic.agents.length;a++)for(let b=a+1;b<city.traffic.agents.length;b++){const p=city.traffic.agents[a].root.position;assert(!vehicleContact(city.traffic.agents[a],p.x,p.y,p.z,city.traffic.agents[a].root.rotation.y,city.traffic.agents[b]));}}}finally{globalThis.document=old;}
console.log('PASS: original Nanjing frontage/entrances, two garden-side Yuyuan portals, actual supported street/alleys route, water corridor/piers/green beds, Nanjing scheduled bus stop and swept traffic clearance.');
