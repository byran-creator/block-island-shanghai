import * as THREE from './three.module.js';
import {createMetro} from './metro.js';
import {trainPose} from './metro-service.js';
import {metroInterior,metro2Interior} from './metro-layout.js';
import {LINE10_COLOR,LINE10_ORIGIN,LINE10_ROTATION,LINE10_STATIONS,LINE10_RAMPS,line10StationAt,line10InteriorLocal,line10Interior,line10RampAt,line10RampFloor,line10Direction,line10ToLocal,line10ToWorld,TRANSFER_POINTS,transferInterior} from './metro-line10-layout.js';
export function createMetroNetwork(options){
 const {scene,getPos,place,setView,getYaw=()=>0,notify,onEvent=()=>{}}=options;
 const config2={networkInterior:metroInterior,wallOpenings:[{station:'nanjing',side:1,x:-100,width:7}]};
 const two=createMetro({...options,config:config2});
 const config10={lineNumber:10,stations:LINE10_STATIONS,ramps:LINE10_RAMPS,stationAt:line10StationAt,interior:line10InteriorLocal,rampAt:line10RampAt,rampFloor:line10RampFloor,direction:line10Direction,networkInterior:p=>metroInterior(line10ToWorld(p)),trainPose:s=>trainPose(s,{stations:LINE10_STATIONS,lineZ:()=>0}),wallOpenings:[{station:'nanjing10',side:1,x:164,width:5}],signOptions:{lineNumber:10,lineColor:LINE10_COLOR,routeNames:['天潼路','南京东路','豫园','老西门','一大会址·新天地'],routeEnglish:['Tiantong Rd.','East Nanjing Rd.','Yuyuan Garden','Laoximen','Xintiandi'],routePair:['南京东路','豫园']},trainOptions:{lineNumber:10,lineColor:LINE10_COLOR,cars:[-20,-12,-4,4,12,20],modelName:'10A01',destinationLabels:['虹桥 / 航中路','基隆路']}};
 const ten=createMetro({...options,config:config10,getPos:()=>line10ToLocal(getPos()),place:p=>place(line10ToWorld(p)),setView:(a,p)=>setView(a+LINE10_ROTATION,p),getYaw:()=>getYaw()-LINE10_ROTATION,onEvent:e=>{if(e.type==='metro')onEvent({...e,type:'metro10',line:10,from:e.from==='nanjing10'?'nanjing':e.from,to:e.to==='nanjing10'?'nanjing':e.to});else if(e.type==='security')onEvent({...e,station:e.station==='nanjing10'?'nanjing':e.station,line:10});}});
 ten.root.position.set(LINE10_ORIGIN.x,0,LINE10_ORIGIN.z);ten.root.rotation.y=LINE10_ROTATION;
 // Staff are also used by the global NPC dialog/collision system, so keep their
 // real scene roots in world coordinates while the station engine remains local.
 for(const person of ten.staff){const p=line10ToWorld(person.root.position);person.root.removeFromParent();scene.add(person.root);person.root.position.set(p.x,p.y,p.z);person.root.rotation.y+=LINE10_ROTATION;person.guide={intro:'欢迎乘坐10号线。南京东路可在付费区换乘2号线；本站安检和闸机与2号线一样。',choices:[['怎么去豫园？','乘虹桥火车站 / 航中路方向，下一站就是豫园；出站先刷闸，再上扶梯。'],['怎样换乘？','在南京东路上到B1，沿紫色10号线或绿色2号线导向走付费换乘通道，无需出闸和重复安检。']]};}
 // Signs stand before each turn, facing the incoming walker. Shared targets
 // are also used for geometric route validation; upward arrows mean straight.
 const returnText=['2号线 / 地面出口','Line 2 / Street exits'];
 const root=new THREE.Group();root.name='nanjing-paid-transfer-passage';scene.add(root);const box=new THREE.BoxGeometry(1,1,1),materials=new Map(),signs=[];
 function cube(color,x,y,z,w,h,d){if(!materials.has(color))materials.set(color,new THREE.MeshBasicMaterial({color}));const m=new THREE.Mesh(box,materials.get(color));m.position.set(x,y,z);m.scale.set(w,h,d);root.add(m);return m;}
 function sign(p,yaw,arrow,forward,backward,width=3.6){const a=two.addSign(['换乘10号线 · 豫园','Transfer to Line 10'],p,width,.7,{lineNumber:10,lineColor:LINE10_COLOR,arrow,yaw,backLines:returnText,backOptions:{lineNumber:2,lineColor:'#92c83e',arrow:'↑'}});a.mesh.userData.transferTargets={forward,backward};signs.push(a.mesh);}
 sign({x:-100,y:20.2,z:77.5},Math.PI,'↑',[-100,85],[-107,66],6);
 sign({x:-100,y:20.2,z:83.4},Math.PI,'→',[-114,85],[-100,79]);
 sign({x:-112.4,y:20.2,z:85},Math.PI/2,'←',[-114,124],[-100,85]);
 sign({x:-114,y:20.2,z:122.4},Math.PI,'←',[-107,124],[-114,85]);
 // The return-facing signs explicitly name the real street exits. There is
 // no separate fare gate or street staircase in the Line 10 shared hall.
 ten.addSign(returnText,{x:164,y:20.2,z:11},8,.75,{lineNumber:2,lineColor:'#92c83e',arrow:'↑',yaw:Math.PI,backLines:['10号线 · 豫园','Line 10 · Yuyuan'],backOptions:{lineNumber:10,lineColor:LINE10_COLOR,arrow:'↑'}});
 two.addSign(returnText,{x:-101.6,y:20.2,z:85},3.6,.7,{lineNumber:2,lineColor:'#92c83e',arrow:'←',yaw:-Math.PI/2,backLines:['换乘10号线','Transfer to Line 10'],backOptions:{lineNumber:10,lineColor:LINE10_COLOR,arrow:'↑'}});
 two.addSign(returnText,{x:-114,y:20.2,z:87},3.6,.7,{lineNumber:2,lineColor:'#92c83e',arrow:'→',yaw:0,backLines:['换乘10号线','Transfer to Line 10'],backOptions:{lineNumber:10,lineColor:LINE10_COLOR,arrow:'↑'}});
 two.addSign(returnText,{x:-112.4,y:20.2,z:124},3.6,.7,{lineNumber:2,lineColor:'#92c83e',arrow:'→',yaw:Math.PI/2,backLines:['换乘10号线','Transfer to Line 10'],backOptions:{lineNumber:10,lineColor:LINE10_COLOR,arrow:'↑'}});
 for(let i=1;i<TRANSFER_POINTS.length;i++){const a=TRANSFER_POINTS[i-1],b=TRANSFER_POINTS[i],x=(a[0]+b[0])/2,z=(a[1]+b[1])/2,len=Math.hypot(b[0]-a[0],b[1]-a[1]),yaw=Math.atan2(b[0]-a[0],b[1]-a[1]);for(const [color,offset]of [['#c6a6d8',-.22],['#92c83e',.22]]){const strip=cube(color,x+Math.cos(yaw)*offset,16.02,z-Math.sin(yaw)*offset,.14,.02,len);strip.rotation.y=yaw;}const ceiling=cube('#263238',x,21.8,z,4.5,.18,len+1);ceiling.rotation.y=yaw;const light=cube('#f5f1df',x,21.68,z,.22,.04,len);light.rotation.y=yaw;cube('#263238',b[0],21.8,b[1],4.5,.18,4.5);}
 // Follow the outside of the original gate housing, rather than walking
 // into its transparent fare partition beside the escalator landing.
 two.addSign(['出站检票 · 出口1 / 4','Exit gates · Street exits'],{x:-100,y:20.2,z:79.8},5,.7,{lineNumber:2,lineColor:'#92c83e',arrow:'←'});
 two.addSign(['出站检票','Exit gates'],{x:-106,y:20.2,z:77.6},3.6,.7,{lineNumber:2,lineColor:'#92c83e',arrow:'↑'});
 const exitPath=[[-100,79],[-106,79],[-106,66]];for(let i=1;i<exitPath.length;i++){const a=exitPath[i-1],b=exitPath[i];cube('#eed368',(a[0]+b[0])/2,16.04,(a[1]+b[1])/2,Math.abs(a[0]-b[0])||.14,.02,Math.abs(a[1]-b[1])||.14);}
 const stationViews=ten.stations.map(s=>({...s,...line10ToWorld({...s,y:16}),line:10,get paid(){return s.paid;},get checked(){return s.checked;},exits:s.exits.map(e=>({...e,...line10ToWorld({...e,y:26}),axis:'z'}))}));
 const allStates=[...two.stations,...ten.stations];let fare=false;
 const activeLine=()=>ten.isRiding()?ten:two.isRiding()?two:line10Interior(getPos())?ten:two;
 function clearFare(){fare=false;for(const s of allStates){s.checked=false;s.paid=false;s.gate=0;s.gatePass=null;}}
 function tick(dt,flags={}){
  const exits=allStates.filter(s=>s.gatePass?.entering===false);two.tick(dt,flags);ten.tick(dt,flags);
  const exited=exits.some(s=>!s.gatePass&&!s.paid&&!s.checked);
  if(exited||flags.playing&&!metroInterior(getPos())&&!two.isRiding()&&!ten.isRiding())clearFare();
  else {if(allStates.some(s=>s.paid))fare=true;if(fare)for(const s of allStates){s.checked=true;s.paid=true;}}
  document.body.classList?.toggle('in-metro',!!flags.playing&&metroInterior(getPos()));
 }
 function use(){if(two.isRiding())return two.use();if(ten.isRiding())return ten.use();if(line10Interior(getPos())&&ten.use())return true;if(two.use())return true;if(ten.use())return true;if(transferInterior(getPos())){notify('南京东路付费换乘通道 · 紫色去10号线豫园，绿色回2号线陆家嘴；无需出闸。');return true;}return false;}
 return {root,transferSigns:signs,lines:{2:two,10:ten},staff:[...two.staff,...ten.staff],stations:[...two.stations,...stationViews],trains:two.trains,tick,use,seat:()=>activeLine().seat(),collides:(x,y,z)=>{const p=line10ToLocal({x,y,z});return two.collides(x,y,z)||ten.collides(p.x,y,p.z);},floorAt:(x,z)=>{const p=line10ToLocal({x,y:0,z});return two.floorAt(x,z)??ten.floorAt(p.x,p.z);},tryBoard:()=>activeLine().tryBoard(),suspend(){two.suspend();ten.suspend();},end:(...args)=>activeLine().end(...args),isRiding:()=>two.isRiding()||ten.isRiding(),get ride(){const ride=activeLine().ride;return ride?{...ride,line:ten.isRiding()?10:2}:null;},get clock(){return two.clock;},safeSavePoint(){const p=activeLine().safeSavePoint();return p&&ten.isRiding()?line10ToWorld(p):p;},serialize:()=>({...two.serialize(),line10:ten.serialize(),fare}),restore(d){two.restore(d);ten.restore(d?.line10);fare=allStates.some(s=>s.paid);if(fare)for(const s of allStates){s.checked=true;s.paid=true;}}};
}
