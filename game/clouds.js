import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';

function createCloudTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=512;c.height=512;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=256,cy=256;
 // Plump, organic, round cumulus puff: substantial core opacity and soft natural feathered edges
 const lobes=[
  [0, 0, 185, 0.98],
  [-50, -25, 140, 0.94],
  [50, -25, 140, 0.94],
  [-70, 30, 125, 0.90],
  [70, 30, 125, 0.90],
  [0, 65, 130, 0.92],
  [0, -65, 130, 0.92],
  [-35, 45, 120, 0.90],
  [35, 45, 120, 0.90],
  [-45, -50, 115, 0.88],
  [45, -50, 115, 0.88]
 ];
 for(const [px,py,pr,palpha] of lobes){
  const g=ctx.createRadialGradient(cx+px,cy+py,pr*0.12,cx+px,cy+py,pr);
  g.addColorStop(0,`rgba(255,255,255,${palpha})`);
  g.addColorStop(0.35,`rgba(255,255,255,${palpha*0.92})`);
  g.addColorStop(0.65,`rgba(255,255,255,${palpha*0.60})`);
  g.addColorStop(0.88,`rgba(255,255,255,${palpha*0.20})`);
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
 // Clearly visible, fluffy, soft cloud material (not ghostly/invisible)
 const material=new THREE.MeshBasicMaterial({
  color:'#ffffff',
  map:cloudTex,
  transparent:true,
  opacity:.80,
  depthWrite:false,
  side:THREE.DoubleSide
 });

 const planeGeom=new THREE.PlaneGeometry(1,1);

 // 32 plump, rounded, billowing cumulus cloud clusters floating naturally above Shanghai
 for(let i=0;i<32;i++){
  const root=new THREE.Group();
  // Altitudes Y: 118 ~ 152m - gracefully framing Oriental Pearl (105m) and Shanghai Tower (136m)
  const cx = -90 + (i * 47) % 360;
  const cy = 118 + (i % 6) * 6.2;
  const cz = -80 + (i * 59) % 350;
  root.position.set(cx, cy, cz);
  const s = 1.05 + (i % 5) * 0.22;
  const rot = (i * 0.42) % Math.PI;

  // 5 organic billowing puffs arranged in a natural 3D dome (not a flat horizontal line!)
  const puffs=[
   [0, 3.5*s, 0, 34*s],          // Top central billowing dome
   [-13*s, -1*s, 9*s, 27*s],     // South-West lobe
   [14*s, -0.5*s, 8*s, 28*s],    // South-East lobe
   [-9*s, -1.8*s, -13*s, 26*s],  // North-West lobe
   [11*s, -1.2*s, -11*s, 27*s]   // North-East lobe
  ];

  for(const [ox,oy,oz,rad] of puffs){
   // 1. Horizontal plane (for view from underneath)
   const p1=new THREE.Mesh(planeGeom,material);
   p1.position.set(ox,oy,oz);
   p1.rotation.set(Math.PI/2, rot, 0);
   p1.scale.set(rad, rad, 1);
   p1.userData.range=360;
   root.add(p1);

   // 2. Upright vertical plane 1 (faces angle rot: preserves full vertical height from ground view!)
   const p2=new THREE.Mesh(planeGeom,material);
   p2.position.set(ox,oy,oz);
   p2.rotation.set(0, rot, 0);
   p2.scale.set(rad, rad*0.92, 1);
   p2.userData.range=360;
   root.add(p2);

   // 3. Upright vertical plane 2 (faces perpendicular angle: cross-billow structure)
   const p3=new THREE.Mesh(planeGeom,material);
   p3.position.set(ox,oy,oz);
   p3.rotation.set(0, rot + Math.PI/2, 0);
   p3.scale.set(rad, rad*0.92, 1);
   p3.userData.range=360;
   root.add(p3);

   // 4. Diagonal inclined plane (45° pitch: bridges oblique ground angles smoothly)
   const p4=new THREE.Mesh(planeGeom,material);
   p4.position.set(ox,oy,oz);
   p4.rotation.set(Math.PI/4, rot + Math.PI/4, 0);
   p4.scale.set(rad, rad*0.92, 1);
   p4.userData.range=360;
   root.add(p4);
  }
  clouds.add(root);
 }

 batchMeshes(clouds,staticMeshes(clouds),'cumulus-clouds');
 return {clouds,cloudMat:material};
}
