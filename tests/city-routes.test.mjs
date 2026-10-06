import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {VoxelWorld,overlaps,CITY} from '../game/world.js';
import {CAR_ROUTES,ALL_BUILDINGS,BUND_BUILDINGS,BUND_STREETS,roadX,westSpine,WING_BUILDINGS,buildingEntrance,REPLACED_BUILDING_IDS} from '../game/city-layout.js';
import {BUND_SHIFT} from '../game/shanghai-map.js';
import {routePose,bridgeRoadFloor} from '../game/bund.js';
import {nanpuFloor} from '../game/bridge-road.js';
const world=new VoxelWorld();
// Exercise both traffic lanes for a whole lap, including each closing seam and bridge ramp.
for(const route of CAR_ROUTES){const samples=route.samples;
 for(const lane of [-1.55,1.55]){const a=routePose(samples,.01,lane),b=routePose(samples,samples.lengthMeters-.01,lane);assert(Math.hypot(a.x-b.x,a.z-b.z)<.2,`${route.id}: visible jump at loop seam`);
  for(let d=0;d<samples.lengthMeters;d+=.7){const p=routePose(samples,d,lane),x=p.x+.5,z=p.z+.5,y=route.id==='bridge'&&p.z>203&&p.z<210&&p.x>=120&&p.x<=275?bridgeRoadFloor(world,x,z):p.y;
   assert(!overlaps(world,x,Math.ceil(y),z),`${route.id}: vehicle enters a wall at ${x},${z}`);
   let support=route.id==='bridge'&&nanpuFloor(world,x,z)!==null;for(const dx of [-.4,0,.4])for(const dz of [-.4,0,.4])for(const dy of [0,-1])support ||= !!world.get(Math.floor(x+dx),Math.floor(y)-1+dy,Math.floor(z+dz));assert(support,`${route.id}: unsupported road at ${x},${z}`);
  }
 }
}
for(const b of ALL_BUILDINGS){const e=buildingEntrance(b);assert(!overlaps(world,e.x,26,e.z),`${b.id}: blocked lobby entrance`);}
for(const s of BUND_STREETS)for(let x=westSpine(s.z);x<roadX(s.z);x+=.5)assert(!overlaps(world,x,26,s.z+.5),`${s.name}: street blocked by a building`);
const north=BUND_BUILDINGS.find(b=>b.id==='peace'),south=BUND_BUILDINGS.find(b=>b.id==='peace-south'),nanjing=BUND_STREETS.find(s=>s.id==='nanjing');
assert(north.z+north.rz<nanjing.z-nanjing.width&&south.z-south.rz>nanjing.z+nanjing.width);
assert(BUND_BUILDINGS.find(b=>b.id==='bank').z<north.z);
assert(BUND_BUILDINGS.find(b=>b.id==='customs').z<BUND_BUILDINGS.find(b=>b.id==='hsbc').z);
assert(CITY.jinmao.x<CITY.swfc.x&&CITY.jinmao.z<CITY.swfc.z&&CITY.shanghai.x<CITY.jinmao.x&&CITY.shanghai.z>CITY.jinmao.z);
console.log('PASS: complete traffic laps without teleports / wall collisions, bridge ramp support, all city entrances, real street gaps and preserved Shanghai trio geography.');

// The previous city's buildings keep their complete plot data; new land is accessible on both banks.
const oldPlots=JSON.parse(readFileSync(new URL('./city-v13-plots.json',import.meta.url),'utf8'));
for(const old of oldPlots){if(REPLACED_BUILDING_IDS.has(old.id))continue;const next=ALL_BUILDINGS.find(b=>b.id===old.id);for(const field of ['x','z','rx','rz','front','entranceSide','bank'])assert.equal(next[field],old.bank==='west'&&['x','front'].includes(field)?old[field]-BUND_SHIFT:old[field],`Plot migration mismatch: ${old.id} ${field}`);}
assert(WING_BUILDINGS.filter(b=>b.z<0&&b.bank==='east').length>15);
assert(WING_BUILDINGS.filter(b=>b.z<0&&b.bank==='west').length>15);
for(const b of WING_BUILDINGS)assert(world.get(b.x,25,b.z),'New city block lacks land');
