import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {Worker as NodeWorker} from 'node:worker_threads';
import * as T from '../game/three.module.js';
import {generateWorld} from '../game/world-generation.js';
import {VoxelWorld} from '../game/world.js';
import {changedEditChunks} from '../game/edited-chunks.js';
import {createMetroVisuals} from '../game/metro-visuals.js';

const digest=a=>createHash('sha256').update(a).digest('hex');
const expected=new VoxelWorld(),hash=digest(expected.data),surfaceHash=digest(new Uint8Array(expected.surface.buffer));
let terminated=0,beats=0;const heartbeat=setInterval(()=>beats++,5),url=new URL('../game/world-worker.js',import.meta.url).href;
const world=await generateWorld(()=>{
 const w=new NodeWorker(`const {parentPort}=require('node:worker_threads');globalThis.self={postMessage:(v,t)=>parentPort.postMessage(v,t)};import(${JSON.stringify(url)}).then(()=>parentPort.on('message',data=>self.onmessage({data})));`,{eval:true}),adapter={postMessage:m=>w.postMessage(m),terminate(){terminated++;w.terminate();}};
 w.on('message',data=>adapter.onmessage?.({data}));w.on('error',error=>adapter.onerror?.(error));return adapter;
});clearInterval(heartbeat);assert(beats>2,'The real worker leaves the main event loop responsive');assert.equal(terminated,1);assert.equal(digest(world.data),hash);assert.equal(digest(new Uint8Array(world.surface.buffer)),surfaceHash);
const fallback=await generateWorld(()=>{throw Error('Module workers blocked');});assert.equal(digest(fallback.data),hash,'Blocked WebViews retain the exact city generator');

const unchanged=new Map([['16,26,-1',7]]);assert.equal(changedEditChunks(unchanged,new Map(unchanged),16).size,0,'Unchanged saves must not rebuild the city');
assert.deepEqual([...changedEditChunks(new Map(),unchanged,16)].sort(),['0,-1','1,-1','1,0']);
assert.deepEqual(changedEditChunks(unchanged,new Map(),16),changedEditChunks(new Map(),unchanged,16),'Removing old edits invalidates their old geometry too');
assert(changedEditChunks(unchanged,new Map([['16,26,-1',8]]),16).size>0);

const root=new T.Group(),room=new T.Mesh(new T.BoxGeometry(6,4,6)),entry=new T.Mesh(new T.BoxGeometry(2,5,2));room.position.set(0,18,0);entry.position.set(0,27,0);root.add(room,entry);const pos={x:100,y:26,z:100},visuals=createMetroVisuals(root,{getPos:()=>pos,exits:[{x:0,z:0}]});assert(!visuals.interior.visible);assert.equal(room.parent,visuals.interior);assert.equal(entry.parent,root,'Street entrance must remain visible');
pos.x=10;pos.z=0;visuals.update();assert(visuals.interior.visible,'Approaching an entrance restores the view down the stairs');pos.x=100;pos.y=16;visuals.update();assert(visuals.interior.visible,'Every underground level and transfer remains visible');pos.y=136;visuals.update();assert(!visuals.interior.visible);
console.log(JSON.stringify({passed:true,workerMainLoopBeats:beats,worldHash:hash,surfaceHash,unchangedSaveDirtyChunks:0,subwayEntrancesPreserved:true}));

const {createFrameMeter}=await import('../game/performance-probe.js');const meter=createFrameMeter(3);for(const [time,cpu]of [[0,2],[33,3],[66,4],[266,5],[299,6]])meter.sample(time,cpu);assert.equal(meter.report().samples,3);assert.equal(meter.report().framesOver100ms,1);assert.equal(meter.report().frameMilliseconds.median,33);meter.reset();assert.equal(meter.report().samples,0);

let edits=false;const safe=createMetroVisuals(root,{getPos:()=>pos,exits:[],canCull:()=>!edits});assert(!safe.interior.visible);edits=true;safe.update();assert(safe.interior.visible,'Modified player terrain disables underground occlusion assumptions');meter.sample(1,1);meter.pause();meter.sample(100000,1);assert.equal(meter.report().samples,0,'Pausing must not create a fake long frame');

const {startShaderWarmup}=await import('../game/shader-warmup.js');const warmScene=new T.Scene(),warmCamera=new T.PerspectiveCamera(),shared=new T.MeshBasicMaterial(),original=new T.Mesh(new T.BoxGeometry(),shared);warmScene.add(original);let calls=0;const fake={info:{programs:[]},extensions:{has:()=>true},compile(subset,camera,target){calls++;assert.equal(target,warmScene);assert(subset.children.every(o=>o!==original&&o.material===shared));return Promise.resolve();}};const warmed=startShaderWarmup({renderer:fake,scene:warmScene,camera:warmCamera,yieldTask:async()=>{}});await warmed.done;assert.equal(calls,2);assert.equal(warmScene.children.length,1,'No temporary compilation light remains in the real scene');assert.equal(original.parent,warmScene);assert.equal(shared.side,T.FrontSide);assert.equal(warmed.stats.error,null);const unsupported=startShaderWarmup({renderer:{extensions:{has:()=>false}},scene:warmScene,camera:warmCamera});await unsupported.done;assert(!unsupported.stats.supported);const failed=startShaderWarmup({renderer:{info:fake.info,extensions:fake.extensions,compile(){throw Error('driver unavailable');}},scene:warmScene,camera:warmCamera});await failed.done;assert(failed.stats.error);assert.equal(warmScene.children.length,1);

const duplicateScene=new T.Scene();for(let i=0;i<4;i++)duplicateScene.add(new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial({color:i+1})));const batches=[];const dedup=startShaderWarmup({renderer:{info:{programs:[]},extensions:fake.extensions,properties:{get:()=>({currentProgram:{cacheKey:'identical-shader'}})},compile:subset=>batches.push(subset.children.length)},scene:duplicateScene,camera:warmCamera,yieldTask:async()=>{}});await dedup.done;assert.deepEqual(batches,[1,1,3],'Night variant needs one representative per cached program, not every uniform colour');assert.equal(duplicateScene.children.length,4);
