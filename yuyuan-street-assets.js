import * as THREE from './three.module.js';
import {YUYUAN_BUILDINGS,GARDEN_PONDS} from './yuyuan-layout.js';

// Geometry stays in district-local coordinates; the district root supplies Z+60.
export function createYuyuanStreetAssets(root,{cube,mat,board}){
 const fixtures=[],dynamicRoots=new Set(),shops=[],goods={},stockCaps={};
 const specs=[
  ['yuyuan-street-0','宁波汤团店','street-cakes','传统手工汤团礼盒','pastry',2,'#852f36'],
  ['yuyuan-street-1','上海梨膏糖','street-candy','百年非遗梨膏糖礼盒','candy',1,'#91533a'],
  ['yuyuan-street-2','老城五香豆','street-beans','郭记奶油五香豆罐','beans',1,'#697047'],
  ['yuyuan-street-3','丽云阁扇庄','street-fans','光绪老字号名扇','fan',0,'#497278'],
  ['yuyuan-street-4','湖心亭茶庄','street-teaware','青花龙井茶具套装','tea',0,'#45667b'],
  ['yuyuan-street-5','老庙黄金','street-silk-fans','古法福运团扇','fan',0,'#895875'],
  ['yuyuan-street-6','豫园灯彩行','street-lanterns','国家非遗豫园花灯','lantern',0,'#9e482c'],
  ['yuyuan-south-west','万有全腌腊','south-pastry','金牌熟食风味礼盒','pastry',2,'#786944'],
  ['yuyuan-south-east','童涵春堂','south-teaware','乾隆老字号本草香茗','tea',0,'#52715b']
 ];
 const boxGeometry=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,8,5),cylinder=new THREE.CylinderGeometry(1,1,1,10),ring=new THREE.TorusGeometry(1,.075,4,12);
 const glassMaterial=new THREE.MeshLambertMaterial({color:'#d9ece8',transparent:true,opacity:.2,depthWrite:false});
 const timber='#57372a',gold='#c8a663',cream='#eee1bd';
 function mesh(parent,g,c,x,y,z,sx,sy,sz){const m=new THREE.Mesh(g,typeof c==='string'?mat(c):c);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 function box(parent,c,x,y,z,w,h,d){return mesh(parent,boxGeometry,c,x,y,z,w,h,d);}
 function disk(parent,c,x,y,z,r,h){return mesh(parent,cylinder,c,x,y,z,r,h,r);}
 function crown(x,y,z,rx,ry,rz,color='#5c824c'){return mesh(root,sphere,color,x,y,z,rx,ry,rz);}
 function trimBox(parent,c,x,y,z,w,h,d){box(parent,c,x,y,z,w,h,d);for(const side of [-1,1])box(parent,gold,x+side*(w/2-.035),y,z-d/2-.01,.025,h,.018);}
 function product(parent,type,accent){
  if(type==='pastry'){
   box(parent,timber,0,.045,0,.55,.09,.4);box(parent,cream,0,.096,0,.51,.025,.36);
   for(let i=0;i<4;i++){const x=(i%2-.5)*.25,z=(Math.floor(i/2)-.5)*.17;disk(parent,i%2?'#b4bf86':'#eee2bc',x,.16,z,.1,.1);box(parent,'#ab7155',x,.215,z,.065,.012,.065);}
  }else if(type==='candy'){
   trimBox(parent,'#963a34',0,.14,0,.43,.28,.34);box(parent,cream,0,.289,0,.36,.012,.27);box(parent,gold,0,.3,0,.045,.012,.3);box(parent,gold,0,.305,0,.38,.013,.035);for(let i=0;i<2;i++)box(parent,timber,(i-.5)*.11,.308,0,.034,.012,.12);
  }else if(type==='beans'){
   disk(parent,'#af8354',0,.2,0,.19,.4);disk(parent,timber,0,.416,0,.21,.055);box(parent,cream,0,.23,-.191,.2,.22,.022);for(let i=0;i<3;i++)box(parent,timber,(i-1)*.045,.23,-.208,.02,.09,.015);
  }else if(type==='fan'){
   box(parent,timber,0,.14,0,.035,.28,.035);
   for(let i=0;i<7;i++){const a=(i-3)*.23,rib=box(parent,timber,Math.sin(a)*.2,.18+Math.cos(a)*.2,0,.018,.4,.018);rib.rotation.z=-a;const leaf=box(parent,i%2?cream:accent,Math.sin(a)*.33,.18+Math.cos(a)*.33,.015,.115,.21,.024);leaf.rotation.z=-a;}
  }else if(type==='tea'){
   box(parent,timber,0,.035,0,.59,.07,.44);mesh(parent,sphere,cream,-.1,.19,0,.15,.115,.15);disk(parent,accent,-.1,.3,0,.12,.025);mesh(parent,sphere,gold,-.1,.332,0,.025,.03,.025);
   const spout=mesh(parent,cylinder,cream,.035,.225,0,.038,.14,.038);spout.rotation.z=-.6;
   const handle=mesh(parent,ring,accent,-.245,.195,0,.1,.12,.1);handle.rotation.y=Math.PI/2;
   for(const z of [-.11,.11]){disk(parent,cream,.18,.15,z,.065,.12);disk(parent,'#755129',.18,.214,z,.052,.008);}
  }else{
   disk(parent,gold,0,.065,0,.14,.045);mesh(parent,sphere,accent,0,.265,0,.2,.23,.2);disk(parent,gold,0,.475,0,.13,.04);box(parent,gold,0,.535,0,.045,.09,.045);
   for(const x of [-.14,0,.14])box(parent,gold,x,.265,-Math.sqrt(.04-x*x)-.008,.015,.35,.017);
   box(parent,gold,0,.025,0,.045,.055,.045);
  }
 }
 function stock(key,type,accent,x,y,z){const group=new THREE.Group();group.name='yuyuan-street-stock-'+key;group.position.set(x,y,z);group.userData.yuyuanStock=key;root.add(group);product(group,type,accent);goods[key].push(group);dynamicRoots.add(group);}
 function decorative(type,accent,x,y,z,scale=.7){const group=new THREE.Group();group.position.set(x,y,z);group.scale.setScalar(scale);root.add(group);product(group,type,accent);}
 const westFacingRotation=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);
 for(const [id,title,key,name,type,food,accent]of specs){
  const physical=YUYUAN_BUILDINGS.find(building=>building.id===id);if(!physical)continue;
  const westFacing=id.startsWith('yuyuan-street-'),b=westFacing?{...physical,rx:4,rz:5}:physical;
  const childStart=root.children.length,fixtureStart=fixtures.length;
  const {x,z,rx,rz}=b,front=z-rz,back=z+rz-.5,doorX=x+.5,counterZ=z+1.6;
  shops.push({id,x:doorX,z,title,key,name,food});goods[key]=[];stockCaps[key]=6;
  for(const side of [-1,1]){cube(timber,doorX+side*1.62,27.5,front-.07,.2,3,.17);cube(gold,doorX+side*1.62,27.5,front-.17,.025,2.94,.025);}
  cube(timber,x,29.27,front-.015,rx*2-.35,.5,.12);cube(gold,x,29.55,front-.06,rx*2-.25,.055,.17);
  board(title,x,29.26,front-.08,rx*1.58,.68,Math.PI);
  for(const side of [-1,1]){
   const caseX=side<0?x-rx+1.15:x+rx-.8,width=side<0?Math.max(.6,rx-2.6):Math.max(.6,rx-3.1);
   cube(timber,caseX,26.5,front-.02,width,.9,.12);mesh(root,boxGeometry,glassMaterial,caseX,27.76,front-.045,width,1.55,.027);
   for(const y of [26.98,28.55])cube(gold,caseX,y,front-.08,width,.055,.04);
   cube(timber,caseX,27.77,front-.08,.045,1.6,.05);decorative(type,accent,caseX,27.05,front+.24,.55);
   fixtures.push({x:caseX,z:front,rx:width/2,rz:.19,y:26,h:2.65});
  }
  cube('#e5d7bc',x,26.035,z,rx*2-1,.025,rz*2-1.2);cube('#3d332b',x,26.055,z,rx*2-1.55,.016,rz*2-1.75);cube('#d8cbb4',x,26.075,z,rx*2-1.8,.016,rz*2-2);
  cube(accent,doorX,26.089,z-1.4,2.65,.014,rz*2-3.8);for(const dx of [-1.27,1.27])cube(gold,doorX+dx,26.1,z-1.4,.028,.008,rz*2-4);
  for(let dz=-rz+1.2;dz<rz-.7;dz+=1.35)for(const side of [-1,1])cube('#aa9875',x+side*(rx-1.25),26.087,z+dz,.82,.012,.06);
  const counterWidth=rx*1.4;cube(timber,doorX,26.54,counterZ,counterWidth,1.08,1.1);cube(gold,doorX,27.11,counterZ,counterWidth+.09,.06,1.17);cube(accent,doorX,27.153,counterZ,counterWidth-.13,.025,1.02);
  fixtures.push({x:doorX,z:counterZ,rx:counterWidth/2,rz:.55,y:26,h:1.23});
  for(const dx of [-counterWidth/2+.16,counterWidth/2-.16])cube(gold,doorX+dx,26.55,counterZ-.562,.04,1,.035);
  for(let i=0;i<6;i++)stock(key,type,accent,doorX+(i%3-1)*.9,27.18,counterZ+(Math.floor(i/3)-.5)*.48);
  for(const side of [-1,1]){
   const caseX=x+side*(rx-.7);cube(timber,caseX,27.25,z,.55,2.5,rz*2-1.7);cube(accent,caseX-side*.285,27.3,z,.025,2.16,rz*2-2.05);
   for(const y of [26.8,27.5,28.2]){cube(gold,caseX-side*.12,y,z,.72,.055,rz*2-1.9);for(const dz of [-1.25,1.25])decorative(type,accent,caseX-side*.23,y+.04,z+dz,.55);}
   fixtures.push({x:caseX,z,rx:.34,rz:rz-.85,y:26,h:2.5});
  }
  cube(timber,x,27.35,back,rx*2-1.15,2.7,.3);for(const y of [26.8,27.5,28.2])cube(gold,x,y,back-.18,rx*2-1.25,.055,.5);
  for(let i=-1;i<=1;i++){decorative(type,accent,x+i*1.3,27.55,back-.22,.65);box(root,['#718779','#9b6670','#657a99'][i+1],x+i*1.3,26.92,back-.2,.65,.16,.31);box(root,gold,x+i*1.3,27.01,back-.2,.045,.018,.3);}
  board('匠心老字号 · 江南风物',x,28.6,back-.21,rx*1.3,.42,Math.PI);fixtures.push({x,z:back,rx:rx-.57,rz:.3,y:26,h:2.7});
  for(const dx of [-1.8,1.8]){cube(timber,x+dx,28.95,z-.5,.055,.25,.055);cube(gold,x+dx,28.83,z-.5,.57,.06,.57);cube('#fff0c2',x+dx,28.61,z-.5,.49,.37,.49,true);cube(gold,x+dx,28.41,z-.5,.57,.06,.57);for(const side of [-1,1])cube(timber,x+dx+side*.255,28.6,z-.5,.027,.42,.52);}
  if(westFacing){
   for(const dx of [-2.5,-.85,.85,2.5]){
    cube(timber,x+dx,31.5,front-.055,1.32,1.62,.08);cube('#b7c5b9',x+dx,31.5,front-.102,1.14,1.42,.016);
    for(const bar of [-.36,0,.36])cube(timber,x+dx+bar,31.5,front-.12,.045,1.48,.025);
    for(const y of [30.83,31.28,31.73,32.17])cube(timber,x+dx,y,front-.12,1.21,.05,.025);
    cube(gold,x+dx,30.68,front-.05,1.44,.085,.2);
   }
   for(let i=childStart;i<root.children.length;i++){const object=root.children[i],dx=object.position.x-x,dz=object.position.z-z;object.position.x=x+dz;object.position.z=z-dx;object.quaternion.premultiply(westFacingRotation);}
   for(let i=fixtureStart;i<fixtures.length;i++){const f=fixtures[i],dx=f.x-x,dz=f.z-z,rx=f.rx;f.x=x+dz;f.z=z-dx;f.rx=f.rz;f.rz=rx;}
   const shop=shops[shops.length-1],dx=shop.x-x,dz=shop.z-z;shop.x=x+dz;shop.z=z-dx;
  }
 }

 // 1. Traditional Carved Stone Paifang Archways (石牌坊)
 function paifang(x,z,yaw=0,title='豫园商城 · 老城厢'){
  const pGroup=new THREE.Group();pGroup.position.set(x,26,z);pGroup.rotation.y=yaw;root.add(pGroup);
  // Four carved stone pillars
  for(const px of [-5.2,-2.6,2.6,5.2]){
   box(pGroup,'#c8c9be',px,2.2,0,.45,4.4,.45);
   box(pGroup,'#afb1a4',px,.5,0,.75,1,.75); // Pillar base stone (抱鼓石)
   fixtures.push({x:x+px*Math.cos(yaw),z:z+px*Math.sin(yaw),rx:.35,rz:.35,y:26,h:4.4});
  }
  // Cross beams & DouGong
  box(pGroup,'#b9baa9',0,4.2,0,11.2,.42,.32);
  box(pGroup,'#a5a796',0,4.7,0,6.2,.38,.32);
  // Center calligraphy board
  board(title,x,29.9,z,4,.65,yaw);
  // Pitch tile roof of paifang
  box(pGroup,'#424d45',0,5.1,0,6.4,.22,1.2);
  box(pGroup,'#566159',0,5.25,0,6.2,.1,.3);
  for(const side of [-1,1]){
   box(pGroup,'#424d45',side*3.9,4.4,0,3,.2,1.1);
   box(pGroup,'#566159',side*3.9,4.52,0,2.8,.1,.28);
  }
 }
 paifang(-46.5,148,0,'上海老城厢 · 豫园商城');

 // 2. Wide Open Commercial Pedestrian Sky (开阔视野，无遮挡步行天街)

 // 3. Bazaar Open Plaza (露天市集开阔集散广场，地铁口完全畅通无阻)

 // 4. Market Plaza Stalls (露天民俗市集木质榫卯摊位)
 for(let i=0;i<4;i++){
  const bx=-74,bz=152+i*5;
  box(root,'#6b4a36',bx,26.5,bz,1.8,.9,1.2);
  box(root,'#d8c69f',bx,27,bz,2,.08,1.4);
  fixtures.push({x:bx,z:bz,rx:.9,rz:.6,y:26,h:1});
  // Striped awning
  for(const side of [-1,1])box(root,'#8e3a32',bx+side*.8,27.9,bz,.06,1.8,.06);
  box(root,'#8a3229',bx,28.8,bz,1.9,.1,1.5);
  // Merchandise samples
  product(root,['pastry','candy','fan','lantern'][i],'#96423a');
 }

 // 6. North Promenade Trees (strictly in north pond plaza, none in commercial streets)
 const streetTrees=[[-68,162],[-54,162],[-38,162],[-68,188],[-54,188],[-20,162],[-10,162]];
 for(const [tx,tz]of streetTrees){
  // Carved stone flower box
  box(root,'#9fa193',tx,26.35,tz,1.6,.7,1.6);
  fixtures.push({x:tx,z:tz,rx:.8,rz:.8,y:26,h:.8});
  // Camphor / Magnolia trunk & rich evergreen crown
  box(root,'#5c4a38',tx,28,tz,.22,3.2,.22);
  crown(tx,30.2,tz,2.2,1.8,2.2,'#3f663b');
  crown(tx+.4,29.8,tz-.4,1.7,1.4,1.7,'#487242');
 }

 // Traditional Carved Stone Lions Guarding Heritage Street Entrances (老字号门前石狮 - 参考图 user_night_lantern_crowd.jpg)
 function stoneLion(x,z,yaw=0){
  const g=new THREE.Group();g.position.set(x,26,z);g.rotation.y=yaw;root.add(g);
  box(g,'#8f9184',0,.2,0,.8,.4,.8);
  box(g,'#7f8174',0,.5,0,.6,.3,.6);
  box(g,'#9ba092',0,.85,0,.45,.45,.45);
  box(g,'#a4a89b',0,1.15,.08,.38,.34,.35);
  box(g,'#653e2d',0,.48,.28,.14,.14,.14);
  fixtures.push({x,z,rx:.4,rz:.4,y:26,h:1.3});
 }
 stoneLion(-43.2,149.5,-Math.PI/2);
 stoneLion(-49.8,149.5,Math.PI/2);
 stoneLion(-90.8,156,-Math.PI/2);
 stoneLion(-109.2,156,Math.PI/2);
 stoneLion(11.8,156,-Math.PI/2);
 stoneLion(24.2,156,Math.PI/2);

 // 7. Overhead Festive Drum Lantern Canopy across Pedestrian Streets (老街飞檐过街彩灯天幕 - 参考图 user_street_day_lanterns.jpg & user_night_lantern_crowd.jpg)
 const streetLanternCables = [
  // West Commercial Pedestrian Street (西侧18米宽阔商业街：全长115米高密彩灯天幕)
  {x1: -108.5, x2: -91.5, z: 156, y: 30.5},
  {x1: -108.5, x2: -91.5, z: 164, y: 30.3},
  {x1: -108.5, x2: -91.5, z: 172, y: 30.5},
  {x1: -108.5, x2: -91.5, z: 180, y: 30.3},
  {x1: -108.5, x2: -91.5, z: 188, y: 30.5},
  {x1: -108.5, x2: -91.5, z: 196, y: 30.3},
  {x1: -108.5, x2: -91.5, z: 204, y: 30.5},
  {x1: -108.5, x2: -91.5, z: 212, y: 30.3},
  {x1: -108.5, x2: -91.5, z: 220, y: 30.5},
  {x1: -108.5, x2: -91.5, z: 228, y: 30.3},
  {x1: -108.5, x2: -91.5, z: 236, y: 30.5},
  {x1: -108.5, x2: -91.5, z: 244, y: 30.3},
  {x1: -108.5, x2: -91.5, z: 252, y: 30.5},
  // East Commercial Pedestrian Street (东侧12米宽阔商业街：全长115米高密彩灯天幕)
  {x1: 12.5, x2: 23.5, z: 156, y: 30.4},
  {x1: 12.5, x2: 23.5, z: 164, y: 30.2},
  {x1: 12.5, x2: 23.5, z: 172, y: 30.5},
  {x1: 12.5, x2: 23.5, z: 180, y: 30.2},
  {x1: 12.5, x2: 23.5, z: 188, y: 30.5},
  {x1: 12.5, x2: 23.5, z: 196, y: 30.2},
  {x1: 12.5, x2: 23.5, z: 204, y: 30.5},
  {x1: 12.5, x2: 23.5, z: 212, y: 30.2},
  {x1: 12.5, x2: 23.5, z: 220, y: 30.5},
  {x1: 12.5, x2: 23.5, z: 228, y: 30.2},
  {x1: 12.5, x2: 23.5, z: 236, y: 30.5},
  {x1: 12.5, x2: 23.5, z: 244, y: 30.2},
  {x1: 12.5, x2: 23.5, z: 252, y: 30.5},
  // North Entrance Paifang & Huxinting Plaza Entrance
  {x1: -52, x2: -41, z: 151, y: 30.6},
  {x1: -52, x2: -41, z: 156, y: 30.4}
 ];

 const lanternColors = ['#ffc848', '#e63428', '#ffda68', '#d82d24', '#ffbf3b', '#e84232'];
 for(const {x1, x2, z, y} of streetLanternCables){
  const cx = (x1 + x2) / 2, len = Math.abs(x2 - x1);
  box(root, '#3b2f24', cx, y, z, len, .035, .035);
  const count = Math.max(3, Math.floor(len / 1.6));
  for(let i = 0; i < count; i++){
   const t = (i + 0.5) / count, lx = x1 + (x2 - x1) * t, sag = Math.sin(t * Math.PI) * 0.28, ly = y - sag;
   box(root, '#785b3b', lx, ly - 0.12, z, .02, .24, .02);
   const color = lanternColors[(Math.floor(z * 3 + lx * 2) % lanternColors.length + lanternColors.length) % lanternColors.length];
   const lantern = new THREE.Mesh(cylinder, mat(color, true));
   lantern.position.set(lx, ly - 0.38, z); lantern.scale.set(.22, .48, .22); root.add(lantern);
   const core = new THREE.Mesh(cylinder, mat('#fff9d4', true));
   core.position.set(lx, ly - 0.38, z); core.scale.set(.09, .42, .09); root.add(core);
   disk(root, gold, lx, ly - 0.14, z, .18, .035);
   disk(root, gold, lx, ly - 0.62, z, .17, .035);
   box(root, '#d42d22', lx, ly - 0.78, z, .035, .28, .035);
   disk(root, gold, lx, ly - 0.65, z, .05, .025);
  }
 }

 function setStocks(stocks={}){for(const [key,units]of Object.entries(goods)){const count=Number.isFinite(stocks[key])?Math.max(0,Math.min(units.length,Math.floor(stocks[key]))):units.length;units.forEach((group,i)=>{group.visible=i<count;});}}
 setStocks();return {fixtures,dynamicRoots,shops,goods,stockCaps,setStocks};
}

