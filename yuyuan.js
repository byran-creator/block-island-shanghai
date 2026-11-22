import {createYuyuanStreetAssets} from './yuyuan-street-assets.js';
import {createYuyuanWayfinding} from './pedestrian-sign.js';
import {createYuyuanShopAssets} from './yuyuan-shop-assets.js';
import {createYuyuanGardenAssets,moonBridgeFloor} from './yuyuan-garden-assets.js';
import {createYuyuanClassicAssets} from './yuyuan-classic-assets.js';
import {createYuyuanWater} from './yuyuan-water.js';
import {createYuyuanGates,insideGarden} from './yuyuan-gates.js';
import {createYuyuanCrowd} from './yuyuan-crowd.js';
import {createYuyuanVisitors} from './yuyuan-visitors.js';
import * as THREE from './three.module.js';
import {batchMeshes,batchStockSeries,staticMeshes} from './mesh-batch.js';
import {overlaps} from './world.js';
import {styleNpc} from './npc-appearance.js';
import {createYuyuanRickshaws} from './yuyuan-rickshaw.js';
import {YUYUAN,YUYUAN_SHIFT,YUYUAN_BUILDINGS,WATER_CORRIDOR,GARDEN_PONDS,JIUQU_BRIDGE,WATER_GALLERY_BENDS,YUYUAN_WALKS,YUYUAN_STATION_WALK,YUYUAN_STATION_WALK_SOUTH,pathContains,gardenPathContains} from './yuyuan-layout.js';
export const YUYUAN_RIDDLES=[{question:'两岸不相连，走我能过河。猜一物。',answers:['桥','茶壶','灯笼'],correct:0},{question:'有脚不走路，安睡好帮手。猜一物。',answers:['鱼竿','床','竹子'],correct:1},{question:'白天藏起来，夜里满天开。猜一物。',answers:['小笼包','茶叶','星星'],correct:2}];
export function createYuyuan({scene,world=null,getVehicles=()=>[],getPos,getState,setView=()=>{},notify=()=>{},pause=()=>{},resume=()=>{},onProgress=()=>{},onEvent=()=>{},getAudio=null,getSound=()=>true,getVolume=()=>.28,deferPondView=false,packStatic=false,simulationInterest=null}){
 const root=new THREE.Group();root.name='yuyuan-garden-and-malls';root.position.z=YUYUAN_SHIFT;scene.add(root);const box=new THREE.BoxGeometry(1,1,1),mats=new Map(),lights=[],lanterns=[],actors=[],fixtureBounds=[];let panel=false,elapsed=0,lastTea=-30,lastSnack=-30,solved=new Set(),orders=0,teas=0,stocks={buns:12,candy:8,souvenir:6,tea:6},collectibles={};

 const solidPalette=new Set();
 const registerWallTargets=meshes=>{
  if(packStatic)for(const mesh of meshes)mesh.userData.yuyuanWallTarget=true;
  return meshes;
 };
 const batchDetails=(group,meshes,name,cellSize=84)=>{
  const batches=batchMeshes(group,meshes.filter(mesh=>!mesh.userData.yuyuanColorBatch),name,solidPalette,packStatic,cellSize);
  for(const mesh of batches)if(mesh.userData.rgbColors)mesh.userData.yuyuanColorBatch=true;
  return registerWallTargets(batches);
 };
 const $=id=>document.getElementById(id),mat=(color,glow=false)=>{const key=color+glow;if(!mats.has(key))mats.set(key,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));const material=mats.get(key);if((!glow||color!=='#ffc107')&&!material.transparent&&material.opacity===1&&!material.map&&!material.vertexColors)solidPalette.add(material);return material;};
 function cube(color,x,y,z,w,h,d,glow=false){const m=new THREE.Mesh(box,mat(color,glow));m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);return m;}
 const boardCache=new Map();
 function board(text,x,y,z,w=4,h=.8,yaw=0){
  if(typeof document==='undefined'||!document.createElement){
   const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial());
   m.position.set(x,y,z);m.rotation.y=yaw;root.add(m);return m;
  }
  const isVert=h>w*1.5,cacheKey=text+':'+(isVert?'v':'h');
  let material=boardCache.get(cacheKey);
  if(!material){
   const c=document.createElement('canvas');
   if(isVert){c.width=160;c.height=480;}else{c.width=512;c.height=128;}
   const ctx=c.getContext('2d'),bw=c.width,bh=c.height;
   if(isVert){
    const bg=ctx.createLinearGradient?.(0,0,bw,0);
    if(bg?.addColorStop){bg.addColorStop(0,'#0d0806');bg.addColorStop(0.5,'#1c120c');bg.addColorStop(1,'#0d0806');ctx.fillStyle=bg;}
    else ctx.fillStyle='#18100c';
    ctx.fillRect?.(0,0,bw,bh);
    ctx.strokeStyle='#b88e40';ctx.lineWidth=1.5;ctx.strokeRect?.(5,5,bw-10,bh-10);
    const bgGrad=ctx.createLinearGradient?.(0,0,0,bh);
    if(bgGrad?.addColorStop){bgGrad.addColorStop(0,'#ffe894');bgGrad.addColorStop(0.5,'#e0a938');bgGrad.addColorStop(1,'#946618');ctx.strokeStyle=bgGrad;}
    else ctx.strokeStyle='#e0a938';
    ctx.lineWidth=3;ctx.strokeRect?.(10,10,bw-20,bh-20);
    ctx.fillStyle='#ffe57f';ctx.font='bold 16px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText?.('❖',bw/2,26);
    const chars=text.replace(/[\s·\-_]/g,'').split(''),startY=48,availH=bh-startY-45,spacing=Math.min(52,availH/Math.max(1,chars.length));
    const fontSize=Math.min(34,Math.max(18,Math.round(spacing*0.75)));
    ctx.font=`bold ${fontSize}px "Songti SC","SimSun","Noto Serif CJK SC",serif`;
    chars.forEach((ch,i)=>{
     const cy=startY+i*spacing+spacing/2;
     ctx.strokeStyle='#050302';ctx.lineWidth=Math.max(3,Math.round(fontSize*0.13));ctx.strokeText?.(ch,bw/2,cy);
     const cg=ctx.createLinearGradient?.(0,cy-fontSize*0.5,0,cy+fontSize*0.5);
     if(cg?.addColorStop){cg.addColorStop(0,'#ffffff');cg.addColorStop(0.25,'#fff0a0');cg.addColorStop(0.6,'#ffd24d');cg.addColorStop(0.88,'#e59e18');cg.addColorStop(1,'#ad6d0d');ctx.fillStyle=cg;}
     else ctx.fillStyle='#ffd24d';
     ctx.fillText?.(ch,bw/2,cy);
    });
    const ss=26,sx=bw/2-ss/2,sy=bh-38;
    ctx.fillStyle='#a62420';ctx.fillRect?.(sx,sy,ss,ss);
    ctx.strokeStyle='#e8995a';ctx.lineWidth=1.2;ctx.strokeRect?.(sx+1,sy+1,ss-2,ss-2);
    ctx.fillStyle='#fff0db';ctx.font='bold 11px "STKaiti","KaiTi",serif';ctx.fillText?.('百年',bw/2,sy+ss/2);
   }else{
    const bg=ctx.createRadialGradient?.(bw/2,bh/2,10,bw/2,bh/2,bw*0.5);
    if(bg?.addColorStop){bg.addColorStop(0,'#20150e');bg.addColorStop(0.7,'#130a07');bg.addColorStop(1,'#090503');ctx.fillStyle=bg;}
    else ctx.fillStyle='#130a07';
    ctx.fillRect?.(0,0,bw,bh);
    ctx.strokeStyle='#9c7530';ctx.lineWidth=1.5;ctx.strokeRect?.(5,5,bw-10,bh-10);
    const bgGrad=ctx.createLinearGradient?.(0,0,bw,bh);
    if(bgGrad?.addColorStop){bgGrad.addColorStop(0,'#fff1a8');bgGrad.addColorStop(0.5,'#dfa73b');bgGrad.addColorStop(1,'#8c5c16');ctx.strokeStyle=bgGrad;}
    else ctx.strokeStyle='#dfa73b';
    ctx.lineWidth=3.5;ctx.strokeRect?.(10,10,bw-20,bh-20);
    const ss=26,sx=bw-48,sy=bh/2-ss/2;
    ctx.fillStyle='#a62420';ctx.fillRect?.(sx,sy,ss,ss);
    ctx.strokeStyle='#e8995a';ctx.lineWidth=1.2;ctx.strokeRect?.(sx+1,sy+1,ss-2,ss-2);
    ctx.fillStyle='#fff0db';ctx.font='bold 11px "STKaiti","KaiTi",serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText?.('非遗',sx+ss/2,sy+ss/2);
    const tx=(bw-42)/2,ty=bh/2+1;ctx.textAlign='center';ctx.textBaseline='middle';
    const fontSize=Math.min(42,Math.max(20,Math.round((bw-60)/Math.max(5,text.length)*0.95)));
    ctx.font=`bold ${fontSize}px "Songti SC","SimSun","Noto Serif CJK SC",serif`;
    ctx.strokeStyle='#050302';ctx.lineWidth=Math.max(3,Math.round(fontSize*0.13));ctx.strokeText?.(text,tx,ty);
    const textGrad=ctx.createLinearGradient?.(0,ty-fontSize*0.55,0,ty+fontSize*0.55);
    if(textGrad?.addColorStop){textGrad.addColorStop(0,'#ffffff');textGrad.addColorStop(0.22,'#fff0a2');textGrad.addColorStop(0.55,'#ffd54f');textGrad.addColorStop(0.85,'#e59e18');textGrad.addColorStop(1,'#ad6d0d');ctx.fillStyle=textGrad;}
    else ctx.fillStyle='#ffd54f';
    ctx.fillText?.(text,tx,ty);
   }
   const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
   t.minFilter=THREE.LinearMipmapLinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=true;t.anisotropy=4;
   material=new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide});
   boardCache.set(cacheKey,material);
  }
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),material);
  mesh.position.set(x,y,z);mesh.rotation.y=yaw;mesh.userData.panel=true;root.add(mesh);registerWallTargets([mesh]);return mesh;
 }
 const roofMat=new THREE.MeshLambertMaterial({color:'#374543',side:THREE.DoubleSide}),roofCells=new Map();
 function roof(b,y,scale=1){const rx=(b.rx+1.2)*scale,rz=(b.rz+1.2)*scale,vertices=[];for(const side of [-1,1])for(let j=0;j<5;j++){const a=j/5,c=(j+1)/5,z1=b.z+side*rz*a,z2=b.z+side*rz*c,h=t=>y+2.3*(1-t)+.65*Math.pow(t,7);vertices.push(b.x-rx,h(a),z1,b.x+rx,h(a),z1,b.x-rx,h(c),z2,b.x-rx,h(c),z2,b.x+rx,h(a),z1,b.x+rx,h(c),z2);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();const mesh=new THREE.Mesh(g,roofMat);root.add(mesh);const roofCellKey=`${Math.floor(b.x/84)}:${Math.floor(b.z/84)}`;let cellRoofs=roofCells.get(roofCellKey);if(!cellRoofs)roofCells.set(roofCellKey,cellRoofs=[]);cellRoofs.push(mesh);cube('#927b50',b.x,y+2.32,b.z,rx*2+.4,.14,.18);const eaveGlow=cube('#ffd75a',b.x,y+2.36,b.z,rx*2+.3,.06,.09,true);lights.push(eaveGlow);for(const side of [-1,1]){cube('#74644c',b.x,y+.66,b.z+side*rz,rx*2+.4,.12,.17);const sideEaveZ=cube('#ffc240',b.x,y+.7,b.z+side*rz,rx*2+.3,.06,.09,true);lights.push(sideEaveZ);const sideEaveX=cube('#ffc240',b.x+side*rx,y+.7,b.z,.09,.06,rz*2+.3,true);lights.push(sideEaveX);}for(const sx of [-1,1])for(const sz of [-1,1]){const cornerX=b.x+sx*rx,cornerZ=b.z+sz*rz,tipX=cornerX+sx*.55,tipZ=cornerZ+sz*.55,tipY=y+1.12;const wing=new THREE.Mesh(box,mat('#374543'));wing.position.set((cornerX+tipX)/2,(y+.66+tipY)/2,(cornerZ+tipZ)/2);wing.scale.set(.12,.16,.75);wing.rotation.y=Math.atan2(sz,sx);wing.rotation.z=sx*.28;root.add(wing);cube('#28332c',tipX,tipY+.12,tipZ,.15,.22,.15);const wingGlow=cube('#ffd75a',(cornerX+tipX)/2,(y+.72+tipY)/2,(cornerZ+tipZ)/2,.07,.07,.78,true);wingGlow.rotation.y=Math.atan2(sz,sx);wingGlow.rotation.z=sx*.28;lights.push(wingGlow);const cornerLantern=new THREE.Mesh(new THREE.CylinderGeometry(.16,.18,.35,6),mat('#e83a28',true));cornerLantern.position.set(tipX,tipY-.28,tipZ);root.add(cornerLantern);lanterns.push(cornerLantern);const core=cube('#fff5b8',tipX,tipY-.28,tipZ,.08,.22,.08,true);lights.push(core);cube('#d42d22',tipX,tipY-.52,tipZ,.03,.16,.03);}}
 const outerWalls=[];
 function solidShopWall(color,x,y,z,w,h,d){
  outerWalls.push(cube(color,x,y,z,w,h,d));
  fixtureBounds.push({x,y:y-h/2,z,rx:Math.max(w/2,.22),rz:Math.max(d/2,.22),h});
 }
  for(const b of YUYUAN_BUILDINGS){
   if(b.id==='huxinting'){
    // Single-tier delicate open classical lakeside tea pavilion on Nine-turn Bridge (开放式水榭茶亭)
    cube('#7a5638',b.x,25.88,b.z,7.8,.26,7.8);
    cube('#5e3f26',b.x,25.68,b.z,8.1,.16,8.1);
    for(const sx of [-1,1])for(const sz of [-1,1]){
     const px=b.x+sx*(b.rx-.35), pz=b.z+sz*(b.rz-.35);
     cube('#858a7e',px,23.5,pz,.58,5.0,.58);
     cube('#822e23',px,28,pz,.28,3.6,.28);
     cube('#6a241b',px,26.25,pz,.42,.5,.42);
     fixtureBounds.push({x:px,z:pz,rx:.28,rz:.28,y:26,h:3.6});
    }
    roof(b,26+1*4,.96);
    for(const side of [-1,1]){
     cube('#6e462d',b.x,26.65,b.z+side*(b.rz-.22),b.rx*2-.7,.5,.1);
     cube('#573520',b.x,26.96,b.z+side*(b.rz-.22),b.rx*2-.5,.08,.14);
     fixtureBounds.push({x:b.x,z:b.z+side*(b.rz-.22),rx:b.rx-.35,rz:.18,y:26,h:1.1});
    }
    cube('#2e2118',b.x,29.7,b.z,0.024,0.76,0.024);
    cube('#e5a93b',b.x,29.34,b.z,0.06,0.04,0.06,true);
    const pavilionLantern=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.45,8),mat('#e83a28',true));
    pavilionLantern.position.set(b.x,29.1,b.z);root.add(pavilionLantern);lanterns.push(pavilionLantern);
    continue;
   }
   if(b.historic==='sansui'){
    // 三穗堂: 乾隆五开间宽敞宏丽正堂 (粉墙青砖基座、落地雕花长窗、高敞朱红立柱)
    outerWalls.push(cube('#edebe2',b.x,27.9,b.z,b.rx*2-.1,3.8,b.rz*2-.1));
    outerWalls.push(cube('#636964',b.x,26.35,b.z,b.rx*2+.08,.7,b.rz*2+.08));
    for(const sx of [-1,1])for(const sz of [-1,1]){
     cube('#78261e',b.x+sx*(b.rx-.2),28.2,b.z+sz*(b.rz-.2),.3,4.2,.3);
     cube('#4a1611',b.x+sx*(b.rx-.2),26.35,b.z+sz*(b.rz-.2),.42,.5,.42);
    }
    for(let xx=b.x-b.rx+1.0;xx<=b.x+b.rx-1.0;xx+=1.5){
     cube('#503825',xx,27.8,b.z-b.rz-.04,.14,3.2,.12);
     cube('#f2eee4',xx,27.8,b.z-b.rz-.02,1.3,2.4,.03);
     for(const dy of [-.7,0,.7])cube('#d4b476',xx,27.8+dy,b.z-b.rz-.01,1.3,.04,.04);
    }
    roof(b,26+1*4,1.06);
    board('三穗堂 · 乾隆名堂',b.x,30.3,b.z-b.rz-.15,3.6,.75,0);
    continue;
   }
   if(b.historic==='yangshan'){
    // 仰山堂与卷雨楼: 二层临水观山名楼 (一层仰山面水、二层卷雨倚假山、双层回廊)
    outerWalls.push(cube('#edebe2',b.x,27.9,b.z,b.rx*2-.1,3.8,b.rz*2-.1));
    outerWalls.push(cube('#edebe2',b.x,31.9,b.z,b.rx*2-.2,3.8,b.rz*2-.2));
    outerWalls.push(cube('#636964',b.x,26.3,b.z,b.rx*2+.08,.6,b.rz*2+.08));
    cube('#704529',b.x,26.65,b.z+b.rz-.15,b.rx*2-.6,.5,.18);
    cube('#8a2a22',b.x,30.2,b.z,b.rx*2+.3,.14,b.rz*2+.3);
    cube('#7a241c',b.x,30.7,b.z-b.rz-.15,b.rx*2+.3,.8,.08);
    roof(b,26+1*4,1.15);
    roof(b,26+2*4,.98);
    board('仰山堂 · 卷雨楼',b.x,34.2,b.z-b.rz-.2,3.8,.75,0);
    continue;
   }
   if(b.historic==='dianchun'){
    // 点春堂: 小刀会起义指挥所旧址 (重檐朱柱、古戏台对景、肃穆大堂)
    outerWalls.push(cube('#e8e5dc',b.x,27.9,b.z,b.rx*2-.1,3.8,b.rz*2-.1));
    outerWalls.push(cube('#636964',b.x,26.3,b.z,b.rx*2+.08,.6,b.rz*2+.08));
    for(const sx of [-1,1])cube('#802820',b.x+sx*(b.rx-.25),28.2,b.z-b.rz-.1,.32,4.2,.32);
    roof(b,26+1*4,1.08);
    board('点春堂 · 小刀会旧址',b.x,30.2,b.z-b.rz-.18,3.8,.75,0);
    continue;
   }
   if(b.historic==='yuhua'){
    // 玉华堂: 潘允端明代书斋 (冰裂长窗对景玉玲珑名石)
    outerWalls.push(cube('#f0ede4',b.x,27.9,b.z,b.rx*2-.1,3.8,b.rz*2-.1));
    cube('#503825',b.x,27.8,b.z-b.rz-.04,b.rx*2-.6,3.0,.08);
    for(let xx=b.x-b.rx+.9;xx<=b.x+b.rx-.9;xx+=1.4){
     cube('#f5f2e8',xx,27.8,b.z-b.rz-.02,1.2,2.2,.02);
     cube('#4a3321',xx,27.8,b.z-b.rz-.01,1.2,.04,.03);
     cube('#4a3321',xx,27.4,b.z-b.rz-.01,.04,1.2,.03);
    }
    roof(b,26+1*4,1.02);
    board('玉华堂 · 明代书斋',b.x,29.9,b.z-b.rz-.15,3.6,.75,0);
    continue;
   }
   if(b.historic==='wangjiang'){
    // 望江亭: 张南阳大假山绝顶四角攒尖古亭
    roof(b,26+1*4,.94);
    board('大假山 · 望江亭',b.x,34.8,b.z-b.rz-.15,3.0,.68,0);
    continue;
   }
   const wallCol=b.id==='shanghai-hotel'?'#8d3c30':b.id==='huabao-lou'?'#7d2a24':(['#804432','#5a4233','#3f4c44','#783a2d','#8c5c36'][Math.abs(Math.round(b.x+b.z))%5]);
   const doorEast=[-107,8].includes(b.x),doorWest=[-86,25].includes(b.x)||b.id==='lubolang',doorNorth=b.z===271,doorSouth=b.id==='tea-gallery';
   const topY=26+b.levels*4,wt=.42,inset=.16,upperWallCol=wallCol,timberCol='#4a2e1f',plinthCol='#5d615e';
   for(const sx of [-1,1])for(const sz of [-1,1]){
    outerWalls.push(cube(timberCol,b.x+sx*(b.rx-inset),26+b.levels*2,b.z+sz*(b.rz-inset),.34,b.levels*4,.34));
   }
   for(const side of [-1,1]){
    const wx=b.x+side*(b.rx-inset),isDoorSide=(side===1&&doorEast)||(side===-1&&doorWest);
    if(isDoorSide){
     const flankLen=Math.max(0.4,b.rz-1.65);
     for(const fz of [b.z-b.rz+flankLen/2,b.z+b.rz-flankLen/2])solidShopWall(wallCol,wx,27.5,fz,wt,3,flankLen);
     solidShopWall(wallCol,wx,29.5,b.z,wt,1,b.rz*2+.1);
     outerWalls.push(cube(timberCol,wx,29.1,b.z,wt+.08,.22,3.4));
    }else{
     solidShopWall(wallCol,wx,28,b.z,wt,4,b.rz*2+.1);
     outerWalls.push(cube(plinthCol,wx,26.27,b.z,wt+.1,.54,b.rz*2+.14));
    }
    if(b.levels>1){
     solidShopWall(upperWallCol,wx,30+(b.levels-1)*2,b.z,wt,(b.levels-1)*4,b.rz*2+.06);
     for(let lv=1;lv<b.levels;lv++)outerWalls.push(cube(timberCol,wx,26+lv*4,b.z,wt+.08,.28,b.rz*2+.14));
    }
    const roofR=(b.rz+1.2)*.96;
    for(let k=0;k<4;k++){
     const capZ=b.rz*(1-k*.24),t=Math.min(1,capZ/roofR),h=Math.max(.3,2.3*(1-t)+.65*Math.pow(t,7)-.06);
     outerWalls.push(cube(upperWallCol,wx,topY+h/2,b.z,wt,h,capZ*2));
     outerWalls.push(cube('#374543',wx,topY+h+.04,b.z,wt+.08,.08,capZ*2+.12));
    }
   }
   for(const side of [-1,1]){
    const wz=b.z+side*(b.rz-inset),isDoorSide=(side===-1&&doorNorth)||(side===1&&doorSouth);
    if(isDoorSide){
     const flankW=Math.max(0.4,b.rx-1.65);
     for(const sign of [-1,1])solidShopWall(wallCol,b.x+sign*(b.rx-flankW/2),27.5,wz,flankW,3,wt);
     solidShopWall(wallCol,b.x,29.5,wz,b.rx*2+.1,1,wt);
     outerWalls.push(cube(timberCol,b.x,29.1,wz,3.4,.22,wt+.08));
    }else{
     solidShopWall(wallCol,b.x,28,wz,b.rx*2+.1,4,wt);
     outerWalls.push(cube(plinthCol,b.x,26.27,wz,b.rx*2+.14,.54,wt+.1));
    }
    if(b.levels>1){
     solidShopWall(upperWallCol,b.x,30+(b.levels-1)*2,wz,b.rx*2+.06,(b.levels-1)*4,wt);
     for(let lv=1;lv<b.levels;lv++)outerWalls.push(cube(timberCol,b.x,26+lv*4,wz,b.rx*2+.14,.28,wt+.08));
    }
   }
   for(let level=1;level<=b.levels;level++){
    outerWalls.push(cube('#483223',b.x,26+level*4-.16,b.z,b.rx*2-.3,.32,b.rz*2-.3));
    roof(b,26+level*4,level===b.levels?.96:1.1);
   }
   for(const side of [-1,1]){
    const outerZ=b.z+side*(b.rz+.06),isDoorSide=(side===-1&&doorNorth)||(side===1&&doorSouth);
    for(let x=b.x-b.rx+1.2;x<=b.x+b.rx-1.2;x+=2.0){
     if(isDoorSide&&Math.abs(x-b.x)<1.65)continue;
     outerWalls.push(cube('#593e2b',x,27.55,outerZ,.96,1.82,.06));
     const winGlow=cube('#ffba54',x,27.55,outerZ+side*.035,.82,1.58,.02,true);
     lights.push(winGlow);
     outerWalls.push(cube('#d3ba77',x,27.55,outerZ+side*.05,.045,1.58,.03));
     outerWalls.push(cube('#d3ba77',x,27.55,outerZ+side*.05,.82,.045,.03));
    }
   }
   if(b.levels>=2)for(const side of [-1,1]){
    outerWalls.push(cube('#8c5b32',b.x,30.05,b.z+side*(b.rz+.35),b.rx*2+.7,.12,.65));
    outerWalls.push(cube('#76502c',b.x,30.9,b.z+side*(b.rz+.6),b.rx*2+.7,.09,.09));
    for(let x=b.x-b.rx;x<=b.x+b.rx;x+=1.2)outerWalls.push(cube('#76502c',x,30.5,b.z+side*(b.rz+.6),.08,.75,.07));
    const upperWin=cube('#ffba54',b.x,31.6,b.z+side*(b.rz+.07),b.rx*2-1.8,1.35,.02,true);lights.push(upperWin);
   }
   if(b.levels>=3)for(const side of [-1,1]){
    outerWalls.push(cube('#8c5b32',b.x,34.05,b.z+side*(b.rz+.35),b.rx*2+.5,.12,.65));
    const topWin=cube('#ffba54',b.x,35.6,b.z+side*(b.rz+.07),b.rx*2-1.8,1.35,.02,true);lights.push(topWin);
   }
  }
  board('湖心亭',-46,30.3,178-2.65,2.6,.6);board('南翔小笼',-26,30,264.5,5.5,.9);board('江南手作',-62,30,264.5,5.5,.9);board('九曲桥',-65,28,173,3.4,.7,Math.PI/2);
 const wayfinding=createYuyuanWayfinding();wayfinding.position.set(-35,26,10);root.add(wayfinding);
 board('华宝楼 · 百年商厦',-86,37.2,165.8,5.5,.9);board('天裕楼 · 豫园名阁',8,37.2,166.8,5.5,.9);board('和丰楼 · 美食雅集',8,33,184.8,5.5,.9);
 board('上海老饭店 · 百年名筵',8,37.2,198.8,5.5,.9);board('宁波汤团店 · 经典名点',8,30,216.8,5.5,.9);board('老庙黄金 · 百年祥瑞',8,33,248.8,5.5,.9);
 board('上海梨膏糖 · 非遗老号',-107,33,151.8,5.5,.9);board('童涵春堂 · 传统国药',-107,33,199.8,5.5,.9);board('绿波廊 · 湖畔美馔',-20,33,183.8,4.8,.9);
 board('大假山 · 望江亭',-72,30.5,220.8,4.5,.8);board('穿云龙墙 · 粉墙竹影',-62,29.8,217.2,4.2,.7);board('江南名石 · 玉玲珑',-36,29,244.5,4,.7);
 // Signature Huxinting & Lubolang waterside terrace cyan glow (水上露台水线蓝光 - 参考图 user_huxinting_night_water.png)
 for(const [wx,wz,ww,wd] of [[-46,178-2.6,5.4,.08],[-46,178+2.6,5.4,.08],[-46-2.6,178,.08,5.4],[-46+2.6,178,.08,5.4],[-20,188-4.1,10.2,.08],[-20-5.1,188,.08,8.2]]){const wg=cube('#2cb8ff',wx,22.35,wz,ww,.06,wd,true);lights.push(wg);}
 // Grand North Entrance Stone Paifang (豫园北门石木牌坊 - bazaar_gate.jpg)
 const gateX=-46.5,gateZ=149.2;
 for(const px of [gateX-3.8,gateX-1.6,gateX+1.6,gateX+3.8]){cube('#7b756b',px,26.3,gateZ,.55,.6,.55);cube('#653e2d',px,29.2,gateZ,.28,5.2,.28);fixtureBounds.push({x:px,z:gateZ,rx:.28,rz:.28,y:26,h:5.2});}
 cube('#5c3727',gateX,31.4,gateZ,8.4,.32,.36);cube('#5c3727',gateX,29.8,gateZ,8.4,.22,.26);
 for(const [cx,w,yLevel] of [[gateX,4.2,32.4],[gateX-2.7,2.8,31.2],[gateX+2.7,2.8,31.2]]){cube('#364940',cx,yLevel,gateZ,w,.22,.9);for(const sx of [-1,1]){const tip=cube('#364940',cx+sx*(w/2+.22),yLevel+.18,gateZ,.28,.14,.8);tip.rotation.z=sx*.35;cube('#23322a',cx+sx*(w/2+.32),yLevel+.32,gateZ,.14,.2,.14);}}
 board('豫园 · 海上名园',gateX,30.6,gateZ-.14,3.2,.72);
 const waterArt=createYuyuanWater(root,{ponds:GARDEN_PONDS,deferView:deferPondView}),localPos=()=>({...getPos(),z:getPos().z-YUYUAN_SHIFT});
 const gates=createYuyuanGates(root,{cube,mat,getPos:localPos,onProgress,onEvent});
 board('内园检票 · V',-35,31.9,193.88,2.5,.48);board('内园检票 · V',-75.12,31.9,205,2.5,.48,-Math.PI/2);
 // Curve-following bridge posts sit outside its three-block walking deck.
 for(let i=1;i<JIUQU_BRIDGE.length;i++){const a=JIUQU_BRIDGE[i-1],b=JIUQU_BRIDGE[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),dx=(b[0]-a[0])/length,dz=(b[1]-a[1])/length;for(let d=0;d<=length;d+=1.5)for(const side of [-1,1]){const x=a[0]+dx*d+dz*side*1.3,z=a[1]+dz*d-dx*side*1.3;if(Math.abs(x-WATER_CORRIDOR.x)<WATER_CORRIDOR.width/2+.3&&z>=WATER_CORRIDOR.z1&&z<=WATER_CORRIDOR.z2||pathContains(x,z,JIUQU_BRIDGE,1.05)||Math.abs(x+46)<4.5&&Math.abs(z-178)<4.5)continue;cube('#806a48',x,26.4,z,.09,.8,.09);fixtureBounds.push({x,z,rx:.05,rz:.05,y:26,h:.8});}for(const side of [-1,1])for(let d=.25;d<length;d+=.5){const x=a[0]+dx*d+dz*side*1.3,z=a[1]+dz*d-dx*side*1.3;if(Math.abs(x-WATER_CORRIDOR.x)<WATER_CORRIDOR.width/2+.3&&z>=WATER_CORRIDOR.z1&&z<=WATER_CORRIDOR.z2||pathContains(x,z,JIUQU_BRIDGE,1.05)||Math.abs(x+46)<4.5&&Math.abs(z-178)<4.5)continue;const m=cube('#8e7855',x,26.77,z,.53,.065,.07);m.rotation.y=-Math.atan2(dz,dx);fixtureBounds.push({x,z,rx:dx?.265:.035,rz:dx?.035:.265,y:26.72,h:.1});}}

 const stockSeries=[];
 const batchGoods=(goodsMap,prefix)=>{
  for(const [key,units]of Object.entries(goodsMap)){
   const entry=batchStockSeries(root,units,`${prefix}-${key}`,solidPalette);
   if(entry){
    registerWallTargets([entry.mesh]);
    stockSeries.push({key,entry,max:units.length});
   }
   for(const group of units){const rest=staticMeshes(group);if(rest.length)registerWallTargets(batchMeshes(group,rest,prefix,solidPalette));}
  }
 };
 const streetArt=createYuyuanStreetAssets(root,{cube,mat,board,getPos:localPos,simulationInterest});fixtureBounds.push(...streetArt.fixtures);Object.assign(stocks,streetArt.stockCaps);const stockCaps={buns:12,candy:8,souvenir:6,tea:6,...streetArt.stockCaps};const collectibleNames=['江南手作纪念品','江南茶具套装','吹糖金龙','康熙通宝铜钱','老坑古玉扳指',...streetArt.shops.filter(s=>!s.food).map(s=>s.name)];
 batchGoods(streetArt.goods,'yuyuan-street-stock');
 const setStocks=()=>{shopArt.setStocks(stocks);streetArt.setStocks(stocks);for(const s of stockSeries)s.entry.setCount(Number.isFinite(stocks[s.key])?Math.floor(stocks[s.key]):s.max);};
 const shopArt=createYuyuanShopAssets(root,{cube,mat,board});fixtureBounds.push(...shopArt.fixtures);
 batchGoods(shopArt.goods,'yuyuan-stock-item');
 setStocks();
 cube('#765236',-46,26.42,175,1.9,.84,.8);fixtureBounds.push({x:-46,z:175,rx:.95,rz:.4,y:26,h:.84});for(const x of [-46.5,-46,-45.5])cube('#d0dcc9',x,26.98,175,.16,.23,.16);
 const gardenArt=createYuyuanGardenAssets(root,{cube,mat,batchDetails,buildings:YUYUAN_BUILDINGS,simulationInterest});fixtureBounds.push(...gardenArt.fixtures);
 // Each willow has many leaves but the entire hanging branch moves rigidly.
 registerWallTargets(gardenArt.willowGroups);
 const classicArt=createYuyuanClassicAssets(root,{cube,mat,board,batchDetails});fixtureBounds.push(...classicArt.fixtures);

 // High-performance O(1) Spatial Hash Grid for fixture collisions (彻底消除每秒数百万次fixtureBounds.some线性迭代)
 const GRID_SIZE=8,fixtureGrid=new Map();
 for(const b of fixtureBounds){
  const minGx=Math.floor((b.x-b.rx-.35)/GRID_SIZE),maxGx=Math.floor((b.x+b.rx+.35)/GRID_SIZE);
  const minGz=Math.floor((b.z-b.rz-.35)/GRID_SIZE),maxGz=Math.floor((b.z+b.rz+.35)/GRID_SIZE);
  for(let gx=minGx;gx<=maxGx;gx++){
   for(let gz=minGz;gz<=maxGz;gz++){
    const k=`${gx},${gz}`;
    let list=fixtureGrid.get(k);
    if(!list){list=[];fixtureGrid.set(k,list);}
    list.push(b);
   }
  }
 }
 function collidesFixtures(x,y,lz){
  const gx=Math.floor(x/GRID_SIZE),gz=Math.floor(lz/GRID_SIZE);
  const list=fixtureGrid.get(`${gx},${gz}`);
  if(!list)return false;
  for(let i=0;i<list.length;i++){
   const b=list[i];
   if(Math.abs(x-b.x)<b.rx+.29&&Math.abs(lz-b.z)<b.rz+.29&&y<b.y+b.h&&y+1.75>b.y)return true;
  }
  return false;
 }

 // Spaced traditional glowing lanterns with suspension cables & drop wires (商街与湖心亭上空共享材质轻量化宫灯天幕)
 const CABLE_Y=30.6;
 const sharedTopCapGeo=new THREE.CylinderGeometry(0.168,0.208,0.048,6);
 const sharedBotCapGeo=new THREE.CylinderGeometry(0.192,0.144,0.048,6);
 const sharedInnerGeo=new THREE.SphereGeometry(0.28,6,4);
 const sharedOuterGeo=new THREE.SphereGeometry(0.40,6,4);
 const sharedWaistGeo=new THREE.TorusGeometry(0.336,0.024,3,8);
 const sharedTasselGeo=new THREE.CylinderGeometry(0.028,0.06,0.248,5);
 const sharedLanternMat=new THREE.MeshLambertMaterial({color:'#e53935',emissive:'#d84315',transparent:true,opacity:0.6,depthWrite:false});
 const lanternSkins=[];

 function hangingLantern(x,y,z,size=0.40){
  cube('#2d2118',x,(CABLE_Y+y+size*0.52)/2,z,0.024,CABLE_Y-(y+size*0.52),0.024);
  cube('#c89c38',x,y+size*0.58,z,0.065,0.045,0.065,true);
  cube('#423528',x,y+size*0.72,z,0.038,size*0.55,0.038);
  const topCap=new THREE.Mesh(sharedTopCapGeo,mat('#2b2016'));
  topCap.position.set(x,y+size*0.52,z);root.add(topCap);
  const innerCore=new THREE.Mesh(sharedInnerGeo,mat('#ffe066',true));
  innerCore.scale.set(0.78,1.15,0.78);innerCore.position.set(x,y,z);root.add(innerCore);lights.push(innerCore);
  const outerSkin=new THREE.Mesh(sharedOuterGeo,sharedLanternMat);
  outerSkin.scale.set(0.85,1.25,0.85);outerSkin.position.set(x,y,z);root.add(outerSkin);
  const waistHoop=new THREE.Mesh(sharedWaistGeo,mat('#e5a93b',true));
  waistHoop.rotation.x=Math.PI/2;waistHoop.position.set(x,y,z);root.add(waistHoop);
  const botCap=new THREE.Mesh(sharedBotCapGeo,mat('#2b2016'));
  botCap.position.set(x,y-size*0.62,z);root.add(botCap);
  const tassel=new THREE.Mesh(sharedTasselGeo,mat('#f0b840',true));
  tassel.position.set(x,y-size*1.02,z);root.add(tassel);
  lanternSkins.push(outerSkin);
 }
 const lanternSpans=[
  ...[156,168,180,192,204,216,228,240,252,264].map(z=>({x1:-105,x2:-86,z,step:4.8})),
  ...[156,168,180,192,204,216,228,240,252,264].map(z=>({x1:7,x2:26,z,step:4.8})),
  ...[166,178,190].map(z=>({x1:-54,x2:-38,z,step:4.8}))
 ];
 for(const {x1,x2,z,step} of lanternSpans){
  const cx=(x1+x2)/2,len=Math.abs(x2-x1);
  cube('#281f18',cx,CABLE_Y,z,len,0.035,0.035);
  for(let x=x1+step/2;x<=x2;x+=step){
   hangingLantern(x,29.15,z,0.40);
  }
 }

 const rickshaws=createYuyuanRickshaws({scene,root,getPos:localPos,setView,place:p=>{Object.assign(getPos(),{...p,z:p.z+YUYUAN_SHIFT});},notify,onEvent,getAudio,getSound,getVolume,getPedestrians:()=>actors,simulationInterest});
 function npc(index,x,z,role,color){const r=new THREE.Group();r.position.set(x,26,z);root.add(r);const add=(c,xx,y,zz,w,h,d)=>{const m=new THREE.Mesh(box,mat(c));m.position.set(xx,y,zz);m.scale.set(w,h,d);r.add(m);return m;};const torso=add(color,0,1,0,.43,.7,.3),head=add('#d4a27b',0,1.55,0,.34,.36,.34),hair=add('#332c27',0,1.76,0,.35,.08,.35),arms=[],legs=[];for(const side of [-1,1]){arms.push(add(color,side*.28,1,0,.13,.6,.18));legs.push(add('#34413c',side*.12,.38,0,.17,.76,.22));}styleNpc({root:r,torso,head,hair,arms,legs},index,'visitor');actors.push({root:r,person:true,npcRole:role,guide:{intro:'欢迎来到豫园。湖心亭喝茶、商圈南市老街可品尝南翔小笼与选购手作，商圈有华宝楼古玩与民俗戏台，内园扩建了张南阳大假山与宋代玉玲珑。',choices:[['怎么去地铁？','从西侧牌坊沿福佑路指示去河南南路地铁口。10号线往南京东路方向坐一站，可换乘2号线去陆家嘴。']]}});}
 npc(101,-44.5,176.2,'湖心亭茶客','#b39568');npc(102,-25.5,271.2,'南翔师傅','#c6a27b');npc(103,-61.5,204.5,'灯谜向导','#9f6c79');npc(104,-34,201,'豫园游客','#79939b');npc(105,-56,201,'豫园游客','#96aa82');
 for(const [i,shop]of streetArt.shops.entries())npc(120+i,shop.x-1.7,shop.z+.3,shop.title+'店员',['#b78c66','#85936b','#a87e83'][i%3]);
 npc(106,-62,271.2,'手作店员','#947950');npc(107,-65,164.4,'茶坊店员','#7b976e');
 npc(130,-105.8,153.4,'梨膏糖掌柜','#9c3f38');npc(131,-105.8,200.4,'国药堂掌柜','#4d6f54');npc(132,-105.8,233.4,'名酿坊掌柜','#7a422b');
 npc(133,-87.2,167.4,'华宝楼掌柜','#8c6e3d');npc(134,-87.2,248.4,'生煎师傅','#aa5538');
 npc(135,8.2,167.4,'天裕楼掌柜','#3a617e');npc(136,8.2,199.4,'老饭店名厨','#9b3f36');npc(137,8.2,249.4,'金楼掌柜','#9a7c36');
 npc(140,-101.8,212.5,'游商糖人张','#a84232');npc(141,11.8,181.0,'挑担栗子王','#785233');npc(142,-92.2,212.0,'地摊古董刘','#4f6479');

 // Ultra-fast Static Mesh Batching (彻底消除卡顿与闪退：将700+发光体与宫灯全域合并为统一极速静态网格)
 const roofMeshes=[...roofCells.values()].flat();
 const staticDynamic=new Set([...rickshaws.rickshaws.map(r=>r.group),...actors.map(a=>a.root),...gardenArt.dynamicRoots,...classicArt.dynamicRoots,...waterArt.dynamicRoots,...gates.dynamicRoots,...streetArt.dynamicRoots,...Object.values(streetArt.goods).flat(),...Object.values(shopArt.goods).flat(),...stockSeries.map(s=>s.entry.mesh),...lights,...lanterns,...lanternSkins,...roofMeshes,...outerWalls]);
 batchDetails(root,outerWalls,'yuyuan-outer-walls');
 batchDetails(root,staticMeshes(root,staticDynamic),'yuyuan-static-details');
 for(const groupRoofs of roofCells.values())registerWallTargets(batchMeshes(root,groupRoofs,'yuyuan-roof'));
 const glowPalette=new Set([...mats.values()].filter(m=>m.isMeshBasicMaterial&&!m.transparent&&m.opacity===1&&!m.map&&!m.vertexColors));
 const batchedLights=registerWallTargets(batchMeshes(root,lights,'yuyuan-night-glow',glowPalette,false,96));
 lights.splice(0,lights.length,...batchedLights);
 const batchedLanterns=registerWallTargets(batchMeshes(root,lanterns,'yuyuan-night-lanterns',glowPalette,false,96));
 lanterns.splice(0,lanterns.length,...batchedLanterns);
 const batchedSkins=batchMeshes(root,lanternSkins,'yuyuan-lantern-skins',new Set([sharedLanternMat]),false,96);
 lanternSkins.splice(0,lanternSkins.length,...batchedSkins);
 if(packStatic){
  for(const child of root.children){
   if(child.isMesh&&!child.matrixAutoUpdate&&!child.material?.transparent){
    child.userData.yuyuanWallTarget=true;
    if(!child.userData.range)child.userData.range=(child.name==='yuyuan-roof'||child.name==='yuyuan-outer-walls')?235:155;
   }
  }
 }
 for(const a of actors){a.root.removeFromParent();a.root.position.z+=YUYUAN_SHIFT;scene.add(a.root);a.root.updateMatrixWorld(true);for(const c of a.root.children)c.matrixAutoUpdate=false;a.root.matrixAutoUpdate=false;}
 root.updateMatrixWorld(true);
 for(const g of [...Object.values(streetArt.goods).flat(),...Object.values(shopArt.goods).flat()]){
  g.traverse(o=>{o.matrixAutoUpdate=false;});
 }
 const dynamicRoots=new Set([...rickshaws.rickshaws.map(r=>r.group),...gardenArt.dynamicRoots,...classicArt.dynamicRoots,...waterArt.dynamicRoots,...gates.dynamicRoots,...streetArt.dynamicRoots]);
 const keepAuto=n=>{if(dynamicRoots.has(n))return true;let k=false;for(const c of n.children)if(keepAuto(c))k=true;if(!k)n.matrixAutoUpdate=false;return k;};
 for(const c of root.children)keepAuto(c);
 root.matrixAutoUpdate=false;

 function skipNode(obj){
  if(!obj||obj.userData.skipHiddenMatrices)return obj;
  obj.userData.skipHiddenMatrices=true;
  obj.userData.sealedHiddenInstances=true;
  const update=obj.updateMatrixWorld;let skipped=false;
  obj.updateMatrixWorld=function(force){if(!this.visible){skipped=true;return;}update.call(this,force||skipped);skipped=false;};
  return obj;
 }
 const detailGroup=new THREE.Group();
 detailGroup.name='yuyuan-interior-details';
 skipNode(detailGroup);
 for(const child of [...root.children]){
  if(child.name==='yuyuan-roof'||child.name==='yuyuan-outer-walls')continue;
  detailGroup.add(child);
 }
 detailGroup.updateMatrix();
 detailGroup.matrixAutoUpdate=false;
 root.add(detailGroup);
 const innerActors=[...actors];
 const visitors=world?createYuyuanVisitors({scene,world,getVehicles,getPos,blocked:(x,y,z)=>overlaps(world,x,y,z)||buildingCollides(x,y,z-YUYUAN_SHIFT)||collidesFixtures(x,y,z-YUYUAN_SHIFT)}):{people:[],tick(){}};actors.push(...visitors.people);
 const crowd=world?createYuyuanCrowd({scene,world,simulationInterest,getPos,blocked:(x,y,z)=>overlaps(world,x,y,z)||gates.collides(x,y,z-YUYUAN_SHIFT)||buildingCollides(x,y,z-YUYUAN_SHIFT)||collidesFixtures(x,y,z-YUYUAN_SHIFT)}):{people:[],tick(){}};actors.push(...crowd.people);
 innerActors.push(...crowd.people);
 for(const a of actors){a.root.userData.sealedHiddenInstances=true;a.root.userData.sealedActorRadius=2.6;skipNode(a.root);}
 let lastFarCull=null;
 function cullView(camera,highView=false,isMobile=false){
  if(!camera)return;
  const cp=camera.position,dx=Math.max(-78-cp.x,cp.x-6,0),dz=Math.max((192+YUYUAN_SHIFT)-cp.z,cp.z-(276+YUYUAN_SHIFT),0);
  const limit=highView?(isMobile?95:140):(isMobile?120:135),farCull=cp.y>=42||(dx*dx+dz*dz)>limit*limit;
  if(farCull!==lastFarCull){
   lastFarCull=farCull;
   detailGroup.visible=!farCull;
   const signBatch=root.getObjectByName('yuyuan-sign-batch');
   if(signBatch){skipNode(signBatch);signBatch.visible=!farCull;}
   for(const a of innerActors)a.root.visible=!farCull;
   if(farCull)for(const a of visitors.people)a.root.visible=false;
  }
  if(!farCull){
   for(const a of visitors.people){
    const ap=a.root.position;
    a.root.visible=cp.y<42&&((cp.x-ap.x)**2+(cp.z-ap.z)**2)<=limit*limit;
   }
  }
 }
 function close(){if(!panel)return;panel=false;$('yuyuan-dialog').close();document.body?.classList.remove('in-dialogue','in-conversation');resume();}
 const endTalk=document.createElement('button');endTalk.className='dialogue-continue';endTalk.textContent='结束对话';endTalk.setAttribute?.('aria-label','结束猜谜对话，继续游园');endTalk.title='继续游园';endTalk.hidden=true;endTalk.onclick=()=>close();$('yuyuan-dialog').appendChild(endTalk);
 function action(text,fn){const b=document.createElement('button');b.className='recipe-card';b.textContent=text;b.onclick=fn;$('yuyuan-actions').appendChild(b);return b;}
 function use(){if(rickshaws.use())return true;$('yuyuan-dialog').className='game-dialog';endTalk.hidden=true;const p=localPos();if(p.y<25||p.y>28)return false;
  const gate=gates.near(p);if(gate){pause();panel=true;$('yuyuan-title').textContent='海上名园 · 内园检票';$('yuyuan-result').textContent=insideGarden(p)?'离园请过闸，出园后再次进入需重新领票。':'九曲桥、湖心亭与商街可自由游览；内园使用免费游戏体验票。';$('yuyuan-actions').replaceChildren();
   if(!insideGarden(p)&&!gates.ticket)action('领取免费游园体验票',()=>{gates.claim();close();use();});
   const button=action(insideGarden(p)?'开闸离园':'检票入园',()=>{if(gates.open(gate)){close();notify('闸机已开，请从月洞门中央走过。');}});button.disabled=!insideGarden(p)&&!gates.ticket;$('yuyuan-dialog').showModal();return true;}
   const extraShops=streetArt.extraShops??[];
  const peddlerEntries=[{id:'peddler-tang',x:-101.8,z:212.5,title:'游商糖人张 · 吹糖亭',peddlerType:'tang'},{id:'peddler-chestnut',x:11.8,z:181.0,title:'挑担栗子王 · 炒栗铺',peddlerType:'chestnut'},{id:'peddler-antique',x:-92.2,z:212.0,title:'地摊古董刘 · 珍玩阁',peddlerType:'antique'}];
  const entries=[{id:'tea',x:-46,z:176.8,title:'湖心亭 · 临水茶席'},{id:'snack',x:-26,z:270,title:'南翔馒头店 · 小笼名点'},{id:'craft',x:-62,z:270,title:'江南手作 · 丝绸手作坊'},{id:'craft-legacy',x:-62,z:212,title:'江南手作 · 丝绸手作坊'},{id:'teashop',x:-65,z:162,title:'湖畔茶坊 · 店内柜台'},{id:'riddle',x:-62,z:203,title:'豫园 · 灯谜'},...streetArt.shops.map(s=>({...s,id:'street-'+s.id})),...extraShops.map(s=>({...s,id:'extra-'+s.id,isExtra:true})),...peddlerEntries].sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z));const near=entries[0];if(Math.hypot(near.x-p.x,near.z-p.z)>3.2)return false;pause();panel=true;$('yuyuan-title').textContent=near.title;$('yuyuan-result').textContent='';$('yuyuan-actions').replaceChildren();
  if(near.id!=='tea'&&near.id!=='riddle')onEvent({type:'yuyuan-shop-visit',shop:near.title});
  if(near.id==='tea')action('品一壶茉莉花茶',()=>{if(elapsed-lastTea<20){$('yuyuan-result').textContent='慢慢品茶，稍后再来。';return;}lastTea=elapsed;const s=getState();s.health=Math.min(20,s.health+2);s.hunger=Math.min(20,s.hunger+1);teas++;onEvent({type:'yuyuan-tea'});onProgress();$('yuyuan-result').textContent='茶香与湖水相伴 · 体力略有恢复。';});
  function buy(key,name,food=0){const b=action(name+' · 库存 '+stocks[key],()=>{if(stocks[key]<=0)return;if(elapsed-lastSnack<20){$('yuyuan-result').textContent='刚买过一份，稍后再来。';return;}lastSnack=elapsed;stocks[key]--;orders++;setStocks();if(food)getState().food=Math.min(99999,getState().food+food);else collectibles[name]=(collectibles[name]??0)+1;if(near.id.startsWith('snack'))onEvent({type:'yuyuan-snack'});onProgress();b.textContent=name+' · 库存 '+stocks[key];b.disabled=stocks[key]===0;$('yuyuan-result').textContent='已购买'+name+'，柜台少一份；'+(food?'Z 可食用。':'O 背包可查看收藏。');});b.disabled=stocks[key]===0;}
  if(near.id.startsWith('snack')){buy('buns','小笼包',2);buy('candy','梨膏糖 / 五香豆',2);}if(near.id.startsWith('craft'))buy('souvenir','江南手作纪念品');if(near.id==='teashop')buy('tea','江南茶具套装');if(near.key)buy(near.key,near.name,near.food);
  if(near.isExtra)action('挑选与品鉴特色名品',()=>{const s=getState();s.health=Math.min(20,s.health+1);if(['pastry','candy','wine'].includes(near.type))s.hunger=Math.min(20,s.hunger+1);$('yuyuan-result').textContent='掌柜笑迎八方客：【'+near.title+'】名扬沪上，承蒙厚爱！';});
  if(near.peddlerType==='tang'){
   action('买一串冰糖葫芦 (红润酸甜)',()=>{if(elapsed-lastSnack<10){$('yuyuan-result').textContent='刚吃完一串，稍后再尝。';return;}lastSnack=elapsed;const s=getState();s.hunger=Math.min(20,s.hunger+2);s.food=Math.min(99999,s.food+2);$('yuyuan-result').textContent='【糖人张】得嘞！刚熬好的冰糖葫芦，红润酸甜，酥脆不粘牙！';});
   action('买一只吹糖金龙 (栩栩如生)',()=>{collectibles['吹糖金龙']=(collectibles['吹糖金龙']??0)+1;$('yuyuan-result').textContent='【糖人张】好眼力！这只吹糖金龙金鳞戏珠，纯手工非遗手艺！';});
  }
  if(near.peddlerType==='chestnut'){
   action('买一包热糖炒栗子 (刚出锅)',()=>{if(elapsed-lastSnack<10){$('yuyuan-result').textContent='慢慢剥慢慢吃，小心烫嘴。';return;}lastSnack=elapsed;const s=getState();s.hunger=Math.min(20,s.hunger+3);s.food=Math.min(99999,s.food+3);$('yuyuan-result').textContent='【栗子王】新鲜良乡大板栗，铁砂滚炒，现炒现剥，壳脆肉糯！';});
  }
  if(near.peddlerType==='antique'){
   action('淘一枚古铜钱 (康熙通宝)',()=>{collectibles['康熙通宝铜钱']=(collectibles['康熙通宝铜钱']??0)+1;$('yuyuan-result').textContent='【古董刘】识货！祖传生坑官铸古铜钱，包浆浑厚，给您留个念想！';});
   action('鉴赏古玉扳指 (温润包浆)',()=>{collectibles['老坑古玉扳指']=(collectibles['老坑古玉扳指']??0)+1;$('yuyuan-result').textContent='【古董刘】老坑和田青白玉扳指，温润油亮，大开门的好器物！';});
  }
  if(near.id==='riddle'){$('yuyuan-dialog').className='game-dialog conversation-dialog dialogue-riddle';document.body?.classList.add('in-dialogue','in-conversation');endTalk.hidden=false;const index=YUYUAN_RIDDLES.findIndex((_,i)=>!solved.has(i));if(index<0)$('yuyuan-result').textContent='三道灯谜都答对了，夜晚可来赏灯。';else{const q=YUYUAN_RIDDLES[index];$('yuyuan-result').textContent=q.question;for(const [i,answer]of q.answers.entries())action(answer,()=>{if(i!==q.correct){$('yuyuan-result').textContent='再想想：'+q.question;return;}if(solved.has(index))return;solved.add(index);if(solved.size===3)onEvent({type:'yuyuan-riddle',solved:3});onProgress();$('yuyuan-result').textContent='答对了！'+solved.size+'/3；关闭后再来下一题。';});}}
  $('yuyuan-dialog').showModal();return true;
 }
 $('yuyuan-close').onclick=close;$('yuyuan-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});
 let lastNightState=null;

 // Comprehensive Solid Buildings Collision (建筑防穿模：商铺外墙、侧墙与背墙坚实防穿模、开敞门洞通畅、历史名堂全封闭防穿模)
 function buildingRoofFloor(x, lz, refY = getPos?.()?.y){
  for(const b of YUYUAN_BUILDINGS){
   const dx = x - b.x, dz = lz - b.z;
   if(Math.abs(dx) <= b.rx + 0.65 && Math.abs(dz) <= b.rz + 0.65){
    const roofY = 26 + b.levels * 4 + 0.35;
    if(refY === undefined || refY === null || refY >= roofY - 2.5){
     return roofY;
    }
   }
  }
  return null;
 }

 // Floor queries support the same .29m foot footprint as voxel ground tests.
 // Wall/fixture collision still uses the visible gallery width.
 function galleryFloor(x, lz,footRadius=0){
  for(let i=1;i<WATER_GALLERY_BENDS.length;i++){
   const a=WATER_GALLERY_BENDS[i-1],b=WATER_GALLERY_BENDS[i];
   const len=Math.hypot(b[0]-a[0],b[1]-a[1]);
   const dx=(b[0]-a[0])/(len||1),dz=(b[1]-a[1])/(len||1);
   const t=Math.max(0,Math.min(len,(x-a[0])*dx+(lz-a[1])*dz));
   const dist=Math.hypot(x-(a[0]+dx*t),lz-(a[1]+dz*t));
   if(dist<=1.85+footRadius) return 26.0;
  }
  if(Math.abs(x-(-60))<=1.6+footRadius && lz>=170-footRadius && lz<=193+footRadius) return 26.0;
  return null;
 }

 // Comprehensive Solid Buildings Collision (建筑防穿模：商铺外墙/侧墙/背墙实体防穿模、开敞门洞通畅、屋顶坚实体感绝不穿模地下)
 function buildingCollides(x, y, lz){
  if(y > 42 || y < 24) return false;
  if(galleryFloor(x, lz) !== null) return false;
  if(pathContains(x, lz + YUYUAN_SHIFT, YUYUAN_STATION_WALK, 2.2) || pathContains(x, lz + YUYUAN_SHIFT, YUYUAN_STATION_WALK_SOUTH, 2.2) || pathContains(x, lz, JIUQU_BRIDGE, 1.8) || (Math.abs(x - (-60)) < 1.8 && lz >= 169 && lz <= 194)) return false;
  for(const b of YUYUAN_BUILDINGS){
   const dx = x - b.x, dz = lz - b.z;
   if(Math.abs(dx) >= b.rx + .25 || Math.abs(dz) >= b.rz + .25) continue;
   if(b.id === 'huxinting') continue;
   const roofY = 26 + b.levels * 4 + 0.35;
   if(y >= roofY) continue;
   if(y >= roofY - 0.8 && Math.abs(dx) <= b.rx + 0.5 && Math.abs(dz) <= b.rz + 0.5) return true;
   if(b.historic)return true;
  }
  return false;
 }

 return {root,actors,shopArt,streetArt,rickshaws,cullView,isRiding:()=>rickshaws.isRiding(),cameraPose:(yaw,pitch)=>rickshaws.cameraPose(yaw,pitch),vendors:(streetArt.vendors??[]).map(v=>({...v,position:{x:v.position.x,y:v.position.y,z:v.position.z+YUYUAN_SHIFT},root:{position:{x:v.position.x,y:v.position.y,z:v.position.z+YUYUAN_SHIFT}}})),gardenArt,classicArt,waterArt,gates,visitors,crowd,get inventory(){return {...collectibles};},use,close,isPanelOpen:()=>panel,floorAt:(x,z)=>{const lz=z-YUYUAN_SHIFT;if(x<-135||x>40||lz<140||lz>290)return null;return moonBridgeFloor(x,lz)??galleryFloor(x,lz,.29)??buildingRoofFloor(x,lz);},collides:(x,y,z)=>{if(y<21||y>45)return false;const lz=z-YUYUAN_SHIFT;if(x<-135||x>40||lz<140||lz>290)return false;if(galleryFloor(x,lz)!==null)return false;return gates.collides(x,y,lz)||buildingCollides(x,y,lz)||collidesFixtures(x,y,lz);},tick(dt,{night=false,keys=new Set(),camera=null,highView=false,isMobile=false}={}){elapsed+=dt;if(camera)cullView(camera,highView,isMobile);const lp=localPos(),highSkip=Boolean(camera&&camera.position.y>=42),nearDistrict=dt<=0||(!highSkip&&!lastFarCull&&(Math.max(-95-lp.x,lp.x-25,0)**2+Math.max(150-lp.z,lp.z-280,0)**2)<=10000);if(nearDistrict||dt<=0||rickshaws.isRiding()){gates.tick(dt);streetArt.tick?.(dt,{night});waterArt.tick(dt,{night});gardenArt.tick(dt,{night});visitors.tick(dt);crowd.tick(dt);rickshaws.tick(dt,keys);}if(night!==lastNightState){lastNightState=night;for(const l of lights)l.visible=night;for(const l of lanterns)l.material=mat(night?'#ffc477':'#c17d57',night);}},serialize:()=>({gardenEntry:gates.serialize(),elapsed,lastTea,lastSnack,orders,teas,stocks:{...stocks},collectibles:{...collectibles},solved:[...solved]}),restore(d){gates.restore(d?.gardenEntry);elapsed=Number.isFinite(d?.elapsed)?Math.max(0,d.elapsed):0;lastTea=Number.isFinite(d?.lastTea)?Math.min(elapsed,d.lastTea):-30;lastSnack=Number.isFinite(d?.lastSnack)?Math.min(elapsed,d.lastSnack):-30;orders=Math.max(0,Math.floor(d?.orders??0));teas=Math.max(0,Math.floor(d?.teas??0));solved=new Set((Array.isArray(d?.solved)?d.solved:[]).filter(i=>[0,1,2].includes(i)));for(const [key,max]of Object.entries(stockCaps))stocks[key]=Number.isInteger(d?.stocks?.[key])?Math.max(0,Math.min(max,d.stocks[key])):max;collectibles={};for(const name of collectibleNames)if(Number.isInteger(d?.collectibles?.[name])&&d.collectibles[name]>0)collectibles[name]=Math.min(99999,d.collectibles[name]);setStocks();}};
}
