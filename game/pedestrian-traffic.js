import {vehicleContact} from './vehicle-dynamics.js';

// Walkers must check the same vehicle bodies that drivers check for walkers.
export function pedestrianBlocked(point,vehicles){
 const person={person:true,root:{position:point,visible:true},height:1.85};
 return vehicles.some(v=>v.root.visible!==false&&vehicleContact(v,v.root.position.x,v.root.position.y,v.root.position.z,v.root.rotation.y,person));
}
export function pedestrianStepClear(from,to,vehicles){
 if(!vehicles.length)return true;
 const distance=Math.hypot(to.x-from.x,to.z-from.z),steps=Math.max(1,Math.ceil(distance/.15));
 for(let i=1;i<=steps;i++){const u=i/steps;if(pedestrianBlocked({x:from.x+(to.x-from.x)*u,y:to.y,z:from.z+(to.z-from.z)*u},vehicles))return false;}
 return true;
}
