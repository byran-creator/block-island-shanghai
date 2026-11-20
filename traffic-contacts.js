import {vehicleContact} from './vehicle-dynamics.js';

export function createTrafficContactGrid(){
 const cells=new Map(),records=new Map(),cellPool=[],rowPool=[],usedCells=[];
 let maxRadius=0,playerRef=null;
 const size=16,key=(x,z)=>(x+4096)*8192+(z+4096);
 function acquireCell(id){
  let cell=cells.get(id);
  if(!cell){cell=cellPool.length?cellPool.pop():[];cells.set(id,cell);usedCells.push(cell);}
  return cell;
 }
 function removeFromCell(cell,item){
  const idx=cell.indexOf(item);
  if(idx>=0){const last=cell.pop();if(idx<cell.length)cell[idx]=last;}
 }
 function update(item){
  const p=item.root.position,x=Math.floor(p.x/size),z=Math.floor(p.z/size),id=key(x,z);
  let row=records.get(item);
  maxRadius=Math.max(maxRadius,item.person?.36:(item.halfWidth??.88)+(item.halfLength??1.55)+.1);
  if(row){
   if(row.id===id)return;
   removeFromCell(row.cell,item);
   row.id=id;row.cell=acquireCell(id);row.cell.push(item);
   return;
  }
  const cell=acquireCell(id);cell.push(item);
  row=rowPool.length?rowPool.pop():{id:0,cell:null};
  row.id=id;row.cell=cell;
  records.set(item,row);
 }
 function reset(agents,obstacles,player=null){
  for(let i=0;i<usedCells.length;i++){const c=usedCells[i];c.length=0;cellPool.push(c);}
  usedCells.length=0;cells.clear();
  records.forEach(r=>{r.cell=null;rowPool.push(r);});
  records.clear();maxRadius=0;playerRef=player;
  for(let i=0;i<agents.length;i++)update(agents[i]);
  for(let i=0;i<obstacles.length;i++)update(obstacles[i]);
  if(player)update(player);
 }
 function test(vehicle,p,includePlayer=false){
  const radius=vehicle.halfWidth+vehicle.halfLength+maxRadius;
  const minX=Math.floor((p.x-radius)/size),maxX=Math.floor((p.x+radius)/size),minZ=Math.floor((p.z-radius)/size),maxZ=Math.floor((p.z+radius)/size);
  for(let x=minX;x<=maxX;x++)for(let z=minZ;z<=maxZ;z++){
   const cell=cells.get(key(x,z));
   if(!cell)continue;
   for(let i=0;i<cell.length;i++){const item=cell[i];if(item===playerRef&&!includePlayer)continue;if(vehicleContact(vehicle,p.x,p.y,p.z,p.yaw,item))return true;}
  }
  return false;
 }
 return {reset,update,test};
}

export function createTrafficContacts(agents,obstacles,player=null){
 const grid=createTrafficContactGrid();
 grid.reset(agents,obstacles,player);
 return grid;
}
