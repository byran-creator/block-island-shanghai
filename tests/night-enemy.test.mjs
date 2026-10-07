import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {createLife} from '../game/life.js';
const oldDocument=globalThis.document,oldRandom=Math.random,nodes=new Map();let seed=431;
Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/2**32);
const node=()=>({children:[],appendChild(){},addEventListener(){},classList:{toggle(){}},getContext:()=>({fillRect(){},fillText(){}})});
globalThis.document={createElement:node,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
try{
 let wall=true,enclosure=null;const scene=new THREE.Scene(),pos={x:10,y:26,z:0};
 const world={surfaceAt:()=>26,protected:()=>false,get:(x,y,z)=>y<26?1:wall&&x===0&&y<31?1:0};
 const blocked=(x,y,z)=>y<26||wall&&x+.29>=0&&x-.29<1&&y<31||enclosure&&Math.abs(x-enclosure.x)<.6&&Math.abs(z-enclosure.z)<.6&&y<28;
 const life=createLife({scene,world,blocked,notify(){},pause(){},resume(){},getPos:()=>pos,getDirection:()=>new THREE.Vector3(-1,0,0),onMode(){},onHeld(){},onDeath(){},setDay(){},onProgress(){}});
 life.state.mode='survival';life.state.health=20;
 const enemies=()=>scene.children.filter(r=>r.children.some(c=>c.material?.color?.getHexString()==='42455d'));
 let checks=0;const side=new Map();
 for(let i=0;i<1800;i++){
  life.tick(.1,{night:true,moving:false,racing:false});
  for(const e of enemies()){const p=e.position;assert(!(p.x+.325>=0&&p.x-.325<1),'Enemy body clips the wall');if(!side.has(e))side.set(e,Math.sign(p.x-.5));assert.equal(Math.sign(p.x-.5),side.get(e),'Enemy crossed a complete wall');checks++;}
 }
 assert(checks>1000,'Night enemies must actually spawn during regression');
 const e=enemies()[0];assert(e);wall=false;
 // A newly placed solid block overlapping an existing enemy must not leave it inside a wall.
 enclosure={x:e.position.x,z:e.position.z};life.tick(.1,{night:true,moving:false,racing:false});assert(!scene.children.includes(e),'New wall must remove an enemy trapped inside its body');
 // Existing model blockers are supplied live by the game; emulate a new model enclosure.
 const embedded=createLife({scene:new THREE.Scene(),world:{...world,protected:()=>true},blocked:()=>true,notify(){},pause(){},resume(){},getPos:()=>pos,getDirection:()=>new THREE.Vector3(),onMode(){},onHeld(){},onDeath(){},setDay(){},onProgress(){}});
 embedded.tick(10,{night:true,moving:false,racing:false});
 assert.equal(embedded.state.health,20,'Blocked spawn must never damage the player');
 console.log('PASS: deterministic three-minute night chase, actual enemy spawning, full-body wall clearance and no wall crossing; blocked spawns remain harmless ('+checks+' checks).');
}finally{globalThis.document=oldDocument;Math.random=oldRandom;}
