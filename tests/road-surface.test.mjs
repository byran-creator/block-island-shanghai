import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {createBund,routePose} from '../game/bund.js';
import {CAR_ROUTES} from '../game/city-layout.js';
const previous=globalThis.document,ctx=new Proxy({},{get:()=>()=>{}});
globalThis.document={createElement:()=>({getContext:()=>ctx})};
try{
 const scene=new THREE.Scene();createBund({scene,world:new VoxelWorld(),getPos:()=>({x:0,y:60,z:66})});scene.updateMatrixWorld(true);
 // Examine the actual batched asphalt triangles, not just logical road widths.
 const triangles=[];scene.traverse(m=>{if(!m.isMesh||m.material.color?.getHex()!==0x34424b)return;
  const g=m.geometry,p=g.attributes.position,ix=g.index;
  for(let i=0;i<(ix?.count??p.count);i+=3){
   const vs=[0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(p,ix?ix.getX(i+j):i+j).applyMatrix4(m.matrixWorld));
   if(vs.every(v=>Math.abs(v.y-26.015)<.001))triangles.push({vs,minX:Math.min(...vs.map(v=>v.x)),maxX:Math.max(...vs.map(v=>v.x)),minZ:Math.min(...vs.map(v=>v.z)),maxZ:Math.max(...vs.map(v=>v.z))});
  }
 });assert(triangles.length);
 const cross=(a,b,p)=>(b.x-a.x)*(p.z-a.z)-(b.z-a.z)*(p.x-a.x);
 const covered=p=>triangles.some(t=>{
  if(p.x<t.minX-1e-5||p.x>t.maxX+1e-5||p.z<t.minZ-1e-5||p.z>t.maxZ+1e-5)return false;
  const [a,b,c]=t.vs,s=[cross(a,b,p),cross(b,c,p),cross(c,a,p)];return s.every(v=>v>=-1e-5)||s.every(v=>v<=1e-5);
 });
 const route=CAR_ROUTES.find(r=>r.id==='bund').samples;let points=0;
 for(let d=0;d<route.lengthMeters;d+=.5)for(const lane of [-2.2,2.2]){
  const p=routePose(route,d,lane);if(p.z<40||p.z>100)continue;
  // Both roads on either side of the stele junction, including bus corners.
  for(const u of [-.93,0,.93])for(const v of [-2.45,0,2.45]){
   const q={x:p.x+.5+u*Math.cos(p.yaw)+v*Math.sin(p.yaw),z:p.z+.5-u*Math.sin(p.yaw)+v*Math.cos(p.yaw)};
   assert(covered(q),`A full bus body leaves visible asphalt near Nanjing Road: lane ${lane}, ${q.x},${q.z}`);points++;
  }
 }
 assert(points>4000);
 const cycle=scene.getObjectByName('curb-cycle-lane'),matrix=new THREE.Matrix4();assert(cycle?.isInstancedMesh);
 for(let i=0;i<cycle.count-1;i++){
  const a=routePose(route,i*2,4),b=routePose(route,Math.min(i*2+2,route.lengthMeters-.001),4),direction=new THREE.Vector3(b.x-a.x,0,b.z-a.z).normalize();
  cycle.getMatrixAt(i,matrix);const paintedDirection=new THREE.Vector3(0,1,0).transformDirection(matrix);
  assert(Math.abs(paintedDirection.dot(direction))>.999999,'Cycle lane paint must follow the road rather than mirror its curve');
 }
 console.log(`PASS: ${points} actual bus-body points covered by visible asphalt on both Nanjing roads; cycle markings follow real tangents.`);
}finally{globalThis.document=previous;}
