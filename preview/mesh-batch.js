import * as THREE from './three.module.js';

// Merge only explicitly selected static meshes; callers retain animated controls.
export function batchMeshes(parent,meshes,name='static-detail'){
 parent.updateWorldMatrix(true,true);
 const inverse=parent.matrixWorld.clone().invert(),groups=new Map(),p=new THREE.Vector3(),n=new THREE.Vector3(),matrix=new THREE.Matrix4(),normalMatrix=new THREE.Matrix3();
 for(const mesh of meshes){if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material))continue;const g=mesh.geometry,a=g.attributes.position;if(!a)continue;
  const key=mesh.material.uuid+':'+mesh.visible;let group=groups.get(key);if(!group){group={material:mesh.material,visible:mesh.visible,vertices:0,indices:0,sources:[]};groups.set(key,group);}group.vertices+=a.count;group.indices+=g.index?.count??a.count;group.sources.push(mesh);
 }
 const result=[];for(const group of groups.values()){
  if(group.sources.length===1){result.push(group.sources[0]);continue;}
  const position=new Float32Array(group.vertices*3),normal=new Float32Array(group.vertices*3),uv=new Float32Array(group.vertices*2),color=new Float32Array(group.vertices*3),indices=group.vertices>65535?new Uint32Array(group.indices):new Uint16Array(group.indices);
  let offset=0,index=0,range=-Infinity;
  for(const mesh of group.sources){const g=mesh.geometry,a=g.attributes.position;matrix.multiplyMatrices(inverse,mesh.matrixWorld);normalMatrix.getNormalMatrix(matrix);
   for(let i=0;i<a.count;i++){const v=(offset+i)*3,u=(offset+i)*2;p.fromBufferAttribute(a,i).applyMatrix4(matrix);position[v]=p.x;position[v+1]=p.y;position[v+2]=p.z;g.attributes.normal?n.fromBufferAttribute(g.attributes.normal,i):n.set(0,1,0);n.applyMatrix3(normalMatrix).normalize();normal[v]=n.x;normal[v+1]=n.y;normal[v+2]=n.z;uv[u]=g.attributes.uv?.getX(i)??0;uv[u+1]=g.attributes.uv?.getY(i)??0;color[v]=g.attributes.color?.getX(i)??1;color[v+1]=g.attributes.color?.getY(i)??1;color[v+2]=g.attributes.color?.getZ(i)??1;}
   for(let i=0;i<(g.index?.count??a.count);i++)indices[index++]=offset+(g.index?g.index.getX(i):i);offset+=a.count;range=Math.max(range,mesh.userData.range??180);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(position,3));g.setAttribute('normal',new THREE.BufferAttribute(normal,3));g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.setAttribute('color',new THREE.BufferAttribute(color,3));g.setIndex(new THREE.BufferAttribute(indices,1));g.computeBoundingSphere();const mesh=new THREE.Mesh(g,group.material);mesh.name=name;mesh.visible=group.visible;mesh.userData.range=range;mesh.userData.panel=!!group.material.map;parent.add(mesh);for(const source of group.sources)source.removeFromParent();result.push(mesh);
  // The generated batch owns an identity local transform; source transforms
  // are already baked into its vertices. Its parent can still move normally.
  mesh.matrixAutoUpdate=false;
 }return result;
}
export function staticMeshes(root,excluded=new Set()){
 const result=[];function visit(o){if(excluded.has(o))return;if(o.isMesh&&!o.isInstancedMesh)result.push(o);for(const c of o.children)visit(c);}visit(root);return result;
}
