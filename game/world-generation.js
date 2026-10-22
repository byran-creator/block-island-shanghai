import {VoxelWorld,SIZE,HEIGHT} from './world.js';

export async function generateWorld(createWorker=()=>new Worker(new URL('./world-worker.js',import.meta.url),{type:'module'})){
 let worker,timer;
 try{
  worker=createWorker();
  const record=await new Promise((resolve,reject)=>{
   timer=setTimeout(()=>reject(new Error('World worker timed out')),120000);
   const finish=(fn,value)=>{clearTimeout(timer);fn(value);};
   worker.onmessage=({data})=>data?.error?finish(reject,new Error(data.error)):finish(resolve,data);
   worker.onerror=event=>{event.preventDefault?.();finish(reject,new Error('World worker unavailable'));};
   worker.onmessageerror=()=>finish(reject,new Error('Invalid worker message'));
   worker.postMessage({generate:true});
  });
  if(!(record?.data instanceof Uint8Array)||record.data.length!==SIZE*SIZE*HEIGHT||!(record.surface instanceof Uint16Array)||record.surface.length!==SIZE*SIZE)throw new Error('Invalid generated world');
  const world=new VoxelWorld({...record,generate:false});world.generationWorker=true;return world;
 }catch{
  worker?.terminate();worker=null;
  // Older WebViews or blocked module workers retain the same map generator.
  await new Promise(resolve=>setTimeout(resolve,0));const world=new VoxelWorld();world.generationWorker=false;return world;
 }finally{clearTimeout(timer);worker?.terminate();}
}
