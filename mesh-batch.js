import * as THREE from './three.module.js';

// Merge only explicitly selected static meshes; callers retain animated controls.
export function batchMeshes(parent,meshes,name='static-detail'){
 parent.updateWorldMatrix(true,true);
 const inverse=parent.matrixWorld.clone().invert(),groups=new Map(),p=new THREE.Vector3(),n=new THREE.Vector3();
 for(const mesh of meshes){if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material))continue;const g=mesh.geometry,a=g.attributes.position;if(!a)continue;
  const key=mesh.material.uuid+':'+mesh.visible;let group=groups.get(key);if(!group){group={material:mesh.material,visible:mesh.visible,position:[],normal:[],uv:[],color:[],indices:[],sources:[]};groups.set(key,group);}
  const matrix=new THREE.Matrix4().multiplyMatrices(inverse,mesh.matrixWorld),normal=new THREE.Matrix3().getNormalMatrix(matrix),offset=group.position.length/3;
  for(let i=0;i<a.count;i++){p.fromBufferAttribute(a,i).applyMatrix4(matrix);group.position.push(p.x,p.y,p.z);g.attributes.normal?n.fromBufferAttribute(g.attributes.normal,i):n.set(0,1,0);n.applyMatrix3(normal).normalize();group.normal.push(n.x,n.y,n.z);group.uv.push(g.attributes.uv?.getX(i)??0,g.attributes.uv?.getY(i)??0);group.color.push(g.attributes.color?.getX(i)??1,g.attributes.color?.getY(i)??1,g.attributes.color?.getZ(i)??1);}
  for(let i=0;i<(g.index?.count??a.count);i++)group.indices.push(offset+(g.index?g.index.getX(i):i));group.sources.push(mesh);
 }
 const result=[];for(const group of groups.values()){if(group.sources.length===1){result.push(group.sources[0]);continue;}const g=new THREE.BufferGeometry();for(const [key,size]of [['position',3],['normal',3],['uv',2],['color',3]])g.setAttribute(key,new THREE.Float32BufferAttribute(group[key],size));g.setIndex(group.indices);g.computeBoundingSphere();const mesh=new THREE.Mesh(g,group.material);mesh.name=name;mesh.visible=group.visible;mesh.userData.range=Math.max(...group.sources.map(m=>m.userData.range??180));mesh.userData.panel=!!group.material.map;parent.add(mesh);for(const m of group.sources)m.removeFromParent();result.push(mesh);}return result;
}
export function staticMeshes(root,excluded=new Set()){
 const result=[];function visit(o){if(excluded.has(o))return;if(o.isMesh&&!o.isInstancedMesh)result.push(o);for(const c of o.children)visit(c);}visit(root);return result;
}
