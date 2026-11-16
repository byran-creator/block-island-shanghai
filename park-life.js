import * as THREE from './three.module.js';
import {CENTURY_PARK,CENTURY_PARK_ROUTES} from './century-park.js';
import {expoBank} from './expo-layout.js';
import {routeSamples} from './city-layout.js';
import {routePose} from './bund.js';
import {createBicyclePedaling} from './bicycle-pedaling.js';
import {pedestrianStepClear} from './pedestrian-traffic.js';
import {styleNpc} from './npc-appearance.js';
import {overlaps} from './world.js';
import {HISTORIC_STREET_LIFE} from './historic-street-life.js';

function riverLoop(start,end,inner,outer){
 const stations=Array.from({length:end-start+1},(_,i)=>start+i);
 return [
  ...stations.map(z=>[expoBank(z)+inner,z]),
  ...stations.reverse().map(z=>[expoBank(z)+outer,z]),
  [expoBank(start)+inner,start]
 ];
}
export const EXPO_RIVER_WALK=riverLoop(270,291,2,3);
export const EXPO_RIVER_RUN=riverLoop(280,337,4,5);
const sample=points=>routeSamples(points.map(([x,z])=>[x+.5,z+.5]));
const parkActors=[
 ['guide','唐晴 · 公园志愿者',[323,59],'欢迎来世纪公园。面前是世纪花钟，沿右手边的步道就能到镜天湖。','第一次来，怎么逛？','先到木平台看湖，再往东走过云帆桥。想跑步的话，可以沿南边的红色慢跑道绕一圈。'],
 ['walk','许宁 · 湖边散步',.04,'走慢一点就好，镜天湖边总有一段不吵的路。','沿水走能去哪？','木平台是看镜天湖的地方。沿步道绕过去，就能从云帆桥望见鸟岛。'],
 ['walk','罗叔 · 观鸟游客',.55,'我沿水走，不登鸟岛，站远一点反而看得清。','哪里适合观鸟？','去东面的云帆桥，向湿地那侧看。鸟岛和步道之间隔着水。'],
 ['run','小冯 · 晨跑者',.10,'我通常在草坪边跑一圈，再绕湖散步。','跑道在哪里？','南面草坪边那圈红砖步道是慢跑线。傍晚人多时，我会放慢一点。'],
 ['run','周遥 · 跑步爱好者',.59,'今天刚跑到第二圈。湖风吹过来，比看秒表舒服多了。','跑完去哪休息？','南侧亭子旁和湖边都有长凳。跑完走过去缓一缓，还能看湖。'],
 ['bike','小俞 · 骑行者',.12,'我骑东边的绿道，过云帆桥会慢一点。','骑行绕哪一段？','顺着鸟岛外围的绿道骑，看到桥上有行人就先让他们过去。'],
 ['bike','冉露 · 周末骑行',.62,'每次骑到湿地边，我都会停一下听风。','哪里看田园？','往北骑到花圃边就看得见。花田的小路比较窄，我一般在外圈骑。']
];
const expoActors=[
 ['walk','沈阿姨 · 滨江散步',.15,'我常顺着黄浦江散步，看江面一会儿，再往世博园走。','往哪走去中华艺术宫？','沿这条滨江道向南，到场馆前的广场再往内陆走。'],
 ['walk','陆鸣 · 滨江游客',.57,'今天时间够，就沿江慢慢逛。','附近有什么景色？','黄浦江对岸能看到老城区，往南走还能看到文化中心的银色圆屋顶。'],
 ['run','乔雨 · 滨江跑者',.03,'顺着江风跑，今天这一趟很轻松。','跑道怎么走？','走脚下这条红色跑道。靠江的是步道，另一侧绿色的是骑行道。'],
 ['run','小顾 · 夜跑爱好者',.15,'我习惯在圆屋顶亮灯之前跑完这一圈。','附近哪里能歇脚？','到文化中心附近的滨江广场，从跑道转到步道上就有地方停。'],
 ['run','俞阿姨 · 滨江慢跑',.28,'我跑一会儿就走一会儿，沿江不急。','你从哪儿开始跑？','我从南边广场起跑，折回去的时候还能再看一遍对岸。'],
 ['run','夏河 · 长跑爱好者',.40,'我今天练匀速。江边路长，跑起来有节奏。','前面是什么建筑？','银色圆顶是梅赛德斯-奔驰文化中心，再往东就是中华艺术宫。'],
 ['run','贺晨 · 滨江晨跑',.53,'早上这一段最安静，船比人先忙起来。','晨跑有什么好看的？','跑过弯道时朝江面看，能看到从上游过来的船。'],
 ['run','许悠 · 周末跑者',.65,'周末才有空来这里，今天约了朋友在广场见。','从哪里能看江？','沿靠江的步道更适合停下来。跑道窄，我一般先让到旁边。'],
 ['run','凌舒 · 社区跑友',.78,'我住在浦东，傍晚常来这里跑一小段。','跑多远合适？','先到前面广场折返试试，觉得舒服再延长。'],
 ['run','闻帆 · 夕阳跑者',.90,'跑到这一段，灯亮起来的时候很好看。','哪里能看夕阳？','往靠水的步道去，站在开阔处，能望到江对岸。']
];

