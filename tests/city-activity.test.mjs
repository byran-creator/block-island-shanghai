import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps,CITY,LANDMARKS} from '../game/world.js';
import {PEARL,riverWestEdge,riverEastEdge} from '../game/shanghai-map.js';
import {createCityActivity,ferryPosition,ferryPhase,NEON_COLORS} from '../game/city-activity.js';
import {migrateWestBankSave} from '../game/city-migration.js';
import {buildingStyle} from '../game/city-architecture.js';
import {ALL_BUILDINGS} from '../game/city-layout.js';
const world=new VoxelWorld();
assert(CITY.swfc.x>CITY.jinmao.x&&CITY.swfc.z>CITY.jinmao.z,'SWFC must be southeast of Jin Mao');
assert(CITY.shanghai.x<CITY.jinmao.x&&CITY.shanghai.z>CITY.swfc.z,'Shanghai Tower must be south of the other two');
assert(PEARL.top>CITY.jinmao.top&&PEARL.top<CITY.swfc.top,'Pearl must not be shorter than Jin Mao');
const jx=Math.floor(CITY.jinmao.x),jz=Math.floor(CITY.jinmao.z);
for(let y=91;y<=95;y++)assert(world.get(jx+3,y,jz),'Jin Mao crown must have a continuous support above its observatory');
// Projection at the two fixed reference viewpoints must reproduce the photographed ordering.
const bearing=(p,x,z)=>Math.atan2(p.z-z,p.x-x);
const front=[PEARL,CITY.jinmao,CITY.swfc,CITY.shanghai].map(p=>bearing(p,30,84));
assert(front.every((a,i)=>!i||a>front[i-1]),'Bund front silhouette ordering');
const north=[CITY.swfc,CITY.jinmao,CITY.shanghai,PEARL].map(p=>bearing(p,145,-130));
assert(north.every((a,i)=>!i||a>north[i-1]),'North Bund silhouette ordering');
for(const p of [LANDMARKS.magnolia,LANDMARKS.helipad,LANDMARKS.northBund])assert(!overlaps(world,p.x,p.y,p.z)&&overlaps(world,p.x,p.y-.1,p.z));
for(let t=0;t<=94;t+=.25){const p=ferryPosition(t);assert(p.x>riverWestEdge(p.z)+3&&p.x<riverEastEdge(p.z)-3,'Ferry hull crosses dry land');}
assert.equal(ferryPhase(1).port,0);assert.equal(ferryPhase(48).port,1);
for(const bank of ['east','west'])assert(new Set(ALL_BUILDINGS.filter(b=>b.bank===bank).map(b=>buildingStyle(b).color)).size>=5,'Two shores need mixed palettes');
for(const [id,old]of Object.entries({jinmao:{x:159.5,y:91,z:62.5},swfc:{x:181.5,y:104,z:56.5},shanghai:{x:157.5,y:136,z:91.5}})){
 const snapshot={mapRevision:9,pos:old,edits:[],life:{furniture:[{...old,storage:{7:4}}]}};const copy=migrateWestBankSave(snapshot);assert.equal(snapshot.pos.x,old.x);assert.equal(copy.pos.x,CITY[id].x);assert.equal(copy.pos.z,CITY[id].z);assert.equal(copy.life.furniture[0].storage[7],4);const current={...copy,mapRevision:11};assert.equal(migrateWestBankSave(current),current);
}
const context={fillRect(){},strokeRect(){},fillText(){},strokeText(){}};
const element=()=>({children:[],appendChild(e){this.children.push(e);},replaceChildren(){this.children=[];},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>context});
const ids=new Map(['city-close','city-title','city-result','city-actions','city-dialog','city-prompt'].map(id=>[id,element()]));
const originalDocument=globalThis.document;globalThis.document={getElementById:id=>ids.get(id),createElement:element};
try{
 let pos={x:0,y:26,z:66},paused=false,food=0,progress=0;const events=[];
 const state={hunger:20,get food(){return food;},set food(v){food=v;},eat(){food--;}};
 const activity=createCityActivity({onEvent:e=>{events.push(e);if(e.type==='ferry'){assert(!activity.isRiding(),'Quest snapshot must not save a still-attached ferry ride');assert.equal(pos.name,activity.landings[e.to].name);}},scene:new THREE.Scene(),world,getPos:()=>pos,getState:()=>state,teleport:p=>{pos={...p};},notify(){},pause:()=>{paused=true;},resume:()=>{paused=false;},onProgress:()=>progress++});
 assert(activity.vendors.length>=6&&activity.vendors.some(v=>v.food)&&activity.vendors.some(v=>!v.food));
 assert(activity.tourists.some(p=>p.kind==='eat')&&activity.tourists.some(p=>p.kind==='shop'));
 assert(activity.signs.length>=60&&NEON_COLORS.length>=5);
 const left=activity.signs.filter(s=>s.mesh.position.z<66),right=activity.signs.filter(s=>s.mesh.position.z>66);assert(left.length>20&&right.length>20);
 activity.tick(4,{night:true});assert(activity.neons.every(m=>m.visible));assert(activity.signs.every(s=>s.mesh.material===s.night));
 for(const p of activity.tourists)assert(!overlaps(world,p.root.position.x,26,p.root.position.z),'Tourist placed inside a wall');
 activity.tick(0,{night:false});assert(activity.neons.every(m=>!m.visible));
 const vendor=activity.vendors.find(v=>v.food);pos={x:vendor.x,y:26,z:vendor.z};assert(activity.use());assert(paused);ids.get('city-actions').children[0].onclick();assert.equal(food,2);ids.get('city-actions').children[0].onclick();assert.equal(food,2);activity.close();assert(!paused);assert.deepEqual(events,[{type:'shop'}],'Rejected repeat purchase must not emit progress');
 const saved=activity.serialize();activity.restore(saved);assert.deepEqual(activity.serialize(),saved);
 pos={...activity.landings[0]};assert(activity.use());assert(activity.isRiding());assert.equal(activity.safeSavePoint().y,26);for(let i=0;i<440;i++)activity.tick(.1,{night:false});assert(!activity.isRiding());assert.equal(pos.name,activity.landings[1].name);assert(!overlaps(world,pos.x,pos.y,pos.z)&&overlaps(world,pos.x,pos.y-.1,pos.z));assert(progress>=2);assert.deepEqual(events.at(-1),{type:'ferry',from:0,to:1,departed:true});
 const count=events.length;activity.tick(0);pos={...activity.landings[1]};assert(activity.use());activity.cancelRide();activity.tick(50);assert.equal(events.length,count,'Cancelled ferry ride must not count as crossing');
}finally{globalThis.document=originalDocument;}
console.log('PASS: two-view landmark ordering, supported Magnolia helipad, ferry water route/boarding/arrival, mixed palettes, old trio saves, both-side neon signage, vendors, shopping/eating tourists and market persistence.');
