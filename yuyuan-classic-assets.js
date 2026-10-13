import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {INNER_GARDEN,INNER_GARDEN_BOUNDARY,INNER_GARDEN_PATH,INNER_GARDEN_EAST_PATH,INNER_GATES,GARDEN_PONDS,gardenPathContains,innerGardenContains} from './yuyuan-layout.js';

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
 function stoneTexture(){const canvas=document.createElement('canvas');canvas.width=128;canvas.height=128;const ctx=canvas.getContext('2d');ctx.fillStyle='#adaf9e';ctx.fillRect(0,0,128,128);
  for(let i=0;i<520;i++){const gray=98+Math.floor(random()*85);ctx.fillStyle=`rgba(${gray},${gray+3},${gray-6},.27)`;ctx.fillRect(random()*128,random()*128,1+random()*8,1+random()*3);}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;return texture;
 }
 const stoneMap=stoneTexture(),rockMaterial=new THREE.MeshLambertMaterial({color:'#9b9d92',map:stoneMap,flatShading:true});
 const rock=new THREE.IcosahedronGeometry(1,1),positions=rock.attributes.position;
 for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i),z=positions.getZ(i),r=1+.12*Math.sin(x*11+y*7-z*4)+.06*Math.cos(z*13-y*9);positions.setXYZ(i,x*r,y*r,z*r);}
 rock.computeVertexNormals();

 // Slice the white wall around real circular voids. Moon openings extend
 // below the 26 m floor, leaving a walkable gap instead of a fake painted door.
 function wall(axis,fixed,u1,u2,holes=[]){
  const top=31.3,step=.2,normal=fixed+.5;
  const wallPiece=(u,y,width,height)=>axis==='z'?block('#dfddcc',u,y,normal,width,height,1.12):block('#dfddcc',normal,y,u,1.12,height,width);
  for(let u=u1;u<u2;u+=step){const width=Math.min(step,u2-u),center=u+width/2,hole=holes.find(h=>Math.abs(center-h.u)<h.r);
   if(!hole){wallPiece(center,(26+top)/2,width,top-26);continue;}
   const extent=Math.sqrt(Math.max(0,hole.r**2-(center-hole.u)**2)),lo=Math.max(26,hole.y-extent),hi=Math.min(top,hole.y+extent);
   if(lo>26)wallPiece(center,(26+lo)/2,width,lo-26);if(hi<top)wallPiece(center,(hi+top)/2,width,top-hi);
  }
  // Overlapping pitched cap tiles continue across the moon gate head.
  for(let u=u1+.2;u<u2;u+=.48){for(const side of [-1,1]){const mesh=axis==='z'?block('#414b43',u,31.47,normal+side*.4,.56,.1,.88):block('#414b43',normal+side*.4,31.47,u,.88,.1,.56);if(axis==='z')mesh.rotation.x=side*.28;else mesh.rotation.z=-side*.28;}
   axis==='z'?block('#667064',u,31.61,normal,.55,.08,.1):block('#667064',normal,31.61,u,.1,.08,.55);
  }
  for(const hole of holes)for(const face of [-1,1]){const frame=new THREE.Mesh(new THREE.TorusGeometry(hole.r+.08,.08,6,48),mat('#646b61'));frame.position.set(axis==='z'?hole.u:normal+face*.59,hole.y,axis==='z'?normal+face*.59:hole.u);if(axis==='x')frame.rotation.y=Math.PI/2;group.add(frame);}
 }
 const north=INNER_GATES.find(g=>g.axis==='z'),west=INNER_GATES.find(g=>g.axis==='x');
 for(let i=0;i<INNER_GARDEN_BOUNDARY.length;i++){const a=INNER_GARDEN_BOUNDARY[i],b=INNER_GARDEN_BOUNDARY[(i+1)%INNER_GARDEN_BOUNDARY.length],axis=a[0]===b[0]?'x':'z',fixed=axis==='x'?a[0]:a[1],u1=Math.min(axis==='x'?a[1]:a[0],axis==='x'?b[1]:b[0]),u2=Math.max(axis==='x'?a[1]:a[0],axis==='x'?b[1]:b[0]);
  const holes=axis==='z'&&fixed===194?[{u:north.x,y:28.1,r:2.6},{u:-46,y:28.5,r:1.1}]:axis==='z'&&fixed===208?[{u:-46,y:28.5,r:1.1}]:axis==='x'&&fixed===-75?[{u:west.z,y:28.1,r:2.6}]:[];
  wall(axis,fixed,u1,u2,holes);
 }

 // A narrow curved ribbon follows the shared walkable route. The smooth
 // curve stays inside its supported world path; loose edge stones vary in size.
 function pathRibbon(points){const curve=new THREE.CatmullRomCurve3(points.map(([x,z])=>new THREE.Vector3(x,26.018,z)),false,'centripetal'),pathVertices=[],uv=[],indices=[],samples=112,pathLength=curve.getLength();
 for(let i=0;i<=samples;i++){const t=i/samples,p=curve.getPoint(t),tangent=curve.getTangent(t),nx=-tangent.z,nz=tangent.x;
  for(const side of [-1,1]){pathVertices.push(p.x+nx*side*1.2,p.y,p.z+nz*side*1.2);uv.push(side===-1?0:1,t*pathLength/2.4);}
  if(i<samples){const n=i*2;indices.push(n,n+1,n+2,n+2,n+1,n+3);}
  if(i%3===0)for(const side of [-1,1]){const stone=block('#9b9e8e',p.x+nx*side*1.23,26.035,p.z+nz*side*1.23,.32+random()*.13,.05,.35+random()*.12);stone.rotation.y=Math.atan2(nx,nz)+(random()-.5)*.3;}
 }
 const pathGeometry=new THREE.BufferGeometry();pathGeometry.setAttribute('position',new THREE.Float32BufferAttribute(pathVertices,3));pathGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));pathGeometry.setIndex(indices);pathGeometry.computeVertexNormals();const pathMaterial=new THREE.MeshLambertMaterial({color:'#c0c0a9',map:stoneMap,side:THREE.DoubleSide});group.add(new THREE.Mesh(pathGeometry,pathMaterial));
 }
 pathRibbon(INNER_GARDEN_PATH);pathRibbon(INNER_GARDEN_EAST_PATH);

 // Both ponds use the shared clear-water module; never layer an opaque plane.
 function lakeRock(x,z,size=1,base=26){
  // Independent side pillars and overhead stones expose several actual voids.
  const parts=[[-.7,.95,0,.38,.94,.55],[.67,1.08,.12,.47,1.04,.5],[.02,2.03,0,.87,.32,.48],[-.31,2.79,.04,.4,.5,.37],[.5,3.04,.12,.31,.34,.31],[-.1,.3,-.22,.8,.32,.62]];
  for(const [dx,y,dz,rx,ry,rz]of parts){const mesh=new THREE.Mesh(rock,rockMaterial);mesh.position.set(x+dx*size,base+y*size,z+dz*size);mesh.scale.set(rx*size,ry*size,rz*size);mesh.rotation.set((random()-.5)*.16,(random()-.5)*.45,(random()-.5)*.19);group.add(mesh);addFixture(mesh);}
 }
 // Large, medium and low groups overlap in the window sightlines. The tallest
 // pond rock rises from below water, so it has no floating lower edge.
 lakeRock(-63.8,200.2,1.95,21.8);lakeRock(-67.6,199.7,.8,22.1);
 lakeRock(-47.4,201.3,1.12);lakeRock(-73.1,197,1.2);lakeRock(-63,195.5,.75);lakeRock(-32.7,205.6,.58);
 lakeRock(-8.1,202,1.4,21.8);lakeRock(-11.5,198.8,.65,22.1);lakeRock(-16.1,205.3,.55);
 function tree(x,z,height=5.5,width=.2,index=0){
  const trunk=new THREE.Mesh(pole,mat('#6c593c'));trunk.position.set(x,26+height/2,z);trunk.scale.set(width,height,width);group.add(trunk);addFixture(trunk);
  crown(x,26+height+.6,z,2.1,1.6,2.1);crown(x-1.1,26+height-.1,z+.8,1.65,1.25,1.8,'#405f3b');
  if(index%2===0)for(let j=0;j<7;j++){const angle=j*.9,xx=x+Math.cos(angle)*1.75,zz=z+Math.sin(angle)*1.75;beam('#668345',[xx,26+height+.2,zz],[xx+.2,29.2,zz+.2],.07);crown(xx,30,zz,.25,.95,.28,'#658747');}
 }
 for(const [i,[x,z,h]]of [[-73.4,195.7,5.5],[-66.5,195.6,6.1],[-52.2,206.5,5],[-43.8,202.8,5.7],[-31.1,199.7,4.8],[-25.3,204.7,5.8],[-16.4,198.6,5.3],[-1,213.8,5.1],[-13.6,213.9,4.7],[1.2,200.8,5.7]].entries())tree(x,z,h,.17+random()*.07,i);
 const clearShrub=(x,z)=>innerGardenContains(x,z)&&!gardenPathContains(x,z,2)&&!INNER_GATES.some(g=>Math.hypot(x-g.x,z-g.z)<3)&&!GARDEN_PONDS.some(p=>x>p.x1-.5&&x<p.x2+.5&&z>p.z1-.5&&z<p.z2+.5);
 let planted=0;
 for(let attempt=0;attempt<260&&planted<64;attempt++){const x=INNER_GARDEN.minX+1.2+random()*(INNER_GARDEN.maxX-INNER_GARDEN.minX-2.4),z=INNER_GARDEN.minZ+1.1+random()*(INNER_GARDEN.maxZ-INNER_GARDEN.minZ-2.2);if(!clearShrub(x,z))continue;
  const h=.3+random()*.85;crown(x,26.01,z,1.05,.018,.88,'#577640');crown(x,26+h*.6,z,.45+random()*.55,h,.4+random()*.55);
  if(planted%4===0)for(let j=0;j<4;j++)crown(x+(random()-.5)*.8,26+h*1.4,z+(random()-.5)*.8,.085,.1,.085,'#d8cdbc');planted++;
 }
 // A small open water-view pavilion on the new pond's southern bank. Four
 // posts and short seats leave the east loop clear on every approach.
 const pavilionX=0,pavilionZ=210.5;
 for(const dx of [-1.25,1.25])for(const dz of [-1.25,1.25]){const post=block('#77503b',pavilionX+dx,28,pavilionZ+dz,.16,4,.16);addFixture(post);}
 for(const side of [-1,1]){beam('#745c3d',[pavilionX-1.25,30,pavilionZ+side*1.25],[pavilionX+1.25,30,pavilionZ+side*1.25],.11);const seat=block('#806344',pavilionX,26.45,pavilionZ+side*1.23,2,.15,.32);addFixture(seat);}
 const roofVertices=[];
 for(const side of [-1,1])for(let j=0;j<5;j++){const a=j/5,b=(j+1)/5,h=t=>31.2-1.2*t+.25*t**6,za=pavilionZ+side*1.95*a,zb=pavilionZ+side*1.95*b;
  roofVertices.push(pavilionX-1.95,h(a),za,pavilionX+1.95,h(a),za,pavilionX-1.95,h(b),zb,pavilionX-1.95,h(b),zb,pavilionX+1.95,h(a),za,pavilionX+1.95,h(b),zb);
 }
 const roofGeometry=new THREE.BufferGeometry();roofGeometry.setAttribute('position',new THREE.Float32BufferAttribute(roofVertices,3));roofGeometry.computeVertexNormals();const roofMaterial=mat('#3f4e43').clone();roofMaterial.side=THREE.DoubleSide;group.add(new THREE.Mesh(roofGeometry,roofMaterial));
 beam('#74634b',[pavilionX-2,31.22,pavilionZ],[pavilionX+2,31.22,pavilionZ],.1);

 // The inscription is a transparent brush-letter texture on an irregular,
 // broad natural rock face, without a rectangular sign backing.
 const titleX=-79.8,titleZ=199.5,profile=[[-1.5,26.18],[-1.66,27.2],[-1.37,29.1],[-.6,30.7],[.34,30.92],[1.28,30.18],[1.55,28.75],[1.42,26.18]],titleVertices=[],titleIndices=[];
 for(const depth of [-1.3,1.15])for(const [z,y]of profile)titleVertices.push(titleX+depth,y,titleZ+z);
 for(let i=1;i<profile.length-1;i++)titleIndices.push(0,i+1,i,profile.length,profile.length+i,profile.length+i+1);
 for(let i=0;i<profile.length;i++){const next=(i+1)%profile.length;titleIndices.push(i,next,profile.length+i,profile.length+i,next,profile.length+next);}
 const titleGeometry=new THREE.BufferGeometry();titleGeometry.setAttribute('position',new THREE.Float32BufferAttribute(titleVertices,3));const titleUvs=[];for(let i=0;i<titleVertices.length;i+=3)titleUvs.push((titleVertices[i+2]-titleZ+1.8)/3.6,(titleVertices[i+1]-26)/5);titleGeometry.setAttribute('uv',new THREE.Float32BufferAttribute(titleUvs,2));titleGeometry.setIndex(titleIndices);titleGeometry.computeVertexNormals();const titleStone=new THREE.Mesh(titleGeometry,rockMaterial);group.add(titleStone);addFixture(titleStone);
 const lettering=document.createElement('canvas');lettering.width=256;lettering.height=768;const ctx=lettering.getContext('2d');ctx.clearRect(0,0,256,768);ctx.fillStyle='#e4c36c';ctx.font='bold 116px KaiTi,STKaiti,"Microsoft YaHei",serif';ctx.textAlign='center';ctx.textBaseline='middle';
 [...'海上名园'].forEach((character,i)=>ctx.fillText(character,128,126+i*164));
 const titleTexture=new THREE.CanvasTexture(lettering);titleTexture.colorSpace=THREE.SRGBColorSpace;const titleText=new THREE.Mesh(new THREE.PlaneGeometry(1.45,3.75),new THREE.MeshBasicMaterial({map:titleTexture,transparent:true,alphaTest:.03,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));titleText.position.set(titleX-1.306,28.5,titleZ);titleText.rotation.y=-Math.PI/2;titleText.userData.panel=true;group.add(titleText);

 batchMeshes(group,staticMeshes(group),'yuyuan-classic-finish');
 return {fixtures,dynamicRoots:new Set()};
}
