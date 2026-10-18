import {createPhotoMode} from './photo-mode.js';
import {createNanjingBakedLight} from './nanjing-baked-light.js';
import {createShanghaiJourney} from './shanghai-journey.js';
import {createSceneInstances} from './scene-instancing.js';
import {createWorldBaseline} from './world-baseline.js';
import {runPlayerInteraction} from './interaction-routing.js';
import {blocksMetroClearance} from './metro-clearance.js';
import {createPlayerHandbook} from './player-handbook.js';
import {createSettingsPanel} from './settings-panel.js';
import {createChunkMesher,createChunkQueue} from './chunk-work.js';
import {createQuestJournal} from './quest-journal.js';
import {mountVoiceSettings} from './voice-settings.js';
import * as THREE from './three.module.js';
import {snapMetroFloor} from './metro-floor.js';
import {createYuyuan} from './yuyuan.js';
import {createRiverWaterGeometry} from './yuyuan-water.js';
import {GARDEN_PONDS,YUYUAN_SHIFT} from './yuyuan-layout.js';
import {createMetroNetwork as createMetro} from './metro-network.js';
import {boatSurfaces,boatSupport,boatSolid,boatWorld} from './boat-support.js';
import {createPrivateSuites} from './private-suites.js';
import {createBuildingResidents} from './building-residents.js';
import {loadWorld,clearWorldCache} from './world-cache.js';
import {metroInterior,metroRampFloor} from './metro-layout.js';
import {CanvasRenderer} from './canvas-renderer.js';
import {createCompanions} from './companions.js';
import {createAdventure} from './adventure.js';
import {createCloudSaves} from './cloud-saves.js';
import {createMusic} from './music.js';
import {createSceneAudio,soundScene} from './scene-audio.js';
import {trafficContact} from './traffic-contact.js';
import {createSkyline} from './skyline.js';
import {createCityActivity} from './city-activity.js';
import {createCityMedia} from './city-media.js';
import {createCommute} from './commute.js';
import {createNpcGuides} from './npc-guides.js';
import {safeLanding} from './map-travel.js';
import {createLujiazuiShow} from './lujiazui-show.js';
import {nanpuDeckCell,nanpuFloor} from './bridge-road.js';
import {createPeaceRestaurant} from './peace-restaurant.js';
import {createLife} from './life.js';
import {BUND_BUILDINGS,ALL_BUILDINGS,createBund} from './bund.js';
import {createClouds} from './clouds.js';
import {createWeather} from './weather.js';
import {clockLabel,clockMinutes,phaseFromMinutes,clockOptions,advanceDay} from './day-time.js';
import {migrateWestBankSave} from './city-migration.js';
import {CITY,PEARL,MAP_REVISION,riverCenter,riverWestEdge,riverEastEdge} from './shanghai-map.js';
import {swimVelocity,isSwimming,movementSpeed} from './survival-state.js';
import {VoxelWorld,SIZE,WORLD_MIN,WORLD_MAX,HEIGHT,CHUNK,BLOCKS,overlaps,trace,LANDMARKS,COURSE,courseById,WORLD_SHIFT,WATER_LEVEL} from './world.js';
const $=id=>document.getElementById(id),canvas=$('world');canvas.tabIndex=0;
document.body.classList.add('in-menu');
let touch=('ontouchstart' in window)||(navigator.maxTouchPoints>0)||matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
function updateOrientationUI(){
 const isForced=document.body.classList.contains('force-landscape');
 const portrait=!isForced&&(window.innerHeight>window.innerWidth);
 const tip=$('orientation-tip');
 if(tip)tip.hidden=!touch||!portrait||tip.dataset.dismissed==='true';
 const fsBtn=$('mobile-fullscreen');
 if(fsBtn){
  fsBtn.hidden=!touch;
  fsBtn.textContent=isForced?'📱 竖屏':'📱 横屏';
  fsBtn.title=isForced?'切回竖屏模式':'切换横屏模式';
 }
 const menuFs=$('mobile-menu-fullscreen');
 if(menuFs)menuFs.textContent=isForced?'📱 切回竖屏模式':'📱 切换横屏模式';
}
function setForceLandscape(enable){
 document.body.classList.toggle('force-landscape',Boolean(enable));
 onResize();
}
function toggleForceLandscape(){
 setForceLandscape(!document.body.classList.contains('force-landscape'));
}
async function toggleLandscapeFullscreen(){
 try{
  const docEl=document.documentElement;
  if(!document.fullscreenElement&&!document.webkitFullscreenElement){
   if(docEl.requestFullscreen)await docEl.requestFullscreen().catch(()=>{});
   else if(docEl.webkitRequestFullscreen)await docEl.webkitRequestFullscreen().catch(()=>{});
  }
  if(screen.orientation?.lock){
   await screen.orientation.lock('landscape').catch(()=>{});
  }
 }catch(err){
  console.warn('Fullscreen/landscape lock failed or not supported:',err);
 }
 if(window.innerHeight>window.innerWidth){
  toggleForceLandscape();
 }else{
  document.body.classList.remove('force-landscape');
 }
 onResize();
}
$('tip-fullscreen-btn')?.addEventListener('click',()=>{
 toggleLandscapeFullscreen();
 const tip=$('orientation-tip');
 if(tip){tip.hidden=true;tip.dataset.dismissed='true';}
});
$('tip-dismiss-btn')?.addEventListener('click',()=>{
 const tip=$('orientation-tip');
 if(tip){tip.hidden=true;tip.dataset.dismissed='true';}
});
$('mobile-fullscreen')?.addEventListener('click',toggleLandscapeFullscreen);
$('mobile-menu-fullscreen')?.addEventListener('click',toggleLandscapeFullscreen);
function enableTouch(){
 touch=true;
 document.body.classList.add('touch');
 if($('run-status'))$('run-status').hidden=true;
 if($('device-note'))$('device-note').textContent='左侧 WASD 方向移动 · 右侧滑动环顾视角';
 updateOrientationUI();
}
if(touch)enableTouch();
window.addEventListener('touchstart',enableTouch,{once:true,passive:true});
const isWeChat=typeof navigator!=='undefined'&&/MicroMessenger/i.test(navigator.userAgent);
const isMobile=Boolean(touch||(typeof navigator!=='undefined'&&/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)));
let renderer;
try{
 renderer=new THREE.WebGLRenderer({
  canvas,
  antialias:true,
  powerPreference:'high-performance',
  logarithmicDepthBuffer:true,
  precision:'highp'
 });
}catch(e){
 renderer=new CanvasRenderer({canvas});
 $('render-mode').textContent='兼容画质 · 无需显卡加速';
}
renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
if(isMobile&&$('render-mode'))$('render-mode').textContent=isWeChat?'微信触控模式':'移动端触控模式';
let streetBounce=null,photo=null;
const scene=new THREE.Scene();scene.background=new THREE.Color('#a0d6ed');scene.fog=new THREE.Fog('#a0d6ed',isMobile?36:48,isMobile?150:190);
const camera=new THREE.PerspectiveCamera(72,innerWidth/innerHeight,0.35,270);camera.rotation.order='YXZ';
const ambient=new THREE.HemisphereLight('#fff9dd','#6d9277',1.6);scene.add(ambient);
const sun=new THREE.DirectionalLight('#fff0c7',1.5);sun.position.set(-20,65,30);scene.add(sun);
const world=await loadWorld(message=>{$('play').textContent=message;}),initialWorld=createWorldBaseline(world.data),savedEdits=new Map();let adventure,saves,life,skyline,civil,weather,restaurant,activity,commute,npcGuides,metro,quests,handbook,yuyuan,story;let runLocked=false,isScrubbingTime=false;
const atlasCanvas=document.createElement('canvas');atlasCanvas.width=16*14;atlasCanvas.height=16;const ctx=atlasCanvas.getContext('2d');
const tiles=['#77ad42','#956a45','#939e9c','#88603d','#498548','#e5d59b','#c29b61','#b76950','#956a45','#bb9259','#deded5','#db6594','#61c9df','#c4f77c'];
for(let tile=0;tile<14;tile++){
 ctx.fillStyle=tiles[tile];ctx.fillRect(tile*16,0,16,16);
 let seed=tile*27+13;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296};
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){const r=rand();ctx.fillStyle=r>.5?`rgba(255,255,225,${r*.14})`:`rgba(20,35,20,${r*.24})`;ctx.fillRect(tile*16+x,y,1,1);}
 if(tile===8){ctx.fillStyle='#6fa444';ctx.fillRect(tile*16,0,16,3);for(let x=0;x<16;x+=2)ctx.fillRect(tile*16+x,3,2,1+Math.floor(rand()*3));}
 if(tile===3){ctx.fillStyle='#4e3b2870';for(let x=2;x<16;x+=4)ctx.fillRect(tile*16+x,0,1,16);}
 if(tile===6){ctx.fillStyle='#7a5b3966';for(let y=3;y<16;y+=4)ctx.fillRect(tile*16,y,16,1);ctx.fillRect(tile*16+5,4,1,4);ctx.fillRect(tile*16+11,12,1,4);}
 if(tile===7){ctx.fillStyle='#e5c5a1';for(let y=3;y<16;y+=4){ctx.fillRect(tile*16,y,16,1);for(let x=((y-3)%8===0?3:7);x<16;x+=8)ctx.fillRect(tile*16+x,y-3,1,3);}}
 if(tile===5){ctx.fillStyle='rgba(130,105,65,0.22)';ctx.fillRect(tile*16,0,16,1);ctx.fillRect(tile*16,8,16,1);ctx.fillRect(tile*16+7,0,1,8);ctx.fillRect(tile*16+15,8,1,8);}
 if(tile===10){ctx.fillStyle='rgba(65,55,45,0.25)';ctx.fillRect(tile*16,0,16,1);ctx.fillRect(tile*16,8,16,1);ctx.fillRect(tile*16+7,0,1,8);ctx.fillRect(tile*16+15,8,1,8);}
 if(tile===12){ctx.fillStyle='#effaff';ctx.fillRect(tile*16+2,2,2,7);ctx.fillRect(tile*16+4,2,6,1);}
 if(tile===13){ctx.fillStyle='#eaffd6';ctx.fillRect(tile*16+5,5,6,6);}
 if(tile===9){ctx.strokeStyle='#69492d';for(let n=2;n<8;n+=2)ctx.strokeRect(tile*16+n,n,16-n*2,16-n*2);}
}
const atlas=new THREE.CanvasTexture(atlasCanvas);atlas.magFilter=THREE.NearestFilter;atlas.minFilter=THREE.NearestFilter;atlas.colorSpace=THREE.SRGBColorSpace;
const terrainMaterial=new THREE.MeshLambertMaterial({map:atlas,vertexColors:true});
const chunks=new Map();
function chunkTask(key){const [cx,cz]=key.split(',').map(Number);return createChunkMesher({world,cx,cz,chunk:CHUNK,height:HEIGHT,skip:(x,y,z,id)=>id===9&&nanpuDeckCell(x,y,z)});}
const chunkWork=createChunkQueue({has:key=>chunks.has(key),create:chunkTask,commit:(key,data)=>installChunk(key,data)});
function rebuild(cx,cz){
 if(cx<WORLD_MIN/CHUNK||cz<WORLD_MIN/CHUNK||cx>=WORLD_MAX/CHUNK||cz>=WORLD_MAX/CHUNK)return;
 const key=cx+','+cz;chunkWork.cancel(key);const task=chunkTask(key);while(!task.step(256)){}installChunk(key,task.data);
}
function installChunk(key,{p,norm,uv,col,indices}){
 const [cx,cz]=key.split(',').map(Number),old=chunks.get(key);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));geo.setAttribute('normal',new THREE.BufferAttribute(norm,3));geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.setIndex(new THREE.BufferAttribute(indices,1));geo.computeBoundingSphere();
 const mesh=new THREE.Mesh(geo,terrainMaterial);streetBounce?.bakeMesh(mesh);mesh.userData.range=(cz*CHUNK>=-160&&cz*CHUNK<=242)||Object.values(CITY).some(p=>Math.abs((cx+.5)*CHUNK-p.x)<28&&Math.abs((cz+.5)*CHUNK-p.z)<28)||ALL_BUILDINGS.some(b=>Math.abs((cx+.5)*CHUNK-b.x)<24&&Math.abs((cz+.5)*CHUNK-b.z)<24)?280:130;if(old){scene.remove(old);old.geometry.dispose();}scene.add(mesh);chunks.set(key,mesh);
}
function retainChunk(key,point,cx,cz,nearbyBuildings){const [x,z]=key.split(',').map(Number);const maxRetain=isMobile?4:6;if(Math.abs(x-cx)<=maxRetain&&Math.abs(z-cz)<=maxRetain)return true;if(!isMobile&&x>=7&&x<=18&&z>=1&&z<=14)return true;const chunkX=(x+.5)*CHUNK,chunkZ=(z+.5)*CHUNK;const buildings=nearbyBuildings||ALL_BUILDINGS;if(buildings.some(b=>Math.abs(chunkX-b.x)<24&&Math.abs(chunkZ-b.z)<24&&(!nearbyBuildings||Math.hypot(point.x-b.x,point.z-b.z)<(isMobile?220:315))))return true;if(Object.values(CITY).some(p=>Math.abs(chunkX-p.x)<28&&Math.abs(chunkZ-p.z)<28&&Math.hypot(point.x-p.x,point.z-p.z)<(isMobile?260:380)))return true;return false;}
function ensureChunks(point,force=false,immediate=false){const cx=Math.floor(point.x/CHUNK),cz=Math.floor(point.z/CHUNK),needed=new Set();const lookRadius=isMobile?4:5,maxDist=isMobile?240:360;for(let x=cx-lookRadius;x<=cx+lookRadius;x++)for(let z=cz-lookRadius;z<=cz+lookRadius;z++)if(x>=WORLD_MIN/CHUNK&&z>=WORLD_MIN/CHUNK&&x<WORLD_MAX/CHUNK&&z<WORLD_MAX/CHUNK)needed.add(x+','+z);for(const p of Object.values(CITY))if(Math.hypot(point.x-p.x,point.z-p.z)<maxDist)for(let x=Math.floor((p.x-14)/CHUNK);x<=Math.floor((p.x+14)/CHUNK);x++)for(let z=Math.floor((p.z-14)/CHUNK);z<=Math.floor((p.z+14)/CHUNK);z++)needed.add(x+','+z);if(Math.hypot(point.x-LANDMARKS.tower.x,point.z-42)<(isMobile?240:340))for(let x=7;x<=8;x++)for(let z=1;z<=4;z++)needed.add(x+','+z);for(const b of ALL_BUILDINGS)if(Math.hypot(point.x-b.x,point.z-b.z)<maxDist)for(let x=Math.floor((b.x-9)/CHUNK);x<=Math.floor((b.x+9)/CHUNK);x++)for(let z=Math.floor((b.z-8)/CHUNK);z<=Math.floor((b.z+8)/CHUNK);z++)needed.add(x+','+z);for(let z=-144;z<=240;z+=16)for(const x of [riverWestEdge(z)-12,riverEastEdge(z)+12])if(Math.hypot(point.x-x,point.z-z)<maxDist){const sx=Math.floor(x/CHUNK),sz=Math.floor(z/CHUNK);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(sx+dx>=WORLD_MIN/CHUNK&&sx+dx<WORLD_MAX/CHUNK&&sz+dz>=WORLD_MIN/CHUNK&&sz+dz<WORLD_MAX/CHUNK)needed.add((sx+dx)+','+(sz+dz));}const nearbyBuildings=ALL_BUILDINGS.filter(b=>Math.hypot(point.x-b.x,point.z-b.z)<(isMobile?260:380));for(const [key,mesh] of chunks)if(!needed.has(key)&&!retainChunk(key,point,cx,cz,nearbyBuildings)){scene.remove(mesh);mesh.geometry.dispose();chunks.delete(key);}chunkWork.setDesired(needed,point,CHUNK,force);const isSkylineChunk=(x,z)=>(x>=7&&x<=18&&z>=1&&z<=14)||Object.values(CITY).some(p=>Math.abs((x+.5)*CHUNK-p.x)<=24&&Math.abs((z+.5)*CHUNK-p.z)<=24)||(x>=7&&x<=8&&z>=1&&z<=4);if(immediate)for(const key of needed)if(force||!chunks.has(key)){const [x,z]=key.split(',').map(Number);const maxImmediate=isMobile?1:3;if(!force&&(Math.abs(x-cx)>maxImmediate||Math.abs(z-cz)>maxImmediate)&&(isMobile||!isSkylineChunk(x,z)))continue;rebuild(x,z);}}

