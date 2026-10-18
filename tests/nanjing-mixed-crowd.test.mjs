import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {createBund} from '../game/bund.js';
import {createCityActivity} from '../game/city-activity.js';
import {vehicleContact} from '../game/vehicle-dynamics.js';
const ctx=new Proxy({measureText:s=>({width:String(s).length*10})},{get:(o,k)=>o[k]??(()=>{})}),el=()=>({getContext:()=>ctx,addEventListener(){}});
globalThis.document={createElement:el,getElementById:el};
const world=new VoxelWorld(),scene=new T.Scene(),getPos=()=>({x:-90,y:26,z:66});let activity;
const civil=createBund({scene,world,getPos,getObstacles:()=>activity?[...activity.tourists,...activity.bundWalkers,...activity.vendors].map(p=>({root:p.root,person:true})):[]});
activity=createCityActivity({scene,world,getPos,getState:()=>({food:0}),teleport(){},notify(){},pause(){},resume(){},onProgress(){},otherPeople:[...civil.pedestrians.filter(p=>p.kind!=='shop'),...civil.traffic.officers],extraCrowd:civil.pedestrians.filter(p=>p.kind==='shop'),getVehicles:()=>civil.traffic.agents,getTrafficTime:()=>civil.traffic.time});
const people=[...activity.tourists,...activity.bundWalkers,...civil.pedestrians.filter(p=>p.kind==='shop'),...activity.vendors,...civil.pedestrians.filter(p=>p.kind!=='shop'),...civil.traffic.officers],travel=new Map(people.map(p=>[p,0])),overlaps=new Map();let frames=0,clock=0,maxStep=0;
const riders=civil.traffic.riders.filter(p=>p.kind==='delivery'),riderTravel=new Map(riders.map(p=>[p,0]));let riderContacts=0;
while(clock<240){const dt=[.016,.08,.1,.033][frames++%4],before=people.map(p=>p.root.position.clone());activity.tick(dt);civil.tick(dt);clock+=dt;
 for(const rider of riders){if(clock>180)riderTravel.set(rider,riderTravel.get(rider)+Math.abs(rider.travelSpeed)*dt);for(const p of people)if(p.root.visible!==false&&vehicleContact(rider,rider.root.position.x,rider.root.position.y,rider.root.position.z,rider.root.rotation.y,{root:p.root,person:true}))riderContacts++;}
 for(let i=0;i<people.length;i++){const p=people[i];if(p.root.visible===false)continue;const d=p.root.position.distanceTo(before[i]);maxStep=Math.max(maxStep,d);if(clock>180)travel.set(p,travel.get(p)+d);if(d>1e-6&&(p.crowd||p.strollState))assert(-(Math.sin(p.root.rotation.y)*(p.root.position.x-before[i].x)+Math.cos(p.root.rotation.y)*(p.root.position.z-before[i].z))/d>.4,'Pedestrians face their walking direction');
  for(let j=i+1;j<people.length;j++){const q=people[j];if(q.root.visible===false||Math.abs(p.root.position.y-q.root.position.y)>2)continue;const dist=p.root.position.distanceTo(q.root.position);if(dist<.9-1e-7){const key=i+':'+j,old=overlaps.get(key);overlaps.set(key,{i,j,a:p.kind??'bund',b:q.kind??'bund',min:Math.min(old?.min??Infinity,dist),frames:(old?.frames??0)+1,at:p.root.position.toArray()});}}
 }
}
const moving=people.filter(p=>!p.stationary&&(p.crowd||p.strollState));
assert.equal(overlaps.size,0,JSON.stringify([...overlaps.values()]));assert(moving.every(p=>travel.get(p)>2),JSON.stringify(moving.filter(p=>travel.get(p)<=2).map(p=>({kind:p.kind,at:p.root.position.toArray()}))));assert.equal(moving.filter(p=>p.kind==='delivery-walk').length,3);assert(maxStep<.19,'Variable frame times cannot teleport pedestrians');
assert.equal(riderContacts,0,'Electric delivery riders and pedestrians must not interpenetrate');assert.equal(riders.length,8);assert(riders.every(p=>riderTravel.get(p)>2),'Every electric rider must still progress in the final minute: '+JSON.stringify(riders.map(p=>({id:p.trafficId,d:riderTravel.get(p),at:p.root.position.toArray(),reason:p.waitReason,wait:p.waitTime,lane:p.lane,detour:p.detour,near:people.filter(o=>o.root.position.distanceTo(p.root.position)<5).map(o=>({kind:o.kind,at:o.root.position.toArray(),state:o.crowd?.state??o.strollState,goal:o.crowd?.goal}))}))));
console.log('PASS: four-minute mixed city crowd, variable 10–60 Hz cadence, no peer overlap, every delivery walker and commuter progresses.');
console.log(JSON.stringify({people:people.length,minimumMovingTravel:Math.min(...moving.map(p=>travel.get(p))),electricRiderTravel:riders.map(p=>riderTravel.get(p)),riderContacts,maxStep,overlaps:overlaps.size}));
