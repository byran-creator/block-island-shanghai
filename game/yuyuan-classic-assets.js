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
 block('#353d38',dhX,29.8,dhZ,.7,.6,.9);
 block('#c89c4d',dhX,29.9,dhZ+.4,.45,.45,.45,true);
 crown(dhX,30.3,dhZ-.2,.3,.5,.3,'#414b45');

 // 5. Song Dynasty Heritage Stone: Yu Ling Long Peak (玉玲珑名石)
 const ylX=-36,ylZ=248;
 block('#eceae0',ylX,26.3,ylZ,2.2,.6,2.2);
 block('#dcd8cc',ylX,26.7,ylZ,1.8,.2,1.8);
 for(let h=0;h<4;h++){
  const rScale=1.1-h*.12;
  lakeRock(ylX+(h%2-.5)*.25,ylZ+(h%3-1)*.2,rScale,27+h*1.2);
 }
 block('#48683c',ylX,26.02,ylZ,6,.04,6);
 for(let angle=0;angle<Math.PI*2;angle+=Math.PI/2){
  const fx=ylX+Math.cos(angle)*2.4,fz=ylZ+Math.sin(angle)*2.4;
  crown(fx,26.3,fz,.42,.28,.42,'#8c3c4e');
  crown(fx,26.45,fz,.15,.12,.15,'#e27b92');
 }

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

 const pines=[[-98,226],[-90,222],[-96,218],[-68,236],[-24,242],[-82,246],[-14,248]];
 for(const [px,pz]of pines)pineTree(px,pz,6+random()*2);

 const willows=[[-76,236],[-50,236],[-38,236],[-26,236],[-12,236],[-62,252],[-40,252]];
 for(const [wx,wz]of willows)willowTree(wx,wz,5.5+random()*1.5);

 const ginkgoX=-52,ginkgoZ=224,gH=9;
 const gTrunk=new THREE.Mesh(pole,mat('#5a4835'));gTrunk.position.set(ginkgoX,26+gH/2,ginkgoZ);gTrunk.scale.set(.35,gH,.35);group.add(gTrunk);addFixture(gTrunk);
 crown(ginkgoX,26+gH*.7,ginkgoZ,3.2,2.4,3.2,'#d6a738');
 crown(ginkgoX,26+gH+1,ginkgoZ,2.2,1.6,2.2,'#e5be49');

 // 8. Water lilies and blooming lotuses across ponds
 for(const pond of GARDEN_PONDS.slice(1)){
  const cx=(pond.x1+pond.x2)/2,cz=(pond.z1+pond.z2)/2,w=pond.x2-pond.x1,d=pond.z2-pond.z1;
  for(let i=0;i<6;i++){
   const lx=cx+(random()-.5)*(w-3),lz=cz+(random()-.5)*(d-3);
   const pad=new THREE.Mesh(new THREE.CylinderGeometry(.45,.45,.02,8),mat('#3b643a'));
   pad.position.set(lx,22.3,lz);group.add(pad);
   if(i%2===0){
    crown(lx,22.38,lz,.12,.1,.12,'#e87d96');
    crown(lx,22.42,lz,.05,.05,.05,'#f0d268');
   }
  }
 }

 // 9. Understory Mondo Grass and Courtyard Bonsai
 for(let i=0;i<18;i++){
  const bx=-100+random()*96,bz=200+random()*52;
  if(innerGardenContains(bx,bz)&&!gardenPathContains(bx,bz,1.5)){
   block('#3d5932',bx,26.015,bz,1.4,.03,1.4);
   if(i%4===0){
    block('#8e8070',bx,26.3,bz,.6,.6,.6);
    crown(bx,26.8,bz,.35,.25,.35,'#2f482d');
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
