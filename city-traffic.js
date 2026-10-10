import {styleNpc} from './npc-appearance.js';
import * as THREE from './three.module.js';
import {BUND_STREETS,roadX,westSpine,CAR_ROUTES,roadContains} from './city-layout.js';
import {vehicleContact} from './vehicle-dynamics.js';
import {nanpuFloor} from './bridge-road.js';
import {createTrafficDetour} from './traffic-detour.js';
import {createJunctionControl} from './traffic-junctions.js';

// Photo-inspired street furniture; phases and bus routes use the game's compressed scale.
export function signalPhase(time,offset=0){const t=((time+offset)%46+46)%46;return {ns:t<18?'green':t<21?'amber':'red',ew:t>=23&&t<41?'green':t>=41&&t<44?'amber':'red',remaining:Math.ceil(t<18?18-t:t<21?21-t:t<23?23-t:t<41?41-t:t<44?44-t:46-t)};}
export function routeCrossings(samples,signals){const out=[];for(const signal of signals){let cluster=[];const flush=()=>{if(!cluster.length)return;const p=cluster.reduce((a,b)=>a.dist<b.dist?a:b);const i=p.index,a=samples[Math.max(0,i-2)],b=samples[Math.min(samples.length-1,i+2)];out.push({signal,d:p.d,axis:Math.abs(b.z-a.z)>Math.abs(b.x-a.x)?'ns':'ew'});cluster=[];};for(let i=0;i<samples.length;i++){const p=samples[i],dist=Math.hypot(p.x-signal.x,p.z-signal.z);if(dist<3)cluster.push({...p,index:i,dist});else flush();}flush();}return out;}
export function forwardDistance(from,to,length,dir=1){return ((to-from)*dir%length+length)%length;}
export function trafficTravel(agent,dt,time,agents=[],getPose,onFollow=()=>{},crosswalkOccupied=false){let distance=(agent.currentSpeed??agent.speed)*dt;const length=agent.route.lengthMeters,half=agent.halfLength??1.25,gapBuffer=Math.max(2.8,(agent.speed??0)*1.7);
 for(const crossing of agent.crossings??[]){
  const isBund=crossing.signal?.id==='bund-66';
  const green=isBund&&crosswalkOccupied?false:signalPhase(time,crossing.signal.offset)[crossing.axis]==='green';
  const ahead=forwardDistance(agent.t,crossing.d,length,agent.dir),stop=6+half;
  if(!green){
   if(ahead>=stop-.05&&ahead<stop+distance+2)distance=Math.min(distance,Math.max(0,ahead-stop));
  }
 }
 for(const other of agents){if(other===agent||other.route!==agent.route||other.dir!==agent.dir||Math.abs(other.lane-agent.lane)>.5)continue;const gap=forwardDistance(agent.t,other.t,length,agent.dir);if(gap<length/2){const limit=Math.max(0,gap-half-(other.halfLength??1.25)-gapBuffer);if(limit<1e-6)onFollow(other);distance=Math.min(distance,limit);}}
 // Route IDs do not define a lane: buses and cars from different loops share
 // the same carriageway. Follow the vehicle ahead in physical space as well.
 const predicted=new Map(),probe={root:agent.root,halfLength:half+gapBuffer,halfWidth:(agent.halfWidth??.72)+.1};
 if(getPose)for(const other of agents){
  if(other===agent)continue;
  const a=agent.root.rotation.y,b=other.root.rotation.y,p=agent.root.position,q=other.root.position,dx=q.x-p.x,dz=q.z-p.z;
  if(dx*dx+dz*dz>144||Math.abs(p.y-q.y)>1.5||Math.cos(a-b)<.92||Math.abs(dx*(Math.cos(a)+Math.cos(b))-dz*(Math.sin(a)+Math.sin(b)))/2>agent.halfWidth+other.halfWidth+.3||-(dx*(Math.sin(a)+Math.sin(b))+dz*(Math.cos(a)+Math.cos(b)))<=0)continue;
  for(let d=0;d<=6;d+=.5){let at=predicted.get(d);if(!at){at=getPose(agent,agent.t+agent.dir*d);predicted.set(d,at);}if(vehicleContact(probe,at.x,at.y,at.z,at.yaw,other)){if(d<=.5)onFollow(other);distance=Math.min(distance,Math.max(0,d-.5));break;}}
 }
 return Math.max(0,distance);
}

