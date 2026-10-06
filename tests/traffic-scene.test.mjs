import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createBund,routePose} from '../game/bund.js';
import {vehicleContact} from '../game/vehicle-dynamics.js';
import {trafficContact} from '../game/traffic-contact.js';
import {soundScene,nearbyTraffic,createSceneAudio} from '../game/scene-audio.js';
import {createMusic} from '../game/music.js';
import {PEACE,PEACE_DINING} from '../game/peace-restaurant.js';
import {DENSE_BUILDINGS,CAR_ROUTES} from '../game/city-layout.js';

const world=new VoxelWorld(),oldDocument=globalThis.document;
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){},beginPath(){},arc(){},stroke(){},moveTo(){},lineTo(){}})})};
try{
 const obstacles=[],city=createBund({scene:new THREE.Scene(),world,getPos:()=>({x:0,y:26,z:99}),getObstacles:()=>obstacles}),agents=city.traffic.agents,travel=new Map(agents.map(a=>[a,0])),recent=new Map(agents.map(a=>[a,0]));
 const previous=new Map(agents.map(a=>[a,{position:a.root.position.clone(),yielding:false}]));
 function clearance(){for(let i=0;i<agents.length;i++)for(let j=i+1;j<agents.length;j++){const a=agents[i],p=a.root.position,b=agents[j];assert(!vehicleContact(a,p.x,p.y,p.z,a.root.rotation.y,b),`${i}:${a.kind} overlaps ${j}:${b.kind}`);}for(const a of agents){const old=previous.get(a);if(['bicycle','delivery'].includes(a.kind)||a.yielding||old.yielding)assert(a.root.position.distanceTo(old.position)<.65,`Continuous rider/yield motion required: ${a.trafficId}`);old.position.copy(a.root.position);old.yielding=!!a.yielding;}}
 clearance();for(let i=0;i<7200;i++){city.traffic.tick(.1);clearance();for(const a of agents){travel.set(a,travel.get(a)+a.travelSpeed*.1);if(i>=6600)recent.set(a,recent.get(a)+a.travelSpeed*.1);}}
 assert(agents.every(a=>travel.get(a)>2),'Every traffic agent must progress through signal cycles');
 assert(agents.every(a=>recent.get(a)>2),'Every agent must still progress in the final minute, after twelve minutes of shared-road traffic');
 assert(new Set(city.cars.map(a=>a.speed.toFixed(2))).size>8);assert(new Set(city.traffic.riders.map(a=>a.phase.toFixed(2))).size>4);
 const delivery=city.traffic.riders.filter(a=>a.kind==='delivery');assert(delivery.every(a=>a.root.userData.electric&&a.root.name==='delivery-scooter'),'Every delivery rider must use an electric scooter');assert(new Set(delivery.map(a=>a.deliveryD.toFixed(2))).size===delivery.length,'Delivery stops must be independent');assert(city.traffic.riders.filter(a=>a.kind==='bicycle').every(a=>!a.root.userData.electric&&a.root.name==='city-bicycle'));
 console.log('Traffic travel metres:',Object.fromEntries(['bus','bicycle','delivery'].map(kind=>[kind,agents.filter(a=>a.kind===kind).map(a=>Math.round(travel.get(a)))])));
 const rider=delivery.find(a=>a.route===CAR_ROUTES.find(r=>r.id==='lujiazui').samples),parked={root:new THREE.Group(),halfWidth:.45,halfLength:1.06,height:2.2};
 let parkedAt;for(let gap=6;gap<40;gap+=2){const p=routePose(rider.route,rider.t+gap,rider.lane);p.x+=.5;p.z+=.5;parked.root.position.set(p.x,p.y,p.z);parked.root.rotation.y=p.yaw;if(!agents.some(a=>vehicleContact(a,a.root.position.x,a.root.position.y,a.root.position.z,a.root.rotation.y,parked))){parkedAt=p;break;}}
 assert(parkedAt);obstacles.push(parked);let moved=0,maxLane=0;
 assert(!agents.some(a=>!['delivery','bicycle'].includes(a.kind)&&a.route.some(s=>{const p=routePose(a.route,s.d,a.lane);return Math.hypot(p.x+.5-parked.root.position.x,p.z+.5-parked.root.position.z)<6&&vehicleContact(a,p.x+.5,p.y,p.z+.5,p.yaw,parked);})), 'The parked cycle-lane fixture must leave motor-vehicle paths clear');
 for(const a of agents)recent.set(a,0);
 for(let i=0;i<1800;i++){const previous=new Map(delivery.map(a=>[a,a.root.position.clone()]));city.traffic.tick(.1);clearance();for(const a of agents){assert(!vehicleContact(a,a.root.position.x,a.root.position.y,a.root.position.z,a.root.rotation.y,parked),'Rider must not cut through parked vehicle');if(i>=1200)recent.set(a,recent.get(a)+a.travelSpeed*.1);}for(const a of delivery)assert(a.root.position.distanceTo(previous.get(a))<.65,'Recovery must move continuously: '+JSON.stringify({i,id:a.trafficId,from:previous.get(a).toArray(),to:a.root.position.toArray(),lane:a.lane,t:a.t,detour:!!a.detour}));moved+=rider.travelSpeed*.1;maxLane=Math.max(maxLane,Math.abs(rider.lane-rider.baseLane));}
 console.log('Final blocked traffic:',JSON.stringify(agents.filter(a=>recent.get(a)<=2).map(a=>{const p=routePose(a.route,a.t+a.dir*.15,a.lane);p.x+=.5;p.z+=.5;p.yaw+=a.dir<0?Math.PI:0;return {id:a.trafficId,kind:a.kind,wait:a.waitTime,reason:a.waitReason,pos:a.root.position.toArray(),contacts:[...agents,parked].filter(b=>vehicleContact(a,p.x,p.y,p.z,p.yaw,b)).map(b=>({id:b.trafficId,kind:b.kind,pos:b.root.position.toArray()}))};})));
 assert(agents.every(a=>recent.get(a)>2),'A parked obstacle must not leave any traffic agent permanently gridlocked');
 console.log('Parked obstacle recovery:',{moved,maxLane,wait:rider.waitTime,reason:rider.waitReason});
 assert(moved>100&&rider.waitTime<30,'Parked vehicle must not permanently trap the delivery rider');assert(maxLane>.5,'Blocked rider should move into a clear passing lane');console.log('Final rider waits:',city.traffic.riders.map(a=>({kind:a.kind,wait:+a.waitTime.toFixed(1),detour:!!a.detour})));assert(city.traffic.riders.every(a=>a.waitTime<40),'All riders should recover from clustered traffic');
}finally{globalThis.document=oldDocument;}

