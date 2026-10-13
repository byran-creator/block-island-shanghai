import {overlaps} from './world.js';
import {ROADS} from './city-layout.js';
import {metroRampAt} from './metro-layout.js';
import {YUYUAN_WALKS} from './yuyuan-layout.js';
const cache=new WeakMap();
// Route over the existing city's supported alleys and pavements; never erase a
// building to make a straight shortcut. Reserve room for two passing walkers.
export function yuyuanWalkRoute(world){
 if(cache.has(world))return cache.get(world);
 const minX=-205,maxX=35,minZ=61,maxZ=219,w=maxX-minX+1,h=maxZ-minZ+1,n=w*h,cost=new Uint8Array(n).fill(5),clear=new Int8Array(n),distance=new Float64Array(n).fill(Infinity),parent=new Int32Array(n).fill(-1);
 const key=(x,z)=>(z-minZ)*w+x-minX,inside=(x,z)=>x>=minX&&x<=maxX&&z>=minZ&&z<=maxZ;
 for(const road of ROADS)for(let i=0;i<road.samples.length;i+=6){const p=road.samples[i];if(p.x<minX-12||p.x>maxX+12||p.z<minZ-12||p.z>maxZ+12)continue;for(let x=Math.ceil(p.x-10);x<=p.x+10;x++)for(let z=Math.ceil(p.z-10);z<=p.z+10;z++){if(!inside(x,z))continue;const d=Math.hypot(x+.5-p.x,z+.5-p.z),k=key(x,z);if(d>road.width+1&&d<road.width+4)cost[k]=1;else if(d<road.width+1&&cost[k]!==1)cost[k]=8;}}
 for(let x=minX;x<=maxX;x++)for(let z=62;z<=70;z++)cost[key(x,z)]=1;
 function walkable(x,z){if(!inside(x,z))return false;const k=key(x,z);if(clear[k])return clear[k]>0;const px=x+.5,pz=z+.5;let ok=!metroRampAt(px,pz);for(const [dx,dz]of [[0,0],[-1.25,-1.25],[-1.25,1.25],[1.25,-1.25],[1.25,1.25]])if(!world.get(Math.floor(px+dx),25,Math.floor(pz+dz))||overlaps(world,px+dx,26,pz+dz))ok=false;clear[k]=ok?1:-1;return ok;}
 const [start,end]=YUYUAN_WALKS,sx=Math.floor(start[0]),sz=Math.floor(start[1]),ex=Math.floor(end[0]),ez=Math.floor(end[1]),goal=key(ex,ez),heap=[];
 function push(k,f){let i=heap.length;heap.push({k,f});while(i){const p=(i-1)>>1;if(heap[p].f<=f)break;heap[i]=heap[p];i=p;}heap[i]={k,f};}
 function pop(){const v=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let c=i*2+1;if(c+1<heap.length&&heap[c+1].f<heap[c].f)c++;if(heap[c].f>=last.f)break;heap[i]=heap[c];i=c;}heap[i]=last;}return v;}
 const first=key(sx,sz);distance[first]=0;push(first,0);let found=false;
 while(heap.length){const {k,f}=pop(),x=minX+k%w,z=minZ+Math.floor(k/w);if(f>distance[k]+Math.hypot(ex-x,ez-z)+.001)continue;if(k===goal){found=true;break;}for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const xx=x+dx,zz=z+dz;if(!walkable(xx,zz)||dx&&dz&&(!walkable(x+dx,z)||!walkable(x,z+dz)))continue;const next=key(xx,zz),d=distance[k]+Math.hypot(dx,dz)*cost[next];if(d>=distance[next])continue;distance[next]=d;parent[next]=k;push(next,d+Math.hypot(ex-xx,ez-zz));}}
 if(!found)throw Error('No supported public walking route from Nanjing Road to Yuyuan');
 const path=[];for(let k=goal;k!==-1;k=parent[k])path.push([minX+k%w+.5,minZ+Math.floor(k/w)+.5]);path.reverse();const route=path.filter((p,i)=>!i||i===path.length-1||(p[0]-path[i-1][0])*(path[i+1][1]-p[1])!==(p[1]-path[i-1][1])*(path[i+1][0]-p[0]));cache.set(world,route);return route;
}
