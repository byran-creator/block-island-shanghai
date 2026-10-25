import assert from 'node:assert/strict';
import {createSceneAudio} from '../game/scene-audio.js';
import {createFootsteps,createNearbyFootsteps} from '../game/footsteps.js';

const nodes=[],param=()=>({value:0,setValueAtTime(v){this.value=v;},setTargetAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;}});
const node=()=>{const n={gain:param(),frequency:param(),pan:param(),playbackRate:param(),edges:[],connect(n){this.edges.push(n);},disconnect(){},start(){this.started=true;},stop(){this.stopped=true;}};nodes.push(n);return n;};
const ctx={currentTime:0,sampleRate:16000,destination:{},resume(){},createGain:node,createBiquadFilter:node,createStereoPanner:node,createOscillator:node,createBufferSource:node,createBuffer(c,n,rate){const channels=Array.from({length:c},()=>new Float32Array(n));return {length:n,sampleRate:rate,getChannelData:i=>channels[i]};}};
const impacts=()=>nodes.filter(n=>n.buffer?.length===2400&&n.started),finish=()=>{for(const n of impacts())if(n.onended){const done=n.onended;n.onended=null;done();}};
const mixer=createSceneAudio(()=>ctx,{speech:null,Utterance:null});assert(mixer.start());
const state={playing:true,pos:{x:305,y:26,z:140},walking:true};
function tick(dt,travel,change={}){ctx.currentTime+=dt;mixer.update(dt,{...state,travel,...change});finish();}
tick(1/60,.075);
assert.equal(impacts().length,1,'The first real walking frame must make one footfall, without first accumulating a metre');
const playerGain=impacts()[0].edges[0].gain.value;assert(playerGain>=.08&&playerGain<=.12,'Player footfalls must be substantially quieter than .22');
mixer.suspend();const resumeCount=impacts().length;tick(1/60,.075);assert.equal(impacts().length,resumeCount+1,'Resuming after a pause must not wait for the old cooldown');
for(let i=0;i<12;i++)tick(1/60,0);const count=impacts().length;
tick(1/60,.075);assert.equal(impacts().length,count+1,'Another short directional tap after stopping must not be silent');
for(const change of [{walking:false},{riding:true},{hidden:true},{sound:false},{playing:false}]){const before=impacts().length;for(let i=0;i<6;i++)tick(1/30,.15,change);assert.equal(impacts().length,before);}
mixer.dispose();

function sample(fps,speed=4.5){nodes.length=0;ctx.currentTime=0;const a=createSceneAudio(()=>ctx,{speech:null,Utterance:null});a.start();const times=[];for(let i=0;i<fps*3;i++){const before=impacts().length;ctx.currentTime+=1/fps;a.update(1/fps,{...state,travel:speed/fps});if(impacts().length>before)times.push(ctx.currentTime);finish();}a.dispose();return times;}
const at30=sample(30),at60=sample(60),at20=sample(20),run=sample(30,8.5);
assert(Math.abs(at30.length-at60.length)<=1&&Math.abs(at20.length-at60.length)<=1,'Step count must stay stable across mobile and desktop frame rates');
assert(at30.length>=9&&at30.length<=11,'Three seconds of walking should produce regular individual footfalls');
assert(run.length>at30.length,'Running has a quicker cadence');
for(const times of [at20,at30,at60,run])for(let i=1;i<times.length;i++)assert(times[i]-times[i-1]>=.18-1e-6,'No bursts of impacts a frame apart');

// Actual legs are shared references even where NPC descriptors copy scalar phase.
const sounds=[],crowd=createNearbyFootsteps(s=>sounds.push(s)),root={visible:true,position:{x:1,y:26,z:0}},leg={rotation:{x:.2}},actor={root,person:true,legs:[leg]},people=[actor],pos={x:0,y:26,z:0};
crowd.update(.2,people,pos);root.position.x+=.2;leg.rotation.x=-.2;crowd.update(.2,people,pos);
assert.equal(sounds.length,1,'A moving nearby NPC leg crossing should trigger its individual step, rather than wait several animation steps');assert(sounds[0].level<.03);
crowd.update(.2,people,pos);assert.equal(sounds.length,1,'An idle NPC cannot step just because its pose changes');
const step=createFootsteps(ctx,{});step.play();assert(impacts().at(-1).edges[0].gain.value<=.12);step.dispose();
console.log(JSON.stringify({passed:true,walkSteps:{fps20:at20.length,fps30:at30.length,fps60:at60.length},runSteps:run.length,playerGain}));
