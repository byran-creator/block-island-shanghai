import {riverCenter} from './shanghai-map.js';
// Three workboats share a continuous circuit, with separate north/south lanes.
// Phase spacing removes same-lane head-on encounters after the old endpoint flip.
export const WORKBOAT_CYCLE=160;
export function workboatPose(time,index=0){
 const a=time*Math.PI*2/WORKBOAT_CYCLE+index*Math.PI*2/3,z=92+26*Math.cos(a),dz=-26*Math.sin(a),lane=.5+3.5*Math.sin(a);
 const slope=(riverCenter(z+.01)-riverCenter(z-.01))/.02,dx=slope*dz+3.5*Math.cos(a);
 return {x:riverCenter(z)+lane,y:22.28+Math.sin(time*1.5+z)*.06,z,lane,dir:dz>=0?1:-1,yaw:Math.atan2(dx,dz)+Math.PI};
}
export function tickWorkboat(boat,time){const p=workboatPose(time,boat.navigationIndex);boat.z=p.z;boat.dir=p.dir;boat.lane=p.lane;boat.root.position.set(p.x,p.y,p.z);boat.root.rotation.y=p.yaw;}
