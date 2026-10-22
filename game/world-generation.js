import {VoxelWorld,SIZE,HEIGHT} from './world.js';
import {validBaselineRuns} from './world-baseline.js';
import {loadWorldSnapshot} from './world-snapshot.js';

// The release builder pins the default map independently of player saves.
export const WORLD_BUILD_ID=null;
export const WORLD_SNAPSHOT=null;

export async function generateWorld(createWorker=()=>new Worker(new URL('./world-worker.js',import.meta.url),{type:'module'}),{snapshot=true}={}){
 let attemptedSnapshot=false;
 // The small packed asset needs no second copy of the city's module graph.
 // Native asynchronous decompression precedes one bounded lossless expansion.
 if(snapshot&&WORLD_SNAPSHOT){
  attemptedSnapshot=true;
  try{const record=await loadWorldSnapshot(new URL('./'+WORLD_SNAPSHOT.file,import.meta.url),WORLD_SNAPSHOT,{timeoutMilliseconds:2500}),world=new VoxelWorld({...record,generate:false});world.baseline=record.baseline;world.generationWorker=false;world.generationSource='snapshot';return world;}catch{}
 }
 let worker,timer;
 try{
  worker=createWorker();
  const record=await new Promise((resolve,reject)=>{
   timer=setTimeout(()=>reject(new Error('World worker timed out')),120000);
   const finish=(fn,value)=>{clearTimeout(timer);fn(value);};
   worker.onmessage=({data})=>data?.error?finish(reject,new Error(data.error)):finish(resolve,data);
   worker.onerror=event=>{event.preventDefault?.();finish(reject,new Error('World worker unavailable'));};
   worker.onmessageerror=()=>finish(reject,new Error('Invalid worker message'));
   worker.postMessage({generate:true,snapshot:snapshot&&!attemptedSnapshot});
  });
  if(!(record?.data instanceof Uint8Array)||record.data.length!==SIZE*SIZE*HEIGHT||!(record.surface instanceof Uint16Array)||record.surface.length!==SIZE*SIZE)throw new Error('Invalid generated world');
  const world=new VoxelWorld({...record,generate:false});world.generationWorker=true;world.generationSource=record.source??'generated';if(validBaselineRuns(record.baseline,world.data.length))world.baseline=record.baseline;return world;
 }catch{
  worker?.terminate();worker=null;
  // Older WebViews or blocked module workers retain the same map generator.
  await new Promise(resolve=>setTimeout(resolve,0));const world=new VoxelWorld();world.generationWorker=false;return world;
 }finally{clearTimeout(timer);worker?.terminate();}
}
