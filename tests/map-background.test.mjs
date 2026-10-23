import assert from 'node:assert/strict';
import {VoxelWorld,SIZE,HEIGHT,WORLD_MIN,WORLD_MAX,BLOCKS,WATER_LEVEL} from '../game/world.js';
import {mapBackgroundPixels} from '../game/map-background.js';

function reference(world){const pixels=new Uint8ClampedArray(SIZE*SIZE*4);let p=0;for(let z=WORLD_MIN;z<WORLD_MAX;z++)for(let x=WORLD_MIN;x<WORLD_MAX;x++){const y=world.ground(x,z),id=world.get(x,y-1,z),hex=y<WATER_LEVEL?'#236179':id===5?'#315b40':BLOCKS[id]?.color??'#46874e';pixels[p++]=parseInt(hex.slice(1,3),16);pixels[p++]=parseInt(hex.slice(3,5),16);pixels[p++]=parseInt(hex.slice(5,7),16);pixels[p++]=255;}return pixels;}
const world=new VoxelWorld(),before=world.data.slice(),expected=reference(world),target=new Uint8ClampedArray(SIZE*SIZE*4);
assert.equal(mapBackgroundPixels(world,target),target,'Write the existing ImageData buffer without allocating a second map');assert.deepEqual(target,expected,'Every released city-map pixel is retained');assert.deepEqual(world.data,before);
// Topmost objects and edits, not terrain.surface, determine the map color.
world.data.fill(0);for(const [x,y,z,id]of [[WORLD_MIN,HEIGHT-1,WORLD_MIN,5],[WORLD_MAX-1,22,WORLD_MAX-1,10],[3,21,5,8],[4,22,5,8],[8,90,9,255]])world.set(x,y,z,id);world.surface.fill(1);assert.deepEqual(mapBackgroundPixels(world),reference(world));
world.set(8,90,9,0);assert.deepEqual(mapBackgroundPixels(world),reference(world),'Removed highest blocks are rescanned, not retained in a top-height cache');
for(const custom of [{ground:()=>30,get:()=>5},{ground:()=>0,get:()=>0}])assert.deepEqual(mapBackgroundPixels(custom),reference(custom));
world.ground=()=>40;world.get=()=>10;assert.deepEqual(mapBackgroundPixels(world),reference(world),'Overridden world interfaces retain their semantics');
console.log(JSON.stringify({passed:true,cityPixels:SIZE*SIZE,exactRGBA:true,emptyAndEditedColumns:true,customWorldFallback:true,reusedImageData:true}));
