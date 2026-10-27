import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,LANDMARKS,overlaps,CRYSTALS} from '../game/world.js';
import {PEARL_DECK,oldPearlLanding} from '../game/pearl-observation-layout.js';
import {createPearlObservation} from '../game/pearl-observation.js';
import {AdventureState} from '../game/adventure-state.js';
import {safeLanding} from '../game/map-travel.js';
const world=new VoxelWorld(),p=PEARL_DECK.arrival;
assert.equal(world.get(126,69,49),0,'old exterior pad removed from generated base');
assert(!overlaps(world,p.x,p.y,p.z),'elevator arrival has room for the player');
assert(overlaps(world,p.x,p.y-.05,p.z),'glass floor supports the player');
assert.equal(world.get(126,68,42),9,'original tower core supports the globe');
assert.equal(world.get(129,69,42),0,'the observation ring has clear space beneath the glass');
assert(overlaps(world,129,69.95,42),'clear observation ring remains walkable');
const viewPoint={x:123.1,z:44.1};assert(!overlaps(world,viewPoint.x,70,viewPoint.z)&&overlaps(world,viewPoint.x,69.95,viewPoint.z));for(let y=69;y>45;y--)assert.equal(world.get(Math.floor(viewPoint.x),y,Math.floor(viewPoint.z)),0,'a reachable glass section has a clear downward view');
assert(safeLanding(world,p),'existing landing API accepts the glass floor');
for(const goal of [{x:127.5,z:42.9},{x:PEARL_DECK.crystal.x,z:PEARL_DECK.crystal.z}])for(let i=0;i<=40;i++){const t=i/40,x=p.x+(goal.x-p.x)*t,z=p.z+(goal.z-p.z)*t;assert(!overlaps(world,x,70,z),'interaction and crystal remain reachable without flying');assert(overlaps(world,x,69.95,z),'walkable route is supported');}
for(let i=0;i<24;i++){const a=i*Math.PI/12,x=126+3.9*Math.cos(a),z=42+3.9*Math.sin(a);assert(overlaps(world,x,70,z),'glass wall prevents walking through the perimeter');}
assert(oldPearlLanding({x:126,y:70,z:49}));assert(!oldPearlLanding(p));
const crystal=CRYSTALS.find(c=>c.id==='deck'),state=new AdventureState();assert(state.collectAt({x:crystal.x,y:70,z:crystal.z}).some(c=>c.id==='deck'));const restored=new AdventureState();restored.restore({collected:['deck']});assert(!restored.available(crystal),'old collected progress persists');assert.equal(restored.pearlSnackClaimed,false,'old saves may claim the snack');restored.pearlSnackClaimed=true;const copy=new AdventureState();copy.restore(restored.serialize());assert(copy.pearlSnackClaimed,'snack claim persists without duplication');
const scene=new THREE.Scene(),visual=createPearlObservation(scene);assert(visual.glass.transparent&&visual.glass.opacity<.5&&!visual.glass.depthWrite);assert.equal(visual.floor.material,visual.windows.material);assert(visual.root.children.length<=9,'static details remain batched');
console.log('PASS: Pearl landing, walkable glass floor, perimeter, old platform migration, crystal progress and shared static glazing.');
