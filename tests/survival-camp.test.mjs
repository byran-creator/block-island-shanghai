import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {SurvivalState} from '../game/survival-state.js';
import {startCooking,collectCooking,cookingRemaining,restoreCooking,fishingTarget,fishingValid} from '../game/survival-camp.js';
import {createLife} from '../game/life.js';
import {CityQuestState} from '../game/city-quests.js';
import {questTarget} from '../game/quest-guidance.js';
import {VoxelWorld,LANDMARKS} from '../game/world.js';

const state=new SurvivalState();state.setMode('survival');assert(state.craft('fishingrod'));assert(state.fishingRod);assert(!state.craft('fishingrod'));
const fire={type:'campfire',x:0,y:26,z:0};state.furniture.push(fire);state.raw=7;state.elapsed=12;const food=state.food;
assert.equal(startCooking(state,fire),4);assert.equal(state.raw,3);assert.equal(startCooking(state,fire),0);assert.equal(collectCooking(state,fire),0);
state.elapsed=25;const saved=state.serialize(),restored=new SurvivalState();restored.restore(saved);
assert(restored.fishingRod);assert.equal(cookingRemaining(restored.furniture[0],restored.elapsed),17);assert.equal(restored.raw,3);
restored.elapsed=42;assert.equal(collectCooking(restored,restored.furniture[0]),4);assert.equal(restored.food,food+8);assert.equal(collectCooking(restored,restored.furniture[0]),0);
assert.equal(restoreCooking({count:9,readyAt:10},0),null);assert.equal(restoreCooking({count:2,readyAt:NaN},0),null);
const old=new SurvivalState();old.restore({mode:'survival',bag:{4:8},furniture:[{type:'bed',x:1,y:26,z:1}]});assert(!old.fishingRod);assert.equal(old.furniture[0].type,'bed');
const quests=new CityQuestState();for(const e of [{type:'survival-fish'},{type:'survival-fish',survival:false,caught:true},{type:'survival-cook',survival:true,count:0}])assert(!quests.record(e));
const world=new VoxelWorld(),dock=LANDMARKS.dock;let actualTarget=null;
for(const d of [new THREE.Vector3(1,0,0),new THREE.Vector3(0,0,1),new THREE.Vector3(-1,0,0),new THREE.Vector3(0,0,-1)])actualTarget??=fishingTarget(world,dock,d);
assert(actualTarget,'The guided real-world dock must have reachable fishing water');
 assert.equal(fishingTarget(world,dock,new THREE.Vector3(1,0,0),{dry:true}),null,'Metro interiors must not count as water');
assert.equal(fishingTarget(world,{...dock,y:50},new THREE.Vector3(1,0,0)),null,'Flying players cannot fish from high above the water');
const session={start:{x:0,y:26,z:0}};assert(fishingValid(session,{x:1,y:26,z:0},true,false));assert(!fishingValid(session,{x:2,y:26,z:0},true,false));assert(!fishingValid(session,session.start,false,false));

const previous=globalThis.document,nodes=new Map(),node=()=>({children:[],appendChild(c){this.children.push(c);},replaceChildren(){this.children=[];},addEventListener(){},classList:{toggle(){}},getContext:()=>({fillRect(){},fillText(){}})});
globalThis.document={createElement:node,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
try{
 const events=[],messages=[],scene=new THREE.Scene(),pos={x:4,y:26,z:0};let direction=new THREE.Vector3(1,0,0);
 const shore={surfaceAt:()=>26,protected:()=>false,get:(x,y,z)=>x>=6?(y<20?3:0):(y<26?1:0)};
 const wall={...shore,get:(x,y,z)=>x===8&&y<50?3:shore.get(x,y,z)};assert.equal(fishingTarget(wall,pos,direction),null,'A line may not be cast through a wall');
 const life=createLife({scene,world:shore,getPos:()=>pos,getDirection:()=>direction,notify:m=>messages.push(m),pause(){},resume(){},onMode(){},onHeld(){},onDeath(){},setDay(){},onProgress(){},onEvent:e=>{events.push(e);quests.record(e);}});
 life.state.setMode('survival');assert(life.state.craft('fishingrod'));assert(life.use());const float=scene.getObjectByName('fishing-float');assert(float.visible);
 assert(life.use());assert.equal(life.state.raw,0,'Early reeling cannot grant fish');life.tick(10,{night:false,moving:false,racing:false});assert(life.use());assert.equal(life.state.raw,1);assert(!float.visible);assert(quests.done('survival-fish'));
 assert(life.use());pos.x=6;life.tick(.1,{night:false,moving:true,racing:false});assert(!float.visible,'Moving away cancels the line');assert.equal(life.state.raw,1);pos.x=4;
 assert(life.state.craft('campfire'));life.place({x:1,y:26,z:0});direction=new THREE.Vector3(-1,0,0);assert(life.use());const placed=life.state.furniture[0];assert.equal(placed.cooking.count,1);assert.equal(life.state.raw,0);assert(!quests.done('survival-cook'));
 const before=life.state.food;assert(life.attack());assert.equal(life.state.furniture.length,1,'Uncollected cooking food prevents reclaiming the campfire');
 const save=life.serialize();life.restore(save);assert.equal(cookingRemaining(life.state.furniture[0],life.state.elapsed),30);
 life.tick(29,{night:false,moving:false,racing:false});assert(life.use());assert.equal(life.state.food,before);assert(!quests.done('survival-cook'));
 const foodMeshes=scene.children.find(r=>r.userData.cookingFood)?.userData.cookingFood;assert.equal(foodMeshes.filter(m=>m.visible).length,1);assert.equal(foodMeshes[0].material.color.getHex(),0xdc8b78);
 life.tick(1,{night:false,moving:false,racing:false});assert.equal(foodMeshes[0].material.color.getHex(),0xb8773d);assert(life.use());assert.equal(life.state.food,before+2);assert(quests.done('survival-cook'));assert(life.use());assert.equal(life.state.food,before+2);
 assert.deepEqual(events.map(e=>e.type),['survival-fish','survival-cook']);assert(quests.claim('survival-cook'));assert.equal(quests.claim('survival-cook'),null);
 const restoredQuests=new CityQuestState();restoredQuests.restore(quests.serialize());assert.equal(restoredQuests.claim('survival-cook'),null);
 assert.equal(questTarget('survival-fish',{pos}).stage,'fish');const goal=questTarget('survival-cook',{pos,life:life.state});assert.equal(goal.x,life.state.furniture[0].x+1.5);
}finally{globalThis.document=previous;}
console.log('PASS: real guided water, safe fishing/reeling/cancellation, timed capped cooking, early/duplicate/reclaim guards, old/current save restore and genuine once-only survival quests.');
