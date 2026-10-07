import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {METRO_STATIONS,METRO_RAMPS,METRO_HALL,metroInterior,metroRampFloor,metroLineZ} from '../game/metro-layout.js';
import {METRO_DOOR_CENTERS} from '../game/metro-train.js';
import {METRO_CYCLE,METRO_DWELL,METRO_TRAVEL,trainState,trainPose,arrivalSeconds,trainCrowd} from '../game/metro-service.js';
import {metroExitSign,METRO_SECURITY_GUIDANCE} from '../game/metro-sign-layout.js';
import {createMetro} from '../game/metro.js';
import {swimVelocity,SurvivalState} from '../game/survival-state.js';
import {soundScene} from '../game/scene-audio.js';
const world=new VoxelWorld(),nanjing=METRO_STATIONS[0];
for(const s of METRO_STATIONS)for(const e of s.exits){const sign=metroExitSign(e);assert(sign.y-sign.height/2-metroRampFloor(sign.x,sign.z)>=2.5,'Exit board crosses escalator headroom');}
assert(METRO_SECURITY_GUIDANCE.y-METRO_SECURITY_GUIDANCE.height/2-16>=2.5);
assert(nanjing.exits.some(e=>e.z<62)&&nanjing.exits.some(e=>e.z>70),'Entrances must flank the pedestrian street');
for(const e of nanjing.exits){assert(Math.abs(e.z-66)>4);for(let x=e.x-2;x<=e.x+2;x++)assert.equal(world.get(x,25,66),6,'Entrance must not excavate street center');}
for(const r of METRO_RAMPS)for(let u=-1;u<=19;u+=.15){const x=r.x+u*r.dir,z=r.z,y=metroRampFloor(x,z);assert(y!==null);assert(Math.abs(y-(r.from+(r.to-r.from)*Math.max(0,Math.min(1,u/r.length))))<1e-7,'Escalators at different levels overlap');assert(!overlaps(world,x,Math.ceil(y),z),'Ramp headroom blocked '+JSON.stringify({r:r.station,kind:r.kind,x,y,z}));assert(world.protected(Math.floor(x),Math.floor(y),Math.floor(z)));}
for(const r of METRO_RAMPS)for(const u of [-2,0,r.length,r.length+2])assert(world.get(r.x+u*r.dir,(u<=0?r.from:r.to)-1,Math.floor(r.z)),'Escalator flat landing must retain its floor');
for(const s of METRO_STATIONS){assert(!overlaps(world,s.x+3,16,s.z-5));assert(!overlaps(world,s.x+3,6,s.z-3));assert(metroInterior({x:s.x,y:6,z:s.z}));assert.equal(soundScene({x:s.x,y:6,z:s.z}).track,'metro');}
for(let x=-58;x<=138;x++){for(const side of [-1,1])assert(!world.get(x,7,Math.round(metroLineZ(x))+side*8),'Track portal blocked');assert(world.get(x,0,Math.round(metroLineZ(x))),'Riverbed bedrock missing');}
assert.equal(swimVelocity({feet:6,velocity:0,space:true,grounded:true,dt:.01,dry:true}),8);
assert.equal(METRO_CYCLE,60);
for(const dir of [-1,1]){let previous;for(let time=0;time<METRO_CYCLE;time+=.1){const st=trainState(time,0,dir),q=trainPose(st);assert.equal(Math.sign(metroLineZ(q.x)-q.z),dir);if(previous?.st.visible&&st.visible&&previous.st.phase===st.phase)assert(Math.abs(q.x-previous.q.x)<3,'Train teleported');previous={st,q};}assert(trainState(METRO_DWELL+METRO_TRAVEL+3,0,dir).open);assert.equal(arrivalSeconds(METRO_DWELL,dir===1?1:0,0,dir),METRO_TRAVEL);}
const crowds=Array.from({length:5},(_,i)=>trainCrowd({cycle:i,station:0}));
assert(crowds.every(c=>!c.full),'Crowding must not prevent standing passengers from boarding');
assert(crowds.some(c=>c.crowded&&c.seats===0),'Crowded services should still have standing passengers');
const oldDocument=globalThis.document;
globalThis.document={hidden:false,body:{append(){}},createElement:()=>({hidden:false,setAttribute(){},getContext:()=>({fillRect(){},fillText(){}})})};
try{
 const p={x:nanjing.x-22,y:16,z:nanjing.z-5.5},notes=[],events=[],metro=createMetro({onEvent:e=>{events.push(e);if(e.type==='metro'){assert(!metro.isRiding());assert.equal(p.x,METRO_STATIONS.find(s=>s.id===e.to).x,'Trip progress must save the disembarked position');assert.equal(p.y,6);}},scene:new THREE.Scene(),getPos:()=>p,place:q=>Object.assign(p,q),setView(){},notify:t=>notes.push(t),getSound:()=>false,getAudio(){throw new Error('Muted test requested audio');}});
 const gx=nanjing.x+METRO_HALL.gateX,gz=nanjing.z+METRO_HALL.gateZ;
 metro.tick(0);Object.assign(p,{x:gx-1,y:16,z:gz});metro.use();assert(!metro.stations[0].paid);assert(notes.at(-1).includes('检票闸机'));
 Object.assign(p,{x:nanjing.x-22,y:16,z:nanjing.z-5.5});assert(!metro.collides(p.x,p.y,p.z)&&!overlaps(world,p.x,p.y,p.z));metro.use();metro.tick(2.8);assert.equal(events.length,0,'Partial security scan must not count');metro.tick(.3);assert(metro.stations[0].checked);assert.deepEqual(events,[{type:'security',station:'nanjing'}]);
 assert(Math.hypot(gx-p.x,gz-p.z)<12,'Gate should be next to security');
 for(let x=p.x;x<gx-1;x+=.15)assert(!metro.collides(x,16,gz)&&!overlaps(world,x,16,gz),'Security-to-gate route blocked');
 Object.assign(p,{x:gx-1,y:16,z:gz});assert(metro.collides(gx,16,gz));metro.use();assert(metro.stations[0].gatePass?.entering);metro.use();metro.use();assert(metro.stations[0].gatePass?.entering,'Repeated V must not cancel entry ticket');
 for(let x=gx-1;x<gx+2;x+=.1)assert(!metro.collides(x,16,gz)&&!overlaps(world,x,16,gz),'Open fare gate blocked');
 Object.assign(p,{x:gx+1,y:16,z:gz});metro.tick(0);assert(metro.stations[0].paid);assert(metro.collides(gx,16,gz),'The fare gate must close after entry');
 for(let z=gz;z<nanjing.z+3;z+=.1)assert(!metro.collides(gx+2,16,z)&&!overlaps(world,gx+2,16,z),'Gate-to-escalator route blocked');
 const station=metro.stations[0],train=metro.trains[0],doorX=nanjing.x+2;
 assert.equal(station.doors.length,METRO_DOOR_CENTERS.length*2);
 assert.equal(train.doors.length,32,'Eight cars, two door pairs per compressed car');
 assert(train.doorAmount>.85);
 const door=station.doors.find(d=>d.side===-1&&d.x===doorX),carDoor=train.doors.find(d=>d.side===1&&d.x===2);
 assert.equal(door.leaves[0].mesh.scale.x,1,'Door must slide, not shrink');
 assert(Math.abs(door.leaves[0].mesh.position.x-door.leaves[1].mesh.position.x)>2,'Screen leaves did not slide apart');
 assert(Math.abs(carDoor.leaves[0].mesh.position.x-carDoor.leaves[1].mesh.position.x)>2,'Train leaves did not slide apart');
 assert(train.doors.filter(d=>d.side===-1).every(d=>d.amount===0),'Track-side doors must stay closed');
 for(let z=nanjing.z-3.7;z>nanjing.z-6.8;z-=.1){assert(!metro.collides(doorX,6,z),'Open platform door physically blocked');assert(!metro.collides(doorX,5.998,z),'Normal physics foot tolerance must not block horizontal boarding');}
 assert(metro.collides(doorX,5.97,nanjing.z-5.8),'Open doorway sill must still support feet');
 assert(metro.collides(doorX+1,6,nanjing.z-5.6),'Fixed screen must remain solid between doors');
 assert.equal(metro.floorAt(doorX,nanjing.z-6.2),6,'Boarding gap must have continuous support');
 for(const offset of [-30,-18,2,22])for(let z=-6.85;z>=-9.15;z-=.1)assert.equal(metro.floorAt(nanjing.x+offset,nanjing.z+z),6.095,'Entire stopped train needs a collision floor, not only the doorway');
 assert(metro.collides(doorX,6,nanjing.z-8),'Solid train floor must support a passenger even without a ride attachment');
 assert(metroInterior({x:0,y:2.998,z:metroLineZ(0)-8}),'Track-floor tolerance must not switch to river water');
 metro.tick(2);const exiting=train.exchanges.filter(p=>p.visible);assert(exiting.length>0,'No passengers alight when doors open');assert(exiting.every(p=>p.position.z<nanjing.z&&p.position.z>nanjing.z-7),'Alighters crossed wrong-side doors');
 Object.assign(p,{x:doorX,y:6,z:nanjing.z-5.8});metro.tick(.1,{playing:true,sound:false});assert(metro.isRiding(),'Walking through an open door must board');
 assert.equal(p.x,doorX,'Rider must stay in the selected door aisle, away from gangway');
 metro.end();assert(!metro.isRiding());assert.equal(events.filter(e=>e.type==='metro').length,0,'Leaving at origin must not count as a completed trip');Object.assign(p,{x:doorX,y:6,z:nanjing.z-5.8});metro.tick(.1,{playing:true,sound:false});assert(metro.isRiding());
 metro.tick(METRO_DWELL);metro.end();assert(metro.isRiding(),'Moving train cannot be exited');
 for(let i=0;i<(METRO_TRAVEL+METRO_DWELL)*10;i++)metro.tick(.1);assert(!metro.isRiding());assert(Math.abs(p.x-174)<1,'Did not disembark at Lujiazui');assert.equal(p.y,6);assert.deepEqual(events.at(-1),{type:'metro',from:'nanjing',to:'lujiazui',departed:true});
 assert(metro.collides(doorX,6,nanjing.z-5.6),'Closed platform door must block');
 const eventCount=events.length;const saved=metro.serialize();metro.restore(saved);assert(metro.stations[1].paid);metro.restore(null);assert(metro.stations.every(s=>!s.paid));metro.restore(saved);assert.equal(events.length,eventCount,'Loading paid tickets must not complete a quest');
 while(!(metro.trains[1].state.open&&metro.trains[1].doorAmount>.85&&metro.trains[1].state.station===1))metro.tick(.1);
 Object.assign(p,{x:176,y:6,z:34.7});assert(metro.use()&&metro.isRiding());assert.equal(metro.safeSavePoint().y,6);
 for(let i=0;i<(METRO_DWELL*2+METRO_TRAVEL)*10;i++)metro.tick(.1);assert(!metro.isRiding()&&Math.abs(p.x+94)<1,'Westbound ride failed');assert.deepEqual(events.at(-1),{type:'metro',from:'lujiazui',to:'nanjing',departed:true});const trips=events.filter(e=>e.type==='metro').length;
 const heavyOpen=()=>train.state.station===0&&train.state.cycle%5===2&&train.state.open&&train.doorAmount>.85;
 for(let i=0;i<10000&&!heavyOpen();i++)metro.tick(.1);
 assert(heavyOpen(),'Crowded service did not arrive');
 assert.equal(trainCrowd(train.state).seats,0);
 assert(!metro.collides(doorX,6,nanjing.z-5.8),'Crowded open doorway must allow walking entry');
 Object.assign(p,{x:doorX,y:6,z:nanjing.z-5.8});metro.tick(.1,{playing:true,sound:false});
 assert(metro.isRiding(),'Crowded service must board a walking passenger without V');
 assert(notes.at(-1).includes('扶稳站立'));
 assert(!notes.some(n=>n.includes('挤不上车')));
 metro.end(true);
 while(!(train.state.open&&train.doorAmount>.85&&train.state.station===1))metro.tick(.1);
 Object.assign(p,{x:176,y:6,z:25.2});metro.tick(0,{playing:true,sound:false});assert(metro.isRiding(),'A destination train with open doors must safely accept a walking passenger');
 metro.tick(9);assert(!metro.isRiding(),'Passengers must return to the platform before this train leaves the playable area');assert.equal(p.y,6);
 assert.equal(events.filter(e=>e.type==='metro').length,trips,'Forced exit and boarding a destination train must not award a trip');
 Object.assign(p,{x:gx+1,y:16,z:gz});metro.use();assert(metro.stations[0].gatePass&&!metro.stations[0].gatePass.entering,'Arrival ticket must allow exit without new security');for(let x=gx+1;x>=gx-.9;x-=.1){assert(!metro.collides(x,16,gz),'Exit gate shut on a crossing player');Object.assign(p,{x,y:16,z:gz});metro.tick(0);}assert(!metro.stations[0].paid,'Crossing the exit gate ends this visit');assert(!metro.stations[0].checked);metro.use();assert(!metro.stations[0].gatePass,'Re-entry must require a new security check');
 const life=new SurvivalState();life.mode='survival';for(let i=0;i<100;i++)life.tick(1,{underwater:false});assert.equal(life.oxygen,40);
}finally{globalThis.document=oldDocument;}
console.log('PASS: sidewalk entrances, adjacent security/gates, clear escalators, aligned sliding doors and collision openings, passenger alighting, walking/V boarding, bidirectional travel, tickets, saves and mute.');

