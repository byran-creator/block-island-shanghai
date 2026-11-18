import {Frustum,Matrix4,Sphere} from './three.module.js';

const ACTIVE_RADIUS=88;
const VIEW_BUFFER=8;

// Keep local interactions at full rate in any direction. Far characters
// also stay at full rate if their padded bounds can enter the camera view.
export function createSimulationInterest(camera,getPlayer) {
 const frustum=new Frustum(),matrix=new Matrix4(),sphere=new Sphere();
 let player,viewReady=false;
 function beginFrame() {
  player=getPlayer();
  viewReady=false;
 }
 function view() {
  if(!viewReady) {
   frustum.setFromProjectionMatrix(matrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
   viewReady=true;
  }
  return frustum;
 }
 function seesPoint(point,radius=1) {
  const dx=point.x-player.x,dz=point.z-player.z,near=ACTIVE_RADIUS+radius;
  if(dx*dx+dz*dz<=near*near)return true;
  sphere.center.copy(point);
  sphere.radius=radius+VIEW_BUFFER;
  return view().intersectsSphere(sphere);
 }
 function seesBox(bounds) {
  const dx=Math.max(bounds.min.x-player.x,player.x-bounds.max.x,0);
  const dz=Math.max(bounds.min.z-player.z,player.z-bounds.max.z,0);
  return dx*dx+dz*dz<=ACTIVE_RADIUS*ACTIVE_RADIUS||view().intersectsBox(bounds);
 }
 return {beginFrame,seesPoint,seesBox};
}

// A distant tick never creates a catch-up burst when the player approaches.
export function createSimulationStep(interval,maxStep=interval,phase=0) {
 let elapsed=phase;
 return (dt,observed)=>{
  if(dt<=0)return 0;
  if(observed){elapsed=phase;return dt;}
  elapsed+=dt;
  if(elapsed+1e-9<interval)return 0;
  elapsed=Math.max(0,elapsed-interval);
  return maxStep;
 };
}
