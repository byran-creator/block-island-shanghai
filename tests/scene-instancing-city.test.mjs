import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {createBund} from '../game/bund.js';
import {createCityActivity} from '../game/city-activity.js';
import {createMetroNetwork} from '../game/metro-network.js';
import {createYuyuan} from '../game/yuyuan.js';
import {createSceneInstances} from '../game/scene-instancing.js';
const ctx=new Proxy({},{get:(_,k)=>k==='measureText'?t=>({width:t.length*16}):k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}});
const node=()=>({style:{},dataset:{},classList:{toggle(){},add(){},remove(){}},children:[],append(...a){this.children.push(...a)},appendChild(a){this.children.push(a)},replaceChildren(){this.children=[]},addEventListener(){},setAttribute(){},getContext:()=>ctx});
globalThis.document={hidden:false,createElement:node,getElementById:()=>node(),body:node()};
const scene=new T.Scene(),world=new VoxelWorld(),pos={x:-109,y:26,z:66},camera=new T.PerspectiveCamera(72,1280/720,.1,360),base={scene,world,getPos:()=>pos,getVehicles:()=>[],getState:()=>({}),place(){},setView(){},notify(){},getSound:()=>false};
const civil=createBund(base),activity=createCityActivity({...base,extraCrowd:civil.pedestrians.filter(p=>p.kind==='shop')}),metro=createMetroNetwork(base),garden=createYuyuan(base);
civil.tick(0);activity.tick(0);metro.tick(0);garden.tick(0);scene.updateMatrixWorld(true);
const frustum=new T.Frustum(),projection=new T.Matrix4();
function draws(){let calls=0,triangles=0;scene.traverseVisible(o=>{if(!o.isMesh||!o.layers.test(camera.layers)||o.isInstancedMesh&&o.count===0)return;if(o.frustumCulled&&!frustum.intersectsObject(o))return;calls++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o.isInstancedMesh?o.count:1);});return {calls,triangles};}
const rows=[];for(const p of [{x:-109,y:26,z:66},{x:-99,y:26,z:235}])for(let i=0;i<12;i++){Object.assign(pos,p);camera.position.set(p.x,p.y+1.62,p.z);camera.rotation.set(0,i*Math.PI/6,0,'YXZ');camera.updateMatrixWorld(true);projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(projection);rows.push({p,yaw:i*30,before:draws()});}
const batching=createSceneInstances(scene);let matched=0;const m=new T.Matrix4(),worldMatrix=new T.Matrix4();
for(const row of rows){camera.position.set(row.p.x,row.p.y+1.62,row.p.z);camera.rotation.set(0,row.yaw*Math.PI/180,0,'YXZ');camera.updateMatrixWorld(true);projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(projection);scene.onBeforeRender(null,scene,camera);row.after=draws();assert.equal(row.after.triangles,row.before.triangles,'Camera-visible geometry must be exactly retained');}
for(let step=0;step<4;step++){civil.tick(.1);activity.tick(.1);metro.tick(.1);garden.tick(.1);scene.updateMatrixWorld(true);scene.onBeforeRender(null,scene,camera);
 for(const {mesh,entries}of batching.batches){const actual=[];for(const e of entries){const source=e.source;let visible=true;for(let p=source;p;p=p.parent)if(!p.visible)visible=false;if(visible&&(!source.frustumCulled||frustum.intersectsObject(source)))actual.push(source);}
  assert.equal(mesh.count,actual.length);for(let i=0;i<actual.length;i++){mesh.getMatrixAt(i,m);worldMatrix.multiplyMatrices(mesh.matrixWorld,m);assert(worldMatrix.elements.every((v,j)=>Math.abs(v-actual[i].matrixWorld.elements[j])<.0001));matched++;}
 }
}
const sources=batching.batches.reduce((s,b)=>s+b.entries.length,0);console.log(JSON.stringify({groups:batching.batches.length,sources,matchedAnimatedMatrices:matched,rows:rows.filter(r=>r.yaw===240||r.yaw===90)}));


