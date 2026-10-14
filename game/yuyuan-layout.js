export const YUYUAN_SHIFT=60;
const YUYUAN_LOCAL={x:-46,y:26,z:188,minX:-116,maxX:30,minZ:146,maxZ:276,entry:{x:-46.5,y:26,z:150.5,name:'豫园 · 北门牌坊'},tea:{x:-46,y:26,z:178},snack:{x:-26,y:26,z:214},riddle:{x:-62,y:26,z:203},arrival:{x:-43.5,y:26,z:159.5,name:'豫园 · 九曲桥与湖心亭'}};
export const YUYUAN={...YUYUAN_LOCAL,z:YUYUAN_LOCAL.z+YUYUAN_SHIFT,minZ:YUYUAN_LOCAL.minZ+YUYUAN_SHIFT,maxZ:YUYUAN_LOCAL.maxZ+YUYUAN_SHIFT,...Object.fromEntries(['entry','tea','snack','riddle','arrival'].map(k=>[k,{...YUYUAN_LOCAL[k],z:YUYUAN_LOCAL[k].z+YUYUAN_SHIFT}]))};
export const YUYUAN_WALKS=[[-35.5,70.5],[-46.5,216.5]],YUYUAN_STATION_WALK=[[-86,212],[-77,212],[-77,218],[-72,218]],YUYUAN_STATION_WALK_SOUTH=[[-86,262],[-77,262],[-77,265],[-70,265]];
export const WATER_CORRIDOR={x:-60,z1:170,z2:193,width:3};

// Expanded 4x Garden Bounds: ~114 x 68 blocks = ~7,000 blocks area (approx 4.3x original 1,600 area)
export const INNER_GARDEN={minX:-106,maxX:3,minZ:194,maxZ:258};
export const INNER_GARDEN_BOUNDARY=[[-75,194],[3,194],[3,258],[-106,258],[-106,208],[-75,208]];
export const INNER_GATES=[{id:'north',axis:'z',x:-35,z:194},{id:'west',axis:'x',x:-75,z:205}];
export const GARDEN_WINDOWS=[{axis:'z',x:-46,z:194,y:28.5,r:1.1},{axis:'z',x:-46,z:208,y:28.5,r:1.1}];

// Natural meandering ponds and commercial water-street canal
export const GARDEN_PONDS=[
 {x1:-63.5,x2:-29.5,z1:169,z2:193}, // 0. Central Huxinting outdoor pond
 {x1:-70,x2:-57,z1:198,z2:202},    // 1. West rockery pool
 {x1:-14,x2:-2,z1:198,z2:207}      // 2. East inner pond
];

// Rich planting zones: pines & bamboo on rockeries, willows at waterside, mondo grass carpet & seasonal flowers
export const GARDEN_BEDS=[
 {x1:-73,x2:-67,z1:155,z2:166},
 {x1:-41,x2:-32,z1:156,z2:165},
 {x1:-29,x2:-19,z1:177,z2:187},
 {x1:-72,x2:-67,z1:195,z2:202},
 {x1:-54,x2:-44,z1:198,z2:207},
 {x1:-39,x2:-30,z1:203,z2:208},
 {x1:-49,x2:-38,z1:219,z2:226},
 // 4x Expanded Garden Plant Beds
 {x1:-104,x2:-82,z1:196,z2:208},   // San Sui Tang court: pine & bamboo
 {x1:-105,x2:-86,z1:234,z2:254},   // Grand Rockery south: black pines & bamboo
 {x1:-78,x2:-62,z1:212,z2:228},    // Wan Hua Lou court: ancient ginkgo & camellia
 {x1:-38,x2:-22,z1:244,z2:256},    // Yu Ling Long court: tree peonies, plum & mondo grass
 {x1:-18,x2:-6,z1:244,z2:256},     // Dian Chun Tang stage south garden
 {x1:-58,x2:-42,z1:222,z2:232}     // Central waterside weeping willows & seasonal flora
];

