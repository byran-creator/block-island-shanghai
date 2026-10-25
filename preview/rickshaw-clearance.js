import {LINE10_STATIONS,line10ToWorld} from './metro-line10-layout.js';
import {metroEntranceLayout} from './metro-entrance.js';
import {YUYUAN_SHIFT} from './yuyuan-layout.js';

// Cart-local coordinates. Reserve the canopy, stair opening and approach rails,
// including the empty centre: escalators are pedestrian access, not a carriage lane.
export const RICKSHAW_METRO_BOUNDS=LINE10_STATIONS.flatMap(s=>s.exits.map(e=>{
 const a=metroEntranceLayout(e),points=[a.x-a.length/2-.4,a.x+a.length/2+.4,e.x+e.dir*19].flatMap(x=>[-1,1].map(side=>line10ToWorld({x,y:26,z:e.z+side*(a.width/2+.25)})));
 return {minX:Math.min(...points.map(p=>p.x)),maxX:Math.max(...points.map(p=>p.x)),minZ:Math.min(...points.map(p=>p.z))-YUYUAN_SHIFT,maxZ:Math.max(...points.map(p=>p.z))-YUYUAN_SHIFT};
}));

export function rickshawMetroClear(x,z,yaw){
 // The puller and shafts extend 2.8m ahead; the carriage extends 1m behind.
 const fx=Math.sin(yaw),fz=Math.cos(yaw),nx=fz,nz=-fx,cx=x+fx*.9,cz=z+fz*.9;
 for(const b of RICKSHAW_METRO_BOUNDS){const hx=(b.maxX-b.minX)/2,hz=(b.maxZ-b.minZ)/2,dx=cx-(b.minX+b.maxX)/2,dz=cz-(b.minZ+b.maxZ)/2;
  if(Math.abs(dx)>hx+Math.abs(fx)*1.9+Math.abs(nx)*.9+.12)continue;
  if(Math.abs(dz)>hz+Math.abs(fz)*1.9+Math.abs(nz)*.9+.12)continue;
  if(Math.abs(dx*fx+dz*fz)>1.9+hx*Math.abs(fx)+hz*Math.abs(fz)+.12)continue;
  if(Math.abs(dx*nx+dz*nz)>.9+hx*Math.abs(nx)+hz*Math.abs(nz)+.12)continue;
  return false;
 }return true;
}

export function rickshawMetroSweepClear(from,x,z,yaw){
 const turn=Math.atan2(Math.sin(yaw-from.rotation.y),Math.cos(yaw-from.rotation.y)),steps=Math.max(1,Math.ceil(Math.hypot(x-from.position.x,z-from.position.z)/.2),Math.ceil(Math.abs(turn)/.06));
 for(let i=1;i<=steps;i++){const t=i/steps;if(!rickshawMetroClear(from.position.x+(x-from.position.x)*t,from.position.z+(z-from.position.z)*t,from.rotation.y+turn*t))return false;}return true;
}
