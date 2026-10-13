import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {GARDEN_BEDS,gardenBedContains,WATER_CORRIDOR,JIUQU_BRIDGE,gardenPathContains,INNER_GATES,GARDEN_PONDS,pathContains} from './yuyuan-layout.js';

// Coordinates belong to the district, whose parent applies YUYUAN_SHIFT.
export function createYuyuanGardenAssets(root,{cube,mat,buildings}){
 const fixtures=[],night=new THREE.Group(),garden=new THREE.Group();
 night.name='yuyuan-eaves-and-window-light';night.visible=false;
 garden.name='yuyuan-corridor-and-planting';root.add(garden,night);
 const unitBox=new THREE.BoxGeometry(1,1,1),leafGeometry=new THREE.SphereGeometry(1,8,5),stemGeometry=new THREE.CylinderGeometry(1,1,1,6);
 const up=new THREE.Vector3(0,1,0),delta=new THREE.Vector3();
 function block(group,color,x,y,z,w,h,d,glow=false){const mesh=cube(color,x,y,z,w,h,d,glow);group.add(mesh);return mesh;}
 function beam(group,color,a,b,width=.045,glow=false){delta.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);const mesh=new THREE.Mesh(unitBox,mat(color,glow));mesh.position.set((a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2);mesh.scale.set(width,delta.length(),width);mesh.quaternion.setFromUnitVectors(up,delta.normalize());group.add(mesh);return mesh;}
 function leaves(x,y,z,rx,ry,rz,color='#476947'){const mesh=new THREE.Mesh(leafGeometry,mat(color));mesh.position.set(x,y,z);mesh.scale.set(rx,ry,rz);garden.add(mesh);return mesh;}
 function trunk(x,z,height=5,width=.24){const mesh=new THREE.Mesh(stemGeometry,mat('#705b3f'));mesh.position.set(x,26+height/2,z);mesh.scale.set(width,height,width);garden.add(mesh);fixtures.push({x,z,rx:width,rz:width,y:26,h:height});}
 // The lines follow the same five roof segments as the main roof geometry.
 // A tiny outward offset prevents coplanar shimmer, without floating strips.
 for(const b of buildings){for(let level=1;level<=b.levels;level++){
  const scale=level===b.levels?.96:1.1,rx=(b.rx+1.2)*scale,rz=(b.rz+1.2)*scale,y=26+level*4,h=t=>y+2.3*(1-t)+.65*t**7;
  for(const side of [-1,1]){
   beam(night,'#ffc778',[b.x-rx-.08,h(1)+.04,b.z+side*rz],[b.x+rx+.08,h(1)+.04,b.z+side*rz],.11,true);
   for(const edge of [-1,1])for(let i=0;i<5;i++){const a=i/5,c=(i+1)/5;beam(night,'#e6a95b',[b.x+edge*rx,h(a)+.045,b.z+side*rz*a],[b.x+edge*rx,h(c)+.045,b.z+side*rz*c],.085,true);}
  }
  beam(night,'#ffe0a1',[b.x-rx,y+2.39,b.z],[b.x+rx,y+2.39,b.z],.09,true);
 }
 // Glowing panes and fine timber mullions, rather than luminous solid walls.
 for(let level=1;level<b.levels;level++)for(const side of [-1,1])for(let x=b.x-b.rx+.7;x<b.x+b.rx-.3;x+=1.2){
  const y=27.5+level*4,z=b.z+side*(b.rz+.075)+(side>0?1:0);
  block(night,'#dca65e',x,y,z,.83,1.7,.018,true);
  for(const dx of [-.3,0,.3])block(garden,'#493b2b',x+dx,y,z+side*.02,.035,1.76,.025);
  for(const dy of [-.56,0,.56])block(garden,'#493b2b',x,y+dy,z+side*.02,.89,.04,.025);
 }
 }

 // The district supplies a supported timber deck in the pond. Leave both
 // sides open where the zigzag bridge meets this water corridor.
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

 // Several connected green rooms, not isolated trees on a paved plaza. Their
 // bounds are shared with the world grass floor; only trunks are solid.
 const clearPlanting=(x,z)=>!pathContains(x,z,JIUQU_BRIDGE,2)&&!gardenPathContains(x,z,2)&&!INNER_GATES.some(g=>Math.hypot(x-g.x,z-g.z)<3)&&!GARDEN_PONDS.some(p=>x>p.x1-2&&x<p.x2+2&&z>p.z1-2&&z<p.z2+2)&&!(x<-67&&Math.abs(z-160)<2.4)&&!buildings.some(b=>Math.abs(x-b.x)<b.rx+.65&&Math.abs(z-b.z)<b.rz+.65);
 let seed=57317;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(const bed of GARDEN_BEDS){
  const count=Math.ceil((bed.x2-bed.x1)*(bed.z2-bed.z1)*.36);
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
 // Perforated limestone is assembled from lobes around visible holes. Each
 // lobe has matching collision bounds, rather than an invisible full cuboid.
 function lakeRock(x,z,size=1){
  for(const [dx,y,dz,rx,ry,rz]of [[-.65,.8,0,.42,.8,.58],[.65,.9,.1,.48,.9,.52],[0,1.75,0,.85,.3,.5],[-.25,2.35,.1,.4,.45,.37],[.36,.38,.05,.62,.34,.7]]){
   const mesh=new THREE.Mesh(leafGeometry,mat('#91968a'));mesh.position.set(x+dx*size,26+y*size,z+dz*size);mesh.scale.set(rx*size,ry*size,rz*size);mesh.rotation.z=dx*.2;garden.add(mesh);
   fixtures.push({x:x+dx*size,z:z+dz*size,rx:(rx+.12)*size,rz:rz*size,y:26+(y-ry-.1)*size,h:(ry*2+.2)*size});
  }
 }
 // The inner garden supplies its own layered lake-rock composition.
 lakeRock(-39.5,158,.9);
 // A white boundary with real lattice openings and a tiled cap frames a
 // planted room. It is outside the central route and every shop entrance.
 for(const z of [179,183,187]){
  const x=-18.8;block(garden,'#ddd9c8',x,26.65,z,.3,1.3,3.6);block(garden,'#ddd9c8',x,29.05,z,.3,.6,3.6);
  for(const zz of [z-1.6,z+1.6]){block(garden,'#ddd9c8',x,27.9,zz,.3,1.8,.45);fixtures.push({x,z:zz,rx:.15,rz:.225,y:26,h:3.35});}
  fixtures.push({x,z,rx:.15,rz:1.8,y:26,h:1.3},{x,z,rx:.15,rz:1.8,y:28.75,h:.6});
  for(let j=-1.2;j<=1.21;j+=.4){beam(garden,'#706e5c',[x-.17,27.5,z+j-.23],[x-.17,28.5,z+j+.23],.045);beam(garden,'#706e5c',[x-.17,27.5,z+j+.23],[x-.17,28.5,z+j-.23],.045);}
  block(garden,'#424c43',x,29.42,z,.65,.18,3.9);
  fixtures.push({x,z,rx:.19,rz:1.55,y:27.45,h:1.1});
 }
 // Keep the public pavilion south of the shops: the old northeast-bank
 // position now belongs to the extended inner garden's east-loop path.
 const pavilionX=-21,pavilionZ=224.5;
 for(const dx of [-1.5,1.5])for(const dz of [-1.5,1.5]){block(garden,'#81513b',pavilionX+dx,27.7,pavilionZ+dz,.14,3.4,.14);fixtures.push({x:pavilionX+dx,z:pavilionZ+dz,rx:.07,rz:.07,y:26,h:3.4});}
 const pavilionRoof=[];
 for(const side of [-1,1])for(let j=0;j<4;j++){const a=j/4,b=(j+1)/4,h=t=>31.2-1.3*t+.3*t**6,za=pavilionZ+side*2.1*a,zb=pavilionZ+side*2.1*b;
  pavilionRoof.push(pavilionX-2.1,h(a),za,pavilionX+2.1,h(a),za,pavilionX-2.1,h(b),zb,pavilionX-2.1,h(b),zb,pavilionX+2.1,h(a),za,pavilionX+2.1,h(b),zb);
 }
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.Float32BufferAttribute(pavilionRoof,3));pg.computeVertexNormals();garden.add(new THREE.Mesh(pg,roofMat));
 for(const side of [-1,1]){block(night,'#ffcc87',pavilionX,30.24,pavilionZ+side*2.1,4.3,.06,.06,true);block(garden,'#76543a',pavilionX,26.42,pavilionZ+side*1.42,2.7,.14,.38);fixtures.push({x:pavilionX,z:pavilionZ+side*1.42,rx:1.35,rz:.19,y:26.35,h:.14});}
 // Low lotus islands are deliberately separated from every bridge segment.
 for(const [x,z] of [[-56,190],[-45,189],[-32,174],[-32,188]]){
  if(pathContains(x,z,JIUQU_BRIDGE,2)||Math.abs(x-corridorX)<3)continue;
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(.86,.92,.18,14),mat('#9ca28a'));rim.position.set(x,22.38,z);garden.add(rim);
  for(let i=0;i<5;i++){const angle=i*2.4,xx=x+Math.cos(angle)*.48,zz=z+Math.sin(angle)*.48;leaves(xx,22.52,zz,.29,.035,.26,'#668952');
   if(i%2===0){const flower=new THREE.Mesh(leafGeometry,mat('#d9b4aa'));flower.position.set(xx,22.63,zz);flower.scale.set(.1,.13,.1);garden.add(flower);}
  }
 }

 // Two compact fountains: 96 reused instance transforms, no per-frame meshes,
 // particles, materials, vectors or lights. Arc height never exceeds 3 m.
 const fountains=[[-37,172],[-56.5,188]],drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.038,5,4),mat('#d2e5df',true),96);
 drops.name='yuyuan-fountain-droplets';drops.instanceMatrix.setUsage(THREE.DynamicDrawUsage);drops.frustumCulled=false;root.add(drops);
 const transform=new THREE.Matrix4(),position=new THREE.Vector3(),rotation=new THREE.Quaternion(),scale=new THREE.Vector3(.8,1.6,.8);let elapsed=0;
 function animate(){for(let f=0;f<2;f++)for(let i=0;i<48;i++){
  const jet=i%8,phase=((Math.floor(i/8)/6+elapsed*.62)%1),angle=jet*Math.PI/4,reach=1.45*phase;
  position.set(fountains[f][0]+Math.cos(angle)*reach,22.3+2.7*4*phase*(1-phase),fountains[f][1]+Math.sin(angle)*reach);
  transform.compose(position,rotation,scale);drops.setMatrixAt(f*48+i,transform);
 }drops.instanceMatrix.needsUpdate=true;}
 animate();batchMeshes(garden,staticMeshes(garden),'yuyuan-garden-detail');batchMeshes(night,staticMeshes(night),'yuyuan-night-trim');
 return {fixtures,dynamicRoots:new Set([night,drops]),tick(dt,{night:lit=false}={}){elapsed+=dt;night.visible=lit;animate();}};
}
