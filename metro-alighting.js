import {Group} from './three.module.js';
import {projectMetroFrame,unprojectMetroFrame} from './metro-west-layout.js';

const DOOR_X=[-22,-18,10,14,18,22],WALK=3.4,CLIMB=2.1,STROLL=2.15,FADE=1.6,MAX_ROUTE=38.4;

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
 const b1=ramp.from,spread=(index%3-1)*.65,alt=index%2===0?1:-1;
 const fromWorld=(wx,wy,wz,speed=STROLL)=>{
  const q=frame?unprojectMetroFrame({x:wx,y:wy,z:wz},frame):{x:wx,y:wy,z:wz};
  return [q.x,q.y,q.z,speed];
 };
 const gateX=s.x-16.5,gateZ=s.z+((index%2)?-.32:.32);
 const pushExitGate=()=>{points.push([top,b1,gateZ,WALK],[gateX,b1,gateZ,WALK]);};
 if(s.id==='nanjing'&&index%3===0){
  // Transfer via the paid concourse southward into Line 10.
  const tx=-100+((index%2)?-.55:.55);
  points.push([-106.8,b1,75.5,3.8],[tx,b1,78.5,4.0],[tx,b1,85,4.2],[-114,b1,85,4.2],[-114,b1,124,4.2],[-107,b1,124,4.0],[-107+spread*.5,b1,130,STROLL]);
 }else if(s.id==='nanjing10'){
  // Shared-concourse Line 10 transfers northward into Line 2 and its exit concourse.
  points.push([158,b1,10,3.8],[164,b1,13,3.8],fromWorld(-114,b1,124,4.4),fromWorld(-114,b1,85,4.4),fromWorld(-100,b1,85,4.4),fromWorld(-100,b1,78.5,4.0),fromWorld(-106,b1,78.5,3.8),fromWorld(-106,b1,66,3.6),fromWorld(-114,b1,66+spread*.4,STROLL));
 }else if(s.id==='xintiandi'){
  pushExitGate();
  points.push(
   [s.x-22,b1,gateZ,3.8],[s.x-22,b1,13,4.2],[s.x-22,b1,24,4.6],[s.x+32,b1,24,4.8],
   fromWorld(-179,b1,199,4.6),fromWorld(-179,b1,203,4.2),fromWorld(-176,b1,203,4.0),
   fromWorld(-158,26,203,CLIMB),fromWorld(-154,26,203+spread*.4,STROLL),
   alt>0?fromWorld(-136,26,203+spread,STROLL):fromWorld(-154,26,218+spread,STROLL)
  );
 }else if(exits.length){
  pushExitGate();
  const rExit=exits[index%exits.length];
  const eBottom=rExit.x+rExit.dir*rExit.length,eTop=rExit.x;
  const eBelt=rExit.z+(index%2?-.28:.28);
  const streetStep=eTop-rExit.dir*3.2;
  const st=rExit.from;
  if(s.id==='nanjing'&&rExit.exit===4){
   points.push([-126.5,b1,gateZ,WALK],[-126.5,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   if(index%2===0)points.push([-96,st,67+spread,STROLL],[-74,st,66+spread,STROLL],[-60,st,66+spread,STROLL]);
   else points.push([-104,st,70,STROLL],[-118,st,67+spread,STROLL],[-138,st,66+spread,STROLL]);
  }else if(s.id==='nanjing'&&rExit.exit===1){
   points.push([-112,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK],[streetStep,st,64.8,WALK]);
   if(index%2===0)points.push([-152,st,65.5+spread,STROLL],[-170,st,66+spread,STROLL]);
   else points.push([-122,st,65.5+spread,STROLL],[-96,st,66+spread,STROLL]);
  }else if(s.id==='lujiazui'&&rExit.exit===3){
   points.push([157.5,b1,21.8,WALK],[176,b1,21.8,WALK],[176,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   if(index%2===0)points.push([208.2,st,36,STROLL],[195.5,st,36,STROLL],[195.5,st,52,STROLL]);
   else points.push([222,st,25.5+spread,STROLL],[224,st,40+spread,STROLL]);
  }else if(s.id==='lujiazui'&&rExit.exit===1){
   points.push([157.5,b1,25.6,WALK],[eBottom+1.2,b1,25.6,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   if(index%2===0)points.push([138,st,25+spread,STROLL],[126,st,28+spread,STROLL]);
   else points.push([148,st,29+spread,STROLL],[150,st,44+spread,STROLL]);
  }else if(s.id==='yuyuan'&&rExit.exit===4){
   points.push([gateX,b1,-5.4,WALK],[eBottom-1.2,b1,-5.4,WALK],[eBottom-1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK],fromWorld(-77,st,265+spread*.4,STROLL),fromWorld(-64,st,265+spread*.4,STROLL));
  }else if(s.id==='yuyuan'&&rExit.exit===1){
   points.push([gateX,b1,-5.4,WALK],[eBottom+1.2,b1,-5.4,WALK],[eBottom+1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK],fromWorld(-86,st,212,STROLL),fromWorld(-77,st,212,STROLL),fromWorld(-77,st,218,STROLL),fromWorld(-68,st,218+spread*.4,STROLL));
  }else if(s.id==='centuryPark'){
   points.push([gateX,b1,41.5,WALK],[eBottom+1.2,b1,41.5,WALK],[eBottom+1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   if(index%2===0)points.push([312,st,48,STROLL],[324+spread,st,48,STROLL]);
   else points.push([302,st,34.5+spread,STROLL],[302,st,48,STROLL]);
  }else if(s.id==='jingan'){
   points.push([-317.5,b1,27,WALK],[-318.8,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   if(index%2===0)points.push([-303.5,st,22.5,STROLL],[-303.5+spread*.5,st,11.5,STROLL]);
   else points.push([-284,st,23+spread*.5,STROLL],[-270,st,22+spread*.5,STROLL]);
  }else{
   points.push([gateX,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK],[streetStep-rExit.dir*14,st,eBelt+spread,STROLL]);
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
 const start=1.6+index*.22,maxDur=MAX_ROUTE-start;
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
 // passengers exit onto surrounding streets/plazas and mingle with pedestrians.
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
