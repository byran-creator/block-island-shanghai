import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {rainRecordingBuffer,createRainAmbience} from '../game/rain-ambience.js';
import {createRainCrowd,rainExposure} from '../game/rain-crowd.js';
import {createSceneInstances} from '../game/scene-instancing.js';
import {createSceneAudio,soundScene} from '../game/scene-audio.js';

const asset=readFileSync('game/assets/audio/rain-gentle-qk.wav');
const bytes=asset.buffer.slice(asset.byteOffset,asset.byteOffset+asset.byteLength);
const nodes=[],param=()=>({value:0,setTargetAtTime(v){this.value=v;}}),node=()=>{const n={gain:param(),frequency:param(),edges:[],connect(target){this.edges.push(target);},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;}};nodes.push(n);return n;};
let buffers=0;const ctx={sampleRate:48000,currentTime:0,createBuffer:(c,n,rate)=>{buffers++;const data=Array.from({length:c},()=>new Float32Array(n));return {numberOfChannels:c,length:n,sampleRate:rate,duration:n/rate,getChannelData:i=>data[i]};},createBufferSource:node,createBiquadFilter:node,createGain:node};
const decoded=rainRecordingBuffer(ctx,bytes);assert.equal(decoded.sampleRate,16000);assert.equal(decoded.duration,18);assert.equal(decoded.numberOfChannels,2);assert.equal(decoded.length*decoded.numberOfChannels*4,2304000);
const left=decoded.getChannelData(0),right=decoded.getChannelData(1),rms=Math.sqrt(left.reduce((n,v)=>n+v*v,0)/left.length);assert(rms>.04&&rms<.2);assert.notDeepEqual(left,right);
assert(Math.abs(left[0]-left.at(-1))<.15,'The wrap seam must remain within the natural rain texture');
assert.throws(()=>rainRecordingBuffer(ctx,new ArrayBuffer(20)));assert.throws(()=>rainRecordingBuffer(ctx,new ArrayBuffer(1300001)));
const corrupt=bytes.slice(0);new DataView(corrupt).setUint32(40,1e9,true);assert.throws(()=>rainRecordingBuffer(ctx,corrupt));
let requests=0,release;const fetchAudio=()=>{requests++;return new Promise(resolve=>release=()=>resolve({ok:true,arrayBuffer:async()=>bytes}));};
const startNodes=nodes.length,audio=createRainAmbience(ctx,{}, {fetchAudio}),gain=nodes[startNodes+1];
audio.update(0);assert.equal(requests,0,'Sunny startup must neither download nor play rain');
audio.update(1);assert.equal(requests,1);const pending=audio.pending;audio.update(0);release();await pending;
assert(audio.ready);assert(!nodes.slice(startNodes).some(n=>n.started),'An old pending request cannot start rain after the weather clears');
audio.update(1);assert.equal(nodes.filter(n=>n.started).length,1);assert(gain.gain.value>.2);const allocated=buffers;
audio.update(1,.12);assert(gain.gain.value<.05);audio.update(.03);assert.equal(gain.gain.value,0,'Invisible rain below the particle threshold must be silent');
for(let i=0;i<30;i++){audio.update(1);audio.update(0);}assert.equal(buffers,allocated);assert.equal(requests,1);audio.dispose();assert.equal(audio.level,0);assert(nodes.slice(startNodes).every(n=>n.disconnected));

