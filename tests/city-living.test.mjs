import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createCityActivity} from '../game/city-activity.js';
import {createPeaceRestaurant,PEACE_DINING,PEACE_MEALS} from '../game/peace-restaurant.js';
import {createPrivateSuites} from '../game/private-suites.js';
import {SuiteControls} from '../game/suite-controls.js';
import {SurvivalState} from '../game/survival-state.js';
const world=new VoxelWorld(),ctx={fillRect(){},strokeRect(){},fillText(){},strokeText(){}};
const element=()=>({children:[],appendChild(e){this.children.push(e);},append(){},replaceChildren(){this.children=[];},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>ctx});
const ids=new Map(),oldDocument=globalThis.document;globalThis.document={body:element(),getElementById:id=>{if(!ids.has(id))ids.set(id,element());return ids.get(id);},createElement:element};
try{
 let p={x:0,y:26,z:66},progress=0;const state=new SurvivalState(),events=[];state.setMode('survival');state.hunger=20;state.food=0;
 const scene=new THREE.Scene(),options={scene,world,getPos:()=>p,getState:()=>state,teleport:q=>p={...q},notify(){},pause(){},resume(){},onProgress:()=>progress++,onEvent:e=>events.push(e)};
 const activity=createCityActivity(options),shops=activity.vendors;
 assert.equal(shops.filter(v=>v.indoor).length,6);assert.equal(shops.filter(v=>!v.indoor).length,2);
 for(const v of shops){assert.equal(v.stock.length,6);assert(v.stock.every(s=>s.children.length>0&&s.parent&&s.userData.product===v.product));if(!v.indoor)continue;const b=v.building;for(let dz=b.rz+.7;dz>=1.3;dz-=.15){p={x:b.x+.5,y:26,z:b.z+b.entranceSide*dz};assert(!overlaps(world,p.x,p.y,p.z),'Shop entrance aisle: '+b.id);assert(!activity.collides(p.x,p.y,p.z));}for(let x=b.x+.5;x<=v.x;x+=.1){p={x,y:26,z:v.z+b.entranceSide*1.3};assert(!overlaps(world,p.x,p.y,p.z));assert(!activity.collides(p.x,p.y,p.z));}assert(activity.use(),'Indoor counter reachable');activity.close();}
 const v=shops.find(v=>v.indoor&&v.food);p={x:v.x,y:26,z:v.z+v.building.entranceSide*1.3};assert(activity.use());let button=ids.get('city-actions').children[0];button.onclick();assert.equal(v.remaining,5);assert.equal(v.stock.filter(s=>s.visible).length,5);assert.equal(state.food,2);assert.equal(activity.goods[v.product],1);button.onclick();assert.equal(v.remaining,5);assert.equal(events.length,1);activity.close();
 const snapshot=activity.serialize();activity.restore(snapshot);assert.deepEqual(activity.serialize(),snapshot);assert.equal(v.stock.filter(s=>s.visible).length,5);
 for(let i=0;i<5;i++){activity.tick(30);assert(activity.use());button=ids.get('city-actions').children[0];button.onclick();activity.close();}assert.equal(v.remaining,0);assert.equal(v.stock.filter(s=>s.visible).length,0);assert(activity.use());button=ids.get('city-actions').children[0];assert(button.disabled);const food=state.food;button.onclick();assert.equal(state.food,food);assert.equal(events.length,6);activity.close();activity.restore({purchases:3});assert(v.stock.every(s=>s.visible)&&v.remaining===6);assert.equal(activity.serialize().purchases,3);
 const restaurant=createPeaceRestaurant(options);p={...PEACE_DINING.counter};
 for(const [i,meal]of PEACE_MEALS.entries()){restaurant.tick(45);assert(restaurant.use());ids.get('peace-meals').children[i].onclick();assert.equal(restaurant.serialize().lastMeal,meal.id);assert(restaurant.mealDisplay.visible);const shown=restaurant.mealDisplay.children.filter(m=>m.visible);assert.equal(shown.length,1);assert.equal(shown[0].userData.product,meal.id);assert(shown[0].children.length>=3);const saved=restaurant.serialize();restaurant.restore(saved);assert.deepEqual(restaurant.serialize(),saved);restaurant.close();}
 const dish=restaurant.mealDisplay.position;p={x:dish.x,y:42,z:dish.z-1.35};assert(!overlaps(world,p.x,p.y,p.z)&&!restaurant.collides(p.x,p.y,p.z));state.hunger=12;const before=state.food;assert(restaurant.use());assert.equal(state.food,before-1);assert.equal(restaurant.serialize().lastMeal,null);assert(!restaurant.mealDisplay.visible);restaurant.restore({served:4,cooldown:0});assert.equal(restaurant.serialize().served,4);assert(!restaurant.mealDisplay.visible);
 const suites=createPrivateSuites({...options,lookAt(){},setDay(){}});
 for(const f of suites.fixtures){const tap=suites.actions.find(a=>a.fixture===f&&a.kind==='tap'),tv=suites.actions.find(a=>a.fixture===f&&a.kind==='tv'),drain=suites.actions.find(a=>a.fixture===f&&a.kind==='drain');
  p={x:tap.x+f.s.view*.85,y:tap.y,z:tap.z-.15};assert(!overlaps(world,p.x,p.y,p.z)&&!suites.collides(p.x,p.y,p.z),'Tap reachable outside bath');assert(suites.use());assert(f.state.tap);suites.tick(true,2);assert(f.state.water>0&&f.state.water<1&&f.water.visible&&f.stream.visible);const level=f.state.water;suites.tick(false,100);assert.equal(f.state.water,level);suites.tick(true,20);assert.equal(f.state.water,1);assert(!f.state.tap&&!f.stream.visible);assert(f.water.parent,'Water excluded from static batching');
  p={x:tv.x,y:tv.y,z:tv.z-1.4};assert(!overlaps(world,p.x,p.y,p.z)&&!suites.collides(p.x,p.y,p.z),'Remote reachable');assert(suites.use());assert(f.state.tv);assert(f.screen.parent);const saved=suites.serialize();suites.restore(saved);assert.deepEqual(suites.serialize(),saved);
  p={x:drain.x,y:drain.y,z:drain.z-.3};assert(!overlaps(world,p.x,p.y,p.z)&&!suites.collides(p.x,p.y,p.z),'Drain reachable');assert(suites.use());assert(f.state.drain);suites.tick(true,9);assert.equal(f.state.water,0);assert(!f.water.visible&&!f.state.drain);
 }
 suites.restore(null);assert(suites.fixtures.every(f=>!f.state.tv&&!f.state.tap&&f.state.water===0));const controls=new SuiteControls();controls.restore({water:Infinity,tap:true,drain:true});assert.equal(controls.water,0);assert(!controls.drain);controls.tick(NaN);assert.equal(controls.water,0);
 assert(progress>8);
}finally{globalThis.document=oldDocument;}
console.log('PASS: reachable indoor counters, individual stock removal/sold-out/cooldown/save compatibility, three plated dishes/consumption, reachable suite controls, gradual/pause-safe bath water, independent TVs and fixture persistence.');
