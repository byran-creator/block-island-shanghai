import {createMetroSounds} from './metro-sounds.js';
import {metroFixtures,fixtureCollision,passengerSpot} from './metro-fixtures.js';
import {paintMetroSign,metroSignCanvasSize} from './metro-sign-paint.js';
import {METRO_POSTER_SRC,METRO_POSTER_ASPECT} from './metro-poster-art.js';
import {styleNpc} from './npc-appearance.js';
import {announcementLines,speakVoiceLines} from './voice-settings.js';
import {terrazzoTexture,decorateMetroStation} from './metro-decor.js';
import * as THREE from './three.module.js';
import {batchMeshes,staticMeshes} from './mesh-batch.js';
import {METRO_STATIONS,METRO_RAMPS,metroStationAt,metroInterior,metroRampFloor,metroRampAt} from './metro-layout.js';
import {trainState,trainPose,arrivalSeconds,trainCrowd,METRO_CYCLE,METRO_DWELL} from './metro-service.js';
import {metroExitSign,METRO_SECURITY_GUIDANCE} from './metro-sign-layout.js';
import {METRO_HALL} from './metro-layout.js';
import {METRO_CARS,METRO_DOOR_CENTERS,nearestMetroDoor,createSlidingDoor,createMetroTrain} from './metro-train.js';