// Inner Garden Walkable Paths Network
export const INNER_GARDEN_PATH=[[-35,194],[-35,196],[-40,197.5],[-45,196.5],[-50,198],[-54,197.5],[-54,204],[-60,204],[-68,205],[-75,205]];
export const INNER_GARDEN_EAST_PATH=[[-35,196],[-25,197],[-20,201],[-15,211],[-8,212],[-5,209],[-.5,207],[-.5,196],[-10,196],[-23,196],[-35,196]];
export const INNER_GARDEN_SOUTH_PATH=[[-54,204],[-60,214],[-62,226],[-62,246],[-48,246],[-36,244],[-24,242],[-16,232],[-15,211]];
export const INNER_GARDEN_ROCKERY_PATH=[[-75,205],[-86,206],[-94,206],[-94,222],[-86,226],[-78,226],[-68,226]];

export function gardenPathContains(x,z,width=3){
 return pathContains(x,z,INNER_GARDEN_PATH,width)||pathContains(x,z,INNER_GARDEN_EAST_PATH,width)||pathContains(x,z,INNER_GARDEN_SOUTH_PATH,width)||pathContains(x,z,INNER_GARDEN_ROCKERY_PATH,width);
}

export function innerGardenContains(x,z){
 return (x>-74.3&&x<2.8&&z>194.7&&z<(x<-18.2?207.8:215.8))||(x>-105.8&&x<2.8&&z>=207.8&&z<257.8);
}

export function gardenBedContains(x,z,b){
 const cx=(b.x1+b.x2)/2,cz=(b.z1+b.z2)/2,rx=(b.x2-b.x1)/2,rz=(b.z2-b.z1)/2;
 return ((x-cx)/rx)**2+((z-cz)/rz)**2<.9+.1*Math.sin(x*1.3+z*.7)&&!gardenPathContains(x,z,1.6)&&!GARDEN_PONDS.some(p=>x>=p.x1-1&&x<=p.x2+1&&z>=p.z1-1&&z<=p.z2+1);
}

export const JIUQU_BRIDGE=[[-64,173],[-58,173],[-58,176],[-54,176],[-54,184],[-51,184],[-51,178],[-40,178],[-40,184],[-35,184],[-35,192]];

export function pathContains(x,z,points,width=3){
 return points.some((b,i)=>{
  if(!i)return false;
  const a=points[i-1],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));
  return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz)<=width;
 });
}

export function yuyuanReserved(x,z){
 return x>=YUYUAN.minX-2&&x<=YUYUAN.maxX+2&&z>=YUYUAN.minZ-2&&z<=YUYUAN.maxZ+2||pathContains(x,z,YUYUAN_STATION_WALK,2)||pathContains(x,z,YUYUAN_STATION_WALK_SOUTH,2);
}

