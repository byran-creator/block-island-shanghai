import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createBund,routePose} from '../game/bund.js';
import {createCommute} from '../game/commute.js';
import {vehicleContact} from '../game/vehicle-dynamics.js';
import {createCityActivity} from '../game/city-activity.js';
import {createBuildingResidents} from '../game/building-residents.js';
import {pedestrianBlocked,pedestrianStepClear} from '../game/pedestrian-traffic.js';

const bus={root:new THREE.Group(),halfWidth:.93,halfLength:2.45,height:2.1};bus.root.position.set(0,26,0);
assert(pedestrianBlocked({x:1,y:26,z:0},[bus]));
assert(!pedestrianBlocked({x:1.4,y:26,z:0},[bus]));
assert(!pedestrianStepClear({x:-3,y:26,z:0},{x:3,y:26,z:0},[bus]),'Swept pedestrian path must not pass through a bus even when both endpoints are clear');
bus.root.rotation.y=Math.PI/4;assert(pedestrianBlocked({x:1,y:26,z:1},[bus]));
assert(!pedestrianBlocked({x:0,y:6,z:0},[bus]),'Underground passengers must not collide with street buses');

const previous=globalThis.document,context={fillRect(){},clearRect(){},save(){},restore(){},translate(){},scale(){},rotate(){},fill(){},closePath(){},strokeRect(){},fillText(){},strokeText(){},beginPath(){},arc(){},stroke(){},moveTo(){},lineTo(){}};
const element=()=>({children:[],appendChild(e){this.children.push(e);},replaceChildren(){},addEventListener(){},getContext:()=>context});
const ids=new Map();globalThis.document={getElementById(id){if(!ids.has(id))ids.set(id,element());return ids.get(id);},createElement:element};
try{
 const world=new VoxelWorld(),scene=new THREE.Scene(),viewer={x:0,y:26,z:99};let activity,residents,city,commute;
 const people=()=>[...(city?.pedestrians??[]),...(activity?.tourists??[]),...(activity?.vendors??[]),...(residents?.people??[]),...(city?.traffic.officers??[])];
 city=createBund({scene,world,getPos:()=>viewer,getObstacles:()=>[...(commute?.vehicles??[]),...people().map(p=>({root:p.root,person:true}))]});
 const getVehicles=()=>[...city.traffic.agents,...(commute?.vehicles??[])];
 activity=createCityActivity({scene,world,getPos:()=>viewer,getVehicles,getState:()=>({}),teleport(){},notify(){},pause(){},resume(){},onProgress(){}});
 residents=createBuildingResidents({scene,world,getPos:()=>viewer,getVehicles});
 commute=createCommute({scene,world,civil:city,activity,getPos:()=>viewer,blocked:(x,y,z)=>overlaps(world,x,y,z)||activity.collides(x,y,z),place(){},setView(){},turnView(){},notify(){},getActors:()=>people()});
 const agents=city.traffic.agents,recent=new Map(agents.map(v=>[v,0]));let checks=0,waiting=0;
 for(let i=0;i<7200;i++){
  if(i%450===0)Object.assign(viewer,i%900===0?{x:0,y:26,z:99}:{x:190,y:6,z:78});
  // Match the actual frame order; include every moving pedestrian system.
  activity.tick(.1);city.tick(.1);residents.tick(.1);
  for(const p of people())if(p.root.visible){assert(!pedestrianBlocked(p.root.position,agents),'Pedestrian intersected traffic: '+JSON.stringify({kind:p.kind??p.npcRole,x:p.root.position.x,z:p.root.position.z,i}));checks++;}
  for(let a=0;a<agents.length;a++)for(let b=a+1;b<agents.length;b++){const v=agents[a];assert(!vehicleContact(v,v.root.position.x,v.root.position.y,v.root.position.z,v.root.rotation.y,agents[b]),'Traffic bodies overlap during the all-NPC simulation');}
  if(i>=6600)for(const v of agents)recent.set(v,recent.get(v)+v.travelSpeed*.1);
  if(i%900===899)console.log('Full traffic simulated seconds:',(i+1)/10);
  waiting+=agents.filter(v=>v.waitReason==='obstacle').length;
 }
 console.log('Final stopped agents:',JSON.stringify(agents.filter(v=>recent.get(v)<1).map(v=>{const p=routePose(v.route,v.t+v.dir*.3,v.lane);p.x+=.5;p.z+=.5;p.yaw+=v.dir<0?Math.PI:0;return {kind:v.kind,wait:v.waitTime,reason:v.waitReason,x:v.root.position.x,z:v.root.position.z,contacts:[...agents,...commute.vehicles,...people().map(p=>({root:p.root,person:true,kind:p.kind??p.npcRole}))].filter(o=>vehicleContact(v,p.x,p.y,p.z,p.yaw,o)).map(o=>({kind:o.kind,person:!!o.person,x:o.root.position.x,z:o.root.position.z,visible:o.root.visible}))};})));
 assert(agents.every(v=>recent.get(v)>1),'Pedestrian waiting must not permanently trap vehicles');
 console.log('PASS: bus body and swept crossing collision, twelve-minute all-NPC/traffic clearance and final-minute vehicle progress.',{checks,waiting,minimumProgress:Math.min(...recent.values())});
}finally{globalThis.document=previous;}