await Promise.race([new Promise(requestAnimationFrame),new Promise(r=>setTimeout(r,60))]);
if($('play'))$('play').textContent='正在加载地貌与建筑…';
ensureChunks(LANDMARKS.bund,false,true);
function updateBlock(x,y,z,id){world.set(x,y,z,id);savedEdits.set(`${x},${y},${z}`,id);const affected=new Set([[x,z],[x-1,z],[x+1,z],[x,z-1],[x,z+1]].map(([a,b])=>Math.floor(a/CHUNK)+','+Math.floor(b/CHUNK)));for(const key of affected){chunkWork.invalidate(key);if(chunks.has(key))rebuild(...key.split(',').map(Number));}}
const water=new THREE.Mesh(createRiverWaterGeometry({size:SIZE*1.4,centerX:(WORLD_MIN+WORLD_MAX)/2,centerZ:(WORLD_MIN+WORLD_MAX)/2,ponds:GARDEN_PONDS,shift:YUYUAN_SHIFT}),new THREE.MeshPhongMaterial({color:'#3daabe',transparent:true,opacity:.67,shininess:90,depthWrite:false,side:THREE.DoubleSide}));water.rotation.x=-Math.PI/2;water.position.set((WORLD_MIN+WORLD_MAX)/2,WATER_LEVEL,(WORLD_MIN+WORLD_MAX)/2);scene.add(water);scene.userData.water=water;
const {clouds,cloudMat,bellyMat}=createClouds(camera);clouds.visible=!renderer.isSoftware;scene.add(clouds);
const sunBlock=new THREE.Mesh(new THREE.SphereGeometry(7,32,20),new THREE.MeshBasicMaterial({color:'#fff8ce'}));sunBlock.position.set(-12,43,-20);scene.add(sunBlock);
const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.008,1.008,1.008)),new THREE.LineBasicMaterial({color:'#172e33',transparent:true,opacity:.8}));scene.add(outline);outline.visible=false;
let pendingMine=null,gliding=false;
let selected=1,active=false,started=false,flying=false,grounded=false,vy=0,yaw=0,pitch=0,sound=true,audioCtx=null,target=null,mined=0,placed=0;
let dragMode=false,fallback=false,dragging=false,lookPointer=null,lastLook=null,mouseHeld=-1,lastAction=0,toastTimer;
const pos={...LANDMARKS.bund},keys=new Set(),direction=new THREE.Vector3(),pressedAt=new Map(),releaseAt=new Map();
civil=createBund({scene,world,getPos:()=>pos,getObstacles:()=>[...(commute?.vehicles??[]),...(npcGuides?.actors.filter(a=>a.person)??[]),...(activity?.bundWalkers?.map(b=>({root:b.root,person:true}))??[])],notify,place:p=>{Object.assign(pos,p);vy=0;},setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;}});weather=createWeather({scene,camera,world,sunBlock,clouds,cloudMat,bellyMat,water,terrainMaterial});
let timeOptions=clockOptions(),lastClockLabel='';
let dayClock=36,lastSky=-1,talkDone=false,followDone=false,celebrated=false;
const cityMedia=createCityMedia({scene});
const companions=createCompanions(scene,world,notify,()=>{talkDone=true;updateTasks();beep(1)});
function updateTasks(){if(talkDone)quests?.record({type:'hello'});quests?.setBuildCount(placed);}
function interact(follow=false){runPlayerInteraction({life,companions,pos,camera,follow,notify,onFollow:()=>{followDone=true;updateTasks();}})}
function updateSky(dt){dayClock=advanceDay(dayClock,dt,timeOptions);streetBounce?.setNight(dayClock>=120);const label=clockLabel(dayClock);if(label!==lastClockLabel){$('clock-quick').textContent=label+' · 调整时间';lastClockLabel=label;}const phase=dayClock/240,alt=Math.sin(phase*Math.PI*2),day=Math.max(0,alt);sun.intensity=.15+day*1.7;ambient.intensity=.48+day*1.2;sun.position.set(40+Math.cos(phase*Math.PI*2)*50,10+alt*65,30);sunBlock.position.copy(sun.position);scene.userData.softwareLight=.38+day*.62;const sky=new THREE.Color('#14233f').lerp(new THREE.Color('#9fd4e8'),Math.max(.08,day));if(alt>0&&alt<.3)sky.lerp(new THREE.Color('#eaae8c'),.3);const underground=metroInterior(pos)&&started;const underwater=!underground&&camera.position.y<WATER_LEVEL&&active;scene.fog.near=underwater?0:48;scene.fog.far=underwater?(life?.state.equipped?55:20):(isMobile?150:250);scene.fog.color.copy(underwater?new THREE.Color('#3296a7'):sky);if(underground){scene.fog.near=8;scene.fog.far=105;scene.fog.color.set('#202c36');}water.visible=!underground;scene.background.copy(scene.fog.color);const segment=Math.floor(dayClock/60);if(segment!==lastSky){const skyTxt=['晴朗 · 上午','暖阳 · 午后','宁静 · 夜晚','夜色 · 深夜'][segment];$('daytime').textContent=skyTxt;const sDay=$('settings-daytime');if(sDay)sDay.textContent=skyTxt;lastSky=segment;}}

