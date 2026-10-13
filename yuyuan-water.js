import * as THREE from './three.module.js';

// Plane XY becomes world XZ after rotation.x=-PI/2, so local Y is -world Z.
export function createRiverWaterGeometry({size,centerX,centerZ,ponds=[],shift=0}){
 if(![size,centerX,centerZ,shift].every(Number.isFinite)||size<=0)throw new TypeError('Invalid river water bounds');
 const half=size/2,shape=new THREE.Shape();
 shape.moveTo(-half,-half);shape.lineTo(half,-half);shape.lineTo(half,half);shape.lineTo(-half,half);shape.closePath();
 for(const pond of ponds){
  if(![pond.x1,pond.x2,pond.z1,pond.z2].every(Number.isFinite)||pond.x2<=pond.x1||pond.z2<=pond.z1)throw new TypeError('Invalid pond bounds');
  const x1=pond.x1-centerX,x2=pond.x2-centerX,y1=centerZ-pond.z2-shift,y2=centerZ-pond.z1-shift;
  if(x1<=-half||x2>=half||y1<=-half||y2>=half)throw new RangeError('Pond must be inside the river water plane');
  const hole=new THREE.Path();hole.moveTo(x1,y1);hole.lineTo(x1,y2);hole.lineTo(x2,y2);hole.lineTo(x2,y1);hole.closePath();shape.holes.push(hole);
 }
 return new THREE.ShapeGeometry(shape);
}

