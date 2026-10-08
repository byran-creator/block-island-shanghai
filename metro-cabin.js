import {METRO_CARS} from './metro-train.js';

export const METRO_SEATS=METRO_CARS.flatMap((car,i)=>[-1,1].flatMap(side=>[-.6,0,.6].map((offset,j)=>({id:i+':'+side+':'+j,x:car+offset,z:side*.98,side,standZ:side*.32}))));
export function cabinBlocked(x,z,passengers=[]){
 if(Math.abs(x)>30.75||Math.abs(z)>1.03)return true;
 for(const car of METRO_CARS){if(Math.abs(x-car)<1.16&&Math.abs(z)>.51)return true;for(const offset of [-1,1])if(Math.hypot(x-car-offset,z)<.27)return true;
  if(car!==METRO_CARS.at(-1)&&Math.abs(x-car-4)<.37&&Math.abs(z)>.72)return true;
 }
 return passengers.some(p=>p.visible!==false&&Math.hypot(x-p.position.x,z-p.position.z)<.46);
}
export function nearbyCabinSeat(local,seats,occupied,maxDistance=1.12){return seats.filter(s=>!occupied(s)&&Math.hypot(s.x-local.x,s.z-local.z)<=maxDistance).sort((a,b)=>Math.hypot(a.x-local.x,a.z-local.z)-Math.hypot(b.x-local.x,b.z-local.z))[0]??null;}
