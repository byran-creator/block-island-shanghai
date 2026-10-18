import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createCityTraffic} from '../game/city-traffic.js';
import {createCommute} from '../game/commute.js';
import {routePose} from '../game/bund.js';
const old=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};
try{
 const world=new VoxelWorld(),scene=new THREE.Scene();let pos={x:0,y:26,z:0};
 const traffic=createCityTraffic({scene,world,cars:[],getPos:()=>pos,routePose});
 const stop=traffic.stops.find(s=>s.name==='南京路步行街');assert(stop);
 const bus=traffic.buses.find(b=>b.route===stop.route&&Math.abs(b.t-stop.d)>1);assert(bus,'Verify an approaching service, not just one spawned at the stop');
 let arrived=false;
 for(let i=0;i<7200;i++){traffic.tick(.05);if(bus.dwell>0&&Math.abs(bus.t-stop.d)<.05){arrived=true;break;}}
 assert(arrived,'A bus must actually arrive at the advertised Nanjing stop');
 assert(bus.root.position.distanceTo(stop.root.position)<3,'The stopping point must align with the pole');
 const stationary=bus.root.position.clone();traffic.tick(.2);assert(bus.root.position.distanceTo(stationary)<.01);
 const a=bus.root.rotation.y;pos={x:bus.root.position.x+Math.cos(a)*3.5,y:26,z:bus.root.position.z-Math.sin(a)*3.5};
 assert(!overlaps(world,pos.x,pos.y,pos.z),'Board from the pavement side');
 const commute=createCommute({scene,world,civil:{traffic},activity:{heli:new THREE.Group()},getPos:()=>pos,blocked:(x,y,z)=>overlaps(world,x,y,z)||traffic.collides(x,y,z),place:p=>Object.assign(pos,p),setView(){},turnView(){},notify(){}});
 assert(commute.use());assert.equal(commute.ride?.vehicle.root,bus.root,'The advertised bus must be boardable');
 for(let i=0;i<240;i++){traffic.tick(.05);commute.tick(.05);}
 assert(bus.root.position.distanceTo(stationary)>3,'Passenger bus must resume its route');
 assert(Math.hypot(pos.x-bus.root.position.x,pos.z-bus.root.position.z)<.01);
 assert(commute.end());assert(!commute.isRiding());assert(!overlaps(world,pos.x,pos.y,pos.z),'Disembark into clear space');
 console.log('PASS: Nanjing advertised stop, actual approach/dwell, pavement-side boarding, onward passenger travel and clear exit.');
}finally{globalThis.document=old;}
