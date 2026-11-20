import {createPointerRecovery} from './pointer-recovery.js';
import {isMobileDevice} from './device-input.js';
import {createContextGuide} from './context-guide.js';
import {installTouchCalloutGuard} from './touch-callout.js';
import {createMobileLayout} from './mobile-layout.js';
import {changedEditChunks} from './edited-chunks.js';
import {createPerformanceProbe} from './performance-probe.js';
import {startShaderWarmup} from './shader-warmup.js';
import {createTouchMovement,movementAxes} from './touch-movement.js';
import {renderProfile,createFramePacer,needsChunkPlan,mobileChunkDistances} from './mobile-performance.js';
import {oldPearlLanding,PEARL_DECK} from './pearl-observation-layout.js';
import {createTowerInteriors} from './tower-interiors.js';
import {createPhotoMode} from './photo-mode.js';
import {createNanjingBakedLight,createVertexLightBake} from './nanjing-baked-light.js';
import {createShanghaiJourney} from './shanghai-journey.js';
import {createSceneInstances} from './scene-instancing.js';
import {createStaticWallCull} from './voxel-wall-occlusion.js';
import {createMetroPanelOcclusion} from './metro-panel-occlusion.js';
import {prepareStreetTextureBitmaps} from './street-texture-bitmaps.js';
import {holdRestoredEntryPhoto,stageStartupHud,warmBundStreet,warmStartupTextures,warmStartupViews} from './startup-view-warmup.js';
import {batchDualMaterialSigns,batchSingleMaterialSigns} from './street-sign-batch.js';
import {updateHudHidden,updateHudText} from './hud-text.js';
import {createMetroRoofOcclusion} from './metro-roof-occlusion.js';
import {createSimulationInterest} from './simulation-interest.js';
import {createWorldBaseline} from './world-baseline.js';
import {runPlayerInteraction} from './interaction-routing.js';
import {blocksMetroClearance} from './metro-clearance.js';
import {registerBlockIcon} from './item-catalog.js';
import {createPlayerHandbook} from './player-handbook.js';
import {createSettingsPanel} from './settings-panel.js';
import {createChunkMesher,createChunkQueue} from './chunk-work.js';
import {addScenicLandmarkChunks} from './scenic-chunks.js';
import {createDistantGround} from './distant-ground.js';
import {EXPO,expoChunk,expoShade,addExpoLandmarkChunks} from './expo-layout.js';
import {CENTURY_PARK,centuryParkChunk,centuryParkShade,addCenturyParkApproachChunks} from './century-park.js';
import {FUXING_PARK,fuxingParkChunk,fuxingParkTile,drawFuxingParkTiles} from './puxi-south-layout.js';
import {JINGAN,JINGAN_OFFICES,jinganChunk,jinganShade,addJinganBackdropChunks} from './jingan-layout.js';
import {NANJING_WEST,nanjingWestChunk,nanjingWestShade,nanjingWestTile,drawNanjingWestTile} from './nanjing-west-layout.js';
import {beijingEastChunk,beijingEastTile,beijingEastLightBounds,beijingEastLightSources} from './beijing-east-layout.js';
import {jiujiangHankouChunk,jiujiangHankouTile,jiujiangHankouLightBounds,jiujiangHankouLightSources,drawBookshopTile,HISTORIC_STREET_SIGNS} from './jiujiang-hankou-layout.js';
import {createJinganNight} from './jingan-night.js';
import {addJinganEaves} from './jingan-eaves.js';
import {createJinganOfficeTiles,drawJinganOfficeTiles} from './jingan-office.js';
import {createJinganUplighting,jinganLightChunk} from './jingan-uplighting.js';
import {addCenturyParkDetails} from './century-park-details.js';
import {XINTIANDI,xintiandiChunk,xintiandiShade} from './xintiandi-layout.js';
import {addXintiandiPlaques} from './xintiandi-signs.js';
import {SIHANG,sihangChunk,sihangShade} from './sihang-layout.js';
import {addSihangDetails} from './sihang-details.js';
import {WUKANG,PUXI_RESIDENCES,wukangChunk,wukangShade,wukangTreeTile} from './wukang-layout.js';
import {drawPlaneTreeTiles} from './plane-tree-tiles.js';
import {createWukangShopkeepers} from './wukang-street-life.js';
import {westStreetChunk,westStreetShade,expoStreetShade} from './city-layout.js';
import {createParkLife} from './park-life.js';
import {createWorldCaption} from './world-caption.js';
import {menuVisibleChunks} from './menu-background.js';
import {createRainCrowd,rainExposure} from './rain-crowd.js';
import {createQuestJournal} from './quest-journal.js';
import {mountVoiceSettings} from './voice-settings.js';
import * as THREE from './three.module.js';
import {snapMetroFloor} from './metro-floor.js';
import {createYuyuan} from './yuyuan.js';
import {createRiverWaterGeometry} from './yuyuan-water.js';
import {GARDEN_PONDS,YUYUAN_SHIFT} from './yuyuan-layout.js';
import {createMetroNetwork as createMetro} from './metro-network.js';
import {boatSurfaces,createBoatSurfaceQueries,boatWorld} from './boat-support.js';
import {createPrivateSuites} from './private-suites.js';
import {createBuildingResidents} from './building-residents.js';
import {loadWorld,clearWorldCache} from './world-cache.js';
import {primeGameAudioContext} from './audio-context.js';
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
import {createWeather,setOutdoorFogRange,WeatherState} from './weather.js';
import {clockLabel,clockMinutes,phaseFromMinutes,clockOptions,advanceDay} from './day-time.js';
import {migrateWestBankSave,migrateSouthIslandsSave} from './city-migration.js';
import {CITY,PEARL,MAP_REVISION,riverCenter,riverWestEdge,riverEastEdge} from './shanghai-map.js';
import {swimVelocity,isSwimming,movementSpeed} from './survival-state.js';
import {VoxelWorld,SIZE,WORLD_MIN,WORLD_MIN_Z,WORLD_MAX,HEIGHT,CHUNK,BLOCKS,overlaps,trace,LANDMARKS,COURSE,courseById,WORLD_SHIFT,WATER_LEVEL} from './world.js';
const $=id=>document.getElementById(id),canvas=$('world');canvas.tabIndex=0;
const hudTextEls=new Map();
const hudText=(id,text)=>{let el=hudTextEls.get(id);if(!el){el=$(id);if(el)hudTextEls.set(id,el);}updateHudText(el,text);};
let bootReady=false,mobileLayout,touchMovement,performanceProbe=null;
async function loadingStage(message){
 hudText('play',message);
 // Let the loading message paint between the existing construction stages.
 // The timer also permits loading in a background tab where rAF is throttled.
 await new Promise(resolve=>{const timer=setTimeout(resolve,80);requestAnimationFrame(()=>requestAnimationFrame(()=>{clearTimeout(timer);resolve();}));});
}
document.body.classList.add('in-menu');
const isMobile=isMobileDevice(navigator,window.matchMedia?.bind(window));
let touch=false;
function updateOrientationUI(){
 const isForced=document.body.classList.contains('force-landscape'),landscapePreferred=mobileLayout?.landscape??isForced;
 const portrait=!isForced&&(window.innerHeight>window.innerWidth);
 const tip=$('orientation-tip');
 if(tip)tip.hidden=!touch||!portrait||tip.dataset.dismissed==='true';
 const fsBtn=$('mobile-fullscreen');
 if(fsBtn){
  fsBtn.hidden=!touch;
  fsBtn.textContent=landscapePreferred?'📱 竖屏':'📱 横屏';
  fsBtn.title=landscapePreferred?'切回竖屏模式':'切换横屏模式';
 }
 const menuFs=$('mobile-menu-fullscreen');
 if(menuFs)menuFs.textContent=landscapePreferred?'📱 切回竖屏模式':'📱 切换横屏模式';
}
function setForceLandscape(enable){
 if(mobileLayout)mobileLayout.setLandscape(enable);else document.body.classList.toggle('force-landscape',Boolean(enable));
 onResize();
}
function toggleForceLandscape(){
 setForceLandscape(!(mobileLayout?.landscape??document.body.classList.contains('force-landscape')));
}
async function toggleLandscapeFullscreen(){
 toggleForceLandscape();
 if(mobileLayout?.landscape)await mobileLayout.requestNative();
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
 if(touch)return;
 touch=true;
 document.body.classList.add('touch');
 if($('run-status'))$('run-status').hidden=true;
 if($('device-note'))$('device-note').textContent='左下角移动 · 右侧滑动环顾视角';
 updateOrientationUI();
}
if(isMobile)enableTouch();
window.addEventListener('touchstart',enableTouch,{passive:true});
// On hybrid computers, return to keyboard/mouse controls when they are used.
function useDesktopInput(){if(isMobile||!touch)return;touch=false;touchMovement?.reset();document.body.classList.remove('touch');updateOrientationUI();}
window.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse')useDesktopInput();},{passive:true});
window.addEventListener('keydown',useDesktopInput);
const isWeChat=typeof navigator!=='undefined'&&/MicroMessenger/i.test(navigator.userAgent);
let deviceStorage;try{deviceStorage=localStorage;}catch{}
if(isMobile){mobileLayout=createMobileLayout({body:document.body,view:()=>({width:innerWidth,height:innerHeight}),document,orientation:screen.orientation,storage:deviceStorage});updateOrientationUI();}
let mobileQuality='smooth';try{if(localStorage.getItem('block-island-mobile-quality-v1')==='clear')mobileQuality='clear';}catch{}
const mobilePacer=createFramePacer();
const initialRenderProfile=renderProfile({mobile:isMobile,mode:mobileQuality,dpr:devicePixelRatio,width:innerWidth,height:innerHeight});
$('play').textContent='正在初始化画面…';
let renderer;
try{
 renderer=new THREE.WebGLRenderer({
  canvas,
  antialias:initialRenderProfile.antialias,
  powerPreference:'high-performance',
  logarithmicDepthBuffer:true,
  precision:'highp'
 });
}catch(e){
 renderer=new CanvasRenderer({canvas});
 $('render-mode').textContent='兼容画质 · 无需显卡加速';
}
if(renderer.debug)renderer.debug.checkShaderWarnings=false;
const initialForced=document.body.classList.contains('force-landscape');
let renderWidth=initialForced?innerHeight:innerWidth,renderHeight=initialForced?innerWidth:innerHeight,renderPixelRatio=initialRenderProfile.pixelRatio;
renderer.setPixelRatio(initialRenderProfile.pixelRatio);
renderer.setSize(renderWidth,renderHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;
if(isMobile&&$('render-mode'))$('render-mode').textContent=isWeChat?'微信触控模式':'移动端触控模式';
let streetBounce=null,photo=null,rainCrowd=null,jinganNight=null;
const scene=new THREE.Scene();scene.background=new THREE.Color('#a0d6ed');scene.fog=new THREE.Fog('#a0d6ed',isMobile?36:48,isMobile?150:190);
const camera=new THREE.PerspectiveCamera(72,initialForced?innerHeight/innerWidth:innerWidth/innerHeight,0.06,270);camera.rotation.order='YXZ';camera.userData.probeYuyuanExpandedCull=true;
const simulationInterest=createSimulationInterest(camera,()=>pos);
const ambient=new THREE.HemisphereLight('#fff9dd','#6d9277',1.6);scene.add(ambient);
const sun=new THREE.DirectionalLight('#fff0c7',1.5);sun.position.set(-20,65,30);scene.add(sun);
const world=await loadWorld(message=>{$('play').textContent=message;}),initialWorld=createWorldBaseline(world.data,world.baseline),savedEdits=new Map();let adventure,saves,life,skyline,civil,weather,restaurant,activity,commute,npcGuides,metro,quests,handbook,yuyuan,story;let runLocked=false,isScrubbingTime=false;
const atlasCanvas=document.createElement('canvas');atlasCanvas.width=16*14;atlasCanvas.height=32;const ctx=atlasCanvas.getContext('2d');
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
drawPlaneTreeTiles(ctx);
drawJinganOfficeTiles(ctx);
drawFuxingParkTiles(ctx);
drawNanjingWestTile(ctx);
drawBookshopTile(ctx);
const atlas=new THREE.CanvasTexture(atlasCanvas);atlas.magFilter=THREE.NearestFilter;atlas.minFilter=THREE.NearestFilter;atlas.colorSpace=THREE.SRGBColorSpace;
const terrainMaterial=new THREE.MeshLambertMaterial({map:atlas,vertexColors:true});
const chunks=new Map(),chunksByNum=new Map(),chunkNum=(cx,cz)=>(cx+4096)*8192+(cz+4096);
function skipHiddenMatrices(obj){if(!obj||obj.userData.skipHiddenMatrices)return obj;obj.userData.skipHiddenMatrices=true;const update=obj.updateMatrixWorld;let skipped=false;obj.updateMatrixWorld=function(force){if(!this.visible){skipped=true;return;}update.call(this,force||skipped);skipped=false;};return obj;}
const distantGround=createDistantGround({scene,world,chunks,chunk:CHUNK,height:HEIGHT,minX:WORLD_MIN,minZ:WORLD_MIN_Z,max:WORLD_MAX,water:WATER_LEVEL,colors:BLOCKS.map(b=>b?.color),range:camera.far,tint:terrainMaterial.color});
const jinganWash=createJinganUplighting();
const beijingEastWash=createVertexLightBake({bounds:beijingEastLightBounds,sources:beijingEastLightSources,cap:.62,gain:6.2});
const jiujiangHankouWash=createVertexLightBake({bounds:jiujiangHankouLightBounds,sources:jiujiangHankouLightSources,cap:.62,gain:6.2});
const beijingEastFacadeChunk=(cx,cz)=>(cz===0||cz===1)&&beijingEastChunk(cx,cz,CHUNK);
const puxiTerrainShade=(x,y,z,id)=>jinganShade(x,y,z,id)??xintiandiShade(x,y,z,id)??wukangShade(x,y,z,id)??westStreetShade(x,y,z,id);
const nanjingWestTerrainShade=(x,y,z,id)=>nanjingWestShade(x,y,z,id)??puxiTerrainShade(x,y,z,id);
const expoTerrainShade=(x,y,z,id)=>expoStreetShade(x,y,z,id)??expoShade(x,y,z,id);
function chunkShade(cx,cz){
 if(sihangChunk(cx,cz,CHUNK))return sihangShade;
 if(nanjingWestChunk(cx,cz,CHUNK))return nanjingWestTerrainShade;
 if(jinganChunk(cx,cz,CHUNK)||wukangChunk(cx,cz,CHUNK)||xintiandiChunk(cx,cz,CHUNK))return puxiTerrainShade;
 if(centuryParkChunk(cx,cz,CHUNK))return centuryParkShade;
 if(expoChunk(cx,cz,CHUNK))return expoTerrainShade;
 if(westStreetChunk(cx,cz,CHUNK))return westStreetShade;
}
function chunkTask(key){
 const [cx,cz]=key.split(',').map(Number);
 const officeTiles=jinganChunk(cx,cz,CHUNK)?createJinganOfficeTiles(JINGAN_OFFICES,cx,cz,CHUNK):undefined;
 const tileOverride=jiujiangHankouChunk(cx,cz,CHUNK)?jiujiangHankouTile:beijingEastFacadeChunk(cx,cz)?beijingEastTile:cz===0&&nanjingWestChunk(cx,cz,CHUNK)?
  (x,y,z,id)=>nanjingWestTile(x,y,z,id)??officeTiles?.(x,y,z,id):
  officeTiles??(fuxingParkChunk(cx,cz,CHUNK)?fuxingParkTile:wukangChunk(cx,cz,CHUNK)?wukangTreeTile:undefined);
 return createChunkMesher({world,cx,cz,chunk:CHUNK,height:HEIGHT,shade:chunkShade(cx,cz),atlasRows:2,tileOverride,compact:true,skip:(x,y,z,id)=>id===9&&nanpuDeckCell(x,y,z)});
}
const chunkWork=createChunkQueue({has:key=>chunks.has(key),create:chunkTask,commit:(key,data)=>installChunk(key,data)});
function rebuild(cx,cz){
 if(cx<WORLD_MIN/CHUNK||cz<WORLD_MIN_Z/CHUNK||cx>=WORLD_MAX/CHUNK||cz>=WORLD_MAX/CHUNK)return;
 const key=cx+','+cz;chunkWork.cancel(key);const task=chunkTask(key);while(!task.step(256)){}installChunk(key,task.data);
}
function installChunk(key,{p,norm,uv,col,indices}){
 const [cx,cz]=key.split(',').map(Number),old=chunks.get(key);
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(p,3));geo.setAttribute('normal',new THREE.BufferAttribute(norm,3,norm instanceof Int8Array));geo.setAttribute('uv',new THREE.BufferAttribute(uv,2));geo.setAttribute('color',new THREE.BufferAttribute(col,3));geo.setIndex(new THREE.BufferAttribute(indices,1));geo.computeBoundingSphere();
 const mesh=new THREE.Mesh(geo,terrainMaterial);
 if(beijingEastFacadeChunk(cx,cz))beijingEastWash.bakeMesh(mesh);
 if(jiujiangHankouChunk(cx,cz,CHUNK))jiujiangHankouWash.bakeMesh(mesh);
 if(chunkShade(cx,cz))mesh.userData.rgbColors=true;streetBounce?.bakeMesh(mesh);if(jinganLightChunk(cx,cz,CHUNK))jinganWash.bakeMesh(mesh);mesh.userData.range=(cz*CHUNK>=-160&&cz*CHUNK<=242)||Object.values(CITY).some(p=>Math.abs((cx+.5)*CHUNK-p.x)<28&&Math.abs((cz+.5)*CHUNK-p.z)<28)||ALL_BUILDINGS.some(b=>Math.abs((cx+.5)*CHUNK-b.x)<24&&Math.abs((cz+.5)*CHUNK-b.z)<24)?280:130;mesh.matrixAutoUpdate=false;if(old){scene.remove(old);old.geometry.dispose();}scene.add(mesh);chunks.set(key,mesh);chunksByNum.set(chunkNum(cx,cz),mesh);distantGround.update(key);
}
function retainChunk(key,point,cx,cz,nearbyBuildings){const [x,z]=key.split(',').map(Number);const maxRetain=isMobile?4:6;if(Math.abs(x-cx)<=maxRetain&&Math.abs(z-cz)<=maxRetain)return true;if(isMobile)return false;if(!isMobile&&x>=7&&x<=18&&z>=1&&z<=14)return true;const chunkX=(x+.5)*CHUNK,chunkZ=(z+.5)*CHUNK;const buildings=nearbyBuildings||ALL_BUILDINGS;if(buildings.some(b=>Math.abs(chunkX-b.x)<24&&Math.abs(chunkZ-b.z)<24&&(!nearbyBuildings||Math.hypot(point.x-b.x,point.z-b.z)<(isMobile?220:315))))return true;if(Object.values(CITY).some(p=>Math.abs(chunkX-p.x)<28&&Math.abs(chunkZ-p.z)<28&&Math.hypot(point.x-p.x,point.z-p.z)<(isMobile?260:380)))return true;return false;}
let lastChunkPlan=null;
const wukangShops=createWukangShopkeepers();
function addJinganDetails(group){
 const eaves=addJinganEaves(group);
 eaves.updateWorldMatrix(true,false);
 jinganWash.bakeMesh(eaves,{strength:.24});
 jinganNight=createJinganNight(group,world);
 jinganNight.visible=dayClock>=120;
}
function addExhibitionStar(group){
 const shape=new THREE.Shape();
 for(let point=0;point<10;point++){
  const angle=Math.PI/2+point*Math.PI/5,radius=point%2?.56:1.22;
  const x=Math.cos(angle)*radius,y=Math.sin(angle)*radius;
  if(point===0)shape.moveTo(x,y);else shape.lineTo(x,y);
 }
 shape.closePath();
 const star=new THREE.Mesh(new THREE.ExtrudeGeometry(shape,{depth:.32,bevelEnabled:false}),new THREE.MeshBasicMaterial({color:0xc1282e}));
 const {x,y,z}=NANJING_WEST.spire;
 star.position.set(x,y,z-.16);
 star.updateMatrix();star.matrixAutoUpdate=false;
 group.add(star);
}
const regionalSigns=[[EXPO,28,4.6],[CENTURY_PARK,20,5,addCenturyParkDetails],[XINTIANDI,32,4.7,addXintiandiPlaques],[WUKANG,13,4.2,wukangShops.decorate,wukangShops.setNear],[PUXI_RESIDENCES,10,3.5],[FUXING_PARK,10,4.2],[JINGAN,18,5,addJinganDetails],[NANJING_WEST,45,6,addExhibitionStar],[SIHANG,18,4.7,addSihangDetails],
 ...HISTORIC_STREET_SIGNS.map(district=>[district,18,5.6])]
 .map(([region,margin,width,decorate,setNear])=>({region,margin,width,decorate,setNear,group:null}));
