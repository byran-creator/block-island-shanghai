import {ALL_BUILDINGS,buildingEntrance} from './city-layout.js';
import {overlaps} from './world.js';
import {moveShopper,CROWD_SEPARATION} from './street-crowd.js';
import {pedestrianBlocked,pedestrianStepClear} from './pedestrian-traffic.js';

const bounds={x1:139,x2:224,z1:35,z2:141},key=q=>`${Math.floor(q.x)},${Math.floor(q.z)}`;
const point=(x,z)=>({x,y:26,z});
export function schedulePavement(world,q){
 if(q.x<bounds.x1||q.x>bounds.x2||q.z<bounds.z1||q.z>bounds.z2||overlaps(world,q.x,26,q.z)||!overlaps(world,q.x,25.9,q.z))return false;
 // Include the whole pedestrian footprint; asphalt and lawns are not shortcuts.
 for(const dx of [-.4,.4])for(const dz of [-.4,.4])if(![6,7,9].includes(world.get(Math.floor(q.x+dx),25,Math.floor(q.z+dz))))return false;
 return true;
}
function segment(clear,a,b){const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.2));for(let i=0;i<=n;i++)if(!clear(point(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n)))return false;return true;}

// A bounded, one-metre pavement graph, searched only when a destination changes
// or a route becomes blocked. Live movement always rechecks player-built blocks.
export function schedulePath(world,start,end){
 const cache=new Map(),clear=q=>{const k=`${q.x},${q.z}`;if(!cache.has(k))cache.set(k,schedulePavement(world,q));return cache.get(k);};
 if(!clear(start)||!clear(end))return null;
 const snap=q=>{const candidates=[];for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)candidates.push(point(Math.floor(q.x)+.5+dx,Math.floor(q.z)+.5+dz));return candidates.sort((a,b)=>Math.hypot(a.x-q.x,a.z-q.z)-Math.hypot(b.x-q.x,b.z-q.z)).find(p=>clear(p)&&segment(clear,q,p));};
 const a=snap(start),b=snap(end);if(!a||!b)return null;
 const queue=[a],parents=new Map([[key(a),null]]);let finish;
 for(let i=0;i<queue.length&&i<9500;i++){
  const p=queue[i];if(key(p)===key(b)){finish=p;break;}
  for(const [dx,dz]of [[1,0],[0,1],[-1,0],[0,-1]]){const q=point(p.x+dx,p.z+dz),k=key(q);if(parents.has(k)||!clear(q)||!segment(clear,p,q))continue;parents.set(k,p);queue.push(q);}
 }
 if(!finish)return null;
 const route=[{...end}];while(finish){route.push(finish);finish=parents.get(key(finish));}route.push({...start});route.reverse();
 // Collapse straight runs while keeping every turn around walls and gardens.
 const simple=[route[0]];for(let i=1;i<route.length-1;i++){const a=simple.at(-1),b=route[i],c=route[i+1];if(Math.abs((b.x-a.x)*(c.z-b.z)-(b.z-a.z)*(c.x-b.x))>1e-6)simple.push(b);}simple.push(route.at(-1));return simple;
}

export function lujiazuiDayPlan(index,phase){
 const minutes=((phase*6+360)%1440+1440)%1440;
 if(index<8){
  const shift=index%4*12,start=8*60+15+shift,finish=17*60+30+shift;
  // Separate coffee/lunch breaks retain a few workers outside during the day.
  const pause=[10*60+15,12*60,14*60+15,16*60][index%4]+Math.floor(index/4)*15;
  if(minutes<start||minutes>=finish)return 'home';
  return minutes>=pause&&minutes<pause+100?'outside':'work';
 }
 const offset=(index-8)%5*12;
 return minutes>=9*60+offset&&minutes<22*60+15+offset?'outside':'hotel';
}

