import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createBund} from '../game/bund.js';
import {createCityActivity} from '../game/city-activity.js';
const ctx=new Proxy({}, {get:(_,k)=>k==='measureText'?t=>({width:t.length*20}):()=>{}}),el=()=>({getContext:()=>ctx,addEventListener(){}});globalThis.document={createElement:el,getElementById:()=>el()};
const world=new VoxelWorld(),scene=new THREE.Scene(),p={x:-90,y:26,z:66};let activity;
const civil=createBund({scene,world,getPos:()=>p,getObstacles:()=>activity?.bundWalkers.map(b=>({root:b.root,person:true}))??[]});
activity=createCityActivity({scene,world,getPos:()=>p,getState:()=>({food:0}),teleport(){},notify(){},pause(){},resume(){},onProgress(){},extraCrowd:civil.pedestrians.filter(p=>p.kind==='shop'),getVehicles:()=>civil.traffic.agents,getTrafficTime:()=>civil.traffic.time});
const travel=activity.bundWalkers.map(()=>0);let wall=0,overlap=0,stele=0;const samples=[];
for(let i=0;i<2400;i++){const before=activity.bundWalkers.map(p=>p.root.position.clone());civil.tick(.05);activity.tick(.05);activity.bundWalkers.forEach((p,j)=>travel[j]+=p.root.position.distanceTo(before[j]));
 for(const a of activity.bundWalkers){const q=a.root.position;if(overlaps(world,q.x,26,q.z)){wall++;if(samples.length<4)samples.push({type:'wall',at:q.toArray()});}
 if(Math.abs(q.x+35)<.94&&Math.abs(q.z-66)<2.14)stele++;
 for(const b of [...activity.bundWalkers,...activity.tourists])if(a!==b&&b.root.visible!==false&&q.distanceToSquared(b.root.position)<.81){overlap++;if(samples.length<4)samples.push({type:'crowd',at:q.toArray()});}
 }
}
assert.equal(wall,0);assert.equal(overlap,0);assert.equal(stele,0);assert(travel.every(d=>d>2),'All added walkers must make progress over two minutes: '+travel);const pose=activity.bundWalkers.map(p=>[...p.root.position.toArray(),p.root.rotation.y,...p.legs.map(l=>l.rotation.x)]);activity.tick(0);assert.deepEqual(activity.bundWalkers.map(p=>[...p.root.position.toArray(),p.root.rotation.y,...p.legs.map(l=>l.rotation.x)]),pose);console.log('PASS: twenty new walkers, two-minute world/stele/shared-crowd clearance, progress and pause-safe poses.');
