import {styleNpc} from './npc-appearance.js';
import * as THREE from './three.module.js';
import {ALL_BUILDINGS,buildingEntrance} from './city-layout.js';
import {overlaps} from './world.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {pedestrianBlocked,pedestrianStepClear} from './pedestrian-traffic.js';

const fraction=(n)=>{const s=Math.sin(n*78.233+19.19)*43758.5453;return s-Math.floor(s);};
export function residentRoutes(world){
 const routes=[];for(const bank of ['west','east']){const candidates=ALL_BUILDINGS.filter(b=>b.bank===bank&&b.z>0&&b.z<202&&!b.shop&&!['convention','mall'].includes(b.kind));
  for(let i=0;i<candidates.length&&routes.filter(r=>r.bank===bank).length<9;i++){const b=candidates[(i*17)%candidates.length];if(routes.some(r=>r.id===b.id)||routes.some(r=>r.bank===bank&&Math.hypot(r.x-b.x,r.z-b.z)<16))continue;const side=b.entranceSide??1,axis=b.entranceAxis==='z'?'z':'x',door=buildingEntrance(b,-1.3),outside=buildingEntrance(b,2.5),last={...outside};last[axis==='x'?'z':'x']+=fraction(i)> .5?4:-4;
   const points=[door,outside,last];let clear=true;for(let k=1;k<points.length;k++){const a=points[k-1],c=points[k],length=Math.hypot(c.x-a.x,c.z-a.z);for(let t=0;t<=length;t+=.2){const u=t/length,x=a.x+(c.x-a.x)*u,z=a.z+(c.z-a.z)*u;if(overlaps(world,x,26,z)||!overlaps(world,x,25.9,z)){clear=false;break;}}}
   if(clear)routes.push({...b,points,side,axis});
  }
 }return routes;
}
export function createBuildingResidents({scene,world,getPos,getVehicles=()=>[]}){
 const root=new THREE.Group();root.name='building-residents';scene.add(root);const people=[],geometry=new THREE.BoxGeometry(1,1,1),materials=new Map();let clock=0;
 function part(parent,color,x,y,z,w,h,d){if(!materials.has(color))materials.set(color,new THREE.MeshLambertMaterial({color}));const m=new THREE.Mesh(geometry,materials.get(color));m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}
 for(const [i,b]of residentRoutes(world).entries()){const r=new THREE.Group(),office=['glass','steps','gold'].includes(b.kind),shirt=office?['#7e9eb6','#c7cad0','#687e98'][i%3]:['#b8816f','#89aa87','#9d8da9'][i%3];r.name='resident-'+b.id;root.add(r);part(r,shirt,0,1.05,0,.45,.65,.3);part(r,'#deb592',0,1.58,0,.33,.35,.33);part(r,'#343537',0,1.79,0,.36,.1,.35);if(office){part(r,'#e6e4da',0,1.15,-.16,.08,.34,.02);part(r,'#514839',.34,.68,0,.16,.35,.42);}else part(r,'#c4ad82',.34,.7,0,.18,.4,.3);
  const legs=[];for(const side of [-1,1]){part(r,shirt,side*.3,1.04,0,.13,.55,.18);const leg=new THREE.Group();leg.position.set(side*.12,.7,0);part(leg,'#435365',0,-.33,0,.17,.66,.22);r.add(leg);legs.push(leg);}styleNpc({root:r,torso:r.children[0],head:r.children[1],hair:r.children[2],arms:r.children.filter(m=>m.isMesh&&Math.abs(m.position.x)>.28&&Math.abs(m.position.x)<.32&&m.scale.y>.5),legs},i,office?'office':'resident');batchMeshes(r,staticMeshes(r,new Set(legs)),'resident-body');
  const p={root:r,person:true,npcRole:office?'楼宇职员':'附近住户',building:b.id,bank:b.bank,route:b.points,phase:fraction(i+37)*150,speed:.65+fraction(i+8)*.4,legs,guide:{intro:office?'我就在这栋楼工作，午休会出来走一走。':'我住在附近，出门买些东西，晚点就回家。',choices:[['附近怎么出行？','按 M 打开地图可去地铁、渡口和主要景点。自行车或汽车靠近按 V，公交要等停稳。'],['能在这里住下吗？','地图里有“我的外滩总统套房”和“我的汤臣一品江景套房”，床边按 V 可以休息。']]}};people.push(p);
 }
 function tick(dt){clock+=dt;const viewer=getPos(),vehicles=getVehicles();for(const [i,p]of people.entries()){const route=p.route,length=route.slice(1).reduce((sum,a,j)=>sum+Math.hypot(a.x-route[j].x,a.z-route[j].z),0),walk=length/p.speed,inside=35+fraction(i)*35,outside=12+fraction(i+10)*22,cycle=inside+2*walk+outside,t=(clock+p.phase-(p.delay??0))%cycle;
   let distance=0,moving=false,returning=false;p.state='inside';if(t>=inside&&t<inside+walk){distance=(t-inside)*p.speed;moving=true;p.state='leaving';}else if(t>=inside+walk&&t<inside+walk+outside){distance=length;p.state='outside';}else if(t>=inside+walk+outside){distance=length-(t-inside-walk-outside)*p.speed;moving=true;returning=true;p.state='returning';}
   let point=route[0],yaw=0;for(let k=1;k<route.length;k++){const a=route[k-1],b=route[k],span=Math.hypot(b.x-a.x,b.z-a.z),u=Math.min(1,Math.max(0,distance/span));point={x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u};yaw=Math.atan2(b.x-a.x,b.z-a.z)+(returning?0:Math.PI);if(distance<=span)break;distance-=span;}
   const target={...point,y:26},clear=p.ready?pedestrianStepClear(p.root.position,target,vehicles):!pedestrianBlocked(target,vehicles);if(clear){p.root.position.set(point.x,26,point.z);p.root.rotation.y=yaw;p.ready=true;}else{p.delay=(p.delay??0)+dt;moving=false;}p.root.visible=p.ready&&p.state!=='inside'&&Math.hypot(p.root.position.x-viewer.x,p.root.position.z-viewer.z)<110;for(const [j,leg]of p.legs.entries())leg.rotation.x=moving?Math.sin(clock*5+p.phase)*.3*(j?-1:1):0;
  }}tick(0);return {root,people,tick};
}
