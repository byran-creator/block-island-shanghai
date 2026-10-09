import * as THREE from './three.module.js';

function createCloudBodyTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=512;c.height=512;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=256,cy=256;

 // Multi-scale organic cumulus billows with natural vertical cauliflower mounds
 // Soft Gaussian-like falloff creates delicate, airy, translucent cloud masses
 const lobes=[
  // Core volume
  [0, 10, 125, 0.30],
  [-38, 14, 105, 0.26],
  [38, 12, 105, 0.26],
  // Upper billowing mounds (providing natural vertical cauliflower height)
  [-28, -45, 90, 0.24],
  [28, -42, 90, 0.24],
  [0, -72, 80, 0.22],
  // Flank shoulders
  [-80, 10, 85, 0.20],
  [80, 8, 85, 0.20],
  [-65, -25, 75, 0.18],
  [65, -22, 75, 0.18],
  // Lower billowy puffs
  [-32, 48, 85, 0.20],
  [32, 46, 85, 0.20],
  [0, 62, 75, 0.18],
  // Soft airy perimeter feathering
  [-110, 16, 62, 0.14],
  [110, 14, 62, 0.14],
  [-52, -68, 58, 0.14],
  [52, -65, 58, 0.14]
 ];

 for(const [px,py,pr,palpha] of lobes){
  const g=ctx.createRadialGradient(cx+px,cy+py,pr*0.12,cx+px,cy+py,pr);
  g.addColorStop(0,`rgba(255,255,255,${palpha})`);
  g.addColorStop(0.35,`rgba(255,255,255,${palpha*0.72})`);
  g.addColorStop(0.70,`rgba(255,255,255,${palpha*0.22})`);
  g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx+px,cy+py,pr,0,Math.PI*2);ctx.fill();
 }

 const tex=new THREE.CanvasTexture(c);
 tex.wrapS=THREE.ClampToEdgeWrapping;
 tex.wrapT=THREE.ClampToEdgeWrapping;
 tex.needsUpdate=true;
 return tex;
}

function createCloudBellyTexture(){
 if(typeof document==='undefined')return null;
 const c=document.createElement('canvas');c.width=512;c.height=256;
 const ctx=c.getContext('2d');if(!ctx)return null;
 const cx=256,cy=140;

 // Underside sunlit rim and illuminated belly lobes:
 // Concentrated along the bottom rim, providing a glowing molten gold backlit fringe
 const rims=[
  // Main bottom rim
  [0, 32, 125, 0.65],
  [-48, 36, 105, 0.55],
  [48, 34, 105, 0.55],
  // Lower side shoulders
  [-95, 38, 85, 0.45],
  [95, 36, 85, 0.45],
  [-145, 40, 65, 0.32],
  [145, 38, 65, 0.32],
  // Bottom fringe
  [0, 56, 75, 0.50],
  [-40, 52, 65, 0.42],
  [40, 50, 65, 0.42],
  // Soft upward transition into body
  [0, 2, 85, 0.32],
  [-50, 6, 75, 0.26],
  [50, 4, 75, 0.26]
 ];

 for(const [px,py,pr,palpha] of rims){
  const g=ctx.createRadialGradient(cx+px,cy+py,pr*0.10,cx+px,cy+py,pr);
  g.addColorStop(0,`rgba(255,255,255,${palpha})`);
  g.addColorStop(0.38,`rgba(255,255,255,${palpha*0.75})`);
  g.addColorStop(0.72,`rgba(255,255,255,${palpha*0.22})`);
  g.addColorStop(1,'rgba(255,255,255,0)');
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx+px,cy+py,pr,0,Math.PI*2);ctx.fill();
 }

 const tex=new THREE.CanvasTexture(c);
 tex.wrapS=THREE.ClampToEdgeWrapping;
 tex.wrapT=THREE.ClampToEdgeWrapping;
 tex.needsUpdate=true;
 return tex;
}