export const trafficSeed=(index,salt=0)=>{let n=Math.imul(index+1,2654435761)^Math.imul(salt+7,1597334677);n=Math.imul(n^(n>>>16),2246822507);return ((n^(n>>>13))>>>0)/4294967296;};
export function createCityTraffic({scene,world,getPos,routePose,cars,getObstacles=()=>[]}){
 const root=new THREE.Group();root.name='city-traffic-details';scene.add(root);const box=new THREE.BoxGeometry(1,1,1),mats=new Map(),buses=[],riders=[],officers=[],stops=[];
 const mat=(color,glow=false)=>{const key=color+glow;if(!mats.has(key))mats.set(key,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));return mats.get(key);};
 function cube(parent,color,x,y,z,sx,sy,sz,glow=false){const m=new THREE.Mesh(box,mat(color,glow));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.userData.range=285;parent.add(m);return m;}
 function board(parent,text,x,y,z,w,h,angle=0){const c=document.createElement('canvas');c.width=256;c.height=64;const ctx=c.getContext('2d');ctx.fillStyle='#112332';ctx.fillRect(0,0,256,64);ctx.fillStyle='#9cf1da';ctx.font='bold 29px sans-serif';ctx.textAlign='center';ctx.fillText(text,128,43);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}));m.position.set(x,y,z);m.rotation.y=angle;m.userData.range=240;m.userData.panel=true;parent.add(m);return {mesh:m,canvas:c,ctx,texture};}
 function clearPoint(x,z){return !world.get(Math.floor(x),26,Math.floor(z))&&!world.get(Math.floor(x),27,Math.floor(z))&&!!world.get(Math.floor(x),25,Math.floor(z));}
 const signals=[66,99,162].map((z,i)=>({x:roadX(z),z,offset:i*5,id:'bund-'+z})).concat({x:westSpine(99),z:99,offset:8,id:'rear-99'});
 for(const signal of signals){
  signal.heads=[];
  if(signal.id==='bund-66'){
   for(const [side,px] of [[-1, 12.5], [1, 23.5]]){
    const r=new THREE.Group();
    r.position.set(px, 26, signal.z);
    root.add(r);
    cube(r,'#3e4a52',0,2.7,0,.15,5.4,.15);
    const armDir=side<0?1:-1;
    cube(r,'#3e4a52',armDir*1.2,5.1,0,2.4,.12,.12);
    const v=new THREE.Group();
    v.position.set(armDir*2.2,4.8,0);
    r.add(v);
    cube(v,'#192731',0,0,0,.55,1.65,.28);
    const vLamps=[];
    for(const [i,color]of ['#ff514c','#ffc85b','#51fba9'].entries()){
     const m=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.07,12),mat(color,true));
     m.rotation.x=Math.PI/2;
     m.position.set(0,.5-i*.5,.18);
     m.userData.range=220;
     v.add(m);
     vLamps.push(m);
    }
    const vCounter=board(v,'18',0,1.15,.18,.75,.4);
    signal.heads.push({axis:'ns',lamps:vLamps,counter:vCounter});
    const p=new THREE.Group();
    p.position.set(0,2.6,0);
    p.rotation.y=armDir>0?Math.PI/2:-Math.PI/2;
    r.add(p);
    cube(p,'#192731',0,0,0,.45,1.4,.24);
    const pLamps=[];
    for(const [i,color]of ['#ff514c','#ffc85b','#51fba9'].entries()){
     const m=new THREE.Mesh(new THREE.CylinderGeometry(.14,.14,.06,12),mat(color,true));
     m.rotation.x=Math.PI/2;
     m.position.set(0,.42-i*.42,.15);
     m.userData.range=220;
     p.add(m);
     pLamps.push(m);
    }
    const pCounter=board(p,'18',0,.98,.15,.65,.35);
    signal.heads.push({axis:'ew',lamps:pLamps,counter:pCounter});
   }
  }else{
   for(const axis of ['ns','ew'])for(const side of [-1,1]){
    const r=new THREE.Group();
    r.position.set(signal.x+.5+(axis==='ns'?side*4.4:side*6),26,signal.z+.5+(axis==='ns'?side*6:side*4.4));
    r.rotation.y=axis==='ns'?(side>0?0:Math.PI):(side>0?Math.PI/2:-Math.PI/2);
    root.add(r);
    cube(r,'#687a7e',0,2.5,0,.12,5,.12);
    cube(r,'#192731',0,4.9,0,.55,1.65,.28);
    const lamps=[];
    for(const [i,color]of ['#ff514c','#ffc85b','#51fba9'].entries()){
     const m=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.07,12),mat(color,true));
     m.rotation.x=Math.PI/2;
     m.position.set(0,5.4-i*.5,.18);
     m.userData.range=220;
     r.add(m);
     lamps.push(m);
    }
    const counter=board(r,'18',0,6.1,.18,.75,.4);
    signal.heads.push({axis,lamps,counter});
   }
  }
  // Stop lines and zebra crossing remain on the road, leaving the sidewalk passable.
  for(const dz of [-6,6]){const m=new THREE.Mesh(new THREE.PlaneGeometry(6,.15),mat('#f5eee0'));m.rotation.x=-Math.PI/2;m.position.set(signal.x+.5,26.055,signal.z+.5+dz);m.userData.range=220;root.add(m);}
 }
 function officer(signal,i){let point;for(const [dx,dz]of [[5.5,-8],[-5.5,8],[8,-8]])if(clearPoint(signal.x+dx,signal.z+dz)&&!roadContains(signal.x+dx,signal.z+dz)){point={x:signal.x+dx,z:signal.z+dz};break;}if(!point)return;const r=new THREE.Group();r.position.set(point.x,26,point.z);root.add(r);cube(r,'#88b4d5',0,1,0,.46,.7,.3);cube(r,'#d4eb69',0,1.06,-.17,.45,.53,.08);for(const y of [.86,1.23])cube(r,'#eef6ed',0,y,-.22,.47,.06,.03);cube(r,'#e3b38b',0,1.61,0,.34,.34,.33);cube(r,'#f0f2ee',0,1.83,0,.43,.15,.42);cube(r,'#243649',0,1.77,-.17,.4,.06,.14);for(const x of [-.12,.12])cube(r,'#293a52',x,.38,0,.18,.76,.23);const arm=new THREE.Group();arm.position.set(.31,1.3,0);cube(arm,'#88b4d5',0,-.22,0,.16,.45,.18);cube(arm,'#f2efdf',0,-.49,0,.17,.18,.18);r.add(arm);cube(r,'#88b4d5',-.3,1,0,.16,.58,.18);styleNpc({root:r,torso:r.children[0],head:r.children[4],arms:[arm,r.children[10]],legs:[r.children[7],r.children[8]]},i,'officer');officers.push({root:r,arm,signal,phase:i});}
 signals.filter((s,i)=>i!==2).forEach(officer);
 function bus(route,i){const r=new THREE.Group();r.name='blue-white-city-bus';root.add(r);cube(r,'#e7eeed',0,1.1,0,1.65,1.65,4.8);cube(r,'#287aad',0,.42,0,1.7,.38,4.82);cube(r,'#273d4a',0,1.56,-2.43,1.45,.92,.05);cube(r,'#395866',0,1.5,2.43,1.45,.85,.05);cube(r,'#e8eeed',0,2.02,0,1.7,.15,4.9);for(const x of [-.83,.83]){for(let z=-1.65;z<=1.75;z+=.8)cube(r,'#578b9b',x,1.48,z,.05,.8,.67);for(const z of [-1.5,1.5])cube(r,'#202d35',x,.3,z,.18,.6,.6);}for(const z of [-1.45,.9])cube(r,'#213b49',.85,1,z,.05,1.3,.6);cube(r,'#a3cad1',.88,1.2,-1.45,.03,.82,.46);board(r,route.id==='bund'?'滨江环线':'陆家嘴',0,1.87,-2.47,1.35,.24);const lights=[-.54,.54].map(x=>cube(r,'#fff4ae',x,.66,-2.48,.24,.17,.06,true));const t=80+i*route.samples.lengthMeters/2;return {root:r,lights,route:route.samples,t:t%route.samples.lengthMeters,dir:1,lane:2.2,speed:2.6,halfLength:2.45,halfWidth:.93,height:2.1,kind:'bus',stopD:80,stopCooldown:0,dwell:0,crossings:routeCrossings(route.samples,signals)};}
 for(const route of CAR_ROUTES.filter(r=>['bund','pudong'].includes(r.id)))for(let i=0;i<2;i++)buses.push(bus(route,i));
 // Follow the street block around instead of turning across both live traffic lanes.
 const rear=CAR_ROUTES.find(r=>r.id==='bund').samples;
 const outer=CAR_ROUTES.find(r=>r.id==='lujiazui').samples;
 // Painted cycle lanes sit beside the motor lanes; markings add no physical barriers.
 for(const route of [rear,outer]){
  const count=Math.ceil(route.lengthMeters/2),paint=new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1,1),mat('#426b62'),count),edge=new THREE.InstancedMesh(new THREE.PlaneGeometry(.07,.8),mat('#c4dcc3'),count),stamp=new THREE.Object3D();
  paint.name='curb-cycle-lane';edge.name='cycle-lane-divider';
  for(let i=0;i<count;i++){const d=i*2,a=routePose(route,d,4),b=routePose(route,Math.min(d+2,route.lengthMeters-.001),4);stamp.position.set((a.x+b.x)/2+.5,26.065,(a.z+b.z)/2+.5);stamp.rotation.set(-Math.PI/2,0,-Math.atan2(b.x-a.x,b.z-a.z));stamp.scale.set(1,Math.max(.1,Math.hypot(b.x-a.x,b.z-a.z)),1);stamp.updateMatrix();paint.setMatrixAt(i,stamp.matrix);const p=routePose(route,d,3.4);stamp.position.set(p.x+.5,26.075,p.z+.5);stamp.scale.set(1,1,1);stamp.updateMatrix();edge.setMatrixAt(i,stamp.matrix);}
  for(const mesh of [paint,edge]){mesh.userData.range=285;mesh.computeBoundingSphere();root.add(mesh);}
 }
 function rider(route,i){
  const seedIndex=i+(route===outer?5:0),delivery=i>0,color=delivery?(i%2?'#f6c74b':'#55acd4'):'#af7968',r=new THREE.Group();r.name=delivery?'delivery-scooter':'city-bicycle';root.add(r);const wheels=[];
  for(const z of [-.65,.65]){const wheel=new THREE.Mesh(delivery?new THREE.CylinderGeometry(.29,.29,.22,12).rotateX(Math.PI/2):new THREE.TorusGeometry(.32,.055,5,12),mat('#263540'));wheel.rotation.y=Math.PI/2;wheel.position.set(0,.34,z);wheel.userData.range=200;r.add(wheel);wheels.push(wheel);cube(r,delivery?'#53616a':color,0,.52,z,.07,.45,.09);}
  if(delivery){
   r.userData.electric=true;
   // Step-through scooter: broad floorboard, battery body, fairing and rear delivery box.
   cube(r,'#303940',0,.53,-.17,.58,.16,1.08);cube(r,color,0,.76,.32,.48,.46,.55);cube(r,'#47535d',0,.93,.28,.5,.18,.66);
   const fairing=cube(r,color,0,.94,-.62,.55,.74,.25);fairing.rotation.x=-.17;cube(r,'#f0e8d2',0,1.16,-.79,.34,.15,.04,true);
   cube(r,'#536572',0,1.32,-.64,.07,.46,.07);cube(r,'#344350',0,1.48,-.62,.72,.08,.1);
   for(const side of [-1,1]){cube(r,'#53646b',side*.4,1.62,-.62,.045,.26,.045);cube(r,'#91b2bb',side*.4,1.76,-.62,.2,.12,.06);cube(r,'#344350',side*.21,.67,-.29,.2,.13,.46);}
   cube(r,color,0,1.17,.7,.7,.63,.65);cube(r,'#f4eee1',0,1.19,1.03,.5,.18,.026);board(r,'配送',0,1.2,1.049,.4,.14,Math.PI);
  }else{
   cube(r,color,0,.6,0,.12,.1,1.3);cube(r,color,0,.8,.22,.1,.6,.13);cube(r,'#273740',0,1.07,.15,.28,.08,.38);cube(r,'#546977',0,1.02,-.57,.06,.75,.07);cube(r,'#374957',0,1.37,-.6,.62,.07,.08);
  }
  const torso=cube(r,color,0,1.49,.1,.43,.52,.28),head=cube(r,'#e0b18a',0,1.92,.06,.31,.31,.3),hat=cube(r,delivery?color:'#3d3030',0,2.08,.06,delivery?.4:.32,delivery?.17:.09,.36),arms=[],legs=[];
  for(const x of [-.22,.22]){const arm=cube(r,color,x,1.47,-.23,.13,.47,.17);arm.rotation.x=-.8;arms.push(arm);if(delivery){const thigh=cube(r,'#415069',x*.68,1.04,-.04,.17,.5,.18);thigh.rotation.x=-.7;legs.push(thigh,cube(r,'#415069',x*.68,.84,-.28,.17,.32,.18));}else legs.push(cube(r,'#415069',x*.65,.87,.1,.16,.55,.18));}
  styleNpc({root:r,torso,head,hair:delivery?null:hat,arms,legs},seedIndex,delivery?'delivery':'visitor');
  const phase=trafficSeed(seedIndex,9)*Math.PI*2;
  return {root:r,wheels,route,t:route.lengthMeters*(i/5+trafficSeed(seedIndex,33)*.17),dir:1,lane:4,speed:(delivery?1.35:.95)+trafficSeed(seedIndex,12)*1.5,halfLength:1.06,halfWidth:.45,height:2.22,phase,kind:delivery?'delivery':'bicycle',crossings:routeCrossings(route,signals),deliveryD:route.lengthMeters*trafficSeed(seedIndex,47),deliveryDwell:0,deliveryCooldown:0};
 }
 for(const route of [rear,outer])for(let i=0;i<5;i++)riders.push(rider(route,i));
 for(const b of buses.filter((b,i)=>i%2===0)){const p=routePose(b.route,b.stopD,0),a=p.yaw;const x=p.x+Math.cos(a)*4.8,z=p.z-Math.sin(a)*4.8;if(!clearPoint(x,z))continue;const r=new THREE.Group();r.position.set(x,26,z);root.add(r);cube(r,'#73868b',0,1.4,0,.12,2.8,.12);board(r,'公交 · 滨江',0,2.9,0,2.2,.65,a);stops.push({root:r,route:b.route,d:b.stopD});}
 for(const c of cars)c.crossings=routeCrossings(c.route,signals);
 const agents=[...cars,...buses,...riders];agents.forEach((a,i)=>a.trafficId=i);let clock=0,first=0,junctionClock=-1,junctions=createJunctionControl(undefined,{getPose:junctionPose});
 function pose(c,t){const at=routePose(c.route,t,c.lane);at.x+=.5;at.z+=.5;if(c.kind==='bridge')at.y=nanpuFloor(world,at.x,at.z)??at.y;at.yaw+=c.dir<0?Math.PI:0;return at;}
 function junctionPose(c,d){
  if(!c.detour)return pose(c,c.t+c.dir*d);
  let p={...c.root.position,yaw:c.root.rotation.y};if(d<=0)return p;
  for(const q of c.detour.path){const length=Math.hypot(q.x-p.x,q.z-p.z),yaw=length>.001?Math.atan2(q.x-p.x,q.z-p.z)+Math.PI:p.yaw;if(d<=length)return {x:p.x+(q.x-p.x)*d/length,y:p.y,z:p.z+(q.z-p.z)*d/length,yaw};d-=length;p={...q,yaw};}return p;
 }
 function worldClear(c,p){for(const dx of [-c.halfWidth,0,c.halfWidth])for(const dz of [-c.halfLength,0,c.halfLength]){const x=p.x+dx*Math.cos(p.yaw)+dz*Math.sin(p.yaw),z=p.z-dx*Math.sin(p.yaw)+dz*Math.cos(p.yaw),h=nanpuFloor(world,x,z),y=h!==null&&Math.abs(h-p.y)<1.5?Math.ceil(h):p.y;if(world.get(Math.floor(x),Math.floor(y),Math.floor(z))||world.get(Math.floor(x),Math.floor(y)+1,Math.floor(z)))return false;}return true;}
 function setPose(c,p){c.root.position.set(p.x,p.y,p.z);c.root.rotation.order='YXZ';c.root.rotation.y=p.yaw;c.x=p.x-.5;c.z=p.z-.5;}
 // Complete-body checks verify lane 4 around both loops. Cars and buses use +/-2.2.
 // Do not silently move bicycles back to the centre of the carriageway.
 const spawnObstacles=[...getObstacles(),...officers.map(o=>({root:o.root,person:true}))];
 const placed=[];for(const [i,c]of agents.entries()){c.halfWidth??=.72;c.halfLength??=1.32;c.height??=1.3;c.phase??=trafficSeed(i,19)*Math.PI*2;c.currentSpeed=c.speed;c.waitTime=0;let at=pose(c,c.t);for(let attempt=0;attempt<Math.ceil(c.route.lengthMeters/3);attempt++){if(worldClear(c,at)&&junctions.spawnClear(at,c)&&![...placed,...spawnObstacles].some(o=>vehicleContact(c,at.x,at.y,at.z,at.yaw,o)))break;c.t=(c.t+3.3)%c.route.lengthMeters;at=pose(c,c.t);}setPose(c,at);placed.push(c);}
 function shiftLane(c,target,step,obstacles){const before=c.lane;c.lane+=THREE.MathUtils.clamp(target-before,-step*.85,step*.85);const at=pose(c,c.t);if(!worldClear(c,at)||[...agents,...obstacles].some(o=>vehicleContact(c,at.x,at.y,at.z,at.yaw,o))){c.lane=before;return false;}setPose(c,at);return true;}
 for(const c of agents){c.baseLane=c.lane;if(c.kind==='delivery'){for(let i=0;i<100&&!junctions.spawnClear(pose(c,c.deliveryD));i++)c.deliveryD=(c.deliveryD+4)%c.route.lengthMeters;}}
 function detourClear(c,p,obstacles){return junctions.permits(c,p)&&(c.route===outer?p.x>120:p.x<100&&Math.abs(p.z-66)>5)&&!!world.get(Math.floor(p.x),25,Math.floor(p.z))&&worldClear(c,p)&&![...agents,...obstacles].some(o=>vehicleContact(c,p.x,p.y,p.z,p.yaw,o));}
 const detourJobs=new Map();let detourObstacles=[];
 function requestDetour(c){if(!detourJobs.has(c))detourJobs.set(c,{start:{x:c.root.position.x,y:c.root.position.y,z:c.root.position.z},index:0,search:null});}
 function processDetours(){
  if(!detourJobs.size)return;detourObstacles=getObstacles().filter(o=>!o.root.userData.piloted);const start=performance.now();
  do{
   const [c,job]=detourJobs.entries().next().value;detourJobs.delete(c);
   if(c.waitTime<3||Math.hypot(c.root.position.x-job.start.x,c.root.position.z-job.start.z)>.75)continue;
   if(!job.search){
    if(job.index===4)continue;const distance=[12,18,24,32][job.index++];job.targetT=(c.t+c.dir*distance+c.route.lengthMeters)%c.route.lengthMeters;const goal=routePose(c.route,job.targetT,c.baseLane);goal.x+=.5;goal.z+=.5;
    if(detourClear(c,goal,detourObstacles))job.search=createTrafficDetour(job.start,goal,p=>detourClear(c,p,detourObstacles));
   }
   if(job.search?.step(1)){if(job.search.path){c.detour={path:job.search.path,targetT:job.targetT};continue;}job.search=null;}
   detourJobs.set(c,job);
  }while(detourJobs.size&&performance.now()-start<2);
 }
 function followDetour(c,step,obstacles){c.following=null;let travel=0,remaining=Math.min(c.speed,1.8)*step;while(remaining>1e-8&&c.detour.path.length){const target=c.detour.path[0],p=c.root.position,d=Math.hypot(target.x-p.x,target.z-p.z),length=Math.min(d,remaining,.12),yaw=d>.001?Math.atan2(target.x-p.x,target.z-p.z)+Math.PI:c.root.rotation.y;if(d<.001){c.detour.path.shift();continue;}const at={x:p.x+(target.x-p.x)/d*length,y:p.y,z:p.z+(target.z-p.z)/d*length,yaw};if(!detourClear(c,at,obstacles)){c.following=agents.find(o=>vehicleContact(c,at.x,at.y,at.z,at.yaw,o))??null;break;}setPose(c,at);travel+=length;remaining-=length;if(d<=length+.001)c.detour.path.shift();}
  c.travelSpeed=travel/step;c.waitReason=travel?'':'obstacle';c.waitTime=travel?0:c.waitTime+step;for(const wheel of c.wheels??[])wheel.rotation.z-=travel/.32;
  if(!c.detour.path.length){c.t=c.detour.targetT;c.lane=c.baseLane;delete c.detour;delete c.avoidLane;c.progressSinceWait=0;}else if(c.waitTime>3){c.detour.recheck=(c.detour.recheck??0)-step;if(c.detour.recheck<=0){c.detour.recheck=4;requestDetour(c);}}
 }
 function reverseYield(c,step,obstacles){const state=c.yielding;state.age+=step;c.currentSpeed=0;c.travelSpeed=0;c.following=null;c.waitReason='yield';
  // Keep the wheels straight while backing out. Rewinding a tightly curved
  // route rotates the front into the other vehicle and prevents any retreat.
  let p,distance=0;const at=c.root.position;
  if(state.returning){const dx=state.anchor.x-at.x,dz=state.anchor.z-at.z,length=Math.hypot(dx,dz);if(length<.01){setPose(c,state.anchor);delete c.yielding;c.waitTime=0;c.progressSinceWait=0;c.waitReason='';return;}distance=Math.min(length,step*1.5);p={x:at.x+dx/length*distance,y:at.y,z:at.z+dz/length*distance,yaw:state.anchor.yaw};}
  else if(state.remaining>0){distance=Math.min(state.remaining,step*1.1);p={x:at.x+Math.sin(state.anchor.yaw)*distance,y:at.y,z:at.z+Math.cos(state.anchor.yaw)*distance,yaw:state.anchor.yaw};}
  if(p){const floor=nanpuFloor(world,p.x,p.z);if(floor!==null&&Math.abs(floor-p.y)<1.5)p.y=floor;if(worldClear(c,p)&&![...agents,...obstacles].some(o=>vehicleContact(c,p.x,p.y,p.z,p.yaw,o))){setPose(c,p);if(!state.returning)state.remaining-=distance;c.travelSpeed=distance/step*(state.returning?1:-1);for(const wheel of c.wheels??[])wheel.rotation.z-=c.travelSpeed*step/.32;}}
  const other=state.other,clear=Math.hypot(other.root.position.x-state.start.x,other.root.position.z-state.start.z)>6;
  if(clear||state.age>12)state.returning=true;c.waitTime+=step;
 }
 function advance(step){clock+=step;if(clock>=junctionClock){junctions.update(agents);junctionClock=clock+.2;}
  const playerPos=getPos?getPos():null;
  const obstacles=getObstacles().filter(o=>!o.root.userData.piloted);
  const playerRiding=playerPos&&agents.some(a=>Math.hypot(playerPos.x-a.root.position.x,playerPos.z-a.root.position.z)<=(a.halfLength??1.5)+.6);
  const playerCrossing=!playerRiding&&playerPos&&playerPos.y>=25&&playerPos.y<=28&&playerPos.x>=12.0&&playerPos.x<=24.0&&Math.abs(playerPos.z-66)<=4.2;
  const pedCrossing=obstacles.some(o=>{const p=o.root?.position;return p&&p.x>=12.0&&p.x<=24.0&&Math.abs(p.z-66)<=4.2;});
  const crosswalkOccupied=playerCrossing||pedCrossing;
  const allObstacles=!playerRiding&&playerPos&&playerPos.y>=25&&playerPos.y<=28?[...obstacles,{root:{position:playerPos},person:true,height:1.85}]:obstacles;
  for(let i=0;i<agents.length;i++){const c=agents[(i+first)%agents.length];
   if(c.yielding){reverseYield(c,step,obstacles);continue;}
   // If two different turns have already met, one driver backs up physically
   // and hands over its junction ticket. Collision guards still apply while
   // reversing; queues and red lights alone never trigger this recovery.
   if(!['delivery','bicycle'].includes(c.kind)&&['obstacle','traffic','junction'].includes(c.waitReason)&&c.waitTime>8){const p=pose(c,c.t+c.dir*.15),other=agents.find(o=>vehicleContact(c,p.x,p.y,p.z,p.yaw,o)&&o.waitTime>2);if(other&&(['delivery','bicycle'].includes(other.kind)||c.trafficId>other.trafficId)){c.yielding={other,remaining:3,age:0,start:other.root.position.clone(),anchor:pose(c,c.t)};c.yieldCount=(c.yieldCount??0)+1;junctions.yieldTo(c,other);reverseYield(c,step,obstacles);continue;}}
   if(c.detour){followDetour(c,step,obstacles);continue;}
   c.detourCooldown=Math.max(0,(c.detourCooldown??0)-step);
   if(['delivery','bicycle'].includes(c.kind)&&c.waitTime>6&&!c.detourCooldown&&['obstacle','traffic'].includes(c.waitReason)){
    const red=(c.crossings??[]).some(cross=>signalPhase(clock,cross.signal.offset)[cross.axis]!=='green'&&Math.abs(forwardDistance(c.t,cross.d,c.route.lengthMeters,c.dir)-6-c.halfLength)<1);
    if(!red){c.detourCooldown=8;requestDetour(c);if(c.detour){followDetour(c,step,obstacles);continue;}}
   }
   if(['delivery','bicycle'].includes(c.kind)){
    const stopAhead=c.kind==='delivery'&&!c.deliveryCooldown&&forwardDistance(c.t,c.deliveryD,c.route.lengthMeters,c.dir)<4;
    if(stopAhead||c.deliveryDwell>0)shiftLane(c,c.baseLane+.7,step,obstacles);
    else if(c.avoidLane!==undefined&&forwardDistance(c.avoidStart,c.t,c.route.lengthMeters,c.dir)<8){const shifted=shiftLane(c,c.avoidLane,step,obstacles);if(shifted&&!(c.waitTime>3&&Math.abs(c.lane-c.avoidLane)<.02))c.avoidBlocked=0;else{c.avoidBlocked=(c.avoidBlocked??0)+step;if(c.avoidBlocked>2){c.avoidLane=c.baseLane-(c.avoidLane-c.baseLane);c.avoidBlocked=0;}}}
    else if(c.waitTime>3&&['obstacle','traffic'].includes(c.waitReason)&&!(c.crossings??[]).some(cross=>signalPhase(clock,cross.signal.offset)[cross.axis]!=='green'&&forwardDistance(c.t,cross.d,c.route.lengthMeters,c.dir)>=6+c.halfLength-.1&&forwardDistance(c.t,cross.d,c.route.lengthMeters,c.dir)<7+c.halfLength)){
     for(const delta of [1.3,-1.3]){const old=c.lane;c.lane=c.baseLane+delta;const ahead=pose(c,c.t+c.dir*3);c.lane=old;if(worldClear(c,ahead)&&![...agents,...obstacles].some(o=>vehicleContact(c,ahead.x,ahead.y,ahead.z,ahead.yaw,o))){c.avoidLane=c.baseLane+delta;c.avoidStart=c.t;shiftLane(c,c.avoidLane,step,obstacles);break;}}
    }else if(c.waitTime<.1&&Math.abs(c.lane-c.baseLane)>.02)shiftLane(c,c.baseLane,step,obstacles);
   }
   const ahead=pose(c,c.t+c.dir*3),bend=Math.abs(Math.atan2(Math.sin(ahead.yaw-c.root.rotation.y),Math.cos(ahead.yaw-c.root.rotation.y))),target=c.speed*(.91+.09*Math.sin(clock*.19+c.phase))*(bend>.35?.65:1);c.currentSpeed=THREE.MathUtils.damp(c.currentSpeed,target,2,step);c.following=null;let travel=trafficTravel(c,step,clock,agents,pose,o=>{c.following=o;},crosswalkOccupied);if(travel<1e-6){travel=0;c.waitReason='traffic';}
   if(c.kind==='bus'){c.stopCooldown=Math.max(0,c.stopCooldown-step);if(c.dwell>0){c.dwell=Math.max(0,c.dwell-step);travel=0;}else if(!c.stopCooldown){const gap=forwardDistance(c.t,c.stopD,c.route.lengthMeters,c.dir);if(gap<=travel+.03){travel=gap;c.dwell=6+(c.phase%1)*1.5;c.stopCooldown=14;}}}
   if(c.kind==='delivery'){
    c.deliveryCooldown=Math.max(0,c.deliveryCooldown-step);
    if(c.deliveryDwell>0){c.deliveryDwell=Math.max(0,c.deliveryDwell-step);travel=0;c.waitReason='delivery';}
    else if(!c.deliveryCooldown){const gap=forwardDistance(c.t,c.deliveryD,c.route.lengthMeters,c.dir);if(gap<=travel+.03){if(c.lane-c.baseLane>.5){travel=gap;c.deliveryDwell=3.5+(c.phase%1)*5;c.waitReason='delivery';}c.deliveryCooldown=c.route.lengthMeters/c.speed*.65;}}
   }
   let t=(c.t+c.dir*travel+c.route.lengthMeters)%c.route.lengthMeters,at=pose(c,t);
   // A lane offset travels a longer arc than the centreline on tight bends.
   // Limit the rider's actual displacement instead of jumping around that arc.
   if(['delivery','bicycle'].includes(c.kind)&&travel>0){const p=c.root.position,budget=c.currentSpeed*step*1.15;if(Math.hypot(at.x-p.x,at.z-p.z)>budget){let low=0,high=travel;for(let k=0;k<10;k++){const mid=(low+high)/2,q=pose(c,c.t+c.dir*mid);if(Math.hypot(q.x-p.x,q.z-p.z)<=budget)low=mid;else high=mid;}travel=low;t=(c.t+c.dir*travel+c.route.lengthMeters)%c.route.lengthMeters;at=pose(c,t);}}
   const permitted=junctions.permits(c,at);if(travel>0&&(!permitted||!worldClear(c,at)||[...agents,...allObstacles].some(o=>vehicleContact(c,at.x,at.y,at.z,at.yaw,o)))){travel=0;c.waitReason=permitted?'obstacle':'junction';c.currentSpeed=THREE.MathUtils.damp(c.currentSpeed,0,12,step);}else{c.t=t;setPose(c,at);}c.waitTime+=step;c.progressSinceWait=(c.progressSinceWait??0)+travel;if(c.progressSinceWait>.5){c.waitTime=0;c.progressSinceWait=0;c.waitReason='';}c.travelSpeed=travel/step;for(const wheel of c.wheels??[])wheel.rotation.z-=travel/.32;
  }first=(first+1)%agents.length;
 }
 function tick(dt,{night=false,rain=0}={}){if(dt>0)processDetours();let remaining=dt;const travelled=new Map(agents.map(c=>[c,0]));while(remaining>1e-8){const step=Math.min(remaining,1/30);remaining-=step;advance(step);for(const c of agents)travelled.set(c,travelled.get(c)+c.travelSpeed*step);}if(dt>0)for(const c of agents)c.travelSpeed=travelled.get(c)/dt;for(const s of signals){const phase=signalPhase(clock,s.offset);for(const head of s.heads){const status=phase[head.axis];head.lamps.forEach((m,i)=>m.material=mat(i===['red','amber','green'].indexOf(status)?['#ff514c','#ffc85b','#51fba9'][i]:'#263638',true));const value=String(phase.remaining);if(head.counter.value!==value){const {ctx,texture}=head.counter;ctx.fillStyle='#112332';ctx.fillRect(0,0,256,64);ctx.fillStyle=status==='red'?'#ff6b61':'#a7edc5';ctx.fillText(value,128,43);texture.needsUpdate=true;head.counter.value=value;}}}
  for(const c of agents)for(const light of c.lights??[])light.visible=night||rain>.2;
  for(const o of officers){o.arm.rotation.x=signalPhase(clock,o.signal.offset).ns==='green'?-Math.PI/2:-.15;o.root.rotation.y=Math.PI/2;}
 }
 for(const b of buses)if(forwardDistance(b.t,b.stopD,b.route.lengthMeters,b.dir)<.03){b.dwell=6+(b.phase%1)*1.5;b.stopCooldown=14;}
 tick(0,{});
 return {tick,buses,riders,signals,officers,stops,agents,junctions,get time(){return clock;},collides:(x,y,z)=>[...buses,...riders].some(c=>{if(y>=c.root.position.y+c.height||y+1.75<=c.root.position.y)return false;const dx=x-c.root.position.x,dz=z-c.root.position.z,a=c.root.rotation.y;return Math.abs(dx*Math.cos(a)-dz*Math.sin(a))<c.halfWidth+.29&&Math.abs(dx*Math.sin(a)+dz*Math.cos(a))<c.halfLength+.29;})};
}
