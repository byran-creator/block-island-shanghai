import {Scene,PointLight} from './three.module.js';

// Compile in short idle batches only when the driver exposes a non-blocking
// completion query. Keep shader diagnostics and the actual scene unchanged.
export function startShaderWarmup({renderer,scene,camera,busy=()=>false,yieldTask=()=>new Promise(r=>setTimeout(r,0))}){
 const stats={supported:!!renderer.compile&&Array.isArray(renderer.info?.programs)&&!!renderer.extensions?.has('KHR_parallel_shader_compile'),prepared:0,total:0,cancelled:false,error:null};
 if(!stats.supported)return {stats,done:Promise.resolve(),cancel(){}};
 const selected=new Map();scene.traverse(o=>{if(!(o.isMesh||o.isPoints||o.isLine||o.isSprite)||o.isBatchedMesh||!o.material||!(o.layers.mask&camera.layers.mask))return;const materials=Array.isArray(o.material)?o.material:[o.material];for(const m of materials){const shape=[!!o.isInstancedMesh,!!o.isSkinnedMesh,!!o.isPoints,!!o.isLine,!!o.isSprite,o.geometry?.attributes.color?.itemSize??0,Object.keys(o.geometry?.morphAttributes??{}).join(',')].join(':'),key=m.uuid+':'+shape;if(!selected.has(key))selected.set(key,{object:o,material:m,shape});}});
 const objects=[...selected.values()],common=new Map();for(const entry of objects){const m=entry.material,key=[m.type,!!m.map,m.map?.colorSpace,!!m.vertexColors,m.side,m.transparent,entry.shape].join(':');if(!common.has(key)&&common.size<64)common.set(key,entry);}const front=[...common.values()],frontSet=new Set(front),rest=objects.filter(o=>!frontSet.has(o)),nightSeen=new Set();stats.total=objects.length*2;stats.nightPrepared=0;
 function cancel(){stats.cancelled=true;}
 renderer.domElement?.addEventListener?.('webglcontextlost',cancel,{once:true});
 async function run(){try{
  // Daylight and the existing four local shop lights cover the common cases.
  // Prime common day/night programs before spending time on uniform variants.
  for(const [pointCount,entries]of [[0,front],[4,front],[0,rest],[4,rest]]){let phase=entries;if(pointCount===4&&renderer.properties?.get){const unique=new Map();let known=true;for(const entry of entries){const key=renderer.properties.get(entry.material).currentProgram?.cacheKey;if(!key){known=false;break;}const signature=key+':'+entry.shape;if(!nightSeen.has(signature))unique.set(signature,entry);}if(known){phase=[...unique.values()];for(const key of unique.keys())nightSeen.add(key);}}
  for(let from=0;from<phase.length;from+=64){
   if(stats.cancelled)return;while(busy()&&!stats.cancelled)await new Promise(r=>setTimeout(r,250));if(stats.cancelled)return;
   const subset=new Scene(),extra=[];for(const {object,material}of phase.slice(from,from+64)){const proxy=object.clone(false);proxy.material=material;subset.add(proxy);}
   let points=0;scene.traverseVisible(o=>{if(o.isPointLight&&o.layers.test(camera.layers))points++;});
   for(let i=points;i<pointCount;i++){const light=new PointLight(0xffffff,0);scene.add(light);extra.push(light);}
   try{renderer.compile(subset,camera,scene);}finally{for(const light of extra)light.removeFromParent();}
   // The bundled Three revision exposes its non-blocking KHR readiness check.
   // Own the poll so context loss/cancellation cannot leave a detached timer.
   const started=performance.now();while(!stats.cancelled){const programs=renderer.info.programs;if(programs.some(p=>typeof p.isReady!=='function')){stats.cancelled=true;stats.error='Program readiness unavailable';break;}if(programs.every(p=>p.isReady()))break;if(performance.now()-started>30000){stats.cancelled=true;stats.error='Shader warmup timed out';break;}await new Promise(r=>setTimeout(r,10));}
   if(stats.cancelled)return;stats.prepared+=subset.children.length;if(pointCount===4)stats.nightPrepared+=subset.children.length;subset.clear();await yieldTask();
  }}
 }catch(error){stats.error=String(error?.message??error);}finally{stats.total=stats.prepared;renderer.domElement?.removeEventListener?.('webglcontextlost',cancel);}}
 return {stats,done:run(),cancel};
}
