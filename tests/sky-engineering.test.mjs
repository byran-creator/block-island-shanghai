import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {createClouds} from '../game/clouds.js';
import {createSkyGradient} from '../game/sky-gradient.js';
import {createWeather} from '../game/weather.js';

const camera=new THREE.PerspectiveCamera();camera.position.set(-90,35,40);
const {clouds,cloudMat,bellyMat,tier1Group,tier2Group,tier3Group}=createClouds(camera);
const batches=[];clouds.traverse(o=>{if(o.isMesh)batches.push(o);assert(!o.isSprite);});
assert.equal(batches.length,6);assert.equal(batches.reduce((n,m)=>n+m.count,0),1064);
assert(batches.every(m=>m.isInstancedMesh&&!m.material.depthWrite));
clouds.tick(30,30,{type:'rain',cloud:.92,rain:1});
assert(tier1Group.visible&&tier2Group.visible&&tier3Group.visible);
const batch=tier1Group.children.find(o=>o.isMesh),matrix=new THREE.Matrix4(),before=new THREE.Matrix4();batch.getMatrixAt(0,before);
camera.rotation.set(.4,1.2,0);clouds.tick(1/60,30,{type:'rain',cloud:.92,rain:1});batch.getMatrixAt(0,matrix);
const pos=new THREE.Vector3(),quat=new THREE.Quaternion(),scale=new THREE.Vector3();matrix.decompose(pos,quat,scale);
assert(Math.abs(quat.dot(camera.quaternion))>1-1e-6,'Billboards follow camera pitch and yaw');assert(scale.x>20&&scale.y>10);
clouds.tick(1/60,31,{type:'clear',cloud:.08,rain:0});assert(tier1Group.visible,'First clear frame fades, rather than popping all cloud geometry');
for(let i=0;i<40;i++)clouds.tick(1,32+i,{type:'clear',cloud:.08,rain:0});assert(!tier1Group.visible&&!tier2Group.visible&&!tier3Group.visible);
clouds.tick(30,80,{type:'rain',cloud:.92,rain:1});assert(tier1Group.visible,'Rain restores clouds after clear sky');
for(const mesh of batches){assert([...mesh.instanceMatrix.array].every(Number.isFinite));assert(mesh.material.opacity>=0&&mesh.material.opacity<=1);}
const scene=new THREE.Scene();scene.background=new THREE.Color();scene.fog=new THREE.Fog(0,10,400);
const gradient=createSkyGradient(scene,camera);
for(const time of [0,60,110,114.99,115,115.01,120,130,180,239]){
 gradient.tick(time,.65,.2,true,true);assert([...gradient.dome.geometry.attributes.color.array].every(v=>Number.isFinite(v)&&v>=0&&v<=1));
}
const sunBlock=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial()),water=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshBasicMaterial());
const weather=createWeather({scene,camera,world:{ground:()=>23},sunBlock,clouds,cloudMat,bellyMat,water,terrainMaterial:new THREE.MeshBasicMaterial()});
weather.state.setMode('cloudy');weather.tick(60,114.999);const tint=bellyMat.color.clone();weather.tick(0,115.001);
assert(Math.max(...tint.toArray().map((v,i)=>Math.abs(v-bellyMat.color.toArray()[i])))<.002,'Cloud tint stays continuous across old hard switch');
weather.state.setMode('rain');weather.tick(60,180);assert(!weather.moon.visible);weather.state.setMode('clear');weather.tick(60,180);assert(weather.moon.visible);
console.log('PASS: six cloud batches/1064 preserved billows, camera billboarding, gradual tier changes, finite transforms/palette, twilight tint continuity and night weather.');