// Architectural Buildings: Authentic Ming-Qing Classical pavilions & heritage commercial halls
export const YUYUAN_BUILDINGS=[
 // 1. Central Core: Huxinting Teahouse on the water
 {id:'huxinting',x:-46,z:178,rx:4,rz:4,levels:2},
 {id:'tea-gallery',x:-65,z:163,rx:5,rz:3,levels:1},
 
 // 2. Yuyuan Commercial Bazaar: North Entrance Old Street (两侧对排传统商肆步行街 - bazaar_street.jpg)
 {id:'bazaar-west-candy',x:-56,z:155,rx:5,rz:4,levels:2}, // 西侧北铺: 上海梨膏糖百年老铺
 {id:'bazaar-west-herbs',x:-56,z:164,rx:5,rz:4,levels:2}, // 西侧南铺: 童涵春堂老药铺
 {id:'hefeng-lou',x:-37,z:155,rx:5,rz:4,levels:2},         // 东侧北铺: 和丰楼经典美食雅集
 {id:'bazaar-east-gold',x:-37,z:164,rx:5,rz:4,levels:2},  // 东侧南铺: 老庙黄金祥瑞银楼
 
 // 3. Bazaar Landmarks (华宝楼与古戏台)
 {id:'huabao-lou',x:-86,z:172,rx:7,rz:6,levels:3}, // 华宝楼: 3-tier grand antique & art hall
 {id:'bazaar-stage',x:-102,z:156,rx:5,rz:4,levels:2},// 商圈露天民俗古戏台
 
 // 4. Old Heritage Brands & Street Mall (老字号商厦)
 {id:'nanxiang',x:-26,z:214,rx:6,rz:4,levels:2},    // 南翔馒头店
 {id:'craft-shop',x:-62,z:214,rx:6,rz:4,levels:2},  // 江南手作丝绸
 {id:'tonghanchun',x:-86,z:188,rx:6,rz:4,levels:2}, // 童涵春堂国药
 {id:'lubolang',x:-28,z:188,rx:5,rz:4,levels:2},     // 绿波廊水榭
 
 // 5. East Commercial Street: West Row facing East Row across central pedestrian promenade
 {id:'old-city-northeast',x:8,z:158,rx:4,rz:5,levels:2},
 {id:'tianyu-lou',x:8,z:174,rx:4,rz:7,levels:3},   // 天裕楼: 3-tier towering commercial pavilion
 {id:'shanghai-hotel',x:8,z:192,rx:4,rz:6,levels:3},// 上海老饭店: 3-tier banquet landmark
 {id:'ningbo-tangtuan',x:8,z:208,rx:4,rz:4,levels:2},// 宁波汤团店
 {id:'old-city-east',x:8,z:224,rx:4,rz:6,levels:3},
 
 // East Row of East Commercial Street (x=19, 7 shops facing West Row across x in [12, 15])
 ...Array.from({length:7},(_,i)=>({id:'yuyuan-street-'+i,x:19,z:162+i*12,rx:4,rz:4,levels:2})),
 {id:'old-city-west',x:-104,z:180,rx:5,rz:7,levels:3},
 {id:'old-city-south',x:-49,z:268,rx:8,rz:3,levels:2},
 {id:'yuyuan-south-west',x:-78,z:268,rx:6,rz:4,levels:2},
 {id:'yuyuan-south-east',x:-18,z:268,rx:6,rz:4,levels:2},
 
 // 6. Expanded Classical Garden Halls (4倍内园古典建筑)
 {id:'sansui-tang',x:-94,z:202,rx:6,rz:4,levels:1}, // 三穗堂 (大假山前堂)
 {id:'wangjiang-ting',x:-94,z:224,rx:3,rz:3,levels:1},// 望江亭 (大假山绝顶)
 {id:'dianchun-tang',x:-16,z:232,rx:6,rz:4,levels:2}, // 点春堂 (古戏台主堂)
 {id:'wanhua-lou',x:-54,z:226,rx:5,rz:4,levels:2},   // 万花楼
 {id:'yuhua-tang',x:-36,z:242,rx:5,rz:4,levels:1},   // 玉华堂 (对望玉玲珑)
 {id:'huijing-lou',x:-62,z:248,rx:5,rz:4,levels:2}   // 会景楼 (水上楼阁)
];

