import * as THREE from './three.module.js';
import {boatLocal,boatWorld,boatSupport} from './boat-support.js';
import {cruisePose,tickHuangpuCruise,cruiseFloorAt,CRUISE_DWELL,CRUISE_CYCLE} from './huangpu-cruises.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {styleNpc} from './npc-appearance.js';
import {createWorldCaption} from './world-caption.js';
const dockPose=cruisePose(0),dockRoot=new THREE.Group();dockRoot.position.set(dockPose.x,dockPose.y,dockPose.z);dockRoot.rotation.y=dockPose.yaw;
const entry=boatWorld(dockRoot,{x:1.7,z:4.8});
export const CRUISE_DOCK={x:42,y:26.04,z:entry.z,endX:61,entry,deck:23.36};
const box=new THREE.BoxGeometry(1,1,1),mats=new Map();
function cube(root,color,x,y,z,w,h,d){if(!mats.has(color))mats.set(color,new THREE.MeshLambertMaterial({color}));const m=new THREE.Mesh(box,mats.get(color));m.position.set(x,y,z);m.scale.set(w,h,d);m.userData.range=180;root.add(m);return m;}
function passenger(scene,i){const root=new THREE.Group(),torso=cube(root,'#729da8',0,1,0,.46,.62,.26),head=cube(root,'#e6b995',0,1.53,0,.35,.37,.33),arms=[],legs=[];for(const side of [-1,1]){const a=new THREE.Group(),l=new THREE.Group();a.position.set(side*.3,1.23,0);l.position.set(side*.12,.7,0);cube(a,'#729da8',0,-.24,0,.14,.55,.17);cube(l,'#435363',0,-.35,0,.17,.7,.19);root.add(a,l);arms.push(a);legs.push(l);}styleNpc({root,torso,head,arms,legs},i+2,'visitor');root.name='cruise-passenger-'+i;scene.add(root);return {root,arms,legs,person:true,ready:true,state:'waiting',slot:i,trips:0,phase:i*2,local:{x:0,z:0},pause:2+i*3};}
export function createCruiseService({scene,ships,getPos=()=>({x:0,y:26,z:0}),place=()=>{},setView=()=>{},notify=()=>{}}){
 const root=new THREE.Group(),bridge=new THREE.Group(),d=CRUISE_DOCK;root.name='huangpu-cruise-pier';bridge.name='cruise-boarding-gangway';scene.add(root,bridge);const surfaces=[],people=[passenger(scene,0),passenger(scene,1)];let clock=0,current=null;
 const surface=(x1,x2,y1,y2,group=root,active)=>{const x=(x1+x2)/2,y=(y1+y2)/2,len=x2-x1,slope=(y2-y1)/len;const m=cube(group,'#ac9572',x,y-.07,d.z,len,.14,1.9);m.rotation.z=Math.atan(slope);m.scale.x=Math.hypot(len,y2-y1);surfaces.push({root:group,x,z:d.z,rx:len/2+.001,rz:.95,edgeInset:0,padding:0,minTop:Math.min(y1,y2),maxTop:Math.max(y1,y2),top:y,slopeX:slope,active});for(const side of [-1,1]){const r=cube(group,'#d5d9cc',x,y+.95,d.z+side*.94,len,.055,.055);r.rotation.z=Math.atan(slope);r.scale.x=Math.hypot(len,y2-y1);for(let xx=x1;xx<x2;xx+=1.2)cube(group,'#ccd0c4',xx,y1+(xx-x1)*slope+.47,d.z+side*.94,.045,.95,.045);surfaces.push({root:group,x,z:d.z+side*.98,rx:len/2,rz:.025,top:y+1.0,slopeX:slope,solidHeight:1.0,solidOnly:true,active});}};
 surface(41,49,d.y,d.y);surface(49,59,d.y,d.deck);surface(59,61,d.deck,d.deck);surface(61,d.entry.x,d.deck,d.deck,bridge,()=>!!current&&current.remaining>2.5);
 for(const x of [49,58,60])for(const z of [d.z-.7,d.z+.7])cube(root,'#616f74',x,22.5,z,.18,2,.18);
 if(typeof document!=='undefined'){const label=createWorldCaption('外滩观光码头 · 环线游览');label.position.set(42,28.4,d.z);root.add(label);}
 batchMeshes(root,staticMeshes(root),'cruise-pier');batchMeshes(bridge,staticMeshes(bridge),'cruise-gangway');
 const ports=[{root,deckSurfaces:surfaces.filter(s=>s.root===root).map(({root,...s})=>s)},{root:bridge,deckSurfaces:surfaces.filter(s=>s.root===bridge).map(({root,...s})=>s)}];
 const supportSurfaces=[...ships.flatMap(b=>b.deckSurfaces.map(s=>({...s,root:b.root}))),...surfaces];
 const waiting=p=>({x:43,y:d.y,z:d.z+(p.slot?.62:-.62)}),onShip=p=>ships.find(b=>{const q=boatLocal(b.root,p.x,p.z);return Math.abs(q.x)<2.9&&q.z>-9.8&&q.z<9.1&&p.y>=b.root.position.y+.9&&p.y<b.root.position.y+10;});
 function floorAt(x,z,feet){for(const ship of ships){const h=cruiseFloorAt(ship,x,z,feet);if(h!==null)return h;}const s=boatSupport(supportSurfaces,x,feet+.5,z);return s&&Math.abs(feet-s.y)<.6?s.y:null;}
 function walk(p,target,dt){const at=p.root.position,dx=target.x-at.x,dz=target.z-at.z,n=Math.hypot(dx,dz);if(n<.035){at.y=target.y;return true;}const step=Math.min(n,dt*1.05),q={x:at.x+dx/n*step,y:at.y+(target.y-at.y)*Math.min(1,step/Math.max(.05,n)),z:at.z+dz/n*step};const player=getPos();if(Math.abs(player.y-q.y)<1.8&&Math.hypot(player.x-q.x,player.z-q.z)<.8||people.some(o=>o!==p&&Math.abs(o.root.position.y-q.y)<1.5&&Math.hypot(o.root.position.x-q.x,o.root.position.z-q.z)<.9))return false;at.set(q.x,q.y,q.z);p.root.rotation.y=Math.atan2(-dx,-dz);p.phase+=dt*5;for(let i=0;i<2;i++){p.legs[i].rotation.x=Math.sin(p.phase)*(i?-.22:.22);p.arms[i].rotation.x=-p.legs[i].rotation.x;}return false;}
 for(const p of people){const q=waiting(p);p.root.position.set(q.x,q.y,q.z);}
 function tick(dt,{night=false}={}){
  // A pedestrian on the narrow boarding bridge holds departure until clear.
  const player=getPos(),bridgeOccupied=current&&player.x>61&&player.x<d.entry.x-.5&&Math.abs(player.z-d.z)<1.2&&Math.abs(player.y-d.deck)<1;
  const passengerCrossing=people.some(p=>['boarding','alighting'].includes(p.state));
  if(!(current&&current.remaining<=3.1&&(bridgeOccupied||passengerCrossing)))clock+=dt;
  for(const b of ships)tickHuangpuCruise(b,clock,night);current=ships.find(b=>b.moored)??null;bridge.visible=!!current&&current.remaining>2.5;
  for(const p of people){
   for(const l of [...p.arms,...p.legs])l.rotation.x=0;
   if(p.state==='waiting'){p.pause-=dt;if(p.pause<=0&&current&&current.remaining>18&&!people.some(o=>o!==p&&(['boarding','alighting'].includes(o.state)||o.ship===current&&o.state==='aboard'))){p.ship=current;p.path=[{x:49,y:d.y,z:d.z},{x:59,y:d.deck,z:d.z},{x:d.entry.x,y:d.deck,z:d.z},worldPoint(p.ship,0,3.7)];p.state='boarding';}}
   if(p.state==='boarding'||p.state==='alighting'){
    if(p.path.length&&walk(p,p.path[0],dt))p.path.shift();
    if(!p.path.length){if(p.state==='boarding'){p.state='aboard';p.local=boatLocal(p.ship.root,p.root.position.x,p.root.position.z);p.target={x:p.slot?-.35:.35,z:p.slot?-2.7:2.7};p.seenSail=false;}else{p.state='waiting';p.pause=12;p.ship=null;}}continue;
   }
   if(p.state==='aboard'){
    if(!p.ship.moored)p.seenSail=true;
    if(p.ship.moored&&p.seenSail&&!people.some(o=>o!==p&&o.state==='boarding')){p.state='alighting';p.path=[worldPoint(p.ship,0,3.7),{x:d.entry.x,y:d.deck,z:d.z},{x:59,y:d.deck,z:d.z},{x:49,y:26,z:d.z},waiting(p)];p.trips++;continue;}
    // Positions remain in world space for the common NPC collision/label system.
    const target=p.target,local=p.local,n=Math.hypot(target.x-local.x,target.z-local.z),step=Math.min(n,dt*.65),q=n>.02?{x:local.x+(target.x-local.x)/n*step,z:local.z+(target.z-local.z)/n*step}:local;
    p.local=q;let w=worldPoint(p.ship,q.x,q.z);const nearPlayer=Math.abs(player.y-w.y)<1.8&&Math.hypot(player.x-w.x,player.z-w.z)<.8;if(nearPlayer){p.local=local;w=worldPoint(p.ship,local.x,local.z);}p.root.position.set(w.x,w.y,w.z);p.root.rotation.y=p.ship.root.rotation.y+(n>.03&&!nearPlayer?Math.atan2(-(target.x-local.x),-(target.z-local.z)):(p.slot?Math.PI/2:-Math.PI/2));if(n>.03&&!nearPlayer){p.phase+=dt*4;for(let i=0;i<2;i++)p.legs[i].rotation.x=Math.sin(p.phase)*(i?-.2:.2);}continue;
   }
  }
 }
 function worldPoint(ship,x,z){return {...boatWorld(ship.root,{x,z}),y:ship.root.position.y+1.1};}
 function getPrompt(p=getPos()){const ship=onShip(p);if(ship)return ship.moored&&ship.remaining>2.5?'V 下船 · 或沿舱门栈桥步行上岸':'观光环线 · 可自由走动 / 沿楼梯上观景甲板 · 返回原码头';if(Math.hypot(p.x-43,p.z-d.z)<6&&Math.abs(p.y-26)<1.4)return current&&current.remaining>2.5?'V 候船登船 · 也可沿栈桥步行上船':'观光游轮候船处 · 稍候下一班';return '';}
 const unoccupied=q=>people.every(o=>Math.abs(o.root.position.y-q.y)>1.8||Math.hypot(o.root.position.x-q.x,o.root.position.z-q.z)>.95);
 function use(){const p=getPos(),ship=onShip(p);if(ship){if(ship.moored&&ship.remaining>2.5){const exit=[59.5,60.6].map(x=>({x,y:d.deck,z:d.z})).find(unoccupied);if(!exit){notify('请稍候，让游客先走过栈桥。');return true;}place(exit);setView(Math.PI/2,0);notify('已回到观光码头 · 沿栈桥上坡返回外滩');}else notify('栈桥航行时收起，本航次返回外滩原码头。可进船舱、上二层和三层观景。');return true;}if(getPrompt(p)){if(current&&current.remaining>5){const entry=[[0,3.7],[0,1],[0,-2],[1.5,3]].map(([x,z])=>worldPoint(current,x,z)).find(unoccupied);if(!entry){notify('请稍候，让游客先入舱。');return true;}place(entry);setView(current.root.rotation.y,0);notify('欢迎登船 · 全景船舱 / 两段实体楼梯 / 三层观景甲板 · 游览后返回这里');}else notify('正在候船，请稍候；本航线不用于过江。');return true;}return false;}
 tick(0);return {tick,floorAt,use,getPrompt,people,ports,root,bridge,isAboard:()=>!!onShip(getPos()),safeSavePoint:()=>onShip(getPos())||getPos().x>45&&getPos().x<d.entry.x+1&&Math.abs(getPos().z-d.z)<2&&getPos().y>=d.deck-.5&&getPos().y<=26.5?{x:40,y:26,z:d.z}:null,get clock(){return clock;},get current(){return current;}};
}
