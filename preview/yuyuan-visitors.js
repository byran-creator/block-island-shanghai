import * as THREE from './three.module.js';
import {overlaps} from './world.js';
import {styleNpc} from './npc-appearance.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {pedestrianStepClear} from './pedestrian-traffic.js';
import {yuyuanWalkRoute} from './yuyuan-access.js';
export function createYuyuanVisitors({scene,world,getVehicles=()=>[],blocked=(x,y,z)=>overlaps(world,x,y,z)}){
 // Separate offset paths join around the ends. A closed walking loop avoids
 // opposing walkers swapping lanes in place or cutting back into a follower.
 const centerPoints=yuyuanWalkRoute(world),offset=sign=>centerPoints.map((p,i)=>{const a=centerPoints[Math.max(0,i-1)],b=centerPoints[Math.min(centerPoints.length-1,i+1)],prev=[p[0]-a[0],p[1]-a[1]],next=[b[0]-p[0],b[1]-p[1]],n=v=>{const d=Math.hypot(...v)||1;return [v[1]/d,-v[0]/d];};let u=n(prev),v=n(next);if(i===0)u=v;if(i===centerPoints.length-1)v=u;const dot=1+u[0]*v[0]+u[1]*v[1];return [p[0]+sign*.85*(u[0]+v[0])/dot,p[1]+sign*.65*(u[1]+v[1])/dot];});
 const outward=offset(1),back=offset(-1).reverse(),turn=(p,a)=>{const dx=p[0]-a[0],dz=p[1]-a[1],n=Math.hypot(dx,dz),out=[];for(let i=1;i<8;i++){const t=i*Math.PI/8;out.push([p[0]+.85*(dz*Math.cos(t)+dx*Math.sin(t))/n,p[1]+.85*(-dx*Math.cos(t)+dz*Math.sin(t))/n]);}return out;},points=[...outward,...turn(centerPoints.at(-1),centerPoints.at(-2)),...back,...turn(centerPoints[0],centerPoints[1]),outward[0]],parts=[];let length=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);parts.push({a,b,d,start:length});length+=d;}
 const box=new THREE.BoxGeometry(1,1,1),mats=new Map(),people=[];
 const mat=color=>{if(!mats.has(color))mats.set(color,new THREE.MeshLambertMaterial({color}));return mats.get(color);};
 function cube(r,color,x,y,z,w,h,d){const m=new THREE.Mesh(box,mat(color));m.position.set(x,y,z);m.scale.set(w,h,d);r.add(m);return m;}
 function center(d){const part=parts.find(p=>d<=p.start+p.d)??parts.at(-1),u=Math.max(0,Math.min(1,(d-part.start)/part.d));return {x:part.a[0]+u*(part.b[0]-part.a[0]),z:part.a[1]+u*(part.b[1]-part.a[1])};}
 function pose(d){const p=center(d),a=center(Math.max(0,d-.35)),b=center(Math.min(length,d+.35));return {...p,y:26,yaw:Math.atan2(b.x-a.x,b.z-a.z)+Math.PI};}
 for(let i=0;i<12;i++){const r=new THREE.Group();r.name='nanjing-yuyuan-visitor-'+i;scene.add(r);const color=['#b47785','#829bab','#a4a16e','#c38f65','#627a6b'][i%5],torso=cube(r,color,0,1.06,0,.43,.68,.3),head=cube(r,'#d6aa82',0,1.57,0,.33,.35,.32),hair=cube(r,'#40302a',0,1.76,0,.35,.08,.34),limbs=[],arms=[],legs=[];
  for(const side of [-1,1]){const arm=new THREE.Group(),leg=new THREE.Group();arm.position.set(side*.28,1.25,0);leg.position.set(side*.12,.74,0);cube(arm,color,0,-.23,0,.13,.5,.18);cube(leg,'#3c4546',0,-.36,0,.17,.72,.22);r.add(arm,leg);arms.push(arm);legs.push(leg);limbs.push(arm,leg);}styleNpc({root:r,torso,head,hair,arms,legs},210+i,'visitor');batchMeshes(r,staticMeshes(r,new Set(limbs)),'tourist-body');
  const dir=1,d=length*(i+.35)/12,p=pose(d);r.position.set(p.x,p.y,p.z);r.rotation.y=p.yaw;people.push({root:r,person:true,dir,d,lane:dir*.65,speed:.82+(i*37%11)*.065,phase:i*2.43,wait:0,pause:0,travel:0,arms,legs,npcRole:i%3===0?'逛豫园的游客':undefined,guide:{intro:'我沿南京路石碑旁的街道和巷道走过来，准备去湖心亭喝茶，再看看小笼和灯谜。',choices:[['这条路去哪？','北边是南京路步行街，南边是豫园；地铁10号线也可在南京东路换乘。']]}});}
 function visitorOccupied(a,x,z){
  for(let i=0;i<people.length;i++){
   const b=people[i];
   if(b===a)continue;
   const bp=b.root.position;
   const dx=x-bp.x;
   if(dx>.65||dx<-.65)continue;
   const dz=z-bp.z;
   if(dz>.65||dz<-.65)continue;
   if(dx*dx+dz*dz<.4225)return true;
  }
  return false;
 }
 function tick(dt){const vehicles=getVehicles();for(const a of people){if(a.pause>0){a.pause=Math.max(0,a.pause-dt);for(const limb of [...a.arms,...a.legs])limb.rotation.x=THREE.MathUtils.damp(limb.rotation.x,0,8,dt);continue;}const next=(a.d+a.speed*dt)%length,q=pose(next),r=a.root.position;
   const clear=!blocked(q.x,q.y,q.z)&&world.get(Math.floor(q.x),25,Math.floor(q.z))&&pedestrianStepClear(r,q,vehicles)&&!visitorOccupied(a,q.x,q.z);
   if(clear){a.travel+=Math.hypot(q.x-r.x,q.z-r.z);a.d=next;r.set(q.x,q.y,q.z);const delta=Math.atan2(Math.sin(q.yaw-a.root.rotation.y),Math.cos(q.yaw-a.root.rotation.y));a.root.rotation.y+=delta*(1-Math.exp(-5*dt));a.wait=0;}else a.wait+=dt;
   const pace=clear?Math.sin(a.travel*5+a.phase)*.32:0;a.arms.forEach((l,i)=>l.rotation.x=THREE.MathUtils.damp(l.rotation.x,(i?1:-1)*pace,8,dt));a.legs.forEach((l,i)=>l.rotation.x=THREE.MathUtils.damp(l.rotation.x,(i?-1:1)*pace,8,dt));
   if(clear&&a.d<a.speed*dt){a.pause=2+(a.phase%2)*2;}
  }}
 return {people,tick};
}
