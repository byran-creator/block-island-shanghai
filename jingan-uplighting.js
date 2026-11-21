import {createVertexLightBake} from './nanjing-baked-light.js';
import {JINGAN,JINGAN_HALLS,JINGAN_TOWER} from './jingan-layout.js';

const {minX,maxX,minZ,maxZ}=JINGAN.temple;
const bounds={minX,maxX:maxX+1,minZ,maxZ:maxZ+1,minY:26.2,maxY:65};
export const jinganLightChunk=(cx,cz,size)=>cx*size<=bounds.maxX&&(cx+1)*size>=bounds.minX&&
 cz*size<=bounds.maxZ&&(cz+1)*size>=bounds.minZ;

function uplight(point,normal,source){
 const dx=source.x-point.x,dy=point.y-source.y,dz=source.z-point.z,d2=dx*dx+dy*dy+dz*dz;
 if(dy<=0||d2>=source.radiusSq||d2<.01)return 0;
 const distance=Math.sqrt(d2);
 const up=Math.max(0,(dy/distance-.24)/.76);
 const facing=Math.max(0,(normal.x*dx-normal.y*dy+normal.z*dz)/distance);
 const reach=1-d2/source.radiusSq;
 return source.strength*up*reach*reach*Math.sqrt(facing);
}

export function createJinganUplighting(){
 const sources=[];
 for(const {id,x,z,rx,rz,roof,upper,upperRoof} of JINGAN_HALLS){
  const radiusSq=upper?484:196;
  for(const offset of [-.64,0,.64]){
   sources.push({x:x+.5+rx*offset,y:26.15,z:z+rz+2.9,radiusSq,strength:upper?1.32:1.12});
  }
  if(upper){
   for(const side of [-1,1]){
    sources.push({x:x+.5+side*(rx+1.85),y:26.2,z:z+.5,radiusSq,strength:1.05});
    sources.push({x:x+.5+side*rx*.48,y:roof-3.5,z:z+rz+2.2,radiusSq:225,strength:.9});
    if(upperRoof)sources.push({x:x+.5+side*rx*.42,y:upperRoof-2.5,z:z+.5,radiusSq:225,strength:1.1});
   }
  }else if(id==='bell'||id==='drum'){
   sources.push({x:x+.5,y:34.2,z:z+2.6,radiusSq:144,strength:1.05});
  }
 }
 // Southeast Ashoka Pillar warm floodlight
 sources.push({x:-289.5,y:26.2,z:9.5,radiusSq:256,strength:1.15},{x:-289.5,y:37.5,z:9.2,radiusSq:144,strength:1.25});
 // Northwest 7-Story Pagoda & Five Gold-Leaf Stupas high-intensity uplights
 const {x,z}=JINGAN_TOWER;
 sources.push(
  {x:x+.5,y:26.15,z:z+4.8,radiusSq:676,strength:1.45},
  {x:x-3.3,y:34.5,z:z+.5,radiusSq:484,strength:1.15},
  {x:x+3.5,y:38.5,z:z+.5,radiusSq:441,strength:1.15},
  {x:x+.5,y:44.5,z:z+3.6,radiusSq:324,strength:1.25},
  {x:x+.5,y:51.5,z:z+.5,radiusSq:256,strength:1.45}
 );
 return createVertexLightBake({sources,bounds,sample:uplight,cap:.85,gain:6.3,green:.76,blue:.42});
}