const flat={get:(x,y,z)=>y===25?9:0},car={root:new THREE.Group(),halfWidth:.72,halfLength:1.32,height:1.3,travelSpeed:4};car.root.position.set(50,26,50);
const player={x:50,y:26,z:50},before=car.root.position.clone();const hit=trafficContact({agents:[car],player,world:flat,blocked:(x,y,z)=>overlaps(flat,x,y,z)});assert(hit&&hit.speed===4);assert(car.root.position.equals(before),'Traffic contact must never move or stop the car');assert(!vehicleContact({root:{},halfWidth:.3,halfLength:.3},hit.point.x,26,hit.point.z,0,car));
car.travelSpeed=-1.1;assert.equal(trafficContact({agents:[car],player,world:flat}).speed,1.1,'Backing vehicles must report physical impact speed');car.travelSpeed=4;
const againstWall=trafficContact({agents:[car],player,world:flat,blocked:x=>x>50});assert(againstWall&&againstWall.point.x<50,'Push to a clear side, away from a wall');
const pilot={root:new THREE.Group(),kind:'bicycle',halfWidth:.4,halfLength:.95};pilot.root.position.copy(car.root.position);assert(trafficContact({agents:[car],vehicle:pilot,player,world:flat}));
assert.equal(trafficContact({agents:[car],vehicle:{...pilot,kind:'bus'},player,world:flat}),null);

