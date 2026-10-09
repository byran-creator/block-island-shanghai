import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';

function createCloudTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=256;c.height=256;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=128,cy=128;
 // Draw multiple layered soft Gaussian puffs to form a natural, fluffy, wispy cloud silhouette
 const puffs=[
  [0, 16, 75, 0.72],
  [-38, 22, 58, 0.65],
  [38, 22, 58, 0.65],
  [-68, 26, 42, 0.50],
  [68, 26, 42, 0.50],
  [-22, -10, 56, 0.70],
  [22, -8, 54, 0.70],
  [0, -24, 46, 0.62],
  [-45, -2, 45, 0.55],
  [45, 0, 45, 0.55]
 ];
 for(const [px,py,pr,palpha] of puffs){
  const g=ctx.createRadialGradient(cx+px,cy+py,pr*0.12,cx+px,cy+py,pr);
  g.addColorStop(0,`rgba(255,255,255,${palpha})`);
  g.addColorStop(0.48,`rgba(255,255,255,${palpha*0.68})`);
  g.addColorStop(0.82,`rgba(255,255,255,${palpha*0.18})`);
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
 // Soft translucent cloud material that stays bright and airy without muddy Lambert shadows
 const material=new THREE.MeshBasicMaterial({
  color:'#ffffff',
  map:cloudTex,
  transparent:true,
  opacity:.66,
  depthWrite:false,
  side:THREE.DoubleSide
 });
 const planeGeom=new THREE.PlaneGeometry(1,1);

 // 26 natural cloud formations spread across the city skyline
 for(let i=0;i<26;i++){
  const root=new THREE.Group();
  root.position.set(-180+i*93%520, 142+(i%5)*5.5, -160+i*131%480);
  const s=1.1+i%4*.25;

  // Stretched layered flat-bottomed clouds like in the reference photos
  const subLayers=[
   // [x, y, z, width, length, rx, ry]
   [0, 0, 0, 68*s, 38*s, Math.PI/2, (i*0.4)%Math.PI],
   [-18*s, 2.2, 5*s, 48*s, 30*s, Math.PI/2+0.12, (i*0.4+0.3)%Math.PI],
   [20*s, 1.8, -4*s, 52*s, 32*s, Math.PI/2-0.08, (i*0.4-0.2)%Math.PI],
   // Soft angled wisps so clouds look volumetric from horizontal street-level angles
   [0, 4.5*s, 0, 58*s, 26*s, Math.PI/2.4, (i*0.4)%Math.PI]
  ];

  for(const [x,y,z,w,h,rx,ry] of subLayers){
   const m=new THREE.Mesh(planeGeom,material);
   m.position.set(x,y,z);
   m.rotation.set(rx,ry,0);
   m.scale.set(w,h,1);
   m.userData.range=320;
   root.add(m);
  }
  clouds.add(root);
 }

 batchMeshes(clouds,staticMeshes(clouds),'cumulus-clouds');
 return {clouds,cloudMat:material};
}
