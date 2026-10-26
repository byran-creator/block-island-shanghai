import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';import {createSceneAudio} from '../game/scene-audio.js';
const bytes=await readFile(new URL('../game/assets/audio/rain-gentle-qk.wav',import.meta.url)),nodes=[];
const param=()=>({value:0,setTargetAtTime(v){this.value=v;},setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;}});
const ctx={state:'running',currentTime:0,sampleRate:16000,destination:{},resume:()=>Promise.resolve(),createBuffer(c,n,rate){const data=new Float32Array(n);return {length:n,sampleRate:rate,getChannelData:()=>data};}};
const make=()=>{const n={gain:param(),frequency:param(),pan:param(),playbackRate:{value:1},edges:[],connect(o){this.edges.push(o);},disconnect(){},start(){this.started=ctx.currentTime;},stop(){this.stopped=true;}};nodes.push(n);return n;};
Object.assign(ctx,{createGain:make,createBiquadFilter:make,createStereoPanner:make,createBufferSource:make,createOscillator:make});
const audio=createSceneAudio(()=>ctx,{speech:null,Utterance:null,rainOptions:{fetchAudio:async()=>({ok:true,arrayBuffer:async()=>bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)})}});
const state={playing:true,sound:true,volume:.28,pos:{x:305,y:26,z:140},rain:1,rainExposure:1,weatherType:'rain',walking:false,travel:0};
function tick(change={}){ctx.currentTime+=1/30;for(const n of nodes)if(n.buffer?.length===2400&&!n.stopped&&n.onended&&ctx.currentTime-n.started>.2){const end=n.onended;n.onended=null;end();}audio.update(1/30,{...state,...change});}
audio.start();tick();await new Promise(r=>setTimeout(r,0));const rain=nodes.find(n=>n.loop&&n.buffer?.length>32000);assert(rain,'Actual field-recorded rain was prepared');const rainGain=rain.edges[0].edges[0],ambientBus=rainGain.edges[0];assert.equal(rainGain.gain.value,.32);assert.equal(ambientBus.gain.value,.28);
const impacts=()=>nodes.filter(n=>n.buffer?.length===2400);
for(let i=0;i<180;i++)tick({walking:true,travel:.15,pos:{x:305+i*.15,y:26,z:140}});
assert(impacts().length>=15,'The test actually plays sustained walking footsteps');assert(!rain.stopped);assert.equal(rainGain.gain.value,.32,'Walking cannot duck or stop rain');assert.equal(ambientBus.gain.value,.28,'Footstep events cannot mute the ambience bus');
audio.setFootstepsEnabled(false);for(let i=0;i<30;i++)tick({walking:true,travel:.15});assert.equal(rainGain.gain.value,.32);assert.equal(ambientBus.gain.value,.28);assert(!rain.stopped);
tick({rainExposure:.12});assert(Math.abs(rainGain.gain.value-.0384)<1e-9,'Cover deliberately softens rain independently of walking');audio.dispose();assert(rain.stopped);
console.log('PASS: sustained walking and footstep toggle leave the real rain loop and ambience bus unchanged; shelter attenuation remains independent.');
