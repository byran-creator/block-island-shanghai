import assert from 'node:assert/strict';
import {ShanghaiJourneyState,JOURNEY_SOUVENIR} from '../game/shanghai-journey-state.js';
import {shanghaiJourneyTarget} from '../game/shanghai-journey-targets.js';
import {line10ToWorld,LINE10_STATIONS} from '../game/metro-line10-layout.js';
const crossing=new ShanghaiJourneyState();crossing.phase='journey';crossing.index=3;const east={pos:{x:174,y:6,z:34},stations:[{id:'lujiazui',paid:true}]};assert(shanghaiJourneyTarget(crossing,east).label.includes('上行扶梯'));east.pos.y=16;assert(shanghaiJourneyTarget(crossing,east).label.includes('出站闸机'));east.stations[0].paid=false;assert(shanghaiJourneyTarget(crossing,east).label.includes('3号口'));east.pos.y=26;assert(shanghaiJourneyTarget(crossing,east).label.includes('上海中心'));
const s=new ShanghaiJourneyState();assert(s.begin());assert(!s.record({type:'shop'}));s.opened();assert(!s.record({type:'yuyuan-tea'}));assert(!s.record({type:'journey-claim'}));
assert(s.record({type:'journey-talk',npc:'lin'}));assert.equal(s.index,1);assert(!s.unlocked);assert(s.record({type:'shop'}));assert(s.unlocked);assert.equal(s.index,2);s.tracked=false;assert(!shanghaiJourneyTarget(s,{pos:{x:0,y:26,z:0}}));
for(const e of [{type:'metro10',from:'nanjing',to:'yuyuan'},{type:'metro10',from:'yuyuan',to:'nanjing',departed:true},{type:'metro',from:'nanjing',to:'lujiazui',departed:false}])assert(!s.record(e),'Wrong line/direction/incomplete trip cannot skip the story');
const copy=new ShanghaiJourneyState();copy.restore(s.serialize());assert.equal(copy.index,2);assert.equal(copy.tracked,false);s.tracked=true;
assert(s.record({type:'metro',from:'nanjing',to:'lujiazui',departed:true}));assert(s.record({type:'sky'}));assert(!s.record({type:'metro',from:'nanjing',to:'lujiazui',departed:true}));assert(s.record({type:'metro',from:'lujiazui',to:'nanjing',departed:true}));assert(s.record({type:'metro10',from:'nanjing',to:'yuyuan',departed:true}));assert(!s.record({type:'yuyuan-entry'}));assert(s.record({type:'journey-talk',npc:'gu'}));assert(s.record({type:'yuyuan-entry'}));
assert(!s.record({type:'journey-view',visible:true,seconds:1.9}));assert(!s.record({type:'journey-view',visible:false,seconds:4}));assert(s.record({type:'journey-view',visible:true,seconds:2}));assert(s.record({type:'yuyuan-tea'}));assert(s.record({type:'journey-claim',memory:'茶香',at:'2026-10-16T01:00:00Z'}));assert(s.complete);assert.deepEqual(s.inventory,{[JOURNEY_SOUVENIR]:1});assert(!s.record({type:'journey-claim'}));
const done=new ShanghaiJourneyState();done.restore(s.serialize());assert(done.complete);assert.equal(done.phase,'complete','Interrupted ending does not award again or replay automatically');assert.equal(done.memory,'茶香');assert.deepEqual(done.inventory,s.inventory);
const legacy=new ShanghaiJourneyState();legacy.restore(undefined);assert.equal(legacy.phase,'new');assert.equal(legacy.tracked,false,'Old saves opt in; never infer journey progress from unrelated old quests');
const opening=new ShanghaiJourneyState();opening.begin();const resumed=new ShanghaiJourneyState();resumed.restore(opening.serialize());assert.equal(resumed.phase,'journey','Resume an interrupted opener without trapping the player');
const t=new ShanghaiJourneyState();t.phase='journey';t.index=6;const st=LINE10_STATIONS[1],ctx={pos:line10ToWorld({x:st.x,y:6,z:3}),stations:[{id:'yuyuan',checked:true,paid:true}]};assert(shanghaiJourneyTarget(t,ctx).label.includes('上行扶梯'));ctx.pos=line10ToWorld({x:st.x,y:16,z:0});assert(shanghaiJourneyTarget(t,ctx).label.includes('出站闸机'));ctx.stations[0].paid=false;assert(shanghaiJourneyTarget(t,ctx).label.includes('1号口'));ctx.pos={x:-77,y:26,z:264};assert(shanghaiJourneyTarget(t,ctx).label.includes('顾先生'));t.gardenTalk=true;assert(shanghaiJourneyTarget(t,ctx).x>-75,'Entry target points through the open gate');
t.index=7;ctx.pos={x:-73,y:26,z:265};assert(shanghaiJourneyTarget(t,ctx).x>-73&&shanghaiJourneyTarget(t,ctx).z>260,'Route follows the real garden paths before approaching the window');t.index=8;ctx.pos={x:-64,y:26,z:233};assert(shanghaiJourneyTarget(t,ctx).x>-64,'Bridge guidance advances past the entrance');ctx.pos={x:-54,y:26,z:240};assert(shanghaiJourneyTarget(t,ctx).z>=243,'Bridge guidance follows the bend rather than crossing water');
console.log('PASS: sequential real-action story, first-two-chapter freedom, suspended tracking, correct line/exit/gate/window/bridge guidance, interrupted films, legacy saves and single souvenir award.');

