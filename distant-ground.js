import {BufferAttribute,BufferGeometry,Color,DynamicDrawUsage,Mesh,MeshLambertMaterial} from './three.module.js';

// Only the ground under unloaded detail chunks is drawn here. The same voxel
// surface determines the shore, park lakes, land slope and player-made holes.
export function createDistantGround({scene,world,chunks,chunk,minX,minZ,max,water,colors,range,tint}){
 const material=new MeshLambertMaterial({vertexColors:true}),palette=colors.map(c=>c&&new Color(c).toArray().map(channel=>Math.round(channel*255)));
 if(tint)material.color=tint;
 const span=chunk*4,lookup=new Map(),sectors=[],pending=[];
 const offsets=[[1,0],[-1,0],[0,1],[0,-1]],width=chunk+2,columns=new Uint16Array(width*width),used=new Uint8Array(chunk*chunk);
 const ground=Math.floor(water)+1;
 let oldSectorX,oldSectorZ;
 for(let x=minX;x<max;x+=span)for(let z=minZ;z<max;z+=span){
  const sector={x,z,parts:[],mesh:null,dirty:true,inRange:false};
  for(let xx=x;xx<Math.min(max,x+span);xx+=chunk)for(let zz=z;zz<Math.min(max,z+span);zz+=chunk){
   const key=xx/chunk+','+zz/chunk;
   sector.parts.push({key,x:xx,z:zz});lookup.set(key,sector);
  }
  sectors.push(sector);
 }
 function plan(point){
  const sx=Math.floor((point.x-minX)/span),sz=Math.floor((point.z-minZ)/span);
  if(sx===oldSectorX&&sz===oldSectorZ)return;
  oldSectorX=sx;oldSectorZ=sz;
  pending.length=0;
  const distance=s=>Math.max(s.x-point.x,point.x-s.x-span,0)**2+Math.max(s.z-point.z,point.z-s.z-span,0)**2;
  for(const sector of sectors){
   sector.inRange=distance(sector)<=(range+span)**2;
   if(sector.mesh)sector.mesh.visible=sector.inRange&&sector.mesh.geometry.drawRange.count>0;
   if(sector.inRange&&sector.dirty)pending.push(sector);
  }
  pending.sort((a,b)=>distance(a)-distance(b));
 }
 function sample(x,z){
  // Reclaimed plazas may have a higher built ground than the original terrain.
  const base=world.surfaceAt(x,z),reclaimed=base<26&&world.get(x,ground-1,z)&&world.get(x,24,z);
  for(let y=reclaimed?26:base;y>=ground;y--){
   const id=world.get(x,y-1,z);
   if(id)return y*16+id;
  }
  return 0;
 }
 function appendPart(build,part){
  const {position,normal,color,indices}=build;
  part.start=indices.length;
  for(let z=-1;z<=chunk;z++)for(let x=-1;x<=chunk;x++)columns[(z+1)*width+x+1]=sample(part.x+x,part.z+z);
  used.fill(0);
  const at=(x,z)=>columns[(z+1)*width+x+1];
  function quad(c,nx,ny,nz,vertices){
   const index=position.length/3;
   position.push(...vertices);
   for(let i=0;i<4;i++){normal.push(nx*127,ny*127,nz*127);color.push(...c);}
   indices.push(index,index+1,index+2,index,index+2,index+3);
  }
  for(let z=0;z<chunk;z++)for(let x=0;x<chunk;x++){
   const value=at(x,z);if(!value)continue;
   const xx=part.x+x,zz=part.z+z,yy=value>>4,c=palette[value&15];
   if(!used[z*chunk+x]){
    let endX=x+1,endZ=z+1;
    while(endX<chunk&&!used[z*chunk+endX]&&at(endX,z)===value)endX++;
    row:while(endZ<chunk){
     for(let i=x;i<endX;i++)if(used[endZ*chunk+i]||at(i,endZ)!==value)break row;
     endZ++;
    }
    for(let j=z;j<endZ;j++)used.fill(1,j*chunk+x,j*chunk+endX);
    const right=part.x+endX,back=part.z+endZ;
    quad(c,0,1,0,[xx,yy,zz,xx,yy,back,right,yy,back,right,yy,zz]);
   }
   for(const [dx,dz] of offsets){
    const lower=Math.max(water-.02,at(x+dx,z+dz)>>4);if(lower>=yy)continue;
    const ax=xx+(dx>0||dz>0?1:0),az=zz+(dz>0||dx<0?1:0);
    const bx=ax-dz,bz=az+dx;
    quad(palette[2],dx,0,dz,[ax,lower,az,ax,yy,az,bx,yy,bz,bx,lower,bz]);
   }
  }
  part.count=indices.length-part.start;
 }
 function updateIndices(sector){
  if(!sector.mesh)return;
  const geometry=sector.mesh.geometry,index=geometry.index;
  let length=0;
  for(const part of sector.parts)if(!chunks.has(part.key)&&part.count){
   index.array.set(sector.indices.subarray(part.start,part.start+part.count),length);length+=part.count;
  }
  sector.mesh.visible=sector.inRange&&length>0;
  geometry.setDrawRange(0,length);
  index.clearUpdateRanges();
  if(length){index.addUpdateRange(0,length);index.needsUpdate=true;}
 }
 function commit(sector,build){
  if(sector.mesh){scene.remove(sector.mesh);sector.mesh.geometry.dispose();sector.mesh=null;}
  if(!build.indices.length)return;
  const {position,normal,color,indices}=build,geometry=new BufferGeometry();
  geometry.setAttribute('position',new BufferAttribute(new Float32Array(position),3));
  geometry.setAttribute('normal',new BufferAttribute(new Int8Array(normal),3,true));
  geometry.setAttribute('color',new BufferAttribute(new Uint8Array(color),3,true));
  const Index=position.length/3>65535?Uint32Array:Uint16Array;
  sector.indices=new Index(indices);
  geometry.setIndex(new BufferAttribute(new Index(indices.length),1).setUsage(DynamicDrawUsage));
  geometry.computeBoundingSphere();
  const mesh=new Mesh(geometry,material);
  mesh.name='distant-ground';mesh.userData.range=range;mesh.userData.rgbColors=true;mesh.matrixAutoUpdate=false;
  scene.add(mesh);sector.mesh=mesh;updateIndices(sector);
 }
 function process(budget=1){
  const start=performance.now();
  while(pending.length){
   const sector=pending[0];
   const build=sector.build??={position:[],normal:[],color:[],indices:[],next:0};
   appendPart(build,sector.parts[build.next++]);
   if(build.next===sector.parts.length){
    pending.shift();sector.build=null;sector.dirty=false;commit(sector,build);break;
   }
   if(performance.now()-start>=budget)break;
  }
 }
 function update(key){const sector=lookup.get(key);if(sector&&!sector.dirty)updateIndices(sector);}
 function hasGroundAt(x,z){const key=Math.floor(x/chunk)+','+Math.floor(z/chunk),sector=lookup.get(key);return !!sector?.mesh&&!sector.dirty&&sector.parts.some(part=>part.key===key&&part.count);}
 function invalidate(key){
  const sector=lookup.get(key);if(!sector)return;
  sector.dirty=true;sector.build=null;
  if(sector.mesh){scene.remove(sector.mesh);sector.mesh.geometry.dispose();sector.mesh=null;}
  if(!pending.includes(sector)){oldSectorX=undefined;oldSectorZ=undefined;}
 }
 return {plan,process,update,invalidate,hasGroundAt};
}
