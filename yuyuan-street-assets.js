import * as THREE from './three.module.js';
import {YUYUAN_BUILDINGS,GARDEN_PONDS} from './yuyuan-layout.js';

// Geometry stays in district-local coordinates; the district root supplies Z+60.
export function createYuyuanStreetAssets(root,{cube,mat,board,getPos=null}){
 const fixtures=[],dynamicRoots=new Set(),shops=[],extraShops=[],goods={},stockCaps={};
 const vendors=[],swayingObjects=[],flickeringLights=[],shopLights=[];
 
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

 const BAZAAR_EXTRA_SHOPS = [
  // West Outer Row (x = -107, rx = 5, facing East towards street at x = -96.5)
  {id:'bazaar-west-candy', title:'上海梨膏糖坊', bannerChar:'糖', facing:'east', type:'candy', accent:'#963a34', awning:'#8a2824', callZh:'百年老字号梨膏糖，止咳化痰，甜如蜜糖嘞——', callEn:'Traditional Pear Syrup Candy! Famous Shanghai sweetness!'},
  {id:'bazaar-stage', title:'古戏台清音茶社', bannerChar:'茶', facing:'east', type:'tea', accent:'#795232', awning:'#43665a', callZh:'评弹清音，龙井香茗，客官里边请坐——', callEn:'Pingtan music and Longjing tea! Welcome inside!'},
  {id:'old-city-west', title:'非遗折扇剪纸馆', bannerChar:'扇', facing:'east', type:'fan', accent:'#a24a35', awning:'#a24a35', callZh:'海派非遗折扇，苏绣团扇，把江南风雅带回家！', callEn:'Intangible cultural heritage fans! Authentic Jiangnan art!'},
  {id:'bazaar-west-herbs', title:'童涵春堂国药号', bannerChar:'药', facing:'east', type:'herbs', accent:'#466b53', awning:'#2e543b', callZh:'童涵春堂道地药材，参茸滋补，四时养生膏方——', callEn:'Tonghanchun traditional herbs and tonics!'},
  {id:'west-craft-hall', title:'江南织造蓝染坊', bannerChar:'锦', facing:'east', type:'silk', accent:'#2e5a88', awning:'#204369', callZh:'江南织造蓝印花布，经久耐磨，纯正草木染！', callEn:'Jiangnan indigo dyed textiles!'},
  {id:'west-wine-shop', title:'海上名酿花雕坊', bannerChar:'酒', facing:'east', type:'wine', accent:'#844322', awning:'#773315', callZh:'海上名酿封坛老酒，开坛十里香，客官来尝一盏！', callEn:'Vintage sealed rice wine! Taste the finest fragrance!'},
  {id:'west-tea-house', title:'豫园春碧螺名茶', bannerChar:'茶', facing:'east', type:'tea', accent:'#4a6c42', awning:'#395b32', callZh:'明前碧螺春、狮峰龙井，清香回甘，新茶到店！', callEn:'Finest Biluochun and Longjing green tea!'},

  // West Inner Row (x = -86, rx = 5, facing West towards street at x = -96.5)
  {id:'huabao-lou', title:'华宝楼金石文玩', bannerChar:'珍', facing:'west', type:'antique', accent:'#8e6832', awning:'#6b491e', callZh:'华宝楼金石古玩，名家字画，玉石翡翠，欢迎进店赏鉴！', callEn:'Huabaolou antiques, calligraphy, and fine jade!'},
  {id:'tonghanchun', title:'童涵春堂参茸滋补', bannerChar:'参', facing:'west', type:'herbs', accent:'#4a6b52', awning:'#2c543a', callZh:'长白山老山参、西宁冬虫夏草，名号信誉保证！', callEn:'Wild mountain ginseng and winter cordyceps!'},
  {id:'west-bazaar-2', title:'顾绣名锦苏绣阁', bannerChar:'绣', facing:'west', type:'silk', accent:'#914867', awning:'#7b3353', callZh:'顾绣名锦，针法绝伦，巧夺天工的海派刺绣！', callEn:'Masterpiece Gu embroidery!'},
  {id:'west-bazaar-3', title:'翠宝斋和田翡翠', bannerChar:'玉', facing:'west', type:'jade', accent:'#3f7a63', awning:'#29604c', callZh:'新疆和田白玉、缅甸老坑翡翠，温润有灵，遇有缘人！', callEn:'Fine Hetian jade and emeralds!'},
  {id:'west-bazaar-4', title:'弄堂生煎锅贴铺', bannerChar:'点', facing:'west', type:'pastry', accent:'#8c3d2e', awning:'#792e21', callZh:'热气腾腾的大壶春生煎，焦脆多汁，刚出锅嘞！', callEn:'Crispy bottom pan-fried buns! Hot and juicy!'},

  // East Inner Row (x = 8, rx = 4, facing East towards street at x = 16.5)
  {id:'old-city-northeast', title:'沈大成传统糕团', bannerChar:'点', facing:'east_inner', type:'pastry', accent:'#8b3a42', awning:'#74262d', callZh:'沈大成定胜糕、条头糕，软糯香甜，老上海点心！', callEn:'Shanghai rice cakes and traditional pastries!'},
  {id:'tianyu-lou', title:'天裕楼掐丝珐琅', bannerChar:'艺', facing:'east_inner', type:'antique', accent:'#28587b', awning:'#194263', callZh:'天裕楼掐丝珐琅，宫廷非遗技艺，金碧辉煌！', callEn:'Cloisonne and enamel master crafts!'},
  {id:'hefeng-lou', title:'和丰楼海派美食', bannerChar:'膳', facing:'east_inner', type:'pastry', accent:'#9c4e2b', awning:'#843818', callZh:'和丰楼招牌蟹粉汤包、本帮红烧肉，香味扑鼻！', callEn:'Crab roe buns and classic Shanghai cuisine!'},
  {id:'shanghai-hotel', title:'上海老饭店名宴', bannerChar:'名', facing:'east_inner', type:'wine', accent:'#8e2f2b', awning:'#781f1c', callZh:'百年上海老饭店，八宝鸭、油爆虾，本帮非遗名宴！', callEn:'Shanghai Old Restaurant heritage banquet!'},
  {id:'ningbo-tangtuan', title:'宁波水磨手工汤团', bannerChar:'团', facing:'east_inner', type:'pastry', accent:'#79523a', awning:'#5e3a24', callZh:'现包现煮黑洋酥汤团，皮薄馅足，香甜软糯！', callEn:'Ningbo sweet black sesame dumplings!'},
  {id:'old-city-east', title:'景容楼传世金饰', bannerChar:'金', facing:'east_inner', type:'jade', accent:'#a68238', awning:'#8c6822', callZh:'景容楼传世古法金饰，花丝镶嵌，福运吉祥！', callEn:'Ancient filigree gold jewelry!'},
  {id:'bazaar-east-gold', title:'老庙黄金传统银楼', bannerChar:'祥', facing:'east_inner', type:'jade', accent:'#b89139', awning:'#977320', callZh:'老庙黄金给您带来好运气，百年祥瑞，金玉满堂！', callEn:'Lao Miao Gold brings you good fortune!'},

  // South Row (z = 268, facing North towards walkway at z = 264)
  {id:'old-city-south', title:'豫园民俗风物集', bannerChar:'民', facing:'north', type:'fan', accent:'#a64234', awning:'#8e2d20', callZh:'老城厢传统手工剪纸、面塑泥人，栩栩如生！', callEn:'Folk paper-cutting and clay dough figurines!'},

  // Lakeside Pavilions
  {id:'tea-gallery', title:'湖畔茶坊水榭', bannerChar:'茶', facing:'lake_south', type:'tea', accent:'#4d6f46', awning:'#3a5b34', callZh:'湖畔品茶，临水观鱼，江南丝竹相伴，客官请进！', callEn:'Lakeside tea pavilion with koi viewing!'},
  {id:'lubolang', title:'绿波廊国宾名点', bannerChar:'廊', facing:'lake_west', type:'pastry', accent:'#923429', awning:'#7b2319', callZh:'绿波廊眉毛酥、桂花拉糕，国宾名点，香气扑鼻！', callEn:'Lubolang pastry and state banquet delicacies!'}
 ];

 function decorateThemedGoods(parent, type, x, y, z){
  if(type==='wine'){
   for(let i=0;i<3;i++){
    const ox=(i-1)*.28;
    disk(parent,'#422818',x+ox,y+.16,z,.16,.32);
    mesh(parent,sphere,'#422818',x+ox,y+.24,z,.17,.12,.17);
    disk(parent,'#311b0e',x+ox,y+.33,z,.09,.08);
    disk(parent,'#a3221b',x+ox,y+.38,z,.12,.05);
    disk(parent,gold,x+ox,y+.36,z,.1,.015);
    box(parent,'#f4e4c2',x+ox,y+.16,z+.155,.12,.14,.01);
   }
  }else if(type==='herbs'){
   box(parent,'#3a2214',x,y+.26,z,.76,.52,.32);
   for(let r=0;r<3;r++)for(let c=0;c<4;c++){
    box(parent,'#593721',x+(c-1.5)*.17,y+.1+(2-r)*.15,z+.156,.13,.12,.02);
    disk(parent,gold,x+(c-1.5)*.17,y+.1+(2-r)*.15,z+.168,.016,.015);
   }
   box(parent,'#28160c',x+.22,y+.54,z,.24,.06,.18);
   box(parent,'#e8c878',x+.22,y+.57,z,.21,.01,.15);
   box(parent,'#987a4c',x+.22,y+.58,z,.16,.02,.04);
   disk(parent,'#edf5f2',x-.22,y+.56,z,.08,.16);
   disk(parent,'#7e5229',x-.22,y+.65,z,.06,.03);
  }else if(type==='jade'){
   box(parent,'#80141b',x,y+.05,z,.76,.09,.46);
   box(parent,gold,x,y+.05,z,.8,.04,.5);
   mesh(parent,sphere,'#eef3ec',x,y+.17,z,.14,.2,.1);
   mesh(parent,sphere,'#dce5da',x+.05,y+.13,z,.09,.14,.08);
   disk(parent,'#1c1410',x-.24,y+.11,z,.07,.04);
   mesh(parent,ring,'#2d8c58',x-.24,y+.15,z,.06,.06,.06);
   disk(parent,gold,x+.24,y+.11,z,.09,.05);
   mesh(parent,sphere,'#ffd54f',x+.24,y+.14,z,.07,.05,.07);
  }else if(type==='antique'){
   disk(parent,'#4a5749',x-.22,y+.14,z,.14,.18);
   mesh(parent,sphere,'#3e4c3d',x-.22,y+.24,z,.16,.1,.16);
   disk(parent,'#caa54f',x-.22,y+.31,z,.08,.05);
   for(const bx of [-.09,.09])box(parent,'#3e4c3d',x-.22+bx,y+.26,z,.03,.12,.03);
   disk(parent,'#f4f6fa',x+.2,y+.15,z,.1,.24);
   mesh(parent,sphere,'#f4f6fa',x+.2,y+.28,z,.15,.14,.15);
   disk(parent,'#1f4788',x+.2,y+.28,z,.152,.04);
   disk(parent,'#f4f6fa',x+.2,y+.37,z,.06,.08);
   disk(parent,'#1f4788',x+.2,y+.41,z,.07,.015);
  }else if(type==='silk'){
   const silkColors=['#224870','#9e2a4a','#2b6b47','#b08a2e'];
   for(let i=0;i<4;i++){
    const oz=(i-1.5)*.13;
    disk(parent,silkColors[i],x-.1,y+.12,z+oz,.085,.44);
    disk(parent,gold,x-.1,y+.12,z+oz,.09,.02);
   }
   mesh(parent,sphere,'#fdfaf2',x+.22,y+.26,z,.16,.16,.015);
   mesh(parent,ring,gold,x+.22,y+.26,z,.165,.165,.015);
   box(parent,'#3b2615',x+.22,y+.12,z,.015,.22,.015);
  }else if(type==='pastry'){
   for(let i=0;i<3;i++){
    disk(parent,'#9b2420',x-.2,y+.08+i*.09,z,.17,.08);
    disk(parent,gold,x-.2,y+.12+i*.09,z,.175,.015);
   }
   box(parent,'#781814',x-.2,y+.38,z,.02,.12,.36);
   disk(parent,'#ba9766',x+.2,y+.1,z,.18,.14);
   disk(parent,'#5c7b52',x+.2,y+.175,z,.16,.015);
   for(let a=0;a<3;a++){
    const ang=a*(Math.PI*2/3);
    mesh(parent,sphere,'#fff9e8',x+.2+Math.cos(ang)*.08,y+.21,z+Math.sin(ang)*.08,.05,.04,.05);
   }
  }else if(type==='candy'){
   disk(parent,'#f0f8ff',x-.18,y+.18,z,.13,.3);
   for(let j=0;j<4;j++)mesh(parent,sphere,['#ff6b6b','#ffd93d','#6bcb77','#4d96ff'][j],x-.18+(j%2-.5)*.08,y+.12+Math.floor(j/2)*.08,z,.035,.035,.035);
   disk(parent,gold,x-.18,y+.34,z,.12,.04);
   disk(parent,gold,x-.18,y+.37,z,.04,.04);
   box(parent,'#aa3328',x+.18,y+.14,z,.28,.24,.24);
   box(parent,gold,x+.18,y+.265,z,.26,.02,.22);
   box(parent,'#f4e4c2',x+.18,y+.14,z+.125,.14,.14,.01);
  }else if(type==='fan'){
   box(parent,'#3b2214',x,y+.05,z,.36,.06,.12);
   box(parent,'#28160c',x,y+.14,z,.04,.14,.04);
   box(parent,cream,x,y+.28,z,.42,.32,.02);
   for(let i=-3;i<=3;i++){
    const ang=i*0.2;
    const rib=box(parent,'#6b4528',x+Math.sin(ang)*.16,y+.24+Math.cos(ang)*.08,z+.012,.015,.32,.01);
    rib.rotation.z=-ang;
   }
   box(parent,'#b83025',x,y+.12,z+.02,.02,.12,.02);
  }else{
   box(parent,'#281b14',x,y+.04,z,.68,.05,.44);
   mesh(parent,sphere,'#7a3f30',x-.16,y+.16,z,.13,.11,.13);
   disk(parent,'#683225',x-.16,y+.23,z,.08,.03);
   mesh(parent,sphere,gold,x-.16,y+.255,z,.025,.025,.025);
   const spout=mesh(parent,cylinder,'#7a3f30',x-.04,y+.18,z,.03,.12,.03);spout.rotation.z=-.6;
   const handle=mesh(parent,ring,'#7a3f30',x-.27,y+.16,z,.07,.09,.07);handle.rotation.y=Math.PI/2;
   for(let i=0;i<2;i++){
    disk(parent,'#b5d6c8',x+.16,y+.1,z+(i-.5)*.18,.06,.09);
    disk(parent,'#62462a',x+.16,y+.138,z+(i-.5)*.18,.05,.01);
   }
  }
 }

 // Helper to create a swaying lantern group
 function createSwayingLantern(parent, x, y, z, color='#e83424', scale=1.0, phaseOffset=0){
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);

  // Hook / cable
  box(g, '#785b3b', 0, -0.06, 0, .02, .12, .02);

  // Warm golden-amber glowing luminous inner core (暖金黄发光内核)
  const coreMat = mat('#ffc107', true);
  const core = new THREE.Mesh(cylinder, coreMat);
  core.position.set(0, -0.36*scale, 0);
  core.scale.set(.18*scale, .48*scale, .18*scale);
  g.add(core);
  flickeringLights.push({mat: coreMat, baseColor: new THREE.Color('#ffc107'), phase: phaseOffset});

  // Translucent Crimson silk gauze outer lampshade (红里透黄薄纱红罩)
  const gauzeMat = new THREE.MeshLambertMaterial({color:'#e53935', emissive:'#b71c1c', transparent:true, opacity:0.65, depthWrite:false});
  const body = new THREE.Mesh(cylinder, gauzeMat);
  body.position.set(0, -0.36*scale, 0);
  body.scale.set(.28*scale, .52*scale, .28*scale);
  g.add(body);

  // Golden waist hoop trim (金边腰箍)
  disk(g, gold, 0, -0.36*scale, 0, .285*scale, .025*scale);

  // Top & bottom brass collars
  disk(g, gold, 0, -0.1*scale, 0, .2*scale, .04*scale);
  disk(g, gold, 0, -0.62*scale, 0, .19*scale, .04*scale);

  // Bottom red fringe & golden tassel (红穗流苏)
  box(g, '#d82d22', 0, -0.82*scale, 0, .05*scale, .36*scale, .05*scale);
  disk(g, gold, 0, -0.64*scale, 0, .06*scale, .025*scale);

  swayingObjects.push({group: g, phase: phaseOffset, speed: 1.6, maxAngleZ: 0.08, maxAngleX: 0.05, type: 'lantern'});
  return g;
 }

 function decorateBuildingShop(conf){
  const b=YUYUAN_BUILDINGS.find(building=>building.id===conf.id);
  if(!b) return;
  const {x,z,rx,rz}=b,{facing,title,type,accent,awning,bannerChar}=conf;
  const isEastFacing=facing==='east'||facing==='east_inner';
  let isXAxis=false,frontSignAngle=0;
  let doorX=x,doorZ=z,frontX=x,frontZ=z,backWallX=x,backWallZ=z;
  let signW=Math.min(rz*1.5, 5.2);
  let sideCounterX=x,sideCounterZ=z,sideCounterW=2.0,sideCounterD=0.9;
  let bladeSignX=x,bladeSignZ=z;
  let flagX=x,flagZ=z;

  if(facing==='east'||facing==='east_inner'){
   isXAxis=true;
   doorX=x+rx; doorZ=z;
   frontX=x+rx; frontZ=z;
   backWallX=x-rx+0.45; backWallZ=z;
   frontSignAngle=Math.PI/2;
   signW=Math.min(rz*1.5, 5.2);
   sideCounterX=x+rx-2.2; sideCounterZ=z-rz+1.4; sideCounterW=1.8; sideCounterD=0.9;
   bladeSignX=x+rx+1.1; bladeSignZ=z+rz-0.5;
   flagX=x+rx+0.85; flagZ=z-rz+0.6;
  }else if(facing==='west'||facing==='lake_west'){
   isXAxis=true;
   doorX=x-rx; doorZ=z;
   frontX=x-rx; frontZ=z;
   backWallX=x+rx-0.45; backWallZ=z;
   frontSignAngle=-Math.PI/2;
   signW=Math.min(rz*1.5, 5.2);
   sideCounterX=x-rx+2.2; sideCounterZ=z-rz+1.4; sideCounterW=1.8; sideCounterD=0.9;
   bladeSignX=x-rx-1.1; bladeSignZ=z+rz-0.5;
   flagX=x-rx-0.85; flagZ=z-rz+0.6;
  }else if(facing==='lake_south'){
   doorX=x; doorZ=z+rz;
   frontX=x; frontZ=z+rz;
   backWallX=x; backWallZ=z-rz+0.45;
   frontSignAngle=0;
   signW=Math.min(rx*1.5, 5.2);
   sideCounterX=x+rx-1.4; sideCounterZ=z+rz-2.2; sideCounterW=0.9; sideCounterD=1.8;
   bladeSignX=x-rx+0.5; bladeSignZ=z+rz+1.1;
   flagX=x+rx-0.6; flagZ=z+rz+0.85;
  }else{
   doorX=x; doorZ=z-rz;
   frontX=x; frontZ=z-rz;
   backWallX=x; backWallZ=z+rz-0.45;
   frontSignAngle=Math.PI;
   signW=Math.min(rx*1.5, 5.2);
   sideCounterX=x-rx+1.4; sideCounterZ=z-rz+2.2; sideCounterW=0.9; sideCounterD=1.8;
   bladeSignX=x+rx-0.5; bladeSignZ=z-rz-1.1;
   flagX=x-rx+0.6; flagZ=z-rz-0.85;
  }

  // -------------------------------------------------------------
  // 1. FLOOR & CARPET (通体红木镶嵌地板 + 中轴祥瑞云锦地毯)
  // -------------------------------------------------------------
  cube('#2e2118', x, 26.035, z, rx*2-.6, .025, rz*2-.6);
  cube('#e8dbbe', x, 26.05, z, rx*2-1.2, .015, rz*2-1.2);
  if(isXAxis){
   cube(accent, x, 26.065, z, rx*2-1.4, .016, 2.6);
   for(const sz of [-1.25, 1.25]) cube(gold, x, 26.075, z+sz, rx*2-1.4, .01, .06);
  }else{
   cube(accent, x, 26.065, z, 2.6, .016, rz*2-1.4);
   for(const sx of [-1.25, 1.25]) cube(gold, x+sx, 26.075, z, .06, .01, rz*2-1.4);
  }

  // -------------------------------------------------------------
  // 2. OPEN UNRESTRICTED ENTRANCE & SHOWCASE VITRINES (完全通畅大门洞 + 两侧临街展窗)
  // -------------------------------------------------------------
  if(isXAxis){
   cube('#caa54f', frontX, 26.045, z, .36, .07, 3.4);
   cube('#8c8e84', frontX+(isEastFacing?.22:-.22), 26.02, z, .25, .04, 3.5);
   for(const sz of [-1.75, 1.75]){
    cube(timber, frontX, 27.6, z+sz, .26, 3.2, .26);
    cube(gold, frontX, 27.6, z+sz, .04, 3.1, .28);
    cube('#795634', frontX, 26.3, z+sz, .38, .6, .38);
   }
   cube(timber, frontX, 29.24, z, .28, .22, 3.75);
   cube(gold, frontX, 29.35, z, .3, .04, 3.8);

   for(const sideCase of [-1, 1]){
    const scZ = z + sideCase * (1.9 + (rz - 1.9)/2);
    const scD = Math.max(0.7, rz - 2.05);
    cube(timber, frontX, 26.55, scZ, .75, 1.05, scD);
    cube(gold, frontX, 27.08, scZ, .79, .04, scD+.04);
    mesh(root, boxGeometry, glassMaterial, frontX, 27.95, scZ, .72, 1.7, scD);
    for(const y of [27.12, 28.8]) cube(gold, frontX, y, scZ, .76, .05, scD+.04);
    cube('#7a1d26', frontX, 27.14, scZ, .62, .06, scD-.16);
    decorateThemedGoods(root, type, frontX, 27.2, scZ);
    fixtures.push({x: frontX, z: scZ, rx: .4, rz: scD/2, y: 26, h: 2.6});
   }
  }else{
   cube('#caa54f', x, 26.045, frontZ, 3.4, .07, .36);
   cube('#8c8e84', x, 26.02, frontZ+(facing==='lake_south'?.22:-.22), 3.5, .04, .25);
   for(const sx of [-1.75, 1.75]){
    cube(timber, x+sx, 27.6, frontZ, .26, 3.2, .26);
    cube(gold, x+sx, 27.6, frontZ, .28, 3.1, .04);
    cube('#795634', x+sx, 26.3, frontZ, .38, .6, .38);
   }
   cube(timber, x, 29.24, frontZ, 3.75, .22, .28);
   cube(gold, x, 29.35, frontZ, 3.8, .04, .3);

   for(const sideCase of [-1, 1]){
    const scX = x + sideCase * (1.9 + (rx - 1.9)/2);
    const scW = Math.max(0.7, rx - 2.05);
    cube(timber, scX, 26.55, frontZ, scW, 1.05, .75);
    cube(gold, scX, 27.08, frontZ, scW+.04, .04, .79);
    mesh(root, boxGeometry, glassMaterial, scX, 27.95, frontZ, scW, 1.7, .72);
    for(const y of [27.12, 28.8]) cube(gold, scX, y, frontZ, scW+.04, .05, .76);
    cube('#7a1d26', scX, 27.14, frontZ, scW-.16, .06, .62);
    decorateThemedGoods(root, type, scX, 27.2, frontZ);
    fixtures.push({x: scX, z: frontZ, rx: scW/2, rz: .4, y: 26, h: 2.6});
   }
  }

  // -------------------------------------------------------------
  // 3. BACK-WALL GRAND ASYMMETRICAL CURIO CABINET (背墙错落有致大博古架)
  // -------------------------------------------------------------
  if(isXAxis){
   const vitrineW = .65, vitrineD = Math.min(rz*1.7, 5.6);
   const dir = isEastFacing ? 1 : -1;
   cube('#321e14', backWallX, 27.65, backWallZ, vitrineW, 3.2, vitrineD);
   cube('#fff5d8', backWallX+dir*.08, 27.65, backWallZ, .52, 2.9, vitrineD-.3, true);
   cube('#caa54f', backWallX+dir*.14, 26.85, backWallZ-vitrineD*0.3, .58, .05, vitrineD*0.35);
   cube('#caa54f', backWallX+dir*.14, 28.45, backWallZ-vitrineD*0.3, .58, .05, vitrineD*0.35);
   decorateThemedGoods(root, type, backWallX+dir*.15, 26.88, backWallZ-vitrineD*0.3);
   cube('#caa54f', backWallX+dir*.14, 27.55, backWallZ, .58, .05, vitrineD*0.3);
   cube('#caa54f', backWallX+dir*.14, 28.45, backWallZ, .58, .05, vitrineD*0.3);
   decorateThemedGoods(root, type, backWallX+dir*.15, 27.58, backWallZ);
   cube('#caa54f', backWallX+dir*.14, 26.85, backWallZ, .58, .05, vitrineD*0.3);
   decorateThemedGoods(root, type, backWallX+dir*.15, 26.88, backWallZ);
   for(const sy of [26.85, 27.4, 28.0, 28.55]){
    cube('#caa54f', backWallX+dir*.14, sy, backWallZ+vitrineD*0.3, .58, .05, vitrineD*0.35);
   }
   decorateThemedGoods(root, type, backWallX+dir*.15, 27.43, backWallZ+vitrineD*0.3);
   decorateThemedGoods(root, type, backWallX+dir*.15, 28.03, backWallZ+vitrineD*0.3);

   board(title+' · 百年老字号', backWallX+dir*.36, 28.8, backWallZ, Math.min(vitrineD*0.7, 4.2), .62, isEastFacing ? Math.PI/2 : -Math.PI/2);
   fixtures.push({x: backWallX, z: backWallZ, rx: vitrineW/2, rz: vitrineD/2, y: 26, h: 3.2});
  }else{
   const vitrineW = Math.min(rx*1.4, 4.6), vitrineD = .65;
   const dir = facing==='lake_south' ? 1 : -1;
   cube('#321e14', backWallX, 27.65, backWallZ, vitrineW, 3.2, vitrineD);
   cube('#fff5d8', backWallX, 27.65, backWallZ+dir*.08, vitrineW-.3, 2.9, .52, true);
   for(const sy of [26.85, 27.65, 28.45]){
    cube('#caa54f', backWallX, sy, backWallZ+dir*.14, vitrineW-.1, .05, .58);
    for(let col = -vitrineW/2 + 0.6; col <= vitrineW/2 - 0.6; col += 1.1){
     decorateThemedGoods(root, type, backWallX+col, sy+.03, backWallZ+dir*.15);
    }
   }
   board(title+' · 百年老字号', backWallX, 28.8, backWallZ+dir*.34, Math.min(vitrineW*0.7, 4.2), .62, frontSignAngle);
   fixtures.push({x: backWallX, z: backWallZ, rx: vitrineW/2, rz: vitrineD/2, y: 26, h: 3.2});
  }

  // -------------------------------------------------------------
  // 4. CLASSICAL RECEPTION TEA AREA (南侧迎宾茶叙雅座：太师椅对坐 + 雕花茶几 + 镂空屏风)
  // -------------------------------------------------------------
  if(isXAxis){
   const cx = x, cz = z + rz - 1.5;
   for(const side of [-1, 1]){
    const chairX = cx + side * .65;
    for(const lx of [-.18, .18])for(const lz of [-.18, .18]){
     cube('#382215', chairX+lx, 26.25, cz+lz, .04, .5, .04);
    }
    cube('#382215', chairX, 26.51, cz, .44, .04, .44);
    cube('#8d221c', chairX, 26.54, cz, .38, .03, .38);
    cube('#382215', chairX, 26.92, cz+.18, .04, .78, .04);
    cube('#caa54f', chairX, 26.95, cz+.18, .18, .36, .02);
    cube('#382215', chairX, 27.32, cz+.18, .48, .04, .05);
    for(const ax of [-.2, .2]){
     cube('#382215', chairX+ax, 26.78, cz, .035, .035, .38);
     cube('#382215', chairX+ax, 26.65, cz-.16, .035, .25, .035);
    }
   }
   cube('#321e14', cx, 26.32, cz, .42, .64, .42);
   cube('#caa54f', cx, 26.65, cz, .46, .03, .46);
   box(root, '#281a12', cx, 26.68, cz, .32, .02, .24);
   mesh(root, sphere, '#7a3e30', cx-.06, 26.74, cz, .05, .04, .05);
   disk(root, '#b5d6c8', cx+.06, 26.72, cz-.05, .025, .035);
   disk(root, '#b5d6c8', cx+.06, 26.72, cz+.05, .025, .035);
   cube('#3a2417', cx, 27.4, z+rz-.28, rx*1.1, 2.5, .08);
   cube('#caa54f', cx, 27.4, z+rz-.24, rx*1.02, 2.3, .02);
   for(let p = -rx*0.45; p <= rx*0.45; p += 0.45){
    cube('#24150d', cx+p, 27.4, z+rz-.22, .03, 2.4, .04);
   }
  }

  // -------------------------------------------------------------
  // 5. SIDE SERVICE COUNTER & HERITAGE PROPS (偏侧红木曲尺账台：算盘 + 笔架 + 戥子)
  // -------------------------------------------------------------
  cube('#422d1e', sideCounterX, 26.55, sideCounterZ, sideCounterW, 1.1, sideCounterD);
  cube(gold, sideCounterX, 27.12, sideCounterZ, sideCounterW+.06, .05, sideCounterD+.06);
  cube(accent, sideCounterX, 27.15, sideCounterZ, sideCounterW-.12, .02, sideCounterD-.12);
  decorateThemedGoods(root, type, sideCounterX, 27.17, sideCounterZ);
  box(root, '#281a12', sideCounterX-.35, 27.2, sideCounterZ, .32, .03, .18);
  for(let b = -0.12; b <= 0.12; b += 0.04){
   box(root, gold, sideCounterX-.35+b, 27.21, sideCounterZ, .012, .015, .15);
  }
  box(root, gold, sideCounterX+.35, 27.32, sideCounterZ, .02, .24, .18);
  box(root, gold, sideCounterX+.35, 27.44, sideCounterZ, .02, .02, .22);
  for(const bz of [-.06, 0, .06]){
   box(root, '#3a2618', sideCounterX+.35, 27.35, sideCounterZ+bz, .012, .16, .012);
  }
  fixtures.push({x: sideCounterX, z: sideCounterZ, rx: sideCounterW/2, rz: sideCounterD/2, y: 26, h: 1.2});

  // -------------------------------------------------------------
  // 6. CEILING CHANDELIER & WARM MISTY GLOW (藻井重檐宫灯吊灯)
  // -------------------------------------------------------------
  cube('#2e1f14', x, 29.4, z, 1.4, .08, 1.4);
  cube(gold, x, 29.36, z, 1.46, .02, 1.46);
  const chG = new THREE.Group();
  chG.position.set(x, 29.35, z);
  root.add(chG);
  box(chG, '#785b3b', 0, -.25, 0, .04, .5, .04);
  box(chG, gold, 0, -.52, 0, .85, .06, .85);
  const chMat = mat('#ffc966', true);
  const chCore = new THREE.Mesh(cylinder, chMat);
  chCore.position.set(0, -.74, 0); chCore.scale.set(.36, .42, .36); chG.add(chCore);
  box(chG, gold, 0, -.96, 0, .85, .06, .85);
  box(chG, '#d42d22', 0, -1.14, 0, .06, .3, .06);
  swayingObjects.push({group: chG, phase: x*2+z*3, speed: 1.2, maxAngleZ: 0.04, maxAngleX: 0.03, type: 'chandelier'});
  flickeringLights.push({mat: chMat, baseColor: new THREE.Color('#ffc966'), phase: x*3+z*2});

  const shopLight = new THREE.PointLight('#ffdb94', 1.8, 8.5, 1.4);
  shopLight.visible = false;
  shopLight.position.set(x, 28.4, z);
  root.add(shopLight);
  shopLights.push(shopLight);

  // -------------------------------------------------------------
  // 7. UPGRADED SIGNAGE (对标南京路：3D黑漆重檐挑檐瓦当名匾 + 雀替牛腿 + 侧悬旗招)
  // -------------------------------------------------------------
  let hSignX=frontX, hSignZ=frontZ, hSignAngle=frontSignAngle;
  if(facing==='east'||facing==='east_inner') hSignX += .12;
  else if(facing==='west'||facing==='lake_west') hSignX -= .12;
  else if(facing==='lake_south') hSignZ += .12;
  else hSignZ -= .12;

  if(isXAxis){
   cube('#1c130d', hSignX, 29.38, frontZ, .15, .96, signW+.25);
   cube(gold, hSignX+(isEastFacing?.06:-.06), 29.38, frontZ, .04, 1.04, signW+.32);
   cube(gold, hSignX+(isEastFacing?.08:-.08), 29.38, frontZ, .02, .88, signW+.18);
   cube('#3a2416', hSignX+(isEastFacing?.1:-.1), 29.92, frontZ, .28, .12, signW+.42);
   cube('#384840', hSignX+(isEastFacing?.14:-.14), 29.98, frontZ, .35, .08, signW+.48);
   const eGlow = cube('#ffd75a', hSignX+(isEastFacing?.16:-.16), 29.94, frontZ, .06, .04, signW+.4, true);
   flickeringLights.push({mat: eGlow.material, baseColor: new THREE.Color('#ffd75a'), phase: frontZ*2});
   for(const bsz of [-signW/2, signW/2]){
    const brk = cube('#6a482b', hSignX+(isEastFacing?.06:-.06), 28.84, frontZ+bsz, .14, .24, .16);
    brk.rotation.x = bsz > 0 ? 0.35 : -0.35;
   }
   board(title, hSignX+(isEastFacing?.12:-.12), 29.38, frontZ, signW, .82, hSignAngle);
  }else{
   cube('#1c130d', frontX, 29.38, hSignZ, signW+.25, .96, .15);
   cube(gold, frontX, 29.38, hSignZ+(facing==='lake_south'?.06:-.06), signW+.32, 1.04, .04);
   cube(gold, frontX, 29.38, hSignZ+(facing==='lake_south'?.08:-.08), signW+.18, .88, .02);
   cube('#384840', frontX, 29.98, hSignZ+(facing==='lake_south'?.14:-.14), signW+.48, .08, .35);
   board(title, frontX, 29.38, hSignZ+(facing==='lake_south'?.12:-.12), signW, .82, hSignAngle);
  }

  if(isXAxis){
   const bladeBoxX = bladeSignX, bladeBoxZ = bladeSignZ;
   cube('#201915', bladeBoxX, 31.8, bladeBoxZ, 1.25, 3.6, .14);
   cube('#364940', bladeBoxX, 33.7, bladeBoxZ, 1.45, .18, .28);
   cube(gold, bladeBoxX, 33.82, bladeBoxZ, 1.52, .06, .34);
   cube(gold, bladeBoxX, 29.92, bladeBoxZ, 1.34, .14, .18);
   cube('#ffc866', bladeBoxX, 31.8, bladeBoxZ+(isEastFacing?.08:-.08), 1.22, 3.52, .03, true);
   board(title, bladeBoxX, 31.8, bladeBoxZ+.085, 1.18, 3.45, 0);
   board(title, bladeBoxX, 31.8, bladeBoxZ-.085, 1.18, 3.45, Math.PI);
   const wallX = frontX, armLen = Math.abs(bladeBoxX - wallX), armMidX = (bladeBoxX + wallX)/2;
   cube('#1a1816', armMidX, 33.2, bladeBoxZ, armLen, .06, .06);
   cube('#1a1816', armMidX, 30.4, bladeBoxZ, armLen, .06, .06);
   cube('#2e251e', wallX, 31.8, bladeBoxZ, .08, 3.2, .14);
  }

  const flagGroup = new THREE.Group();
  flagGroup.position.set(flagX, 29.8, flagZ);
  root.add(flagGroup);
  if(isXAxis){
   const poleLen = 1.3, poleDir = facing==='east'? 1 : -1;
   box(flagGroup, timber, poleDir*poleLen/2, 0, 0, poleLen, .05, .05);
   disk(flagGroup, gold, poleDir*poleLen, 0, 0, .05, .08);
   const bannerMesh = box(flagGroup, accent, poleDir*(poleLen-.2), -.65, 0, .02, 1.2, .65);
   box(flagGroup, gold, poleDir*(poleLen-.2), -1.26, 0, .025, .05, .66);
   box(flagGroup, '#d42d22', poleDir*(poleLen-.2), -1.34, 0, .02, .12, .6);
  }
  swayingObjects.push({group: flagGroup, phase: x*1.9+z*2.7, speed: 2.1, maxAngleZ: 0.11, maxAngleX: 0.05, type: 'flag'});

  // Hanging lanterns placed flanking outside signboard boundaries to never block calligraphy text
  const lanternSpan = Math.max(signW / 2 + 0.65, 3.2);
  if(isXAxis){
   for(const lz of [z-lanternSpan, z+lanternSpan]){
    createSwayingLantern(root, frontX+(facing==='east'?.42:-.42), 29.2, lz, '#e83424', 1.05, frontX*2+lz*3);
   }
  }else{
   for(const lx of [x-lanternSpan, x+lanternSpan]){
    createSwayingLantern(root, lx, 29.2, frontZ+(facing==='lake_south'?.42:-.42), '#e83424', 1.05, lx*2+frontZ*3);
   }
  }

  const towardCenterX=Math.sign(x-doorX),towardCenterZ=Math.sign(z-doorZ);
  extraShops.push({id:conf.id,x:doorX,z:doorZ,insideX:doorX+towardCenterX*1.25,insideZ:doorZ+towardCenterZ*1.25,title:conf.title,type:conf.type,accent:conf.accent});
  vendors.push({
   root: {position: {x: doorX, y: 26, z: doorZ}},
   position: {x: doorX, y: 26, z: doorZ},
   title: conf.title,
   type: conf.type,
   food: ['pastry','candy','wine'].includes(conf.type),
   callZh: conf.callZh,
   callEn: conf.callEn
  });
 }

 for(const conf of BAZAAR_EXTRA_SHOPS) decorateBuildingShop(conf);

 // -------------------------------------------------------------
 // 7.5 STEALTHY STREET HAWKERS / PEDDLERS (街头特色流动摊点与吆喝小贩)
 // -------------------------------------------------------------
 function createStreetPeddlers(){
  // 1. 糖人张吹糖亭 (Tangren Zhang Sugar Stall & Kiosk) at x=-101.8, z=212.5
  {
   const px = -101.8, pz = 212.5, stallG = new THREE.Group();
   stallG.position.set(px, 26, pz); stallG.rotation.y = Math.PI / 2; root.add(stallG);

   // 4 timber corner columns
   for(const sx of [-0.95, 0.95]) for(const sz of [-0.55, 0.55]){
    box(stallG, '#634227', sx, 1.4, sz, .08, 2.8, .08);
    box(stallG, gold, sx, 0.15, sz, .12, .3, .12);
   }
   // Eaves & striped fabric canopy awning (朱红与金黄相间布幔挑檐)
   box(stallG, '#52341d', 0, 2.72, 0, 2.15, .08, 1.35);
   box(stallG, '#8a231c', 0, 2.82, 0, 2.25, .12, 1.45);
   for(let f = -0.9; f <= 0.9; f += 0.45){
    box(stallG, '#dfa838', f, 2.83, 0, .22, .13, 1.46);
   }
   // Curved roof crest & brass finial
   box(stallG, '#442b1a', 0, 2.94, 0, 2.0, .14, .3);
   mesh(stallG, sphere, gold, 0, 3.12, 0, .1, .14, .1);

   // Solid mahogany counter table with carved front panels
   box(stallG, '#52341d', 0, 0.45, 0, 1.85, .9, 0.95);
   box(stallG, '#704724', 0, 0.88, 0, 1.95, .06, 1.05);
   box(stallG, '#3a2212', 0, 0.45, .46, 1.7, .7, .04);

   // Brass sugar pot with simmering syrup
   disk(stallG, '#baa054', -0.5, 0.95, 0.15, .22, .12);
   disk(stallG, '#dfa234', -0.5, 0.98, 0.15, .18, .02);
   box(stallG, '#422817', -0.5, 1.04, 0.15, .02, .16, .02);

   // Revolving bronze zodiac fortune turntable (生肖糖画转盘)
   disk(stallG, '#3a2516', 0.1, 0.92, -0.15, .26, .03);
   disk(stallG, '#c49a42', 0.1, 0.94, -0.15, .24, .02);
   box(stallG, '#a8241e', 0.1, 0.96, -0.15, .02, .01, .28);

   // Wooden skewer stand displaying freshly blown sugar art (吹糖金龙、彩凤与晶莹糖葫芦)
   box(stallG, '#684524', 0.62, 1.15, 0.12, .18, .5, .18);
   for(let k = 0; k < 8; k++){
    const ang = k * 0.78, h = 1.35 + (k % 3) * 0.16;
    const sx = 0.62 + Math.cos(ang) * .12, sz = 0.12 + Math.sin(ang) * .12;
    box(stallG, '#d4a259', sx, h, sz, .014, .36, .014);
    if(k % 2 === 0){
     for(let b = 0; b < 4; b++){
      mesh(stallG, sphere, '#ba1d16', sx, h - .06 + b * .055, sz, .028, .028, .028);
      mesh(stallG, sphere, '#ffe494', sx, h - .06 + b * .055, sz, .03, .01, .03);
     }
    }else{
     mesh(stallG, sphere, '#eeb83e', sx, h + .05, sz, .045, .065, .045);
     mesh(stallG, sphere, '#d99426', sx, h + .12, sz, .03, .03, .04);
    }
   }

   board('非遗老号 · 糖人张', px, 28.5, pz, 2.2, .52, Math.PI / 2);

   vendors.push({
    root: {position: {x: px, y: 26, z: pz}},
    position: {x: px, y: 26, z: pz},
    title: '游商糖人张',
    type: 'candy',
    food: true,
    peddler: true,
    callZh: '冰糖葫芦——大串的哎！吹糖人、关东糖，酸甜酥脆喽——',
    callEn: 'Crispy candied hawthorns and blown sugar figurines!'
   });
  }

  // 2. 挑担栗子王 (King Chestnut Roasting Shop & Iron Wok) at x=11.8, z=181.0
  {
   const px = 11.8, pz = 181.0, stallG = new THREE.Group();
   stallG.position.set(px, 26, pz); stallG.rotation.y = -Math.PI / 2; root.add(stallG);

   // 4 sturdy timber posts
   for(const sx of [-0.95, 0.95]) for(const sz of [-0.55, 0.55]){
    box(stallG, '#5a402a', sx, 1.4, sz, .08, 2.8, .08);
    box(stallG, '#3a2717', sx, 0.15, sz, .12, .3, .12);
   }
   // Pitched eave canopy with cedar valance
   box(stallG, '#4a321f', 0, 2.72, 0, 2.15, .08, 1.35);
   box(stallG, '#3c4b42', 0, 2.84, 0, 2.28, .12, 1.48);
   box(stallG, '#25302a', 0, 2.96, 0, 2.1, .14, .32);
   box(stallG, '#785633', 0, 2.65, .66, 2.15, .15, .04);

   // Masonry hearth stone stove base
   box(stallG, '#686a64', -0.35, 0.45, 0, 1.05, .9, 0.95);
   // Large cast-iron wok (热砂滚炒大铁锅)
   disk(stallG, '#222326', -0.35, 0.92, 0, .42, .14);
   disk(stallG, '#151618', -0.35, 0.96, 0, .38, .04);
   for(let c = 0; c < 16; c++){
    const ang = c * 0.52, r = .08 + (c % 4) * .065;
    mesh(stallG, sphere, '#6e381b', -0.35 + Math.cos(ang) * r, 0.99, Math.sin(ang) * r, .04, .03, .045);
   }
   box(stallG, '#b08b58', -0.35, 1.12, 0.15, .035, .32, .08);

   // Wooden storage counter with paper packaging sacks and wooden measuring bowls
   box(stallG, '#52341d', 0.55, 0.45, 0, .75, .9, 0.95);
   box(stallG, '#704724', 0.55, 0.88, 0, .82, .06, 1.02);
   box(stallG, '#8a6237', 0.55, 0.98, -0.22, .24, .16, .24);
   box(stallG, '#967b58', 0.55, 0.96, 0.2, .26, .18, .26);

   board('老城厢 · 栗子王', px, 28.5, pz, 2.2, .52, -Math.PI / 2);

   vendors.push({
    root: {position: {x: px, y: 26, z: pz}},
    position: {x: px, y: 26, z: pz},
    title: '挑担栗子王',
    type: 'pastry',
    food: true,
    peddler: true,
    callZh: '热气腾腾的糖炒栗子！现炒现剥，粒粒开口甜，香糯热乎嘞——',
    callEn: 'Fresh piping-hot roasted chestnuts! Sweet and fragrant!'
   });
  }

  // 3. 地摊古董刘 (Antique Liu Curio & Relic Pavilion Stall) at x=-92.2, z=212.0
  {
   const px = -92.2, pz = 212.0, stallG = new THREE.Group();
   stallG.position.set(px, 26, pz); stallG.rotation.y = -Math.PI / 2; root.add(stallG);

   // 4 dark carved posts
   for(const sx of [-0.95, 0.95]) for(const sz of [-0.55, 0.55]){
    box(stallG, '#3a2318', sx, 1.4, sz, .08, 2.8, .08);
    box(stallG, '#c89a42', sx, 0.15, sz, .12, .3, .12);
   }
   // Classical roof with royal blue trim
   box(stallG, '#321f15', 0, 2.72, 0, 2.15, .08, 1.35);
   box(stallG, '#25354d', 0, 2.84, 0, 2.28, .12, 1.48);
   box(stallG, '#1e2b3e', 0, 2.96, 0, 2.1, .14, .32);

   // Large counter covered with royal blue silk runner (青蓝金边锦缎长案)
   box(stallG, '#3a2318', 0, 0.45, 0, 1.85, .9, 0.95);
   box(stallG, '#1a365d', 0, 0.88, 0, 1.95, .06, 1.05);
   box(stallG, gold, 0, 0.885, 0, 1.9, .065, .15);

   // Multi-tier stepped curio shelf (多宝格陈列架)
   box(stallG, '#2c180e', -0.4, 1.15, -0.22, .85, .45, .32);
   disk(stallG, '#3d6350', -0.6, 1.42, -0.22, .07, .12);
   box(stallG, '#325442', -0.25, 1.42, -0.22, .12, .14, .12);
   disk(stallG, '#ffffff', 0.22, 0.95, -0.2, .12, .08);
   disk(stallG, '#1d428a', 0.22, 0.97, -0.2, .1, .02);
   mesh(stallG, ring, '#eef3eb', 0.55, 0.93, 0.15, .06, .06, .06);
   mesh(stallG, ring, '#3c825a', 0.55, 0.93, -0.15, .05, .05, .05);
   for(let s = -1; s <= 1; s++){
    box(stallG, '#f0ebd8', -0.3 + s * .12, 0.93, 0.25, .05, .05, .28);
    box(stallG, '#8a3428', -0.3 + s * .12, 0.93, 0.38, .04, .04, .04);
   }
   for(let c = 0; c < 5; c++){
    disk(stallG, '#967842', 0.1 + c * .06, 0.93, 0.22, .04, .01);
   }

   board('金石珍玩 · 古董刘', px, 28.5, pz, 2.2, .52, -Math.PI / 2);

   vendors.push({
    root: {position: {x: px, y: 26, z: pz}},
    position: {x: px, y: 26, z: pz},
    title: '地摊古董刘',
    type: 'antique',
    food: false,
    peddler: true,
    callZh: '祖传官窑、铜钱古玉！走过路过瞧一瞧，全凭眼力掌眼嘞——',
    callEn: 'Ancient coins, antique jade, and curio treasures!'
   });
  }
 }

 createStreetPeddlers();

 // -------------------------------------------------------------
 // 8. TRADITIONAL STONE PAIFANG ARCHWAYS
 // -------------------------------------------------------------
 function paifang(x,z,yaw=0,title='豫园商城 · 老城厢',span=4.8){
  const pGroup=new THREE.Group();pGroup.position.set(x,26,z);pGroup.rotation.y=yaw;root.add(pGroup);
  for(const px of [-span,span]){
   box(pGroup,'#c8c9be',px,2.2,0,.45,4.4,.45);
   box(pGroup,'#afb1a4',px,.5,0,.75,1,.75);
  }
  const totalW=span*2+1.2;
  box(pGroup,'#b5b7a8',0,3.9,0,totalW,.32,.48);
  box(pGroup,'#a8aa9c',0,4.6,0,totalW-.6,.26,.42);
  box(pGroup,'#384840',0,5.2,0,totalW-1.8,.22,1.1);
  for(const sx of [-1,1]){
   const rSide=box(pGroup,'#2d3a33',sx*(span+.3),4.92,0,.28,.14,.85);
   rSide.rotation.z=sx*.32;
  }
  board(title,x,30.3,z,Math.min(totalW-2, 4.6),.68,yaw);
 }

 paifang(-96.5, 149.2, 0, '豫园商城 · 西市老街', 5.2);
 paifang(16.5, 149.2, 0, '豫园商城 · 庙前东市', 4.2);
 paifang(-49, 273.5, Math.PI, '豫园商城 · 秀水南市', 5.0);

 // Stone Lions Guarding Entrances
 function stoneLion(x,z,yaw=0){
  const g=new THREE.Group();g.position.set(x,26,z);g.rotation.y=yaw;root.add(g);
  box(g,'#8f9184',0,.2,0,.8,.4,.8);
  box(g,'#7f8174',0,.5,0,.6,.3,.6);
  box(g,'#9ba092',0,.85,0,.45,.45,.45);
  box(g,'#a4a89b',0,1.15,.08,.38,.34,.35);
  box(g,'#653e2d',0,.48,.28,.14,.14,.14);
  fixtures.push({x,z,rx:.4,rz:.4,y:26,h:1.3});
 }
 stoneLion(-41.0,149.0,-Math.PI/2);
 stoneLion(-52.0,149.0,Math.PI/2);
 stoneLion(-90.8,156,-Math.PI/2);
 stoneLion(-102.2,156,Math.PI/2);
 stoneLion(11.8,156,-Math.PI/2);
 stoneLion(21.2,156,Math.PI/2);

 // -------------------------------------------------------------
 // 9. OVERHEAD FESTIVE LANTERN CANOPY (随风轻摇 + 隐约朦胧华盖)
 // -------------------------------------------------------------
 const streetLanternCables = [
  // West Compact Commercial Street: x1: -101.5, x2: -91.5 (11m width)
  {x1: -101.5, x2: -91.5, z: 156, y: 30.5},
  {x1: -101.5, x2: -91.5, z: 164, y: 30.3},
  {x1: -101.5, x2: -91.5, z: 172, y: 30.5},
  {x1: -101.5, x2: -91.5, z: 180, y: 30.3},
  {x1: -101.5, x2: -91.5, z: 188, y: 30.5},
  {x1: -101.5, x2: -91.5, z: 196, y: 30.3},
  {x1: -101.5, x2: -91.5, z: 204, y: 30.5},
  {x1: -101.5, x2: -91.5, z: 212, y: 30.3},
  {x1: -101.5, x2: -91.5, z: 220, y: 30.5},
  {x1: -101.5, x2: -91.5, z: 228, y: 30.3},
  {x1: -101.5, x2: -91.5, z: 236, y: 30.5},
  {x1: -101.5, x2: -91.5, z: 244, y: 30.3},
  {x1: -101.5, x2: -91.5, z: 252, y: 30.5},
  // East Compact Commercial Street: x1: 12.5, x2: 20.5 (9m width)
  {x1: 12.5, x2: 20.5, z: 156, y: 30.4},
  {x1: 12.5, x2: 20.5, z: 164, y: 30.2},
  {x1: 12.5, x2: 20.5, z: 172, y: 30.5},
  {x1: 12.5, x2: 20.5, z: 180, y: 30.2},
  {x1: 12.5, x2: 20.5, z: 188, y: 30.5},
  {x1: 12.5, x2: 20.5, z: 196, y: 30.2},
  {x1: 12.5, x2: 20.5, z: 204, y: 30.5},
  {x1: 12.5, x2: 20.5, z: 212, y: 30.2},
  {x1: 12.5, x2: 20.5, z: 220, y: 30.5},
  {x1: 12.5, x2: 20.5, z: 228, y: 30.2},
  {x1: 12.5, x2: 20.5, z: 236, y: 30.5},
  {x1: 12.5, x2: 20.5, z: 244, y: 30.2},
  {x1: 12.5, x2: 20.5, z: 252, y: 30.5},
  // North Entrance Paifang & Huxinting Plaza Entrance
  {x1: -52, x2: -41, z: 151, y: 30.6},
  {x1: -52, x2: -41, z: 156, y: 30.4}
 ];

 const lanternColors = ['#ffc848', '#e63428', '#ffda68', '#d82d24', '#ffbf3b', '#e84232'];
 for(const {x1, x2, z, y} of streetLanternCables){
  const cx = (x1 + x2) / 2, len = Math.abs(x2 - x1);
  box(root, '#3b2f24', cx, y, z, len, .035, .035);
  const count = Math.max(3, Math.floor(len / 1.5));
  for(let i = 0; i < count; i++){
   const t = (i + 0.5) / count, lx = x1 + (x2 - x1) * t, sag = Math.sin(t * Math.PI) * 0.26, ly = y - sag;
   const color = lanternColors[(Math.floor(z * 3 + lx * 2) % lanternColors.length + lanternColors.length) % lanternColors.length];
   createSwayingLantern(root, lx, ly, z, color, 1.65, lx*2.3+z*1.7);
  }
 }

 function setStocks(stocks={}){for(const [key,units]of Object.entries(goods)){const count=Number.isFinite(stocks[key])?Math.max(0,Math.min(units.length,Math.floor(stocks[key]))):units.length;units.forEach((group,i)=>{group.visible=i<count;});}}
 setStocks();

 // Animation tick: smooth harmonic swaying in the wind + soft hazy breathing glow (30Hz节流避免逐帧CPU占用)
 let clock = 0, animTimer = 0, districtNear = false;
 function tick(dt, {night=false}={}){
  clock += dt;
  animTimer += dt;
  // Point lights enter every lit shader even when their district is off screen.
  // Keep all local lights together; the wider exit radius prevents edge flicker.
  if(getPos){
   const p=getPos(),radius=districtNear?80:64;
   districtNear=shopLights.some(l=>(l.position.x-p.x)**2+(l.position.y-p.y)**2+(l.position.z-p.z)**2<radius*radius);
  }else districtNear=true;
  // Visibility must update while paused or before the animation throttle yields.
  for(const sl of shopLights)sl.visible=night&&districtNear;
  if(animTimer < 0.033) return;
  animTimer = 0;
  const t = clock;
  // 1. Lanterns & flags sway gently in the breeze
  for(let i = 0; i < swayingObjects.length; i++){
   const item = swayingObjects[i];
   const windGust = Math.sin(t * 0.6 + item.phase * 0.5) * 0.25;
   const swayZ = Math.sin(t * item.speed + item.phase) * (item.maxAngleZ + windGust * item.maxAngleZ);
   const swayX = Math.cos(t * item.speed * 0.75 + item.phase * 1.3) * item.maxAngleX;
   item.group.rotation.z = swayZ;
   item.group.rotation.x = swayX;
  }
  // 2. Soft hazy breathing glow for lantern cores
  if(night && flickeringLights.length > 0){
   const breathe = 0.88 + 0.12 * Math.sin(t * 2.4);
   const item = flickeringLights[0];
   if(item?.mat?.color){
    item.mat.color.setRGB(item.baseColor.r * breathe, item.baseColor.g * breathe, item.baseColor.b * breathe);
   }
  }
  for(const sl of shopLights){
   if(night) sl.intensity = 1.4 + 0.25 * Math.sin(t * 2.0);
  }
 }

 tick(0);
 return {fixtures,dynamicRoots,shops,extraShops,goods,stockCaps,setStocks,vendors,tick};
}
