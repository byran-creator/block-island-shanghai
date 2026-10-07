import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {styleNpc,npcPalette} from '../game/npc-appearance.js';

const originalDocument=globalThis.document,canvases=[];
globalThis.document={createElement:()=>{const commands=[],canvas={width:0,height:0,getContext:()=>({set fillStyle(v){commands.push(['color',v]);},fillRect(...args){commands.push(['rect',...args]);}}),commands};canvases.push(canvas);return canvas;}};
try{
 function model(){const root=new THREE.Group(),parts=Array.from({length:7},(_,i)=>{const mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshLambertMaterial());mesh.position.set(i*.1,i*.2,0);mesh.scale.set(.3,.4,.2);root.add(mesh);return mesh;});return {root,head:parts[0],torso:parts[1],hair:parts[2],arms:parts.slice(3,5),legs:parts.slice(5)};}
 const a=model(),before=new THREE.Box3().setFromObject(a.root),count=a.root.children.length;styleNpc(a,0,'visitor');assert.equal(a.root.children.length,count);assert.deepEqual(new THREE.Box3().setFromObject(a.root),before,'Cosmetic textures must preserve model bounds');
 const b=model();styleNpc(b,8,'visitor');assert.equal(b.head.material,a.head.material);assert.equal(b.head.geometry,a.head.geometry);assert.equal(b.torso.material,a.torso.material);assert.equal(b.hair.material,a.hair.material,'Materials are reused across equal variants');
 const uv=a.head.geometry.attributes.uv;for(let face=0;face<6;face++)for(let i=face*4;i<face*4+4;i++){assert(uv.getX(i)>=face%3/3-1e-7&&uv.getX(i)<=(face%3+1)/3+1e-7);assert(uv.getY(i)>=1-(Math.floor(face/3)+1)/2-1e-7&&uv.getY(i)<=1-Math.floor(face/3)/2+1e-7);}
 for(const role of ['vendor','office','resident','delivery','staff','officer']){const c=model();styleNpc(c,1,role);assert.equal(c.root.userData.appearance.role,role);assert(c.head.userData.panel,'Software renderer can draw the mapped texture');assert.equal(c.head.material.map.image.width,96);assert.equal(c.head.material.map.image.height,64);assert(c.head.material.map.image.commands.length>60,'Faces contain pixel detail, not just a solid color');assert.equal(c.head.material.map.magFilter,THREE.NearestFilter);}
 assert.equal(new Set([0,1,2,3].map(seed=>npcPalette(seed).skin)).size,4);assert.notEqual(npcPalette(0,'staff').shirt,npcPalette(0,'vendor').shirt);
 const faces=[];for(let i=0;i<8;i++){const c=model();styleNpc(c,i,'visitor');faces.push(JSON.stringify(c.head.material.map.image.commands.filter(p=>p[0]==='rect'&&p[1]>=64&&p[2]>=32)));}assert.equal(new Set(faces).size,8,'Face geometry varies as well as skin and hair colours');
}finally{globalThis.document=originalDocument;}
console.log('PASS: six-face skin UVs, facial/clothing detail, role/variant distinction, shared textures/materials, unchanged bounds/mesh count and software texture support.');
