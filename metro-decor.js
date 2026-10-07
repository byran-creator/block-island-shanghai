import * as THREE from './three.module.js';
// Original geometry/textures observed from Baycrest's 2017 Lujiazui platform photo.
export function terrazzoTexture(){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#9b9c97';ctx.fillRect(0,0,128,128);let seed=319;for(let i=0;i<1900;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%128,y=(seed>>>8)%128;ctx.fillStyle=['#bebdb5','#7f8583','#a6aba5','#d1cec2'][i%4];ctx.fillRect(x,y,1,1);}ctx.fillStyle='#727974';ctx.fillRect(0,0,128,1);ctx.fillRect(0,0,1,128);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
export function decorateMetroStation(root,s,{cube,slab,board}){
 for(const y of [6,16]){
  const half=y===6?5:14,top=y===6?4.8:5.5;
  for(const z of [-1.85,1.85])slab(root,'#534b41',s.x,y+.025,s.z+z,69,.28);
  for(let x=-34;x<35;x+=.55)slab(root,'#303537',s.x+x,y+top-.16,s.z,.14,half*2);
  for(const x of [-28,-14,0,14,28]){const z=s.z+(y===6?-.4:-11);cube(root,'#e9e7df',s.x+x,y+2.25,z,1.3,4.5,1.3);cube(root,s.color,s.x+x,y+4.1,z,1.65,.4,1.65);cube(root,'#5e5d59',s.x+x,y+.16,z,1.38,.3,1.38);board(root,[s.name,'← 2 →'],s.x+x,y+2.9,z+.67,1.1,.75,'#313735','#ecebe6');}
 }
 for(const side of [-1,1]){
  for(let x=-34;x<35;x+=1.5)for(const z of [-.14,0,.14])cube(root,'#b1ca7c',s.x+x,6.06,s.z+side*4.4+z,1.4,.025,.035);
  const guidance=board(root,[side<0?'→ 陆家嘴':'← 南京东路','出口 Exit ↑ · 先下后上'],s.x+(side<0?9:-9),10.1,s.z+side*10.9,6,.55,'#f4f7f4','#192123');
  guidance.mesh.userData.stationSign=true;
 }
}
