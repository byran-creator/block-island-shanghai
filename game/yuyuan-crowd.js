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
 function nearest(p,actor=null){for(let r=0;r<=4;r+=step)for(let dx=-r;dx<=r;dx+=step)for(let dz=-r;dz<=r;dz+=step){const q=[Math.round((p[0]+dx)*2)/2,Math.round((p[1]+dz)*2)/2];if(clear(...q)&&(!actor||!occupied(actor,...q)))return q;}throw Error('No supported garden visitor start');}
 function path(start,end,actor=null){const queue=[start],seen=new Set([key(start)]),parents=new Map();let finish;
  for(let i=0;i<queue.length;i++){const p=queue[i];if(key(p)===key(end)){finish=p;break;}for(const [dx,dz]of [[step,0],[-step,0],[0,step],[0,-step]]){const q=[p[0]+dx,p[1]+dz],k=key(q);if(seen.has(k)||q[0]<-120||q[0]>32||q[1]<206||q[1]>336||!clear(...q)||!clear(p[0]+dx/2,p[1]+dz/2)||actor&&occupied(actor,...q))continue;seen.add(k);parents.set(k,p);queue.push(q);}}
  if(!finish)throw Error('Garden visitor circuit is blocked');const result=[];while(finish){result.push(finish);finish=parents.get(key(finish));}return result.reverse();
 }
 function circuit(local,count,firstId){const waypoints=local.map(([x,z])=>nearest([x,z+YUYUAN_SHIFT])),points=[];for(let i=1;i<waypoints.length;i++)points.push(...path(waypoints[i-1],waypoints[i]).slice(i===1?0:1));
  // Remove detours that retrace an already visited grid point. These spikes
  // otherwise send walkers head-on along the same branch of a street circuit.
  const simple=[],indices=new Map();for(const p of points){const k=key(p);if(indices.has(k)&&!(k===key(points[0])&&p===points.at(-1))){const index=indices.get(k);while(simple.length>index+1)indices.delete(key(simple.pop()));}else{indices.set(k,simple.length);simple.push(p);}}
  points.splice(0,points.length,...simple);
  const parts=[];let length=0;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],d=Math.hypot(b[0]-a[0],b[1]-a[1]);parts.push({a,b,d,start:length});length+=d;}
  function pose(distance){const d=(distance%length+length)%length,part=parts.find(p=>d<=p.start+p.d)??parts.at(-1),t=(d-part.start)/part.d;return {x:part.a[0]+t*(part.b[0]-part.a[0]),z:part.a[1]+t*(part.b[1]-part.a[1]),yaw:Math.atan2(part.b[0]-part.a[0],part.b[1]-part.a[1])+Math.PI};}
  for(let i=0;i<count;i++){const id=firstId+i,root=new THREE.Group(),body=new THREE.Group(),color=['#8b6579','#627e92','#a48a5e','#62907b','#a87c67'][id%5];root.add(body);scene.add(root);
   function box(parent,c,x,y,z,w,h,d){const m=new THREE.Mesh(geo,mat(c));m.position.set(x,y,z);m.scale.set(w,h,d);parent.add(m);return m;}
   const torso=box(body,color,0,1.05,0,.43,.7,.3),head=box(body,'#d3a982',0,1.57,0,.34,.35,.32),hair=box(body,'#3d302b',0,1.76,0,.35,.08,.33),arms=[],legs=[];
   for(const side of [-1,1]){const arm=new THREE.Group(),leg=new THREE.Group();arm.position.set(side*.28,1.26,0);leg.position.set(side*.12,.75,0);box(arm,color,0,-.24,0,.13,.51,.18);box(leg,'#424547',0,-.37,0,.17,.74,.22);body.add(arm,leg);arms.push(arm);legs.push(leg);}
   styleNpc({root,torso,head,hair,arms,legs},id,'visitor');
   const lateral=firstId>=400?(((id%3)-1)*.12):(((id%5)-2)*.28);
   body.position.x=lateral;body.scale.setScalar(.94+(id%4)*.04);
   batchMeshes(body,staticMeshes(body,new Set([...arms,...legs])),'yuyuan-street-person');
   const d=(i+.15+(id*29%17)/24)*length/count,q=pose(d);root.position.set(q.x,26,q.z);root.rotation.y=q.yaw;people.push({root,body,person:true,d,pose,length,speed:.72+(id*13%7)*.07,travel:0,wait:0,pause:0,offset:0,phase:id*2.173,stride:4.1+(id%5)*.17,browseIn:12+(id*19%37),browseCount:0,detour:null,rerouteIn:0,arms,legs,inner:firstId>=400,npcRole:i%5===0?'逛老城的游客':undefined,guide:{intro:'外侧商街很热闹，内园安静些。月洞门旁领取游戏体验票，再检票进去看假山和锦鲤。',choices:[['哪里可以逛店？','东侧连续的木窗店面和南侧老城商街都能进去，靠近柜台按 V。']]}});
  }
 }
 // Independent circuits keep most visitors close to the public shops and
 // pond, while the three inner-garden walkers visit different garden rooms.
 let navigationError=null;
 function addCircuit(points,count,id){try{circuit(points,count,id);}catch(e){navigationError=e.message;}}
 addCircuit([[15,156],[18.5,156],[18.5,246],[15,246],[15,156]],24,300);
 addCircuit([[-99,156],[-94.5,156],[-94.5,246],[-99,246],[-99,156]],18,350);
 addCircuit([[-70,261],[-26,261],[-26,263],[-70,263],[-70,261]],12,370);
 addCircuit([[-68,168],[-65,168],[-65,192],[-68,192],[-68,168]],8,390);
 const inner=INNER_GARDEN_EAST_PATH.slice(1,-1);addCircuit([...inner,inner[0]],1,400);
 addCircuit([[-48,238],[-36,238],[-36,244],[-48,244],[-48,238]],1,410);
 addCircuit([[-70,202],[-64,202],[-64,214],[-70,214],[-70,202]],1,420);
 function staticClear(x,z){return !!world.get(Math.floor(x),25,Math.floor(z))&&!blocked(x,26,z);}
 function penetration(x,z){let volume=0;for(let ix=Math.floor(x-.29);ix<=Math.floor(x+.29);ix++)for(let iz=Math.floor(z-.29);iz<=Math.floor(z+.29);iz++)for(let iy=26;iy<=27;iy++)if(world.get(ix,iy,iz))volume+=Math.max(0,Math.min(x+.29,ix+1)-Math.max(x-.29,ix))*Math.max(0,Math.min(z+.29,iz+1)-Math.max(z-.29,iz))*(iy===26?1:.75);return volume;}
 function occupied(a,x,z){return people.some(b=>b!==a&&Math.hypot(x-b.root.position.x,z-b.root.position.z)<.65);}
 function stepTo(a,q,dt){const p=a.root.position,dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz),ratio=d?Math.min(1,a.speed*dt/d):0,x=p.x+dx*ratio,z=p.z+dz*ratio;
  if(!staticClear(x,z)||occupied(a,x,z))return false;
  a.travel+=Math.hypot(x-p.x,z-p.z);p.set(x,26,z);const angle=Math.atan2(Math.sin(q.yaw-a.root.rotation.y),Math.cos(q.yaw-a.root.rotation.y));a.root.rotation.y+=angle*(1-Math.exp(-4*dt));return true;
 }
 function routeStart(a){const p=[a.root.position.x,a.root.position.z],candidates=[];
  for(let dx=-2;dx<=2;dx+=.5)for(let dz=-2;dz<=2;dz+=.5)candidates.push([Math.round((p[0]+dx)*2)/2,Math.round((p[1]+dz)*2)/2]);
  candidates.sort((u,v)=>Math.hypot(u[0]-p[0],u[1]-p[1])-Math.hypot(v[0]-p[0],v[1]-p[1]));
  for(const q of candidates){if(!clear(...q)||occupied(a,...q))continue;for(const route of [[p,q],[p,[q[0],p[1]],q],[p,[p[0],q[1]],q]]){let valid=true;for(let i=1;i<route.length&&valid;i++){const u=route[i-1],v=route[i],n=Math.max(1,Math.ceil(Math.hypot(v[0]-u[0],v[1]-u[1])/.06));for(let j=1;j<=n;j++){const x=u[0]+(v[0]-u[0])*j/n,z=u[1]+(v[1]-u[1])*j/n;if(!staticClear(x,z)||occupied(a,x,z)){valid=false;break;}}}if(valid)return {start:q,connector:route};}}
  throw Error('No clear pedestrian detour connector');
 }
 function reroute(a){try{cache.clear();const {start,connector}=routeStart(a),endD=(a.d+6)%a.length,q=a.pose(endD),end=nearest([q.x,q.z],a),route=[...connector,...path(start,end,a).slice(1)];a.detour={points:route,index:0,endD};}catch{}a.rerouteIn=5;}
 function escapeNewBlock(a,dt,volume){const p=a.root.position;for(let r=.4;r<=2;r+=.4)for(const [dx,dz]of [[-r,0],[r,0],[0,-r],[0,r]]){const gx=p.x+dx,gz=p.z+dz;if(!staticClear(gx,gz)||occupied(a,gx,gz))continue;const d=Math.hypot(dx,dz),step=Math.min(d,a.speed*dt),x=p.x+dx/d*step,z=p.z+dz/d*step;if(occupied(a,x,z)||penetration(x,z)>volume+1e-7)continue;a.travel+=step;p.set(x,26,z);a.root.rotation.y=Math.atan2(dx,dz)+Math.PI;if(penetration(x,z)<1e-7){a.detour=null;reroute(a);}return true;}return false;}
 return {people,get navigationError(){return navigationError;},tick(dt){if(dt<=0)return;for(const a of people){a.rerouteIn=Math.max(0,a.rerouteIn-dt);let moved=false;
  const volume=staticClear(a.root.position.x,a.root.position.z)?0:penetration(a.root.position.x,a.root.position.z);
  // A player block can materialise around an existing NPC after save load or
  // construction. Walk out while reducing overlap, never erase it or teleport.
  if(volume>1e-7)moved=escapeNewBlock(a,dt,volume);
  else if(a.pause>0)a.pause=Math.max(0,a.pause-dt);
  else if(a.detour){const detour=a.detour,target=detour.points[detour.index],p=a.root.position,q={x:target[0],z:target[1],yaw:Math.atan2(target[0]-p.x,target[1]-p.z)+Math.PI};moved=stepTo(a,q,dt);if(Math.hypot(p.x-q.x,p.z-q.z)<.06){detour.index++;if(detour.index>=detour.points.length){a.d=detour.endD;a.detour=null;}}else if(!moved&&a.wait>3&&!a.rerouteIn)reroute(a);}
  else {const lead=people.find(b=>b!==a&&Math.hypot(b.root.position.x-a.root.position.x,b.root.position.z-a.root.position.z)<1.35);
   const currentSpeed=lead?Math.min(a.speed,lead.speed*.96):a.speed;
   const d=(a.d+currentSpeed*dt)%a.length,q=a.pose(d);
   if(!staticClear(q.x,q.z)){if(a.wait>.8&&!a.rerouteIn)reroute(a);}
   else {moved=stepTo(a,q,dt);if(moved)a.d=d;}
  }
  if(moved){a.wait=0;a.browseIn-=dt;if(a.browseIn<=0&&!people.some(b=>b!==a&&Math.hypot(a.root.position.x-b.root.position.x,a.root.position.z-b.root.position.z)<2.2)){a.pause=.8+(a.phase%1.9);a.browseCount++;a.browseIn=18+(a.phase*7%31);}}
  else if(!a.pause)a.wait+=dt;
  const swing=moved?Math.sin(a.travel*a.stride+a.phase)*.58:0;
  const armSwing=moved?Math.sin(a.travel*a.stride+a.phase)*.48:0;
  for(let i=0;i<2;i++){
   a.arms[i].rotation.x=THREE.MathUtils.damp(a.arms[i].rotation.x,(i?1:-1)*armSwing,10,dt);
   a.legs[i].rotation.x=THREE.MathUtils.damp(a.legs[i].rotation.x,(i?-1:1)*swing,10,dt);
  }
  if(a.body){
   a.body.position.y=moved?Math.abs(Math.sin(a.travel*a.stride+a.phase))*.045:0;
   a.body.rotation.y=moved?Math.sin(a.travel*a.stride+a.phase)*.06:0;
   a.body.rotation.z=moved?Math.sin(a.travel*a.stride+a.phase)*.035:0;
  }
 }}};

}
