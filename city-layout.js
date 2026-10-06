import {riverCenter,inRiver,CITY,PEARL,MAGNOLIA,MAP_BOUNDS,BUND_SHIFT,BRIDGES} from './shanghai-map.js';
import {buildingStyle,buildArchitecture} from './city-architecture.js';
import {roundedRoad} from './road-geometry.js';
import {WAIBAIDU,inSuzhou} from './waibaidu-layout.js';

// East = +x, south = +z. Preserve geographic order, compress walking distances.
export const promenadeX=z=>Math.round(riverCenter(z)-21-BUND_SHIFT);
export const roadX=z=>riverCenter(z)-38-BUND_SHIFT;
export const westSpine=z=>riverCenter(z)-84-BUND_SHIFT;
const legacyRoadX=z=>riverCenter(z)-40,legacySpine=z=>riverCenter(z)-84;
export const BUND_STREETS=[
 {id:'beijing',name:'北京东路',z:14,width:2,kind:'road'},
 {id:'dianchi',name:'滇池路',z:45,width:2,kind:'road'},
 {id:'nanjing',name:'南京东路步行街',z:66,width:4,kind:'pedestrian'},
 {id:'jiujiang',name:'九江路',z:99,width:2,kind:'road'},
 {id:'hankou',name:'汉口路',z:116,width:2,kind:'road'},
 {id:'fuzhou',name:'福州路',z:162,width:3,kind:'road'},
 {id:'guangdong',name:'广东路',z:192,width:2,kind:'road'},
 {id:'yanan',name:'延安东路',z:238,width:4,kind:'road'}
];
// Addresses increase northwards. Nanjing Road separates the two Peace Hotel wings.
export const BUND_BUILDINGS=[
 {id:'consulate',name:'外滩源 · 英国领事馆',z:5,h:9,kind:'brick',rz:4},
 {id:'avenue-0',name:'怡和洋行 · 外滩27号',z:25,h:13,kind:'steps',rz:5},
 {id:'bank',name:'中国银行 · 外滩23号',z:38,h:21,kind:'steps',rz:4},
 {id:'peace',name:'和平饭店北楼 · 外滩20号',z:54,h:20,kind:'copper',rz:6},
 {id:'peace-south',name:'和平饭店南楼 · 外滩19号',z:78,h:12,kind:'baroque',rz:6},
 {id:'avenue-1',name:'麦加利银行 · 外滩18号',z:92,h:15,kind:'steps',rz:4},
 {id:'avenue-2',name:'字林大楼 · 外滩17号',z:106,h:19,kind:'steps',rz:4},
 {id:'avenue-3',name:'华俄道胜银行 · 外滩15号',z:124,h:11,kind:'baroque',rz:3},
 {id:'customs',name:'江海关钟楼 · 外滩13号',z:137,h:15,kind:'clock',rz:6},
 {id:'hsbc',name:'汇丰银行大楼 · 外滩12号',z:151,h:14,kind:'dome',rz:6},
 {id:'avenue-4',name:'轮船招商局 · 外滩9号',z:173,h:11,kind:'brick',rz:5},
 {id:'avenue-5',name:'大北电报 · 外滩7号',z:185,h:13,kind:'baroque',rz:4},
 {id:'avenue-6',name:'有利银行 · 外滩3号',z:200,h:15,kind:'dome',rz:4},
 {id:'avenue-7',name:'上海总会 · 外滩2号',z:214,h:11,kind:'baroque',rz:6},
 {id:'asia',name:'亚细亚大楼 · 外滩1号',z:228,h:14,kind:'steps',rz:5}
].map(b=>({...b,x:Math.round(riverCenter(b.z)-58),rx:7,front:Math.round(riverCenter(b.z)-58)+7,bank:'west'}));

