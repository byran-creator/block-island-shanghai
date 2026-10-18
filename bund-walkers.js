import {promenadeX} from './city-layout.js';
import {pedestrianStepClear} from './pedestrian-traffic.js';

// All state changes retain physical position. Never snap a walker into a queue
// or back from sightseeing; the return leg is part of the route.
export function createBundWalkers(walkers,{clear=()=>true,people=()=>walkers}={}){
 let first=0;
 walkers.forEach((p,i)=>{p.nanjingEnd=-92+(i%6)*5;p.bundEnd=promenadeX(p.baseZ)-5+(i%3)*.7;});
 const corridor=(p,x)=>p.baseZ+(x>=-41&&x<=-29?(p.isNorth?-2.55:2.45)*Math.sin((x+41)/12*Math.PI):0);
 const turn=(p,yaw,dt)=>{const d=Math.atan2(Math.sin(yaw-p.root.rotation.y),Math.cos(yaw-p.root.rotation.y));p.root.rotation.y+=Math.sign(d)*Math.min(Math.abs(d),dt*4);return Math.abs(d)<Math.PI/3;};
 function animate(p,distance,dt){p.phase+=distance*5;p.walkBlend=(p.walkBlend??0)+((distance>1e-6?1:0)-(p.walkBlend??0))*(1-Math.exp(-dt*8));const gait=Math.sin(p.phase)*.3*p.walkBlend;for(let i=0;i<2;i++){p.legs[i].rotation.x=i?-gait:gait;p.arms[i].rotation.x=i?gait:-gait;}}
 function advance(dt,clock,vehicles,canCross){
  const neighbours=people();
  function available(p,q){if(!clear(q)||!pedestrianStepClear(p.root.position,q,vehicles))return false;const at=p.root.position;return neighbours.every(o=>{if(o===p||o.root.visible===false||Math.abs(o.root.position.y-q.y)>2||o.ready===false)return true;const b=o.root.position,d=(b.x-q.x)**2+(b.z-q.z)**2,old=(b.x-at.x)**2+(b.z-at.z)**2;return d>=.9**2||(old<.9**2&&d>old+1e-8);});}
  for(let k=0;k<walkers.length;k++){
   const p=walkers[(first+k)%walkers.length],at=p.root.position;let goal,pace=p.speed,wait=false;
   if(p.strollState==='bund_stroll'||p.strollState==='nanjing_stroll'){
    p.strollTime-=dt;
    if(p.strollTime<=0)p.strollState=p.strollState==='bund_stroll'?'bund_return':'nanjing_return';
    else{
     goal=p.strollState==='bund_stroll'?{x:promenadeX(p.strollTarget)-5+(p.bundEnd-(promenadeX(p.baseZ)-5)),z:p.strollTarget}:{x:p.strollTarget,z:p.baseZ};pace*=.65;
     if(Math.hypot(goal.x-at.x,goal.z-at.z)<.15){p.browseTime=(p.browseTime??0)+dt;wait=true;if(p.browseTime>3+p.phase%4){p.browseTime=0;p.strollTarget=p.strollState==='bund_stroll'?52+((clock+p.phase)*11%28):-105+((clock+p.phase)*13%48);}}
    }
   }
   if(p.strollState==='bund_return'||p.strollState==='nanjing_return'){
    goal={x:p.strollState==='bund_return'?p.bundEnd:p.nanjingEnd,z:p.baseZ};
    if(Math.hypot(goal.x-at.x,goal.z-at.z)<.1){p.dir=p.strollState==='bund_return'?-1:1;p.strollState='transit';goal=null;}
   }
   if(p.strollState==='transit'){
    const end=p.dir>0?p.bundEnd:p.nanjingEnd;
    if(Math.abs(at.x-end)<.08){p.strollState=p.dir>0?'bund_stroll':'nanjing_stroll';p.strollTime=24+(p.phase*7%26);p.strollTarget=p.dir>0?52+(p.phase*17%28):-105+(p.phase*13%45);animate(p,0,dt);continue;}
    pace=at.x>13&&at.x<23||at.x>-31.5&&at.x<-26?Math.max(1.8,p.speed):p.speed;
    let x=p.dir>0?Math.min(end,at.x+pace*dt):Math.max(end,at.x-pace*dt);
    if(!canCross)for(const line of p.dir>0?[-33.5,11.2]:[-23.5,24.8]){if(p.dir*(line-at.x)>=-1e-8&&p.dir*(x-line)>0){x=line;wait=Math.abs(x-at.x)<1e-7;}}
    goal={x,z:corridor(p,x)};
   }
   if(p.detour&&canCross){goal=p.detour;if(Math.hypot(goal.x-at.x,goal.z-at.z)<.1)p.detour=null;}else if(!canCross)p.detour=null;
   let moved=0;
   if(goal&&!wait&&dt>0){
    const dx=goal.x-at.x,dz=goal.z-at.z,n=Math.hypot(dx,dz),step=Math.min(n,pace*dt);
    if(n>1e-7){const q={x:at.x+dx/n*step,y:26,z:at.z+dz/n*step},yaw=Math.atan2(dx,dz)+Math.PI;
     if(turn(p,yaw,dt)){
      if(available(p,q)){moved=Math.hypot(q.x-at.x,q.z-at.z);at.set(q.x,q.y,q.z);p.blocked=0;}
      else{p.blocked=(p.blocked??0)+dt;
       // A small deterministic side step lets sightseeing walkers pass rather
       // than mutually waiting forever. Queues at a red stop never sidestep.
       if(p.blocked>1.2&&canCross){for(const angle of [Math.PI/2,-Math.PI/2,Math.PI*.75,-Math.PI*.75,Math.PI]){const c=Math.cos(angle),s=Math.sin(angle),sideQ={x:at.x+(dx*c-dz*s)/n*1.3,y:26,z:at.z+(dx*s+dz*c)/n*1.3};if(sideQ.x>-112&&sideQ.x<38&&sideQ.z>49&&sideQ.z<82&&available(p,sideQ)){p.detour=sideQ;p.blocked=0;break;}}}
      }
     }
    }
   }
   p.x=at.x;p.z=at.z;animate(p,moved,dt);
  }
  first=(first+1)%Math.max(1,walkers.length);
 }
 return {tick(dt,clock,vehicles=[],canCross=true){if(dt<=0)return;let left=Math.min(dt,.25);while(left>1e-8){const step=Math.min(left,1/30);advance(step,clock,vehicles,canCross);left-=step;}}};
}