assert.equal(soundScene({x:-90,y:26,z:66}).track,'shop');const shop=DENSE_BUILDINGS.find(b=>b.id.startsWith('nanjing-'));assert.equal(soundScene({x:shop.x,y:26,z:shop.z}).name,'南京路店铺');assert.equal(soundScene({...PEACE,y:PEACE_DINING.y}).track,'dining');assert.equal(soundScene({x:120,y:26,z:300}).track,'island');assert.equal(soundScene({x:120,y:20,z:99}).track,'deep');assert.equal(soundScene({x:305,y:26,z:140},true).track,'neon');assert(nearbyTraffic([car],{x:55,y:26,z:50}).level>nearbyTraffic([car],{x:65,y:26,z:50}).level);assert.equal(nearbyTraffic([car],{x:100,y:26,z:50}),null);

const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
const gains=[],events=[],param=()=>({value:0,setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){assert(v>0);this.value=v;},setTargetAtTime(v){assert(Number.isFinite(v));this.value=v;}}),node=()=>({gain:param(),frequency:param(),pan:param(),delayTime:param(),connect(){},disconnect(){},start(){events.push('start');},stop(){events.push('stop');}});
const ctx={currentTime:0,state:'running',sampleRate:8000,destination:{},resume:()=>Promise.resolve(),createGain(){const n=node();gains.push(n);return n;},createOscillator:node,createStereoPanner:node,createBiquadFilter:node,createDelay:node,createBuffer:()=>({getChannelData:()=>new Float32Array(16000)}),createBufferSource:node};
const music=createMusic(()=>ctx);music.start();for(let i=0;i<13;i++)music.update({playing:true,sceneTrack:'shop',dt:.1});assert.equal(music.track.id,'shop');music.update({playing:true,sceneTrack:'dining',dt:.1});assert.equal(music.track.id,'shop','Do not switch immediately at a doorway');music.setTrack('river');for(let i=0;i<20;i++)music.update({playing:true,sceneTrack:'dining',dt:.1});assert.equal(music.track.id,'river','Manual music must override regional score');music.setAutomatic(true);for(let i=0;i<13;i++)music.update({playing:true,sceneTrack:'dining',dt:.1});assert.equal(music.track.id,'dining');music.dispose();
let calls=0,cancels=0;const speech={speaking:false,getVoices:()=>[{lang:'zh-CN',localService:true}],speak(u){assert(u.text.includes('生煎'));calls++;},cancel(){cancels++;}},Utterance=class{constructor(text){this.text=text;}};
const ambient=createSceneAudio(()=>ctx,{speech,Utterance}),base=gains.length;assert(ambient.start());const state={playing:true,pos:{x:-90,y:26,z:66},vendors:[{root:{position:{x:-89,y:26,z:66}},food:true}],agents:[],sound:true,volume:.28};ambient.update(.1,state);assert.equal(calls,1);assert(gains[base].gain.value>0);ambient.update(.1,{...state,hidden:true});assert.equal(gains[base].gain.value,0);assert.equal(cancels,1);ambient.update(25,{...state,sound:false});assert.equal(calls,1);ambient.setEnabled(false);ambient.update(25,state);assert.equal(calls,1);ambient.dispose();
const unavailable=createSceneAudio(()=>ctx,{speech:{speaking:false,getVoices:()=>[],speak(){assert.fail('No local Chinese voice: speech should be skipped');}},Utterance});unavailable.start();unavailable.update(.1,state);unavailable.dispose();
console.log('PASS: fifteen-minute city-wide vehicle/rider clearance and recent progress, parked-obstacle recovery, distinct speeds/phases, safe player ejection, regional audio and local-voice fallback.');
