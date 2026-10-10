import {createStreetCrowd} from './street-crowd.js';
import {styleNpc} from './npc-appearance.js';
import {createProduct,SHOP_PRODUCTS,BRAND_PRODUCTS} from './city-products.js';
import {signalPhase} from './city-traffic.js';
import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {DENSE_BUILDINGS} from './city-layout.js';
import {riverWestEdge,riverEastEdge,MAGNOLIA} from './shanghai-map.js';
import {overlaps} from './world.js';
import {boatWorld} from './boat-support.js';
import {shopSignAnchor} from './shop-sign-layout.js';
import {drawHeritageSign,getStripedAwningTexture,getShowcaseDisplayTexture,getLuxuryStorefrontTexture,getMetroPortalTexture,getNanjingSteleTexture,getNanjingSteleBackTexture,HERITAGE_BRANDS} from './shanghai-textures.js';

export const SHOP_NAMES=['永安百货','先施公司','沈大成','老凤祥','泰康食品','亨达利钟表','朵云轩','和平饭店','第一食品','培丽丝绸'];
export const NEON_COLORS=['#ff4f9c','#42eaff','#ab71ff','#ffe176','#49efbb'];
export const FERRY_STOPS=[{name:'金陵东路渡口',x:riverWestEdge(185)-11,z:185,y:26},{name:'东昌路渡口',x:riverEastEdge(136)+8,z:136,y:26}];
export function ferryPhase(time){const t=((time%94)+94)%94;if(t<12)return {port:0,u:0};if(t<47)return {port:null,u:(t-12)/35};if(t<59)return {port:1,u:1};return {port:null,u:1-(t-59)/35};}
export function ferryPosition(time){const phase=ferryPhase(time),a={x:riverWestEdge(185)+7,z:185},b={x:riverEastEdge(136)-13,z:136};return {...phase,x:a.x+(b.x-a.x)*phase.u,z:a.z+(b.z-a.z)*phase.u,y:22.3,yaw:Math.atan2(b.x-a.x,b.z-a.z)+(time%94<59?Math.PI:0)};}

