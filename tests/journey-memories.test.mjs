import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createShanghaiJourney} from '../game/shanghai-journey.js';
import {createPhotoMode} from '../game/photo-mode.js';
import {ShanghaiJourneyState} from '../game/shanghai-journey-state.js';
import {TravelJournalState} from '../game/travel-journal-state.js';
import {photographedDiscoveries} from '../game/travel-discoveries.js';

const rain={selfie:false,pos:{x:-51,y:26,z:297.8}},night={selfie:false,pos:{x:48,y:26,z:87.5},direction:{x:1}};
assert.deepEqual(photographedDiscoveries(rain,{rain:.8}),['rain-garden']);
assert.deepEqual(photographedDiscoveries(rain,{rain:0}),[]);
assert.deepEqual(photographedDiscoveries({...rain,selfie:true},{rain:1}),[]);
assert.deepEqual(photographedDiscoveries({...rain,pos:{...rain.pos,y:6}},{rain:1}),[]);
assert.deepEqual(photographedDiscoveries(night,{dayClock:165}),['river-night']);
assert.deepEqual(photographedDiscoveries(night,{dayClock:36}),[]);
assert.deepEqual(photographedDiscoveries({...night,direction:{x:-1}},{dayClock:165}),[]);
const old=new ShanghaiJourneyState();old.restore({version:1,edition:3,index:3,phase:'journey',officeErrand:'done',touristPhoto:'done',encounters:[{name:'沈先生',kind:'office-walk'},{name:'小夏',kind:'tower-visitor'}]});assert(old.record({type:'sky'}),'Already completed old errands never require repeating the thank-you');
const bounded=new TravelJournalState();for(let i=0;i<100;i++)bounded.discover('bad'+i);assert.equal(bounded.discoveries.length,0);bounded.restore({discoveries:['river-night','river-night','bad'],following:'river-night'});assert.deepEqual(bounded.discoveries,['river-night']);assert.equal(bounded.following,null);
for(let i=0;i<32;i++)bounded.message('person:'+i,'路人','普通留言');assert(bounded.message('photo:lujiazui','小夏','谢谢你',true));assert.equal(bounded.messages.length,32);assert(!bounded.messages.some(m=>m.id==='person:0'));assert(bounded.messages.some(m=>m.id==='photo:lujiazui'));assert(!bounded.message('photo:lujiazui','小夏','重复',true));

