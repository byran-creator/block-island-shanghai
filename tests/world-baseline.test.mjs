import assert from 'node:assert/strict';
import {createWorldBaseline} from '../game/world-baseline.js';
import {VoxelWorld} from '../game/world.js';
for(const bytes of [new Uint8Array(),new Uint8Array(200).fill(9),Uint8Array.from({length:4000},(_,i)=>i%253),Uint8Array.from({length:2000},(_,i)=>Math.floor(i/71)%13)]){
 const original=bytes.slice(),b=createWorldBaseline(bytes),restored=new Uint8Array(bytes.length);bytes.fill(99);b.restore(restored);assert.deepEqual(restored,original);for(let i=-1;i<=original.length;i++)assert.equal(b.get(i),original[i]);assert.throws(()=>b.restore(new Uint8Array(bytes.length+1)),RangeError);
}
assert.throws(()=>createWorldBaseline([]),TypeError);
const world=new VoxelWorld(),b=createWorldBaseline(world.data),copy=new Uint8Array(world.data.length);b.restore(copy);assert.deepEqual(copy,world.data,'Full current base map round-trips byte for byte');
for(let i=0;i<world.data.length;i+=7919)assert.equal(b.get(i),world.data[i]);
world.data.fill(13);b.restore(world.data);assert.deepEqual(world.data,copy,'Reset restores the canonical city after edits');assert(b.byteLength<copy.length/10);
console.log(`PASS: exact full-world restore/read and edit reset; baseline ${copy.byteLength} -> ${b.byteLength} bytes; raw fallback/empty/bounds validated.`);
