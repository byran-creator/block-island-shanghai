import * as THREE from './three.module.js';
import {CITY} from './shanghai-map.js';

// Cosmetic only: derive trim from existing exterior glass cells, so doors,
// indoor floors and the SWFC aperture remain open. No new world/save data.
export function addLandmarkFinish(scene,world,material){
 let quads=0;const meshes=[];
 for(const id of ['shanghai','jinmao','swfc']){
  const center=CITY[id],cx=Math.floor(center.x),cz=Math.floor(center.z),horizontal=new Map(),vertical=new Map();
  function remember(map,key,value,face){let row=map.get(key);if(!row)map.set(key,row={face,values:[]});row.values.push(value);}
  for(let y=32;y<center.top-1;y++)for(let x=cx-11;x<=cx+11;x++)for(let z=cz-11;z<=cz+11;z++){
   if(world.get(x,y,z)!==11)continue;
   for(const axis of ['x','z'])for(const side of [-1,1]){
    const outward=axis==='x'?(x+.5-center.x)*side:(z+.5-center.z)*side;if(outward<=0||world.get(x+(axis==='x'?side:0),y,z+(axis==='z'?side:0)))continue;
    const at=(axis==='x'?x:z)+(side>0?1:0)+side*.018,u=axis==='x'?z:x,face={axis,side,at};
    if(y%12===7)remember(horizontal,axis+':'+side+':'+at+':'+y,u,{...face,y});
    if((u-(axis==='x'?cz:cx))%5===0)remember(vertical,axis+':'+side+':'+at+':'+u,y,{...face,u});
   }
  }
  const positions=[],normals=[],indices=[];
  function quad(f,u0,u1,y0,y1){
   const points=f.axis==='x'?[[f.at,y0,u0],[f.at,y1,u0],[f.at,y1,u1],[f.at,y0,u1]]:[[u0,y0,f.at],[u1,y0,f.at],[u1,y1,f.at],[u0,y1,f.at]],base=positions.length/3;
   for(const p of points){positions.push(...p);normals.push(f.axis==='x'?f.side:0,0,f.axis==='z'?f.side:0);}
   indices.push(...(f.side>0?[base,base+1,base+2,base,base+2,base+3]:[base,base+2,base+1,base,base+3,base+2]));quads++;
  }
  function runs(rows,emit){for(const {face,values}of rows.values()){values.sort((a,b)=>a-b);let start=values[0],last=start;for(let i=1;i<values.length;i++){if(values[i]!==last+1){emit(face,start,last+1);start=values[i];}last=values[i];}emit(face,start,last+1);}}
  runs(horizontal,(f,a,b)=>quad(f,a,b,f.y+.72,f.y+.78));
  runs(vertical,(f,a,b)=>{
   // Split around horizontal ribbons, avoiding coplanar overlapping quads.
   let start=a;for(let y=a;y<b;y++)if(y%12===7){if(y+.72>start)quad(f,f.u+.46,f.u+.52,start,y+.72);start=y+.78;}if(start<b)quad(f,f.u+.46,f.u+.52,start,b);
  });
  if(!positions.length)continue;
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));geometry.setIndex(indices);geometry.computeBoundingSphere();
  const mesh=new THREE.Mesh(geometry,material);mesh.name='landmark-static-finish-'+id;mesh.userData.range=285;mesh.userData.disposeAfterStaticBatch=true;mesh.matrixAutoUpdate=false;scene.add(mesh);meshes.push(mesh);
 }
 return {quads,sourceMeshes:meshes.length};
}
