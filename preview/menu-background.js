import {Box3,Frustum,Matrix4,Vector3} from './three.module.js';

// The login camera moves only 1.5m. Include a margin and wide landscape view,
// so its voxel shells are ready before the loading button becomes interactive.
export function menuVisibleChunks(keys,camera,chunk,height){
 const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
 const box=new Box3(),min=new Vector3(),max=new Vector3();
 return new Set([...keys].filter(key=>{
  const [x,z]=key.split(',').map(Number);
  min.set(x*chunk-3,0,z*chunk-3);max.set((x+1)*chunk+3,height,(z+1)*chunk+3);box.set(min,max);
  return box.distanceToPoint(camera.position)<camera.far&&frustum.intersectsBox(box);
 }));
}
