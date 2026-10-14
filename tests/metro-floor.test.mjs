import assert from 'node:assert/strict';
import {VoxelWorld,overlaps} from '../game/world.js';
import {snapMetroFloor} from '../game/metro-floor.js';
const world=new VoxelWorld(),p={x:-106,y:15.989,z:67.53};
assert(overlaps(world,p.x,p.y,p.z),'Reproduce the fractional-foot voxel collision');const floor=snapMetroFloor(world,p,0);assert.equal(floor,16);assert(!overlaps(world,p.x,floor,p.z));
assert.equal(snapMetroFloor(world,{...p,z:67.4},0),16,'Ramp-to-hall boundary must retain flat support');
const next={x:-105.9945,y:15.9969,z:67.48};assert.equal(snapMetroFloor(world,next,-.19),16,'Align the destination of an axis step, not only its starting feet');assert(!overlaps(world,next.x,16,next.z));
assert.equal(snapMetroFloor(world,{...p,y:16.2},-1),null,'Do not snap a falling player through air');assert.equal(snapMetroFloor(world,p,1),null);assert.equal(snapMetroFloor(world,p,0,{flying:true}),null);assert.equal(snapMetroFloor(world,{x:130,y:15.99,z:300},0),null);
console.log('PASS: fractional ramp-floor edge and legacy feet align without changing jumps, flight, falls or other districts.');