function updateRegionalSigns(point){
 for(const entry of regionalSigns){
  const {minX,maxX,minZ,maxZ}=entry.region.bounds,margin=entry.margin;
  const near=point.x>=minX-margin&&point.x<=maxX+margin&&point.z>=minZ-margin&&point.z<=maxZ+margin;
  if(near&&!entry.group){
   entry.group=new THREE.Group();skipHiddenMatrices(entry.group);
   for(const [x,y,z,text] of entry.region.signs){
    const sign=createWorldCaption(text,{width:entry.width});
    sign.position.set(x,y,z);sign.updateMatrix();sign.matrixAutoUpdate=false;entry.group.add(sign);
   }
   entry.decorate?.(entry.group);
   scene.add(entry.group);
  }
  if(entry.group&&entry.group.visible!==near){entry.group.visible=near;entry.setNear?.(near);}
 }
}
function ensureChunks(point,force=false,immediate=false){if(isMobile&&!needsChunkPlan(lastChunkPlan,point,force,immediate))return;lastChunkPlan={x:point.x,y:point.y,z:point.z};updateRegionalSigns(point);const cx=Math.floor(point.x/CHUNK),cz=Math.floor(point.z/CHUNK),needed=new Set();const lookRadius=isMobile?mobileChunkDistances.nearRadius:5,maxDist=isMobile?mobileChunkDistances.buildingRange:360;for(let x=cx-lookRadius;x<=cx+lookRadius;x++)for(let z=cz-lookRadius;z<=cz+lookRadius;z++)if(x>=WORLD_MIN/CHUNK&&z>=WORLD_MIN_Z/CHUNK&&x<WORLD_MAX/CHUNK&&z<WORLD_MAX/CHUNK)needed.add(x+','+z);for(const p of Object.values(CITY))if(Math.hypot(point.x-p.x,point.z-p.z)<(isMobile?mobileChunkDistances.landmarkRange:maxDist))for(let x=Math.floor((p.x-14)/CHUNK);x<=Math.floor((p.x+14)/CHUNK);x++)for(let z=Math.floor((p.z-14)/CHUNK);z<=Math.floor((p.z+14)/CHUNK);z++)needed.add(x+','+z);if(Math.hypot(point.x-LANDMARKS.tower.x,point.z-42)<(isMobile?240:340))for(let x=7;x<=8;x++)for(let z=1;z<=4;z++)needed.add(x+','+z);for(const b of ALL_BUILDINGS)if(Math.hypot(point.x-b.x,point.z-b.z)<(isMobile&&b.id==='pudong-infill-southeast-2'?260:maxDist))for(let x=Math.floor((b.x-9)/CHUNK);x<=Math.floor((b.x+9)/CHUNK);x++)for(let z=Math.floor((b.z-8)/CHUNK);z<=Math.floor((b.z+8)/CHUNK);z++)needed.add(x+','+z);for(let z=-144;z<=240;z+=16)for(const x of [riverWestEdge(z)-12,riverEastEdge(z)+12])if(Math.hypot(point.x-x,point.z-z)<maxDist){const sx=Math.floor(x/CHUNK),sz=Math.floor(z/CHUNK);for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)if(sx+dx>=WORLD_MIN/CHUNK&&sx+dx<WORLD_MAX/CHUNK&&sz+dz>=WORLD_MIN_Z/CHUNK&&sz+dz<WORLD_MAX/CHUNK)needed.add((sx+dx)+','+(sz+dz));}addExpoLandmarkChunks(needed,point,CHUNK);addCenturyParkApproachChunks(needed,point,CHUNK,lookRadius);addJinganBackdropChunks(needed,point,CHUNK,lookRadius);const scenicPriority=point.y>=60?new Set():null;addScenicLandmarkChunks(needed,point,CHUNK,scenicPriority);const nearbyBuildings=ALL_BUILDINGS.filter(b=>Math.hypot(point.x-b.x,point.z-b.z)<(isMobile?260:380));for(const [key,mesh] of chunks)if(!needed.has(key)&&!retainChunk(key,point,cx,cz,nearbyBuildings)){scene.remove(mesh);mesh.geometry.dispose();chunks.delete(key);const [dx,dz]=key.split(',').map(Number);chunksByNum.delete(chunkNum(dx,dz));distantGround.update(key);}chunkWork.setDesired(needed,point,CHUNK,force);
 if(scenicPriority?.size&&[...scenicPriority].some(key=>!chunks.has(key))){
  for(let x=cx-1;x<=cx+1;x++)for(let z=cz-1;z<=cz+1;z++)scenicPriority.add(x+','+z);
  chunkWork.prioritize(scenicPriority);
 }
 const isSkylineChunk=(x,z)=>(x>=7&&x<=18&&z>=1&&z<=14)||Object.values(CITY).some(p=>Math.abs((x+.5)*CHUNK-p.x)<=24&&Math.abs((z+.5)*CHUNK-p.z)<=24)||(x>=7&&x<=8&&z>=1&&z<=4);if(immediate)for(const key of needed)if(force||!chunks.has(key)){const [x,z]=key.split(',').map(Number);const maxImmediate=isMobile?1:3;if(!force&&(Math.abs(x-cx)>maxImmediate||Math.abs(z-cz)>maxImmediate)&&(isMobile||!isSkylineChunk(x,z)))continue;rebuild(x,z);}}

await Promise.race([new Promise(requestAnimationFrame),new Promise(r=>setTimeout(r,60))]);
if($('play'))$('play').textContent='正在加载地貌与建筑…';
ensureChunks(LANDMARKS.bund,false,true);
function updateBlock(x,y,z,id){world.set(x,y,z,id);savedEdits.set(`${x},${y},${z}`,id);const affected=new Set([[x,z],[x-1,z],[x+1,z],[x,z-1],[x,z+1]].map(([a,b])=>Math.floor(a/CHUNK)+','+Math.floor(b/CHUNK)));for(const key of affected){distantGround.invalidate(key);chunkWork.invalidate(key);if(chunks.has(key))rebuild(...key.split(',').map(Number));}}
const water=new THREE.Mesh(createRiverWaterGeometry({size:SIZE*1.4,centerX:(WORLD_MIN+WORLD_MAX)/2,centerZ:(WORLD_MIN_Z+WORLD_MAX)/2,ponds:GARDEN_PONDS,shift:YUYUAN_SHIFT}),new THREE.MeshPhongMaterial({color:'#3daabe',transparent:true,opacity:.67,shininess:90,depthWrite:false,side:THREE.DoubleSide}));water.rotation.x=-Math.PI/2;water.position.set((WORLD_MIN+WORLD_MAX)/2,WATER_LEVEL,(WORLD_MIN_Z+WORLD_MAX)/2);water.updateMatrix();water.matrixAutoUpdate=false;scene.add(water);scene.userData.water=water;
const {clouds,cloudMat,bellyMat}=createClouds(camera);clouds.visible=!renderer.isSoftware;scene.add(clouds);
const sunBlock=new THREE.Mesh(new THREE.SphereGeometry(7,32,20),new THREE.MeshBasicMaterial({color:'#fff8ce'}));sunBlock.position.set(-12,43,-20);scene.add(sunBlock);
const outline=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.008,1.008,1.008)),new THREE.LineBasicMaterial({color:'#172e33',transparent:true,opacity:.8}));scene.add(outline);outline.visible=false;
let pendingMine=null,gliding=false;
const runtimeParams=new URLSearchParams(location.search);
let restoredEntryPhoto=null;
const silentPreview=runtimeParams.get('silent')==='1';
let selected=1,active=false,started=false,flying=false,grounded=false,footContact=false,vy=0,yaw=0,pitch=0,sound=!silentPreview,audioCtx=null,target=null,mined=0,placed=0;
let dragMode=false,fallback=false,dragging=false,lookPointer=null,lastLook=null,mouseHeld=-1,lastAction=0,toastTimer;
const pos={...LANDMARKS.bund},keys=new Set(),direction=new THREE.Vector3(),pressedAt=new Map(),releaseAt=new Map();
const inputKeys={has:key=>keys.has(key)||!!touchMovement?.has(key),axes:()=>movementAxes(keys,touchMovement?.vector)};
await loadingStage('正在准备外滩街景与交通…');
const testBundBatches=runtimeParams.get('test')==='1'&&runtimeParams.get('bundBatchCells')==='1';
civil=createBund({scene,world,simulationInterest,staticBatchCell:testBundBatches?192:0,batchProof:testBundBatches&&runtimeParams.get('bundBatchProof')==='1',onEvent:recordCityEvent,getPos:()=>pos,getObstacles:()=>[...(commute?.vehicles??[]),...(commute?.owners??[]),...(npcGuides?.actors.filter(a=>a.person)??[]),...(activity?.bundWalkers?.map(b=>({root:b.root,person:true}))??[])],notify,place:p=>{Object.assign(pos,p);vy=0;},setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;}});weather=createWeather({scene,camera,world,sunBlock,clouds,cloudMat,bellyMat,water,terrainMaterial});
let timeOptions=clockOptions(),lastClockLabel='';
let dayClock=36,lastSky=-1,talkDone=false,followDone=false,celebrated=false;
const cityMedia=createCityMedia({scene});
const companions=createCompanions(scene,world,notify,()=>{talkDone=true;updateTasks();beep(1)});
function updateTasks(){if(talkDone)quests?.record({type:'hello'});quests?.setBuildCount(placed);}
function interact(follow=false){runPlayerInteraction({life,companions,pos,camera,follow,notify,onFollow:()=>{followDone=true;updateTasks();}})}
function updateSky(dt){
 dayClock=advanceDay(dayClock,dt,timeOptions);
 const night=dayClock>=120;
 streetBounce?.setNight(night);jinganWash.setNight(night);beijingEastWash.setNight(night);jiujiangHankouWash.setNight(night);if(jinganNight)jinganNight.visible=night;
 const label=clockLabel(dayClock);if(label!==lastClockLabel){$('clock-quick').textContent=label+' · 调整时间';lastClockLabel=label;}const phase=dayClock/240,alt=Math.sin(phase*Math.PI*2),day=Math.max(0,alt);sun.intensity=.15+day*1.7;ambient.intensity=.48+day*1.2;sun.position.set(40+Math.cos(phase*Math.PI*2)*50,10+alt*65,30);sunBlock.position.copy(sun.position);scene.userData.softwareLight=.38+day*.62;const sky=new THREE.Color('#14233f').lerp(new THREE.Color('#9fd4e8'),Math.max(.08,day));if(alt>0&&alt<.3)sky.lerp(new THREE.Color('#eaae8c'),.3);const underground=metroInterior(pos)&&started;const underwater=!underground&&camera.position.y<WATER_LEVEL&&active;const scenic=started&&(privateSuites?.scenicView()||towerInteriors?.scenicView());scene.fog.near=underwater?0:scenic?64:48;scene.fog.far=underwater?(life?.state.equipped?55:20):(scenic?300:isMobile?150:250);scene.fog.color.copy(underwater?new THREE.Color('#3296a7'):sky);if(underground){scene.fog.near=8;scene.fog.far=105;scene.fog.color.set('#202c36');}water.visible=!underground;scene.background.copy(scene.fog.color);const segment=Math.floor(dayClock/60);if(segment!==lastSky){const skyTxt=['晴朗 · 上午','暖阳 · 午后','宁静 · 夜晚','夜色 · 深夜'][segment];$('daytime').textContent=skyTxt;const sDay=$('settings-daytime');if(sDay)sDay.textContent=skyTxt;lastSky=segment;}}

