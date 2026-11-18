import {FrontSide,Frustum,LessEqualDepth,Matrix4,Object3D,Vector2,Vector3} from './three.module.js';

// Only a complete rectangle of rendered top faces can hide a panel. Check
// both street paving and the lower roofs of the station and transfer passage.
const SURFACES=[26,25,24,23,22],GRID_WIDTH=64;
const APERTURE_LEVELS=[26,23];

function project(bound,eye,near,far,offset,lower){
 const delta=bound-eye;
 const denominator=(delta<0)===lower?near:far;
 return Math.floor(eye+offset*delta/denominator+(lower?-.001:.001));
}

export function createMetroPanelOcclusion(roots,hasTopFace,surfaceOpenings=[]){
 const panels=[],hidden=[],faces=new Uint8Array(SURFACES.length*GRID_WIDTH**2);
 const eye=new Vector3(),localEye=new Vector3(),nearMin=new Vector2(),nearMax=new Vector2();
 const frustum=new Frustum(),projection=new Matrix4(),inverse=new Matrix4();
 for(const root of roots)root.traverse(mesh=>{
  if(!mesh.isMesh||mesh.isInstancedMesh||!mesh.userData.panel||!mesh.material?.map)return;
  mesh.updateWorldMatrix(true,false);
  const geometry=mesh.geometry;
  if(!geometry.boundingBox)geometry.computeBoundingBox();
  const matrix=mesh.matrixWorld.clone(),bounds=geometry.boundingBox.clone().applyMatrix4(matrix);
  const plane=geometry.type==='PlaneGeometry'&&geometry.boundingBox.min.z===0&&geometry.boundingBox.max.z===0;
  if(bounds.max.y<24)panels.push({mesh,geometry,matrix,bounds,plane});
 });
 function restore(){
  for(const mesh of hidden)mesh.visible=true;
  hidden.length=0;
 }
 function prepare(camera){
  restore();
  if(!camera.isPerspectiveCamera)return;
  eye.setFromMatrixPosition(camera.matrixWorld);
  if(eye.y>45)return;
  camera.getViewBounds(camera.near,nearMin,nearMax);
  const nearRadius=Math.hypot(camera.near,Math.max(Math.abs(nearMin.x),Math.abs(nearMax.x)),Math.max(Math.abs(nearMin.y),Math.abs(nearMax.y)));
  frustum.setFromProjectionMatrix(projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  const baseX=Math.floor(eye.x)-GRID_WIDTH/2,baseZ=Math.floor(eye.z)-GRID_WIDTH/2;
  faces.fill(0);
  for(const {mesh,geometry,matrix,bounds,plane} of panels){
   if(!mesh.visible||mesh.geometry!==geometry||!mesh.frustumCulled||!mesh.layers.test(camera.layers))continue;
   const material=mesh.material;
   if(!material?.map||!material.depthTest||material.depthFunc!==LessEqualDepth||material.polygonOffset||
    material.stencilWrite||material.isShaderMaterial||mesh.castShadow||mesh.onBeforeRender!==Object3D.prototype.onBeforeRender)continue;
   let parent=mesh.parent;
   while(parent?.visible)parent=parent.parent;
   if(parent)continue;
   if(!matrix.equals(mesh.matrixWorld))bounds.copy(geometry.boundingBox).applyMatrix4(matrix.copy(mesh.matrixWorld));
   if(bounds.max.y>=24)continue;
   // Three uses a bounding sphere for its mesh cull and still initializes
   // textures for back-facing triangles. The tighter box and original plane
   // can reject these draws before any resource is submitted.
   if(!frustum.intersectsBox(bounds)||plane&&material.side===FrontSide&&
    localEye.copy(eye).applyMatrix4(inverse.copy(matrix).invert()).z<-.001){
    mesh.visible=false;hidden.push(mesh);continue;
   }
   if(eye.y<24)continue;
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
     const face=faces[cell]||(faces[cell]=hasTopFace(x,y-1,z)?2:1);
     if(face===1){covered=false;break;}
    }
    if(covered){mesh.visible=false;hidden.push(mesh);break;}
   }
  }
 }
 return {prepare,restore};
}
