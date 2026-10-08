import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {createMetro} from '../game/metro.js';
import {METRO_SEATS,cabinBlocked} from '../game/metro-cabin.js';
const old=globalThis.document;globalThis.document={hidden:false,body:{append(){}},createElement:()=>({setAttribute(){},getContext:()=>({fillRect(){},fillText(){}})})};
try{
 let yaw=0;const p={x:-92,y:6,z:62.3},events=[],notes=[],metro=createMetro({scene:new THREE.Scene(),getPos:()=>p,place:q=>Object.assign(p,q),getYaw:()=>yaw,turnView:a=>yaw+=a,setView:a=>yaw=a,notify:s=>notes.push(s),getSound:()=>false,onEvent:e=>events.push(e)});
 metro.tick(3);metro.restore({stations:[{id:'nanjing',checked:true,paid:true}]});assert(metro.use()&&metro.isRiding());const train=metro.trains[0];assert.equal(METRO_SEATS.length,48);
 const step=(keys,n)=>{for(let i=0;i<n;i++)metro.tick(1/60,{playing:true,sound:false,keys:new Set(keys)});};
 assert(metro.seat());assert(!metro.ride.seated,'F at the doorway must require walking to a seat');
 step(['KeyD'],9);step(['KeyW'],60);assert(metro.ride.local.x>4,'WASD must move along the carriage, around its pole');assert(!cabinBlocked(metro.ride.local.x,metro.ride.local.z,train.passengers));
 metro.seat();assert(metro.ride.seated);const first=metro.ride.seatId,local={...metro.ride.local};step(['KeyW'],60);assert.deepEqual(metro.ride.local,local,'Seated inputs must not drift off the chair');
 metro.seat();yaw=-Math.PI/2+train.root.rotation.y;step(['KeyW'],20);metro.seat();assert(metro.ride.seated&&metro.ride.seatId!==first,'Player must choose a different nearby seat');
 metro.seat();yaw=-Math.PI/2+train.root.rotation.y;step(['KeyW'],200);assert(metro.ride.local.x>11,'Gangway must connect adjacent carriages');
 // Try to walk through a side wall while the train is moving.
 while(train.state.phase!=='travel')metro.tick(.1,{playing:true,sound:false});step(['KeyD'],120);assert(metro.isRiding());assert(Math.abs(metro.ride.local.z)<=1.03);assert(p.y>6,'The train floor must not drop a walking rider into the tunnel');
 const held={...metro.ride.local};metro.tick(1,{playing:true,sound:false});assert.deepEqual(metro.ride.local,held);const expected=new THREE.Vector3(held.x,.16,held.z).applyAxisAngle(new THREE.Vector3(0,1,0),train.root.rotation.y).add(train.root.position);assert(new THREE.Vector3(p.x,p.y,p.z).distanceTo(expected)<1e-8,'Local position must follow the curved moving train');
 assert.equal(metro.safeSavePoint().y,6);metro.end();assert(metro.isRiding(),'Cannot leave a moving carriage');
 while(!(train.state.phase==='dwell'&&train.state.station===1&&train.state.open))metro.tick(.1,{playing:true,sound:false});
 const atArrival={...metro.ride.local};metro.tick(.1,{playing:false,sound:false,keys:new Set(['KeyW'])});assert.deepEqual(metro.ride.local,atArrival,'Pause must not move a rider');
 metro.use();assert(!metro.isRiding());assert.deepEqual(events,[{type:'metro',from:'nanjing',to:'lujiazui',departed:true}]);
 assert(cabinBlocked(31,0));assert(cabinBlocked(4,.8));assert(cabinBlocked(3,0));assert(!cabinBlocked(8,.35));
 // A physically occupied bench cannot be used, even when the other side is free.
 while(!(train.state.phase==='dwell'&&train.state.station===0&&train.state.open&&train.doorAmount>.85))metro.tick(.1);Object.assign(p,{x:-92,y:6,z:62.3});metro.stations[0].paid=true;metro.use();assert(metro.ride);metro.ride.local={x:4,z:-.32};for(const npc of train.passengers)npc.visible=true;metro.seat();assert(!metro.ride.seated,'Occupied seats must not accept the player');metro.end(true);
 // Walking through the open door must still disembark without V.
 while(!(train.state.phase==='dwell'&&train.state.station===0&&train.state.open&&train.doorAmount>.85))metro.tick(.1);Object.assign(p,{x:-92,y:6,z:62.3});metro.stations[0].paid=true;metro.use();yaw=-Math.PI/2+train.root.rotation.y;step(['KeyD'],55);assert(!metro.isRiding(),'Open door must allow a walking exit');assert(Math.abs(p.x+92)<.1);
 console.log('PASS: walking around poles, two chosen seats, occupied chairs, gangways, wall/floor safety, curved train following, pause, save, quest and walking exit.');
}finally{globalThis.document=old;}