export function routeSamples(points){const out=[];let distance=0;for(let k=1;k<points.length;k++){const [x,z,y=26]=points[k-1],[xx,zz,yy=26]=points[k],length=Math.hypot(xx-x,zz-z),n=Math.max(1,Math.ceil(length*2));for(let j=k===1?0:1;j<=n;j++){const t=j/n;out.push({x:x+(xx-x)*t,z:z+(zz-z)*t,y:y+(yy-y)*t,d:distance+length*t});}distance+=length;}out.lengthMeters=distance;return out;}
const curve=(offset,from,to)=>{const p=[];const dir=Math.sign(to-from);for(let z=from;dir*(to-z)>=0;z+=dir*2)p.push([riverCenter(z)-offset,z]);if(p.at(-1)[1]!==to)p.push([riverCenter(to)-offset,to]);return p;};
export const AVENUE_POINTS=[[146,31],[213,31],[260,65],[263,121],[256,166],[228,178],[203,137],[197,106],[196,82],[196,50],[196,19],[146,19],[146,31]];
export const AVENUE=routeSamples(AVENUE_POINTS);
export const CENTURY=routeSamples([[146,31],[193,31],[246,58],[260,65]]);
export const BUND_LOOP=routeSamples([...curve(40,14,238),...curve(84,238,14),[legacyRoadX(14),14]]);
const cityOuter=[[282,206],[296,180],[305,140],[306,98],[306,54],[291,22],[226,12],[167,12],[146,20],[146,31],[213,31],[260,65],[263,121],[256,166],[263,187],[282,206]];
export const CITY_LOOP=routeSamples(cityOuter);
const bridgeEast=[[192-BUND_SHIFT,206,26],[212,206,31],[255,206,31],[275,206,26],[282,206,26]];
export const BRIDGE_LOOP=routeSamples([[roadX(206),206],...bridgeEast,...cityOuter.slice(1),...bridgeEast.slice(0,-1).reverse(),...curve(40+BUND_SHIFT,206,14),...curve(84+BUND_SHIFT,14,238),...curve(40+BUND_SHIFT,238,206)]);
export const CAR_ROUTES=[{id:'bund',samples:BUND_LOOP},{id:'lujiazui',samples:AVENUE},{id:'pudong',samples:CITY_LOOP},{id:'bridge',samples:BRIDGE_LOOP}];
// Cross streets join the two north-south roads; each has a return route.
export const CROSS_ROADS=BUND_STREETS.filter(s=>s.kind==='road').map(s=>({...s,samples:routeSamples([[legacySpine(s.z),s.z],[legacyRoadX(s.z),s.z]])}));
const BASE_ROADS=[{id:'bund',samples:BUND_LOOP,width:3},{id:'financial',samples:AVENUE,width:3},{id:'pudong',samples:CITY_LOOP,width:3},{id:'century',samples:CENTURY,width:3},{id:'bridge-approach',samples:routeSamples([[275,206],[282,206]]),width:3},...CROSS_ROADS];
function distanceToRoad(x,z,roads=BASE_ROADS){let best=Infinity;for(const r of roads)for(let i=0;i<r.samples.length;i+=4){const p=r.samples[i];best=Math.min(best,Math.hypot(x-p.x,z-p.z)-r.width);}return best;}
export const roadContains=(x,z)=>distanceToRoad(x,z,ROADS)<1.2;
export const PUDONG_BUILDINGS=[
 {id:'convention',name:'上海国际会议中心',x:130,z:64,rx:6,rz:5,h:9,kind:'convention'},
 {id:'superbrand',name:'正大广场',x:145,z:7,rx:9,rz:5,h:10,kind:'mall'},
 {id:'ifc-north',name:'国金中心 · 北塔',x:157,z:42,rx:5,rz:5,h:45,kind:'glass'},
 {id:'ifc-south',name:'国金中心 · 南塔',x:174,z:42,rx:5,rz:5,h:43,kind:'glass'},
 {id:'shangrila-river',name:'香格里拉 · 浦江楼',x:180,z:108,rx:5,rz:5,h:38,kind:'hotel'},
 {id:'shangrila-grand',name:'香格里拉 · 紫金融楼',x:218,z:119,rx:6,rz:7,h:50,kind:'hotel'},
 {id:'boc-pudong',name:'中银大厦',x:218,z:81,rx:6,rz:6,h:60,kind:'glass'},
 {id:'hsbc-pudong',name:'汇丰大楼 · 陆家嘴',x:240,z:84,rx:6,rz:5,h:44,kind:'glass'},
 {id:'aurora',name:'震旦大厦',x:226,z:137,rx:6,rz:6,h:41,kind:'gold'},
 {id:'citi',name:'花旗集团大厦',x:242,z:152,rx:5,rz:6,h:43,kind:'glass'},
 {id:'bea',name:'东亚银行金融大厦',x:245,z:181,rx:5,rz:5,h:45,kind:'glass'},
 {id:'bank-shanghai',name:'上海银行大厦',x:282,z:79,rx:6,rz:7,h:51,kind:'glass'},
 {id:'bocom',name:'交银金融大厦',x:247,z:112,rx:5,rz:6,h:48,kind:'glass'},
 {id:'stock',name:'上海证券大厦',x:284,z:119,rx:5,rz:6,h:43,kind:'glass'},
 {id:'south-finance',name:'滨江金融楼群',x:281,z:152,rx:5,rz:6,h:35,kind:'glass'},
 {id:'north-finance',name:'陆家嘴北侧商务楼',x:231,z:65,rx:5,rz:5,h:42,kind:'glass'}
].map(b=>({...b,bank:'east',front:b.x-b.rx,entranceSide:-1}));
const plots=[...PUDONG_BUILDINGS,...BUND_BUILDINGS];
const establishedTowerPlots={jinmao:{x:159.5,z:62.5},swfc:{x:181.5,z:56.5},shanghai:{x:152.5,z:85.5}};
export const BACK_BUILDINGS=[];
function available(b){if(b.x-b.rx<3||b.x+b.rx>315||b.z-b.rz<0||b.z+b.rz>233)return false;if(b.bank==='west'&&b.z>199&&b.x-b.rx<103)return false;for(let x=b.x-b.rx-2;x<=b.x+b.rx+2;x++)for(let z=b.z-b.rz-2;z<=b.z+b.rz+2;z++){const east=x>riverCenter(z)+10,west=x<riverCenter(z)-46;if(b.bank==='east'?!east:!west)return false;if(distanceToRoad(x,z)<1)return false;if(BUND_STREETS.some(s=>Math.abs(z-s.z)<=s.width+1)&&b.bank==='west')return false;}return !plots.some(p=>Math.abs(p.x-b.x)<=p.rx+b.rx+3&&Math.abs(p.z-b.z)<=p.rz+b.rz+3)&&!Object.values(establishedTowerPlots).some(p=>Math.abs(p.x-b.x)<b.rx+15&&Math.abs(p.z-b.z)<b.rz+15)&&Math.hypot(b.x-PEARL.x,b.z-PEARL.z)>b.rx+15;}
for(const offset of [106,132,158])for(let z=27;z<=223;z+=17){const b={id:`bund-back-${offset}-${z}`,name:'外滩后方街区',x:Math.round(riverCenter(z)-offset),z,rx:5,rz:5,h:8+(z*7+offset)%14,kind:z%3?'brick':'baroque',bank:'west',entranceSide:1};if(available(b)){b.front=b.x+b.rx;BACK_BUILDINGS.push(b);plots.push(b);}}
for(let x=200;x<=308;x+=18)for(let z=20;z<=200;z+=24){const b={id:`pudong-back-${x}-${z}`,name:'陆家嘴商务街区',x,z,rx:4,rz:5,h:15+(x+z*3)%25,kind:'glass',bank:'east',entranceSide:-1};if(available(b)){b.front=b.x-b.rx;BACK_BUILDINGS.push(b);plots.push(b);}}
for(const offset of [73,100,120,141,162,183])for(let z=6;z<=230;z+=11){const b={id:`bund-infill-${offset}-${z}`,name:'外滩里街',x:Math.round(riverCenter(z)-offset),z,rx:3,rz:3,h:7+(z+offset)%13,kind:z%2?'brick':'baroque',bank:'west',entranceSide:1};if(available(b)){b.front=b.x+b.rx;BACK_BUILDINGS.push(b);plots.push(b);}}
for(let x=148;x<=310;x+=13)for(let z=14;z<=220;z+=15){const b={id:`pudong-infill-${x}-${z}`,name:'陆家嘴街区',x,z,rx:3,rz:3,h:14+(x+z)%22,kind:'glass',bank:'east',entranceSide:-1};if(available(b)){b.front=b.x-b.rx;BACK_BUILDINGS.push(b);plots.push(b);}}
// Extend the front river bend into the former north boundary, without moving the existing city.
const northBund=routeSamples([...curve(40,14,-140),...curve(84,-140,14),[legacyRoadX(14),14]]);
const eastCurve=[];for(let z=-14;z>=-140;z-=2)eastCurve.push([riverCenter(z)+28,z]);
const northPudong=routeSamples([[167,12],[167,-8],...eastCurve,[384,-140],[384,-8],[210,-8],[210,12],[167,12]]);
export const WING_ROADS=[{id:'north-bund',samples:northBund,width:3},{id:'north-pudong',samples:northPudong,width:2}];
// Century Avenue shares the main arterial instead of cutting a second parallel diagonal.
export const ROADS=[...BASE_ROADS.filter(r=>r.id!=='century').map(r=>({...r,width:['financial','pudong'].includes(r.id)?2:r.width})),...WING_ROADS];
for(const r of WING_ROADS)CAR_ROUTES.push({id:r.id,samples:r.samples});
export const WING_BUILDINGS=[];
function addWing(b){
 b.front=b.x+(b.entranceSide??1)*b.rx;
 if(b.x-b.rx<MAP_BOUNDS.min+4||b.x+b.rx>MAP_BOUNDS.max-4||b.z-b.rz<MAP_BOUNDS.min+4)return;
 for(let x=b.x-b.rx-3;x<=b.x+b.rx+3;x++)for(let z=b.z-b.rz-3;z<=b.z+b.rz+3;z++){
  if(b.bank==='east'?x<riverCenter(z)+11:x>riverCenter(z)-46)return;
  if(distanceToRoad(x,z,ROADS)<1)return;
 }
 if(plots.some(p=>Math.abs(p.x-b.x)<=p.rx+b.rx+4&&Math.abs(p.z-b.z)<=p.rz+b.rz+4))return;
 WING_BUILDINGS.push(b);plots.push(b);
}
// A staggered front wing: moderate riverfront heights, taller buildings further inland.
for(const [x,z,h,rx,rz]of [[169,-8,34,5,5],[194,-30,47,6,6],[226,-61,59,6,6],[253,-96,53,6,5],[287,-117,63,6,6],[226,-24,39,5,5],[264,-43,52,6,5],[310,-62,46,6,6]])
 addWing({id:`pudong-front-${x}-${z}`,name:'陆家嘴北侧滨江楼群',x,z,h,rx,rz,kind:'glass',bank:'east',entranceSide:-1});
