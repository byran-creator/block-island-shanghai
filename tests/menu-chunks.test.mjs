import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createChunkMesher,createChunkQueue} from '../game/chunk-work.js';
import {menuVisibleChunks} from '../game/menu-background.js';
import {PerspectiveCamera} from '../game/three.module.js';

// Exercise the production menu branch against the actual yielded mesher/queue.
// Starting play must not be required to finish the background buildings.
const source=readFileSync('game/game.js','utf8');
const body=source.match(/\}else if\(!started\)\{([^\n]+)\}/)?.[1];assert(body);
for(const mobile of [true,false]){
 const loaded=new Map(),world={get:(x,y,z)=>y===0?3:0};let clock=0;
 const queue=createChunkQueue({has:k=>loaded.has(k),create:key=>{
  const [cx,cz]=key.split(',').map(Number);return createChunkMesher({world,cx,cz,chunk:4,height:4});
 },commit:(key,data)=>loaded.set(key,data),now:()=>++clock});
 queue.setDesired(new Set(['0,0','4,0','8,0']),{x:0,z:0},4);
 const idleFrame=new Function('chunkWork','isMobile','camera','elapsed','outline',body);
 for(let i=0;queue.pending&&i<100;i++){
  const before=loaded.size;idleFrame(queue,mobile,{position:{set(){}},lookAt(){}},0,{});
  assert(loaded.size-before<=1,'Menu remains limited to one GPU upload per frame');
 }
 assert.equal(queue.pending,0);assert.equal(loaded.size,3);
 assert([...loaded.values()].every(d=>d.indices.length>0));
}
const camera=new PerspectiveCamera(72,844/390,.35,270);
camera.position.set(32,29.8,69);camera.lookAt(126,52,42);camera.updateMatrixWorld(true);
const all=new Set(['2,4','7,2','11,5','-8,4','30,4']);
const visible=menuVisibleChunks(all,camera,16,160);
assert(visible.has('7,2')&&visible.has('11,5'),'The Pearl and Pudong tower shells must load before showing the mobile menu');
assert(!visible.has('-8,4')&&!visible.has('30,4'),'Do not synchronously load the entire city behind the camera or beyond the far plane');
let time=0;const order=[],queue=createChunkQueue({has:()=>false,now:()=>time++,create:key=>({step:()=>true,data:key}),commit:key=>order.push(key)});
queue.setDesired(all,{x:0,z:0},16);queue.prioritize(visible);
while(queue.pending)queue.process(6);
assert(order.slice(0,visible.size).every(key=>visible.has(key)),'Visible backdrop uploads precede the rest of the city');
assert(source.indexOf('const visible=menuVisibleChunks')<source.indexOf('bootReady=true;'),'Wait for visible shells before enabling play');
console.log('PASS: inactive mobile/desktop menu frames finish queued building geometry with bounded uploads.');
