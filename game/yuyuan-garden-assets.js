import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {JIUQU_BRIDGE,pathContains} from './yuyuan-layout.js';

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

 // An open, roofed promenade on the west pond bank. The bridge joins at 173;
 // no post or handrail crosses that opening, and the roof starts above 30 m.
 for(const x of [-69,-65])for(const z of [170.5,176.5,181.5,186.5,191.5]){
  block(garden,'#813f32',x,28,z,.18,4,.18);fixtures.push({x,z,rx:.09,rz:.09,y:26,h:4});
  block(garden,'#897b67',x,26.15,z,.42,.3,.42);
 }
 const roofVertices=[];
 for(const side of [-1,1])for(let i=0;i<4;i++){
  const a=i/4,c=(i+1)/4,h=t=>31.35-1.1*t+.23*t**6,xa=-67+side*2.55*a,xc=-67+side*2.55*c;
  roofVertices.push(xa,h(a),170,xa,h(a),193,xc,h(c),170,xc,h(c),170,xa,h(a),193,xc,h(c),193);
 }
 const roof=new THREE.BufferGeometry();roof.setAttribute('position',new THREE.Float32BufferAttribute(roofVertices,3));roof.computeVertexNormals();const roofMat=mat('#36463d').clone();roofMat.side=THREE.DoubleSide;garden.add(new THREE.Mesh(roof,roofMat));
 for(const side of [-1,1]){block(garden,'#7e5b3c',-67+side*2.5,30.3,181.5,.12,.13,23);block(night,'#ffcc87',-67+side*2.55,30.49,181.5,.04,.04,23,true);}
 for(const z of [176.5,181.5,186.5,191.5]){
  beam(garden,'#775b3d',[-69,30,z],[-65,30,z],.13);
  block(garden,'#bf7751',-67,29.48,z,.34,.47,.34);block(night,'#ffc881',-67,29.48,z,.36,.43,.36,true);block(garden,'#715337',-67,29.17,z,.12,.16,.12);
 }

 // Plantings stay on perimeter banks; central shopping and bridge circulation
 // remains clear. Willow strands start above head height.
 for(const [x,z] of [[-71,160],[-71,183],[-71,221],[-20,175],[-20,193],[-20,221]]){
  block(garden,'#526d43',x,26.03,z,5,.08,7);trunk(x,z,5.7,.22);
  leaves(x,32,z,2.4,1.8,2.3,'#527a4c');leaves(x-.9,31.6,z+.9,1.8,1.6,1.7,'#416b43');
  for(let i=0;i<8;i++){const angle=i*Math.PI/4,xx=x+Math.cos(angle)*1.85,zz=z+Math.sin(angle)*1.85;
   beam(garden,'#577d49',[xx,31.5,zz],[xx+.18*Math.cos(angle),28.65,zz+.18*Math.sin(angle)],.1);
   leaves(xx,30.2,zz,.26,1.15,.27,'#628348');
  }
 }
 for(const [x,z] of [[-72,168],[-72,196],[-20,166],[-20,201],[-57,224]]){
  block(garden,'#5b743f',x,26.04,z,4.8,.09,5.2);
  for(let i=0;i<5;i++){const xx=x+(i%3-1)*.48,zz=z+(Math.floor(i/3)-.5)*.55,height=3.4+(i%3)*.42;
   const stem=new THREE.Mesh(stemGeometry,mat('#688345'));stem.position.set(xx,26+height/2,zz);stem.scale.set(.045,height,.045);garden.add(stem);
   for(let j=1;j<=3;j++){block(garden,'#99a765',xx,26+j*height/4,zz,.11,.06,.11);for(const sign of [-1,1])leaves(xx+sign*.38,26+j*height/4+.12,zz,.43,.09,.2,'#4e783f');}
  }
  fixtures.push({x,z,rx:.7,rz:.55,y:26,h:3.4});
 }
 // Low lotus islands are deliberately separated from every bridge segment.
 for(const [x,z] of [[-61,185],[-61,190],[-45,189],[-32,174],[-32,188]]){
  if(pathContains(x,z,JIUQU_BRIDGE,2))continue;
  const rim=new THREE.Mesh(new THREE.CylinderGeometry(.86,.92,.18,14),mat('#9ca28a'));rim.position.set(x,22.38,z);garden.add(rim);
  for(let i=0;i<5;i++){const angle=i*2.4,xx=x+Math.cos(angle)*.48,zz=z+Math.sin(angle)*.48;leaves(xx,22.52,zz,.29,.035,.26,'#668952');
   if(i%2===0){const flower=new THREE.Mesh(leafGeometry,mat('#d9b4aa'));flower.position.set(xx,22.63,zz);flower.scale.set(.1,.13,.1);garden.add(flower);}
  }
 }

 // Two compact fountains: 96 reused instance transforms, no per-frame meshes,
 // particles, materials, vectors or lights. Arc height never exceeds 3 m.
 const fountains=[[-37,172],[-58,188]],drops=new THREE.InstancedMesh(new THREE.SphereGeometry(.038,5,4),mat('#d2e5df',true),96);
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
