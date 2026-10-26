import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createSceneInstances} from '../game/scene-instancing.js';

const scene=new T.Scene(),camera=new T.PerspectiveCamera(60,1,.1,100),geometry=new T.BoxGeometry(),material=new T.MeshBasicMaterial(),sources=[];
camera.position.z=10;camera.updateMatrixWorld();
for(let i=0;i<1000;i++){const o=new T.Mesh(geometry,material);o.position.set(i<10?(i%5-2)*.5:200+i,Math.floor(i%10/5)*.5,0);scene.add(o);sources.push(o);}
const instances=createSceneInstances(scene);let checks=0;
for(const o of sources)o.matrixWorld.determinant=function(){checks++;return T.Matrix4.prototype.determinant.call(this);};
function update(){checks=0;scene.updateMatrixWorld(true);instances.update(camera);}
update();assert.equal(instances.batches[0].mesh.count,10);assert.equal(checks,10,'Culled sources must not perform determinant checks');

const mirrored=sources[10],sheared=sources[11],holder=new T.Group();scene.add(holder);holder.add(sheared);holder.scale.y=2;holder.position.x=250;sheared.position.set(0,0,0);sheared.rotation.z=.5;mirrored.scale.x=-1;
update();assert.equal(checks,10);
mirrored.position.x=0;holder.position.x=0;update();assert.equal(checks,12);assert.equal(instances.batches[0].mesh.count,10);assert(mirrored.layers.isEnabled(0)&&sheared.layers.isEnabled(0),'Unsupported transforms fall back in the same frame they become visible');
mirrored.position.x=500;mirrored.frustumCulled=false;holder.position.x=250;update();assert.equal(checks,11);assert(mirrored.layers.isEnabled(0),'Explicit culling opt-out still validates unsupported transforms');
const replaced=sources[12];replaced.material=new T.MeshBasicMaterial();update();assert(replaced.layers.isEnabled(0),'Offscreen replacements retain their original draw path');
replaced.material=material;replaced.geometry=new T.SphereGeometry();update();assert(replaced.layers.isEnabled(0));
holder.scale.y=1;sheared.rotation.z=0;holder.position.x=0;mirrored.frustumCulled=true;mirrored.position.x=0;mirrored.scale.x=1;update();assert.equal(instances.batches[0].mesh.count,12,'Supported objects rejoin immediately on return');
instances.dispose();assert(sources.every(o=>o.layers.isEnabled(0)));
// A fully offscreen batch has no visible member to invalidate an aggregate
// bound. Parent motion, manual matrices and runtime culling opt-outs must still
// recover immediately; a creation-time batch AABB is insufficient.
for(const frozen of [false,true]){
 const s=new T.Scene(),holder=new T.Group(),parts=[];s.add(holder);holder.position.x=500;
 for(let i=0;i<3;i++){const p=new T.Mesh(geometry,material);p.position.x=i*.2;if(frozen){p.updateMatrix();p.matrixAutoUpdate=false;}holder.add(p);parts.push(p);}
 if(frozen){holder.updateMatrix();holder.matrixAutoUpdate=false;}
 const shared=createSceneInstances(s),refresh=()=>{s.updateMatrixWorld(true);shared.update(camera);};refresh();assert.equal(shared.batches[0].mesh.count,0);
 holder.position.x=0;holder.updateMatrix();refresh();assert.equal(shared.batches[0].mesh.count,3,'Parent motion returns an entirely culled batch');
 holder.visible=false;refresh();assert.equal(shared.batches[0].mesh.count,0);holder.visible=true;refresh();assert.equal(shared.batches[0].mesh.count,3);
 holder.position.x=500;holder.updateMatrix();parts[0].frustumCulled=false;refresh();assert.equal(shared.batches[0].mesh.count,1,'Runtime opt-out restores an originally culled batch');
 holder.removeFromParent();refresh();assert(parts.every(p=>p.layers.isEnabled(0)),'Detached sources recover their original draw paths');s.add(holder);refresh();assert.equal(shared.batches[0].mesh.count,1);
 shared.dispose();
}
console.log(JSON.stringify({passed:true,sourceCount:1000,visibleTransformChecks:10,hiddenMirrorAndShearReturn:true,cullingOptOut:true,offscreenReplacement:true}));
