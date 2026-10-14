import * as THREE from './three.module.js';
import {YUYUAN_BUILDINGS,GARDEN_PONDS} from './yuyuan-layout.js';

// Geometry stays in district-local coordinates; the district root supplies Z+60.
export function createYuyuanStreetAssets(root,{cube,mat,board}){
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
    const ox=(i-1)*.26;
    disk(parent,'#5e3c23',x+ox,y+.18,z,.15,.36);
    disk(parent,'#c92d24',x+ox,y+.37,z,.11,.06);
    disk(parent,gold,x+ox,y+.34,z,.12,.02);
   }
  }else if(type==='herbs'){
   box(parent,'#4a3324',x,y+.24,z,.72,.48,.32);
   for(let r=0;r<3;r++)for(let c=0;c<4;c++){
    box(parent,'#684933',x+(c-1.5)*.16,y+.1+(2-r)*.14,z+.155,.12,.11,.02);
    disk(parent,gold,x+(c-1.5)*.16,y+.1+(2-r)*.14,z+.167,.015,.015);
   }
   disk(parent,'#eee3cb',x+.22,y+.52,z,.08,.16);
   disk(parent,'#4a6b52',x+.22,y+.61,z,.06,.03);
  }else if(type==='jade'){
   box(parent,'#9b2426',x,y+.05,z,.68,.08,.42);
   box(parent,gold,x,y+.05,z,.71,.04,.45);
   for(let i=-1;i<=1;i++){
    disk(parent,'#449b78',x+i*.2,y+.11,z,.07,.03);
    box(parent,gold,x+i*.2,y+.13,z,.04,.02,.04);
   }
  }else if(type==='silk'){
   const silkColors=['#2a5a88','#a8325a','#387a56','#99782a'];
   for(let i=0;i<4;i++){
    const oz=(i-1.5)*.15;
    disk(parent,silkColors[i],x,y+.12,z+oz,.085,.46);
    disk(parent,gold,x,y+.12,z+oz,.09,.025);
   }
  }else if(type==='antique'){
   disk(parent,'#5c6858',x-.18,y+.16,z,.13,.32);
   box(parent,'#5c6858',x-.18,y+.34,z,.22,.06,.22);
   mesh(parent,sphere,'#7bb59c',x+.18,y+.2,z,.14,.18,.14);
   disk(parent,'#7bb59c',x+.18,y+.36,z,.06,.15);
  }else if(type==='pastry'){
   for(let i=0;i<2;i++){
    const ox=(i-.5)*.36;
    disk(parent,'#ba9560',x+ox,y+.1,z,.18,.16);
    disk(parent,'#75522b',x+ox,y+.18,z,.185,.02);
    mesh(parent,sphere,'#fff5d6',x+ox,y+.23,z,.11,.08,.11);
   }
  }else if(type==='candy'){
   box(parent,'#98382f',x-.18,y+.14,z,.28,.26,.26);
   box(parent,gold,x-.18,y+.275,z,.22,.02,.22);
   disk(parent,'#c99548',x+.18,y+.18,z,.12,.34);
   disk(parent,timber,x+.18,y+.36,z,.13,.04);
  }else if(type==='fan'){
   box(parent,cream,x,y+.22,z,.32,.44,.02);
   disk(parent,timber,x,y+.01,z,.024,.4);
   disk(parent,timber,x,y+.44,z,.024,.4);
   for(let i=-2;i<=2;i++)box(parent,'#ba382d',x+i*.05,y+.22,z+.012,.03,.08,.01);
  }else{
   disk(parent,'#784c2a',x-.16,y+.12,z,.14,.24);
   mesh(parent,sphere,'#784c2a',x-.16,y+.26,z,.12,.09,.12);
   for(let i=0;i<2;i++)disk(parent,'#e8dfce',x+.18,y+.08,z+(i-.5)*.18,.06,.14);
  }
 }

 // Helper to create a swaying lantern group
 function createSwayingLantern(parent, x, y, z, color='#e83424', scale=1.0, phaseOffset=0){
  const g = new THREE.Group();
  g.position.set(x, y, z);
  parent.add(g);

  // Hook / cable
  box(g, '#785b3b', 0, -0.06, 0, .02, .12, .02);

  // Main lantern body
  const body = new THREE.Mesh(cylinder, mat(color, true));
  body.position.set(0, -0.36*scale, 0);
  body.scale.set(.24*scale, .5*scale, .24*scale);
  g.add(body);

  // Soft glowing core
  const coreMat = mat('#fff8dd', true);
  const core = new THREE.Mesh(cylinder, coreMat);
  core.position.set(0, -0.36*scale, 0);
  core.scale.set(.11*scale, .44*scale, .11*scale);
  g.add(core);
  flickeringLights.push({mat: coreMat, baseColor: new THREE.Color('#fff8dd'), phase: phaseOffset});

  // Top & bottom brass collars
  disk(g, gold, 0, -0.11*scale, 0, .18*scale, .035*scale);
  disk(g, gold, 0, -0.61*scale, 0, .17*scale, .035*scale);

  // Bottom red fringe / tassel
  box(g, '#d82d22', 0, -0.76*scale, 0, .04*scale, .26*scale, .04*scale);
  disk(g, gold, 0, -0.63*scale, 0, .05*scale, .02*scale);

  swayingObjects.push({group: g, phase: phaseOffset, speed: 1.6, maxAngleZ: 0.075, maxAngleX: 0.045, type: 'lantern'});
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
  let sideWallZ1=z-rz+1.0,sideWallZ2=z+rz-1.0;
  let sideCounterX=x,sideCounterZ=z,sideCounterW=2.2,sideCounterD=0.9;
  let bladeSignX=x,bladeSignZ=z;
  let flagX=x,flagZ=z;

  if(facing==='east'||facing==='east_inner'){
   isXAxis=true;
   doorX=x+rx; doorZ=z;
   frontX=x+rx; frontZ=z;
   backWallX=x-rx+0.45; backWallZ=z;
   frontSignAngle=Math.PI/2;
   signW=Math.min(rz*1.5, 5.2);
   // Side counter on north side, leaving central aisle (z in [z-1.3, z+1.3]) completely open
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
   // North-facing (South Row)
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
  // 1. FLOOR & CARPET (通体木质地板 + 中轴祥瑞地毯)
  // -------------------------------------------------------------
  cube('#2e2118', x, 26.035, z, rx*2-.6, .025, rz*2-.6); // Dark rosewood parquet border
  cube('#e8dbbe', x, 26.05, z, rx*2-1.2, .015, rz*2-1.2); // Golden maple interior floor
  // Center carpet runner leading from entrance to back wall
  if(isXAxis){
   cube(accent, x, 26.065, z, rx*2-1.4, .016, 2.4);
   for(const sz of [-1.15, 1.15]) cube(gold, x, 26.075, z+sz, rx*2-1.4, .01, .06);
  }else{
   cube(accent, x, 26.065, z, 2.4, .016, rz*2-1.4);
   for(const sx of [-1.15, 1.15]) cube(gold, x+sx, 26.075, z, .06, .01, rz*2-1.4);
  }

  // -------------------------------------------------------------
  // 2. OPEN ENTRANCE & SHOWCASE WINDOWS (开敞步入式门洞 + 临街展窗)
  // -------------------------------------------------------------
  // Brass entrance threshold stone
  if(isXAxis){
   cube('#caa54f', frontX, 26.045, z, .36, .07, 2.8);
   // Entrance portal posts
   for(const sz of [-1.45, 1.45]){
    cube(timber, frontX, 27.6, z+sz, .26, 3.2, .26);
    cube(gold, frontX, 27.6, z+sz, .04, 3.1, .28);
    cube('#795634', frontX, 26.3, z+sz, .38, .6, .38); // Base stone
   }
   // Lintel beam across entrance
   cube(timber, frontX, 29.24, z, .28, .22, 3.1);
   cube(gold, frontX, 29.35, z, .3, .04, 3.15);
  }else{
   cube('#caa54f', x, 26.045, frontZ, 2.8, .07, .36);
   for(const sx of [-1.45, 1.45]){
    cube(timber, x+sx, 27.6, frontZ, .26, 3.2, .26);
    cube(gold, x+sx, 27.6, frontZ, .28, 3.1, .04);
    cube('#795634', x+sx, 26.3, frontZ, .38, .6, .38);
   }
   cube(timber, x, 29.24, frontZ, 3.1, .22, .28);
   cube(gold, x, 29.35, frontZ, 3.15, .04, .3);
  }

  // Flanking showcase display vitrines (两侧落地玻璃大展窗)
  if(isXAxis){
   for(const sideCase of [-1, 1]){
    const scZ = z + sideCase * (1.5 + (rz - 1.5)/2);
    const scD = Math.max(0.8, rz - 1.6);
    // Base cabinet
    cube(timber, frontX, 26.55, scZ, .75, 1.05, scD);
    cube(gold, frontX, 27.08, scZ, .79, .04, scD+.04);
    // Showcase glass
    mesh(root, boxGeometry, glassMaterial, frontX, 27.95, scZ, .72, 1.7, scD);
    for(const y of [27.12, 28.8]) cube(gold, frontX, y, scZ, .76, .05, scD+.04);
    // Velvet display riser & feature sample goods
    cube('#7a1d26', frontX, 27.14, scZ, .62, .06, scD-.16);
    decorateThemedGoods(root, type, frontX, 27.2, scZ);
    fixtures.push({x: frontX, z: scZ, rx: .4, rz: scD/2, y: 26, h: 2.6});
   }
  }else{
   for(const sideCase of [-1, 1]){
    const scX = x + sideCase * (1.5 + (rx - 1.5)/2);
    const scW = Math.max(0.8, rx - 1.6);
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
  // 3. BACK-WALL GRAND MULTI-TIER CURIO VITRINE (背墙通顶豪华多宝格)
  // -------------------------------------------------------------
  if(isXAxis){
   const vitrineW = .65, vitrineD = Math.min(rz*1.7, 5.6);
   // Rosewood structural shelving unit
   cube('#3a2618', backWallX, 27.65, backWallZ, vitrineW, 3.2, vitrineD);
   // Illuminated warm backlit panels
   cube('#fff5d8', backWallX+(isEastFacing?.08:-.08), 27.65, backWallZ, .52, 2.9, vitrineD-.3, true);
   // 3 tiers of gold-trimmed shelves
   for(const sy of [26.85, 27.65, 28.45]){
    cube('#caa54f', backWallX+(isEastFacing?.14:-.14), sy, backWallZ, .58, .05, vitrineD-.1);
    // Physical luxury items across each tier
    for(let col = -vitrineD/2 + 0.6; col <= vitrineD/2 - 0.6; col += 1.1){
     decorateThemedGoods(root, type, backWallX+(isEastFacing?.15:-.15), sy+.03, backWallZ+col);
    }
   }
   // Grand golden brand plaque at top of back wall
   board(title+' · 百年老字号', backWallX+(isEastFacing?.36:-.36), 28.8, backWallZ, Math.min(vitrineD*0.7, 4.2), .62, isEastFacing ? Math.PI/2 : -Math.PI/2);
   fixtures.push({x: backWallX, z: backWallZ, rx: vitrineW/2, rz: vitrineD/2, y: 26, h: 3.2});
  }else{
   const vitrineW = Math.min(rx*1.4, 4.6), vitrineD = .65;
   cube('#3a2618', backWallX, 27.65, backWallZ, vitrineW, 3.2, vitrineD);
   cube('#fff5d8', backWallX, 27.65, backWallZ+(facing==='lake_south'?.08:-.08), vitrineW-.3, 2.9, .52, true);
   for(const sy of [26.85, 27.65, 28.45]){
    cube('#caa54f', backWallX, sy, backWallZ+(facing==='lake_south'?.14:-.14), vitrineW-.1, .05, .58);
    for(let col = -vitrineW/2 + 0.6; col <= vitrineW/2 - 0.6; col += 1.1){
     decorateThemedGoods(root, type, backWallX+col, sy+.03, backWallZ+(facing==='lake_south'?.15:-.15));
    }
   }
   board(title+' · 百年老字号', backWallX, 28.8, backWallZ+(facing==='lake_south'?.34:-.34), Math.min(vitrineW*0.7, 4.2), .62, frontSignAngle);
   fixtures.push({x: backWallX, z: backWallZ, rx: vitrineW/2, rz: vitrineD/2, y: 26, h: 3.2});
  }

  // -------------------------------------------------------------
  // 4. SIDE SERVICE COUNTER & PROPS (偏侧红木曲尺服务台，中路大通畅)
  // -------------------------------------------------------------
  cube('#422d1e', sideCounterX, 26.55, sideCounterZ, sideCounterW, 1.1, sideCounterD);
  cube(gold, sideCounterX, 27.12, sideCounterZ, sideCounterW+.06, .05, sideCounterD+.06);
  cube(accent, sideCounterX, 27.15, sideCounterZ, sideCounterW-.12, .02, sideCounterD-.12);
  decorateThemedGoods(root, type, sideCounterX, 27.17, sideCounterZ);
  // Abacus / brush pot / merchant scale on counter
  box(root, '#825832', sideCounterX-.3, 27.2, sideCounterZ, .35, .04, .2);
  disk(root, '#7bb59c', sideCounterX+.35, 27.22, sideCounterZ, .06, .12);
  fixtures.push({x: sideCounterX, z: sideCounterZ, rx: sideCounterW/2, rz: sideCounterD/2, y: 26, h: 1.2});

  // -------------------------------------------------------------
  // 5. SIDE WALL CLASSICAL ART & VITRINES (侧墙山水挂画与博古格)
  // -------------------------------------------------------------
  if(isXAxis){
   // North side wall vitrine
   cube('#3a2618', x, 27.4, z-rz+.25, rx*1.2, 2.5, .35);
   cube('#caa54f', x, 27.4, z-rz+.44, rx*1.15, .04, .08);
   // South side hanging landscape painting scroll
   cube('#4a3522', x, 28.7, z+rz-.28, rx*1.1, .06, .06);
   cube('#ede3cd', x, 27.6, z+rz-.27, rx*0.95, 2.0, .02);
   cube('#4a3522', x, 26.55, z+rz-.28, rx*1.1, .06, .06);
  }

  // -------------------------------------------------------------
  // 6. CEILING CHANDELIER & WARM MISTY GLOW (藻井重檐宫灯吊灯)
  // -------------------------------------------------------------
  cube('#2e1f14', x, 29.4, z, 1.4, .08, 1.4); // Caisson ceiling frame
  cube(gold, x, 29.36, z, 1.46, .02, 1.46);
  // Hanging lantern chandelier
  const chG = new THREE.Group();
  chG.position.set(x, 29.35, z);
  root.add(chG);
  box(chG, '#785b3b', 0, -.25, 0, .04, .5, .04);
  box(chG, gold, 0, -.52, 0, .85, .06, .85);
  const chMat = mat('#ffc966', true);
  const chCore = new THREE.Mesh(cylinder, chMat);
  chCore.position.set(0, -.74, 0); chCore.scale.set(.36, .42, .36); chG.add(chCore);
  box(chG, gold, 0, -.96, 0, .85, .06, .85);
  box(chG, '#d42d22', 0, -1.14, 0, .06, .3, .06); // Bottom tassel
  swayingObjects.push({group: chG, phase: x*2+z*3, speed: 1.2, maxAngleZ: 0.04, maxAngleX: 0.03, type: 'chandelier'});
  flickeringLights.push({mat: chMat, baseColor: new THREE.Color('#ffc966'), phase: x*3+z*2});

  // Soft warm ambient point light illuminating the shop interior
  const shopLight = new THREE.PointLight('#ffdb94', 1.8, 8.5, 1.4);
  shopLight.position.set(x, 28.4, z);
  root.add(shopLight);
  shopLights.push(shopLight);

  // -------------------------------------------------------------
  // 7. UPGRADED SIGNAGE (对标南京路：3D黑漆重檐金匾 + 双面侧悬招牌 + 迎风招幌)
  // -------------------------------------------------------------
  // (A) Grand 3D Horizontal Lintel Plaque (门楣重檐描金牌匾 + 大红绸花)
  let hSignX=frontX, hSignZ=frontZ, hSignAngle=frontSignAngle;
  if(facing==='east'||facing==='east_inner') hSignX += .12;
  else if(facing==='west'||facing==='lake_west') hSignX -= .12;
  else if(facing==='lake_south') hSignZ += .12;
  else hSignZ -= .12;

  // Solid 3D carved backing box
  if(isXAxis){
   cube('#221812', hSignX, 29.38, frontZ, .15, .96, signW+.25);
   cube(gold, hSignX+(isEastFacing?.06:-.06), 29.38, frontZ, .04, 1.04, signW+.32);
   cube(gold, hSignX+(isEastFacing?.08:-.08), 29.38, frontZ, .02, .88, signW+.18);
   board(title, hSignX+(isEastFacing?.12:-.12), 29.38, frontZ, signW, .82, hSignAngle);
   // Large Sculpted Red Silk Rosette (大红绸花结) in top center
   mesh(root, sphere, '#d92b2b', hSignX+(isEastFacing?.2:-.2), 29.86, frontZ, .22, .22, .22);
   mesh(root, cylinder, '#c82323', hSignX+(isEastFacing?.18:-.18), 29.58, frontZ-.14, .08, .36);
   mesh(root, cylinder, '#c82323', hSignX+(isEastFacing?.18:-.18), 29.58, frontZ+.14, .08, .36);
  }else{
   cube('#221812', frontX, 29.38, hSignZ, signW+.25, .96, .15);
   cube(gold, frontX, 29.38, hSignZ+(facing==='lake_south'?.06:-.06), signW+.32, 1.04, .04);
   cube(gold, frontX, 29.38, hSignZ+(facing==='lake_south'?.08:-.08), signW+.18, .88, .02);
   board(title, frontX, 29.38, hSignZ+(facing==='lake_south'?.12:-.12), signW, .82, hSignAngle);
   mesh(root, sphere, '#d92b2b', frontX, 29.86, hSignZ+(facing==='lake_south'?.2:-.2), .22, .22, .22);
  }

  // (B) Dual-Sided Projecting Vertical Blade Sign (双面老字号立体侧悬竖招 / 旗招)
  // Cantilevered 1.5m outward into the pedestrian street so shoppers see it from afar!
  if(isXAxis){
   const bladeBoxX = bladeSignX, bladeBoxZ = bladeSignZ;
   // Bronze & timber casing
   cube('#201915', bladeBoxX, 31.8, bladeBoxZ, 1.25, 3.6, .14);
   // Gilded traditional pagoda crest (顶部飞檐)
   cube('#364940', bladeBoxX, 33.7, bladeBoxZ, 1.45, .18, .28);
   cube(gold, bladeBoxX, 33.82, bladeBoxZ, 1.52, .06, .34);
   // Bottom pendant (底部如意垂花)
   cube(gold, bladeBoxX, 29.92, bladeBoxZ, 1.34, .14, .18);
   // Glowing neon border
   cube('#ffc866', bladeBoxX, 31.8, bladeBoxZ+(isEastFacing?.08:-.08), 1.22, 3.52, .03, true);
   // Two independent signboards facing down-street (+Z) and up-street (-Z)
   board(title, bladeBoxX, 31.8, bladeBoxZ+.085, 1.18, 3.45, 0);
   board(title, bladeBoxX, 31.8, bladeBoxZ-.085, 1.18, 3.45, Math.PI);
   // Wrought-iron cantilever brackets connecting to building wall
   const wallX = frontX, armLen = Math.abs(bladeBoxX - wallX), armMidX = (bladeBoxX + wallX)/2;
   cube('#1a1816', armMidX, 33.2, bladeBoxZ, armLen, .06, .06);
   cube('#1a1816', armMidX, 30.4, bladeBoxZ, armLen, .06, .06);
   cube('#2e251e', wallX, 31.8, bladeBoxZ, .08, 3.2, .14);
  }

  // (C) Fluttering Swallow-Tail Fabric Shop Banner (祥瑞迎风招幌 / 酒旗)
  const flagGroup = new THREE.Group();
  flagGroup.position.set(flagX, 29.8, flagZ);
  root.add(flagGroup);
  // Horizontal timber pole extending from eave
  if(isXAxis){
   const poleLen = 1.3, poleDir = facing==='east'? 1 : -1;
   box(flagGroup, timber, poleDir*poleLen/2, 0, 0, poleLen, .05, .05);
   disk(flagGroup, gold, poleDir*poleLen, 0, 0, .05, .08);
   // Hanging fabric banner
   const bannerMesh = box(flagGroup, accent, poleDir*(poleLen-.2), -.65, 0, .02, 1.2, .65);
   // Swallow tail notch trim at bottom
   box(flagGroup, gold, poleDir*(poleLen-.2), -1.26, 0, .025, .05, .66);
   box(flagGroup, '#d42d22', poleDir*(poleLen-.2), -1.34, 0, .02, .12, .6);
  }
  swayingObjects.push({group: flagGroup, phase: x*1.9+z*2.7, speed: 2.1, maxAngleZ: 0.11, maxAngleX: 0.05, type: 'flag'});

  // (D) Swaying Red Festive Entrance Lanterns (门前随风轻摇红灯笼)
  if(isXAxis){
   for(const lz of [z-1.9, z+1.9]){
    createSwayingLantern(root, frontX+(facing==='east'?.42:-.42), 29.1, lz, '#e83424', 1.05, frontX*2+lz*3);
   }
  }else{
   for(const lx of [x-1.9, x+1.9]){
    createSwayingLantern(root, lx, 29.1, frontZ+(facing==='lake_south'?.42:-.42), '#e83424', 1.05, lx*2+frontZ*3);
   }
  }

  // Record shop metadata and vendor cry details
  extraShops.push({id:conf.id,x:doorX,z:doorZ,title:conf.title,type:conf.type,accent:conf.accent});
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
 stoneLion(-43.2,149.5,-Math.PI/2);
 stoneLion(-49.8,149.5,Math.PI/2);
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
   createSwayingLantern(root, lx, ly, z, color, 0.95, lx*2.3+z*1.7);
  }
 }

 function setStocks(stocks={}){for(const [key,units]of Object.entries(goods)){const count=Number.isFinite(stocks[key])?Math.max(0,Math.min(units.length,Math.floor(stocks[key]))):units.length;units.forEach((group,i)=>{group.visible=i<count;});}}
 setStocks();

 // Animation tick: smooth harmonic swaying in the wind + soft hazy breathing glow
 let clock = 0;
 function tick(dt, {night=false}={}){
  clock += dt;
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
  for(let i = 0; i < flickeringLights.length; i++){
   const item = flickeringLights[i];
   const breathe = 0.88 + 0.12 * Math.sin(t * 2.4 + item.phase) + 0.04 * Math.sin(t * 5.8 + item.phase * 1.7);
   if(night && item.mat?.color){
    item.mat.color.setRGB(item.baseColor.r * breathe, item.baseColor.g * breathe, item.baseColor.b * breathe);
   }
  }
  for(const sl of shopLights){
   sl.visible = night;
   if(night) sl.intensity = 1.4 + 0.25 * Math.sin(t * 2.0);
  }
 }

 return {fixtures,dynamicRoots,shops,extraShops,goods,stockCaps,setStocks,vendors,tick};
}
