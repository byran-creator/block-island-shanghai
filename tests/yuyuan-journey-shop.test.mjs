import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createYuyuan} from '../game/yuyuan.js';
import {ShanghaiJourneyState} from '../game/shanghai-journey-state.js';
import {shanghaiJourneyTarget} from '../game/shanghai-journey-targets.js';
const prior=globalThis.document,ctx=new Proxy({},{get:()=>()=>{}}),nodes=new Map();
const node=()=>({children:[],classList:{add(){},remove(){}},appendChild(c){this.children.push(c);},replaceChildren(){this.children=[];},addEventListener(){},setAttribute(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>ctx});
globalThis.document={body:node(),createElement:node,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
try{
 const world=new VoxelWorld(),p={x:-78,y:26,z:265},events=[];
 const district=createYuyuan({scene:new THREE.Scene(),world,getPos:()=>p,getState:()=>({health:20,hunger:20,food:0}),pause(){},resume(){},notify(){},onEvent:e=>events.push(e)});
 const state=new ShanghaiJourneyState();state.phase='journey';state.index=8;
 const goal=shanghaiJourneyTarget(state,{pos:p,gardenShops:district.streetArt.extraShops});
 assert(goal.label.includes('柜台'));Object.assign(p,{x:goal.x,z:goal.z});
 assert(!overlaps(world,p.x,p.y,p.z)&&!district.collides(p.x,p.y,p.z),'Guided shop position must be accessible');
 assert(district.use(),'V at the guided position opens a shop');
 assert(events.some(e=>e.type==='yuyuan-shop-visit'),'Opening the actual shop counts for the story');
}finally{globalThis.document=prior;}
console.log('PASS: guided indoor shop position, real V interaction and journey event.');
