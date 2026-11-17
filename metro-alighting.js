import {Group} from './three.module.js';
import {projectMetroFrame} from './metro-west-layout.js';

const DOOR_X=[-22,-18,10,14,18,22],WALK=3,CLIMB=1.7,FADE=1;

function routeFor(s,r,side,index,nearestDoor){
 const x=s.x+nearestDoor(DOOR_X[index]),lane=s.z+side*2.5,floor=r.to;
 const foot=r.x+r.dir*r.length,approach=foot+r.dir*1.8,top=r.x-r.dir*.8;
 const belt=r.z+(index%3-1)*.46;
 // Doors at either end of the station avoid the platform escalator opening.
 // Passengers coming from the far end walk along the opposite side of it.
 const bypass=side>0&&x<r.x?s.z-2.5:lane;
 const points=[
  [x,floor,s.z+side*6.72,WALK],[x,floor,lane,WALK],
  [x,floor,bypass,WALK],[approach,floor,bypass,WALK],
  [approach,floor,belt,WALK],[foot,floor,belt,WALK],
  [r.x,r.from,belt,CLIMB],[top,r.from,belt,WALK],
  [top,r.from,r.z+5.6,WALK]
 ];
 const segments=[];
 let seconds=0;
 for(let i=1;i<points.length;i++){
  const [x,y,z]=points[i-1],[endX,endY,endZ,speed]=points[i];
  const dx=endX-x,dy=endY-y,dz=endZ-z,length=Math.hypot(dx,dy,dz);
  if(!length)continue;
  const duration=length/speed;
  segments.push({x,y,z,dx,dy,dz,duration,until:seconds+duration,yaw:Math.atan2(-dx,-dz)});
  seconds+=duration;
 }
 return {segments,seconds,start:1.7+index*.25};
}

export function createMetroAlighting({parent,stations,ramps,nearestDoor,stationFrame,person}){
 const group=new Group();
 group.name='metro-alighting';
 const pool=[[],[]],routes=stations.map(s=>{
  const ramp=ramps.find(r=>r.station===s.id&&r.kind==='platform');
  return ramp&&{frame:stationFrame?.(s),sides:[-1,1].map(side=>DOOR_X.map((_,i)=>routeFor(s,ramp,side,i,nearestDoor)))};
 });
 function clear(){group.removeFromParent();}
 function pose(actor,route,seconds,frame){
  const part=route.segments.find(segment=>seconds<segment.until)??route.segments.at(-1);
  const u=Math.min(1,(seconds-part.until+part.duration)/part.duration);
  const local={x:part.x+part.dx*u,y:part.y+part.dy*u,z:part.z+part.dz*u};
  const p=frame?projectMetroFrame(local,frame):local;
  const wave=Math.sin(seconds*10)*.4;
  actor.root.position.set(p.x,p.y+.015,p.z);
  actor.root.rotation.y=part.yaw-(frame?Math.atan2(frame.dz,frame.dx):0);
  actor.root.children[3].rotation.x=actor.root.children[6].rotation.x=wave;
  actor.root.children[4].rotation.x=actor.root.children[5].rotation.x=-wave;
  const opacity=Math.min(1,(route.seconds-seconds)/FADE);
  if(opacity<1){
   actor.fade??=actor.solid.map(material=>{
    const fade=material.clone();fade.transparent=true;fade.depthWrite=false;return fade;
   });
   for(const [i,mesh]of actor.root.children.entries()){
    actor.fade[i].opacity=opacity;mesh.material=actor.fade[i];
   }
  }else if(actor.fade)for(const [i,mesh]of actor.root.children.entries())mesh.material=actor.solid[i];
 }
 // The active station owns two reusable groups of six. Clock-based poses let
 // passengers finish walking even after their train model has been parked.
 function tick(station,ageNegative,agePositive){
  const area=routes[station];
  if(!area){clear();return;}
  let visible=false;
  for(const [side,age]of [ageNegative,agePositive].entries()){
   for(const [i,route]of area.sides[side].entries()){
    const seconds=age-route.start,active=seconds>=0&&seconds<route.seconds;
    let actor=pool[side][i];
    if(active&&!actor){
     const root=person(group,40+i,0,0,0);
     actor=pool[side][i]={root,solid:root.children.map(mesh=>mesh.material)};
    }
    if(!actor)continue;
    actor.root.visible=active;
    if(active){pose(actor,route,seconds,area.frame);visible=true;}
   }
  }
  if(visible){if(!group.parent)parent.add(group);}
  else clear();
 }
 return {tick,clear};
}
