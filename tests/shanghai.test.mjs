import assert from 'node:assert/strict';
import {VoxelWorld,LANDMARKS,BRIDGES,CITY,overlaps,SIZE,WORLD_MIN,WORLD_MAX,trace} from '../game/world.js';
import {riverCenter} from '../game/shanghai-map.js';
const w=new VoxelWorld();
const stand=(x,y,z)=>!overlaps(w,x+.5,y,z+.5)&&overlaps(w,x+.5,y-.1,z+.5);
// Verify continuous bridge walking surfaces, including sloped and diagonal approaches.
for(const b of BRIDGES){let previous;
 for(const p of b.samples){const y=[0,1,-1,2,-2,3,-3].map(d=>p.y+d).find(y=>stand(p.x,y,p.z));assert(y!==undefined,`${b.id}: missing walking surface at ${p.x},${p.z}`);if(previous){assert(Math.abs(y-previous.y)<=1,`${b.id}: step is too tall`);assert(Math.hypot(p.x-previous.x,p.z-previous.z)<=Math.SQRT2);}previous={...p,y};}
}
// Find real walking / one-block jumping routes through the voxel world from the village.
const levels=new Map();for(let x=WORLD_MIN+1;x<WORLD_MAX-1;x++)for(let z=WORLD_MIN+1;z<WORLD_MAX-1;z++){const ys=[];for(let y=23;y<=38;y++)if(stand(x,y,z))ys.push(y);if(ys.length)levels.set((z-WORLD_MIN)*SIZE+x-WORLD_MIN,ys);}
const queue=[{x:75,y:26,z:329}],seen=new Set(['75,26,329']);for(let i=0;i<queue.length;i++){const p=queue[i];for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1]]){const x=p.x+dx,z=p.z+dz;for(const y of levels.get((z-WORLD_MIN)*SIZE+x-WORLD_MIN)||[]){if(y-p.y>1||p.y-y>2)continue;const key=`${x},${y},${z}`;if(!seen.has(key)){seen.add(key);queue.push({x,y,z});}}}}
for(const [name,p]of Object.entries({pearl:LANDMARKS.tower,shanghai:LANDMARKS.shanghai,jinmao:LANDMARKS.jinmao,swfc:LANDMARKS.swfc,bund:LANDMARKS.bund,forest:LANDMARKS.forest,sand:LANDMARKS.desert,mountain:{x:330,y:34,z:75},outer:{x:350,y:30,z:355},camp:LANDMARKS.survivalCamp,park:LANDMARKS.southPark,dock:LANDMARKS.dock})){assert(seen.has(`${Math.floor(p.x)},${p.y},${Math.floor(p.z)}`),`${name} has no land route from the village`);}
// The channel bends around the peninsula and remains water below the main bridge.
assert(riverCenter(48)<riverCenter(8)-10);assert(riverCenter(48)<riverCenter(108)-30);
for(const z of [8,28,60,92])assert(w.surfaceAt(Math.round(riverCenter(z)),z)<15);
assert.equal(w.get(223,24,206),0,'Main span must not dam the river');
assert.equal(w.get(223,30,206),9,'Main bridge deck missing');
assert.equal(w.get(Math.floor(CITY.swfc.x),100,Math.floor(CITY.swfc.z)),0,'SWFC crown opening must be genuinely hollow');
assert.equal(w.get(Math.floor(CITY.swfc.x),103,Math.floor(CITY.swfc.z)),12,'SWFC sky walk needs a floor');
assert.equal(trace(w,{x:CITY.swfc.x-15,y:102,z:CITY.swfc.z},{x:1,y:0,z:0},30),null,'SWFC opening must face west towards the Bund');
assert(CITY.jinmao.x<CITY.swfc.x&&CITY.jinmao.z<CITY.swfc.z);
assert(CITY.shanghai.x<CITY.jinmao.x&&CITY.shanghai.z>CITY.jinmao.z);
assert(Math.hypot(CITY.jinmao.x-CITY.swfc.x,CITY.jinmao.z-CITY.swfc.z)<35,'Trio must remain compact');assert(Math.hypot(CITY.jinmao.x-CITY.shanghai.x,CITY.jinmao.z-CITY.shanghai.z)<35);
console.log('PASS: all bridge approaches, real land routes to five islands and city lobbies, Huangpu bend / clear main span, SWFC opening / sky walk, trio geography.');
