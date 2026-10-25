import {moveShopper} from './street-crowd.js';
import {pedestrianBlocked} from './pedestrian-traffic.js';

// A few ambient visitors use the same scheduled buses as the player.
// Queues stay on the pavement. Boarding starts only during a real dwell;
// occupied doors defer alighting instead of dropping people into each other.
export function createBusPassengers(people,{traffic,clear,neighbours,vehicles}){
 const point=(p,x,z)=>{const a=p.yaw??p.root.rotation.y,c=Math.cos(a),s=Math.sin(a),at=p.root.position;return {x:at.x+x*c+z*s,y:26,z:at.z-x*s+z*c};};
 const waitPoint=(stop,p)=>point(stop,-1.3,-1.45+p.slot*1.25),door=bus=>point(bus,-1.34,-1.45);
 const clearAt=(p,q,ignore)=>clear(q)&&!pedestrianBlocked(q,vehicles().filter(v=>v!==ignore))&&neighbours().every(o=>o===p||o.root.visible===false||o.ready===false||Math.abs(o.root.position.y-q.y)>2||Math.hypot(o.root.position.x-q.x,o.root.position.z-q.z)>=.9);
 const nearStop=bus=>traffic.stops.find(s=>s.route===bus.route&&Math.abs(s.d-bus.t)<.08);
 people.forEach((p,i)=>{p.station=traffic.stops.filter(s=>s.name==='南京路步行街'||s.name==='滨江候车点')[i%2];p.slot=i;p.busState='waiting';p.pause=7+i*4;p.ready=false;p.trips=0;});
 function advance(dt){for(const p of people){
  if(!p.station)continue;
  if(!p.ready){const q=waitPoint(p.station,p);if(!clearAt(p,q))continue;p.root.position.set(q.x,q.y,q.z);p.root.visible=true;p.ready=true;}
  if(p.busState==='aboard'){
   p.root.position.copy(p.bus.root.position);const stop=nearStop(p.bus);
   if(stop&&stop!==p.station&&p.bus.dwell>4.5){const q=door(p.bus);if(clearAt(p,q,p.bus)){p.root.position.set(q.x,q.y,q.z);p.root.visible=true;p.station=stop;p.busState='alighting';p.trips++;}}
   continue;
  }
  let target=waitPoint(p.station,p),ignore;
  if(p.busState==='waiting'){
   p.pause=Math.max(0,p.pause-dt);
   const bus=!p.pause&&traffic.buses.find(b=>b.route===p.station.route&&nearStop(b)===p.station&&b.dwell>5);
   if(bus){p.bus=bus;p.busState='boarding';}
  }
  if(p.busState==='boarding'){
   if(p.bus.dwell<.8||nearStop(p.bus)!==p.station){p.busState='alighting';}
   else{target=door(p.bus);ignore=p.bus;if(Math.hypot(target.x-p.root.position.x,target.z-p.root.position.z)<.12){p.busState='aboard';p.root.visible=false;continue;}}
  }
  if(p.busState==='alighting'){ignore=p.bus;if(Math.hypot(target.x-p.root.position.x,target.z-p.root.position.z)<.15){p.busState='waiting';p.pause=9;p.bus=null;}}
  const moved=moveShopper(p,target,dt,{clear,people:neighbours(),vehicles:vehicles().filter(v=>v!==ignore),speed:1.05});
  p.phase+=moved?dt*5:0;for(let j=0;j<2;j++){const gait=moved?Math.sin(p.phase)*(j?-.23:.23):0;p.legs[j].rotation.x=gait;p.arms[j].rotation.x=-gait;}
 }}
 advance(0);
 return {people,tick(dt){let left=Math.min(dt,.25);while(left>1e-8){const step=Math.min(left,1/30);advance(step);left-=step;}}};
}
