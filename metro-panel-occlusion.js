import {FrontSide,Frustum,LessEqualDepth,Material,Matrix4,MeshBasicMaterial,NormalBlending,Object3D,Vector2,Vector3} from './three.module.js';
import {createVoxelWallOcclusion} from './voxel-wall-occlusion.js';

// Only a complete rectangle of rendered top faces can hide a panel. Check
// both street paving and the lower roofs of the station and transfer passage.
const SURFACES=[26,25,24,23,22],GRID_WIDTH=64;
const APERTURE_LEVELS=[26,23];

function project(bound,eye,near,far,offset,lower){
 const delta=bound-eye;
 const denominator=(delta<0)===lower?near:far;
 return Math.floor(eye+offset*delta/denominator+(lower?-.001:.001));
}

function fogCovers(bounds,camera,fogFar){
 const m=camera.matrixWorldInverse.elements;
 const nearestDepth=-(m[2]*(m[2]>0?bounds.max.x:bounds.min.x)+
  m[6]*(m[6]>0?bounds.max.y:bounds.min.y)+m[10]*(m[10]>0?bounds.max.z:bounds.min.z)+m[14]);
 return nearestDepth>fogFar+.05;
}

function usesOpaqueSignMaterial(material){
 return material.isMeshBasicMaterial&&material.fog&&material.side===FrontSide&&
  material.colorWrite&&material.depthWrite&&material.blending===NormalBlending&&!material.transparent&&material.opacity===1&&
  !material.alphaToCoverage&&!material.alphaMap&&!material.alphaTest&&!material.alphaHash&&
  !material.clippingPlanes?.length&&!material.wireframe&&!material.dithering&&
  material.onBeforeCompile===Material.prototype.onBeforeCompile&&
  material.customProgramCacheKey===Material.prototype.customProgramCacheKey;
}

