import * as THREE from './three.module.js';
import {supportedTransform} from './scene-instancing.js';

function instanceStaticParts(parent,group,name,inverse,paletteMaterial,result){
 const byGeometry=new Map(),instanced=new Set(),matrix=new THREE.Matrix4();
 for(const mesh of group.sources){
  const geometry=mesh.geometry,material=mesh.material;
  // Box normals follow the local axes. Flat-shaded faces calculate normals
  // from screen derivatives. Both retain their lighting under instance scale.
  const supportedShape=group.useColor?geometry.type==='BoxGeometry':material.flatShading;
  if(!supportedShape||mesh.isSkinnedMesh||mesh.children.length||!mesh.frustumCulled||mesh.userData.panel||
     mesh.layers.mask!==1||mesh.renderOrder||mesh.castShadow||mesh.receiveShadow||
     material.transparent||material.opacity!==1||material.clippingPlanes||
     material.vertexColors||geometry.attributes.color||geometry.morphAttributes.position)continue;
  matrix.multiplyMatrices(inverse,mesh.matrixWorld);
  if(!supportedTransform(matrix)||matrix.determinant()===0)continue;
  let entries=byGeometry.get(geometry);
  if(!entries){entries=[];byGeometry.set(geometry,entries);}
  entries.push(mesh);
 }
 for(const [geometry,entries] of byGeometry){
  if(entries.length<12)continue;
  const mesh=new THREE.InstancedMesh(geometry,group.useColor?paletteMaterial:group.material,entries.length);
  mesh.name=name;mesh.visible=group.visible;mesh.matrixAutoUpdate=false;
  mesh.userData.panel=!!group.material.map;
  mesh.userData.rgbColors=group.useColor;
  mesh.userData.range=Math.max(...entries.map(source=>source.userData.range??180));
  for(let i=0;i<entries.length;i++){
   const source=entries[i];
   mesh.setMatrixAt(i,matrix.multiplyMatrices(inverse,source.matrixWorld));
   if(group.useColor)mesh.setColorAt(i,source.material.color);
   source.removeFromParent();instanced.add(source);
  }
  mesh.computeBoundingSphere();parent.add(mesh);result.push(mesh);
 }
 return instanced.size?group.sources.filter(mesh=>!instanced.has(mesh)):group.sources;
}

