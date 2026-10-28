import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {nearSampledRoad,createRoadClearance} from '../game/road-clearance.js';
import {ROADS,roadContains} from '../game/city-layout.js';
import {VoxelWorld} from '../game/world.js';

// Published numeric nearest-distance predicate, rather than another box test.
function original(roads,x,z,clearance){let best=Infinity;for(const r of roads)for(let i=0;i<r.samples.length;i+=4){const p=r.samples[i];best=Math.min(best,Math.hypot(x-p.x,z-p.z)-r.width);}return best<clearance;}
let seed=93;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
const indexed=createRoadClearance(ROADS);
let checks=0;
for(let i=0;i<16000;i++){
 const x=random()*800-400,z=random()*700-200,clearance=i%2?1:1.2;
 assert.equal(nearSampledRoad(ROADS,x,z,clearance),original(ROADS,x,z,clearance));assert.equal(indexed.contains(x,z),original(ROADS,x,z,1.2));assert.equal(roadContains(x,z),indexed.contains(x,z));checks++;
}
for(const r of ROADS)for(let i=0;i<r.samples.length;i+=80){const p=r.samples[i];
 for(const clearance of [1,1.2])for(const epsilon of [-1e-9,-Number.EPSILON,0,Number.EPSILON,1e-9])for(const angle of [0,Math.PI/4,Math.PI/2,Math.PI]){
  const d=r.width+clearance+epsilon,x=p.x+Math.cos(angle)*d,z=p.z+Math.sin(angle)*d;
  assert.equal(nearSampledRoad([r],x,z,clearance),original([r],x,z,clearance));assert.equal(createRoadClearance([r],clearance).contains(x,z),original([r],x,z,clearance));checks++;
 }
}
assert.equal(nearSampledRoad([],0,0,1),false);
const mutable=[{width:2,samples:[{x:0,z:0}]}];assert(nearSampledRoad(mutable,0,0,1));mutable[0].samples[0].x=100;assert(!nearSampledRoad(mutable,0,0,1),'No stale index when a road changes');
for(const [x,z]of [[0,0],[-300,-120],[202,61]])assert.equal(roadContains(x,z),original(ROADS,x,z,1.2));
const world=new VoxelWorld(),hash=b=>createHash('sha256').update(b).digest('hex');
// Release92 map oracle: changing the layout requires an explicit new baseline.
// The 126 Pearl interior intentionally changes only 176 cells at x122..130/y68..72/z38..50; road predicate checks above remain unchanged.
assert.equal(hash(world.data),'d230bda8f5a03ef6aa10ebdeea7eb9b1af9b2099559d833a067fc19d0a7c695c');
assert.equal(hash(new Uint8Array(world.surface.buffer)),'995465d1bbe3c03b6c5bd6d01ad3a636d8076dfe0b0c155bbf6304347d72b88a');
console.log(JSON.stringify({passed:true,checks,bundOriginMapHashVerified:true}));
