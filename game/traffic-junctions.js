import {roadX,westSpine} from './city-layout.js';
import {vehicleContact} from './vehicle-dynamics.js';
// Reserve shared turns until the current vehicle clears them, preventing two
// vehicle bodies from wedging when different route loops merge.
// Protect both Lujiazui joins and coordinate the overlapping core controls.
export const JUNCTION_POINTS=[[roadX(14),14],[westSpine(14),14],[roadX(206),206],[roadX(238),238],[westSpine(238),238],[213,31],[226,12,12,8],[210,12],[282,206],[260,65],[291,22],[210,-8],[167,12],[roadX(-140),-140],[westSpine(-140),-140]];
export function createJunctionControl(points=JUNCTION_POINTS,{getPose}={}){
 const zones=points.map(([x,z,range=14,stop=10])=>({x,z,range,stop,owner:null})),rider=a=>['bicycle','delivery'].includes(a.kind),groups=[];
 // Overlapping reservations share one admission set; a vehicle cannot hold
 // one lock while waiting for another lock in the same connecting bend.
 for(const zone of zones){const touching=groups.filter(g=>g.zones.some(j=>Math.hypot(j.x-zone.x,j.z-zone.z)<Math.max(j.range+zone.stop,zone.range+j.stop)));const group={zones:[zone,...touching.flatMap(g=>g.zones)],owner:null,holders:new Set()};for(const g of touching)groups.splice(groups.indexOf(g),1);groups.push(group);}
 const margin=(p,g,field)=>Math.min(...g.zones.map(j=>Math.hypot(p.x-j.x,p.z-j.z)-j[field]));
 const nearest=(a,g)=>Math.min(...g.zones.map(j=>Math.hypot(a.root.position.x-j.x,a.root.position.z-j.z)));
 const paths=new WeakMap();
 function path(a,g){let cache=paths.get(a);if(!cache){cache=new Map();paths.set(a,cache);}const key=(a.detour?Math.floor(a.root.position.x*2)+','+Math.floor(a.root.position.z*2):Math.floor(a.t*2))+':'+a.lane,old=cache.get(g);if(old?.key===key&&old.detour===a.detour)return old.points;const horizon=2*Math.max(...g.zones.map(j=>j.range))+Math.max(...g.zones.flatMap(j=>g.zones.map(k=>Math.hypot(j.x-k.x,j.z-k.z))))+12,points=[];for(let d=-(a.halfLength??1.32);d<=horizon;d+=1.25){const p=getPose(a,d);if(d>0&&margin(p,g,'range')>4&&points.length)break;points.push(p);}cache.set(g,{key,detour:a.detour,points});return points;}
 function compatible(a,b,g){
  if(a.route&&a.route===b.route&&a.dir===b.dir&&Math.abs(a.lane-b.lane)<.5){const delta=Math.abs(a.t-b.t),gap=Math.min(delta,a.route.lengthMeters-delta);if(gap<40&&Math.cos(a.root.rotation.y-b.root.rotation.y)>.7)return true;}
  const pa=a.root.position,pb=b.root.position,aa=a.root.rotation?.y??0,ba=b.root.rotation?.y??0,dx=pb.x-pa.x,dz=pb.z-pa.z;
  if(Math.cos(aa-ba)>.92&&Math.abs(dx*(Math.cos(aa)+Math.cos(ba))-dz*(Math.sin(aa)+Math.sin(ba)))/2<(a.halfWidth??.72)+(b.halfWidth??.72)+.3)return true;
  if(!getPose)return false;
  const ap=path(a,g),bp=path(b,g),probe={halfWidth:(a.halfWidth??.72)+.1,halfLength:(a.halfLength??1.32)+.1,root:a.root},other={halfWidth:(b.halfWidth??.72)+.1,halfLength:(b.halfLength??1.32)+.1,root:{position:null,rotation:{y:0}}};
  // Parallel stream sections use physical following distances; crossing and
  // opposing footprints reserve separate turns. Reject distant pairs cheaply.
  for(const p of ap)for(const q of bp){if(Math.abs(p.y-q.y)>1.5||(p.x-q.x)**2+(p.z-q.z)**2>36||Math.cos(p.yaw-q.yaw)>.5)continue;other.root.position=q;other.root.rotation.y=q.yaw;if(vehicleContact(probe,p.x,p.y,p.z,p.yaw,other))return false;}return true;
 }
 function update(agents){for(const g of groups){
  // A reservation held by a queue follower must never exclude its leader.
  // Otherwise the owner waits for a front vehicle that is waiting for its ticket.
  for(const a of [...g.holders]){const front=a.following;if(front&&!front.yielding&&front.waitTime>1&&margin(front.root.position,g,'range')<0){g.holders.delete(a);g.holders.add(front);g.owner=front;for(const j of g.zones)j.owner=front;}}
  // Bund crossings retain their single-owner rule. The overlapping Pudong
  // merge controls need shared ownership to avoid holding neighbouring locks.
  const bund=g.zones.every(j=>j.x<160),bridgeEnd=g.zones.some(j=>j.x===282&&j.z===206);
  // The bridge loop doubles back at its eastern end. Opposite approaches
  // briefly face along the same curve before splitting into their lanes, so
  // parallel-path admission is unsafe here. Reserve the complete bend.
  if(bund||bridgeEnd){const j=g.zones[0];if(j.owner&&nearest(j.owner,g)>j.range)j.owner=null;if(!j.owner)j.owner=agents.filter(a=>!a.yielding&&!a.detour&&(!bund||!rider(a))&&nearest(a,g)<j.range).sort((a,b)=>nearest(a,g)-nearest(b,g)||a.trafficId-b.trafficId)[0]??null;g.holders=new Set(j.owner?[j.owner]:[]);g.owner=j.owner;continue;}
  for(const a of g.holders)if(margin(a.root.position,g,'range')>0)g.holders.delete(a);
  const arrivals=agents.filter(a=>!a.yielding&&!g.holders.has(a)&&margin(a.root.position,g,'range')<0);
  arrivals.sort((a,b)=>(margin(a.root.position,g,'stop')<0?0:1)-(margin(b.root.position,g,'stop')<0?0:1)||nearest(a,g)-nearest(b,g)||a.trafficId-b.trafficId);
  // Every admitted path must be compatible with EVERY path already admitted.
  // Checking only one owner admits two turns that are mutually conflicting.
  for(const a of arrivals)if([...g.holders].every(b=>compatible(a,b,g)))g.holders.add(a);
  g.owner=g.holders.values().next().value??null;for(const j of g.zones)j.owner=g.owner;
 }}
 function permits(a,p){return groups.every(g=>!g.holders.size||g.holders.has(a)||rider(a)&&g.zones.every(j=>j.x<160)||margin(p,g,'stop')>=0||margin(p,g,'stop')>margin(a.root.position,g,'stop')+.001);}
 const spawnClear=(p,a)=>a&&rider(a)||zones.every(j=>Math.hypot(p.x-j.x,p.z-j.z)>j.range+1);
 function yieldTo(a,b){for(const g of groups)if(g.holders.has(a)){g.holders.delete(a);if(margin(b.root.position,g,'range')<0)g.holders.add(b);g.owner=g.holders.values().next().value??null;for(const j of g.zones)j.owner=g.owner;}}
 return {update,permits,spawnClear,yieldTo,zones,groups};
}