export function createLujiazuiSchedule(people,{world,others=()=>people,getPos=()=>null,areas=[]}){
 const clear=q=>schedulePavement(world,q),byId=id=>ALL_BUILDINGS.find(b=>b.id===id);
 function doorway(id){const b=byId(id);if(!b)return null;const q={...buildingEntrance(b,-1.3),y:26};return clear(q)?{...q,id:b.id,name:b.name}:null;}
 const offices=['ifc-south','pudong-infill-174-89','pudong-infill-southeast-1'].map(doorway).filter(Boolean);
 const homes=['pudong-infill-tight-173-67','pudong-infill-tight-155-85','pudong-infill-tight-146-58'].map(doorway).filter(Boolean);
 const hotels=['shangrila-river','shangrila-grand'].map(doorway).filter(Boolean);
 let initialized=false,first=0;
 const neighbours=()=>{const list=typeof others==='function'?others():others,viewer=getPos();return viewer?[...list,{root:{position:viewer,visible:true},ready:true}]:list;};
 function room(p,state){return p.daily.rooms[state];}
 function available(p,q,near,vehicles){return !pedestrianBlocked(q,vehicles)&&near.every(o=>o.root===p.root||o.root.visible===false||o.ready===false||Math.abs(o.root.position.y-26)>2||Math.hypot(o.root.position.x-q.x,o.root.position.z-q.z)>=CROWD_SEPARATION);}
 function stop(p){for(const limb of [...p.arms,...p.legs])limb.rotation.x=0;}
 function arrive(p){const d=p.daily;d.state=d.target;d.path=null;d.detour=null;d.blocked=0;p.root.visible=d.state==='outside';p.ready=true;stop(p);if(d.state==='outside'){p.crowd.wait=1.2+(d.index%4)*.35;p.crowd.goal={...p.root.position};p.crowd.anchor={...p.root.position};p.crowd.progressTime=0;p.crowd.blocked=0;}}
 function initialize(){
  for(const [i,p]of people.entries()){
   const nearest=list=>list.slice().sort((a,b)=>Math.hypot(a.x-p.root.position.x,a.z-p.root.position.z)-Math.hypot(b.x-p.root.position.x,b.z-p.root.position.z));
   // Assign existing open entrances without a batch of startup path searches.
   // Routes are searched one person per frame, then checked live at every step.
   const choose=list=>nearest(list)[0];
   p.daily={index:i,state:'outside',target:'outside',rooms:i<8?{work:p.workplace&&clear(p.workplace)?{...p.workplace}:choose(offices),home:choose(homes)}:{hotel:choose(hotels)},outside:{...p.root.position},path:null,retry:0,blocked:0,initial:true};
   const area=areas.find(a=>a.id===p.forecourt),work=p.daily.rooms.work;
   if(area&&work){const q=point(Math.max(area.x1+.8,Math.min(area.x2-.8,work.x)),Math.max(area.z1+.8,Math.min(area.z2-.8,work.z+(i%4)*1.2)));
    if(clear(q))p.daily.outside=q;
   }
   if(p.guide){p.daily.choice=p.guide.choices.length;p.guide.choices.push(['接下来有什么安排？','']);}
  }initialized=true;
 }
 function note(p){if(!p.guide)return;const d=p.daily,r=room(p,d.target);p.guide.choices[d.choice][1]=d.index<8?`${p.npcRole}：我在${d.rooms.work?.name??'附近写字楼'}上班，今天也会抽空出来透透气。${d.target==='home'?`现在准备回${r?.name??'住处'}了。`:d.target==='work'?'休息过后还得回办公室。':'这会儿是我的休息时间，走一走再回去。'}`:`${p.npcRole}：白天想把附近的街道和高楼慢慢看一遍，夜里回${d.rooms.hotel?.name??'酒店'}休息。${d.target==='hotel'?'今天看得差不多啦，准备回去了。':'不用赶路，明天还有时间接着逛。'}`;}
 function tick(dt,phase,vehicles=[]){
  if(!Number.isFinite(phase))return;
  if(!initialized)initialize();
  const near=neighbours();let planned=false;
  for(let n=0;n<people.length;n++){
   const p=people[(n+first)%people.length],d=p.daily;d.justArrived=false;d.retry=Math.max(0,d.retry-dt);
   if(p.journeyMeeting&&!d.meeting){const r=room(p,d.state),building=r&&byId(r.id),q=r?.id==='shanghai-tower-office'?{...r}:building&&{...buildingEntrance(building,3.2),y:26};d.meeting=q&&clear(q)?q:{...p.root.position};d.path=null;d.retry=0;}
   if(!p.journeyMeeting&&d.meeting){d.meeting=null;d.path=null;d.retry=0;if(d.state==='outside')d.state='walking';}
   const wanted=p.journeyMeeting?'outside':lujiazuiDayPlan(d.index,phase),target=wanted==='outside'||room(p,wanted)?wanted:'outside';
   if(d.initial){d.initial=false;d.target=target;if(target!=='outside'){const r=room(p,target);p.root.position.set(r.x,26,r.z);arrive(p);}note(p);}
   if(target!==d.target){d.target=target;d.path=null;d.detour=null;d.retry=0;d.blocked=0;note(p);}
   if(d.state===d.target)continue;
   if(d.state!=='walking'&&d.state!=='outside'){
    if(!available(p,p.root.position,near,vehicles))continue;
    p.root.visible=true;d.state='walking';
   }
   const destination=d.target==='outside'?(d.meeting??d.outside):room(p,d.target);
   if(!d.path&&!d.retry&&!planned){planned=true;d.path=schedulePath(world,p.root.position,destination);d.next=1;if(!d.path){d.retry=2+d.index*.13;continue;}d.state='walking';d.anchor={...p.root.position};d.progress=0;}
   if(!d.path||dt<=0)continue;
   let remaining=Math.min(dt,.25);
   while(remaining>1e-8){
    const step=Math.min(remaining,1/30);remaining-=step;const at=p.root.position;
    while(d.next<d.path.length&&Math.hypot(at.x-d.path[d.next].x,at.z-d.path[d.next].z)<.06)d.next++;
    if(d.next>=d.path.length){arrive(p);d.justArrived=true;break;}
    const waypoint=d.path[d.next],goal=d.detour??waypoint,before={...at},dx=goal.x-at.x,dz=goal.z-at.z,length=Math.hypot(dx,dz),stride=Math.min(length,p.speed*step);
    let moved=false;
    // A tiny sideways component can release two bodies touching at a corner;
    // requiring a complete metre-wide detour used to pin the leading walker.
    for(const angle of [0,.45,-.45,.85,-.85]){
     if(length<1e-6)break;
     const q=point(at.x+(dx*Math.cos(angle)-dz*Math.sin(angle))/length*stride,at.z+(dx*Math.sin(angle)+dz*Math.cos(angle))/length*stride);
     if(clear(q)&&available(p,q,near,vehicles)&&pedestrianStepClear(at,q,vehicles)){moved=moveShopper(p,q,step,{clear,people:near,vehicles,speed:p.speed});break;}
    }
    const distance=Math.hypot(at.x-before.x,at.z-before.z);d.stride=(d.stride??0)+distance*4.5;
    for(let j=0;j<2;j++){p.legs[j].rotation.x=moved?Math.sin(d.stride+p.phase)*(j?-.25:.25):0;p.arms[j].rotation.x=-p.legs[j].rotation.x;}
    if(d.detour&&Math.hypot(at.x-goal.x,at.z-goal.z)<.08)d.detour=null;
    d.blocked=moved?0:d.blocked+step;
    d.progress=(d.progress??0)+step;
    if(Math.hypot(at.x-d.anchor.x,at.z-d.anchor.z)>.5){d.anchor={...at};d.progress=0;}
    if(d.blocked>.7&&!d.detour){
     const dx=waypoint.x-at.x,dz=waypoint.z-at.z,len=Math.hypot(dx,dz)||1;
     for(const angle of [Math.PI/2,-Math.PI/2,Math.PI]){const q=point(at.x+(dx*Math.cos(angle)-dz*Math.sin(angle))/len*1.05,at.z+(dx*Math.sin(angle)+dz*Math.cos(angle))/len*1.05);if(segment(clear,at,q)&&available(p,q,near,vehicles)){d.detour=q;break;}}
     d.blocked=0;
    }
    if(d.progress>5){d.path=null;d.detour=null;d.retry=1+d.index*.13;stop(p);break;}
   }
  }first=(first+1)%people.length;
 }
 return {tick};
}