const previous={document:globalThis.document,URL:globalThis.URL},nodes=[];
class Node{
 constructor(tag){this.tag=tag;this.children=[];this.style={};this.attrs={};this.open=false;this.classList={add(){},remove(){}};nodes.push(this);}
 append(...n){this.children.push(...n);}appendChild(n){this.children.push(n);}replaceChildren(...n){this.children=n;}
 setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this[k];}addEventListener(){}focus(){}showModal(){this.open=true;}close(){this.open=false;}
 getContext(){return new Proxy({measureText:s=>({width:s.length*10}),createLinearGradient:()=>({addColorStop(){}})},{get:(o,k)=>o[k]??(()=>{})});}
}
const body=new Node('body'),ids=new Map();globalThis.document={hidden:false,body,createElement:t=>new Node(t),getElementById:id=>{if(!ids.has(id))ids.set(id,new Node('div'));return ids.get(id);},querySelector:()=>null,querySelectorAll:()=>[]};globalThis.URL={createObjectURL:()=> 'blob:test',revokeObjectURL(){}};
const descendants=n=>[n,...n.children.flatMap(descendants)],button=(root,text)=>descendants(root).find(n=>n.tag==='button'&&n.textContent===text);
try{
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(72,1.5,.1,360),world={get:()=>0},pos={x:201,y:26,z:102.5};
 const person=(kind,name,x,z)=>{const root=new T.Group();root.position.set(x,26,z);scene.add(root);return {root,district:'lujiazui',kind,npcRole:name,guide:{}};};
 const visitor=person('tower-visitor','小夏',201,100),worker=person('office-walk','沈先生',194.5,50.5);let resumed=0,saves=0;
 const ctx={pos,people:[worker,visitor],rain:0,dayClock:36};
 const ui=createShanghaiJourney({scene,camera,world,getContext:()=>ctx,pause(){},resume(){resumed++;},placeStart(){},onProgress(){saves++;},getSound:()=>false,getVolume:()=>0});
 const fixture={version:1,edition:3,index:3,phase:'journey',officeErrand:'done',touristPhoto:'ready',encounters:[{name:'沈先生',kind:'office-walk'},{name:'小夏',kind:'tower-visitor'}]};ui.restore(fixture);
 const mode=createPhotoMode({scene,camera,world,renderer:{render(){}},canvas:{toBlob:cb=>cb({})},getPos:()=>pos,getYaw:()=>0,pause(){},resume(){resumed++;},canOpen:()=>true,onCapture:meta=>ui.record({type:'travel-photo',...meta}),onClose:()=>ui.afterPhoto()});
 mode.open();button(body,'切换拍景').onclick();await mode.capture();assert.equal(ui.state.touristPhoto,'thanks');assert(!ui.panelOpen,'Response waits until the photograph panel is closed');assert(!ui.record({type:'sky'}),'The view cannot skip a pending response');assert(visitor.journeyMeeting,'The tourist remains available until the response ends');
 const pending=ui.serialize();mode.close();assert(ui.panelOpen);assert.equal(resumed,0,'Closing the camera transfers pause ownership to dialogue');
 const dialog=nodes.find(n=>n.id==='journey-dialog'),line=()=>descendants(dialog).find(n=>n.className==='journey-line').textContent;
 assert(line().includes('拍到了'));button(dialog,'稍后再聊').onclick();assert.equal(ui.state.touristPhoto,'thanks');assert(!ui.state.journal.messages.some(m=>m.id==='photo:lujiazui'));
 ui.restore(pending);assert(ui.use(),'After reload V resumes the pending response');for(let i=0;i<4;i++)button(dialog,'继续对话').onclick();assert(!ui.panelOpen,'The final line closes without another exit button');assert.equal(ui.state.touristPhoto,'done');assert(!visitor.journeyMeeting);assert.equal(ui.state.journal.messages.filter(m=>m.id==='photo:lujiazui').length,1);assert(!ui.record({type:'journey-photo-thanks'}));assert(ui.record({type:'sky'}));

 ui.restore({...fixture,officeErrand:'return',touristPhoto:'done'});Object.assign(pos,{x:194.5,y:26,z:53});assert(ui.use());button(dialog,'继续对话').onclick();button(dialog,'稍后再聊').onclick();assert.equal(ui.state.officeErrand,'return','Abandoning an incomplete conversation grants no story');assert.equal(ui.state.journal.discoveries.length,0);assert(ui.use());for(let i=0;i<6;i++)button(dialog,'继续对话').onclick();assert.equal(ui.state.officeErrand,'done');assert(ui.state.journal.messages.some(m=>m.id==='errand:office'&&m.text.includes('阿姨')));assert(ui.state.journal.discoveries.includes('stranger-story'));

 ui.restore({version:1,edition:3,index:10,phase:'complete',memory:'茶香',completedAt:'2026-10-21T00:00:00Z'});const before=ui.serialize();ui.openBook();const book=nodes.find(n=>n.id==='travel-journal');button(book,'城市余韵').onclick();const cards=descendants(book).filter(n=>n.className==='travel-discovery');assert.equal(cards.length,3);button(cards[1],'追踪这页发现').onclick();assert.equal(ui.target().label,'外滩 · 临江观景步道');assert(ui.tracking);assert(ui.title.includes('夜晚的浦江'));
 Object.assign(pos,night.pos);ctx.dayClock=165;assert(ui.record({type:'travel-photo',...night}));assert(!ui.tracking,'A completed discovery releases its marker');assert(!ui.record({type:'travel-photo',...night}),'Repeated captures do not grant or save twice');ctx.rain=.8;Object.assign(pos,rain.pos);assert(ui.record({type:'travel-photo',...rain}));const after=ui.serialize();assert.equal(after.index,before.index);assert.equal(after.memory,before.memory);assert.equal(after.completedAt,before.completedAt);assert.equal(after.journal.photos.length,0,'Discovery pages do not silently store large photographs');
 const restored=new ShanghaiJourneyState();restored.restore(after);assert.deepEqual(restored.journal.discoveries,['river-night','rain-garden']);assert.equal(restored.journal.following,null);ui.replayChapter(3);assert.equal(ui.serialize().index,10);ui.stopReplay();assert(ui.state.complete);assert.equal(ui.state.journal.discoveries.length,2);assert(saves>0);
 console.log('PASS: real photo/dialogue pause handoff, pending thanks save/reload, final-line completion and no skip; employee story only after full conversation; optional weather/time discovery guidance, deduplication, bounded save and completed-journey replay preservation.');
}finally{globalThis.document=previous.document;globalThis.URL=previous.URL;}

