import {cityMeetingGoal} from './journey-city-events.js';
import {questTarget} from './quest-guidance.js';
import {LINE10_STATIONS,line10ToLocal,line10ToWorld,line10RampAt} from './metro-line10-layout.js';
import {METRO_HALL,METRO_STATIONS,metro2RampAt} from './metro-layout.js';
import {JIUQU_BRIDGE,INNER_GARDEN_PATH} from './yuyuan-layout.js';
import {JOURNEY_ACTORS} from './shanghai-journey-content.js';
import {LANDMARKS} from './world.js';
const goal=(p,label,instruction,extra={})=>({...p,label,instruction,...extra});
const GALLERY_APPROACH=[[-54,264],[-57.5,279.5],[-68,288.5],[-68,295],[-66,295],[-66,296],[-61.5,297.4],[-56.5,298.4],[-51,297.8]];
export const GALLERY_JOURNEY_ROUTE=[[-77,265],[-68,265],[-60,264],...GALLERY_APPROACH];
const NORTH_GALLERY_ROUTE=[...INNER_GARDEN_PATH.slice(0,7).map(([x,z])=>[x,z+60]),...GALLERY_APPROACH.slice(1)];
export const GALLERY_EXIT_ROUTE=[...GALLERY_JOURNEY_ROUTE].reverse();
export const GARDEN_GUIDE_RADIUS=2.6;
export function nearGardenGuide(p){const a=JOURNEY_ACTORS.guide;return Math.hypot(p.x-a.x,p.z-a.z)<GARDEN_GUIDE_RADIUS&&Math.abs(p.y-a.y)<1.4;}
export function galleryRouteTarget(p){const route=p.x>-54&&p.z<264?NORTH_GALLERY_ROUTE:GALLERY_JOURNEY_ROUTE;return followRoute(p,route,'内园 · 前往水廊桥','沿园路从西侧走上水廊桥，跟随黄色标记找导游许棠。',.25);}
function followRoute(p,route,label,instruction,waypointRadius=.8){let best=Infinity,index=1;for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(dx*dx+dz*dz||1))),d=Math.hypot(p.x-a[0]-dx*u,p.z-a[1]-dz*u);if(d<best){best=d;index=i;}}if(Math.hypot(p.x-route[index][0],p.z-route[index][1])<waypointRadius)index=Math.min(index+1,route.length-1);return goal({x:route[index][0],y:26,z:route[index][1]},label,instruction);}
function leaveMetro(ctx){
 const p=ctx.pos,l=line10ToLocal(p),s=LINE10_STATIONS[1],flags=ctx.stations?.find(x=>x.id==='yuyuan')??{},r=line10RampAt(l.x,l.z);
 if(p.y>=25.5)return null;
 if(p.y<12)return goal(line10ToWorld({x:s.x+6,y:6,z:3}),'豫园 · 上行扶梯','下车后向上行扶梯走，回到 B1 站厅。');
 if(flags.paid||flags.gatePass)return goal(line10ToWorld({x:s.x+METRO_HALL.gateX+(flags.gatePass?-1.8:1.5),y:16,z:METRO_HALL.gateZ}),'豫园 · 出站闸机',flags.gatePass?'沿开闸方向走过通道。':'在绿色箭头闸机旁按 V 刷出站，再走过闸机。');
 const e=s.exits[0];return goal(line10ToWorld({x:r?.kind==='entrance'?e.x-e.dir: e.x+e.dir*19,y:r?.kind==='entrance'?26:16,z:e.z}),'豫园 · 1号口扶梯','沿1号口扶梯上街面，园门向导就在附近。');
}
function teaTarget(ctx){
 const p=ctx.pos;
 if(p.x>-75&&p.x<3&&p.z>254&&p.z<318)return followRoute(p,[[-46,256.5],...INNER_GARDEN_PATH.slice(3).map(([x,z])=>[x,z+60]),[-77,265]],'内园 · 西门离园','沿曲径回西门，按 V 开离园闸，走出后沿商街向北。');
 if(p.x<-70&&p.z>239)return goal({x:-77,y:26,z:234},'豫园 · 湖心亭北侧入口','沿西侧商街向北到湖畔，避开池水，走上九曲桥。');
 if(Math.abs(p.x+46)>5||Math.abs(p.z-238)>3.5){
  const route=[...JIUQU_BRIDGE.slice(0,7).map(([x,z])=>[x,z+60]),[-46,238]];let best=Infinity,index=1;
  for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(dx*dx+dz*dz||1))),d=Math.hypot(p.x-a[0]-dx*u,p.z-a[1]-dz*u);if(d<best){best=d;index=i;}}
  if(Math.hypot(p.x-route[index][0],p.z-route[index][1])<.8)index=Math.min(index+1,route.length-1);
  return goal({x:route[index][0],y:26.2,z:route[index][1]},'九曲桥 · 沿桥面转弯','跟随折桥走，不横穿池水；走到湖心亭茶席按 V。');
 }
 return questTarget('yuyuan-tea',ctx);
}
function leaveLujiazui(ctx){
 const p=ctx.pos,s=METRO_STATIONS[1],flags=ctx.stations?.find(x=>x.id===s.id)??{},r=metro2RampAt(p.x,p.z);
 if(p.y>=25.5)return null;
 if(p.y<12)return goal({x:s.x+6,y:6,z:s.z+3},'陆家嘴 · 上行扶梯','先沿上行扶梯回到 B1，再刷闸出站去上海中心。');
 if(flags.paid||flags.gatePass)return goal({x:s.x+METRO_HALL.gateX+(flags.gatePass?-1.8:1.5),y:16,z:s.z+METRO_HALL.gateZ},'陆家嘴 · 出站闸机',flags.gatePass?'沿开闸方向走过通道。':'在绿色箭头闸机旁按 V 刷出站，再走过闸机。');
 const e=s.exits[1];return goal({x:r?.kind==='entrance'?e.x-e.dir:e.x+e.dir*19,y:r?.kind==='entrance'?26:16,z:e.z},'陆家嘴 · 3号口扶梯','沿3号口扶梯上到街面，再去上海中心观光电梯。');
}
export function shanghaiJourneyTarget(state,ctx){
 if(state.phase!=='journey'||!state.tracked||!ctx?.pos)return null;
 const c=state.chapter;
 if(c.id==='letter')return goal(JOURNEY_ACTORS.lin,'林阿姨 · 外滩志愿者',ctx.touch?'轻推左下角摇杆，跟着黄色方向走近林阿姨；右侧滑动环顾，近旁点「互动 V」。':'WASD 跟随黄色方向走近林阿姨，鼠标环顾；近旁按 V。',{arriveRadius:2.8,arrivalAction:'talk'});
 if(c.id==='taste')return questTarget('shop',ctx);
 if(c.id==='lujiazui-metro'||c.id==='return-nanjing'){
  if(ctx.pos.y>40)return goal({...LANDMARKS.skyDeck},'上海中心 · 返回观光电梯','按 V 打开观光电梯，选择回到地面，再前往陆家嘴站。');
  return questTarget('metro',ctx);
 }
 if(c.id==='lujiazui-view'){
  const exit=leaveLujiazui(ctx);if(exit)return exit;
  if(state.edition!==1){const meeting=cityMeetingGoal(state,ctx);if(meeting){if(ctx.pos.y>40)return goal({...LANDMARKS.skyDeck},'上海中心 · 先回街面帮忙','在观光电梯旁按 V 回到地面，跟随黄色目标认识职员和游客。');return meeting;}}
  return questTarget('sky',ctx);
 }
 if(c.id==='metro')return questTarget('yuyuan-metro',ctx);
 if(ctx.pos.y<25.5&&ctx.pos.x<-60)return leaveMetro(ctx);
 if(c.id==='garden')return state.gardenTalk?goal({x:-73.5,y:26,z:265},'内园西门 · 领票检票','V 打开月洞门旁检票界面，领体验票，再检票开闸走入内园。'):goal(JOURNEY_ACTORS.gu,'顾先生 · 园门向导','走近顾先生按 V，听听这座园子的故事。');
 if(c.id==='view'){
  const p=ctx.pos;
  if(p.x<-75)return goal({x:-73.5,y:26,z:265},'内园西门 · 领票检票','从西门按 V 领票、检票，然后走进内园。');
  if(nearGardenGuide(p))return goal(JOURNEY_ACTORS.guide,'许棠 · 豫园导游',ctx.touch?'点「互动 V」听豫园故事。':'按 V 听豫园故事。',{arriveRadius:GARDEN_GUIDE_RADIUS,arrivalAction:'talk'});
  return galleryRouteTarget(p);
 }
 if(c.id==='tea'){
  if(!state.bazaarSeen){if(ctx.pos.x>-75&&ctx.pos.x<3&&ctx.pos.z>254&&ctx.pos.z<318)return followRoute(ctx.pos,GALLERY_EXIT_ROUTE,'内园 · 沿廊回西门','沿原长廊回西岸，从西门按 V 开闸离园，去商街看看柜台。',.25);
   const shops=(ctx.gardenShops??[]).filter(s=>s.x<-78),shop=shops.reduce((a,b)=>!a||Math.hypot(b.x-ctx.pos.x,b.z+60-ctx.pos.z)<Math.hypot(a.x-ctx.pos.x,a.z+60-ctx.pos.z)?b:a,null);
   return shop?goal({x:shop.insideX??shop.x,y:26,z:(shop.insideZ??shop.z)+60},shop.title+' · 看看柜台','走进店里，靠近柜台按 V 看看特色名品，不要求消费。随后去湖心亭品茶。'):goal({x:-100,y:26,z:264},'西侧商街 · 逛一间店','走进一家店，靠近柜台按 V 看看，不要求购买；然后前往湖心亭。');
  }return teaTarget(ctx);
 }
 return goal(JOURNEY_ACTORS.shen,'沈伯 · 旅程纪念','走近沈伯按 V，选一个想带走的词，领取纪念卡。');
}