function notify(msg){$('toast').textContent=msg;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2400)}
function getAudio(){
 audioCtx??=new (window.AudioContext||window.webkitAudioContext)();
 if(audioCtx.state==='suspended'){
  try{audioCtx.resume();}catch(_){}
 }
 return audioCtx;
}
function uiClick(){
 if(!sound)return;
 try{
  const ctx=getAudio();
  if(!ctx)return;
  if(ctx.state==='suspended')ctx.resume();
  const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime;
  osc.type='sine';
  osc.frequency.setValueAtTime(760,t);
  osc.frequency.exponentialRampToValueAtTime(360,t+0.04);
  gain.gain.setValueAtTime(.07,t);
  gain.gain.exponentialRampToValueAtTime(.001,t+0.04);
  osc.connect(gain);gain.connect(ctx.destination);
  osc.start(t);osc.stop(t+0.042);
 }catch(_){}
}
const music=createMusic(getAudio);
const sceneAudio=createSceneAudio(getAudio);
let trafficHitUntil=0;
const trafficFlash=document.createElement('div');trafficFlash.className='traffic-hit';document.body.appendChild(trafficFlash);
let residents,privateSuites,vesselSurfaces=[];
function refreshMusic(){for(const id of ['music-toggle','music-quick']){$(id).setAttribute('aria-pressed',String(music.enabled));$(id).title=music.enabled?'关闭背景音乐':'开启背景音乐'}$('music-toggle').textContent='音乐：'+(music.enabled?'开':'关');$('music-quick').textContent=music.enabled?'♫':'♩';$('music-volume').value=Math.round(music.volume*100);$('music-percent').textContent=Math.round(music.volume*100)+'%';$('music-choice').value=music.track.id;$('music-quick').title='下一首：当前 '+music.track.name;}
$('music-toggle').onclick=()=>{music.setEnabled(!music.enabled);refreshMusic()};$('music-quick').onclick=()=>{music.nextTrack();refreshMusic();notify('BGM：'+music.track.name)};$('music-choice').value=music.track.id;$('music-choice').addEventListener('change',e=>{music.setTrack(e.target.value);refreshMusic()});$('music-volume').addEventListener('input',e=>{music.setVolume(Number(e.target.value)/100);refreshMusic()});refreshMusic();
function refreshSceneAudio(){$('music-auto').textContent='区域配乐：'+(music.automatic?'开':'关');$('music-auto').setAttribute('aria-pressed',String(music.automatic));$('ambient-toggle').textContent='环境音：'+(sceneAudio.enabled?'开':'关');$('ambient-toggle').setAttribute('aria-pressed',String(sceneAudio.enabled));}
$('music-auto').onclick=()=>{music.setAutomatic(!music.automatic);refreshSceneAudio();};$('ambient-toggle').onclick=()=>{sceneAudio.setEnabled(!sceneAudio.enabled);refreshSceneAudio();};$('music-choice').addEventListener('change',refreshSceneAudio);$('music-quick').addEventListener('click',refreshSceneAudio);refreshSceneAudio();
function beep(kind){if(!sound)return;try{audioCtx??=new (window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(kind?320:170,audioCtx.currentTime);osc.frequency.exponentialRampToValueAtTime(kind?130:60,audioCtx.currentTime+.09);gain.gain.setValueAtTime(.07,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.1);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.1)}catch{}}
for(let id=1;id<BLOCKS.length;id++){
 const button=document.createElement('button');button.className='slot'+(id===1?' active':'');button.title=`${id<=9?id:id===10?'0':id===11?'-':'='} · ${BLOCKS[id].name}`;button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',id===1?'true':'false');
 const thumb=document.createElement('canvas');thumb.width=16;thumb.height=16;thumb.getContext('2d').drawImage(atlasCanvas,(id>=9?id+1:id-1)*16,0,16,16,0,0,16,16);
 button.innerHTML=`<span class="num">${id<=9?id:id===10?'0':id===11?'-':'='}</span><img src="${thumb.toDataURL()}" alt=""><span class="infinity">∞</span>`;button.onclick=()=>select(id);$('hotbar').appendChild(button);
}
function select(id,clearHeld=true){uiClick();if(clearHeld)life?.clearHeld();selected=id;$('selected-name').textContent=BLOCKS[id].name;[...$('hotbar').children].forEach((e,i)=>{e.classList.toggle('active',i===id-1);e.setAttribute('aria-pressed',i===id-1?'true':'false')});}
function respawn(){adventure?.cancelRace();const home=life?.home();if(home&&!collides(home.x,home.y,home.z))teleport(home);else teleport(LANDMARKS.village);vy=0;yaw=0;pitch=-.08;notify(home?'已回到床旁':'已回到出生点');}
function toggleFly(){if(metro?.seat())return;if(commute?.isRiding()){notify('先按 V 离开载具，再切换飞行。');return;}if(life?.state.survival){notify('生存模式无法飞行；可以在暂停菜单切回创造模式。');return;}if(adventure?.state.race){notify('跑酷中暂时不能飞行，按 V 退出挑战。');return;}setFlight(!flying);notify(flying?'飞行模式开启 · 双击跳跃或点“降落”结束飞行':'飞行已关闭');}
function openMenu(){story?.suspend();refreshTimeControls();sceneAudio.suspend();metro?.suspend();if(active)saves?.save('auto');pendingMine=null;active=false;keys.clear();pressedAt.clear();releaseAt.clear();mouseHeld=-1;dragging=false;$('menu').classList.remove('hidden');document.body.classList.add('in-menu');$('menu-title').innerHTML=started?'歇一会儿。<br><em>世界在等你。</em>':'你的世界。<br><em>由你搭建。</em>';$('menu-description').innerHTML=started?`已挖掘 ${mined} 块 · 已放置 ${placed} 块<br>你的下一座建筑，会是什么？`:'初到上海，从一张明信片开始。<br>逛南京路，过江看陆家嘴，再到豫园喝一杯茶。';$('play').innerHTML=(started?'继续探索':'开启上海之旅')+'';$('play').focus();}
function recordCityEvent(e){quests?.record(e);story?.record(e);}
function enter(){active=true;if(!started){teleport(LANDMARKS.bund);lookTowards({x:201,y:76,z:88});started=true;}document.body.classList.remove('in-menu');$('menu').classList.add('hidden');beep(1);music.start();sceneAudio.start();if(story?.maybeStart())return;canvas.focus();if(!touch&&!dragMode){try{const result=canvas.requestPointerLock?.();if(result?.catch)result.catch(()=>{fallback=true;notify('按住鼠标拖动环顾 · Q 挖掘，E 放置');});if(!canvas.requestPointerLock){fallback=true;notify('按住鼠标拖动环顾 · Q 挖掘，E 放置');}}catch{fallback=true;notify('按住鼠标拖动环顾 · Q 挖掘，E 放置');}}}
$('play').onclick=async()=>{try{const ctx=getAudio();if(ctx&&ctx.state==='suspended')ctx.resume();music.start();sceneAudio.start();}catch(_){}if(started){enter();return;}$('play').disabled=true;$('play').textContent='正在找回你的小岛…';try{let restored=false;try{restored=await (saves?.continueLatest?.()??Promise.resolve(false));}catch(error){notify(error.message||'存档读取失败，请稍后重试。');return;}if(!restored&&!started)enter();}finally{$('play').disabled=false;$('play').textContent=started?'继续探索':'重试读取存档';}};$('pause').onclick=()=>{document.exitPointerLock?.();openMenu()};$('respawn').onclick=()=>{respawn();enter()};$('sound').onclick=()=>{sound=!sound;music.setSound(sound);if(!sound){story?.suspend();sceneAudio.suspend();metro?.suspend();}$('sound').textContent='声音：'+(sound?'开':'关');$('sound').setAttribute('aria-pressed',String(sound))};
let cursorFree=false,settingsPanel;
function isAnyDialogOpen(){return Boolean($('settings-dialog')?.open||$('tasks-dialog')?.open||quests?.isPanelOpen?.()||npcGuides?.isPanelOpen?.()||activity?.isPanelOpen?.()||restaurant?.isPanelOpen?.()||skyline?.isPanelOpen?.()||life?.isPanelOpen?.()||adventure?.isPanelOpen?.()||document.querySelector?.('dialog[open]'));}
function setFreeCursor(free){
 cursorFree=Boolean(free);
 const pill=$('cursor-toggle');
 if(pill){
  pill.classList.toggle('active',cursorFree);
  pill.textContent=cursorFree?'Alt 光标已释放':'Alt 鼠标';
  pill.title=cursorFree?'当前已释放鼠标光标，可自由点击按钮。点击画面或按 Alt 锁定视角':'按 Alt 键或点击此处释放光标，可自由点击HUD控件';
 }
 document.body.classList.toggle('cursor-free',cursorFree);
 if(cursorFree){
  document.exitPointerLock?.();
 }else if(active&&!touch&&!dragMode){
  try{const result=canvas.requestPointerLock?.();result?.catch?.(()=>{fallback=true;});}catch{fallback=true;}
 }
}
function toggleFreeCursor(){setFreeCursor(!cursorFree);}
$('cursor-toggle')?.addEventListener('click',toggleFreeCursor);
document.addEventListener('pointerlockchange',()=>{
 if(document.pointerLockElement===canvas){
  fallback=false;
  cursorFree=false;
  const pill=$('cursor-toggle');if(pill){pill.classList.remove('active');pill.textContent='Alt 鼠标';}
  document.body.classList.remove('cursor-free');
 }else if(active&&!touch&&!fallback&&!cursorFree&&!isAnyDialogOpen()){
  openMenu();
 }
});
document.addEventListener('pointerlockerror',()=>{fallback=true;if(active)notify('按住鼠标拖动环顾 · Q 挖掘，E 放置')});
function look(dx,dy){yaw-=dx*.0023;pitch=Math.max(-1.52,Math.min(1.52,pitch-dy*.0023));}
document.addEventListener('mousemove',e=>{if(cursorFree)return;if(active&&(document.pointerLockElement===canvas||dragging))look(e.movementX,e.movementY)});
function edit(place){
 if(!active)return;if(metro?.isRiding()){notify('先到站下车，再拆建方块。');return;}if(commute?.isRiding()){notify('先下车，再拆建方块。');return;}if(yuyuan?.isRiding()){notify('先下黄包车，再拆建方块。');return;}if(adventure?.state.race){notify('跑酷中不能拆建；按 V 退出后恢复创造模式。');return;}camera.updateMatrixWorld();camera.getWorldDirection(direction);target=trace(world,camera.position,direction);if(!place&&life?.attack()){pendingMine=null;lastAction=performance.now();return;}if(place&&life?.state.held){life.place(target?.place);return;}if(!target)return;
 if(place){const p=target.place;if(!p||p.y<1||!world.valid(p.x,p.y,p.z)){notify('这里已经是世界边界');return;}
  if(blocksMetroClearance(p.x,p.y,p.z,selected,initialWorld.get(world.index(p.x,p.y,p.z)))){notify('地铁通道和站牌周围需要保持畅通，请在其他区域搭建。');return;}
  if(p.x+1>pos.x-.3&&p.x<pos.x+.3&&p.y+1>pos.y&&p.y<pos.y+1.76&&p.z+1>pos.z-.3&&p.z<pos.z+.3)return;
  if(world.protected(p.x,p.y,p.z)&&life?.state.survival){notify('生存模式下地标受到保护；可在菜单切换创造模式自由搭建。');return;}if(life?.occupied(p)){notify('这里有家具，Q 可以先回收家具。');return;}if(companions.occupied(p)){notify('这里是奶龙站的位置，换一格吧');return;}if(life?.state.survival&&!life.state.consume(selected)){notify('这个方块用完了，先挖掘收集，或 C 制作木板。');return;}updateBlock(p.x,p.y,p.z,selected);life.refresh();placed++;updateTasks();beep(1);
 }else{if(target.y<1)return;if(blocksMetroClearance(target.x,target.y,target.z,0,initialWorld.get(world.index(target.x,target.y,target.z)))){notify('地铁结构由系统统一维护，请在其他区域挖掘。');lastAction=performance.now();return;}if(world.protected(target.x,target.y,target.z)&&life?.state.survival){notify('生存模式下地标受到保护；可在菜单切换创造模式自由挖掘。');lastAction=performance.now();return;}const key=target.x+','+target.y+','+target.z;if(pendingMine?.key===key)return;const duration=life?.state.survival?life.state.miningTime(target.id):0;if(duration){pendingMine={...target,key,progress:0,duration};}else breakBlock(target);}

 lastAction=performance.now();
}
function breakBlock(hit){if(world.get(hit.x,hit.y,hit.z)!==hit.id)return;companions.burst({x:hit.x+.5,y:hit.y+.5,z:hit.z+.5},BLOCKS[hit.id].color,7);updateBlock(hit.x,hit.y,hit.z,0);life.state.add(hit.id);if(!life.state.useTool())notify('镐子用坏了，C 可以制作一把新的。');life.refresh();mined++;life.recordMine(hit.id);beep(0);lastAction=performance.now();}
function tickMining(dt){if(pendingMine){const key=target?target.x+','+target.y+','+target.z:null;if(key!==pendingMine.key||world.get(pendingMine.x,pendingMine.y,pendingMine.z)!==pendingMine.id)pendingMine=null;else{pendingMine.progress+=dt;if(pendingMine.progress>=pendingMine.duration){breakBlock(pendingMine);pendingMine=null;}}}$('mining-progress').hidden=!pendingMine;if(pendingMine){$('mining-fill').style.width=Math.min(100,pendingMine.progress/pendingMine.duration*100)+'%';$('mining-label').textContent='采集 '+BLOCKS[pendingMine.id].name;}}
function toggleGlider(){if(metro?.isRiding()){notify('先到站下车，再使用滑翔伞。');return;}if(commute?.isRiding()){notify('先按 V 离开载具，再使用滑翔伞。');return;}if(yuyuan?.isRiding()){notify('先下黄包车，再使用滑翔伞。');return;}if(adventure?.state.race){notify('跑酷中不能滑翔。');return;}if(!life.state.glider){notify('到上海中心巅峰观景台领取滑翔伞，或按 C 制作。');return;}gliding=!gliding;if(gliding){setFlight(false);vy=Math.max(vy,-2.2);}notify(gliding?'滑翔伞已展开！离开平台即可滑翔，WASD 转向，Shift 加快下降。':'已收起滑翔伞');}
function useScene(){if(story?.use())return;if(metro?.use())return;if(activity?.isRiding()){activity.use();return;}if(civil?.use&&civil.use())return;if(privateSuites?.use())return;if(commute?.use())return;if(yuyuan?.use())return;if(npcGuides?.use())return;if(activity?.use())return;if(restaurant?.use())return;if(skyline?.use())return;if(!life.dockUse())adventure.use();}
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('mousedown',e=>{if(!active||touch)return;if(cursorFree){setFreeCursor(false);return;}if(fallback||dragMode){if(e.button===0)dragging=true;else if(e.button===2)edit(true);return;}if(e.button===0||e.button===2){mouseHeld=e.button;edit(e.button===2)}});
document.addEventListener('mouseup',()=>{mouseHeld=-1;dragging=false});
document.addEventListener('keydown',e=>{
 if(photo?.handleKey(e))return;
 if(story?.handleKey(e))return;
 if(e.code==='KeyO'&&!e.repeat&&started&&(active||handbook?.isPanelOpen())){e.preventDefault();handbook.openBackpack();return;}
 if(e.code==='Escape'&&handbook?.isPanelOpen()){e.preventDefault();handbook.close();return;}
 if((e.code==='AltLeft'||e.code==='AltRight'||e.key==='Alt')&&!e.repeat&&started&&active){e.preventDefault();toggleFreeCursor();return;}
 if(e.code==='KeyI'&&!e.repeat&&started&&(active||quests?.isPanelOpen())){e.preventDefault();quests.open();return;}
 if(e.code==='Escape'){if(cursorFree){e.preventDefault();setFreeCursor(false);return;}if(yuyuan?.isPanelOpen()){e.preventDefault();yuyuan.close();return;}if(quests?.isPanelOpen()){e.preventDefault();quests.close();return;}if(npcGuides?.isPanelOpen()){e.preventDefault();npcGuides.close();return;}if(activity?.isPanelOpen()){e.preventDefault();activity.close();return;}if(restaurant?.isPanelOpen()){e.preventDefault();restaurant.close();return;}if(skyline?.isPanelOpen()){e.preventDefault();skyline.close();return;}if(life?.isPanelOpen()){life.close();return;}if(adventure?.isPanelOpen()){adventure.close();return;}if(active){document.exitPointerLock?.();openMenu()}return;}if(!active)return;
 if(['Space','KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(!keys.has(e.code))pressedAt.set(e.code,performance.now());releaseAt.delete(e.code);keys.add(e.code);
 if(!e.repeat){if(/^Digit[1-3]$/.test(e.code)&&['bicycle','car'].includes(commute?.ride?.kind))return;if(/^Digit[1-9]$/.test(e.code))select(Number(e.code.at(-1)));if(e.code==='Digit0')select(10);if(e.code==='Minus')select(11);if(e.code==='Equal')select(12);if(e.code==='KeyV')useScene();if(e.code==='KeyP')toggleGlider();if(e.code==='KeyC')life.craft();if(e.code==='KeyZ')life.eat();if(e.code==='KeyL')life.dive();if(e.code==='KeyB')adventure.paint();if(e.code==='KeyM')adventure.map();if(e.code==='KeyK')adventure.launch();if(e.code==='KeyJ'){if(Math.hypot(pos.x-LANDMARKS.tower.x,pos.z-53)<6)adventure.launch();else companions.recall(pos);}if(e.code==='KeyF')toggleFly();if(e.code==='CapsLock'){runLocked=!runLocked;notify(runLocked?'持续跑步已开启；CapsLock 切回步行。':'已切回步行；按住 Shift 跑步。');}if(e.code==='KeyR')respawn();if(e.code==='KeyQ')edit(false);if(e.code==='KeyE')edit(true);if(e.code==='KeyG')interact();if(e.code==='KeyH')interact(true);if(e.code==='KeyT'&&!life.state.survival){dayClock=(Math.floor(dayClock/60)*60+60)%240+15;notify('已切换小岛时间');}}
});document.addEventListener('keyup',e=>{const remaining=100-(performance.now()-(pressedAt.get(e.code)??0));if(remaining>0)releaseAt.set(e.code,performance.now()+remaining);else keys.delete(e.code)});
canvas.addEventListener('wheel',e=>{if(active){e.preventDefault();select(((selected-1+(e.deltaY>0?1:11))%12)+1)}},{passive:false});
window.addEventListener('blur',()=>{keys.clear();mouseHeld=-1;if(active){document.exitPointerLock?.();openMenu()}});
document.addEventListener('visibilitychange',()=>{music.update({playing:active||story?.filming,night:dayClock>=120,festival:adventure?.isShowActive(),hidden:document.hidden});if(document.hidden)sceneAudio.suspend();if(document.hidden&&active){document.exitPointerLock?.();openMenu()}});
for(const btn of document.querySelectorAll('[data-key]')){
 btn.addEventListener('pointerdown',e=>{e.preventDefault();btn.dataset.active='true';btn.setPointerCapture(e.pointerId);keys.add(btn.dataset.key)});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(event,()=>{delete btn.dataset.active;keys.delete(btn.dataset.key)});
}
let lastJumpTap=0;
document.querySelector('.jump-btn')?.addEventListener('pointerdown',()=>{const now=performance.now();if(now-lastJumpTap<380){toggleFly();lastJumpTap=0;}else{lastJumpTap=now;}});
for(const id of ['firework-quick','touch-firework','touch-firework-more']){$(id)?.addEventListener('click',()=>adventure?.launch?.());}
$('touch-fly-more')?.addEventListener('click',toggleFly);
$('touch-run').onclick=()=>{runLocked=!runLocked;notify(runLocked?'持续跑步已开启':'已切回步行');};$('touch-mine').onclick=()=>edit(false);$('touch-place').onclick=()=>edit(true);$('touch-fly').onclick=toggleFly;$('touch-talk').onclick=()=>interact();$('touch-follow').onclick=()=>interact(true);$('touch-use').onclick=useScene;$('touch-glide').onclick=toggleGlider;$('touch-craft').onclick=()=>life.craft();$('touch-eat').onclick=()=>life.eat();$('touch-dive').onclick=()=>life.dive();$('touch-paint').onclick=()=>adventure.paint();$('map-button').onclick=()=>adventure.map();$('mouse-mode').onclick=()=>{dragMode=!dragMode;fallback=dragMode;$('mouse-mode').textContent=dragMode?'鼠标：拖动环顾':'鼠标：自动锁定';$('mouse-mode').setAttribute('aria-pressed',String(dragMode));};
canvas.addEventListener('pointerdown',e=>{if(!touch||!active)return;lookPointer=e.pointerId;lastLook={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(e.pointerId===lookPointer&&lastLook){const isForced=document.body.classList.contains('force-landscape');const dx=isForced?(e.clientY-lastLook.y):(e.clientX-lastLook.x);const dy=isForced?-(e.clientX-lastLook.x):(e.clientY-lastLook.y);look(dx*1.6,dy*1.6);lastLook={x:e.clientX,y:e.clientY}}});
for(const event of ['pointerup','pointercancel'])canvas.addEventListener(event,e=>{if(e.pointerId===lookPointer){lookPointer=null;lastLook=null}});
const shipSurfaces=()=>vesselSurfaces;
function staticCollides(x,y,z,ignoreFurniture=null){const h=metroRampFloor(x,z)??nanpuFloor(world,x,z)??yuyuan?.floorAt?.(x,z),slope=h!==null&&Math.abs(y-h)<1.5;return boatSolid(shipSurfaces(),x,y,z)||!!metro?.collides(x,y,z)||slope&&y<h-.015||overlaps(world,x,slope?Math.max(y,Math.ceil(h)):y,z)||!!life?.collides(x,y,z,ignoreFurniture)||!!yuyuan?.collides(x,y,z)||!!story?.collides(x,y,z)||!!restaurant?.collides(x,y,z)||!!privateSuites?.collides(x,y,z)||!!activity?.collides(x,y,z)||!!commute?.collides(x,y,z);}
function collides(x,y,z){return staticCollides(x,y,z)||!!civil?.collides(x,y,z);}
function nearWaterExit(){return [[1.1,0],[-1.1,0],[0,1.1],[0,-1.1]].some(([dx,dz])=>{const x=Math.floor(pos.x+dx),z=Math.floor(pos.z+dz),y=world.get(x,23,z)?24:23;return !!world.get(x,y-1,z)&&!world.get(x,y,z)&&!world.get(x,y+1,z);});}
function physics(dt){
 if(metro?.isRiding()||metro?.tryBoard()||yuyuan?.isRiding())return;
 if(civil?.isSeated?.()){
  if(keys.has('KeyW')||keys.has('KeyA')||keys.has('KeyS')||keys.has('KeyD')||keys.has('Space'))civil.standUp();
  return;
 }
 const alignedFloor=snapMetroFloor(world,pos,vy,{flying,gliding},(x,z)=>metro?.floorAt(x,z)??yuyuan?.floorAt?.(x,z));if(alignedFloor!==null&&!collides(pos.x,alignedFloor,pos.z)){pos.y=alignedFloor;vy=0;grounded=true;}
 if(adventure?.state.race)gliding=false;
 for(const [key,until] of releaseAt)if(performance.now()>=until){keys.delete(key);releaseAt.delete(key);}
 yaw+=(Number(keys.has('ArrowLeft'))-Number(keys.has('ArrowRight')))*dt*1.65;pitch=Math.max(-1.52,Math.min(1.52,pitch+(Number(keys.has('ArrowUp'))-Number(keys.has('ArrowDown')))*dt*1.2));
 let fw=Number(keys.has('KeyW'))-Number(keys.has('KeyS')),side=Number(keys.has('KeyD'))-Number(keys.has('KeyA'));const length=Math.hypot(fw,side);if(length){fw/=length;side/=length;}
 const shift=keys.has('ShiftLeft')||keys.has('ShiftRight'),swimming=isSwimming({feet:pos.y,dry:metroInterior(pos)});const speed=movementSpeed({flying,gliding,grounded,swimming,equipped:life?.state.equipped,sprint:shift||runLocked,racing:!!adventure?.state.race});
 const dx=(-Math.sin(yaw)*fw+Math.cos(yaw)*side)*speed*dt,dz=(-Math.cos(yaw)*fw-Math.sin(yaw)*side)*speed*dt;
 const rampY=(x,z)=>{const h=metroRampFloor(x,z)??metro?.floorAt(x,z)??nanpuFloor(world,x,z)??yuyuan?.floorAt?.(x,z);return !flying&&!gliding&&h!==null&&Math.abs(pos.y-h)<.55&&vy<=0?h:(snapMetroFloor(world,{x,y:pos.y,z},vy,{flying,gliding},(xx,zz)=>metro?.floorAt(xx,zz)??yuyuan?.floorAt?.(xx,zz))??pos.y);};
 let moveY=rampY(pos.x+dx,pos.z);if(!collides(pos.x+dx,moveY,pos.z)){pos.x+=dx;pos.y=moveY;}
 moveY=rampY(pos.x,pos.z+dz);if(!collides(pos.x,moveY,pos.z+dz)){pos.z+=dz;pos.y=moveY;}
 if(flying){vy=(Number(keys.has('Space'))-Number(shift))*6;}
 else if(gliding&&!swimming&&!grounded){vy=shift?-5:-2.2;}
 else{vy=swimVelocity({feet:pos.y,velocity:vy,space:keys.has('Space'),down:shift,grounded,dt,dry:metroInterior(pos),shore:swimming&&keys.has('Space')&&nearWaterExit()});if(keys.has('Space'))grounded=false;}
 if(metro?.tryBoard())return;
 const entryFloor=metro?.floorAt(pos.x,pos.z)??yuyuan?.floorAt?.(pos.x,pos.z);if(!flying&&!gliding&&vy<=0&&entryFloor!==null&&entryFloor!==undefined&&pos.y>=entryFloor-.55&&pos.y+vy*dt<=entryFloor){pos.y=entryFloor;vy=0;grounded=true;return;}
 const dy=vy*dt,deck=!flying&&!gliding&&vy<=0?boatSupport(shipSurfaces(),pos.x,pos.y,pos.z):null;if(deck&&pos.y+dy<=deck.y){pos.y=deck.y;vy=0;grounded=true;}else if(!collides(pos.x,pos.y+dy,pos.z)){pos.y+=dy;grounded=false;}else{if(dy<0){grounded=true;if(!flying&&!gliding&&!swimming&&!adventure?.state.race&&vy<-13)life.state.hurt(Math.ceil((-vy-13)*.65));}vy=0;}
 if(swimming)gliding=false;
 if(pos.y>HEIGHT+12)pos.y=HEIGHT+12;
 if(pos.y<-5)respawn();
}
let prev=performance.now(),elapsed=0,hudTime=0,chunkClock=0,lastIdleFrame=-Infinity;
function frame(now){
 if(document.hidden||!active&&!story?.filming&&now-lastIdleFrame<(photo?.opened?1000/30:1000/15)){prev=now;requestAnimationFrame(frame);return;}
 lastIdleFrame=now;
 const support=active&&!flying&&!gliding&&!activity?.isRiding()&&!commute?.isRiding()&&!yuyuan?.isRiding()?boatSupport(shipSurfaces(),pos.x,pos.y,pos.z):null,carried=support&&Math.abs(pos.y-support.y)<.2?{...support,old:boatWorld(support.root,support.local)}:null;
 requestAnimationFrame(frame);const storyDt=Math.min((now-prev)/1000,1);let dt=Math.min((now-prev)/1000,.1);prev=now;elapsed+=dt;for(const [key,until]of releaseAt)if(now>=until){keys.delete(key);releaseAt.delete(key);}npcGuides?.beginTick();activity?.tick(active?dt:0,{night:dayClock>=120});metro?.tick(active?dt:0,{playing:active,sound:sound&&sceneAudio.enabled,keys:active?keys:new Set()});
 if(active){chunkClock+=dt;if(chunkClock>.6){ensureChunks(pos);chunkClock=0;}chunkWork.process(isMobile?2:3);saves?.tick(dt);let remaining=dt;while(remaining>0&&!activity?.isRiding()&&!commute?.isRiding()&&!metro?.isRiding()&&!yuyuan?.isRiding()){const step=Math.min(remaining,1/120);physics(step);remaining-=step;}
  camera.position.set(pos.x,pos.y+1.62,pos.z);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();camera.getWorldDirection(direction);target=trace(world,camera.position,direction);outline.visible=!!target;if(target)outline.position.set(target.x+.5,target.y+.5,target.z+.5);
  if((mouseHeld!==-1||keys.has('KeyQ'))&&now-lastAction>260)edit(mouseHeld===2);tickMining(dt);
  hudTime+=dt;if(hudTime>.15){$('coordinates').textContent=`X ${(pos.x-40).toFixed(1)} · Y ${pos.y.toFixed(1)} · Z ${(pos.z-40).toFixed(1)}`;$('target').textContent=target?BLOCKS[target.id].name:'';const nearby=life?.hasUseTarget()?null:companions.nearest(pos,camera);$('npc-prompt').classList.toggle('visible',!!nearby);$('npc-prompt').textContent=nearby?`奶龙 · G 打招呼 / 跳舞 · H ${nearby.follow?'停止跟随':'一起散步'}`:'';hudTime=0;}
  $('glide-status').hidden=!gliding;$('glide-status').textContent=grounded?'滑翔伞准备好了 · 走向边缘起飞':'滑翔中 · WASD 转向 · Shift 下降 · P 收伞';life.tick(dt,{night:dayClock>=120,moving:keys.has('KeyW')||keys.has('KeyA')||keys.has('KeyS')||keys.has('KeyD'),racing:!!adventure.state.race});companions.update(dt,pos,camera,elapsed);const effect=adventure.tick(dt,pos,elapsed,dayClock>=120);if(effect?.bounce&&!flying){vy=effect.bounce;grounded=false;beep(1);}
 }else if(!started){camera.position.set(32+Math.sin(elapsed*.03)*1.5,29.8,68+Math.cos(elapsed*.025)*1.0);camera.lookAt(126,52,42);outline.visible=false;}
 const area=soundScene(pos,dayClock>=120);
 music.update({playing:active,night:dayClock>=120,festival:adventure?.isShowActive(),hidden:document.hidden,sceneTrack:area.track,dt});
 $('music-track').textContent=music.track.name+' · '+(music.automatic?area.name:adventure?.isShowActive()?'明珠夜游变奏':'手选曲目');$('music-choice').value=music.track.id;
 const festival=adventure?.isShowActive(),showTime=adventure?.show.elapsed??0;
 skyline.tick(active?dt:0,{night:dayClock>=120,festival,time:elapsed,showTime});
 updateSky(active?dt:0);const climate=weather.tick(active?dt:0,dayClock);const hts=$('hud-time-slider');if(hts&&!isScrubbingTime&&document.activeElement!==hts)hts.value=String(clockMinutes(dayClock));civil.tick(active?dt:0,{night:dayClock>=120,rain:climate.rain,dayClock,festival,showTime});if(carried){const q=boatWorld(carried.root,carried.local);pos.x+=q.x-carried.old.x;pos.z+=q.z-carried.old.z;pos.y+=carried.root.position.y+carried.top-carried.y;camera.position.set(pos.x,pos.y+1.62,pos.z);}$('weather-status').textContent=climate.name+' · 湿度 '+climate.humidity+'%';const sWeather=$('settings-weather-status');if(sWeather)sWeather.textContent=$('weather-status').textContent;const sRender=$('settings-render-mode');if(sRender&&$('render-mode'))sRender.textContent=$('render-mode').textContent;if(clouds.tick)clouds.tick(active?dt:0,elapsed,climate);
 if(active&&!activity?.isRiding()&&!yuyuan?.isRiding()&&!metroInterior(pos)){const hit=trafficContact({agents:civil.traffic.agents,player:pos,vehicle:commute?.ride?.vehicle,world,blocked:(x,y,z)=>staticCollides(x,y,z)});if(hit){const v=commute?.ride?.vehicle;if(v){v.root.position.set(hit.point.x,hit.point.y,hit.point.z);v.speed=0;v.throttle=0;v.shock=.8;v.impactCooldown=.4;}else{Object.assign(pos,hit.point);camera.position.set(pos.x,pos.y+1.62,pos.z);vy=0;}if(hit.speed>.2&&elapsed>trafficHitUntil){trafficHitUntil=elapsed+1.2;const damage=Math.min(6,Math.max(1,Math.ceil(hit.speed*.8)));life.state.hurt(damage);sceneAudio.horn();notify(life.state.survival?'被来车撞到 · 生命 -'+damage:'被来车碰到，已退到车旁。');}}}
 trafficFlash.style.opacity=active?String(Math.max(0,(trafficHitUntil-elapsed-.6)*.6)):'0';
 sceneAudio.update(active?dt:0,{playing:active,hidden:document.hidden,sound,volume:music.volume,pos,yaw,agents:civil.traffic.agents,vendors:()=>[...(activity?.vendors??[]),...(yuyuan?.vendors??[])],riding:commute?.isRiding()||activity?.isRiding()||yuyuan?.isRiding(),dialogue:npcGuides?.isPanelOpen(),night:dayClock>=120,rain:climate.rain});
 yuyuan?.tick(active?dt:0,{night:dayClock>=120,keys:active?keys:new Set()});privateSuites?.tick(active,active?dt:0);restaurant?.tick(active?dt:0);cityMedia.tick(active?dt:0,{dayClock,festival,showTime});lujiazuiShow.tick(active?dt:0,{active:festival,time:showTime});residents?.tick(active?dt:0);npcGuides?.tick(active?dt:0);quests?.tick(active?dt:0,active&&!document.hidden&&!npcGuides?.isPanelOpen());const commuteText=commute?.tick(active?dt:0,active?keys:new Set());$('commute-status').hidden=!active||!commuteText;$('commute-label').textContent=commuteText||'';const drive=commute?.ride?.vehicle;$('drive-meter').hidden=!drive||!['bicycle','car'].includes(drive.kind);const power=Math.round(Math.abs(drive?.throttle??0)*100);$('drive-throttle').value=power;$('drive-power').textContent=drive?.brake?'刹车':power+'%';const civilPrompt=civil?.getPrompt?.();if(civilPrompt&&active&&!commute?.isRiding()&&!yuyuan?.isRiding()){$('guide-prompt').hidden=false;$('guide-prompt').textContent=civilPrompt;}else if(!active||commute?.isRiding()||yuyuan?.isRiding())$('guide-prompt').hidden=true;$('run-status').hidden=!active||isMobile||touch||commute?.isRiding()||metro?.isRiding()||yuyuan?.isRiding()||flying||gliding;if(!isMobile&&!touch)$('run-status').textContent=isSwimming({feet:pos.y,dry:metroInterior(pos)})?'游泳 · 空格上浮 · Shift 下潜':runLocked?'持续跑步 · CapsLock 切回步行':'Shift 跑步 · CapsLock 持续跑步';const rideCamera=commute?.cameraPose(yaw,pitch)??yuyuan?.cameraPose(yaw,pitch);if(rideCamera&&active){camera.position.set(rideCamera.position.x,rideCamera.position.y,rideCamera.position.z);camera.lookAt(rideCamera.focus.x,rideCamera.focus.y,rideCamera.focus.z);}for(const label of wayfindingLabels)label.visible=!document.body.classList.contains('in-conversation')&&label.position.distanceToSquared(camera.position)>16;story?.tick(active?dt:0,active&&!document.hidden);if(story?.filming){chunkWork.process(isMobile?2:3);story.filmFrame(storyDt);}photo?.update();renderer.render(scene,camera);
}
function onResize(){
 if(window.innerWidth>window.innerHeight){
  document.body.classList.remove('force-landscape');
 }
 const isForced=document.body.classList.contains('force-landscape');
 const w=isForced?innerHeight:innerWidth;
 const h=isForced?innerWidth:innerHeight;
 camera.aspect=w/h;
 camera.updateProjectionMatrix();
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));
 renderer.setSize(w,h);
 updateOrientationUI();
}
window.addEventListener('resize',onResize);
window.addEventListener('orientationchange',()=>{
 onResize();
 setTimeout(onResize,250);
});
document.addEventListener('fullscreenchange',updateOrientationUI);
document.addEventListener('webkitfullscreenchange',updateOrientationUI);
canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();photo?.close(false);active=false;openMenu();$('play').disabled=true;$('play').textContent='画面已挂起，正在等待恢复…'});
canvas.addEventListener('webglcontextrestored',e=>{e.preventDefault();$('play').disabled=false;$('play').textContent='画面已恢复 · 点击继续探索';notify('画面已恢复，点击继续探索');});

