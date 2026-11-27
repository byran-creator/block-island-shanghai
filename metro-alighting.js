import {Group} from './three.module.js';
import {projectMetroFrame,unprojectMetroFrame} from './metro-west-layout.js';

const DOOR_X=[-22,-18,10,14,18,22],WALK=1.85,CLIMB=1.25,STROLL=1.05,TRANSFER=1.75,FADE=1.6;

function buildSegments(pts){
 const segments=[];
 let seconds=0;
 for(let i=1;i<pts.length;i++){
  const [px,py,pz]=pts[i-1],[endX,endY,endZ,speed]=pts[i];
  const dx=endX-px,dy=endY-py,dz=endZ-pz,length=Math.hypot(dx,dy,dz);
  if(!length)continue;
  const duration=length/speed;
  segments.push({x:px,y:py,z:pz,dx,dy,dz,duration,until:seconds+duration,yaw:Math.atan2(-dx,-dz),speed,isEscalator:Math.abs(dy)>.2});
  seconds+=duration;
 }
 return {segments,seconds};
}

function buildStrollLoop(surfacePts,speed,index){
 if(!surfacePts||surfacePts.length<2)return null;
 const waitEnd=2.2+(index%3)*.9,waitTurn=1.8+((index+1)%3)*.9;
 const segs=[];
 let total=0;
 const pushPause=(pt,dur,yaw)=>{segs.push({x:pt[0],y:pt[1],z:pt[2],dx:0,dy:0,dz:0,duration:dur,until:(total+=dur),yaw,speed:0,isEscalator:false});};
 const pushWalk=(a,b)=>{
  const dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],len=Math.hypot(dx,dy,dz);
  if(!len)return 0;
  const dur=len/speed,yaw=Math.atan2(-dx,-dz);
  segs.push({x:a[0],y:a[1],z:a[2],dx,dy,dz,duration:dur,until:(total+=dur),yaw,speed,isEscalator:false});
  return yaw;
 };
 const endPt=surfacePts[surfacePts.length-1],prevPt=surfacePts[surfacePts.length-2];
 const endYaw=Math.atan2(-(endPt[0]-prevPt[0]),-(endPt[2]-prevPt[2]));
 pushPause(endPt,waitEnd,endYaw);
 let turnYaw=endYaw;
 for(let i=surfacePts.length-1;i>0;i--)turnYaw=pushWalk(surfacePts[i],surfacePts[i-1])||turnYaw;
 pushPause(surfacePts[0],waitTurn,turnYaw);
 for(let i=0;i<surfacePts.length-1;i++)pushWalk(surfacePts[i],surfacePts[i+1]);
 return total>0?{segments:segs,seconds:total}:null;
}

