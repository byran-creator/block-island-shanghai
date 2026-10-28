import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createMetroNetwork} from '../game/metro-network.js';
import {metroRampFloor,metroInterior,METRO_STATIONS} from '../game/metro-layout.js';
import {LINE10_STATIONS,LINE10_WORLD_STATIONS,line10ToWorld,line10ToLocal,line10Direction,TRANSFER_POINTS} from '../game/metro-line10-layout.js';
import {LINE10_TRAIN_BOUNDS,line10TrainPose} from '../game/metro-line10-service.js';
import {trainState,trainPose} from '../game/metro-service.js';
const previous=globalThis.document,ctx=new Proxy({},{get:(_,key)=>key==='measureText'?t=>({width:t.length*16}):()=>{}}),node=()=>({hidden:true,children:[],classList:{toggle(){}},append(...items){this.children.push(...items);},appendChild(c){this.children.push(c);},getContext:()=>ctx,setAttribute(){}});
globalThis.document={createElement:node,body:node(),hidden:false};
try{
 const world=new VoxelWorld(),scene=new THREE.Scene(),pos={x:-116,y:16,z:58},events=[],messages=[];let yaw=0,pitch=0;
 const network=createMetroNetwork({scene,getPos:()=>pos,place:p=>Object.assign(pos,p),getYaw:()=>yaw,setView:(a,b)=>{yaw=a;pitch=b;},getAudio(){throw Error('Muted');},getSound:()=>false,notify:m=>messages.push(m),onEvent:e=>events.push(e)});
 const tick=dt=>network.tick(dt,{playing:true,sound:false,keys:new Set()});tick(0);
 assert.equal(network.lines[10].trains[0].root.name,'line-10-10A01');assert.equal(network.lines[10].trains[0].doors.length,24);
 // The old northbound overrun put its nose in Line 2 at cycle time 9.2s.
 const old=trainPose(trainState(9.2,30,-1),{stations:LINE10_STATIONS,lineZ:()=>0});
 assert(line10ToWorld(old).z-24.3<78,'Fixture must reproduce the reported crossing');
 const materials=new Set(),planes=new Set();
 for(const t of network.lines[10].trains)t.root.traverse(o=>{if(o.isMesh){materials.add(o.material);for(const p of o.material.clippingPlanes??[])planes.add(p);}});
 assert.equal(planes.size,2,'Both trains share the same two physical portal limits');
 assert(materials.size<80,'Bounds must not create a new material for each passenger/door');
 for(const t of network.lines[2].trains)t.root.traverse(o=>{if(o.isMesh)assert(!o.material.clippingPlanes,'Line 2 materials must remain unaffected');});
 for(const z of [54,66,78])for(const plane of [...planes].slice(0,1))assert(plane.distanceToPoint(new THREE.Vector3(-102,6,z))<0,'The north tube plane must reject every Line 2 platform point');
 for(const s of LINE10_STATIONS)for(const plane of planes)assert(plane.distanceToPoint(new THREE.Vector3(...Object.values(line10ToWorld({x:s.x,y:6,z:8}))))>=0);
 for(const direction of [-1,1])for(let t=0;t<180;t+=.025){
  const state=trainState(t,0,direction),pose=line10TrainPose(state);
  if(state.phase!=='through')assert.deepEqual(pose,trainPose(state,{stations:LINE10_STATIONS,lineZ:()=>0}),'Boarding and interstation motion must stay exact');
  else if(pose.visible)assert(pose.x+24.3>=LINE10_TRAIN_BOUNDS.minX&&pose.x-24.3<=LINE10_TRAIN_BOUNDS.maxX);
 }
 tick(9.2);const outside=line10ToLocal({x:-102,y:6,z:75});assert.equal(network.lines[10].floorAt(outside.x,outside.z),null,'Clipped train tails must not create phantom floors inside Line 2');
 const transfers=[];network.lines[10].root.traverse(o=>{if(o.userData.signFaces?.front?.lineNumber===2)transfers.push(o);});assert(transfers.length>0,'Line 10 transfer back to Line 2 must use a green 2 badge, not its purple 10 default');
 assert.equal(network.lines[10].staff[0].root.position.x,-88);assert(network.staff.every(a=>a.root.position.y===16));
 // The old security/gate workflow creates one fare session shared by the paid passage.
 assert(network.use());tick(3.1);assert(network.lines[2].stations[0].checked);
 Object.assign(pos,{x:-109.2,y:16,z:66});assert(network.use());Object.assign(pos,{x:-107,y:16,z:66});tick(.1);assert(network.stations.every(s=>s.paid));
 for(let i=1;i<TRANSFER_POINTS.length;i++){const a=TRANSFER_POINTS[i-1],b=TRANSFER_POINTS[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.1);for(let j=0;j<=n;j++){Object.assign(pos,{x:a[0]+(b[0]-a[0])*j/n,y:16,z:a[1]+(b[1]-a[1])*j/n});assert(!overlaps(world,pos.x,pos.y,pos.z),'Blocked transfer '+JSON.stringify(pos));assert(!network.collides(pos.x,pos.y,pos.z),'Model blocks transfer '+JSON.stringify(pos));assert(metroInterior(pos));tick(.01);assert(network.stations.every(s=>s.paid),'Transfer cannot require another security or ticket');}}
 const from=LINE10_STATIONS[0],ramp={x:from.x-12,z:3};for(let d=0;d<=18;d+=.1){const p=line10ToWorld({x:ramp.x+d,y:16-10*d/18,z:ramp.z});assert(!overlaps(world,p.x,Math.ceil(p.y),p.z),'10 escalator headroom');assert(Math.abs(metroRampFloor(p.x,p.z)-p.y)<1e-8);}
 // Wait for a southbound service, then enter its real door from the platform.
 let train=network.lines[10].trains[0];for(let i=0;i<900;i++){tick(.1);if(train.state.origin===0&&train.state.station===0&&train.state.open&&train.doorAmount>.85)break;}
 function walkIn(station,side){for(let z=side*3.7;Math.abs(z)<6.2&&!network.isRiding();z+=side*.08){Object.assign(pos,line10ToWorld({x:station.x-2,y:6,z}));pos.y=Math.max(6,network.floorAt(pos.x,pos.z)??6);assert(!network.collides(pos.x,pos.y,pos.z),'Open platform door must allow physical walking');assert(!overlaps(world,pos.x,pos.y,pos.z));network.tryBoard();}assert(network.isRiding(),'Walking across the open door must board without V');}
 walkIn(from,-1);assert.equal(network.ride.line,10);
 assert(network.floorAt(pos.x,pos.z)>=6,'Carriage needs solid analytic support');const initialLocal={...network.ride.local};network.tick(.1,{playing:true,sound:false,keys:new Set(['KeyD'])});assert(Math.hypot(network.ride.local.x-initialLocal.x,network.ride.local.z-initialLocal.z)>.05,'Line 10 passengers must walk inside the rotated carriage');train.passengers.find(p=>p.userData.seatId==='3:1:1').visible=false;Object.assign(network.ride.local,{x:4,z:.32});assert(network.seat());assert(network.ride.seated);assert(network.seat());assert(!network.ride.seated);yaw=.72;pitch=.24;for(let i=0;i<450&&network.isRiding();i++)tick(.1);assert(!network.isRiding());assert.equal(yaw,.72,'Line 10 arrival preserves yaw');assert.equal(pitch,.24,'Line 10 arrival preserves pitch');
 const arrived=line10ToLocal(pos);assert(Math.abs(arrived.x-LINE10_STATIONS[1].x)<35);assert(events.some(e=>e.type==='metro10'&&e.from==='nanjing'&&e.to==='yuyuan'&&e.departed));
 assert(network.stations.every(s=>s.paid));assert.equal(line10Direction(LINE10_STATIONS[1],1).next,'老西门');assert.equal(line10Direction(LINE10_STATIONS[1],-1).next,'南京东路');
 const returnTrain=network.lines[10].trains[1];for(let i=0;i<900;i++){tick(.1);if(returnTrain.state.origin===1&&returnTrain.state.station===1&&returnTrain.state.open&&returnTrain.doorAmount>.85)break;}walkIn(LINE10_STATIONS[1],1);for(let i=0;i<450&&network.isRiding();i++)tick(.1);assert(!network.isRiding());assert(events.some(e=>e.type==='metro10'&&e.from==='yuyuan'&&e.to==='nanjing'&&e.departed),'Returning service must deliver to Nanjing without a second security check');
 // Return through the shared paid concourse, then use the original Line 2
 // exit gate and street staircase. There must be no phantom Line 10 gate.
 const shared=network.lines[10].stations[0];assert(shared.sharedConcourse);assert(!shared.gateMesh&&!shared.bag);assert.equal(shared.routes.length,0);
 Object.assign(pos,line10ToWorld({x:150,y:16,z:0}));assert(!network.collides(pos.x,pos.y,pos.z),'Old shared-hall glass gate must be gone');
 for(const [x,z]of [...TRANSFER_POINTS].reverse()){Object.assign(pos,{x,y:16,z});assert(!overlaps(world,x,16,z));assert(!network.collides(x,16,z));tick(.01);assert(network.stations.every(s=>s.paid));}
 Object.assign(pos,{x:-106.8,y:16,z:66});assert(network.use());Object.assign(pos,{x:-109,y:16,z:66});tick(.1);assert(network.stations.every(s=>!s.paid&&!s.checked),'Real Line 2 exit gate clears the shared fare');assert(network.use());assert(messages.at(-1).includes('尚未通过安检'));
 const saved=network.serialize();network.restore(saved);assert(!network.isRiding());assert(network.stations.every(s=>!s.paid));network.restore({stations:[{id:'nanjing',checked:true,paid:true}]});assert(network.lines[2].stations[0].paid,'Old Line 2 ticket save remains readable');
 for(const s of LINE10_WORLD_STATIONS)for(const e of s.exits){assert(world.get(Math.floor(e.x),25,Math.floor(e.z)),'New entry needs paving');}
 console.log('PASS: shared paid transfer with wall/model/headroom clearance, original check/gate entry, Line 10 six-car service/boarding/support/arrival, real directions, exit gates/re-entry and old/new fare saves.');
}finally{globalThis.document=previous;}
