import {VoxelWorld,SIZE,HEIGHT,WORLD_MIN,WORLD_MAX,BLOCKS,WATER_LEVEL} from './world.js';

// Build the same topmost-voxel map once. Do not substitute terrain.surface:
// roofs, trees and player-built columns may extend above the terrain height.
export function mapBackgroundPixels(world,pixels=new Uint8ClampedArray(SIZE*SIZE*4)){
 const palette=BLOCKS.map(b=>rgb(b?.color??'#46874e')),water=rgb('#236179');palette[5]=rgb('#315b40');
 const dense=world instanceof VoxelWorld&&world.get===VoxelWorld.prototype.get&&world.ground===VoxelWorld.prototype.ground&&world.valid===VoxelWorld.prototype.valid&&world.index===VoxelWorld.prototype.index&&world.data instanceof Uint8Array&&world.data.length===SIZE*SIZE*HEIGHT;
 const plane=SIZE*SIZE;let p=0;
 for(let z=WORLD_MIN;z<WORLD_MAX;z++)for(let x=WORLD_MIN;x<WORLD_MAX;x++){
  let height,id;
  if(dense){let y=HEIGHT-1,at=y*plane+(z-WORLD_MIN)*SIZE+x-WORLD_MIN;while(y>=0&&!world.data[at]){y--;at-=plane;}height=y+1;id=y>=0?world.data[at]:0;}
  else{height=world.ground(x,z);id=world.get(x,height-1,z);}
  const color=height<WATER_LEVEL?water:palette[id]??palette[0];pixels[p++]=color[0];pixels[p++]=color[1];pixels[p++]=color[2];pixels[p++]=255;
 }
 return pixels;
}
function rgb(hex){return [parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];}
