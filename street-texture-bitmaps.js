// Spend only the GPU-independent preparation work during existing loading.
// Three uploads each image on its ordinary first draw.
const BYTE_BUDGET=24*1024*1024;
const BATCH_SIZE=8;

export async function prepareStreetTextureBitmaps(renderer,textures,loading){
 if(!renderer.isWebGLRenderer||typeof globalThis.createImageBitmap!=='function')return;
 let bytes=0,batch=[];
 for(const texture of new Set(textures)){
  if(!loading())break;
  const image=texture?.image;
  if(!texture?.isCanvasTexture||!(image instanceof HTMLCanvasElement)||
   !texture.flipY||texture.premultiplyAlpha||renderer.properties.get(texture).__version!==undefined)continue;
  const size=image.width*image.height*4;
  if(bytes+size>BYTE_BUDGET)continue;
  bytes+=size;
  batch.push(prepare(texture,image,renderer));
  if(batch.length===BATCH_SIZE){
   await Promise.all(batch);
   batch=[];
  }
 }
 await Promise.all(batch);
}

async function prepare(texture,image,renderer){
 const version=texture.version;
 let disposed=false,bitmap;
 const markDisposed=()=>{disposed=true;};
 texture.addEventListener('dispose',markDisposed);
 try{
  bitmap=await globalThis.createImageBitmap(image,{
   imageOrientation:'flipY',premultiplyAlpha:'none',colorSpaceConversion:'none'
  });
 }catch{
  return;
 }finally{
  texture.removeEventListener('dispose',markDisposed);
 }
 if(disposed||texture.image!==image||texture.version!==version||
  renderer.properties.get(texture).__version!==undefined){
  bitmap.close();
  return;
 }
 texture.image=bitmap;
 texture.flipY=false;
 texture.needsUpdate=true;
 const close=()=>{
  texture.removeEventListener('dispose',close);
  bitmap.close();
 };
 texture.addEventListener('dispose',close);
}
