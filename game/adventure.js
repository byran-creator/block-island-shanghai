import {drawQuestTarget} from './quest-guidance.js';
import * as THREE from './three.module.js';
import {SIZE,WORLD_MIN,WORLD_MAX,BLOCKS,LANDMARKS,COURSE,COURSES,courseById,WORLD_SHIFT,WATER_LEVEL,CRYSTALS,CITY,overlaps} from './world.js';
import {AdventureState} from './adventure-state.js';
import {BUND_BUILDINGS} from './bund.js';
import {ROADS,roadX} from './city-layout.js';
import {DRONE_CENTER,SHOW_VIEW} from './drone-show.js';
import {createPearlShow} from './pearl-show.js';
import {TRAVEL_POINTS,mapPosition,mapHit} from './map-travel.js';
const $=id=>document.getElementById(id);
export function createAdventure({scene,world,notify,beep,teleport,setFlying,getFlying,pause,resume,burst,setNight,lookAt=()=>{},onProgress=()=>{},fastTravel=teleport,getQuestTarget=()=>null}){
 const state=new AdventureState(),crystals=[],markers=[],show=createPearlShow(scene);
 const gemGeo=new THREE.OctahedronGeometry(.43),beamGeo=new THREE.CylinderGeometry(.1,.1,6,6);
 let currentPos={...LANDMARKS.bund},lastPaint=0,lastSpring=-10,fireworkTime=0,wasComplete=false,currentPrompt='',panel=null;
 const poster=document.createElement('canvas');poster.width=1024;poster.height=448;const pc=poster.getContext('2d');
 const posterTexture=new THREE.CanvasTexture(poster);posterTexture.colorSpace=THREE.SRGBColorSpace;
 const wall=new THREE.Mesh(new THREE.PlaneGeometry(9.7,4.25),new THREE.MeshBasicMaterial({map:posterTexture}));wall.position.set(92.5,12.65+WORLD_SHIFT,326.015);wall.userData.panel=true;scene.add(wall);
 function preset(name,context=pc){const w=context.canvas.width,h=context.canvas.height;context.fillStyle=name==='chatgpt'?'#102f2c':name==='nailong'?'#3c254f':'#122f55';context.fillRect(0,0,w,h);context.fillStyle=name==='nailong'?'#ffe472':'#baffb7';context.fillRect(w*.055,h*.12,w*.013,h*.74);context.textAlign='left';context.font=`bold ${w*.028}px sans-serif`;context.fillText('BLOCK ISLAND / 创意补给站',w*.1,h*.23);context.font=`bold ${w*.095}px sans-serif`;context.fillText(name==='chatgpt'?'ChatGPT':name==='nailong'?'奶龙出没！':'HELLO, SHANGHAI',w*.1,h*.49);context.font=`bold ${w*.031}px sans-serif`;context.fillText(name==='chatgpt'?'把想象，变成你的世界。':name==='nailong'?'今天也要开开心心。':'下一站，云端见。',w*.1,h*.7);context.font=`${w*.018}px sans-serif`;context.fillStyle='#ffffffb0';context.fillText('按 B 拿起喷漆 · 留下你的灵感',w*.1,h*.86);if(context===pc)posterTexture.needsUpdate=true;}
 preset('chatgpt');
 function sign(text,x,y,z,color='#d5fd87',scale=3.8){const c=document.createElement('canvas');c.width=512;c.height=112;const ctx=c.getContext('2d');ctx.fillStyle='#15303ddd';ctx.fillRect(0,0,512,112);ctx.textAlign='center';ctx.fillStyle=color;ctx.font='bold 35px sans-serif';ctx.fillText(text,256,69);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex}));s.position.set(x,y+WORLD_SHIFT,z);s.scale.set(scale,scale*112/512,1);scene.add(s);markers.push(s);return s;}
 sign('东方明珠 · V 乘观光电梯',126,13.3,53,'#ffb9db',5);sign('云端观景台 · V 返回地面',126,57.3,49,'#ffb9db',4);sign('涂鸦街 · B 开始创作',92,17,325,'#c4f77c',4.6);for(const c of COURSES)sign(c.name+' · V 选赛道',c.start.x,c.start.y+3-WORLD_SHIFT,c.start.z,'#a1e8ff',4.8);
 sign('弹跳广场 · 踩上去！',95,13.2,339,'#d5fd87',3.6);sign('森林观景台',63.5,16,339.5,'#d5fd87',3);
 for(const c of CRYSTALS){const group=new THREE.Group();group.position.set(c.x,c.y,c.z);const gem=new THREE.Mesh(gemGeo,new THREE.MeshBasicMaterial({color:c.id==='deck'?'#ff98cb':'#bdff75'}));group.add(gem);const ring=new THREE.Mesh(new THREE.TorusGeometry(.68,.035,5,24),new THREE.MeshBasicMaterial({color:'#ffffdc',transparent:true,opacity:.7}));ring.rotation.x=Math.PI/2;group.add(ring);scene.add(group);crystals.push({data:c,group,gem});}
 const minimap=$('minimap'),mc=minimap.getContext('2d'),mapBg=document.createElement('canvas');mapBg.width=SIZE;mapBg.height=SIZE;const bg=mapBg.getContext('2d');
 for(let x=WORLD_MIN;x<WORLD_MAX;x++)for(let z=WORLD_MIN;z<WORLD_MAX;z++){const y=world.ground(x,z),id=world.get(x,y-1,z);bg.fillStyle=y<WATER_LEVEL?'#236179':id===5?'#315b40':BLOCKS[id]?.color??'#46874e';bg.fillRect(x-WORLD_MIN,z-WORLD_MIN,1,1)}
 function drawMap(canvas,context,pos){const s=canvas.width/SIZE,m=v=>(v-WORLD_MIN)*s;context.imageSmoothingEnabled=false;context.drawImage(mapBg,0,0,canvas.width,canvas.height);context.lineWidth=Math.max(.8,s*3);context.strokeStyle='#4b6779';for(const road of ROADS){context.beginPath();road.samples.forEach((p,i)=>i?context.lineTo(m(p.x),m(p.z)):context.moveTo(m(p.x),m(p.z)));context.stroke();}context.strokeStyle='#e5b85a';context.lineWidth=Math.max(1,s*5);context.beginPath();context.moveTo(m(-188),m(66));context.lineTo(m(roadX(66)-4),m(66));context.stroke();for(const [key,l] of Object.entries(LANDMARKS)){if(['deck','skyGarden','skyDeck','jinmaoDeck','swfcDeck'].includes(key))continue;context.fillStyle=key==='tower'?'#ff76ae':'#ffffff';context.fillRect(m(l.x)-2,m(l.z)-2,4,4)}for(const b of BUND_BUILDINGS){context.fillStyle='#ffdc8d';context.fillRect(m(b.x)-2,m(b.z)-2,4,4);}for(const c of CRYSTALS)if(!state.collected.has(c.id)){context.fillStyle=c.requires&&!state.painted?'#798687':'#d8ff83';context.beginPath();context.arc(m(c.x),m(c.z),2.6,0,Math.PI*2);context.fill();}if(canvas.width>=400){context.font='bold 13px sans-serif';context.textAlign='center';context.lineWidth=3;context.strokeStyle='#15323d';context.fillStyle='#fff';for(const [text,x,z] of [['东方明珠',126,27],['金茂',191,78],['环球',225,86],['上海中心',189,120],['白玉兰',82,-66],['黄浦江',85,87],['外滩街区',-8,86],['南浦风格桥',238,211],['东北山岛',330,41],['翡翠林岛',330,234],['金沙岛',65,244],['远岛',350,369],['生活岛',75,321],['中心绿地',195,49],['生存营地',131,303]]){context.strokeText(text,m(x),m(z));context.fillText(text,m(x),m(z));}}if(canvas.width>=400){for(const p of TRAVEL_POINTS){const q=mapPosition(p,canvas.width);context.fillStyle='#72e5e5';context.strokeStyle='#102e3b';context.lineWidth=2;context.beginPath();context.arc(q.x,q.y,5,0,Math.PI*2);context.fill();context.stroke();}}drawQuestTarget(context,getQuestTarget(),canvas.width,WORLD_MIN,SIZE);context.fillStyle='#fff';context.strokeStyle='#112932';context.lineWidth=1.5;context.beginPath();context.arc(m(pos.x),m(pos.z),4,0,Math.PI*2);context.fill();context.stroke();}
 function hud(){
  $('quest-count').textContent=`${state.collected.size} / 5`;$('quest-fill').style.width=`${state.collected.size*20}%`;
  $('quest-title').textContent=state.completed?'明珠已经点亮！':'寻找 5 枚灵感晶体';
  $('quest-description').textContent=state.completed?'按 K，欣赏明珠烟花灯光秀。':!state.painted?'奶龙的委托：收集晶体，让明珠亮起来。':'涂鸦之光已出现，去探索森林、跑道和云端。';
  for(const c of CRYSTALS){const row=$('gem-'+c.id);row.textContent=`${state.collected.has(c.id)?'✓':'◇'} ${c.name}`;row.classList.toggle('done',state.collected.has(c.id));}
  $('race-status').classList.toggle('visible',!!state.race);const rc=courseById(state.race?.course);$('race-status').textContent=state.race?`${rc.name} ${state.race.time.toFixed(1)} s · 检查点 ${state.race.checkpoint+1} / ${rc.platforms.length} · V 退出`:'';
  $('show-status').textContent=show.active?'无人机 + 聚光灯 · '+show.drones.phase:'K 烟花 + 无人机 + 陆家嘴灯光秀';$('best-time').textContent=state.best===null?'尚未完成':`${state.best.toFixed(2)} 秒`;
  drawMap(minimap,mc,currentPos);if(panel==='map-dialog')drawMap($('large-map'),$('large-map').getContext('2d'),currentPos);
 }
 function near(p,r=3){return Math.hypot(currentPos.x-p.x,currentPos.z-p.z)<r&&Math.abs(currentPos.y-p.y)<3}
 function getPrompt(){if(state.race)return 'V 退出跑酷 · 空格跳跃 · 落下会回到检查点';if(near(LANDMARKS.deck))return 'V 乘电梯返回地面';if(near(LANDMARKS.tower,3.5))return 'V 乘观光电梯 · K 烟花灯光秀';if(COURSES.some(c=>near(c.start,4)))return 'V 选择赛道 · 转弯、窄台和高低跳跃';if(near(LANDMARKS.gallery,5))return 'B 在墙上涂鸦 · 解锁涂鸦之光';return '';}
 function cancelRace(){if(state.race){const flying=state.race.previousFlying;const start=courseById(state.race.course).start;state.race=null;teleport(start);setFlying(flying);hud();notify('已退出跑酷，可以继续自由探索。')}}
 function use(){if(state.race){cancelRace();return true;}if(near(LANDMARKS.deck)){teleport(LANDMARKS.tower);return true;}if(near(LANDMARKS.tower,3.5)){teleport(LANDMARKS.deck);state.towerVisited=true;onProgress();notify('欢迎来到云端观景台！沿着平台找一找晶体。');return true;}if(COURSES.some(c=>near(c.start,4))){open('race-dialog');return true;}notify('靠近塔下电梯或跑酷起点，再按 V。');return false;}
 function open(id){if(panel)return;pause();panel=id;$(id).showModal();if(id==='paint-dialog'){const dc=$('paint-canvas').getContext('2d');dc.drawImage(poster,0,0,1024,448);}hud();}
 function close(){if(!panel)return;$(panel).close();panel=null;resume();}
 function paint(){if(near(LANDMARKS.gallery,6))open('paint-dialog');else notify('先到涂鸦街的白墙旁，再按 B。地图上的粉色墙标记就是它。');}
 function map(){open('map-dialog');$('map-dialog').scrollTop=0;}
 function travel(p){if(state.race){notify('跑酷中不能传送；按 V 退出挑战后再使用。');return;}if(fastTravel(p)!==false){close();hud();notify('已传送到'+p.name);}}
 for(const p of TRAVEL_POINTS){const button=document.createElement('button');button.textContent=p.name;button.onclick=()=>travel(p);$('map-destinations').appendChild(button);}
 $('large-map').addEventListener('click',e=>{const canvas=$('large-map'),rect=canvas.getBoundingClientRect(),goal=getQuestTarget(),mx=(e.clientX-rect.left)/rect.width*canvas.width,mz=(e.clientY-rect.top)/rect.height*canvas.height;if(goal&&Math.hypot(mx-(goal.x-WORLD_MIN)/SIZE*canvas.width,mz-(goal.z-WORLD_MIN)/SIZE*canvas.height)<13){notify(goal.label+'：'+goal.instruction);return;}const p=mapHit((e.clientX-rect.left)/rect.width*canvas.width,(e.clientY-rect.top)/rect.height*canvas.height,canvas.width);if(p)travel(p);});
 for(const c of COURSES){const b=document.createElement('button');b.className='recipe-card';b.textContent=c.name+' · '+c.platforms.length+' 关 · '+c.description;b.onclick=()=>{close();state.startRace(getFlying(),c.id);setFlying(false);teleport(c.start);hud();notify(c.name+'开始！'+(c.sprint?'Shift 冲刺，':'')+'空格跳跃；落下回检查点。')};$('race-options').appendChild(b);}
 const paintCanvas=$('paint-canvas'),dc=paintCanvas.getContext('2d');let drawing=false,ink='#c4ff78',prev=null;dc.lineCap='round';dc.lineJoin='round';
 function paintPoint(e){const r=paintCanvas.getBoundingClientRect();return {x:(e.clientX-r.left)/r.width*1024,y:(e.clientY-r.top)/r.height*448}}
 paintCanvas.addEventListener('pointerdown',e=>{drawing=true;prev=paintPoint(e);paintCanvas.setPointerCapture(e.pointerId);dc.fillStyle=ink;dc.beginPath();dc.arc(prev.x,prev.y,Number($('brush-size').value)/2,0,Math.PI*2);dc.fill();});
 paintCanvas.addEventListener('pointermove',e=>{if(!drawing)return;const p=paintPoint(e);dc.strokeStyle=ink;dc.lineWidth=Number($('brush-size').value);dc.lineCap='round';dc.beginPath();dc.moveTo(prev.x,prev.y);dc.lineTo(p.x,p.y);dc.stroke();prev=p});for(const type of ['pointerup','pointercancel','lostpointercapture'])paintCanvas.addEventListener(type,()=>drawing=false);
 for(const b of document.querySelectorAll('[data-ink]'))b.onclick=()=>{ink=b.dataset.ink;document.querySelectorAll('[data-ink]').forEach(x=>x.classList.toggle('chosen',x===b))};
 for(const b of document.querySelectorAll('[data-preset]'))b.onclick=()=>preset(b.dataset.preset,dc);
 $('paint-clear').onclick=()=>{dc.fillStyle='#102f2c';dc.fillRect(0,0,1024,448)};
 $('paint-apply').onclick=()=>{pc.drawImage(paintCanvas,0,0);posterTexture.needsUpdate=true;state.painted=true;onProgress();beep(1);close();notify('涂鸦上墙！附近出现了一枚灵感晶体。');hud()};
 document.querySelectorAll('[data-close-panel]').forEach(b=>b.onclick=close);for(const id of ['paint-dialog','map-dialog','race-dialog'])$(id).addEventListener('cancel',e=>{e.preventDefault();close()});
 function launch(view=false){if(view){cancelRace();resume();teleport(SHOW_VIEW);setFlying(false);}setNight();show.start();lookAt({...DRONE_CENTER,y:94});state.showWatched=true;onProgress();notify('42 秒夜空秀：三点烟花齐射、无人机与楼群联动灯光。暂停菜单可直达观赏点，K 重播。');}
 function tick(dt,pos,time,night=false){show.tick(dt,night);currentPos=pos;for(const c of crystals){c.group.visible=state.available(c.data);c.group.position.y=c.data.y+Math.sin(time*2+c.data.x)*.18;c.gem.rotation.y=time;c.gem.rotation.z=time*.4;}
  for(const c of state.collectAt(pos)){burst({x:c.x,y:c.y,z:c.z},'#dbff8c',15);beep(1);onProgress();notify(`获得「${c.name}」 · ${state.collected.size} / 5`);hud()}
  if(state.completed&&!wasComplete){wasComplete=true;launch();}
  const race=state.stepRace(dt,pos);if(race?.type==='fall'){teleport(race.point);notify('回到检查点，继续挑战！计时仍在进行。');}if(race?.type==='finish'){setFlying(race.restoreFlight);onProgress();notify(`跑酷完成！${race.time.toFixed(2)} 秒 · 最佳 ${state.bestTimes[race.course].toFixed(2)} 秒`);burst({x:pos.x,y:pos.y+1,z:pos.z},'#9ff4ff',20)}
  if(near(LANDMARKS.spring,1.5)&&pos.y<10.25+WORLD_SHIFT&&time-lastSpring>1.2){lastSpring=time;return {bounce:15};}
  currentPrompt=getPrompt();$('world-prompt').textContent=currentPrompt;$('world-prompt').classList.toggle('visible',!!currentPrompt);
  lastPaint+=dt;if(lastPaint>.25){lastPaint=0;hud()}
  return null;
 }
 function restore(data){state.restore(data?.state);wasComplete=state.completed;if(typeof data?.poster==='string'&&data.poster.startsWith('data:image/png;base64,')&&data.poster.length<1500000){const img=new Image();img.onload=()=>{pc.drawImage(img,0,0,1024,448);posterTexture.needsUpdate=true};img.src=data.poster;}hud()}
 function serialize(){return {state:state.serialize(),poster:poster.toDataURL('image/png')}}
 $('show-button').onclick=()=>launch(true);hud();return {show,tick,use,paint,map,close,cancelRace,launch,state,serialize,restore,isShowActive:()=>show.active,isPanelOpen:()=>!!panel};
}
