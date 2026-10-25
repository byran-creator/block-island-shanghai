// A short, collision-checked detour rejoins the existing route; no teleporting.
function* searchDetour(start,goal,clear){
 const cell=.75,key=(x,z)=>x+','+z,point=(x,z)=>({x:start.x+x*cell,y:start.y,z:start.z+z*cell}),target={x:Math.round((goal.x-start.x)/cell),z:Math.round((goal.z-start.z)/cell)};
 const open=[{x:0,z:0,g:0,f:Math.hypot(target.x,target.z),parent:null}],best=new Map([[key(0,0),0]]),closed=new Set();
 function segment(a,b){const yaw=Math.atan2(b.x-a.x,b.z-a.z)+Math.PI,n=Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.12);for(let i=0;i<=n;i++){const u=i/n;if(!clear({...a,x:a.x+(b.x-a.x)*u,z:a.z+(b.z-a.z)*u,yaw}))return false;}return true;}
 for(let count=0;open.length&&count<3500;count++){
  yield;
  let index=0;for(let i=1;i<open.length;i++)if(open[i].f<open[index].f)index=i;const current=open.splice(index,1)[0],id=key(current.x,current.z);if(closed.has(id))continue;closed.add(id);
  const a=point(current.x,current.z);
  if(Math.hypot(a.x-goal.x,a.z-goal.z)<cell*1.1&&segment(a,goal)){const path=[goal];for(let n=current;n?.parent;n=n.parent)path.push(point(n.x,n.z));return path.reverse();}
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
   const x=current.x+dx,z=current.z+dz,k=key(x,z),g=current.g+Math.hypot(dx,dz);if(Math.abs(x)>48||Math.abs(z)>48||closed.has(k)||g>=(best.get(k)??Infinity))continue;
   const b=point(x,z);if(!segment(a,b))continue;best.set(k,g);open.push({x,z,g,f:g+Math.hypot(target.x-x,target.z-z),parent:current});
  }
 }
 return null;
}

// A search can span frames; following the result still checks every movement
// against the current cars, signals and buildings.
export function createTrafficDetour(start,goal,clear){
 const search=searchDetour({...start},{...goal},clear);let done=false,path=null;
 function step(nodes=1){for(let i=0;i<nodes&&!done;i++){const result=search.next();if(result.done){done=true;path=result.value;}}return done;}
 return {step,get path(){return path;}};
}

export function planTrafficDetour(start,goal,clear){
 const task=createTrafficDetour(start,goal,clear);while(!task.step(3501)){}return task.path;
}