function setFlight(value){
  flying=value&&!life?.state.survival;vy=0;
  $('mode').textContent=life?.state.survival?'生存模式':flying?'创造模式 · 飞行':'创造模式';
  const jumpBtn=document.querySelector('.jump-btn');
  if(jumpBtn){jumpBtn.textContent=flying?'🕊 上升':'⎵ 跳跃';jumpBtn.classList.toggle('flying',flying);}
  const descBtn=$('touch-descend');if(descBtn)descBtn.hidden=!flying;
  const flyChip=$('touch-fly');if(flyChip){flyChip.textContent=flying?'🕊 降落':'🕊 飞行';flyChip.classList.toggle('flying',flying);}
  const flyMoreChip=$('touch-fly-more');if(flyMoreChip)flyMoreChip.textContent=flying?'🕊 降落 F':'🕊 飞行 F';
}
function placePlayer(point){ensureChunks(point);pos.x=point.x;pos.y=point.y;pos.z=point.z;vy=0;grounded=false;yaw=point.z>=270&&point.x<=170?0:point.z>=68?-Math.PI/2:point.x>=80?Math.PI/2:0;pitch=-.12;}
function teleport(point){metro?.end(true);commute?.end(true);activity?.cancelRide();yuyuan?.rickshaws?.dismount?.('传送');placePlayer(point);}
if(['localhost','127.0.0.1'].includes(location.hostname))window.__game={
  camera,pos,teleport,lookTowards,setFlight,
  setPos:(x,y,z)=>{teleport({x,y,z});pos.x=x;pos.y=y;pos.z=z;ensureChunks({x,y,z},true,true);camera.position.set(x,y+1.62,z);},
  lookAt:(x,y,z)=>{lookTowards({x,y,z});camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();renderer.render(scene,camera);},
  setTime:(min)=>{dayClock=phaseFromMinutes(min);updateSky(0);},
  setNight:()=>{dayClock=165;updateSky(0);},
  setDay:()=>{dayClock=36;updateSky(0);},
  render:()=>{camera.position.set(pos.x,pos.y+1.62,pos.z);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();renderer.render(scene,camera);},
  scene,renderer,enter:()=>enter()
};
function pauseForPanel(){story?.suspend();sceneAudio.suspend();metro?.suspend();pendingMine=null;active=false;keys.clear();pressedAt.clear();releaseAt.clear();mouseHeld=-1;dragging=false;document.exitPointerLock?.();}
adventure=createAdventure({scene,world,notify,beep,teleport,setFlying:setFlight,getFlying:()=>flying,pause:pauseForPanel,resume:enter,burst:companions.burst,lookAt:lookTowards,setNight:()=>{dayClock=165;updateSky(0)},onProgress:()=>{saves?.save('auto')},getQuestTarget:()=>story?.target()??quests?.target(),fastTravel:p=>{const safe=safeLanding(world,p,collides);if(!safe){notify('落点被占用，请稍后再试。');return false;}setFlight(false);gliding=false;teleport(safe);if(p.viewTarget)lookTowards(p.viewTarget);return true;}});
life=createLife({onEvent:recordCityEvent,scene,world,interactionBlocked:(x,y,z,ignore)=>staticCollides(x,y,z,ignore),blocked:(x,y,z)=>staticCollides(x,y,z),isDry:()=>metroInterior(pos),notify,pause:pauseForPanel,resume:enter,getPos:()=>pos,getYaw:()=>yaw,getDirection:()=>{camera.getWorldDirection(direction);return direction},onMode:survival=>{if(survival)setFlight(false);else setFlight(flying)},onHeld:type=>{$('selected-name').textContent=type?({bed:'床',chair:'木椅',table:'餐桌',lamp:'晶石灯',chest:'储物箱',campfire:'篝火',bookshelf:'书架',planter:'菜圃'}[type]):BLOCKS[selected].name},onDeath:point=>{if(point&&!collides(point.x,point.y,point.z))teleport(point);else teleport(LANDMARKS.village);vy=0},setDay:()=>{dayClock=36;updateSky(0)},onProgress:()=>saves?.save('auto')});
quests=createQuestJournal({getJourney:()=>story?.journalInfo(),onJourneyAction:action=>story?.runJournalAction(action),getStory:()=>story?.tracking?{title:story.title,goal:story.target()}:null,onTrack:id=>{if(story){story.state.tracked=false;}},scene,getYaw:()=>yaw,getContext:()=>({pos,life:life.state,npcs:companions.npcs,vendors:activity?.vendors??[],stations:metro?.stations??[],ride:metro?.ride,trains:metro?.trains??[],landings:activity?.landings??[],ferryRiding:activity?.isRiding(),metroNetwork:metro}),openMap:()=>adventure.map(),pause:pauseForPanel,resume:enter,notify,onProgress:()=>saves?.save('auto'),canOpen:()=>started&&!yuyuan?.isPanelOpen()&&!npcGuides?.isPanelOpen()&&!activity?.isPanelOpen()&&!restaurant?.isPanelOpen()&&!skyline?.isPanelOpen()&&!life?.isPanelOpen()&&!adventure?.isPanelOpen(),grant:r=>{for(const [id,n]of Object.entries(r.blocks??{}))life.state.add(Number(id),n);for(const key of ['food','wool','pearls'])life.state[key]=Math.min(99999,life.state[key]+(r[key]??0));life.refresh();}});
restaurant=createPeaceRestaurant({onEvent:recordCityEvent,scene,world,getPos:()=>pos,getState:()=>life.state,teleport,lookAt:lookTowards,notify,pause:pauseForPanel,resume:enter,onProgress:()=>saves?.save('auto')});
activity=createCityActivity({extraCrowd:civil.pedestrians.filter(p=>p.kind==='shop'),onEvent:recordCityEvent,scene,world,getVehicles:()=>[...civil.traffic.agents,...(commute?.vehicles??[])],getPos:()=>pos,getState:()=>life.state,teleport:p=>{Object.assign(pos,p);vy=0;},lookAt:lookTowards,notify,pause:pauseForPanel,resume:enter,onProgress:()=>saves?.save('auto'),getTrafficTime:()=>civil.traffic.time});
metro=createMetro({renderer,getYaw:()=>yaw,turnView:a=>{yaw+=a;},onEvent:recordCityEvent,scene,getPos:()=>pos,place:p=>{Object.assign(pos,p);vy=0;},setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;},notify,getAudio,getSound:()=>sound&&sceneAudio.enabled,canCarry:()=>!flying&&!gliding&&!commute?.isRiding(),canBoard:()=>!commute?.isRiding()});
vesselSurfaces=boatSurfaces(activity.ferry,civil.boats);
privateSuites=createPrivateSuites({scene,getPos:()=>pos,getState:()=>life.state,teleport,lookAt:lookTowards,notify,setDay:()=>{dayClock=36;updateSky(0);},onProgress:()=>{life.refresh();saves?.save('auto');}});
if($('play'))$('play').textContent='正在构建豫园与老城商圈…';
yuyuan=createYuyuan({scene,world,getVehicles:()=>[...civil.traffic.agents,...(commute?.vehicles??[])],getPos:()=>pos,getState:()=>life.state,setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;},notify,pause:pauseForPanel,resume:enter,onProgress:()=>{life.refresh();saves?.save('auto');},onEvent:recordCityEvent,getAudio,getSound:()=>sound&&sceneAudio.enabled&&!document.hidden,getVolume:()=>music.volume});
residents=createBuildingResidents({scene,world,getPos:()=>pos,getVehicles:()=>[...civil.traffic.agents,...(commute?.vehicles??[])]});
story=createShanghaiJourney({scene,camera,world,getAudio,getSound:()=>sound,getVolume:()=>music.volume,getContext:()=>({pos,life:life.state,vendors:activity?.vendors??[],stations:metro?.stations??[],ride:metro?.ride,trains:metro?.trains??[],metroNetwork:metro}),pause:pauseForPanel,resume:enter,notify,prefetch:p=>ensureChunks(p),placeStart:a=>{teleport({x:a.x-1.5,y:a.y,z:a.z-2});setFlight(false);lookTowards({...a,y:a.y+1.5});},celebrate:()=>{if(adventure?.launch){adventure.launch(true);notify('外滩的灯光已经为你亮起，过去看看吧 · 随时按 K 放烟花');}},onProgress:()=>{quests?.refresh();saves?.save('auto');}});
npcGuides=createNpcGuides({extraPeople:[...story.actors,...metro.staff,...residents.people,...yuyuan.actors],scene,world,civil,activity,getPos:()=>pos,getVehicles:()=>commute?.vehicles??[],pause:pauseForPanel,resume:enter,notify,lookAt:p=>{camera.position.set(pos.x,pos.y+1.62,pos.z);lookTowards(p);}});
commute=createCommute({scene,world,civil,activity,getPos:()=>pos,blocked:(x,y,z)=>overlaps(world,x,y,z)||!!life?.collides(x,y,z)||!!restaurant?.collides(x,y,z)||!!activity?.collides(x,y,z),exitBlocked:collides,place:p=>{Object.assign(pos,p);vy=0;},setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;},onExit:()=>{keys.clear();pressedAt.clear();releaseAt.clear();grounded=true;},turnView:a=>{yaw+=a;},notify,allowed:()=>!adventure.state.race&&!activity.isRiding()&&!metroInterior(pos),getActors:()=>npcGuides.actors,onImpact:(actor,vx,vz,strength)=>npcGuides.impact(actor,vx,vz,strength)});
const lujiazuiShow=createLujiazuiShow(scene);
skyline=createSkyline({onEvent:recordCityEvent,scene,getPos:()=>pos,notify,pause:pauseForPanel,resume:enter,teleport,grantGlider:()=>life.grantGlider(),onProgress:()=>saves?.save('auto')});
function captureSave(){return {version:6,mapRevision:MAP_REVISION,edits:[...savedEdits],metro:metro.serialize(),quests:quests.serialize(),journey:story?.serialize(),pos:metro.safeSavePoint()||commute.safeSavePoint()||activity.safeSavePoint()||yuyuan.rickshaws.safeSavePoint()||{...pos},yaw,pitch,flying,gliding,selected,dayClock,timeOptions:{...timeOptions},mined,placed,talkDone,followDone,celebrated,life:life.serialize(),yuyuan:yuyuan.serialize(),restaurant:restaurant.serialize(),suites:privateSuites.serialize(),activity:activity.serialize(),skyline:skyline.serialize(),weather:weather.serialize(),adventure:adventure.serialize(),savedAt:new Date().toISOString()};}
function movePersonal(p){
 if(p.x>=255&&p.x<=286&&p.z>=196&&p.z<=213&&p.y>=24){p.x-=143;p.z+=104;return true;}
 if(p.x>=38&&p.x<=92&&p.z>=149&&p.z<=199&&p.y>=24){p.z+=56;return true;}
 if((p.x>=3&&p.x<=67&&p.z>=3&&p.z<=68)||(p.x>=67&&p.x<=108&&p.z>=68&&p.z<=82&&p.y>=23)){p.x+=35;p.z+=280;return true;}return false;
}
function migrateCityPoint(p){
 const rooms=[{x:171.5,z:129.5,to:CITY.shanghai},{x:187.5,z:83.5,to:CITY.jinmao},{x:231.5,z:101.5,to:CITY.swfc}];
 const room=rooms.find(r=>Math.abs(p.x-r.x)<=12&&Math.abs(p.z-r.z)<=13&&p.y>=25);
 if(room){if(room.to===CITY.swfc){const dx=p.x-room.x,dz=p.z-room.z;p.x=room.to.x+dz;p.z=room.to.z-dx;}else{p.x+=room.to.x-room.x;p.z+=room.to.z-room.z;}return;}
 const oldBanks=[[112,26],[170,22],[245,26],[244,80],[239,138],[252,191],[210,197],[193,165]];
 const i=oldBanks.findIndex(([x,z])=>Math.abs(p.x-x)<=15&&Math.abs(p.z-z)<=7&&p.y>=25);
 if(i>=0){const b=BUND_BUILDINGS.find(b=>b.id==='avenue-'+i);p.x+=b.x-oldBanks[i][0];p.z+=b.z-oldBanks[i][1];return;}
 if(p.x>=221&&p.x<=227&&p.z>=214&&p.z<=231&&p.y>=21&&p.y<26){p.x+=36;return;}
 if(p.x>=48&&p.x<=150&&p.z>=103&&p.z<=111&&p.y>=29&&p.y<=32){Object.assign(p,LANDMARKS.nanpu);return;}
 if(movePersonal(p))return;
 if(p.x>=40&&p.x<=90&&p.z>=149&&p.z<=199&&p.y>=24){p.z+=56;return;}
 if(p.x>=77&&p.x<=104&&p.z>=29&&p.z<=60&&p.y>=25){p.x+=36;return;}
 // Visitors on the old promenade arrive on the enlarged observation deck.
 if(p.x<150&&p.z>=60&&p.z<=125&&p.y>=25)p.x+=36;
}
function migrateBundPoint(p){
 const old=[{id:'peace',z:30},{id:'bank',z:44},{id:'customs',z:60},{id:'hsbc',z:78},...Array.from({length:8},(_,i)=>({id:'avenue-'+i,z:94+i*14}))];
 const b=old.find(b=>Math.abs(p.x-Math.round(riverCenter(b.z)-58))<=8&&Math.abs(p.z-b.z)<=6&&p.y>=26);
 if(b){const next=BUND_BUILDINGS.find(n=>n.id===b.id);const oldX=Math.round(riverCenter(b.z)-58);p.x+=next.x-oldX;p.z+=next.z-b.z;if(p.y>26+next.h)p.y=26;}
}
function applySave(data){try{
 if(![3,4,6].includes(data?.version)||!Array.isArray(data.edits)||data.edits.length>50000)throw new Error('Invalid save');
 metro?.end(true);metro?.restore(data.metro);commute?.end(true);activity?.cancelRide();yuyuan?.rickshaws?.cancelRide();data=migrateWestBankSave(data);pendingMine=null;gliding=false;adventure.cancelRace();initialWorld.restore(world.data);savedEdits.clear();const shift=data.version<6?WORLD_SHIFT:0;
 for(const [key,id] of data.edits){if(typeof key!=='string'||!Number.isInteger(id)||id<0||id>=BLOCKS.length)continue;const xyz=key.split(',').map(Number);xyz[1]+=shift;if((data.mapRevision||0)<5){const p={x:xyz[0],y:xyz[1],z:xyz[2]};movePersonal(p);xyz[0]=p.x;xyz[2]=p.z;}if(xyz.length!==3||!xyz.every(Number.isInteger)||!world.valid(...xyz)||(xyz[1]<1))continue;const blockId=(id===6&&['-130,25,60','-130,25,61','-129,25,61','-131,25,61','-112,25,70','-113,25,70','-111,25,70'].includes(key))?9:id;if(blocksMetroClearance(...xyz,blockId,initialWorld.get(world.index(...xyz))))continue;world.set(...xyz,blockId);savedEdits.set(xyz.join(','),blockId);}
 const p=data.pos?{...data.pos,y:data.pos.y+shift}:null;if(p&&(data.mapRevision||0)<2){if(p.x>=125&&p.x<=148&&p.z>=25&&p.z<=52&&p.y>=25){p.x-=20;p.z+=47;}else if(p.x>=113&&p.x<=132&&p.z>=59&&p.z<=65&&p.y<25){p.x=LANDMARKS.dock.x;p.y=LANDMARKS.dock.y;p.z=LANDMARKS.dock.z;}}if(p&&(data.mapRevision||0)<3&&p.x>=110&&p.x<=124&&p.z>=116&&p.z<=121&&p.y<25){p.x=LANDMARKS.dock.x;p.y=23;p.z=LANDMARKS.dock.z;}if(p&&(data.mapRevision||0)<4){
 const rooms=[{x:116.5,z:85.5,dx:55,dz:44},{x:123.5,z:62.5,dx:64,dz:21},{x:145.5,z:71.5,dx:86,dz:30}],room=rooms.find(r=>Math.abs(p.x-r.x)<=12&&Math.abs(p.z-r.z)<=13&&p.y>=25);
 if(room){p.x+=room.dx;p.z+=room.dz;}
 else if(p.x>=110&&p.x<=163&&p.z>=103&&p.z<=158&&p.y<23){p.x+=140;p.z+=155;}
 else if(p.x>=122&&p.x<=129&&p.z>=116&&p.z<=122&&p.y>=22&&p.y<25){Object.assign(p,LANDMARKS.dock);}
 else if(p.x<=20&&p.z>=140&&p.z<=270&&p.y>=25){const idx=Math.max(0,Math.min(7,Math.round((p.z-146)/16))),bank=BUND_BUILDINGS.find(b=>b.id==='avenue-'+idx);p.x+=bank.x-9;p.z+=bank.z-(146+idx*16);}
 else if(p.x>=140&&p.x<=226&&p.z>=25&&p.z<=127&&p.y>=24){p.x+=157;}
 else if(p.x>=136&&p.x<=214&&p.z>=130&&p.z<=208&&p.y>=24){p.x+=157;p.z+=91;}
 else if(p.x>=197&&p.x<=240&&p.z>=196&&p.z<=240&&p.y>=24){p.x+=132;p.z+=138;}
 else if(p.x<=115&&p.z>138&&p.y>=25&&!world.get(Math.floor(p.x),Math.floor(p.y)-1,Math.floor(p.z)))Object.assign(p,LANDMARKS.survivalCamp);
}
if(p&&(data.mapRevision||0)<5){migrateCityPoint(p);if(p.y>=25&&p.y<33&&!data.flying&&!data.gliding&&!world.get(Math.floor(p.x),Math.floor(p.y)-1,Math.floor(p.z)))Object.assign(p,LANDMARKS.bund);}
if(p&&data.mapRevision===5)migrateBundPoint(p);
if(p){const y=snapMetroFloor(world,p,0,{flying:data.flying,gliding:data.gliding},(x,z)=>metro?.floorAt(x,z));if(y!==null)p.y=y;}
if(p&&!data.flying&&!data.gliding&&[44,70].includes(Math.round(p.y))&&Math.abs(p.x-PEARL.x)<12&&Math.abs(p.z-PEARL.z)<12&&!overlaps(world,p.x,p.y-.1,p.z)){const safe=safeLanding(world,p);if(safe)Object.assign(p,safe);}
if(p&&[p.x,p.y,p.z].every(Number.isFinite)&&p.y<HEIGHT+12&&!overlaps(world,p.x,p.y,p.z))Object.assign(pos,p);else Object.assign(pos,LANDMARKS.village);ensureChunks(pos,true,true);
 yaw=Number.isFinite(data.yaw)?data.yaw:0;pitch=Number.isFinite(data.pitch)?Math.max(-1.52,Math.min(1.52,data.pitch)):-.08;select(Number.isInteger(data.selected)&&data.selected>0&&data.selected<BLOCKS.length?data.selected:1,false);life.restore(data.version===6?data.life:null);if(data.mapRevision===5){const migrated=life.serialize();for(const f of migrated.furniture)migrateBundPoint(f);if(migrated.home)migrateBundPoint(migrated.home);life.restore(migrated);}if((data.mapRevision||0)<5){const migrated=life.serialize();for(const f of migrated.furniture)movePersonal(f);if(migrated.home)movePersonal(migrated.home);life.restore(migrated);}if((data.mapRevision||0)<4){for(const f of life.state.furniture)if(f.x<=115&&f.z>138&&f.y>=25){const x=Math.floor(f.x),z=Math.floor(f.z),y=Math.floor(f.y)-1;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(!world.get(x+dx,y,z+dz))updateBlock(x+dx,y,z+dz,7);}}if(collides(pos.x,pos.y,pos.z)){const nearby=[{x:pos.x+1.5,y:pos.y,z:pos.z},{x:pos.x-1.5,y:pos.y,z:pos.z},{x:pos.x,y:pos.y+2,z:pos.z}].find(p=>!collides(p.x,p.y,p.z));teleport(nearby||LANDMARKS.village);}setFlight(!!data.flying);gliding=!!data.gliding&&life.state.glider&&!flying;yuyuan.restore(data.yuyuan);restaurant.restore(data.restaurant);privateSuites.restore(data.suites);activity.restore(data.activity);skyline.restore(data.skyline);weather.restore(data.weather);$('weather-choice').value=weather.state.mode;$('weather-pace').value=weather.state.cycleSeconds;$('weather-pace').disabled=weather.state.mode!=='auto';timeOptions=clockOptions(data.timeOptions);dayClock=Number.isFinite(data.dayClock)?Math.max(0,data.dayClock)%240:36;mined=Math.max(0,Number(data.mined)||0);placed=Math.max(0,Number(data.placed)||0);adventure.restore(data.adventure);talkDone=!!data.talkDone;followDone=!!data.followDone;celebrated=!!data.celebrated;story?.restore(data.journey);quests.restore(data.quests,{talkDone,placed});if(adventure.state.race){gliding=false;teleport(courseById(adventure.state.race.course).platforms[adventure.state.race.checkpoint]);setFlight(false)}updateTasks();started=true;enter();notify(shift?'旧存档已迁移到新群岛，你的建筑仍然保留。':'已读取存档，欢迎回到你的小岛。');
 }catch{notify('未能读取存档，当前游戏仍然可以继续。');throw new Error('存档格式不正确');}}
