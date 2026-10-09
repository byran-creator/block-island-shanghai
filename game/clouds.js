import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';

export function createClouds(){
 const clouds=new THREE.Group();
 // Soft, luminous, semi-transparent cloud material with zero muddy Lambert shadows
 const material=new THREE.MeshBasicMaterial({
  color:'#ffffff',
  vertexColors:true,
  transparent:true,
  opacity:.66,
  depthWrite:false
 });

 // Base rounded puff dome with gentle top-to-bottom soft aerial gradient
 const baseGeom=new THREE.SphereGeometry(1,14,10);
 const colors=[];
 for(let i=0;i<baseGeom.attributes.position.count;i++){
  const ny=baseGeom.attributes.normal.getY(i);
  // Top is pure sunlit white (1.0), bottom is softly tinted airy white (0.91)
  const shade=.91+.09*Math.max(0,ny);
  colors.push(shade,shade,Math.min(1,shade+.03));
 }
 baseGeom.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));

 // 22 natural, plump, volumetric cumulus formations across the city
 for(let i=0;i<22;i++){
  const root=new THREE.Group();
  root.position.set(-190+i*97%520, 140+(i%5)*5.2, -170+i*137%490);
  const s=1.15+(i%4)*.22;

  // Each cumulus has a broad flattened base and soft billowing upper domes (like in reference photos)
  const puffs=[
   // [x, y, z, rx, ry, rz]
   [0, 0, 0, 36*s, 11*s, 24*s],
   [-16*s, 1.5*s, 3*s, 25*s, 12*s, 19*s],
   [18*s, 1.2*s, -2*s, 26*s, 11*s, 20*s],
   [-4*s, 4.2*s, 1*s, 22*s, 13*s, 18*s],
   [10*s, 3.8*s, -2*s, 19*s, 11.5*s, 16*s]
  ];

  for(const [x,y,z,rx,ry,rz] of puffs){
   const m=new THREE.Mesh(baseGeom,material);
   m.position.set(x,y,z);
   m.scale.set(rx,ry,rz);
   m.userData.range=320;
   root.add(m);
  }
  root.rotation.y=(i*0.77)%Math.PI;
  clouds.add(root);
 }

 batchMeshes(clouds,staticMeshes(clouds),'cumulus-clouds');
 return {clouds,cloudMat:material};
}
