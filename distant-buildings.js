import {DEPTH,SIZE,VoxelWorld,WORLD_MIN,WORLD_MIN_Z} from './world.js';

// Four original columns and two levels form a distant voxel. Preserve empty
// layers and courtyards so this mesh does not fill the space under a roof.
export function createDistantBuildingMesher(chunk,height,water){
 const step=2,side=chunk/step,firstY=Math.floor(water/step)*step;
 const levels=Math.ceil((height-firstY)/step),plane=side*side;
 const voxels=new Uint8Array(plane*levels),counts=new Uint8Array(16);
 const mask=new Uint8Array(side*Math.max(side,levels));
 const accessor=cell=>voxels[cell[1]*plane+cell[2]*side+cell[0]];
 const floors=new Uint16Array(4),minimum=Math.floor(water)+1;
 function build(world,worldX,worldZ,groundAt,quad){
  voxels.fill(0);
  let top=0;
  const read=world instanceof VoxelWorld&&world.get===VoxelWorld.prototype.get?
   (x,y,z)=>world.data[y*SIZE*DEPTH+(z-WORLD_MIN_Z)*SIZE+x-WORLD_MIN]:(x,y,z)=>world.get(x,y,z);
  for(let z=0;z<side;z++)for(let x=0;x<side;x++){
   const lx=x*step,lz=z*step,wx=worldX+lx,wz=worldZ+lz;
   floors[0]=Math.max(minimum,groundAt(lx,lz));floors[1]=Math.max(minimum,groundAt(lx+1,lz));
   floors[2]=Math.max(minimum,groundAt(lx,lz+1));floors[3]=Math.max(minimum,groundAt(lx+1,lz+1));
   const start=Math.floor((Math.min(floors[0],floors[1],floors[2],floors[3])-firstY)/step);
   for(let layer=start;layer<levels;layer++){
    const y=firstY+layer*step,end=Math.min(y+step,height);
    let material=0;
    for(let i=0;i<4;i++)for(let yy=Math.max(y,floors[i]);yy<end;yy++){
     const id=read(wx+(i&1),yy,wz+(i>>1));
     if(!id)continue;
     const count=++counts[id];
     if(count>counts[material]||(count===counts[material]&&id!==11&&(material===11||id<material)))material=id;
    }
    if(!material)continue;
    voxels[layer*plane+z*side+x]=material;
    counts.fill(0);top=Math.max(top,layer+1);
   }
  }
  if(!top)return;
  const dimensions=[side,top,side],origin=[worldX,firstY,worldZ],cell=[0,0,0];
  for(let axis=0;axis<3;axis++){
   const u=(axis+1)%3,v=(axis+2)%3,width=dimensions[u],depth=dimensions[v];
   for(const facing of [-1,1])for(let slice=0;slice<dimensions[axis];slice++){
    const adjacent=slice+facing,inside=adjacent>=0&&adjacent<dimensions[axis];
    for(let j=0;j<depth;j++)for(let i=0;i<width;i++){
     cell[u]=i;cell[v]=j;cell[axis]=slice;
     const id=accessor(cell);
     cell[axis]=adjacent;
     mask[j*width+i]=id&&(!inside||!accessor(cell))?id:0;
    }
    for(let j=0;j<depth;j++)for(let i=0;i<width;i++){
     const id=mask[j*width+i];if(!id)continue;
     let endU=i+1,endV=j+1;
     while(endU<width&&mask[j*width+endU]===id)endU++;
     rows:while(endV<depth){
      for(let k=i;k<endU;k++)if(mask[endV*width+k]!==id)break rows;
      endV++;
     }
     for(let k=j;k<endV;k++)mask.fill(0,k*width+i,k*width+endU);
     const a=[...origin],normal=[0,0,0];
     a[axis]+=(slice+(facing===1?1:0))*step;a[u]+=i*step;a[v]+=j*step;
     normal[axis]=facing;
     const b=a.slice(),d=a.slice();b[u]+=(endU-i)*step;d[v]+=(endV-j)*step;
     const c=b.slice();c[v]=d[v];
     quad(id,...normal,facing===1?[...a,...b,...c,...d]:[...a,...d,...c,...b]);
    }
   }
  }
 }
 return {build};
}
