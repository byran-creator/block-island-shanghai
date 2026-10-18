import assert from 'node:assert/strict';import * as T from '../game/three.module.js';import {createBundWalkers} from '../game/bund-walkers.js';import {PEDESTRIAN_CROSSINGS} from '../game/pedestrian-crossings.js';import {pedestrianCrossingOccupied} from '../game/city-traffic.js';import {vehicleContact} from '../game/vehicle-dynamics.js';
const person=(x,z,dir)=>{const root=new T.Group();root.position.set(x,26,z);root.rotation.y=-dir*Math.PI/2;return {root,x,z,baseZ:z,dir,isNorth:dir>0,speed:1,phase:0,strollState:'transit',arms:[{rotation:{}},{rotation:{}}],legs:[{rotation:{}},{rotation:{}}]};};
const pair=[person(17,65.5,1),person(18,65.5,-1)],flow=createBundWalkers(pair);
for(let i=0;i<560;i++){const before=pair.map(p=>p.root.position.clone());flow.tick(.025,i*.025,[],false);assert(pair[0].root.position.distanceTo(pair[1].root.position)>=.9-1e-6);for(let j=0;j<2;j++){const p=pair[j],d=p.root.position.clone().sub(before[j]);assert(d.length()<=.046);if(d.length()>.00001)assert(d.x*-Math.sin(p.root.rotation.y)+d.z*-Math.cos(p.root.rotation.y)>0);}}
assert(pair[0].x>28.1&&pair[1].x<8.7,'Head-on pedestrians must clear the crossing within 14 seconds, even when the light changes');
for(const c of PEDESTRIAN_CROSSINGS)for(const dir of [-1,1]){const edge=dir>0?c.west:c.east,p=person(edge-dir*.4,67.9,dir),controller=createBundWalkers([p]);for(let i=0;i<180;i++)controller.tick(.05,i*.05,[],other=>other.id!==c.id);assert(dir*(p.x-edge)<=1e-6,'A green light at the other crossing cannot release this queue');assert(!pedestrianCrossingOccupied(p.root.position,c.id),'Waiting pedestrians must leave the traffic envelope clear');}
// Captured curved-road pose just before the old red queue blocked the car.
const car={root:new T.Group(),halfWidth:.72,halfLength:1.32},yaw=3.582257949627643;
const q={x:-24.998451458220835-Math.sin(yaw)*.15,y:26,z:66.76160914340127-Math.cos(yaw)*.15};
assert(vehicleContact(car,q.x,q.y,q.z,yaw,{person:true,root:{position:{x:-23.5,y:26,z:67.9}}}),'The old waiting line occupied the next car step');
assert(!vehicleContact(car,q.x,q.y,q.z,yaw,{person:true,root:{position:{x:-21,y:26,z:67.9}}}),'The new queue must leave the curved vehicle body clear');
console.log('PASS: opposing walkers clear within 14s, no overlap/backward steps, local red admission and waiting lines outside all lanes.');
