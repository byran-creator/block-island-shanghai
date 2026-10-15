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
  triangle([0,0,.03,-.19,0,-.3,0,0,-.23,0,0,.03,0,0,-.23,.19,0,-.3],'#fefaf2');
  triangle([0,.001,.01,-.12,.001,-.27,0,.001,-.18,0,.001,.01,0,.001,-.18,.12,.001,-.27],'#e64d25');
  triangle([0,-.001,.02,-.08,-.001,-.24,0,-.001,-.15,0,-.001,.02,0,-.001,-.15,.08,-.001,-.24],'#d93822');
 }else{
  // Main sleek torpedo body
  append(new THREE.SphereGeometry(1,10,6),'#fdfbf7',0,0,0,.16,.055,.45);
  // Head taper & snout
  append(new THREE.SphereGeometry(1,8,5),'#fbeee0',0,-.002,.33,.125,.048,.16);
  // Tancho crimson crown circle on head (丹顶朱砂圆斑)
  append(new THREE.SphereGeometry(1,7,4),'#d9261e',0,.048,.31,.075,.012,.075);
  // Bold Hi/Sumi markings for Kohaku and Taisho Sanshoku (绯盘与墨斑)
  for(const [x,z,sx,sz,c]of [
   [-.055,-.15,.09,.12,'#e64d25'],
   [.04,.12,.09,.14,'#d93822'],
   [.07,-.02,.058,.07,'#1c1e22'],
   [-.06,.05,.05,.065,'#202328'],
   [-.028,.30,.062,.055,'#ec7528']
  ])append(new THREE.SphereGeometry(1,7,4),c,x,.046,z,sx,.012,sz);
  // Prominent paired black eyes with gold orbital rims (黑晶点目带金圈)
  for(const x of [-.102,.102]){
   append(new THREE.SphereGeometry(1,5,4),'#e5b958',x,.02,.35,.022,.02,.024);
   append(new THREE.SphereGeometry(1,5,4),'#111518',x*1.04,.02,.35,.015,.015,.018);
  }
  // Delicate pectoral fins (一对宽大舒展的半透明胸鳍)
  triangle([-.11,-.01,.14,-.32,-.02,-.04,-.12,-.015,-.06],'#fdf2de');
  triangle([.11,-.01,.14,.12,-.015,-.06,.32,-.02,-.04],'#fdf2de');
  triangle([-.11,-.008,.13,-.28,-.018,-.02,-.12,-.013,-.04],'#e85c2b');
  triangle([.11,-.008,.13,.12,-.013,-.04,.28,-.018,-.02],'#e85c2b');
  // Ventral fins (腹鳍)
  triangle([-.08,-.02,-.18,-.18,-.03,-.26,-.07,-.02,-.24],'#fbf3e2');
  triangle([.08,-.02,-.18,.07,-.02,-.24,.18,-.03,-.26],'#fbf3e2');
  // Extended graceful dorsal fin (挺拔背鳍)
  triangle([0,.048,.16,0,.11,-.04,0,.038,-.21],'#f4dda8');
  triangle([0,.05,.14,0,.10,-.02,0,.04,-.18],'#e64d25');
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(normals,3));g.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));g.computeBoundingSphere();return g;
}

