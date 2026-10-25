// Thumbnails stay outside world saves: no full PNGs in localStorage/cloud JSON.
const DB='block-island-travel-photos',STORE='photos',MAX_PHOTO_BYTES=100000;
let opening;
async function database(){
 if(!opening)opening=new Promise((resolve,reject)=>{if(!globalThis.indexedDB){reject(Error('浏览器未开放本机相册，请先导出照片。'));return;}let blocked=false;const request=indexedDB.open(DB,1);request.onupgradeneeded=()=>request.result.createObjectStore(STORE,{keyPath:'id'});request.onsuccess=()=>{if(blocked){request.result.close();return;}request.result.onversionchange=()=>{request.result.close();opening=null;};resolve(request.result);};request.onerror=()=>reject(Error('无法打开本机相册，请保留导出的照片。'));request.onblocked=()=>{blocked=true;reject(Error('本机相册正被旧页面占用，请关闭旧页面后重试。'));};}).catch(error=>{opening=null;throw error;});
 return opening;
}
export async function travelPhoto(id,blob){
 if(!/^photo-[a-z0-9-]{1,80}$/.test(id))throw Error('无效的照片编号');
 const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,blob?'readwrite':'readonly'),store=tx.objectStore(STORE);let result;
  if(blob){if(blob.size>MAX_PHOTO_BYTES||blob.type!=='image/jpeg'){reject(Error('手账缩略图超出限制'));return;}const get=store.getAllKeys();get.onsuccess=()=>{if(get.result.length>=48&&!get.result.includes(id)){tx.abort();return;}store.put({id,blob});};}
  else{const get=store.get(id);get.onsuccess=()=>result=get.result?.blob;}
  tx.oncomplete=()=>resolve(result);tx.onabort=tx.onerror=()=>reject(Error('本机相册空间不足，请先导出原图，再在手账移除不需要的相片。'));
 });
}
export async function travelThumbnail(blob){
 let sourceUrl;const image=typeof globalThis.createImageBitmap==='function'?await createImageBitmap(blob):await new Promise((resolve,reject)=>{const img=new Image();sourceUrl=URL.createObjectURL(blob);img.onload=()=>resolve(img);img.onerror=()=>{URL.revokeObjectURL(sourceUrl);reject(Error('无法读取照片，原图仍可导出。'));};img.src=sourceUrl;});try{const scale=Math.min(1,480/image.width,320/image.height),canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.width*scale));canvas.height=Math.max(1,Math.round(image.height*scale));canvas.getContext('2d').drawImage(image,0,0,canvas.width,canvas.height);
  const thumb=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',.72));if(!thumb||thumb.size>MAX_PHOTO_BYTES)throw Error('缩略图生成失败，原照片仍可导出。');return thumb;
 }finally{image.close?.();if(sourceUrl){URL.revokeObjectURL(sourceUrl);image.removeAttribute('src');}}
}
export async function removeTravelPhoto(id){const db=await database();return new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).delete(id);tx.oncomplete=resolve;tx.onabort=tx.onerror=()=>reject(Error('照片未能移除，请重试。'));});}
