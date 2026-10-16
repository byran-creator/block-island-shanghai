import * as THREE from './three.module.js';
import {trainPose,METRO_CYCLE,METRO_DWELL,METRO_TRAVEL} from './metro-service.js';
import {LINE10_STATIONS} from './metro-line10-layout.js';

// These are the built tube ends, not extra stations or simulated services.
export const LINE10_TRAIN_BOUNDS={minX:127,maxX:293};
const halfLength=24.3;
export function line10TrainPose(state){
 const pose=trainPose(state,{stations:LINE10_STATIONS,lineZ:()=>0});
 if(state.phase==='through'){
  const duration=METRO_CYCLE-2*METRO_DWELL-METRO_TRAVEL;
  const a=LINE10_STATIONS[state.origin],b=LINE10_STATIONS[1-state.origin];
  // Finish clearing the end portal before recycling outside the visible tube.
  pose.x=state.tail<duration/2?b.x+state.direction*state.tail*10:a.x-state.direction*(duration-state.tail)*10;
  pose.visible=pose.x+halfLength>=LINE10_TRAIN_BOUNDS.minX&&pose.x-halfLength<=LINE10_TRAIN_BOUNDS.maxX;
 }
 return pose;
}
export function boundLine10TrainMeshes(line){
 line.root.updateWorldMatrix(true,true);
 const planes=[new THREE.Plane(new THREE.Vector3(1,0,0),-LINE10_TRAIN_BOUNDS.minX),new THREE.Plane(new THREE.Vector3(-1,0,0),LINE10_TRAIN_BOUNDS.maxX)].map(p=>p.applyMatrix4(line.root.matrixWorld));
 const materials=new Map();
 for(const train of line.trains)train.root.traverse(o=>{
  if(!o.isMesh)return;
  const copy=m=>{if(!materials.has(m)){const bounded=m.clone();bounded.clippingPlanes=planes;materials.set(m,bounded);}return materials.get(m);};
  o.material=Array.isArray(o.material)?o.material.map(copy):copy(o.material);
 });
 return planes;
}
