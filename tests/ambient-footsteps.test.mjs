import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createFootsteps,createNearbyFootsteps} from '../game/footsteps.js';
import {createGardenAmbience} from '../game/garden-ambience.js';
import {pcmRecordingBuffer} from '../game/pcm-recording.js';
import {createSceneAudio} from '../game/scene-audio.js';

const nodes=[],buffers=[],param=()=>({value:0,setValueAtTime(v){this.value=v;},setTargetAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;}});
const node=()=>{const n={gain:param(),frequency:param(),pan:param(),playbackRate:param(),edges:[],connect(n){this.edges.push(n);},disconnect(){this.disconnected=true;},start(){this.started=true;},stop(){this.stopped=true;}};nodes.push(n);return n;};
const ctx={currentTime:0,sampleRate:48000,destination:{},resume(){},createGain:node,createBiquadFilter:node,createStereoPanner:node,createOscillator:node,createBufferSource:node,createBuffer(c,n,rate){const channels=Array.from({length:c},()=>new Float32Array(n)),b={sampleRate:rate,length:n,numberOfChannels:c,duration:n/rate,getChannelData:i=>channels[i]};buffers.push(b);return b;}};
const output={},steps=createFootsteps(ctx,output),allocated=buffers.length;
for(let i=0;i<12;i++)steps.play({surface:i%2?7:3});
assert.equal(buffers.length,allocated,'Every player and crowd step reuses the small PCM buffer');
let active=nodes.filter(n=>n.buffer&&n.started&&!n.stopped);assert.equal(active.length,4,'Overlapping shoe impacts are bounded');
assert.notEqual(active[0].playbackRate.value,active[1].playbackRate.value,'Wood and paving have distinct shoe tone');
assert(active[0].edges[0].gain.value>=.2,'Player step is audible rather than the old .016-level oscillator');
steps.stop();assert(active.every(n=>n.stopped&&n.disconnected));steps.dispose();const count=nodes.length;steps.play();assert.equal(nodes.length,count);

const sounds=[],crowd=createNearbyFootsteps(s=>sounds.push(s)),root={visible:true,position:{x:1,y:26,z:0}},actor={root,person:true},p={x:0,y:26,z:0};
const far=Array.from({length:1000},()=>({person:true,root:{visible:true,position:{x:100,y:26,z:0}}}));const people=[actor,...far];
crowd.update(.2,people,p);assert.equal(sounds.length,0);
for(let i=0;i<3;i++){root.position.x+=.3;crowd.update(.2,people,p);}
assert.equal(sounds.length,1);assert(sounds[0].level>0&&sounds[0].level<.075);assert(sounds[0].pan>0);
for(let i=0;i<8;i++)crowd.update(.2,people,p);assert.equal(sounds.length,1,'Stopped crowds do not keep stepping');
root.position.x=20;crowd.update(.2,people,p);root.position.x=2;crowd.update(.2,people,p);assert.equal(sounds.length,1,'Returning NPC needs new motion, not a teleport step');
crowd.reset();root.position.x+=.9;crowd.update(.2,people,p);assert.equal(sounds.length,1,'Pause resets remembered crowd motion');
actor.metroRole='乘客';root.position.x+=.9;crowd.update(.2,people,p);assert.equal(sounds.length,1,'A passenger carried by a train is not walking');

const file=await readFile('game/assets/audio/garden-birds-sadiquecat.wav'),bytes=file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength),decoded=pcmRecordingBuffer(ctx,bytes);
assert.equal(decoded.sampleRate,16000);assert.equal(decoded.duration,18);assert.equal(decoded.numberOfChannels,1);assert.equal(file.length,576044);assert.equal(decoded.length*4,1152000);
const data=decoded.getChannelData(0);assert(Math.sqrt(data.reduce((s,v)=>s+v*v,0)/data.length)>.05);assert(Math.abs(data[0]-data.at(-1))<.04,'Crossfaded bird loop should have a quiet seam');
let requests=0,release;const fetchAudio=()=>{requests++;return new Promise(resolve=>release=()=>resolve({ok:true,arrayBuffer:async()=>bytes}));};
const garden=createGardenAmbience(ctx,output,{fetchAudio});garden.update(0);assert.equal(requests,0,'No garden download on city startup');garden.update(.55);const pending=garden.pending;garden.suspend();const sourceCount=nodes.filter(n=>n.started).length;release();await pending;assert(garden.ready);assert.equal(nodes.filter(n=>n.started).length,sourceCount,'A late download cannot play after leaving or pausing');
garden.update(.55);const source=nodes.findLast(n=>n.buffer&&n.started);assert.equal(source.buffer.sampleRate,16000);garden.update(.11);assert.equal(source.edges[0].gain.value,.11);garden.suspend();assert(source.stopped&&source.disconnected);
const bufferCount=buffers.length;garden.update(.55);assert.equal(requests,1);assert.equal(buffers.length,bufferCount);
const leaving=nodes.findLast(n=>n.buffer&&n.started);garden.update(0);assert(!leaving.stopped,'Leaving fades rather than cutting a bird call');ctx.currentTime+=1.6;garden.update(0);assert(leaving.stopped);garden.dispose();
const dying=createGardenAmbience(ctx,output,{fetchAudio});dying.update(.5);const late=dying.pending;dying.dispose();const before=buffers.length;release();await late;assert.equal(buffers.length,before);
let failedRequests=0;const missing=createGardenAmbience(ctx,output,{fetchAudio:async()=>{failedRequests++;return {ok:false};}});missing.update(.5);await missing.pending;for(let i=0;i<60;i++)missing.update(.5);assert.equal(failedRequests,1,'Failed recordings cannot start a request every frame');ctx.currentTime+=21;missing.update(.5);await missing.pending;assert.equal(failedRequests,2);missing.dispose();

// Actual mixer: explicit walking state, different floor heights, and engine mix.
const mixer=createSceneAudio(()=>ctx,{speech:null,Utterance:null});mixer.start();
const state={playing:true,pos:{x:305,y:26,z:140},travel:.4,walking:true};
const impacts=()=>nodes.filter(n=>n.buffer?.length===2400&&n.started).length;const initial=impacts();
for(let i=0;i<3;i++)mixer.update(.1,state);assert(impacts()>initial);
const walked=impacts();for(const change of [{walking:false},{riding:true},{sound:false},{hidden:true},{playing:false},{travel:10},{travel:0}]){for(let i=0;i<4;i++)mixer.update(.1,{...state,...change});assert.equal(impacts(),walked);}
for(let i=0;i<3;i++)mixer.update(.1,{...state,pos:{...state.pos,y:47}});assert(impacts()>walked,'Elevated indoor floors are no longer excluded by a fixed y range');
const agent={travelSpeed:4,root:{position:state.pos}};mixer.update(.1,{...state,travel:0,agents:[agent]});const engine=nodes.findLast(n=>n.frequency?.value===78).edges[0];assert.equal(engine.gain.value,.019,'Vehicle gain increases modestly and remains distance based');
mixer.suspend();mixer.dispose();
console.log('PASS: audible reused footsteps, bounded nearby walkers, grounded mixer integration, vehicle gain, lazy CC0 garden PCM and pause/failure/disposal lifecycle.');