function lookTowards(point){const dx=point.x-pos.x,dz=point.z-pos.z; yaw=Math.atan2(-dx,-dz);pitch=Math.atan2(point.y-pos.y-1.62,Math.hypot(dx,dz));camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();}
function lookCelestial(night){adventure.cancelRace();enter();teleport(LANDMARKS.bund);dayClock=night?165:36;updateSky(0);camera.position.set(pos.x,pos.y+1.62,pos.z);weather.tick(0,dayClock);lookTowards(night?weather.moon.position:sunBlock.position);notify(night?'已转向月亮；拖动鼠标继续环顾。':'已转向太阳；拖动鼠标继续环顾。');}
$('start-survival').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();const first=life.enterSurvival();if(first){teleport(LANDMARKS.survivalCamp);dayClock=36;updateSky(0);}saves?.save('auto');};
$('go-city').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();teleport(LANDMARKS.shanghai);lookTowards({x:201,y:76,z:88});notify('陆家嘴：环球在金茂东南，上海中心在金茂西南。对岸是外滩。');};
$('go-yuyuan').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();teleport(LANDMARKS.yuyuan);lookTowards({x:-46,y:28,z:240});notify('豫园：九曲桥、湖心亭，外围明清仿古商圈，内园扩建4倍古典园林。');};
$('go-bund').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();teleport(LANDMARKS.bund);lookTowards({x:184,y:65,z:66});};
$('go-north-bund').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();teleport(LANDMARKS.northBund);lookTowards({x:193,y:76,z:82});};
$('go-home').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();teleport(LANDMARKS.village);lookTowards({x:74,y:28,z:325});notify('欢迎回生活岛！木屋、奶龙、涂鸦和海港跑酷都在这里。');};
$('rebuild-cache')?.addEventListener('click',async()=>{if(confirm('确定要清除城市地图缓存并重新构建吗？个人游戏存档会保留。')){await clearWorldCache();location.reload();}});
$('look-sun').onclick=()=>lookCelestial(false);$('look-moon').onclick=()=>lookCelestial(true);
$('weather-choice').addEventListener('change',e=>{weather.state.setMode(e.target.value);saves?.save('auto');$('weather-pace').disabled=weather.state.mode!=='auto';notify('天气：'+(e.target.value==='auto'?'自动变化':{clear:'晴天',cloudy:'多云',rain:'雨天',fog:'江雾'}[e.target.value]))});
$('weather-pace').onchange=e=>{weather.state.setCycle(Number(e.target.value));saves?.save('auto');notify('已调整自动天气速度，当前天气平滑保留。');};
function refreshTimeControls(){
 $('weather-pace').value=weather?.state.cycleSeconds??1200;$('weather-pace').disabled=weather?.state.mode!=='auto';
 $('time-choice').value=clockLabel(dayClock);$('time-slider').value=clockMinutes(dayClock);$('day-length').value=timeOptions.cycleSeconds;$('time-paused').checked=timeOptions.paused;
 if($('hud-time-slider'))$('hud-time-slider').value=String(clockMinutes(dayClock));
}
function applyTime(minutes){if(!Number.isFinite(minutes))return;dayClock=phaseFromMinutes(minutes);updateSky(0);refreshTimeControls();saves?.save('auto');}
$('time-choice').onchange=e=>{const [h,m]=e.target.value.split(':').map(Number);if(e.target.value)applyTime(h*60+m);};
$('time-slider').oninput=e=>{dayClock=phaseFromMinutes(Number(e.target.value));updateSky(0);$('time-choice').value=clockLabel(dayClock);if($('hud-time-slider'))$('hud-time-slider').value=String(clockMinutes(dayClock));};
$('time-slider').onchange=e=>applyTime(Number(e.target.value));
for(const b of document.querySelectorAll('[data-time]'))b.onclick=()=>applyTime(Number(b.dataset.time));
const hudSlider=$('hud-time-slider');
if(hudSlider){
 function updateFromPointer(e){
  const isForced=document.body.classList.contains('force-landscape');
  const rect=hudSlider.getBoundingClientRect();
  const fraction=isForced
   ? (e.clientY-rect.top)/Math.max(1,rect.height)
   : (e.clientX-rect.left)/Math.max(1,rect.width);
  const clamped=Math.max(0,Math.min(1,fraction));
  const minutes=Math.round(clamped*1439);
  hudSlider.value=String(minutes);
  dayClock=phaseFromMinutes(minutes);
  updateSky(0);
  $('clock-quick').textContent=clockLabel(dayClock)+' · 调整时间';
  $('time-choice').value=clockLabel(dayClock);
  $('time-slider').value=clockMinutes(dayClock);
 }
 const onPointerDown=e=>{
  if(e.button!==undefined&&e.button!==0)return;
  isScrubbingTime=true;
  try{hudSlider.setPointerCapture(e.pointerId);}catch(_){}
  updateFromPointer(e);
 };
 const onPointerMove=e=>{
  if(!isScrubbingTime)return;
  updateFromPointer(e);
 };
 const onPointerUp=e=>{
  if(!isScrubbingTime)return;
  isScrubbingTime=false;
  try{hudSlider.releasePointerCapture(e.pointerId);}catch(_){}
  applyTime(Number(hudSlider.value));
 };
 hudSlider.addEventListener('pointerdown',onPointerDown);
 hudSlider.addEventListener('pointermove',onPointerMove);
 hudSlider.addEventListener('pointerup',onPointerUp);
 hudSlider.addEventListener('pointercancel',onPointerUp);
 hudSlider.addEventListener('input',e=>{
  if(isScrubbingTime)return;
  dayClock=phaseFromMinutes(Number(e.target.value));
  updateSky(0);
  $('clock-quick').textContent=clockLabel(dayClock)+' · 调整时间';
  $('time-choice').value=clockLabel(dayClock);
  $('time-slider').value=clockMinutes(dayClock);
 });
 hudSlider.addEventListener('change',e=>{
  if(isScrubbingTime)return;
  applyTime(Number(e.target.value));
 });
 document.querySelector('.hud-sun-icon')?.addEventListener('click',()=>{applyTime(720);notify('已切换到白天 ☀️');});
 document.querySelector('.hud-moon-icon')?.addEventListener('click',()=>{applyTime(1260);notify('已切换到夜晚 🌙');});
}
handbook=createPlayerHandbook({getState:()=>life.state,getPacked:()=>life.serialize().packed,getCollectibles:()=>({...yuyuan.inventory,...story.inventory}),openCollectible:()=>story.openSettlement(),selectBlock:select,craft:()=>life.craft(),pause:pauseForPanel,resume:enter,isPlaying:()=>active,canOpen:()=>!document.querySelector('dialog[open]'),notify});
settingsPanel=createSettingsPanel({dialog:$('settings-dialog'),isPlaying:()=>active,pause:pauseForPanel,resume:enter,onOpen:()=>{if(cursorFree)setFreeCursor(false);refreshTimeControls();}});
$('settings-quick')?.addEventListener('click',settingsPanel.open);
$('day-length').onchange=e=>{timeOptions=clockOptions({...timeOptions,cycleSeconds:Number(e.target.value)});saves?.save('auto');};
$('time-paused').onchange=e=>{timeOptions.paused=e.target.checked;saves?.save('auto');};
$('clock-quick').onclick=()=>{
 if(started&&active&&!cursorFree){
  toggleFreeCursor();
 }else{
  document.exitPointerLock?.();
  settingsPanel.open();
  $('time-controls')?.scrollIntoView?.({block:'center'});
  $('time-choice')?.focus?.();
 }
};
$('settings-open')?.addEventListener('click',settingsPanel.open);
$('settings-close')?.addEventListener('click',settingsPanel.close);
$('settings-dialog')?.addEventListener('cancel',e=>{e.preventDefault();try{$('settings-dialog').close();}catch{}});
const UPDATE_NOTICE_KEY='block-island-photo-20261018-seen';
const updateDialog=$('update-dialog');
function dismissUpdateNotice(){try{localStorage.setItem(UPDATE_NOTICE_KEY,'true');}catch{}try{if(updateDialog?.open)updateDialog.close();}catch{}}
$('update-open')?.addEventListener('click',()=>{try{updateDialog?.showModal();}catch{}});
$('update-close')?.addEventListener('click',dismissUpdateNotice);
$('update-start-btn')?.addEventListener('click',dismissUpdateNotice);
updateDialog?.addEventListener('cancel',e=>{e.preventDefault();dismissUpdateNotice();});
try{if(localStorage.getItem('block-island-update-v55-seen'))localStorage.setItem('block-island-update-v54-seen','true');if(!localStorage.getItem(UPDATE_NOTICE_KEY)){updateDialog?.showModal();}}catch{}
refreshTimeControls();
mountVoiceSettings();
function makeDraggable(el,storageKey){
 if(!el)return;
 el.style.touchAction='none';
 el.style.userSelect='none';
 el.style.webkitUserSelect='none';
 let dragging=false,startX=0,startY=0,startLeft=0,startTop=0,hasMoved=false;
 if(storageKey){
  try{
   const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');
   if(saved&&typeof saved.left==='number'&&typeof saved.top==='number'){
    const isForced=document.body.classList.contains('force-landscape');
    const maxX=Math.max(0,(isForced?window.innerHeight:window.innerWidth)-80);
    const maxY=Math.max(0,(isForced?window.innerWidth:window.innerHeight)-40);
    const clampX=Math.min(Math.max(6,saved.left),maxX);
    const clampY=Math.min(Math.max(50,saved.top),maxY);
    el.style.setProperty('left',clampX+'px','important');
    el.style.setProperty('top',clampY+'px','important');
    el.style.setProperty('right','auto','important');
    el.style.setProperty('bottom','auto','important');
   }
  }catch(_){}
 }
 const onPointerDown=e=>{
  if(e.button!==undefined&&e.button!==0)return;
  if(e.isPrimary===false)return;
  dragging=true;hasMoved=false;
  startX=e.clientX;startY=e.clientY;
  const isForced=document.body.classList.contains('force-landscape');
  const rect=el.getBoundingClientRect();
  startLeft=isForced?el.offsetLeft:(rect.left||el.offsetLeft);
  startTop=isForced?el.offsetTop:(rect.top||el.offsetTop);
  // Capture only after a drag starts, so a tap still reaches child buttons.
 };
 const onPointerMove=e=>{
  if(!dragging)return;
  const isForced=document.body.classList.contains('force-landscape');
  const rawDx=e.clientX-startX,rawDy=e.clientY-startY;
  const dx=isForced?rawDy:rawDx,dy=isForced?-rawDx:rawDy;
  if(!hasMoved&&Math.hypot(rawDx,rawDy)>6){
   hasMoved=true;
   try{el.setPointerCapture(e.pointerId);}catch(_){}
   el.style.cursor='grabbing';
  }
  if(hasMoved){
   const newLeft=startLeft+dx,newTop=startTop+dy;
   const maxX=Math.max(0,(isForced?window.innerHeight:window.innerWidth)-(el.offsetWidth||100));
   const maxY=Math.max(0,(isForced?window.innerWidth:window.innerHeight)-(el.offsetHeight||40));
   const clampX=Math.min(Math.max(6,newLeft),maxX);
   const clampY=Math.min(Math.max(50,newTop),maxY);
   el.style.setProperty('left',clampX+'px','important');
   el.style.setProperty('top',clampY+'px','important');
   el.style.setProperty('right','auto','important');
   el.style.setProperty('bottom','auto','important');
  }
 };
 const onPointerUp=e=>{
  if(!dragging)return;
  dragging=false;
  el.style.cursor='grab';
  try{el.releasePointerCapture(e.pointerId);}catch(_){}
  if(hasMoved&&storageKey){
   try{
    const isForced=document.body.classList.contains('force-landscape');
    const rect=el.getBoundingClientRect();
    const curLeft=isForced?el.offsetLeft:(rect.left||el.offsetLeft);
    const curTop=isForced?el.offsetTop:(rect.top||el.offsetTop);
    sessionStorage.setItem(storageKey,JSON.stringify({left:curLeft,top:curTop}));
   }catch(_){}
  }
 };
 el.addEventListener('pointerdown',onPointerDown);
 el.addEventListener('pointermove',onPointerMove);
 el.addEventListener('pointerup',onPointerUp);
 el.addEventListener('pointercancel',onPointerUp);
 el.addEventListener('click',e=>{
  if(hasMoved){
   e.preventDefault();
   e.stopPropagation();
   e.stopImmediatePropagation();
   hasMoved=false;
  }
 },true);
}
makeDraggable($('island-tasks'),'pos_island_tasks');
makeDraggable($('quest-tracker'),'pos_quest_tracker');
makeDraggable($('survival-goal'),'pos_survival_goal');
saves=createCloudSaves({capture:captureSave,apply:applySave,hasStarted:()=>started,pause:()=>{const was=active;pauseForPanel();return was},resume:enter,notify});
$('play').disabled=false;$('play').innerHTML='进入我的小岛 · 开启旅程 <span>→</span>';
const wayfindingLabels=scene.children.filter(o=>o.isSprite&&o.userData.wayfinding);
streetBounce=createNanjingBakedLight();streetBounce.bakeScene(scene);streetBounce.setNight(dayClock>=120);
photo=createPhotoMode({scene,camera,renderer,canvas,world,getPos:()=>pos,getYaw:()=>yaw,pause:pauseForPanel,resume:enter,canOpen:()=>started&&active&&!story?.filming&&!commute?.isRiding()&&!metro?.isRiding()&&!yuyuan?.isRiding()&&!activity?.isRiding()&&!gliding,notify,beforeRender:()=>{outline.visible=false;}});
$('photo-open').onclick=()=>photo.open();
const sceneInstances=createSceneInstances(scene);
requestAnimationFrame(frame);



function unlockAudioGestures(){
 try{
  const ctx=getAudio();
  if(ctx&&ctx.state==='suspended')ctx.resume();
  if(active){music.start();sceneAudio.start();}
 }catch(_){}
}
window.addEventListener('touchstart',unlockAudioGestures,{passive:true});
window.addEventListener('touchend',unlockAudioGestures,{passive:true});
window.addEventListener('pointerdown',unlockAudioGestures,{passive:true});
document.addEventListener('click',e=>{
 unlockAudioGestures();
 if(e.target.closest('.dpad-btn, [data-key], #world, canvas'))return;
 if(e.target.closest('button, [role="button"], .slot, .recipe-card, .quest-row, .action-btn, .touch-chip, .hud-sun-icon, .hud-moon-icon'))uiClick();
},{passive:true});
