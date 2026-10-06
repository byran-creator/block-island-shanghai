// Sweep short steps so a chase cannot cross a wall during a slow frame.
export function creatureStep(position,dt,speed,heading,{ground,blocked,bounds,water}){
 const total=Math.max(0,dt*speed),steps=Math.max(1,Math.ceil(total/.12)),dx=-Math.sin(heading)*total/steps,dz=-Math.cos(heading)*total/steps;
 let moved=false;
 for(let i=0;i<steps;i++){
  const tryMove=(x,z)=>{const y=ground(x,z);if(x<=bounds.min+2||z<=bounds.min+2||x>=bounds.max-2||z>=bounds.max-2||y<=water||Math.abs(y-position.y)>1.05||blocked(x,y,z)||blocked(x,y+.2,z))return false;Object.assign(position,{x,y,z});moved=true;return true;};
  if(!tryMove(position.x+dx,position.z+dz)){if(dx)tryMove(position.x+dx,position.z);if(dz)tryMove(position.x,position.z+dz);}
 }
 return moved;
}
