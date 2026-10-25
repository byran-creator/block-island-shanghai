import * as THREE from './three.module.js';

// Write the final static facade buffers directly. Keep source order and world
// transforms identical to the previous number-array/push implementation.
export function bundStaticGeometry(sources){
 let vertices=0,indexCount=0;
 for(const mesh of sources){const g=mesh.geometry;vertices+=g.attributes.position.count;indexCount+=g.index?.count??g.attributes.position.count;}
 const position=new Float32Array(vertices*3),normal=new Float32Array(vertices*3),uv=new Float32Array(vertices*2);
 let indices=vertices>=65536?new Uint32Array(indexCount):new Uint16Array(indexCount),offset=0,index=0,maxIndex=0;
 const v=new THREE.Vector3(),n=new THREE.Vector3(),nm=new THREE.Matrix3();
 for(const mesh of sources){const g=mesh.geometry,p=g.attributes.position,no=g.attributes.normal,t=g.attributes.uv;nm.getNormalMatrix(mesh.matrixWorld);
  for(let i=0;i<p.count;i++){const a=(offset+i)*3,b=(offset+i)*2;v.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);position[a]=v.x;position[a+1]=v.y;position[a+2]=v.z;n.fromBufferAttribute(no,i).applyMatrix3(nm).normalize();normal[a]=n.x;normal[a+1]=n.y;normal[a+2]=n.z;uv[b]=t?.getX(i)??0;uv[b+1]=t?.getY(i)??0;}
  for(let i=0;i<(g.index?.count??p.count);i++){const value=offset+(g.index?g.index.getX(i):i);indices[index++]=value;maxIndex=Math.max(maxIndex,value);}offset+=p.count;
 }
 // Three reserves 65535 for primitive restart. Match its original setIndex.
 if(indices instanceof Uint32Array&&maxIndex<65535)indices=new Uint16Array(indices);
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(position,3));geometry.setAttribute('normal',new THREE.BufferAttribute(normal,3));geometry.setAttribute('uv',new THREE.BufferAttribute(uv,2));geometry.setIndex(new THREE.BufferAttribute(indices,1));geometry.computeBoundingSphere();return geometry;
}
