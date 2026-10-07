import {pedestrianBlocked,pedestrianStepClear} from './pedestrian-traffic.js';

export function crowdProfile(index){
 let seed=Math.imul(index+71,2654435761)>>>0;seed=Math.imul(seed^(seed>>>16),2246822507)>>>0;seed^=seed>>>13;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 return {random,speed:.58+random()*.74,phase:random()*Math.PI*2,wait:random()<.27?1+random()*4:0,breakIn:15+random()*35};
}
const bounds={x1:-179,x2:-38,z1:64.4,z2:68.45};
// Shopping bags extend about .5m from the centre; include neighbouring arms.
export const CROWD_SEPARATION=.9;
export function createStreetCrowd(people,{clear=()=>true}={}){
 const walkers=people.filter(p=>!p.stationary);let first=0;
 const othersClear=(p,q)=>people.every(o=>o===p||!o.stationary&&!o.ready||o.root.visible===false||Math.abs(o.root.position.y-q.y)>2||(o.root.position.x-q.x)**2+(o.root.position.z-q.z)**2>CROWD_SEPARATION**2);
 const inside=q=>q.x>=bounds.x1&&q.x<=bounds.x2&&q.z>=bounds.z1&&q.z<=bounds.z2;
 function goal(p){const r=p.crowd.random;for(let i=0;i<40;i++){const q={x:bounds.x1+r()*(bounds.x2-bounds.x1),y:26,z:bounds.z1+r()*(bounds.z2-bounds.z1)};if(clear(q)&&othersClear(p,q)){p.crowd.goal=q;return;}}p.crowd.goal={...p.root.position};}
 function retreat(p){const at=p.root.position,state=p.crowd,dx=state.goal.x-at.x,dz=state.goal.z-at.z,n=Math.hypot(dx,dz)||1;
  for(const angle of [Math.PI,Math.PI/2,-Math.PI/2,Math.PI*.75,-Math.PI*.75]){const c=Math.cos(angle),s=Math.sin(angle),q={x:at.x+(dx*c-dz*s)/n*1.5,y:26,z:at.z+(dx*s+dz*c)/n*1.5};if(inside(q)&&clear(q)&&othersClear(p,q)){state.goal=q;return;}}
  goal(p);
 }
 for(const [i,p]of walkers.entries()){p.crowd=crowdProfile(i);p.speed=p.crowd.speed;p.phase=p.crowd.phase;p.crowd.blocked=0;p.ready=false;goal(p);}
 function advance(dt,vehicles){
  for(let i=0;i<walkers.length;i++){
   const p=walkers[(i+first)%walkers.length],state=p.crowd;let moving=false;
   if(!p.ready){for(let attempt=0;attempt<120;attempt++){const q={x:bounds.x1+state.random()*(bounds.x2-bounds.x1),y:26,z:bounds.z1+state.random()*(bounds.z2-bounds.z1)};if(clear(q)&&othersClear(p,q)&&!pedestrianBlocked(q,vehicles)){p.root.position.set(q.x,q.y,q.z);p.ready=true;break;}}p.root.visible=p.ready;if(!p.ready)continue;}
   state.breakIn-=dt;state.wait=Math.max(0,state.wait-dt);
   if(state.breakIn<=0){state.wait=(p.kind==='delivery-walk'?.5:1.5)+state.random()*3.5;state.breakIn=18+state.random()*38;p.root.rotation.y=state.random()<.5?0:Math.PI;}
   if(!state.wait){
    const at=p.root.position,dx=state.goal.x-at.x,dz=state.goal.z-at.z,distance=Math.hypot(dx,dz);
    if(distance<.35){state.wait=.8+state.random()*3;goal(p);}
    else if(dt>0){
     const length=Math.min(distance,state.speed*dt),nx=dx/distance,nz=dz/distance;
     // Prefer a consistent passing side. Once blocked, allow a true sidestep or
     // retreat rather than insisting on forward movement into a head-on queue.
     const angles=state.blocked>.35?[0,.65,-.65,Math.PI/2,-Math.PI/2,Math.PI*.75,-Math.PI*.75,Math.PI]:[0,.65,-.65];
     for(const angle of angles){const c=Math.cos(angle),s=Math.sin(angle),q={x:at.x+(nx*c-nz*s)*length,y:26,z:at.z+(nx*s+nz*c)*length};if(inside(q)&&clear(q)&&othersClear(p,q)&&pedestrianStepClear(at,q,vehicles)){p.root.rotation.y=Math.atan2(q.x-at.x,q.z-at.z)+Math.PI;at.set(q.x,q.y,q.z);moving=true;break;}}
     state.blocked=moving?0:state.blocked+dt;if(state.blocked>4){goal(p);state.blocked=0;}
    }
   }
   // Tiny oscillations used to reset `blocked` forever. Measure real progress
   // over time, excluding intentional browsing, and make room by backing out.
   const at=p.root.position;state.anchor??={x:at.x,z:at.z};state.progressTime=(state.progressTime??0)+dt;
   if(state.wait||Math.hypot(at.x-state.anchor.x,at.z-state.anchor.z)>.5){state.anchor={x:at.x,z:at.z};state.progressTime=0;}
   else if(state.progressTime>3){retreat(p);state.anchor={x:at.x,z:at.z};state.progressTime=0;state.blocked=.4;}
   state.state=moving?'walk':state.wait?'browse':'yield';state.phase+=dt*state.speed*4.5;
   for(let j=0;j<2;j++){p.legs[j].rotation.x=moving?Math.sin(state.phase+p.phase)*(j?-.25:.25):0;p.arms[j].rotation.x=moving?-p.legs[j].rotation.x:Math.sin(state.phase*.35+p.phase)*.04;}
  }
  first=(first+1)%Math.max(1,walkers.length);
 }
 function tick(dt,vehicles=[]){if(dt<=0){advance(0,vehicles);return;}let remaining=Math.min(dt,.25);while(remaining>1e-8){const step=Math.min(remaining,1/30);advance(step,vehicles);remaining-=step;}}
 return {walkers,tick};
}