export function createClouds(camera=new THREE.PerspectiveCamera()){
 const clouds=new THREE.Group();
 const bodyTex=createCloudBodyTexture();
 const bellyTex=createCloudBellyTexture();

 // Dual-material system:
 // 1. bodyMat: Main cloud body & shaded upper billows (soft white by day, luminous coral-lavender at sunset)
 const bodyMat=new THREE.MeshBasicMaterial({
  color:'#ffffff',
  map:bodyTex,
  transparent:true,
  opacity:.36,
  depthWrite:false
 });

 // 2. bellyMat: Sunlit illuminated underside rims (bright white by day, incandescent fiery gold/salmon at sunset)
 const bellyMat=new THREE.MeshBasicMaterial({
  color:'#ffffff',
  map:bellyTex,
  transparent:true,
  opacity:.65,
  depthWrite:false
 });

 const tier1Group=new THREE.Group();tier1Group.name='clouds-tier1-cumulus';clouds.add(tier1Group);
 const tier2Group=new THREE.Group();tier2Group.name='clouds-tier2-banks';clouds.add(tier2Group);
 const tier3Group=new THREE.Group();tier3Group.name='clouds-tier3-canopy';clouds.add(tier3Group);

 const cloudList=[],billows=[],batches=[];
 const plane=new THREE.PlaneGeometry(1,1),matrix=new THREE.Matrix4(),position=new THREE.Vector3(),scale=new THREE.Vector3();
 const span=840, halfSpan=span/2;

 // Helper to create an organic cloud billow:
 // Body sprite provides the tall cauliflower volume.
 // Belly sprite is concentrated along the underside rim, providing the glowing golden backlit fringe.
 function addBillow(root, px, py, pz, w, h){
  billows.push({root,x:px,y:py,z:pz,w,h,belly:false});
  billows.push({root,x:px,y:py-h*.22,z:pz+.3,w:w*.96,h:h*.62,belly:true});
 }

 // Tier 1: Lower Skyline Fluffy Cumulus (32 clusters, Alt 78m ~ 98m)
 // Frames the skyscraper spires with cohesive, delicate cauliflower cumulus mounds (overlap > 50%)
 const t1Cols=6, t1Rows=6;
 const t1CellW=span/t1Cols, t1CellH=span/t1Rows;
 let t1Idx=0;
 for(let r=0;r<t1Rows;r++){
  for(let c=0;c<t1Cols;c++){
   if(t1Idx>=32)break;
   const idx=t1Idx;
   const root=new THREE.Group();
   const s=0.92+((idx*7)%5)*0.09; // Scale 0.92 ~ 1.28
   const baseY=78+((idx*11)%7)*3.2; // 78m ~ 97m

   // Generously overlapping billows fuse into a single puffy cauliflower mound
   addBillow(root, 0, 0, 0, 52*s, 42*s);
   addBillow(root, -15*s, 3*s, -1.2*s, 40*s, 34*s);
   addBillow(root, 16*s, -2*s, 1.4*s, 42*s, 35*s);
   if(idx%2===0){
    addBillow(root, 2*s, 12*s, -0.6*s, 30*s, 26*s);
   }

   const jitterX=(((idx*23)%17)/16 - 0.5)*0.65;
   const jitterZ=(((idx*37)%19)/18 - 0.5)*0.65;
   const originX=-halfSpan + (c + 0.5 + jitterX)*t1CellW;
   const originZ=-halfSpan + (r + 0.5 + jitterZ)*t1CellH;
   const speedX=1.28 + ((idx*13)%9)*0.11;
   const speedZ=0.20 + ((idx*29)%7)*0.06;
   const phase=idx*1.37;

   root.position.set(originX, baseY, originZ);
   tier1Group.add(root);
   cloudList.push({root, tier:1, originX, originZ, baseY, speedX, speedZ, phase});
   t1Idx++;
  }
 }

 // Tier 2: Mid Sweeping Stratocumulus Banks (36 clusters, Alt 104m ~ 132m)
 // Expansive, continuous horizontal cloud banks (160 ~ 240m wide) with generous billow overlap
 const t2Cols=6, t2Rows=6;
 const t2CellW=span/t2Cols, t2CellH=span/t2Rows;
 for(let r=0;r<t2Rows;r++){
  for(let c=0;c<t2Cols;c++){
   const idx=r*t2Cols+c;
   const root=new THREE.Group();
   const s=1.15+((idx*11)%5)*0.12; // Scale 1.15 ~ 1.63
   const baseY=104+((idx*13)%9)*3.2; // 104m ~ 130m

   // Deeply overlapping billows merge into a sweeping, unified stratocumulus bank
   addBillow(root, 0, 0, 0, 85*s, 44*s);
   addBillow(root, -36*s, 3*s, -2.0*s, 72*s, 38*s);
   addBillow(root, 38*s, -2*s, 2.2*s, 76*s, 40*s);
   addBillow(root, -72*s, -2*s, 1.5*s, 58*s, 32*s);
   addBillow(root, 76*s, 2*s, -1.8*s, 62*s, 34*s);

   const jitterX=(((idx*19)%17)/16 - 0.5)*0.70;
   const jitterZ=(((idx*31)%19)/18 - 0.5)*0.70;
   const originX=-halfSpan + (c + 0.5 + jitterX)*t2CellW;
   const originZ=-halfSpan + (r + 0.5 + jitterZ)*t2CellH;
   const speedX=1.42 + ((idx*17)%11)*0.10;
   const speedZ=0.24 + ((idx*23)%7)*0.07;
   const phase=idx*1.53 + 2.1;

   root.position.set(originX, baseY, originZ);
   tier2Group.add(root);
   cloudList.push({root, tier:2, originX, originZ, baseY, speedX, speedZ, phase});
  }
 }

 // Tier 3: High Stratified Ripple Canopy ("火烧连云" 广袤大天幕, 48 clusters, Alt 138m ~ 176m)
 // Creates the grand undulating fiery celestial canopy (Reference 2 & 3)
 const t3Cols=8, t3Rows=6;
 const t3CellW=span/t3Cols, t3CellH=span/t3Rows;
 for(let r=0;r<t3Rows;r++){
  for(let c=0;c<t3Cols;c++){
   const idx=r*t3Cols+c;
   const root=new THREE.Group();
   const s=1.30+((idx*13)%7)*0.12; // Scale 1.30 ~ 2.02
   const baseY=138+((idx*19)%11)*3.5; // 138m ~ 173m

   // Broad sweeping ripple sheets that seamlessly overlap across the sky dome
   addBillow(root, 0, 0, 0, 110*s, 46*s);
   addBillow(root, -48*s, 2*s, -2.5*s, 92*s, 40*s);
   addBillow(root, 52*s, -2*s, 2.8*s, 96*s, 42*s);
   addBillow(root, -96*s, -3*s, 2.0*s, 78*s, 34*s);
   addBillow(root, 102*s, 2*s, -2.2*s, 82*s, 36*s);

   const jitterX=(((idx*13)%17)/16 - 0.5)*0.75;
   const jitterZ=(((idx*29)%19)/18 - 0.5)*0.75;
   const originX=-halfSpan + (c + 0.5 + jitterX)*t3CellW;
   const originZ=-halfSpan + (r + 0.5 + jitterZ)*t3CellH;
   const speedX=1.52 + ((idx*11)%9)*0.10;
   const speedZ=0.28 + ((idx*37)%7)*0.07;
   const phase=idx*1.71 + 4.2;

   root.position.set(originX, baseY, originZ);
   tier3Group.add(root);
   cloudList.push({root, tier:3, originX, originZ, baseY, speedX, speedZ, phase});
  }
 }

 // Six draw batches retain all billows and their camera-facing geometry.
 for(const group of [tier1Group,tier2Group,tier3Group])for(const belly of [false,true]){
  const items=billows.filter(b=>b.root.parent===group&&b.belly===belly);
  const source=belly?bellyMat:bodyMat;
  const mesh=new THREE.InstancedMesh(plane,source.clone(),items.length);
  mesh.name=group.name+(belly?'-belly':'-body');mesh.frustumCulled=false;
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);group.add(mesh);batches.push({group,mesh,items,source});
 }
 const coverage=[0,0,0];let initialized=false;
 // Continuous seamless cyclic drift with organic spatial convergence waves and sunlight transmission
 clouds.tick=(dt, elapsed, climate)=>{
  const isNight=Boolean(climate?.night);
  const isSunset=Boolean(climate?.isSunset);
  const dusk=(climate?.duskFactor ?? 0);
  const isDusk=isSunset || dusk>0.04;
  const weatherType=climate?.type ?? 'clear';
  const cloudAmount=climate?.cloud ?? 0.08;
  const rainAmount=climate?.rain ?? 0;
  const isFiery=Boolean(climate?.isFierySunset);
  const tier=climate?.fieryTier ?? (isSunset ? 0 : -1);

  // 1. 晴天（Clear）-> 万里无云（Cloudless Sky）
  // 用户明确要求：“调成晴天云也这么多，除非是多云或者下雨天气否则晴天云太多了。万里无云也是一个天气景观。”
  const isClearWeather = cloudAmount <= 0.15;

  if(isClearWeather){
   // 万里无云：白天蓝天纯净，夜晚月朗星稀，黄昏纯净蓝调
   tier1Group.visible=false;
   tier2Group.visible=false;
   tier3Group.visible=false;
  }else if(isNight && !isDusk){
   // 2. 夜晚少云/无云原则：“晚上尽量可以少些云，晚上没有云会好看点”
   // 除非夜晚下雨或大雾，夜晚不展现暗灰色云层，让皎洁明月与38颗璀璨星空毫无遮挡
   const isNightRain=(rainAmount>0.08) || (weatherType==='rain') || (weatherType==='fog');
   if(!isNightRain){
    tier1Group.visible=false;
    tier2Group.visible=false;
    tier3Group.visible=false;
   }else{
    tier1Group.visible=true;
    tier2Group.visible=true;
    tier3Group.visible=(cloudAmount>0.85);
   }
  }else if(isDusk){
   // 3. 黄昏晚霞 / 火烧云（多云天气或自动天气有云时展开）
   if(tier===0){
    // 大火烧云日：三层全开（好几层一大片壮丽火烧云）
    tier1Group.visible=true;
    tier2Group.visible=true;
    tier3Group.visible=true;
   }else if(tier===1){
    // 浪漫层叠晚霞：开启 Tier 1 与 Tier 2
    tier1Group.visible=true;
    tier2Group.visible=true;
    tier3Group.visible=false;
   }else{
    // 晴朗晚霞：仅保留低空 Tier 1 轻云，“云少欣赏天空”
    tier1Group.visible=true;
    tier2Group.visible=false;
    tier3Group.visible=false;
   }
  }else{
   // 4. 白天多云 / 阴雨天
   if(cloudAmount>0.75 || rainAmount>0.08){
    // 阴雨天：三层全开，厚重阴沉
    tier1Group.visible=true;
    tier2Group.visible=true;
    tier3Group.visible=true;
   }else if(cloudAmount>0.28){
    // 典型多云天气：开启 Tier 1 积云与 Tier 2 层积云带
    tier1Group.visible=true;
    tier2Group.visible=true;
    tier3Group.visible=false;
   }else{
    // 微云天气：仅开启 Tier 1
    tier1Group.visible=true;
    tier2Group.visible=false;
    tier3Group.visible=false;
   }
  }

  // Retain the gradual weather contract: type changes must not pop whole tiers.
  const fade=1-Math.exp(-Math.max(0,dt)/3);
  for(let i=0;i<3;i++){
   const group=[tier1Group,tier2Group,tier3Group][i],target=group.visible?1:0;
   coverage[i]=initialized?coverage[i]+(target-coverage[i])*fade:target;group.visible=coverage[i]>.001;
  }
  initialized=true;
  // Organic drift and spatial gathering dynamics
  for(let i=0;i<cloudList.length;i++){
   const c=cloudList[i];
   const rawX=(c.originX+elapsed*c.speedX+halfSpan)%span;
   const rawZ=(c.originZ+elapsed*c.speedZ+halfSpan)%span;
   const x=(rawX<0?rawX+span:rawX)-halfSpan;
   const z=(rawZ<0?rawZ+span:rawZ)-halfSpan;

   // Natural harmonic wave causing organic clustering into sweeping bands and dispersal
   const waveGather=Math.sin(x*0.0075+elapsed*0.055+c.phase)*Math.cos(z*0.0075+elapsed*0.045+c.phase*0.65);
   const dispX=waveGather*22;
   const dispZ=Math.sin(waveGather*2.2)*18;
   const dispY=Math.sin(elapsed*0.12+c.phase)*1.6;

   c.root.position.x=x+dispX;
   c.root.position.z=z+dispZ;
   c.root.position.y=c.baseY+dispY;
  }
  camera.updateWorldMatrix(true,false);
  for(const {group,mesh,items,source} of batches){
   if(!group.visible)continue;
   const amount=coverage[[tier1Group,tier2Group,tier3Group].indexOf(group)];
   mesh.material.color.copy(source.color);mesh.material.opacity=source.opacity*amount;
   // Sorting within each transparent batch avoids arbitrary instance overlap.
   items.sort((a,b)=>{
    const dist=q=>(q.root.position.x+q.x-camera.position.x)**2+(q.root.position.y+q.y-camera.position.y)**2+(q.root.position.z+q.z-camera.position.z)**2;
    return dist(b)-dist(a);
   });
   for(let i=0;i<items.length;i++){
    const b=items[i];position.set(b.root.position.x+b.x,b.root.position.y+b.y,b.root.position.z+b.z);
    scale.set(b.w,b.h,1);matrix.compose(position,camera.quaternion,scale);mesh.setMatrixAt(i,matrix);
   }
   mesh.instanceMatrix.needsUpdate=true;
  }
 };

 return {clouds,cloudMat:bodyMat,bellyMat,tier1Group,tier2Group,tier3Group};
}
