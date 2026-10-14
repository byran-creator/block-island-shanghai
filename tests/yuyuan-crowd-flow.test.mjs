import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createYuyuan} from '../game/yuyuan.js';
const old=globalThis.document,ctx=new Proxy({},{get:()=>()=>{}}),node=()=>({children:[],appendChild(c){this.children.push(c);},replaceChildren(){this.children=[];},addEventListener(){},getContext:()=>ctx});globalThis.document={createElement:node,getElementById:()=>node()};
try{
 const world=new VoxelWorld(),district=createYuyuan({scene:new THREE.Scene(),world,getPos:()=>({x:0,y:26,z:0}),getState:()=>({}),pause(){},resume(){},notify(){}}),people=district.crowd.people;
 assert.equal(district.crowd.navigationError,null);assert.equal(people.filter(a=>!a.inner).length,40);assert.equal(people.filter(a=>a.inner).length,3);assert.equal(new Set(people.filter(a=>a.inner).map(a=>a.pose)).size,3,'Inner visitors cannot march along one common circuit');
 let time=0,frame=0,lastMinute=null;const pattern=[1/60,1/30,.08,1/60,.035];
 while(time<720){const dt=Math.min(pattern[frame++%pattern.length],720-time),before=people.map(a=>({x:a.root.position.x,z:a.root.position.z}));district.crowd.tick(dt);time+=dt;for(let i=0;i<people.length;i++){const a=people[i],p=a.root.position;assert(Math.hypot(p.x-before[i].x,p.z-before[i].z)<=a.speed*dt+1e-5,'Recovery must walk, never teleport');}if(!lastMinute&&time>=660)lastMinute=people.map(a=>a.travel);if(frame%60===0)for(const a of people){const p=a.root.position;assert(!overlaps(world,p.x,26,p.z)&&!district.collides(p.x,26,p.z),'Visitor intersects a wall/model');}}
 assert(people.every((a,i)=>a.travel-lastMinute[i]>12),'Every visitor must still make progress after 11 minutes');assert(people.filter(a=>a.inner).every(a=>a.browseCount>1),'Each inner visitor should stop and look around independently');
 const positions=people.map(a=>a.root.position.clone());district.crowd.tick(0);people.forEach((a,i)=>assert(a.root.position.equals(positions[i]),'Paused crowd must freeze'));
 // A saved/manual obstacle can arrive after the paths were planned. Check
 // actual detour recovery without replacing world cells or moving the actor.
 const a=people.find(a=>!a.inner&&a.root.position.x<-64&&a.root.position.z<250),q=a.pose(a.d+1.6),x=Math.floor(q.x),z=Math.floor(q.z),original=[world.get(x,26,z),world.get(x,27,z)];world.set(x,26,z,9);world.set(x,27,z,9);const travel=a.travel;
 for(let i=0;i<1800;i++)district.crowd.tick(1/60);if(a.travel-travel<=8)console.log(JSON.stringify({travel:a.travel-travel,position:{x:a.root.position.x,z:a.root.position.z},d:a.d,wait:a.wait,pause:a.pause,obstacle:{x,z},target:a.detour?.points[a.detour.index],detourLength:a.detour?.points.length,index:a.detour?.index,near:people.filter(b=>b!==a&&b.root.position.distanceTo(a.root.position)<2).map(b=>({x:b.root.position.x,z:b.root.position.z,wait:b.wait,detour:!!b.detour}))}));assert(a.travel-travel>8,'A new obstruction permanently froze its visitor');assert.equal(world.get(x,26,z),9,'NPC routing must not remove player blocks');world.set(x,26,z,original[0]);world.set(x,27,z,original[1]);
 console.log('PASS: 40 public visitors, three separate inner routes, variable-frame 12-minute sustained progress, natural independent browsing, no teleport/wall clipping, pause and live-obstacle recovery.');
}finally{globalThis.document=old;}
