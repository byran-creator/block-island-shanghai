import {VoxelWorld} from './world.js';
import {createWorldBaseline} from './world-baseline.js';
import {loadWorldSnapshot} from './world-snapshot.js';

// Replaced only by the release builder, from this exact generator's bytes.
const PREBUILT_WORLD=null;

// Transfer the existing generator's exact bytes; never make a second main-thread
// copy or send player edits/saves to the worker.
self.onmessage=async({data:request}={})=>{
 try{
  let world,source='generated';
  if(PREBUILT_WORLD&&request?.snapshot!==false){try{world=await loadWorldSnapshot(new URL('./'+PREBUILT_WORLD.file,import.meta.url),PREBUILT_WORLD,{timeoutMilliseconds:2500});source='snapshot';}catch{}}
  if(!world){world=new VoxelWorld();world.baseline=createWorldBaseline(world.data).runs;}
  const transfer=[world.data.buffer,world.surface.buffer];if(world.baseline)transfer.push(world.baseline.ends.buffer,world.baseline.values.buffer);
  self.postMessage({data:world.data,surface:world.surface,baseline:world.baseline,source},transfer);
 }
 catch(error){self.postMessage({error:String(error?.message??error)});}
};
