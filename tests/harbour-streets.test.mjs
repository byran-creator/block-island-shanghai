import assert from 'node:assert/strict';
import {VoxelWorld,overlaps,LANDMARKS} from '../game/world.js';
import {WAIBAIDU,inSuzhou} from '../game/waibaidu-layout.js';
import {riverWestEdge} from '../game/shanghai-map.js';
import {ALL_BUILDINGS,DENSE_BUILDINGS,CAR_ROUTES,ROADS} from '../game/city-layout.js';
import {routePose} from '../game/bund.js';
import {nanpuFloor} from '../game/bridge-road.js';
import {shopSignAnchor} from '../game/shop-sign-layout.js';
import {PRIVATE_SUITES,suiteArrival} from '../game/private-suite-layout.js';
import {createJunctionControl} from '../game/traffic-junctions.js';

const world=new VoxelWorld(),b=WAIBAIDU;
assert(inSuzhou(b.x,b.z)&&b.x<riverWestEdge(b.z),'Waibaidu must cross Suzhou River west of Huangpu');
assert(b.south<ALL_BUILDINGS.find(p=>p.id==='peace').z,'Bridge belongs north of the Bund');
for(let z=b.north;z<=b.south;z++)for(const dx of [-5,-2.2,2.2,5]){
 const x=b.x+.5+dx;
 assert(!overlaps(world,x,26,z+.5),'Bridge deck and both footpaths must be walkable');
 assert(world.get(Math.floor(x),25,z),'Bridge needs a solid, level deck');
}
assert(!overlaps(world,LANDMARKS.waibaidu.x,26,LANDMARKS.waibaidu.z));
const suite=PRIVATE_SUITES.find(s=>s.id==='tomson-suite'),tower=ALL_BUILDINGS.find(p=>p.id==='pudong-infill-southeast-2'),arrival=suiteArrival(suite);
assert(tower.h+26>suite.y+4&&tower.rx>=suite.rx&&tower.rz>=suite.rz,'Suite must fit inside the residential tower');
for(let y=26;y<suite.y;y++)assert(world.get(tower.x+tower.rx,y,tower.z+tower.rz),'Tower must extend continuously down to ground');
assert(!overlaps(world,arrival.x,arrival.y,arrival.z)&&overlaps(world,arrival.x,arrival.y-.1,arrival.z));
for(const shop of DENSE_BUILDINGS.filter(p=>p.id.startsWith('nanjing-')))for(const y of [30.3,32.5,33.5,34.5,35.5,25.3+shop.h]){
 const p=shopSignAnchor(shop,y);
 assert(world.get(Math.floor(p.x),Math.floor(y),Math.floor(p.z-shop.entranceSide*.08)),`${shop.id}: sign floats away from the actual wall at ${y}`);
}
assert(ROADS.every(r=>r.width>=4),'Carriageways must accommodate two full-width lanes');
for(const r of CAR_ROUTES)for(const lane of [-2.2,2.2])for(let d=0;d<r.samples.lengthMeters;d+=.7){
 const p=routePose(r.samples,d,lane);p.x+=.5;p.z+=.5;if(r.id==='bridge')p.y=nanpuFloor(world,p.x,p.z)??p.y;
 const width=['bund','pudong'].includes(r.id)?.93:.72,length=['bund','pudong'].includes(r.id)?2.45:1.32;
 for(const u of [-width,0,width])for(const v of [-length,0,length]){
  const x=p.x+u*Math.cos(p.yaw)+v*Math.sin(p.yaw),z=p.z-u*Math.sin(p.yaw)+v*Math.cos(p.yaw),h=nanpuFloor(world,x,z),y=h!==null&&Math.abs(h-p.y)<1.5?Math.ceil(h):p.y;
  assert(!world.get(Math.floor(x),Math.floor(y),Math.floor(z))&&!world.get(Math.floor(x),Math.floor(y)+1,Math.floor(z)),`${r.id}: full vehicle body clips roadside at ${x.toFixed(1)},${z.toFixed(1)}`);
 }
}
const control=createJunctionControl([[0,0]]),a={kind:'bus',trafficId:0,root:{position:{x:0,z:12}}},c={kind:'car',trafficId:1,root:{position:{x:12,z:0}}};
control.update([a,c]);assert(control.permits(a,{x:0,z:5}));assert(!control.permits(c,{x:8,z:0}),'Joining vehicle must yield before bodies meet');
a.root.position.z=-15;control.update([a,c]);assert(control.permits(c,{x:5,z:0}),'Reservation must release after the first vehicle clears');
console.log('PASS: Waibaidu geography/solid footpaths, grounded Tomson suite, attached neon, two full vehicle lanes and merge release.');