export function buildYuyuan(world){
 // 1. Solid terrain foundation for the expanded urban footprint & approach walkway
 for(let x=-55;x<=-25;x++)for(let z=80;z<=210;z++)if(!world.get(x,25,z)){world.fill(x,18,z,x,24,z,3);world.set(x,25,z,9);}
 for(let x=YUYUAN_LOCAL.minX-2;x<=YUYUAN_LOCAL.maxX+2;x++)for(let z=YUYUAN_LOCAL.minZ+YUYUAN_SHIFT-2;z<=YUYUAN_LOCAL.maxZ+YUYUAN_SHIFT+2;z++)if(!world.get(x,25,z)){world.fill(x,18,z,x,24,z,3);world.set(x,25,z,9);}
 
 for(const points of [YUYUAN_STATION_WALK,YUYUAN_STATION_WALK_SOUTH])for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i];
  world.fill(Math.min(a[0],b[0])-2,25,Math.min(a[1],b[1])-2,Math.max(a[0],b[0])+2,25,Math.max(a[1],b[1])+2,9);
  world.fill(Math.min(a[0],b[0])-2,26,Math.min(a[1],b[1])-2,Math.max(a[0],b[0])+2,29,Math.max(a[1],b[1])+2,0);
 }
 const w={set:(x,y,z,id)=>world.set(x,y,z+YUYUAN_SHIFT,id),fill:(x1,y1,z1,x2,y2,z2,id)=>world.fill(x1,y1,z1+YUYUAN_SHIFT,x2,y2,z2+YUYUAN_SHIFT,id)};

 // 2. Grade and clear the expanded district plot (low-computation: clear y=26..32 only)
 w.fill(YUYUAN_LOCAL.minX,18,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,24,YUYUAN_LOCAL.maxZ,3);
 w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,32,YUYUAN_LOCAL.maxZ,0);
 w.fill(YUYUAN_LOCAL.minX,25,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,25,YUYUAN_LOCAL.maxZ,9);

 // 3. Central Huxinting Pond depression and Jiuqu bridge
 w.fill(-63,20,169,-30,20,192,3);w.fill(-63,21,169,-30,25,192,0);
 for(let i=1;i<JIUQU_BRIDGE.length;i++){
  const a=JIUQU_BRIDGE[i-1],b=JIUQU_BRIDGE[i];
  w.fill(Math.min(a[0],b[0])-1,25,Math.min(a[1],b[1])-1,Math.max(a[0],b[0])+1,25,Math.max(a[1],b[1])+1,7);
 }
 w.fill(-61,25,170,-59,25,193,7);for(const x of [-61,-59])for(const z of [170,176,181,186,192])w.fill(x,21,z,x,24,z,9);

 // 4. Dig all other natural ponds and commercial water canal
 for(const stream of GARDEN_PONDS.slice(1)){
  w.fill(stream.x1,20,stream.z1,stream.x2,20,stream.z2,3);
  w.fill(stream.x1,21,stream.z1,stream.x2,25,stream.z2,0);
 }

