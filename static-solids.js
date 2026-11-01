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
 function vehicleCollides(x,y,z,a,w,l,height=1.7){
  const c=Math.cos(a),s=Math.sin(a),rx=Math.abs(c)*w+Math.abs(s)*l,rz=Math.abs(s)*w+Math.abs(c)*l;
  for(let cx=Math.floor((x-rx)/cell);cx<=Math.floor((x+rx)/cell);cx++)for(let cz=Math.floor((z-rz)/cell);cz<=Math.floor((z+rz)/cell);cz++){
   const list=buckets.get(cx)?.get(cz);if(!list)continue;
   for(const b of list){if(y>=b.maxY||y+height<=b.minY)continue;const dx=(b.minX+b.maxX)/2-x,dz=(b.minZ+b.maxZ)/2-z,bw=(b.maxX-b.minX)/2,bl=(b.maxZ-b.minZ)/2;
    if(Math.abs(dx)<rx+bw&&Math.abs(dz)<rz+bl&&Math.abs(dx*c-dz*s)<w+Math.abs(c)*bw+Math.abs(s)*bl&&Math.abs(dx*s+dz*c)<l+Math.abs(s)*bw+Math.abs(c)*bl)return true;
   }
  }return false;
 }
 return {add,collides,vehicleCollides,boxes};
}