// Check the actual mixer at real waterfront positions, including a saved rain
// residue while the selected weather is clear. Preserve the separate river sound.
Object.assign(ctx,{destination:{},resume(){},createOscillator:node,createStereoPanner(){const n=node();n.pan=param();return n;}});
let mixerRequests=0;const mixerIndex=nodes.length,ambient=createSceneAudio(()=>ctx,{rainOptions:{fetchAudio:async()=>{mixerRequests++;return {ok:true,arrayBuffer:async()=>bytes};}}});
assert(ambient.start());const master=nodes[mixerIndex];
for(const pos of [{x:40,y:26,z:84},{x:36,y:26,z:50},{x:0,y:26,z:84}])ambient.update(.1,{playing:true,pos,rain:.8,weatherType:'clear',volume:.28,agents:[]});
assert.equal(mixerRequests,0,'No rain in sunny weather, even with a fading saved intensity');
const shoreFilter=nodes.slice(mixerIndex).find(n=>n.frequency.value===470);
const waterfront={x:40,y:26,z:84};ambient.update(.1,{playing:true,pos:waterfront,weatherType:'clear',rain:0,agents:[]});
assert(soundScene(waterfront).water>0);assert.equal(shoreFilter.edges[0].gain.value,soundScene(waterfront).water*.08,'Preserve the original river sound and distance falloff');
const state={playing:true,pos:{x:40,y:26,z:84},rain:.9,weatherType:'rain',volume:.28,agents:[]};ambient.update(.1,state);assert.equal(mixerRequests,1);assert(master.gain.value>0);
await new Promise(resolve=>setTimeout(resolve,0));
ambient.update(.1,{...state,weatherType:'clear',rain:.8});
const rainFilter=nodes.slice(mixerIndex).find(n=>n.frequency.value===4400);assert.equal(rainFilter.edges[0].gain.value,0,'Changing to clear stops rain even while the weather intensity fades');
for(const pos of [{x:-150,y:26,z:66},{x:180,y:26,z:100},{x:-30,y:26,z:280}]){
 ambient.update(.1,{...state,pos});assert(rainFilter.edges[0].gain.value>0,'Rain plays across outdoor city areas, independently of the river');
}
assert.equal(mixerRequests,1,'Moving across rainy areas reuses the same recording');
ambient.update(.1,{...state,hidden:true});assert.equal(master.gain.value,0);ambient.update(.1,{...state,sound:false});assert.equal(master.gain.value,0);ambient.suspend();assert.equal(master.gain.value,0);ambient.dispose();
// Disposing while a file is pending must not allocate a new buffer or source.
const dying=createRainAmbience(ctx,{}, {fetchAudio});dying.update(1);const dyingPending=dying.pending;dying.dispose();const afterDispose=buffers;release();await dyingPending;assert.equal(buffers,afterDispose);

const world={get:(x,y)=>x>=50&&y===30?3:0},scene=new T.Scene();
const people=Array.from({length:30},(_,i)=>{const root=new T.Group(),arm=new T.Mesh(new T.BoxGeometry(.15,.55,.18),new T.MeshLambertMaterial());root.position.set(i*2,26,0);root.add(arm);scene.add(root);return {root,arms:[arm],ready:true};});
people[4].camera={};const crowd=createRainCrowd(people,{world});assert(crowd.entries.length>=6&&crowd.entries.length<people.length/2);
crowd.tick(0,1);assert(crowd.entries.some(e=>e.root.visible));assert(!crowd.entries.some(e=>e.person===people[4]));
for(const e of crowd.entries){assert.equal(e.root.visible,e.person.root.position.x<50);if(e.root.visible)assert(e.arm.rotation.x>1);}
assert.equal(rainExposure(world,{x:55,y:26,z:0}),.12);assert.equal(rainExposure(world,{x:0,y:15,z:0}),0);
assert.equal(rainExposure({get:()=>5},{x:0,y:26,z:0}),1,'Tree foliage is not an indoor roof');
const e=crowd.entries.find(e=>e.root.visible);crowd.beginTick();assert.equal(e.arm.rotation.x,0);e.person.root.position.x=55;crowd.tick(.01,1);assert(!e.root.visible,'Entering shelter closes the umbrella immediately');
const resources=new Set();scene.traverse(o=>{if(o.isMesh)resources.add(o.geometry);});const before=resources.size;
createSceneInstances(scene);crowd.beginTick();crowd.tick(0,0);assert(crowd.entries.every(e=>!e.root.visible));crowd.beginTick();crowd.tick(0,1);
const camera=new T.PerspectiveCamera(72,2,.1,200);camera.position.set(10,29,12);camera.lookAt(20,27,0);camera.updateMatrixWorld(true);scene.updateMatrixWorld(true);scene.onBeforeRender(null,scene,camera);
assert(before<=people.length+2,'All umbrellas share one canopy and one shaft geometry');assert(scene.children.some(o=>o.isInstancedMesh&&o.count>0),'Rain accessories retain the shared render path');
assert(crowd.entries.every(e=>e.root.children.every(o=>!o.isLight)));
console.log(JSON.stringify({rainBufferBytes:2304000,people:people.length,umbrellas:crowd.entries.length,sharedCanopy:true,shelter:true}));
