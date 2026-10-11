import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {METRO_STATIONS,METRO_RAMPS} from '../game/metro-layout.js';
import {createMetro} from '../game/metro.js';
import {blocksMetroClearance} from '../game/metro-clearance.js';
const world=new VoxelWorld();
for(const s of METRO_STATIONS){
 for(let x=s.x-35;x<=s.x+35;x++)for(let y=16;y<=21;y++)for(let z=s.z-15;z<=s.z+15;z++)assert.equal(world.get(x,y,z),0,'B1 original concourse must stay entirely clear');
 assert.equal(world.get(s.x,22,s.z),9,'Original ceiling remains');assert.equal(world.get(s.x-36,18,s.z),9,'Boundary walls remain');
 assert(blocksMetroClearance(s.x-22,20,s.z-8,9,0));assert(!blocksMetroClearance(s.x-22,20,s.z-8,0,0),'Keep manual removal repairs');
 assert(!blocksMetroClearance(s.x,5,s.z,9,9),'Do not change the existing platform floor');
 assert(blocksMetroClearance(s.x,5,s.z,0,9),'Restore manually removed platform floor');
 assert(blocksMetroClearance(s.x-36,18,s.z,0,9),'Restore the original room boundary');
}
assert(!blocksMetroClearance(120,27,308,7,0),'Home edits stay intact');assert(!blocksMetroClearance(-100,26,57,9,0),'Shop edits stay intact');
const entrance=METRO_RAMPS.find(r=>r.station==='nanjing'&&r.exit===1);
assert.equal(world.get(entrance.x+5,25,61),0,'Original ramp opening remains');assert(blocksMetroClearance(entrance.x+5,25,61,9,0),'Old saved infill must not reseal the ramp');
assert.equal(world.get(entrance.x+5,25,60),9,'Street paving beside the ramp remains solid');
globalThis.document={body:{append(){}},createElement:()=>({setAttribute(){},getContext:()=>({fillRect(){},fillText(){}})})};
const metro=createMetro({scene:new THREE.Scene(),getPos:()=>({x:-90,y:16,z:66}),place(){},setView(){},notify(){},getSound:()=>false});
let count=0;metro.root.updateMatrixWorld(true);metro.root.traverse(o=>{
 if(!o.userData.stationSign)return;const p=o.getWorldPosition(new THREE.Vector3());if(p.y<16||p.y>21)return;
 const box=new THREE.Box3().setFromObject(o);for(let x=Math.floor(box.min.x);x<=Math.floor(box.max.x);x++)for(let y=Math.floor(box.min.y);y<=Math.floor(box.max.y);y++)for(let z=Math.floor(box.min.z);z<=Math.floor(box.max.z);z++)assert.equal(world.get(x,y,z),0,'B1 sign face/support must not intersect infill');count++;
});assert(count>=6,'Both station guidance sets inspected');
console.log('PASS: original B1 rooms/sign volumes, preserved ceilings/walls/street paving, open ramps and selective save/live-placement clearance guards.');
