import {Box3,Frustum,LessEqualDepth,Matrix4,Vector2,Vector3} from './three.module.js';

const MIN_WALL_DISTANCE=2;
const MIN_TARGET_DISTANCE=32;

function projectedCell(bound,eye,near,far,lower) {
 const scale=(bound<eye)===lower?near:far;
 // Include nearby cells to cover float32 transform and projection rounding.
 return Math.floor(eye+(bound-eye)*scale+(lower?-.001:.001));
}

// Test north-facing voxel wall faces that are actually present in the mesh.
// Every ray to the box crosses the wall if one complete projected rectangle
// is covered. Any gap, unloaded face, or oversized projection fails open.
export function createVoxelWallOcclusion(isFace) {
 const width=40,height=16,depth=18;
 const checked=new Uint8Array(width*height*depth);
 let origin,x0,y0,z0;
 function begin(cameraPosition) {
  origin=cameraPosition;
  x0=Math.floor(origin.x)-width/2;
  y0=Math.floor(origin.y)-height/2;
  z0=Math.ceil(origin.z+MIN_WALL_DISTANCE);
  checked.fill(0);
 }
 function occludes({min,max}) {
  if(min.z<z0)return false;
  for(let z=z0;z<z0+depth&&z<min.z;z++) {
   const near=(z-origin.z)/(min.z-origin.z),far=(z-origin.z)/(max.z-origin.z);
   const left=projectedCell(min.x,origin.x,near,far,true),right=projectedCell(max.x,origin.x,near,far,false);
   const bottom=projectedCell(min.y,origin.y,near,far,true),top=projectedCell(max.y,origin.y,near,far,false);
   if(left<x0||right>=x0+width||bottom<y0||top>=y0+height)break;
   let covered=true;
   for(let y=bottom;y<=top&&covered;y++)for(let x=left;x<=right;x++) {
    const i=((z-z0)*height+y-y0)*width+x-x0;
    const face=checked[i]||(checked[i]=isFace(x,y,z)?2:1);
    if(face===1){covered=false;break;}
   }
   if(covered)return true;
  }
  return false;
 }
 return {begin,occludes};
}
// Visibility belongs to this render only. Stock and light state stay on their
// current owners, and both the live camera and photo camera use the same proof.
export function createStaticWallCull(meshes,isFace) {
 const wall=createVoxelWallOcclusion(isFace),eye=new Vector3(),projection=new Matrix4(),frustum=new Frustum(),nearMin=new Vector2(),nearMax=new Vector2();
 const hidden=[],entries=meshes.map(mesh=>{
  const owner=mesh.isInstancedMesh?mesh:mesh.geometry;
  if(!owner.boundingBox)owner.computeBoundingBox();
  return {mesh,local:owner.boundingBox,world:new Box3(),matrix:null};
 });
 for(const entry of entries) {
  entry.mesh.updateWorldMatrix(true,false);
  entry.matrix=entry.mesh.matrixWorld.clone();
  entry.world.copy(entry.local).applyMatrix4(entry.matrix);
 }
 function restore() {
  for(const mesh of hidden)mesh.visible=true;
  hidden.length=0;
 }
 function prepare(camera) {
  restore();
  if(!camera.isPerspectiveCamera)return;
  eye.setFromMatrixPosition(camera.matrixWorld);
  if(eye.y<15||eye.y>53)return;
  camera.getViewBounds(camera.near,nearMin,nearMax);
  if(Math.hypot(Math.max(Math.abs(nearMin.x),Math.abs(nearMax.x)),Math.max(Math.abs(nearMin.y),Math.abs(nearMax.y)),camera.near)>=MIN_WALL_DISTANCE)return;
  frustum.setFromProjectionMatrix(projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  wall.begin(eye);
  for(const entry of entries) {
   const {mesh,matrix,local,world}=entry;
   if(!mesh.visible||!mesh.layers.test(camera.layers)||!mesh.material.depthTest||mesh.material.depthFunc!==LessEqualDepth)continue;
   if(!matrix.equals(mesh.matrixWorld))world.copy(local).applyMatrix4(matrix.copy(mesh.matrixWorld));
   if(world.min.z>=eye.z+MIN_TARGET_DISTANCE&&frustum.intersectsBox(world)&&wall.occludes(world)) {
    mesh.visible=false;hidden.push(mesh);
   }
  }
 }
 return {prepare,restore};
}
