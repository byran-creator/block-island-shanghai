import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';

function createCloudTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=512;c.height=512;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=256,cy=256;
 // Generate organic, fluffy cloud puffs with multi-layered soft Gaussian falloff
 // Natural cumulus silhouette with fluffy upper bumps, softer base, and airy feathered wisps
 const puffs=[
  [0, 20, 140, 0.65],
  [-70, 28, 110, 0.58],
  [70, 28, 110, 0.58],
  [-130, 35, 85, 0.45],
  [130, 35, 85, 0.45],
  [-45, -35, 115, 0.62],
  [45, -30, 110, 0.62],
  [0, -65, 95, 0.55],
  [-95, -15, 90, 0.50],
  [95, -10, 90, 0.50],
  [-170, 42, 60, 0.32],
  [170, 42, 60, 0.32],
  [0, 55, 110, 0.50]
 ];
 for(const [px,py,pr,palpha] of puffs){
  const g=ctx.createRadialGradient(cx+px,cy+py,pr*0.08,cx+px,cy+py,pr);
  g.addColorStop(0,`rgba(255,255,255,${palpha})`);
  g.addColorStop(0.42,`rgba(255,255,255,${palpha*0.65})`);
  g.addColorStop(0.75,`rgba(255,255,255,${palpha*0.18})`);
  g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx+px,cy+py,pr,0,Math.PI*2);ctx.fill();
 }
 const tex=new THREE.CanvasTexture(c);
 tex.wrapS=THREE.ClampToEdgeWrapping;
 tex.wrapT=THREE.ClampToEdgeWrapping;
 tex.needsUpdate=true;
 return tex;
}

export function createClouds(){
 const clouds=new THREE.Group();
 const cloudTex=createCloudTexture();
 // Soft, high-transparency cloud material with zero polygonal facets
 const material=new THREE.MeshBasicMaterial({
  color:'#ffffff',
  map:cloudTex,
  transparent:true,
  opacity:.52,
  depthWrite:false,
  side:THREE.DoubleSide
 });

 const planeGeom=new THREE.PlaneGeometry(1,1);

 // 34 scattered, high-altitude, lighter cloud clusters across the Shanghai sky
 for(let i=0;i<34;i++){
  const root=new THREE.Group();
  // Elevated higher up in the sky (Y: 185 ~ 225) so they feel lofty, deep, and atmospheric
  root.position.set(-260+i*79%680, 185+(i%6)*6.8, -260+i*113%650);
  const s=0.85+(i%5)*.22;

  // Multi-angle intersecting soft quads (Cross-Quads):
  // Never looks like a razor line from ANY viewing angle, always rounded and soft!
  const cluster=[
   // [x, y, z, w, h, rx, ry, rz]
   [0, 0, 0, 48*s, 32*s, Math.PI/2, (i*0.5)%Math.PI, 0],
   [-12*s, 1.5*s, 4*s, 38*s, 26*s, Math.PI/2+0.22, (i*0.5+0.4)%Math.PI, 0.1],
   [14*s, 1.2*s, -3*s, 40*s, 27*s, Math.PI/2-0.18, (i*0.5-0.3)%Math.PI, -0.1],
   // Tilted quads giving volumetric 3D presence without edge-on collapse
   [0, 3.5*s, 0, 44*s, 24*s, Math.PI/3, (i*0.5+0.8)%Math.PI, 0.15],
   [2*s, -2.5*s, 0, 42*s, 22*s, Math.PI/1.5, (i*0.5-0.7)%Math.PI, -0.15]
  ];

  for(const [x,y,z,w,h,rx,ry,rz] of cluster){
   const m=new THREE.Mesh(planeGeom,material);
   m.position.set(x,y,z);
   m.rotation.set(rx,ry,rz);
   m.scale.set(w,h,1);
   m.userData.range=360;
   root.add(m);
  }
  clouds.add(root);
 }

 batchMeshes(clouds,staticMeshes(clouds),'cumulus-clouds');
 return {clouds,cloudMat:material};
}