function routeFor(s,ramp,exits,side,index,nearestDoor,frame){
 const x=s.x+nearestDoor(DOOR_X[index]),lane=s.z+side*2.5,floor=ramp.to;
 const foot=ramp.x+ramp.dir*ramp.length,approach=foot+ramp.dir*1.8,top=ramp.x-ramp.dir*.8;
 const belt=ramp.z-.34+(index%3)*.12;
 // Doors at either end of the station avoid the platform escalator opening.
 const bypass=side>0&&x<ramp.x?s.z-2.5:lane;
 const points=[
  [x,floor,s.z+side*6.72,WALK],[x,floor,lane,WALK],
  [x,floor,bypass,WALK],[approach,floor,bypass,WALK],
  [approach,floor,belt,WALK],[foot,floor,belt,WALK],
  [ramp.x,ramp.from,belt,CLIMB],[top,ramp.from,belt,WALK]
 ];
 const b1=ramp.from,spread=(index%3-1)*.65,alt=index%2===0?1:-1;
 const strollSpeed=STROLL*(0.9+(index%3)*.11);
 const fromWorld=(wx,wy,wz,speed=strollSpeed)=>{
  const q=frame?unprojectMetroFrame({x:wx,y:wy,z:wz},frame):{x:wx,y:wy,z:wz};
  return [q.x,q.y,q.z,speed];
 };
 const gateX=s.x-16.5,gateZ=s.z+((index%2)?-.32:.32);
 const pushExitGate=()=>{points.push([top,b1,gateZ,WALK],[gateX,b1,gateZ,WALK]);};
 let surfaceAnchor=-1;
 if(s.id==='nanjing'&&index%3===0){
  // Transfer via the paid concourse southward into Line 10.
  const tx=-100+((index%2)?-.55:.55);
  points.push([-106.8,b1,75.5,TRANSFER],[tx,b1,78.5,TRANSFER],[tx,b1,85,TRANSFER],[-114,b1,85,TRANSFER],[-114,b1,124,TRANSFER],[-107,b1,124,TRANSFER],[-107+spread*.5,b1,130,strollSpeed]);
 }else if(s.id==='nanjing10'){
  // Shared-concourse Line 10 transfers northward into Line 2 and its exit concourse.
  points.push([158,b1,10,TRANSFER],[164,b1,13,TRANSFER],fromWorld(-114,b1,124,TRANSFER),fromWorld(-114,b1,85,TRANSFER),fromWorld(-100,b1,85,TRANSFER),fromWorld(-100,b1,78.5,TRANSFER),fromWorld(-106,b1,78.5,TRANSFER),fromWorld(-106,b1,66,TRANSFER),fromWorld(-114,b1,66+spread*.4,strollSpeed));
 }else if(s.id==='xintiandi'){
  pushExitGate();
  points.push(
   [s.x-22,b1,gateZ,TRANSFER],[s.x-22,b1,13,TRANSFER],[s.x-22,b1,24,TRANSFER],[s.x+32,b1,24,TRANSFER],
   fromWorld(-179,b1,199,TRANSFER),fromWorld(-179,b1,203,TRANSFER),fromWorld(-176,b1,203,TRANSFER),
   fromWorld(-158,26,203,CLIMB),fromWorld(-154,26,203+spread*.4,strollSpeed)
  );
  surfaceAnchor=points.length-1;
  points.push(alt>0?fromWorld(-136,26,203+spread,strollSpeed):fromWorld(-154,26,218+spread,strollSpeed));
 }else if(exits.length){
  pushExitGate();
  const rExit=exits[index%exits.length];
  const eBottom=rExit.x+rExit.dir*rExit.length,eTop=rExit.x;
  const eBelt=(rExit.width??1.5)<1?Math.floor(rExit.z)+.26+(index%2?0:.06):rExit.z-.34+(index%2?0:.14);
  const streetStep=eTop-rExit.dir*3.2;
  const st=rExit.from;
  if(s.id==='nanjing'&&rExit.exit===4){
   points.push([-126.5,b1,gateZ,WALK],[-126.5,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   if(index%2===0)points.push([-96,st,67+spread,strollSpeed],[-74,st,66+spread,strollSpeed],[-60,st,66+spread,strollSpeed]);
   else points.push([-104,st,70,strollSpeed],[-118,st,67+spread,strollSpeed],[-138,st,66+spread,strollSpeed]);
  }else if(s.id==='nanjing'&&rExit.exit===1){
   points.push([-112,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK],[streetStep,st,64.8,WALK]);
   surfaceAnchor=points.length-1;
   if(index%2===0)points.push([-152,st,65.5+spread,strollSpeed],[-170,st,66+spread,strollSpeed]);
   else points.push([-122,st,65.5+spread,strollSpeed],[-96,st,66+spread,strollSpeed]);
  }else if(s.id==='lujiazui'&&rExit.exit===3){
   points.push([157.5,b1,21.8,WALK],[176,b1,21.8,WALK],[176,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   if(index%2===0)points.push([208.2,st,36,strollSpeed],[195.5,st,36,strollSpeed],[195.5,st,52,strollSpeed]);
   else points.push([222,st,25.5+spread,strollSpeed],[224,st,40+spread,strollSpeed]);
  }else if(s.id==='lujiazui'&&rExit.exit===1){
   points.push([157.5,b1,25.6,WALK],[eBottom+1.2,b1,25.6,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   if(index%2===0)points.push([138,st,25+spread,strollSpeed],[126,st,28+spread,strollSpeed]);
   else points.push([148,st,29+spread,strollSpeed],[150,st,44+spread,strollSpeed]);
  }else if(s.id==='yuyuan'&&rExit.exit===4){
   points.push([gateX,b1,-5.4,WALK],[eBottom-1.2,b1,-5.4,WALK],[eBottom-1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   points.push(fromWorld(-77,st,265+spread*.4,strollSpeed),fromWorld(-64,st,265+spread*.4,strollSpeed));
  }else if(s.id==='yuyuan'&&rExit.exit===1){
   points.push([gateX,b1,-5.4,WALK],[eBottom+1.2,b1,-5.4,WALK],[eBottom+1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   points.push(fromWorld(-86,st,212,strollSpeed),fromWorld(-77,st,212,strollSpeed),fromWorld(-77,st,218,strollSpeed),fromWorld(-68,st,218+spread*.4,strollSpeed));
  }else if(s.id==='centuryPark'){
   points.push([gateX,b1,41.5,WALK],[eBottom+1.2,b1,41.5,WALK],[eBottom+1.2,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   if(index%2===0)points.push([312,st,48,strollSpeed],[324+spread,st,48,strollSpeed]);
   else points.push([302,st,34.5+spread,strollSpeed],[302,st,48,strollSpeed]);
  }else if(s.id==='jingan'){
   points.push([-317.5,b1,27,WALK],[-318.8,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   if(index%2===0)points.push([-303.5,st,22.5,strollSpeed],[-303.5+spread*.5,st,11.5,strollSpeed]);
   else points.push([-284,st,23+spread*.5,strollSpeed],[-270,st,22+spread*.5,strollSpeed]);
  }else{
   points.push([gateX,b1,eBelt,WALK],[eBottom,b1,eBelt,WALK],[eTop,st,eBelt,CLIMB],[streetStep,st,eBelt,WALK]);
   surfaceAnchor=points.length-1;
   points.push([streetStep-rExit.dir*14,st,eBelt+spread,strollSpeed]);
  }
 }else{
  points.push([top,b1,ramp.z+5.6,WALK]);
 }
 const {segments,seconds}=buildSegments(points);
 let loop=null;
 if(surfaceAnchor>=0){
  const afterCount=points.length-(surfaceAnchor+1);
  const surfacePts=afterCount>=2?points.slice(surfaceAnchor+1):points.slice(surfaceAnchor);
  loop=buildStrollLoop(surfacePts,strollSpeed,index);
 }
 return {segments,seconds,start:1.6+index*.22,loop};
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
 let activeStation=-1;
 function resetPool(){
  for(const sideList of pool)for(const actor of sideList)if(actor){
   actor.mode='idle';actor.elapsed=0;actor.lastAge=Infinity;actor.y=0;actor.root.visible=false;
  }
 }
 function clear(){resetPool();activeStation=-1;group.removeFromParent();}
 function pose(actor,segments,seconds,frame,opacity){
  const part=segments.find(segment=>seconds<segment.until)??segments.at(-1);
  const u=Math.min(1,Math.max(0,(seconds-part.until+part.duration)/(part.duration||1)));
  const local={x:part.x+part.dx*u,y:part.y+part.dy*u,z:part.z+part.dz*u};
  const p=frame?projectMetroFrame(local,frame):local;
  const wave=part.speed>0?(part.isEscalator?Math.sin(seconds*4)*.08:Math.sin(seconds*part.speed*4.5)*.34):0;
  actor.root.position.set(p.x,p.y+.015,p.z);
  actor.root.rotation.y=part.yaw-(frame?Math.atan2(frame.dz,frame.dx):0);
  actor.root.children[3].rotation.x=actor.root.children[6].rotation.x=wave;
  actor.root.children[4].rotation.x=actor.root.children[5].rotation.x=-wave;
  if(opacity<1){
   actor.fade??=actor.solid.map(material=>{
    const fade=material.clone();fade.transparent=true;fade.depthWrite=false;return fade;
   });
   for(const [i,mesh]of actor.root.children.entries()){
    actor.fade[i].opacity=opacity;mesh.material=actor.fade[i];
   }
  }else if(actor.fade)for(const [i,mesh]of actor.root.children.entries())mesh.material=actor.solid[i];
  return p;
 }
 // Each station owns two reusable 6-person pools. Exited passengers seamlessly
 // transition into normal-paced street tourists without popping out near the player.
 function tick(station,ageNegative,agePositive,{dt=0,player=null,interiorVisible=true}={}){
  const area=routes[station];
  if(!area){clear();return;}
  if(station!==activeStation){resetPool();activeStation=station;}
  let visible=false;
  for(const [side,age]of [ageNegative,agePositive].entries()){
   for(const [i,route]of area.sides[side].entries()){
    let actor=pool[side][i];
    if(!actor){
     const shouldSpawn=(age>=route.start&&age<route.seconds)||!!route.loop;
     if(!shouldSpawn)continue;
     const root=person(group,40+i,0,0,0);
     actor=pool[side][i]={root,solid:root.children.map(mesh=>mesh.material),mode:'idle',elapsed:0,lastAge:age,y:0};
    }
    const newWave=age<actor.lastAge-1;
    if(newWave&&actor.mode!=='idle'){
     const dist=player?Math.hypot(actor.root.position.x-player.x,actor.root.position.z-player.z):Infinity;
     const underground=!player||player.y<16.5;
     const recycle=underground?(actor.mode==='stroll'||actor.y>=16):(actor.mode==='stroll'?dist>48:actor.y<15.5);
     if(recycle){actor.mode='idle';actor.elapsed=0;}
    }
    if(actor.mode==='stroll'){
     actor.elapsed+=dt>0?dt:0;
    }else if(actor.mode==='idle'){
     const since=age-route.start;
     if(since>=0&&since<route.seconds){actor.mode='exit';actor.elapsed=since;}
    }else if(actor.mode==='exit'){
     actor.elapsed=dt>0?actor.elapsed+dt:Math.max(0,age-route.start);
     if(actor.elapsed>=route.seconds){
      if(route.loop){actor.mode='stroll';actor.elapsed=0;}
      else actor.mode='idle';
     }
    }
    actor.lastAge=age;
    if(actor.mode==='idle'){actor.root.visible=false;continue;}
    let p;
    if(actor.mode==='stroll'&&route.loop){
     const loopTime=actor.elapsed%route.loop.seconds;
     p=pose(actor,route.loop.segments,loopTime,area.frame,1);
    }else{
     const opacity=route.loop?1:Math.min(1,(route.seconds-actor.elapsed)/FADE);
     p=pose(actor,route.segments,actor.elapsed,area.frame,opacity);
    }
    actor.y=p.y;
    const undergroundHidden=(!interiorVisible&&p.y<16.2)||(p.y<15.5&&player&&player.y>=24.5);
    actor.root.visible=!undergroundHidden;
    if(actor.root.visible)visible=true;
   }
  }
  if(visible){if(!group.parent)parent.add(group);}
  else if(activeStation<0)group.removeFromParent();
 }
 return {tick,clear};
}