export function createMetro({scene,getPos,place,setView,notify,getAudio,getSound=()=>true,canCarry=()=>true,canBoard=canCarry,onEvent=()=>{}}){
 const root=new THREE.Group();root.name='shanghai-line-2';scene.add(root);
 const tileTexture=terrazzoTexture(),box=new THREE.BoxGeometry(1,1,1),mats=new Map(),stations=[],staff=[],trains=[];let clock=0,ride=null,scan=null,audioAllowed=false,ownSpeech=false,subtitleTime=0;
 const hud=document.createElement('aside');hud.id='metro-status';hud.hidden=true;document.body.append(hud);
 const caption=document.createElement('div');caption.id='metro-caption';caption.hidden=true;caption.setAttribute('aria-live','polite');document.body.append(caption);
 function mat(color,opacity=1){const k=color+opacity;if(!mats.has(k))mats.set(k,new THREE.MeshBasicMaterial({color,transparent:opacity<1,opacity,depthWrite:opacity===1}));return mats.get(k);}
 function cube(parent,color,x,y,z,w,h,d,opacity=1){const m=new THREE.Mesh(box,mat(color,opacity));m.position.set(x,y,z);m.scale.set(w,h,d);m.userData.range=180;parent.add(m);return m;}
 function slab(parent,color,x,y,z,w,d){
  const x1=x-w/2,x2=x+w/2,z1=z-d/2,z2=z+d/2,xs=[x1,x2],zs=[z1,z2];
  for(const r of METRO_RAMPS){const a=Math.min(r.x-r.dir*1.4,r.x+r.dir*(r.length+1.4)),b=Math.max(r.x-r.dir*1.4,r.x+r.dir*(r.length+1.4));if(b<x1||a>x2||r.z+r.width<z1||r.z-r.width>z2)continue;xs.push(Math.max(x1,a),Math.min(x2,b));for(let xx=Math.max(x1,a)+.5;xx<Math.min(x2,b);xx+=.5)xs.push(xx);zs.push(Math.max(z1,r.z-r.width),Math.min(z2,r.z+r.width));}
  xs.sort((a,b)=>a-b);zs.sort((a,b)=>a-b);const vertices=[];
  for(let i=1;i<xs.length;i++)for(let j=1;j<zs.length;j++){const a=xs[i-1],b=xs[i],c=zs[j-1],d=zs[j],h=metroRampFloor((a+b)/2,(c+d)/2);if(b-a<.001||d-c<.001||h!==null&&y>=h-.25&&y<h+3.8)continue;vertices.push(a,y,c,a,y,d,b,y,c,b,y,c,a,y,d,b,y,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));const uv=[];for(let i=0;i<vertices.length;i+=3)uv.push(vertices[i]/2,vertices[i+2]/2);g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));const material=mat(color).clone();material.side=THREE.DoubleSide;const m=new THREE.Mesh(g,material);parent.add(m);return m;
 }
 function board(parent,lines,x,y,z,w,h,color='#c4ef67',bg='#18212a',options=null){
  const c=document.createElement('canvas');const size=options?metroSignCanvasSize(w,h):{width:768,height:256};c.width=size.width;c.height=size.height;const ctx=c.getContext('2d'),tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
  const m=new THREE.Group(),geometry=new THREE.PlaneGeometry(w,h),material=new THREE.MeshBasicMaterial({map:tex});const front=new THREE.Mesh(geometry,material),back=new THREE.Mesh(geometry,material);front.userData.panel=back.userData.panel=true;front.position.z=options?.transit?.04:.012;back.position.z=options?.transit?-.04:-.012;back.rotation.y=Math.PI;m.add(front,back);m.position.set(x,y,z);parent.add(m);
  const paint=text=>{if(options){paintMetroSign(ctx,text,{...options,width:c.width,height:c.height,color,bg});tex.needsUpdate=true;return;}ctx.fillStyle=bg;ctx.fillRect(0,0,768,256);ctx.fillStyle=color;ctx.textAlign='center';text.forEach((line,i)=>{ctx.font=`${i===0?'bold ':''}${text.length>2?48:64}px sans-serif`;ctx.fillText(line,384,55+i*(text.length>2?68:110),746);});tex.needsUpdate=true;};paint(lines);return {mesh:m,paint,texture:tex};
 }
 function person(parent,index,x,y,z,uniform){const r=new THREE.Group();r.position.set(x,y,z);parent.add(r);const shirt=uniform??['#a98ad3','#dde8eb','#dd9d72','#799cc4','#789f91'][index%5];cube(r,shirt,0,1.04,0,.42,.65,.29);cube(r,'#dcb08d',0,1.55,0,.34,.35,.33);cube(r,'#302b30',0,1.76,0,.35,.08,.34);for(const side of [-1,1]){cube(r,shirt,side*.29,1.04,0,.14,.56,.19);cube(r,'#344053',side*.12,.39,0,.17,.74,.22);}styleNpc({root:r,torso:r.children[0],head:r.children[1],hair:r.children[2],arms:[r.children[3],r.children[5]],legs:[r.children[4],r.children[6]]},index,uniform?'staff':'visitor');return r;}
 const sounds=createMetroSounds({getAudio,allowed:()=>audioAllowed&&getSound()&&!document.hidden});
 function announce(text,english,{cue='station',speaker='2号线广播'}={}){const speech=globalThis.speechSynthesis,lines=announcementLines(speech,'metro',text,english);caption.textContent=speaker+' · '+lines.map(line=>line.text).join(' / ');caption.hidden=false;subtitleTime=8;if(!audioAllowed||!getSound())return;sounds.play(cue);try{if(speech?.speaking||speech?.pending)return;ownSpeech=speakVoiceLines(speech,globalThis.SpeechSynthesisUtterance,lines,{onEnd:()=>ownSpeech=false})>0;}catch{ownSpeech=false;}}
 function suspend(){audioAllowed=false;sounds.suspend();if(ownSpeech){globalThis.speechSynthesis?.cancel();ownSpeech=false;}}
 function stationSign(lines,x,y,z,w,h,options={}){const a=board(root,lines,x,y,z,w,h,'#f4f7f4','#192123',{...options,transit:true});a.mesh.rotation.y=options.yaw??0;a.mesh.userData.stationSign={y,height:h,width:w,options};cube(a.mesh,'#555b5c',0,0,0,w+.035,h+.035,.075);if(!options.wall){const ceiling=y>14?21.5:10.8,hang=Math.max(.15,ceiling>y+h/2?ceiling-y-h/2:.46);for(const side of [-1,1])cube(a.mesh,'#687273',side*w*.36,h/2+hang/2,0,.035,hang,.035);}return a;}
 const posterTexture=new THREE.Texture();posterTexture.colorSpace=THREE.SRGBColorSpace;posterTexture.minFilter=THREE.LinearMipmapLinearFilter;posterTexture.magFilter=THREE.LinearFilter;posterTexture.anisotropy=4;
 if(typeof Image!=='undefined'){const art=new Image();art.onload=()=>{posterTexture.image=art;posterTexture.needsUpdate=true;};art.src=METRO_POSTER_SRC;}
 const posterMaterial=new THREE.MeshBasicMaterial({map:posterTexture});
 for(const s of METRO_STATIONS){
  const state={...s,fixtures:metroFixtures(s),checked:false,paid:false,gate:0,lastSecond:-1,doors:[],people:[],screens:[]};stations.push(state);
  // Gray tile floors, dark slatted ceilings, linear white lamps and station color columns.
  for(const y of [16,6]){const half=y===16?14:5,top=y===16?5.5:4.8,columnZ=y===16?s.z-11:s.z-.4;const floor=slab(root,'#ffffff',s.x,y+.005,s.z,70,half*2);floor.material.map=tileTexture;slab(root,'#1e252d',s.x,y+top,s.z,70,y===16?30:23);for(let x=-32;x<34;x+=3)slab(root,'#afb4b3',s.x+x,y+.01,s.z,.025,half*2);for(let z=-half;z<half;z+=3)slab(root,'#afb4b3',s.x,y+.01,s.z+z,70,.025);for(let x=-32;x<=32;x+=4){slab(root,'#39434a',s.x+x,y+top-.15,s.z,.5,half*2);slab(root,'#f5ffff',s.x+x,y+top-.3,s.z,2.8,.2);}for(let x=-28;x<=28;x+=14){cube(root,s.color,s.x+x,y+2.3,columnZ,.85,4.6,.85);}}
  for(const side of [-1,1]){cube(root,'#d8dede',s.x,6.7,s.z+side*11.75,70,7.1,.06);cube(root,'#315144',s.x,9.8,s.z+side*11.7,70,.45,.07);cube(root,'#d8dede',s.x,18.8,s.z+side*15.9,70,5.5,.06);}
  stationSign([s.name,s.english],s.x+7,19.2,s.z-14.92,3.8,2.45,{line2:true,layout:'station',wall:true});
  stationSign([],s.x-4,20.25,s.z+.25,10.8,.8,{sections:[{zh:'号线',en:'Line 2',line2:true,arrow:'↑',weight:1.1},{exit:s.exits[0].number,arrow:'←'},{exit:s.exits[1].number,arrow:'→'}]});
  // Security lane in the unpaid hall. The backpack visibly passes through the X-ray belt.
  cube(root,'#555f68',s.x-22,16.45,s.z-8,5,.9,1.8);cube(root,'#252b31',s.x-22,16.98,s.z-8,5,.12,1.5);cube(root,'#9aa5a9',s.x-22,17.9,s.z-8,2.1,1.8,2);cube(root,'#111a23',s.x-20.93,17.55,s.z-8,.03,1,1.4);
  state.bag=cube(root,'#cfb064',s.x-24,17.28,s.z-8,.6,.6,.5);state.bag.visible=false;
  stationSign(['安全检查','Security check'],s.x-22,20.25,s.z-8,4.8,.7,{line2:false,arrow:'↓',pictogram:'bag'});
  const employee={root:person(root,0,s.x-25,16,s.z-6,'#6a91a9'),person:true,metroRole:'地铁安检员',guide:{intro:'欢迎乘坐2号线。把背包放到旁边安检机上，检查完成后再进闸。你的物品会原样保留。',choices:[['怎么坐地铁？','按 V 放包安检，等检查完成。到绿色箭头闸机按 V 刷免费体验票，再沿自动扶梯下到B2。'],['去外滩或东方明珠怎么走？',s.id==='nanjing'?'出站后沿南京路向东走到外滩；乘浦东方向列车可到陆家嘴。':'1号方向出站后去东方明珠；乘市区方向列车到南京东路，再往东走到外滩。'],['广告上的演唱会能买票吗？','墙上展示的是玩家提供的华晨宇演唱会图片，不代表真实场次，站内也不提供售票。']]}};staff.push(employee);
  const gx=s.x+METRO_HALL.gateX,gz=s.z+METRO_HALL.gateZ;
  cube(root,'#a7b4bc',gx,17,s.z-11.225,.1,1.8,9.25,.55);cube(root,'#a7b4bc',gx,17,s.z+5.775,.1,1.8,20.35,.55);
  for(const z of [gz-2,gz+2]){cube(root,'#b9c3c6',gx,16.6,z,2,1.2,.48);cube(root,'#28403e',gx,17.22,z,.8,.05,.35);}
  state.gateMesh=cube(root,'#49d5b2',gx,16.8,gz,.08,.7,1.45,.75);
  stationSign(['进站检票','Tickets'],gx,20.25,gz,5.6,.75,{sections:[{zh:'进站检票',en:'Tickets',arrow:'↑',pictogram:'ticket',weight:1.7},{zh:'号线',en:'Line 2',line2:true}],yaw:-Math.PI/2});
  const paths=[[[s.x-21,s.z-4.75],[s.x-22,s.z-5.5]],[[s.x-22,s.z-5.5],[gx+2,gz]],[[gx+2,gz],[gx+2,s.z+3]]];
  state.routes=paths.map(points=>{const g=new THREE.Group();root.add(g);for(let i=1;i<points.length;i++){const [ax,az]=points[i-1],[bx,bz]=points[i];cube(g,'#72edce',(ax+bx)/2,16.045,(az+bz)/2,Math.abs(bx-ax)||.16,.025,Math.abs(bz-az)||.16);}return g;});
  stationSign(['进站检票','Tickets'],s.x-22,METRO_SECURITY_GUIDANCE.y,s.z-5.5,METRO_SECURITY_GUIDANCE.width,METRO_SECURITY_GUIDANCE.height,{line2:false,arrow:'→'});
  cube(root,'#72edce',gx-1,16.05,gz,1.2,.025,.55);
  for(const side of [-1,1]){
   cube(root,'#bad787',s.x,6.025,s.z+side*4.4,69,.045,.45);cube(root,'#eed368',s.x,6.03,s.z+side*5,69,.05,.16);
   let edge=-34.5;
   for(const x of METRO_DOOR_CENTERS){const lo=x-.8;if(lo>edge)cube(root,'#85b2bf',s.x+(edge+lo)/2,6.75,s.z+side*5.55,lo-edge,1.4,.1,.32);const door=createSlidingDoor(root,cube,{x:s.x+x,z:s.z+side*5.55,y:6.75,height:1.4,screen:true});state.doors.push({...door,side});cube(root,'#c0cad0',s.x+x+.88,6.8,s.z+side*5.55,.1,1.5,.18);edge=x+.8;}
   if(edge<34.5)cube(root,'#85b2bf',s.x+(edge+34.5)/2,6.75,s.z+side*5.55,34.5-edge,1.4,.1,.32);
   const dir=side===-1?1:-1;stationSign([dir===1?'陆家嘴方向':'南京东路方向',dir===1?'To Lujiazui':'To East Nanjing Road'],s.x+(side===1?-17:17),10,s.z+side*2.8,6.3,.75,{line2:true,arrow:side<0?'→':'←'});const screen=stationSign(['下一班 / NEXT TRAIN','计算中'],s.x+(side===1?-9.8:9.8),10,s.z+side*2.8,7.7,.75,{line2:false,layout:'arrival'});state.screens.push({screen,dir});
  }
  for(const x of [-28,28]){cube(root,'#91b2bd',s.x+x,6.55,s.z,4,.15,1);for(const z of [-.48,.48])cube(root,'#6e979f',s.x+x,6.95,s.z+z,4,.85,.1);}
  for(const [i,x]of [-28,-8,12,29].entries()){
   const height=4.1,width=height*METRO_POSTER_ASPECT;cube(root,'#edf2ed',s.x+x,18.65,s.z+15.78,width+.18,height+.18,.08);
   const poster=new THREE.Mesh(new THREE.PlaneGeometry(width,height),posterMaterial);poster.rotation.y=Math.PI;poster.position.set(s.x+x,18.65,s.z+15.72);poster.userData.panel=true;root.add(poster);
  }
  decorateMetroStation(root,s,{cube,slab,board});
  // Different phases and destinations prevent passengers marching in identical rows.
  for(let i=0;i<34;i++){const y=i<14?16:6,z=i<14?s.z-11+(i%4)*2.4:s.z-3.4+(i%5)*1.3,x=s.x-31+(i*7.73)%62;
   const gx=s.x+METRO_HALL.gateX;let self=null;
   const clear=(x,y,z)=>!(y===16&&x>s.x-27&&x<s.x-10&&z<s.z-4&&z>s.z-13)&&!fixtureCollision(state.fixtures,x,y,z,.38,1.92)&&Math.abs(x-gx)>1.4&&!METRO_RAMPS.some(r=>Math.abs(r.z-z)<r.width+.4&&Math.abs(y-(metroRampFloor(x,z)??-100))<2)&&!state.people.some(p=>p!==self&&Math.abs(p.y-y)<2&&Math.abs(p.z-z)<.7&&Math.abs(p.x-x)<2);
   const spot=passengerSpot(s,x,z,y,clear);if(!spot)continue;const p=person(root,i,spot.x,y,spot.z);self={root:p,...spot,phase:i*2.173,speed:.28+(i%7)*.055,clear};state.people.push(self);}
  for(const e of s.exits){cube(root,'#abbec0',e.x-e.dir*.8,27.8,e.z-(e.width??1.5)-.35,1.1,3.6,.13);const sign=board(root,[s.name,s.english],e.x-e.dir*.8,29,e.z,7,1.05,'#f4f7f4','#171a1b',{separatorColor:'#f5f5ee',sections:[{zh:s.name+'站',en:s.english+' Station',line2:true,weight:3.4},{exit:e.number,zh:'号口',color:'#f5f5ee'}]});sign.mesh.rotation.y=Math.PI/2;const exitSign=metroExitSign(e);const exitBoard=stationSign(['出口','EXIT'],exitSign.x,exitSign.y,exitSign.z,exitSign.width,exitSign.height,{line2:false,exit:e.number,arrow:'↑',yaw:Math.PI/2});exitBoard.mesh.userData.exitSign={...exitSign};}
 }
 // Sloped escalator support is analytic; treads move while the walking surface stays smooth.
 const treads=[],treadBatch=new THREE.InstancedMesh(box,mat('#98a4ac'),METRO_RAMPS.length*72),treadPose=new THREE.Object3D();treadBatch.frustumCulled=false;root.add(treadBatch);
 for(const r of METRO_RAMPS){const angle=Math.atan2(r.to-r.from,r.length),len=Math.hypot(r.length,r.to-r.from),x=r.x+r.dir*r.length/2,y=(r.from+r.to)/2;
  cube(root,'#788892',r.x-r.dir*.7,r.from-.05,r.z,1.4,.1,r.width*2);cube(root,'#788892',r.x+r.dir*(r.length+.7),r.to-.05,r.z,1.4,.1,r.width*2);
  const bed=cube(root,'#4b5965',x,y-.12,r.z,len,.2,r.width*2);bed.rotation.z=angle*r.dir;
  for(const side of [-1,1]){const rail=cube(root,'#151e28',x,y+.82,r.z+side*r.width,len,.1,.1);rail.rotation.z=angle*r.dir;const glass=cube(root,'#8fb9c5',x,y+.35,r.z+side*r.width,len,.7,.06,.35);glass.rotation.z=angle*r.dir;}
  for(const side of [-1,1])for(let i=0;i<36;i++)treads.push({r,i,side});
 }
 for(let index=0;index<2;index++){const direction=index===0?1:-1,offset=index*METRO_CYCLE/2,model=createMetroTrain({parent:root,direction,cube,board,person});
  const exchanges=Array.from({length:10},(_,i)=>{const p=person(root,i+40,0,6,0);p.visible=false;return p;});
  trains.push({index,direction,offset,...model,exchanges,state:null,lastEvent:'',doorAmount:0});
 }
 function stationIndex(s){return METRO_STATIONS.findIndex(a=>a.id===s.id);}
 const dynamic=new Set([...trains.flatMap(t=>[t.root,...t.exchanges]),...staff.map(s=>s.root),...stations.flatMap(s=>[s.gateMesh,s.bag,...s.people.map(p=>p.root),...s.doors.flatMap(d=>d.leaves.map(l=>l.mesh)),...s.routes])]);
 batchMeshes(root,staticMeshes(root,dynamic),'station-interior');
 function beginScan(s){if(scan){notify('背包正在安检，请稍等。');return;}if(s.checked){notify('你已通过安检，请沿青色地面线去绿色箭头闸机按 V 刷票。');return;}scan={s,time:0};s.bag.visible=true;notify('背包已放上传送带 · 正在安检（3秒）');announce('请把背包放上传送带，稍等一下。','Please place your bag on the belt.',{cue:'scan',speaker:'安检员'});}
 function gate(s){const entering=getPos().x<=s.x+METRO_HALL.gateX;if(entering&&!s.checked){notify('这里是检票闸机。本次尚未通过安检。先到青色背包安检机器按 V，检查结束后再来刷票。');return;}s.paid=entering;s.gate=3;if(!entering)for(const station of stations){station.checked=false;station.paid=false;}notify(entering?'已刷免费体验票 · 对准绿色箭头通道直行，再沿地面线去 B2 扶梯。':'已出闸 · 本次安检结束，再次进站请重新安检。');}
 function end(force=false){if(!ride)return false;const t=trains[ride.index],st=t.state;if(!force&&!(st.phase==='dwell'&&st.open)){notify('列车行驶中不能下车，请等到站开门。');return true;}const index=st.phase==='dwell'?st.station:ride.from,s=METRO_STATIONS[index];stations[index].checked=true;stations[index].paid=true;const trip=ride;ride=null;place({x:s.x,y:6,z:s.z+(t.direction>0?-3.7:3.7)});setView(t.direction>0?0:Math.PI,-.1);if(!force&&trip.departed&&index!==trip.from)onEvent({type:'metro',from:METRO_STATIONS[trip.from].id,to:s.id,departed:true});return true;}
 function use(){const p=getPos();if(ride){return end();}const s=stations.find(s=>Math.abs(p.x-s.x)<37&&Math.abs(p.z-s.z)<17&&Math.abs(p.y-16)<1.1);
  if(s){const machine=Math.hypot(p.x-(s.x-22),p.z-(s.z-8)),employee=Math.hypot(p.x-(s.x-25),p.z-(s.z-6));if(machine<3.4&&(machine<employee||employee>2.2)){beginScan(s);return true;}if(Math.abs(p.x-s.x-METRO_HALL.gateX)<2.2&&Math.abs(p.z-s.z-METRO_HALL.gateZ)<2.2){gate(s);return true;}}
  const station=metroStationAt(p);if(station&&p.y<10){const state=stations[stationIndex(station)],side=p.z<station.z?1:-1,t=trains.find(t=>t.direction===side),st=t.state;if(Math.abs(p.x-station.x)<32&&Math.abs(p.z-station.z)>2){if(!state.paid){notify('乘车前需要安检和刷票进闸。');return true;}if(!st||st.station!==stationIndex(station)||!st.open||t.doorAmount<.85){notify('请在黄色安全线内等候列车到站开门。');return true;}const doorX=nearestMetroDoor(p.x-station.x);if(Math.abs(p.x-station.x-doorX)>1.35){notify('请对准亮绿色门灯下的车门，先下后上。');return true;}const crowd=trainCrowd(st,t.index);ride={index:t.index,from:st.station,seated:false,doorX};setView(t.direction>0?-Math.PI/2:Math.PI/2,-.05);announce(st.station===st.origin?'欢迎乘坐2号线。下一站，'+METRO_STATIONS[st.next].name+'。右侧车门将会打开。':'本站 '+station.name+'。本车即将驶出体验区域，请在关门前下车，到对面站台乘坐返程列车。',st.station===st.origin?'Welcome to Line 2. Next station, '+METRO_STATIONS[st.next].english+'. Doors will open on the right.':'This is '+station.english+'. This train is leaving the playable area. Please get off before the doors close and use the opposite platform for the return train.');notify(crowd.seats?'已上车 · F 坐下 / 起身 · V 到站下车':'已上车 · 座位已满，请扶稳站立 · V 到站下车');positionRider();return true;}}
  for(const station of stations)for(const e of station.exits)if(p.y>24&&Math.hypot(p.x-e.x,p.z-e.z)<5){notify('2号线 '+station.name+' · 沿扶梯走下去，在安检机按 V，再到绿色箭头闸机刷票。');return true;}return false;
 }
 function seat(){if(!ride)return false;const t=trains[ride.index],crowd=trainCrowd(t.state,t.index);if(!ride.seated&&!crowd.seats){notify('这班车座位已满，可以站在车厢中间。');return true;}ride.seated=!ride.seated;const car=METRO_CARS.reduce((a,b)=>Math.abs(b-ride.doorX)<Math.abs(a-ride.doorX)?b:a),side=METRO_CARS.indexOf(car)%2===0?1:-1;if(ride.seated)setView((side>0?0:Math.PI)+t.root.rotation.y,-.05);notify(ride.seated?'已坐下 · F 起身':'已起身');positionRider();return true;}
 function positionRider(){if(!ride)return;const t=trains[ride.index],car=METRO_CARS.reduce((a,b)=>Math.abs(b-ride.doorX)<Math.abs(a-ride.doorX)?b:a),side=METRO_CARS.indexOf(car)%2===0?1:-1,local=new THREE.Vector3(ride.seated?car:ride.doorX,ride.seated?-.1:.16,ride.seated?side*.86:0).applyAxisAngle(new THREE.Vector3(0,1,0),t.root.rotation.y).add(t.root.position);place(local);}
 function trainLocal(t,x,z){const dx=x-t.root.position.x,dz=z-t.root.position.z,a=t.root.rotation.y;return {x:dx*Math.cos(a)-dz*Math.sin(a),z:dx*Math.sin(a)+dz*Math.cos(a)};}
 function floorAt(x,z){
  for(const t of trains){const q=trainLocal(t,x,z);if(t.root.visible&&Math.abs(q.x)<31&&Math.abs(q.z)<1.28)return t.root.position.y+.095;}
  for(const s of stations){if(Math.abs(x-s.x)<35&&(Math.abs(z-s.z)<=5.1||Math.abs(z-s.z)<6.8&&doorOpen(s,x,Math.sign(z-s.z))))return 6;}return null;
 }
 function tryBoard(){if(ride||!canBoard())return false;const p=getPos(),s=metroStationAt(p),state=s&&stations[stationIndex(s)];if(!state||p.y<5.55||p.y>6.65)return false;const side=Math.sign(p.z-s.z),distance=Math.abs(p.z-s.z),t=trains.find(t=>t.direction===-side);
  if(distance>5.45&&distance<9.15&&t?.state.phase==='dwell'&&t.state.station===stationIndex(s)&&t.doorAmount>.85&&state.paid&&(doorOpen(state,p.x,side)||distance>6.8&&Math.abs(p.x-s.x)<31)){use();return !!ride;}return false;
 }
 function doorOpen(s,x,side){const t=trains.find(t=>t.direction===-side);return !!t?.state?.open&&t.state.station===stationIndex(s)&&t.doorAmount>.85&&s.paid&&Math.abs(x-s.x-nearestMetroDoor(x-s.x))<.46;}
 function collides(x,y,z){const floor=floorAt(x,z);if(floor!==null&&y<floor-.015&&y>floor-2)return true;const h=metroRampFloor(x,z);if(h!==null&&y<h-.015&&y>h-2)return true;for(const s of stations){if(Math.abs(x-s.x)>35)continue;
  if(y>=15.5&&y<20&&Math.abs(x-s.x-METRO_HALL.gateX)<.42&&(!s.paid||Math.abs(z-s.z-METRO_HALL.gateZ)>.65))return true;
  const distance=Math.abs(z-s.z),side=Math.sign(z-s.z);
  if(distance>5.15&&distance<7.4){const open=doorOpen(s,x,side);if(y>=5.4&&y<10&&!open)return true;if(open&&y<5.985&&y>5.5)return true;}
  if(fixtureCollision(s.fixtures,x,y,z))return true;
 }return false;}
 function exchangePassengers(t,st){const station=METRO_STATIONS[st.station],part=METRO_DWELL-st.remaining;
  for(const [i,p]of t.exchanges.entries()){const alighting=i<6,start=alighting?1.7+i*.25:5+(i-6)*.35,u=(part-start)/2.5,doorX=nearestMetroDoor((i-4)*4),side=-t.direction;
   p.visible=st.phase==='dwell'&&st.open&&u>=0&&u<1.8;
   if(!p.visible)continue;const f=Math.min(1,u),a=alighting?6.72:2.8,b=alighting?2.8:6.72;
   p.position.set(station.x+doorX+(u>1&&alighting?(u-1)*1.5:0),6,station.z+side*(a+(b-a)*f));p.rotation.y=alighting?(side===1?0:Math.PI):(side===1?Math.PI:0);
  }
 }
 function tick(dt,{playing=false,sound=true}={}){
  if(playing&&!ride&&!metroInterior(getPos())){for(const station of stations){station.checked=false;station.paid=false;}if(scan){scan.s.bag.visible=false;scan=null;notify('已离开站内，背包已取回；再次进站请重新安检。');}}
  audioAllowed=playing&&sound&&!document.hidden;if(audioAllowed&&metroInterior(getPos()))sounds.prepare();if(!audioAllowed)suspend();clock+=dt;
  if(scan){scan.time+=dt;scan.s.bag.position.x=scan.s.x-24+scan.time*1.35;if(scan.time>=3){scan.s.checked=true;scan.s.bag.visible=false;onEvent({type:'security',station:scan.s.id});scan=null;notify('安检通过，背包已取回，全部物品保留。到绿色箭头闸机按 V。');announce('检查好了，请取回背包，往旁边闸机走。','Check complete. Collect your bag and proceed to the gates.',{cue:'pass',speaker:'安检员'});}}
  for(const t of trains){const previous=t.state,st=trainState(clock,t.offset,t.direction),q=trainPose(st);t.state=st;if(ride?.index===t.index&&st.phase==='travel'&&st.origin===ride.from)ride.departed=true;t.root.visible=st.visible;t.root.position.set(q.x,q.y,q.z);t.root.rotation.y=q.yaw;const part=METRO_DWELL-st.remaining;t.doorAmount=st.open?Math.min(1,(part-1.2)/.45,(METRO_DWELL-2-part)/.45):0;for(const d of t.doors)d.set(d.side===t.direction?t.doorAmount:0);exchangePassengers(t,st);const crowd=trainCrowd(st,t.index);t.passengers.forEach((p,i)=>p.visible=(crowd.crowded||i<8)&&!(st.open&&i<6&&METRO_DWELL-st.remaining>2+i*.25));
   const s=metroStationAt(getPos()),near=s&&stationIndex(s)===st.station,event=st.cycle+':'+st.station+':'+(st.phase==='dwell'?(st.open?'open':st.remaining<=3?'close':'arriving'):st.phase);
   if(dt>0&&previous?.phase==='dwell'&&st.phase!=='dwell'&&previous.cycle===st.cycle&&(near||ride?.index===t.index))sounds.play('departure');
   if(event!==t.lastEvent){t.route.paint([METRO_STATIONS[st.station].name,st.phase==='travel'||st.station===st.origin?METRO_STATIONS[st.next].name:'体验区外',String(t.direction),st.phase==='dwell'?'本站 '+METRO_STATIONS[st.station].name+' · 下一站':'下一站']);if(dt>0&&(near||ride?.index===t.index)){if(st.phase==='dwell'&&st.open)announce('列车到站，'+METRO_STATIONS[st.station].name+'。右侧车门已打开。请先下后上，注意站台间隙。','This is '+METRO_STATIONS[st.station].english+'. Doors are open on the right. Please let passengers off first and mind the gap.');else if(st.phase==='dwell'&&st.remaining<=3)announce('车门即将关闭，请勿抢上抢下。','Doors are closing. Please stand clear of the doors.');else if(st.phase==='travel'&&ride?.index===t.index)announce('下一站，'+METRO_STATIONS[st.next].name+'。右侧车门将会打开。','Next station, '+METRO_STATIONS[st.next].english+'. Doors will open on the right.');}t.lastEvent=event;}
   if(ride?.index===t.index&&ride.from!==st.origin&&st.remaining<2.6){end(true);notify('本车驶出体验区域 · 已安全回到站台，请到对面乘坐返程列车。');}
   if(ride?.index===t.index&&st.phase==='dwell'&&st.station!==ride.from&&st.open&&st.remaining<METRO_DWELL-3){end();notify('已到 '+METRO_STATIONS[st.station].name+' · 请从对面站台返程，或沿扶梯出站。');}
  }
  if(!ride&&playing)tryBoard();
  positionRider();const p=getPos(),r=metroRampAt(p.x,p.z),h=metroRampFloor(p.x,p.z);if(!ride&&canCarry()&&r&&Math.abs(p.y-h)<.13){const d=(p.x-r.x)*r.dir;if(d>.05&&d<r.length-.05){const step=(p.z>=r.z?1:-1)*r.dir*dt*.7,x=p.x+step;place({x,y:metroRampFloor(x,p.z),z:p.z});}}
  for(const [index,{r,i,side}]of treads.entries()){const u=((i/36+clock*.026*side)%1+1)%1,x=r.x+r.dir*r.length*u;treadPose.position.set(x,r.from+(r.to-r.from)*u+.015,r.z+side*r.width*.5);treadPose.scale.set(r.length/36,.035,r.width*.91);treadPose.updateMatrix();treadBatch.setMatrixAt(index,treadPose.matrix);}treadBatch.instanceMatrix.needsUpdate=true;
  for(const s of stations){s.routes.forEach((r,i)=>r.visible=i===(s.paid?2:s.checked?1:0));s.gateMesh.visible=!s.paid;for(const d of s.doors){const t=trains.find(t=>t.direction===-d.side);d.set(t.state.station===stationIndex(s)?t.doorAmount:0);}
   s.people.forEach(p=>{const x=p.x+Math.sin(clock*p.speed+p.phase)*.65;if(p.clear(x,p.y,p.z))p.root.position.x=x;p.root.rotation.y=Math.sin(clock*.12+p.phase);});
   const second=Math.floor(clock);if(second!==s.lastSecond){s.lastSecond=second;for(const {screen,dir}of s.screens){const t=trains.find(t=>t.direction===dir),here=t.state.station===stationIndex(s)&&t.state.phase==='dwell',n=Math.ceil(arrivalSeconds(clock,stationIndex(s),t.offset,t.direction));screen.paint([dir===1?'→ 陆家嘴 · 浦东方向':'← 南京东路 · 市区方向',here?(t.state.open?'列车已到站 · 请先下后上':'列车已到站 · 请留意车门'):'下一班 '+Math.floor(n/60)+'分 '+n%60+'秒']);if(dt>0&&n===5&&metroStationAt(getPos())?.id===s.id)announce('列车即将进站，请站在黄色安全线以内。','A train is approaching. Please stand behind the yellow line.',{cue:'arrival'});}}
  }
  subtitleTime=Math.max(0,subtitleTime-dt);caption.hidden=!playing||subtitleTime===0;
  const s=metroStationAt(getPos()),state=s&&stations[stationIndex(s)];hud.hidden=!playing||!metroInterior(getPos());document.body.classList?.toggle('in-metro',!hud.hidden);
  const hall=state&&(scan?.s===state?'背包正在安检，请等 3 秒':!state.checked?'① 沿青色地面线到「背包安检」 · 机器旁 V 放包':!state.paid?'② 沿青色地面线到绿色箭头闸机 · V 刷票':'③ 闸机已开，对准箭头直行 · 沿地面线下扶梯去 B2');
  hud.textContent=ride?'2号线 · '+(trains[ride.index].state.phase==='travel'?'下一站 '+METRO_STATIONS[trains[ride.index].state.next].name:'本站 '+METRO_STATIONS[trains[ride.index].state.station].name)+' · '+(ride.seated?'已坐下':'站立')+' · F 坐 / 起 · V 到站下车':s?'2号线 '+s.name+' · '+(getPos().y>12?'B1站厅\n'+hall:'B2站台 · 开门后走入车厢 · V 辅助上车'):'2号线 · 自动扶梯';
 }
 function safeSavePoint(){if(!ride)return null;const t=trains[ride.index],s=METRO_STATIONS[t.state.phase==='dwell'?t.state.station:ride.from];return {x:s.x+3,y:6,z:s.z-3.5};}
 return {root,staff,stations,trains,tick,use,seat,collides,floorAt,tryBoard,suspend,end,isRiding:()=>!!ride,get ride(){return ride;},get clock(){return clock;},safeSavePoint,serialize:()=>({stations:stations.map(s=>({id:s.id,checked:s.checked,paid:s.paid}))}),restore(d){scan=null;ride=null;stations.forEach(s=>{const old=d?.stations?.find(a=>a.id===s.id);s.checked=!!old?.checked;s.paid=s.checked&&!!old?.paid;s.bag.visible=false;});}};
}






