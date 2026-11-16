import {PLANE_TREE_LEAVES_TILE,PLANE_TREE_BARK_TILE} from './plane-tree-tiles.js';

const mansionOffset={x:-3,z:13};
const prowX=-293,sternX=-326;
const mansionBow={x:prowX+mansionOffset.x,z:165+mansionOffset.z};
export const WUKANG={
 bounds:{minX:-336,maxX:-273,minZ:43,maxZ:199},
 mansion:{x:-311+mansionOffset.x,z:162+mansionOffset.z,top:61,bow:mansionBow},
 arrival:{x:-272.5,y:26,z:184.5,name:'武康大楼 · 街角广场',mapX:mansionBow.x,mapZ:mansionBow.z,viewTarget:{x:mansionBow.x,y:43.5,z:mansionBow.z}},
 road:[[-284,179],[-284,168],[-289,158],[-298,151],[-304,143],[-301,134],[-302,115],[-306,102],[-308,84],[-310,69],[-306,54],[-308,48]],
 signs:[[-280,29,172,'武康大楼 · 淮海中路'],[-297,29,137,'武康路 · 梧桐街区']]
};
export const PUXI_RESIDENCES={
 bounds:{minX:-266,maxX:-221,minZ:86,maxZ:152},
 arrival:{x:-244.5,y:26,z:151.5,name:'衡复里 · 住宅小院',viewTarget:{x:-244,y:28.4,z:137}},
 signs:[[-244.5,29.3,152,'衡复里 · 住宅小院']]
};
export const WUKANG_ROAD_WIDTH=3.5;
export const WUKANG_HUAIHAI=[
 ['west-huaihai','淮海中路',-284,179,-211,179,3],
 ['west-huaihai-corner','淮海中路转角',-284,179,-284,191,3],
 ['west-huaihai-south','淮海中路南段',-327,191,-284,191,3]
];
const huaihaiHouses=[
 {x:-269,z:165,rx:5,rz:4,face:1,style:'brick',height:12},
 {x:-254,z:164,rx:5,rz:5,face:1,style:'garden',height:10},
 {x:-241,z:165,rx:4,rz:4,face:1,style:'spanish',height:13},
 {x:-274,z:194,rx:4,rz:4,face:-1,style:'spanish',height:11},
 {x:-261,z:194,rx:5,rz:4,face:-1,style:'brick',height:12},
 {x:-228,z:194,rx:5,rz:4,face:-1,style:'garden',height:11}
];
export const WUKANG_HOUSES=[
 {x:-323,z:57,rx:6,rz:5,face:1,style:'spanish',height:12},
 {x:-290,z:59,rx:6,rz:5,face:-1,style:'brick',height:11},
 {x:-326,z:74,rx:6,rz:5,face:1,style:'brick',height:10},
 {x:-288,z:75,rx:6,rz:5,face:-1,style:'garden',height:12},
 {x:-324,z:91,rx:6,rz:5,face:1,style:'garden',height:11},
 {x:-289,z:94,rx:7,rz:6,face:-1,style:'spanish',height:13},
 {x:-322,z:107,rx:6,rz:5,face:1,style:'brick',height:11,shop:'coffee'},
 {x:-286,z:111,rx:6,rz:5,face:-1,style:'garden',height:11,shop:'bookshop'},
 {x:-321,z:125,rx:6,rz:6,face:1,style:'spanish',height:10,shop:'flowers'},
 {x:-283,z:130,rx:6,rz:5,face:-1,style:'brick',height:12,shop:'film'},
 {x:-326,z:140,rx:6,rz:5,face:1,style:'garden',height:12},
 {x:-282,z:146,rx:7,rz:6,face:-1,style:'spanish',height:14},
 {x:-317,z:96,rx:2,rz:1,face:1,style:'garden',height:4,gate:true}
];
export const WUKANG_SHOPS={
 coffee:{name:'梧桐咖啡',color:'#695048',keeper:'顾棠 · 梧桐咖啡主理人',intro:'一进门能闻见烘豆香吧？这是我外婆家的老洋房，临街那扇窗，她从前用来等人回家。',question:'附近哪里适合拍武康大楼？',answer:'回到淮海中路街角，走到树池旁的人行道上。镜头里留一截骑楼和梧桐枝，才能看得出那栋楼有多像船。'},
 bookshop:{name:'旧页书局',color:'#455650',keeper:'罗宁 · 旧页书局主理人',intro:'慢慢看。这间店只收旧书，书里夹着的车票和留言，我通常也一起留下。',question:'有关于武康路的书吗？',answer:'左手靠窗那排是上海的旧地图。你可以先找「福开森路」这个名字，再认认今天脚下这条街。'},
 flowers:{name:'三时花房',color:'#785759',keeper:'林芷 · 三时花房主理人',intro:'今天的洋桔梗还没全开。我用旧果酱瓶养一束，送给每天路过的邻居。',question:'你最喜欢梧桐路的哪个季节？',answer:'秋天。树冠还绿着，地上已经有金叶子了。天一亮，骑自行车的人总会压过第一批落叶。'},
 film:{name:'转角胶片',color:'#45566a',keeper:'许澈 · 转角胶片主理人',intro:'这里洗胶片，也给附近老人翻拍旧照片。刚才有人带来的相册，骑楼下的招牌还是手写的。',question:'怎么拍出一点老上海的味道？',answer:'把光留给奶油色的骑楼，等有人从阴影里走出来再按快门。梧桐树影比滤镜耐看。'}
};

