// Same half-metre BFS and neighbour order as the original visitor paths.
// Scratch buffers hold search bookkeeping only; clearance is queried anew.
export function createGardenPathfinder(clear){
 const width=305,height=261,count=width*height,directions=[1,-1,width,-width];
 let queue,parents,seen,epoch=0;
 const id=p=>(p[0]+120)*2+((p[1]-206)*2)*width;
 const point=i=>[-120+(i%width)/2,206+Math.floor(i/width)/2];
 const supported=p=>Number.isInteger((p[0]+120)*2)&&Number.isInteger((p[1]-206)*2)&&p[0]>=-120&&p[0]<=32&&p[1]>=206&&p[1]<=336;
 return function path(start,end,occupied=null){
  if(!supported(start)||!supported(end))return fallback(clear,start,end,occupied);
  if(!queue){queue=new Int32Array(count);parents=new Int32Array(count);seen=new Uint32Array(count);}
  epoch=(epoch+1)>>>0;if(!epoch){seen.fill(0);epoch=1;}
  const first=id(start),last=id(end);let head=0,tail=1,finish=-1;
  queue[0]=first;seen[first]=epoch;parents[first]=-1;
  while(head<tail){const at=queue[head++];if(at===last){finish=at;break;}
   const col=at%width,row=Math.floor(at/width),x=-120+col/2,z=206+row/2;
   for(const delta of directions){
    if(delta===1&&col===width-1||delta===-1&&col===0||delta===width&&row===height-1||delta===-width&&row===0)continue;
    const next=at+delta;if(seen[next]===epoch)continue;
    const dx=delta===1?.5:delta===-1?-.5:0,dz=delta===width?.5:delta===-width?-.5:0,nx=x+dx,nz=z+dz;
    if(!clear(nx,nz)||!clear(x+dx/2,z+dz/2)||occupied?.(nx,nz))continue;
    seen[next]=epoch;parents[next]=at;queue[tail++]=next;
   }
  }
  if(finish<0)throw Error('Garden visitor circuit is blocked');
  const result=[];while(finish>=0){result.push(point(finish));finish=parents[finish];}return result.reverse();
 };
}

// Preserve the generic legacy behaviour for unusual non-grid/outside inputs.
function fallback(clear,start,end,occupied){
 const key=p=>p[0]+','+p[1],queue=[start],seen=new Set([key(start)]),parents=new Map();let finish;
 for(let i=0;i<queue.length;i++){const p=queue[i];if(key(p)===key(end)){finish=p;break;}
  for(const [dx,dz]of [[.5,0],[-.5,0],[0,.5],[0,-.5]]){const q=[p[0]+dx,p[1]+dz],k=key(q);if(seen.has(k)||q[0]<-120||q[0]>32||q[1]<206||q[1]>336||!clear(...q)||!clear(p[0]+dx/2,p[1]+dz/2)||occupied?.(...q))continue;seen.add(k);parents.set(k,p);queue.push(q);}
 }
 if(!finish)throw Error('Garden visitor circuit is blocked');const result=[];while(finish){result.push(finish);finish=parents.get(key(finish));}return result.reverse();
}