// Merge only explicitly selected static meshes; callers retain animated controls.
export function batchMeshes(parent,meshes,name='static-detail',coloredLambert=null,packStatic=false,cellSize=24){
 parent.updateWorldMatrix(true,true);
 const inverse=parent.matrixWorld.clone().invert(),groups=new Map(),p=new THREE.Vector3(),n=new THREE.Vector3(),matrix=new THREE.Matrix4(),normalMatrix=new THREE.Matrix3();
 const coloredMaterials=new Map(),instPaletteMaterials=new Map();
 for(const mesh of meshes){if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material))continue;const g=mesh.geometry,a=g.attributes.position;if(!a)continue;
  const mat=mesh.material;
  const isPaletteBasic=mat.isMeshBasicMaterial&&(!mat.emissive||mat.emissive.getHex?.()===0);
  const isPaletteLambert=mat.isMeshLambertMaterial&&(!mat.emissive||mat.emissive.getHex?.()===0);
  const useColor=coloredLambert?.has(mat)&&(isPaletteLambert||isPaletteBasic)&&!mat.map&&!mat.vertexColors&&!g.attributes.color&&!mesh.userData.panel&&mesh.renderOrder===0&&mesh.layers.mask===1&&!mesh.castShadow&&!mesh.receiveShadow&&!mat.transparent&&mat.opacity===1&&!mat.clippingPlanes?.length;
  let key=mat.uuid+':'+mesh.visible,material=mat,instMat=null;
  if(useColor){
   const bKey=`${isPaletteBasic?'b':'l'}:${mat.side}:${mat.polygonOffset?1:0}:${mat.polygonOffsetFactor}:${mat.polygonOffsetUnits}:${mat.fog?1:0}`;
   material=coloredMaterials.get(bKey);
   if(!material){
    const Ctor=isPaletteBasic?THREE.MeshBasicMaterial:THREE.MeshLambertMaterial;
    material=new Ctor({vertexColors:true,side:mat.side,polygonOffset:mat.polygonOffset,polygonOffsetFactor:mat.polygonOffsetFactor,polygonOffsetUnits:mat.polygonOffsetUnits,fog:mat.fog});
    coloredMaterials.set(bKey,material);
   }
   if(packStatic){
    instMat=instPaletteMaterials.get(bKey);
    if(!instMat){
     const Ctor=isPaletteBasic?THREE.MeshBasicMaterial:THREE.MeshLambertMaterial;
     instMat=new Ctor({side:mat.side,polygonOffset:mat.polygonOffset,polygonOffsetFactor:mat.polygonOffsetFactor,polygonOffsetUnits:mat.polygonOffsetUnits,fog:mat.fog});
     instPaletteMaterials.set(bKey,instMat);
    }
   }
   if(!g.boundingSphere)g.computeBoundingSphere();
   p.copy(g.boundingSphere.center).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);
   key='colored:'+bKey+':'+Math.floor(p.x/cellSize)+':'+Math.floor(p.z/cellSize)+':'+(mesh.userData.range??180)+':'+mesh.visible;
  }
  let group=groups.get(key);if(!group){group={material,instMaterial:instMat,visible:mesh.visible,sources:[],useColor};groups.set(key,group);}group.sources.push(mesh);
 }
 const result=[];for(const group of groups.values()){
  const sources=packStatic?instanceStaticParts(parent,group,name,inverse,group.instMaterial,result):group.sources;
  if(sources.length===0)continue;
  if(sources.length===1){result.push(sources[0]);continue;}
  let vertices=0,indexCount=0;
  for(const source of sources){const count=source.geometry.attributes.position.count;vertices+=count;indexCount+=source.geometry.index?.count??count;}
  // Solid palette groups have no texture or other UV inputs.
  const stride=group.useColor?9:11,shared=packStatic?new Float32Array(vertices*stride):null;
  const position=shared??new Float32Array(vertices*3),normal=shared??new Float32Array(vertices*3),color=shared??new Float32Array(vertices*3);
  const uv=shared&&group.useColor?null:shared??new Float32Array(vertices*2);
  const indices=vertices>65535?new Uint32Array(indexCount):new Uint16Array(indexCount);
  let offset=0,index=0,range=-Infinity;
  for(const mesh of sources){const g=mesh.geometry,a=g.attributes.position;matrix.multiplyMatrices(inverse,mesh.matrixWorld);normalMatrix.getNormalMatrix(matrix);
   for(let i=0;i<a.count;i++){
    const vertex=offset+i,v=vertex*(shared?stride:3),normalAt=shared?v+3:v,colorAt=shared?v+6:v;
    p.fromBufferAttribute(a,i).applyMatrix4(matrix);position[v]=p.x;position[v+1]=p.y;position[v+2]=p.z;
    g.attributes.normal?n.fromBufferAttribute(g.attributes.normal,i):n.set(0,1,0);n.applyMatrix3(normalMatrix).normalize();normal[normalAt]=n.x;normal[normalAt+1]=n.y;normal[normalAt+2]=n.z;
    if(uv){const u=shared?v+9:vertex*2;uv[u]=g.attributes.uv?.getX(i)??0;uv[u+1]=g.attributes.uv?.getY(i)??0;}
    if(group.useColor){const tint=mesh.material.color;color[colorAt]=tint.r;color[colorAt+1]=tint.g;color[colorAt+2]=tint.b;}
    else{color[colorAt]=g.attributes.color?.getX(i)??1;color[colorAt+1]=g.attributes.color?.getY(i)??1;color[colorAt+2]=g.attributes.color?.getZ(i)??1;}
   }
   for(let i=0;i<(g.index?.count??a.count);i++)indices[index++]=offset+(g.index?g.index.getX(i):i);offset+=a.count;range=Math.max(range,mesh.userData.range??180);
  }
  const g=new THREE.BufferGeometry();
  if(shared){
   const buffer=new THREE.InterleavedBuffer(shared,stride);
   g.setAttribute('position',new THREE.InterleavedBufferAttribute(buffer,3,0));
   g.setAttribute('normal',new THREE.InterleavedBufferAttribute(buffer,3,3));
   g.setAttribute('color',new THREE.InterleavedBufferAttribute(buffer,3,6));
   if(uv)g.setAttribute('uv',new THREE.InterleavedBufferAttribute(buffer,2,9));
  }else{
   g.setAttribute('position',new THREE.BufferAttribute(position,3));
   g.setAttribute('normal',new THREE.BufferAttribute(normal,3));
   g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
   g.setAttribute('color',new THREE.BufferAttribute(color,3));
  }
  g.setIndex(new THREE.BufferAttribute(indices,1));g.computeBoundingSphere();const mesh=new THREE.Mesh(g,group.material);mesh.name=name;mesh.visible=group.visible;mesh.userData.range=range;mesh.userData.panel=!!group.material.map;parent.add(mesh);for(const source of sources)source.removeFromParent();result.push(mesh);
  // The generated batch owns an identity local transform; source transforms
  // are already baked into its vertices. Its parent can still move normally.
  mesh.matrixAutoUpdate=false;
  if(group.useColor)mesh.userData.rgbColors=true;
 }return result;
}
export function batchStockSeries(parent,groups,name,coloredPalette){
 if(!groups?.length)return null;
 parent.updateWorldMatrix(true,true);
 const inverse=parent.matrixWorld.clone().invert(),p=new THREE.Vector3(),n=new THREE.Vector3(),matrix=new THREE.Matrix4(),normalMatrix=new THREE.Matrix3();
 const perGroup=[],indexEnds=[0];
 let vertices=0,indexCount=0,range=-Infinity;
 for(const group of groups){
  const list=[];
  for(const mesh of staticMeshes(group)){
   const g=mesh.geometry,a=g?.attributes.position,mat=mesh.material;
   if(!a||!coloredPalette?.has(mat)||!mat.isMeshLambertMaterial||mat.map||mat.vertexColors||g.attributes.color||mesh.userData.panel||mesh.renderOrder!==0||mesh.layers.mask!==1||mesh.castShadow||mesh.receiveShadow||mat.transparent||mat.opacity!==1||mat.clippingPlanes?.length)continue;
   list.push(mesh);
   vertices+=a.count;
   indexCount+=g.index?.count??a.count;
   range=Math.max(range,mesh.userData.range??180);
  }
  perGroup.push(list);
  indexEnds.push(indexCount);
 }
 if(!vertices)return null;
 const stride=9,shared=new Float32Array(vertices*stride);
 const indices=vertices>65535?new Uint32Array(indexCount):new Uint16Array(indexCount);
 let offset=0,index=0;
 for(const list of perGroup){
  for(const mesh of list){
   const g=mesh.geometry,a=g.attributes.position,tint=mesh.material.color;
   matrix.multiplyMatrices(inverse,mesh.matrixWorld);normalMatrix.getNormalMatrix(matrix);
   for(let i=0;i<a.count;i++){
    const v=(offset+i)*stride;
    p.fromBufferAttribute(a,i).applyMatrix4(matrix);shared[v]=p.x;shared[v+1]=p.y;shared[v+2]=p.z;
    g.attributes.normal?n.fromBufferAttribute(g.attributes.normal,i):n.set(0,1,0);n.applyMatrix3(normalMatrix).normalize();shared[v+3]=n.x;shared[v+4]=n.y;shared[v+5]=n.z;
    shared[v+6]=tint.r;shared[v+7]=tint.g;shared[v+8]=tint.b;
   }
   for(let i=0;i<(g.index?.count??a.count);i++)indices[index++]=offset+(g.index?g.index.getX(i):i);
   offset+=a.count;
   mesh.removeFromParent();
  }
 }
 for(const group of groups){group.matrixAutoUpdate=false;}
 const g=new THREE.BufferGeometry();
 const buffer=new THREE.InterleavedBuffer(shared,stride);
 g.setAttribute('position',new THREE.InterleavedBufferAttribute(buffer,3,0));
 g.setAttribute('normal',new THREE.InterleavedBufferAttribute(buffer,3,3));
 g.setAttribute('color',new THREE.InterleavedBufferAttribute(buffer,3,6));
 g.setIndex(new THREE.BufferAttribute(indices,1));
 g.computeBoundingSphere();
 const mesh=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));
 mesh.name=name;mesh.matrixAutoUpdate=false;mesh.userData.range=range;mesh.userData.rgbColors=true;
 parent.add(mesh);
 const setCount=k=>{const c=Math.max(0,Math.min(groups.length,k));const end=indexEnds[c];g.setDrawRange(0,end);mesh.visible=end>0;};
 setCount(groups.length);
 return {mesh,setCount};
}
export function staticMeshes(root,excluded=new Set()){
 const result=[];function visit(o){if(excluded.has(o))return;if(o.isMesh&&!o.isInstancedMesh)result.push(o);for(const c of o.children)visit(c);}visit(root);return result;
}