import {VoxelWorld,overlaps} from '../game/world.js';
import {sampleJourneyShot} from '../game/journey-cinematography.js';
import {JOURNEY_ACTORS,JOURNEY_FILMS} from '../game/shanghai-journey-content.js';
const world=new VoxelWorld();for(const a of Object.values(JOURNEY_ACTORS)){assert(!overlaps(world,a.x,a.y,a.z),a.name+' must stand outside walls');assert(world.get(Math.floor(a.x),25,Math.floor(a.z)),a.name+' needs a real floor');}
for(const shot of [...JOURNEY_FILMS.opening,...JOURNEY_FILMS.ending])for(let i=0;i<=40;i++){const frame=sampleJourneyShot(shot,shot.duration*i/40);assert(!world.get(...frame.position.map(Math.floor)),'Cinematic camera cannot pass through voxel architecture');assert(frame.fov>=45&&frame.fov<=65);assert(frame.caption>=0&&frame.caption<=1);}
for(const shot of JOURNEY_FILMS.opening){assert.deepEqual(sampleJourneyShot(shot,0).position,shot.from);assert.deepEqual(sampleJourneyShot(shot,shot.duration).position,shot.to);assert.equal(sampleJourneyShot(shot,0).shade,1);assert.equal(sampleJourneyShot(shot,shot.duration/2).shade,0);}
console.log('PASS: actual generated world supports all story actors and all seven cinematic camera paths avoid solid blocks.');
import {createJourneySounds} from '../game/journey-sounds.js';
let enabled=true,volume=.3,openedAudio=0;const voices=[],gains=[];
const audio={currentTime:1,destination:{},createOscillator(){const n={frequency:{},connect(){},disconnect(){this.disconnected=true;},start(){},stop(t){if(t===undefined)this.onended?.();}};voices.push(n);return n;},createGain(){const n={gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){this.disconnected=true;}};gains.push(n);return n;}};
const cue=createJourneySounds({getAudio:()=>{openedAudio++;return audio;},getSound:()=>enabled,getVolume:()=>volume});
cue.play('accept');assert.equal(voices.length,3);cue.stop();assert(voices.every(v=>v.disconnected)&&gains.every(g=>g.disconnected),'Stopped motifs release all oscillators and gains');cue.play('complete');assert.equal(voices.length,7);cue.play('reward');assert(voices.slice(3,7).every(v=>v.disconnected),'A new cue stops its predecessor');cue.stop();const count=openedAudio;enabled=false;cue.play();enabled=true;volume=0;cue.play();assert.equal(openedAudio,count,'Mute and zero volume do not allocate an audio context');
console.log('PASS: original quest motifs obey mute/zero volume and cancel/disconnect audio nodes.');

import {roadContains} from '../game/city-layout.js';
assert(!roadContains(JOURNEY_ACTORS.lin.x,JOURNEY_ACTORS.lin.z),'The opening volunteer must stand on the promenade, away from traffic');

// Cinematic ownership must restore the real Three.js camera and scene labels.
import * as THREE from '../game/three.module.js';
import {createShanghaiJourney} from '../game/shanghai-journey.js';
const originalDocument=globalThis.document,originalMatchMedia=globalThis.matchMedia;
const context=new Proxy({measureText:s=>({width:String(s).length*10}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>k in o?o[k]:()=>{}}),elements=new Map();
const element=()=>({style:{},children:[],classList:{add(){},remove(){}},append(...x){this.children.push(...x);},appendChild(x){this.children.push(x);},replaceChildren(...x){this.children=x;},setAttribute(){},addEventListener(){},insertAdjacentElement(){},focus(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>context});
globalThis.document={hidden:false,body:element(),createElement:element,getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelector:()=>null};
try{
 for(const reduced of [false,true]){
  globalThis.matchMedia=()=>({matches:reduced});const scene=new THREE.Scene(),label=new THREE.Sprite();scene.add(label);const camera=new THREE.PerspectiveCamera(72,1.5,.1,360);camera.position.set(10,30,80);camera.lookAt(0,30,20);const initial=camera.position.clone(),rotation=camera.quaternion.clone(),prefetched=[];
  const ui=createShanghaiJourney({scene,camera,getContext:()=>({pos:{x:46.5,y:26,z:85.5}}),pause(){},resume(){},placeStart(){},prefetch:p=>prefetched.push(p),getAudio:()=>null,getSound:()=>false,getVolume:()=>0});
  assert(ui.maybeStart());ui.filmFrame(2);const sample=sampleJourneyShot(JOURNEY_FILMS.opening[0],2);assert.equal(label.visible,false);if(reduced){assert(camera.position.equals(initial));assert.equal(camera.fov,72);}else{assert(camera.position.distanceTo(new THREE.Vector3(...sample.position))<1e-9);assert.equal(camera.fov,sample.fov);assert.equal(prefetched.length,2);}
  ui.handleKey({code:'Escape',preventDefault(){}});assert(!ui.filming);assert(camera.position.equals(initial));assert(camera.quaternion.angleTo(rotation)<1e-7);assert.equal(camera.fov,72);assert.equal(label.visible,true);assert.equal(ui.state.phase,'journey');
  ui.state.restore({version:1,phase:'new',index:0});ui.openJournal();ui.restore(undefined);assert.equal(ui.state.phase,'new');assert.equal(ui.state.tracked,false);
 }
 console.log('PASS: actual Three camera rails, lens restoration, scene-label cleanup, skippable introduction and reduced-motion static frames.');
}finally{globalThis.document=originalDocument;globalThis.matchMedia=originalMatchMedia;}
