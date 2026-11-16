const bounds={west:118,east:136,north:334,south:346,floor:25};
export const PADDOCK_ANIMALS=8;

export function paddockSpawn(index){
 return [bounds.west+3.5+index%4*4,bounds.north+3.5+Math.floor(index/4)*6];
}

export function insidePaddockGrass(world,x,y,z){
 const {west,east,north,south}=bounds;
 return x>=west+1.9&&x<east-.9&&z>=north+1.9&&z<south-.9&&
  world.get(Math.floor(x),y-1,Math.floor(z))===1;
}

export function buildSurvivalPaddock(world){
 const {west,east,north,south,floor}=bounds;
 const gate=west+9;
 world.fill(west,floor,north,east,floor,south,1);
 for(let x=west;x<=east;x++){
  world.set(x,floor+1,south,(x-west)%3===0?4:7);
  if(Math.abs(x-gate)>1)world.set(x,floor+1,north,(x-west)%3===0?4:7);
 }
 for(let z=north+1;z<south;z++)for(const x of [west,east]){
  world.set(x,floor+1,z,(z-north)%3===0?4:7);
 }
 for(const x of [gate-2,gate+2])world.fill(x,floor+1,north,x,floor+2,north,4);
}
