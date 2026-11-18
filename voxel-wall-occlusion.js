import {Box3,Frustum,LessEqualDepth,Matrix4,Object3D,Vector2,Vector3} from './three.module.js';

const MIN_WALL_DISTANCE=2;
const MIN_TARGET_DISTANCE=32;

function projectedSlope(bound,eye,near,far,lower) {
 const delta=bound-eye;
 return delta/((delta<0)===lower?near:far);
}

// Test voxel wall faces that are actually present in the mesh.
// Every ray to the box crosses the wall if one complete projected rectangle
// is covered. Any gap, unloaded face, or oversized projection fails open.
export function createVoxelWallOcclusion(isFace,{axis='z',width=40,depth=18}={}) {
 const horizontalAxis=axis==='z'?'x':'z',height=16;
 const readFace=axis==='z'?(u,y,d)=>isFace(u,y,d,u,d-1):(u,y,d)=>isFace(d,y,u,d-1,u);
 const checked=new Uint8Array(width*height*depth);
 let eyeU,eyeY,eyeD,u0,y0,d0;
 function begin(cameraPosition) {
  eyeU=cameraPosition[horizontalAxis];eyeY=cameraPosition.y;eyeD=cameraPosition[axis];
  u0=Math.floor(eyeU)-width/2;y0=Math.floor(eyeY)-height/2;
  d0=Math.ceil(eyeD+MIN_WALL_DISTANCE);
  checked.fill(0);
 }
 function occludes({min,max}) {
  const near=min[axis]-eyeD,far=max[axis]-eyeD;
  if(min[axis]<d0)return false;
  const loU=projectedSlope(min[horizontalAxis],eyeU,near,far,true);
  const hiU=projectedSlope(max[horizontalAxis],eyeU,near,far,false);
  const loY=projectedSlope(min.y,eyeY,near,far,true),hiY=projectedSlope(max.y,eyeY,near,far,false);
  for(let d=d0;d<d0+depth&&d<min[axis];d++) {
   const offset=d-eyeD;
   // Include nearby cells to cover float32 transform and projection rounding.
   const left=Math.floor(eyeU+loU*offset-.001),right=Math.floor(eyeU+hiU*offset+.001);
   const bottom=Math.floor(eyeY+loY*offset-.001),top=Math.floor(eyeY+hiY*offset+.001);
   if(left<u0||right>=u0+width||bottom<y0||top>=y0+height)break;
   let covered=true;
   for(let y=bottom;y<=top&&covered;y++)for(let u=left;u<=right;u++) {
    const i=((d-d0)*height+y-y0)*width+u-u0;
    const face=checked[i]||(checked[i]=readFace(u,y,d)?2:1);
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
 const southWall=createVoxelWallOcclusion(isFace,{width:64,depth:42});
 const eastWall=createVoxelWallOcclusion(isFace,{axis:'x'});
 const eye=new Vector3(),projection=new Matrix4(),frustum=new Frustum(),nearMin=new Vector2(),nearMax=new Vector2();
 const hidden=[],inverse=new Matrix4(),entries=meshes.map(mesh=>{
  mesh.updateWorldMatrix(true,false);
  const matrix=mesh.matrixWorld.clone(),owner=mesh.isInstancedMesh?mesh:mesh.geometry;
  if(owner&&!owner.boundingBox)owner.computeBoundingBox();
  const local=owner?.boundingBox??new Box3().setFromObject(mesh).applyMatrix4(inverse.copy(matrix).invert());
  return {mesh,local,world:local.clone().applyMatrix4(matrix),matrix};
 });
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
  southWall.begin(eye);eastWall.begin(eye);
  for(const entry of entries) {
   const {mesh,matrix,local,world}=entry;
   if(!mesh.visible)continue;
   const material=mesh.material;
   if(material&&(!mesh.layers.test(camera.layers)||!material.depthTest||material.depthFunc!==LessEqualDepth||
    material.polygonOffset||material.stencilWrite||material.isShaderMaterial||mesh.castShadow||
    mesh.onBeforeRender!==Object3D.prototype.onBeforeRender))continue;
   if(!matrix.equals(mesh.matrixWorld))world.copy(local).applyMatrix4(matrix.copy(mesh.matrixWorld));
   const canUseSouth=world.min.z>=eye.z+MIN_TARGET_DISTANCE,canUseEast=world.min.x>=eye.x+MIN_TARGET_DISTANCE;
   if((canUseSouth||canUseEast)&&frustum.intersectsBox(world)&&
    (canUseSouth&&southWall.occludes(world)||canUseEast&&eastWall.occludes(world))) {
    mesh.visible=false;hidden.push(mesh);
   }
  }
 }
 return {prepare,restore};
}
