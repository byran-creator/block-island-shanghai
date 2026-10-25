import {VoxelWorld,SIZE,HEIGHT,WORLD_MIN,WORLD_MAX} from './world.js';
const faces=[
 {d:[1,0,0],v:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],light:.83},
 {d:[-1,0,0],v:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],light:.73},
 {d:[0,1,0],v:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],light:1},
 {d:[0,-1,0],v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],light:.58},
 {d:[0,0,1],v:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],light:.9},
 {d:[0,0,-1],v:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],light:.8}
];

// Count exposed faces with a compact mask, then write final GPU arrays directly.
// Both passes yield by column; no temporary JS vertex arrays or world copy.
export function createChunkMesher({world,cx,cz,chunk,height,skip=()=>false}){
 const dense=world instanceof VoxelWorld&&world.get===VoxelWorld.prototype.get&&cx*chunk>=WORLD_MIN&&cz*chunk>=WORLD_MIN&&(cx+1)*chunk<=WORLD_MAX&&(cz+1)*chunk<=WORLD_MAX,bytes=world.data,plane=SIZE*SIZE;
 const data={p:null,norm:null,uv:null,col:null,indices:null};
 const columns=chunk*chunk;let masks=new Uint8Array(columns*height),column=0,faceCount=0,writing=false,vertex=0,index=0,done=false;
 function step(count=8){
  if(done)return true;
  const end=Math.min(columns,column+count);
  for(;column<end;column++){
   const x=cx*chunk+Math.floor(column/chunk),z=cz*chunk+column%chunk,base=(z-WORLD_MIN)*SIZE+x-WORLD_MIN;
   for(let y=0;y<height;y++){
    const at=column*height+y;
    if(writing&&!masks[at])continue;
    const offset=base+y*plane,id=dense?bytes[offset]:world.get(x,y,z);if(!id||(!writing&&skip(x,y,z,id)))continue;
    for(let face=0;face<faces.length;face++){
     const f=faces[face];
     if(!writing){const occupied=dense?(face===0?x+1<WORLD_MAX&&bytes[offset+1]:face===1?x>WORLD_MIN&&bytes[offset-1]:face===2?y+1<HEIGHT&&bytes[offset+plane]:face===3?y>0&&bytes[offset-plane]:face===4?z+1<WORLD_MAX&&bytes[offset+SIZE]:z>WORLD_MIN&&bytes[offset-SIZE]):world.get(x+f.d[0],y+f.d[1],z+f.d[2]);if(!occupied){masks[at]|=1<<face;faceCount++;}continue;}
     if(!(masks[at]&(1<<face)))continue;
     let tile=id-1;if(id===1)tile=f.d[1]===1?0:f.d[1]===-1?1:8;if(id===4&&f.d[1]!==0)tile=9;if(id>=9)tile=id+1;
     const start=vertex,nx=f.d[0],ny=f.d[1],nz=f.d[2],lt=f.light;
     for(let i=0;i<4;i++,vertex++){
      const v=f.v[i],a=vertex*3,b=vertex*2;data.p[a]=x+v[0];data.p[a+1]=y+v[1];data.p[a+2]=z+v[2];data.norm[a]=nx;data.norm[a+1]=ny;data.norm[a+2]=nz;data.col[a]=lt;data.col[a+1]=lt;data.col[a+2]=lt;
      const u=i===1||i===2?1:0,vv=i>=2?1:0;data.uv[b]=(tile+(.025+u*.95))/14;data.uv[b+1]=.025+vv*.95;
     }
     data.indices[index++]=start;data.indices[index++]=start+1;data.indices[index++]=start+2;data.indices[index++]=start;data.indices[index++]=start+2;data.indices[index++]=start+3;
    }
   }
  }
  if(column<columns)return false;
  if(!writing){const vertices=faceCount*4;data.p=new Float32Array(vertices*3);data.norm=new Float32Array(vertices*3);data.uv=new Float32Array(vertices*2);data.col=new Float32Array(vertices*3);data.indices=vertices>=65536?new Uint32Array(faceCount*6):new Uint16Array(faceCount*6);writing=true;column=0;if(faceCount)return false;}
  masks=null;done=true;return true;
 }
 return {step,data};
}

export function createChunkQueue({has,create,commit,now=()=>performance.now()}){
 let desired=new Set(),current=null;const pending=new Map();
 function request(key){if(current?.key===key)current=null;pending.set(key,null);}
 function cancel(key){pending.delete(key);if(current?.key===key)current=null;}
 function invalidate(key){if(pending.has(key))request(key);}
 function setDesired(keys,point,chunk,force=false){
  desired=keys;for(const key of pending.keys())if(!desired.has(key))cancel(key);
  for(const key of desired)if(force||!has(key)&&!pending.has(key))request(key);
  const distance=key=>{const [x,z]=key.split(',').map(Number);return ((x+.5)*chunk-point.x)**2+((z+.5)*chunk-point.z)**2;};
  const ordered=[...pending].sort((a,b)=>distance(a[0])-distance(b[0]));pending.clear();for(const entry of ordered)pending.set(...entry);
 }
 function process(budget=3,maxChunks=1){
  if(!pending.size)return;const start=now();let committed=0;
  do{
   if(!current){
    const nextKey=pending.keys().next().value;
    if(!nextKey)break;
    current={key:nextKey,task:create(nextKey)};
   }
   if(current.task.step(8)){
    const {key,task}=current;pending.delete(key);current=null;
    if(desired.has(key))commit(key,task.data);
    committed++;
    if(committed>=maxChunks)break;
   }
  }while(now()-start<budget);
 }
 function prioritize(keys){
  const ordered=[...pending].sort((a,b)=>Number(keys.has(b[0]))-Number(keys.has(a[0])));
  pending.clear();for(const entry of ordered)pending.set(...entry);
  if(current&&!keys.has(current.key))current=null;
 }
 return {setDesired,request,cancel,invalidate,process,prioritize,get desired(){return new Set(desired);},get pending(){return pending.size;}};
}
