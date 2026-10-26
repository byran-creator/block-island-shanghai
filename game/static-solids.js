// Scene-owned, immutable fixture footprints. Build beside the visible model so
// merging its render meshes cannot discard collision. Queries allocate nothing.
export function createStaticSolids(cell=8){
 const buckets=new Map(),boxes=[];
 function add(minX,minY,minZ,maxX,maxY,maxZ,kind){
  const box={minX,minY,minZ,maxX,maxY,maxZ,kind};boxes.push(box);
  for(let x=Math.floor(minX/cell);x<=Math.floor(maxX/cell);x++){let column=buckets.get(x);if(!column)buckets.set(x,column=new Map());for(let z=Math.floor(minZ/cell);z<=Math.floor(maxZ/cell);z++){let list=column.get(z);if(!list)column.set(z,list=[]);list.push(box);}}
 }
 function collides(x,y,z,radius=.28,height=1.75){
  for(let cx=Math.floor((x-radius)/cell);cx<=Math.floor((x+radius)/cell);cx++)for(let cz=Math.floor((z-radius)/cell);cz<=Math.floor((z+radius)/cell);cz++){
   const list=buckets.get(cx)?.get(cz);if(!list)continue;
   for(const b of list)if(y<b.maxY&&y+height>b.minY&&x+radius>b.minX&&x-radius<b.maxX&&z+radius>b.minZ&&z-radius<b.maxZ)return true;
  }return false;
 }
 return {add,collides,boxes};
}
