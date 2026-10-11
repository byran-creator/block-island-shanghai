const faces=[
 {d:[1,0,0],v:[[1,0,1],[1,0,0],[1,1,0],[1,1,1]],light:.83},
 {d:[-1,0,0],v:[[0,0,0],[0,0,1],[0,1,1],[0,1,0]],light:.73},
 {d:[0,1,0],v:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],light:1},
 {d:[0,-1,0],v:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],light:.58},
 {d:[0,0,1],v:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],light:.9},
 {d:[0,0,-1],v:[[1,0,0],[0,0,0],[0,1,0],[1,1,0]],light:.8}
];

// Work on a few columns at a time, without copying the voxel world.
export function createChunkMesher({world,cx,cz,chunk,height,skip=()=>false}){
 const data={p:[],norm:[],uv:[],col:[],indices:[]};let column=0;
 function step(count=8){
  const end=Math.min(chunk*chunk,column+count);
  for(;column<end;column++){
   const x=cx*chunk+Math.floor(column/chunk),z=cz*chunk+column%chunk;
   for(let y=0;y<height;y++){
    const id=world.get(x,y,z);if(!id||skip(x,y,z,id))continue;
    for(const f of faces){
     if(world.get(x+f.d[0],y+f.d[1],z+f.d[2]))continue;
     let tile=id-1;if(id===1)tile=f.d[1]===1?0:f.d[1]===-1?1:8;if(id===4&&f.d[1]!==0)tile=9;if(id>=9)tile=id+1;
     const start=data.p.length/3;
     for(let i=0;i<4;i++){const v=f.v[i];data.p.push(x+v[0],y+v[1],z+v[2]);data.norm.push(...f.d);data.col.push(f.light,f.light,f.light);const u=i===1||i===2?1:0,vv=i>=2?1:0;data.uv.push((tile+(.025+u*.95))/14,.025+vv*.95);}
     data.indices.push(start,start+1,start+2,start,start+2,start+3);
    }
   }
  }
  return column===chunk*chunk;
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
 function process(budget=3){
  if(!pending.size)return;const start=now();
  do{
   if(!current){const key=pending.keys().next().value;current={key,task:create(key)};}
   if(current.task.step(8)){
    const {key,task}=current;pending.delete(key);current=null;
    if(desired.has(key))commit(key,task.data);
    // Limit GPU uploads and temporary allocations to one finished chunk per frame.
    break;
   }
  }while(now()-start<budget);
 }
 return {setDesired,request,cancel,invalidate,process,get pending(){return pending.size;}};
}