function notify(msg){$('toast').textContent=msg;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2400)}
function getAudio(){
 if(!sound)return null;
 audioCtx??=primeGameAudioContext();
 if(!audioCtx)return null;
 if(audioCtx.state==='suspended'){
  try{audioCtx.resume()?.catch(()=>{});}catch(_){}
 }
 return audioCtx;
}
function uiClick(){
 if(!sound)return;
 try{
  const ctx=getAudio();
  if(!ctx)return;
  if(ctx.state!=='running')return;
  const osc=ctx.createOscillator(),gain=ctx.createGain(),t=ctx.currentTime;
  osc.type='sine';
  osc.frequency.setValueAtTime(760,t);
  osc.frequency.exponentialRampToValueAtTime(360,t+0.04);
  gain.gain.setValueAtTime(.07,t);
  gain.gain.exponentialRampToValueAtTime(.001,t+0.04);
  osc.connect(gain);gain.connect(ctx.destination);
  osc.onended=()=>{osc.disconnect();gain.disconnect();};
  osc.start(t);osc.stop(t+0.042);
 }catch(_){}
}
const music=createMusic(getAudio);
$('sound').textContent=sound?'声音：开':'声音：关';
$('sound').setAttribute('aria-pressed',String(sound));
const sceneAudio=createSceneAudio(getAudio,{getPeople:()=>npcGuides?.actors??[],surfaceAt:p=>world.get(Math.floor(p.x),Math.floor(p.y-.05),Math.floor(p.z))});
let trafficHitUntil=0;
const trafficFlash=document.createElement('div');trafficFlash.className='traffic-hit';document.body.appendChild(trafficFlash);
let residents,privateSuites,towerInteriors,vesselQueries=createBoatSurfaceQueries([]);
function refreshMusic(){for(const id of ['music-toggle']){$(id).setAttribute('aria-pressed',String(music.enabled));$(id).title=music.enabled?'关闭背景音乐':'开启背景音乐'}$('music-toggle').textContent='音乐：'+(music.enabled?'开':'关');$('music-quick').textContent='下一首配乐';$('music-volume').value=Math.round(music.volume*100);$('music-percent').textContent=Math.round(music.volume*100)+'%';$('music-choice').value=music.track.id;$('music-quick').title='下一首：当前 '+music.track.name;}
$('music-toggle').onclick=()=>{music.setEnabled(!music.enabled);refreshMusic()};$('music-quick').onclick=()=>{music.nextTrack();refreshMusic();notify('BGM：'+music.track.name)};$('music-choice').value=music.track.id;$('music-choice').addEventListener('change',e=>{music.setTrack(e.target.value);refreshMusic()});$('music-volume').addEventListener('input',e=>{music.setVolume(Number(e.target.value)/100);refreshMusic()});refreshMusic();
function refreshSceneAudio(){$('music-auto').textContent='区域配乐：'+(music.automatic?'开':'关');$('music-auto').setAttribute('aria-pressed',String(music.automatic));$('ambient-toggle').textContent='环境音：'+(sceneAudio.enabled?'开':'关');$('ambient-toggle').setAttribute('aria-pressed',String(sceneAudio.enabled));$('footsteps-toggle').textContent='玩家脚步：'+(sceneAudio.footstepsEnabled?'开':'关');$('footsteps-toggle').setAttribute('aria-pressed',String(sceneAudio.footstepsEnabled));}
$('music-auto').onclick=()=>{music.setAutomatic(!music.automatic);refreshSceneAudio();};$('ambient-toggle').onclick=()=>{sceneAudio.setEnabled(!sceneAudio.enabled);refreshSceneAudio();};$('footsteps-toggle').onclick=()=>{sceneAudio.setFootstepsEnabled(!sceneAudio.footstepsEnabled);refreshSceneAudio();};$('music-choice').addEventListener('change',refreshSceneAudio);$('music-quick').addEventListener('click',refreshSceneAudio);refreshSceneAudio();
function beep(kind){if(!sound)return;try{audioCtx??=primeGameAudioContext();if(audioCtx.state==='suspended')audioCtx.resume()?.catch(()=>{});const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();osc.type='triangle';osc.frequency.setValueAtTime(kind?320:170,audioCtx.currentTime);osc.frequency.exponentialRampToValueAtTime(kind?130:60,audioCtx.currentTime+.09);gain.gain.setValueAtTime(.07,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.1);osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+.1)}catch{}}
for(let id=1;id<BLOCKS.length;id++){
 const button=document.createElement('button');button.className='slot'+(id===1?' active':'');button.title=`${id<=9?id:id===10?'0':id===11?'-':'='} · ${BLOCKS[id].name}`;button.setAttribute('aria-label',button.title);button.setAttribute('aria-pressed',id===1?'true':'false');
 const thumb=document.createElement('canvas');thumb.width=16;thumb.height=16;thumb.getContext('2d').drawImage(atlasCanvas,(id>=9?id+1:id-1)*16,0,16,16,0,0,16,16);
 registerBlockIcon(id,thumb.toDataURL());
 button.innerHTML=`<span class="num">${id<=9?id:id===10?'0':id===11?'-':'='}</span><img src="${thumb.toDataURL()}" alt=""><span class="infinity">∞</span>`;button.onclick=()=>select(id);$('hotbar').appendChild(button);
}
function select(id,clearHeld=true){uiClick();if(clearHeld)life?.clearHeld();selected=id;$('selected-name').textContent=BLOCKS[id].name;[...$('hotbar').children].forEach((e,i)=>{e.classList.toggle('active',i===id-1);e.setAttribute('aria-pressed',i===id-1?'true':'false')});}
function respawn(){adventure?.cancelRace();const home=life?.home();if(home&&!collides(home.x,home.y,home.z))teleport(home);else teleport(LANDMARKS.village);vy=0;yaw=0;pitch=-.08;notify(home?'已回到床旁':'已回到出生点');}
function toggleFly(){if(metro?.seat())return;if(commute?.isRiding()){notify('先按 V 离开载具，再切换飞行。');return;}if(life?.state.survival){notify('生存模式无法飞行；可以在暂停菜单切回创造模式。');return;}if(adventure?.state.race){notify('跑酷中暂时不能飞行，按 V 退出挑战。');return;}setFlight(!flying);notify(flying?'飞行模式开启 · 可点击“上升”与“下降”按键升降':'飞行模式已关闭');}
function openMenu(){pointerRecovery.hide();story?.suspend();refreshTimeControls();sceneAudio.suspend();metro?.suspend();if(active)saves?.save('auto');pendingMine=null;active=false;keys.clear();touchMovement?.reset();pressedAt.clear();releaseAt.clear();mouseHeld=-1;dragging=false;$('menu').classList.remove('hidden');document.body.classList.add('in-menu');$('menu-title').innerHTML=started?'歇一会儿。<br><em>世界在等你。</em>':'你的世界。<br><em>由你搭建。</em>';$('menu-description').innerHTML=started?`已挖掘 ${mined} 块 · 已放置 ${placed} 块<br>你的下一座建筑，会是什么？`:'初到上海，从一张明信片开始。<br>逛南京路，过江看陆家嘴，再到豫园喝一杯茶。';$('play').innerHTML=(started?'继续探索':'开启上海之旅')+'';$('play').focus();}
function recordCityEvent(e){quests?.record(e);story?.record(e);}
function enter(){if(!bootReady)return;document.documentElement.dataset.gameStarted='true';document.dispatchEvent(new Event('block-island-enter'));$('loading-music-credit')?.setAttribute('hidden','');mobilePacer.reset();active=true;if(!started){teleport(LANDMARKS.bund);lookTowards({x:201,y:76,z:88});started=true;}document.body.classList.remove('in-menu');$('menu').classList.add('hidden');beep(1);music.start();sceneAudio.start();if(story?.maybeStart())return;canvas.focus();if(cursorFree)setFreeCursor(false,false);if(!touch&&!dragMode&&document.pointerLockElement!==canvas){try{const result=canvas.requestPointerLock?.();if(result?.catch)result.catch(()=>{fallback=true;pointerRecovery.show();});if(!canvas.requestPointerLock){fallback=true;notify('按住鼠标拖动环顾 · Q 挖掘，E 放置');}}catch{fallback=true;pointerRecovery.show();}}}
$('play').onclick=async()=>{if(!bootReady)return;if(isMobile)void mobileLayout?.requestNative().then(onResize);try{const ctx=getAudio();if(ctx&&ctx.state==='suspended')ctx.resume()?.catch(()=>{});}catch(_){}if(started){enter();return;}$('play').disabled=true;$('play').textContent='正在找回你的小岛…';try{let restored=false;try{restored=await (saves?.continueLatest?.()??Promise.resolve(false));}catch(error){notify(error.message||'存档读取失败，请稍后重试。');return;}if(!restored&&!started)enter();}finally{$('play').disabled=false;$('play').textContent=started?'继续探索':'重试读取存档';}};$('pause').onclick=()=>{document.exitPointerLock?.();openMenu()};$('respawn').onclick=()=>{respawn();enter()};$('sound').onclick=()=>{sound=!sound;music.setSound(sound);if(sound){music.start();if(active)sceneAudio.start();}if(!sound){story?.suspend();sceneAudio.suspend();metro?.suspend();}$('sound').textContent='声音：'+(sound?'开':'关');$('sound').setAttribute('aria-pressed',String(sound))};
let cursorFree=false,settingsPanel;
const pointerRecovery=createPointerRecovery({document,canvas,eligible:()=>active&&!touch&&!dragMode&&!cursorFree&&!isAnyDialogOpen()});
function isAnyDialogOpen(){return Boolean($('settings-dialog')?.open||$('tasks-dialog')?.open||quests?.isPanelOpen?.()||npcGuides?.isPanelOpen?.()||activity?.isPanelOpen?.()||restaurant?.isPanelOpen?.()||skyline?.isPanelOpen?.()||life?.isPanelOpen?.()||adventure?.isPanelOpen?.()||document.querySelector?.('dialog[open]'));}
function setFreeCursor(free,request=true){
 cursorFree=Boolean(free);
 const pill=$('cursor-toggle');
 if(pill){
  pill.classList.toggle('active',cursorFree);
  pill.textContent=cursorFree?'Alt 光标已释放':'Alt 鼠标';
  pill.title=cursorFree?'当前已释放鼠标光标，可自由点击按钮。点击画面或按 Alt 锁定视角':'按 Alt 键或点击此处释放光标，可自由点击HUD控件';
 }
 document.body.classList.toggle('cursor-free',cursorFree);
 if(cursorFree){
  pointerRecovery.hide();document.exitPointerLock?.();
 }else if(request&&active&&!touch&&!dragMode){
  try{const result=canvas.requestPointerLock?.();result?.catch?.(()=>{fallback=true;pointerRecovery.show();});}catch{fallback=true;pointerRecovery.show();}
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
document.addEventListener('pointerlockerror',()=>{fallback=true;pointerRecovery.show();});
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
function tickMining(dt){if(pendingMine){const key=target?target.x+','+target.y+','+target.z:null;if(key!==pendingMine.key||world.get(pendingMine.x,pendingMine.y,pendingMine.z)!==pendingMine.id)pendingMine=null;else{pendingMine.progress+=dt;if(pendingMine.progress>=pendingMine.duration){breakBlock(pendingMine);pendingMine=null;}}}updateHudHidden($('mining-progress'),!pendingMine);if(pendingMine){$('mining-fill').style.width=Math.min(100,pendingMine.progress/pendingMine.duration*100)+'%';updateHudText($('mining-label'),'采集 '+BLOCKS[pendingMine.id].name);}}
function toggleGlider(){if(metro?.isRiding()){notify('先到站下车，再使用滑翔伞。');return;}if(commute?.isRiding()){notify('先按 V 离开载具，再使用滑翔伞。');return;}if(yuyuan?.isRiding()){notify('先下黄包车，再使用滑翔伞。');return;}if(adventure?.state.race){notify('跑酷中不能滑翔。');return;}if(!life.state.glider){notify('到上海中心巅峰观景台领取滑翔伞，或按 C 制作。');return;}gliding=!gliding;if(gliding){setFlight(false);vy=Math.max(vy,-2.2);}notify(gliding?'滑翔伞已展开！离开平台即可滑翔，WASD 转向，Shift 加快下降。':'已收起滑翔伞');}
function useScene(){if(commute?.beginTakeover()){if(commute.isRiding())contextGuide.used('car');return;}if(story?.use())return;if(metro?.use())return;if(activity?.isRiding()){activity.use();return;}if(civil?.use&&civil.use())return;if(towerInteriors?.use())return;if(privateSuites?.use())return;if(commute?.use())return;if(yuyuan?.use())return;if(npcGuides?.use())return;if(activity?.use())return;if(restaurant?.use())return;if(skyline?.use())return;if(!life.dockUse())adventure.use();}
installTouchCalloutGuard(document,{isTouch:()=>touch});
canvas.addEventListener('contextmenu',e=>e.preventDefault());
canvas.addEventListener('mousedown',e=>{if(!active||touch)return;if(cursorFree){setFreeCursor(false);return;}if(fallback&&!dragMode&&e.button===0&&canvas.requestPointerLock){try{canvas.requestPointerLock()?.catch?.(()=>{});}catch{}}if(fallback||dragMode){if(e.button===0)dragging=true;else if(e.button===2)edit(true);return;}if(e.button===0||e.button===2){mouseHeld=e.button;edit(e.button===2)}});
document.addEventListener('mouseup',()=>{mouseHeld=-1;dragging=false});
document.addEventListener('keydown',e=>{
 if(photo?.handleKey(e))return;
 if(story?.handleKey(e))return;
 if(e.code==='KeyO'&&!e.repeat&&started&&(active||handbook?.isPanelOpen())){e.preventDefault();handbook.openBackpack();return;}
 if(e.code==='Escape'&&handbook?.isPanelOpen()){e.preventDefault();handbook.close();return;}
 if((e.code==='AltLeft'||e.code==='AltRight'||e.key==='Alt')&&!e.repeat&&started&&active){e.preventDefault();toggleFreeCursor();return;}
 if(e.code==='KeyN'&&!e.repeat&&started&&active){e.preventDefault();story.openBook();return;}
 if(e.code==='KeyI'&&!e.repeat&&started&&(active||quests?.isPanelOpen())){e.preventDefault();quests.open();return;}
 if(e.code==='Escape'){if(cursorFree){e.preventDefault();setFreeCursor(false);return;}if(privateSuites?.isPanelOpen()){e.preventDefault();privateSuites.close();return;}if(towerInteriors?.isPanelOpen()){e.preventDefault();towerInteriors.close();return;}if(yuyuan?.isPanelOpen()){e.preventDefault();yuyuan.close();return;}if(quests?.isPanelOpen()){e.preventDefault();quests.close();return;}if(npcGuides?.isPanelOpen()){e.preventDefault();npcGuides.close();return;}if(activity?.isPanelOpen()){e.preventDefault();activity.close();return;}if(restaurant?.isPanelOpen()){e.preventDefault();restaurant.close();return;}if(skyline?.isPanelOpen()){e.preventDefault();skyline.close();return;}if(life?.isPanelOpen()){life.close();return;}if(adventure?.isPanelOpen()){adventure.close();return;}if(active){document.exitPointerLock?.();openMenu()}return;}if(!active)return;
 if(['Space','KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();if(!keys.has(e.code))pressedAt.set(e.code,performance.now());releaseAt.delete(e.code);keys.add(e.code);
 if(!e.repeat){if(/^Digit[1-3]$/.test(e.code)&&['bicycle','car'].includes(commute?.ride?.kind))return;if(/^Digit[1-9]$/.test(e.code))select(Number(e.code.at(-1)));if(e.code==='Digit0')select(10);if(e.code==='Minus')select(11);if(e.code==='Equal')select(12);if(e.code==='KeyV')useScene();if(e.code==='KeyP')toggleGlider();if(e.code==='KeyC')life.craft();if(e.code==='KeyZ')life.eat();if(e.code==='KeyL')life.dive();if(e.code==='KeyB')adventure.paint();if(e.code==='KeyM')adventure.map();if(e.code==='KeyK')adventure.launch();if(e.code==='KeyJ'){if(Math.hypot(pos.x-LANDMARKS.tower.x,pos.z-53)<6)adventure.launch();else companions.recall(pos);}if(e.code==='KeyF')toggleFly();if(e.code==='CapsLock'){runLocked=!runLocked;notify(runLocked?'持续跑步已开启；CapsLock 切回步行。':'已切回步行；按住 Shift 跑步。');}if(e.code==='KeyR')respawn();if(e.code==='KeyQ')edit(false);if(e.code==='KeyE')edit(true);if(e.code==='KeyG')interact();if(e.code==='KeyH')interact(true);if(e.code==='KeyT'&&!life.state.survival){dayClock=(Math.floor(dayClock/60)*60+60)%240+15;notify('已切换小岛时间');}}
});document.addEventListener('keyup',e=>{const remaining=100-(performance.now()-(pressedAt.get(e.code)??0));if(remaining>0)releaseAt.set(e.code,performance.now()+remaining);else keys.delete(e.code)});
canvas.addEventListener('wheel',e=>{if(active){e.preventDefault();select(((selected-1+(e.deltaY>0?1:11))%12)+1)}},{passive:false});
window.addEventListener('blur',()=>{keys.clear();touchMovement?.reset();mouseHeld=-1;if(active){document.exitPointerLock?.();openMenu()}});
document.addEventListener('visibilitychange',()=>{music.update({playing:active||story?.filming,night:dayClock>=120,festival:adventure?.isShowActive(),hidden:document.hidden});if(document.hidden)sceneAudio.suspend();if(document.hidden&&active){document.exitPointerLock?.();openMenu()}});
for(const btn of document.querySelectorAll('[data-key]')){
 btn.addEventListener('pointerdown',e=>{e.preventDefault();btn.dataset.active='true';btn.setPointerCapture(e.pointerId);keys.add(btn.dataset.key)});
 for(const event of ['pointerup','pointercancel','lostpointercapture'])btn.addEventListener(event,()=>{delete btn.dataset.active;keys.delete(btn.dataset.key)});
}

const contextGuide=createContextGuide({document,storage:deviceStorage});let contextGuideClock=0;
for(const [id,key] of [['map-button','map'],['photo-open','photo'],['backpack-open','backpack'],['touch-run','run'],['touch-fly','fly'],['touch-fly-more','fly'],['firework-quick','fireworks'],['touch-firework','fireworks'],['touch-firework-more','fireworks']])$(id)?.addEventListener('click',()=>contextGuide.used(key));
window.addEventListener('keydown',e=>{const key=({AltLeft:'cursor',AltRight:'cursor',KeyM:'map',KeyO:'backpack',KeyF:'fly',KeyK:'fireworks',ShiftLeft:'run',ShiftRight:'run'})[e.code];if(key&&(key!=='cursor'||(started&&active&&cursorFree&&!e.repeat)))contextGuide.used(key);});
const touchStorage=deviceStorage;
touchMovement=createTouchMovement({pad:$('touch-joystick'),thumb:$('joystick-thumb'),select:$('touch-movement-choice'),body:document.body,storage:touchStorage,enabled:()=>active&&!story?.filming,rotated:()=>document.body.classList.contains('force-landscape'),onMode:mode=>{document.querySelector('.dpad-label').textContent=mode==='joystick'?'滑动移动':'方向键移动';if(touch)$('device-note').textContent=mode==='joystick'?'左下角摇杆移动 · 推远快走、轻推慢走 · 右侧滑动环顾':'左下角方向键移动 · 右侧滑动环顾视角';}});
$('mobile-quality-choice').value=mobileQuality;
$('mobile-quality-choice').addEventListener('change',e=>{mobileQuality=e.target.value==='clear'?'clear':'smooth';try{touchStorage?.setItem('block-island-mobile-quality-v1',mobileQuality);}catch{}mobilePacer.reset();onResize();});

for(const id of ['firework-quick','touch-firework','touch-firework-more']){$(id)?.addEventListener('click',()=>adventure?.launch?.());}
$('touch-fly-more')?.addEventListener('click',toggleFly);
$('touch-run').onclick=()=>{runLocked=!runLocked;notify(runLocked?'持续跑步已开启':'已切回步行');};$('touch-mine').onclick=()=>edit(false);$('touch-place').onclick=()=>edit(true);$('touch-fly').onclick=toggleFly;$('touch-talk').onclick=()=>interact();$('touch-follow').onclick=()=>interact(true);$('touch-use').onclick=useScene;$('touch-glide').onclick=toggleGlider;$('touch-craft').onclick=()=>life.craft();$('touch-eat').onclick=()=>life.eat();$('touch-dive').onclick=()=>life.dive();$('touch-paint').onclick=()=>adventure.paint();$('map-button').onclick=()=>adventure.map();$('mouse-mode').onclick=()=>{dragMode=!dragMode;fallback=dragMode;if(dragMode)pointerRecovery.hide();$('mouse-mode').textContent=dragMode?'鼠标：拖动环顾':'鼠标：自动锁定';$('mouse-mode').setAttribute('aria-pressed',String(dragMode));};
canvas.addEventListener('pointerdown',e=>{if(!touch||!active)return;lookPointer=e.pointerId;lastLook={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId)});
canvas.addEventListener('pointermove',e=>{if(e.pointerId===lookPointer&&lastLook){const isForced=document.body.classList.contains('force-landscape');const dx=isForced?(e.clientY-lastLook.y):(e.clientX-lastLook.x);const dy=isForced?-(e.clientX-lastLook.x):(e.clientY-lastLook.y);look(dx*1.6,dy*1.6);lastLook={x:e.clientX,y:e.clientY}}});
for(const event of ['pointerup','pointercancel'])canvas.addEventListener(event,e=>{if(e.pointerId===lookPointer){lookPointer=null;lastLook=null}});
const yuyuanFloor=(x,z)=>x>=-140&&x<=45&&z>=195&&z<=355?yuyuan?.floorAt?.(x,z):undefined;
const yuyuanCollides=(x,y,z)=>y>=21&&y<=45&&x>=-140&&x<=45&&z>=195&&z<=355?yuyuan?.collides(x,y,z):false;
const storyCollides=(x,y,z)=>y>24&&y<28.5?story?.collides(x,y,z):false;
const restaurantCollides=(x,y,z)=>y>40&&y<44?restaurant?.collides(x,y,z):false;
const privateSuitesCollides=(x,y,z)=>y>=44&&y<=83?privateSuites?.collides(x,y,z):false;
const towerCollides=(x,y,z)=>(x-CITY.shanghai.x)**2+(z-CITY.shanghai.z)**2<=900?towerInteriors?.collides(x,y,z):false;
function staticCollides(x,y,z,ignoreFurniture=null){const h=metroRampFloor(x,z)??nanpuFloor(world,x,z)??yuyuanFloor(x,z)??civil?.cruises?.floorAt(x,z,pos.y),slope=h!==null&&Math.abs(y-h)<1.5;return !!civil?.staticCollides(x,y,z)||vesselQueries.solid(x,y,z)||!!metro?.collides(x,y,z)||slope&&y<h-.015||overlaps(world,x,slope?Math.max(y,Math.ceil(h)):y,z)||!!life?.collides(x,y,z,ignoreFurniture)||!!yuyuanCollides(x,y,z)||!!storyCollides(x,y,z)||!!restaurantCollides(x,y,z)||!!privateSuitesCollides(x,y,z)||!!towerCollides(x,y,z)||!!activity?.collides(x,y,z)||!!commute?.collides(x,y,z);}
function collides(x,y,z){return staticCollides(x,y,z)||!!civil?.collides(x,y,z);}
function nearWaterExit(){return [[1.1,0],[-1.1,0],[0,1.1],[0,-1.1]].some(([dx,dz])=>{const x=Math.floor(pos.x+dx),z=Math.floor(pos.z+dz),y=world.get(x,23,z)?24:23;return !!world.get(x,y-1,z)&&!world.get(x,y,z)&&!world.get(x,y+1,z);});}
function physics(dt){
 const yuyuanFloor=(xx,zz)=>xx>=-140&&xx<=45&&zz>=195&&zz<=355?yuyuan?.floorAt?.(xx,zz):undefined;
 if(metro?.isRiding()||yuyuan?.isRiding())return;
 const indoorSeat=privateSuites?.isSeated()?privateSuites:towerInteriors?.isSeated()?towerInteriors:null;if(indoorSeat){if(['KeyW','KeyA','KeyS','KeyD','Space'].some(k=>inputKeys.has(k)))indoorSeat.standUp();return;}
 if(civil?.isSeated?.()){
  if(inputKeys.has('KeyW')||inputKeys.has('KeyA')||inputKeys.has('KeyS')||inputKeys.has('KeyD')||inputKeys.has('Space'))civil.standUp();
  return;
 }
 const alignedFloor=snapMetroFloor(world,pos,vy,{flying,gliding},(x,z)=>metro?.floorAt(x,z)??yuyuanFloor(x,z)??civil?.cruises?.floorAt(x,z,pos.y));if(alignedFloor!==null&&!collides(pos.x,alignedFloor,pos.z)){pos.y=alignedFloor;vy=0;grounded=true;footContact=true;}
 if(adventure?.state.race)gliding=false;
 for(const [key,until] of releaseAt)if(performance.now()>=until){keys.delete(key);releaseAt.delete(key);}
 yaw+=(Number(inputKeys.has('ArrowLeft'))-Number(inputKeys.has('ArrowRight')))*dt*1.65;pitch=Math.max(-1.52,Math.min(1.52,pitch+(Number(inputKeys.has('ArrowUp'))-Number(inputKeys.has('ArrowDown')))*dt*1.2));
 const {forward:fw,side}=inputKeys.axes();
 const shift=inputKeys.has('ShiftLeft')||inputKeys.has('ShiftRight'),swimming=isSwimming({feet:pos.y,dry:metroInterior(pos)});const speed=movementSpeed({flying,gliding,grounded,swimming,equipped:life?.state.equipped,sprint:shift||runLocked,racing:!!adventure?.state.race});
 const dx=(-Math.sin(yaw)*fw+Math.cos(yaw)*side)*speed*dt,dz=(-Math.cos(yaw)*fw-Math.sin(yaw)*side)*speed*dt;
 const rampY=(x,z)=>{const h=metroRampFloor(x,z)??metro?.floorAt(x,z)??nanpuFloor(world,x,z)??yuyuanFloor(x,z)??civil?.cruises?.floorAt(x,z,pos.y);return !flying&&!gliding&&h!==null&&Math.abs(pos.y-h)<.55&&vy<=0?h:(snapMetroFloor(world,{x,y:pos.y,z},vy,{flying,gliding},(xx,zz)=>metro?.floorAt(xx,zz)??yuyuanFloor(xx,zz)??civil?.cruises?.floorAt(xx,zz,pos.y))??pos.y);};
 const startX=pos.x,startY=pos.y,nextX=startX+dx;
 const xMoveY=rampY(nextX,pos.z);
 if((nextX!==startX||xMoveY!==startY)&&!collides(nextX,xMoveY,pos.z)){pos.x=nextX;pos.y=xMoveY;}
 const nextZ=pos.z+dz;
 // When the first probe used this exact position and did not move us,
 // repeating it for the other axis cannot change the result.
 if(nextX!==startX||pos.y!==startY||nextZ!==pos.z){
  const zMoveY=rampY(pos.x,nextZ);
  if((nextZ!==pos.z||zMoveY!==pos.y)&&!collides(pos.x,zMoveY,nextZ)){pos.z=nextZ;pos.y=zMoveY;}
 }
 if(flying){vy=(Number(inputKeys.has('Space'))-Number(shift))*6;}
 else if(gliding&&!swimming&&!grounded){vy=shift?-5:-2.2;}
 else{vy=swimVelocity({feet:pos.y,velocity:vy,space:inputKeys.has('Space'),down:shift,grounded,dt,dry:metroInterior(pos),shore:swimming&&inputKeys.has('Space')&&nearWaterExit()});if(inputKeys.has('Space')){grounded=false;footContact=false;}}
 const entryFloor=metro?.floorAt(pos.x,pos.z)??yuyuanFloor(pos.x,pos.z)??civil?.cruises?.floorAt(pos.x,pos.z,pos.y);if(!flying&&!gliding&&vy<=0&&entryFloor!==null&&entryFloor!==undefined&&pos.y>=entryFloor-.55&&pos.y+vy*dt<=entryFloor){pos.y=entryFloor;vy=0;grounded=true;footContact=true;return;}
 const dy=vy*dt,deck=!flying&&!gliding&&vy<=0?vesselQueries.support(pos.x,pos.y,pos.z):null;if(deck&&pos.y+dy<=deck.y){pos.y=deck.y;vy=0;grounded=true;footContact=true;}else if(!collides(pos.x,pos.y+dy,pos.z)){pos.y+=dy;grounded=false;}else{if(dy<0){grounded=true;footContact=true;if(!flying&&!gliding&&!swimming&&!adventure?.state.race&&vy<-13)life.state.hurt(Math.ceil((-vy-13)*.65));}vy=0;}
 if(swimming)gliding=false;
 if(pos.y>HEIGHT+12)pos.y=HEIGHT+12;
 if(pos.y<-5)respawn();
}
let prev=performance.now(),elapsed=0,hudTime=0,chunkClock=0,lastIdleFrame=-Infinity,lastFlashOpacity='',lastNpcPrompt=null;
const hudEls={npcPrompt:$('npc-prompt'),glideStatus:$('glide-status'),musicChoice:$('music-choice'),hudTimeSlider:$('hud-time-slider'),weatherStatus:$('weather-status'),settingsWeather:$('settings-weather-status'),settingsRender:$('settings-render-mode'),renderMode:$('render-mode'),skylinePrompt:$('skyline-prompt'),peacePrompt:$('peace-prompt'),commuteStatus:$('commute-status'),driveMeter:$('drive-meter'),driveThrottle:$('drive-throttle'),guidePrompt:$('guide-prompt'),runStatus:$('run-status')};
function renderScene(){
 distantGround.plan(camera.position);
 distantGround.process();
 yuyuan?.waterArt.prepareView(camera);
 renderer.render(scene,camera);
 if(active&&restoredEntryPhoto?.rendered())restoredEntryPhoto=null;
}
function frame(now){
 if(document.hidden||!active&&!story?.filming&&now-lastIdleFrame<(photo?.opened?1000/30:1000/15)){prev=now;requestAnimationFrame(frame);return;}
 if(isMobile&&(active||story?.filming)&&mobilePacer.skip(now,mobileQuality==='clear'?60:30)){requestAnimationFrame(frame);return;}
 lastIdleFrame=now;const probeStart=performanceProbe?performance.now():0;performanceProbe?.beginFrame(active||story?.filming);
 footContact=grounded;const walkStartX=pos.x,walkStartZ=pos.z;let footTravel=0;
 const support=active&&!flying&&!gliding&&!activity?.isRiding()&&!commute?.isRiding()&&!yuyuan?.isRiding()?vesselQueries.support(pos.x,pos.y,pos.z):null,carried=support&&Math.abs(pos.y-support.y)<.2?{...support,old:boatWorld(support.root,support.local)}:null;
 requestAnimationFrame(frame);const storyDt=Math.min((now-prev)/1000,1);let dt=Math.min((now-prev)/1000,.1);prev=now;elapsed+=dt;for(const [key,until]of releaseAt)if(now>=until){keys.delete(key);releaseAt.delete(key);}if(active||story?.filming){camera.position.set(pos.x,pos.y+1.62,pos.z);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();simulationInterest.beginFrame();}npcGuides?.beginTick();rainCrowd?.beginTick();towerInteriors?.beginTick();activity?.tick(active?dt:0,{night:dayClock>=120,dayClock});metro?.tick(active?dt:0,{playing:active,sound:sound&&sceneAudio.enabled,keys:active?inputKeys:new Set()});
 if(active){chunkClock+=dt;if(chunkClock>.6){ensureChunks(pos);chunkClock=0;}chunkWork.process(isMobile?2:3);saves?.tick(dt);let remaining=dt;while(remaining>0&&!activity?.isRiding()&&!commute?.isRiding()&&!metro?.isRiding()&&!yuyuan?.isRiding()){const step=Math.min(remaining,1/120);physics(step);remaining-=step;}
  footTravel=Math.hypot(pos.x-walkStartX,pos.z-walkStartZ);
  camera.position.set(pos.x,pos.y+1.62,pos.z);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();camera.getWorldDirection(direction);target=trace(world,camera.position,direction);outline.visible=!!target;if(target)outline.position.set(target.x+.5,target.y+.5,target.z+.5);
  if((mouseHeld!==-1||inputKeys.has('KeyQ'))&&now-lastAction>260)edit(mouseHeld===2);tickMining(dt);
  hudTime+=dt;if(hudTime>.15){hudText('coordinates',`X ${(pos.x-40).toFixed(1)} · Y ${pos.y.toFixed(1)} · Z ${(pos.z-40).toFixed(1)}`);hudText('target',target?BLOCKS[target.id].name:'');const nearby=life?.hasUseTarget()?null:companions.nearest(pos,camera),npcVis=!!nearby;if(npcVis!==lastNpcPrompt){(hudEls.npcPrompt??$('npc-prompt'))?.classList.toggle('visible',npcVis);lastNpcPrompt=npcVis;}hudText('npc-prompt',nearby?`奶龙 · G 打招呼 / 跳舞 · H ${nearby.follow?'停止跟随':'一起散步'}`:'');hudTime=0;}
  updateHudHidden(hudEls.glideStatus??$('glide-status'),!gliding);hudText('glide-status',grounded?'滑翔伞准备好了 · 走向边缘起飞':'滑翔中 · WASD 转向 · Shift 下降 · P 收伞');simulationInterest.beginFrame();life.tick(dt,{night:dayClock>=120,moving:inputKeys.has('KeyW')||inputKeys.has('KeyA')||inputKeys.has('KeyS')||inputKeys.has('KeyD'),racing:!!adventure.state.race});companions.update(dt,pos,camera,elapsed);const effect=adventure.tick(dt,pos,elapsed,dayClock>=120);if(effect?.bounce&&!flying){vy=effect.bounce;grounded=false;beep(1);}
 }else if(!started){chunkWork.process(isMobile?2:3);camera.position.set(32+Math.sin(elapsed*.03)*1.5,29.8,68+Math.cos(elapsed*.025)*1.0);camera.lookAt(126,52,42);outline.visible=false;}
 const area=soundScene(pos,dayClock>=120);
 music.update({playing:active||story?.filming,night:dayClock>=120,festival:adventure?.isShowActive(),hidden:document.hidden,sceneTrack:area.track,dt});
 hudText('music-track',music.track.name+' · '+(music.automatic?area.name:adventure?.isShowActive()?'明珠夜游变奏':'手选曲目'));const mc=hudEls.musicChoice??$('music-choice');if(mc&&mc.value!==music.track.id)mc.value=music.track.id;
 const festival=adventure?.isShowActive(),showTime=adventure?.show.elapsed??0;
 skyline.tick(active?dt:0,{night:dayClock>=120,festival,time:elapsed,showTime});
 updateSky(active?dt:0);const climate=weather.tick(active?dt:0,dayClock);const hts=hudEls.hudTimeSlider??$('hud-time-slider');if(hts&&!isScrubbingTime&&document.activeElement!==hts){const mins=String(clockMinutes(dayClock));if(hts.value!==mins)hts.value=mins;}civil.tick(active?dt:0,{night:dayClock>=120,rain:climate.rain,dayClock,festival,showTime});if(carried){const q=boatWorld(carried.root,carried.local);pos.x+=q.x-carried.old.x;pos.z+=q.z-carried.old.z;pos.y+=carried.root.position.y+carried.top-carried.y;camera.position.set(pos.x,pos.y+1.62,pos.z);}hudText('weather-status',climate.name+' · 湿度 '+climate.humidity+'%');const sWeather=hudEls.settingsWeather??$('settings-weather-status');if(sWeather)hudText('settings-weather-status',(hudEls.weatherStatus??$('weather-status'))?.textContent??'');const sRender=hudEls.settingsRender??$('settings-render-mode'),rMode=hudEls.renderMode??$('render-mode');if(sRender&&rMode)hudText('settings-render-mode',rMode.textContent);if(clouds.tick)clouds.tick(active?dt:0,elapsed,climate);
 if(active&&!activity?.isRiding()&&!yuyuan?.isRiding()&&!metroInterior(pos)){const hit=trafficContact({agents:civil.traffic.agents,player:pos,vehicle:commute?.ride?.vehicle,world,blocked:(x,y,z)=>staticCollides(x,y,z)});if(hit){const v=commute?.ride?.vehicle;if(v){v.root.position.set(hit.point.x,hit.point.y,hit.point.z);v.speed=0;v.throttle=0;v.shock=.8;v.impactCooldown=.4;}else{Object.assign(pos,hit.point);camera.position.set(pos.x,pos.y+1.62,pos.z);vy=0;}if(hit.speed>.2&&elapsed>trafficHitUntil){trafficHitUntil=elapsed+1.2;const damage=Math.min(6,Math.max(1,Math.ceil(hit.speed*.8)));life.state.hurt(damage);sceneAudio.horn();notify(life.state.survival?'被来车撞到 · 生命 -'+damage:'被来车碰到，已退到车旁。');}}}
 const flashOp=active?String(Math.max(0,(trafficHitUntil-elapsed-.6)*.6)):'0';if(flashOp!==lastFlashOpacity){trafficFlash.style.opacity=flashOp;lastFlashOpacity=flashOp;}
 sceneAudio.update(active?dt:0,{playing:active,hidden:document.hidden,sound,volume:music.volume,pos,yaw,agents:civil.traffic.agents,vendors:()=>[...(activity?.vendors??[]),...(yuyuan?.vendors??[])],riding:commute?.isRiding()||activity?.isRiding()||yuyuan?.isRiding()||metro?.isRiding(),walking:footContact&&Math.abs(vy)<.6&&!flying&&!gliding&&!story?.filming&&!isSwimming({feet:pos.y,dry:metroInterior(pos)}),travel:footTravel,dialogue:npcGuides?.isPanelOpen(),night:dayClock>=120,rain:climate.rain,weatherType:climate.type,rainExposure:climate.rain>.01?rainExposure(world,pos):0});
 yuyuan?.tick(active?dt:0,{night:dayClock>=120,keys:active?inputKeys:new Set()});privateSuites?.tick(active,active?dt:0);towerInteriors?.tick(active);restaurant?.tick(active?dt:0);if(towerInteriors?.getPrompt())updateHudHidden(hudEls.skylinePrompt??$('skyline-prompt'),true);if(privateSuites?.getPrompt())updateHudHidden(hudEls.peacePrompt??$('peace-prompt'),true);cityMedia.tick(active?dt:0,{dayClock,festival,showTime});lujiazuiShow.tick(active?dt:0,{active:festival,time:showTime});residents?.tick(active?dt:0);parkLife.tick(active?dt:0);npcGuides?.tick(active?dt:0);rainCrowd?.tick(active?dt:0,climate.rain);quests?.tick(active?dt:0,active&&!document.hidden&&!npcGuides?.isPanelOpen());const commuteText=commute?.tick(active?dt:0,active?inputKeys:new Set());updateHudHidden(hudEls.commuteStatus??$('commute-status'),!active||!commuteText);hudText('commute-label',commuteText||'');const drive=commute?.ride?.vehicle;updateHudHidden(hudEls.driveMeter??$('drive-meter'),!drive||!['bicycle','car'].includes(drive.kind));const power=Math.round(Math.abs(drive?.throttle??0)*100),dtEl=hudEls.driveThrottle??$('drive-throttle');if(dtEl&&Number(dtEl.value)!==power)dtEl.value=power;hudText('drive-power',drive?.brake?'刹车':power+'%');const civilPrompt=civil?.getPrompt?.(),guideEl=hudEls.guidePrompt??$('guide-prompt');if(civilPrompt&&active&&!commute?.isRiding()&&!yuyuan?.isRiding()){updateHudHidden(guideEl,false);updateHudText(guideEl,civilPrompt);}else if(!active||commute?.isRiding()||yuyuan?.isRiding())updateHudHidden(guideEl,true);updateHudHidden(hudEls.runStatus??$('run-status'),!active||isMobile||touch||commute?.isRiding()||metro?.isRiding()||yuyuan?.isRiding()||flying||gliding);if(!isMobile&&!touch)hudText('run-status',isSwimming({feet:pos.y,dry:metroInterior(pos)})?'游泳 · 空格上浮 · Shift 下潜':runLocked?'持续跑步 · CapsLock 切回步行':'Shift 跑步 · CapsLock 持续跑步');const rideCamera=commute?.cameraPose(yaw,pitch)??yuyuan?.cameraPose(yaw,pitch)??privateSuites?.cameraPose(yaw,pitch)??towerInteriors?.cameraPose(yaw,pitch);if(rideCamera&&active){camera.position.set(rideCamera.position.x,rideCamera.position.y,rideCamera.position.z);camera.lookAt(rideCamera.focus.x,rideCamera.focus.y,rideCamera.focus.z);}const inConv=Boolean(document.body.classList?.contains?.('in-conversation'));for(const label of wayfindingLabels)label.visible=!inConv&&label.position.distanceToSquared(camera.position)>16;story?.tick(active?dt:0,active&&!document.hidden);contextGuideClock+=dt;if(contextGuideClock>=.25||(!active||document.hidden||story?.filming)&&contextGuide.current){contextGuide.tick(Math.min(contextGuideClock,.25),{playing:active&&!document.hidden,journey:story?.state,pos,touch:isMobile||touch,creative:!life?.state.survival,nearCar:commuteText==='V 接管汽车',night:dayClock>=120,nearBund:Math.hypot(pos.x-LANDMARKS.bund.x,pos.z-LANDMARKS.bund.z)<45,quiet:!!story?.filming||inConv||Boolean(document.body.classList?.contains?.('quest-intro-showing'))});contextGuideClock=0;}if(story?.filming){chunkWork.process(isMobile?2:3);story.filmFrame(storyDt);}photo?.update();renderScene();performanceProbe?.frame(now,performance.now()-probeStart,active||story?.filming);
}
function onResize(){
 mobileLayout?.apply();touchMovement?.reset();mobilePacer.reset();
 if(window.innerWidth>window.innerHeight){
  document.body.classList.remove('force-landscape');
 }
 const isForced=document.body.classList.contains('force-landscape');
 const w=isForced?innerHeight:innerWidth;
 const h=isForced?innerWidth:innerHeight;
 camera.aspect=w/h;
 camera.updateProjectionMatrix();
 const pixelRatio=renderProfile({mobile:isMobile,mode:mobileQuality,dpr:devicePixelRatio,width:innerWidth,height:innerHeight}).pixelRatio;
 const sizeChanged=w!==renderWidth||h!==renderHeight;
 // Assigning the current canvas dimensions still resets its backing store.
 if(sizeChanged||pixelRatio!==renderPixelRatio){
  if(renderer.isWebGLRenderer){
   renderer.setDrawingBufferSize(w,h,pixelRatio);
   if(sizeChanged){canvas.style.width=w+'px';canvas.style.height=h+'px';}
  }else{
   renderer.setPixelRatio(pixelRatio);
   renderer.setSize(w,h);
  }
  renderWidth=w;
  renderHeight=h;
  renderPixelRatio=pixelRatio;
 }
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
  const ascBtn=$('touch-ascend');if(ascBtn)ascBtn.hidden=!flying;
  const descBtn=$('touch-descend');if(descBtn)descBtn.hidden=!flying;
  const ascMore=$('touch-ascend-more');if(ascMore)ascMore.hidden=!flying;
  const descMore=$('touch-descend-more');if(descMore)descMore.hidden=!flying;
  const flyChip=$('touch-fly');if(flyChip){flyChip.textContent=flying?'🕊 关闭飞行':'🕊 飞行模式';flyChip.classList.toggle('flying',flying);}
  const flyMoreChip=$('touch-fly-more');if(flyMoreChip){flyMoreChip.textContent=flying?'🕊 关闭飞行 F':'🕊 飞行模式 F';flyMoreChip.classList.toggle('flying',flying);}
}
function placePlayer(point){if(civil?.staticCollides(point.x,point.y,point.z))point=safeLanding(world,point,(x,y,z)=>staticCollides(x,y,z))??point;ensureChunks(point);pos.x=point.x;pos.y=point.y;pos.z=point.z;vy=0;grounded=false;yaw=point.z>=270&&point.x<=170?0:point.z>=68?-Math.PI/2:point.x>=80?Math.PI/2:0;pitch=-.12;}
function teleport(point){touchMovement?.reset();privateSuites?.leaveSeat();towerInteriors?.leaveSeat();civil?.leaveSeat();metro?.end(true);commute?.end(true);activity?.cancelRide();yuyuan?.rickshaws?.dismount?.('传送');placePlayer(point);}
if(['localhost','127.0.0.1'].includes(location.hostname))window.__game={
  camera,pos,teleport,lookTowards,setFlight,bundBatchVariants:civil.batchVariants,
  setPos:(x,y,z)=>{teleport({x,y,z});pos.x=x;pos.y=y;pos.z=z;ensureChunks({x,y,z},true,true);camera.position.set(x,y+1.62,z);},
  lookAt:(x,y,z)=>{lookTowards({x,y,z});camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();renderScene();},
  setTime:(min)=>{dayClock=phaseFromMinutes(min);updateSky(0);},
  setNight:()=>{dayClock=165;updateSky(0);},
  setDay:()=>{dayClock=36;updateSky(0);},
  render:()=>{camera.position.set(pos.x,pos.y+1.62,pos.z);camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();renderScene();},
  scene,renderer,enter:()=>enter(),terrainChunkKeys:()=>[...chunks.keys()]
};
function prepareJourneyShot(shot){
 const [x,z]=shot.prepare;
 ensureChunks({x,y:26,z});
 const desired=chunkWork.desired,keys=new Set();
 for(let cx=Math.floor((x-22)/CHUNK);cx<=Math.floor((x+22)/CHUNK);cx++){
  for(let cz=Math.floor((z-19)/CHUNK);cz<=Math.floor((z+19)/CHUNK);cz++){
   const key=cx+','+cz;
   if(desired.has(key))keys.add(key);
  }
 }
 chunkWork.prioritize(keys);
 return ()=>{
  for(const key of keys)if(!chunks.has(key))return false;
  return true;
 };
}
function pauseForPanel(){pointerRecovery.hide();story?.suspend();sceneAudio.suspend();metro?.suspend();pendingMine=null;active=false;keys.clear();touchMovement?.reset();pressedAt.clear();releaseAt.clear();mouseHeld=-1;dragging=false;document.exitPointerLock?.();}
adventure=createAdventure({getYaw:()=>yaw,grantPearlSnack:()=>{if(life?.state)life.state.food=Math.min(99999,life.state.food+1);},scene,world,notify,beep,teleport,setFlying:setFlight,getFlying:()=>flying,pause:pauseForPanel,resume:enter,burst:companions.burst,lookAt:lookTowards,setNight:()=>{dayClock=165;updateSky(0)},onProgress:()=>{saves?.save('auto')},getQuestTarget:()=>story?.target()??quests?.target(),fastTravel:p=>{const safe=safeLanding(world,p,collides);if(!safe){notify('落点被占用，请稍后再试。');return false;}setFlight(false);gliding=false;teleport(safe);if(p.viewTarget)lookTowards(p.viewTarget);return true;}});
life=createLife({simulationInterest,onEvent:recordCityEvent,scene,world,interactionBlocked:(x,y,z,ignore)=>staticCollides(x,y,z,ignore),blocked:(x,y,z)=>staticCollides(x,y,z),isDry:()=>metroInterior(pos),notify,pause:pauseForPanel,resume:enter,getPos:()=>pos,getYaw:()=>yaw,getDirection:()=>{camera.getWorldDirection(direction);return direction},onMode:survival=>{if(survival)setFlight(false);else setFlight(flying)},onHeld:type=>{$('selected-name').textContent=type?({bed:'床',chair:'木椅',table:'餐桌',lamp:'晶石灯',chest:'储物箱',campfire:'篝火',bookshelf:'书架',planter:'菜圃'}[type]):BLOCKS[selected].name},onDeath:point=>{if(point&&!collides(point.x,point.y,point.z))teleport(point);else teleport(LANDMARKS.village);vy=0},setDay:()=>{dayClock=36;updateSky(0)},onProgress:()=>saves?.save('auto')});
quests=createQuestJournal({getJourney:()=>story?.journalInfo(),onJourneyAction:action=>story?.runJournalAction(action),getStory:()=>story?.tracking?{title:story.title,goal:story.target()}:null,onTrack:()=>story?.stopTracking(),scene,getYaw:()=>yaw,getContext:()=>({pos,life:life.state,npcs:companions.npcs,vendors:activity?.vendors??[],stations:metro?.stations??[],ride:metro?.ride,trains:metro?.trains??[],landings:activity?.landings??[],ferryRiding:activity?.isRiding(),cruise:civil.cruises,metroNetwork:metro}),openMap:()=>adventure.map(),openSettings:()=>$('settings-quick')?.click(),pause:pauseForPanel,resume:enter,notify,onProgress:()=>saves?.save('auto'),canOpen:()=>started&&!yuyuan?.isPanelOpen()&&!npcGuides?.isPanelOpen()&&!activity?.isPanelOpen()&&!restaurant?.isPanelOpen()&&!skyline?.isPanelOpen()&&!life?.isPanelOpen()&&!adventure?.isPanelOpen(),grant:r=>{for(const [id,n]of Object.entries(r.blocks??{}))life.state.add(Number(id),n);for(const key of ['food','wool','pearls'])life.state[key]=Math.min(99999,life.state[key]+(r[key]??0));life.refresh();}});
restaurant=createPeaceRestaurant({onEvent:recordCityEvent,scene,world,getPos:()=>pos,getState:()=>life.state,teleport,lookAt:lookTowards,notify,pause:pauseForPanel,resume:enter,onProgress:()=>saves?.save('auto')});
await loadingStage('正在准备南京路与地铁…');
const sharedVehicles=[],getSharedVehicles=()=>{sharedVehicles.length=0;if(civil?.traffic?.agents)for(const a of civil.traffic.agents)sharedVehicles.push(a);if(commute?.vehicles)for(const v of commute.vehicles)sharedVehicles.push(v);return sharedVehicles;};
activity=createCityActivity({simulationInterest,solidAt:civil.staticCollides,transit:civil.traffic,otherPeople:[...civil.pedestrians.filter(p=>p.kind!=='shop'),...civil.traffic.officers],extraCrowd:civil.pedestrians.filter(p=>p.kind==='shop'),onEvent:recordCityEvent,scene,world,getVehicles:getSharedVehicles,getPos:()=>pos,getState:()=>life.state,teleport:p=>{Object.assign(pos,p);vy=0;},lookAt:lookTowards,notify,pause:pauseForPanel,resume:enter,onProgress:()=>saves?.save('auto'),getTrafficTime:()=>civil.traffic.time});
const nanjingSignBatch=renderer.isWebGLRenderer?batchDualMaterialSigns(scene.getObjectByName('nanjing-street-life'),activity.signs):null;
metro=createMetro({renderer,expanded:true,canCullInteriors:()=>savedEdits.size===0&&!story?.filming&&!photo?.opened,getYaw:()=>yaw,turnView:a=>{yaw+=a;},onEvent:recordCityEvent,scene,getPos:()=>pos,place:p=>{Object.assign(pos,p);vy=0;},setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;},notify,getAudio,getSound:()=>sound&&sceneAudio.enabled,canCarry:()=>!flying&&!gliding&&!commute?.isRiding(),canBoard:()=>!commute?.isRiding()});
vesselQueries=createBoatSurfaceQueries(boatSurfaces(activity.ferry,[...civil.boats,...civil.cruisePorts]));
privateSuites=createPrivateSuites({scene,world,pause:pauseForPanel,resume:enter,place:p=>{placePlayer(p);setFlight(false);gliding=false;},getPos:()=>pos,getState:()=>life.state,teleport,lookAt:lookTowards,notify,setDay:()=>{dayClock=36;updateSky(0);},onProgress:()=>{life.refresh();saves?.save('auto');}});
await loadingStage('正在构建豫园与老城商圈…');
yuyuan=createYuyuan({scene,world,simulationInterest,deferPondView:true,packStatic:renderer.isWebGLRenderer,getVehicles:getSharedVehicles,getPos:()=>pos,getState:()=>life.state,setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;},notify,pause:pauseForPanel,resume:enter,onProgress:()=>{life.refresh();saves?.save('auto');},onEvent:recordCityEvent,getAudio,getSound:()=>sound&&sceneAudio.enabled&&!document.hidden,getVolume:()=>music.volume});
const yuyuanSignBatch=renderer.isWebGLRenderer?batchSingleMaterialSigns(yuyuan.root,{wallTarget:true}):null;
if(renderer.isWebGLRenderer){
 const roadArt=[];
 const startNight=(saves?.startupView?.(MAP_REVISION)?.dayClock??dayClock)>=120;
 if(nanjingSignBatch){
  roadArt.push(...nanjingSignBatch.activeTextures(startNight));
  for(const sign of activity.signs){
   if(!sign.mesh.layers.isEnabled(0))continue;
   for(const key of ['day','night']){if(sign[key].map?.userData.opaqueStreetArt)roadArt.push(sign[key].map);}
  }
 }else{
  for(const key of ['day','night'])for(const sign of activity.signs){
   const map=sign[key].map;
   if(map.userData.opaqueStreetArt)roadArt.push(map);
  }
 }
 if(yuyuanSignBatch)roadArt.push(...yuyuanSignBatch.textures);
 for(const {root} of civil.traffic.stops)root.traverse(mesh=>{
  const map=mesh.material?.map;
  if(map?.userData.opaqueStreetArt)roadArt.push(map);
 });
 void prepareStreetTextureBitmaps(renderer,roadArt,()=>!active&&!document.hidden);
}
residents=createBuildingResidents({scene,world,getPos:()=>pos,getVehicles:getSharedVehicles});
story=createShanghaiJourney({scene,camera,world,routeBlocked:(x,y,z)=>!!civil?.staticCollides(x,y,z)||!!metro?.collides(x,y,z)||!!life?.collides(x,y,z)||!!story?.collides(x,y,z)||!!activity?.collides(x,y,z)||!!restaurant?.collides(x,y,z)||!!privateSuites?.collides(x,y,z)||!!towerInteriors?.collides(x,y,z),getAudio,getSound:()=>sound,getVolume:()=>music.volume,getContext:()=>({pos,touch:isMobile||touch,traffic:civil.traffic,rain:weather.state.rain,dayClock,life:life.state,people:activity?.tourists??[],gardenShops:yuyuan?.streetArt.extraShops??[],traveling:!!(commute?.ride||activity?.isRiding()),photoGuest:civil.pedestrians.find(p=>p.kind==='photo'&&p.point?.z===72),collectibles:{...yuyuan?.inventory,...activity?.goods,...quests?.state.collectibles()},vendors:activity?.vendors??[],stations:metro?.stations??[],ride:metro?.ride,trains:metro?.trains??[],metroNetwork:metro}),pause:pauseForPanel,resume:enter,notify,prefetch:p=>ensureChunks(p),prepareShot:prepareJourneyShot,placeStart:a=>{teleport({x:a.x-1.5,y:a.y,z:a.z-2});setFlight(false);lookTowards({...a,y:a.y+1.5});},celebrate:()=>{if(adventure?.launch){adventure.launch(true);notify('外滩的灯光已经为你亮起，过去看看吧 · 随时按 K 放烟花');}},onProgress:()=>{quests?.refresh();saves?.save('auto');}});
towerInteriors=createTowerInteriors({scene,world,people:activity.tourists,getPos:()=>pos,place:p=>{placePlayer(p);setFlight(false);gliding=false;},lookAt:lookTowards,pause:pauseForPanel,resume:enter,notify,onRead:({title,text})=>story?.record({type:'city-conversation',district:'duoyun',kind:'reading',name:'朵云书院',topic:title,text})});
const parkLife=createParkLife({scene,world,getPos:()=>pos,getVehicles:()=>commute?.vehicles??[],hasTerrainAt:(x,z)=>chunksByNum.has(chunkNum(Math.floor(x/CHUNK),Math.floor(z/CHUNK)))||distantGround.hasGroundAt(x,z)});
npcGuides=createNpcGuides({onConversation:recordCityEvent,extraPeople:[...story.actors,...metro.staff,...residents.people,...yuyuan.actors,...civil.cruisePeople,...parkLife.people,...wukangShops.people],scene,world,civil,activity,getPos:()=>pos,getVehicles:()=>commute?.vehicles??[],pause:pauseForPanel,resume:enter,notify,lookAt:p=>{camera.position.set(pos.x,pos.y+1.62,pos.z);lookTowards(p);}});
commute=createCommute({scene,world,civil,activity,fixtureBlocked:civil.vehicleCollides,getPos:()=>pos,blocked:(x,y,z)=>overlaps(world,x,y,z)||!!civil?.staticCollides(x,y,z)||!!yuyuan?.collides(x,y,z)||!!life?.collides(x,y,z)||!!restaurant?.collides(x,y,z)||!!activity?.collides(x,y,z),vehicleBlocked:(x,y,z)=>overlaps(world,x,y,z,0)||!!yuyuan?.collides(x,y,z)||!!life?.collides(x,y,z)||!!restaurant?.collides(x,y,z)||!!activity?.collides(x,y,z),exitBlocked:collides,place:p=>{Object.assign(pos,p);vy=0;},setView:(a,p)=>{yaw=a;pitch=p;setFlight(false);gliding=false;},onExit:()=>{keys.clear();touchMovement?.reset();pressedAt.clear();releaseAt.clear();grounded=true;},turnView:a=>{yaw+=a;},notify,allowed:()=>!adventure.state.race&&!activity.isRiding()&&!metroInterior(pos),getActors:()=>npcGuides.actors,onImpact:(actor,vx,vz,strength)=>npcGuides.impact(actor,vx,vz,strength)});
const lujiazuiShow=createLujiazuiShow(scene);
skyline=createSkyline({lookAt:lookTowards,onEvent:recordCityEvent,scene,getPos:()=>pos,notify,pause:pauseForPanel,resume:enter,teleport,grantGlider:()=>life.grantGlider(),onProgress:()=>saves?.save('auto')});
function captureSave(){return {version:6,mapRevision:MAP_REVISION,edits:[...savedEdits],metro:metro.serialize(),quests:quests.serialize(),journey:story?.serialize(),pos:privateSuites?.safeSavePoint()||towerInteriors?.safeSavePoint()||civil.cruises.safeSavePoint()||metro.safeSavePoint()||commute.safeSavePoint()||activity.safeSavePoint()||yuyuan.rickshaws.safeSavePoint()||{...pos},yaw,pitch,flying,gliding,selected,dayClock,timeOptions:{...timeOptions},mined,placed,talkDone,followDone,celebrated,life:life.serialize(),yuyuan:yuyuan.serialize(),restaurant:restaurant.serialize(),suites:privateSuites.serialize(),activity:activity.serialize(),skyline:skyline.serialize(),weather:weather.serialize(),adventure:adventure.serialize(),savedAt:new Date().toISOString()};}
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
 privateSuites?.leaveSeat();towerInteriors?.leaveSeat();towerInteriors?.beginTick();civil?.leaveSeat();
 if(![3,4,6].includes(data?.version)||!Array.isArray(data.edits)||data.edits.length>50000)throw new Error('Invalid save');
 metro?.end(true);metro?.restore(data.metro);commute?.end(true);activity?.cancelRide();yuyuan?.rickshaws?.cancelRide();data=migrateSouthIslandsSave(migrateWestBankSave(data));pendingMine=null;gliding=false;adventure.cancelRace();const previousEdits=new Map(savedEdits);initialWorld.restore(world.data);savedEdits.clear();const shift=data.version<6?WORLD_SHIFT:0;
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
if(!data.flying&&!data.gliding&&oldPearlLanding(p))Object.assign(p,PEARL_DECK.arrival);
if(p&&!data.flying&&!data.gliding&&[44,70].includes(Math.round(p.y))&&Math.abs(p.x-PEARL.x)<12&&Math.abs(p.z-PEARL.z)<12&&!overlaps(world,p.x,p.y-.1,p.z)){const safe=safeLanding(world,p);if(safe)Object.assign(p,safe);}
if(p&&[p.x,p.y,p.z].every(Number.isFinite)&&p.y<HEIGHT+12&&!overlaps(world,p.x,p.y,p.z))Object.assign(pos,p);else Object.assign(pos,LANDMARKS.village);for(const key of changedEditChunks(previousEdits,savedEdits,CHUNK)){distantGround.invalidate(key);chunkWork.cancel(key);const mesh=chunks.get(key);if(mesh){scene.remove(mesh);mesh.geometry.dispose();chunks.delete(key);const [dx,dz]=key.split(',').map(Number);chunksByNum.delete(chunkNum(dx,dz));distantGround.update(key);}}lastChunkPlan=null;ensureChunks(pos,false,true);
 yaw=Number.isFinite(data.yaw)?data.yaw:0;pitch=Number.isFinite(data.pitch)?Math.max(-1.52,Math.min(1.52,data.pitch)):-.08;select(Number.isInteger(data.selected)&&data.selected>0&&data.selected<BLOCKS.length?data.selected:1,false);life.restore(data.version===6?data.life:null);if(data.mapRevision===5){const migrated=life.serialize();for(const f of migrated.furniture)migrateBundPoint(f);if(migrated.home)migrateBundPoint(migrated.home);life.restore(migrated);}if((data.mapRevision||0)<5){const migrated=life.serialize();for(const f of migrated.furniture)movePersonal(f);if(migrated.home)movePersonal(migrated.home);life.restore(migrated);}if((data.mapRevision||0)<4){for(const f of life.state.furniture)if(f.x<=115&&f.z>138&&f.y>=25){const x=Math.floor(f.x),z=Math.floor(f.z),y=Math.floor(f.y)-1;for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)if(!world.get(x+dx,y,z+dz))updateBlock(x+dx,y,z+dz,7);}}if(collides(pos.x,pos.y,pos.z)){const nearby=[{x:pos.x+1.5,y:pos.y,z:pos.z},{x:pos.x-1.5,y:pos.y,z:pos.z},{x:pos.x,y:pos.y+2,z:pos.z}].find(p=>!collides(p.x,p.y,p.z));teleport(nearby||LANDMARKS.village);}setFlight(!!data.flying);gliding=!!data.gliding&&life.state.glider&&!flying;yuyuan.restore(data.yuyuan);restaurant.restore(data.restaurant);privateSuites.restore(data.suites);activity.restore(data.activity);skyline.restore(data.skyline);weather.restore(data.weather);$('weather-choice').value=weather.state.mode;$('weather-pace').value=weather.state.cycleSeconds;$('weather-pace').disabled=weather.state.mode!=='auto';timeOptions=clockOptions(data.timeOptions);dayClock=Number.isFinite(data.dayClock)?Math.max(0,data.dayClock)%240:36;mined=Math.max(0,Number(data.mined)||0);placed=Math.max(0,Number(data.placed)||0);adventure.restore(data.adventure);talkDone=!!data.talkDone;followDone=!!data.followDone;celebrated=!!data.celebrated;story?.restore(data.journey);quests.restore(data.quests,{talkDone,placed});if(adventure.state.race){gliding=false;teleport(courseById(adventure.state.race.course).platforms[adventure.state.race.checkpoint]);setFlight(false)}updateTasks();started=true;enter();notify(shift?'旧存档已迁移到新群岛，你的建筑仍然保留。':'已读取存档，欢迎回到你的小岛。');
 }catch{notify('未能读取存档，当前游戏仍然可以继续。');throw new Error('存档格式不正确');}}
