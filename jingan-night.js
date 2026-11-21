import * as THREE from './three.module.js';
import {batchMeshes} from './mesh-batch.js';
import {JINGAN,JINGAN_HALLS,JINGAN_ROOFS,JINGAN_OFFICES,JINGAN_TOWER,JINGAN_AVENUE_TREES} from './jingan-layout.js';
import {jinganOfficeSection} from './jingan-office.js';
import {nanjingWestCanopies} from './nanjing-west-layout.js';

function addTreeLights(root){
 const positions=[],colors=[],glowPositions=[],glowColors=[];
 const blue=new THREE.Color('#59b8ff'),white=new THREE.Color('#f0faff');
 function bulb(x,y,z,i){
  const color=i%3===0?white:blue;
  positions.push(x,y,z);
  colors.push(color.r,color.g,color.b);
 }
 function pool(x,z,r,color,alpha){
  const y=26.018,n=10;
  for(let i=0;i<n;i++){
   const a=i*Math.PI*2/n,b=(i+1)*Math.PI*2/n;
   glowPositions.push(x,y,z,x+Math.cos(a)*r,y,z+Math.sin(a)*r,x+Math.cos(b)*r,y,z+Math.sin(b)*r);
   glowColors.push(...color,alpha,...color,0,...color,0);
  }
 }
 for(const [x,z,h] of JINGAN_AVENUE_TREES){
  for(let i=0;i<80;i++){
   const a=i*.53,c=Math.cos(a),s=Math.sin(a),r=.55/Math.max(Math.abs(c),Math.abs(s));
   bulb(x+.5+c*r,26.24+i*(h-.5)/80,z+.5+s*r,i);
  }
  for(const side of [-1,1])for(let i=0;i<18;i++){
   const t=i/17,zFace=i%2?.57:-.57;
   bulb(x+.5+side*(.42+t*2.10),24.85+h+t*.96,z+.5+zFace,i);
  }
  pool(x+.5,z+.5,3.8,[.20,.54,.99],.28);
 }
 for(const x of [-315,-304,-293])pool(x+.5,JINGAN.arrival.z-1.6,4.7,[1,.50,.15],.24);
 const bulbs=new THREE.BufferGeometry();
 bulbs.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
 bulbs.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));
 const lights=new THREE.Points(bulbs,new THREE.PointsMaterial({size:.147,vertexColors:true,toneMapped:false}));
 const spill=new THREE.BufferGeometry();
 spill.setAttribute('position',new THREE.Float32BufferAttribute(glowPositions,3));
 spill.setAttribute('color',new THREE.Float32BufferAttribute(glowColors,4));
 const ground=new THREE.Mesh(spill,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,toneMapped:false}));
 for(const node of [lights,ground]){
  node.userData.range=85;
  node.matrixAutoUpdate=false;
  root.add(node);
 }
}

export function createJinganNight(parent,world){
 const root=new THREE.Group(),parts=[];
 root.name='jingan-night';
 root.visible=false;
 parent.add(root);
 const unit=new THREE.BoxGeometry(1,1,1);
 const gold=new THREE.MeshBasicMaterial({color:'#ffca79',toneMapped:false});
 const office=new THREE.MeshBasicMaterial({color:'#b6d8ee',toneMapped:false});
 function bar(x,y,z,w,h,d,material=gold){
  const mesh=new THREE.Mesh(unit,material);
  mesh.position.set(x,y,z);
  mesh.scale.set(w,h,d);
  mesh.userData.range=125;
  root.add(mesh);
  parts.push(mesh);
 }
 function eaves(x,z,y,rx,rz){
  for(const s of [-1,1]){
   bar(x+.5,y+.35,z+.5+s*(rz+.55),2*rx+1,.24,.105);
   bar(x+.5+s*(rx+.55),y+.35,z+.5,.105,.24,2*rz+1);
   for(const t of [-1,1])bar(x+.5+t*(rx-.2),y+1.46,z+.5+s*(rz+.55),1.2,.18,.105);
  }
 }
 for(const {x,z,y,rx,rz} of JINGAN_ROOFS)eaves(x,z,y,rx,rz);
 for(const h of JINGAN_HALLS){
  if(h.upperRoof){
   const rrx=Math.max(1,h.rx-(h.id==='mahavira'?0:1)-(h.upperLayers??3)+1);
   bar(h.x+.5,h.upperRoof+(h.upperLayers??4)+.7,h.z+.5,Math.max(2,2*rrx),.12,.18);
  }
 }
 // Five Golden Stupas + Ashoka Dharma Wheel + 4 Courtyard Lanterns
 const {x:tx,z:tz}=JINGAN_TOWER;
 bar(tx+.5,57.5,tz+.5,.36,6.4,.36);
 for(const [ox,oz] of [[-1.65,-1.65],[1.65,-1.65],[-1.65,1.65],[1.65,1.65]])bar(tx+.5+ox,56.2,tz+.5+oz,.22,3.6,.22);
 bar(-289.5,43.2,7.5,1.2,1.2,.12);
 for(const lz of [-4.5,1.5])for(const sx of [-1,1])bar(-303.5+sx*3.5,27.2,lz,.42,.42,.42);
 for(const plot of JINGAN_OFFICES){
  const {x,z,rx,rz,height,style}=plot;
  if(!world.get(x-rx,26,z-rz))continue;
  if(height>20){
   for(let y=32;y<25+height-7;y+=8){
    const offset=(y+height)%3;
    const section=jinganOfficeSection(plot,y),front=z+section.rz+1;
    bar(x+section.shift-.8+offset,y+.48,front+.032,1.8,.11,.055,office);
    if(section.rz>=2)bar(x+section.shift-section.rx-.035,y+.48,z+.5,.055,.11,1.65,office);
   }
  }else if(style==='ballroom'||style==='retail'){
   const front=style==='ballroom'?z-rz-1.03:z+rz+2.03;
   bar(x+.5,30.53,front,rx*1.65,.17,.09);
  }
 }
 for(const [x,z] of nanjingWestCanopies)bar(x,29.22,z+.035,2.86,.12,.06);
 const batches=batchMeshes(root,parts,'jingan-facade-light');
 if(batches.every(mesh=>mesh.geometry!==unit))unit.dispose();
 addTreeLights(root);
 return root;
}
