import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';import {VoxelWorld} from '../game/world.js';import {createBund} from '../game/bund.js';import {createStaticSolids} from '../game/static-solids.js';import {CRUISE_DOCK} from '../game/huangpu-cruise-service.js';
import {JOURNEY_ACTORS} from '../game/shanghai-journey-content.js';import {safeLanding} from '../game/map-travel.js';
import {createCityActivity} from '../game/city-activity.js';
const solids=createStaticSolids();solids.add(7.9,26,7.9,8.1,27,8.1,'boundary');assert(solids.collides(7.65,26,7.65));assert(!solids.collides(7.5,26,7.5));assert(!solids.collides(8,27,8));assert(!solids.collides(8,23,8));
const previous=globalThis.document;const ctx=new Proxy({},{get:(_,key)=>key==='measureText'?text=>({width:text.length*16}):key==='createLinearGradient'||key==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});const element=()=>({getContext:()=>ctx,addEventListener(){}});globalThis.document={createElement:element,getElementById:element};
try{
 const scene=new T.Scene(),world=new VoxelWorld(),pos={x:0,y:26,z:66};let civil;civil=createBund({scene,world,getPos:()=>pos,place:p=>Object.assign(pos,p)});
 for(const b of civil.benches){assert(civil.staticCollides(b.seatX,26,b.z),'Walkers cannot pass through the seat');assert(civil.collides(b.seatX,26,b.z),'Public player collision includes furniture');Object.assign(pos,{x:b.seatX,y:26,z:b.z});civil.sit(b);assert(civil.standUp(),'Every bench has an exit');assert(!civil.staticCollides(pos.x,pos.y,pos.z),'Every seated exit lands outside fixtures');}
 const kinds=new Set(civil.fixtures.map(b=>b.kind));for(const kind of ['bench','parapet','lamp','tree'])assert(kinds.has(kind));
 const actor=JOURNEY_ACTORS.lin,start={x:actor.x-1.5,y:actor.y,z:actor.z-2},blocked=(x,y,z)=>civil.staticCollides(x,y,z);
 assert(blocked(start.x,start.y,start.z),'The old cinematic arrival intersects an actual bench');const landing=safeLanding(world,start,blocked);assert(landing&&!blocked(landing.x,landing.y,landing.z),'First arrival and legacy positions have a nearby unblocked pavement landing');assert(Math.hypot(landing.x-start.x,landing.z-start.z)<2,'Recovery stays next to the volunteer');
 for(const b of civil.fixtures){assert(civil.staticCollides((b.minX+b.maxX)/2,b.minY,(b.minZ+b.maxZ)/2),b.kind+' survives render merging');assert(!civil.staticCollides((b.minX+b.maxX)/2,40,(b.minZ+b.maxZ)/2),'Fixture never creates a wall at high floors');}
 for(const b of civil.fixtures.filter(b=>b.kind==='parapet'))assert(CRUISE_DOCK.z<b.minZ||CRUISE_DOCK.z>b.maxZ,'The boarding opening has no wall collider');
 const bench=civil.benches.find(b=>b.z>50);Object.assign(pos,{x:bench.seatX+.85,y:26,z:bench.z});assert(civil.use());assert(civil.isSeated());assert(civil.standUp());assert(!civil.staticCollides(pos.x,pos.y,pos.z),'Sitting and standing remain usable');
 const b=civil.fixtures.find(b=>b.kind==='parapet'&&b.minZ>60),z=(b.minZ+b.maxZ)/2;let x=b.minX-.8;for(let i=0;i<200;i++){const next=x+.04;if(!civil.staticCollides(next,26,z))x=next;}assert(x<b.minX,'Repeated walk steps cannot cross a waterfront panel');
 const activity=createCityActivity({scene,world,getPos:()=>pos,getState:()=>({}),teleport(){},notify(){},pause(){},resume(){},onProgress(){},solidAt:civil.staticCollides}),travel=activity.bundWalkers.map(()=>0);
 for(let i=0;i<600;i++){const before=activity.bundWalkers.map(p=>p.root.position.clone());activity.tick(.05);civil.tick(.05);for(const [j,p]of activity.bundWalkers.entries()){assert(!civil.staticCollides(p.root.position.x,p.root.position.y,p.root.position.z,.36),'Nearby visitors respect the shared fixture index');travel[j]+=p.root.position.distanceTo(before[j]);}for(const p of civil.pedestrians)if(p.root.visible)assert(!civil.staticCollides(p.root.position.x,p.root.position.y,p.root.position.z,.36),'Promenade walker overlaps furniture '+JSON.stringify({i,kind:p.kind,pos:p.root.position.toArray(),crowdManaged:p.crowdManaged,fixture:civil.fixtures.filter(b=>p.root.position.x+.36>b.minX&&p.root.position.x-.36<b.maxX&&p.root.position.z+.36>b.minZ&&p.root.position.z-.36<b.maxZ)}));}
 assert(travel.every(d=>d>.1),'Shared fixtures must not immobilize nearby visitors');
 console.log('PASS: indexed bench/wall/pole/tree collision, heights, cell boundaries, seated exit and cruise gap.');
}finally{globalThis.document=previous;}


