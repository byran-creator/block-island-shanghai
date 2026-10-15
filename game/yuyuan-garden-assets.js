import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {GARDEN_BEDS,gardenBedContains,WATER_CORRIDOR,JIUQU_BRIDGE,gardenPathContains,INNER_GATES,GARDEN_PONDS,pathContains} from './yuyuan-layout.js';

// Coordinates belong to the district, whose parent applies YUYUAN_SHIFT.
export function createYuyuanGardenAssets(root,{cube,mat,buildings}){
 const fixtures=[],night=new THREE.Group(),garden=new THREE.Group(),animatedGarden=new THREE.Group();
 night.name='yuyuan-eaves-and-window-light';night.visible=false;
 garden.name='yuyuan-corridor-and-planting';animatedGarden.name='yuyuan-animated-garden';
 root.add(garden,night,animatedGarden);
 const unitBox=new THREE.BoxGeometry(1,1,1),leafGeometry=new THREE.SphereGeometry(1,8,5),stemGeometry=new THREE.CylinderGeometry(1,1,1,6),discGeometry=new THREE.CylinderGeometry(1,1,0.1,12);
 const up=new THREE.Vector3(0,1,0),delta=new THREE.Vector3();
 function block(group,color,x,y,z,w,h,d,glow=false){const mesh=cube(color,x,y,z,w,h,d,glow);group.add(mesh);return mesh;}
 function beam(group,color,a,b,width=.045,glow=false){delta.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const mesh=new THREE.Mesh(unitBox,mat(color,glow));mesh.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);mesh.scale.set(width,delta.length(),width);mesh.quaternion.setFromUnitVectors(up,delta.normalize());group.add(mesh);return mesh;}
 function leaves(x,y,z,rx,ry,rz,color='#476947',parent=garden){const mesh=new THREE.Mesh(leafGeometry,mat(color));mesh.position.set(x,y,z);mesh.scale.set(rx,ry,rz);parent.add(mesh);return mesh;}
 function trunk(x,z,height=5,width=.24){const mesh=new THREE.Mesh(stemGeometry,mat('#705b3f'));mesh.position.set(x,26+height/2,z);mesh.scale.set(width,height,width);garden.add(mesh);fixtures.push({x,z,rx:width,rz:width,y:26,h:height});}

 // The lines follow the same five roof segments as the main roof geometry.
 for(const b of buildings){for(let level=1;level<=b.levels;level++){
  const scale=level===b.levels?.96:1.1,rx=(b.rx+1.2)*scale,rz=(b.rz+1.2)*scale,y=26+level*4,h=t=>y+2.3*(1-t)+.65*t**7;
  for(const side of [-1,1]){
   beam(night,'#ffc778',[b.x-rx-.08,h(1)+.04,b.z+side*rz],[b.x+rx+.08,h(1)+.04,b.z+side*rz],.11,true);
   for(const edge of [-1,1])for(let i=0;i<5;i++){const a=i/5,c=(i+1)/5;beam(night,'#e6a95b',[b.x+edge*rx,h(a)+.045,b.z+side*rz*a],[b.x+edge*rx,h(c)+.045,b.z+side*rz*c],.085,true);}
  }
  beam(night,'#ffe0a1',[b.x-rx,y+2.39,b.z],[b.x+rx,y+2.39,b.z],.09,true);
 }
 for(let level=1;level<b.levels;level++)for(const side of [-1,1])for(let x=b.x-b.rx+.7;x<b.x+b.rx-.3;x+=1.2){
  const y=27.5+level*4,z=b.z+side*(b.rz+.075)+(side>0?1:0);
  block(night,'#dca65e',x,y,z,.83,1.7,.018,true);
  for(const dx of [-.3,0,.3])block(garden,'#493b2b',x+dx,y,z+side*.02,.035,1.76,.025);
  for(const dy of [-.56,0,.56])block(garden,'#493b2b',x,y+dy,z+side*.02,.89,.04,.025);
 }
 }

 // Water corridor supported deck and carved balustrades
 const corridorX=WATER_CORRIDOR.x,z1=WATER_CORRIDOR.z1,z2=WATER_CORRIDOR.z2,edge=WATER_CORRIDOR.width/2-.12,roofHalf=WATER_CORRIDOR.width/2+.7;
 for(const x of [corridorX-edge,corridorX+edge])for(let z=z1+.5;z<z2;z+=5){
  if(pathContains(x,z,JIUQU_BRIDGE,1.65))continue;
  block(garden,'#813f32',x,28,z,.18,4,.18);fixtures.push({x,z,rx:.09,rz:.09,y:26,h:4});
  block(garden,'#897b67',x,26.15,z,.24,.3,.24);
 }
 const roofVertices=[];
 for(const side of [-1,1])for(let i=0;i<4;i++){
  const a=i/4,c=(i+1)/4,h=t=>31.35-1.1*t+.23*t**6,xa=corridorX+side*roofHalf*a,xc=corridorX+side*roofHalf*c;
  roofVertices.push(xa,h(a),z1,xa,h(a),z2,xc,h(c),z1,xc,h(c),z1,xa,h(a),z2,xc,h(c),z2);
 }
 const roof=new THREE.BufferGeometry();roof.setAttribute('position',new THREE.Float32BufferAttribute(roofVertices,3));roof.computeVertexNormals();const roofMat=mat('#36463d').clone();roofMat.side=THREE.DoubleSide;garden.add(new THREE.Mesh(roof,roofMat));
 for(const side of [-1,1]){
  block(garden,'#7e5b3c',corridorX+side*(roofHalf-.05),30.3,(z1+z2)/2,.12,.13,z2-z1);block(night,'#ffcc87',corridorX+side*roofHalf,30.49,(z1+z2)/2,.04,.04,z2-z1,true);
  const x=corridorX+side*edge;let railStart=null,railEnd=0;
  const closeRail=()=>{if(railStart!==null){fixtures.push({x,z:(railStart+railEnd)/2,rx:.038,rz:(railEnd-railStart)/2+.27,y:26,h:.825});railStart=null;}};
  for(let z=z1+.3;z<z2;z+=.6){if(pathContains(x,z,JIUQU_BRIDGE,1.7)){closeRail();continue;}
   block(garden,'#806346',x,26.79,z,.075,.07,.54);block(garden,'#806346',x,26.4,z,.06,.75,.06);if(railStart===null)railStart=z;railEnd=z;
  }
  closeRail();
 }
 for(let z=z1+3;z<z2;z+=5){
  beam(garden,'#775b3d',[corridorX-edge,30,z],[corridorX+edge,30,z],.13);
  block(garden,'#bf7751',corridorX,29.48,z,.34,.47,.34);block(night,'#ffc881',corridorX,29.48,z,.36,.43,.36,true);block(garden,'#715337',corridorX,29.17,z,.12,.16,.12);
 }

 // Plant beds coverage
 const clearPlanting=(x,z)=>!pathContains(x,z,JIUQU_BRIDGE,2)&&!gardenPathContains(x,z,2)&&!INNER_GATES.some(g=>Math.hypot(x-g.x,z-g.z)<3)&&!GARDEN_PONDS.some(p=>x>p.x1-2&&x<p.x2+2&&z>p.z1-2&&z<p.z2+2)&&!(x<-67&&Math.abs(z-160)<2.4)&&!buildings.some(b=>Math.abs(x-b.x)<b.rx+.65&&Math.abs(z-b.z)<b.rz+.65);
 let seed=57317;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(const bed of GARDEN_BEDS){
  const count=Math.ceil((bed.x2-bed.x1)*(bed.z2-bed.z1)*.38);
  for(let i=0;i<count;i++){const x=bed.x1+random()*(bed.x2-bed.x1),z=bed.z1+random()*(bed.z2-bed.z1);if(!gardenBedContains(x,z,bed)||!clearPlanting(x,z))continue;
   const variant=Math.floor(random()*3),height=.16+random()*.5;leaves(x,26+height*.7,z,.35+random()*.5,height,.35+random()*.5,variant?'#527a42':'#698f49');
   if(variant===0)for(let j=0;j<3;j++)leaves(x+(random()-.5)*.5,26+height*1.5,z+(random()-.5)*.5,.08,.1,.08,'#d7c6a1');
  }
 }
 const treePositions=[[-72,164],[-39.5,162],[-23,181],[-70,199],[-52,201],[-31.8,204],[-42.4,222.4]];
 for(const [index,[x,z]]of treePositions.entries()){
  if(!GARDEN_BEDS.some(b=>gardenBedContains(x,z,b))||!clearPlanting(x,z))continue;trunk(x,z,5.7,.22);
  leaves(x,32,z,2.8,2,2.6,index%2?'#4d7040':'#527a4c');leaves(x-.9,31.6,z+.9,2,1.6,1.9,'#416b43');
  if(index%2===1)continue;
  for(let i=0;i<8;i++){const angle=i*Math.PI/4,xx=x+Math.cos(angle)*1.85,zz=z+Math.sin(angle)*1.85;
   beam(garden,'#577d49',[xx,31.5,zz],[xx+.18*Math.cos(angle),28.65,zz+.18*Math.sin(angle)],.1);
   leaves(xx,30.2,zz,.26,1.15,.27,'#628348');
  }
 }
 for(const [x,z] of [[-71.5,164],[-39.8,159],[-20.5,184],[-71,197],[-47,222]]){
  if(!GARDEN_BEDS.some(b=>gardenBedContains(x,z,b))||!clearPlanting(x,z))continue;
  let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity,maxHeight=0;
  for(let i=0;i<9;i++){const xx=x+(random()-.5)*1.04,zz=z+(random()-.5)*1.1,height=3.2+random()*1.2;
   minX=Math.min(minX,xx-.045);maxX=Math.max(maxX,xx+.045);minZ=Math.min(minZ,zz-.045);maxZ=Math.max(maxZ,zz+.045);maxHeight=Math.max(maxHeight,height);
   const stem=new THREE.Mesh(stemGeometry,mat('#688345'));stem.position.set(xx,26+height/2,zz);stem.scale.set(.045,height,.045);garden.add(stem);
   for(let j=1;j<=3;j++){block(garden,'#99a765',xx,26+j*height/4,zz,.11,.06,.11);for(const sign of [-1,1])leaves(xx+sign*.38,26+j*height/4+.12,zz,.43,.09,.2,'#4e783f');}
  }
  fixtures.push({x:(minX+maxX)/2,z:(minZ+maxZ)/2,rx:(maxX-minX)/2,rz:(maxZ-minZ)/2,y:26,h:maxHeight});
 }

 // =========================================================================
 // 1. TAIHU LAKE-ROCK REVETMENTS & ROCKERIES (太湖石驳岸与峰峦叠石)
 // =========================================================================
 function lakeRock(x,z,size=1,baseY=26){
  for(const [dx,y,dz,rx,ry,rz]of [[-.65,.8,0,.42,.8,.58],[.65,.9,.1,.48,.9,.52],[0,1.75,0,.85,.3,.5],[-.25,2.35,.1,.4,.45,.37],[.36,.38,.05,.62,.34,.7]]){
   const mesh=new THREE.Mesh(leafGeometry,mat('#91968a'));mesh.position.set(x+dx*size,baseY+y*size,z+dz*size);mesh.scale.set(rx*size,ry*size,rz*size);mesh.rotation.z=dx*.2;garden.add(mesh);
   fixtures.push({x:x+dx*size,z:z+dz*size,rx:(rx+.12)*size,rz:rz*size,y:baseY+(y-ry-.1)*size,h:(ry*2+.2)*size});
  }
 }
 lakeRock(-39.5,158,.9);lakeRock(-71.5,196,1.25);lakeRock(-44.0,224.5,1.1);lakeRock(-68.5,217.5,1.0);

 // Meandering natural Taihu stone revetment blocks along waterlines (驳岸叠石)
 const revetmentBoulders=[
  // North Central Pond shoreline (z ~ 169.2)
  [-62.0,169.3,.9,.8],[-57.0,169.4,1.1,.9],[-45.5,169.3,.85,.8],[-36.5,169.4,1.0,.85],[-30.5,169.8,.9,.8],
  // East Central Pond shoreline (x ~ -29.6)
  [-29.6,174.5,.9,.85],[-29.6,181.0,1.0,.9],[-29.6,187.5,.9,.8],
  // West Central Pond shoreline (x ~ -63.4)
  [-63.4,175.0,1.0,.85],[-63.4,182.5,.9,.8],[-63.4,188.0,1.0,.9],
  // South Central Pond shoreline (z ~ 192.8)
  [-52.0,192.7,.9,.8],[-44.0,192.8,1.0,.85],[-38.0,192.7,.85,.8],
  // West Rockery Pool shoreline
  [-68.0,198.5,.85,.7],[-60.0,198.3,.9,.75],[-64.0,201.7,.8,.7],
  // East Inner Garden Pond shoreline
  [-13.0,198.8,.85,.75],[-9.0,198.5,.9,.8],[-3.5,199.0,.8,.7],[-3.5,206.0,.85,.75],[-11.0,206.5,.9,.8]
 ];
 for(const [bx,bz,bsx,bsz] of revetmentBoulders){
  const boulderMesh=new THREE.Mesh(leafGeometry,mat('#8b9084'));boulderMesh.position.set(bx,23.6,bz);boulderMesh.scale.set(bsx*1.1,.8,bsz*1.1);boulderMesh.rotation.y=(bx+bz)*1.7;garden.add(boulderMesh);
  const capMesh=new THREE.Mesh(leafGeometry,mat('#9fa498'));capMesh.position.set(bx+(bsx*.2),24.1,bz);capMesh.scale.set(bsx*.7,.6,bsz*.7);garden.add(capMesh);
 }

 // Waterside Granite Stepping Stones / Fishing Pier (亲水石阶与临水石埠头)
 const pierX=-42.0;
 for(let stepIdx=0;stepIdx<4;stepIdx++){
  const sy=25.4-stepIdx*0.88,sz=168.8+stepIdx*0.55;
  block(garden,'#b2b7a9',pierX,sy,sz,1.9,0.22,0.65);
 }
 block(garden,'#a4a99b',pierX,22.65,171.1,2.2,0.24,0.95); // low waterside landing slab

 // =========================================================================
 // 2. WATERSIDE WEEPING WILLOWS (垂柳依依与微风摇曳)
 // =========================================================================
 const swayingWillows=[];
 function weepingWillow(x,z,leanX,leanZ,scale=1.0){
  const rootY=26;
  fixtures.push({x,z,rx:.32*scale,rz:.32*scale,y:rootY,h:5.5*scale});
  // Gnarled curving trunk leaning toward water
  const t1=new THREE.Mesh(stemGeometry,mat('#574533'));t1.position.set(x+leanX*.18,rootY+1.6*scale,z+leanZ*.18);t1.scale.set(.24*scale,3.2*scale,.24*scale);t1.rotation.x=-leanZ*.18;t1.rotation.z=leanX*.18;garden.add(t1);
  const t2=new THREE.Mesh(stemGeometry,mat('#574533'));t2.position.set(x+leanX*.55,rootY+3.8*scale,z+leanZ*.55);t2.scale.set(.18*scale,2.6*scale,.18*scale);t2.rotation.x=-leanZ*.26;t2.rotation.z=leanX*.26;garden.add(t2);
  // Main crown foliage clusters
  leaves(x+leanX*.7,rootY+5.0*scale,z+leanZ*.7,2.2*scale,1.3*scale,2.0*scale,'#51793d');
  leaves(x+leanX*.4,rootY+5.4*scale,z+leanZ*.4,1.8*scale,1.2*scale,1.7*scale,'#5f8a44');
  leaves(x+leanX*1.1,rootY+4.4*scale,z+leanZ*1.1,1.7*scale,1.1*scale,1.6*scale,'#476f36');
  // Cascading weeping willow tendrils (垂落水面的柳丝)
  const tendrilGroup=new THREE.Group();tendrilGroup.position.set(x,0,z);animatedGarden.add(tendrilGroup);
  for(let i=0;i<14;i++){
   const angle=i*(Math.PI*2/14),dist=(1.2+((i%3)*.35))*scale;
   const tx=leanX*.6+Math.cos(angle)*dist,tz=leanZ*.6+Math.sin(angle)*dist;
   const upperY=rootY+4.2*scale,len=2.4+((i%4)*.5)*scale;
   const strand=new THREE.Mesh(stemGeometry,mat(i%2===0?'#6b9748':'#7caa52'));strand.position.set(tx,upperY-len/2,tz);strand.scale.set(.038,len,.038);tendrilGroup.add(strand);
   for(let k=0;k<3;k++){
    const leafY=upperY-len*(0.25+k*0.32);
    const leafMesh=new THREE.Mesh(leafGeometry,mat('#628d41'));leafMesh.position.set(tx+(Math.sin(k+i)*.08),leafY,tz+(Math.cos(k+i)*.08));leafMesh.scale.set(.12,.38,.12);tendrilGroup.add(leafMesh);
   }
  }
  swayingWillows.push({group:tendrilGroup,phase:x*1.3+z*.7});
 }
 weepingWillow(-48.5,168.3,0,1.8,1.15); // North pond willow leaning over water toward Moon Bridge
 weepingWillow(-32.5,169.8,-1.5,1.4,1.1); // Northeast pond willow framing Jiuqu Bridge
 weepingWillow(-29.6,185.0,-1.8,0,1.05); // East pond willow by Lubolang
 weepingWillow(-63.0,178.5,1.7,0,1.0); // West pond willow by Water Corridor
 weepingWillow(-58.5,197.8,-1.4,1.2,.95); // Inner Garden West Rockery Pool willow
 weepingWillow(-14.2,203.0,1.6,0,1.0); // Inner Garden East Pond willow
 weepingWillow(-48.0,222.0,0,-1.5,1.05); // South garden lawn willow

 // =========================================================================
 // 3. SCHOLAR PINES & ANCIENT TWISTED PINES (苍劲盘松与罗汉松)
 // =========================================================================
 function scholarPine(x,z,scale=1.0,rotY=0){
  const rootY=26;
  fixtures.push({x,z,rx:.3*scale,rz:.3*scale,y:rootY,h:5.8*scale});
  // Twisted muscular trunk
  const trunkGroup=new THREE.Group();trunkGroup.position.set(x,rootY,z);trunkGroup.rotation.y=rotY;garden.add(trunkGroup);
  const p1=new THREE.Mesh(stemGeometry,mat('#423326'));p1.position.set(0,1.4*scale,0);p1.scale.set(.28*scale,2.8*scale,.28*scale);p1.rotation.z=.15;trunkGroup.add(p1);
  const p2=new THREE.Mesh(stemGeometry,mat('#423326'));p2.position.set(.35*scale,3.4*scale,0);p2.scale.set(.21*scale,2.4*scale,.21*scale);p2.rotation.z=-.32;trunkGroup.add(p2);
  const p3=new THREE.Mesh(stemGeometry,mat('#423326'));p3.position.set(-.1*scale,4.8*scale,.2*scale);p3.scale.set(.15*scale,1.8*scale,.15*scale);p3.rotation.x=.25;trunkGroup.add(p3);
  // Tiered horizontal cloud pads (云片状松盘)
  const pads=[
   [.7*scale,3.2*scale,-.2*scale,1.6*scale,.38*scale,1.4*scale,'#28422e'],
   [-.8*scale,4.2*scale,.3*scale,1.8*scale,.4*scale,1.5*scale,'#325239'],
   [.1*scale,5.6*scale,-.1*scale,2.1*scale,.45*scale,1.8*scale,'#203826'],
   [-.3*scale,5.1*scale,-.7*scale,1.3*scale,.35*scale,1.1*scale,'#2a4631']
  ];
  for(const [px,py,pz,sx,sy,sz,col] of pads){
   const cloud=new THREE.Mesh(discGeometry,mat(col));cloud.position.set(px,py,pz);cloud.scale.set(sx,sy*8,sz);trunkGroup.add(cloud);
   const cloud2=new THREE.Mesh(discGeometry,mat('#3c6144'));cloud2.position.set(px,py+sy*.3,pz);cloud2.scale.set(sx*.75,sy*5,sz*.75);trunkGroup.add(cloud2);
  }
 }
 scholarPine(-71.5,196.5,1.2,0.4); // Great Rockery peak ancient pine
 scholarPine(-39.5,161.0,1.05,-0.6); // North rockery pine
 scholarPine(-68.5,218.0,1.0,1.2); // Wanhualou courtyard scholar pine
 scholarPine(-44.0,224.5,1.1,0.8); // South scenic garden pine

 // =========================================================================
 // 4. CLASSICAL SINGLE-ARCH STONE MOON BRIDGE (江南单孔石拱桥/半月桥)
 // =========================================================================
 function moonBridge(cx,cz,{length=7.4,width=2.2,archH=2.3,dir='x'}){
  const steps=14,waterY=22.3,bridgeDeckY=waterY+archH+0.32;
  const isX=dir==='x';
  // Arched opening voussoir blocks and stone parapet deck
  for(let i=0;i<=steps;i++){
   const t=(i/steps)*2-1; // -1 to 1
   const archUnder=waterY+Math.max(0,archH*Math.sqrt(Math.max(0,1-t*t*.95)));
   const deckTop=archUnder+0.38+0.12*(1-t*t);
   const posOffset=(t*length)/2;
   const bx=isX?cx+posOffset:cx,bz=isX?cz:cz+posOffset;
   const bw=isX?length/steps+.06:width,bd=isX?width:length/steps+.06;
   // Arch voussoir slab
   block(garden,'#9ea396',bx,(archUnder+deckTop)/2,bz,bw,deckTop-archUnder+.08,bd);
   // Stepped walking tread (踏步石阶)
   block(garden,'#b2b7aa',bx,deckTop+.02,bz,bw*.92,.08,bd*.9);
   // Side balustrades and carved lotus finials (望柱与莲花柱头)
   if(i%2===0){
    for(const side of [-1,1]){
     const px=isX?bx:bx+side*(width/2-.08),pz=isX?bz+side*(width/2-.08):bz;
     block(garden,'#8c9184',px,deckTop+.42,pz,.14,.76,.14); // balustrade post
     const finial=new THREE.Mesh(leafGeometry,mat('#c2c7ba'));finial.position.set(px,deckTop+.86,pz);finial.scale.set(.09,.15,.09);garden.add(finial);
    }
   }else{
    for(const side of [-1,1]){
     const px=isX?bx:bx+side*(width/2-.08),pz=isX?bz+side*(width/2-.08):bz;
     block(garden,'#9da295',px,deckTop+.32,pz,bw,.46,.08); // carved stone panel
    }
   }
  }
  // Keystone / water dragon carving at apex (龙门石/吸水兽)
  block(garden,'#b8beb1',cx,bridgeDeckY+.42,cz,.35,.35,.35);
  // Bridge abutment foundations into water
  for(const side of [-1,1]){
   const ax=isX?cx+side*(length/2):cx,az=isX?cz:cz+side*(length/2);
   block(garden,'#82877b',ax,22.8,az,isX?1.2:width,1.2,isX?width:1.2);
  }
 }
 // Central Pond Moon Bridge: framing Huxinting from North arrival plaza
 moonBridge(-51.0,171.5,{length:7.4,width:2.2,archH:2.3,dir:'x'});
 // East Inner Garden Pond Moon Bridge: arched over water lilies and koi
 moonBridge(-8.0,202.5,{length:6.8,width:2.1,archH:2.1,dir:'z'});

 // =========================================================================
 // 5. LUSH LOTUS & WATER LILY DISPLAYS (荷塘翠盖、红莲睡莲与莲蓬)
 // =========================================================================
 function lotusDisplay(cx,cz,count=7){
  const waterY=22.3;
  for(let i=0;i<count;i++){
   const angle=i*1.85,dist=0.4+((i%3)*0.55);
   const lx=cx+Math.cos(angle)*dist,lz=cz+Math.sin(angle)*dist;
   // Floating water lily pad with notch
   const pad=new THREE.Mesh(discGeometry,mat(i%2===0?'#48743f':'#58874a'));pad.position.set(lx,waterY+0.04,lz);pad.scale.set(.45+((i%3)*.15),.18,.45+((i%3)*.15));garden.add(pad);
   // Stalked umbrella lotus leaf rising above water
   if(i%2===1){
    const stalkH=0.35+((i%3)*.2);
    const stalk=new THREE.Mesh(stemGeometry,mat('#527a42'));stalk.position.set(lx+.15,waterY+stalkH/2,lz+.15);stalk.scale.set(.022,stalkH,.022);garden.add(stalk);
    const leafTop=new THREE.Mesh(discGeometry,mat('#4d7a42'));leafTop.position.set(lx+.15,waterY+stalkH,lz+.15);leafTop.scale.set(.38,.2,.38);leafTop.rotation.x=.15;garden.add(leafTop);
   }
   // Blooming lotus blossoms in tiered soft pink and ivory
   if(i%3===0){
    const flowerY=waterY+0.12+((i%2)*.2);
    for(let p=0;p<6;p++){
     const pAngle=p*(Math.PI*2/6);
     const petal=new THREE.Mesh(leafGeometry,mat(p%2===0?'#f5b8c6':'#fff0f5'));petal.position.set(lx+Math.cos(pAngle)*.12,flowerY,lz+Math.sin(pAngle)*.12);petal.scale.set(.09,.14,.09);petal.rotation.z=.35;garden.add(petal);
    }
    // Golden stamen center (花蕊与莲蓬)
    const stamen=new THREE.Mesh(discGeometry,mat('#f5c842'));stamen.position.set(lx,flowerY+.08,lz);stamen.scale.set(.08,.4,.08);garden.add(stamen);
   }
  }
 }
 lotusDisplay(-56.0,175.0,9);lotusDisplay(-47.0,173.5,8);lotusDisplay(-35.0,173.0,9);lotusDisplay(-37.5,189.0,8);lotusDisplay(-57.0,191.0,7);
 lotusDisplay(-64.5,200.0,7);lotusDisplay(-11.0,201.5,8);lotusDisplay(-5.5,204.0,8);

 // =========================================================================
 // 6. LIVELY GARDEN WILDLIFE (仙鹤白鹭戏水、飞燕穿柳)
 // =========================================================================
 const animatedEgrets=[],animatedSwallows=[];
 function whiteEgret(x,y,z,rotY=0){
  const rootObj=new THREE.Group();rootObj.position.set(x,y,z);rootObj.rotation.y=rotY;animatedGarden.add(rootObj);
  // Slender charcoal legs and feet
  for(const side of [-.09,.09]){
   const leg=new THREE.Mesh(stemGeometry,mat('#222222'));leg.position.set(side,.32,0);leg.scale.set(.022,.65,.022);rootObj.add(leg);
   block(rootObj,'#222222',side,.02,.05,.1,.03,.16); // splayed toes
  }
  // Sculpted snow-white body
  const body=new THREE.Mesh(leafGeometry,mat('#f8fafc'));body.position.set(0,.78,-.08);body.scale.set(.24,.28,.44);body.rotation.x=.28;rootObj.add(body);
  // Folded slate-tipped primary wings
  for(const side of [-1,1]){
   const wing=new THREE.Mesh(leafGeometry,mat('#f1f5f9'));wing.position.set(side*.2,.82,-.06);wing.scale.set(.06,.22,.42);wing.rotation.x=.22;rootObj.add(wing);
   const tip=new THREE.Mesh(leafGeometry,mat('#334155'));tip.position.set(side*.18,.76,-.32);tip.scale.set(.04,.14,.22);rootObj.add(tip);
  }
  // S-curved neck and head
  const neckGroup=new THREE.Group();neckGroup.position.set(0,.92,.18);rootObj.add(neckGroup);
  const n1=new THREE.Mesh(stemGeometry,mat('#f8fafc'));n1.position.set(0,.22,.08);n1.scale.set(.05,.45,.05);n1.rotation.x=-.35;neckGroup.add(n1);
  const n2=new THREE.Mesh(stemGeometry,mat('#f8fafc'));n2.position.set(0,.55,.02);n2.scale.set(.045,.38,.045);n2.rotation.x=.38;neckGroup.add(n2);
  const head=new THREE.Mesh(leafGeometry,mat('#f8fafc'));head.position.set(0,.76,.12);head.scale.set(.08,.1,.14);neckGroup.add(head);
  // Slender amber-yellow beak (黄嘴啄玉)
  const beak=new THREE.Mesh(stemGeometry,mat('#d97706'));beak.position.set(0,.75,.32);beak.scale.set(.02,.35,.02);beak.rotation.x=Math.PI/2;neckGroup.add(beak);
  // Black eye dots & white nape crest plume
  block(neckGroup,'#111111',-.07,.77,.14,.02,.02,.02);block(neckGroup,'#111111',.07,.77,.14,.02,.02,.02);
  const crest=new THREE.Mesh(leafGeometry,mat('#f8fafc'));crest.position.set(0,.82,-.04);crest.scale.set(.02,.06,.2);crest.rotation.x=-.4;neckGroup.add(crest);
  animatedEgrets.push({root:rootObj,neck:neckGroup,baseY:y,phase:x*1.9+z*.8});
 }
 whiteEgret(-49.5,23.2,170.8,0.6); // Standing on rock by Moon Bridge inspecting koi
 whiteEgret(-33.2,23.5,172.5,-1.2); // Lakeside revetment under Weeping Willow
 whiteEgret(-61.8,23.0,199.2,1.0); // West Rockery Pool edge

 function swallow(type,cx,cy,cz,radius=5.0,speed=2.5){
  const rootObj=new THREE.Group();animatedGarden.add(rootObj);
  // Glossy blue-black swallow body & ivory breast
  const body=new THREE.Mesh(leafGeometry,mat('#0f172a'));body.position.set(0,0,0);body.scale.set(.08,.08,.22);rootObj.add(body);
  const breast=new THREE.Mesh(leafGeometry,mat('#f8fafc'));breast.position.set(0,-.03,.02);breast.scale.set(.075,.06,.15);rootObj.add(breast);
  block(rootObj,'#991b1b',0,-.01,.09,.05,.04,.04); // rust throat patch
  // Scissor tail (剪刀尾)
  for(const side of [-1,1]){
   const tail=new THREE.Mesh(leafGeometry,mat('#0f172a'));tail.position.set(side*.04,-.01,-.24);tail.scale.set(.025,.015,.22);tail.rotation.y=side*.18;rootObj.add(tail);
  }
  // Animated flapping wings
  const wings=[];
  for(const side of [-1,1]){
   const wing=new THREE.Mesh(leafGeometry,mat('#1e293b'));wing.position.set(side*.18,.02,0);wing.scale.set(.24,.018,.12);rootObj.add(wing);
   wings.push(wing);
  }
  if(type==='perched'){
   rootObj.position.set(cx,cy,cz);
  }else{
   animatedSwallows.push({root:rootObj,wings,cx,cy,cz,radius,speed,phase:cx+cz});
  }
 }
 swallow('perched',-44.5,30.2,176.5); // perched on Huxinting roof eave
 swallow('perched',-59.2,30.8,181.5); // perched on Water Corridor roof eave
 swallow('flying',-47.0,26.5,174.0,5.5,2.4); // circling North Pond above lotus and moon bridge
 swallow('flying',-8.0,26.0,202.5,4.5,2.2); // circling Inner Garden Pond

 // White perimeter lattice walls & pavilion
 for(const z of [179,183,187]){
  const x=-18.8;block(garden,'#ddd9c8',x,26.65,z,.3,1.3,3.6);block(garden,'#ddd9c8',x,29.05,z,.3,.6,3.6);
  for(const zz of [z-1.6,z+1.6]){block(garden,'#ddd9c8',x,27.9,zz,.3,1.8,.45);fixtures.push({x,z:zz,rx:.15,rz:.225,y:26,h:3.35});}
  fixtures.push({x,z,rx:.15,rz:1.8,y:26,h:1.3},{x,z,rx:.15,rz:1.8,y:28.75,h:.6});
  for(let j=-1.2;j<=1.21;j+=.4){beam(garden,'#706e5c',[x-.17,27.5,z+j-.23],[x-.17,28.5,z+j+.23],.045);beam(garden,'#706e5c',[x-.17,27.5,z+j+.23],[x-.17,28.5,z+j-.23],.045);}
  block(garden,'#424c43',x,29.42,z,.65,.18,3.9);
  fixtures.push({x,z,rx:.19,rz:1.55,y:27.45,h:1.1});
 }
 const pavilionX=-21,pavilionZ=224.5;
 for(const dx of [-1.5,1.5])for(const dz of [-1.5,1.5]){block(garden,'#81513b',pavilionX+dx,27.7,pavilionZ+dz,.14,3.4,.14);fixtures.push({x:pavilionX+dx,z:pavilionZ+dz,rx:.07,rz:.07,y:26,h:3.4});}
 const pavilionRoof=[];
 for(const side of [-1,1])for(let j=0;j<4;j++){const a=j/4,b=(j+1)/4,h=t=>31.2-1.3*t+.3*t**6,za=pavilionZ+side*2.1*a,zb=pavilionZ+side*2.1*b;
  pavilionRoof.push(pavilionX-2.1,h(a),za,pavilionX+2.1,h(a),za,pavilionX-2.1,h(b),zb,pavilionX-2.1,h(b),zb,pavilionX+2.1,h(a),za,pavilionX+2.1,h(b),zb);
 }
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pavilionRoof,3));pg.computeVertexNormals();garden.add(new THREE.Mesh(pg,roofMat));
 for(const side of [-1,1]){block(night,'#ffcc87',pavilionX,30.24,pavilionZ+side*2.1,4.3,.06,.06,true);block(garden,'#76543a',pavilionX,26.42,pavilionZ+side*1.42,2.7,.14,.38);fixtures.push({x:pavilionX,z:pavilionZ+side*1.42,rx:1.35,rz:.19,y:26.35,h:.14});}

 // Low lotus islands
 for(const [x,z] of [[-56,190],[-45,189],[-32,174],[-32,188]]){
  if(pathContains(x,z,JIUQU_BRIDGE,2)||Math.abs(x-corridorX)<3)continue;
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(.86,.92,.18,14),mat('#9ca28a'));rim.position.set(x,22.38,z);garden.add(rim);
  for(let i=0;i<5;i++){const angle=i*2.4,xx=x+Math.cos(angle)*.48,zz=z+Math.sin(angle)*.48;leaves(xx,22.52,zz,.29,.035,.26,'#668952');
   if(i%2===0){const flower=new THREE.Mesh(leafGeometry,mat('#d9b4aa'));flower.position.set(xx,22.63,zz);flower.scale.set(.1,.13,.1);garden.add(flower);}
  }
 }

 // Two compact fountains: 96 reused instance transforms
 const fountains=[[-37,172],[-56.5,188]],drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.038,5,4),mat('#d2e5df',true),96);
 drops.name='yuyuan-fountain-droplets';drops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);drops.frustumCulled=false;root.add(drops);
 const transform=new THREE.Matrix4(),position=new THREE.Vector3(),rotation=new THREE.Quaternion(),scale=new THREE.Vector3(.8,1.6,.8);let elapsed=0;
 function animate(){for(let f=0;f<2;f++)for(let i=0;i<48;i++){
  const jet=i%8,phase=((Math.floor(i/8)/6+elapsed*.62)%1),angle=jet*Math.PI/4,reach=1.45*phase;
  position.set(fountains[f][0]+Math.cos(angle)*reach,22.3+2.7*4*phase*(1-phase),fountains[f][1]+Math.sin(angle)*reach);
  transform.compose(position,rotation,scale);drops.setMatrixAt(f*48+i,transform);
 }drops.instanceMatrix.needsUpdate=true;}
 animate();

 function animateGarden(dt){
  // Swaying weeping willows in gentle garden breeze
  for(const w of swayingWillows){
   const sway=Math.sin(elapsed*1.4+w.phase)*0.07;
   w.group.rotation.z=sway;w.group.rotation.x=Math.cos(elapsed*1.1+w.phase)*0.05;
  }
  // Graceful white egrets dipping and breathing
  for(const eg of animatedEgrets){
   const dip=Math.sin(elapsed*1.2+eg.phase);
   eg.root.position.y=eg.baseY+Math.max(0,dip)*0.025;
   eg.neck.rotation.x=(Math.sin(elapsed*0.8+eg.phase)>0.4)?0.28*Math.sin(elapsed*2.5):0.0;
   eg.neck.rotation.y=Math.sin(elapsed*0.6+eg.phase)*0.22;
  }
  // Circling and wing flapping swallows
  for(const sw of animatedSwallows){
   const t=elapsed*(sw.speed/sw.radius)+sw.phase;
   sw.root.position.set(sw.cx+Math.cos(t)*sw.radius,sw.cy+Math.sin(t*2)*0.4,sw.cz+Math.sin(t)*sw.radius);
   sw.root.rotation.y=-t+Math.PI/2;
   const flap=Math.sin(elapsed*22)*0.45;
   if(sw.wings[0])sw.wings[0].rotation.z=flap;
   if(sw.wings[1])sw.wings[1].rotation.z=-flap;
  }
 }

 batchMeshes(garden,staticMeshes(garden),'yuyuan-garden-detail');batchMeshes(night,staticMeshes(night),'yuyuan-night-trim');
 return {fixtures,dynamicRoots:new Set([night,drops]),tick(dt,{night:lit=false}={}){elapsed+=dt;night.visible=lit;animate();animateGarden(dt);}};
}
