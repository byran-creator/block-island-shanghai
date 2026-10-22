import {VoxelWorld} from './world.js';

// Transfer the existing generator's exact bytes; never make a second main-thread
// copy or send player edits/saves to the worker.
self.onmessage=()=>{
 try{const world=new VoxelWorld();self.postMessage({data:world.data,surface:world.surface},[world.data.buffer,world.surface.buffer]);}
 catch(error){self.postMessage({error:String(error?.message??error)});}
};
