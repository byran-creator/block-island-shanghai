import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {rainSamples,createRainAmbience} from '../game/rain-ambience.js';
import {createRainCrowd,rainExposure} from '../game/rain-crowd.js';
import {createSceneInstances} from '../game/scene-instancing.js';
import {createSceneAudio} from '../game/scene-audio.js';

const samples=rainSamples(8000),rms=a=>Math.sqrt(a.reduce((n,v)=>n+v*v,0)/a.length);
assert.equal(samples.length,2);assert(samples.every(a=>a.length===56000&&rms(a)>.1&&rms(a)<.6&&a.every(Number.isFinite)));
assert.notDeepEqual(samples[0],samples[1]);assert.deepEqual(samples,rainSamples(8000),'Reproducible original rain, no network or speech dependency');
const nodes=[],param=()=>({value:0,setTargetAtTime(v){this.value=v;}}),node=()=>{const n={gain:param(),frequency:param(),connect(){},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;}};nodes.push(n);return n;};
let buffers=0;const ctx={sampleRate:8000,currentTime:0,createBuffer:(c,n)=>{buffers++;const data=Array.from({length:c},()=>new Float32Array(n));return {getChannelData:i=>data[i]};},createBufferSource:node,createBiquadFilter:node,createGain:node};
const audio=createRainAmbience(ctx,{}),gain=nodes[2];audio.update(1);const wet=gain.gain.value;assert(wet>.2);audio.update(1,.12);assert(gain.gain.value<wet/4);audio.update(0);assert.equal(gain.gain.value,0);for(let i=0;i<100;i++)audio.update(.5);assert.equal(buffers,1,'Rain transitions never allocate new AudioBuffers');audio.dispose();assert(nodes.every(n=>n.disconnected));assert(nodes[0].stopped);
const rootIndex=nodes.length;Object.assign(ctx,{destination:{},resume(){},createOscillator:node,createStereoPanner(){const n=node();n.pan=param();return n;}});
const ambient=createSceneAudio(()=>ctx),state={playing:true,pos:{x:305,y:26,z:140},rain:1,volume:.28,agents:[]};
assert(ambient.start());const master=nodes[rootIndex];ambient.update(.1,state);assert(master.gain.value>0);const allocated=buffers;
ambient.update(.1,{...state,hidden:true});assert.equal(master.gain.value,0);ambient.update(.1,{...state,sound:false});assert.equal(master.gain.value,0);ambient.suspend();assert.equal(master.gain.value,0);ambient.dispose();assert.equal(buffers,allocated);

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
console.log(JSON.stringify({rainBufferBytes:samples[0].byteLength*2,people:people.length,umbrellas:crowd.entries.length,sharedCanopy:true,shelter:true}));
