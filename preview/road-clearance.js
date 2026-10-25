// Preserve the sampled-road predicate, including its strict floating-point
// boundary. The box only rejects impossible hits; the final test is unchanged.
export function nearSampledRoad(roads,x,z,clearance){
 for(const road of roads){const reach=road.width+clearance+1e-9;
  for(let i=0;i<road.samples.length;i+=4){const p=road.samples[i],dx=x-p.x,dz=z-p.z;
   if(Math.abs(dx)>reach||Math.abs(dz)>reach)continue;
   if(Math.hypot(dx,dz)-road.width<clearance)return true;
  }
 }
 return false;
}

// Build only after the city finishes editing its road layout. This is a
// snapshot of static roads, not a cache for moving vehicles or player blocks.
export function createRoadClearance(roads,clearance=1.2){
 const size=8,cells=new Map();let references=0;
 for(const road of roads)for(let i=0;i<road.samples.length;i+=4){
  const p=road.samples[i],entry={x:p.x,z:p.z,width:road.width},reach=road.width+clearance+1e-9;
  for(let cx=Math.floor((p.x-reach)/size);cx<=Math.floor((p.x+reach)/size);cx++)for(let cz=Math.floor((p.z-reach)/size);cz<=Math.floor((p.z+reach)/size);cz++){
   const key=cx+','+cz;let bucket=cells.get(key);if(!bucket)cells.set(key,bucket=[]);bucket.push(entry);references++;
  }
 }
 return {cells:cells.size,references,contains(x,z){
  const bucket=cells.get(Math.floor(x/size)+','+Math.floor(z/size));if(!bucket)return false;
  for(const p of bucket)if(Math.hypot(x-p.x,z-p.z)-p.width<clearance)return true;
  return false;
 }};
}
