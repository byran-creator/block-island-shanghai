import {WATER_LEVEL,WORLD_MIN,WORLD_MAX,trace} from './world.js';
export const COOK_SECONDS=30,COOK_SLOTS=4,FISH_SECONDS=10;
export function cookingRemaining(f,elapsed){return f.cooking?Math.max(0,f.cooking.readyAt-elapsed):0;}
export function startCooking(state,f){
 if(f.type!=='campfire'||f.cooking||state.raw<1)return 0;
 const count=Math.min(COOK_SLOTS,Math.floor(state.raw));state.raw-=count;
 f.cooking={count,readyAt:state.elapsed+COOK_SECONDS};return count;
}
export function collectCooking(state,f){
 if(!f.cooking||cookingRemaining(f,state.elapsed)>0)return 0;
 const count=f.cooking.count;delete f.cooking;state.food=Math.min(99999,state.food+count*2);return count;
}
export function restoreCooking(value,elapsed){
 if(!value||!Number.isInteger(value.count)||value.count<1||value.count>COOK_SLOTS||!Number.isFinite(value.readyAt))return null;
 return {count:value.count,readyAt:Math.max(0,Math.min(elapsed+COOK_SECONDS,value.readyAt))};
}
export function fishingTarget(world,p,direction,{dry=false}={}){
 if(dry||p.y<WATER_LEVEL||p.y>28||!world.get(Math.floor(p.x),Math.floor(p.y)-1,Math.floor(p.z)))return null;
 const length=Math.hypot(direction.x,direction.z);if(length<.1||direction.y>.7)return null;
 const dx=direction.x/length,dz=direction.z/length,origin={x:p.x,y:p.y+1.62,z:p.z};
 for(let d=4;d<=14;d++){
  const target={x:p.x+dx*d,y:WATER_LEVEL+.08,z:p.z+dz*d},x=Math.floor(target.x),z=Math.floor(target.z);
  if(x<WORLD_MIN+1||x>=WORLD_MAX-1||z<WORLD_MIN+1||z>=WORLD_MAX-1||world.get(x,23,z)||world.get(x,22,z))continue;
  const vector={x:target.x-origin.x,y:target.y-origin.y,z:target.z-origin.z},distance=Math.hypot(vector.x,vector.y,vector.z);
  if(!trace(world,origin,{x:vector.x/distance,y:vector.y/distance,z:vector.z/distance},distance-.15))return target;
 }
 return null;
}
export function fishingValid(session,p,survival,dry){return !!session&&survival&&!dry&&Math.hypot(p.x-session.start.x,p.z-session.start.z)<1.8&&Math.abs(p.y-session.start.y)<.7;}
