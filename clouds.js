import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
export function createClouds(){
 const clouds=new THREE.Group(),material=new THREE.MeshLambertMaterial({color:'#ffffff',vertexColors:true}),geometry=new THREE.SphereGeometry(1,12,8);
 const colors=[];for(let i=0;i<geometry.attributes.normal.count;i++){const shade=.72+.28*Math.max(0,geometry.attributes.normal.getY(i));colors.push(shade,shade,Math.min(1,shade+.04));}geometry.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 // Each cumulus has a shallow, connected base and a varied round crown.
 for(let i=0;i<22;i++){const root=new THREE.Group();root.position.set(-145+i*89%490,147+i%4*5,-125+i*137%450);const s=.75+i%5*.12;
  for(const [x,y,z,rx,ry,rz]of [[0,0,0,11,2.2,6],[-7,1.2,.5,5,3.8,4],[6,1.4,0,6,4.8,4.5],[-2,3,-.5,6.2,5.6,5],[2,2.2,3,5.5,4.2,4],[-3,1,-3.5,5,3.2,3.5]]){const m=new THREE.Mesh(geometry,material);m.position.set(x*s,y*s,z*s);m.scale.set(rx*s,ry*s,rz*s);m.userData.range=300;root.add(m);}root.rotation.y=i*1.73;clouds.add(root);
 }batchMeshes(clouds,staticMeshes(clouds),'cumulus-clouds');return {clouds,cloudMat:material};
}
