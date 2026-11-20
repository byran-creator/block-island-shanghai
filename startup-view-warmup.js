import {Frustum,Matrix4,Vector4} from './three.module.js';

const YAW_OFFSETS=[0,Math.PI,-Math.PI/2,Math.PI/2];
const DIAGONAL_YAWS=[Math.PI/4,-Math.PI/4,3*Math.PI/4,-3*Math.PI/4];
const SUBMIT_BUDGET_MS=650;
const FENCE_BUDGET_MS=240;
const TEXTURE_BATCH_BYTES=6*1024*1024;
const TEXTURE_BATCH_COUNT=12;
const TEXTURE_WARMUP_MS=1500;
const yieldTask=()=>new Promise(resolve=>setTimeout(resolve,0));

async function waitForUploads(gl,deadline,isLoading){
 const fence=gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);
 if(!fence)return false;
 try{
  gl.flush();
  while(isLoading()&&!gl.isContextLost()&&performance.now()<deadline){
   const state=gl.clientWaitSync(fence,0,0);
   if(state===gl.ALREADY_SIGNALED||state===gl.CONDITION_SATISFIED)return true;
   if(state===gl.WAIT_FAILED)break;
   await new Promise(resolve=>setTimeout(resolve,8));
  }
  return false;
 }finally{gl.deleteSync(fence);}
}

function discoverTextures(renderer,scene,camera,isLoading){
 const textures=new Map(),frustum=new Frustum(),projection=new Matrix4();
 const initialYaw=camera.rotation.y;
 scene.updateMatrixWorld();
 for(const offset of YAW_OFFSETS){
  if(!isLoading())break;
  camera.rotation.y=initialYaw+offset;
  camera.updateMatrixWorld();
  frustum.setFromProjectionMatrix(projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse));
  try{
   scene.onBeforeRender(renderer,scene,camera,null);
   scene.traverseVisible(object=>{
    if(!object.material||!object.layers.test(camera.layers))return;
    if(object.frustumCulled){
     if(object.isSprite?!frustum.intersectsSprite(object):!object.geometry||!frustum.intersectsObject(object))return;
    }
    const materials=Array.isArray(object.material)?object.material:[object.material];
    for(const material of materials){
     const texture=material?.map,image=texture?.image;
     if(!material?.visible||!texture?.isCanvasTexture||!image||textures.has(texture)||
      renderer.properties.get(texture).__version===texture.version)continue;
     const bytes=image.width*image.height*4;
     if(bytes>0&&bytes<=TEXTURE_BATCH_BYTES)textures.set(texture,bytes);
    }
   });
  }finally{scene.onAfterRender(renderer,scene,camera);}
 }
 return textures;
}

// Initialize only visible canvas textures. A draw would also enqueue all
// nearby vertex buffers and shader work before the driver can signal readiness.
export async function warmStartupTextures(renderer,scene,camera,isLoading){
 const gl=renderer.getContext(),started=performance.now(),deadline=started+TEXTURE_WARMUP_MS,passes=[];
 const available=()=>isLoading()&&!gl.isContextLost()&&performance.now()<deadline;
 const textures=[...discoverTextures(renderer,scene,camera,available)];
 let ready=true,index=0,prepared=0;
 while(index<textures.length&&available()){
  const batchStarted=performance.now();
  let bytes=0,count=0;
  while(index<textures.length&&count<TEXTURE_BATCH_COUNT&&available()){
   const [texture,size]=textures[index];
   if(bytes+size>TEXTURE_BATCH_BYTES)break;
   index++;
   if(renderer.properties.get(texture).__version===texture.version)continue;
   renderer.initTexture(texture);
   bytes+=size;
   count++;
   if(performance.now()-batchStarted>=16)break;
  }
  if(!count)break;
  const submit=performance.now()-batchStarted;
  ready=await waitForUploads(gl,deadline,isLoading);
  passes.push({bytes,count,submit,elapsed:performance.now()-batchStarted,ready});
  if(!ready)break;
  prepared+=count;
  await yieldTask();
 }
 return {passes,ready:passes.length>0&&ready,prepared,discovered:textures.length,elapsed:performance.now()-started};
}

