import assert from 'node:assert/strict';
import {createChunkMesher,createChunkQueue} from '../game/chunk-work.js';
import {createTrafficDetour,planTrafficDetour} from '../game/traffic-detour.js';

const cells=new Map([['-1,1,0',1],['0,1,0',1],['0,2,0',11],['1,1,1',4]]);
const world={get:(x,y,z)=>cells.get(`${x},${y},${z}`)??0};
const mesh=(cx,step)=>{const task=createChunkMesher({world,cx,cz:0,chunk:2,height:4});while(!task.step(step)){}return task.data;};
const data=mesh(0,1);assert.deepEqual(data,mesh(0,256));
assert.equal(data.indices.length,15*6,'One internal pair and one occupied neighbour across the chunk boundary hide three faces');
for(let face=0;face<data.p.length/12;face++){
 const at=face*12,n=data.norm.slice(at,at+3),center=[0,0,0];
 for(let v=0;v<4;v++)for(let axis=0;axis<3;axis++)center[axis]+=data.p[at+v*3+axis]/4;
 const inside=center.map((x,i)=>Math.floor(x-n[i]*.01)),outside=center.map((x,i)=>Math.floor(x+n[i]*.01));
 assert(world.get(...inside)>0);assert.equal(world.get(...outside),0,'No interior or shared boundary faces');
}
const skipped=createChunkMesher({world,cx:0,cz:0,chunk:2,height:4,skip:(x,y,z,id)=>id===11});while(!skipped.step(1)){}assert.equal(skipped.data.indices.length,10*6);

let clock=0,generation=0;const committed=[],loaded=new Set();
const queue=createChunkQueue({has:key=>loaded.has(key),now:()=>clock,create:key=>{let steps=0;const data={generation};return {data,step(){clock++;return ++steps===3;}};},commit:(key,data)=>{loaded.add(key);committed.push([key,data.generation]);}});
queue.setDesired(new Set(['10,0','0,0']),{x:0,z:0},16);queue.process(1);assert.equal(committed.length,0);
generation=1;queue.invalidate('0,0');queue.process(9);assert.deepEqual(committed,[['0,0',1]],'Editing cancels a half-built stale mesh; only one upload per frame');
queue.setDesired(new Set(['-1,0']),{x:-16,z:0},16);queue.process(9);assert.deepEqual(committed.at(-1),['-1,0',1]);assert(!loaded.has('10,0'),'Travel cancels work outside the desired region');assert.equal(queue.pending,0);
queue.setDesired(new Set(['-1,0']),{x:-16,z:0},16,true);queue.process(9);assert.equal(committed.length,3,'Restoring edits can rebuild already loaded chunks');

let checks=0;const clear=p=>{checks++;return !(p.x>1.4&&p.x<2.6&&Math.abs(p.z)<1);};
const start={x:0,y:26,z:0},goal={x:5,y:26,z:0},task=createTrafficDetour(start,goal,clear);task.step(1);assert.equal(checks,0,'A search yields before doing its first expansion');
let slices=0;while(!task.step(1)){assert(++slices<=3501);}assert(task.path?.length);assert.deepEqual(task.path,planTrafficDetour(start,goal,clear),'Splitting the search preserves route results');
let previous=start;for(const p of task.path){assert(clear(p));assert(Math.hypot(p.x-previous.x,p.z-previous.z)<=1.2);previous=p;}assert.deepEqual(previous,goal);
const impossible=createTrafficDetour(start,goal,()=>false);while(!impossible.step(2)){}assert.equal(impossible.path,null);
console.log('PASS: terrain boundary faces, incremental geometry, edit invalidation, travel cancellation, bounded uploads, yielded detours and safe route equivalence.');
