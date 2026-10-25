import {createRuntimeProfiler} from './runtime-profiler.js';

export function createFrameMeter(capacity=300){
 const intervals=new Float32Array(capacity),work=new Float32Array(capacity);let count=0,cursor=0,last=null;
 const summary=values=>{const a=[...values.slice(0,Math.min(count,capacity))].sort((a,b)=>a-b);return {median:a[Math.floor(a.length*.5)]??0,p95:a[Math.floor(a.length*.95)]??0,p99:a[Math.min(a.length-1,Math.floor(a.length*.99))]??0,max:a.at(-1)??0};};
 return {reset(){count=0;cursor=0;last=null;},pause(){last=null;},sample(now,cpu){if(last!==null){intervals[cursor]=now-last;work[cursor]=cpu;cursor=(cursor+1)%capacity;count++;}last=now;},report(){const n=Math.min(count,capacity),frames=summary(intervals);return {samples:n,frameMilliseconds:frames,frameWorkMilliseconds:summary(work),fps:frames.median?1000/frames.median:0,framesOver100ms:[...intervals.slice(0,n)].filter(x=>x>100).length};}};
}

// Opt-in only: the normal game has no new overlay, network upload or timer.
export function createPerformanceProbe({renderer,profile,bootMs,subjects=[]}){
 if(typeof location==='undefined'||!/[?&]perf=1(?:&|$)/.test(location.search??''))return null;
 const meter=createFrameMeter(),runtime=createRuntimeProfiler({gl:renderer.getContext?.()}),longTasks=[];let observer,next=0;
 for(const [object,key,label]of subjects)runtime.watch(object,key,label);
 runtime.watch(renderer,'render','render',{gpuRender:true});
 const gl=renderer.getContext?.();for(const key of ['texImage2D','texSubImage2D','compressedTexImage2D','compileShader','linkProgram','bufferData','bufferSubData'])runtime.watch(gl,key,key);
 const pauseMeter=()=>{meter.pause();runtime.pause();};document.addEventListener('visibilitychange',pauseMeter);
 const lost=()=>{pauseMeter();runtime.contextLost();},restored=()=>runtime.contextRestored();renderer.domElement.addEventListener('webglcontextlost',lost);renderer.domElement.addEventListener('webglcontextrestored',restored);
 try{observer=new PerformanceObserver(list=>{for(const e of list.getEntries()){longTasks.push({at:e.startTime,ms:e.duration});if(longTasks.length>100)longTasks.shift();}});observer.observe({type:'longtask',buffered:true});}catch{}
 const panel=document.createElement('aside'),text=document.createElement('div'),reset=document.createElement('button'),copy=document.createElement('button'),hide=document.createElement('button');
 panel.style.cssText='position:fixed;right:8px;bottom:8px;z-index:9999;max-width:300px;background:#112d36eb;color:#fff;padding:10px;border:1px solid #d6c995;font:12px/1.6 sans-serif;white-space:pre-line';
 reset.textContent='重新采样';copy.textContent='复制报告';hide.textContent='收起';panel.append(text,reset,copy,hide);document.body.append(panel);
 const report=()=>({version:2,device:navigator.userAgent,viewport:[innerWidth,innerHeight],quality:profile(),canvas:[renderer.domElement.width,renderer.domElement.height],antialias:renderer.getContext?.().getContextAttributes?.()?.antialias??null,bootMilliseconds:bootMs,...meter.report(),drawCalls:renderer.info?.render.calls,triangles:renderer.info?.render.triangles,resources:{...renderer.info?.memory,programs:renderer.info?.programs?.length},runtime:runtime.report(),longTasks:[...longTasks]});
 reset.onclick=()=>{meter.reset();runtime.reset();longTasks.length=0;text.textContent='正在采样 · 请移动并转动视角';};hide.onclick=()=>{panel.hidden=true;pauseMeter();};
 copy.onclick=async()=>{const json=JSON.stringify(report(),null,2);try{await navigator.clipboard.writeText(json);copy.textContent='已复制';}catch{const field=document.createElement('textarea');field.readOnly=true;field.value=json;field.style.cssText='display:block;width:100%;height:100px';panel.append(field);field.select();copy.textContent='长按文本复制';}};
 text.textContent='性能采样 · 画质保持不变\n进入游戏后开始记录';
 return {beginFrame(playing){if(playing&&!document.hidden&&!panel.hidden)runtime.begin();else runtime.pause();},frame(now,cpu,playing){runtime.end();if(!playing){meter.pause();return;}if(!panel.hidden)meter.sample(now,cpu);if(now<next||panel.hidden)return;next=now+2000;const r=report();text.textContent=`性能采样（最近${r.samples}帧）\n画布 ${r.canvas.join('×')} · 抗锯齿 ${r.antialias?'开':'关'}\n约 ${r.fps.toFixed(1)} FPS · P95 ${r.frameMilliseconds.p95.toFixed(1)}ms\n帧内中位 ${r.frameWorkMilliseconds.median.toFixed(1)}ms · 绘制 ${r.drawCalls??'—'}\nGPU ${r.runtime.gpu.samples?r.runtime.gpu.milliseconds.median.toFixed(1)+'ms':r.runtime.gpu.supported?'等待采样':'此设备未提供独立计时'}\n超过100ms ${r.framesOver100ms}帧`;},report,reset(){meter.reset();runtime.reset();longTasks.length=0;},dispose(){runtime.dispose();observer?.disconnect();document.removeEventListener('visibilitychange',pauseMeter);renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.domElement.removeEventListener('webglcontextrestored',restored);panel.remove();}};
}
