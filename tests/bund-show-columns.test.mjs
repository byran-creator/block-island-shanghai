import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {createBund} from '../game/bund.js';
const oldDocument=globalThis.document;
const ctx={fillRect(){},clearRect(){},save(){},restore(){},translate(){},scale(){},rotate(){},fill(){},closePath(){},fillText(){},beginPath(){},arc(){},stroke(){},moveTo(){},lineTo(){}};
globalThis.document={createElement:()=>({getContext:()=>ctx})};
try{
 const city=createBund({scene:new THREE.Scene(),world:new VoxelWorld(),getPos:()=>({x:-200,y:26,z:-150})});
 const columns=city.facadeLights.filter(m=>m.userData.showBand!==undefined);
 assert(columns.length>=3&&columns.length<=6,'bounded, spatially grouped column batches');
 const capture=time=>{city.tick(0,{night:true,festival:true,showTime:time});return columns.map(m=>m.material.color.r);};
 const a=capture(0),b=capture(6),ending=capture(40);
 assert.notDeepEqual(a,b,'highlight travels across the buildings');
 assert(a.some((v,i)=>v>b[i])&&a.some((v,i)=>v<b[i]),'direction changes which band is brightest');
 assert(ending.every(v=>Math.abs(v-ending[0])<1e-6),'finale illuminates every band');
 assert(city.facadeLights.every(m=>m.visible),'ordinary facade illumination stays on during the show');
 city.tick(0,{night:true,festival:false});assert(columns.every(m=>Math.abs(m.material.color.r-ending[0])<1e-6),'normal night lighting is restored');
 city.tick(0,{night:false,festival:false});assert(columns.every(m=>!m.visible),'normal daylight does not leave show lights on');
}finally{globalThis.document=oldDocument;}
console.log('PASS: bounded Bund column light waves, shared finale and restoration.');
