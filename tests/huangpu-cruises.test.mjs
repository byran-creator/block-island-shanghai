import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createHuangpuCruises,tickHuangpuCruise,cruisePose,cruiseFloorAt,CRUISE_STAIRS,CRUISE_LEVELS} from '../game/huangpu-cruises.js';
import {createCruiseService,CRUISE_DOCK} from '../game/huangpu-cruise-service.js';
import {riverCenter,riverWestEdge,riverEastEdge} from '../game/shanghai-map.js';
import {boatSurfaces,boatWorld,boatSupport,boatSolid} from '../game/boat-support.js';
const scene=new T.Scene(),ships=createHuangpuCruises(scene);let meshes=0,triangles=0,minBank=1000,minOldLane=1000,maxStep=0,maxTurn=0;
for(const ship of ships){ship.root.position.set(0,0,0);ship.root.rotation.y=0;ship.root.updateMatrixWorld(true);assert(new T.Box3().setFromObject(ship.root).getSize(new T.Vector3()).z>18);ship.root.traverse(o=>{assert(!o.isLight);if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3;}});
 ship.moored=true;ship.remaining=30;const surfaces=boatSurfaces(new T.Group(),[ship]).filter(s=>s.root===ship.root);
 for(const y of CRUISE_LEVELS){assert(!boatSolid(surfaces,0,y,0),'Standing space, not filled cabin boxes');assert.equal(boatSupport(surfaces,0,y+.05,0).y,y);}
 for(const stairs of CRUISE_STAIRS)for(let i=0;i<=112;i++){const t=i/112,z=stairs.z1+(stairs.z2-stairs.z1)*t,y=stairs.low+(stairs.high-stairs.low)*t;
  assert(Math.abs(cruiseFloorAt(ship,stairs.x,z,y)-y)<1e-9);assert(!boatSolid(surfaces,stairs.x,y,z),'Head and feet clear along complete stair flight');const support=boatSupport(surfaces,stairs.x,y+.01,z);assert(support&&Math.abs(support.y-y)<1e-6,'Continuous physical stair support');}
 assert(boatSolid(surfaces,2.4,1.1,0),'Panorama window is solid');assert(!boatSolid(surfaces,2.4,1.1,4.8),'Actual side door opening');
 tickHuangpuCruise(ship,0,false);assert(!ship.night.visible);tickHuangpuCruise(ship,0,true);assert(ship.night.visible);
}
for(let time=0;time<=400;time+=.1)for(const ship of ships){const p=cruisePose(time,ship.index),next=cruisePose(time+.1,ship.index);maxStep=Math.max(maxStep,Math.hypot(next.x-p.x,next.z-p.z));maxTurn=Math.max(maxTurn,Math.abs(Math.atan2(Math.sin(next.yaw-p.yaw),Math.cos(next.yaw-p.yaw))));
 for(const x of [-2.85,2.85])for(const z of [-9.8,9.1]){const wx=p.x+x*Math.cos(p.yaw)+z*Math.sin(p.yaw),wz=p.z-x*Math.sin(p.yaw)+z*Math.cos(p.yaw);minBank=Math.min(minBank,wx-riverWestEdge(wz),riverEastEdge(wz)-wx);minOldLane=Math.min(minOldLane,riverCenter(wz)-4-wx);assert(wz<130&&wz>25);}
 const other=cruisePose(time,1-ship.index);assert(Math.hypot(p.x-other.x,p.z-other.z)>20);}
assert(minBank>18&&minOldLane>6);assert(maxStep<.25&&maxTurn<.055,'No endpoint jumps; under 25cm / 3.2degrees per 100ms');assert(meshes<70);
const player={x:0,y:26,z:0},service=createCruiseService({scene,ships,getPos:()=>player,place:p=>Object.assign(player,p)}),surfaces=boatSurfaces(new T.Group(),[...ships,...service.ports]);
for(let x=41.2;x<=CRUISE_DOCK.entry.x-.1;x+=.05){const y=x<49?CRUISE_DOCK.y:x<59?CRUISE_DOCK.y+(x-49)*(CRUISE_DOCK.deck-CRUISE_DOCK.y)/10:CRUISE_DOCK.deck;assert(!boatSolid(surfaces,x,y,CRUISE_DOCK.z),'Walk the whole pier, ramp and gangway without hidden walls');assert(boatSupport(surfaces,x,y+.02,CRUISE_DOCK.z),'Unbroken dock support');}
Object.assign(player,{x:43,y:26,z:CRUISE_DOCK.z});assert(service.use());assert(service.isAboard());assert(service.safeSavePoint()?.y===26);assert(service.use());assert.equal(player.x,59.5);
player.x=0;let closest=100,previous=service.people.map(p=>p.root.position.clone()),maxWalkStep=0;
for(let t=0;t<1000;t+=.05){service.tick(.05,{night:true});const [a,b]=service.people;closest=Math.min(closest,a.root.position.distanceTo(b.root.position));for(const [i,p]of service.people.entries()){maxWalkStep=Math.max(maxWalkStep,p.root.position.distanceTo(previous[i]));previous[i].copy(p.root.position);}assert(service.clock>t*.8,'Departure cannot deadlock indefinitely');}
assert(service.people.every(p=>p.trips>=2));assert(closest>=.85);assert(maxWalkStep<.3,'Tourists board and disembark continuously');
const holdScene=new T.Scene(),holdShips=createHuangpuCruises(holdScene),holdPlayer={x:0,y:26,z:0},hold=createCruiseService({scene:holdScene,ships:holdShips,getPos:()=>holdPlayer});
for(const p of hold.people)p.pause=1e6;for(let i=0;i<536;i++)hold.tick(.05);Object.assign(holdPlayer,{x:65,y:CRUISE_DOCK.deck,z:CRUISE_DOCK.z});for(let i=0;i<20;i++)hold.tick(.05);assert(hold.bridge.visible);const held=hold.clock;for(let i=0;i<100;i++)hold.tick(.05);assert.equal(hold.clock,held,'Hold departure beneath a player crossing the gangway');holdPlayer.x=0;for(let i=0;i<100;i++)hold.tick(.05);assert(hold.clock>held+4.9);assert(!hold.bridge.visible);const paused=hold.clock;hold.tick(0);assert.equal(hold.clock,paused);assert(!holdShips[0].moored&&holdShips[0].gate.visible,'Close the side gate under way');
console.log(JSON.stringify({ships:2,meshes,triangles,minBank,minOldLane,maxStep,maxTurn,touristTrips:service.people.map(p=>p.trips),closest,maxWalkStep,realtimeLights:0}));
