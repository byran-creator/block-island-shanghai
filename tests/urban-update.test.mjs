import assert from 'node:assert/strict';
import {VoxelWorld,overlaps,CITY,LANDMARKS} from '../game/world.js';
import {DENSE_BUILDINGS,AVENUE_POINTS,NANJING_WEST} from '../game/city-layout.js';
import {migrateWestBankSave} from '../game/city-migration.js';
import {PEACE,PEACE_DINING,createPeaceRestaurant} from '../game/peace-restaurant.js';
import {SurvivalState} from '../game/survival-state.js';
import {riverEastEdge} from '../game/shanghai-map.js';
const world=new VoxelWorld();
assert(DENSE_BUILDINGS.filter(b=>b.bank==='west').length>200);
assert(DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-')).length>=20);
assert(DENSE_BUILDINGS.some(b=>b.id==='ifc-retail-extension'));
assert(!AVENUE_POINTS.some(([x,z])=>x===146||z===19),'Retired Pearl loop must not remain in physical traffic');
for(const z of [60,72]){let facade=0;for(let x=-180;x<=-40;x++)facade+=!!world.get(x,30,z);assert(facade/141>.7,'Pedestrian street must have continuous building frontage');}
for(let x=NANJING_WEST;x<=12;x++)assert(!overlaps(world,x+.5,26,66.5),'Extended Nanjing pedestrian route is obstructed');
assert.equal(CITY.shanghai.x,189.5);assert.equal(CITY.shanghai.z,106.5);
assert(CITY.shanghai.x-riverEastEdge(CITY.shanghai.z)>=30,'Shanghai Tower must occupy an inland block rather than sit directly on the bank');
for(const [id,x,z] of [['jinmao',171.5,78.5],['swfc',197.5,90.5],['shanghai',169.5,106.5]]){
 const old10={mapRevision:10,pos:{x,y:CITY[id].top,z},edits:[[`${Math.floor(x)},80,${Math.floor(z)}`,7]],life:{home:{x,y:86,z},furniture:[{x,y:86,z,storage:{7:19}}]}};
 const next=migrateWestBankSave(old10);assert.equal(next.pos.x,x+20);assert.equal(next.pos.z,z);assert.equal(next.life.home.x,x+20);assert.equal(next.life.furniture[0].storage[7],19);assert.equal(next.edits[0][0],`${Math.floor(x)+20},80,${Math.floor(z)}`);assert.equal(old10.pos.x,x);assert.equal(migrateWestBankSave({...next,mapRevision:11}).pos.x,x+20);
}
for(const [x,z,dz] of [[146,79,0],[218,102,-3]]){const next=migrateWestBankSave({mapRevision:10,pos:{x,y:30,z},edits:[]});assert.equal(next.pos.x,x+20);assert.equal(next.pos.z,z+dz);}
for(const id of ['jinmao-podium','swfc-podium'])assert.equal(DENSE_BUILDINGS.filter(b=>b.id===id).length,1,'Each moved podium must exist exactly once');
const unaffected={mapRevision:10,pos:{x:75,y:26,z:329},edits:[['80,26,334',7]]};assert.deepEqual(migrateWestBankSave(unaffected),unaffected);
for(const p of [LANDMARKS.shanghai,LANDMARKS.skyGarden,LANDMARKS.skyDeck])assert(!overlaps(world,p.x,p.y,p.z)&&overlaps(world,p.x,p.y-.1,p.z));
const old={mapRevision:8,pos:{x:152.5,y:136,z:85.5},edits:[['152,135,85',7]],life:{home:{x:152.5,y:86,z:89.5},furniture:[{x:152.5,y:86,z:89.5,type:'chest',storage:{7:13}}]}};
const moved=migrateWestBankSave(old);assert.equal(old.pos.x,152.5);assert.deepEqual(moved.pos,{x:189.5,y:136,z:106.5});assert.deepEqual(moved.edits,[['189,135,106',7]]);assert.equal(moved.life.home.z,110.5);assert.equal(moved.life.furniture[0].storage[7],13);
assert.equal(migrateWestBankSave({...moved,mapRevision:11}).pos.x,189.5);
for(const p of [PEACE_DINING.lift,PEACE_DINING.arrival,PEACE_DINING.counter])assert(!overlaps(world,p.x,p.y,p.z)&&overlaps(world,p.x,p.y-.1,p.z));
// Walk through the original hotel doorway with ordinary collision checks.
for(let x=PEACE.front+2.5;x>=PEACE_DINING.lift.x;x-=.15)assert(!overlaps(world,x,26,PEACE.z+.5));
const state=new SurvivalState();state.setMode('survival');state.hunger=8;state.health=10;
let pos={...PEACE_DINING.lift},paused=false,progress=0;
const element=()=>({children:[],appendChild(b){this.children.push(b);},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;}});
const ids=new Map(['peace-dialog','peace-meals','peace-close','peace-result','peace-prompt'].map(id=>[id,element()]));
const savedDocument=globalThis.document;globalThis.document={getElementById:id=>ids.get(id),createElement:element};
try{
 const events=[];const restaurant=createPeaceRestaurant({onEvent:e=>events.push(e),world,getPos:()=>pos,getState:()=>state,teleport:p=>{pos={...p};},pause:()=>{paused=true;},resume:()=>{paused=false;},notify:()=>{},onProgress:()=>{progress++;}});
 assert(restaurant.collides(PEACE.x-1.5,42,PEACE.z+3.5),'Dining tables must block walking through them');
 assert(!restaurant.collides(PEACE.x+.5,42,PEACE.z+.5),'The service aisle must remain clear');
 assert(restaurant.use());assert.equal(pos.y,42);pos={...PEACE_DINING.counter};assert(restaurant.use());assert(paused);
 ids.get('peace-meals').children[0].onclick();assert.equal(state.hunger,14);assert(state.health>10);assert.equal(progress,1);
 const food=state.food;ids.get('peace-meals').children[0].onclick();assert.equal(state.food,food,'Ordering cooldown must prevent repeated immediate food grants');
 assert.deepEqual(events,[{type:'meal'}],'Opening a restaurant and rejected repeat orders must not advance meal quest');const snapshot=restaurant.serialize();restaurant.restore(snapshot);assert.deepEqual(restaurant.serialize(),snapshot);
 restaurant.close();assert(!paused);pos={...PEACE_DINING.arrival};assert(restaurant.use());assert.equal(pos.y,26);
}finally{globalThis.document=savedDocument;}
console.log('PASS: dense street fronts, removed road loop, clear extended pedestrian route, repositioned tower/decks and save migration, Peace Hotel entry/lift/dining/food/cooldown persistence.');
