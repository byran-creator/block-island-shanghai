import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createHuangpuCruises,CRUISE_STAIRS} from '../game/huangpu-cruises.js';
import {createCruiseService} from '../game/huangpu-cruise-service.js';
import {boatSurfaces,boatSupport,boatSolid} from '../game/boat-support.js';

const scene=new T.Scene(),ships=createHuangpuCruises(scene),service=createCruiseService({scene,ships}),visitors=service.people.filter(p=>p.resident),surfaces=boatSurfaces(new T.Group(),ships);
assert.equal(visitors.length,12);assert(ships.every(ship=>visitors.filter(p=>p.ship===ship).length===6));
assert(ships.every(ship=>[1.1,3.65,6.2].every(y=>visitors.filter(p=>p.ship===ship&&p.deck===y).length===2)));
const previous=service.people.map(p=>p.root.position.clone()),localZ=visitors.map(p=>p.local.z),travel=visitors.map(()=>0);
let clock=0,minPeer=100,maxStep=0;
while(clock<600){const dt=[.05,.033,.1,.016][Math.floor(clock*20)%4];clock+=dt;service.tick(dt);
 for(const [i,p]of service.people.entries()){
  const at=p.root.position;maxStep=Math.max(maxStep,at.distanceTo(previous[i]));previous[i].copy(at);
  for(let j=i+1;j<service.people.length;j++){const q=service.people[j].root.position;if(Math.abs(at.y-q.y)<1.8){const d=Math.hypot(at.x-q.x,at.z-q.z);minPeer=Math.min(minPeer,d);assert(d>=.85,'Passengers keep separate boarding and sightseeing positions');}}
 }
 for(const [i,p]of visitors.entries()){
  const at=p.root.position;travel[i]+=Math.abs(p.local.z-localZ[i]);localZ[i]=p.local.z;
  assert(!boatSolid(surfaces,at.x,at.y,at.z),'Visitors never occupy furniture, glass or closed stairs');
  assert(Math.abs(boatSupport(surfaces,at.x,at.y+.02,at.z)?.y-at.y)<1e-5,'Actual deck geometry supports every visitor');
  assert(Math.abs(p.local.z-p.homeZ)<=.33);
  for(const stairs of CRUISE_STAIRS){const dz=Math.max(Math.min(stairs.z1,stairs.z2)-p.local.z,0,p.local.z-Math.max(stairs.z1,stairs.z2));assert(Math.hypot(p.local.x-stairs.x,dz)>.9,'Keep the full staircase approach free');}
 }
}
assert(service.boardingPeople.every(p=>p.trips>=1),'Added visitors cannot deadlock the real boarding/alighting loop');
assert(travel.every(d=>d>1));assert(maxStep<.5,'No warps during variable frame rates or ship turns');
console.log(JSON.stringify({passengers:service.people.length,residents:visitors.length,minPeer,maxStep,minimumLocalTravel:Math.min(...travel),roundTrips:service.boardingPeople.map(p=>p.trips)}));
