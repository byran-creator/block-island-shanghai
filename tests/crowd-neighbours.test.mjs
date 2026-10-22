import assert from 'node:assert/strict';
import * as T from '../game/three.module.js';
import {createStreetCrowd} from '../game/street-crowd.js';
import {createStreetCrowd as publishedCrowd} from './fixtures/street-crowd91.mjs';

const actor=(x=0,z=0)=>{const root=new T.Group();root.position.set(x,26,z);return {root,arms:[{rotation:{}},{rotation:{}}],legs:[{rotation:{}},{rotation:{}}]};};
function scenario(factory,count=116){
 const people=Array.from({length:count},(_,i)=>({...actor((i%19-9)*3,(Math.floor(i/19)-2)*2),stationary:i%23===0}));
 const outsiders=Array.from({length:12},(_,i)=>({...actor(i*3-17,i%2?2:-2),stationary:i%2===0,ready:i%3!==0}));
 const car={root:new T.Group(),halfWidth:.8,halfLength:2.6,height:1.8};car.root.position.set(-10,26,0);
 let frame=0,queries=0;
 const controller=factory(people,{area:{x1:-40,x2:40,z1:-7,z2:7},clear:q=>!(frame>=160&&frame<340&&q.x>-2&&q.x<2&&q.z<3),active:p=>p.enabled!==false,others(){
  queries++;outsiders[0].root.position.x=-4+(queries%17)*.11;
  return [...outsiders.slice(queries%3),{root:people[4].root,stationary:true,ready:true}];
 }});
 function tick(index){
  frame=index;
  car.root.position.x=-10+(index%180)*.1;car.root.rotation.y=index%120<60?0:Math.PI/2;
  outsiders[2].root.visible=index%120<70;outsiders[3].root.position.y=index%90<40?26:30;
  outsiders[4].ready=index%60<30;outsiders[5].stationary=index%70<35;
  outsiders[6].root.position.set(index%80<40?-4-1e-9:-4+1e-9,26,0);
  if(index===80){people[10].enabled=false;people[10].ready=false;people[10].root.visible=false;}
  if(index===110)people[10].enabled=true;
  if(index===370){people[2].root.position.copy(people[1].root.position);people[1].crowd.wait=0;people[2].crowd.wait=0;}
  if(index===440)people[7].crowd.wait=2;
  controller.tick([0,.016,.08,.1,.033][index%5],[car]);
 }
 const snapshot=()=>people.map(p=>({position:p.root.position.toArray(),yaw:p.root.rotation.y,visible:p.root.visible,ready:p.ready,crowd:p.crowd?JSON.parse(JSON.stringify(p.crowd)):null,arms:p.arms,legs:p.legs}));
 return {tick,snapshot,get queries(){return queries;}};
}
for(const count of [12,40,116]){
 const baseline=scenario(publishedCrowd,count),candidate=scenario(createStreetCrowd,count);
 assert.deepEqual(candidate.snapshot(),baseline.snapshot(),'Seeded construction remains identical');
 for(let frame=0;frame<900;frame++){baseline.tick(frame);candidate.tick(frame);assert.deepEqual(candidate.snapshot(),baseline.snapshot(),'Published trajectory differs at crowd '+count+', frame '+frame);assert.equal(candidate.queries,baseline.queries,'External-neighbour callbacks retain their cadence');}
}
console.log('PASS: 2,700 exact published-crowd frames for small and indexed groups; cell edges, moving aliases, changing neighbours, hidden/unready/other-level actors, waits, respawn, overlap recovery, new obstacles and vehicles.');
