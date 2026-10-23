import assert from 'node:assert/strict';
import {createGardenPathfinder} from '../game/garden-path.js';
import {gardenPath93} from './fixtures/garden-path93.mjs';
let obstacle=false,occupied=false;
const clear=(x,z)=>x>=-10&&x<=10&&z>=220&&z<=242&&!(obstacle&&x>=-.5&&x<=.5&&z<240);
const find=createGardenPathfinder(clear),actor=(x,z)=>occupied&&x===2&&z>=225&&z<=237;
let comparisons=0;
for(let i=0;i<60;i++){
 obstacle=i%3!==0;occupied=i%4===0;
 const start=[-8+(i%5)*.5,221+(i%7)],end=[8-(i%5)*.5,241-(i%4)];
 assert.deepEqual(find(start,end,actor),gardenPath93(clear,start,end,actor));comparisons++;
}
for(const [start,end]of [[[0,220],[0,220]],[[-120,206],[-119,206]],[[-120.5,206],[-119,206]],[[.25,220],[1.25,220]],[[32,336],[31,335.5]]]){
 const all=()=>true;assert.deepEqual(createGardenPathfinder(all)(start,end),gardenPath93(all,start,end));comparisons++;
}
assert.throws(()=>createGardenPathfinder(()=>false)([0,220],[1,220]),/blocked/);
let pass=false;const recover=createGardenPathfinder(()=>pass);assert.throws(()=>recover([0,220],[1,220]),/blocked/);pass=true;assert.deepEqual(recover([0,220],[1,220]),[[0,220],[.5,220],[1,220]],'A failed search must not poison the next epoch');
// The exact order of quarter-step clearance and occupancy calls must survive.
let referenceCalls,referenceResult;
for(const variant of [0,1]){const calls=[],record=(x,z)=>{calls.push([x,z]);return x>=-2&&x<=2&&z>=220&&z<=223;};const result=variant?createGardenPathfinder(record)([-1,220],[1,223]):gardenPath93(record,[-1,220],[1,223]);if(!variant){referenceCalls=calls;referenceResult=result;}else{assert.deepEqual(calls,referenceCalls);assert.deepEqual(result,referenceResult);}}
console.log(JSON.stringify({passed:true,comparisons,reusedBufferObstacleChanges:true,exactSearchOrder:true}));
