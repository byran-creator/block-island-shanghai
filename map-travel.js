import {LINE10_WORLD_STATIONS} from './metro-line10-layout.js';
import {METRO_STATIONS,CENTURY_PARK_STATION} from './metro-layout.js';
import {METRO_WEST_TRAVEL} from './metro-west-layout.js';
import {PRIVATE_SUITES,suiteArrival} from './private-suite-layout.js';
import {LANDMARKS,SIZE,WORLD_MIN,WORLD_MAX,overlaps} from './world.js';
import {EXPO} from './expo-layout.js';
import {PEACE_DINING} from './peace-restaurant.js';
import {promenadeX} from './city-layout.js';
const bundArrival={id:'bund',name:'外滩观景台',x:promenadeX(66)-10.5,y:26,z:66.5,viewTarget:{x:-12,y:28,z:66.5}};
const duoyunPin={mapX:LANDMARKS.duoyun.x+13,mapZ:LANDMARKS.duoyun.z+4};
const line2Travel=[...METRO_STATIONS,CENTURY_PARK_STATION].map(s=>{
 const east=s.id==='lujiazui',exit=east?s.exits[1]:s.exits[0];
 return {id:'metro-'+s.id,name:'2号线 · '+s.name,x:exit.x-exit.dir*3+(east?.5:0),y:26,z:exit.z+(east?.5:0),
  ...(east?{viewTarget:{x:exit.x+exit.dir*3,y:27.2,z:exit.z}}:{})};
});
export const TRAVEL_POINTS=[
 ['yuyuan','豫园 · 九曲桥与湖心亭'],['waibaidu','外白渡桥'],['northBund','北外滩'],['tower','东方明珠'],['shanghai','上海中心 · 电梯大厅'],['duoyun','52F · 朵云书院'],['jinmao','金茂大厦'],['swfc','环球金融中心'],['southPark','陆家嘴绿地'],['magnolia','白玉兰广场'],['helipad','直升机停机坪'],['village','生活岛'],['gallery','涂鸦街'],['dock','潜水码头'],['forest','翡翠林岛'],['desert','金沙岛']
].map(([id,name])=>({...LANDMARKS[id],id,name,...(id==='duoyun'?duoyunPin:{})})).concat(bundArrival,{id:'nanjing',name:'南京路步行街',x:-105,y:26,z:66.5},{...PEACE_DINING.lift,id:'peace-hotel',name:'和平饭店'},line2Travel);
export const MAP_VIEW_MIN_Z=-160,MAP_VIEW_DEPTH=WORLD_MAX-MAP_VIEW_MIN_Z;
export const mapPosition=(p,width=512)=>({x:((p.mapX??p.x)-WORLD_MIN)*width/SIZE,y:((p.mapZ??p.z)-MAP_VIEW_MIN_Z)*width/SIZE});
TRAVEL_POINTS.push(...PRIVATE_SUITES.filter(s=>s.id!=='peace-suite').map(suiteArrival),...LINE10_WORLD_STATIONS.filter(s=>s.exits.length).map(s=>({id:'metro-10-'+s.id,name:'10号线 · '+s.name,x:s.exits[0].x,y:26,z:s.exits[0].z-s.exits[0].dir*3})));
TRAVEL_POINTS.push(...METRO_WEST_TRAVEL);
TRAVEL_POINTS.push({...LANDMARKS.expo,id:'expo'},{...EXPO.concert,id:'expoArena'},{...LANDMARKS.expoRiver,id:'expoRiver'},{...LANDMARKS.centuryPark,id:'centuryPark'},{...LANDMARKS.xintiandi,id:'xintiandi'},{...LANDMARKS.wukang,id:'wukang'},{...LANDMARKS.puxiResidences,id:'puxiResidences'});
TRAVEL_POINTS.push({...LANDMARKS.fuxingPark,id:'fuxingPark'});
TRAVEL_POINTS.push({...LANDMARKS.jingan,id:'jingan'},{...LANDMARKS.exhibition,id:'exhibition'});
TRAVEL_POINTS.push({...LANDMARKS.sihang,id:'sihang'});
export function mapHit(x,y,width=512,maxDist=28){return TRAVEL_POINTS.map(p=>({p,d:Math.hypot(mapPosition(p,width).x-x,mapPosition(p,width).y-y)})).filter(a=>a.d<=maxDist).sort((a,b)=>a.d-b.d)[0]?.p;}
export function safeLanding(world,p,blocked=(x,y,z)=>overlaps(world,x,y,z)){
 for(let r=0;r<=8;r+=.5)for(let i=0;i<(r?16:1);i++){const a=i*Math.PI/8,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(!blocked(x,p.y,z)&&overlaps(world,x,p.y-.1,z))return {...p,x,z};}
 return null;
}
