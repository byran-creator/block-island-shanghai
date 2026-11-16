import * as THREE from './three.module.js';
import {JINGAN_ROOFS} from './jingan-layout.js';
import {batchMeshes} from './mesh-batch.js';

export function addJinganEaves(parent){
 const root=new THREE.Group(),pieces=[];
 const material=new THREE.MeshLambertMaterial({vertexColors:true});
 const blocks=['#835032','#b67f46','#d5a65d','#6d4830'].map(hex=>{
  const g=new THREE.BoxGeometry(1,1,1),color=new THREE.Color(hex);
  const colors=new Float32Array(g.attributes.position.count*3);
  for(let i=0;i<colors.length;i+=3)color.toArray(colors,i);
  g.setAttribute('color',new THREE.BufferAttribute(colors,3));
  return g;
 });
 function piece(tone,x,y,z,width,height,depth){
  const mesh=new THREE.Mesh(blocks[tone],material);
  mesh.position.set(x,y,z);
  mesh.scale.set(width,height,depth);
  pieces.push(mesh);
  root.add(mesh);
 }
 for(const roof of JINGAN_ROOFS){
  const {y,rx,rz}=roof,x=roof.x+.5,z=roof.z+.5;
  for(const axis of ['x','z']){
   const across=axis==='x'?rx:rz,depth=axis==='x'?rz:rx;
   for(const side of [-1,1]){
    const edge=depth+.5,support=edge-1;
    // Length runs parallel to the façade; projection points out under the tiles.
    const trim=(tone,offset,height,projection,length,thickness,reach)=>{
     if(axis==='x')piece(tone,x+offset,y+height,z+projection*side,length,thickness,reach);
     else piece(tone,x+projection*side,y+height,z+offset,reach,thickness,length);
    };
    trim(0,0,-.34,support+.08,across*2+.65,.23,.25);
    trim(2,0,-.10,edge-.14,across*2+.41,.13,.15);
    for(let offset=-across+.7;offset<=across-.55;offset+=1.08){
     trim(3,offset,-.17,(support+edge)/2,.16,.19,edge-support-.12);
    }
    const count=Math.max(1,Math.round((across*2-1)/2.65));
    const span=Math.max(0,across-1);
    for(let i=0;i<count;i++){
     const offset=count===1?0:span*(2*i/(count-1)-1);
     // A seat, cross arm and raised outer arm form the stepped bracket stack.
     trim(0,offset,-.86,support+.13,.34,.30,.38);
     trim(1,offset,-.63,support+.28,.78,.21,.64);
     trim(2,offset,-.43,support+.46,.39,.18,.80);
    }
   }
  }
  // Short projecting ends accent the existing upturned voxel corners.
  for(const sx of [-1,1])for(const sz of [-1,1]){
   piece(1,x+sx*(rx+.19),y-.27,z+sz*(rz+.21),.46,.25,.46);
   piece(2,x+sx*(rx+.36),y-.04,z+sz*(rz+.36),.33,.19,.33);
  }
 }
 const [mesh]=batchMeshes(root,pieces,'jingan-dougong-eaves');
 for(const g of blocks)g.dispose();
 root.remove(mesh);
 parent.add(mesh);
 return mesh;
}
