import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createBund} from '../game/bund.js';
import {createCityActivity} from '../game/city-activity.js';
import {CROWD_SEPARATION} from '../game/street-crowd.js';
const ctx=new Proxy({}, {get:(_,k)=>k==='measureText'?t=>({width:t.length*20}):()=>{}}),el=()=>({getContext:()=>ctx,addEventListener(){}}),old=globalThis.document;
globalThis.document={createElement:el,getElementById:()=>el()};
try{
 const world=new VoxelWorld(),scene=new THREE.Scene(),getPos=()=>({x:-100,y:26,z:66}),civil=createBund({scene,world,getPos});
 const extra=civil.pedestrians.filter(p=>p.kind==='shop');
 const activity=createCityActivity({scene,world,getPos,extraCrowd:extra,getState:()=>({food:0}),teleport(){},notify(){},pause(){},resume(){},onProgress(){}});
 const walkers=[...activity.tourists.filter(p=>!p.stationary),...extra],travel=walkers.map(()=>0);assert.equal(walkers.length,55);assert(extra.every(p=>p.crowdManaged));
 let maximumTurn=0,maximumLegStep=0,shortStops=0;
 for(let i=0;i<2400;i++){const before=walkers.map(p=>p.root.position.clone()),poses=walkers.map(p=>({yaw:p.root.rotation.y,leg:p.legs[0].rotation.x,state:p.crowd.state}));civil.tick(.05);activity.tick(.05);
  for(let a=0;a<walkers.length;a++){const p=walkers[a],d=p.root.position.distanceTo(before[a]);assert(d<.09,'No crowd teleport or independent route overwrite');if(i>1200)travel[a]+=d;assert(!overlaps(world,p.root.position.x,26,p.root.position.z),'Walkers cannot enter walls');
   if(i>60){maximumTurn=Math.max(maximumTurn,Math.abs(Math.atan2(Math.sin(p.root.rotation.y-poses[a].yaw),Math.cos(p.root.rotation.y-poses[a].yaw))));maximumLegStep=Math.max(maximumLegStep,Math.abs(p.legs[0].rotation.x-poses[a].leg));if(poses[a].state==='walk'&&p.crowd.state==='yield')shortStops++;}
   for(let b=a+1;b<walkers.length;b++)assert(p.root.position.distanceToSquared(walkers[b].root.position)>CROWD_SEPARATION**2-1e-8,'Street and Bund crowds must avoid each other, including bags and arms');
  }
 }
 assert(travel.every(d=>d>2),'Every shared walker must make progress in the final minute: '+JSON.stringify(walkers.map((p,i)=>({i,d:travel[i],at:p.root.position.toArray(),goal:p.crowd.goal,blocked:p.crowd.blocked,state:p.crowd.state})).filter(p=>p.d<=2)));
 assert(maximumTurn<.4,'Bodies must not snap between headings in a 50ms frame');assert(maximumLegStep<.15,'Stopping/restarting must not pop leg poses');assert(shortStops<2000,'Avoid frequent single-step walk/yield oscillation');
 const pose=()=>walkers.map(p=>[...p.root.position.toArray(),p.root.rotation.y,...p.legs.map(l=>l.rotation.x),...p.arms.map(l=>l.rotation.x)]),paused=pose();activity.tick(0);assert.deepEqual(pose(),paused,'Pause must preserve the complete walking pose');
 console.log('Motion continuity:',{maximumTurn,maximumLegStep,shortStops});
 console.log('PASS: full city, two formerly independent groups, 55 walkers, two minutes, no cross-group overlap/walls/teleports, final-minute minimum travel '+Math.min(...travel).toFixed(2)+'m.');
}finally{globalThis.document=old;}
