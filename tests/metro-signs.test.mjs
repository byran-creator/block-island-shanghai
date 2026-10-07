import assert from 'node:assert/strict';
import {paintMetroSign,metroSignCanvasSize} from '../game/metro-sign-paint.js';
import * as THREE from '../game/three.module.js';
import {createMetro} from '../game/metro.js';
let checkTextWidth=true;const log=[],ctx={font:'',fillStyle:'',fillRect(...a){log.push({kind:'rect',color:this.fillStyle,args:a});},fillText(...a){if(checkTextWidth)assert.equal(a.length,3,'Do not squeeze text horizontally with maxWidth');log.push({kind:'text',text:a[0],color:this.fillStyle,args:a});},measureText(t){return {width:t.length*parseFloat(this.font)*.58};}};
const size=metroSignCanvasSize(10.8,.8);assert(Math.abs(size.width/size.height-10.8/.8)<.01,'Canvas aspect must match physical panel');
paintMetroSign(ctx,[],{...size,sections:[{zh:'号线',en:'Line 2',line2:true},{exit:1,arrow:'←'},{exit:4,arrow:'→'}]});assert(log.some(a=>a.text==='1'&&a.color==='#ffdb43'));assert(log.some(a=>a.text==='Line 2'));assert(log.some(a=>a.text==='2'&&a.color==='#152219'));
log.length=0;paintMetroSign(ctx,['南京东路','East Nanjing Road'],{...metroSignCanvasSize(8.5,1.05),layout:'station'});assert(log.some(a=>a.kind==='rect'&&a.color==='#f8f9f5'));assert(log.some(a=>a.text==='南京东路'&&a.color==='#11191a'));
log.length=0;paintMetroSign(ctx,['南京东路','陆家嘴','1','下一站'],{...metroSignCanvasSize(4.6,.55),layout:'route'});for(const text of ['南京东路','陆家嘴','People\'s Square','Lujiazui'])assert(log.some(a=>a.text===text));assert(log.some(a=>a.text?.includes('南京东路 → 陆家嘴')));
checkTextWidth=false;const old=globalThis.document;globalThis.document={hidden:false,body:{append(){}},createElement:()=>({setAttribute(){},getContext:()=>ctx})};
try{const metro=createMetro({scene:new THREE.Scene(),getPos:()=>({x:0,y:26,z:0}),place(){},setView(){},notify(){},getSound:()=>false});let overhead=0;metro.root.traverse(obj=>{const sign=obj.userData.stationSign;if(sign?.height&&!sign.options.wall){overhead++;assert(sign.y-sign.height/2>(sign.y>14?16:6)+2.5,'Clear walking headroom');}});assert(overhead>=18);assert.equal(new Set(metro.trains.map(t=>t.route.texture)).size,2,'Only one shared route texture per train');metro.tick(13);assert(log.some(a=>a.text?.includes('下一站')));}finally{globalThis.document=old;}
console.log('PASS: physical texture aspect, uncompressed type, yellow exit modules, white station panels, bilingual directional route and shared train textures/headroom.');


