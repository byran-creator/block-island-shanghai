import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createLujiazuiPeople,createLujiazuiFlow} from '../game/lujiazui-life.js';
import {lujiazuiDayPlan,schedulePavement} from '../game/lujiazui-schedule.js';
import {phaseFromMinutes} from '../game/day-time.js';

const world=new VoxelWorld(),cube=()=>{},person=()=>({root:new T.Group(),arms:[new T.Group(),new T.Group()],legs:[new T.Group(),new T.Group()]});
let viewer=null;
const people=createLujiazuiPeople({person,cube}),flow=createLujiazuiFlow(people,{world,others:()=>people,getPos:()=>viewer});
const start=performance.now();flow.tick(0,[],phaseFromMinutes(120));
assert(people.every(p=>p.daily.rooms[p.kind==='office-walk'?'home':'hotel']),'Every person needs a connected real home or hotel entrance');
assert(people.slice(0,8).every(p=>p.daily.rooms.work),'Every worker needs a connected office');
assert(people.every(p=>!p.root.visible),'Overnight initialization belongs inside the buildings');
console.log(JSON.stringify({setupMilliseconds:performance.now()-start,rooms:people.map(p=>({name:p.npcRole??'摄影游客',rooms:p.daily.rooms}))}));

let maxStep=0,minimumPeer=Infinity,arrivals=0;
const visited=people.map(()=>new Set());
function advance(minutes,seconds,naturalClock=false){const phase=phaseFromMinutes(minutes);for(let elapsed=0;elapsed<seconds;){const dt=[.016,.1,.033,.08][Math.floor(elapsed*20)%4],before=people.map(p=>({position:p.root.position.clone(),visible:p.root.visible,state:p.daily.state}));flow.tick(dt,[],phase+(naturalClock?elapsed*.2:0));elapsed+=dt;
 for(let i=0;i<people.length;i++){const p=people[i],old=before[i],distance=p.root.position.distanceTo(old.position);maxStep=Math.max(maxStep,distance);assert(distance<=p.speed*dt+1e-5,'Time changes must never teleport pedestrians');assert(schedulePavement(world,p.root.position),'Keep the entire body on supported pavement and through open doors');assert(!overlaps(world,...p.root.position.toArray()));
  if(old.visible&&!p.root.visible){arrivals++;assert.notEqual(p.daily.state,'outside');const r=p.daily.rooms[p.daily.state];assert(Math.hypot(p.root.position.x-r.x,p.root.position.z-r.z)<.08,'Disappear only behind the destination doorway');}
  if(p.root.visible)for(const o of people.slice(i+1).filter(o=>o.root.visible)){const gap=p.root.position.distanceTo(o.root.position);minimumPeer=Math.min(minimumPeer,gap);assert(gap>=.9-1e-5,'Commuters and tourists must not overlap');}
  if(p.root.visible&&viewer)assert(Math.hypot(p.root.position.x-viewer.x,p.root.position.z-viewer.z)>=.9-1e-5,'Wait for the player to clear the entrance');
  if(naturalClock)visited[i].add(p.daily.state);
 }
}return people.map(p=>({name:p.npcRole??'摄影游客',state:p.daily.state,target:p.daily.target,x:p.root.position.x,z:p.root.position.z}));}
for(const minutes of [9*60+10,10*60+35,13*60+30,18*60+30,23*60+30]){
 const states=advance(minutes,400);console.log(JSON.stringify({minutes,states}));assert(people.every((p,i)=>p.daily.state===lujiazuiDayPlan(i,phaseFromMinutes(minutes))),'Every scheduled trip must complete without permanent queues');
}
viewer={...people[8].daily.rooms.hotel};advance(11*60,20);
assert(people.slice(8,13).every(p=>!p.root.visible),'People inside wait when the player occupies their shared hotel doorway');
viewer=null;advance(11*60,400);assert(people.slice(8).every(p=>p.daily.state==='outside'),'Release the doorway queue after the player leaves');
// Put a new block on a live route, then remove it. No cached navigation can
// walk through the edit, and nobody may warp to recover the missed journey.
advance(23*60+30,.2);
const at=people.flatMap(p=>(p.daily.path??[]).slice(p.daily.next??0,-1)).find(q=>people.every(p=>!p.root.visible||Math.hypot(p.root.position.x-q.x,p.root.position.z-q.z)>2));
assert(at,'The test obstacle must lie ahead, away from occupied bodies');
const block={x:Math.floor(at.x),z:Math.floor(at.z)};
assert(!world.get(block.x,26,block.z));world.set(block.x,26,block.z,3);
advance(23*60+30,15);world.set(block.x,26,block.z,0);advance(23*60+30,400);
assert(people.every(p=>p.daily.state===(p.kind==='office-walk'?'home':'hotel')),'All passengers recover after a player-built obstacle is removed');
const snapshot=people.map(p=>p.root.position.toArray());for(let i=0;i<10;i++)flow.tick(0,[],phaseFromMinutes(23*60+30));assert.deepEqual(people.map(p=>p.root.position.toArray()),snapshot,'Paused simulation does not advance commuters');
advance(6*60,2400,true);
console.log(JSON.stringify({normalDays:visited.map((states,i)=>({name:people[i].npcRole??i,states:[...states],end:people[i].daily.state,x:people[i].root.position.x,z:people[i].root.position.z}))}));
console.log(JSON.stringify({walking:people.filter(p=>p.daily.state==='walking').map(p=>({name:p.npcRole??'摄影游客',daily:p.daily,yaw:p.root.rotation.y}))}));
assert(visited.slice(0,8).every(s=>['outside','work','home'].every(v=>s.has(v))),'Two normal-speed days include office attendance, breaks and returning home');
assert(visited.slice(8).every(s=>s.has('outside')&&s.has('hotel')),'Tourists complete both daytime visits and overnight stays in a normal cycle');
assert(arrivals>=20,'Trips really reach offices, homes and hotels');
console.log(JSON.stringify({people:people.length,maxStep,minimumPeer,arrivals,allTripsComplete:true}));