function lookTowards(point){const dx=point.x-pos.x,dz=point.z-pos.z; yaw=Math.atan2(-dx,-dz);pitch=Math.atan2(point.y-pos.y-1.62,Math.hypot(dx,dz));camera.rotation.set(pitch,yaw,0,'YXZ');camera.updateMatrixWorld();}
function lookCelestial(night){adventure.cancelRace();enter();teleport(LANDMARKS.bund);dayClock=night?165:36;updateSky(0);camera.position.set(pos.x,pos.y+1.62,pos.z);weather.tick(0,dayClock);lookTowards(night?weather.moon.position:sunBlock.position);notify(night?'已转向月亮；拖动鼠标继续环顾。':'已转向太阳；拖动鼠标继续环顾。');}
$('start-survival').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();const first=life.enterSurvival();if(first){teleport(LANDMARKS.survivalCamp);dayClock=36;updateSky(0);}saves?.save('auto');};
$('go-city').onclick=async()=>{story?.bypassAutoStart?.();if(story?.filming)story?.filmDone?.();await $('play').onclick();if(!started)return;if(story?.filming)story?.filmDone?.();adventure.cancelRace();teleport(LANDMARKS.shanghai);lookTowards({x:201,y:76,z:88});notify('陆家嘴：环球在金茂东南，上海中心在金茂西南。对岸是外滩。');};
$('go-expo').onclick=async()=>{
 story?.bypassAutoStart?.();if(story?.filming)story.filmDone();await $('play').onclick();if(!started)return;
 if(story?.filming)story.filmDone();
 const landing=safeLanding(world,EXPO.arrival,collides);
 if(!landing){notify('世博广场暂时没有可用落点。');return;}
 adventure.cancelRace();setFlight(false);gliding=false;teleport(landing);lookTowards(EXPO.arrival.viewTarget);
};
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
handbook=createPlayerHandbook({getState:()=>life.state,getPacked:()=>life.serialize().packed,getCollectibles:()=>({...activity.goods,...yuyuan.inventory,...story.inventory,...quests.state.collectibles()}),openCollectible:()=>story.openSettlement(),openTravelJournal:()=>story.openBook(),selectBlock:select,craft:()=>life.craft(),pause:pauseForPanel,resume:enter,isPlaying:()=>active,canOpen:()=>!document.querySelector('dialog[open]'),notify});
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
const updateDialog=$('update-dialog');
const UPDATE_NOTICE_KEY=updateDialog?.dataset.noticeKey;
function dismissUpdateNotice(){try{localStorage.setItem(UPDATE_NOTICE_KEY,'true');}catch{}if($('welcome-updates'))$('welcome-updates').dataset.unread='false';try{if(updateDialog?.open)updateDialog.close();}catch{}}
$('update-open')?.addEventListener('click',()=>{try{updateDialog?.showModal();}catch{}});
$('welcome-updates')?.addEventListener('click',()=>{try{updateDialog?.showModal();}catch{}});
$('update-close')?.addEventListener('click',dismissUpdateNotice);
$('update-start-btn')?.addEventListener('click',dismissUpdateNotice);
updateDialog?.addEventListener('cancel',e=>{e.preventDefault();dismissUpdateNotice();});
try{if(localStorage.getItem('block-island-update-v55-seen'))localStorage.setItem('block-island-update-v54-seen','true');}catch{}
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
   if(storageKey==='pos_quest_tracker')try{sessionStorage.removeItem('pos_quest_tracker');}catch(_){}const isMobile=window.innerWidth<=800||window.innerHeight<=600||document.body.classList.contains('touch')||document.body.classList.contains('force-landscape');const saved=JSON.parse(sessionStorage.getItem(storageKey)||'null');
   if(saved&&typeof saved.left==='number'&&typeof saved.top==='number'){
    const isForced=document.body.classList.contains('force-landscape');
    const maxX=Math.max(0,(isForced?window.innerHeight:window.innerWidth)-80);
    const maxY=Math.max(0,(isForced?window.innerWidth:window.innerHeight)-40);
    const clampX=Math.min(Math.max(6,saved.left),maxX);
    const clampY=Math.min(Math.max(40,saved.top),isMobile?50:maxY);
    el.style.setProperty('left',clampX+'px','important');
    el.style.setProperty('top',clampY+'px','important');
    el.style.setProperty('right','auto','important');
    el.style.setProperty('bottom','auto','important');
   }
  }catch(_){}
 }
 const onPointerDown=e=>{
  if(e.button!==undefined&&e.button!==0)return;
  if(e.isPrimary===false)return;if(e.target&&e.target.closest('button'))return;
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
   const isMobile=window.innerWidth<=800||window.innerHeight<=600||document.body.classList.contains('touch')||isForced;const clampY=Math.min(Math.max(40,newTop),(isMobile&&storageKey==='pos_quest_tracker')?Math.min(60,maxY):maxY);
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
await loadingStage('正在整理画面，即将进入…');
const wayfindingLabels=scene.children.filter(o=>o.isSprite&&o.userData.wayfinding);
streetBounce=createNanjingBakedLight();streetBounce.bakeScene(scene);streetBounce.setNight(dayClock>=120);
photo=createPhotoMode({scene,camera,renderer,canvas,world,getPos:()=>pos,getYaw:()=>yaw,pause:pauseForPanel,resume:enter,canOpen:()=>started&&active&&!story?.filming&&!commute?.isRiding()&&!metro?.isRiding()&&!yuyuan?.isRiding()&&!activity?.isRiding()&&!gliding,notify,onCapture:meta=>{const pending=story?.state.chapter?.id==='lujiazui-view'&&story.state.edition>=3&&story.state.touristPhoto==='ready';story?.record({type:'travel-photo',...meta});if(pending)return story.state.touristPhoto==='thanks'?'拍到了 · 退出相机，听听游客的回应。感谢留言会自动收入手账。':'还没拍到目标游客 · 切换拍景，把游客放入画面后再拍即可。';},onKeepPhoto:photo=>story.keepPhoto(photo),onClose:()=>story?.afterPhoto()??false,beforeRender:()=>{outline.visible=false;yuyuan?.waterArt.prepareView(camera);}});
$('photo-open').onclick=()=>photo.open();
rainCrowd=createRainCrowd(npcGuides.actors.filter(p=>p.person&&!p.resident&&!p.metroRole),{world});
if(renderer.isWebGLRenderer){
 const staticMeshes=[];
 yuyuan.root.traverse(mesh=>{if(mesh.userData.yuyuanWallTarget)staticMeshes.push(mesh);});
 const wallCull=createStaticWallCull(staticMeshes,(x,y,z,neighborX,neighborZ)=>{
  const block=world.get(x,y,z);
  if(!block||block===9||world.get(neighborX,y,neighborZ))return false;
  // Chunk edits rebuild adjoining faces before the next render.
  const mesh=chunksByNum.get(chunkNum(Math.floor(x/CHUNK),Math.floor(z/CHUNK)));
  return !!mesh?.visible&&mesh.material===terrainMaterial;
 });
 const metroLines=Object.values(metro.lines);
 const allSurfaceOpenings=metroLines.flatMap(line=>line.surfaceOpenings);
 const surfaceOpeningBoxes=allSurfaceOpenings.map(o=>new THREE.Box3(new THREE.Vector3(o.minX,22,o.minZ),new THREE.Vector3(o.maxX,27.5,o.maxZ)));
 const metroInteriors=[metro.root.getObjectByName('occluded-metro-interior'),...metroLines.map(line=>line.root.getObjectByName('occluded-metro-interior'))].filter(Boolean);
 const tempHiddenMetroInteriors=[],metroGateFrustum=new THREE.Frustum(),metroGateProj=new THREE.Matrix4();
 const metroPanels=createMetroPanelOcclusion([metro.root,...metroLines.map(line=>line.root)],
  (x,y,z)=>hasMetroTerrainFace(x,y,z,x,y+1,z),allSurfaceOpenings,
  (x,y,z,adjacentX,adjacentZ)=>hasMetroTerrainFace(x,y,z,adjacentX,y,adjacentZ),hasMetroTerrainFace);
 function hasMetroTerrainFace(x,y,z,adjacentX,adjacentY,adjacentZ){
  const block=world.get(x,y,z);
  if(!block||block===9&&nanpuDeckCell(x,y,z)||world.get(adjacentX,adjacentY,adjacentZ))return false;
  const mesh=chunksByNum.get(chunkNum(Math.floor(x/CHUNK),Math.floor(z/CHUNK)));
  return !!mesh?.visible&&mesh.material===terrainMaterial;
 }
 const metroRoof=createMetroRoofOcclusion([scene.getObjectByName('nanjing-street-life'),
  scene.getObjectByName('city-traffic-details'),yuyuan.root],
  (x,y,z)=>hasMetroTerrainFace(x,y,z,x,y-1,z),
  (x,y,z,adjacentX,adjacentZ)=>hasMetroTerrainFace(x,y,z,adjacentX,y,adjacentZ));
 const beforeOcclusion=scene.onBeforeRender,afterOcclusion=scene.onAfterRender;
 scene.onBeforeRender=function(renderer,scene,camera,target){
  beforeOcclusion.call(this,renderer,scene,camera,target);
  nanjingSignBatch?.sync();
  yuyuanSignBatch?.sync();
  if(!renderer.clippingPlanes.length&&camera.layers.mask===1){
   wallCull.prepare(camera);
   if(!savedEdits.size&&!story?.filming&&!photo?.opened){
    const foot=camera===startupPreview?startupPreviewFoot:pos;
    const insideMetro=metroInterior(foot);
    if(!insideMetro&&camera.isPerspectiveCamera&&camera.position.y>=26.2&&surfaceOpeningBoxes.length){
     const pcx=Math.floor(camera.position.x/CHUNK),pcz=Math.floor(camera.position.z/CHUNK);
     let groundLoaded=true;
     for(let dx=-1;dx<=1&&groundLoaded;dx++)for(let dz=-1;dz<=1;dz++){
      if(!chunksByNum.has(chunkNum(pcx+dx,pcz+dz))){groundLoaded=false;break;}
     }
     if(groundLoaded){
      metroGateFrustum.setFromProjectionMatrix(metroGateProj.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
      if(!surfaceOpeningBoxes.some(box=>metroGateFrustum.intersectsBox(box))){
       for(const interior of metroInteriors){
        if(interior.visible){interior.visible=false;tempHiddenMetroInteriors.push(interior);}
       }
      }
     }
    }
    metroPanels.prepare(camera,scene.fog);
    if(insideMetro)metroRoof.prepare(camera);
   }
  }
 };
 scene.onAfterRender=function(...args){
  for(const interior of tempHiddenMetroInteriors)interior.visible=true;
  tempHiddenMetroInteriors.length=0;
  metroRoof.restore();metroPanels.restore();wallCull.restore();afterOcclusion.apply(this,args);
 };
}
for(const label of wayfindingLabels){label.updateMatrix();label.matrixAutoUpdate=false;}
skipHiddenMatrices(scene.getObjectByName('nanjing-paid-transfer-passage'));
skipHiddenMatrices(scene.getObjectByName('choreographed-harbour-fireworks'));
let startupPreview=null,startupPreviewFoot=null;
scene.updateMatrixWorld(true);
scene.getObjectByName('photo-referenced-led-media')?.traverse(o=>{o.matrixAutoUpdate=false;});
const transferPassage=scene.getObjectByName('nanjing-paid-transfer-passage');
if(transferPassage){transferPassage.matrixAutoUpdate=false;const inner=transferPassage.getObjectByName('occluded-metro-interior');if(inner)inner.matrixAutoUpdate=false;}
function freezeStaticSubtrees(node){if(node.userData.skipHiddenMatrices)return false;let allStatic=!node.matrixAutoUpdate;for(let i=0;i<node.children.length;i++)if(!freezeStaticSubtrees(node.children[i]))allStatic=false;if(allStatic&&node!==scene&&node.children.length>0&&node.updateMatrixWorld===THREE.Object3D.prototype.updateMatrixWorld){const orig=node.updateMatrixWorld;node.updateMatrixWorld=function(force){if(force||this.matrixWorldNeedsUpdate)orig.call(this,force);};}return allStatic;}
freezeStaticSubtrees(scene);
scene.matrixAutoUpdate=false;
const sceneInstances=createSceneInstances(scene,{mergeSolidColors:!!renderer.isWebGLRenderer});
const shaderWarmup=startShaderWarmup({renderer,scene,camera,busy:()=>document.hidden||active||!!story?.filming||!!startupPreview});
const startupParams=runtimeParams;
const testWarmup=startupParams.get('test')==='1'&&startupParams.get('turnWarmup')==='1'&&renderer.isWebGLRenderer&&!document.hidden;
const testEntryPhoto=isMobile&&startupParams.get('test')==='1'&&startupParams.get('holdRestoredEntry')==='1';
const initialView=testWarmup||testEntryPhoto?saves.startupView(MAP_REVISION):null;
const headingOnly=startupParams.get('headingWarmup')==='1';
const diagonalSweep=startupParams.get('sweepWarmup')==='3';
const extendedSweep=diagonalSweep||startupParams.get('sweepWarmup')==='2';
const waitBetweenViews=extendedSweep||startupParams.get('sweepWarmup')==='1';
const replaceMenuDraw=testWarmup&&initialView&&(headingOnly||waitBetweenViews||startupParams.get('textureWarmup')==='replace')&&document.documentElement.dataset.entryRequested==='true';
const savedStartupView=renderer.isWebGLRenderer&&!testWarmup&&!document.hidden&&document.documentElement.dataset.entryRequested==='true'&&
 !(startupParams.get('test')==='1'&&startupParams.get('bundWarmup')==='0')?saves.startupView(MAP_REVISION):null;
const bundWarmFoot=(()=>{
 if(testWarmup||document.hidden||document.documentElement.dataset.entryRequested!=='true'||(startupParams.get('test')==='1'&&startupParams.get('bundWarmup')==='0'))return null;
 const f=savedStartupView?.pos??(saves.freshBrowserEntry?LANDMARKS.bund:null);
 return f&&f.y>=25&&f.y<=29&&Math.hypot(f.x-LANDMARKS.bund.x,f.z-LANDMARKS.bund.z)<=36?f:null;
})();
if(bundWarmFoot)ensureChunks(bundWarmFoot);
if(isMobile){
 camera.position.set(32,29.8,69);camera.lookAt(126,52,42);camera.updateMatrixWorld(true);
 const previewCamera=camera.clone();previewCamera.aspect=Math.max(camera.aspect,3);previewCamera.updateProjectionMatrix();previewCamera.updateMatrixWorld(true);
 const visible=menuVisibleChunks(chunkWork.desired,previewCamera,CHUNK,HEIGHT);
 chunkWork.prioritize(visible);
 await loadingStage('正在补齐登录背景建筑…');
 while([...visible].some(key=>!chunks.has(key))){
  chunkWork.process(6);
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 if(!replaceMenuDraw)renderScene();
}else if(renderer.isWebGLRenderer&&!document.hidden){
 camera.position.set(32,29.8,69);camera.lookAt(126,52,42);camera.updateMatrixWorld(true);
 const visible=menuVisibleChunks(chunkWork.desired,camera,CHUNK,HEIGHT);
 chunkWork.prioritize(visible);
 const chunkDeadline=performance.now()+420;
 while(performance.now()<chunkDeadline&&([...visible].some(key=>!chunks.has(key))||chunkWork.desired.size>chunks.size)){
  chunkWork.process(10);
  await new Promise(resolve=>setTimeout(resolve,0));
 }
 if(!replaceMenuDraw)renderScene();
}
if(renderer.isWebGLRenderer&&bundWarmFoot&&!document.hidden){
 let restoreBundWarmupTime=null;
 const savedTime=savedStartupView?.dayClock;
 const warmClock=Number.isFinite(savedTime)?Math.max(0,savedTime)%240:dayClock;
 const night=warmClock>=120;
 if(night!==(dayClock>=120)){
  const prevClock=dayClock;
  dayClock=warmClock;
  updateSky(0);
  civil.tick(0,{night,rain:0,dayClock:warmClock,festival:false,showTime:0});
  activity.tick(0,{night,dayClock:warmClock});
  yuyuan.tick(0,{night});
  skyline.tick(0,{night,festival:false,time:0,showTime:0});
  nanjingSignBatch?.sync();
  restoreBundWarmupTime=()=>{
   dayClock=prevClock;
   const origNight=prevClock>=120;
   updateSky(0);
   civil.tick(0,{night:origNight,rain:0,dayClock:prevClock,festival:false,showTime:0});
   activity.tick(0,{night:origNight,dayClock:prevClock});
   yuyuan.tick(0,{night:origNight});
   skyline.tick(0,{night:origNight,festival:false,time:0,showTime:0});
   nanjingSignBatch?.sync();
  };
 }
 const signMaps=new Map(activity.signs.map(({mesh,day,night:afterDark})=>[mesh,(night?afterDark:day).map]));
 if(nanjingSignBatch){
  const atlasPages=nanjingSignBatch.activeTextures(night);
  for(const mesh of nanjingSignBatch.meshes)signMaps.set(mesh,atlasPages[mesh.userData.atlasPage]);
 }
 const roots=[scene.getObjectByName('nanjing-street-life'),yuyuan.root,scene.getObjectByName('city-traffic-details'),
  scene.getObjectByName('lujiazui-skyline'),...Object.values(metro.lines).map(line=>line.root)];
 try{
  const detail=await warmBundStreet(renderer,scene,camera,bundWarmFoot,roots,signMaps,()=>!document.hidden&&!bootReady,{
   budgetMs:isMobile?900:1350,
   pipeline:true,
   fullCircle:!isMobile||night,
   includeSceneMeshes:true,
   getTerrainChunks:()=>chunks.values()
  });
  if(startupParams.get('test')==='1')document.dispatchEvent(new CustomEvent('block-island-bund-prepared',{detail}));
 }catch(error){
  if(startupParams.get('test')==='1')document.dispatchEvent(new CustomEvent('block-island-bund-prepared',{detail:{error:String(error)}}));
 }finally{
  restoreBundWarmupTime?.();
 }
}
if(testWarmup&&!document.hidden){
 const view=initialView;
 startupPreviewFoot=view?.pos??LANDMARKS.bund;
 startupPreview=camera.clone();
 startupPreview.position.set(startupPreviewFoot.x,startupPreviewFoot.y+1.62,startupPreviewFoot.z);
 if(view)startupPreview.rotation.set(Number.isFinite(view.pitch)?view.pitch:-.08,Number.isFinite(view.yaw)?view.yaw:0,0,'YXZ');
 else startupPreview.lookAt(201,76,88);
 const previousTime=dayClock;
 try{
  await loadingStage('正在整理画面与附近街景…');
  if(view)ensureChunks(startupPreviewFoot,false,true);
  if(Number.isFinite(view?.dayClock)){dayClock=Math.max(0,view.dayClock)%240;updateSky(0);}
  if(view&&startupPreview.position.y>=22.25&&startupParams.get('warmSavedWeather')==='1'){
   const climate=new WeatherState();
   climate.restore(view.weather);
   setOutdoorFogRange(scene.fog,climate);
  }
  const fogFar=scene.fog.far;
  const warm=startupParams.has('textureWarmup')?warmStartupTextures:warmStartupViews;
  const stats=await warm(renderer,scene,startupPreview,()=>!document.hidden&&!bootReady,{
   drain:startupParams.get('drainWarmup')==='1',headingOnly,waitBetweenViews,extendedSweep,diagonalSweep
  });
  const hudStage=extendedSweep&&replaceMenuDraw&&startupParams.get('stageHud')==='1'
   ?await stageStartupHud(()=>renderer.render(scene,startupPreview),document):null;
  document.dispatchEvent(new CustomEvent('block-island-startup-warmup',{detail:{...stats,fogFar,hudStage,replacedMenuDraw:Boolean(replaceMenuDraw)}}));
 }catch(error){
  document.dispatchEvent(new CustomEvent('block-island-startup-warmup',{detail:{error:String(error)}}));
 }finally{
  startupPreview=null;
  startupPreviewFoot=null;
  dayClock=previousTime;
  updateSky(0);
 }
}
performanceProbe=createPerformanceProbe({renderer,profile:()=>renderProfile({mobile:isMobile,mode:mobileQuality,dpr:devicePixelRatio,width:innerWidth,height:innerHeight}),bootMs:performance.now(),subjects:[[civil,'tick','bund'],[civil.traffic,'tick','traffic'],[activity,'tick','nanjing'],...activity.profileSubjects,[metro,'tick','metro'],[yuyuan,'tick','garden'],[yuyuan.crowd,'tick','yuyuan-ambient-walkers'],[residents,'tick','residents'],[npcGuides,'tick','npc-ui'],[weather,'tick','weather'],[life,'tick','life'],...life.profileSubjects,[privateSuites,'tick','suites'],[towerInteriors,'tick','tower-interiors'],[chunkWork,'process','chunks'],[scene,'updateMatrixWorld','matrices'],[scene,'onBeforeRender','instances']]});
bootReady=true;
if(testEntryPhoto&&initialView&&document.documentElement.dataset.entryRequested==='true'&&!document.hidden)
 restoredEntryPhoto=holdRestoredEntryPhoto(document);
document.documentElement.dataset.gameReady='true';document.dispatchEvent(new Event('block-island-ready'));
$('play').disabled=false;$('play').innerHTML='进入我的小岛 · 开启旅程 <span>→</span>';
requestAnimationFrame(frame);



function unlockAudioGestures(){
 try{
  const ctx=getAudio();
  if(ctx&&ctx.state==='suspended')ctx.resume()?.catch(()=>{});
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
