import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as THREE from '../game/three.module.js';
import {createYuyuanRickshaws} from '../game/yuyuan-rickshaw.js';
const url=new URL('../game/yuyuan-rickshaw.js',import.meta.url);
const referenceSource=readFileSync(url,'utf8').replace('  batchRickshawStatic(r);','').replace(/from '([^']+)'/g,(_,p)=>`from '${new URL(p,url).href}'`);
const {createYuyuanRickshaws:reference}=await import('data:text/javascript;base64,'+Buffer.from(referenceSource).toString('base64'));
function create(factory){const root=new THREE.Group(),scene=new THREE.Scene();scene.add(root);return {scene,system:factory({scene,root,getPos:()=>({x:1000,y:26,z:1000}),setView(){},place(){},notify(){}})};}
const a=create(reference),b=create(createYuyuanRickshaws);
function snapshot(scene){scene.updateMatrixWorld(true);const rows=[],v=new THREE.Vector3(),n=new THREE.Vector3(),normal=new THREE.Matrix3();let meshes=0;const q=x=>Math.round(x*1000);scene.traverse(o=>{if(!o.isMesh)return;meshes++;const g=o.geometry,p=g.attributes.position,m=o.material,material=[m.type,m.color?.getHex(),m.emissive?.getHex(),m.transparent,m.opacity,m.side].join(',');normal.getNormalMatrix(o.matrixWorld);for(let i=0;i<(g.index?.count??p.count);i++){const j=g.index?.getX(i)??i;v.fromBufferAttribute(p,j).applyMatrix4(o.matrixWorld);n.fromBufferAttribute(g.attributes.normal,j).applyMatrix3(normal).normalize();rows.push(material+':'+[v.x,v.y,v.z,n.x,n.y,n.z,g.attributes.uv?.getX(j)??0,g.attributes.uv?.getY(j)??0].map(q).join(','));}});rows.sort();return {meshes,vertices:rows.length,digest:createHash('sha256').update(rows.join('\n')).digest('hex')};}
for(const dt of [0,.05,.1,.2]){a.system.tick(dt);b.system.tick(dt);const x=snapshot(a.scene),y=snapshot(b.scene);assert.equal(y.vertices,x.vertices,'All original triangles must remain');assert.equal(y.digest,x.digest,'World vertices/normals/UVs/materials must match through animated poses to 1mm');assert(y.meshes<x.meshes*.7,'Batching should remove redundant submissions');if(!dt)console.log(`Rickshaw mesh submissions: ${x.meshes} -> ${y.meshes}; same ${x.vertices/3} triangles.`);}
console.log('PASS: all eight original rickshaws retain geometry/materials, wheel rotation, moving legs and torso poses after static-detail batching.');
