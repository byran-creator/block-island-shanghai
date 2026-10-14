import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {INNER_GARDEN,INNER_GARDEN_BOUNDARY,INNER_GARDEN_PATH,INNER_GARDEN_EAST_PATH,INNER_GATES,GARDEN_WINDOWS,GARDEN_PONDS,gardenPathContains,innerGardenContains} from './yuyuan-layout.js';

// The floor, ticket leaves and collision-aware moon gates belong to the
// district layout. This module supplies their local-coordinate finish.
export function createYuyuanClassicAssets(root,{cube,mat,board}){
 const group=new THREE.Group();group.name='yuyuan-classic-inner-garden';root.add(group);
 const fixtures=[],box=new THREE.BoxGeometry(1,1,1),leaf=new THREE.SphereGeometry(1,8,5),pole=new THREE.CylinderGeometry(1,1,1,7),up=new THREE.Vector3(0,1,0),direction=new THREE.Vector3();
 let seed=28679;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 function block(color,x,y,z,w,h,d){const mesh=cube(color,x,y,z,w,h,d);group.add(mesh);return mesh;}
 function addFixture(mesh){mesh.geometry.computeBoundingBox();mesh.updateMatrix();const b=mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrix);fixtures.push({x:(b.min.x+b.max.x)/2,z:(b.min.z+b.max.z)/2,rx:(b.max.x-b.min.x)/2,rz:(b.max.z-b.min.z)/2,y:b.min.y,h:b.max.y-b.min.y});}
 function beam(color,a,b,width=.05){direction.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const mesh=new THREE.Mesh(box,mat(color));mesh.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);mesh.scale.set(width,direction.length(),width);mesh.quaternion.setFromUnitVectors(up,direction.normalize());group.add(mesh);return mesh;}
 function crown(x,y,z,rx,ry,rz,color='#4c6d3e'){const mesh=new THREE.Mesh(leaf,mat(color));mesh.position.set(x,y,z);mesh.scale.set(rx,ry,rz);group.add(mesh);return mesh;}
 
 // Lightweight cached 64x64 stone texture (Codex low-computation standard)
 function stoneTexture(){
  if(typeof document==='undefined'||!document.createElement)return new THREE.Texture();
  const canvas=document.createElement('canvas');canvas.width=64;canvas.height=64;const ctx=canvas.getContext('2d');ctx.fillStyle='#adaf9e';ctx.fillRect(0,0,64,64);
  for(let i=0;i<80;i++){const gray=98+Math.floor(random()*85);ctx.fillStyle=`rgba(${gray},${gray+3},${gray-6},.27)`;ctx.fillRect(random()*64,random()*64,1+random()*6,1+random()*3);}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;return texture;
 }
 const stoneMap=stoneTexture(),rockMaterial=new THREE.MeshLambertMaterial({color:'#9b9d92',map:stoneMap,flatShading:true});
 const rock=new THREE.IcosahedronGeometry(1,0);

 // 1. Whitewashed Perimeter Garden Wall Coping and Circular Moon Openings
 // Uses continuous dark-grey pitched tile coping atop the voxel wall (low computation, 0 redundant wall slice meshes)
 function wall(axis,fixed,u1,u2,holes=[]){
  const normal=fixed+.5,len=u2-u1;
  if(axis==='z'){
   block('#414b43',(u1+u2)/2,31.45,normal,len,.18,1.2);
   block('#667064',(u1+u2)/2,31.58,normal,len,.12,.22);
  }else{
   block('#414b43',normal,31.45,(u1+u2)/2,1.2,.18,len);
   block('#667064',normal,31.58,(u1+u2)/2,.22,.12,len);
  }
  for(const hole of holes)for(const face of [-1,1]){
   const frame=new THREE.Mesh(new THREE.TorusGeometry(hole.r+.08,.08,4,24),mat('#646b61'));
   frame.position.set(axis==='z'?hole.u:normal+face*.59,hole.y,axis==='z'?normal+face*.59:hole.u);
   if(axis==='x')frame.rotation.y=Math.PI/2;
   group.add(frame);
  }
 }

 for(let i=0;i<INNER_GARDEN_BOUNDARY.length;i++){
  const a=INNER_GARDEN_BOUNDARY[i],b=INNER_GARDEN_BOUNDARY[(i+1)%INNER_GARDEN_BOUNDARY.length],axis=a[0]===b[0]?'x':'z',fixed=axis==='x'?a[0]:a[1],u1=Math.min(axis==='x'?a[1]:a[0],axis==='x'?b[1]:b[0]),u2=Math.max(axis==='x'?a[1]:a[0],axis==='x'?b[1]:b[0]);
  const holes=[];
  for(const g of INNER_GATES)if(g.axis===axis&&((axis==='z'&&Math.abs(fixed-g.z)<1)||(axis==='x'&&Math.abs(fixed-g.x)<1)))holes.push({u:axis==='z'?g.x:g.z,y:28.1,r:2.6});
  for(const w of GARDEN_WINDOWS)if(w.axis===axis&&((axis==='z'&&Math.abs(fixed-w.z)<1)||(axis==='x'&&Math.abs(fixed-w.x)<1)))holes.push({u:axis==='z'?w.x:w.z,y:w.y,r:w.r});
  wall(axis,fixed,u1,u2,holes);
 }

 // 2. Classical Curved Path Ribbons
 function pathRibbon(points){
  const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,26.018,z)),false,'centripetal'),pathVertices=[],uv=[],indices=[],samples=points.length*4,pathLength=curve.getLength();
  for(let i=0;i<=samples;i++){const t=i/samples,p=curve.getPoint(t),tangent=curve.getTangent(t),nx=-tangent.z,nz=tangent.x;
   for(const side of [-1,1]){pathVertices.push(p.x+nx*side*1.2,p.y,p.z+nz*side*1.2);uv.push(side===-1?0:1,t*pathLength/2.4);}
   if(i<samples){const n=i*2;indices.push(n,n+1,n+2,n+2,n+1,n+3);}
  }
  const pathGeometry=new THREE.BufferGeometry();pathGeometry.setAttribute('position',new THREE.Float32BufferAttribute(pathVertices,3));pathGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));pathGeometry.setIndex(indices);pathGeometry.computeVertexNormals();const pathMaterial=new THREE.MeshLambertMaterial({color:'#c0c0a9',map:stoneMap,side:THREE.DoubleSide});group.add(new THREE.Mesh(pathGeometry,pathMaterial));
 }
 pathRibbon(INNER_GARDEN_PATH);pathRibbon(INNER_GARDEN_EAST_PATH);

 // 3. Taihu & Huangshi Rockery Construction (大假山与太湖石叠石)
 function lakeRock(x,z,size=1,base=26){
  const parts=[[-.3,1,0,.6,1.4,.6],[.3,1.3,0,.5,1.2,.5],[0,2.1,0,.4,.8,.4]];
  for(const [dx,y,dz,rx,ry,rz]of parts){const mesh=new THREE.Mesh(rock,rockMaterial);mesh.position.set(x+dx*size,base+y*size,z+dz*size);mesh.scale.set(rx*size,ry*size,rz*size);mesh.rotation.set((random()-.5)*.16,(random()-.5)*.45,(random()-.5)*.19);group.add(mesh);addFixture(mesh);}
 }

 // The Iconic Grand Rockery (张南阳大假山叠石险峰): Rising up to 34m with caverns, moss and stair paths
 for(let rz=-6;rz<=6;rz+=4)for(let rx=-6;rx<=6;rx+=4){
  const dist=Math.hypot(rx,rz),scale=Math.max(.8,3.2-dist*.28);
  lakeRock(-94+rx,222+rz,scale,22+(3-dist*.3)*1.2);
  if(random()>.3)block('#2d4c2b',-94+rx+(random()-.5)*1.5,26+scale*2,-94+rx+(random()-.5)*1.5,.6,.12,.6);
 }
 // Mountain stone stair trail climbing to the peak
 for(let s=0;s<9;s++)block('#a2a092',-87.5-s*.65,26+s*.72,221+(s%3-.5)*.5,.9,.22,1.1);
 // Cavern grotto voids & archways
 block('#505048',-94,26.6,219.5,2.4,2.2,1.8);
 // Horizontal gnarled ancient black pines (横斜古黑松)
 beam('#503e30',[-94,30.5,219],[-90.8,31.3,214.8],.18);
 crown(-90.4,31.5,214.5,1.9,.48,1.8,'#223a26');
 beam('#503e30',[-94,31,225],[-97.2,31.9,228.6],.18);
 crown(-97.6,32.1,228.8,1.8,.48,1.7,'#223a26');
 // Summit Wangjiang Pavilion (大假山绝顶望江亭) perched at [-94, 224]
 for(const dx of [-1.3,1.3])for(const dz of [-1.3,1.3]){const post=block('#754b33',-94+dx,33.5,224+dz,.16,3.6,.16);addFixture(post);}
 const wjRoof=[];
 for(const side of [-1,1])for(let j=0;j<4;j++){const a=j/4,b=(j+1)/4,h=t=>36.8-1.2*t+.32*t**6,za=224+side*1.95*a,zb=224+side*1.95*b;
  wjRoof.push(-94-1.95,h(a),za,-94+1.95,h(a),za,-94-1.95,h(b),zb,-94-1.95,h(b),zb,-94+1.95,h(a),za,-94+1.95,h(b),zb);
 }
 const wjg=new THREE.BufferGeometry();wjg.setAttribute('position',new THREE.Float32BufferAttribute(wjRoof,3));wjg.computeVertexNormals();const wjm=mat('#38463c').clone();wjm.side=THREE.DoubleSide;group.add(new THREE.Mesh(wjg,wjm));
 for(const dx of [-1.95,1.95])for(const dz of [-1.95,1.95])block('#29342c',-94+dx,36.25,224+dz,.18,.28,.18);
 block('#88857a',-94,31.7,224,.7,.6,.7);
 block('#88857a',-94-.75,31.45,224,.4,.35,.4);block('#88857a',-94+.75,31.45,224,.4,.35,.4);

 // Other scenic Taihu rock groups throughout the garden
 lakeRock(-63.8,200.2,1.95,21.8);lakeRock(-67.6,199.7,.8,22.1);
 lakeRock(-47.4,201.3,1.12);lakeRock(-73.1,197,1.2);lakeRock(-63,195.5,.75);lakeRock(-32.7,205.6,.58);
 lakeRock(-8.1,202,1.4,21.8);lakeRock(-11.5,198.8,.65,22.1);lakeRock(-16.1,205.3,.55);
 lakeRock(-84,212,2.2,21.5);lakeRock(-86,228,2.4,21.5);
 lakeRock(-58,238,1.6,22.0);lakeRock(-48,246,1.4,22.0);lakeRock(-22,238,1.5,22.0);

 // 4. The Iconic Undulating Dragon Wall (穿云龙墙)
 const dragonPts=[[-86,216],[-78,217],[-70,219],[-62,218],[-54,216],[-46,215],[-38,217],[-30,218]];
 for(let i=1;i<dragonPts.length;i++){
  const p1=dragonPts[i-1],p2=dragonPts[i],len=Math.hypot(p2[0]-p1[0],p2[1]-p1[1]),steps=Math.ceil(len*1.5);
  for(let s=0;s<steps;s++){
   const t=(s+.5)/steps,xx=p1[0]+t*(p2[0]-p1[0]),zz=p1[1]+t*(p2[1]-p1[1]);
   const waveY=27.2+.9*Math.sin((i*steps+s)*.22),h=waveY-26+1.2;
   block('#e5e3d3',xx,26+h/2,zz,.42,h,.42);
   block('#3b4540',xx,waveY+1.25,zz,.54,.16,.54);
   block('#586660',xx,waveY+1.36,zz,.22,.12,.22);
   if(s%3===0){
    const bHeight=2.6+random()*1.2,stem=new THREE.Mesh(pole,mat('#5d783e'));
    stem.position.set(xx+.6,26+bHeight/2,zz+(random()-.5)*.4);stem.scale.set(.035,bHeight,.035);group.add(stem);
    crown(xx+.6,26+bHeight,zz,.35,.15,.35,'#4c6e39');
   }
  }
 }
 const dhX=-86,dhZ=216;
 // Authentic Ming-Qing sculpted dragon head (泥塑彩绘龙首 - dragon_wall.jpg)
 // 1. Dragon snout & upper jaw curving forward
 block('#34433b',dhX,29.8,dhZ+.35,.72,.42,.85);
 block('#26322b',dhX,30.08,dhZ+.7,.52,.26,.45);
 // Sharp white upper fangs & teeth
 block('#f5f2e9',dhX-.24,29.5,dhZ+.7,.08,.24,.08);
 block('#f5f2e9',dhX+.24,29.5,dhZ+.7,.08,.24,.08);
 for(let fx=-.16;fx<=.17;fx+=.08)block('#eae6dc',dhX+fx,29.55,dhZ+.74,.06,.14,.06);
 // 2. Open mouth cavity & red curving tongue
 block('#943329',dhX,29.52,dhZ+.42,.54,.14,.62);
 crown(dhX,29.53,dhZ+.75,.14,.04,.24,'#b6362b');
 // Lower jaw extending forward with teeth
 block('#34433b',dhX,29.34,dhZ+.46,.58,.22,.65);
 block('#f5f2e9',dhX-.2,29.48,dhZ+.72,.07,.18,.07);
 block('#f5f2e9',dhX+.2,29.48,dhZ+.72,.07,.18,.07);
 // 3. Bulging brow ridges and glowing golden eyes
 block('#26322b',dhX-.26,30.16,dhZ+.2,.24,.22,.35);
 block('#26322b',dhX+.26,30.16,dhZ+.2,.24,.22,.35);
 block('#dfab3d',dhX-.32,30.06,dhZ+.26,.12,.14,.14,true);
 block('#dfab3d',dhX+.32,30.06,dhZ+.26,.12,.14,.14,true);
 block('#1a1a1a',dhX-.34,30.06,dhZ+.28,.04,.1,.04);
 block('#1a1a1a',dhX+.34,30.06,dhZ+.28,.04,.1,.04);
 // 4. Branched majestic dragon horns (龙角)
 beam('#26322b',[dhX-.24,30.2,dhZ+.05],[dhX-.52,31.15,dhZ-.3],.11);
 beam('#26322b',[dhX-.52,31.15,dhZ-.3],[dhX-.68,31.6,dhZ-.18],.075);
 beam('#26322b',[dhX+.24,30.2,dhZ+.05],[dhX+.52,31.15,dhZ-.3],.11);
 beam('#26322b',[dhX+.52,31.15,dhZ-.3],[dhX+.68,31.6,dhZ-.18],.075);
 // 5. Long undulating dragon whiskers (龙须)
 beam('#3d4b43',[dhX-.32,29.85,dhZ+.52],[dhX-.72,29.65,dhZ+.18],.055);
 beam('#3d4b43',[dhX-.72,29.65,dhZ+.18],[dhX-.92,29.25,dhZ-.32],.042);
 beam('#3d4b43',[dhX+.32,29.85,dhZ+.52],[dhX+.72,29.65,dhZ+.18],.055);
 beam('#3d4b43',[dhX+.72,29.65,dhZ+.18],[dhX+.92,29.25,dhZ-.32],.042);
 // 6. Flaming Dragon Pearl (火珠 / 龙珠) held in front
 const pearl=new THREE.Mesh(new THREE.SphereGeometry(.28,12,10),mat('#e6ae3e',true));
 pearl.position.set(dhX,29.56,dhZ+1.18);group.add(pearl);
 crown(dhX,29.34,dhZ+1.18,.45,.08,.45,'#cb5134');
 crown(dhX,29.56,dhZ+1.38,.16,.26,.16,'#df7530');
 crown(dhX,29.78,dhZ+1.18,.14,.22,.14,'#e8b942');
 // Dragon wall purple & green bamboo clump (紫竹丛)
 for(let b=0;b<5;b++){
  const bz=dhZ-1.2-b*.55,bx=dhX+.55+(b%2)*.2,bh=3.2+random()*1.2;
  const bStem=new THREE.Mesh(pole,mat('#48364b'));bStem.position.set(bx,26+bh/2,bz);bStem.scale.set(.035,bh,.035);group.add(bStem);
  crown(bx,26+bh,bz,.38,.14,.38,'#4a6c38');
 }

 // 5. Song Dynasty Heritage Stone: Yu Ling Long Peak (玉玲珑名石 - yulinglong_rock.jpg)
 const ylX=-36,ylZ=248;
 // Authentic Han White Marble Sumeru Pedestal (雕花汉白玉须弥座)
 block('#dfdbd0',ylX,26.15,ylZ,2.6,.3,2.6);
 block('#eae7de',ylX,26.4,ylZ,2.1,.22,2.1);
 block('#f5f3ec',ylX,26.62,ylZ,2.4,.22,2.4);
 block('#ccc7bd',ylX,26.78,ylZ,2.2,.1,2.2);
 // Song Dynasty Huashigang Scholar Stone (皱、漏、瘦、透)
 // Reaching ~3.8m with hand-sculpted hollow lobes around open voids
 const ylLobes=[
  [-.3,27.3,-.15,.55,1.1,.52],[.28,27.4,.2,.52,1.2,.48],[0,27.8,0,.45,1.4,.45],
  [-.32,28.6,.22,.48,.95,.42],[.35,28.7,-.18,.44,1.05,.44],[-.12,29.2,-.25,.4,1.1,.38],[.22,29.4,.22,.38,1.05,.36],
  [0,30.1,.12,.34,.95,.32],[-.14,30.55,-.05,.28,.82,.26]
 ];
 for(const [lx,ly,lz,lrx,lry,lrz]of ylLobes){
  const mesh=new THREE.Mesh(rock,rockMaterial);mesh.position.set(ylX+lx,ly,ylZ+lz);mesh.scale.set(lrx,lry,lrz);
  mesh.rotation.set((random()-.5)*.25,(random()-.5)*.5,(random()-.5)*.25);group.add(mesh);addFixture(mesh);
 }
 // Companion Taihu stones (伴峰)
 lakeRock(ylX+1.85,ylZ-.45,.82,26);lakeRock(ylX-1.75,ylZ+.42,.74,26);
 // Classical Courtyard Screen Wall (照壁) behind Yu Ling Long
 block('#e8e5d8',ylX,27.6,ylZ+2.8,5.4,3.2,.32);
 block('#414b43',ylX,29.35,ylZ+2.8,5.7,.18,.52);
 block('#636d62',ylX,29.48,ylZ+2.8,.25,.12,5.7);
 fixtures.push({x:ylX,z:ylZ+2.8,rx:2.8,rz:.25,y:26,h:3.6});
 // Intimate Peony & Plum Courtyard Flora (牡丹、腊梅与翠竹)
 crown(ylX-1.8,26.35,ylZ-1.2,.55,.32,.55,'#8c2944');crown(ylX-1.8,26.55,ylZ-1.2,.26,.18,.26,'#df6482');
 crown(ylX+1.75,26.35,ylZ-1.1,.52,.32,.52,'#7a2866');crown(ylX+1.75,26.55,ylZ-1.1,.24,.18,.24,'#e085c8');
 // Ancient Dwarf Plum / Wintersweet (古腊梅) with golden buds
 const plumTrunk=new THREE.Mesh(pole,mat('#524032'));plumTrunk.position.set(ylX-2.1,27.2,ylZ+1.1);plumTrunk.scale.set(.12,2.4,.12);group.add(plumTrunk);
 crown(ylX-2.1,28.4,ylZ+1.1,.85,.6,.85,'#465a39');crown(ylX-2.1,28.7,ylZ+1.1,.42,.3,.42,'#e6bd3f');
 // Carved stone water basin (石洗 / 水盂)
 block('#9e9b8f',ylX+1.25,26.3,ylZ+1.2,.75,.55,.75);block('#355554',ylX+1.25,26.56,ylZ+1.2,.6,.04,.6);
 // Clump of emerald bamboo along the screen wall
 for(let b=0;b<6;b++){
  const bxx=ylX-2.2+b*.85,bzz=ylZ+2.45+(b%2)*.2,bh=3.2+random()*1.4;
  const bStem=new THREE.Mesh(pole,mat('#57793d'));bStem.position.set(bxx,26+bh/2,bzz);bStem.scale.set(.038,bh,.038);group.add(bStem);
  crown(bxx,26+bh,bzz,.38,.14,.38,'#486c36');
 }
 // Mondo grass carpet (麦冬地被)
 block('#3b5530',ylX,26.018,ylZ,5.8,.035,5.8);

 // 5b. Ancient Grand Stage at Dianchun Tang (江南第一古戏台 - garden_stage.jpg)
 const stgX=-16,stgZ=232;
 // Raised stage platform with wooden planks
 block('#5c4129',stgX,26.4,stgZ,6.6,.8,5.6);
 // Vermilion stage pillars
 for(const dx of [-2.9,2.9])for(const dz of [-2.4,2.4]){const post=block('#892d27',stgX+dx,28.6,stgZ+dz,.22,3.8,.22);addFixture(post);}
 // Red carved railings around the stage edges
 for(const side of [-1,1]){
  block('#892d27',stgX+side*2.9,27.15,stgZ,.08,.6,4.6);
  block('#892d27',stgX,27.15,stgZ+side*2.4,5.6,.6,.08);
 }
 // Spectacular gilded octagonal caisson ceiling (八角藻井)
 for(let ring=0;ring<4;ring++){
  const r=1.9-ring*.38,ry=30.4+ring*.26;
  for(let a=0;a<8;a++){
   const ang=a*Math.PI/4,next=(a+1)*Math.PI/4;
   beam('#c89c4d',[stgX+Math.cos(ang)*r,ry,stgZ+Math.sin(ang)*r],[stgX+Math.cos(next)*r,ry,stgZ+Math.sin(next)*r],.1,true);
   block('#943329',stgX+Math.cos(ang)*r,ry-.06,stgZ+Math.sin(ang)*r,.14,.12,.14);
  }
 }
 // Backstage carved timber screen partition
 block('#523925',stgX,28.4,stgZ+2.2,5.2,2.8,.14);
 // Stage gold calligraphy plaque ("天香云外")
 block('#211d1a',stgX,30.3,stgZ-2.38,2.4,.55,.08);
 block('#dfb642',stgX,30.3,stgZ-2.42,2.1,.38,.04,true);

 // 6. Classical Waterside Covered Corridors with Carved Leak-Windows (曲折水廊与漏窗)
 for(let x=-74;x<=-44;x+=4){
  const z=234;
  block('#ddd9c8',x,27.5,z,.3,3,2.8);
  block('#434e45',x,29.2,z,.5,.14,3.2);
  beam('#6e7367',[x-.16,27.2,z-.8],[x-.16,28.4,z+.8],.04);
  beam('#6e7367',[x-.16,27.2,z+.8],[x-.16,28.4,z-.8],.04);
  fixtures.push({x,z,rx:.2,rz:1.5,y:26,h:3.2});
 }

 // 7. Stratified Jiangnan Trees (江南名木群落配置)
 function pineTree(x,z,h=7){
  const trunk=new THREE.Mesh(pole,mat('#574533'));trunk.position.set(x,26+h/2,z);trunk.scale.set(.24,h,.24);group.add(trunk);addFixture(trunk);
  for(let j=0;j<3;j++){
   const angle=j*2.1,reach=1.6+j*.3;
   beam('#574533',[x,26+h*.5+j*1.1,z],[x+Math.cos(angle)*reach,26+h*.6+j*1.2,z+Math.sin(angle)*reach],.14);
   crown(x+Math.cos(angle)*reach,26+h*.65+j*1.2,z+Math.sin(angle)*reach,1.6,.45,1.5,'#2b482f');
  }
  crown(x,26+h+.5,z,1.8,.5,1.8,'#28422a');
 }

 function willowTree(x,z,h=6){
  const trunk=new THREE.Mesh(pole,mat('#62513c'));trunk.position.set(x,26+h/2,z);trunk.scale.set(.18,h,.18);group.add(trunk);addFixture(trunk);
  crown(x,26+h+.4,z,2.4,1.4,2.4,'#5c824c');
  for(let j=0;j<6;j++){
   const a=j*Math.PI/3,xx=x+Math.cos(a)*1.5,zz=z+Math.sin(a)*1.5;
   crown(xx,26+h-.6,zz,.22,1.2,.22,'#6b9456');
  }
 }

 const pines=[[-98,226],[-90,222],[-96,218],[-92,230],[-102,224],[-86,224],[-68,236],[-24,242],[-82,246],[-14,248],[-102,204],[-88,206],[-66,248],[-32,238],[-44,254],[-78,242],[-20,252],[-58,238]];
 for(const [px,pz]of pines)pineTree(px,pz,6+random()*2);

 const willows=[[-76,236],[-50,236],[-38,236],[-26,236],[-12,236],[-62,252],[-40,252],[-72,200],[-60,197],[-16,200],[-6,204],[-54,232],[-68,172],[-55,170],[-34,170],[-28,172],[-68,190],[-55,192],[-34,192],[-28,190],[-64,244],[-48,250]];
 for(const [wx,wz]of willows)willowTree(wx,wz,5.5+random()*1.5);

 const ginkgoX=-52,ginkgoZ=224,gH=9;
 const gTrunk=new THREE.Mesh(pole,mat('#5a4835'));gTrunk.position.set(ginkgoX,26+gH/2,ginkgoZ);gTrunk.scale.set(.35,gH,.35);group.add(gTrunk);addFixture(gTrunk);
 crown(ginkgoX,26+gH*.7,ginkgoZ,3.2,2.4,3.2,'#d6a738');
 crown(ginkgoX,26+gH+1,ginkgoZ,2.2,1.6,2.2,'#e5be49');

 // Jiangnan Vermilion Autumn Maples (江南红枫)
 function mapleTree(x,z,h=5){
  const trunk=new THREE.Mesh(pole,mat('#4d3a2b'));trunk.position.set(x,26+h/2,z);trunk.scale.set(.16,h,.16);group.add(trunk);addFixture(trunk);
  crown(x,26+h*.8,z,2.2,1.5,2.2,'#c0392b');
  crown(x+.3,26+h+.4,z-.3,1.8,1.2,1.8,'#d64535');
  crown(x-.3,26+h-.3,z+.3,1.6,1.0,1.6,'#962d22');
 }
 const maples=[[-36,248],[-54,220],[-88,212],[-18,226],[-64,236],[-44,248]];
 for(const [mx,mz]of maples)mapleTree(mx,mz,4.8+random()*1.2);

 // 7b. Dense Flowering Shrubs, Osmanthus & Peony Clusters (四季名花、杜鹃与桂花灌木丛)
 function flowerShrub(x,z,rx=1.1,ry=.7,rz=1.1,foliage='#3d6238',flower='#e85a7d'){
  crown(x,26+ry/2,z,rx,ry,rz,foliage);
  for(let b=0;b<5;b++){
   const a=b*1.25,bx=x+Math.cos(a)*rx*.65,bz=z+Math.sin(a)*rz*.65,by=26+ry*.7+random()*.25;
   crown(bx,by,bz,.18,.16,.18,flower);
  }
 }
 function bambooClump(x,z,count=7,h=3.6,stemColor='#5a7a3e'){
  for(let i=0;i<count;i++){
   const bx=x+(random()-.5)*1.2,bz=z+(random()-.5)*1.2,bh=h+random()*1.2;
   const bStem=new THREE.Mesh(pole,mat(stemColor));bStem.position.set(bx,26+bh/2,bz);bStem.scale.set(.038,bh,.038);group.add(bStem);
   crown(bx,26+bh,bz,.38,.16,.38,'#4a6c37');
  }
 }

 // Lush shrubbery surrounding core pavilions and courts (全园无死角绿化群落)
 const shrubList=[
  // Yu Ling Long & Yu Hua Tang peony/camellia court
  [-33,245,1.2,.8,1.2,'#365431','#df5678'],[-39,245,1.3,.85,1.3,'#2f4c2c','#b9324c'],
  [-34,251,1.1,.75,1.1,'#385a33','#e87da2'],[-40,250,1.4,.9,1.4,'#32522e','#ffffff'],
  [-30,248,1.2,.8,1.2,'#355630','#cb4a6e'],[-42,244,1.1,.75,1.1,'#2c4828','#df6989'],
  [-36,252,1.2,.8,1.2,'#365431','#e87d96'],[-42,252,1.3,.85,1.3,'#2f4c2c','#c83854'],
  [-28,244,1.1,.75,1.1,'#355630','#df5678'],[-26,248,1.2,.8,1.2,'#32522e','#ffffff'],
  // Grand Rockery & Wangjiang Pavilion mountain skirts
  [-100,220,1.5,.95,1.5,'#284227','#d4a23b'],[-88,220,1.4,.9,1.4,'#2e492d','#cb5134'],
  [-101,228,1.6,1.0,1.6,'#263f25','#e2b84a'],[-87,228,1.3,.85,1.3,'#2c462b','#d65a3d'],
  [-94,215,1.4,.85,1.4,'#294328','#e8c452'],[-94,233,1.5,.9,1.5,'#253e24','#cf4836'],
  [-102,216,1.4,.9,1.4,'#274026','#e0b240'],[-86,216,1.3,.85,1.3,'#2d482c','#cb4632'],
  [-102,234,1.5,.95,1.5,'#253e24','#df583a'],[-86,234,1.4,.9,1.4,'#2c462b','#e5bd4e'],
  [-98,224,1.3,.85,1.3,'#2b452a','#d24230'],[-90,224,1.3,.85,1.3,'#294328','#e2b544'],
  // Wan Hua Lou flowering courtyard
  [-50,222,1.3,.8,1.3,'#3a5e35','#e6739f'],[-58,222,1.2,.75,1.2,'#345430','#e8a342'],
  [-50,230,1.4,.85,1.4,'#375933','#df5374'],[-58,230,1.3,.8,1.3,'#31502c','#e29338'],
  [-46,226,1.2,.8,1.2,'#365431','#e56b8e'],[-62,226,1.3,.85,1.3,'#304f2b','#dfa03e'],
  [-48,220,1.1,.75,1.1,'#385a33','#e8789c'],[-60,220,1.2,.8,1.2,'#2d4929','#e6be48'],
  // Dian Chun Tang stage garden
  [-12,228,1.3,.85,1.3,'#355630','#df627e'],[-20,228,1.2,.8,1.2,'#2d4929','#e6be48'],
  [-12,236,1.4,.9,1.4,'#385b33','#c83955'],[-20,236,1.3,.85,1.3,'#304e2b','#e8c454'],
  [-8,232,1.2,.8,1.2,'#345430','#e86888'],[-24,232,1.3,.85,1.3,'#2c4828','#dfaa42'],
  [-10,240,1.3,.85,1.3,'#365732','#c6344e'],[-22,240,1.2,.8,1.2,'#2f4d2a','#e2ba46'],
  // Huijing Lou waterside court
  [-66,244,1.3,.85,1.3,'#355630','#df5270'],[-58,244,1.2,.8,1.2,'#2f4e2b','#e8b846'],
  [-66,252,1.4,.9,1.4,'#385a33','#cb3b56'],[-58,252,1.3,.85,1.3,'#31512c','#e5a33e'],
  [-70,248,1.2,.8,1.2,'#33532e','#e66f92'],[-54,248,1.3,.85,1.3,'#2d4a28','#dfbe4a'],
  // Central water corridors & bridges
  [-68,206,1.2,.75,1.2,'#3c6136','#e57898'],[-48,206,1.3,.8,1.3,'#355630','#df4c6a'],
  [-28,206,1.2,.75,1.2,'#385a33','#e6b544'],[-10,208,1.3,.8,1.3,'#33532e','#df5d79'],
  [-56,200,1.2,.75,1.2,'#375832','#e87294'],[-42,200,1.3,.8,1.3,'#31502c','#df4866'],
  [-24,200,1.2,.75,1.2,'#355530','#e4af40'],[-56,212,1.3,.85,1.3,'#365731','#cb3852'],
  [-42,212,1.2,.8,1.2,'#2e4d29','#e6be48'],[-24,212,1.3,.85,1.3,'#33522e','#df5b78'],
  // San Sui Tang entrance court
  [-90,198,1.4,.85,1.4,'#2f4d2a','#e8ba46'],[-98,198,1.3,.8,1.3,'#284224','#d64e38'],
  [-88,204,1.3,.8,1.3,'#304f2b','#e29f3c'],[-100,204,1.4,.85,1.4,'#274123','#cf442e'],
  // Inner walls & moon gates perimeter greenery
  [-72,196,1.3,.8,1.3,'#34552f','#df5d7a'],[-62,196,1.2,.75,1.2,'#2f4d2a','#e5b542'],
  [-48,196,1.3,.85,1.3,'#375832','#cb3f5a'],[-24,196,1.2,.8,1.2,'#32522e','#e8789a'],
  [-10,196,1.3,.85,1.3,'#2e4d29','#dfa83e'],[-72,208,1.3,.8,1.3,'#365731','#e66d90'],
  [-62,208,1.2,.75,1.2,'#30502c','#e2ba46'],[-48,208,1.3,.85,1.3,'#385a33','#c83650'],
  [-24,208,1.2,.8,1.2,'#33532e','#df5574'],[-10,208,1.3,.85,1.3,'#2d4c28','#e8b244']
 ];
 for(const [sx,sz,srx,sry,srz,fol,flw]of shrubList)flowerShrub(sx,sz,srx,sry,srz,fol,flw);

 // Dense emerald & purple bamboo groves along inner walls and courtyards (竹径通幽)
 const bambooGroves=[
  // Along North Dragon Wall
  [-74,196,8,3.8,'#52753a'],[-66,196,7,3.6,'#486634'],[-56,196,8,3.9,'#52753a'],
  [-44,196,7,3.5,'#46354b'],[-32,196,8,3.8,'#52753a'],[-20,196,8,3.7,'#52753a'],[-8,196,7,3.5,'#46354b'],
  // Along West Garden Wall
  [-103,200,8,3.8,'#46354b'],[-103,212,8,3.9,'#46354b'],[-103,226,9,4.1,'#52753a'],
  [-103,240,9,4.2,'#52753a'],[-103,252,8,3.8,'#46354b'],
  // Along South Garden Wall
  [-96,256,8,3.8,'#46354b'],[-80,256,9,4.0,'#52753a'],[-64,256,8,3.7,'#507238'],
  [-46,256,8,4.0,'#52753a'],[-28,256,9,3.9,'#46354b'],[-14,256,8,3.7,'#507238'],[-4,256,7,3.5,'#46354b'],
  // Along East Garden Wall
  [-4,202,7,3.6,'#507238'],[-4,214,8,3.7,'#486634'],[-4,228,8,3.8,'#52753a'],[-4,242,7,3.6,'#46354b'],
  // Along Partition Dragon Wall at z=208
  [-74,212,7,3.6,'#507238'],[-64,212,8,3.8,'#486634'],[-54,212,8,3.9,'#52753a'],
  [-38,212,7,3.5,'#46354b'],[-28,212,8,3.7,'#52753a'],[-18,212,7,3.6,'#52753a'],
  // Around Grand Rockery & Wangjiang Pavilion
  [-96,210,8,3.7,'#486634'],[-90,236,8,3.9,'#52753a'],[-78,218,7,3.5,'#46354b']
 ];
 for(const [bx,bz,bc,bh,col]of bambooGroves)bambooClump(bx,bz,bc,bh,col);

 // 8. Water lilies and blooming lotuses across ponds
 for(const pond of GARDEN_PONDS.slice(1)){
  const cx=(pond.x1+pond.x2)/2,cz=(pond.z1+pond.z2)/2,w=pond.x2-pond.x1,d=pond.z2-pond.z1;
  for(let i=0;i<8;i++){
   const lx=cx+(random()-.5)*(w-2.5),lz=cz+(random()-.5)*(d-2.5);
   const pad=new THREE.Mesh(new THREE.CylinderGeometry(.48,.48,.02,8),mat('#3b643a'));
   pad.position.set(lx,22.3,lz);group.add(pad);
   if(i%2===0){
    crown(lx,22.38,lz,.14,.1,.14,'#e87d96');
    crown(lx,22.42,lz,.06,.05,.06,'#f0d268');
   }
  }
 }

 // 9. Understory Mondo Grass and Courtyard Bonsai across expanded garden (满园青苔与吉祥草)
 for(let i=0;i<128;i++){
  const bx=-105+random()*106,bz=196+random()*60;
  if(!gardenPathContains(bx,bz,1.3)&&!GARDEN_PONDS.some(p=>bx>=p.x1&&bx<=p.x2&&bz>=p.z1&&bz<=p.z2)){
   block('#3d5932',bx,26.015,bz,1.8,.03,1.8);
   if(i%4===0){
    block('#8e8070',bx,26.25,bz,.55,.5,.55);
    crown(bx,26.7,bz,.32,.22,.32,'#2f482d');
   }
  }
 }

 // 10. Water-view pavilion & Inscription Rock
 const pavilionX=0,pavilionZ=210.5;
 for(const dx of [-1.25,1.25])for(const dz of [-1.25,1.25]){const post=block('#77503b',pavilionX+dx,28,pavilionZ+dz,.16,4,.16);addFixture(post);}
 for(const side of [-1,1]){beam('#745c3d',[pavilionX-1.25,30,pavilionZ+side*1.25],[pavilionX+1.25,30,pavilionZ+side*1.25],.11);const seat=block('#806344',pavilionX,26.45,pavilionZ+side*1.23,2,.15,.32);addFixture(seat);}
 const roofVertices=[];
 for(const side of [-1,1])for(let j=0;j<5;j++){const a=j/5,b=(j+1)/5,h=t=>31.2-1.2*t+.25*t**6,za=pavilionZ+side*1.95*a,zb=pavilionZ+side*1.95*b;
  roofVertices.push(pavilionX-1.95,h(a),za,pavilionX+1.95,h(a),za,pavilionX-1.95,h(b),zb,pavilionX-1.95,h(b),zb,pavilionX+1.95,h(a),za,pavilionX+1.95,h(b),zb);
 }
 const roofGeometry=new THREE.BufferGeometry();roofGeometry.setAttribute('position',new THREE.Float32BufferAttribute(roofVertices,3));roofGeometry.computeVertexNormals();const roofMaterial=mat('#3f4e43').clone();roofMaterial.side=THREE.DoubleSide;group.add(new THREE.Mesh(roofGeometry,roofMaterial));
 beam('#74634b',[pavilionX-2,31.22,pavilionZ],[pavilionX+2,31.22,pavilionZ],.1);

 const titleX=-79.8,titleZ=199.5,profile=[[-1.5,26.18],[-1.66,27.2],[-1.37,29.1],[-.6,30.7],[.34,30.92],[1.28,30.18],[1.55,28.75],[1.42,26.18]],titleVertices=[],titleIndices=[];
 for(const depth of [-1.3,1.15])for(const [z,y]of profile)titleVertices.push(titleX+depth,y,titleZ+z);
 for(let i=1;i<profile.length-1;i++)titleIndices.push(0,i+1,i,profile.length,profile.length+i,profile.length+i+1);
 for(let i=0;i<profile.length;i++){const next=(i+1)%profile.length;titleIndices.push(i,next,profile.length+i,profile.length+i,next,profile.length+next);}
 const titleGeometry=new THREE.BufferGeometry();titleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(titleVertices,3));const titleUvs=[];for(let i=0;i<titleVertices.length;i+=3)titleUvs.push((titleVertices[i+2]-titleZ+1.8)/3.6,(titleVertices[i+1]-26)/5);titleGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(titleUvs,2));titleGeometry.setIndex(titleIndices);titleGeometry.computeVertexNormals();const titleStone=new THREE.Mesh(titleGeometry,rockMaterial);group.add(titleStone);addFixture(titleStone);
 if(typeof document!=='undefined'&&document.createElement){
  const lettering=document.createElement('canvas');lettering.width=128;lettering.height=384;const ctx=lettering.getContext('2d');ctx.clearRect(0,0,128,384);ctx.fillStyle='#e4c36c';ctx.font='bold 58px KaiTi,STKaiti,"Microsoft YaHei",serif';ctx.textAlign='center';ctx.textBaseline='middle';
  [...'海上名园'].forEach((character,i)=>ctx.fillText(character,64,63+i*82));
  const titleTexture=new THREE.CanvasTexture(lettering);titleTexture.colorSpace=THREE.SRGBColorSpace;const titleText=new THREE.Mesh(new THREE.PlaneGeometry(1.45,3.75),new THREE.MeshBasicMaterial({map:titleTexture,transparent:true,alphaTest:.03,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));titleText.position.set(titleX-1.306,28.5,titleZ);titleText.rotation.y=-Math.PI/2;titleText.userData.panel=true;group.add(titleText);
 }

 batchMeshes(group,staticMeshes(group),'yuyuan-classic-finish');
 return {fixtures,dynamicRoots:new Set()};
}
