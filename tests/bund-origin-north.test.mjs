import assert from 'node:assert/strict';
import {BUND_BUILDINGS,ALL_BUILDINGS,BUND_STREETS,buildingEntrance,roadContains} from '../game/city-layout.js';
import {WAIBAIDU,inSuzhou} from '../game/waibaidu-layout.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createWorldBaseline} from '../game/world-baseline.js';
const w=new VoxelWorld(), buildings=BUND_BUILDINGS.filter(b=>b.id.startsWith('bund-origin-'));
assert.deepEqual(buildings.map(b=>b.id),['bund-origin-north','bund-origin-south']);
assert.deepEqual({x:WAIBAIDU.x,z:WAIBAIDU.z,north:WAIBAIDU.north,south:WAIBAIDU.south},{x:50,z:-21,north:-39,south:-3});
for(const b of buildings){
 for(let x=b.x-b.rx;x<=b.x+b.rx;x++)for(let z=b.z-b.rz;z<=b.z+b.rz;z++){
  assert(!roadContains(x,z)&&!inSuzhou(x,z),'new footprint must remain clear of road and river');
  assert(!BUND_STREETS.some(s=>Math.abs(z-s.z)<=s.width),'street crossings remain open');
 }
 for(const p of ALL_BUILDINGS.filter(p=>p!==b))assert(!(Math.abs(p.x-b.x)<=p.rx+b.rx&&Math.abs(p.z-b.z)<=p.rz+b.rz),'building footprints do not intersect');
 const p=buildingEntrance(b,2);assert(!overlaps(w,p.x,26,p.z)&&w.get(Math.floor(p.x),25,Math.floor(p.z)),'entrance has clear standing ground');
}
const base=createWorldBaseline(w.data,w.baseline),editIndex=w.index(24,34,-2),old=base.get(editIndex);w.data[editIndex]=old===4?5:4;base.restore(w.data);assert.equal(w.data[editIndex],old,'normal default-world restoration still works with edits');
console.log('PASS: two compact Bund Origin plots, bridge and streets unchanged, entrances clear and baseline supports edits.');
