import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import * as T from '../game/three.module.js';
import {createSceneInstances} from '../game/scene-instancing.js';

// Exercise the bundled renderer's real attribute upload implementation against
// a recording GL buffer, including its first-allocation and range consumption.
const vendor=(await readFile(new URL('../game/three.module.js',import.meta.url),'utf8')).replaceAll('\r\n','\n'),start=vendor.indexOf('function WebGLAttributes( gl ) {'),end=vendor.indexOf('\n}\n',start)+3;
assert(start>=0&&end>start);const attributesFactory=new Function(vendor.slice(start,end)+';return WebGLAttributes;')();
let gpu,bytes=0,calls=0;
const gl={FLOAT:5126,ARRAY_BUFFER:34962,createBuffer:()=>({}),bindBuffer(){},bufferData(target,array){gpu=Float32Array.from(array);},bufferSubData(target,offset,array,begin=0,count=array.length-begin){gpu.set(array.subarray(begin,begin+count),offset/4);bytes+=count*4;calls++;},deleteBuffer(){}};
const attributes=attributesFactory(gl),scene=new T.Scene(),camera=new T.PerspectiveCamera(60,1,.1,100),geometry=new T.BoxGeometry(),material=new T.MeshBasicMaterial(),sources=[];
camera.position.z=10;camera.updateMatrixWorld();
for(let i=0;i<100;i++){const mesh=new T.Mesh(geometry,material);mesh.position.set(i<4?i-2:200+i,0,0);scene.add(mesh);sources.push(mesh);}
const batch=createSceneInstances(scene),mesh=batch.batches[0].mesh;
function update(render=true){scene.updateMatrixWorld(true);batch.update(camera);assert(mesh.instanceMatrix.updateRanges.length<=1,'Undrawn frames must not accumulate ranges');if(render&&mesh.visible)attributes.update(mesh.instanceMatrix,gl.ARRAY_BUFFER);if(render&&mesh.visible)assert.deepEqual(gpu.subarray(0,mesh.count*16),mesh.instanceMatrix.array.subarray(0,mesh.count*16),'Every matrix actually drawn matches GPU storage');}
update();assert.equal(mesh.count,4);assert.equal(gpu.length,1600,'Initial buffer allocation retains full capacity');bytes=0;calls=0;
sources[0].position.y=1;update();assert.equal(bytes,4*64);assert.equal(calls,1);assert.equal(mesh.instanceMatrix.updateRanges.length,0,'Renderer consumes the pending prefix');
for(let i=4;i<20;i++)sources[i].position.set(i%4-2,Math.floor(i/4)*.2,0);update();assert.equal(mesh.count,20);
for(const s of sources)s.visible=false;update();assert.equal(mesh.count,0);
for(const s of sources.slice(0,30))s.visible=true;for(let i=20;i<30;i++)sources[i].position.set(i%4-2,1,0);update(false);sources[1].position.x=-1.5;update(false);update();assert.equal(mesh.count,30);
sources[0].material=new T.MeshBasicMaterial({color:'red'});update();assert.equal(mesh.count,29);assert(sources[0].layers.isEnabled(0));
batch.dispose();attributes.remove(mesh.instanceMatrix);assert(sources.every(s=>s.layers.isEnabled(0)));
console.log(JSON.stringify({passed:true,initialCapacity:100,partialCount:4,partialBytes:256,legacyBytes:6400,growShrinkHiddenAndSkippedDraws:true,vendorUploader:true}));
