import {MathUtils} from './three.module.js';

export const DRIVE_MODES=['慢速','巡航','快速'];
export function vehiclePenetration(v,x,y,z,a,o){
 const p=o.root.position;if(o.person&&o.root.visible===false)return 0;if(o.root===v.root||y>=p.y+(o.height??1.85)||y+1.7<=p.y)return 0;
 const dx=p.x-x,dz=p.z-z,c=Math.cos(a),s=Math.sin(a),side=dx*c-dz*s,front=dx*s+dz*c;
 if(o.person){const ex=Math.max(0,Math.abs(side)-v.halfWidth),ez=Math.max(0,Math.abs(front)-v.halfLength);return ex||ez?Math.max(0,.36-Math.hypot(ex,ez)):Math.min(v.halfWidth+.36-Math.abs(side),v.halfLength+.36-Math.abs(front));}
 const b=o.root.rotation.y,bc=Math.cos(b),bs=Math.sin(b),w=o.halfWidth??.88,l=o.halfLength??1.55;
 const radius=Math.hypot(v.halfWidth,v.halfLength)+Math.hypot(w,l)+.1;if(dx*dx+dz*dz>radius*radius)return 0;
 // Separating axes for two rotated vehicle rectangles, including corner contact.
 let depth=Infinity;for(const [nx,nz]of [[c,-s],[s,c],[bc,-bs],[bs,bc]]){const separation=Math.abs(dx*nx+dz*nz),reach=v.halfWidth*Math.abs(c*nx-s*nz)+v.halfLength*Math.abs(s*nx+c*nz)+w*Math.abs(bc*nx-bs*nz)+l*Math.abs(bs*nx+bc*nz);if(separation>=reach+.05)return 0;depth=Math.min(depth,reach+.05-separation);}return depth;
}
export function vehicleContact(v,x,y,z,a,o){return vehiclePenetration(v,x,y,z,a,o)>0;}
export function updateDrive(v,dt,keys){
 const bike=v.kind==='bicycle';v.gear??=2;
 for(let i=1;i<=3;i++)if(keys.has('Digit'+i))v.gear=i;
 const forward=keys.has('KeyW'),back=keys.has('KeyS'),handbrake=keys.has('Space');
 const braking=handbrake||back&&v.speed>.1||forward&&v.speed<-.1;
 const demand=braking?0:forward?1:back?-.45:0;
 v.throttle=MathUtils.damp(v.throttle??0,demand,demand?2.8:7,dt);
 v.brake=braking?1:0;
 v.steering=MathUtils.damp(v.steering??0,Number(keys.has('KeyA'))-Number(keys.has('KeyD')),8,dt);
 const cap=(bike?[3.5,7,11]:[6,11,19])[v.gear-1];
 if(v.impactCooldown>0){v.impactCooldown=Math.max(0,v.impactCooldown-dt);v.throttle=0;}
 if(braking)v.speed=MathUtils.damp(v.speed,0,handbrake?14:8,dt);
 else{
  const acceleration=v.throttle*(bike?5.5:8),drag=.16+(Math.abs(v.throttle)<.06?.7:0);
  v.speed=MathUtils.clamp(v.speed+(acceleration-v.speed*drag)*dt,-(bike?2.5:4),cap);
 }
 // Only settle a coasting/braking vehicle. Small reverse pedal increments must accumulate.
 if(Math.abs(v.speed)<.025&&(!demand||braking))v.speed=0;
 // Front axle steering remains visible at rest; yaw follows the travelled arc.
 v.steerAngle=v.steering*(bike?.65:.58)/(1+Math.abs(v.speed)*.035);
 const rate=MathUtils.clamp(v.speed/(bike?1.3:2.25)*Math.tan(v.steerAngle),-1.65,1.65);
 return {yawDelta:rate*dt,distance:v.speed*dt};
}
