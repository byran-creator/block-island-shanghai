import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {SurvivalState} from '../game/survival-state.js';
import {inventoryGroups,createPlayerHandbook} from '../game/player-handbook.js';
import {VoxelWorld,LANDMARKS,overlaps} from '../game/world.js';
import {createLife} from '../game/life.js';
const state=new SurvivalState(),snapshot=state.serialize();state.fishingRod=true;
const groups=inventoryGroups(state,{campfire:2});assert.equal(groups[0].items.length,12);assert(groups[2].items.some(i=>i.name==='鱼竿'));assert.equal(groups[3].items[0].count,2);assert.deepEqual(state.bag,snapshot.bag,'Viewing categories does not reorder or consume inventory');
const previous=globalThis.document,nodes=new Map();
const node=()=>({children:[],style:{},events:{},append(...items){this.children.push(...items);},appendChild(c){this.children.push(c);},replaceChildren(){this.children=[];},addEventListener(n,fn){this.events[n]=fn;},showModal(){this.open=true;},close(){this.open=false;},focus(){},classList:{toggle(){}},getContext:()=>({fillRect(){},fillText(){}})});
globalThis.document={createElement:node,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
try{
 let playing=true,pauses=0,resumes=0,selected=null,crafted=false,allowed=true;
 const ui=createPlayerHandbook({getState:()=>state,getPacked:()=>({campfire:2}),selectBlock:id=>selected=id,craft:()=>crafted=true,pause:()=>{pauses++;playing=false;},resume:()=>{resumes++;playing=true;},isPlaying:()=>playing,canOpen:()=>allowed});
 ui.openBackpack();assert(ui.isPanelOpen()&&!playing);assert.equal(pauses,1);const card=nodes.get('backpack-items').children[0].children[1].children[0];card.onclick();assert.equal(selected,null);assert(!nodes.get('backpack-detail').hidden);nodes.get('backpack-detail').children.at(-1).onclick();assert.equal(selected,1);assert(playing&&!ui.isPanelOpen());
 ui.openGuide();nodes.get('handbook-dialog').events.cancel({preventDefault(){}});assert(playing&&!ui.isPanelOpen());
 playing=false;const before=resumes;ui.openGuide();ui.close();assert(!playing&&resumes===before,'Reading from the main menu must not start the game');
 playing=true;ui.openBackpack();nodes.get('backpack-craft').onclick();assert(crafted&&!ui.isPanelOpen()&&!playing,'Hand off to crafting without briefly resuming movement');
 allowed=false;ui.openGuide();assert(!ui.isPanelOpen(),'Do not stack a handbook over another scene dialog');allowed=true;
 playing=true;nodes.get('backpack-dialog').showModal=()=>{throw Error('unsupported')};ui.openBackpack();assert(playing&&!ui.isPanelOpen(),'Failed modal opening restores prior play state');

 const world=new VoxelWorld(),camp=LANDMARKS.survivalCamp,scene=new THREE.Scene(),life=createLife({scene,world,getPos:()=>camp,getDirection:()=>new THREE.Vector3(1,0,0),notify(){},pause(){},resume(){},onMode(){},onHeld(){},onDeath(){},setDay(){},onProgress(){}});
 let wood=0,stone=0;for(let x=54;x<=145;x++)for(let z=300;z<=358;z++){
  for(let y=26;y<42;y++)if(world.get(x,y,z)===4&&!world.protected(x,y,z)&&[1,2,3,4,5].some(d=>world.get(x,y+d,z)===5))wood++;
  if(Math.hypot(x+.5-camp.x,z+.5-camp.z)<8)for(let y=20;y<26;y++)if(world.get(x,y,z)===3&&!world.protected(x,y,z))stone++;
 }
 assert(wood>=10&&stone>=12,'The actual life island must supply wood and shallow mineable stone');
 for(const [type,x,z]of [['campfire',126,315],['bed',130,315],['planter',134,315]]){assert(!overlaps(world,x+.5,26,z+.5)&&world.get(x,25,z));life.state.held=type;life.place({x,y:26,z});assert.equal(life.state.furniture.at(-1)?.type,type,'The real camp must accept '+type);}
 const inventory=JSON.stringify(life.state.bag),furniture=life.state.furniture.length;nodes.get('settings-mode-toggle').onclick();assert(life.state.survival);assert.equal(nodes.get('survival-toggle').textContent,'切换创造模式');nodes.get('survival-toggle').onclick();assert(!life.state.survival);assert.equal(nodes.get('settings-mode-toggle').textContent,'切换生存模式');assert.equal(JSON.stringify(life.state.bag),inventory);assert.equal(life.state.furniture.length,furniture);
 const near=scene.children.filter(r=>Math.hypot(r.position.x-camp.x,r.position.z-camp.z)<35);
 assert(near.some(r=>r.children.some(m=>m.material?.color?.getHex()===0xeae6d3)),'Sheep must exist near the camp');
 assert(near.some(r=>r.children.some(m=>m.material?.color?.getHex()===0x4d874c)),'Berry bushes must exist near the camp');
 console.log('PASS: inventory categories/selection without material changes, handbook/modal pause and menu safety, crafting handoff, real camp wood/stone/animals/berries and bed/fire/planter placement.');
}finally{globalThis.document=previous;}