// -------------------------------------------------------------
// ANIMAL ASSETS: MANDARIN DUCKS (戏水鸳鸯), TURTLES (晒背水龟), DRAGONFLIES (蜻蜓点水)
// -------------------------------------------------------------
function createMandarinDuck(isMale=true){
 const g=new THREE.Group();
 const bodyMat=new THREE.MeshLambertMaterial({color:isMale?'#8c4228':'#6d5a49'});
 const body=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),bodyMat);
 body.scale.set(.18,.12,.31);body.position.set(0,.08,0);g.add(body);

 const breastMat=new THREE.MeshLambertMaterial({color:isMale?'#4a2634':'#847262'});
 const breast=new THREE.Mesh(new THREE.SphereGeometry(1,7,5),breastMat);
 breast.scale.set(.16,.11,.16);breast.position.set(0,.09,.14);g.add(breast);

 const headMat=new THREE.MeshLambertMaterial({color:isMale?'#1c5c4e':'#645345'});
 const head=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),headMat);
 head.scale.set(.11,.13,.14);head.position.set(0,.24,.16);g.add(head);

 const billMat=new THREE.MeshLambertMaterial({color:isMale?'#d94328':'#483f36'});
 const bill=new THREE.Mesh(new THREE.ConeGeometry(.042,.13,5),billMat);
 bill.rotation.x=-Math.PI/2;bill.position.set(0,.21,.31);g.add(bill);

 if(isMale){
  const sailMat=new THREE.MeshLambertMaterial({color:'#e27424',side:THREE.DoubleSide});
  for(const side of [-1,1]){
   const sailGeo=new THREE.BufferGeometry();
   sailGeo.setAttribute('position',new THREE.Float32BufferAttribute([
    0,0,0, side*.035,.16,-.05, 0,0,-.17
   ],3));
   sailGeo.computeVertexNormals();
   const sail=new THREE.Mesh(sailGeo,sailMat);
   sail.position.set(side*.11,.14,-.03);g.add(sail);

   const eyeStripe=new THREE.Mesh(new THREE.BoxGeometry(.02,.028,.12),new THREE.MeshBasicMaterial({color:'#fdfbf6'}));
   eyeStripe.position.set(side*.105,.25,.14);eyeStripe.rotation.x=.18;g.add(eyeStripe);
  }
 }
 const tail=new THREE.Mesh(new THREE.ConeGeometry(.055,.18,4),new THREE.MeshLambertMaterial({color:isMale?'#1e242c':'#4e4034'}));
 tail.rotation.x=Math.PI/2.3;tail.position.set(0,.14,-.25);g.add(tail);
 return g;
}

function createPondTurtle(){
 const g=new THREE.Group();
 const shell=new THREE.Mesh(new THREE.SphereGeometry(1,8,6),new THREE.MeshLambertMaterial({color:'#36482e'}));
 shell.scale.set(.18,.09,.24);shell.position.set(0,.08,0);g.add(shell);
 const rim=new THREE.Mesh(new THREE.TorusGeometry(.21,.025,4,12),new THREE.MeshLambertMaterial({color:'#9e9365'}));
 rim.rotation.x=Math.PI/2;rim.scale.set(.85,1.15,1);rim.position.set(0,.05,0);g.add(rim);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.032,.038,.14,6),new THREE.MeshLambertMaterial({color:'#45583b'}));
 neck.rotation.x=Math.PI/3;neck.position.set(0,.09,.18);g.add(neck);
 for(const sx of [-.15,.15])for(const sz of [-.11,.11]){
  const foot=new THREE.Mesh(new THREE.BoxGeometry(.07,.02,.07),new THREE.MeshLambertMaterial({color:'#384732'}));
  foot.position.set(sx,.04,sz);g.add(foot);
 }
 return g;
}

