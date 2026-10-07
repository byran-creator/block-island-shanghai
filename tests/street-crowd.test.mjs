import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {createStreetCrowd} from '../game/street-crowd.js';
const people=Array.from({length:40},()=>({root:new THREE.Group(),arms:[{},{}].map(()=>({rotation:{x:0}})),legs:[{},{}].map(()=>({rotation:{x:0}}))}));
const crowd=createStreetCrowd(people);crowd.tick(0);
assert(people.every(p=>p.ready));assert(new Set(people.map(p=>p.speed.toFixed(3))).size>30);assert(new Set(people.map(p=>p.root.position.z.toFixed(2))).size>25,'Do not place everyone on two lanes');
assert(people.some(p=>p.crowd.wait===0)&&people.some(p=>p.crowd.wait>0),'Not everyone starts with the same waiting phase');
const travel=new Map(people.map(p=>[p,0])),states=new Set(),recent=new Map(people.map(p=>[p,0]));
for(let i=0;i<2400;i++){
 const before=people.map(p=>p.root.position.clone());crowd.tick(.05);
 for(let a=0;a<people.length;a++){const p=people[a],d=p.root.position.distanceTo(before[a]);assert(d<.08,'Movement remains continuous');travel.set(p,travel.get(p)+d);if(i>1200)recent.set(p,recent.get(p)+d);states.add(p.crowd.state);for(let b=a+1;b<people.length;b++)assert(p.root.position.distanceToSquared(people[b].root.position)>.66**2-1e-8,'Walkers must yield without intersecting');}
}
assert(states.has('walk')&&states.has('browse'));assert(people.every(p=>travel.get(p)>5&&recent.get(p)>2),'Each independent walker must keep making progress');assert(new Set(people.map(p=>Math.round(travel.get(p)))).size>15);
const mirror=people.map(()=>({root:new THREE.Group(),arms:[{rotation:{}},{rotation:{}}],legs:[{rotation:{}},{rotation:{}}]})),same=createStreetCrowd(mirror);same.tick(0);const another=people.map(()=>({root:new THREE.Group(),arms:[{rotation:{}},{rotation:{}}],legs:[{rotation:{}},{rotation:{}}]})),repeat=createStreetCrowd(another);repeat.tick(0);assert.deepEqual(mirror.map(p=>p.root.position.toArray()),another.map(p=>p.root.position.toArray()),'A seeded crowd is reproducible for diagnosis');
console.log('PASS: independent speeds/lateral positions/goals/pauses, continuous peer-safe motion, two-minute progress and reproducible spawn.');
