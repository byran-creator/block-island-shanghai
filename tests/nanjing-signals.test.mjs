import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {CAR_ROUTES,westSpine} from '../game/city-layout.js';
import {routePose} from '../game/bund.js';
import {createCityTraffic,routeCrossings,signalPhase,trafficTravel} from '../game/city-traffic.js';

const previous=globalThis.document;
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){}})})};
try{
 const route=CAR_ROUTES.find(r=>r.id==='bund').samples,car={route,t:0,dir:1,lane:2.2,speed:3,kind:'bund',root:new THREE.Group()};
 const scene=new THREE.Scene(),traffic=createCityTraffic({scene,world:new VoxelWorld(),getPos:()=>({x:-190,y:50,z:100}),routePose,cars:[car]});
 const stele=traffic.signals.find(s=>s.id==='stele-66'),bund=traffic.signals.find(s=>s.id==='bund-66');
 assert(stele,'The actual stele crossing must have its own traffic control');
 assert.equal(stele.x,westSpine(66));
 assert.equal(stele.offset,bund.offset,'The two pedestrian crossings keep the existing shared phase');
 assert.equal(stele.heads.length,2);assert.equal(bund.heads.length,2,'Keep exactly two existing posts, rather than adding duplicate lights');
 const crossing=car.crossings.find(c=>c.signal===stele);assert(crossing&&crossing.axis==='ns');
 assert(traffic.buses.filter(a=>a.route===route).every(a=>a.crossings.some(c=>c.signal===stele)));
 assert(traffic.riders.filter(a=>a.route===route).every(a=>a.crossings.some(c=>c.signal===stele)));
 const bridge=CAR_ROUTES.find(r=>r.id==='bridge');assert(routeCrossings(bridge.samples,[stele]).length,'Bridge-return cars also use this road');
 // Test actual curved route parameters in both directions, with different body lengths.
 for(const dir of [-1,1])for(const halfLength of [1.06,1.32,2.45]){
  const stop=6+halfLength,probe={...car,dir,halfLength,currentSpeed:10,t:(crossing.d-dir*(stop+1)+route.lengthMeters)%route.lengthMeters,crossings:[crossing]};
  assert(Math.abs(trafficTravel(probe,1,24)-1)<1e-8,'Red must stop the whole vehicle before the crossing');
  assert(Math.abs(trafficTravel(probe,1,19)-1)<1e-8,'Amber must not admit another vehicle');
  assert.equal(trafficTravel(probe,1,0),10,'Green releases either direction');
  probe.t=(crossing.d-dir*2+route.lengthMeters)%route.lengthMeters;
  assert.equal(trafficTravel(probe,1,24),10,'Vehicles already beyond the stop line clear the crossing');
 }
 // Isolate one real agent to verify the runtime and visible lamps together.
 traffic.agents.splice(1);traffic.tick(24);
 const stop=6+car.halfLength;
 car.t=crossing.d-stop-1;car.waitTime=0;car.currentSpeed=car.speed;car.progressSinceWait=0;
 const at=routePose(route,car.t,car.lane);car.root.position.set(at.x+.5,at.y,at.z+.5);car.root.rotation.y=at.yaw;
 const lamp=head=>head.lamps.findIndex(m=>m.material.color.getHex()!==0x263638);
 for(let i=0;i<21*60;i++){
  traffic.tick(1/60);
  assert(car.t<=crossing.d-stop+1e-8,'The runtime must never advance through a red stop line');
  assert.equal(lamp(stele.heads.find(h=>h.axis==='ns')),0,'The lamp visible by the stele is red during the stop');
 }
 assert(Math.abs(car.t-(crossing.d-stop))<1e-6,'The car reaches the stop line and waits');
 const held=car.t;traffic.tick(2);
 assert.equal(signalPhase(traffic.time,stele.offset).ns,'green');
 assert.equal(lamp(stele.heads.find(h=>h.axis==='ns')),2);assert(car.t>held,'The car resumes when that same lamp turns green');
}finally{globalThis.document=previous;}
console.log('PASS: stele signal registered for cars/buses/riders, both directions and body lengths stop on red/amber, clear the junction and resume with visible green.');
