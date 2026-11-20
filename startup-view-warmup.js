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

const BUND_TEXTURE_LIMIT=56*1024*1024;
const BUND_TEXTURE_SLICE=4*1024*1024;
const BUND_TEXTURE_MAX_ITEM=9*1024*1024;
const BUND_GEOMETRY_LIMIT=42*1024*1024;
const BUND_GEOMETRY_SLICE=6*1024*1024;
const BUND_PREPARE_MS=900;
// West and southwest include the street frontage first revealed when the
// player turns away from the river.
const BUND_STREET_YAWS=[2.35,1.15];
const BUND_FULL_YAWS=[2.35,1.57,-.85,-2.35];

function drawStartupSlice(renderer,scene,camera){
 const scissor=renderer.getScissor(new Vector4()),test=renderer.getScissorTest();
 renderer.setScissor(0,0,1,1);
 renderer.setScissorTest(true);
 try{renderer.render(scene,camera);}
 finally{
  renderer.setScissor(scissor);
  renderer.setScissorTest(test);
 }
}

function bindStartupGeometry(renderer,scene,view,slice,lights){
 // Use the real batch, render target and scene lights so Three retains the
 // uploaded attributes and the normal program/vertex bindings for play.
 const before=scene.onBeforeRender,after=scene.onAfterRender,cameraMask=view.layers.mask;
 const masks=[];
 let needsAfter=false;
 function restoreMasks(){
  for(const [object,mask] of masks)object.layers.mask=mask;
  masks.length=0;
  view.layers.mask=cameraMask;
 }
 scene.onBeforeRender=function(...args){
  needsAfter=true;
  before.apply(this,args);
  view.layers.set(31);
  for(const object of [...lights,...slice]){
   masks.push([object,object.layers.mask]);
   object.layers.enable(31);
  }
 };
 scene.onAfterRender=function(...args){
  restoreMasks();
  needsAfter=false;
  after.apply(this,args);
 };
 try{drawStartupSlice(renderer,scene,view);}
 finally{
  restoreMasks();
  scene.onBeforeRender=before;
  scene.onAfterRender=after;
  if(needsAfter)after.call(scene,renderer,scene,view);
 }
}

function geometryByteSize(geo,seenArrays){
 const attributes=[geo.index,...Object.values(geo.attributes)];
 let bytes=0;
 for(let i=0;i<attributes.length;i++){
  const attr=attributes[i];
  if(!attr)continue;
  const arr=attr.array??attr.data?.array;
  if(arr&&!seenArrays.has(arr)){seenArrays.add(arr);bytes+=arr.byteLength;}
 }
 return bytes;
}