// Only called while the startup screen covers the normal drawing buffer.
// Keep the actual render target and projection so driver caches match play.
export async function warmStartupViews(renderer,scene,camera,isLoading,{drain=false,headingOnly=false,waitBetweenViews=false,extendedSweep=false,diagonalSweep=false}={}){
 const gl=renderer.getContext();
 const originalScissor=renderer.getScissor(new Vector4());
 const originalTest=renderer.getScissorTest();
 const initialYaw=camera.rotation.y;
 const started=performance.now(),passes=[];
 const submitBudget=diagonalSweep?10000:extendedSweep?8000:waitBetweenViews?3500:drain?1000:SUBMIT_BUDGET_MS;
 const fenceBudget=headingOnly?1400:drain?1000:FENCE_BUDGET_MS;
 let ready=false;
 const offsets=headingOnly?[0]:diagonalSweep?[...YAW_OFFSETS,...DIAGONAL_YAWS]:YAW_OFFSETS;
 for(const offset of offsets){
  if(!isLoading()||gl.isContextLost()||renderer.getRenderTarget()||performance.now()-started>=submitBudget)break;
  camera.rotation.y=initialYaw+offset;
  const passStarted=performance.now();
  renderer.setScissor(0,0,1,1);
  renderer.setScissorTest(true);
  try{renderer.render(scene,camera);}
  finally{
   renderer.setScissor(originalScissor);
   renderer.setScissorTest(originalTest);
  }
  passes.push(performance.now()-passStarted);
  if(waitBetweenViews){
   const deadline=extendedSweep?started+submitBudget:Math.min(started+submitBudget,performance.now()+1200);
   ready=await waitForUploads(gl,deadline,isLoading);
   if(!ready)break;
  }
  await yieldTask();
 }
 if(!waitBetweenViews&&passes.length&&isLoading()&&!gl.isContextLost())
  ready=await waitForUploads(gl,performance.now()+fenceBudget,isLoading);
 camera.rotation.y=initialYaw;
 return {passes,ready,elapsed:performance.now()-started};
}

export async function stageStartupHud(render,document){
 const root=document.documentElement,inMenu=document.body.classList.contains('in-menu');
 if(document.hidden)return {frames:0,elapsed:0};
 const start=performance.now();
 let frames=0;
 root.dataset.startupHudStage='true';
 document.body.classList.remove('in-menu');
 try{
  await new Promise((resolve,reject)=>{
   let request;
   const timer=setTimeout(()=>{
    cancelAnimationFrame(request);
    resolve();
   },1400);
   function paint(){
    try{if(frames===0)render();}
    catch(error){clearTimeout(timer);reject(error);return;}
    if(++frames<3&&!document.hidden){
     request=requestAnimationFrame(paint);
     return;
    }
    clearTimeout(timer);
    resolve();
   }
   request=requestAnimationFrame(paint);
  });
 }finally{
  delete root.dataset.startupHudStage;
  if(inMenu)document.body.classList.add('in-menu');
 }
 return {frames,elapsed:performance.now()-start};
}

export function holdRestoredEntryPhoto(document){
 const root=document.documentElement,start=performance.now();
 const input=new AbortController();
 let frames=0,finished=false;
 root.dataset.startupEntryPhoto='true';
 document.addEventListener('keydown',event=>{
  event.preventDefault();
  event.stopImmediatePropagation();
 },{capture:true,signal:input.signal});
 const timer=setTimeout(finish,1500);
 function finish(){
  if(finished)return;
  finished=true;
  clearTimeout(timer);
  input.abort();
  delete root.dataset.startupEntryPhoto;
  document.dispatchEvent(new CustomEvent('block-island-startup-cover-revealed',{
   detail:{frames,elapsed:performance.now()-start}
  }));
 }
 return {rendered(){
  if(!finished&&++frames>=3)finish();
  return finished;
 }};
}