export function createCityActivity({scene,world,getPos,getState,teleport,lookAt=()=>{},notify,pause,resume,onProgress,getVehicles=()=>[],onEvent=()=>{},extraCrowd=[],getTrafficTime=null}){
 const $=id=>document.getElementById(id),root=new THREE.Group(),signs=[],neons=[],vendors=[],tourists=[],stalls=[],shopLights=[];root.name='nanjing-street-life';scene.add(root);
 const box=new THREE.BoxGeometry(1,1,1),mats=new Map();let clock=0,ride=null,panel=false,cooldown=0,purchases=0;const goods=Object.fromEntries(Object.keys(SHOP_PRODUCTS).map(k=>[k,0]));
 function material(color,glow=false){const key=color+glow;if(!mats.has(key))mats.set(key,glow?new THREE.MeshBasicMaterial({color}):new THREE.MeshLambertMaterial({color}));return mats.get(key);}
 function cube(parent,color,x,y,z,sx,sy,sz,glow=false){const m=new THREE.Mesh(box,material(color,glow));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.userData.range=240;parent.add(m);return m;}
 function board(text,color,x,y,z,w,h,angle=0,graffiti=false,brandIndex=-1,style='horizontal'){
  let cw=1024,ch=288;
  if(style==='vertical-blade'){cw=384;ch=1024;}
  else if(style==='medallion'||graffiti){cw=512;ch=512;}
  else if(style==='arch'){cw=1024;ch=384;}
  const compact=graffiti&&[...text].length===1;
  const cDay=document.createElement('canvas');cDay.width=compact?128:cw;cDay.height=compact?128:ch;
  const cNight=document.createElement('canvas');cNight.width=cDay.width;cNight.height=cDay.height;
  if(text==='H'){
   const drawH=(c,col)=>{const ctx=c.getContext('2d');ctx.fillStyle='#232c33';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle=col;ctx.lineWidth=14;ctx.strokeRect(10,10,c.width-20,c.height-20);ctx.font='bold 80px sans-serif';ctx.fillStyle=col;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('H',c.width/2,c.height/2);};
   drawH(cDay,'#f9f2c6');drawH(cNight,'#ffe66d');
  }else{
   const bIdx=brandIndex>=0?brandIndex:(typeof color==='number'?color:0);
   drawHeritageSign(cDay,text,bIdx,false,false,color,style);
   drawHeritageSign(cNight,text,bIdx,false,true,color,style);
  }
  const mapDay=new THREE.CanvasTexture(cDay);mapDay.colorSpace=THREE.SRGBColorSpace;mapDay.generateMipmaps=true;mapDay.minFilter=THREE.LinearMipmapLinearFilter;mapDay.anisotropy=8;
  const mapNight=new THREE.CanvasTexture(cNight);mapNight.colorSpace=THREE.SRGBColorSpace;mapNight.generateMipmaps=true;mapNight.minFilter=THREE.LinearMipmapLinearFilter;mapNight.anisotropy=8;
  const day=new THREE.MeshLambertMaterial({map:mapDay,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4}),night=new THREE.MeshBasicMaterial({map:mapNight,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),day);m.position.set(x,y,z);m.rotation.y=angle;m.userData.range=240;root.add(m);signs.push({mesh:m,day,night});return m;
 }
 const fronts=DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-'));
 for(const [i,b]of fronts.entries()){
  const side=b.entranceSide,brand=HERITAGE_BRANDS[i%HERITAGE_BRANDS.length],name=brand.name,color=brand.color,front=shopSignAnchor(b,30.3),{angle}=front;
  // Mount signs cleanly at side * 0.32 in front of the wall, clear of all pilasters and cornices
  const signZ=front.z+side*.32;
  const signVariant=i%3;
  if(signVariant===0){
   // Type A: Prominent Dual-Sided Vertical Blade Sign (双面海派立体侧悬竖招) + Entrance lintel
   const lintelW=Math.min(b.rx*1.5,front.width-1.2);
   cube(root,'#241e17',front.x,29.8,signZ-side*.06,lintelW+.18,1.26,.12);
   board(name,color,front.x,29.8,signZ+side*.02,lintelW,1.1,angle,false,i,'horizontal');
   const bladeOffset=(i%2?-b.rx+1.2:b.rx-1.2),bladeX=front.x+bladeOffset,bladeZ=front.z+side*1.85;
   // Solid 3D bronze casing (古铜主体结构箱体，厚度0.12)
   cube(root,'#241e17',bladeX,32.2,bladeZ,.12,4.0,1.28);
   // Gilded Art Deco top crest & bottom pendant (顶部山花帽檐与底部垂花)
   cube(root,'#d4af37',bladeX,34.25,bladeZ,.15,.14,1.34);
   cube(root,'#d4af37',bladeX,30.15,bladeZ,.15,.14,1.34);
   // Two independent outward-facing graphic planes (+X and -X), strictly outside the casing faces (no flickering!)
   board(name,color,bladeX+.066,32.2,bladeZ,1.24,3.94,Math.PI/2,false,i,'vertical-blade');
   board(name,color,bladeX-.066,32.2,bladeZ,1.24,3.94,-Math.PI/2,false,i,'vertical-blade');
   neons.push(cube(root,color,bladeX,34.28,bladeZ,.14,.04,1.3,true),cube(root,color,bladeX,30.12,bladeZ,.14,.04,1.3,true),cube(root,color,bladeX,32.2,bladeZ+side*.66,.14,4.04,.04,true));
   // Ornamental Wrought-Iron Cantilever Wall Brackets: connect wall to INNER edge of the frame only, NEVER crossing graphic faces!
   const innerZ=bladeZ-side*.64,wallZ=front.z+side*.06,armLen=Math.abs(innerZ-wallZ),armMidZ=(innerZ+wallZ)/2;
   cube(root,'#1a1816',bladeX,33.7,armMidZ,.06,.06,armLen);
   cube(root,'#1a1816',bladeX,30.7,armMidZ,.06,.06,armLen);
   cube(root,'#2a231b',bladeX,32.2,wallZ,.12,3.4,.06);
   cube(root,'#1a1816',bladeX,32.2,armMidZ,.05,.05,armLen*.85);
  }else if(signVariant===1){
   // Type B: Classical Arched Pediment Plaque (山花拱券门楣招牌)
   const archW=Math.min(b.rx*1.8,4.4);
   cube(root,'#241e17',front.x,30.1,signZ-side*.06,archW+.2,1.75,.12);
   board(name,color,front.x,30.1,signZ+side*.02,archW,1.6,angle,false,i,'arch');
   cube(root,'#ded5bc',front.x,31.05,signZ+side*.04,archW+.35,.24,.28);
   cube(root,'#c5ab6a',front.x,29.25,signZ+side*.04,archW+.15,.14,.2);
  }else{
   // Type C: Traditional Lacquer Calligraphy Lintel + Flanking Gold Medallions (横额大匾 + 双侧金章)
   const boardW=Math.min(b.rx*1.6,3.8);
   cube(root,'#241e17',front.x,30.3,signZ-side*.06,boardW+.2,1.38,.12);
   board(name,color,front.x,30.3,signZ+side*.02,boardW,1.25,angle,false,i,'horizontal');
   board(brand.seal,brand.border,front.x-2.4,30.3,signZ+side*.04,1.1,1.1,angle,true,i,'medallion');
   board(brand.seal,brand.border,front.x+2.4,30.3,signZ+side*.04,1.1,1.1,angle,true,i,'medallion');
  }
  // Storefront ground floor display glazing & bronze entrance frames
  const storeW=Math.min(b.rx*1.8,5.2);
  // Open walk-through entrance with polished brass architrave & flanking French showcase windows
  cube(root,'#caa54f',front.x,29.25,front.z+side*.18,storeW+.1,.18,.14);
  cube(root,'#8f7028',front.x-1.3,27.8,front.z+side*.16,.22,2.7,.12);
  cube(root,'#8f7028',front.x+1.3,27.8,front.z+side*.16,.22,2.7,.12);
  cube(root,'#caa54f',front.x,26.05,front.z+side*.1,2.5,.08,.25); // Brass threshold
  // Flanking showcase display windows on both sides of the open door
  const sideW=Math.max(0.6,(storeW-2.8)/2);
  for(const sideCase of [-1,1]){
   const cx=front.x+sideCase*(1.4+sideW/2);
   cube(root,'#2c1e13',cx,26.4,front.z+side*.15,sideW,.8,.1); // walnut base
   const glass=cube(root,'#e4f5f8',cx,27.8,front.z+side*.18,sideW,2.0,.02);
   glass.material=new THREE.MeshLambertMaterial({color:'#e4f5f8',transparent:true,opacity:.22,depthWrite:false});
   cube(root,'#7a1d26',cx,26.85,front.z+side*.06,sideW-.1,.1,.18); // velvet display riser
  }
  // 3D Luxury Interior Decoration for every shop on Nanjing Road
  cube(root,'#eae2d3',b.x,26.04,b.z,7.6,.06,7.6);
  cube(root,'#232426',b.x,26.06,b.z,6.8,.05,6.8);
  cube(root,'#f5efe4',b.x,26.08,b.z,6.0,.04,6.0);
  cube(root,'#caa54f',b.x,26.095,b.z,6.05,.015,6.05);
  // Art Deco crystal chandelier & warm chandelier illumination
  cube(root,'#caa54f',b.x,29.45,b.z,.85,.08,.85);
  cube(root,'#caa54f',b.x,29.2,b.z,.08,.45,.08);
  cube(root,'#fff8dd',b.x,28.95,b.z,1.25,.16,1.25,true);
  cube(root,'#fff3c7',b.x,28.75,b.z,.8,.2,.8,true);
  cube(root,'#ffea9f',b.x,28.55,b.z,.32,.16,.32,true);
  const chandelierLight=new THREE.PointLight('#ffe49e',3.6,10,1.4);
  chandelierLight.position.set(b.x,28.8,b.z);root.add(chandelierLight);shopLights.push(chandelierLight);
  // Back-wall luxury illuminated display vitrines
  const backZ=b.z-side*3.6;
  cube(root,'#2e1f14',b.x-0.6,27.6,backZ,5.6,3.1,.55);
  cube(root,'#fff6db',b.x-0.6,27.6,backZ+side*.06,5.2,2.7,.4,true);
  for(const sy of [26.9,27.6,28.3])cube(root,'#caa54f',b.x-0.6,sy,backZ+side*.1,5.3,.05,.45);
  // Side-wall vitrines & classical gilded mirror
  cube(root,'#2e1f14',b.x-3.4,27.6,b.z,.55,3.1,5.0);
  cube(root,'#7a1d26',b.x-3.35,27.6,b.z,.42,2.7,4.6);
  cube(root,'#caa54f',b.x-3.25,27.6,b.z,.45,.04,4.7);
  cube(root,'#caa54f',b.x-3.38,28.3,b.z,.08,1.4,1.8);
  cube(root,'#d4eef2',b.x-3.34,28.3,b.z,.04,1.2,1.6);
  // Classic walnut wainscoting
  for(const wz of [b.z-3.7,b.z+3.7]){cube(root,'#362519',b.x,26.6,wz,7.4,1.2,.08);cube(root,'#caa54f',b.x,27.22,wz,7.45,.05,.1);}
  // Central tiered pyramid showcase table (琳琅满目多层大展台)
  const featBp=BRAND_PRODUCTS[name]??{product:'gift',craft:'海派老字号'};
  cube(root,'#2c1e13',b.x-1.8,26.45,b.z,2.2,.9,1.4);
  cube(root,'#caa54f',b.x-1.8,26.92,b.z,2.25,.04,1.45);
  cube(root,'#7a1d26',b.x-1.8,26.96,b.z,2.1,.04,1.3);
  cube(root,'#caa54f',b.x-1.8,27.16,b.z,1.25,.36,.75);
  cube(root,'#5e121b',b.x-1.8,27.36,b.z,1.2,.03,.7);
  const featureUnit=createProduct(featBp.product);featureUnit.scale.setScalar(.52);featureUnit.position.set(b.x-1.8,27.4,b.z);root.add(featureUnit);
  // Surrounding signature goods on lower island tier
  for(const [idx,dx]of [[-0.65,-0.3],[0.65,-0.3],[-0.65,0.3],[0.65,0.3]].entries()){
   const itemKind=idx===0?featBp.product:idx===1?'casket':idx===2?featBp.product:'vase';
   const u=createProduct(itemKind);u.scale.setScalar(.44);u.position.set(b.x-1.8+dx[0],27.02,b.z+dx[1]);root.add(u);
  }
  // Back-wall multi-tier grand vitrine display (背墙通顶多宝格展品)
  for(let col=-1.8;col<=1.8;col+=1.2){
   const bUnit=createProduct(featBp.product);bUnit.scale.setScalar(.42);bUnit.position.set(b.x-.6+col,27.66,backZ+side*.38);root.add(bUnit);
   const tUnit=createProduct(Math.abs(col)<.5?'casket':'vase');tUnit.scale.setScalar(.4);tUnit.position.set(b.x-.6+col,28.36,backZ+side*.38);root.add(tUnit);
   const lUnit=createProduct('gift');lUnit.scale.setScalar(.4);lUnit.position.set(b.x-.6+col,26.96,backZ+side*.38);root.add(lUnit);
  }
  // Side vitrine products (侧墙展柜陈列)
  for(const sz of [-1.2,-.4,.4,1.2]){
   const sUnit=createProduct(featBp.product);sUnit.scale.setScalar(.42);sUnit.position.set(b.x-3.2,27.65,b.z+sz);root.add(sUnit);
  }
  // Window showcase feature items (临街橱窗陈列)
  for(const sideCase of [-1,1]){
   const cx=front.x+sideCase*(1.4+sideW/2);
   const winUnit=createProduct(featBp.product);winUnit.scale.setScalar(.46);winUnit.position.set(cx,26.95,front.z+side*.06);root.add(winUnit);
  }
  // Interior brand lacquer plaque on back wall
  board(name+' · '+(featBp.craft||'老字号品牌'),brand.border,b.x-.6,28.62,backZ+side*.22,3.2,.72,side>0?0:Math.PI,false,i,'horizontal');
  // In-store browsing customer
  const shopper=person(i+150);const shopX=b.x-1.8,shopZ=b.z+side*1.1;
  shopper.root.position.set(shopX,26,shopZ);shopper.root.rotation.y=side>0?0:Math.PI;
  shopper.startX=shopX;shopper.startZ=shopZ;shopper.side=side;
  tourists.push({...shopper,kind:'shop',stationary:true,phase:i+1.5,browse:true});
  // Individual neon letters follow storey walls with authentic brand characters
  const brandChars=[...name];
  for(const [j,letter]of brandChars.entries()){
   const a=shopSignAnchor(b,32.5+j,b.rx-1.1);
   board(letter,NEON_COLORS[(i+j)%5],a.x,a.y,a.z+side*.22,1,.85,a.angle,true,i+j);
  }
  // Rooftop skyline signs: elevated above roof level on open steel truss towers (frame behind sign)
  if(i%3===0||b.h>=13){
   const crown=shopSignAnchor(b,25.3+b.h);
   const signY=26+b.h+1.45;
   const roofZ=crown.z+side*.38;
   const frameZ=roofZ-side*.28;
   const signW=Math.min(b.rx*1.8,crown.width-.2);
   // Support steel truss frame mounted BEHIND the sign board
   cube(root,'#3b434a',crown.x,signY-.7,frameZ,Math.min(signW+.4,4.2),.12,.28);
   cube(root,'#3b434a',crown.x-1.5,signY-.35,frameZ,.1,.75,.22);
   cube(root,'#3b434a',crown.x+1.5,signY-.35,frameZ,.1,.75,.22);
   cube(root,'#3b434a',crown.x-1.5,signY-.7,frameZ-side*.45,.1,.16,.7);
   cube(root,'#3b434a',crown.x+1.5,signY-.7,frameZ-side*.45,.1,.16,.7);
   board(name,NEON_COLORS[(i+1)%5],crown.x,signY,roofZ,signW,1.4,crown.angle,false,i,'horizontal');
  }
  for(let level=1;level<Math.min(b.h,13);level++)for(const dx of [-b.rx+1,b.rx-1]){const a=shopSignAnchor(b,26+level,dx);neons.push(cube(root,color,a.x,a.y,a.z,.09,.95,.06,true));}
  if(i%4===0){const light=new THREE.PointLight(color,7,12,1.5);light.position.set(b.x+.5,29,front.z+side*2);root.add(light);shopLights.push(light);}
 }
 function person(i,parent=root,role='visitor'){const r=new THREE.Group(),shirt=['#6cd9de','#d66c8e','#eee5d4','#8f9fc9','#dfad5b'][i%5];cube(r,shirt,0,1,0,.45,.64,.28);cube(r,'#dcb08d',0,1.52,0,.34,.35,.33);cube(r,'#40352e',0,1.72,0,.36,.08,.35);const arms=[],legs=[];for(const side of [-1,1]){const arm=cube(r,shirt,side*.29,1.02,0,.15,.55,.18);arms.push(arm);legs.push(cube(r,'#43516b',side*.13,.36,0,.17,.7,.2));}styleNpc({root:r,torso:r.children[0],head:r.children[1],hair:r.children[2],arms,legs},i,role);parent.add(r);return {root:r,arms,legs};}
 for(let i=0;i<fronts.length;i+=3){const b=fronts[i],side=b.entranceSide,indoor=i%12!==0,x=b.x+2.4,z=indoor?b.z:side>0?63.1:69.9;
  if(overlaps(world,x,26,z))continue;
  const brand=HERITAGE_BRANDS[i%HERITAGE_BRANDS.length];
  const bp=BRAND_PRODUCTS[brand.name]??(i%2===0?{product:'pastry',name:brand.name+'名点',food:2,craft:'海派老字号'}:{product:'gift',name:brand.name+'礼盒',food:0,craft:'海派老字号'});
  const product=indoor?bp.product:(i%2===0?'bun':'mooncake'),food=indoor?bp.food>0:true;
  const stall=new THREE.Group();stall.name=indoor?'indoor-shop-counter':'street-food-stall';stall.position.set(x,26,z);root.add(stall);
  const counterBase=cube(stall,food?'#42291a':'#2c3236',0,.9,0,2.4,.18,1.2);
  if(indoor){
   counterBase.material=new THREE.MeshLambertMaterial({map:getShowcaseDisplayTexture(false)});
   cube(stall,'#caa54f',0,.98,0,2.45,.04,1.25);
   cube(stall,food?'#7a1d26':'#16382b',0,1.01,0,2.3,.02,1.1);
   cube(stall,'#caa54f',.9,1.68,-.35,.14,.1,.14);
   cube(stall,'#caa54f',-.9,1.82,-.35,.08,.36,.08);
   for(const dx of [-1.05,1.05])cube(stall,'#765c46',dx,.44,0,.12,.88,1);
   for(const dz of [-.59,.59]){const glass=cube(stall,'#b9dde2',0,1.3,dz,2.4,.6,.025);glass.material=new THREE.MeshLambertMaterial({color:'#d2eef2',transparent:true,opacity:.16,depthWrite:false});}
   const lid=cube(stall,'#d2eef2',0,1.61,0,2.45,.025,1.25);lid.material=new THREE.MeshLambertMaterial({color:'#d2eef2',transparent:true,opacity:.12,depthWrite:false});
   cube(stall,'#fff0ce',0,3.3,0,2.1,.06,.7,true);
  }else{
   const awning=cube(stall,brand.color,0,2.5,0,2.6,.16,1.5);awning.material=new THREE.MeshLambertMaterial({map:getStripedAwningTexture(brand.color,'#fefcf5')});
   for(const dx of [-1.1,1.1])cube(stall,'#7b8e99',dx,1.7,.6,.07,1.5,.07);
  }
  const stock=[];for(let j=0;j<6;j++){const unit=createProduct(product);unit.scale.setScalar(.52);unit.position.set((j%3-1)*.7,1.01,(Math.floor(j/3)-.5)*.5);stall.add(unit);stock.push(unit);}
  stalls.push({x,z,rx:1.5,rz:.9});
  const vendor=person(i,root,'vendor');vendor.root.position.set(x,26,z-side*.95);vendor.root.rotation.y=side>0?Math.PI:0;
  vendors.push({id:b.id,x,z,name:indoor?brand.name+' · '+bp.name:(i%2===0?'老上海生煎摊':'泰康鲜肉月饼摊'),food,product,indoor,building:b,stock,remaining:6,root:vendor.root});
  board(indoor?(brand.name+' · '+bp.craft):(i%2===0?'老上海生煎 · 非遗名点':'泰康名点 · 鲜肉月饼'),brand.border,x,indoor?28.6:28.05,z-side*.78,2.7,.68,side>0?0:Math.PI,false,i,'horizontal');
  const customer=person(i+7);customer.root.position.set(x,26,z+side*1.25);customer.root.rotation.y=side>0?0:Math.PI;
  const parcel=createProduct(product);parcel.scale.setScalar(.5);parcel.position.set(.38,food?1.35:.6,-.1);customer.root.add(parcel);
  customer.startX=x;customer.startZ=z+side*1.25;customer.side=side;customer.cycleTime=20+(i*3)%10;
  tourists.push({...customer,kind:food?'eat':'shop',parcel,stationary:true,phase:i});
 }
 for(let i=0;i<40;i++){const p=person(i+13),bag=cube(p.root,['#fc869b','#50caca','#d4b572'][i%3],.35,.57,0,.3,.38,.2);tourists.push({...p,kind:'walk',bag,t:i*8.1,phase:i*.8});}
 // Last-mile delivery is on foot in the pedestrian street, matching the photographed P+W arrangement.
 for(let i=0;i<3;i++){const p=person(i+80,root,'delivery'),color=i%2?'#55acd4':'#f6c74b';cube(p.root,color,0,1.82,0,.39,.15,.37);cube(p.root,color,0,1.02,.3,.44,.45,.26);const bag=cube(p.root,'#f4eee1',.36,.63,-.05,.3,.4,.23);tourists.push({...p,kind:'delivery-walk',bag,t:75+i*66,phase:i*.8});}
 const bundWalkers=[];
 for(let i=0;i<20;i++){
  const p=person(i+200,root,'visitor'),dir=i%2===0?1:-1;
  const x=-80+i*5.8,baseZ=65.2+(i%3)*.7,isNorth=i%2===0;
  p.root.position.set(x,26,baseZ);
  p.root.rotation.y=dir>0?Math.PI/2:-Math.PI/2;
  const bag=i%3===0?cube(p.root,['#fc869b','#50caca','#d4b572'][i%3],.35,.57,0,.3,.38,.2):null;
  bundWalkers.push({...p,x,baseZ,z:baseZ,dir,speed:0.85+(i%5)*.09,phase:i*1.15,bag,waitTimer:0,isNorth});
 }
 const landings=FERRY_STOPS.map(stop=>{for(let r=0;r<=12;r++)for(const [dx,dz]of [[r,0],[-r,0],[0,r],[0,-r]]){const p={...stop,x:Math.floor(stop.x+dx)+.5,z:Math.floor(stop.z+dz)+.5};if(!overlaps(world,p.x,26,p.z)&&overlaps(world,p.x,25.9,p.z))return p;}throw new Error('No safe ferry landing: '+stop.name);});
 for(const [i,p]of landings.entries()){
  board(p.name,'#61daef',p.x,29,p.z,5,1.2,0,true);cube(root,'#718b96',p.x-2,27.3,p.z,.16,2.6,.16);for(let j=0;j<4;j++){const guest=person(60+i*4+j);guest.root.position.set(p.x+(j-1.5)*.7,26,p.z+2);}
 }
 const ferry=new THREE.Group();ferry.name='huangpu-passenger-ferry';scene.add(ferry);cube(ferry,'#e4ebed',0,.45,0,5.4,.9,11);cube(ferry,'#3c91ba',0,.2,0,5.5,.35,11.1);cube(ferry,'#f0ece1',0,1.4,0,4.5,1.35,8.4);cube(ferry,'#d1e7ea',0,2.25,0,4.9,.18,9);cube(ferry,'#f4f3e8',0,2.8,-2.8,3.8,1.1,2.7);
 for(const side of [-1,1]){cube(ferry,'#7bb7cb',side*2.27,1.58,0,.06,.7,7);cube(ferry,'#cedcde',side*2.35,2.65,1,.09,.75,6.2);for(let z=-3;z<=3;z++)cube(ferry,'#e9f2ef',side*2.37,1.58,z,.09,.85,.1);}
 cube(ferry,'#456475',0,3.45,-2.8,4,.16,2.9);for(let i=0;i<6;i++){const guest=person(80+i,ferry);guest.root.position.set(i%2?1.2:-1.2,2.35,i%3*1.4-.4);guest.root.scale.setScalar(.65);}const ferryLamps=[cube(ferry,'#fa8c86',-2.5,1.3,-4.4,.18,.18,.2,true),cube(ferry,'#a8edca',2.5,1.3,-4.4,.18,.18,.2,true)];
 // The main tower has a white petal crown around an unobstructed landing pad.
 const heli=new THREE.Group();heli.name='magnolia-parked-helicopter';heli.position.set(MAGNOLIA.x-1.5,83,MAGNOLIA.z-1);root.add(heli);
 cube(heli,'#dfeaf0',0,1.4,0,2,1.55,3.4);cube(heli,'#61a9c0',0,1.55,-1.75,1.8,.9,.1);cube(heli,'#cedce2',0,1.5,3.2,.4,.45,4.2);cube(heli,'#dbad65',0,2.4,5.1,.2,1.6,1.1);for(const side of [-1,1])cube(heli,'#455966',side*1.1,.22,.3,.15,.16,4);cube(heli,'#445764',0,2.55,0,.18,.8,.18);cube(heli,'#657d88',0,2.9,0,9.5,.09,.18);cube(heli,'#657d88',0,2.9,0,.18,.09,9.5);
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7;cube(root,'#eaf1ee',MAGNOLIA.x+Math.cos(a)*8,85,MAGNOLIA.z+Math.sin(a)*7,1.3,4.5,1.4);}
 const pad=new THREE.Mesh(new THREE.PlaneGeometry(10,9),material('#46606a'));pad.rotation.x=-Math.PI/2;pad.position.set(MAGNOLIA.x,83.02,MAGNOLIA.z);root.add(pad);const h=board('H','#f9f2c6',MAGNOLIA.x,83.05,MAGNOLIA.z,3,3,0,true);h.rotation.x=-Math.PI/2;
 // Nanjing Road Pedestrian Street Entrance Monument Stele (南京路步行街入口维罗纳红石碑 - 位于马路靠近步行街侧)
 function createNanjingStele(parent){
  const sx=-35,sz=66;
  cube(parent,'#2b2d30',sx,26.15,sz,1.2,.3,3.6);
  cube(parent,'#caa54f',sx,26.31,sz,1.22,.02,3.62);
  cube(parent,'#3d4044',sx,26.46,sz,.88,.3,3.1);
  cube(parent,'#caa54f',sx,26.62,sz,.9,.02,3.12);
  cube(parent,'#7b2226',sx,27.45,sz,.44,1.62,2.56);
  cube(parent,'#54171a',sx,28.28,sz,.5,.08,2.62);
  cube(parent,'#caa54f',sx,28.33,sz,.52,.02,2.64);
  const frontDay=new THREE.MeshLambertMaterial({map:getNanjingSteleTexture(false),side:THREE.FrontSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  const frontNight=new THREE.MeshBasicMaterial({map:getNanjingSteleTexture(true),side:THREE.FrontSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  const frontMesh=new THREE.Mesh(new THREE.PlaneGeometry(2.48,1.55),frontDay);
  frontMesh.position.set(sx+.225,27.45,sz);frontMesh.rotation.y=Math.PI/2;frontMesh.userData.range=240;parent.add(frontMesh);
  signs.push({mesh:frontMesh,day:frontDay,night:frontNight});
  const backDay=new THREE.MeshLambertMaterial({map:getNanjingSteleBackTexture(false),side:THREE.FrontSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  const backNight=new THREE.MeshBasicMaterial({map:getNanjingSteleBackTexture(true),side:THREE.FrontSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-4});
  const backMesh=new THREE.Mesh(new THREE.PlaneGeometry(2.48,1.55),backDay);
  backMesh.position.set(sx-.225,27.45,sz);backMesh.rotation.y=-Math.PI/2;backMesh.userData.range=240;parent.add(backMesh);
  signs.push({mesh:backMesh,day:backDay,night:backNight});
  for(const dx of [-.65,.65])for(const dz of [-1.5,1.5]){
   cube(parent,'#1f2124',sx+dx,26.03,sz+dz,.24,.06,.24);
   const lamp=cube(parent,'#ffe49e',sx+dx,26.06,sz+dz,.16,.02,.16,true);
   neons.push(lamp);
  }
  const steleLight=new THREE.PointLight('#ffe18c',3.2,7.5,1.5);
  steleLight.position.set(sx,27.2,sz);parent.add(steleLight);shopLights.push(steleLight);
  // Zhongshan East 1st Road Pedestrian Zebra Crossing (中山东一路外滩路口斑马线)
  for(let x=13.5;x<=22.5;x+=1.1){
   const stripe=cube(parent,'#f6f0e4',x,26.04,66,.8,.02,5.2);
   stripe.userData.range=240;
  }
  // Stop lines before zebra crossing for North-South vehicle traffic
  for(const z of [62.8,69.2]){
   const stopLine=cube(parent,'#fffaed',18,26.045,z,9.8,.02,.22);
   stopLine.userData.range=240;
  }
 }
 createNanjingStele(root);
 function close(){if(!panel)return;panel=false;$('city-dialog').close();resume();}
 $('city-close').onclick=close;$('city-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});
 function nearestVendor(){const p=getPos();return Math.abs(p.y-26)<2?vendors.find(v=>Math.hypot(p.x-v.x,p.z-v.z)<2.5&&(!v.indoor||Math.abs(p.z-v.building.z)<v.building.rz-.3)):null;}
 function showStock(v){v.stock.forEach((m,i)=>m.visible=i<v.remaining);}
 function use(){if(ride){notify('轮渡正在过江，抵达后会自动下船。');return true;}const p=getPos(),port=landings.findIndex(s=>Math.hypot(p.x-s.x,p.z-s.z)<3&&Math.abs(p.y-26)<2);
  if(port>=0){if(ferryPhase(clock).port!==port){notify('轮渡还未靠岸，请在渡口候船。');return true;}ride={from:port};notify('已登上轮渡，正在前往'+landings[1-port].name+'。');return true;}
  const v=nearestVendor();if(!v)return false;pause();panel=true;$('city-title').textContent=v.name;$('city-result').textContent='柜台现货 '+v.remaining+' 份 · 购物袋已有 '+(goods[v.product]??0)+' 份'+SHOP_PRODUCTS[v.product].name+'。';$('city-actions').replaceChildren();const button=document.createElement('button');button.className='recipe-card';const label=()=>button.textContent=v.remaining?'购买'+SHOP_PRODUCTS[v.product].name+' · 库存 '+v.remaining:'已售罄';label();button.disabled=!v.remaining;button.onclick=()=>{if(!v.remaining)return;if(cooldown>0){$('city-result').textContent='刚买过一份，稍后再来。';return;}if(v.food){const state=getState();state.food+=2;if(state.hunger<20)state.eat();}v.remaining--;goods[v.product]=(goods[v.product]??0)+1;showStock(v);label();button.disabled=!v.remaining;purchases++;cooldown=30;onEvent({type:'shop'});$('city-result').textContent='已购买'+SHOP_PRODUCTS[v.product].name+'，柜台少一份；购物袋共 '+goods[v.product]+' 份'+(v.food?'，食物已加入背包。':'。');onProgress();};$('city-actions').appendChild(button);$('city-dialog').showModal();return true;
 }
 const sharedWalkers=extraCrowd.map(p=>{p.crowdManaged=true;p.arms=p.limbs.map(l=>l.arm);p.legs=p.limbs.map(l=>l.leg);return p;});
 const crowd=createStreetCrowd([...tourists,...sharedWalkers],{clear:p=>!overlaps(world,p.x,p.y,p.z)&&overlaps(world,p.x,p.y-.1,p.z)&&!stalls.some(s=>Math.abs(p.x-s.x)<s.rx+.29&&Math.abs(p.z-s.z)<s.rz+.29)});
 function tick(dt,{night=false}={}){if(getTrafficTime)clock=getTrafficTime();else clock+=dt;cooldown=Math.max(0,cooldown-dt);for(const s of signs)s.mesh.material=night?s.night:s.day;for(const m of neons)m.visible=night;
  const bPhase=signalPhase(clock,0),ewGreen=bPhase.ew==='green';

  if(getPos){const p=getPos();for(const l of shopLights)l.userData.distSq=(l.position.x-p.x)**2+(l.position.z-p.z)**2;shopLights.sort((a,b)=>a.userData.distSq-b.userData.distSq);for(let idx=0;idx<shopLights.length;idx++)shopLights[idx].visible=night&&idx<4&&shopLights[idx].userData.distSq<1600;}else{for(const m of shopLights)m.visible=night;}
  for(const m of ferryLamps)m.visible=night;const f=ferryPosition(clock);ferry.position.set(f.x,f.y,f.z);ferry.rotation.y=f.yaw;
  if(ride){if(f.port===null)ride.departed=true;if(f.port===1-ride.from){teleport(landings[f.port]);const trip=ride;ride=null;if(trip.departed)onEvent({type:'ferry',from:trip.from,to:f.port,departed:true});notify('已抵达'+landings[f.port].name+'。');onProgress();}else{const deck=boatWorld(ferry,{x:0,z:1.8});teleport({...deck,y:f.y+2.34});}}
  const vehicles=getVehicles();
  crowd.tick(dt,vehicles);
  for(const bw of bundWalkers){
   if(bw.waitTimer>0){bw.waitTimer-=dt;bw.legs[0].rotation.x=0;bw.legs[1].rotation.x=0;bw.arms[0].rotation.x=-.2;bw.arms[1].rotation.x=-.2;continue;}
   // 1. Obey Pedestrian Traffic Light with crosswalk clearance
   let redWait=false;
   const nearCar=vehicles.some(v=>{const p=v.root?.position;return p&&p.z>=56&&p.z<=76&&p.x>=12.0&&p.x<=24.0&&Math.abs(v.travelSpeed??v.speed??0)>.2;});
   const canStartCrossing=ewGreen&&bPhase.remaining>=12&&!nearCar;
   if(!canStartCrossing){
    if(bw.dir===1&&bw.x>=11.5&&bw.x<=13.4){redWait=true;bw.x=12.2;}
    else if(bw.dir===-1&&bw.x<=24.5&&bw.x>=22.6){redWait=true;bw.x=23.8;}
   }
   if(redWait){
    bw.legs[0].rotation.x=0;bw.legs[1].rotation.x=0;
    bw.arms[0].rotation.x=-.15+Math.sin(clock*2+bw.phase)*.05;bw.arms[1].rotation.x=-.15-Math.sin(clock*2+bw.phase)*.05;
    bw.root.position.set(bw.x,26,bw.z);bw.root.rotation.y=bw.dir>0?Math.PI/2:-Math.PI/2;
    continue;
   }
   // 2. Advance walker along corridor connecting Bund and Commercial Street
   const onRoadway=bw.x>13.0&&bw.x<23.0;const currentSpeed=onRoadway?Math.max(bw.speed,1.8):bw.speed;bw.x+=bw.dir*currentSpeed*dt;
   if(bw.x>=34){bw.x=34;bw.dir=-1;bw.waitTimer=3.5+(bw.phase%3)*1.5;}
   else if(bw.x<=-85){bw.x=-85;bw.dir=1;bw.waitTimer=3+(bw.phase%2)*1.5;}
   // 3. Smooth S-curve bypass around the Nanjing Road Monument Stele (at x = -35, z = 66)
   let curZ=bw.baseZ,yaw=bw.dir>0?Math.PI/2:-Math.PI/2;
   if(bw.x>=-41&&bw.x<=-29){
    const progress=(bw.x-(-41))/12;
    const bell=Math.sin(progress*Math.PI);
    const lateralShift=bw.isNorth?-2.55:2.45;
    curZ=bw.baseZ+lateralShift*bell;
    const dZdx=lateralShift*(Math.PI/12)*Math.cos(progress*Math.PI);
    yaw=Math.atan2(dZdx*bw.dir,bw.dir);
   }
   bw.z=curZ;
   bw.phase+=dt*bw.speed*5;const gait=Math.sin(bw.phase);
   bw.legs[0].rotation.x=gait*.3;bw.legs[1].rotation.x=-gait*.3;
   bw.arms[0].rotation.x=-gait*.3;bw.arms[1].rotation.x=gait*.3;
   bw.root.position.set(bw.x,26,bw.z);bw.root.rotation.y=yaw;
  }
  for(const p of tourists){
   if(p.stationary){
    if(p.browse){
     p.arms[0].rotation.x=-.4+Math.sin(clock*1.2+p.phase)*.15;p.arms[1].rotation.x=-.2;
     p.root.rotation.y=(p.side>0?0:Math.PI)+Math.sin(clock*0.8+p.phase)*0.25;
    }else if((p.kind==='eat'||p.kind==='shop')&&p.startX!==undefined){
     const cycle=p.cycleTime||22,t=((clock+p.phase*3.7)%cycle);
     if(t<5.5){
      p.root.position.set(p.startX,26,p.startZ);p.root.rotation.y=p.side>0?0:Math.PI;
      if(p.parcel)p.parcel.visible=t>3;p.arms[0].rotation.x=-.2;p.legs[0].rotation.x=0;p.legs[1].rotation.x=0;
     }else if(t<cycle-2){
      const walkT=t-5.5,prog=walkT/(cycle-7.5);
      const targetX=p.startX-1.2*Math.sin(prog*Math.PI),curZ=p.startZ+Math.sin(prog*Math.PI*2)*0.25;
      p.root.position.set(targetX,26,curZ);p.root.rotation.y=(p.side>0?0:Math.PI)+Math.cos(prog*Math.PI)*0.5;
      if(p.parcel)p.parcel.visible=true;const gait=Math.sin(walkT*5);
      p.legs[0].rotation.x=gait*.25;p.legs[1].rotation.x=-gait*.25;
      p.arms[0].rotation.x=p.kind==='eat'?-1.2+Math.sin(walkT*3)*.22:-.35;
     }else{
      if(p.parcel)p.parcel.visible=false;p.root.position.set(p.startX,26,p.startZ);p.root.rotation.y=p.side>0?0:Math.PI;
      p.legs[0].rotation.x=0;p.legs[1].rotation.x=0;p.arms[0].rotation.x=-.2;
     }
    }else{p.arms[0].rotation.x=p.kind==='eat'?-1.1+Math.sin(clock*1.5+p.phase)*.2:-.3;}
   }
  }
  const v=nearestVendor(),port=landings.find(s=>Math.hypot(getPos().x-s.x,getPos().z-s.z)<3&&Math.abs(getPos().y-26)<2);$('city-prompt').hidden=!(v||port||ride);$('city-prompt').textContent=ride?'轮渡过江中 · 抵达自动下船':port?'V 搭乘轮渡 · '+port.name:v?'V '+(v.indoor?'店内购物':'逛摊位')+' · '+v.name:'';
 }
 const moving=new Set([...tourists,...vendors,...bundWalkers].map(p=>p.root).concat(vendors.flatMap(v=>v.stock),heli,signs.map(s=>s.mesh),neons,shopLights));
 batchMeshes(root,staticMeshes(root,moving),'street-furniture');neons.splice(0,neons.length,...batchMeshes(root,neons,'street-neon'));
 tick(0);return {tick,use,close,signs,neons,vendors,tourists,bundWalkers,stalls,ferry,heli,landings,goods,isPanelOpen:()=>panel,isRiding:()=>!!ride,cancelRide:()=>{if(ride){teleport(landings[ride.from]);ride=null;}},safeSavePoint:()=>ride?{...landings[ride.from]}:null,serialize:()=>({cooldown,purchases,goods:{...goods},stock:Object.fromEntries(vendors.map(v=>[v.id,v.remaining]))}),restore:d=>{ride=null;for(const id of Object.keys(SHOP_PRODUCTS))goods[id]=Math.max(0,Math.min(99999,Math.floor(Number(d?.goods?.[id])||0)));for(const v of vendors){const count=d?.stock?.[v.id];v.remaining=Number.isFinite(count)?Math.max(0,Math.min(6,Math.floor(count))):6;showStock(v);}cooldown=Math.max(0,Math.min(30,Number(d?.cooldown)||0));purchases=Math.max(0,Math.floor(Number(d?.purchases)||0));},collides:(x,y,z)=>y<28.5&&y+1.75>26&&(stalls.some(s=>Math.abs(x-s.x)<s.rx&&Math.abs(z-s.z)<s.rz)||(Math.abs(x-(-35))<.65&&Math.abs(z-66)<1.85))||!heli.userData.piloted&&y<heli.position.y+2.5&&y+1.75>heli.position.y&&Math.abs(x-heli.position.x)<1.6&&Math.abs(z-heli.position.z)<2.1};
}
