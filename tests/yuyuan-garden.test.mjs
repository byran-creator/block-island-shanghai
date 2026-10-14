import assert from 'node:assert/strict';
import * as THREE from '../game/three.module.js';
import {VoxelWorld,overlaps} from '../game/world.js';
import {createYuyuan} from '../game/yuyuan.js';
import {createRiverWaterGeometry} from '../game/yuyuan-water.js';
import {INNER_GARDEN_PATH,INNER_GARDEN_EAST_PATH,INNER_GARDEN_BOUNDARY,GARDEN_PONDS,YUYUAN_SHIFT} from '../game/yuyuan-layout.js';
const nodes=new Map(),ctx=new Proxy({},{get:()=>()=>{}}),node=()=>({children:[],appendChild(c){this.children.push(c);},replaceChildren(){this.children=[];},addEventListener(){},showModal(){this.open=true;},close(){this.open=false;},getContext:()=>ctx});
const before=globalThis.document;globalThis.document={createElement:node,getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id);}};
try{
 const world=new VoxelWorld(),scene=new THREE.Scene(),p={x:-35,y:26,z:253},events=[],state={health:20,hunger:20,food:0};
 const district=createYuyuan({scene,world,getPos:()=>p,getState:()=>state,notify(){},pause(){},resume(){},onEvent:e=>events.push(e)});
 const collides=(x,z,y=26)=>overlaps(world,x,y,z)||district.collides(x,y,z);
 assert(collides(-35,254.5),'Closed ticket gate must prevent walking through');
 assert(district.use());let buttons=nodes.get('yuyuan-actions').children;assert(buttons[1].disabled);buttons[0].onclick();buttons=nodes.get('yuyuan-actions').children;assert(!buttons[0].disabled);buttons[0].onclick();
 function walk(points){district.tick(0);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.1);for(let j=0;j<=n;j++){Object.assign(p,{x:a[0]+(b[0]-a[0])*j/n,z:a[1]+(b[1]-a[1])*j/n+YUYUAN_SHIFT});assert(world.get(Math.floor(p.x),25,Math.floor(p.z)),'Curved route has no floor');assert(!collides(p.x,p.z),'Gate/path obstructed at '+p.x+','+p.z);district.tick(.01);}}}
 walk([[-35,193],[-35,196]]);assert(district.gates.entered);assert.equal(events.filter(e=>e.type==='yuyuan-entry').length,1);
 district.gates.open(district.gates.gates.find(e=>e.id==='west'));walk(INNER_GARDEN_PATH.slice(1));
 // Leave through the other gate; a permit for one visit must not survive exit.
 walk([[-75,205],[-76,205]]);assert(!district.gates.ticket);assert(!district.gates.entered);
 district.tick(9);assert(collides(-74.5,265));
 assert(district.collides(-33,26,254.5),'Player cannot squeeze through the lower curved edge');
 assert(district.collides(-46,26,268.5),'Round window cannot become a walk-through rectangular hole');
 Object.assign(p,{x:-73,y:26,z:265});district.restore({});assert(district.use());assert.equal(nodes.get('yuyuan-actions').children[0].textContent,'开闸离园');nodes.get('yuyuan-actions').children[0].onclick();assert(!collides(-74.5,265),'Legacy player inside can always exit without a ticket');
 district.gates.claim();const saved=district.serialize();district.restore(saved);assert.deepEqual(district.serialize(),saved);assert(collides(-74.5,265),'Restore closes ephemeral door openings');
 assert.equal(district.crowd.people.length,65,'62 public-area visitors and only three independent inner-garden walkers');
 const area=Math.abs(INNER_GARDEN_BOUNDARY.reduce((sum,a,i)=>{const b=INNER_GARDEN_BOUNDARY[(i+1)%INNER_GARDEN_BOUNDARY.length];return sum+a[0]*b[1]-a[1]*b[0];},0))/2;assert(area>=644*1.9,'Inner garden did not approximately double');
 walk(INNER_GARDEN_EAST_PATH);
 assert.equal(district.streetArt.shops.length,9);for(const shop of district.streetArt.shops){Object.assign(p,{x:shop.x,y:26,z:shop.z+YUYUAN_SHIFT});district.tick(21);assert(district.use(),'Cannot use new indoor shop '+shop.title);nodes.get('yuyuan-actions').children[0].onclick();assert.equal(district.streetArt.goods[shop.key].filter(g=>g.visible).length,5,'Purchase removes one actual display');district.close();}
 const inventorySave=district.serialize();district.restore(inventorySave);assert.deepEqual(district.serialize(),inventorySave,'New shop stocks and collectibles must persist');
 for(let i=0;i<2400;i++)district.tick(.1);const stalled=district.crowd.people.filter(a=>a.travel<=35||a.wait>=10);if(stalled.length)console.log(JSON.stringify(stalled.slice(0,4).map(a=>{const q=a.pose(a.d+a.speed*.1);return {inner:a.inner,travel:a.travel,wait:a.wait,x:a.root.position.x,z:a.root.position.z,next:q,blocked:collides(q.x,q.z),others:district.crowd.people.filter(b=>b!==a&&Math.hypot(q.x-b.root.position.x,q.z-b.root.position.z)<.65).map(b=>({x:b.root.position.x,z:b.root.position.z,yaw:b.pose(b.d).yaw}))};})));assert.equal(stalled.length,0,'New crowd must actually move rather than pile up');for(const a of district.crowd.people)assert(!collides(a.root.position.x,a.root.position.z),'New crowd walks through garden walls');
 const surfaces=[...district.waterArt.dynamicRoots].filter(m=>m.name==='yuyuan-clear-pond');assert.equal(surfaces.length,3);assert(surfaces.every(m=>m.material.opacity<.45&&!m.material.depthWrite));
 const bodies=[...district.waterArt.dynamicRoots].find(m=>m.name==='yuyuan-koi-bodies'),matrix=new THREE.Matrix4();assert.equal(bodies.count,20);
 for(let frame=0;frame<600;frame++){district.waterArt.tick(.1);for(let i=0;i<bodies.count;i++){bodies.getMatrixAt(i,matrix);assert(matrix.elements.every(Number.isFinite));const [x,y,z]=[matrix.elements[12],matrix.elements[13],matrix.elements[14]];assert(GARDEN_PONDS.some(q=>x>q.x1&&x<q.x2&&z>q.z1&&z<q.z2));assert(y>21&&y<22.25);assert(!world.get(Math.floor(x),22,Math.floor(z+YUYUAN_SHIFT)),'Fish is buried in a foundation or pier');}}
 const geometry=createRiverWaterGeometry({size:1000,centerX:0,centerZ:0,ponds:GARDEN_PONDS,shift:YUYUAN_SHIFT}),positions=geometry.attributes.position,index=geometry.index;
 function covered(x,z){const y=-z,cross=(ax,ay,bx,by,cx,cy)=>(bx-ax)*(cy-ay)-(by-ay)*(cx-ax);for(let i=0;i<(index?.count??positions.count);i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j),v=ids.map(j=>[positions.getX(j),positions.getY(j)]),s=v.map((a,j)=>cross(...a,...v[(j+1)%3],x,y));if(s.every(n=>n>=-1e-6)||s.every(n=>n<=1e-6))return true;}return false;}
 assert(covered(0,0),'Huangpu river must remain intact');for(const q of GARDEN_PONDS)for(let i=1;i<8;i++)for(let j=1;j<8;j++)assert(!covered(q.x1+(q.x2-q.x1)*i/8,q.z1+YUYUAN_SHIFT+(q.z2-q.z1)*j/8),'River overlaps the clear garden pond');
 console.log('PASS: doubled inner garden, nine stocked indoor shops, 65 independent walkers, ticket entry/exit/legacy saves, round frames, both curved routes, 20 koi and river holes.');
}finally{globalThis.document=before;}