for(let z=-18;z>=-138;z-=22)for(let offset=48;offset<=170;offset+=23){const x=Math.round(riverCenter(z)+offset);
 addWing({id:`pudong-back-north-${offset}-${z}`,name:'陆家嘴北侧街区',x,z,rx:5,rz:5,h:26+(Math.abs(z)*3+offset)%35,kind:offset%2?'hotel':'glass',bank:'east',entranceSide:-1});}
// The west shore wraps around the bend into North Bund and continues into city blocks.
for(let z=-8;z>=-140;z-=22)for(const offset of [58,106,132,158,184,210,238,266,294]){
 const x=Math.round(riverCenter(z)-offset),modern=z<-30&&offset>=106;
 addWing({id:`bund-back-north-${offset}-${z}`,name:modern?'北外滩街区':'外滩源周边街区',x,z,rx:5,rz:5,h:modern?25+(Math.abs(z)+offset)%36:11+(Math.abs(z)+offset)%12,kind:modern?'glass':offset%3?'baroque':'brick',bank:'west',entranceSide:1});}
for(let x=-136;x<=-8;x+=23)for(let z=22;z<=176;z+=22)
 addWing({id:`bund-back-west-${x}-${z}`,name:'外滩后方城市街区',x,z,rx:5,rz:5,h:12+(Math.abs(x)+z)%19,kind:z%3?'baroque':'brick',bank:'west',entranceSide:1});
