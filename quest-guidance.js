import {LANDMARKS} from './world.js';
import {METRO_STATIONS,METRO_HALL,metroStationAt,metroRampAt,metroRampFloor} from './metro-layout.js';
import {PEACE_DINING} from './peace-restaurant.js';
import {buildingEntrance} from './city-layout.js';

const point=(p,label,instruction,stage)=>({...p,label,instruction,stage});
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
export function questTarget(id,{pos,npcs=[],vendors=[],stations=[],ride=null,trains=[],landings=[],ferryRiding=false}){
 if(!pos)return null;
 if(id==='hello'){const n=npcs.reduce((a,b)=>!a||distance(b.root.position,pos)<distance(a.root.position,pos)?b:a,null);return point(n?.root.position??LANDMARKS.village,'奶龙 · 生活岛','按 M 查看黄色目标；可先点地图下方的生活岛名称传送，再走近奶龙、看向它并按 G。','hello');}
 if(id==='build')return point(LANDMARKS.survivalCamp,'生存营地 · 可搭建草坪','在普通草坪选择方块，右键或 E 放置。成功放置10块才计入；受保护区域不计。','build');
 if(id==='security'||id==='metro'){
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
