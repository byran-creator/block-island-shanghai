import {vehicleContact} from './vehicle-dynamics.js';
import {nanpuFloor} from './bridge-road.js';

// Traffic keeps its right of way; eject the player to the nearest clear side.
export function trafficContact({agents,player,vehicle,world,blocked=()=>false}){
 if(vehicle&&!['car','bicycle'].includes(vehicle.kind))return null;
 const v=vehicle??{root:{},halfWidth:.3,halfLength:.3,height:1.75},p=vehicle?.root.position??player,a=vehicle?.root.rotation.y??0;
 const actor=agents.find(o=>vehicleContact(v,p.x,p.y,p.z,a,o));if(!actor)return null;
 const q=actor.root.position,b=actor.root.rotation.y,c=Math.cos(b),s=Math.sin(b),dx=p.x-q.x,dz=p.z-q.z,side=dx*c-dz*s,front=dx*s+dz*c;
 const width=actor.halfWidth+v.halfWidth*Math.abs(Math.cos(a-b))+v.halfLength*Math.abs(Math.sin(a-b))+.18;
 const length=actor.halfLength+v.halfWidth*Math.abs(Math.sin(a-b))+v.halfLength*Math.abs(Math.cos(a-b))+.18;
 const candidates=[[width,front],[-width,front],[side,length],[side,-length]].map(([u,w])=>({x:q.x+u*c+w*s,y:p.y,z:q.z-u*s+w*c})).sort((u,w)=>(u.x-p.x)**2+(u.z-p.z)**2-((w.x-p.x)**2+(w.z-p.z)**2));
 for(const point of candidates){const floor=nanpuFloor(world,point.x,point.z);if(floor!==null&&Math.abs(floor-p.y)<1.5)point.y=floor;
  if(agents.some(o=>vehicleContact(v,point.x,point.y,point.z,a,o)))continue;
  let clear=true;for(const u of [-v.halfWidth,0,v.halfWidth])for(const w of [-v.halfLength,0,v.halfLength]){const x=point.x+u*Math.cos(a)+w*Math.sin(a),z=point.z-u*Math.sin(a)+w*Math.cos(a),h=nanpuFloor(world,x,z),y=h!==null&&Math.abs(point.y-h)<1.5?Math.ceil(h):point.y;if(blocked(x,y,z)||!(h!==null&&Math.abs(point.y-h)<1.5||world.get(Math.floor(x),Math.floor(point.y-.05),Math.floor(z))))clear=false;}
  if(clear)return {actor,point,speed:Math.abs(actor.travelSpeed??0)};
 }
 return null;
}
