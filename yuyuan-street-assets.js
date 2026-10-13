import * as THREE from './three.module.js';
import {YUYUAN_BUILDINGS} from './yuyuan-layout.js';

// Geometry stays in district-local coordinates; the district root supplies Z+60.
export function createYuyuanStreetAssets(root,{cube,mat,board}){
 const fixtures=[],dynamicRoots=new Set(),shops=[],goods={},stockCaps={};
 const specs=[
  ['yuyuan-street-0','九曲糕点','street-cakes','江南糕团礼盒','pastry',2,'#852f36'],
  ['yuyuan-street-1','豫园梨膏糖','street-candy','梨膏糖礼盒','candy',1,'#91533a'],
  ['yuyuan-street-2','老城五香豆','street-beans','五香豆罐','beans',1,'#697047'],
  ['yuyuan-street-3','江南扇坊','street-fans','江南折扇','fan',0,'#497278'],
  ['yuyuan-street-4','春风茶器','street-teaware','青花茶具套装','tea',0,'#45667b'],
  ['yuyuan-street-5','锦绣绸庄','street-silk-fans','绸面团扇','fan',0,'#895875'],
  ['yuyuan-street-6','灯彩工坊','street-lanterns','江南花灯','lantern',0,'#9e482c'],
  ['yuyuan-south-west','南市茶食','south-pastry','桂花糕点礼盒','pastry',2,'#786944'],
  ['yuyuan-south-east','听雨茶庄','south-teaware','白瓷茶具套装','tea',0,'#52715b']
 ];
 const boxGeometry=new THREE.BoxGeometry(1,1,1),sphere=new THREE.SphereGeometry(1,8,5),cylinder=new THREE.CylinderGeometry(1,1,1,10),ring=new THREE.TorusGeometry(1,.075,4,12);
 const glassMaterial=new THREE.MeshLambertMaterial({color:'#d9ece8',transparent:true,opacity:.2,depthWrite:false});
 const timber='#57372a',gold='#c8a663',cream='#eee1bd';
 function mesh(parent,g,c,x,y,z,sx,sy,sz){const m=new THREE.Mesh(g,typeof c==='string'?mat(c):c);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 function box(parent,c,x,y,z,w,h,d){return mesh(parent,boxGeometry,c,x,y,z,w,h,d);}
 function disk(parent,c,x,y,z,r,h){return mesh(parent,cylinder,c,x,y,z,r,h,r);}
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
  // Brass-edged open door matches the three voxel columns x-1 through x+1.
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
  // The central aisle stops at an obvious shop counter, with space to stand.
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
  board('江南好物 · 入店选购',x,28.6,back-.21,rx*1.3,.42,Math.PI);fixtures.push({x,z:back,rx:rx-.57,rz:.3,y:26,h:2.7});
  for(const dx of [-1.8,1.8]){cube(timber,x+dx,28.95,z-.5,.055,.25,.055);cube(gold,x+dx,28.83,z-.5,.57,.06,.57);cube('#fff0c2',x+dx,28.61,z-.5,.49,.37,.49,true);cube(gold,x+dx,28.41,z-.5,.57,.06,.57);for(const side of [-1,1])cube(timber,x+dx+side*.255,28.6,z-.5,.027,.42,.52);}
  if(westFacing){
   // Upstairs redwood lattice windows continue the street-facing facade.
   for(const dx of [-2.5,-.85,.85,2.5]){
    cube(timber,x+dx,31.5,front-.055,1.32,1.62,.08);cube('#b7c5b9',x+dx,31.5,front-.102,1.14,1.42,.016);
    for(const bar of [-.36,0,.36])cube(timber,x+dx+bar,31.5,front-.12,.045,1.48,.025);
    for(const y of [30.83,31.28,31.73,32.17])cube(timber,x+dx,y,front-.12,1.21,.05,.025);
    cube(gold,x+dx,30.68,front-.05,1.44,.085,.2);
   }
   // Build once in the original north-facing frame, then turn only this shop
   // toward the west-side shopping lane. Stock groups retain their identities.
   for(let i=childStart;i<root.children.length;i++){const object=root.children[i],dx=object.position.x-x,dz=object.position.z-z;object.position.x=x+dz;object.position.z=z-dx;object.quaternion.premultiply(westFacingRotation);}
   for(let i=fixtureStart;i<fixtures.length;i++){const f=fixtures[i],dx=f.x-x,dz=f.z-z,rx=f.rx;f.x=x+dz;f.z=z-dx;f.rx=f.rz;f.rz=rx;}
   const shop=shops[shops.length-1],dx=shop.x-x,dz=shop.z-z;shop.x=x+dz;shop.z=z-dx;
  }
 }
 function setStocks(stocks={}){for(const [key,units]of Object.entries(goods)){const count=Number.isFinite(stocks[key])?Math.max(0,Math.min(units.length,Math.floor(stocks[key]))):units.length;units.forEach((group,i)=>{group.visible=i<count;});}}
 setStocks();return {fixtures,dynamicRoots,shops,goods,stockCaps,setStocks};
}
