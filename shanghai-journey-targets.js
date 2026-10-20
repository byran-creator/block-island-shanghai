import {questTarget} from './quest-guidance.js';
import {LINE10_STATIONS,line10ToLocal,line10ToWorld,line10RampAt} from './metro-line10-layout.js';
import {METRO_HALL,METRO_STATIONS,metro2RampAt} from './metro-layout.js';
import {JIUQU_BRIDGE,INNER_GARDEN_PATH} from './yuyuan-layout.js';
import {JOURNEY_ACTORS} from './shanghai-journey-content.js';
import {LANDMARKS} from './world.js';
const goal=(p,label,instruction)=>({...p,label,instruction});
export const GALLERY_JOURNEY_ROUTE=[[-46,256.5],[-54,257.5],[-54,264],[-57.5,279.5],[-68,288.5],[-68,295],[-66,295],[-66,296],[-61.5,297.4],[-56.5,298.4],[-51,297.8]];
export const GALLERY_EXIT_ROUTE=[...GALLERY_JOURNEY_ROUTE.slice(2).reverse(),[-60,264],[-68,265],[-77,265]];
function followRoute(p,route,label,instruction){let best=Infinity,index=1;for(let i=1;i<route.length;i++){const a=route[i-1],b=route[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((p.x-a[0])*dx+(p.z-a[1])*dz)/(dx*dx+dz*dz||1))),d=Math.hypot(p.x-a[0]-dx*u,p.z-a[1]-dz*u);if(d<best){best=d;index=i;}}if(Math.hypot(p.x-route[index][0],p.z-route[index][1])<.8)index=Math.min(index+1,route.length-1);return goal({x:route[index][0],y:26,z:route[index][1]},label,instruction);}
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
 if(c.id==='letter')return goal(JOURNEY_ACTORS.lin,'林阿姨 · 外滩志愿者','WASD 走近林阿姨，鼠标环顾；距离三米内按 V。');
 if(c.id==='taste')return questTarget('shop',ctx);
 if(c.id==='lujiazui-metro'||c.id==='return-nanjing'){
  if(ctx.pos.y>40)return goal({...LANDMARKS.skyDeck},'上海中心 · 返回观光电梯','按 V 打开观光电梯，选择回到地面，再前往陆家嘴站。');
  return questTarget('metro',ctx);
 }
 if(c.id==='lujiazui-view'){
  const exit=leaveLujiazui(ctx);if(exit)return exit;
  if(state.edition!==1){const seen=state.encounters??[],kind=!seen.some(p=>p.kind==='office-walk')?'office-walk':!seen.some(p=>p.kind==='tower-visitor')?'tower-visitor':null,p=kind&&(ctx.people??[]).find(p=>p.district==='lujiazui'&&p.kind===kind&&p.guide);
   if(p){if(ctx.pos.y>40)return goal({...LANDMARKS.skyDeck},'上海中心 · 先回街面聊聊','在观光电梯旁按 V 回到地面，先听一位职员和一位游客的故事。');return {...goal(p.root.position,`${p.npcRole} · ${kind==='office-walk'?'楼下的上海故事':'第一次来上海'}`,p.root.visible===false?'人物正在从楼里出来。到门旁稍候，靠近按 V，聊完一个话题。':`已交流 ${seen.length} / 2 · 靠近按 V，选一个话题，读完后继续，留言会收入 N 手账。`),npcTarget:true};}
  }return questTarget('sky',ctx);
 }
 if(c.id==='metro')return questTarget('yuyuan-metro',ctx);
 if(ctx.pos.y<25.5&&ctx.pos.x<-60)return leaveMetro(ctx);
 if(c.id==='garden')return state.gardenTalk?goal({x:-73.5,y:26,z:265},'内园西门 · 领票检票','V 打开月洞门旁检票界面，领体验票，再检票开闸走入内园。'):goal(JOURNEY_ACTORS.gu,'顾先生 · 园门向导','走近顾先生按 V，听听这座园子的故事。');
 if(c.id==='view'){
  if(state.edition!==1&&state.windowSeen){if(Math.hypot(ctx.pos.x+51,ctx.pos.z-297.8)<2.6)return goal({x:-51,y:26,z:297.8},'水上长廊 · 看锦鲤与倒影','停在廊中按 V，看完这段发现，盖下“水廊听鱼”印章。');return followRoute(ctx.pos,GALLERY_JOURNEY_ROUTE,'内园 · 水上长廊寻景','沿园路到西侧水廊入口，再沿弯廊走；不横穿池水。廊中 V 记下这一眼。');}
  if(Math.hypot(ctx.pos.x+46,ctx.pos.z-256.5)>2.5)return followRoute(ctx.pos,[...INNER_GARDEN_PATH.slice(3).reverse().map(([x,z])=>[x,z+60]),[-46,256.5]],'内园 · 沿曲径去圆窗','沿现有园林曲径转弯，不穿过堂屋。到了北侧月洞窗，面对窗外停留两秒。');return goal({x:-46,y:26,z:256.5},'内园北侧 · 月洞窗内侧','站到窗内侧，面向北侧圆窗中的风景，停留两秒；也可答完三道灯谜。');
 }
 if(c.id==='tea'){
  if(state.edition!==1&&!state.bazaarSeen){if(ctx.pos.x>-75&&ctx.pos.x<3&&ctx.pos.z>254&&ctx.pos.z<318)return followRoute(ctx.pos,GALLERY_EXIT_ROUTE,'内园 · 沿廊回西门','沿原长廊回西岸，从西门按 V 开闸离园，去商街看看柜台。');
   const shops=(ctx.gardenShops??[]).filter(s=>s.x<-78),shop=shops.reduce((a,b)=>!a||Math.hypot(b.x-ctx.pos.x,b.z+60-ctx.pos.z)<Math.hypot(a.x-ctx.pos.x,a.z+60-ctx.pos.z)?b:a,null);
   return shop?goal({x:shop.x,y:26,z:shop.z+60},shop.title+' · 看看柜台','走到店门或柜台按 V，看看特色名品即可，不要求消费。随后去湖心亭品茶。'):goal({x:-100,y:26,z:264},'西侧商街 · 逛一间店','走近任一店门柜台按 V 看看，不要求购买；然后前往湖心亭。');
  }return teaTarget(ctx);
 }
 return goal(JOURNEY_ACTORS.shen,'沈伯 · 旅程纪念','走近沈伯按 V，选一个想带走的词，领取纪念卡。');
}
