import {Group} from './three.module.js';
import {projectMetroFrame,unprojectMetroFrame} from './metro-west-layout.js';

const DOOR_X=[-22,-18,10,14,18,22],WALK=3,CLIMB=1.7,FADE=1,MAX_ROUTE=37.2;

function routeFor(s,ramp,exits,side,index,nearestDoor,frame){
 const x=s.x+nearestDoor(DOOR_X[index]),lane=s.z+side*2.5,floor=ramp.to;
 const foot=ramp.x+ramp.dir*ramp.length,approach=foot+ramp.dir*1.8,top=ramp.x-ramp.dir*.8;
 const belt=ramp.z+(index%3-1)*.46;
 // Doors at either end of the station avoid the platform escalator opening.
 const bypass=side>0&&x<ramp.x?s.z-2.5:lane;
 const points=[
  [x,floor,s.z+side*6.72,WALK],[x,floor,lane,WALK],
  [x,floor,bypass,WALK],[approach,floor,bypass,WALK],
  [approach,floor,belt,WALK],[foot,floor,belt,WALK],
  [ramp.x,ramp.from,belt,CLIMB],[top,ramp.from,belt,WALK]
 ];
 const b1=ramp.from,fromWorld=(wx,wy,wz,speed=WALK)=>{
  const q=frame?unprojectMetroFrame({x:wx,y:wy,z:wz},frame):{x:wx,y:wy,z:wz};
  return [q.x,q.y,q.z,speed];
 };
 const gateX=s.x-16.5,gateZ=s.z+((index%2)?-.32:.32);
 const pushExitGate=()=>{points.push([top,b1,gateZ,WALK],[gateX,b1,gateZ,WALK]);};
 if(s.id==='nanjing'&&index%3===0){
  // Transfer via the paid concourse southward into Line 10.
  const tx=-100+((index%2)?-.55:.55);
  points.push([-106.8,b1,75.5,3.4],[tx,b1,78.5,3.6],[tx,b1,85,3.8],[-114,b1,85,3.8],[-114,b1,124,3.8],[-107,b1,124,3.8],[-107,b1,127.5,3.6]);
 }else if(s.id==='nanjing10'){
  // Shared-concourse Line 10 transfers northward to Line 2 and its exit gates.
  points.push([158,b1,10,3.6],[164,b1,13,3.6],fromWorld(-114,b1,124,4.2),fromWorld(-114,b1,85,4.2),fromWorld(-100,b1,85,4.2),fromWorld(-100,b1,78.5,4.0),fromWorld(-106,b1,78.5,3.8),fromWorld(-106,b1,66,3.8),fromWorld(-112,b1,66,3.6));
 }else if(s.id==='xintiandi'){
  pushExitGate();
  points.push([s.x-22,b1,gateZ,3.6],[s.x-22,b1,13,3.8],[s.x-22,b1,24,4.2],[s.x+32,b1,24,4.4],fromWorld(-179,b1,199,4.2),fromWorld(-179,b1,203,3.8),fromWorld(-176,b1,203,3.6),fromWorld(-158,26,203,2.4),fromWorld(-154,26,203,3.0),fromWorld(-154,26,index%2?199:207,3.0));
 }else if(exits.length){
  pushExitGate();
  const rExit=exits[index%exits.length];
  const eBottom=rExit.x+rExit.dir*rExit.length,eTop=rExit.x;
  const eBelt=rExit.z+(index%2?-.28:.28);
  const streetStep=eTop-rExit.dir*3.2;
  if(s.id==='nanjing'&&rExit.exit===4){
   points.push([-126.5,b1,gateZ,WALK],[-126.5,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],[-96,rExit.from,67.5,WALK]);
  }else if(s.id==='nanjing'&&rExit.exit===1){
   points.push([-112,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],[streetStep,rExit.from,64.8,WALK],[-126,rExit.from,65.2,WALK]);
  }else if(s.id==='lujiazui'&&rExit.exit===3){
   points.push([157.5,b1,21.8,WALK],[176,b1,21.8,WALK],[176,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],[streetStep,rExit.from,34,WALK]);
  }else if(s.id==='lujiazui'&&rExit.exit===1){
   points.push([157.5,b1,25.6,WALK],[eBottom+1.2,b1,25.6,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],[streetStep-5,rExit.from,26,WALK]);
  }else if(s.id==='yuyuan'&&rExit.exit===4){
   points.push([gateX,b1,-5.4,WALK],[eBottom-1.2,b1,-5.4,WALK],[eBottom-1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],fromWorld(-78,rExit.from,265,WALK));
  }else if(s.id==='yuyuan'&&rExit.exit===1){
   points.push([gateX,b1,-5.4,WALK],[eBottom+1.2,b1,-5.4,WALK],[eBottom+1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],fromWorld(-86,rExit.from,212,WALK),fromWorld(-77,rExit.from,212,WALK));
  }else if(s.id==='centuryPark'){
   points.push([gateX,b1,41.5,WALK],[eBottom+1.2,b1,41.5,WALK],[eBottom+1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],[streetStep,rExit.from,42,WALK]);
  }else if(s.id==='jingan'){
   points.push([-317.5,b1,27,WALK],[-318.8,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK],[-290,rExit.from,eBelt,WALK]);
  }else{
   points.push([gateX,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,rExit.from,eBelt,CLIMB],[streetStep,rExit.from,eBelt,WALK]);
  }
 }else{
  points.push([top,b1,ramp.z+5.6,WALK]);
 }
 const segments=[];
 let seconds=0;
 for(let i=1;i<points.length;i++){
  const [px,py,pz]=points[i-1],[endX,endY,endZ,speed]=points[i];
  const dx=endX-px,dy=endY-py,dz=endZ-pz,length=Math.hypot(dx,dy,dz);
  if(!length)continue;
  const duration=length/speed;
  segments.push({x:px,y:py,z:pz,dx,dy,dz,duration,until:seconds+duration,yaw:Math.atan2(-dx,-dz)});
  seconds+=duration;
 }
 const start=1.7+index*.25,maxDur=MAX_ROUTE-start;
 if(seconds>maxDur&&seconds>0){
  const k=maxDur/seconds;
  let acc=0;
  for(const seg of segments){seg.duration*=k;acc+=seg.duration;seg.until=acc;}
  seconds=maxDur;
 }
 return {segments,seconds,start};
}

export function createMetroAlighting({parent,stations,ramps,nearestDoor,stationFrame,person}){
 const group=new Group();
 group.name='metro-alighting';
 const pool=[[],[]],routes=stations.map(s=>{
  const ramp=ramps.find(r=>r.station===s.id&&r.kind==='platform');
  const exits=ramps.filter(r=>r.station===s.id&&r.kind==='entrance'&&!r.separate);
  const frame=stationFrame?.(s);
  return ramp&&{frame,sides:[-1,1].map(side=>DOOR_X.map((_,i)=>routeFor(s,ramp,exits,side,i,nearestDoor,frame)))};
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
 // passengers finish walking up station exits and into the city/transfers.
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
