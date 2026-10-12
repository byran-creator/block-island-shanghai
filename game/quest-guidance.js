import {YUYUAN} from './yuyuan-layout.js';
import {LINE10_STATIONS,line10ToWorld,TRANSFER_POINTS,line10Interior,line10ToLocal,line10StationAt,line10RampAt,line10RampFloor} from './metro-line10-layout.js';
import {LANDMARKS} from './world.js';
import {METRO_STATIONS,METRO_HALL,metroStationAt,metroRampAt,metroRampFloor} from './metro-layout.js';
import {PEACE_DINING} from './peace-restaurant.js';
import {buildingEntrance} from './city-layout.js';

const point=(p,label,instruction,stage)=>({...p,label,instruction,stage});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
function line10Target({pos,stations,ride,metroNetwork}){
 if(ride?.line===10){const s=LINE10_STATIONS[1-ride.from];return point(line10ToWorld({x:s.x,y:6,z:ride.from===0?-3.7:3.7}),s.name+' · 10号线到站下车','到站开门后走下车，或 V 辅助下车；南京东路可换乘2号线。','yu-ride');}
 const local=line10ToLocal(pos),s=line10StationAt(local)??LINE10_STATIONS[0],flags=stations.find(f=>f.id===s.id)??{},r=line10RampAt(local.x,local.z),atNanjing=s.id==='nanjing10';
 if(r&&Math.abs(local.y-line10RampFloor(local.x,local.z))<.7){if(r.kind==='entrance'&&pos.y>16.6)return point(line10ToWorld({x:r.x+r.dir*(r.length+1),y:16,z:r.z}),'10号线 · B1扶梯出口','沿扶梯直行到站厅，再去安检和闸机。','entrance-ramp');if(r.kind==='platform'&&flags.paid&&pos.y>6.6)return point(line10ToWorld({x:r.x+r.length+1,y:6,z:r.z}),'10号线 · 站台扶梯出口','沿扶梯到底，先离开坡道再去候车点。','platform-ramp');}
 if(pos.y<10&&!flags.paid)return point(line10ToWorld({x:s.x+6,y:6,z:3}),'10号线 · 返回B1','先沿扶梯返回站厅，完成安检和刷票。','return-hall');
 if(pos.y>12){if(!flags.checked)return point(line10ToWorld({x:s.x-22,y:16,z:-10.4}),'10号线 · 背包安检','在机器旁 V 放包，等3秒；付费区换乘无需重新安检。','security');if(flags.gatePass?.entering)return point(line10ToWorld({x:s.x-12.6,y:16,z:0}),'10号线 · 走过闸机','闸机已开，沿绿色箭头直行。','through-gate');if(!flags.paid)return point(line10ToWorld({x:s.x-15.4,y:16,z:0}),'10号线 · 闸机','V 刷票后走过闸机，再去下行扶梯。','gate');return point(line10ToWorld({x:s.x-12,y:16,z:3}),'10号线 · 下行扶梯','下到站台；南京东路乘虹桥火车站 / 航中路方向去豫园，豫园乘基隆路方向返回。','platform-ramp');}
 const direction=atNanjing?1:-1,t=metroNetwork?.lines?.[10]?.trains?.find(t=>t.direction===direction),index=atNanjing?0:1,open=t?.state?.station===index&&t.state.origin===index&&t.state.open&&t.doorAmount>.85;
 return point(line10ToWorld({x:s.x-2,y:open?6.16:6,z:open?t.root.position.z:atNanjing?-3.7:3.7}),atNanjing?'10号线 · 豫园方向':'10号线 · 南京东路方向',open?'车门已开，走入车厢即可；V 为辅助上车。':'在安全线内等候正确方向的车，先下后上。','board');
}
function transferTarget(pos){
 let nearest=Infinity,index=1;for(let i=1;i<TRANSFER_POINTS.length;i++){const a=TRANSFER_POINTS[i-1],b=TRANSFER_POINTS[i],dx=b[0]-a[0],dz=b[1]-a[1],u=Math.max(0,Math.min(1,((pos.x-a[0])*dx+(pos.z-a[1])*dz)/(dx*dx+dz*dz||1))),d=Math.hypot(pos.x-a[0]-dx*u,pos.z-a[1]-dz*u);if(d<nearest){nearest=d;index=i;}}
 if(distance(pos,{x:TRANSFER_POINTS[index][0],z:TRANSFER_POINTS[index][1]})<1.2)index=Math.min(index+1,TRANSFER_POINTS.length-1);
 const [x,z]=TRANSFER_POINTS[index];return point({x,y:16,z},'南京东路 · 付费换乘通道','沿紫色地面线转弯去10号线，不用出闸和重复安检。','transfer');
}
export function questTarget(id,{pos,npcs=[],vendors=[],stations=[],ride=null,trains=[],landings=[],ferryRiding=false,life=null,metroNetwork=null}){
 if(!pos)return null;
 if(id==='yuyuan-tea')return point({...YUYUAN.tea,z:YUYUAN.tea.z-1.2},'湖心亭 · 茶席','沿九曲桥走进湖心亭，靠近茶席按 V，再选择品茶。','tea');
 if(id==='yuyuan-riddle')return point(YUYUAN.riddle,'豫园 · 灯谜向导','靠近灯谜向导按 V，答对三题；完成后 I 领取奖励。','riddle');
 if(id==='yuyuan-metro'){
  if(ride?.line===10||line10Interior(pos))return line10Target({pos,stations,ride,metroNetwork});
  if(!line10Interior(pos)&&pos.y<23){if(ride)return point({x:METRO_STATIONS[0].x,y:6,z:METRO_STATIONS[0].z+3.7},'2号线 · 南京东路换乘','先在南京东路下车，上扶梯到B1；不要出闸，跟随紫色10号线导向。','transfer-arrival');const s=metroStationAt(pos),flags=stations.find(f=>f.id===s?.id)??{};if(s?.id==='lujiazui'||!flags.paid&&s)return questTarget('metro',{pos,stations,trains});if(s?.id==='nanjing'&&pos.y<12)return point({x:s.x+6,y:6,z:s.z+3},'南京东路 · 上行扶梯换乘','沿扶梯上到B1，在付费区跟随紫色10号线导向，不要刷出闸。','transfer-up');if(pos.z<79)return point({x:-100,y:16,z:79},'南京东路 · 10号线换乘口','走到站厅南侧紫色导向牌下，再沿换乘通道走。','transfer-entry');return transferTarget(pos);}
  if(pos.y>=23)return point({...METRO_STATIONS[0].exits[0],y:26},'南京东路 · 地铁入口','从南京路站口下B1，安检刷票后走付费换乘通道去10号线。','entrance');
  return line10Target({pos,stations,ride,metroNetwork});
 }
 if(id==='survival-fish')return point(LANDMARKS.dock,'潜水补给码头 · 水边','先切生存模式，C 制作鱼竿；站在码头看向开阔水面按 G，等咬钩提示后再 G 收竿。','fish');
 if(id==='survival-cook'){const fire=(life?.furniture??[]).filter(f=>f.type==='campfire').reduce((a,b)=>!a||distance(b,pos)<distance(a,pos)?b:a,null);return point(fire?{x:fire.x+1.5,y:fire.y,z:fire.z}:LANDMARKS.survivalCamp,fire?'你的篝火':'生存营地 · 野炊',fire?'靠近篝火按 G 放肉；等30秒，G 领取熟食后任务才完成。':'C 制作篝火，在营地平整空地按 E 放置；钓鱼获得生鱼，再 G 放入烤制。','cook');}
 if(id==='hello'){const n=npcs.reduce((a,b)=>!a||distance(b.root.position,pos)<distance(a.root.position,pos)?b:a,null);return point(n?.root.position??LANDMARKS.village,'奶龙 · 生活岛','按 M 查看黄色目标；可先点地图下方的生活岛名称传送，再走近奶龙、看向它并按 G。','hello');}
 if(id==='build')return point(LANDMARKS.survivalCamp,'生存营地 · 可搭建草坪','在普通草坪选择方块，右键或 E 放置。成功放置10块才计入；受保护区域不计。','build');
 if(id==='security'||id==='metro'){
  if(ride?.line===10||line10Interior(pos))return line10Target({pos,stations,ride,metroNetwork});
  if(ride){const s=METRO_STATIONS[1-ride.from];return point({x:s.x,y:6,z:s.z+(ride.from===0?-3.7:3.7)},s.name+'站 · 到站下车','扶稳候车，到另一站开门后按 V 下车。中途传送不会完成乘车任务。','ride');}
  const s=metroStationAt(pos)??METRO_STATIONS.reduce((a,b)=>Math.min(...b.exits.map(e=>distance(e,pos)))<Math.min(...a.exits.map(e=>distance(e,pos)))?b:a),flags=stations.find(f=>f.id===s.id)??{},exit=s.exits.reduce((a,b)=>distance(b,pos)<distance(a,pos)?b:a);
  const ramp=metroRampAt(pos.x,pos.z);if(ramp&&Math.abs(pos.y-metroRampFloor(pos.x,pos.z))<.7){if(ramp.kind==='entrance'&&pos.y>16.6)return point({x:ramp.x+ramp.dir*ramp.length,y:16,z:ramp.z},s.name+'站 · B1扶梯出口','沿这段扶梯直行到底，再去青色背包安检。','entrance-ramp');if(ramp.kind==='platform'){if(!flags.paid)return point({x:ramp.x,y:16,z:ramp.z},'B1 · 先安检刷票','沿扶梯返回 B1，先安检再刷票。','platform-ramp');if(pos.y>6.6)return point({x:ramp.x+ramp.length+1,y:6,z:ramp.z},'B2 · 扶梯出口','沿扶梯直行到底，先离开坡道再去候车位置。','platform-ramp');return point({x:ramp.x+ramp.length+1,y:6,z:ramp.z-2.3},'B2 · 离开扶梯出口','向前并向左走到平坦站台，再对准正确方向的车门。','ramp-exit');}}
  if(pos.y>=23){const close=distance(exit,pos)<3;return point({x:exit.x+(close?exit.dir*4:0),y:close?23.78:26,z:exit.z},s.name+'站 · '+exit.number+'号口',close?'沿扶梯方向直行下到 B1，先找到背包安检。':'前往'+exit.label+'的地铁入口，沿扶梯走下去。','entrance');}
  if(pos.y<10&&!flags.paid)return point({x:s.x+6,y:6,z:s.z+3},'返回 B1 站厅','尚未刷票。沿扶梯返回 B1，完成安检后再刷票。','return-hall');
  if(!flags.checked)return point({x:s.x+METRO_HALL.securityX,y:16,z:s.z+METRO_HALL.securityZ-2.4},'B1 · 背包安检','靠近青色安检机器按 V 放包，等3秒检查结束。工作人员旁也可以问路。','security');
  if(flags.gatePass?.entering)return point({x:s.x+METRO_HALL.gateX+1.4,y:16,z:s.z+METRO_HALL.gateZ},'B1 · 走过绿色箭头通道','闸机已开。直接走过通道，无需重复刷票。','through-gate');
  if(!flags.paid)return point({x:s.x+METRO_HALL.gateX-1.4,y:16,z:s.z+METRO_HALL.gateZ},'B1 · 绿色箭头闸机','安检已完成。沿地面线到旁边绿色箭头闸机按 V 刷票，再走过通道。','gate');
  if(pos.y>=10&&pos.x<s.x+METRO_HALL.gateX+.8)return point({x:s.x+METRO_HALL.gateX+2,y:16,z:s.z+METRO_HALL.gateZ},'B1 · 走过绿色箭头通道','刷票成功。对准绿色箭头直行走过闸机，再前往 B2 扶梯。','through-gate');
  if(pos.y>=10){const top={x:s.x-12,z:s.z+3};const close=distance(top,pos)<2.5;return point({x:top.x+(close?4:0),y:close?13.78:16,z:top.z},'下行扶梯 · B2站台','已进闸。沿扶梯直行下到 B2，不需要返回安检。','platform-ramp');}
  const index=METRO_STATIONS.indexOf(s),direction=index===0?1:-1,t=trains.find(t=>t.direction===direction),open=t?.state?.station===index&&t.state.origin===index&&t.state.open&&t.doorAmount>.85;
  if(Math.abs(pos.x-(s.x-2))>.35)return point({x:s.x-2,y:6,z:s.z+(index===0?-3.5:3.5)},'B2 · 对准车门','先走到这个候车点，对准车门，等绿灯亮后直行进入。','align-door');
  return point({x:s.x-2,y:open?6.16:6,z:open?t.root.position.z:s.z+(index===0?-3.5:3.5)},'B2 · '+(index===0?'陆家嘴':'南京东路')+'方向',open?'绿灯已亮、车门已开。对准黄色标记走入车厢即可上车；V 是辅助方式。':'在安全线内等候这一方向列车，先下后上；门开后走进车厢。','board');
 }
 if(id==='ferry'){if(ferryRiding)return point(pos,'轮渡 · 等待抵岸','已登船，随轮渡抵达另一岸，等待到岸提示；不要中途传送。','ferry-ride');const p=landings.reduce((a,b)=>!a||distance(b,pos)<distance(a,pos)?b:a,null);return p?point(p,p.name??'黄浦江轮渡码头','前往渡口等轮渡停稳，靠近船按 V 登船，完整抵达另一岸。','ferry'):null;}
 if(id==='shop'){
  const available=vendors.filter(v=>v.remaining>0),v=(available.length?available:vendors).reduce((a,b)=>!a||distance(b.root.position,pos)<distance(a.root.position,pos)?b:a,null);if(!v)return null;
  const entrance=v.indoor?buildingEntrance(v.building,2.5):null;if(entrance&&distance(v.root.position,pos)>5)return point({...entrance,y:26},v.name+' · 店门','进入一楼店门，找到有商品展示的柜台和商贩。','shop-door');
  return point({x:v.x+.7,y:26,z:v.z+(v.building?.entranceSide??1)*1.9},v.name,'靠近柜台按 V，选择购买一份商品。若先打开对话，选择“看看店内柜台”。','shop');
 }
 if(id==='meal'){if(pos.y<35)return point({...PEACE_DINING.lift},'和平饭店 · 龙凤厅电梯','从和平饭店临江正门进入大堂，再靠近电梯按 V 前往八楼。','meal-lift');return point({...PEACE_DINING.counter,x:PEACE_DINING.counter.x+2},'八楼龙凤厅 · 点餐台','靠近点餐台按 V，成功点一份餐。餐点会摆在江景餐桌。','meal');}
 if(id==='sky')return point(LANDMARKS.shanghai,'上海中心 · 观光电梯','走近观光电梯按 V，在楼层选项中选择巅峰观景台。直接传送到楼顶不计。','sky');
 return null;
}

export function drawQuestTarget(ctx,goal,size,min,worldSize){
 if(!goal)return;const x=(goal.x-min)/worldSize*size,y=(goal.z-min)/worldSize*size,r=size>=400?9:4;
 ctx.fillStyle='#ffd45e';ctx.strokeStyle='#1c333b';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y);ctx.closePath();ctx.fill();ctx.stroke();
 if(size>=400){ctx.font='bold 12px sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeText('追踪：'+goal.label,x,y-14);ctx.fillStyle='#ffe99c';ctx.fillText('追踪：'+goal.label,x,y-14);}
}
