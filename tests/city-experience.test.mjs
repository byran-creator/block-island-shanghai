import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createBicyclePedaling} from '../game/bicycle-pedaling.js';
import {createShanghaiJourney} from '../game/shanghai-journey.js';
const root=new T.Group(),geometry=new T.BoxGeometry(1,1,1),material=new T.MeshBasicMaterial(),makePart=()=>{const m=new T.Mesh(geometry,material);root.add(m);return m;};
const rig=createBicyclePedaling({legs:[makePart(),makePart()],makePart});
const first=rig.rigs[0].shoe.position.clone();rig.advance(.5);assert(first.distanceTo(rig.rigs[0].shoe.position)>.08,'A travelling bicycle must visibly pedal');
for(let i=0;i<120;i++){rig.advance(.03);for(const r of rig.rigs){assert(Math.abs(r.upper.scale.y-.41)<1e-9&&Math.abs(r.shin.scale.y-.41)<1e-9,'Leg segments must not stretch');assert(Math.abs(r.shoe.position.y-r.pedal.position.y-.055)<1e-9,'Shoe stays on its pedal');}assert(Math.abs(rig.rigs[0].pedal.position.y+rig.rigs[1].pedal.position.y-1.02)<1e-9,'Opposing pedals remain half a turn apart');}
const atRest=rig.rigs.map(r=>r.shoe.position.clone());for(let i=0;i<30;i++)rig.advance(0);assert(rig.rigs.every((r,i)=>r.shoe.position.equals(atRest[i])),'Stopping freezes the feet');
const previous=globalThis.document,context=new Proxy({measureText:()=>({width:30})},{get:(o,k)=>o[k]??(()=>{})}),elements=new Map();
const node=()=>({children:[],style:{},classList:{add(){},remove(){}},append(...x){this.children.push(...x);},appendChild(x){this.children.push(x);},replaceChildren(...x){this.children=x;},setAttribute(){},addEventListener(){},focus(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>context});
globalThis.document={hidden:false,body:node(),createElement:node,querySelector:()=>null,querySelectorAll:()=>[],getElementById:id=>{if(!elements.has(id))elements.set(id,node());return elements.get(id);}};
try{
 const people=['office-walk','tower-visitor'].map((kind,i)=>({kind,district:'lujiazui',npcRole:['沈先生','小夏'][i],guide:{},root:new T.Group()}));people.forEach((p,i)=>p.root.position.set(180+i*6,26,70));
 const ui=createShanghaiJourney({scene:new T.Scene(),camera:new T.PerspectiveCamera(),getContext:()=>({pos:{x:180,y:26,z:70},people}),pause(){},resume(){},placeStart(){},getAudio:()=>null,getSound:()=>false,getVolume:()=>0});
 ui.restore({version:1,phase:'journey',index:6});const saved=ui.serialize();ui.replayChapter(8);assert.equal(ui.state.index,6,'Unvisited chapters cannot be replayed');
 ui.replayChapter(3);ui.tick(0,true);assert.equal(ui.serialize().index,6,'An unfinished original journey is retained');assert.equal(ui.state.edition,2);assert(people.every(p=>p.journeyMeeting));assert(people.every(p=>p.root.children.some(c=>c.name.startsWith('journey-meeting-')&&c.visible)),'Both pending targets are marked');assert(ui.target().npcTarget);
 ui.record({type:'city-conversation',district:'lujiazui',kind:'office-walk',name:'沈先生'});ui.tick(0,true);assert(!people[0].journeyMeeting&&people[1].journeyMeeting,'Only the finished role loses its marker');
 ui.record({type:'city-conversation',district:'lujiazui',kind:'tower-visitor',name:'小夏'});ui.tick(0,true);assert(people.every(p=>!p.journeyMeeting));assert(ui.record({type:'sky'}));assert.equal(ui.state.index,6);assert.equal(ui.state.edition,1);assert.equal(ui.serialize().memory,saved.memory);assert.deepEqual(ui.inventory,{});
 ui.replayChapter(3);ui.state.tracked=false;ui.tick(0,true);assert(people.every(p=>p.root.children.filter(c=>c.name.startsWith('journey-meeting-')).every(c=>!c.visible)));ui.stopReplay();assert.equal(ui.state.index,6);
 console.log('PASS: travel-driven pedaling, unstretched knees and pedal contact, stationary feet; optional partial-save replay, two gold targets, per-role completion and unchanged original progress.');
}finally{globalThis.document=previous;}