export function createParkLife({scene,world,getPos,getVehicles=()=>[]}){
 const box=new THREE.BoxGeometry(1,1,1),tire=new THREE.TorusGeometry(.31,.045,5,12).rotateY(Math.PI/2);
 const materials=new Map();
 function material(color){
  if(!materials.has(color))materials.set(color,new THREE.MeshLambertMaterial({color}));
  return materials.get(color);
 }
 function cube(parent,color,x,y,z,w,h,d){
  const mesh=new THREE.Mesh(box,material(color));
  mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);
  return mesh;
 }
 function walker(root,index,run,role=run?'delivery':'visitor'){
  const shirt=run?'#d18a59':'#729da8',skin='#dcb290',arms=[],legs=[];
  const torso=cube(root,shirt,0,1.04,0,.43,.62,.27),head=cube(root,skin,0,1.55,0,.33,.35,.33);
  for(const side of [-1,1]){
   const arm=new THREE.Group(),leg=new THREE.Group();
   arm.position.set(side*.28,1.28,0);leg.position.set(side*.115,.72,0);
   if(run){
    const bend=1.45,upperLength=.27,forearmLength=.27;
    cube(arm,shirt,0,-upperLength/2,0,.14,upperLength,.16);
    const forearm=cube(arm,skin,0,-upperLength-Math.cos(bend)*forearmLength/2,
     -Math.sin(bend)*forearmLength/2,.14,forearmLength,.15);
    forearm.rotation.x=bend;
   }else cube(arm,shirt,0,-.24,0,.14,.52,.16);
   cube(leg,'#435363',0,-.36,0,.16,.72,.19);
   root.add(arm,leg);arms.push(arm);legs.push(leg);
  }
  styleNpc({root,torso,head,arms,legs},index,role);
  return {arms,legs};
 }
 function bicycle(root,index){
  const frame=index%2?'#5e9f8a':'#c69e65',wheels=[],arms=[],legs=[];
  for(const z of [-.66,.66]){
   const wheel=new THREE.Mesh(tire,material('#24333c'));
   wheel.position.set(0,.35,z);root.add(wheel);wheels.push(wheel);
  }
  cube(root,frame,0,.57,0,.09,.1,1.16);
  cube(root,frame,0,.72,.19,.08,.52,.12).rotation.x=-.2;
  cube(root,frame,0,.76,-.62,.08,.8,.1).rotation.x=.17;
  cube(root,'#2c4550',0,1.12,-.65,.59,.07,.09);
  cube(root,'#26383f',0,.98,.2,.26,.07,.34);
  const torso=cube(root,'#678b9a',0,1.46,.095,.42,.54,.27),head=cube(root,'#d7aa8a',0,1.89,-.045,.33,.33,.31);
  torso.rotation.x=-.18;
  cube(root,'#dacd9c',0,2.06,-.045,.36,.13,.35);
  for(const side of [-1,1]){
   const arm=cube(root,'#678b9a',side*.23,1.37,-.25,.13,.58,.15);arm.rotation.x=.95;arms.push(arm);
   legs.push(cube(root,'#435363',side*.15,1.04,.06,.16,.44,.18));
  }
  styleNpc({root,torso,head,arms,legs},index,'visitor');
  return {wheels,pedaling:createBicyclePedaling({legs,makePart:(...args)=>cube(root,...args)})};
 }
 const routes={walk:sample(CENTURY_PARK_ROUTES.walking),run:sample(CENTURY_PARK_ROUTES.running),bike:sample(CENTURY_PARK_ROUTES.cycling)};
 const river={walk:sample(EXPO_RIVER_WALK),run:sample(EXPO_RIVER_RUN)},b=CENTURY_PARK.bounds;
 const parkNear=p=>p.x>=b.minX-25&&p.x<=b.maxX+25&&p.z>=b.minZ-25&&p.z<=b.maxZ+25;
 const riverNear=p=>p.z>=248&&p.z<=362&&Math.abs(p.x-expoBank(p.z))<=34;
 function place(actor,pose){
  actor.root.position.set(pose.x,26,pose.z);
  actor.root.rotation.y=pose.yaw;
 }
 function region(items,isNear,district,districtRoutes,lazy=false){
  const root=new THREE.Group();root.name=district+'-people';root.visible=false;scene.add(root);
  const people=items.map(([kind,npcRole,start,intro,question,answer,appearance,streetRoute],i)=>{
   const model=new THREE.Group();root.add(model);model.visible=false;
   const route=streetRoute??districtRoutes[kind];
   const actor={root:model,kind:(lazy?'street-':'park-')+kind,person:true,npcRole,district,appearance,
    guide:{intro,choices:[[question,answer]]},route,distance:route?route.lengthMeters*start:0,phase:i,
    speed:kind==='bike'?3.6:kind==='run'?2.5:1.05};
   if(route)place(actor,routePose(route,actor.distance));
   else{model.position.set(start[0]+.5,26,start[1]+.5);model.rotation.y=Math.PI/2;}
   return actor;
  });
  function mount(){
   for(const [i,actor] of people.entries()){
    const kind=items[i][0],seed=lazy?80+district.length*7+i:i+1;
    Object.assign(actor,kind==='bike'?bicycle(actor.root,i):walker(actor.root,seed,kind==='run',actor.appearance));
   }
  }
  if(!lazy)mount();
  return {root,isNear,people,mount:lazy?mount:null};
 }
 const park=region(parkActors,parkNear,'century-park',routes),waterfront=region(expoActors,riverNear,'expo',river);
 const streets=HISTORIC_STREET_LIFE.map(({district,bounds:[left,right,back,front],actors})=>{
  const near=p=>p.y>=23&&p.y<60&&p.x>=left-21&&p.x<=right+21&&p.z>=back-14&&p.z<=front+14;
  const items=actors.map(([path,start,role,name,intro,question,answer])=>['walk',name,start,intro,question,answer,role,routeSamples(path)]);
  return region(items,near,district,{},true);
 });
 const areas=[park,waterfront,...streets];
 function tick(dt){
  const player=getPos();
  for(const area of areas){
   const near=area.isNear(player);
   if(near&&area.mount){area.mount();area.mount=null;}
   if(area.root.visible!==near){
    area.root.visible=near;
    for(const actor of area.people)actor.root.visible=near;
   }
   if(!near||!dt)continue;
   const vehicles=getVehicles();
   for(const actor of area.people){
    if(!actor.route)continue;
    const p=actor.root.position,step=dt*actor.speed,at=routePose(actor.route,actor.distance+step);
    const nearPlayer=Math.abs(player.y-26)<2&&Math.hypot(player.x-at.x,player.z-at.z)<1.55;
    const blocked=nearPlayer||!world.get(Math.floor(at.x),25,Math.floor(at.z))||overlaps(world,at.x,26,at.z)||!pedestrianStepClear(p,at,vehicles);
    if(!blocked){
     actor.distance=(actor.distance+step)%actor.route.lengthMeters;
     place(actor,at);
    }
    if(actor.pedaling){
     if(!blocked){actor.pedaling.advance(step);for(const wheel of actor.wheels)wheel.rotation.x-=step/.31;}
    }else{
     const run=actor.speed>2,angle=blocked?0:Math.sin(actor.distance*(run?4.1:5.5)+actor.phase)*(run?.72:.4);
     for(let i=0;i<2;i++){
      actor.legs[i].rotation.x=i?angle:-angle;
      actor.arms[i].rotation.x=(i?-angle:angle)*.72+(run?.22:0);
     }
    }
   }
  }
 }
 return {people:areas.flatMap(area=>area.people),tick};
}