// Generate the established plots first, then translate the west city consistently.
for(const b of plots)if(b.bank==='west'){b.x-=BUND_SHIFT;b.front-=BUND_SHIFT;}
for(const r of [...BASE_ROADS.filter(r=>r.id==='bund'||CROSS_ROADS.includes(r)),WING_ROADS[0]])for(const p of r.samples)p.x-=BUND_SHIFT;
// Low retail podiums occupy the spaces between the southeast landmark towers.
const southeast=[
 {id:'ifc-mall',name:'国金中心商场',x:166,z:50,rx:5,rz:2,h:7,kind:'mall',form:'terrace'},
 {id:'jinmao-podium',name:'金茂商业裙房',x:174,z:73,rx:3,rz:4,h:6,kind:'mall',form:'terrace'},
 {id:'swfc-podium',name:'环球金融中心裙房',x:187,z:74,rx:4,rz:4,h:8,kind:'mall',form:'terrace'},
 {id:'pudong-infill-southeast-1',name:'滨江商业楼',x:170,z:104,rx:4,rz:3,h:18,kind:'glass',form:'setback'},
 {id:'pudong-infill-southeast-2',name:'陆家嘴商务楼',x:205,z:91,rx:3,rz:4,h:29,kind:'glass',form:'slab'}
];
for(const b of southeast){Object.assign(b,{bank:'east',entranceSide:-1,front:b.x-b.rx});BACK_BUILDINGS.push(b);plots.push(b);}
const residence=plots.find(b=>b.id==='pudong-infill-187-89');
if(residence)Object.assign(residence,{name:'国金汇服务公寓',kind:'hotel',h:24,form:'setback'});
const tomson=plots.find(b=>b.id==='pudong-infill-southeast-2');
if(tomson)Object.assign(tomson,{name:'汤臣一品 · 江景公寓',kind:'hotel',h:60,rx:4,rz:6,front:tomson.x-4,form:'landmark'});
// Fill smaller parcels along the east side of the trio, retaining roads, park and entrances.
for(let x=207;x<=297;x+=13)for(let z=74;z<=179;z+=15){
 const b={id:`pudong-density-${x}-${z}`,name:'陆家嘴商务街区',x,z,rx:3,rz:4,h:20+(x*3+z)%24,kind:(x+z)%3?'glass':'hotel',bank:'east',entranceSide:-1,front:x-3};
 if(plots.some(p=>Math.abs(p.x-x)<=p.rx+b.rx+2&&Math.abs(p.z-z)<=p.rz+b.rz+2))continue;
 if(Object.values(CITY).some(p=>Math.abs(p.x-x)<b.rx+15&&Math.abs(p.z-z)<b.rz+15))continue;
 if(x-b.rx<=riverCenter(z)+13||x-b.rx<=214&&z-b.rz<=58)continue;
 let clear=true;for(let xx=x-b.rx-1;xx<=x+b.rx+1;xx++)for(let zz=z-b.rz-1;zz<=z+b.rz+1;zz++)if(distanceToRoad(xx,zz,ROADS)<1)clear=false;
 if(clear){BACK_BUILDINGS.push(b);plots.push(b);}
}
// Retire the duplicate loop beside the Pearl. Traffic uses a single east business loop.
const financialPoints=[[226,12],[291,22],[306,54],[306,98],[305,140],[296,180],[282,206],[263,187],[256,166],[263,121],[260,65],[213,31],[226,12]];
AVENUE_POINTS.splice(0,AVENUE_POINTS.length,...financialPoints);
const financialSamples=routeSamples(financialPoints);AVENUE.splice(0,AVENUE.length,...financialSamples);AVENUE.lengthMeters=financialSamples.lengthMeters;