export function createMetroPanelOcclusion(roots,hasTopFace,surfaceOpenings=[],hasWallFace,hasFloorOrCeilingFace){
 const panels=[],hidden=[],materials=[],faces=new Uint16Array(SURFACES.length*GRID_WIDTH**2);
 let faceStamp=0;
 const fogOnly=new MeshBasicMaterial();
 const walls=hasWallFace?['x','z'].flatMap(axis=>[1,-1].map(direction=>
  createVoxelWallOcclusion(hasWallFace,{axis,direction,width:64,depth:26}))):[];
 const floors=hasFloorOrCeilingFace?[1,-1].map(direction=>
  createVoxelWallOcclusion(hasFloorOrCeilingFace,{axis:'y',direction,width:48,height:48,depth:16})):[];
 const eye=new Vector3(),localEye=new Vector3(),nearMin=new Vector2(),nearMax=new Vector2();
 const frustum=new Frustum(),projection=new Matrix4(),inverse=new Matrix4();
 for(const root of roots)root.traverse(mesh=>{
  if(!mesh.isMesh||mesh.isInstancedMesh||!mesh.userData.panel||!mesh.material?.map)return;
  mesh.updateWorldMatrix(true,false);
  const geometry=mesh.geometry;
  if(!geometry.boundingBox)geometry.computeBoundingBox();
  const matrix=mesh.matrixWorld.clone(),bounds=geometry.boundingBox.clone().applyMatrix4(matrix);
  const plane=geometry.type==='PlaneGeometry'&&geometry.boundingBox.min.z===0&&geometry.boundingBox.max.z===0;
  let visOwner=null;
  for(let p=mesh.parent;p;p=p.parent){
   if(p.userData?.skipHiddenMatrices||p.name==='occluded-metro-interior'){visOwner=p;break;}
  }
  panels.push({mesh,geometry,matrix,bounds,plane,surface:bounds.max.y>=24,visOwner});
 });
 function restore(){
  for(const entry of materials){
   entry.mesh.material=entry.replacedMaterial;
   entry.replacedMaterial=null;
  }
  materials.length=0;
  for(const mesh of hidden)mesh.visible=true;
  hidden.length=0;
 }
 function useFogMaterial(entry,material){
  // The fog shader supplies every color channel. Keep the same opaque
  // depth and coverage while avoiding the otherwise unused texture bind.
  entry.replacedMaterial=material;
  materials.push(entry);
  entry.mesh.material=fogOnly;
 }
 function prepare(camera,fog){
  restore();
  if(!camera.isPerspectiveCamera)return;
  eye.setFromMatrixPosition(camera.matrixWorld);
  if(eye.y>45)return;
  camera.getViewBounds(camera.near,nearMin,nearMax);
  const nearRadius=Math.hypot(camera.near,Math.max(Math.abs(nearMin.x),Math.abs(nearMax.x)),Math.max(Math.abs(nearMin.y),Math.abs(nearMax.y)));
  frustum.setFromProjectionMatrix(projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  const undergroundWalls=eye.y<24&&camera.userData.probeMetroPanelWalls!==false;
  const undergroundFloors=eye.y<24&&camera.userData.probeMetroPanelFloors!==false;
  const undergroundFog=eye.y<24&&fog?.isFog&&camera.userData.probeMetroPanelFog!==false;
  const surfaceEnabled=camera.userData.probeSurfaceMetroPanels!==false;
  if(undergroundWalls)for(const wall of walls)wall.begin(eye,nearRadius+.001);
  if(undergroundFloors)for(const floor of floors)floor.begin(eye,nearRadius+.001);
  const baseX=Math.floor(eye.x)-GRID_WIDTH/2,baseZ=Math.floor(eye.z)-GRID_WIDTH/2;
  faceStamp+=2;
  if(faceStamp>=65534){faces.fill(0);faceStamp=2;}
  const camMask=camera.layers.mask;
  for(let pIdx=0;pIdx<panels.length;pIdx++){
   const entry=panels[pIdx],{mesh,geometry,matrix,bounds,plane,surface,visOwner}=entry;
   if(surface&&!surfaceEnabled)continue;
   if(visOwner&&!visOwner.visible)continue;
   if(!mesh.visible||mesh.geometry!==geometry||!mesh.frustumCulled||!(mesh.layers.mask&camMask))continue;
   const material=mesh.material;
   if(!material?.map||!material.depthTest||material.depthFunc!==LessEqualDepth||material.polygonOffset||
    material.stencilWrite||material.isShaderMaterial||mesh.castShadow||mesh.onBeforeRender!==Object3D.prototype.onBeforeRender)continue;
   let parent=mesh.parent;
   while(parent?.visible)parent=parent.parent;
   if(parent)continue;
   if((mesh.matrixAutoUpdate||mesh.matrixWorld.elements[12]!==matrix.elements[12]||mesh.matrixWorld.elements[13]!==matrix.elements[13]||mesh.matrixWorld.elements[14]!==matrix.elements[14])&&!matrix.equals(mesh.matrixWorld)){
    bounds.copy(geometry.boundingBox).applyMatrix4(matrix.copy(mesh.matrixWorld));
   }
   if(!surface&&bounds.max.y>=24)continue;
   // Three uses a bounding sphere for its mesh cull and still initializes
   // textures for back-facing triangles. The tighter box and original plane
   // can reject these draws before any resource is submitted.
   if(!frustum.intersectsBox(bounds)||plane&&material.side===FrontSide&&
    localEye.copy(eye).applyMatrix4(inverse.copy(matrix).invert()).z<-.001){
    mesh.visible=false;hidden.push(mesh);continue;
   }
   if(surface){
    if(fog?.isFog&&fogCovers(bounds,camera,fog.far)&&usesOpaqueSignMaterial(material))useFogMaterial(entry,material);
    continue;
   }
   if(eye.y<24){
    if(undergroundWalls&&walls.some(wall=>wall.occludes(bounds))||
     undergroundFloors&&floors.some(floor=>floor.occludes(bounds))){
     mesh.visible=false;hidden.push(mesh);
    }else if(undergroundFog&&fogCovers(bounds,camera,fog.far)&&usesOpaqueSignMaterial(material)){
     useFogMaterial(entry,material);
    }
    continue;
   }
   const near=eye.y-bounds.max.y,far=eye.y-bounds.min.y;
   // A street view of a sealed room must pass through the paving and the
   // roof. Test both levels against every entrance, including connected lines.
   let sealed=false;
   if(surfaceOpenings.length)for(const y of APERTURE_LEVELS){
    const offset=eye.y-y;
    if(y<=bounds.max.y||offset<=nearRadius)continue;
    const left=project(bounds.min.x,eye.x,near,far,offset,true),right=project(bounds.max.x,eye.x,near,far,offset,false)+1;
    const front=project(bounds.min.z,eye.z,near,far,offset,true),back=project(bounds.max.z,eye.z,near,far,offset,false)+1;
    if(!surfaceOpenings.some(opening=>right>=opening.minX&&left<=opening.maxX&&back>=opening.minZ&&front<=opening.maxZ)){
     sealed=true;break;
    }
   }
   if(sealed){mesh.visible=false;hidden.push(mesh);continue;}
   for(const [index,y] of SURFACES.entries()){
    const offset=eye.y-y;
    if(y<=bounds.max.y||offset<=nearRadius)continue;
    const left=project(bounds.min.x,eye.x,near,far,offset,true),right=project(bounds.max.x,eye.x,near,far,offset,false);
    const front=project(bounds.min.z,eye.z,near,far,offset,true),back=project(bounds.max.z,eye.z,near,far,offset,false);
    if(left<baseX||right>=baseX+GRID_WIDTH||front<baseZ||back>=baseZ+GRID_WIDTH)continue;
    let covered=true;
    for(let z=front;z<=back&&covered;z++)for(let x=left;x<=right;x++){
     const cell=(index*GRID_WIDTH+z-baseZ)*GRID_WIDTH+x-baseX;
     let face=faces[cell];
     if(face<faceStamp||face>faceStamp+1){face=hasTopFace(x,y-1,z)?faceStamp+1:faceStamp;faces[cell]=face;}
     if(face===faceStamp){covered=false;break;}
    }
    if(covered){mesh.visible=false;hidden.push(mesh);break;}
   }
  }
 }
 return {prepare,restore};
}
