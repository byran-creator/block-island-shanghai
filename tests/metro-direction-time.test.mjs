import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {METRO_CYCLE,METRO_DWELL,METRO_TRAVEL,METRO_ARRIVAL_GAP,trainState} from '../game/metro-service.js';
import {METRO_STATIONS} from '../game/metro-layout.js';
import {createMetro} from '../game/metro.js';
import {metroBackOptions} from '../game/metro-directions.js';
assert.equal(METRO_CYCLE,60);assert.equal(METRO_ARRIVAL_GAP,5);
for(const station of [0,1]){
 const times=[[],[]];for(let t=0;t<METRO_CYCLE;t++)for(const i of [0,1]){const s=trainState(t,i*METRO_CYCLE/2,i? -1:1);if(s.station===station&&s.phase==='dwell'&&s.remaining===METRO_DWELL)times[i].push(t);}
 assert(times.every(t=>t.length===1));const d=Math.abs(times[0][0]-times[1][0]);assert.equal(Math.min(d,METRO_CYCLE-d),5,'Opposite arrivals must be five seconds apart at both stations');
}
assert.equal(METRO_TRAVEL,13);
const original={arrow:'→',sections:[{zh:'陆家嘴',arrow:'←'}]};const inverse=metroBackOptions(original);assert.equal(inverse.arrow,'←');assert.equal(inverse.sections[0].arrow,'→');assert.equal(original.sections[0].arrow,'←');assert.equal(metroBackOptions({arrow:'↓'}).arrow,'↓');
globalThis.document={hidden:false,body:{append(){}},createElement:()=>{
 const texts=[],ctx={fillStyle:'',font:'',fillRect(x,y){if(x===0&&y===0)texts.length=0;},fillText(text,x,y){texts.push({text,x,y});},measureText:t=>({width:t.length*15}),texts};return {setAttribute(){},getContext:()=>ctx};
}};
const metro=createMetro({scene:new THREE.Scene(),getPos:()=>({x:0,y:26,z:0}),place(){},setView(){},notify(){},getSound:()=>false});
metro.root.updateMatrixWorld(true);let boards=0;
metro.root.traverse(g=>{
 const sign=g.userData.stationSign;if(sign?.y!==10||sign.width!==6.3)return;boards++;
 const expected=g.position.z<METRO_STATIONS.find(s=>Math.abs(s.x-g.position.x)<36).z?1:-1;
 assert.notEqual(g.children[0].material.map,g.children[1].material.map,'Opposite arrows need distinct printed faces');
 for(const [i,face]of ['front','back'].entries()){
  const normal=new THREE.Vector3(0,0,1).applyQuaternion(g.children[i].getWorldQuaternion(new THREE.Quaternion())),right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),normal),arrow=g.userData.signFaces[face].arrow;
  assert(Math.abs(right.x*(arrow==='→'?1:-1)-expected)<1e-6,'Both views must indicate the same physical train heading');
 }
});assert.equal(boards,4);
for(const t of metro.trains){
 assert.equal(t.route.textures.length,2,'Two shared orientations per train, not a texture per door');
 const meshes=[];t.root.traverse(g=>{if(g.isMesh&&t.route.textures.includes(g.material.map))meshes.push(g);});assert.equal(meshes.length,2,'Route faces retain their two material batches');let faces=0;
 for(const mesh of meshes){const ctx=mesh.material.map.image.getContext('2d'),n=ctx.texts.find(a=>a.text==='南京东路'),l=ctx.texts.find(a=>a.text==='陆家嘴');assert(n&&l);
  for(let i=0;i<mesh.geometry.attributes.position.count;i+=4){faces++;const mirrored=mesh.geometry.attributes.normal.getZ(i)<0;assert.equal(n.x>l.x,mirrored,'Actual batched face normals match geographic order');
   const origin=t.direction>0?'南京东路':'陆家嘴',target=t.direction>0?'陆家嘴':'南京东路',forward=(t.direction>0)!==mirrored,header=forward?origin+' → '+target:target+' ← '+origin;assert(ctx.texts.some(a=>a.text===header),'Cabin arrow matches train heading and viewed face');
  }
 }assert.equal(faces,64,'Both sides of all 32 door panels checked after geometry batching');
}
metro.tick(14);for(const t of metro.trains)for(const texture of t.route.textures)assert(texture.image.getContext('2d').texts.some(a=>a.text.startsWith('下一站 ')),'Both orientations update together');
console.log('PASS: five-second arrivals at both stations, opposite-face world headings, cabin geographic order/direction, shared textures and synchronized next-stop updates.');
