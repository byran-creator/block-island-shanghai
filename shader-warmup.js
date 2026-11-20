import {Scene} from './three.module.js';

// Compile in short idle batches only when the driver exposes a non-blocking
// completion query. Keep shader diagnostics and the actual scene unchanged.
export function startShaderWarmup({renderer,scene,camera,busy=()=>false,yieldTask=()=>new Promise(r=>setTimeout(r,0))}){
 const stats={supported:!!renderer.compile&&Array.isArray(renderer.info?.programs)&&!!renderer.extensions?.has('KHR_parallel_shader_compile'),prepared:0,total:0,cancelled:false,error:null};
 if(!stats.supported)return {stats,done:Promise.resolve(),cancel(){}};
 const selected=new Map();scene.traverse(o=>{if(!(o.isMesh||o.isPoints||o.isLine||o.isSprite)||o.isBatchedMesh||!o.material||!(o.layers.mask&camera.layers.mask))return;const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){const shape=[!!o.isInstancedMesh,!!o.isSkinnedMesh,!!o.isPoints,!!o.isLine,!!o.isSprite,o.geometry?.attributes.color?.itemSize??0,Object.keys(o.geometry?.morphAttributes??{}).join(',')].join(':'),key=m.uuid+':'+shape;if(!selected.has(key))selected.set(key,{object:o,material:m,shape});}});
 const objects=[...selected.values()],common=new Map();for(const entry of objects){const m=entry.material,key=[m.type,!!m.map,m.map?.colorSpace,!!m.vertexColors,m.side,m.transparent,entry.shape].join(':');if(!common.has(key)&&common.size<64)common.set(key,entry);}const front=[...common.values()],frontSet=new Set(front),rest=objects.filter(o=>!frontSet.has(o));stats.total=objects.length;stats.nightPrepared=0;
 function cancel(){stats.cancelled=true;}
 renderer.domElement?.addEventListener?.('webglcontextlost',cancel,{once:true});
 async function run(){try{
  // Zero real-time point lights cover both day and night without recompilation.
  for(const phase of [front,rest]){
  for(let from=0;from<phase.length;from+=64){
   if(stats.cancelled)return;while(busy()&&!stats.cancelled)await new Promise(r=>setTimeout(r,250));if(stats.cancelled)return;
   const subset=new Scene();for(const {object,material}of phase.slice(from,from+64)){const proxy=object.clone(false);proxy.material=material;subset.add(proxy);}
   renderer.compile(subset,camera,scene);
   // The bundled Three revision exposes its non-blocking KHR readiness check.
   // Own the poll so context loss/cancellation cannot leave a detached timer.
   const started=performance.now();while(!stats.cancelled){const programs=renderer.info.programs;if(programs.some(p=>typeof p.isReady!=='function')){stats.cancelled=true;stats.error='Program readiness unavailable';break;}if(programs.every(p=>p.isReady()))break;if(performance.now()-started>30000){stats.cancelled=true;stats.error='Shader warmup timed out';break;}await new Promise(r=>setTimeout(r,10));}
   if(stats.cancelled)return;stats.prepared+=subset.children.length;stats.nightPrepared=stats.prepared;subset.clear();await yieldTask();
  }}
 }catch(error){stats.error=String(error?.message??error);}finally{stats.total=stats.prepared;renderer.domElement?.removeEventListener?.('webglcontextlost',cancel);}}
 return {stats,done:run(),cancel};
}
