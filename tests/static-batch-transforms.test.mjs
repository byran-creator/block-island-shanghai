import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {batchMeshes} from '../game/mesh-batch.js';
import {createSceneInstances} from '../game/scene-instancing.js';

const root=new T.Scene(),parent=new T.Group(),geometry=new T.BoxGeometry(),material=new T.MeshBasicMaterial();root.add(parent);
const sources=[];for(let i=0;i<3;i++){const o=new T.Mesh(geometry,material);o.position.set(i,2*i,3*i);o.rotation.set(.1*i,.2*i,.3*i);parent.add(o);sources.push(o);}
const [batch]=batchMeshes(parent,sources);assert.equal(batch.matrixAutoUpdate,false);assert.equal(batch.matrixWorldAutoUpdate,true);assert.deepEqual(batch.matrix.elements,new T.Matrix4().elements);
let composes=0;const update=batch.updateMatrix;batch.updateMatrix=function(){composes++;return update.call(this);};
const expected=new T.Matrix4(),point=new T.Vector3();
for(let i=0;i<60;i++){
 parent.position.set(i*.2,-i*.1,i*.3);parent.rotation.set(i*.03,i*.05,-i*.01);parent.scale.set(1+i*.01,.8,1.4);
 root.updateMatrixWorld(true);expected.multiplyMatrices(parent.matrixWorld,batch.matrix);assert.deepEqual(batch.matrixWorld.elements,expected.elements);
 parent.position.x+=.25;batch.getWorldPosition(point);assert.equal(point.x,parent.getWorldPosition(new T.Vector3()).x,'Explicit coordinate queries follow a changed parent immediately');
 batch.visible=i%2===0;batch.material.color.set(i%2?'#ffffff':'#ffeebb');
}
assert.equal(composes,0,'Owned identity batches do not recompose on every world update');
const single=new T.Mesh(geometry,material);parent.add(single);assert.equal(batchMeshes(parent,[single])[0],single);assert.equal(single.matrixAutoUpdate,true,'Unmerged source meshes keep their existing automatic-transform interface');

const scene=new T.Scene();for(let i=0;i<4;i++){const o=new T.Mesh(geometry,material);o.position.set(i-2,0,0);scene.add(o);}
const instances=createSceneInstances(scene),carrier=instances.batches[0].mesh;assert.equal(carrier.matrixAutoUpdate,false);assert.equal(carrier.matrixWorldAutoUpdate,true);
scene.position.set(3,2,1);scene.rotation.y=.4;scene.updateMatrixWorld(true);assert.deepEqual(carrier.matrixWorld.elements,scene.matrixWorld.elements,'Instance carriers retain moving-scene world transforms');instances.dispose();
console.log('PASS: owned batch identity locals, zero repeated composition, moving/nonuniform parent world matrices, explicit queries, day/night controls, original single-source behavior and transformed instance carriers.');
