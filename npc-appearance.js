import * as THREE from './three.module.js';

const cache=new Map(),solids=new Map(),cube=new THREE.BoxGeometry(1,1,1),uv=cube.attributes.uv;
const solid=color=>{if(!solids.has(color))solids.set(color,new THREE.MeshLambertMaterial({color}));return solids.get(color);};
for(let face=0;face<6;face++)for(let i=face*4;i<face*4+4;i++){const u=uv.getX(i),v=uv.getY(i);uv.setXY(i,(face%3+u)/3,(1-Math.floor(face/3)+v)/2);}
const skins=['#e5bb98','#d4a481','#b7805e','#edcbb0'],hairs=['#302c2b','#60432f','#b58a55','#3b3334'],shirts=['#548faa','#a66885','#e3d3b7','#779b80'];
export function npcPalette(seed=0,role='visitor'){
 const i=((seed%8)+8)%8;return {variant:i,skin:skins[i%4],hair:hairs[(i+1+Math.floor(i/4))%4],shirt:role==='officer'?'#8bb2d9':role==='staff'?'#688da9':role==='vendor'?'#d5c5a1':role==='office'?'#7692a7':role==='delivery'?(i%2?'#59a8ca':'#e7bd4e'):role==='guide'?'#4c9a9a':shirts[i%4],pants:i%2?'#39475f':'#435363'};
}
function texture(part,palette,role){
 if(typeof document==='undefined')return solid(part==='head'?palette.skin:part==='leg'?palette.pants:palette.shirt);
 const key=role+':'+(part==='head'?palette.variant:palette.variant%4)+':'+part;if(cache.has(key))return cache.get(key);
 const canvas=document.createElement('canvas');canvas.width=96;canvas.height=64;const ctx=canvas.getContext('2d');
 for(let face=0;face<6;face++){
  const x=face%3*32,y=Math.floor(face/3)*32,paint=(color,a,b,w,h)=>{ctx.fillStyle=color;ctx.fillRect(x+a,y+b,w,h);};
  const base=part==='head'?palette.skin:part==='leg'?palette.pants:palette.shirt;paint(base,0,0,32,32);
  for(let k=0;k<8;k++)paint(k%2?'#ffffff0c':'#14232b10',(k*13+palette.variant*5)%30,(k*9+face*5)%30,2,2);
  if(part==='head'){
   paint(palette.hair,0,0,32,face===2||face===4?32:9);if(face!==2&&face!==3&&face!==5)paint(palette.hair,0,0,8,27);
   if(face===5){const v=palette.variant,eyeY=v%2?15:16,eyeH=[4,3,5,2][v%4];paint(palette.hair,0,8,4,9);paint(palette.hair,28,8,4,9);paint(palette.hair,4+(v%4)*3,8,8,4);for(const x of [6,20]){paint(palette.hair,x,eyeY-3,7,v%3===0?2:1);paint('#f4eee5',x,eyeY,7,eyeH);paint(['#293c49','#4b6545','#5d4036','#365d78'][v%4],x+3+(v%2),eyeY+1,2,Math.max(1,eyeH-1));if(v===4||v===6){paint('#293340',x-1,eyeY-1,9,1);paint('#293340',x-1,eyeY+eyeH,9,1);paint('#293340',x-1,eyeY-1,1,eyeH+2);paint('#293340',x+7,eyeY-1,1,eyeH+2);}}if(v===4||v===6)paint('#293340',13,eyeY,7,1);paint('#9b725c',15,21,2+v%2,2);paint('#9a6558',12+v%2,25+v%2,6+v%3,1);if(v%3===1){paint('#9a6558',11,24,2,1);paint('#9a6558',19,24,2,1);}if(v===7)paint(palette.hair,11,26,10,3);}
  }else if(part==='torso'){
   paint('#21324455',0,28,32,4);paint('#ffffff20',0,3,32,2);if(face===5){paint('#f0e9db',11,0,10,4);paint('#253b4c',15,4,2,24);for(let b=8;b<26;b+=5)paint('#e7ece8',15,b,2,2);paint('#29405066',3,12,8,1);paint('#29405066',21,12,8,1);}
   if(role==='vendor'){paint('#6c8b79',5,10,22,20);paint('#e2d2af',5,25,22,2);}
   if(role==='officer'){paint('#233853',0,0,8,3);paint('#233853',24,0,8,3);if(face===5)paint('#e4eef3',22,8,6,3);}
   if(role==='guide'){paint('#b5e6de',1,16,30,3);if(face===5)paint('#e6f3e9',21,8,7,5);}
   if(role==='office'&&face===5)paint('#38516c',14,4,4,17);
  }else if(part==='arm'){paint('#ffffff30',0,23,32,2);paint(palette.skin,0,25,32,7);}
  else{paint('#1b2b3a44',1,0,2,27);paint('#ffffff16',15,4,1,22);paint('#28343d',0,27,32,5);paint('#c8d5d7',0,31,32,1);}
 }
 const map=new THREE.CanvasTexture(canvas);map.magFilter=THREE.NearestFilter;map.minFilter=THREE.LinearMipmapLinearFilter;map.colorSpace=THREE.SRGBColorSpace;
 const material=new THREE.MeshLambertMaterial({map});cache.set(key,material);return material;
}
export function styleNpc({root,head,torso,hair,arms=[],legs=[]},seed=0,role='visitor'){
 const palette=npcPalette(seed,role),apply=(mesh,part)=>{if(!mesh)return;mesh.geometry=cube;mesh.material=texture(part,palette,role);mesh.userData.panel=true;mesh.userData.npcPart=part;};
 apply(head,'head');apply(torso,'torso');for(const a of arms){apply(a.isMesh?a:a.children[0],'arm');if(!a.isMesh&&a.children[1]?.isMesh&&role!=='officer')a.children[1].material=solid(palette.skin);}for(const l of legs)apply(l.isMesh?l:l.children[0],'leg');
 if(hair)hair.material=solid(palette.hair);root.userData.appearance={role,variant:palette.variant};return palette;
}
