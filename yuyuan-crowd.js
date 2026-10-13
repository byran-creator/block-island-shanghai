import * as THREE from './three.module.js';
import {styleNpc} from './npc-appearance.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {YUYUAN_SHIFT,INNER_GARDEN_EAST_PATH} from './yuyuan-layout.js';

// One-way street circuits distribute visitors around the shops. The quiet
// inner circuit stays behind the ticket walls and never walks through a gate.
export function createYuyuanCrowd({scene,world,blocked}){
 const people=[],cache=new Map(),geo=new THREE.BoxGeometry(1,1,1),mats=new Map();
 const mat=c=>{if(!mats.has(c))mats.set(c,new THREE.MeshLambertMaterial({color:c}));return mats.get(c);};
 const clear=(x,z)=>{const key=x+','+z;if(!cache.has(key))cache.set(key,!!world.get(Math.floor(x),25,Math.floor(z))&&!blocked(x,26,z));return cache.get(key);};
 const step=.5,key=p=>p[0]+','+p[1];
 function nearest(p){for(let r=0;r<=4;r+=step)for(let dx=-r;dx<=r;dx+=step)for(let dz=-r;dz<=r;dz+=step){const q=[Math.round((p[0]+dx)*2)/2,Math.round((p[1]+dz)*2)/2];if(clear(...q))return q;}throw Error('No supported garden visitor start');}
 function path(start,end){const queue=[start],seen=new Set([key(start)]),parents=new Map();let finish;
  for(let i=0;i<queue.length;i++){const p=queue[i];if(key(p)===key(end)){finish=p;break;}for(const [dx,dz]of [[step,0],[-step,0],[0,step],[0,-step]]){const q=[p[0]+dx,p[1]+dz],k=key(q);if(seen.has(k)||q[0]<-78||q[0]>17||q[1]<215||q[1]>303.5||!clear(...q)||!clear(p[0]+dx/2,p[1]+dz/2))continue;seen.add(k);parents.set(k,p);queue.push(q);}}
  if(!finish)throw Error('Garden visitor circuit is blocked');const result=[];while(finish){result.push(finish);finish=parents.get(key(finish));}return result.reverse();
 }
 function circuit(local,count,firstId){const waypoints=local.map(([x,z])=>nearest([x,z+YUYUAN_SHIFT])),points=[];for(let i=1;i<waypoints.length;i++)points.push(...path(waypoints[i-1],waypoints[i]).slice(i===1?0:1));
  // Remove detours that retrace an already visited grid point. These spikes
  // otherwise send walkers head-on along the same branch of a street circuit.
  const simple=[],indices=new Map();for(const p of points){const k=key(p);if(indices.has(k)&&!(k===key(points[0])&&p===points.at(-1))){const index=indices.get(k);while(simple.length>index+1)indices.delete(key(simple.pop()));}else{indices.set(k,simple.length);simple.push(p);}}
  points.splice(0,points.length,...simple);
  const parts=[];let length=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);parts.push({a,b,d,start:length});length+=d;}
  function pose(distance){const d=(distance%length+length)%length,part=parts.find(p=>d<=p.start+p.d)??parts.at(-1),t=(d-part.start)/part.d;return {x:part.a[0]+t*(part.b[0]-part.a[0]),z:part.a[1]+t*(part.b[1]-part.a[1]),yaw:Math.atan2(part.b[0]-part.a[0],part.b[1]-part.a[1])+Math.PI};}
  for(let i=0;i<count;i++){const id=firstId+i,root=new THREE.Group(),color=['#8b6579','#627e92','#a48a5e','#62907b','#a87c67'][id%5];scene.add(root);
   function box(parent,c,x,y,z,w,h,d){const m=new THREE.Mesh(geo,mat(c));m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}
   const torso=box(root,color,0,1.05,0,.43,.7,.3),head=box(root,'#d3a982',0,1.57,0,.34,.35,.32),hair=box(root,'#3d302b',0,1.76,0,.35,.08,.33),arms=[],legs=[];
   for(const side of [-1,1]){const arm=new THREE.Group(),leg=new THREE.Group();arm.position.set(side*.28,1.26,0);leg.position.set(side*.12,.75,0);box(arm,color,0,-.24,0,.13,.51,.18);box(leg,'#424547',0,-.37,0,.17,.74,.22);root.add(arm,leg);arms.push(arm);legs.push(leg);}
   styleNpc({root,torso,head,hair,arms,legs},id,'visitor');batchMeshes(root,staticMeshes(root,new Set([...arms,...legs])),'yuyuan-street-person');
   const d=(i+.37)*length/count,q=pose(d);root.position.set(q.x,26,q.z);root.rotation.y=q.yaw;people.push({root,person:true,d,pose,length,speed:.72+(id*13%7)*.07,travel:0,wait:0,pause:0,arms,legs,inner:firstId===400,npcRole:i%5===0?'逛老城的游客':undefined,guide:{intro:'外侧商街很热闹，内园安静些。月洞门旁领取游戏体验票，再检票进去看假山和锦鲤。',choices:[['哪里可以逛店？','东侧连续的木窗店面和南侧老城商街都能进去，靠近柜台按 V。']]}});
  }
 }
 // Skip this decorative crowd on an incomplete/custom world, retaining the
 // existing district services. Standard world routes are checked by tests.
 try{circuit([[4.75,155.5],[6.4,155.5],[6.4,241],[4.75,241],[4.75,155.5]],14,300);circuit([[-56,157],[-44,157],[-44,168],[-56,168],[-56,157]],6,350);const inner=INNER_GARDEN_EAST_PATH.slice(1,-1);circuit([...inner,inner[0]],3,400);}catch{for(const a of people)a.root.removeFromParent();people.length=0;}
 return {people,tick(dt){if(dt<=0)return;for(const a of people){if(a.pause>0){a.pause=Math.max(0,a.pause-dt);continue;}const d=(a.d+a.speed*dt)%a.length,q=a.pose(d),p=a.root.position,free=!blocked(q.x,26,q.z)&&!people.some(b=>b!==a&&Math.hypot(q.x-b.root.position.x,q.z-b.root.position.z)<.65);
   if(free){a.travel+=Math.hypot(q.x-p.x,q.z-p.z);a.d=d;p.set(q.x,26,q.z);const angle=Math.atan2(Math.sin(q.yaw-a.root.rotation.y),Math.cos(q.yaw-a.root.rotation.y));a.root.rotation.y+=angle*(1-Math.exp(-5*dt));a.wait=0;}else a.wait+=dt;
   const swing=free?Math.sin(a.travel*5+a.d)*.28:0;for(let i=0;i<2;i++){a.arms[i].rotation.x=THREE.MathUtils.damp(a.arms[i].rotation.x,(i?1:-1)*swing,8,dt);a.legs[i].rotation.x=THREE.MathUtils.damp(a.legs[i].rotation.x,(i?-1:1)*swing,8,dt);}
  }}};
}
