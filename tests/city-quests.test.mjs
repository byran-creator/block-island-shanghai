import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {CITY_QUESTS,CityQuestState} from '../game/city-quests.js';
import {createQuestJournal} from '../game/quest-journal.js';
import {createSkyline} from '../game/skyline.js';
import {SurvivalState} from '../game/survival-state.js';
import {LANDMARKS} from '../game/world.js';
import {validSave} from '../worker/index.js';
const state=new CityQuestState();
for(const event of [{type:'metro',from:'nanjing',to:'nanjing',departed:true},{type:'metro',from:'nanjing',to:'lujiazui'},{type:'metro',from:'unknown',to:'lujiazui',departed:true},{type:'ferry',from:0,to:0,departed:true},{type:'security',station:'unknown'},{type:'teleport',to:'skyDeck'}])assert(!state.record(event));
assert(!state.claim('metro'));assert(!state.set('build',Infinity));state.set('build',9);assert(!state.done('build'));state.set('build',8);assert.equal(state.progress.build,9);state.set('build',10);assert(state.done('build'));
assert(state.record({type:'metro',from:'nanjing',to:'lujiazui',departed:true}));assert(state.claim('metro'));assert.equal(state.claim('metro'),null);
const restored=new CityQuestState();restored.restore(JSON.parse(JSON.stringify(state.serialize())));assert(restored.done('metro'));assert.equal(restored.claim('metro'),null);assert(restored.claim('build'));restored.restore({progress:{security:0},claimed:['security','unknown']},{talkDone:true,placed:10});assert(restored.done('hello')&&restored.done('build'));assert(!restored.done('security')&&!restored.done('metro'));assert.equal(restored.claimed.size,0);
const context={fillRect(){},fillText(){}};
const element=()=>({children:[],className:'',disabled:false,append(...els){this.children.push(...els);},appendChild(el){this.children.push(el);},replaceChildren(){this.children=[];},addEventListener(name,fn){this[name]=fn;},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>context});
const ids=new Map(['task-count','task-summary','task-open','task-list','tasks-dialog','tasks-close','elevator-title','elevator-description','elevator-options','elevator-dialog','elevator-close','skyline-prompt'].map(id=>[id,element()]));
const originalDocument=globalThis.document;globalThis.document={getElementById:id=>ids.get(id),createElement:element};
try{
 let paused=false,allowed=false,saves=0,grants=0;const life=new SurvivalState(),journal=createQuestJournal({pause:()=>paused=true,resume:()=>paused=false,canOpen:()=>allowed,notify(){},onProgress:()=>saves++,grant:r=>{grants++;for(const [id,n]of Object.entries(r.blocks??{}))life.add(Number(id),n);for(const key of ['food','wool','pearls'])life[key]+=r[key]??0;}});
 journal.open();assert(!paused&&!journal.isPanelOpen());allowed=true;journal.open();assert(paused&&journal.isPanelOpen());journal.open();assert(!paused&&!journal.isPanelOpen());
 journal.record({type:'metro',from:'nanjing',to:'lujiazui'});assert.equal(saves,0);journal.record({type:'metro',from:'nanjing',to:'lujiazui',departed:true});assert.equal(saves,1);journal.record({type:'metro',from:'lujiazui',to:'nanjing',departed:true});assert.equal(saves,1);
 const button=ids.get('task-list').children[CITY_QUESTS.findIndex(q=>q.id==='metro')].children.at(-1);assert(!button.disabled&&button.textContent==='领取奖励');const before=life.bag[9]??0,food=life.food;button.onclick();button.onclick();assert.equal(grants,1);assert.equal(life.bag[9],before+12);assert.equal(life.food,food+2);assert.equal(saves,2);
 const saved={version:6,edits:[],pos:{x:0,y:26,z:0},quests:journal.serialize(),life:life.serialize(),adventure:{state:{collected:[]},poster:'data:image/png;base64,AAAA'}};assert(validSave(saved));const roundTrip=JSON.parse(JSON.stringify(saved));life.restore(roundTrip.life);journal.restore(roundTrip.quests);assert.equal(journal.state.claim('metro'),null);assert.equal(life.bag[9],before+12);assert(ids.get('task-list').children[3].children.at(-1).disabled);
 journal.open();ids.get('tasks-dialog').cancel({preventDefault(){}});assert(!paused&&!journal.isPanelOpen());
 let glider=false;let pos={...LANDMARKS.shanghai};const skyline=createSkyline({scene:new THREE.Scene(),getPos:()=>pos,pause(){},resume(){},teleport:p=>{pos={...p};},grantGlider(){glider=true;},notify(){},onProgress(){},onEvent:e=>{assert(glider,'Quest snapshot must include the elevator reward');assert(skyline.serialize().visited);journal.record(e);}});
 skyline.restore({visited:true});assert(!journal.state.done('sky'),'Restoring an old visit must not fabricate a new elevator trip');assert(skyline.use());assert(!journal.state.done('sky'));ids.get('elevator-options').children[2].onclick();assert.equal(pos.y,LANDMARKS.skyDeck.y);assert(journal.state.done('sky'));
}finally{globalThis.document=originalDocument;}
console.log('PASS: verified-event quests, legacy progress, bounded placement count, no teleport/partial trips, journal pause/toggle, accepted elevator arrival, exactly-once rewards and save round-trip.');
