import {vehicleContact,vehiclePedestrianReach} from './vehicle-dynamics.js';

const vehicleCellSize=8;
const cellKey=(x,z)=>x+','+z;
const bounded=value=>Number.isFinite(value)&&Math.abs(value)<1e6;
const noVehicles=[];

// Rebuilt after the traffic step. These walkers only read vehicle transforms
// during their turn, including all the swept probes of one walking step.
export function createPedestrianVehicleIndex(){
 const cells=new Map(),overflow=[];
 let vehicles=noVehicles;
 return {
  get length(){return vehicles.length;},
  refresh(next){
   vehicles=next;
   cells.clear();overflow.length=0;
   for(const v of vehicles){
    const {x,z}=v.root.position,reach=vehiclePedestrianReach(v)+1e-7;
    if(!bounded(x)||!bounded(z)||!Number.isFinite(reach)||reach<0||reach>32){overflow.push(v);continue;}
    for(let cx=Math.floor((x-reach)/vehicleCellSize);cx<=Math.floor((x+reach)/vehicleCellSize);cx++){
     for(let cz=Math.floor((z-reach)/vehicleCellSize);cz<=Math.floor((z+reach)/vehicleCellSize);cz++){
      const key=cellKey(cx,cz);
      let cell=cells.get(key);
      if(!cell){cell=[];cells.set(key,cell);}
      cell.push(v);
     }
    }
   }
  },
  blocked(point){
   if(!bounded(point.x)||!bounded(point.z))return scanVehicles(point,vehicles);
   const cell=cells.get(cellKey(Math.floor(point.x/vehicleCellSize),Math.floor(point.z/vehicleCellSize)));
   return (cell!==undefined&&scanVehicles(point,cell))||(overflow.length>0&&scanVehicles(point,overflow));
  }
 };
}

// Walkers must check the same vehicle bodies that drivers check for walkers.
function scanVehicles(point,vehicles){
 const person={person:true,root:{position:point,visible:true},height:1.85};
 return vehicles.some(v=>v.root.visible!==false&&vehicleContact(v,v.root.position.x,v.root.position.y,v.root.position.z,v.root.rotation.y,person));
}
export function pedestrianBlocked(point,vehicles){
 return Array.isArray(vehicles)?scanVehicles(point,vehicles):vehicles.blocked(point);
}
export function pedestrianStepClear(from,to,vehicles){
 if(!vehicles.length)return true;
 const distance=Math.hypot(to.x-from.x,to.z-from.z),steps=Math.max(1,Math.ceil(distance/.15));
 for(let i=1;i<=steps;i++){const u=i/steps;if(pedestrianBlocked({x:from.x+(to.x-from.x)*u,y:to.y,z:from.z+(to.z-from.z)*u},vehicles))return false;}
 return true;
}