export const NANJING_WEST=-188;
// The extended pedestrian street replaces the former placeholder plots occupying its path.
export const REPLACED_BUILDING_IDS=new Set(plots.filter(b=>b.bank==='west'&&/back|infill/.test(b.id)&&b.x<-10&&b.x+b.rx>=NANJING_WEST&&b.z+b.rz>=61&&b.z-b.rz<=71).map(b=>b.id));
for(const list of [plots,BACK_BUILDINGS,WING_BUILDINGS])for(let i=list.length-1;i>=0;i--)if(REPLACED_BUILDING_IDS.has(list[i].id))list.splice(i,1);
export const DENSE_BUILDINGS=[];
// Retire only parcels touched by the corrected landmark footprints or the consolidated road.
for(const list of [PUDONG_BUILDINGS,BACK_BUILDINGS,WING_BUILDINGS,plots])for(let i=list.length-1;i>=0;i--){const b=list[i];if(b.bank==='east'&&(Object.values(CITY).some(p=>Math.abs(b.x-p.x)<=b.rx+12&&Math.abs(b.z-p.z)<=b.rz+13)||financialSamples.some(p=>Math.abs(b.x-p.x)<=b.rx+4&&Math.abs(b.z-p.z)<=b.rz+4))||b.bank==='west'&&Math.abs(b.x-MAGNOLIA.x)<=b.rx+10&&Math.abs(b.z-MAGNOLIA.z)<=b.rz+9){REPLACED_BUILDING_IDS.add(b.id);list.splice(i,1);}}
const magnolia={id:'magnolia',name:'白玉兰广场 · 北外滩',x:MAGNOLIA.x,z:MAGNOLIA.z,rx:8,rz:7,h:56,kind:'glass',form:'chamfer',bank:'west',entranceSide:1,front:MAGNOLIA.x+8};
DENSE_BUILDINGS.push(magnolia);plots.push(magnolia);
const parkContains=(x,z)=>x>=176&&x<=216&&z>=38&&z<=60;
const roadDistances=new Map();
function finalRoadDistance(x,z){const key=x+','+z;if(!roadDistances.has(key))roadDistances.set(key,distanceToRoad(x,z,ROADS));return roadDistances.get(key);}
function addParcel(b){
 b.front=b.x+(b.entranceSide??1)*b.rx;
 if(b.x-b.rx<MAP_BOUNDS.min+3||b.x+b.rx>=317)return false;
 // Keep space for each existing doorway and its short approach, as well as physical shells.
 const gap=b.id.startsWith('nanjing-')?0:1;
 if(plots.some(p=>Math.abs(p.x-b.x)<=p.rx+b.rx+gap&&Math.abs(p.z-b.z)<=p.rz+b.rz+gap))return false;
 if(plots.some(p=>{const e=buildingEntrance(p);return Math.abs(e.x-b.x)<=b.rx+1&&Math.abs(e.z-b.z)<=b.rz+1;}))return false;
 if(Object.values(CITY).some(p=>Math.abs(p.x-b.x)<b.rx+13&&Math.abs(p.z-b.z)<b.rz+14))return false;
 if(b.bank==='east'&&Math.hypot(b.x-PEARL.x,b.z-PEARL.z)<Math.max(b.rx,b.rz)+15)return false;
 for(let x=b.x-b.rx-1;x<=b.x+b.rx+1;x++)for(let z=b.z-b.rz-1;z<=b.z+b.rz+1;z++){
  if(b.bank==='west'?(x>=riverCenter(z)-101||z>=202&&x<102-BUND_SHIFT):(x<=riverCenter(z)+11||parkContains(x,z)))return false;
  if(finalRoadDistance(x,z)<1)return false;
  if(b.bank==='west'&&BUND_STREETS.some(s=>Math.abs(z-s.z)<=s.width))return false;
 }
 DENSE_BUILDINGS.push(b);plots.push(b);return true;
}
// IFC-style retail podiums occupy the retired road rectangle; existing tower lobbies stay open.
// Companion buildings follow the corrected landmark group instead of occupying its tower shells.
for(const list of [BACK_BUILDINGS,plots])for(let i=list.length-1;i>=0;i--)if(['jinmao-podium','swfc-podium'].includes(list[i].id)){REPLACED_BUILDING_IDS.add(list[i].id);list.splice(i,1);}
for(const b of [
 {id:'jinmao-podium',name:'金茂商业裙房',x:166,z:79,rx:3,rz:4,h:6,kind:'mall',form:'terrace'},
 {id:'swfc-podium',name:'环球金融中心裙房',x:238,z:99,rx:4,rz:4,h:8,kind:'mall',form:'terrace'},
 {id:'shangrila-river',name:'香格里拉 · 浦江楼',x:203,z:126,rx:5,rz:5,h:38,kind:'hotel',form:'terrace'},
 {id:'pudong-infill-southeast-1',name:'滨江商业楼',x:214,z:146,rx:4,rz:3,h:18,kind:'glass',form:'setback'},
 {id:'pudong-infill-southeast-2',name:'汤臣一品 · A栋江景公寓',x:224,z:160,rx:4,rz:6,h:60,kind:'hotel',form:'landmark'}
]){
 for(const list of [BACK_BUILDINGS,WING_BUILDINGS,plots])for(let i=list.length-1;i>=0;i--){const p=list[i];if(p.bank==='east'&&/back|infill|front|density/.test(p.id)&&Math.abs(p.x-b.x)<=p.rx+b.rx+2&&Math.abs(p.z-b.z)<=p.rz+b.rz+2){REPLACED_BUILDING_IDS.add(p.id);list.splice(i,1);}}
 addParcel({...b,bank:'east',entranceSide:-1});
}
for(const b of [
 {id:'ifc-retail-extension',name:'国金中心商业裙房',x:168,z:24,rx:9,rz:2,h:8,form:'terrace',kind:'mall'},
 {id:'pudong-infill-retail-east',name:'陆家嘴商业楼',x:185,z:23,rx:5,rz:3,h:22,form:'slab',kind:'glass'}
])addParcel({...b,bank:'east',entranceSide:-1});
// Shops face the pedestrian street, rather than opening onto the backs of other buildings.
for(const b of [
 {id:'nanjing-infill-corner-north',name:'南京东路沿街商厦',x:-21,z:55,rx:4,rz:5,h:13,entranceSide:1},
 {id:'nanjing-infill-corner-south',name:'美伦大楼商业组团',x:-12,z:77,rx:4,rz:5,h:13,entranceSide:-1}
])addParcel({...b,kind:'baroque',form:'terrace',district:'historic-block',bank:'west',entranceAxis:'z',shop:true});
for(const side of [-1,1])for(let x=NANJING_WEST+10;x<=4;x+=13){
 const z=66+side*11,b={id:`nanjing-infill-${side}-${x}`,name:'南京东路沿街商厦',x,z,rx:5,rz:5,h:11+(Math.abs(x)+z)%9,kind:'baroque',form:Math.abs(x)%3?'terrace':'deco',district:'historic-block',bank:'west',entranceAxis:'z',entranceSide:-side,shop:true};
 addParcel(b);
}
// Fill former freestanding gaps with joined-size blocks: stone commercial fronts and red-roof lanes.
for(let z=-137;z<=233;z+=9)for(let x=-207;x<=127;x+=9){
 const h=8+(Math.abs(x)*7+Math.abs(z)*3)%12;
 addParcel({id:`bund-infill-tight-${x}-${z}`,name:'外滩历史街坊',x,z,rx:3,rz:3,h,kind:(x+z)%3?'baroque':'brick',form:(x+z)%4?'terrace':'warehouse',district:'historic-block',bank:'west',entranceSide:1,shop:true});
}
// Smaller southeast parcels restore a dense commercial district around the landmark triangle.
for(let z=-5;z<=179;z+=9)for(let x=146;x<=302;x+=9){
 addParcel({id:`pudong-infill-tight-${x}-${z}`,name:'陆家嘴商住街坊',x,z,rx:3,rz:3,h:15+(x*3+Math.abs(z))%23,kind:(x+z)%4?'glass':'hotel',form:(x+z)%3?'setback':'slab',bank:'east',entranceSide:-1});
}
// Named examples identify actual street types; parcel distances are compressed for play.
const streetShops=DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-')).sort((a,b)=>a.x-b.x);
if(streetShops.length){streetShops[0].name='永安百货 · 南京东路';streetShops[2].name='先施公司历史商厦';streetShops.at(-1).name='美伦大楼 · 外滩中央';}
// Reserve the complete bridge clearance, including roofs and facade meshes, before exporting plots.
const nanpu=BRIDGES.find(b=>b.id==='nanpu');
for(const list of [BUND_BUILDINGS,PUDONG_BUILDINGS,BACK_BUILDINGS,WING_BUILDINGS,DENSE_BUILDINGS,plots])for(let i=list.length-1;i>=0;i--){const b=list[i];if(nanpu.samples.some(p=>Math.abs(p.x-b.x)<=b.rx+nanpu.width+2&&Math.abs(p.z-b.z)<=b.rz+nanpu.width+2)){REPLACED_BUILDING_IDS.add(b.id);list.splice(i,1);}}
// Round vehicle turns and give both lanes body clearance; preserve plot coordinates.
const adjustedRoutes=new Set();
for(const s of BUND_STREETS)if(s.kind==='road')s.width=4;
for(const r of ROADS){
 r.width=Math.max(4,r.width);
 if(adjustedRoutes.has(r.samples)||r.samples.length<3)continue;
 adjustedRoutes.add(r.samples);
 let points=r.samples.map(p=>[p.x,p.z,p.y]);
 if(r.id==='north-bund'){const end=points.findIndex(p=>p[1]<=-52);points=[[roadX(14),14,26],[WAIBAIDU.x,5,26],[WAIBAIDU.x,-45,26],points[end],...points.slice(end+1)];}
 points=points.map(([x,z,y])=>Math.abs(x-(roadX(z)-2))<.8&&z>=14?[x+2+(z>112&&z<136?4*Math.sin(Math.PI*(z-112)/24):0),z,y]:[x,z,y]);
 const simple=points.filter((p,i)=>i===0||i===points.length-1||Math.abs((p[0]-points[i-1][0])*(points[i+1][1]-p[1])-(p[1]-points[i-1][1])*(points[i+1][0]-p[0]))>.001);
 const closed=Math.hypot(points[0][0]-points.at(-1)[0],points[0][1]-points.at(-1)[1])<.1;
 const next=routeSamples(closed?roundedRoad(simple,7):points);
 r.samples.splice(0,r.samples.length,...next);r.samples.lengthMeters=next.lengthMeters;
}
const bridgeTraffic=CAR_ROUTES.find(r=>r.id==='bridge').samples;
const bridgeNext=routeSamples(roundedRoad(bridgeTraffic.map(p=>({...p,x:Math.abs(p.x-(roadX(p.z)-2))<.8&&p.z>=14?p.x+2+(p.z>112&&p.z<136?4*Math.sin(Math.PI*(p.z-112)/24):0):p.x})).filter((p,i,a)=>i===0||i===a.length-1||Math.abs((p.x-a[i-1].x)*(a[i+1].z-p.z)-(p.z-a[i-1].z)*(a[i+1].x-p.x))>.001).map(p=>[p.x,p.z,p.y]),7));
bridgeTraffic.splice(0,bridgeTraffic.length,...bridgeNext);bridgeTraffic.lengthMeters=bridgeNext.lengthMeters;
// Remove only parcels occupied by the widened carriageway or the new tributary.
for(const list of [BUND_BUILDINGS,PUDONG_BUILDINGS,BACK_BUILDINGS,WING_BUILDINGS,DENSE_BUILDINGS,plots])for(let i=list.length-1;i>=0;i--){const b=list[i];
 const riverPlot=inSuzhou(b.x-b.rx,b.z-b.rz)||inSuzhou(b.x+b.rx,b.z+b.rz)||inSuzhou(b.x,b.z);
 const roadPlot=ROADS.some(r=>r.samples.some((p,j)=>j%3===0&&Math.abs(p.x-b.x)<=b.rx+r.width+.8&&Math.abs(p.z-b.z)<=b.rz+r.width+.8));
 if(riverPlot||roadPlot&&/back|infill|front|density/.test(b.id)&&b.id!=='pudong-infill-southeast-2'){REPLACED_BUILDING_IDS.add(b.id);list.splice(i,1);}
}
export const CITY_BUILDINGS=[...PUDONG_BUILDINGS,...BACK_BUILDINGS,...WING_BUILDINGS,...DENSE_BUILDINGS];
export const ALL_BUILDINGS=[...BUND_BUILDINGS,...CITY_BUILDINGS];
export function buildingEntrance(b,distance=2.5){const side=b.entranceSide??1;return b.entranceAxis==='z'?{x:b.x+.5,z:b.z+side*(b.rz+distance)}:{x:b.x+side*(b.rx+distance),z:b.z+.5};}
export function layoutProtected(x,y,z){return y>=25&&ALL_BUILDINGS.some(b=>Math.abs(x-b.x)<=b.rx+1&&Math.abs(z-b.z)<=b.rz+1);}
export function buildShell(w,b){const {x,z,h,rx,rz}=b,side=b.entranceSide??1,s=buildingStyle(b);
 w.fill(x-rx,18,z-rz,x+rx,25,z+rz,3);w.fill(x-rx,26,z-rz,x+rx,26+h,z+rz,0);
 if(s.form!=='landmark')buildArchitecture(w,b,s);
 else{
 const glass=['glass','gold','hotel'].includes(b.kind);
 for(let y=26;y<26+h;y++)for(let xx=x-rx;xx<=x+rx;xx++)for(let zz=z-rz;zz<=z+rz;zz++){
  if(xx!==x-rx&&xx!==x+rx&&zz!==z-rz&&zz!==z+rz)continue;
  const window=y%4>=1&&y%4<=2&&(xx===x+rx||xx===x-rx?Math.abs(zz-z)%3===1:Math.abs(xx-x)%3===1);
   w.set(xx,y,zz,glass?(y%8===0||(Math.abs(xx-x)===rx&&Math.abs(zz-z)===rz)?9:b.kind==='gold'?6:11):window?11:y%4===0?9:b.kind==='brick'?8:s.wall);
 }
 w.fill(x-rx-1,26+h,z-rz-1,x+rx+1,26+h,z+rz+1,9);
 }
 for(let xx=x-rx+1;xx<x+rx;xx++)for(let zz=z-rz+1;zz<z+rz;zz++)w.set(xx,25,zz,(xx+zz)%2?9:6);
 if(b.entranceAxis==='z'){
  const door=z+side*rz,exit=door+side*4;w.fill(x-1,26,door,x+1,29,door,0);
  w.fill(x-1,25,Math.min(door,exit),x+1,25,Math.max(door,exit),9);w.fill(x-1,26,Math.min(door+side,exit),x+1,29,Math.max(door+side,exit),0);
 }else{
  const door=x+side*rx,exit=door+side*4;w.fill(door,26,z-1,door,29,z+1,0);
  w.fill(Math.min(door,exit),25,z-1,Math.max(door,exit),25,z+1,9);w.fill(Math.min(door+side,exit),26,z-1,Math.max(door+side,exit),29,z+1,0);
 }
 if(b.id==='pudong-infill-southeast-2'){for(let floor=29;floor<26+h;floor+=4)if(Math.abs(floor-77)>1)w.fill(x-rx+1,floor,z-rz+1,x+rx-1,floor,z+rz-1,9);}
 for(const dz of [-rz+2,rz-2]){w.fill(x-rx+2,26,z+dz,x+rx-2,26,z+dz,7);w.set(x-side*(rx-2),27,z+dz,12);}
 if(b.id.startsWith('nanjing-')&&b.entranceAxis==='z')for(const dz of [-rz+2,rz-2])w.fill(x-1,26,z+dz,x+1,27,z+dz,0);
 if(s.form!=='landmark')return;
 if(b.kind==='copper'){w.fill(x-3,27+h,z-3,x+3,31+h,z+3,9);for(let i=0;i<5;i++)w.fill(x-4+i,32+h+i,z-4+i,x+4-i,32+h+i,z+4-i,5);}
 if(b.kind==='steps'||b.kind==='glass'){for(let i=0;i<3;i++)w.fill(x-rx+1+i,27+h+i,z-rz+1,x+rx-1-i,27+h+i,z+rz-1,9);}
 if(b.kind==='clock'){w.fill(x-3,27+h,z-3,x+3,39+h,z+3,9);w.fill(x-2,40+h,z-2,x+2,41+h,z+2,9);w.set(x,42+h,z,12);}
 if(b.kind==='dome'){for(let y=0;y<=5;y++)w.disc(x,27+h+y,z,Math.sqrt(Math.max(0,25-y*y)),9);}
 if(b.kind==='baroque'){for(const dx of [-rx+1,rx-1])w.fill(x+dx,27+h,z-2,x+dx,29+h,z+2,9);w.fill(x-2,27+h,z-2,x+2,29+h,z+2,9);}
 if(b.kind==='brick'){for(let i=0;i<4;i++)w.fill(x-rx,27+h+i,z-rz+i,x+rx,27+h+i,z+rz-i,8);}
}
export function buildCity(w){
 // City blocks have paved courtyards; retain planted riversides and the central green.
 for(let x=MAP_BOUNDS.min;x<MAP_BOUNDS.max;x++)for(let z=MAP_BOUNDS.min;z<=234;z++){if(w.get(x,25,z)!==1||(x<102-BUND_SHIFT&&z>=202))continue;const d=x-riverCenter(z),park=x>=178&&x<=214&&z>=40&&z<=58;if(park||(d>10&&d<18))continue;if(d<-45||d>18)w.set(x,25,z,(Math.floor(x/6)+Math.floor(z/6))%5===0?1:9);}
 for(const r of ROADS)for(const p of r.samples){const x=Math.round(p.x),z=Math.round(p.z);for(let dx=-r.width-2;dx<=r.width+2;dx++)for(let dz=-r.width-2;dz<=r.width+2;dz++){const xx=x+dx,zz=z+dz;if(inRiver(xx,zz)||Object.values(CITY).some(p=>Math.abs(xx+.5-p.x)<=12&&Math.abs(zz+.5-p.z)<=13))continue;w.fill(xx,23,zz,xx,24,zz,3);w.set(xx,25,zz,Math.abs(dx)<=r.width&&Math.abs(dz)<=r.width?3:9);w.fill(xx,26,zz,xx,32,zz,0);}}
 // Nanjing Road is a paved pedestrian corridor through the actual hotel gap.
 const s=BUND_STREETS.find(s=>s.id==='nanjing');for(let x=NANJING_WEST;x<=roadX(s.z)-4;x++)for(let z=s.z-s.width;z<=s.z+s.width;z++){w.fill(x,24,z,x,24,z,3);w.set(x,25,z,Math.abs(z-s.z)<1?6:9);w.fill(x,26,z,x,34,z,0);}
 for(const b of ALL_BUILDINGS)buildShell(w,b);
 // Supported, open landing platform inside the white magnolia crown.
 w.fill(MAGNOLIA.x-7,82,MAGNOLIA.z-6,MAGNOLIA.x+7,82,MAGNOLIA.z+6,9);
 w.fill(MAGNOLIA.x-7,83,MAGNOLIA.z-6,MAGNOLIA.x+7,89,MAGNOLIA.z+6,0);
}
