import {Frustum,LessEqualDepth,Matrix4,Object3D,Vector2,Vector3} from './three.module.js';
import {createVoxelWallOcclusion} from './voxel-wall-occlusion.js';

const ROOF_LEVELS=[22,23,24,25,26,11,15];
const GRID_SIDE=96;

function project(bound,eye,near,far,offset,lower){
 const delta=bound-eye;
 return Math.floor(eye+offset*delta/((delta<0)===lower?near:far)+(lower?-.001:.001));
}

export function createMetroRoofOcclusion(roots,hasBottomFace,hasWallFace){
 const entries=[],hidden=[],faces=new Uint8Array(ROOF_LEVELS.length*GRID_SIDE**2);
 const walls=hasWallFace?['x','z'].flatMap(axis=>[1,-1].map(direction=>
  createVoxelWallOcclusion(hasWallFace,{axis,direction,width:64,depth:26}))):[];
 const eye=new Vector3(),nearMin=new Vector2(),nearMax=new Vector2();
 const frustum=new Frustum(),projection=new Matrix4();
 for(const root of roots)root?.traverse(mesh=>{
  if(!mesh.isMesh||mesh.isInstancedMesh||mesh.isSkinnedMesh||mesh.morphTargetInfluences||!mesh.material?.map)return;
  const geometry=mesh.geometry,positions=geometry.attributes.position,positionData=positions?.data??positions;
  if(!positionData)return;
  if(!geometry.boundingBox)geometry.computeBoundingBox();
  mesh.updateWorldMatrix(true,false);
  const matrix=mesh.matrixWorld.clone();
  entries.push({mesh,root,geometry,positions,positionData,version:positionData.version,matrix,bounds:geometry.boundingBox.clone().applyMatrix4(matrix)});
 });
 function restore(){
  for(const mesh of hidden)mesh.visible=true;
  hidden.length=0;
 }
 function prepare(camera){
  restore();
  if(!camera.isPerspectiveCamera)return;
  eye.setFromMatrixPosition(camera.matrixWorld);
  if(eye.y>=23)return;
  camera.getViewBounds(camera.near,nearMin,nearMax);
  const nearRadius=Math.hypot(camera.near,Math.max(Math.abs(nearMin.x),Math.abs(nearMax.x)),
   Math.max(Math.abs(nearMin.y),Math.abs(nearMax.y)));
  for(const wall of walls)wall.begin(eye,nearRadius+.001);
  frustum.setFromProjectionMatrix(projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  const x0=Math.floor(eye.x)-GRID_SIDE/2,z0=Math.floor(eye.z)-GRID_SIDE/2;
  faces.fill(0);
  for(const {mesh,root,geometry,positions,positionData,version,matrix,bounds} of entries){
   if(!root.visible||!mesh.visible||mesh.geometry!==geometry||positions!==geometry.attributes.position||
    positionData.version!==version||!mesh.frustumCulled||mesh.castShadow||
    mesh.onBeforeRender!==Object3D.prototype.onBeforeRender)continue;
   const material=mesh.material;
   if(!material?.map||!material.depthTest||material.depthFunc!==LessEqualDepth||material.polygonOffset||
    material.stencilWrite||material.isShaderMaterial)continue;
   if(!matrix.equals(mesh.matrixWorld))bounds.copy(geometry.boundingBox).applyMatrix4(matrix.copy(mesh.matrixWorld));
   if(bounds.min.y<25||!frustum.intersectsBox(bounds))continue;
   if(walls.some(wall=>wall.occludes(bounds))){mesh.visible=false;hidden.push(mesh);continue;}
   const near=bounds.min.y-eye.y,far=bounds.max.y-eye.y;
   // A covered rectangle proves that every ray to the world-space box
   // hits an existing, opaque underside first. Openings and missing chunks
   // fail the test, including partially covered targets at stair landings.
   for(let level=0;level<ROOF_LEVELS.length;level++){
    const y=ROOF_LEVELS[level],offset=y-eye.y;
    if(offset<=nearRadius||y>=bounds.min.y)continue;
    const left=project(bounds.min.x,eye.x,near,far,offset,true),right=project(bounds.max.x,eye.x,near,far,offset,false);
    const front=project(bounds.min.z,eye.z,near,far,offset,true),back=project(bounds.max.z,eye.z,near,far,offset,false);
    if(left<x0||right>=x0+GRID_SIDE||front<z0||back>=z0+GRID_SIDE)continue;
    let covered=true;
    for(let z=front;z<=back&&covered;z++)for(let x=left;x<=right;x++){
     const index=(level*GRID_SIDE+z-z0)*GRID_SIDE+x-x0;
     const face=faces[index]||(faces[index]=hasBottomFace(x,y,z)?2:1);
     if(face===1){covered=false;break;}
    }
    if(covered){mesh.visible=false;hidden.push(mesh);break;}
   }
  }
 }
 return {prepare,restore};
}
