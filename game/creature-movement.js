// Enemy head/body extend beyond the player's collision footprint.
export function creatureBlocked(blocked,x,y,z){
 // A rotated .6 x .6 head reaches .425m from its centre. The player's .29m
 // half-width plus .14m margin covers that corner at every facing direction.
 for(const dx of [-.14,0,.14])for(const dz of [-.14,0,.14])if(blocked(x+dx,y,z+dz)||blocked(x+dx,y+.2,z+dz))return true;
 return false;
}
// Sweep short steps so a chase cannot cross a wall during a slow frame.
export function creatureStep(position,dt,speed,heading,{ground,blocked,bounds,water}){
 const total=Math.max(0,dt*speed),steps=Math.max(1,Math.ceil(total/.12)),dx=-Math.sin(heading)*total/steps,dz=-Math.cos(heading)*total/steps;
 let moved=false;
 for(let i=0;i<steps;i++){
  const tryMove=(x,z)=>{const y=ground(x,z);if(x<=bounds.min+2||z<=bounds.min+2||x>=bounds.max-2||z>=bounds.max-2||y<=water||Math.abs(y-position.y)>1.05||creatureBlocked(blocked,x,y,z))return false;Object.assign(position,{x,y,z});moved=true;return true;};
  if(!tryMove(position.x+dx,position.z+dz)){if(dx)tryMove(position.x+dx,position.z);if(dz)tryMove(position.x,position.z+dz);}
 }
 return moved;
}