export async function warmBundStreet(renderer,scene,camera,foot,roots,streetMaps,isLoading,options={}){
 const budgetMs=options.budgetMs??BUND_PREPARE_MS;
 const yaws=options.fullCircle?BUND_FULL_YAWS:BUND_STREET_YAWS;
 const gl=renderer.getContext(),started=performance.now(),deadline=started+budgetMs;
 const available=()=>isLoading()&&!gl.isContextLost()&&!renderer.getRenderTarget()&&performance.now()<deadline;
 const stats={textureBytes:0,textures:0,geometryBytes:0,geometry:0,passes:0,ready:false,elapsed:0};
 if(!available())return stats;
 function finish(ready){
  stats.ready=ready&&stats.textures+stats.geometry>0;
  stats.elapsed=performance.now()-started;
  return stats;
 }
 const views=yaws.map(yaw=>{
  const view=camera.clone();
  view.position.set(foot.x,foot.y+1.62,foot.z);
  view.rotation.set(0,yaw,0,'YXZ');
  view.updateMatrixWorld();
  const frustum=new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(view.projectionMatrix,view.matrixWorldInverse));
  return {view,frustum,geometry:[]};
 });
 const textures=new Map(),lights=[],seenArrays=new Set(),queuedMeshes=new Set();
 scene.traverseVisible(object=>{if(object.isLight&&object.layers.test(camera.layers))lights.push(object);});
 let geometryBytes=0;
 const allowedNames=new Set(['street-furniture','nanjing-sign-batch','yuyuan-sign-batch']);
 function collectObject(object,allowStaticMesh){
  if(!object.isMesh||!object.layers.test(camera.layers)||!object.material?.visible)return;
  const match=views.find(({frustum})=>frustum.intersectsObject(object));
  if(!match)return;
  const sign=streetMaps.get(object);
  const texture=sign??object.material.map,image=texture?.image;
  const size=image?.width*image?.height*4;
  if((texture?.isCanvasTexture||texture?.userData?.opaqueStreetArt)&&size>0&&size<=BUND_TEXTURE_MAX_ITEM){
   const parent=object.parent?.name;
   const priority=sign||object.name==='nanjing-sign-batch'||parent?.startsWith('metro-entrance-')||parent==='shanghai-bus-stop-sign'?0:1;
   if(!textures.has(texture)||priority<textures.get(texture).priority)textures.set(texture,{size,priority});
  }
  const wantGeo=allowedNames.has(object.name)||(allowStaticMesh&&!object.isInstancedMesh&&!object.matrixAutoUpdate);
  if(!wantGeo||queuedMeshes.has(object))return;
  const bytes=geometryByteSize(object.geometry,seenArrays);
  if(geometryBytes+bytes>BUND_GEOMETRY_LIMIT)return;
  queuedMeshes.add(object);
  geometryBytes+=bytes;
  match.geometry.push([object,bytes]);
 }
 for(const root of roots)root?.traverseVisible(object=>{
  collectObject(object,false);
 });
 if(options.includeSceneMeshes){
  for(const child of scene.children){
   if(!child.visible)continue;
   if(child.isMesh)collectObject(child,true);
  }
 }

 // Bind the measured heavy street batches before other uploads can consume
 // the loading budget. These batches use untextured palette materials.
 const pipeline=!!options.pipeline;
 for(const {view,geometry} of views){
  for(let index=0;index<geometry.length&&available();){
   const slice=[];
   let bytes=0;
   do{
    const [mesh,size]=geometry[index++];
    slice.push(mesh);
    bytes+=size;
   }while(index<geometry.length&&bytes+geometry[index][1]<=BUND_GEOMETRY_SLICE);
   bindStartupGeometry(renderer,scene,view,slice,lights);
   stats.geometry+=slice.length;
   stats.geometryBytes+=bytes;
   stats.passes++;
   if(pipeline){
    gl.flush();
    await yieldTask();
   }else if(!await waitForUploads(gl,deadline,isLoading)){
    return finish(false);
   }
  }
 }
 const uploads=[...textures].sort(([,a],[,b])=>a.priority-b.priority);
 let next=0,pendingSlices=pipeline&&stats.passes>0?1:0;
 while(next<uploads.length&&available()){
  let bytes=0;
  while(next<uploads.length&&available()){
   const [texture,{size}]=uploads[next];
   if(bytes>0&&bytes+size>BUND_TEXTURE_SLICE)break;
   next++;
   if(stats.textureBytes+size>BUND_TEXTURE_LIMIT||renderer.properties.get(texture).__version===texture.version)continue;
   renderer.initTexture(texture);
   stats.textures++;
   stats.textureBytes+=size;
   bytes+=size;
   if(bytes>=BUND_TEXTURE_SLICE)break;
  }
  if(bytes===0)continue;
  if(!pipeline&&++pendingSlices===3){
   if(!await waitForUploads(gl,deadline,isLoading))return finish(false);
   pendingSlices=0;
  }else{
   if(pipeline)pendingSlices++;
   gl.flush();
   await yieldTask();
  }
 }
 if(options.getTerrainChunks&&available()&&geometryBytes<BUND_GEOMETRY_LIMIT){
  const chunkSlice=[];
  let chunkBytes=0,chunkView=views[0].view;
  for(const mesh of options.getTerrainChunks()){
   if(!mesh?.isMesh||!mesh.visible||queuedMeshes.has(mesh))continue;
   const bs=mesh.geometry.boundingSphere;
   if(bs&&(bs.center.x-foot.x)**2+(bs.center.z-foot.z)**2>165*165)continue;
   const match=views.find(({frustum})=>frustum.intersectsObject(mesh));
   if(!match)continue;
   const bytes=geometryByteSize(mesh.geometry,seenArrays);
   if(geometryBytes+bytes>BUND_GEOMETRY_LIMIT)break;
   queuedMeshes.add(mesh);
   geometryBytes+=bytes;
   chunkView=match.view;
   chunkSlice.push(mesh);
   chunkBytes+=bytes;
   if(chunkBytes>=BUND_GEOMETRY_SLICE&&available()){
    bindStartupGeometry(renderer,scene,chunkView,chunkSlice,lights);
    stats.geometry+=chunkSlice.length;
    stats.geometryBytes+=chunkBytes;
    stats.passes++;
    chunkSlice.length=0;chunkBytes=0;
    gl.flush();
    await yieldTask();
   }
  }
  if(chunkSlice.length>0&&available()){
   bindStartupGeometry(renderer,scene,chunkView,chunkSlice,lights);
   stats.geometry+=chunkSlice.length;
   stats.geometryBytes+=chunkBytes;
   stats.passes++;
   pendingSlices=Math.max(pendingSlices,1);
  }
 }
 if(pendingSlices>0&&available()&&!await waitForUploads(gl,deadline,isLoading))return finish(false);
 return finish(available());
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
  drawStartupSlice(renderer,scene,camera);
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
