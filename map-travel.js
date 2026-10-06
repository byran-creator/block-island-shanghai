import {METRO_STATIONS} from './metro-layout.js';
import {PRIVATE_SUITES,suiteArrival} from './private-suite-layout.js';
import {LANDMARKS,SIZE,WORLD_MIN,overlaps} from './world.js';
import {PEACE_DINING} from './peace-restaurant.js';
export const TRAVEL_POINTS=[
 ['bund','外滩观景台'],['waibaidu','外白渡桥'],['northBund','北外滩'],['tower','东方明珠'],['shanghai','上海中心'],['jinmao','金茂大厦'],['swfc','环球金融中心'],['southPark','陆家嘴绿地'],['magnolia','白玉兰广场'],['helipad','直升机停机坪'],['village','生活岛'],['gallery','涂鸦街'],['dock','潜水码头'],['forest','翡翠林岛'],['desert','金沙岛']
].map(([id,name])=>({...LANDMARKS[id],id,name})).concat({id:'nanjing',name:'南京路步行街',x:-105,y:26,z:66.5},{...PEACE_DINING.lift,id:'peace-hotel',name:'和平饭店'}).concat(METRO_STATIONS.map(s=>({id:'metro-'+s.id,name:'2号线 · '+s.name,x:s.exits[0].x-s.exits[0].dir*3,y:26,z:s.exits[0].z})));
export const mapPosition=(p,width=512)=>({x:(p.x-WORLD_MIN)*width/SIZE,y:(p.z-WORLD_MIN)*width/SIZE});
TRAVEL_POINTS.push(...PRIVATE_SUITES.map(suiteArrival));
export function mapHit(x,y,width=512){return TRAVEL_POINTS.map(p=>({p,d:Math.hypot(mapPosition(p,width).x-x,mapPosition(p,width).y-y)})).filter(a=>a.d<=12).sort((a,b)=>a.d-b.d)[0]?.p;}
export function safeLanding(world,p,blocked=(x,y,z)=>overlaps(world,x,y,z)){
 for(let r=0;r<=8;r+=.5)for(let i=0;i<(r?16:1);i++){const a=i*Math.PI/8,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(!blocked(x,p.y,z)&&overlaps(world,x,p.y-.1,z))return {...p,x,z};}
 return null;
}
