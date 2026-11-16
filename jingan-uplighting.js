import {createVertexLightBake} from './nanjing-baked-light.js';
import {JINGAN,JINGAN_HALLS,JINGAN_TOWER} from './jingan-layout.js';

const {minX,maxX,minZ,maxZ}=JINGAN.temple;
const bounds={minX,maxX:maxX+1,minZ,maxZ:maxZ+1,minY:26.5,maxY:56};
export const jinganLightChunk=(cx,cz,size)=>cx*size<=bounds.maxX&&(cx+1)*size>=bounds.minX&&
 cz*size<=bounds.maxZ&&(cz+1)*size>=bounds.minZ;

function uplight(point,normal,source){
 const dx=source.x-point.x,dy=point.y-source.y,dz=source.z-point.z,d2=dx*dx+dy*dy+dz*dz;
 if(dy<=0||d2>=source.radiusSq||d2<.01)return 0;
 const distance=Math.sqrt(d2);
 const up=Math.max(0,(dy/distance-.27)/.73);
 const facing=Math.max(0,(normal.x*dx-normal.y*dy+normal.z*dz)/distance);
 const reach=1-d2/source.radiusSq;
 return source.strength*up*reach*reach*Math.sqrt(facing);
}

export function createJinganUplighting(){
 const sources=[];
 for(const {x,z,rx,rz,roof,upper} of JINGAN_HALLS){
  const radiusSq=upper?441:169;
  for(const offset of [-.64,0,.64]){
   sources.push({x:x+.5+rx*offset,y:26.15,z:z+rz+2.9,radiusSq,strength:upper?1.25:1.06});
  }
  if(upper)for(const side of [-1,1]){
   sources.push({x:x+.5+side*(rx+1.85),y:26.2,z:z+.5,radiusSq,strength:1.0});
   sources.push({x:x+.5+side*rx*.48,y:roof-3.5,z:z+rz+2.2,radiusSq:196,strength:.83});
  }
 }
 const {x,z}=JINGAN_TOWER;
 sources.push({x:x+.5,y:26.15,z:z+4.8,radiusSq:625,strength:1.34},
  {x:x-3.3,y:33.5,z:z+.5,radiusSq:400,strength:.94},
  {x:x+.5,y:40.5,z:z+3.4,radiusSq:196,strength:.93});
 return createVertexLightBake({sources,bounds,sample:uplight,cap:.85,gain:6.3,green:.76,blue:.42});
}
