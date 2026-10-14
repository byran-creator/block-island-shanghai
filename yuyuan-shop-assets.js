import * as THREE from './three.module.js';

// Local district coordinates; the caller owns the district's world Z offset.
export function createYuyuanShopAssets(root,{cube,mat,board}){
 const fixtures=[],goods={buns:[],candy:[],souvenir:[],tea:[]};
 const shapes={box:new THREE.BoxGeometry(1,1,1),round:new THREE.SphereGeometry(1,10,6),pot:new THREE.CylinderGeometry(.8,1,1,12),dish:new THREE.CylinderGeometry(1,1,1,16),ring:new THREE.TorusGeometry(1,.08,5,16)};
 const glass=new THREE.MeshLambertMaterial({color:'#d9ece8',transparent:true,opacity:.19,depthWrite:false});
 const timber='#573123',dark='#31231e',gold='#c9a45e',ivory='#eee4ce',blue='#2e6670';
 function mesh(parent,geometry,color,x,y,z,sx,sy,sz){const m=new THREE.Mesh(geometry,typeof color==='string'?mat(color):color);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;}
 function box(parent,color,x,y,z,sx,sy,sz){return mesh(parent,shapes.box,color,x,y,z,sx,sy,sz);}
 function solid(x,z,rx,rz,y,h){fixtures.push({x,z,rx,rz,y,h});}
 function ring(parent,color,x,y,z,r){const m=mesh(parent,shapes.ring,color,x,y,z,r,r,r);m.rotation.x=Math.PI/2;return m;}
 function steamer(parent,x,y,z,r=.36){mesh(parent,shapes.dish,'#bb945e',x,y+.065,z,r,.13,r);ring(parent,'#745030',x,y+.13,z,r);for(let i=0;i<5;i++)box(parent,'#d6b67f',x,y+.142,z+(i-2)*r*.3,r*1.65,.025,.022);}
 function bun(parent,x,y,z,r=.135){mesh(parent,shapes.round,'#fff1ce',x,y+r*.55,z,r,r*.76,r);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const fold=box(parent,'#decfae',x+Math.cos(a)*r*.36,y+r*.97,z+Math.sin(a)*r*.36,.017,.025,r*.45);fold.rotation.y=-a;}mesh(parent,shapes.round,'#decda4',x,y+r*1.02,z,.029,.018,.029);}
 function cup(parent,x,y,z,r=.11){mesh(parent,shapes.pot,ivory,x,y+.075,z,r,.15,r);ring(parent,blue,x,y+.15,z,r*.81);mesh(parent,shapes.dish,'#754a27',x,y+.153,z,r*.72,.008,r*.72);}
 function teapot(parent,x,y,z,scale=.3){mesh(parent,shapes.round,blue,x,y+scale*.62,z,scale,scale*.68,scale);mesh(parent,shapes.dish,ivory,x,y+scale*1.2,z,scale*.66,.04,scale*.66);mesh(parent,shapes.round,gold,x,y+scale*1.32,z,.045,.05,.045);const spout=mesh(parent,shapes.pot,blue,x+scale*.86,y+scale*.85,z,.075,scale*.8,.075);spout.rotation.z=-.72;const handle=mesh(parent,shapes.ring,blue,x-scale*.95,y+scale*.66,z,scale*.52,scale*.61,scale*.52);handle.rotation.y=Math.PI/2;}
 function candyBox(parent,x,y,z){box(parent,'#932d2d',x,y+.14,z,.36,.28,.3);box(parent,ivory,x,y+.285,z,.28,.012,.22);box(parent,gold,x,y+.297,z,.04,.01,.26);box(parent,gold,x,y+.301,z,.3,.012,.035);}
 function beanJar(parent,x,y,z){mesh(parent,shapes.pot,'#aa7546',x,y+.19,z,.2,.38,.2);mesh(parent,shapes.dish,dark,x,y+.39,z,.22,.055,.22);box(parent,ivory,x,y+.2,z-.202,.21,.18,.014);for(let i=0;i<3;i++)box(parent,gold,x+(i-1)*.06,y+.2,z-.212,.025,.1,.01);}
 function fan(parent,x,y,z){const group=new THREE.Group();group.position.set(x,y,z);parent.add(group);for(let i=0;i<9;i++){const a=(i-4)*.2;const rib=box(group,timber,Math.sin(a)*.2,.15+Math.cos(a)*.2,0,.018,.4,.018);rib.rotation.z=-a;const leaf=box(group,i%2?ivory:'#d2bc88',Math.sin(a)*.36,.15+Math.cos(a)*.36,.009,.1,.18,.024);leaf.rotation.z=-a;}return group;}
 function silk(parent,x,y,z,col){box(parent,col,x,y+.08,z,.42,.16,.28);for(let i=-1;i<=1;i++)box(parent,gold,x+i*.13,y+.168,z,.035,.014,.26);}
 function scroll(parent,x,y,z){box(parent,ivory,x,y+.26,z,.27,.52,.025);for(const h of [0,.53]){const rod=mesh(parent,shapes.dish,timber,x,y+h,z,.028,.35,.028);rod.rotation.z=Math.PI/2;}for(let i=0;i<4;i++){box(parent,dark,x+.035,y+.43-i*.085,z-.017,.07,.025,.009);box(parent,dark,x-.018,y+.45-i*.085,z-.017,.016,.05,.009);}}
 function stocked(key,x,y,z,make){const g=new THREE.Group();g.name='yuyuan-stock-'+key;g.position.set(x,y,z);g.userData.yuyuanStock=key;root.add(g);make(g);goods[key].push(g);return g;}
 function counter(x,z,w=3.3){cube(timber,x,26.55,z,w,1.1,1.2);cube(gold,x,27.125,z,w+.08,.06,1.28);cube('#7f2628',x,27.17,z,w-.15,.025,1.1);for(const dx of [-w/2+.15,w/2-.15])cube(gold,x+dx,26.55,z-.61,.055,1,.025);solid(x,z,w/2,.6,26,1.25);}
 function showroom({x,z,rx,rz,title,accent}){
  const front=z-rz+.14,back=z+rz-.35;
  cube(ivory,x,26.028,z,rx*2-1,.035,rz*2-.7);
  cube(dark,x,26.053,z,rx*2-1.6,.014,rz*2-1.3);
  cube('#e5d6b4',x,26.067,z,rx*2-1.86,.014,rz*2-1.56);
  for(let dx=-rx+1.5;dx<rx-1;dx+=1.3)for(let dz=-rz+1;dz<rz-.8;dz+=1.3)cube('#cdbd9f',x+dx,26.079,z+dz,.06,.01,1.02);
  // Thin rug and tile inlays are visual surfaces, never floor blockers.
  cube(accent,x,26.085,z,2.65,.018,rz*2-1.8);for(const dx of [-1.24,1.24])cube(gold,x+dx,26.101,z,.03,.009,rz*2-2);
  for(const dx of [-1.62,1.62]){cube(timber,x+dx,27.6,front,.22,3.2,.2);cube(gold,x+dx,27.62,front-.13,.035,3.06,.03);}
  cube(timber,x,29.28,front,rx*2-.4,.36,.28);cube(gold,x,29.49,front,rx*2-.3,.06,.34);
  board(title,x,29.18,front-.16,rx*1.58,.72,Math.PI);
  for(const side of [-1,1]){
   const width=rx-2.12,cx=x+side*(1.78+width/2);
   cube(timber,cx,26.6,front,width,1.1,.15);mesh(root,shapes.box,glass,cx,27.95,front,width,1.58,.025);
   for(const y of [27.2,28.7])cube(gold,cx,y,front-.025,width,.06,.055);
   cube(timber,cx,27.92,front,.045,1.6,.06);cube(accent,cx,27.19,front+.33,width-.12,.08,.6);
   solid(cx,front,width/2,.18,26,2.75);
  }
  // Wall display cases stay away from the three-block center aisle.
  for(const side of [-1,1]){
   const cx=x+side*(rx-.72);
   cube(timber,cx,27.45,z,.62,2.85,rz*2-1.3);cube(accent,cx-side*.33,27.48,z,.025,2.5,rz*2-1.65);
   for(const y of [26.85,27.55,28.25])cube(gold,cx-side*.23,y,z,.8,.055,rz*2-1.45);
   solid(cx,z,.36,rz-.65,26,2.85);
  }
  cube(timber,x,27.45,back,rx*2-1.1,2.9,.3);for(const y of [26.85,27.55,28.25])cube(gold,x,y,back-.2,rx*2-1.3,.06,.55);
  board('匠心老字号 · 江南风物',x,28.83,back-.37,rx*1.22,.5,Math.PI);
  solid(x,back,rx-.55,.3,26,2.9);
  // Warm ceiling lanterns use emissive geometry, avoiding extra per-shop lights.
  for(const dx of [-2.3,2.3]){cube(timber,x+dx,29.28,z,.07,.56,.07);cube(gold,x+dx,29.01,z,.66,.06,.66);cube('#fff2c4',x+dx,28.77,z,.56,.42,.56,true);for(const ax of [-.3,.3])cube(timber,x+dx+ax,28.77,z,.04,.46,.62);cube(gold,x+dx,28.53,z,.66,.05,.66);}
  return {front,back};
 }
 const food=showroom({x:-26,z:214,rx:6,rz:4,title:'南翔馒头店 · 小笼名点',accent:'#792925'});
 for(const side of [-1,1]){
  const cx=-26+side*3.22;counter(cx,213,3.1);
  for(let j=0;j<6;j++){const dx=(j%3-1)*.84,dz=(Math.floor(j/3)-.5)*.49;stocked('buns',cx+dx,27.21,213+dz,g=>{steamer(g,0,0,0,.33);bun(g,0,.16,0,.18);});}
  for(let j=0;j<4;j++)stocked('candy',cx+(j-1.5)*.7,27.61,food.back-.31,g=>candyBox(g,0,0,0));
  for(const dz of [-1.1,0,1.1]){steamer(root,-26+side*5.08,27.62,214+dz,.32);bun(root,-26+side*5.08,27.77,214+dz,.16);beanJar(root,-26+side*5.08,28.31,214+dz);}
 }
 const craft=showroom({x:-62,z:214,rx:6,rz:4,title:'丽云阁扇庄 · 丝绸扇艺',accent:'#285047'});
 for(const side of [-1,1]){
  const cx=-62+side*3.22;counter(cx,213,3.1);
  for(let j=0;j<3;j++)stocked('souvenir',cx+(j-1)*.85,27.22,213,g=>{if(j===0)fan(g,0,0,0);else if(j===1)silk(g,0,0,0,side<0?'#ab4152':'#476f9a');else scroll(g,0,0,0);});
  for(const dz of [-1.1,0,1.1]){silk(root,-62+side*5.08,26.9,214+dz,dz===0?'#9d4862':'#53868a');fan(root,-62+side*5.08,27.6,214+dz);}
  for(let j=0;j<3;j++)scroll(root,cx+(j-1)*.9,27.65,craft.back-.38);
 }
 const tea=showroom({x:-65,z:163,rx:5,rz:3,title:'湖心亭茶楼 · 乾隆名茶',accent:'#4b5040'});
 for(const side of [-1,1]){
  const cx=-65+side*2.85;counter(cx,163,2.25);
  for(let j=0;j<3;j++)stocked('tea',cx+(j-1)*.6,27.22,163,g=>{box(g,'#99724e',0,.03,0,.5,.06,.48);teapot(g,-.05,.07,0,.17);cup(g,.19,.08,-.15,.067);cup(g,.19,.08,.14,.067);});
  for(const dz of [-.85,.85]){teapot(root,-65+side*4.1,27.62,163+dz,.23);beanJar(root,-65+side*4.1,26.9,163+dz);}
  teapot(root,cx,28.31,tea.back-.36,.28);for(const dx of [-.5,.5])cup(root,cx+dx,27.62,tea.back-.36,.15);
 }
 function setStocks(stocks={}){for(const [key,units]of Object.entries(goods)){const value=stocks[key],count=Number.isFinite(value)?Math.max(0,Math.min(units.length,Math.floor(value))):units.length;units.forEach((g,i)=>{g.visible=i<count;});}}
 setStocks();return {fixtures,goods,setStocks};
}
