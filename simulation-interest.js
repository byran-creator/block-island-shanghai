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
 function seesPoint(point,radius=1,maxDistance=Infinity) {
  const dx=point.x-player.x,dz=point.z-player.z,d2=dx*dx+dz*dz,near=ACTIVE_RADIUS+radius;
  if(d2<=near*near)return true;
  if(maxDistance<Infinity){const far=maxDistance+radius;if(d2>far*far)return false;}
  sphere.center.copy(point);
  sphere.radius=radius+VIEW_BUFFER;
  return view().intersectsSphere(sphere);
 }
 function seesBox(bounds,maxDistance=Infinity) {
  const dx=Math.max(bounds.min.x-player.x,player.x-bounds.max.x,0);
  const dz=Math.max(bounds.min.z-player.z,player.z-bounds.max.z,0);
  const distSq=dx*dx+dz*dz;
  if(distSq<=ACTIVE_RADIUS*ACTIVE_RADIUS)return true;
  if(distSq>maxDistance*maxDistance)return false;
  return view().intersectsBox(bounds);
 }
 function animatesLimb(x,y,z,maxDistance=56) {
  if(!player)return true;
  const dx=x-player.x,dz=z-player.z,d2=dx*dx+dz*dz;
  if(d2>maxDistance*maxDistance)return false;
  if(d2<=324)return true; // Always animate within 18m regardless of heading
  const planes=view().planes;
  const py=y+1;
  for(let i=0;i<6;i++){
   const p=planes[i],n=p.normal;
   if(n.x*x+n.y*py+n.z*z+p.constant<-3.5)return false;
  }
  return true;
 }
 return {beginFrame,seesPoint,seesBox,animatesLimb};
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
