import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createMetroNetwork} from '../game/metro-network.js';
import {TRANSFER_POINTS,line10ToWorld} from '../game/metro-line10-layout.js';
import {METRO_STATIONS,metroRampFloor} from '../game/metro-layout.js';
import {blocksMetroClearance} from '../game/metro-clearance.js';
const old=globalThis.document,ctx=new Proxy({},{get:(_,k)=>k==='measureText'?t=>({width:t.length*15}):()=>{}}),node=()=>({children:[],appendChild(c){this.children.push(c);},append(){},setAttribute(){},getContext:()=>ctx,classList:{toggle(){}}});globalThis.document={createElement:node,body:node(),hidden:false};
try{
 const world=new VoxelWorld(),p={x:-100,y:16,z:76},metro=createMetroNetwork({scene:new THREE.Scene(),getPos:()=>p,place:q=>Object.assign(p,q),setView(){},notify(){},getSound:()=>false});
 const blocked=q=>overlaps(world,q.x,q.y,q.z)||metro.collides(q.x,q.y,q.z);
 // The actual approach plus both turns, not just the centre of an isolated
 // tube. Body offsets cover shoulders near the invisible fare partitions.
 for(const route of [TRANSFER_POINTS,[...TRANSFER_POINTS].reverse()])for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],dx=b[0]-a[0],dz=b[1]-a[1],length=Math.hypot(dx,dz),n=Math.ceil(length/.08);for(let j=0;j<=n;j++)for(const offset of [-.55,0,.55]){const q={x:a[0]+dx*j/n+dz/length*offset,y:16,z:a[1]+dz*j/n-dx/length*offset};assert(!blocked(q),'Body blocked at '+JSON.stringify(q));assert(world.get(Math.floor(q.x),15,Math.floor(q.z)),'Transfer floor lost support');}}
 const shared=metro.lines[10].stations[0];assert(!shared.bag&&!shared.gateMesh&&!shared.routes.length);Object.assign(p,line10ToWorld({x:150,y:16,z:0}));assert(!blocked(p),'Old phantom gate remains');assert(!metro.use(),'Shared hall cannot offer security or a phantom exit gate');
 for(let z=112;z<=124;z+=.08)assert(!blocked({x:-107,y:16,z}),'Corridor shell intrudes into the shared hall');
 // Read arrows in their rendered front-face frame, so a sign facing north
 // cannot claim a straight route when the next segment actually turns east.
 const wanted=[new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0),new THREE.Vector3(0,0,1),new THREE.Vector3(1,0,0)];
 for(const [i,sign]of metro.transferSigns.entries()){sign.updateWorldMatrix(true,false);const front=sign.userData.signFaces.front,normal=new THREE.Vector3(0,0,1).transformDirection(sign.matrixWorld),right=new THREE.Vector3(1,0,0).transformDirection(sign.matrixWorld),direction=front.arrow==='↑'?normal.negate():right.multiplyScalar(front.arrow==='→'?1:-1);assert(direction.dot(wanted[i])>.999,'Rendered arrow points into the wrong corridor wall');}
 let exits=0;metro.lines[10].root.traverse(o=>{const f=o.userData.signFaces?.front;if(f?.lineNumber===2&&o.userData.signText?.front.some(t=>t.includes('地面出口')))exits++;});assert(exits>=2,'Return hall needs visible green Line 2 / Exit guidance');
 for(let z=66;z<=79;z+=.08)assert(!blocked({x:-106,y:16,z}),'Exit approach hits the original gate housing');
 for(const paid of [true,false]){metro.restore(paid?{line10:{stations:[{id:'nanjing10',checked:true,paid:true}]}}:{});Object.assign(p,{x:-106.9,y:16,z:66});assert(metro.use());Object.assign(p,{x:-109,y:16,z:66});metro.tick(.1,{playing:true,sound:false});assert(metro.stations.every(s=>!s.paid),'Exit fare not cleared');const s=METRO_STATIONS[0],e=s.exits[0];for(let i=0;i<=18;i+=.1){const x=e.x+(18-i)*e.dir,q={x,y:metroRampFloor(x,e.z),z:e.z};assert(!metro.collides(q.x,q.y,q.z)&&!overlaps(world,q.x,Math.ceil(q.y),q.z),'Original street exit is blocked');}assert.equal(metroRampFloor(e.x,e.z),26);}
 for(const [x,y,z]of [[-100,18,83],[-114,18,122],[-109,18,124]])assert(blocksMetroClearance(x,y,z,9,world.get(x,y,z)),'A legacy edit can seal the repaired passage');
 console.log('PASS: full shoulder-width transfer in both directions, world-facing turn arrows, no phantom gate, green return exits, old paid/unpaid saves and original street escalator.');
}finally{globalThis.document=old;}
