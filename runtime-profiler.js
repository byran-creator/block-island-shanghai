// Developer-only, coarse-grained sampling. CPU wall time includes driver waits;
// it is never presented as GPU time. No timers, uploads or scene changes here.
const distribution=values=>{if(!values.length)return {median:0,p95:0,p99:0,max:0};values.sort((a,b)=>a-b);const at=p=>values[Math.min(values.length-1,Math.floor(values.length*p))];return {median:at(.5),p95:at(.95),p99:at(.99),max:values.at(-1)};};

export function createGpuTimer(gl,{capacity=120,maxPending=4,every=8,maxAge=240}={}){
 let ext=null,active=null,lost=false,disposed=false,serial=0,count=0,skipped=0,disjoint=0,errors=0,reason=null;
 const pending=[],values=new Float64Array(capacity);
 try{ext=gl?.getExtension?.('EXT_disjoint_timer_query_webgl2');if(!ext)reason='extension-unavailable';}catch{reason='extension-query-failed';}
 function remove(query){try{if(!lost&&!gl.isContextLost?.())gl.deleteQuery(query);}catch{errors++;}}
 function clear(){if(active){try{if(!lost&&!gl.isContextLost?.())gl.endQuery(ext.TIME_ELAPSED_EXT);}catch{}remove(active.query);active=null;}for(const p of pending)remove(p.query);pending.length=0;}
 function invalidate(){lost=true;clear();reason='context-lost';}
 function poll(frame){
  if(!ext||lost||disposed||!pending.length)return;
  try{
   if(gl.isContextLost?.()){invalidate();return;}
   if(gl.getParameter(ext.GPU_DISJOINT_EXT)){disjoint+=pending.length;clear();return;}
   for(let i=0;i<pending.length;){const p=pending[i],available=gl.getQueryParameter(p.query,gl.QUERY_RESULT_AVAILABLE);if(available){const ns=gl.getQueryParameter(p.query,gl.QUERY_RESULT);if(Number.isFinite(ns)&&ns>=0){values[count++%capacity]=ns/1e6;}else errors++;remove(p.query);pending.splice(i,1);}else if(frame-p.frame>maxAge){skipped++;remove(p.query);pending.splice(i,1);}else i++;}
  }catch{errors++;clear();reason='query-failed';ext=null;}
 }
 return {poll,begin(frame){
  if(!ext||lost||disposed||active||frame%every)return false;
  poll(frame);if(!ext||lost)return false;
  if(pending.length>=maxPending){skipped++;return false;}
  try{if(gl.isContextLost?.()){invalidate();return false;}if(gl.getQuery(ext.TIME_ELAPSED_EXT,gl.CURRENT_QUERY)){skipped++;return false;}const query=gl.createQuery();if(!query){skipped++;return false;}active={query,frame,id:serial++};gl.beginQuery(ext.TIME_ELAPSED_EXT,query);return true;}catch{errors++;clear();reason='query-failed';ext=null;return false;}
 },end(){if(!active)return;try{gl.endQuery(ext.TIME_ELAPSED_EXT);pending.push(active);active=null;}catch{errors++;clear();reason='query-failed';ext=null;}},invalidate,report(){return {supported:!!ext&&!lost,reason,samples:Math.min(count,capacity),milliseconds:distribution([...values.slice(0,Math.min(count,capacity))]),pending:pending.length,skipped,disjoint,errors};},reset(){clear();count=skipped=disjoint=errors=0;},dispose(){clear();disposed=true;}};
}

export function createRuntimeProfiler({gl,now=()=>performance.now(),capacity=300,gpuOptions}={}){
 const channels=[],restores=[],stack=[];let depth=0,cursor=0,count=0,serial=0,capturing=false,disposed=false,gpu=createGpuTimer(gl,gpuOptions);
 function watch(object,key,label,{gpuRender=false}={}){
  if(!object||typeof object[key]!=='function')return;
  const original=object[key],channel={label,total:0,self:0,calls:0,totalRing:new Float64Array(capacity),selfRing:new Float64Array(capacity),callRing:new Uint32Array(capacity)};channels.push(channel);
  const wrapped=function(...args){
   if(!capturing)return original.apply(this,args);
   const entry=stack[depth]??(stack[depth]={});entry.start=now();entry.child=0;depth++;channel.calls++;
   const timed=gpuRender&&gpu.begin(serial);
   try{return original.apply(this,args);}finally{if(timed)gpu.end();const elapsed=now()-entry.start;channel.total+=elapsed;channel.self+=Math.max(0,elapsed-entry.child);depth--;if(depth)stack[depth-1].child+=elapsed;}
  };
  try{object[key]=wrapped;}catch{channels.pop();return false;}restores.push(()=>{if(object[key]===wrapped)object[key]=original;});return true;
 }
 return {watch,begin(){if(disposed)return;gpu.poll(serial);for(const c of channels)c.total=c.self=c.calls=0;capturing=true;},end(){if(!capturing)return;capturing=false;for(const c of channels){c.totalRing[cursor]=c.total;c.selfRing[cursor]=c.self;c.callRing[cursor]=c.calls;}cursor=(cursor+1)%capacity;count++;serial++;},pause(){capturing=false;},reset(){capturing=false;count=cursor=serial=0;gpu.reset();},contextLost(){capturing=false;gpu.invalidate();},contextRestored(){gpu.dispose();gpu=createGpuTimer(gl,gpuOptions);},report(){const n=Math.min(count,capacity);return {note:'Nested CPU channels are inclusive; self excludes measured child calls. render still includes driver waits. CPU and GPU may overlap; do not add them.',frames:n,cpu:Object.fromEntries(channels.map(c=>[c.label,{wallMilliseconds:distribution([...c.totalRing.slice(0,n)]),selfMilliseconds:distribution([...c.selfRing.slice(0,n)]),calls:[...c.callRing.slice(0,n)].reduce((a,b)=>a+b,0)}])),gpu:gpu.report()};},dispose(){capturing=false;disposed=true;for(const restore of restores.reverse())restore();restores.length=0;gpu.dispose();}};
}
