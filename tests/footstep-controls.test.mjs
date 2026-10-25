import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createSceneAudio} from '../game/scene-audio.js';

const savedStorage=globalThis.localStorage,preferences=new Map();
globalThis.localStorage={getItem:key=>preferences.get(key)??null,setItem:(key,value)=>preferences.set(key,value)};
function rig(){
 const nodes=[],param=()=>({value:0,setTargetAtTime(v){this.value=v;},setValueAtTime(v){this.value=v;},exponentialRampToValueAtTime(v){this.value=v;}});
 const ctx={state:'running',currentTime:0,sampleRate:16000,destination:{},resumeCalls:0,allowResume:false,resume(){this.resumeCalls++;if(this.allowResume)this.state='running';return Promise.resolve();},createBuffer(c,n,rate){const data=new Float32Array(n);return {length:n,sampleRate:rate,getChannelData:()=>data};}};
 function node(){const n={gain:param(),frequency:param(),pan:param(),playbackRate:{value:1},edges:[],connect(n){this.edges.push(n);},disconnect(){this.disconnected=true;},start(){this.started=ctx.currentTime;},stop(){this.stopped=true;}};nodes.push(n);return n;}
 Object.assign(ctx,{createGain:node,createStereoPanner:node,createBiquadFilter:node,createOscillator:node,createBufferSource:node});
 const people=[],audio=createSceneAudio(()=>ctx,{speech:null,Utterance:null,getPeople:()=>people}),state={playing:true,pos:{x:305,y:26,z:140},walking:true,travel:.15};
 const impacts=()=>nodes.filter(n=>n.buffer?.length===2400);
 function tick(dt=1/30,change={}){if(ctx.state==='running')ctx.currentTime+=dt;for(const n of impacts())if(!n.stopped&&n.onended&&ctx.currentTime-n.started>=.15/n.playbackRate.value){const done=n.onended;n.onended=null;done();}audio.update(dt,{...state,...change});}
 audio.start();return {audio,ctx,nodes,state,impacts,tick,people};
}
try{
 const r=rig();assert.equal(r.audio.footstepsEnabled,true);r.tick();const first=r.impacts()[0];
 assert(first.edges[0].gain.value>=.08&&first.edges[0].gain.value<=.09,'Player gain is reduced modestly from .10');
 const before=r.impacts().length;r.audio.setFootstepsEnabled(false);assert.equal(first.edges[0].edges[0].edges[0].gain.value,0,'Turning player footsteps off immediately mutes their own bus');
 const traffic={travelSpeed:4,root:{position:r.state.pos}};for(let i=0;i<50;i++)r.tick(1/30,{agents:[traffic]});
 assert.equal(r.impacts().length,before,'Walking while footsteps are off creates no footfall nodes');
 assert.equal(r.audio.enabled,true,'Footstep preference must not turn off ambience');
 assert.equal(r.nodes.findLast(n=>n.frequency.value===78).edges[0].gain.value,.019,'Traffic mix is preserved');
 const actor={person:true,root:{visible:true,position:{x:306,y:26,z:140}},legs:[{rotation:{x:.2}}]};r.people.push(actor);r.tick(.2);actor.root.position.x+=.2;actor.legs[0].rotation.x=-.2;r.tick(.2);
 assert.equal(r.impacts().length,before+1,'NPC footsteps remain audible with player footsteps disabled');assert(r.impacts().at(-1).edges[0].gain.value<.03);r.people.length=0;
 r.audio.setFootstepsEnabled(true);r.tick();assert.equal(r.impacts().length,before+2,'Re-enabling starts a fresh gait on the next moving frame');
 r.audio.setEnabled(false);const withoutAmbience=r.impacts().length;for(let i=0;i<15;i++)r.tick();assert(r.impacts().length>withoutAmbience,'Player footsteps remain independently enabled when ambience is off');r.audio.setEnabled(true);
 r.audio.setFootstepsEnabled(false);const restored=rig();assert.equal(restored.audio.footstepsEnabled,false,'Footstep setting survives a new game instance');restored.audio.dispose();
 r.audio.dispose();preferences.clear();

 // Web Audio time stops during interruption while render/movement can continue.
 // Never fill the four-source pool with inaudible queued footfalls.
 const s=rig();s.tick();await new Promise(resolve=>setTimeout(resolve,0));const initial=s.impacts().length,oldCalls=s.ctx.resumeCalls;
 s.ctx.state='interrupted';for(let i=0;i<90;i++){s.tick();await new Promise(resolve=>setTimeout(resolve,0));}
 assert.equal(s.impacts().length,initial,'Interrupted context cannot accumulate queued footsteps');
 assert(s.impacts().every(n=>n.stopped),'Pre-interruption footsteps are cancelled');
 assert(s.ctx.resumeCalls>oldCalls&&s.ctx.resumeCalls-oldCalls<=3,'Active interruption requests bounded audio recovery');
 s.ctx.allowResume=true;s.ctx.state='suspended';for(let i=0;i<35;i++){s.tick();await Promise.resolve();}
 assert.equal(s.ctx.state,'running');assert(s.impacts().length>initial,'Held movement resumes footsteps without releasing and pressing again');
 const resumed=s.impacts().length;for(let i=0;i<1350;i++)s.tick((1+.3*Math.sin(i*.17))/30);
 assert(s.impacts().length-resumed>130,'Forty-five seconds of irregular frame pacing retains continuous footfalls');
 s.ctx.state='closed';const closedCalls=s.ctx.resumeCalls,closedImpacts=s.impacts().length;for(let i=0;i<40;i++)s.tick();
 assert.equal(s.ctx.resumeCalls,closedCalls);assert.equal(s.impacts().length,closedImpacts);s.audio.dispose();
 const attempts=s.ctx.resumeCalls;s.tick();assert.equal(s.ctx.resumeCalls,attempts,'Disposed mixer does not restart audio');

 const pending=rig();await new Promise(resolve=>setTimeout(resolve,0));let releaseResume;
 pending.ctx.state='suspended';pending.ctx.resume=()=>{pending.ctx.resumeCalls++;return new Promise(resolve=>{releaseResume=resolve;});};
 const pendingCalls=pending.ctx.resumeCalls;for(let i=0;i<120;i++)pending.tick();
 assert.equal(pending.ctx.resumeCalls,pendingCalls+1,'A pending browser permission promise cannot accumulate resume requests');
 pending.audio.setEnabled(false);pending.audio.setFootstepsEnabled(false);const mutedCalls=pending.ctx.resumeCalls;
 for(let i=0;i<120;i++)pending.tick();assert.equal(pending.ctx.resumeCalls,mutedCalls,'A fully muted mixer does not attempt recovery');
 pending.audio.dispose();releaseResume();await new Promise(resolve=>setTimeout(resolve,0));assert.equal(pending.impacts().length,0,'Late resume completion cannot emit a disposed footfall');

 const html=await readFile('game/index.html','utf8'),game=await readFile('game/game.js','utf8');
 assert.match(html,/id="footsteps-toggle"[^>]*aria-pressed="true"/);assert.match(game,/setFootstepsEnabled\(!sceneAudio\.footstepsEnabled\)/);
 console.log('PASS: quieter player gait, independent persistent footstep switch, interrupted-audio recovery, bounded retries and sustained motion.');
}finally{if(savedStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=savedStorage;}
