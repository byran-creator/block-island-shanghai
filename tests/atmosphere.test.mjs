import assert from 'node:assert/strict';
import {WeatherState,createWeather} from '../game/weather.js';
import * as THREE from '../game/three.module.js';
import {clockLabel,clockMinutes,phaseFromMinutes,clockOptions,advanceDay} from '../game/day-time.js';
import {TRACKS,createMusic} from '../game/music.js';
import {BUND_BUILDINGS,roadX,promenadeX} from '../game/bund.js';
import {REPLACED_BUILDING_IDS} from '../game/city-layout.js';
import {VoxelWorld,overlaps} from '../game/world.js';
const world=new VoxelWorld();
assert.equal(BUND_BUILDINGS.length,14);assert(REPLACED_BUILDING_IDS.has('avenue-7'),'The parcel intersecting Nanpu bridge must yield to the bridge clearance');
let cityArea=0;for(let x=90;x<289;x++)for(let z=8;z<=215;z++)if(world.surfaceAt(x,z)>23)cityArea++;assert(cityArea>25000,'Expansion must be in Lujiazui');let bundArea=0;for(let x=-52;x<94;x++)for(let z=16;z<=195;z++)if(world.surfaceAt(x,z)>23)bundArea++;assert(bundArea>18000,'Expand the actual west-bank Bund land');assert(world.surfaceAt(90,245)<23,'Keep water between the main city and personal island');
for(const b of BUND_BUILDINGS){assert(!overlaps(world,b.front+1.5,26,b.z+.5),`${b.id} doorway blocked`);assert(overlaps(world,b.front+1.5,25.9,b.z+.5));assert(world.protected(b.x,30,b.z-b.rz));assert(b.front<roadX(b.z)-3&&roadX(b.z)+3<promenadeX(b.z)-9);assert(b.front<promenadeX(b.z),'Every historic facade belongs to the Bund west bank');}
assert(new Set(BUND_BUILDINGS.map(b=>b.x)).size>5,'Bund buildings must follow the curved riverbank');
const climate=new WeatherState();climate.setMode('rain');climate.tick(40);assert(climate.rain>.99);climate.setMode('fog');climate.tick(40);assert(climate.fog>.99);assert(climate.rain<.01);const restored=new WeatherState();restored.restore(climate.serialize());assert.deepEqual(restored.serialize(),climate.serialize());assert(!restored.setMode('invalid'));restored.setMode('auto');restored.tick(1800);assert.equal(restored.type,'rain');
// Midnight/noon conversion, exact full-day progression and persisted clock preferences.
for(let minute=0;minute<1440;minute++)assert.equal(clockMinutes(phaseFromMinutes(minute)),minute);
assert.equal(clockLabel(36),'09:36');assert.equal(clockLabel(180),'00:00');
for(const cycleSeconds of [1200,2400,3600,7200]){const options=clockOptions({cycleSeconds,paused:false});assert.equal(advanceDay(36,cycleSeconds,options),36);assert.equal(advanceDay(36,cycleSeconds/2,options),156);assert.equal(advanceDay(36,100,{...options,paused:true}),36);assert.deepEqual(clockOptions(JSON.parse(JSON.stringify(options))),options);}
assert.deepEqual(clockOptions({cycleSeconds:0,paused:'yes'}),{cycleSeconds:2400,paused:false});
const camera=new THREE.PerspectiveCamera(),scene=new THREE.Scene();camera.position.set(60,28,90);scene.fog=new THREE.Fog('#777777',48,440);scene.background=new THREE.Color();
const sunBlock=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial()),clouds=new THREE.Group(),cloudMat=new THREE.MeshBasicMaterial(),water=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshBasicMaterial()),terrainMaterial=new THREE.MeshBasicMaterial();
const sky=createWeather({scene,camera,world,sunBlock,clouds,cloudMat,water,terrainMaterial});sky.tick(0,180);const relative=sky.moon.position.clone().sub(camera.position);
assert(sky.moon.visible);assert.equal(sky.moon.children[0].geometry.type,'CircleGeometry');assert(Math.abs(relative.length()-245)<1e-8);assert(Math.asin(relative.y/relative.length())>Math.PI/4,'Moon should rise well above city roofs at midnight');assert(sky.moon.children[0].material.transparent&&sky.moon.children[0].material.opacity<.7);
camera.position.add(new THREE.Vector3(20,10,-12));sky.tick(0,180);assert(sky.moon.position.clone().sub(camera.position).distanceTo(relative)<1e-8,'Walking must not make the moon feel like a nearby object');sky.tick(0,60);assert(!sky.moon.visible);sky.state.setMode('fog');sky.tick(60,180);assert(!sky.moon.visible,'Heavy mist should hide the distant moon');
// Drive the actual Web Audio scheduler using a recording AudioContext facade.
const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};const events=[];
const param=()=>({value:0,setValueAtTime(v,t){assert(Number.isFinite(v)&&Number.isFinite(t));this.value=v;},exponentialRampToValueAtTime(v,t){assert(v>0);this.value=v;},setTargetAtTime(v,t){this.value=v;}});
const node=()=>({gain:param(),frequency:param(),pan:param(),delayTime:param(),connect(){},disconnect(){}});
const ctx={currentTime:0,state:'running',destination:{},resume:()=>Promise.resolve(),createGain:node,createStereoPanner:node,createBiquadFilter:node,createDelay:node,createOscillator(){const n=node();n.start=t=>events.push({kind:'start',t,frequency:n.frequency.value});n.stop=t=>events.push({kind:'stop',t});return n;}};
const music=createMusic(()=>ctx);assert.equal(music.track.id,'river');assert(music.start());assert(events.some(e=>e.kind==='start'));
for(const track of TRACKS){assert(music.setTrack(track.id));for(let t=0;t<4;t++){ctx.currentTime+=.8;music.schedule();}assert.equal(music.track.id,track.id);assert(music.voiceCount<500);}
assert(!music.setTrack('unknown'));assert.equal(JSON.parse(storage.get('block-island-music-preferences')).track,TRACKS.at(-1).id);music.dispose();const again=createMusic(()=>ctx);assert.equal(again.track.id,TRACKS.at(-1).id);again.dispose();
console.log('PASS: Bund lobbies and waterfront order, expanded main island, weather transitions / persistence, all six BGM schedules and track preferences.');