function koiGeometry(tail=false){
 const positions=[],colors=[],normals=[],point=new THREE.Vector3(),normal=new THREE.Vector3();
 function append(geometry,color,x,y,z,sx,sy,sz){
  const g=geometry.index?geometry.toNonIndexed():geometry,col=new THREE.Color(color),a=g.attributes.position,n=g.attributes.normal;
  for(let i=0;i<a.count;i++){point.fromBufferAttribute(a,i);positions.push(point.x*sx+x,point.y*sy+y,point.z*sz+z);normal.fromBufferAttribute(n,i).set(normal.x/sx,normal.y/sy,normal.z/sz).normalize();normals.push(normal.x,normal.y,normal.z);colors.push(col.r,col.g,col.b);}
  if(g!==geometry)g.dispose();geometry.dispose();
 }
 function triangle(vertices,color){const col=new THREE.Color(color);for(let i=0;i<vertices.length;i+=3){positions.push(vertices[i],vertices[i+1],vertices[i+2]);normals.push(0,1,0);colors.push(col.r,col.g,col.b);}}
 if(tail){
  triangle([0,0,.03,-.19,0,-.3,0,0,-.23,0,0,.03,0,0,-.23,.19,0,-.3],'#efdfbb');
  triangle([0,.001,.01,-.11,.001,-.25,0,.001,-.17,0,.001,.01,0,.001,-.17,.11,.001,-.25],'#d45c2d');
 }else{
  append(new THREE.SphereGeometry(1,10,6),'#f6eee0',0,0,0,.16,.052,.43);
  append(new THREE.SphereGeometry(1,8,5),'#edddbf',0,-.002,.31,.12,.047,.15);
  for(const [x,z,sx,sz,c]of [[-.055,-.15,.085,.11,'#e96931'],[.035,.12,.087,.13,'#de4c27'],[.07,-.03,.056,.065,'#393b31'],[-.03,.29,.06,.055,'#ec782f']])append(new THREE.SphereGeometry(1,7,4),c,x,.044,z,sx,.011,sz);
  for(const x of [-.098,.098])append(new THREE.SphereGeometry(1,5,4),'#242b2c',x,.019,.34,.018,.018,.021);
  triangle([-.1,-.013,.08,-.29,-.018,-.08,-.11,-.016,-.11,.1,-.013,.08,.11,-.016,-.11,.29,-.018,-.08],'#ddbb83');
  triangle([0,.042,.13,0,.095,-.06,0,.035,-.23],'#c6aa77');
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeBoundingSphere();return g;
}

export function createYuyuanWater(root,{ponds}){
 const dynamicRoots=new Set(),surfaces=[],fish=[],ripples=[];
 const waterMaterial=new THREE.MeshPhongMaterial({color:'#82baa0',transparent:true,opacity:.37,shininess:75,depthWrite:false,side:THREE.DoubleSide});
 for(const pond of ponds){
  const surface=new THREE.Mesh(new THREE.PlaneGeometry(pond.x2-pond.x1,pond.z2-pond.z1),waterMaterial);surface.name='yuyuan-clear-pond';surface.rotation.x=-Math.PI/2;surface.position.set((pond.x1+pond.x2)/2,22.29,(pond.z1+pond.z2)/2);root.add(surface);surfaces.push(surface);dynamicRoots.add(surface);
 }
 // Paths are deliberately east of the water-corridor's X=-61/-59 piers,
 // and clear of the teahouse footprint. No random collision/retry per frame.
 for(let p=0;p<ponds.length;p++){
  const pond=ponds[p],width=pond.x2-pond.x1,depth=pond.z2-pond.z1,cx=(pond.x1+pond.x2)/2,cz=(pond.z1+pond.z2)/2,count=p===0?14:3;
  for(let i=0;i<count;i++){
   let x=cx,z=cz,rx=Math.max(.1,width*.32),rz=Math.max(.1,depth*.18);
   if(p===0&&width>30&&depth>20){
    if(i<8){x=cx+1.5;z=pond.z2-6;rx=8.2+(i%4)*1.05;rz=1.2+(i%3)*.35;}
    else if(i<12){x=cx+1;z=pond.z1+2.3;rx=8+(i%3)*1.3;rz=.65+(i%2)*.15;}
    else{x=pond.x2-3.1;z=cz;rx=.75;rz=5.4+(i%2)*.65;}
   }
   fish.push({pond:p,cx:x,cz:z,rx,rz,phase:i*2.399+p*.7,speed:(.14+(i%5)*.022)*(i%3===0?-1:1),scale:.75+(i%4)*.085,height:22.015+(i%3)*.014});
  }
  for(let i=0;i<3;i++)ripples.push({x:cx+(i-1)*width*.2,z:cz+(i%2?1:-1)*depth*.26,phase:i*.37+p*.23});
 }
 const koiMaterial=new THREE.MeshBasicMaterial({vertexColors:true,color:'#ffffff',side:THREE.DoubleSide});
 const bodies=new THREE.InstancedMesh(koiGeometry(),koiMaterial,fish.length),tails=new THREE.InstancedMesh(koiGeometry(true),koiMaterial,fish.length);
 bodies.name='yuyuan-koi-bodies';tails.name='yuyuan-koi-tails';
 const color=new THREE.Color();for(let i=0;i<fish.length;i++){color.set(i%4===0?'#edb76e':i%4===1?'#fff8ea':i%4===2?'#f1c6ac':'#e9eee5');bodies.setColorAt(i,color);tails.setColorAt(i,color);}
 const rippleMaterial=new THREE.MeshBasicMaterial({color:'#cfecdb',transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide});
 const rings=new THREE.InstancedMesh(new THREE.RingGeometry(.87,1,24),rippleMaterial,ripples.length);rings.name='yuyuan-pond-ripples';
 for(const m of [bodies,tails,rings]){m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;root.add(m);dynamicRoots.add(m);}
 const dummy=new THREE.Object3D();let elapsed=0;
 function tick(dt,{night=false}={}){
  if(Number.isFinite(dt)&&dt>0)elapsed+=Math.min(dt,.25);
  waterMaterial.color.set(night?'#668a79':'#82baa0');rippleMaterial.opacity=night?.11:.18;
  for(let i=0;i<fish.length;i++){
   const f=fish[i],a=f.phase+elapsed*f.speed,sa=Math.sin(a),ca=Math.cos(a),x=f.cx+f.rx*ca,z=f.cz+f.rz*sa,y=f.height+Math.sin(elapsed*.75+i)*.008;
   const yaw=Math.atan2(-f.rx*sa*f.speed,f.rz*ca*f.speed);
   dummy.position.set(x,y,z);dummy.rotation.set(0,yaw,0);dummy.scale.setScalar(f.scale);dummy.updateMatrix();bodies.setMatrixAt(i,dummy.matrix);
   dummy.position.set(x-Math.sin(yaw)*.4*f.scale,y,z-Math.cos(yaw)*.4*f.scale);dummy.rotation.y=yaw+Math.sin(elapsed*(4.2+i%3)+i)*.25;dummy.updateMatrix();tails.setMatrixAt(i,dummy.matrix);
  }
  for(let i=0;i<ripples.length;i++){const r=ripples[i],u=(elapsed*.11+r.phase)%1,scale=.35+u*.6;dummy.position.set(r.x,22.302,r.z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(scale,scale,scale);dummy.updateMatrix();rings.setMatrixAt(i,dummy.matrix);}
  bodies.instanceMatrix.needsUpdate=true;tails.instanceMatrix.needsUpdate=true;rings.instanceMatrix.needsUpdate=true;
 }
 tick(0);return {dynamicRoots,tick};
}
