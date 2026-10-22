import {vehicleContact} from './vehicle-dynamics.js';

// A conservative broad phase. The original full-body contact test still decides.
export function createTrafficContacts(agents,obstacles,player=null){
 const cells=new Map(),records=new Map(),size=16;let maxRadius=0;
 const key=(x,z)=>x+','+z;
 function update(item){
  const p=item.root.position,x=Math.floor(p.x/size),z=Math.floor(p.z/size),id=key(x,z);let row=records.get(item);
  maxRadius=Math.max(maxRadius,item.person?.36:(item.halfWidth??.88)+(item.halfLength??1.55)+.1);
  if(row?.id===id)return;if(row)row.cell.delete(item);let cell=cells.get(id);if(!cell){cell=new Set();cells.set(id,cell);}cell.add(item);records.set(item,{id,cell});
 }
 for(const item of agents)update(item);for(const item of obstacles)update(item);if(player)update(player);
 return {update,test(vehicle,p,includePlayer=false){
  const radius=vehicle.halfWidth+vehicle.halfLength+maxRadius;
  for(let x=Math.floor((p.x-radius)/size);x<=Math.floor((p.x+radius)/size);x++)for(let z=Math.floor((p.z-radius)/size);z<=Math.floor((p.z+radius)/size);z++)for(const item of cells.get(key(x,z))??[]){if(item===player&&!includePlayer)continue;if(vehicleContact(vehicle,p.x,p.y,p.z,p.yaw,item))return true;}
  return false;
 }};
}
