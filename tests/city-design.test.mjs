import assert from 'node:assert/strict';
import {VoxelWorld,overlaps} from '../game/world.js';
import {ALL_BUILDINGS,DENSE_BUILDINGS,promenadeX,buildShell} from '../game/city-layout.js';
import {shopSignAnchor,shopPlaqueHalfWidth} from '../game/shop-sign-layout.js';
import {riverCenter,riverWestEdge,riverEastEdge,BRIDGES,migrateWestBankPoint} from '../game/shanghai-map.js';
import {inSuzhou} from '../game/waibaidu-layout.js';
import {buildingStyle} from '../game/city-architecture.js';
import {windowLightGroup,lightGroupVisible} from '../game/city-lighting.js';
import {migrateWestBankSave} from '../game/city-migration.js';
import * as THREE from '../game/three.module.js';
import {createBund} from '../game/bund.js';
const world=new VoxelWorld();
// Check the entire excavated strip, not just the old channel's center.
for(let z=-140;z<=234;z++){
 if(z>=187&&z<=213)continue; // Raised bridge approaches and pylons.
 const west=Math.ceil(riverWestEdge(z)),east=Math.floor(riverEastEdge(z));
 assert(east-west+1>=83,'River must be visibly wider than the old 18–19 voxel channel');
 for(let x=west;x<riverCenter(z)-9;x++){
  if(BRIDGES.some(b=>b.samples.some(p=>Math.abs(x-p.x)<=b.width+1&&Math.abs(z-p.z)<=b.width+1)))continue;
  for(let y=18;y<=25;y++)assert.equal(world.get(x,y,z),0,`New river strip obstructed at ${x},${y},${z}`);
 }
 const p=promenadeX(z);if(inSuzhou(Math.floor(p-4.5),z))continue; // New Suzhou mouth: walk across Waibaidu instead.
 assert(!overlaps(world,p-5+.5,26,z+.5)&&overlaps(world,p-5+.5,25.9,z+.5),'West-bank promenade must remain supported and walkable');
}
// Old promenade saves follow the west shore and remain on dry land.
for(const z of [28,60,84,108]){const point={x:Math.round(riverCenter(z)-12)-10.5,z:z+.5};migrateWestBankPoint(point);const x=point.x;assert(!overlaps(world,x,26,z+.5)&&overlaps(world,x,25.9,z+.5));}
// Compare actual generated silhouettes/materials, without moving any plot coordinates.
function shellSignature(b){const cells=new Map(),w={set(x,y,z,id){cells.set(`${x-b.x},${y},${z-b.z}`,id);},fill(x,y,z,xx,yy,zz,id){for(let a=x;a<=xx;a++)for(let c=z;c<=zz;c++)for(let level=y;level<=yy;level++)this.set(a,level,c,id);}};buildShell(w,b);return [...cells].filter(([,id])=>id).map(([key,id])=>key+':'+id).join(';');}
for(const bank of ['west','east']){
 const blocks=ALL_BUILDINGS.filter(b=>b.bank===bank&&/back|infill|front/.test(b.id));
 const sample=blocks.filter(b=>b.rx===5&&b.rz===5).slice(0,25);
 assert(new Set(sample.map(b=>shellSignature({...b,h:24}))).size>=10,`${bank}: repeated generated building shells at the same height`);
 assert(blocks.some(b=>buildingStyle(b).form==='setback'||buildingStyle(b).form==='terrace'));
}
const historic=ALL_BUILDINGS.filter(b=>b.bank==='west'&&/back|infill/.test(b.id)&&b.kind!=='glass');
assert(historic.some(b=>buildingStyle(b).height<=10),'Rear streets need low-rise buildings among the taller blocks');
const rear=ALL_BUILDINGS.filter(b=>b.bank==='west'&&/back|infill/.test(b.id));
const mean=bs=>bs.reduce((n,b)=>n+buildingStyle(b).height,0)/bs.length;
assert(Math.abs(mean(rear.filter(b=>b.z<0))-mean(rear.filter(b=>b.z>=0)))<6,'North and south rear blocks must not split into high-rise and low-rise halves');
for(const north of [true,false])assert(rear.some(b=>(b.z<0)===north&&buildingStyle(b).height>=30));
for(const id of ['ifc-mall','jinmao-podium','swfc-podium','pudong-infill-southeast-1','pudong-infill-southeast-2'])assert(ALL_BUILDINGS.some(b=>b.id===id));
// Test a full old snapshot: construction and chest contents follow the translated shore.
const old={mapRevision:7,pos:{x:32.5,y:26,z:84.5},edits:[['-149,26,-50',7],['260,26,110',4],['45,26,329',7]],life:{furniture:[{type:'chest',x:32.5,y:26,z:84.5,storage:{7:23}}],home:{x:32.5,y:26,z:84.5}}};
const moved=migrateWestBankSave(old);assert.equal(old.pos.x,32.5);assert.equal(moved.pos.x,-23.5);assert.equal(moved.life.home.x,-23.5);assert.equal(moved.life.furniture[0].storage[7],23);assert.deepEqual(moved.edits,[['-205,26,-50',7],['260,26,110',4],['45,26,329',7]]);
assert.equal(migrateWestBankSave({...moved,mapRevision:11}).pos.x,-23.5,'Current saves must not migrate twice');
for(const kind of ['glass','hotel','mall','brick']){
 const groups=Array.from({length:400},(_,i)=>windowLightGroup({id:'test-'+kind,kind,bank:kind==='brick'?'west':'east'},Math.floor(i/10),i%10,'x:1'));
 assert.deepEqual(groups,Array.from({length:400},(_,i)=>windowLightGroup({id:'test-'+kind,kind,bank:kind==='brick'?'west':'east'},Math.floor(i/10),i%10,'x:1')));
 assert(groups.every(g=>!lightGroupVisible(g,false,140)));
 const evening=groups.filter(g=>lightGroupVisible(g,true,140)).length,late=groups.filter(g=>lightGroupVisible(g,true,200)).length;
 assert(evening>60&&evening<320,`${kind}: night windows should have both lit and dark rooms`);assert(late<evening,`${kind}: occupancy should fall after midnight`);
}
const shoppingBuilding={id:'nanjing-test',kind:'baroque',bank:'west',entranceSide:1};
const shoppingGroups=Array.from({length:400},(_,i)=>windowLightGroup(shoppingBuilding,5,i,'z:1:5')),backGroups=Array.from({length:400},(_,i)=>windowLightGroup(shoppingBuilding,5,i,'z:-1:-5'));
for(const [floor,face]of [[9,'z:1:5'],[5,'z:-1:-5'],[5,'x:1:5']])assert(windowLightGroup(shoppingBuilding,floor,1,face).startsWith('home:'),'Upper floors and non-shopping faces retain residential occupancy');
const litAt=t=>shoppingGroups.filter(g=>lightGroupVisible(g,true,t)).length;
assert(litAt(165)>backGroups.filter(g=>lightGroupVisible(g,true,165)).length,'Trading floors need more occupied windows than back-of-building rooms');
assert(litAt(165)>litAt(200)&&litAt(140)<400,'Trading floors quieten after midnight without an identical all-lit grid');
assert(shoppingGroups.every(g=>!lightGroupVisible(g,false,36)));
// Exercise real static batching: dark windows must not join a globally visible night batch.
const savedDocument=globalThis.document;
globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},clearRect(){},save(){},restore(){},translate(){},scale(){},rotate(){},fill(){},closePath(){},fillText(){},beginPath(){},arc(){},stroke(){},moveTo(){},lineTo(){}})})};
try{
 const scene=new THREE.Scene(),civil=createBund({scene,world,getPos:()=>({x:0,y:26,z:84})});
 const example=DENSE_BUILDINGS.find(b=>b.id==='nanjing-infill-1--113'),anchor=shopSignAnchor(example,31),gap=shopPlaqueHalfWidth(example,anchor.width);let checked=0;
 for(const mesh of civil.windows){const p=mesh.geometry.attributes.position;for(let i=0;i+3<p.count;i+=4){let x=0,y=0,z=0;for(let j=0;j<4;j++){x+=p.getX(i+j);y+=p.getY(i+j);z+=p.getZ(i+j);}x/=4;y/=4;z/=4;if(Math.abs(y-31)<.01&&Math.abs(z-(anchor.z+example.entranceSide*.125))<.02&&Math.abs(x-(example.x+.5))<example.rx){assert(Math.abs(x-anchor.x)>=gap+.4,'Upper shop window must not sit behind its plaque');checked++;}}}
 assert(checked>0,'The photographed storefront retains visible windows beside its sign');
 const bounce=new Set();scene.traverse(o=>{if(o.material?.name==='nanjing-stone-bounce')bounce.add(o.material);});
 assert(bounce.size>0&&bounce.size<16,'Shopping bounce must reuse a small set of stone materials');
 assert([...bounce].every(m=>m.map===m.emissiveMap),'Bounce keeps the existing stone texture');
 const groundMaterials=new Set();scene.traverse(o=>{if(o.material?.name==='nanjing-stone-bounce'&&o.geometry?.attributes.position){const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++)if(p.getY(i)>=26&&p.getY(i)<=30){groundMaterials.add(o.material);break;}}});
 assert(groundMaterials.size>0,'Ground-floor shopping walls participate in the night glow');
 const shoppingWash=civil.goldSurfaces.filter(m=>m.material?.name==='nanjing-facade-wash');assert.equal(shoppingWash.length,1,'Street-facing wash remains one merged draw batch');assert(shoppingWash[0].material.transparent&&!shoppingWash[0].material.depthWrite,'Night wash keeps the underlying facade visible');
 assert(civil.windows.length<130,'Occupancy batching must keep draw calls bounded');
 assert(civil.windows.every(m=>m.parent===scene),'Night visibility must control the actual merged meshes');
 civil.tick(0,{night:true,dayClock:140});assert(civil.windows.some(m=>m.visible)&&civil.windows.some(m=>!m.visible));
 assert([...bounce].every(m=>m.emissiveIntensity===.36));
 assert(shoppingWash[0].visible,'Shopping facade wash is on at night');
 const roomCount=()=>civil.windows.filter(m=>m.visible).reduce((n,m)=>n+m.geometry.attributes.position.count/4,0),evening=roomCount();
 civil.tick(0,{night:true,dayClock:200});assert(roomCount()<evening);
 civil.tick(0,{night:false,dayClock:36});assert(civil.windows.every(m=>!m.visible));
 assert([...bounce].every(m=>m.emissiveIntensity===0),'Night bounce must be completely off in daylight');
 assert(!shoppingWash[0].visible,'Shopping facade wash is off in daylight');
}finally{globalThis.document=savedDocument;}
console.log('PASS: broad navigable river, shore/save migration, southeast infill, balanced Bund massing, sparse stable night occupancy and real merged-mesh visibility.');
