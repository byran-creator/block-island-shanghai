import {createYuyuanStreetAssets} from './yuyuan-street-assets.js';
import {createYuyuanShopAssets} from './yuyuan-shop-assets.js';
import {createYuyuanGardenAssets} from './yuyuan-garden-assets.js';
import {createYuyuanClassicAssets} from './yuyuan-classic-assets.js';
import {createYuyuanWater} from './yuyuan-water.js';
import {createYuyuanGates,insideGarden} from './yuyuan-gates.js';
import {createYuyuanCrowd} from './yuyuan-crowd.js';
import {createYuyuanVisitors} from './yuyuan-visitors.js';
import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {overlaps} from './world.js';
import {styleNpc} from './npc-appearance.js';
import {YUYUAN,YUYUAN_SHIFT,YUYUAN_BUILDINGS,WATER_CORRIDOR,GARDEN_PONDS,JIUQU_BRIDGE,YUYUAN_WALKS,pathContains} from './yuyuan-layout.js';
export const YUYUAN_RIDDLES=[{question:'两岸不相连，走我能过河。猜一物。',answers:['桥','茶壶','灯笼'],correct:0},{question:'有脚不走路，安睡好帮手。猜一物。',answers:['鱼竿','床','竹子'],correct:1},{question:'白天藏起来，夜里满天开。猜一物。',answers:['小笼包','茶叶','星星'],correct:2}];
export function createYuyuan({scene,world=null,getVehicles=()=>[],getPos,getState,notify,pause,resume,onProgress=()=>{},onEvent=()=>{}}){
 const root=new THREE.Group();root.name='yuyuan-garden-and-malls';root.position.z=YUYUAN_SHIFT;scene.add(root);const box=new THREE.BoxGeometry(1,1,1),mats=new Map(),lights=[],lanterns=[],actors=[],fixtureBounds=[];let panel=false,elapsed=0,lastTea=-30,lastSnack=-30,solved=new Set(),orders=0,teas=0,stocks={buns:12,candy:8,souvenir:6,tea:6},collectibles={};
 const $=id=>document.getElementById(id),mat=(color,glow=false)=>{const key=color+glow;if(!mats.has(key))mats.set(key,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));return mats.get(key);};
 function cube(color,x,y,z,w,h,d,glow=false){const m=new THREE.Mesh(box,mat(color,glow));m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);return m;}
 function board(text,x,y,z,w=4,h=.8,yaw=0){
  if(typeof document==='undefined'||!document.createElement){
   const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial());
   m.position.set(x,y,z);m.rotation.y=yaw;root.add(m);return m;
  }
  const isVert=h>w*1.5,c=document.createElement('canvas');
  if(isVert){c.width=160;c.height=480;}else{c.width=512;c.height=128;}
  const ctx=c.getContext('2d'),bw=c.width,bh=c.height;
  if(isVert){
   const bg=ctx.createLinearGradient?.(0,0,bw,0);
   if(bg?.addColorStop){bg.addColorStop(0,'#100a08');bg.addColorStop(0.5,'#201610');bg.addColorStop(1,'#100a08');ctx.fillStyle=bg;}
   else ctx.fillStyle='#18100c';
   ctx.fillRect?.(0,0,bw,bh);
   ctx.strokeStyle='#8f6828';ctx.lineWidth=1.5;ctx.strokeRect?.(5,5,bw-10,bh-10);
   const bgGrad=ctx.createLinearGradient?.(0,0,0,bh);
   if(bgGrad?.addColorStop){bgGrad.addColorStop(0,'#ffe894');bgGrad.addColorStop(0.5,'#c99638');bgGrad.addColorStop(1,'#7a5416');ctx.strokeStyle=bgGrad;}
   else ctx.strokeStyle='#c99638';
   ctx.lineWidth=3;ctx.strokeRect?.(9,9,bw-18,bh-18);
   ctx.fillStyle='#edd378';ctx.font='bold 16px serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText?.('❖',bw/2,24);
   const chars=text.replace(/[\s·\-_]/g,'').split(''),startY=48,availH=bh-startY-44,spacing=Math.min(50,availH/Math.max(1,chars.length));
   ctx.font='bold 34px "STKaiti","Kaiti","Songti","SimSun",serif';
   chars.forEach((ch,i)=>{
    const cy=startY+i*spacing+spacing/2;
    ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillText?.(ch,bw/2+2,cy+3);
    ctx.fillStyle='#8f5c18';ctx.fillText?.(ch,bw/2+1,cy+1.5);
    const cg=ctx.createLinearGradient?.(0,cy-18,0,cy+18);
    if(cg?.addColorStop){cg.addColorStop(0,'#fffbe0');cg.addColorStop(0.3,'#fce07e');cg.addColorStop(0.7,'#e0a938');cg.addColorStop(1,'#946618');ctx.fillStyle=cg;}
    else ctx.fillStyle='#fce07e';
    ctx.fillText?.(ch,bw/2,cy);
   });
   const ss=24,sx=bw/2-ss/2,sy=bh-36;
   ctx.fillStyle='#a62420';ctx.fillRect?.(sx,sy,ss,ss);
   ctx.strokeStyle='#d6854b';ctx.lineWidth=1;ctx.strokeRect?.(sx+.5,sy+.5,ss-1,ss-1);
   ctx.fillStyle='#fce4c8';ctx.font='bold 10px "STKaiti","Kaiti",serif';ctx.fillText?.('百年',bw/2,sy+ss/2);
  }else{
   const bg=ctx.createRadialGradient?.(bw/2,bh/2,10,bw/2,bh/2,bw*0.6);
   if(bg?.addColorStop){bg.addColorStop(0,'#241710');bg.addColorStop(0.7,'#150d09');bg.addColorStop(1,'#0c0705');ctx.fillStyle=bg;}
   else ctx.fillStyle='#140d09';
   ctx.fillRect?.(0,0,bw,bh);
   ctx.strokeStyle='rgba(255,215,120,0.04)';ctx.lineWidth=1;
   for(let y=8;y<bh;y+=8){ctx.beginPath?.();ctx.moveTo?.(8,y);ctx.lineTo?.(bw-8,y);ctx.stroke?.();}
   ctx.strokeStyle='#9c7530';ctx.lineWidth=1.5;ctx.strokeRect?.(6,6,bw-12,bh-12);
   const bgGrad=ctx.createLinearGradient?.(0,0,bw,bh);
   if(bgGrad?.addColorStop){bgGrad.addColorStop(0,'#ffe48a');bgGrad.addColorStop(0.5,'#c99638');bgGrad.addColorStop(1,'#7a5416');ctx.strokeStyle=bgGrad;}
   else ctx.strokeStyle='#c99638';
   ctx.lineWidth=3.5;ctx.strokeRect?.(12,12,bw-24,bh-24);
   const drawCorner=(cx,cy,sx,sy)=>{
    ctx.strokeStyle='#edd378';ctx.lineWidth=2;ctx.beginPath?.();
    ctx.moveTo?.(cx+sx*16,cy);ctx.lineTo?.(cx,cy);ctx.lineTo?.(cx,cy+sy*16);
    ctx.moveTo?.(cx+sx*5,cy+sy*5);ctx.lineTo?.(cx+sx*11,cy+sy*5);ctx.lineTo?.(cx+sx*11,cy+sy*11);
    ctx.stroke?.();
   };
   drawCorner(14,14,1,1);drawCorner(bw-14,14,-1,1);drawCorner(14,bh-14,1,-1);drawCorner(bw-14,bh-14,-1,-1);
   const ss=28,sx=bw-48,sy=bh/2-ss/2;
   ctx.fillStyle='#a62420';ctx.fillRect?.(sx,sy,ss,ss);
   ctx.strokeStyle='#d6854b';ctx.lineWidth=1.5;ctx.strokeRect?.(sx+1,sy+1,ss-2,ss-2);
   ctx.fillStyle='#fce4c8';ctx.font='bold 11px "STKaiti","Kaiti",serif';ctx.textAlign='center';ctx.textBaseline='middle';
   ctx.fillText?.('非遗',sx+ss/2,sy+ss/2);
   const tx=(bw-36)/2,ty=bh/2+1;ctx.textAlign='center';ctx.textBaseline='middle';
   const fontSize=Math.min(46,Math.max(26,Math.round(bw/Math.max(6,text.length)*1.05)));
   ctx.font=`bold ${fontSize}px "STKaiti","Kaiti","Songti","SimSun",serif`;
   ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillText?.(text,tx+2.5,ty+3.5);
   ctx.fillStyle='#8f5c18';ctx.fillText?.(text,tx+1.2,ty+1.8);
   const textGrad=ctx.createLinearGradient?.(0,ty-fontSize*0.6,0,ty+fontSize*0.6);
   if(textGrad?.addColorStop){textGrad.addColorStop(0,'#fffbe0');textGrad.addColorStop(0.25,'#fce07e');textGrad.addColorStop(0.7,'#e0a938');textGrad.addColorStop(1,'#946618');ctx.fillStyle=textGrad;}
   else ctx.fillStyle='#fce07e';
   ctx.fillText?.(text,tx,ty);
  }
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;
  const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t,side:THREE.DoubleSide}));
  mesh.position.set(x,y,z);mesh.rotation.y=yaw;mesh.userData.panel=true;root.add(mesh);return mesh;
 }
 function roof(b,y,scale=1){const rx=(b.rx+1.2)*scale,rz=(b.rz+1.2)*scale,vertices=[];for(const side of [-1,1])for(let j=0;j<5;j++){const a=j/5,c=(j+1)/5,z1=b.z+side*rz*a,z2=b.z+side*rz*c,h=t=>y+2.3*(1-t)+.65*Math.pow(t,7);vertices.push(b.x-rx,h(a),z1,b.x+rx,h(a),z1,b.x-rx,h(c),z2,b.x-rx,h(c),z2,b.x+rx,h(a),z1,b.x+rx,h(c),z2);}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.computeVertexNormals();const material=mat('#374543').clone();material.side=THREE.DoubleSide;const mesh=new THREE.Mesh(g,material);root.add(mesh);cube('#927b50',b.x,y+2.32,b.z,rx*2+.4,.14,.18);const eaveGlow=cube('#ffd75a',b.x,y+2.36,b.z,rx*2+.3,.06,.09,true);lights.push(eaveGlow);for(const side of [-1,1]){cube('#74644c',b.x,y+.66,b.z+side*rz,rx*2+.4,.12,.17);const sideEaveZ=cube('#ffc240',b.x,y+.7,b.z+side*rz,rx*2+.3,.06,.09,true);lights.push(sideEaveZ);const sideEaveX=cube('#ffc240',b.x+side*rx,y+.7,b.z,.09,.06,rz*2+.3,true);lights.push(sideEaveX);}for(const sx of [-1,1])for(const sz of [-1,1]){const cornerX=b.x+sx*rx,cornerZ=b.z+sz*rz,tipX=cornerX+sx*.55,tipZ=cornerZ+sz*.55,tipY=y+1.12;const wing=new THREE.Mesh(box,mat('#374543'));wing.position.set((cornerX+tipX)/2,(y+.66+tipY)/2,(cornerZ+tipZ)/2);wing.scale.set(.12,.16,.75);wing.rotation.y=Math.atan2(sz,sx);wing.rotation.z=sx*.28;root.add(wing);cube('#28332c',tipX,tipY+.12,tipZ,.15,.22,.15);const wingGlow=cube('#ffd75a',(cornerX+tipX)/2,(y+.72+tipY)/2,(cornerZ+tipZ)/2,.07,.07,.78,true);wingGlow.rotation.y=Math.atan2(sz,sx);wingGlow.rotation.z=sx*.28;lights.push(wingGlow);const cornerLantern=new THREE.Mesh(new THREE.CylinderGeometry(.16,.18,.35,8),mat('#e83a28',true));cornerLantern.position.set(tipX,tipY-.28,tipZ);root.add(cornerLantern);lanterns.push(cornerLantern);const core=cube('#fff5b8',tipX,tipY-.28,tipZ,.08,.22,.08,true);lights.push(core);cube('#d42d22',tipX,tipY-.52,tipZ,.03,.16,.03);}}
  for(const b of YUYUAN_BUILDINGS){
   if(b.id==='huxinting'){
    // Single-tier delicate open classical lakeside tea pavilion on Nine-turn Bridge (开放式休息水榭，无墙壁、带靠栏坐凳)
    roof(b,26+1*4,.96);
    for(const sx of [-1,1])for(const sz of [-1,1]){
     cube('#822e23',b.x+sx*(b.rx-.35),28,b.z+sz*(b.rz-.35),.28,3.6,.28);
     cube('#6a241b',b.x+sx*(b.rx-.35),26.25,b.z+sz*(b.rz-.35),.42,.5,.42);
    }
    for(const side of [-1,1]){
     cube('#6e462d',b.x,26.65,b.z+side*(b.rz-.22),b.rx*2-.7,.5,.1);
     cube('#573520',b.x,26.96,b.z+side*(b.rz-.22),b.rx*2-.5,.08,.14);
    }
    const pavilionLantern=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.45,8),mat('#e83a28',true));
    pavilionLantern.position.set(b.x,29.1,b.z);root.add(pavilionLantern);lanterns.push(pavilionLantern);
    continue;
   }
   for(const side of [-1,1]){
    const isDoorSide=([-107,8].includes(b.x)&&side===1)||([-86,25].includes(b.x)&&side===-1);
    if(isDoorSide){
     const flankLen=Math.max(0.4,b.rz-1.4);
     for(const fz of [b.z-b.rz+flankLen/2,b.z+b.rz-flankLen/2])cube('#804432',b.x+side*(b.rx+.025),27.5,fz,.04,3,flankLen);
     for(let z=b.z-b.rz+.8;z<=b.z+b.rz-.4;z+=1.6)if(Math.abs(z-b.z)>=1.4)cube('#5d432b',b.x+side*(b.rx+.035),27.5,z,.06,3,.12);
     if(b.levels>1){
      cube('#804432',b.x+side*(b.rx+.025),29+(b.levels-1)*2,b.z,.04,(b.levels-1)*4,b.rz*2);
      for(let z=b.z-b.rz+.8;z<=b.z+b.rz-.4;z+=1.6)cube('#5d432b',b.x+side*(b.rx+.035),29+(b.levels-1)*2,z,.06,(b.levels-1)*4,.12);
     }
    }else{
     cube('#804432',b.x+side*(b.rx+.025),26+b.levels*2,b.z,.04,b.levels*4,b.rz*2);
     for(let z=b.z-b.rz+.8;z<=b.z+b.rz-.4;z+=1.6)cube('#5d432b',b.x+side*(b.rx+.035),26+b.levels*2,z,.06,b.levels*4,.12);
    }
   }for(const side of [-1,1]){if(side===-1&&(['nanxiang','craft-shop','tea-gallery'].includes(b.id)||b.id.startsWith('yuyuan-street-')||b.id.startsWith('yuyuan-south-'))){if(b.levels>1)cube('#884b36',b.x,30+(b.levels-1)*2,b.z-b.rz-.028,b.rx*2,(b.levels-1)*4,.035);continue;}for(const sign of [-1,1])cube('#884b36',b.x+sign*(b.rx+1.5)/2,26+b.levels*2,b.z+side*(b.rz+.028)+(side>0?1:0),b.rx-1.5,b.levels*4,.035);if(b.levels>1)cube('#884b36',b.x,29.5+(b.levels-1)*2,b.z+side*(b.rz+.028)+(side>0?1:0),b.rx*2,(b.levels-1)*4-1,.035);}for(let level=1;level<=b.levels;level++)roof(b,26+level*4,level===b.levels?.96:1.1);for(const side of [-1,1])for(let x=b.x-b.rx+.6;x<=b.x+b.rx-.4;x+=1.2){if(side===-1&&(['nanxiang','craft-shop','tea-gallery'].includes(b.id)||b.id.startsWith('yuyuan-street-')||b.id.startsWith('yuyuan-south-')))continue;cube('#62482f',x,27.5,b.z+side*(b.rz+.035)+(side>0?1:0),.11,3,.08);if(Math.abs(x-b.x)>1.5){cube('#593e2b',x,27.55,b.z+side*(b.rz+.08)+(side>0?1:0),.84,1.72,.06);const winGlow=cube('#ffba54',x,27.55,b.z+side*(b.rz+.07)+(side>0?1:0),.78,1.6,.02,true);lights.push(winGlow);for(const dx of [-.27,0,.27])cube('#d3ba77',x+dx,27.55,b.z+side*(b.rz+.12)+(side>0?1:0),.035,1.5,.025);for(const y of [27.05,27.55,28.05])cube('#d3ba77',x,y,b.z+side*(b.rz+.12)+(side>0?1:0),.78,.035,.025);}}if(b.levels>=2)for(const side of [-1,1]){cube('#8c5b32',b.x,30.05,b.z+side*(b.rz+.35),b.rx*2+.7,.12,.65);cube('#76502c',b.x,30.9,b.z+side*(b.rz+.6),b.rx*2+.7,.09,.09);for(let x=b.x-b.rx;x<=b.x+b.rx;x+=.6)cube('#76502c',x,30.5,b.z+side*(b.rz+.6),.05,.8,.06);const upperWin=cube('#ffba54',b.x,30.5,b.z+side*(b.rz+.32),b.rx*2-1.5,1.2,.02,true);lights.push(upperWin);}if(b.levels>=3)for(const side of [-1,1]){cube('#8c5b32',b.x,34.05,b.z+side*(b.rz+.35),b.rx*2+.5,.12,.65);const topWin=cube('#ffba54',b.x,34.5,b.z+side*(b.rz+.32),b.rx*2-1.5,1.2,.02,true);lights.push(topWin);}}
  board('湖心亭',-46,30.3,178-2.65,2.6,.6);board('南翔小笼',-26,30,209.8,5.5,.9);board('江南手作',-62,30,209.8,5.5,.9);board('九曲桥',-65,28,173,3.4,.7,Math.PI/2);board('豫园 · 沿街步行 / 地铁10',-35,29,10,5,.7);
 board('华宝楼 · 百年商厦',-86,37.2,165.8,5.5,.9);board('天裕楼 · 豫园名阁',8,37.2,166.8,5.5,.9);board('和丰楼 · 美食雅集',8,33,184.8,5.5,.9);
 board('上海老饭店 · 百年名筵',8,37.2,198.8,5.5,.9);board('宁波汤团店 · 经典名点',8,30,216.8,5.5,.9);board('老庙黄金 · 百年祥瑞',8,33,248.8,5.5,.9);
 board('上海梨膏糖 · 非遗老号',-107,33,151.8,5.5,.9);board('童涵春堂 · 传统国药',-107,33,199.8,5.5,.9);board('绿波廊 · 湖畔美馔',-20,33,183.8,4.8,.9);
 board('大假山 · 望江亭',-72,30.5,220.8,4.5,.8);board('穿云龙墙 · 粉墙竹影',-62,29.8,217.2,4.2,.7);board('江南名石 · 玉玲珑',-36,29,244.5,4,.7);
 // Signature Huxinting & Lubolang waterside terrace cyan glow (水上露台水线蓝光 - 参考图 user_huxinting_night_water.png)
 for(const [wx,wz,ww,wd] of [[-46,178-2.6,5.4,.08],[-46,178+2.6,5.4,.08],[-46-2.6,178,.08,5.4],[-46+2.6,178,.08,5.4],[-20,188-4.1,10.2,.08],[-20-5.1,188,.08,8.2]]){const wg=cube('#2cb8ff',wx,22.35,wz,ww,.06,wd,true);lights.push(wg);}
 // Grand North Entrance Stone Paifang (豫园北门石木牌坊 - bazaar_gate.jpg)
 const gateX=-46.5,gateZ=149.2;
 for(const px of [gateX-3.8,gateX-1.6,gateX+1.6,gateX+3.8]){cube('#7b756b',px,26.3,gateZ,.55,.6,.55);cube('#653e2d',px,29.2,gateZ,.28,5.2,.28);}
 cube('#5c3727',gateX,31.4,gateZ,8.4,.32,.36);cube('#5c3727',gateX,29.8,gateZ,8.4,.22,.26);
 for(const [cx,w,yLevel] of [[gateX,4.2,32.4],[gateX-2.7,2.8,31.2],[gateX+2.7,2.8,31.2]]){cube('#364940',cx,yLevel,gateZ,w,.22,.9);for(const sx of [-1,1]){const tip=cube('#364940',cx+sx*(w/2+.22),yLevel+.18,gateZ,.28,.14,.8);tip.rotation.z=sx*.35;cube('#23322a',cx+sx*(w/2+.32),yLevel+.32,gateZ,.14,.2,.14);}}
 board('豫园 · 海上名园',gateX,30.6,gateZ-.14,3.2,.72);
 const waterArt=createYuyuanWater(root,{ponds:GARDEN_PONDS}),localPos=()=>({...getPos(),z:getPos().z-YUYUAN_SHIFT});
 const gates=createYuyuanGates(root,{cube,mat,getPos:localPos,onProgress,onEvent});
 board('内园检票 · V',-35,31.9,193.88,2.5,.48);board('内园检票 · V',-75.12,31.9,205,2.5,.48,-Math.PI/2);
 // Curve-following bridge posts sit outside its three-block walking deck.
 for(let i=1;i<JIUQU_BRIDGE.length;i++){const a=JIUQU_BRIDGE[i-1],b=JIUQU_BRIDGE[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]),dx=(b[0]-a[0])/length,dz=(b[1]-a[1])/length;for(let d=0;d<=length;d+=1.5)for(const side of [-1,1]){const x=a[0]+dx*d+dz*side*1.3,z=a[1]+dz*d-dx*side*1.3;if(Math.abs(x-WATER_CORRIDOR.x)<WATER_CORRIDOR.width/2+.3&&z>=WATER_CORRIDOR.z1&&z<=WATER_CORRIDOR.z2||pathContains(x,z,JIUQU_BRIDGE,1.05)||Math.abs(x+46)<4.5&&Math.abs(z-178)<4.5)continue;cube('#806a48',x,26.4,z,.09,.8,.09);fixtureBounds.push({x,z,rx:.05,rz:.05,y:26,h:.8});}for(const side of [-1,1])for(let d=.25;d<length;d+=.5){const x=a[0]+dx*d+dz*side*1.3,z=a[1]+dz*d-dx*side*1.3;if(Math.abs(x-WATER_CORRIDOR.x)<WATER_CORRIDOR.width/2+.3&&z>=WATER_CORRIDOR.z1&&z<=WATER_CORRIDOR.z2||pathContains(x,z,JIUQU_BRIDGE,1.05)||Math.abs(x+46)<4.5&&Math.abs(z-178)<4.5)continue;const m=cube('#8e7855',x,26.77,z,.53,.065,.07);m.rotation.y=-Math.atan2(dz,dx);fixtureBounds.push({x,z,rx:dx?.265:.035,rz:dx?.035:.265,y:26.72,h:.1});}}

 const streetArt=createYuyuanStreetAssets(root,{cube,mat,board});fixtureBounds.push(...streetArt.fixtures);Object.assign(stocks,streetArt.stockCaps);const stockCaps={buns:12,candy:8,souvenir:6,tea:6,...streetArt.stockCaps};const collectibleNames=['江南手作纪念品','江南茶具套装','吹糖金龙','康熙通宝铜钱','老坑古玉扳指',...streetArt.shops.filter(s=>!s.food).map(s=>s.name)];
 for(const group of Object.values(streetArt.goods).flat())batchMeshes(group,staticMeshes(group),'yuyuan-street-stock');
 const setStocks=()=>{shopArt.setStocks(stocks);streetArt.setStocks(stocks);};
 const shopArt=createYuyuanShopAssets(root,{cube,mat,board});fixtureBounds.push(...shopArt.fixtures);for(const group of Object.values(shopArt.goods).flat())batchMeshes(group,staticMeshes(group),'yuyuan-stock-item');
 cube('#765236',-46,26.42,175,1.9,.84,.8);fixtureBounds.push({x:-46,z:175,rx:.95,rz:.4,y:26,h:.84});for(const x of [-46.5,-46,-45.5])cube('#d0dcc9',x,26.98,175,.16,.23,.16);
 const gardenArt=createYuyuanGardenAssets(root,{cube,mat,buildings:YUYUAN_BUILDINGS});fixtureBounds.push(...gardenArt.fixtures);
 const classicArt=createYuyuanClassicAssets(root,{cube,mat,board});fixtureBounds.push(...classicArt.fixtures);

 // Spaced traditional red lanterns across pedestrian bazaar alleys and perimeter corridors
 for(const z of [152,165,178,192,206,220,236,252,266])for(let x=-95;x<=15;x+=12){cube('#786446',x,29.6,z,.04,.5,.04);const lantern=new THREE.Mesh(new THREE.SphereGeometry(.26,10,8),mat('#e88f4c',true));lantern.position.set(x,29.15,z);lantern.scale.y=1.35;root.add(lantern);lanterns.push(lantern);cube('#d5ac56',x,28.76,z,.07,.24,.07,true);}
 function npc(index,x,z,role,color){const r=new THREE.Group();r.position.set(x,26,z);root.add(r);const add=(c,xx,y,zz,w,h,d)=>{const m=new THREE.Mesh(box,mat(c));m.position.set(xx,y,zz);m.scale.set(w,h,d);r.add(m);return m;};const torso=add(color,0,1,0,.43,.7,.3),head=add('#d4a27b',0,1.55,0,.34,.36,.34),hair=add('#332c27',0,1.76,0,.35,.08,.35),arms=[],legs=[];for(const side of [-1,1]){arms.push(add(color,side*.28,1,0,.13,.6,.18));legs.push(add('#34413c',side*.12,.38,0,.17,.76,.22));}styleNpc({root:r,torso,head,hair,arms,legs},index,'visitor');actors.push({root:r,person:true,npcRole:role,guide:{intro:'欢迎来到豫园。湖心亭喝茶、南翔柜台点小笼，商圈有华宝楼古玩与民俗戏台，内园扩建了张南阳大假山与宋代玉玲珑。',choices:[['怎么去地铁？','从西侧牌坊沿福佑路指示去河南南路地铁口。10号线基隆路方向下一站南京东路，可换乘2号线去陆家嘴。']]}});}
 npc(101,-44.5,176.2,'湖心亭茶客','#b39568');npc(102,-25.5,214.8,'南翔师傅','#c6a27b');npc(103,-61.5,204.5,'灯谜向导','#9f6c79');npc(104,-34,201,'豫园游客','#79939b');npc(105,-56,201,'豫园游客','#96aa82');
 for(const [i,shop]of streetArt.shops.entries())npc(120+i,shop.x-1.7,shop.z+.3,shop.title+'店员',['#b78c66','#85936b','#a87e83'][i%3]);
 npc(106,-62,214.8,'手作店员','#947950');npc(107,-65,164.4,'茶坊店员','#7b976e');
 npc(130,-105.8,153.4,'梨膏糖掌柜','#9c3f38');npc(131,-105.8,200.4,'国药堂掌柜','#4d6f54');npc(132,-105.8,233.4,'名酿坊掌柜','#7a422b');
 npc(133,-87.2,167.4,'华宝楼掌柜','#8c6e3d');npc(134,-87.2,248.4,'生煎师傅','#aa5538');
 npc(135,8.2,167.4,'天裕楼掌柜','#3a617e');npc(136,8.2,199.4,'老饭店名厨','#9b3f36');npc(137,8.2,249.4,'金楼掌柜','#9a7c36');
 npc(140,-101.8,212.5,'游商糖人张','#a84232');npc(141,11.8,181.0,'挑担栗子王','#785233');npc(142,-92.2,212.0,'地摊古董刘','#4f6479');
 const dynamic=new Set([...lights,...lanterns,...actors.map(a=>a.root),...gardenArt.dynamicRoots,...classicArt.dynamicRoots,...waterArt.dynamicRoots,...gates.dynamicRoots,...streetArt.dynamicRoots,...Object.values(shopArt.goods).flat()]);batchMeshes(root,staticMeshes(root,dynamic),'yuyuan-static-details');for(const a of actors){a.root.removeFromParent();a.root.position.z+=YUYUAN_SHIFT;scene.add(a.root);}

 const visitors=world?createYuyuanVisitors({scene,world,getVehicles,blocked:(x,y,z)=>overlaps(world,x,y,z)||fixtureBounds.some(b=>Math.abs(x-b.x)<b.rx+.29&&Math.abs(z-YUYUAN_SHIFT-b.z)<b.rz+.29&&y<b.y+b.h&&y+1.75>b.y)}):{people:[],tick(){}};actors.push(...visitors.people);
 const crowd=world?createYuyuanCrowd({scene,world,blocked:(x,y,z)=>overlaps(world,x,y,z)||gates.collides(x,y,z-YUYUAN_SHIFT)||fixtureBounds.some(b=>Math.abs(x-b.x)<b.rx+.29&&Math.abs(z-YUYUAN_SHIFT-b.z)<b.rz+.29&&y<b.y+b.h&&y+1.75>b.y)}):{people:[],tick(){}};actors.push(...crowd.people);
 function close(){if(!panel)return;panel=false;$('yuyuan-dialog').close();resume();}
 function action(text,fn){const b=document.createElement('button');b.className='recipe-card';b.textContent=text;b.onclick=fn;$('yuyuan-actions').appendChild(b);return b;}
 function use(){const p=localPos();if(p.y<25||p.y>28)return false;
  const gate=gates.near(p);if(gate){pause();panel=true;$('yuyuan-title').textContent='海上名园 · 内园检票';$('yuyuan-result').textContent=insideGarden(p)?'离园请过闸，出园后再次进入需重新领票。':'九曲桥、湖心亭与商街可自由游览；内园使用免费游戏体验票。';$('yuyuan-actions').replaceChildren();
   if(!insideGarden(p)&&!gates.ticket)action('领取免费游园体验票',()=>{gates.claim();close();use();});
   const button=action(insideGarden(p)?'开闸离园':'检票入园',()=>{if(gates.open(gate)){close();notify('闸机已开，请从月洞门中央走过。');}});button.disabled=!insideGarden(p)&&!gates.ticket;$('yuyuan-dialog').showModal();return true;}
   const extraShops=streetArt.extraShops??[];
  const peddlerEntries=[{id:'peddler-tang',x:-101.8,z:212.5,title:'游商糖人张 · 街角小摊',peddlerType:'tang'},{id:'peddler-chestnut',x:11.8,z:181.0,title:'挑担栗子王 · 现炒栗子',peddlerType:'chestnut'},{id:'peddler-antique',x:-92.2,z:212.0,title:'地摊古董刘 · 金石古币',peddlerType:'antique'}];
  const entries=[{id:'tea',x:-46,z:176.8,title:'湖心亭 · 临水茶席'},{id:'snack',x:-26,z:212,title:'南翔 · 店内小笼柜台'},{id:'craft',x:-62,z:212,title:'江南手作 · 店内柜台'},{id:'teashop',x:-65,z:162,title:'湖畔茶坊 · 店内柜台'},{id:'riddle',x:-62,z:203,title:'豫园 · 灯谜'},...streetArt.shops.map(s=>({...s,id:'street-'+s.id})),...extraShops.map(s=>({...s,id:'extra-'+s.id,isExtra:true})),...peddlerEntries].sort((a,b)=>Math.hypot(a.x-p.x,a.z-p.z)-Math.hypot(b.x-p.x,b.z-p.z));const near=entries[0];if(Math.hypot(near.x-p.x,near.z-p.z)>3.2)return false;pause();panel=true;$('yuyuan-title').textContent=near.title;$('yuyuan-result').textContent='';$('yuyuan-actions').replaceChildren();
  if(near.id==='tea')action('品一壶茉莉花茶',()=>{if(elapsed-lastTea<20){$('yuyuan-result').textContent='慢慢品茶，稍后再来。';return;}lastTea=elapsed;const s=getState();s.health=Math.min(20,s.health+2);s.hunger=Math.min(20,s.hunger+1);teas++;onEvent({type:'yuyuan-tea'});onProgress();$('yuyuan-result').textContent='茶香与湖水相伴 · 体力略有恢复。';});
  function buy(key,name,food=0){const b=action(name+' · 库存 '+stocks[key],()=>{if(stocks[key]<=0)return;if(elapsed-lastSnack<20){$('yuyuan-result').textContent='刚买过一份，稍后再来。';return;}lastSnack=elapsed;stocks[key]--;orders++;setStocks();if(food)getState().food=Math.min(99999,getState().food+food);else collectibles[name]=(collectibles[name]??0)+1;if(near.id==='snack')onEvent({type:'yuyuan-snack'});onProgress();b.textContent=name+' · 库存 '+stocks[key];b.disabled=stocks[key]===0;$('yuyuan-result').textContent='已购买'+name+'，柜台少一份；'+(food?'Z 可食用。':'O 背包可查看收藏。');});b.disabled=stocks[key]===0;}
  if(near.id==='snack'){buy('buns','小笼包',2);buy('candy','梨膏糖 / 五香豆',2);}if(near.id==='craft')buy('souvenir','江南手作纪念品');if(near.id==='teashop')buy('tea','江南茶具套装');if(near.key)buy(near.key,near.name,near.food);
  if(near.isExtra)action('挑选与品鉴特色名品',()=>{const s=getState();s.health=Math.min(20,s.health+1);if(['pastry','candy','wine'].includes(near.type))s.hunger=Math.min(20,s.hunger+1);$('yuyuan-result').textContent='掌柜笑迎八方客：【'+near.title+'】名扬沪上，承蒙厚爱！';});
  if(near.peddlerType==='tang'){
   action('买一串冰糖葫芦 (红润酸甜)',()=>{if(elapsed-lastSnack<10){$('yuyuan-result').textContent='刚吃完一串，稍后再尝。';return;}lastSnack=elapsed;const s=getState();s.hunger=Math.min(20,s.hunger+2);s.food=Math.min(99999,s.food+2);$('yuyuan-result').textContent='【糖人张】嘘……小声点！城管来了喊我一声！刚熬好的冰糖葫芦，酸甜酥脆咯！';});
   action('买一只吹糖金龙 (栩栩如生)',()=>{collectibles['吹糖金龙']=(collectibles['吹糖金龙']??0)+1;$('yuyuan-result').textContent='【糖人张】得嘞！这只吹糖金龙您拿好，晶莹剔透，纯手工非遗手艺！';});
  }
  if(near.peddlerType==='chestnut'){
   action('买一包热糖炒栗子 (刚出锅)',()=>{if(elapsed-lastSnack<10){$('yuyuan-result').textContent='慢慢剥慢慢吃，小心烫嘴。';return;}lastSnack=elapsed;const s=getState();s.hunger=Math.min(20,s.hunger+3);s.food=Math.min(99999,s.food+3);$('yuyuan-result').textContent='【栗子王】小声点小声点！正宗良乡热糖炒栗子，现炒现出锅，壳脆仁甜，热乎着呢！';});
  }
  if(near.peddlerType==='antique'){
   action('淘一枚古铜钱 (康熙通宝)',()=>{collectibles['康熙通宝铜钱']=(collectibles['康熙通宝铜钱']??0)+1;$('yuyuan-result').textContent='【古董刘】这位爷借一步说话！祖传生坑官铸古铜钱，识货的便宜匀给您，留个念想！';});
   action('鉴赏古玉扳指 (温润包浆)',()=>{collectibles['老坑古玉扳指']=(collectibles['老坑古玉扳指']??0)+1;$('yuyuan-result').textContent='【古董刘】您老好眼力！这枚老坑和田青白玉扳指，包浆油润，大开门的好东西！';});
  }
  if(near.id==='riddle'){const index=YUYUAN_RIDDLES.findIndex((_,i)=>!solved.has(i));if(index<0)$('yuyuan-result').textContent='三道灯谜都答对了，夜晚可来赏灯。';else{const q=YUYUAN_RIDDLES[index];$('yuyuan-result').textContent=q.question;for(const [i,answer]of q.answers.entries())action(answer,()=>{if(i!==q.correct){$('yuyuan-result').textContent='再想想：'+q.question;return;}if(solved.has(index))return;solved.add(index);if(solved.size===3)onEvent({type:'yuyuan-riddle',solved:3});onProgress();$('yuyuan-result').textContent='答对了！'+solved.size+'/3；关闭后再来下一题。';});}}
  $('yuyuan-dialog').showModal();return true;
 }
 $('yuyuan-close').onclick=close;$('yuyuan-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});
 return {root,actors,shopArt,streetArt,vendors:(streetArt.vendors??[]).map(v=>({...v,position:{x:v.position.x,y:v.position.y,z:v.position.z+YUYUAN_SHIFT},root:{position:{x:v.position.x,y:v.position.y,z:v.position.z+YUYUAN_SHIFT}}})),gardenArt,classicArt,waterArt,gates,visitors,crowd,get inventory(){return {...collectibles};},use,close,isPanelOpen:()=>panel,collides:(x,y,z)=>gates.collides(x,y,z-YUYUAN_SHIFT)||fixtureBounds.some(b=>Math.abs(x-b.x)<b.rx+.29&&Math.abs(z-YUYUAN_SHIFT-b.z)<b.rz+.29&&y<b.y+b.h&&y+1.75>b.y),tick(dt,{night=false}={}){elapsed+=dt;gates.tick(dt);streetArt.tick?.(dt,{night});waterArt.tick(dt,{night});gardenArt.tick(dt,{night});visitors.tick(dt);crowd.tick(dt);for(const l of lights)l.visible=night;for(const l of lanterns)l.material=mat(night?'#ffc477':'#c17d57',night);},serialize:()=>({gardenEntry:gates.serialize(),elapsed,lastTea,lastSnack,orders,teas,stocks:{...stocks},collectibles:{...collectibles},solved:[...solved]}),restore(d){gates.restore(d?.gardenEntry);elapsed=Number.isFinite(d?.elapsed)?Math.max(0,d.elapsed):0;lastTea=Number.isFinite(d?.lastTea)?Math.min(elapsed,d.lastTea):-30;lastSnack=Number.isFinite(d?.lastSnack)?Math.min(elapsed,d.lastSnack):-30;orders=Math.max(0,Math.floor(d?.orders??0));teas=Math.max(0,Math.floor(d?.teas??0));solved=new Set((Array.isArray(d?.solved)?d.solved:[]).filter(i=>[0,1,2].includes(i)));for(const [key,max]of Object.entries(stockCaps))stocks[key]=Number.isInteger(d?.stocks?.[key])?Math.max(0,Math.min(max,d.stocks[key])):max;collectibles={};for(const name of collectibleNames)if(Number.isInteger(d?.collectibles?.[name])&&d.collectibles[name]>0)collectibles[name]=Math.min(99999,d.collectibles[name]);setStocks();}};
}