function createDragonfly(color='#d63228'){
 const g=new THREE.Group();
 const head=new THREE.Mesh(new THREE.SphereGeometry(.03,6,4),new THREE.MeshLambertMaterial({color:'#171d22'}));
 head.position.set(0,0,.14);g.add(head);
 for(const sx of [-.024,.024]){
  const eye=new THREE.Mesh(new THREE.SphereGeometry(.018,5,4),new THREE.MeshLambertMaterial({color:'#2b4c40'}));
  eye.position.set(sx,.01,.15);g.add(eye);
 }
 const thorax=new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,.1,5),new THREE.MeshLambertMaterial({color}));
 thorax.rotation.x=Math.PI/2;thorax.position.set(0,0,.07);g.add(thorax);
 const abdomen=new THREE.Mesh(new THREE.CylinderGeometry(.012,.018,.26,4),new THREE.MeshLambertMaterial({color}));
 abdomen.rotation.x=Math.PI/2;abdomen.position.set(0,0,-.11);g.add(abdomen);
 const wingMat=new THREE.MeshBasicMaterial({color:'#e2f4f8',transparent:true,opacity:.58,side:THREE.DoubleSide});
 const wings=[];
 for(const side of [-1,1]){
  const fore=new THREE.Mesh(new THREE.PlaneGeometry(.22,.05),wingMat);
  fore.position.set(side*.12,.025,.08);g.add(fore);
  const hind=new THREE.Mesh(new THREE.PlaneGeometry(.18,.045),wingMat);
  hind.position.set(side*.10,.02,.03);g.add(hind);
  wings.push({fore,hind,side});
 }
 return {group:g,wings};
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
 const color=new THREE.Color();
 for(let i=0;i<fish.length;i++){
  // 4 authentic ornamental koi varieties:
  if(i%4===0)color.set('#f5a623'); // 黄金 (Yamabuki Ogon)
  else if(i%4===1)color.set('#ffffff'); // 丹顶红白 (Tancho Kohaku)
  else if(i%4===2)color.set('#fff6ee'); // 大正三色 (Taisho Sanshoku)
  else color.set('#486880'); // 浅黄 (Asagi)
  bodies.setColorAt(i,color);tails.setColorAt(i,color);
 }
 const rippleMaterial=new THREE.MeshBasicMaterial({color:'#cfecdb',transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide});
 const rings=new THREE.InstancedMesh(new THREE.RingGeometry(.87,1,24),rippleMaterial,ripples.length);rings.name='yuyuan-pond-ripples';
 for(const m of [bodies,tails,rings]){m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);m.frustumCulled=false;root.add(m);dynamicRoots.add(m);}

 // -------------------------------------------------------------
 // LIVELY GARDEN WILDLIFE (鸳鸯戏水、石龟晒背、蜻蜓点水)
 // -------------------------------------------------------------
 const animalsGroup=new THREE.Group();animalsGroup.name='yuyuan-garden-wildlife';root.add(animalsGroup);dynamicRoots.add(animalsGroup);

 // 2 pairs of Mandarin Ducks (4 ducks)
 const duckData=[
  {male:true, cx:-44, cz:187.5, rx:4.8, rz:2.5, speed:0.13, phase:0},
  {male:false,cx:-44, cz:187.5, rx:4.4, rz:2.2, speed:0.13, phase:-0.28},
  {male:true, cx:-8.2,cz:202.8, rx:3.6, rz:2.1, speed:0.14, phase:2.1},
  {male:false,cx:-8.2,cz:202.8, rx:3.2, rz:1.8, speed:0.14, phase:1.85}
 ];
 const ducks=duckData.map(d=>{
  const mesh=createMandarinDuck(d.male);
  mesh.scale.setScalar(.95);
  animalsGroup.add(mesh);
  return {...d,mesh};
 });

 // 2 Basking Pond Turtles on rock ledges
 const turtleData=[
  {x:-53.2, y:22.38, z:186.2, rotY:0.75, rotX:0.12},
  {x:-11.5, y:22.38, z:202.8, rotY:-1.1, rotX:0.10}
 ];
 const turtles=turtleData.map(t=>{
  const mesh=createPondTurtle();
  mesh.position.set(t.x,t.y,t.z);mesh.rotation.set(t.rotX,t.rotY,0);
  animalsGroup.add(mesh);
  return {...t,mesh};
 });

 // 3 Hovering Dragonflies skimming above water/lotus
 const dfData=[
  {color:'#d63228', cx:-41.5, cy:22.85, cz:182.0, rx:1.4, rz:1.1, speed:1.4, phase:0.3},
  {color:'#269cb8', cx:-50.0, cy:22.88, cz:189.5, rx:1.6, rz:1.3, speed:1.2, phase:2.4},
  {color:'#d63228', cx:-7.5,  cy:22.85, cz:204.0, rx:1.2, rz:0.9, speed:1.5, phase:1.1}
 ];
 const dragonflies=dfData.map(d=>{
  const df=createDragonfly(d.color);
  animalsGroup.add(df.group);
  return {...d,...df};
 });

 const dummy=new THREE.Object3D();let elapsed=0,waterTimer=0;
 function tick(dt,{night=false}={}){
  if(Number.isFinite(dt)&&dt>0){
   const step=Math.min(dt,.25);
   elapsed+=step;
   waterTimer+=step;
  }
  waterMaterial.color.set(night?'#668a79':'#82baa0');rippleMaterial.opacity=night?.11:.18;
  if(waterTimer>=0.028||dt===0){
   waterTimer=0;
   for(let i=0;i<fish.length;i++){
    const f=fish[i],a=f.phase+elapsed*f.speed,sa=Math.sin(a),ca=Math.cos(a),x=f.cx+f.rx*ca,z=f.cz+f.rz*sa,y=f.height+Math.sin(elapsed*.75+i)*.008;
    const yaw=Math.atan2(-f.rx*sa*f.speed,f.rz*ca*f.speed);
    dummy.position.set(x,y,z);dummy.rotation.set(0,yaw,0);dummy.scale.setScalar(f.scale);dummy.updateMatrix();bodies.setMatrixAt(i,dummy.matrix);
    dummy.position.set(x-Math.sin(yaw)*.4*f.scale,y,z-Math.cos(yaw)*.4*f.scale);dummy.rotation.y=yaw+Math.sin(elapsed*(4.2+i%3)+i)*.25;dummy.updateMatrix();tails.setMatrixAt(i,dummy.matrix);
   }
   for(let i=0;i<ripples.length;i++){const r=ripples[i],u=(elapsed*.11+r.phase)%1,scale=.35+u*.6;dummy.position.set(r.x,22.302,r.z);dummy.rotation.set(-Math.PI/2,0,0);dummy.scale.set(scale,scale,scale);dummy.updateMatrix();rings.setMatrixAt(i,dummy.matrix);}
   bodies.instanceMatrix.needsUpdate=true;tails.instanceMatrix.needsUpdate=true;rings.instanceMatrix.needsUpdate=true;
  }

  // Animated Mandarin ducks swimming in pairs
  for(const d of ducks){
   const a=d.phase+elapsed*d.speed,sa=Math.sin(a),ca=Math.cos(a);
   const dx=d.cx+d.rx*ca, dz=d.cz+d.rz*sa;
   const bobY=22.31+Math.sin(elapsed*2.6+d.phase)*0.01;
   const yaw=Math.atan2(-d.rx*sa, d.rz*ca)+Math.PI;
   const pitch=Math.sin(elapsed*2.6+d.phase)*0.035;
   d.mesh.position.set(dx,bobY,dz);
   d.mesh.rotation.set(pitch,yaw,0);
  }

  // Animated basking turtles idle head nodding
  for(let i=0;i<turtles.length;i++){
   const t=turtles[i];
   t.mesh.rotation.y=t.rotY+Math.sin(elapsed*0.7+i*2)*0.08;
  }

  // Animated dragonflies hovering and wing flutter
  for(const df of dragonflies){
   const a=df.phase+elapsed*df.speed,sa=Math.sin(a),ca=Math.cos(a);
   const fx=df.cx+df.rx*ca, fz=df.cz+df.rz*sa;
   const fy=df.cy+Math.sin(elapsed*3.5+df.phase)*0.06;
   const yaw=Math.atan2(-df.rx*sa, df.rz*ca)+Math.PI/2;
   df.group.position.set(fx,fy,fz);
   df.group.rotation.set(0,yaw,0);
   const wingFlap=Math.sin(elapsed*42+df.phase)*0.32;
   for(const w of df.wings){
    w.fore.rotation.z=wingFlap*w.side;
    w.hind.rotation.z=-wingFlap*w.side*0.8;
   }
  }
 }
 tick(0);return {dynamicRoots,tick};
}
