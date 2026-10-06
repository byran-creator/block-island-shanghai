import {buildBund,bundProtected,promenadeX} from './bund.js';
import {roadContains} from './city-layout.js';
import {buildPeaceDining} from './peace-restaurant.js';
import {buildMetro,metroProtected} from './metro-layout.js';
import {buildPrivateSuites,suiteProtected} from './private-suite-layout.js';
import {buildWaibaidu,waibaiduProtected,WAIBAIDU} from './waibaidu-layout.js';
import {ROADS} from './city-layout.js';
import {riverTerrain,buildRiverfront,buildBridges,cityProtected,CITY,BRIDGES,PERSONAL,PEARL,MAGNOLIA,MAP_BOUNDS} from './shanghai-map.js';
export {CITY,BRIDGES} from './shanghai-map.js';
export const WORLD_MIN=MAP_BOUNDS.min,WORLD_MAX=MAP_BOUNDS.max,SIZE=WORLD_MAX-WORLD_MIN, HEIGHT=144, CHUNK=16, WORLD_SHIFT=16, WATER_LEVEL=22.25;
export const BLOCKS=[null,{name:'草方块',color:'#77ad42'},{name:'泥土',color:'#956a45'},{name:'石头',color:'#939e9c'},{name:'木头',color:'#88603d'},{name:'树叶',color:'#498548'},{name:'沙子',color:'#e5d59b'},{name:'木板',color:'#c29b61'},{name:'砖块',color:'#b76950'},{name:'明珠银白',color:'#deded5'},{name:'霓虹玫红',color:'#db6594'},{name:'蓝色玻璃',color:'#61c9df'},{name:'荧光晶砖',color:'#c4f77c'}];
function track(id,name,description,points,base,sprint=false){if(id==='harbor')points=points.map(([x,z,...rest])=>[x+PERSONAL.dx,z+PERSONAL.dz,...rest]);if(id==='cliff')points=points.map(([x,z,...rest])=>[x+157,z,...rest]);if(id==='forest')points=points.map(([x,z,...rest])=>[x+157,z+91,...rest]);const platforms=points.map(([x,z,dy=0,r=1],i)=>({x:x+.5,y:base+dy,z:z+.5,radius:r,stage:Math.floor(i/5)+1}));return {id,name,description,platforms,start:platforms[0],fallY:base-1.5,sprint,bounds:{x1:Math.min(...points.map(p=>p[0]))-2,x2:Math.max(...points.map(p=>p[0]))+2,z1:Math.min(...points.map(p=>p[1]))-2,z2:Math.max(...points.map(p=>p[1]))+2}};}
export const COURSES=[
 track('harbor','海港折线','12 关 · 宽平台、短长间隔与转弯，适合热身。',[[69,70],[72,70],[76,71,1],[79,74,1],[81,77,2],[85,78,2],[89,77,2],[91,73,1],[95,71,1],[98,73,2],[101,77,2],[105,79,3]],26),
 track('forest','林间踏叶','24 关 · 小平台、侧跳和高低落差，沿林冠绕行。',[[158,161,0],[161,163,1],[165,164,1],[169,167,0],[171,171,1,0],[174,174,2],[178,175,2],[181,172,1,0],[184,169,2],[188,170,2],[191,174,3],[193,178,3,0],[190,182,2],[186,184,3],[183,188,4],[187,191,4],[191,194,4],[195,192,5],[198,188,5],[202,190,4],[205,194,5],[202,198,5],[198,202,6],[194,204,6]],45),
 track('cliff','云端疾跑','30 关 · 窄台、远跳和折返；远跳需要按住 Shift。',[[185,49,0],[190,49,0,0],[194,50,1],[199,51,1],[203,54,1,0],[206,58,2],[210,61,2],[215,61,2],[219,64,3],[222,68,3],[219,72,3,0],[214,73,2],[209,74,2],[205,78,3],[201,81,3],[197,83,4],[193,86,4],[189,89,4],[185,92,4],[181,95,5],[177,98,5],[174,102,4],[178,105,4],[182,108,5],[187,109,5],[192,108,6],[196,112,6],[200,115,5],[204,119,6],[209,120,7]],52,true)
];
export const COURSE=COURSES[0].platforms;
export const courseById=id=>COURSES.find(c=>c.id===id)||COURSES[0];
export const LANDMARKS={waibaidu:{x:WAIBAIDU.x+5.2,y:26,z:WAIBAIDU.south-1,name:'外白渡桥 · 苏州河口'},village:{x:75,y:26,z:329,name:'奶龙村'},gallery:{x:92,y:26,z:329,name:'涂鸦街'},tower:{x:126,y:26,z:54,name:'东方明珠'},deck:{x:126,y:70,z:49,name:'云端观景台'},race:{...COURSES[0].start,name:'海港跑酷'},spring:{x:95,y:26,z:339,name:'弹跳广场'},dock:{x:260.5,y:23,z:228.5,name:'潜水补给站'},reef:{x:284,y:9,z:287,name:'珊瑚花园'},temple:{x:273.5,y:9,z:301.5,name:'海底神殿'},forest:{x:331,y:35,z:240,name:'翡翠林岛'},desert:{x:65,y:29,z:230,name:'金沙岛'},shanghai:{x:CITY.shanghai.x,y:26,z:CITY.shanghai.z+10,name:'上海中心大厦'},skyGarden:{x:CITY.shanghai.x,y:86,z:CITY.shanghai.z+4,name:'上海中心 · 空中花园'},skyDeck:{x:CITY.shanghai.x,y:136,z:CITY.shanghai.z,name:'上海中心 · 巅峰观景台'},jinmao:{x:CITY.jinmao.x,y:26,z:CITY.jinmao.z+9,name:'金茂大厦'},jinmaoDeck:{x:CITY.jinmao.x,y:91,z:CITY.jinmao.z,name:'金茂 · 观景台'},swfc:{x:CITY.swfc.x+11,y:26,z:CITY.swfc.z,name:'环球金融中心'},swfcDeck:{x:CITY.swfc.x,y:104,z:CITY.swfc.z,name:'环球 · 云端天桥'},magnolia:{x:MAGNOLIA.x+10.5,y:26,z:MAGNOLIA.z+.5,name:'白玉兰广场'},helipad:{x:MAGNOLIA.x+4.5,y:83,z:MAGNOLIA.z+4.5,name:'白玉兰 · 直升机平台'},northBund:{x:145.5,y:26,z:-130.5,name:'北外滩观景点'},bund:{x:promenadeX(84)-10.5,y:26,z:84.5,name:'外滩观景步道'},nanpu:{x:236.5,y:31,z:206.5,name:'南浦风格斜拉桥'},bankStreet:{x:29.5,y:26,z:94.5,name:'外滩万国建筑街'},southPark:{x:195.5,y:26,z:48.5,name:'陆家嘴中心绿地'},survivalCamp:{x:130.5,y:26,z:309.5,name:'生存营地'}};
export const SHANGHAI={...CITY.shanghai,base:26};
export function towerProfile(y,a){const t=Math.max(0,Math.min(1,(y-26)/110)),radius=9*(1-.43*t),rotation=t*Math.PI*2/3;return radius*(.87+.13*Math.cos((a-rotation)*3));}
export const CRYSTALS=[{id:'village',name:'出发之光',x:78.5,y:27.5,z:327.5},{id:'gallery',name:'涂鸦之光',x:93,y:27.5,z:329,requires:'paint'},{id:'forest',name:'森林之光',x:63.5,y:30.5,z:339.5},{id:'deck',name:'云端之光',x:128,y:71.5,z:48},{id:'race',name:'跃动之光',x:COURSE.at(-1).x,y:COURSE.at(-1).y+1.5,z:COURSE.at(-1).z}];
export class VoxelWorld {
 constructor({data,surface,generate=true}={}){this.data=data??new Uint8Array(SIZE*SIZE*HEIGHT);this.surface=surface??new Uint16Array(SIZE*SIZE);if(generate)this.generate()}
 index(x,y,z){return (y*SIZE+z-WORLD_MIN)*SIZE+x-WORLD_MIN}
 valid(x,y,z){return x>=WORLD_MIN&&z>=WORLD_MIN&&y>=0&&x<WORLD_MAX&&z<WORLD_MAX&&y<HEIGHT}
 get(x,y,z){return this.valid(x,y,z)?this.data[this.index(x,y,z)]:0}
 set(x,y,z,id){if(!this.valid(x,y,z))return false;this.data[this.index(x,y,z)]=id;return true}
 ground(x,z){for(let y=HEIGHT-1;y>=0;y--)if(this.get(x,y,z))return y+1;return 0}
 protected(x,y,z){return y===0||waibaiduProtected(x,y,z)||suiteProtected(x,y,z)||metroProtected(x,y,z)||bundProtected(x,y,z)||cityProtected(x,y,z)||(x>=113&&x<=139&&z>=29&&z<=56&&y>=25)||(x>=86&&x<=98&&z>=323&&z<=328&&y>=25)||COURSES.some(c=>x>=c.bounds.x1&&x<=c.bounds.x2&&z>=c.bounds.z1&&z<=c.bounds.z2&&y>=c.fallY-2)||(x>=61&&x<=66&&z>=337&&z<=342&&y>=25)||(x>=94&&x<=97&&z>=338&&z<=341&&y>=25)||(x>=257&&x<=263&&z>=214&&z<=230&&y>=21)||(x>=262&&x<=278&&z>=292&&z<=308&&y>=6);}
 surfaceAt(x,z){return this.valid(Math.floor(x),0,Math.floor(z))?this.surface[(Math.floor(z)-WORLD_MIN)*SIZE+Math.floor(x)-WORLD_MIN]||1:1;}
 fill(x1,y1,z1,x2,y2,z2,id){for(let x=x1;x<=x2;x++)for(let y=y1;y<=y2;y++)for(let z=z1;z<=z2;z++)this.set(x,y,z,id)}
 disc(cx,y,cz,r,id){for(let x=Math.ceil(cx-r);x<=cx+r;x++)for(let z=Math.ceil(cz-r);z<=cz+r;z++)if(Math.hypot(x-cx,z-cz)<=r)this.set(x,y,z,id)}
 orb(cx,cy,cz,r){for(let x=Math.floor(cx-r);x<=Math.ceil(cx+r);x++)for(let y=Math.floor(cy-r);y<=Math.ceil(cy+r);y++)for(let z=Math.floor(cz-r);z<=Math.ceil(cz+r);z++){const d=Math.hypot(x-cx,y-cy,z-cz);if(d<=r&&d>r-1.3)this.set(x,y,z,Math.abs(y-cy)<=1?11:10)}}
 generate(){
  for(let x=WORLD_MIN;x<WORLD_MAX;x++)for(let z=WORLD_MIN;z<WORLD_MAX;z++){
   let h=6+Math.floor(Math.sin(x*.14)+Math.cos(z*.17));
   for(const [cx,cz,r,peak] of [[330,60,31,34],[330,259,37,35],[65,230,27,28],[350,355,21,29]]){const d=Math.hypot(x-cx,z-cz);if(d<r)h=Math.max(h,Math.floor(peak-Math.max(0,d-r*.53)*.8+Math.sin((x-(cx===330?157:cx===350?132:0))*.2)*1.4));}
   if((x>=69&&x<=82&&z>=312&&z<=334)||(x>=82&&x<=139&&z>=315&&z<=358))h=25;
   h=riverTerrain(x,z,h);
   this.surface[(z-WORLD_MIN)*SIZE+x-WORLD_MIN]=h+1;
   const desert=Math.hypot(x-65,z-230)<28;
   for(let y=0;y<=h;y++)this.set(x,y,z,y===h?(h<WATER_LEVEL||desert?6:1):y<h-3?3:2);
  }
  const w=this;const shiftedLegacy=(dx,dz)=>({set:(x,y,z,id)=>w.set(x+dx,y+WORLD_SHIFT,z+dz,id),get:(x,y,z)=>w.get(x+dx,y+WORLD_SHIFT,z+dz),ground:(x,z)=>w.ground(x+dx,z+dz)-WORLD_SHIFT,fill:(x1,y1,z1,x2,y2,z2,id)=>w.fill(x1+dx,y1+WORLD_SHIFT,z1+dz,x2+dx,y2+WORLD_SHIFT,z2+dz,id),disc:(x,y,z,r,id)=>w.disc(x+dx,y+WORLD_SHIFT,z+dz,r,id),orb:(x,y,z,r)=>w.orb(x+dx,y+WORLD_SHIFT,z+dz,r)});const legacy=shiftedLegacy(PERSONAL.dx,PERSONAL.dz);
  let seed=1729;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
  for(let i=0;i<160;i++){
   const x=5+Math.floor(rand()*115),z=5+Math.floor(rand()*105),y=legacy.ground(x,z);
   if(y<9||y>15||(x>31&&x<107&&z>27&&z<82)||(x>=24&&x<=34&&z>=55&&z<=65)||legacy.get(x,y-1,z)!==1)continue;
   const tall=4+Math.floor(rand()*2);for(let yy=0;yy<tall;yy++)legacy.set(x,y+yy,z,4);
   for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=-1;dy<=1;dy++)if(Math.abs(dx)+Math.abs(dz)+Math.abs(dy)<5&&!legacy.get(x+dx,y+tall+dy,z+dz))legacy.set(x+dx,y+tall+dy,z+dz,5);
   legacy.set(x,y+tall+2,z,5);
  }
  for(let x=36;x<=42;x++)for(let z=33;z<=39;z++){legacy.set(x,10,z,7);if(x===36||x===42||z===33||z===39)for(let y=11;y<=14;y++){if(z===39&&(x===39||x===40)&&y<14)continue;if((x===36||x===42)&&z===36&&(y===12||y===13))continue;legacy.set(x,y,z,(x===36||x===42)&&(z===33||z===39)?4:7)}}
  for(let x=35;x<=43;x++)for(let z=32;z<=40;z++)legacy.set(x,15+Math.min(x-35,43-x),z,8);
  legacy.fill(39,9,40,40,9,50,6);legacy.fill(40,9,49,94,9,51,6);legacy.fill(59,9,50,61,9,72,6);legacy.fill(60,9,70,69,9,72,6);
  // Graffiti street: permanent canvases on protected voxel walls.
  legacy.fill(52,9,44,62,15,45,9);legacy.fill(52,15,45,62,15,45,10);legacy.fill(52,9,46,62,9,48,8);
  legacy.fill(54,10,39,60,13,40,8);legacy.fill(53,14,38,61,14,41,7);
  {const legacy=shiftedLegacy(36,0);
  // Oriental Pearl-inspired landmark: three columns, twin spheres, space capsule and spire.
  legacy.disc(90,9,42,12,9);legacy.disc(90,10,42,10,3);
  for(let y=11;y<=24;y++){const spread=Math.round(7*(24-y)/13);for(const a of [0,2.094,4.189]){const x=Math.round(90+Math.cos(a)*spread),z=Math.round(42+Math.sin(a)*spread);legacy.fill(x-1,y,z-1,x+1,y,z+1,9)}}
  legacy.orb(90,26,42,5);legacy.fill(89,19,41,91,65,43,9);legacy.orb(90,54,42,4.5);legacy.orb(90,67,42,2);legacy.fill(90,65,42,90,PEARL.top-WORLD_SHIFT,42,9);
  legacy.disc(90,27,42,6,9);legacy.disc(90,53,42,5,9);
  for(let a=0;a<360;a+=10){const r=a*Math.PI/180;legacy.set(Math.round(90+Math.cos(r)*4.5),54,Math.round(42+Math.sin(r)*4.5),11)}
  legacy.fill(89,9,52,91,9,54,12);legacy.fill(89,53,48,91,53,50,12);legacy.fill(89,54,48,91,56,50,0);
  legacy.fill(85,10,52,87,10,52,7);legacy.fill(94,10,52,96,10,52,7);
  }
  // A bouncy plaza and a forest lookout with a staircase.
  legacy.fill(59,9,58,61,9,60,12);
  legacy.fill(26,0,57,31,12,62,3);legacy.fill(26,13,57,31,20,62,0);legacy.fill(26,12,57,31,12,62,7);
  for(let i=0;i<4;i++){legacy.fill(29,12-i,63+i,30,12-i,63+i,7)}
  // Star crystal at the lookout is reachable from the platform, even in walking mode.
  // New islands and deep-sea landmarks.
  for(let x=299;x<365;x+=7)for(let z=224;z<293;z+=9){const y=this.surfaceAt(x,z);if(y<=WATER_LEVEL+1||COURSES.some(c=>x>=c.bounds.x1&&x<=c.bounds.x2&&z>=c.bounds.z1&&z<=c.bounds.z2))continue;this.fill(x,y,z,x,y+4,z,4);for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)for(let dy=3;dy<=5;dy++)if(Math.abs(dx)+Math.abs(dz)<4)this.set(x+dx,y+dy,z+dz,5);}

  for(const c of COURSES){const b=c.bounds;this.fill(b.x1,Math.floor(c.fallY)-1,b.z1,b.x2,65,b.z2,0);for(const [i,p] of c.platforms.entries()){const x=Math.floor(p.x),z=Math.floor(p.z),r=p.radius;this.fill(x-r,p.y-1,z-r,x+r,p.y-1,z+r,i%5===0?12:c.id==='forest'?5:c.id==='cliff'?10:11);this.set(x,p.y-1,z,12);}}
  const towerDx=CITY.shanghai.x-136.5,towerDz=CITY.shanghai.z-38.5;
  const tower={fill:(x1,y1,z1,x2,y2,z2,id)=>this.fill(x1+towerDx,y1,z1+towerDz,x2+towerDx,y2,z2+towerDz,id),set:(x,y,z,id)=>this.set(x+towerDx,y,z+towerDz,id),disc:(x,y,z,r,id)=>this.disc(x+towerDx,y,z+towerDz,r,id)};
  // Shanghai Tower: rounded triangular sections taper and twist 120 degrees.
  tower.fill(125,20,25,147,25,51,3);tower.fill(125,25,25,147,25,51,9);
  for(let y=26;y<136;y++)for(let x=126;x<=146;x++)for(let z=28;z<=48;z++){const dx=x+.5-136.5,dz=z+.5-38.5,d=Math.hypot(dx,dz),a=Math.atan2(dz,dx),r=towerProfile(y,a);if(d<=r&&d>=r-1.05)tower.set(x,y,z,y%10===5?9:11);}
  for(const y of [25,45,65,85,105,125,135]){const radius=y>=135?5:Math.floor(towerProfile(y,0));tower.disc(136,y,38,radius,9);if(y<135){tower.fill(135,y+1,37,137,y+5,39,0);tower.fill(132,y+1,36,140,y+3,43,0);}}
  // Clear lobby doorway and elevator arrival zones, with plants in the sky garden.
  tower.fill(134,26,42,138,31,49,0);tower.fill(135,25,46,137,25,49,12);
  tower.fill(133,85,35,139,85,44,9);tower.fill(133,86,35,139,89,44,0);tower.fill(135,85,41,137,85,43,12);
  for(const x of [131,141]){tower.set(x,85,38,7);tower.fill(x,86,38,x,88,38,5);tower.set(x,89,38,12);}
  tower.disc(136,135,38,5,9);tower.fill(134,136,36,138,140,40,0);tower.fill(134,135,37,138,135,39,12);
  for(let y=136;y<=141;y++){const r=5-(y-136)*.65;for(let a=0;a<Math.PI*2;a+=.2)tower.set(Math.round(136+Math.cos(a)*r),y,Math.round(38+Math.sin(a)*r),11);}
  tower.fill(135,136,37,137,141,39,0);tower.fill(135,136,41,137,139,44,0);
  const sea={fill:(x,y,z,xx,yy,zz,id)=>this.fill(x+140,y,z+155,xx+140,yy,zz+155,id),set:(x,y,z,id)=>this.set(x+140,y,z+155,id),surfaceAt:(x,z)=>this.surfaceAt(x+140,z+155)};
  // Temple with a doorway, pillars and glowing floor mosaics.
  sea.fill(122,6,137,138,7,153,9);sea.fill(125,8,140,135,8,150,12);
  for(const x of [123,137])for(const z of [138,152])sea.fill(x,8,z,x,15,z,9);
  sea.fill(122,16,137,138,16,153,11);sea.fill(128,9,141,132,10,149,9);
  for(let i=0;i<32;i++){const x=140+(i*7%23),z=119+(i*11%29),y=sea.surfaceAt(x,z);if(y>WATER_LEVEL-5)continue;sea.set(x,y,z,i%2?10:12);sea.set(x,y+1,z,i%2?10:11);if(i%3===0){sea.set(x-1,y+1,z,10);sea.set(x+1,y+1,z,10)}}
  // A small wreck and seaweed beds.
  sea.fill(151,6,119,160,6,124,7);sea.fill(152,7,119,159,8,119,7);sea.fill(152,7,124,159,8,124,7);sea.fill(156,7,122,156,13,122,4);
  for(let i=0;i<55;i++){const x=115+i*13%60,z=103+i*19%55,y=sea.surfaceAt(x,z);if(y<WATER_LEVEL-7)for(let h=0;h<2+i%4;h++)sea.set(x,y+h,z,5);}
  // A clear arrival pocket inside the coral garden keeps equipment teleport safe.
  this.fill(283,8,286,285,8,288,6);this.fill(283,9,286,285,12,288,0);
  buildRiverfront(this);buildBund(this);buildBridges(this,roadContains);buildWaibaidu(this,ROADS);buildPeaceDining(this);buildMetro(this);buildPrivateSuites(this);

 }
}
export function overlaps(world,x,y,z){
 if(x<WORLD_MIN+.3||z<WORLD_MIN+.3||x>WORLD_MAX-.3||z>WORLD_MAX-.3||y<1)return true;
 for(let ix=Math.floor(x-.29);ix<=Math.floor(x+.29);ix++)for(let iy=Math.floor(y+.001);iy<=Math.floor(y+1.75);iy++)for(let iz=Math.floor(z-.29);iz<=Math.floor(z+.29);iz++)if(world.get(ix,iy,iz))return true;return false;
}
export function trace(world,origin,dir,reach=7){let last=null;for(let t=0;t<=reach;t+=.025){const x=Math.floor(origin.x+dir.x*t),y=Math.floor(origin.y+dir.y*t),z=Math.floor(origin.z+dir.z*t);if(world.get(x,y,z))return {x,y,z,id:world.get(x,y,z),place:last};last={x,y,z}}return null;}
