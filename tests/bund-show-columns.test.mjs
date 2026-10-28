import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld} from '../game/world.js';
import {createBund} from '../game/bund.js';
import {bundShowLevel} from '../game/bund-show-lighting.js';
const oldDocument=globalThis.document;
const ctx={fillRect(){},clearRect(){},save(){},restore(){},translate(){},scale(){},rotate(){},fill(){},closePath(){},fillText(){},beginPath(){},arc(){},stroke(){},moveTo(){},lineTo(){}};
globalThis.document={createElement:()=>({getContext:()=>ctx})};
try{
 const scene=new THREE.Scene(),city=createBund({scene,world:new VoxelWorld(),getPos:()=>({x:-200,y:26,z:-150})});
 const lights=scene.children.filter(m=>m.userData.showBand!==undefined);
 assert(lights.length>6,'building windows, washes and facade lights participate');
 assert.deepEqual([...new Set(lights.map(m=>m.userData.showBand))].sort((a,b)=>a-b),[-1,0,2,4]);
 const snapshot=()=>lights.map(m=>[m.visible,m.material.color.getHex(),m.material.opacity]);
 city.tick(0,{night:true,festival:false});const normal=snapshot();
 city.tick(0,{night:true,festival:true,showTime:1});const dim=snapshot();
 assert(dim.some((v,i)=>v[1]!==normal[i][1]||v[2]!==normal[i][2]),'opening fades existing lights');
 assert(bundShowLevel(3,0)>bundShowLevel(3,5));
 assert(bundShowLevel(8,5)>bundShowLevel(8,0));
 assert(bundShowLevel(14,0)>bundShowLevel(14,5));
 assert(bundShowLevel(5,2)>bundShowLevel(5,0)&&bundShowLevel(5,2)>bundShowLevel(5,5),'middle section follows the left');
 for(let t=0;t<42;t+=.1)for(let band=0;band<6;band++)assert(bundShowLevel(t,band)>=.379,'lights retain a gentle base');
 assert(bundShowLevel(33,0)>.9&&bundShowLevel(34,0)<.39,'shared finale pulses');
 assert.equal(bundShowLevel(41,0),bundShowLevel(41,5));
 city.tick(0,{night:true,festival:false});assert.deepEqual(snapshot(),normal,'night state and original materials restored');
 city.tick(0,{night:false,festival:false});assert(lights.every(m=>!m.visible),'ordinary daytime');
 for(let t=0;t<42;t+=.1)for(let band=0;band<6;band++)assert(Math.abs(bundShowLevel(t+.001,band)-bundShowLevel(t,band))<.01,'cue transitions are smooth');
}finally{globalThis.document=oldDocument;}
console.log('PASS: Bund building show fade, travelling waves, synchronized finale and restoration.');

