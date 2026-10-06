import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps,LANDMARKS,trace} from '../game/world.js';
import {MAGNOLIA} from '../game/shanghai-map.js';
import {TRAVEL_POINTS,mapPosition,mapHit,safeLanding} from '../game/map-travel.js';
import {createCommute} from '../game/commute.js';
import {createCityTraffic,trafficTravel} from '../game/city-traffic.js';
import {routePose} from '../game/bund.js';
import {beamCue,createLujiazuiShow} from '../game/lujiazui-show.js';
import {roadContains} from '../game/city-layout.js';
const world=new VoxelWorld(),scene=new THREE.Scene();
for(const p of TRAVEL_POINTS){const q=safeLanding(world,p);assert(q&&overlaps(world,q.x,q.y-.1,q.z)&&!overlaps(world,q.x,q.y,q.z),p.name+' needs a safe landing');}
for(const id of ['tower','village','nanjing','waibaidu']){const p=TRAVEL_POINTS.find(p=>p.id===id),q=mapPosition(p);assert.equal(mapHit(q.x,q.y).id,id);}
assert.equal(mapHit(0,0),undefined);assert.equal(safeLanding(world,{x:100,y:80,z:200},()=>true),null);
for(const p of [{x:134.5,y:44,z:42.5},{x:133.5,y:70,z:42.5}]){assert(!overlaps(world,p.x,p.y-.1,p.z));assert(safeLanding(world,p),'Old outer Pearl balcony positions must have a nearby supported replacement');}
let pos={...LANDMARKS.bund},canRide=true;const activity={heli:new THREE.Group()};activity.heli.position.set(MAGNOLIA.x-1.5,83,MAGNOLIA.z-1);
const context={fillRect(){},fillText(){}};const oldDocument=globalThis.document;globalThis.document={createElement:()=>({getContext:()=>context})};
try{
 const traffic=createCityTraffic({scene,world,getPos:()=>pos,routePose,cars:[]});
 const commute=createCommute({scene,world,civil:{traffic},activity,getPos:()=>pos,blocked:(x,y,z)=>overlaps(world,x,y,z)||traffic.collides(x,y,z),place:p=>Object.assign(pos,p),setView(){},turnView(){},notify(){},allowed:()=>canRide});
 assert(commute.vehicles.filter(v=>v.kind==='bicycle').length>=3);assert(commute.vehicles.filter(v=>v.kind==='car').length>=3);
 for(const v of commute.vehicles)assert(commute.bodyClear(v,v.root.position.x,v.root.position.y,v.root.position.z),v.kind+' parking body overlaps a wall');
 for(const v of commute.vehicles.filter(v=>v.kind!=='helicopter'))for(const dx of [-v.halfWidth,v.halfWidth])for(const dz of [-v.halfLength,v.halfLength])assert(!roadContains(v.root.position.x+dx,v.root.position.z+dz),'Initial parked vehicle must leave both traffic lanes clear');
 const bike=commute.vehicles.find(v=>v.kind==='bicycle');pos={x:bike.root.position.x+1.1,y:26,z:bike.root.position.z};assert(commute.use());assert(commute.isRiding());const start=bike.root.position.clone();for(let i=0;i<80;i++)commute.tick(.025,new Set(['KeyW']));assert(bike.root.position.distanceTo(start)>4,'Player must actually ride the bicycle');assert(commute.cameraPose(0,-.2));assert(commute.safeSavePoint());assert(commute.end());assert(!commute.collides(pos.x,pos.y,pos.z),'Exit must be outside the vehicle body');
 canRide=false;assert.equal(commute.mount(bike),false);canRide=true;
 const bus=traffic.buses[0];pos={x:bus.root.position.x+3.2,y:26,z:bus.root.position.z};assert(commute.use());assert.equal(commute.ride.kind,'bus');const busStart=bus.t;for(let i=0;i<400;i++){traffic.tick(.025);commute.tick(.025);}assert.notEqual(bus.t,busStart,'Bus with a passenger must leave its stop');assert(Math.hypot(pos.x-bus.root.position.x,pos.z-bus.root.position.z)<.01);assert(commute.end());
 const heli=commute.vehicles.find(v=>v.kind==='helicopter');pos={...LANDMARKS.helipad};assert(commute.mount(heli));const base=heli.root.position.y;for(let i=0;i<100;i++)commute.tick(.02,new Set(['Space']));assert(heli.root.position.y>base+10);assert.equal(commute.end(),false,'Cannot leave a hovering helicopter');assert(commute.safeSavePoint());assert(commute.end(true));assert.equal(heli.root.position.y,83);assert(!commute.isRiding());
 // Sweep a car against a one-block wall, even with a frame-sized input step.
 const wallWorld={get:(x,y,z)=>y===25?9:z===0&&y>=26&&y<=30?3:0};let flatPos={x:50,y:26,z:50};const flat=createCommute({scene:new THREE.Scene(),world:wallWorld,civil:{traffic:{buses:[]}},activity:{heli:new THREE.Group()},getPos:()=>flatPos,blocked:(x,y,z)=>overlaps(wallWorld,x,y,z),place:p=>Object.assign(flatPos,p),setView(){},turnView(){},notify(){}});const car=flat.vehicles.find(v=>v.kind==='car');car.root.position.set(50,26,5);flat.mount(car);for(let i=0;i<150;i++)flat.tick(.1,new Set(['KeyW']));assert(car.root.position.z>1.65,'Car must stop before the wall');assert(Math.abs(car.speed)<1,'Impact must dissipate speed with a small rebound');assert(flat.bodyClear(car,car.root.position.x,car.root.position.y,car.root.position.z),'Rebound must leave the car outside the wall');
 const camera=flat.cameraPose(Math.PI,-.2),from=new THREE.Vector3(camera.focus.x,camera.focus.y,camera.focus.z),to=new THREE.Vector3(camera.position.x,camera.position.y,camera.position.z);assert.equal(trace(wallWorld,from,to.clone().sub(from).normalize(),to.distanceTo(from)),null,'Follow camera must not cross a wall');
}finally{globalThis.document=oldDocument;}
const lightShow=createLujiazuiShow(new THREE.Scene());lightShow.tick(2,{active:true});assert(lightShow.beams.every(b=>b.cone.visible&&b.light.intensity>0));assert.notEqual(beamCue(.3,0).strength,beamCue(.3,1).strength);lightShow.tick(0,{active:false});assert(lightShow.beams.every(b=>!b.cone.visible&&!b.light.visible));
assert(world.get(131,42,42));assert.equal(world.get(133,42,42),0,'Lower Pearl globe must not retain its old oversized shell');assert.equal(world.get(133,70,42),0,'Upper globe must not retain the old wide observation ring');assert(!overlaps(world,LANDMARKS.deck.x,LANDMARKS.deck.y,LANDMARKS.deck.z)&&overlaps(world,LANDMARKS.deck.x,LANDMARKS.deck.y-.1,LANDMARKS.deck.z));
console.log('PASS: map hit testing/safe destinations, rideable vehicle parking, bicycle movement, bus passenger progress, safe exits/saves, helicopter takeoff/exit guard, swept car collision, Pearl proportions and alternating show beams.');
