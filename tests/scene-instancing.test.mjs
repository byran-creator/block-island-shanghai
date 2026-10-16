import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createSceneInstances} from '../game/scene-instancing.js';
import {CanvasRenderer} from '../game/canvas-renderer.js';
const scene=new T.Scene(),camera=new T.PerspectiveCamera(70,1,.1,100),geometry=new T.BoxGeometry(),material=new T.MeshLambertMaterial({color:'#b7c8d9'}),sources=[],actors=[];
camera.position.set(0,2,10);camera.lookAt(0,1,0);camera.updateMatrixWorld();scene.position.set(1,0,0);
for(let i=0;i<8;i++){const parent=new T.Group();parent.userData.appearance={role:'visitor'};parent.position.set((i-4)*.7,0,0);parent.rotation.y=i*.17;scene.add(parent);actors.push(parent);const limb=new T.Group();limb.position.y=1;limb.rotation.x=i*.08;parent.add(limb);const mesh=new T.Mesh(geometry,material);mesh.scale.set(.3,.6,.2);limb.add(mesh);sources.push(mesh);}
const transparent=new T.Mesh(geometry,new T.MeshBasicMaterial({transparent:true,opacity:.3}));actors[0].add(transparent);
const special=new T.Mesh(geometry,material);special.layers.enable(1);actors[0].add(special);const callback=new T.Mesh(geometry,material);callback.onBeforeRender=()=>{};actors[0].add(callback);
const prop=new T.Mesh(new T.BoxGeometry(),material);scene.add(prop);let priorCalls=0;scene.onBeforeRender=()=>priorCalls++;
const batcher=createSceneInstances(scene);assert.equal(batcher.batches.length,1);const {mesh,entries}=batcher.batches[0];assert.equal(entries.length,8);assert.equal(mesh.geometry,geometry);assert.equal(mesh.material,material);assert(transparent.layers.isEnabled(0)&&prop.layers.isEnabled(0),'Transparent and unshared items retain the original renderer path');
assert(special.layers.mask===3&&callback.layers.isEnabled(0),'Multiple render layers and custom callbacks retain the original draw path');
function sync(){scene.updateMatrixWorld(true);camera.updateMatrixWorld();scene.onBeforeRender(null,scene,camera);}
sync();assert.equal(priorCalls,1);assert.equal(mesh.count,8);
const matrix=new T.Matrix4(),world=new T.Matrix4();
for(let i=0;i<8;i++){mesh.getMatrixAt(i,matrix);world.multiplyMatrices(mesh.matrixWorld,matrix);assert(world.elements.every((v,j)=>Math.abs(v-sources[i].matrixWorld.elements[j])<1e-6),'Every vertex retains its original animated world transform');}
actors[2].visible=false;sources[3].visible=false;actors[4].position.z=100;sync();assert.equal(mesh.count,5,'Parent visibility, child visibility and the camera frustum remain effective');
actors[2].visible=true;sources[3].visible=true;actors[4].position.z=0;actors[1].children[0].rotation.x=1.7;sync();assert.equal(mesh.count,8,'Showing a character or changing an arm restores the next render immediately');
sources[0].material=new T.MeshBasicMaterial();sync();assert.equal(mesh.count,7);assert(sources[0].layers.isEnabled(0),'Replacing an actor material restores its normal draw instead of losing the part');
sources[0].material=material;sync();assert.equal(mesh.count,8);assert(!sources[0].layers.isEnabled(0));
sources[0].scale.x=-.3;sync();assert.equal(mesh.count,7);assert(sources[0].layers.isEnabled(0),'Mirrored parts use the supported original draw path');
sources[0].scale.x=.3;sync();assert.equal(mesh.count,8);
actors[1].scale.y=2;sync();assert.equal(mesh.count,7);assert(sources[1].layers.isEnabled(0),'Sheared normal transforms retain the original draw path');actors[1].scale.y=1;sync();assert.equal(mesh.count,8);
const originalParent=sources[2].parent;sources[2].removeFromParent();sync();assert.equal(mesh.count,7,'Removed scene objects must not leave ghost instances');assert(sources[2].layers.isEnabled(0));originalParent.add(sources[2]);sync();assert.equal(mesh.count,8);
material.transparent=true;sync();assert.equal(mesh.count,0);assert(sources.every(s=>s.layers.isEnabled(0)));material.transparent=false;sync();assert.equal(mesh.count,8);
batcher.dispose();assert(sources.every(s=>s.layers.isEnabled(0)));assert(!mesh.parent);scene.onBeforeRender();assert.equal(priorCalls,14);
// The CPU fallback must run the same scene hook before traversing instances.
const marks=[],ctx={fillRect(){},beginPath(){},moveTo(x,y){marks.push([x,y]);},lineTo(){},closePath(){},fill(){},stroke(){}};
scene.background=new T.Color('black');scene.fog=new T.Fog('black',50,100);const renderer=new CanvasRenderer({canvas:{getContext:()=>ctx}});renderer.setSize(400,400);const again=createSceneInstances(scene);renderer.last=-100;renderer.render(scene,camera);assert(again.batches[0].mesh.count>0);assert(marks.length>0);again.dispose();
console.log('PASS: shared geometry/materials, exact animated transforms, independent visibility, camera culling, replacement/mirror fallback, disposal and software rendering.');

// Software rendering must not draw both the masked source and its instances.
const simple=new T.Scene();simple.background=scene.background;simple.fog=scene.fog;
for(let i=0;i<3;i++){const p=new T.Mesh(geometry,material);p.position.set(i-1,1,0);simple.add(p);}
marks.length=0;renderer.last=-100;renderer.render(simple,camera);const ordinaryMarks=marks.length;assert(ordinaryMarks>0);
const simpleBatch=createSceneInstances(simple);marks.length=0;renderer.last=-100;renderer.render(simple,camera);
assert.equal(marks.length,ordinaryMarks,'Canvas layers must exclude sources delegated to instances');simpleBatch.dispose();

