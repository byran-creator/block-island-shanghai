import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps,CITY} from '../game/world.js';
import {routePose} from '../game/bund.js';
import {createCityTraffic,signalPhase,trafficTravel,forwardDistance} from '../game/city-traffic.js';
import {createCityMedia,mediaSchedule,MEDIA_MESSAGES} from '../game/city-media.js';
import {ALL_BUILDINGS,roadContains} from '../game/city-layout.js';

for(let t=0;t<46;t+=.1){const p=signalPhase(t);assert(!(p.ns==='green'&&p.ew==='green'),'Conflicting roads have simultaneous green');assert(p.remaining>0&&p.remaining<=18);}
assert.deepEqual(signalPhase(0),signalPhase(46));
const route={lengthMeters:100},signal={offset:0},car={route,t:10,dir:1,lane:1.5,speed:10,root:{position:{x:0,y:26,z:0}},crossings:[{d:20,axis:'ns',signal}]};
assert.equal(trafficTravel(car,1,24),2.75,'Red light must stop the entire car before the stop line');assert.equal(trafficTravel(car,1,0),10,'Green light must release waiting cars');
const reverse={...car,t:30,dir:-1};assert.equal(trafficTravel(reverse,1,24),2.75);assert.equal(forwardDistance(98,2,100),4);
assert.equal(trafficTravel(car,1,0,[car,{...car,t:13}]),0,'Queued vehicles must retain a gap');
assert.equal(trafficTravel({...car,t:17},1,24),10,'Vehicle already inside the intersection must clear it');
const world=new VoxelWorld();
const context={fillRect(){},fillText(){}};const originalDocument=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>context})};
try{
 const traffic=createCityTraffic({scene:new THREE.Scene(),world,getPos:()=>({x:-190,y:26,z:-140}),routePose,cars:[]});
 assert.equal(traffic.buses.length,4);assert(traffic.riders.some(r=>r.kind==='bicycle')&&traffic.riders.some(r=>r.kind==='delivery'));assert(traffic.officers.length>=2);assert(traffic.stops.length>=1);for(const o of traffic.officers)assert(!overlaps(world,o.root.position.x,26,o.root.position.z));
 for(const agent of [...traffic.buses,...traffic.riders])for(let d=0;d<agent.route.lengthMeters;d+=.7){const p=routePose(agent.route,d,agent.lane),x=p.x+.5,z=p.z+.5;assert(!overlaps(world,x,p.y,z),`${agent.kind}: center enters a building at ${x},${z}`);for(const dx of [-agent.halfWidth,0,agent.halfWidth])for(const dz of [-agent.halfLength,0,agent.halfLength]){const xx=x+dx*Math.cos(p.yaw)+dz*Math.sin(p.yaw),zz=z-dx*Math.sin(p.yaw)+dz*Math.cos(p.yaw);assert(!world.get(Math.floor(xx),p.y,Math.floor(zz))&&!world.get(Math.floor(xx),p.y+1,Math.floor(zz)),`${agent.kind}: body clips a wall at ${xx},${zz}`);}if(agent.kind!=='bus'&&x<100&&Math.abs(z-66)<5)assert(roadContains(x,z)&&Math.abs(Math.cos(p.yaw))>.65,'Riders may cross designated road junctions but must not ride along the pedestrian mall');}
 assert(traffic.riders.some(a=>a.kind==='delivery'&&a.route.some(p=>p.x>120&&p.x<285)), 'Delivery routes should serve the Lujiazui core roads');
 const bus=traffic.buses[0],t=bus.t;traffic.tick(3);assert.equal(bus.t,t,'Bus must dwell at its stop');traffic.tick(4);traffic.tick(1);assert.notEqual(bus.t,t,'Bus must leave after boarding dwell');
 const starts=traffic.buses.map(b=>b.t);for(let i=0;i<600;i++)traffic.tick(.1);assert(traffic.buses.every((b,i)=>b.t!==starts[i]),'Traffic must resume across signal cycles');
 assert(traffic.signals.every(s=>s.heads.every(h=>h.lamps.length===3&&h.counter.value)));
 assert(traffic.collides(bus.root.position.x,bus.root.position.y,bus.root.position.z));assert(!traffic.collides(bus.root.position.x,bus.root.position.y+4,bus.root.position.z));
 const media=createCityMedia({scene:new THREE.Scene()});assert.equal(media.screens.length,2);assert(media.strips.length>60);const crownPositions=media.screens[0].mesh.geometry.attributes.position;let cx=0,cz=0;for(let i=0;i<crownPositions.count;i++){cx+=crownPositions.getX(i);cz+=crownPositions.getZ(i);}assert(Math.abs(cx/crownPositions.count-CITY.shanghai.x)<.001&&Math.abs(cz/crownPositions.count-CITY.shanghai.z)<.001,'Crown media must remain centered on the existing tower');
 const podium=ALL_BUILDINGS.find(b=>b.id==='jinmao-podium');assert(media.screens[1].mesh.position.x>podium.x+podium.rx+1,'Advertisement must sit outside the actual east facade');
 media.tick(0,{dayClock:36});assert(!media.screens[0].mesh.visible&&media.screens[1].mesh.visible);media.tick(9,{dayClock:140});assert(media.screens.every(s=>s.mesh.visible)&&media.strips.every(s=>s.visible));media.tick(0,{dayClock:200});assert(media.screens.every(s=>!s.mesh.visible)&&media.strips.every(s=>!s.visible));assert.equal(MEDIA_MESSAGES.length,3);assert(mediaSchedule(165).crown,'The usual 22:00 night preset must still display crown media');
}finally{globalThis.document=originalDocument;}
console.log('PASS: body clearance for buses/riders, pedestrian-mall avoidance, bus dwell, red/amber stopping and green release, queue gaps, safe officer positions, countdowns, curved crown/podium media and late-night switch-off.');
