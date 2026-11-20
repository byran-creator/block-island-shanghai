import {Box3,Frustum,LessEqualDepth,Material,Matrix4,Object3D,Vector2,Vector3} from './three.module.js';

const MIN_WALL_DISTANCE=2;
const MIN_TARGET_DISTANCE=32;

function projectedSlope(bound,eye,near,far,lower) {
 const delta=bound-eye;
 return delta/((delta<0)===lower?near:far);
}

// Test voxel wall faces that are actually present in the mesh.
// Every ray to the box crosses the wall if one complete projected rectangle
// is covered. Any gap, unloaded face, or oversized projection fails open.
export function createVoxelWallOcclusion(isFace,{axis='z',width=40,height=16,depth=18,direction=1}={}) {
 const horizontalAxis=axis==='x'?'z':'x',verticalAxis=axis==='y'?'z':'y';
 function readFace(u,y,d){
  const cell=direction===1?d:-d-1,neighbor=cell-direction;
  if(axis==='y')return isFace(u,cell,y,u,neighbor,y);
  return axis==='z'?isFace(u,y,cell,u,neighbor):isFace(cell,y,u,neighbor,u);
 }
 const checked=new Uint8Array(width*height*depth);
 let eyeU,eyeY,eyeD,u0,y0,d0;
 function begin(cameraPosition,nearDistance=MIN_WALL_DISTANCE) {
  eyeU=cameraPosition[horizontalAxis];eyeY=cameraPosition[verticalAxis];eyeD=direction*cameraPosition[axis];
  u0=Math.floor(eyeU)-width/2;y0=Math.floor(eyeY)-height/2;
  d0=Math.ceil(eyeD+nearDistance);
  checked.fill(0);
 }
 function occludes({min,max}) {
  const closest=direction===1?min[axis]:-max[axis],furthest=direction===1?max[axis]:-min[axis];
  const near=closest-eyeD,far=furthest-eyeD;
  if(closest<d0)return false;
  const loU=projectedSlope(min[horizontalAxis],eyeU,near,far,true);
  const hiU=projectedSlope(max[horizontalAxis],eyeU,near,far,false);
  const loY=projectedSlope(min[verticalAxis],eyeY,near,far,true),hiY=projectedSlope(max[verticalAxis],eyeY,near,far,false);
  for(let d=d0;d<d0+depth&&d<closest;d++) {
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
 let westWall=null;
 const eye=new Vector3(),projection=new Matrix4(),frustum=new Frustum(),nearMin=new Vector2(),nearMax=new Vector2();
 const hidden=[],inverse=new Matrix4(),frustumBounds=new Box3(),entries=meshes.map(mesh=>{
  mesh.updateWorldMatrix(true,false);
  const matrix=mesh.matrixWorld.clone(),owner=mesh.isInstancedMesh?mesh:mesh.geometry;
  if(owner&&!owner.boundingBox)owner.computeBoundingBox();
  const local=owner?.boundingBox??new Box3().setFromObject(mesh).applyMatrix4(inverse.copy(matrix).invert());
  const geometry=mesh.geometry,position=geometry?.attributes.position,data=position?.data??position;
  return {mesh,local,world:local.clone().applyMatrix4(matrix),matrix,geometry,position,data,
   positionVersion:data?.version,instanceVersion:mesh.instanceMatrix?.version};
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
  const expanded=camera.userData.probeYuyuanExpandedCull===true;
  southWall.begin(eye);eastWall.begin(eye);
  if(expanded){
   westWall??=createVoxelWallOcclusion(isFace,{axis:'x',direction:-1,width:64,depth:42});
   westWall.begin(eye);
  }
  for(const entry of entries) {
   const {mesh,matrix,local,world}=entry;
   if(!mesh.visible)continue;
   const material=mesh.material;
   if(material&&(!mesh.layers.test(camera.layers)||!material.depthTest||material.depthFunc!==LessEqualDepth||
    material.polygonOffset||material.stencilWrite||material.isShaderMaterial||mesh.castShadow||
    mesh.onBeforeRender!==Object3D.prototype.onBeforeRender))continue;
   if(entry.geometry&&(mesh.geometry!==entry.geometry||entry.geometry.attributes.position!==entry.position||
    entry.data?.version!==entry.positionVersion||mesh.instanceMatrix?.version!==entry.instanceVersion||
    mesh.isSkinnedMesh||mesh.morphTargetInfluences||material?.displacementMap))continue;
   if(!matrix.equals(mesh.matrixWorld))world.copy(local).applyMatrix4(matrix.copy(mesh.matrixWorld));
   const canTighten=expanded&&mesh.isMesh&&mesh.frustumCulled&&
    material?.onBeforeCompile===Material.prototype.onBeforeCompile;
   const canUseSouth=world.min.z>=eye.z+MIN_TARGET_DISTANCE,canUseEast=world.min.x>=eye.x+MIN_TARGET_DISTANCE;
   if(!canTighten&&!canUseSouth&&!canUseEast)continue;
   const inView=frustum.intersectsBox(world);
   if(canTighten&&!inView){
    // Leave a wider guard band than the rounding of the baked GPU positions.
    const completelyOutside=!frustum.intersectsBox(frustumBounds.copy(world).expandByScalar(.01));
    if(completelyOutside){mesh.visible=false;hidden.push(mesh);}
    continue;
   }
   const canUseWest=canTighten&&world.max.x<=eye.x-MIN_TARGET_DISTANCE;
   if(inView&&(canUseSouth&&southWall.occludes(world)||canUseEast&&eastWall.occludes(world)||canUseWest&&westWall.occludes(world))) {
    mesh.visible=false;hidden.push(mesh);
   }
  }
 }
 return {prepare,restore};
}