import {routeBearing,controlInstruction} from '../game/quest-route-hint.js';
const origin={x:0,y:26,z:0};assert(routeBearing({x:0,y:26,z:-10},origin,0).text.startsWith('前方'));assert(routeBearing({x:-10,y:26,z:0},origin,0).text.startsWith('左侧'));assert(routeBearing({x:10,y:26,z:0},origin,0).text.startsWith('右侧'));assert(routeBearing({x:0,y:26,z:10},origin,0).text.includes('身后'));assert.equal(routeBearing({x:0,y:6,z:0},origin,0).text,'目标在下层 · 沿楼梯 / 扶梯下行');assert(!routeBearing({x:0,y:6,z:0,arriveRadius:2.8},origin).near);assert(routeBearing({x:1,y:26,z:0,arriveRadius:2.8},origin).near);assert.equal(routeBearing({x:0,y:26,z:-10},origin,2*Math.PI).angle,0);assert(controlInstruction('WASD 移动，鼠标环顾；按 V，M 地图',true).includes('摇杆'));assert(controlInstruction('按 V',true).includes('互动 V'));console.log('PASS: camera-relative left/right/front/back, wrapped bearing, different-floor warning and touch interaction labels.');

import {shanghaiJourneyTarget} from '../game/shanghai-journey-targets.js';import {JOURNEY_DIALOGUES} from '../game/shanghai-journey-content.js';
const tutorial=new ShanghaiJourneyState();tutorial.phase='journey';const touchTarget=shanghaiJourneyTarget(tutorial,{pos:{x:48,y:26,z:87.5},touch:true});assert(touchTarget.instruction.includes('摇杆'));assert(!touchTarget.instruction.includes('WASD'));assert.equal(touchTarget.arrivalAction,'talk');assert(JOURNEY_DIALOGUES.lin.at(-1)[1].includes('手机轻推左下角摇杆'));console.log('PASS: first target and Lin dialogue teach the mobile joystick and interaction button.');

import {tutorialTrailPoints,createTutorialTrail} from '../game/tutorial-trail.js';import {drawQuestTarget} from '../game/quest-guidance.js';
const floor={get:(x,y,z)=>y===25?7:0},start={x:-160,y:26,z:66},finish={x:-175,y:26,z:66};
const trail=tutorialTrailPoints(floor,start,finish);assert(trail.length>0&&trail.length<=5);assert(trail.every(p=>p.x<start.x&&p.y>26));assert.deepEqual(tutorialTrailPoints({get:(x,y,z)=>y===25?7:x===-164&&y>=26&&y<28?3:0},start,finish),[],'No arrow prefix points into a blocking wall');assert.deepEqual(tutorialTrailPoints({get:(x,y)=>y===25?11:0},start,finish),[],'No water shortcut');assert.deepEqual(tutorialTrailPoints(floor,start,{...finish,y:16}),[],'No arrows floating over stairwells');
const trailScene=new T.Scene(),guide=createTutorialTrail(trailScene,floor),guideMesh=trailScene.children[0],guideState={phase:'journey',tracked:true,index:0};guide.update(guideState,{pos:start},finish);assert(guideMesh.visible&&guideMesh.count<=5);const geometry=guideMesh.geometry,material=guideMesh.material;for(let i=0;i<100;i++)guide.update(guideState,{pos:start},finish);assert.equal(guideMesh.geometry,geometry);assert.equal(guideMesh.material,material);guide.update({...guideState,index:3},{pos:start},finish);assert(!guideMesh.visible);guide.update(guideState,{pos:start},finish,false);assert(!guideMesh.visible);
const arcs=[],mapLines=[],mapContext={beginPath(){},moveTo:(...p)=>mapLines.push(p),lineTo(){},arc:(...p)=>arcs.push(p),stroke(){},fill(){},closePath(){}};drawQuestTarget(mapContext,{x:9999,z:-9999,label:'outside'},192,-224,624,start);assert.deepEqual(arcs[0].slice(0,3),[180,12,10]);assert(mapLines.length>=2);console.log('PASS: five reused trail instances, clear supported flat ground only, no wall/water/stair shortcuts, third-chapter cleanup and highlighted/clamped minimap target.');
