import {NANJING_CONNECTOR_LAMPS} from './nanjing-connector-lamps.js';
import * as THREE from './three.module.js';
import {DENSE_BUILDINGS} from './city-layout.js';
import {shopSignAnchor} from './shop-sign-layout.js';

// Reuse ordinary vertex colors. Bake sparse daylight originals and window spill;
// only upload changed colors on a day/night transition or a rebuilt terrain mesh.
export function createNanjingBakedLight(){
 let night=false;const done=new WeakSet(),entries=new Set(),materials=new WeakMap();
 const sources=DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-')).map(b=>{const a=shopSignAnchor(b,28);return {x:a.x,y:28,z:a.z+b.entranceSide*.55};});
 sources.push(...NANJING_CONNECTOR_LAMPS.map(p=>({x:p.x,y:29,z:p.z,radiusSq:81,strength:.34})));
 const stats={meshes:0,bytes:0},sphere=new THREE.Sphere(),point=new THREE.Vector3(),normal=new THREE.Vector3(),normalMatrix=new THREE.Matrix3();
 function apply(entry){const {colors,indices,original,energy}=entry;for(let j=0;j<indices.length;j++){const k=j*3,e=night?energy[j]/255*3:0;colors.setXYZ(indices[j],original[k]+e,original[k+1]+e*.77,original[k+2]+e*.43);}colors.needsUpdate=true;}
 function bakeMesh(mesh){
  const g=mesh.geometry,mat=mesh.material;
  if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mat)||(!mat?.isMeshLambertMaterial&&!mat?.isMeshPhongMaterial)||mat.transparent||!g?.attributes.normal||g.attributes.position.count<30||done.has(g))return false;
  if(!g.boundingSphere)g.computeBoundingSphere();sphere.copy(g.boundingSphere).applyMatrix4(mesh.matrixWorld);
  if(sphere.center.x+sphere.radius<-200||sphere.center.x-sphere.radius>12||sphere.center.z+sphere.radius<49||sphere.center.z-sphere.radius>84||sphere.center.y-sphere.radius>32||sphere.center.y+sphere.radius<25.8)return false;
  const p=g.attributes.position,n=g.attributes.normal,indices=[],energy=[];normalMatrix.getNormalMatrix(mesh.matrixWorld);
  for(let i=0;i<p.count;i++){
   point.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);
   if(point.x<-200||point.x>12||point.z<49||point.z>84||point.y<25.8||point.y>31.5)continue;
   normal.fromBufferAttribute(n,i).applyMatrix3(normalMatrix).normalize();let e=0;
   for(const s of sources){const dx=s.x-point.x,dy=s.y-point.y,dz=s.z-point.z,d2=dx*dx+dy*dy+dz*dz;const limit=s.radiusSq??49;if(d2>=limit||d2<.01)continue;const facing=Math.max(0,(normal.x*dx+normal.y*dy+normal.z*dz)/Math.sqrt(d2));e+=(s.strength??.32)*(1-d2/limit)**2*facing;}
   if(e>=1/255){indices.push(i);energy.push(Math.round(Math.min(.28,e)*255));}
  }
  if(!indices.length)return false;
  const existing=g.attributes.color;if(existing&&!mat.vertexColors)return false;
  let colors=existing;if(!colors){colors=new THREE.BufferAttribute(new Float32Array(p.count*3).fill(1),3);g.setAttribute('color',colors);stats.bytes+=colors.array.byteLength;}
  const original=new Float32Array(indices.length*3);for(let j=0;j<indices.length;j++){const i=indices[j];original[j*3]=colors.getX(i);original[j*3+1]=colors.getY(i);original[j*3+2]=colors.getZ(i);}
  const entry={colors,indices:new Uint32Array(indices),original,energy:new Uint8Array(energy)};entries.add(entry);done.add(g);
  if(!mat.vertexColors){if(!materials.has(mat)){const m=mat.clone();m.vertexColors=true;materials.set(mat,m);}mesh.material=materials.get(mat);}
  stats.meshes++;stats.bytes+=entry.indices.byteLength+original.byteLength+entry.energy.byteLength;apply(entry);
  g.addEventListener('dispose',()=>entries.delete(entry));return true;
 }
 function bakeScene(scene){scene.updateMatrixWorld(true);const refs=new Map();scene.traverse(o=>{if(o.isMesh)refs.set(o.geometry,(refs.get(o.geometry)||0)+1);});scene.traverse(o=>{if(!o.isMesh||refs.get(o.geometry)!==1)return;for(let p=o;p;p=p.parent)if(p.userData.appearance)return;bakeMesh(o);});}
 return {bakeMesh,bakeScene,setNight(value){value=!!value;if(value===night)return;night=value;for(const entry of entries)apply(entry);},stats};
}
