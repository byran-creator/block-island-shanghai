import {trace} from './world.js';

export function followCameraDistance(world,origin,direction,desired,previous,dt){
 const hit=trace(world,origin,direction,desired);
 let clear=desired;
 if(hit){
  // The first solid face is the latest of the three slab entry planes.
  const entry=axis=>{
   const speed=direction[axis];
   return !speed?-Infinity:(hit[axis]+(speed<0?1:0)-origin[axis])/speed;
  };
  clear=Math.max(.04,Math.max(entry('x'),entry('y'),entry('z'))-.16);
 }
 if(previous===undefined||clear<=previous)return clear;
 return clear+(previous-clear)*Math.exp(-6*Math.max(0,dt));
}
