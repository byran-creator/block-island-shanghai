import assert from 'node:assert/strict';
import {createFootsteps} from '../game/footsteps.js';
const buffers=[],sources=[],node=()=>({gain:{value:0},pan:{value:0},playbackRate:{value:1},connect(){},disconnect(){},start(){},stop(){}});
const ctx={createBuffer(c,n,rate){const samples=new Float32Array(n),buffer={length:n,sampleRate:rate,getChannelData:()=>samples};buffers.push(buffer);return buffer;},createBufferSource(){const n=node();sources.push(n);return n;},createGain:node,createStereoPanner:node};
const steps=createFootsteps(ctx,{});steps.play({surface:3});const npc=sources.at(-1).buffer,npcCopy=npc.getChannelData(0).slice();sources.at(-1).onended();
steps.play({surface:3,profile:'player'});const player=sources.at(-1).buffer;assert.notEqual(player,npc,'Player shoe texture must be separate from the NPC thud that the user wants preserved');
function lowFraction(data){let low=0,total=0,bass=0;for(const v of data){low+=.0683*(v-low);bass+=low*low;total+=v*v;}return bass/total;}
assert(lowFraction(player.getChannelData(0))<lowFraction(npcCopy)*.5,'Player steps must lose the dominant low-frequency pounding');assert(Math.max(...player.getChannelData(0).map(Math.abs))<.4,'Shoe texture should have softer peaks');sources.at(-1).onended();
const allocated=buffers.length;for(let i=0;i<20;i++){steps.play({surface:3,profile:'player'});sources.at(-1).onended();}assert.equal(buffers.length,allocated,'Repeated player steps reuse the material buffer');
steps.play({surface:7,profile:'player'});const wood=sources.at(-1).buffer;sources.at(-1).onended();steps.play({surface:1,profile:'player'});const grass=sources.at(-1).buffer;sources.at(-1).onended();assert.notEqual(wood,player);assert.notEqual(grass,wood);assert(buffers.length<=4,'One original NPC buffer plus at most three player material buffers');
steps.play({surface:3});assert.equal(sources.at(-1).buffer,npc);assert.deepEqual(npc.getChannelData(0),npcCopy,'Player timbre changes cannot mutate NPC audio');steps.dispose();
console.log(JSON.stringify({passed:true,playerBassFraction:lowFraction(player.getChannelData(0)),npcBassFraction:lowFraction(npcCopy),buffers:buffers.length}));
