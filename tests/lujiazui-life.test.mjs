import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {roadContains} from '../game/city-layout.js';
import {createLujiazuiPeople,createLujiazuiFlow,LUJIAZUI_FORECOURTS} from '../game/lujiazui-life.js';
const world=new VoxelWorld();
for(const a of LUJIAZUI_FORECOURTS)for(let x=a.x1;x<=a.x2;x+=.5)for(let z=a.z1;z<=a.z2;z+=.5){
 assert(!overlaps(world,x,26,z)&&overlaps(world,x,25.9,z),a.id+' needs existing open, supported pavement');
 for(const dx of [-.55,.55])for(const dz of [-.55,.55])assert(!roadContains(x+dx,z+dz),a.id+' must keep the complete body off roads');
}
const box=new T.BoxGeometry(1,1,1),material=new T.MeshLambertMaterial({color:'#7799aa'}),cube=(parent,color,x,y,z,w,h,d)=>{const m=new T.Mesh(box,material);m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;};
const person=(i,unused,role)=>{const root=new T.Group();root.userData.role=role;const arms=[-.29,.29].map(x=>cube(root,'',x,1.02,0,.15,.55,.18)),legs=[-.13,.13].map(x=>cube(root,'',x,.36,0,.17,.7,.2));return {root,arms,legs};};
const people=createLujiazuiPeople({person,cube});assert.equal(people.length,18);assert.equal(people.filter(p=>p.root.userData.role==='office').length,8);assert.equal(people.filter(p=>p.camera).length,6);
const flow=createLujiazuiFlow(people,{world,others:()=>people});flow.tick(0);assert(people.every(p=>p.ready));
const travel=people.map(()=>0),recent=people.map(()=>0);let clock=0,photos=0;
while(clock<180){const dt=[.016,.08,.1,.033][Math.floor(clock*20)%4],before=people.map(p=>p.root.position.clone());flow.tick(dt);clock+=dt;
 for(let i=0;i<people.length;i++){const p=people[i],d=p.root.position.distanceTo(before[i]);assert(d<.15,'No warping between independent pedestrian goals');travel[i]+=d;if(clock>120)recent[i]+=d;
  assert(!overlaps(world,...p.root.position.toArray())&&overlaps(world,p.root.position.x,25.9,p.root.position.z));assert(!roadContains(p.root.position.x,p.root.position.z));assert([6,7,9].includes(world.get(Math.floor(p.root.position.x),25,Math.floor(p.root.position.z))),'Walk on existing paths, not the lawns');
  for(let j=i+1;j<people.length;j++)assert(p.root.position.distanceTo(people[j].root.position)>=.9-1e-5,'Pedestrians must avoid each other');
  if(p.photoLift>.8){photos++;assert(p.camera.position.z<-.35,'Raised camera must be in front of the face');}
 }
}
assert(recent.every(d=>d>2),'Every person must still move in the final minute');assert(new Set(people.map(p=>p.speed.toFixed(3))).size>12,'Independent walking speeds');assert(photos>20,'Visitors must actually stop to photograph the skyline');
console.log(JSON.stringify({people:people.length,office:8,visitors:10,photographers:6,seconds:clock,minRecent:Math.min(...recent),photos}));
