import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps,LANDMARKS} from '../game/world.js';
import {YUYUAN,YUYUAN_SHIFT,YUYUAN_WALKS,YUYUAN_STATION_WALK,YUYUAN_STATION_WALK_SOUTH,JIUQU_BRIDGE} from '../game/yuyuan-layout.js';
import {createYuyuan} from '../game/yuyuan.js';
import {LINE10_WORLD_STATIONS} from '../game/metro-line10-layout.js';
import {SurvivalState} from '../game/survival-state.js';
import {CityQuestState} from '../game/city-quests.js';
const world=new VoxelWorld(),p={...YUYUAN.arrival},ctx=new Proxy({},{get:()=>()=>{}}),nodes=new Map(),node=()=>({children:[],appendChild(c){this.children.push(c);},replaceChildren(){this.children=[];},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>ctx});
const previous=globalThis.document;globalThis.document={createElement:node,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
try{
 const state=new SurvivalState(),quests=new CityQuestState(),scene=new THREE.Scene();let paused=false;
 const district=createYuyuan({scene,world,getPos:()=>p,getState:()=>state,notify(){},pause:()=>paused=true,resume:()=>paused=false,onEvent:e=>quests.record(e)});
 assert.equal(YUYUAN.arrival.z,LANDMARKS.yuyuan.z);assert(LINE10_WORLD_STATIONS[1].x<YUYUAN.tea.x&&LINE10_WORLD_STATIONS[1].z<YUYUAN.tea.z,'The metro station belongs northwest of the tea house');
 const paths=[YUYUAN_WALKS,YUYUAN_STATION_WALK,YUYUAN_STATION_WALK_SOUTH,JIUQU_BRIDGE.map(([x,z])=>[x,z+YUYUAN_SHIFT])];
 for(const points of paths)for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.15);for(let j=0;j<=n;j++){const x=a[0]+(b[0]-a[0])*j/n,z=a[1]+(b[1]-a[1])*j/n;assert(world.get(Math.floor(x),25,Math.floor(z)),'A walking or bridge deck has no solid support');assert(!overlaps(world,x,26,z),'A walking route is blocked at '+x+','+z);assert(!district.collides(x,26,z),'Bridge model blocks its own path at '+x+','+z);}}
 assert(world.get(-90,25,190)&&world.get(-90,25,205),'Garden block must join the existing city with land, not a floating island');
 assert(world.get(-61,21,240));assert.equal(world.get(-61,25,240),0,'Pond should be a real water depression');
 for(const a of district.actors)assert(!overlaps(world,a.root.position.x,26,a.root.position.z),'NPC clips the public shell');
 Object.assign(p,{x:YUYUAN.tea.x,y:26,z:YUYUAN.tea.z-1.2});assert(district.use()&&paused);nodes.get('yuyuan-actions').children[0].onclick();assert(quests.done('yuyuan-tea'));const first=district.serialize().teas;nodes.get('yuyuan-actions').children[0].onclick();assert.equal(district.serialize().teas,first);district.close();assert(!paused);
 Object.assign(p,{x:YUYUAN.snack.x,y:26,z:YUYUAN.snack.z-1.8});assert(district.use());const food=state.food;nodes.get('yuyuan-actions').children[0].onclick();assert.equal(state.food,food+2);assert.equal(district.shopArt.goods.buns.filter(g=>g.visible).length,11,'One purchase must remove exactly one physical bun display');nodes.get('yuyuan-actions').children[0].onclick();assert.equal(state.food,food+2);district.close();
 Object.assign(p,{x:-62,y:26,z:272});district.tick(21);assert(district.use());nodes.get('yuyuan-actions').children[0].onclick();assert.equal(district.inventory['江南手作纪念品'],1);assert.equal(district.shopArt.goods.souvenir.filter(g=>g.visible).length,5);district.close();
 for(const [x,z,front,center]of [[-26,274,270,272],[-62,274,270,272],[-65,223,220,222]])for(let zz=front-2;zz<=center;zz+=.1){assert(!overlaps(world,x,26,zz)&&!district.collides(x,26,zz),'Showroom central entrance must stay clear');}
 district.tick(0,{night:true});const night=[...district.gardenArt.dynamicRoots].find(r=>r.type==='Group');assert(night.visible);district.tick(0,{night:false});assert(!night.visible);
 const drops=[...district.gardenArt.dynamicRoots].find(r=>r.isInstancedMesh),matrix=new THREE.Matrix4();district.tick(.3);for(let i=0;i<drops.count;i++){drops.getMatrixAt(i,matrix);assert(matrix.elements.every(Number.isFinite));assert(matrix.elements[13]>=22.29&&matrix.elements[13]<=25.01,'Fountain jets must remain over the pond below the bridge');}
 const tourists=district.visitors.people;assert.equal(tourists.length,8);const initial=tourists.map(a=>a.travel);for(let i=0;i<6000;i++)district.tick(.1);assert(tourists.every((a,i)=>a.travel-initial[i]>250),'Each independent visitor must progress across the branch and return');assert(tourists.every(a=>a.wait<10),'No permanent visitor deadlock');
 Object.assign(p,YUYUAN.riddle);for(const answer of [0,1,2]){assert(district.use());nodes.get('yuyuan-actions').children[answer].onclick();district.close();}assert(quests.done('yuyuan-riddle'));const saved=district.serialize();district.restore(saved);assert.deepEqual(district.serialize(),saved);assert(district.use());assert.equal(nodes.get('yuyuan-actions').children.length,0);district.close();
 assert(quests.claim('yuyuan-riddle'));assert.equal(quests.claim('yuyuan-riddle'),null);assert(!quests.record({type:'metro10',from:'nanjing',to:'yuyuan'}));assert(quests.record({type:'metro10',from:'nanjing',to:'yuyuan',departed:true}));
 console.log('PASS: city land/geography, continuous supported branch/exit/bridge paths, solid pond, clear NPCs, tea/snack cooldowns, three real riddle answers, save restore and once-only quest rewards.');
}finally{globalThis.document=previous;}