export function wukangLand(x,z){
 return x>=-336&&x<-288&&z>=40+Math.max(0,Math.floor((-x-319)/2))&&z<=201-Math.max(0,Math.floor((-x-322)/2));
}

function inside(rect,x,z){
 return x>=rect.minX&&x<=rect.maxX&&z>=rect.minZ&&z<=rect.maxZ;
}
export function wukangReserved(x,z){
 if(inside(WUKANG.bounds,x,z)||inside(PUXI_RESIDENCES.bounds,x,z))return true;
 return x>=-287&&x<=-220&&z>=157&&z<=200&&huaihaiHouses.some(h=>Math.abs(x-h.x)<=h.rx+1&&Math.abs(z-h.z)<=h.rz+2);
}
export function wukangChunk(cx,cz,size){
 const x=cx*size,z=cz*size;
 return [WUKANG.bounds,PUXI_RESIDENCES.bounds].some(b=>x+size>b.minX&&x<=b.maxX&&z+size>b.minZ&&z<=b.maxZ)||
  x+size>-287&&x<=-220&&z+size>157&&z<=200;
}

function roadDistance(x,z){
 let d=Infinity;
 for(let i=1;i<WUKANG.road.length;i++){
  const [ax,az]=WUKANG.road[i-1],[bx,bz]=WUKANG.road[i],dx=bx-ax,dz=bz-az;
  const t=Math.min(1,Math.max(0,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
  d=Math.min(d,Math.hypot(x-ax-dx*t,z-az-dz*t));
 }
 return d;
}
function roadX(z){
 for(let i=1;i<WUKANG.road.length;i++){
  const [ax,az]=WUKANG.road[i-1],[bx,bz]=WUKANG.road[i];
  if(z>=bz&&z<=az)return Math.round(ax+(bx-ax)*(az-z)/(az-bz));
 }
 return WUKANG.road.at(-1)[0];
}

function hull(x,z){
 const u=prowX-x;
 if(u<0||x<sternX)return false;
 const north=162-Math.floor(u*.5)+(u===0?2:u===1?1:0),south=168+Math.floor(u/12)-(u===0?2:0);
 return z>=north&&z<=south;
}
function edge(x,z){return !hull(x-1,z)||!hull(x+1,z)||!hull(x,z-1)||!hull(x,z+1);}
function mansion(w){
 const place=(x,y,z,id)=>w.set(x+mansionOffset.x,y,z+mansionOffset.z,id);
 for(let x=sternX-1;x<=prowX+1;x++)for(let z=144;z<=172;z++){
  const inside=hull(x,z),facade=inside&&edge(x,z),u=prowX-x;
  if(!inside){
   if(hull(x-1,z)||hull(x+1,z)||hull(x,z-1)||hull(x,z+1)){
    for(const y of [35,55,60])place(x,y,z,9);
    for(const y of [36,56])if((x+z)%2===0)place(x,y,z,3);
   }
   continue;
  }
  place(x,25,z,9);
  const arcadeBay=(u+8)%7,widePier=arcadeBay===0||arcadeBay===6,nextToStreet=u<=3||z<=151||z>=165;
  for(let y=26;y<=61;y++){
   if(y<=31){
    const innerWall=!facade&&hull(x-3,z)&&hull(x+3,z)&&hull(x,z-3)&&hull(x,z+3);
    const archPier=facade&&(widePier||y>=30&&(arcadeBay===1||arcadeBay===5)||y===31&&(arcadeBay===2||arcadeBay===4));
    if(innerWall){
     const recessedWindow=y>=27&&y<=29&&arcadeBay>=2&&arcadeBay<=4;
     place(x,y,z,recessedWindow?11:y<=29?7:9);
    }else if(archPier||!nextToStreet&&facade)place(x,y,z,9);
   }else{
    const cornice=[35,55,60,61].includes(y),slab=cornice||[32,39,43,47,51].includes(y);
    const windowBay=u<=3?z%2===0:[1,2,4].includes(u%6),floor=(y-36)%4;
    const window=facade&&windowBay&&!slab&&(y<36||floor>0);
    if(slab||facade)place(x,y,z,window?11:cornice||y<36||y>55?9:8);
    if(facade&&windowBay&&floor===0&&y>=36&&y<=52){
     if(!hull(x,z-1))place(x,y,z-1,9);
     if(!hull(x,z+1))place(x,y,z+1,9);
    }
   }
  }
 }
}

function villa(w,house){
 const {x,z,rx,rz,face,style,height,shop,gate}=house,front=x+face*rx,top=25+height;
 const wall=style==='brick'?8:9,roof=style==='garden'?3:8;
 if(gate){w.fill(x-rx,26,z,x-rx,top,z,wall);w.fill(x+rx,26,z,x+rx,top,z,wall);w.fill(x-rx,top,z,x+rx,top,z,roof);return;}
 w.fill(x-rx,25,z-rz,x+rx,25,z+rz,shop?7:9);
 for(const u of [x-rx,x+rx])w.fill(u,26,z-rz,u,top,z+rz,wall);
 for(const v of [z-rz,z+rz])w.fill(x-rx,26,v,x+rx,top,v,wall);
 for(let y=30;y<=top-2;y+=4){
  for(let v=z-rz+2;v<=z+rz-1;v+=3){
   for(const u of [x-rx,x+rx])w.fill(u,y,v,u,y+1,v,11);
   w.set(front+face,y-1,v,9);
   if(!shop)w.set(front+face,y,v-1,4);
  }
  for(let u=x-rx+2;u<=x+rx-2;u+=3)for(const v of [z-rz,z+rz])w.fill(u,y,v,u,y+1,v,11);
 }
 // Two overhanging eaves and a hipped roof over the attic.
 w.fill(x-rx-1,top+1,z-rz-1,x+rx+1,top+1,z+rz+1,9);
 for(let tier=0;tier<=Math.min(rx,rz);tier++)w.fill(x-rx+tier,top+2+tier,z-rz+tier,x+rx-tier,top+2+tier,z+rz-tier,roof);
 w.fill(x-rx+2,top+2,z+rz-1,x-rx+2,top+5,z+rz-1,8);
 if(shop){
  w.fill(front,26,z-1,front,29,z+1,0);
  for(const v of [z-3,z+3])w.fill(front,27,v-1,front,28,v+1,11);
  for(let v=z-rz;v<=z+rz;v++)for(let d=1;d<=2;d++)w.set(front+face*d,30,v,v%2===0?7:9);
  const back=x-face*(rx-1);
  w.fill(back,26,z-3,back,27,z+3,7);
  for(const v of [z-3,z,z+3])w.set(back,28,v,shop==='flowers'?5:shop==='film'?3:9);
  w.fill(Math.min(x,x+face),26,z+3,Math.max(x,x+face),26,z+4,7);
  w.fill(x-rx+1,31,z-rz+1,x+rx-1,31,z+rz-1,7);
 }else{
  w.fill(front,26,z,front,28,z,4);
  w.fill(front+face,29,z-2,front+face,29,z+2,9);
  for(const v of [z-rz,z+rz])w.fill(front+face*2,26,v,front+face*2,27,v,8);
  if(style==='garden')for(let v=z-2;v<=z+2;v++)if(v!==z)w.set(front+face*2,27,v,5);
 }
}

function planeTree(w,x,z,h,leanX,leanZ=0){
 w.fill(x,26,z,x,25+h,z,4);
 for(let step=1;step<=3;step++){
  const branchY=25+h+Math.floor(step/2),xx=x+leanX*step,zz=z+leanZ*step;
  w.fill(xx,branchY,zz,xx,branchY+1,zz,4);
 }
 w.disc(x+leanX*2,27+h,z+leanZ*2,4,5);
 w.disc(x+leanX,28+h,z+leanZ,5,5);
 w.disc(x-leanX,29+h,z-leanZ+1,4,5);
 w.disc(x+leanX*2,30+h,z+leanZ*2-1,2,5);
}

export function buildWukang(w){
 const b=WUKANG.bounds;
 for(let x=b.minX;x<=b.maxX;x++)for(let z=b.minZ;z<=b.maxZ;z++){
  if(w.surfaceAt(x,z)<26)continue;
  const distance=roadDistance(x,z);
  if(distance<=WUKANG_ROAD_WIDTH)w.set(x,25,z,3);
  else if(w.get(x,25,z)===3)continue; // Preserve the existing Huaihai carriageway.
  else if(distance<=7)w.set(x,25,z,9);
  else if(x<-288&&Math.abs(z-179)>5)w.set(x,25,z,1);
 }
 for(const house of WUKANG_HOUSES){
  const {x,z,rx,rz,face}=house,front=x+face*rx;
  if(house.gate)continue;
  const center=roadX(z);
  for(let xx=Math.min(front,center);xx<=Math.max(front,center);xx++){
   for(let zz=z-2;zz<=z+2;zz++)if(w.get(xx,25,zz)!==3)w.set(xx,25,zz,9);
  }
 }
 mansion(w);
 for(const house of WUKANG_HOUSES)villa(w,house);
 for(const tree of wukangTrees)planeTree(w,...tree);
 w.fill(-277,25,187,-270,25,192,9);
 buildHuaihaiFrontage(w);
}

function buildHuaihaiFrontage(w){
 // Transpose the same villa model so the houses address Huaihai rather than Wukang Road.
 const rotated={
  set:(x,y,z,id)=>w.set(z,y,x,id),
  fill:(x,y,z,xx,yy,zz,id)=>w.fill(z,y,x,zz,yy,xx,id)
 };
 for(const house of huaihaiHouses){
  const {x,z,rx,rz,face}=house,front=z+face*rz,sidewalk=179-face*5;
  w.fill(x-2,25,Math.min(front,sidewalk),x+2,25,Math.max(front,sidewalk),9);
  villa(rotated,{...house,x:z,z:x,rx:rz,rz:rx});
 }
 buildResidences(w);
}

function buildResidences(w){
 const {minX,maxX,minZ,maxZ}=PUXI_RESIDENCES.bounds;
 w.fill(minX,25,minZ,maxX,25,maxZ,9);
 w.fill(-248,25,86,-240,25,154,6);
 w.fill(-265,25,95,-221,25,98,6);
 w.fill(-264,25,122,-223,25,125,6);
 w.fill(-245,25,136,-215,25,140,6);
 for(const [x,z,face,style,height] of [
  [-258,91,1,'brick',11],[-233,91,-1,'garden',10],
  [-258,103,1,'spanish',12],[-232,103,-1,'brick',14],
  [-257,115,1,'garden',10],[-231,116,-1,'brick',13],
  [-257,131,1,'brick',13],[-231,131,-1,'spanish',11],
  [-257,145,1,'garden',11],[-231,145,-1,'brick',15]
 ])villa(w,{x,z,rx:6,rz:4,face,style,height});
 // A low frontage wall leaves the courtyard open from both walking approaches.
 for(const [from,to] of [[minX,-249],[-239,maxX]])w.fill(from,26,maxZ,to,26,maxZ,8);
 for(const x of [-249,-239])w.fill(x,26,maxZ,x,29,maxZ,9);
 w.fill(-249,29,maxZ,-239,29,maxZ,8);
 for(const [x,z] of [[-250,137],[-239,144],[-251,124],[-237,124],[-251,97],[-237,97]])planeTree(w,x,z,4,0,1);
 for(const x of [-250,-238]){
  w.fill(x,25,140,x+1,25,143,1);
  w.fill(x,26,142,x+1,26,142,7);
 }
 w.fill(-218,25,137,-215,25,148,9);
}

const wukangTrees=[[-331,169,5,-1],[-317,197,5,1],[-302,197,5,1],[-290,172,5,1]];
for(let i=0;i<12;i++)for(const side of [-1,1]){
 const z=54+i*8+(side>0?3:0);
 wukangTrees.push([roadX(z)+side*6,z,5+i%3,-side]);
}
for(let x=-272;x<=-221;x+=10)wukangTrees.push([x,173,6,0,1],[x+4,186,5,0,-1]);

const treeCell=(x,y,z)=>(y*256+z)*512+x;
const planeBark=new Set();
for(const [x,z,h,dx,dz=0] of wukangTrees){
 for(let y=26;y<=25+h;y++)planeBark.add(treeCell(x,y,z));
 for(let step=1;step<=3;step++){
  const yy=25+h+Math.floor(step/2);
  for(let y=yy;y<=yy+1;y++)planeBark.add(treeCell(x+dx*step,y,z+dz*step));
 }
}
export function wukangTreeTile(x,y,z,id){
 if(id===4&&planeBark.has(treeCell(x,y,z)))return PLANE_TREE_BARK_TILE;
 if(id===5&&y>=31&&(inside(WUKANG.bounds,x,z)||x>=-278&&x<=-211&&(z>=168&&z<=178||z>=182&&z<=191))){
  return PLANE_TREE_LEAVES_TILE;
 }
}

const asphalt=[.37,.42,.43],ochre=[.88,.75,.58],brick=[.84,.58,.46],stone=[1.10,1.02,.86],glass=[1.13,.73,.32],leaves=[.78,1.04,.71];
const wood=[.81,.67,.54],bark=[1.11,.97,.77],slate=[.39,.47,.51];
export function wukangShade(x,y,z,id){
 if(!wukangReserved(x,z))return;
 if(id===3)return y===25?asphalt:slate;
 if(id===8)return brick;
 if(id===9)return y===25?ochre:stone;
 if(id===11)return glass;
 if(id===5)return leaves;
 if(id===7)return wood;
 if(id===4)return bark;
}
