import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {CAR_ROUTES} from '../game/city-layout.js';
import {cityCarAppearance,createCitySpecialCar} from '../game/city-car-appearance.js';
import {createSceneInstances} from '../game/scene-instancing.js';
import {CanvasRenderer} from '../game/canvas-renderer.js';

const scene=new THREE.Scene(),styles=[];let total=0,triangles=0;
for(const route of CAR_ROUTES){const count=route.id==='bund'?8:route.id==='bridge'?12:6;
 for(let i=0;i<count;i++){total++;const style=cityCarAppearance(route.id,i);if(!style)continue;styles.push(style);const car=createCitySpecialCar(style);scene.add(car.root);
  const bounds=new THREE.Box3().setFromObject(car.root);
  assert(bounds.min.x>=-.72&&bounds.max.x<=.72&&bounds.min.z>=-1.32&&bounds.max.z<=1.32,'Every visual part must fit the existing traffic collision footprint');
  assert(bounds.min.y>=0&&bounds.max.y<=1.3,'No underground wheels or new height collision');
  assert.equal(car.lights.length,2);assert(car.lights.every(l=>l.position.z<0),'Headlamps must face the existing negative-Z driving direction');
  let meshes=0;car.root.traverse(o=>{assert(!o.isLight,'Do not add any realtime light');if(o.isMesh){meshes++;assert(!o.material.transparent);triangles+=o.geometry.attributes.position.count/3;assert(o.geometry.attributes.position.array.every(Number.isFinite));}});assert.equal(meshes,3,'One merged shell and two existing-toggle headlamps');
  const copy=createCitySpecialCar(style);assert.equal(copy.root.children[0].geometry,car.root.children[0].geometry);assert.equal(copy.root.children[0].material,car.root.children[0].material,'Reuse cached geometry and atlas');
 }
}
assert.equal(total,44);assert.equal(styles.length,12);assert(styles.length/total<.3,'Ordinary cars remain the clear majority');
const atlas=scene.children[0].children[0].material.map;assert.equal(atlas.image.width,256);assert.equal(atlas.image.height,64);
for(const car of scene.children)assert.equal(car.children[0].material.map,atlas);
const batching=createSceneInstances(scene),camera=new THREE.PerspectiveCamera(65,1,.1,100);camera.position.set(0,3,-7);camera.lookAt(0,.5,0);camera.updateMatrixWorld(true);scene.onBeforeRender(null,scene,camera);assert.equal(batching.batches.reduce((n,b)=>n+b.entries.length,0),24,'All headlamps share geometry and draws within their four lamp designs');batching.dispose();
const fills=[],ctx={fillRect(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},fill(){fills.push(this.fillStyle);},stroke(){}};
const cpu=new CanvasRenderer({canvas:{getContext:()=>ctx}});cpu.setSize(400,300);
const fallbackScene=new THREE.Scene();fallbackScene.background=new THREE.Color('black');fallbackScene.fog=new THREE.Fog('black',50,100);
fallbackScene.add(createCitySpecialCar('gt-red').root);camera.position.set(-3,2,-4);camera.lookAt(0,.5,0);cpu.last=-100;cpu.render(fallbackScene,camera);
assert(fills.some(s=>{const c=new THREE.Color(s);return c.r>c.g*2&&c.r>c.b*2;}),'Software fallback must retain red paint instead of treating RGB as grey ambient occlusion');
console.log(JSON.stringify({cars:total,special:styles.length,styles,triangles,atlasBytes:atlas.image.data.byteLength,collisionFootprint:'unchanged',realtimeLights:0}));
