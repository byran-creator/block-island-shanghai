import {overlaps} from './world.js';
import {ROADS} from './city-layout.js';
import {metroRampFloor} from './metro-layout.js';
import {PEDESTRIAN_CROSSINGS} from './pedestrian-crossings.js';

export const tutorialCrossing=p=>PEDESTRIAN_CROSSINGS.find(c=>p.x>c.west&&p.x<c.east&&Math.abs(p.z-c.z)<c.halfZ-.35);
const key=p=>`${Math.floor(p.x)},${Math.floor(p.z)},${Math.round(p.y*1000)}`;
export function tutorialFloor(world,x,z,fromY,blocked=()=>false){
 const ramp=metroRampFloor(x,z),y=ramp!==null&&Math.abs(ramp-fromY)<.9?ramp:Math.round(fromY);
 if(Math.abs(y-fromY)>.9||overlaps(world,x,ramp===y?Math.ceil(y):y,z)||blocked(x,y,z))return null;
 if(ramp!==y)for(const dx of [-.3,.3])for(const dz of [-.3,.3]){const id=world.get(Math.floor(x+dx),Math.floor(y-.03),Math.floor(z+dz));if(!id)return null;}
 return y;
}
export function tutorialSegment(world,a,b,blocked=()=>false){
 const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.3));let y=a.y;
 for(let i=1;i<=n;i++){const t=i/n,h=tutorialFloor(world,a.x+(b.x-a.x)*t,a.z+(b.z-a.z)*t,y,blocked);if(h===null)return false;y=h;}
 return Math.abs(y-b.y)<.9;
}

// One bounded A* search when the destination changes or the player leaves the
// cached path. No crowds are simulated here; each arrow prefix is revalidated.
export function* tutorialRouteSearch(world,start,goal,{blocked=()=>false,limit=1800}={}){
 if(!world||!start||!goal||Math.hypot(goal.x-start.x,goal.z-start.z)>240)return null;
 const margin=14,bounds={x1:Math.min(start.x,goal.x)-margin,x2:Math.max(start.x,goal.x)+margin,z1:Math.min(start.z,goal.z)-margin,z2:Math.max(start.z,goal.z)+margin};
 const roads=[];for(const r of ROADS)for(let i=0;i<r.samples.length;i+=4){const p=r.samples[i],radius=(r.width??3)+1.2;if(p.x>=bounds.x1-radius&&p.x<=bounds.x2+radius&&p.z>=bounds.z1-radius&&p.z<=bounds.z2+radius)roads.push({...p,r2:radius*radius});}
 const roadCache=new Map(),isRoad=p=>{const k=`${p.x},${p.z}`;if(!roadCache.has(k))roadCache.set(k,roads.some(r=>(p.x-r.x)**2+(p.z-r.z)**2<r.r2));return roadCache.get(k);};
 const floorCache=new Map(),point=(x,z,y)=>{if(x<bounds.x1||x>bounds.x2||z<bounds.z1||z>bounds.z2)return null;const k=`${x},${z},${Math.round(y*1000)}`;if(floorCache.has(k))return floorCache.get(k);const h=tutorialFloor(world,x,z,y,blocked),p=h===null?null:{x,y:h,z};const result=p&&(!isRoad(p)||tutorialCrossing(p))?p:null;floorCache.set(k,result);return result;};
 const snaps=[];for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){const p=point(Math.floor(start.x)+.5+dx,Math.floor(start.z)+.5+dz,start.y);if(p&&tutorialSegment(world,start,p,blocked))snaps.push(p);}snaps.sort((a,b)=>Math.hypot(a.x-start.x,a.z-start.z)-Math.hypot(b.x-start.x,b.z-start.z));const first=snaps[0];if(!first)return null;
 const radius=goal.arriveRadius??.95,heuristic=p=>Math.max(0,Math.hypot(goal.x-p.x,goal.z-p.z)-radius)+Math.abs(goal.y-p.y),heap=[],cost=new Map([[key(first),0]]),parents=new Map([[key(first),null]]);
 const push=(p,g)=>{let i=heap.length;const item={p,g,f:g+heuristic(p)};heap.push(item);while(i){const parent=(i-1)>>1;if(heap[parent].f<=item.f)break;heap[i]=heap[parent];i=parent;}heap[i]=item;};
 const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let child=i*2+1;if(child+1<heap.length&&heap[child+1].f<heap[child].f)child++;if(heap[child].f>=last.f)break;heap[i]=heap[child];i=child;}heap[i]=last;}return top;};
 push(first,0);let finish=null,visited=0;
 while(heap.length&&visited++<limit){if(visited%8===0)yield null;const {p,g}=pop();if(g!==cost.get(key(p)))continue;if(Math.hypot(p.x-goal.x,p.z-goal.z)<=radius&&Math.abs(p.y-goal.y)<.8){finish=p;break;}
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const q=point(p.x+dx,p.z+dz,p.y);if(!q)continue;const next=g+Math.hypot(dx,dz)+Math.abs(q.y-p.y)*.2,k=key(q);if(next>=(cost.get(k)??Infinity)||!tutorialSegment(world,p,q,blocked))continue;cost.set(k,next);parents.set(k,p);push(q,next);}
 }
 if(!finish)return null;const route=[];for(let p=finish;p;p=parents.get(key(p)))route.push(p);route.reverse();route.unshift({...start});return route;
}

export function planTutorialRoute(...args){const search=tutorialRouteSearch(...args);let step;do{step=search.next();}while(!step.done);return step.value;}

export function tutorialRoutePrefix(world,pos,route,{blocked=()=>false,canCross=()=>false}={}){
 if(!route?.length)return {points:[],waiting:false};let nearest=0,best=Infinity;
 for(let i=0;i<route.length;i++){const d=Math.hypot(route[i].x-pos.x,route[i].z-pos.z)+Math.abs(route[i].y-pos.y);if(d<best){best=d;nearest=i;}}
 if(best>2.5)return {points:[],waiting:false,offRoute:true};
 const points=[];let from={...pos},travel=0,nextArrow=2.2,waiting=false,invalid=false;
 const startedCrossing=tutorialCrossing(pos);
 for(let i=Math.min(nearest+1,route.length-1);i<route.length&&travel<14;i++){
  const to=route[i],length=Math.hypot(to.x-from.x,to.z-from.z);if(!length)continue;const n=Math.ceil(length/.25),a={...from};
  for(let j=1;j<=n&&travel<14;j++){const t=j/n,q={x:a.x+(to.x-a.x)*t,y:a.y+(to.y-a.y)*t,z:a.z+(to.z-a.z)*t},cross=PEDESTRIAN_CROSSINGS.find(c=>q.x>c.west-.95&&q.x<c.east+.95&&Math.abs(q.z-c.z)<c.halfZ-.35);if(cross&&cross!==startedCrossing&&!canCross(cross)){waiting=true;break;}if(!tutorialSegment(world,from,q,blocked)){invalid=true;break;}travel+=Math.hypot(q.x-from.x,q.z-from.z);if(travel>=nextArrow&&points.length<6){points.push({...q,y:q.y+.06,pitch:Math.atan2(q.y-from.y,Math.hypot(q.x-from.x,q.z-from.z)),yaw:Math.atan2(-(q.x-from.x),-(q.z-from.z))});nextArrow+=2.2;}from=q;}
  if(waiting||invalid)break;
 }
 return {points,waiting,invalid};
}
