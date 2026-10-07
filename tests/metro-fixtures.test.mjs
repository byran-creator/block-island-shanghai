import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {createMetro} from '../game/metro.js';
import {fixtureCollision} from '../game/metro-fixtures.js';
const previous=globalThis.document;
globalThis.document={hidden:false,body:{append(){}},createElement:()=>({hidden:false,setAttribute(){},getContext:()=>({fillRect(){},fillText(){}})})};
try{
 const metro=createMetro({scene:new THREE.Scene(),getPos:()=>({x:0,y:26,z:0}),place(){},setView(){},notify(){},getSound:()=>false});
 for(const s of metro.stations){assert.equal(s.people.length,34,'Keep the station population');assert(metro.collides(s.x-22,16,s.z-8),'Scanner must block player');assert(!metro.collides(s.x-22,16,s.z-10.4),'Scan interaction point must remain accessible');}
 const start=metro.stations.flatMap(s=>s.people.map(p=>p.root.position.x));let changed=0;
 for(let i=0;i<3600;i++){
  metro.tick(.1);
  for(const s of metro.stations)for(const p of s.people){const q=p.root.position;assert(!fixtureCollision(s.fixtures,q.x,q.y,q.z,.38,1.92),'Passenger inside equipment/column/bench');assert(p.clear(q.x,q.y,q.z),'Passenger standing in an unsafe envelope');}
 }
 for(const [i,p]of metro.stations.flatMap(s=>s.people).entries())if(Math.abs(p.root.position.x-start[i])>.05)changed++;
 assert(changed>50,'Passengers must keep moving after collision avoidance');
 console.log('PASS: both stations, 68 passengers, six minutes, clear scanner/columns/benches, accessible interaction point and moving passengers.');
}finally{globalThis.document=previous;}
