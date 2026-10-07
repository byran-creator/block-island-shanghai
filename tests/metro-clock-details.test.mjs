import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {BUND_BUILDINGS} from '../game/city-layout.js';
import {METRO_STATIONS} from '../game/metro-layout.js';
import {metroEntranceLayout} from '../game/metro-entrance.js';
import {metroPlatformDirection} from '../game/metro-directions.js';
import {customsClockAngles,createCustomsClock} from '../game/customs-clock.js';
const world=new VoxelWorld();
for(const s of METRO_STATIONS)for(const e of s.exits){const a=metroEntranceLayout(e);
 for(let z=a.z-a.signWidth/2;z<=a.z+a.signWidth/2;z+=.1)for(const y of [a.signY-a.signHeight/2,a.signY,a.signY+a.signHeight/2])assert(!world.get(Math.floor(a.signX),Math.floor(y),Math.floor(z)),'Entrance fascia embedded in a shop wall: '+s.id+':'+e.number);
 for(let x=a.x-a.length/2;x<=a.x+a.length/2;x+=.1)for(let z=a.z-a.width/2;z<=a.z+a.width/2;z+=.1)assert(!world.get(Math.floor(x),Math.floor(a.roofY),Math.floor(z)),'Canopy buried in a wall');
 assert(a.signY-a.signHeight/2>28.3,'Entrance sign must leave walking headroom');
 for(let u=-2.7;u<0;u+=.1)assert(!overlaps(world,e.x+e.dir*u,26,e.z),'Entrance opening must stay walkable');
 for(const direction of [-1,1]){const d=metroPlatformDirection(s,direction);assert(!d.zh.startsWith(s.name),'A platform must not point to its own station');assert.equal(d.playable,s.id==='nanjing'?direction===1:direction===-1);}
}
assert.equal(metroPlatformDirection(METRO_STATIONS[1],1).next,'浦东南路');assert.equal(metroPlatformDirection(METRO_STATIONS[0],-1).next,'人民广场');
const almost=(a,b)=>assert(Math.abs(a-b)<1e-9);almost(customsClockAngles(180).hour,0);almost(customsClockAngles(90).hour,-Math.PI/2);almost(customsClockAngles(95).minute,-Math.PI);almost(customsClockAngles(95).hour,-7*Math.PI/12);
const old=globalThis.document,texts=[],ctx=new Proxy({}, {get:(_,k)=>k==='fillText'?t=>texts.push(t):()=>{}});globalThis.document={createElement:()=>({getContext:()=>ctx})};
try{const clock=createCustomsClock(new THREE.Scene(),BUND_BUILDINGS.find(b=>b.kind==='clock'));assert.equal(clock.faces.length,4);assert.equal(new Set(clock.faces.map(f=>f.material.map)).size,1,'Four clock faces share one texture');for(const digit of ['XII','III','VI','IX'])assert(texts.includes(digit));clock.tick(95,true);for(const pair of clock.hands){almost(pair[0].rotation.z,-7*Math.PI/12);almost(pair[1].rotation.z,-Math.PI);}assert.equal(clock.texture.image.width,1024);}finally{globalThis.document=old;}
console.log('PASS: four street canopies/fascias clear real voxel walls, walking headroom, current next-station directions, four shared detailed clock faces and correct clockwise game time.');
