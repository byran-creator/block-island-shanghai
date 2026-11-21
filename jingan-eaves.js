import * as THREE from './three.module.js';
import {JINGAN,JINGAN_HALLS,JINGAN_ROOFS,JINGAN_TOWER} from './jingan-layout.js';
import {batchMeshes} from './mesh-batch.js';

export function addJinganEaves(parent){
 const root=new THREE.Group(),pieces=[];
 const material=new THREE.MeshLambertMaterial({vertexColors:true});
 const blocks=['#835032','#b67f46','#d5a65d','#6d4830','#e8b45c','#dfd8ba','#3b5746','#8d2018','#5e3820','#ffd573'].map(hex=>{
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
 function balustrade(x1,z1,x2,z2,baseY,steps){
  const mx=(x1+x2)*.5,mz=(z1+z2)*.5,dx=x2-x1,dz=z2-z1,len=Math.hypot(dx,dz);
  if(len<.4)return;
  const alongX=Math.abs(dx)>=Math.abs(dz);
  piece(5,mx,baseY+.56,mz,alongX?len:.12,.10,alongX?.12:len);
  for(let i=0;i<steps;i++){
   const t=steps===1?.5:i/(steps-1);
   piece(5,x1+dx*t,baseY+.40,z1+dz*t,.18,.78,.18);
  }
 }
 // 1. Roof eaves, Dougong brackets, rafters, flying corners & Chiwen finials
 for(const roof of JINGAN_ROOFS){
  const {y,rx,rz,layers=2,style='xieshan',chiwen=false,eaveDetail=true}=roof,x=roof.x+.5,z=roof.z+.5;
  const isPagoda=Boolean(roof.id?.startsWith('pagoda-'));
  for(const axis of ['x','z']){
   const across=axis==='x'?rx:rz,depth=axis==='x'?rz:rx;
   for(const side of [-1,1]){
    const edge=depth+.5,support=edge-1;
    const trim=(tone,offset,height,projection,length,thickness,reach)=>{
     if(axis==='x')piece(tone,x+offset,y+height,z+projection*side,length,thickness,reach);
     else piece(tone,x+projection*side,y+height,z+offset,reach,thickness,length);
    };
    trim(0,0,-.34,support+.08,across*2+.65,.23,.25);
    trim(2,0,-.10,edge-.14,across*2+.41,.13,.15);
    if(eaveDetail&&!isPagoda){
     for(let offset=-across+.65;offset<=across-.55;offset+=2.2){
      trim(3,offset,-.17,(support+edge)*.5,.16,.18,edge-support-.12);
     }
    }
    if(eaveDetail&&(!isPagoda||roof.id==='pagoda-0')){
     const count=isPagoda?2:Math.max(2,Math.round((across*2-1)/3.3));
     const span=Math.max(0,across-.9);
     for(let i=0;i<count;i++){
      const offset=count===1?0:span*(2*i/(count-1)-1);
      trim(0,offset,-.84,support+.13,.32,.28,.36);
      trim(1,offset,-.62,support+.28,.74,.20,.60);
      trim(2,offset,-.43,support+.44,.39,.18,.76);
     }
    }
   }
  }
  for(const sx of [-1,1])for(const sz of [-1,1]){
   piece(1,x+sx*(rx+.22),y-.24,z+sz*(rz+.22),.48,.26,.48);
   piece(4,x+sx*(rx+.46),y+.02,z+sz*(rz+.46),.34,.22,.34);
  }
  if(chiwen){
   const ridgeX=Math.max(1,rx-layers),ridgeY=y+layers;
   for(const sx of [-1,1]){
    piece(4,x+sx*(ridgeX+.15),ridgeY+.85,z,.5,.78,.42);
    piece(4,x+sx*ridgeX,ridgeY+1.35,z,.32,.46,.28);
   }
   piece(4,x,ridgeY+.95,z,.55,.82,.42);
  }else if(roof.id==='bell-upper'||roof.id==='drum-upper'){
   piece(4,x,y+layers+1.0,z,.45,.9,.45);
  }
 }
 // 2. Shanmen Three Portals (bosses, side panels, guardian lions & perimeter gold coping)
 const gx=-303.5,gz=6.5;
 for(const ax of [-4,4]){
  for(const bx of [-.42,.42])for(const by of [26.6,27.3,28.0])piece(4,gx+ax+bx,by,gz+.54,.12,.12,.08);
  piece(7,gx+ax,27.5,gz+.32,2.2,2.7,.12);
 }
 for(const sx of [-1,1]){
  piece(5,gx+sx*2.2,26.35,gz+2.5,.85,.7,.85);
  piece(4,gx+sx*2.2,27.05,gz+2.5,.55,.72,.55);
  piece(4,gx+sx*16,29.6,JINGAN.temple.minZ*.5+4.5,.58,.24,45);
 }
 piece(5,gx,26.14,gz+2.2,3.4,.28,1.1);
 // 3. Southeast Ashoka Pillar (-290, 7)
 const ax=-289.5,az=7.5;
 balustrade(ax-1.35,az-1.35,ax+1.35,az-1.35,27.5,3);
 balustrade(ax-1.35,az-1.35,ax-1.35,az+1.35,27.5,3);
 for(const ry of [30.2,34.5,38.8])piece(4,ax,ry,az,1.08,.26,1.08);
 piece(4,ax,41.6,az,1.5,.6,1.5);
 for(const [lx,lz] of [[-.38,-.38],[.38,-.38],[-.38,.38],[.38,.38]])piece(4,ax+lx,42.3,az+lz,.4,.8,.4);
 piece(4,ax,43.25,az,1.3,1.3,.24);
 piece(4,ax,43.25,az,.24,1.5,.24);
 // 4. East Bell & West Drum Towers (upper gallery balustrades + Bronze Bell & Great Drum)
 for(const [tx,isBell] of [[-290.5,true],[-316.5,false]]){
  const tz=.5;
  balustrade(tx-1.55,tz-1.55,tx+1.55,tz-1.55,34.5,3);
  balustrade(tx-1.55,tz+1.55,tx+1.55,tz+1.55,34.5,3);
  balustrade(tx-1.55,tz-1.55,tx-1.55,tz+1.55,34.5,3);
  balustrade(tx+1.55,tz-1.55,tx+1.55,tz+1.55,34.5,3);
  if(isBell){
   piece(6,tx,36.2,tz,1.15,1.65,1.15);
   piece(4,tx,37.2,tz,.45,.4,.45);
  }else{
   piece(8,tx,35.2,tz,1.45,.58,1.05);
   piece(7,tx,36.2,tz,1.28,1.22,1.42);
   piece(4,tx,36.2,tz,1.34,1.25,.24);
  }
 }
 // Cloister upper gallery balustrades
 for(const [cx,side] of [[-317.5,1],[-289.5,-1]])balustrade(cx+side*1.05,-22,cx+side*1.05,-4,28.6,7);
 // 5. Courtyard Bronze Cauldron (-303.5, -1.5) & Four Stone Lanterns
 piece(5,gx,26.25,-1.5,1.7,.5,1.7);
 piece(6,gx,27.15,-1.5,1.25,1.15,1.25);
 piece(4,gx,27.85,-1.5,.88,.28,.88);
 piece(6,gx,28.35,-1.5,1.45,.68,1.45);
 piece(4,gx,28.9,-1.5,.34,.42,.34);
 for(const lz of [-4.5,1.5])for(const sx of [-1,1]){
  const lx=gx+sx*3.5;
  piece(5,lx,26.5,lz,.42,1.0,.42);
  piece(9,lx,27.2,lz,.4,.42,.4);
  piece(4,lx,27.6,lz,.6,.34,.6);
 }
 // 6. Mahavira Hall (大雄宝殿 -303.5, -14.5): Sumeru balustrades, lattice & Seated Buddha
 const hz=-14.5,hrx=9,hrz=5;
 balustrade(gx-hrx-1.15,hz+hrz+1.25,gx-2.3,hz+hrz+1.25,27.5,4);
 balustrade(gx+2.3,hz+hrz+1.25,gx+hrx+1.15,hz+hrz+1.25,27.5,4);
 balustrade(gx-hrx-1.15,hz-hrz-1.25,gx-hrx-1.15,hz+hrz+1.25,27.5,5);
 balustrade(gx+hrx+1.15,hz-hrz-1.25,gx+hrx+1.15,hz+hrz+1.25,27.5,5);
 piece(4,gx,26.03,hz+hrz+.5,1.3,.06,5.2);
 for(const bx of [-6,-4,4,6]){
  piece(7,gx+bx,30.0,hz+hrz-.8,1.55,3.1,.22);
  piece(4,gx+bx,30.0,hz+hrz-.75,1.75,3.3,.12);
 }
 piece(4,gx,28.9,hz-1.2,2.6,.75,2.4);
 piece(9,gx,30.2,hz-1.2,1.65,2.0,1.45);
 piece(9,gx,31.65,hz-1.2,.92,.92,.92);
 piece(4,gx,31.0,hz-2.1,2.6,2.8,.2);
 // 7. Northwest 7-Story Pagoda (-315.5, -32.5) & Five Gold-Leaf Stupas (五金塔刹)
 const px=JINGAN_TOWER.x+.5,pz=JINGAN_TOWER.z+.5;
 let py=JINGAN_TOWER.firstTier;
 for(let s=0;s<JINGAN_TOWER.tiers;s++){
  const r=s<2?3:2,h=s<3?3:2,roofY=py+h;
  for(const sx of [-1,1])for(const sz of [-1,1]){
   piece(4,px+sx*(r+.14),py+h*.5,pz+sz*(r+.14),.32,h,.32);
   piece(4,px+sx*(r+1.18),roofY-.15,pz+sz*(r+1.18),.16,.36,.16);
  }
  const offs=s<2?[-r*.55,0,r*.55]:[0];
  for(const side of [-1,1])for(const off of offs){
   piece(4,px+off,py+h*.45,pz+side*(r+.5),.52,h*.58,.14);
   piece(4,px+side*(r+.5),py+h*.45,pz+off,.14,h*.58,.52);
  }
  py+=h+1;
 }
 const zCrown=py+2;
 function addStupa(sx,sz,sc){
  piece(4,sx,zCrown+.5*sc,sz,1.45*sc,1.0*sc,1.45*sc);
  piece(4,sx,zCrown+1.7*sc,sz,1.12*sc,1.45*sc,1.12*sc);
  for(let ring=0;ring<3;ring++){
   const rw=(.92-ring*.18)*sc;
   piece(4,sx,zCrown+(2.75+ring*.68)*sc,sz,rw,.42*sc,rw);
  }
  piece(4,sx,zCrown+5.05*sc,sz,.28*sc,1.5*sc,.28*sc);
 }
 addStupa(px,pz,1.38);
 for(const [ox,oz] of [[-1.65,-1.65],[1.65,-1.65],[-1.65,1.65],[1.65,1.65]])addStupa(px+ox,pz+oz,.72);

 const [mesh]=batchMeshes(root,pieces,'jingan-dougong-eaves');
 mesh.matrixAutoUpdate=false;
 for(const g of blocks)g.dispose();
 root.remove(mesh);
 parent.add(mesh);
 return mesh;
}