// 5. Inner Garden 100% lush grass/moss floor & waterside greenery (江南名园青翠苔藓草坪全覆盖)
 for(let x=-108;x<=4;x++)for(let z=194;z<=260;z++){
  if(!GARDEN_PONDS.some(p=>x>=p.x1&&x<=p.x2&&z>=p.z1&&z<=p.z2))w.set(x,25,z,1);
 }
 // Huxinting pond perimeter natural grass banks and lakeside gardens
 for(let x=-72;x<=-20;x++)for(let z=164;z<=194;z++){
  if(!JIUQU_BRIDGE.some((b,i)=>{if(!i)return false;const a=JIUQU_BRIDGE[i-1];return pathContains(x,z,[a,b],1.4);})&&!GARDEN_PONDS.some(p=>x>=p.x1&&x<=p.x2&&z>=p.z1&&z<=p.z2)&&Math.hypot(x+46,z-178)>4.5){
   if(x<=-62||x>=-32||z<=168||z>=191)w.set(x,25,z,1);
  }
 }
 for(const b of GARDEN_BEDS)for(let x=b.x1;x<=b.x2;x++)for(let z=b.z1;z<=b.z2;z++)if(gardenBedContains(x+.5,z+.5,b))w.set(x,25,z,1);

 // 6. Outer district perimeter wall & entrance gaps
 w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.minX,28,YUYUAN_LOCAL.maxZ,9);
 w.fill(YUYUAN_LOCAL.maxX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,28,YUYUAN_LOCAL.maxZ,9);
 w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,28,YUYUAN_LOCAL.minZ,9);
 w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.maxZ,YUYUAN_LOCAL.maxX,28,YUYUAN_LOCAL.maxZ,9);
 // North main gate clearance
 w.fill(-50,26,YUYUAN_LOCAL.minZ,-42,30,YUYUAN_LOCAL.minZ+16,0);
 // West metro entrances clearance
 w.fill(YUYUAN_LOCAL.minX,26,202,YUYUAN_LOCAL.minX,29,208,0);
 w.fill(YUYUAN_LOCAL.minX,26,155,YUYUAN_LOCAL.minX,29,162,0);

 // 7. Expanded 4x Classical Garden Perimeter Wall
 for(let i=0;i<INNER_GARDEN_BOUNDARY.length;i++){
  const a=INNER_GARDEN_BOUNDARY[i],b=INNER_GARDEN_BOUNDARY[(i+1)%INNER_GARDEN_BOUNDARY.length];
  w.fill(Math.min(a[0],b[0]),26,Math.min(a[1],b[1]),Math.max(a[0],b[0]),30,Math.max(a[1],b[1]),9);
 }

 // 8. Moon Gate openings and lattice leak-window slots
 for(const e of INNER_GATES){
  if(e.axis==='z')w.fill(e.x-3,26,e.z,e.x+3,31,e.z,0);
  else w.fill(e.x,26,e.z-3,e.x,31,e.z+3,0);
 }
 for(const e of GARDEN_WINDOWS){
  if(e.axis==='z')w.fill(e.x-2,27,e.z,e.x+2,30,e.z,0);
  else w.fill(e.x,27,e.z-2,e.x,30,e.z+2,0);
 }

 // 9. Traditional flagstone winding pathways across the expanded garden
 for(let x=-108;x<=4;x++)for(let z=194;z<=260;z++)if(gardenPathContains(x+.5,z+.5,0.95))w.set(x,25,z,9);

 // 10. Construct building brick solids and doorway voids (Codex low-computation pattern)
 for(const b of YUYUAN_BUILDINGS){
  w.fill(b.x-b.rx,25,b.z-b.rz,b.x+b.rx,25,b.z+b.rz,7);
  for(let y=26;y<=28;y++)for(let x=b.x-b.rx;x<=b.x+b.rx;x++)for(let z=b.z-b.rz;z<=b.z+b.rz;z++)if(x===b.x-b.rx||x===b.x+b.rx||z===b.z-b.rz||z===b.z+b.rz)w.set(x,y,z,9);
  if(b.id.startsWith('yuyuan-street-')||b.id==='hefeng-lou'||b.id.startsWith('bazaar-east-')){
   w.fill(b.x-b.rx,26,b.z-1,b.x-b.rx,28,b.z+1,0);
   for(const sign of [-1,1])w.fill(b.x-b.rx,27,b.z+sign*2+(sign<0?-2:0),b.x-b.rx,28,b.z+sign*2+(sign>0?2:0),0);
  }else if(b.id.startsWith('bazaar-west-')||['tianyu-lou','shanghai-hotel','ningbo-tangtuan','old-city-east','old-city-northeast'].includes(b.id)){
   w.fill(b.x+b.rx,26,b.z-1,b.x+b.rx,28,b.z+1,0);
   for(const sign of [-1,1])w.fill(b.x+b.rx,27,b.z+sign*2+(sign<0?-2:0),b.x+b.rx,28,b.z+sign*2+(sign>0?2:0),0);
  }else{
   w.fill(b.x-1,26,b.z-b.rz,b.x+1,28,b.z-b.rz,0);
   w.fill(b.x-1,26,b.z+b.rz,b.x+1,28,b.z+b.rz,0);
  }
  if((['nanxiang','craft-shop','tea-gallery','huabao-lou','tonghanchun'].includes(b.id)||b.id.startsWith('yuyuan-south-')))for(const side of [-1,1])w.fill(b.x+side*2+(side<0?-2:0),27,b.z-b.rz,b.x+side*2+(side>0?2:0),28,b.z-b.rz,0);
  if(b.id==='huxinting'){
   w.fill(b.x-b.rx,26,b.z-1,b.x-b.rx,28,b.z+1,0);
   w.fill(b.x+b.rx,26,b.z-1,b.x+b.rx,28,b.z+1,0);
  }
 }
}

