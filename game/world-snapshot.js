// Lossless base-map asset. Player saves and edits never enter this format.
const MAGIC=0x53574942,FORMAT=1,HEADER=32;
const MAX_VOXELS=64*1024*1024,MAX_SURFACE=1024*1024,MAX_PACKED=16*1024*1024,MAX_COMPRESSED=8*1024*1024;
const integer=(n,max)=>Number.isSafeInteger(n)&&n>0&&n<=max;
const hash=value=>typeof value==='string'&&/^[0-9a-f]{64}$/.test(value);
function validateManifest(m){
 if(!m||m.format!==FORMAT||typeof m.revision!=='string'||!m.revision.length||m.revision.length>128||!Number.isSafeInteger(m.maxBlockId)||m.maxBlockId<0||m.maxBlockId>255||!integer(m.size,1024)||!integer(m.height,512)||!integer(m.voxelLength,MAX_VOXELS)||!integer(m.surfaceLength,MAX_SURFACE)||m.surfaceLength!==m.size*m.size||m.voxelLength!==m.surfaceLength*m.height||!integer(m.runCount,m.voxelLength)||!integer(m.packedByteLength,MAX_PACKED)||!integer(m.compressedByteLength,MAX_COMPRESSED)||!hash(m.packedSha256)||!hash(m.compressedSha256))throw new Error('Invalid world snapshot manifest');
 return m;
}
export function decodeWorldSnapshot(packed,manifest){
 const m=validateManifest(manifest),bytes=packed instanceof Uint8Array?packed:packed instanceof ArrayBuffer?new Uint8Array(packed):null;
 if(!bytes||bytes.byteLength!==m.packedByteLength||bytes.byteLength<HEADER)throw new Error('Invalid world snapshot length');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),rleLength=view.getUint32(28,true);
 if(view.getUint32(0,true)!==MAGIC||view.getUint16(4,true)!==FORMAT||view.getUint16(6,true)!==HEADER||view.getUint32(8,true)!==m.size||view.getUint32(12,true)!==m.height||view.getUint32(16,true)!==m.voxelLength||view.getUint32(20,true)!==m.surfaceLength||view.getUint32(24,true)!==m.runCount||rleLength<m.runCount*2||rleLength>m.runCount*6||HEADER+rleLength+m.surfaceLength*2!==bytes.byteLength)throw new Error('Invalid world snapshot header');
 const data=new Uint8Array(m.voxelLength),ends=new Uint32Array(m.runCount),values=new Uint8Array(m.runCount),surface=new Uint16Array(m.surfaceLength),end=HEADER+rleLength;let at=HEADER,start=0,previous=-1;
 for(let run=0;run<m.runCount;run++){
  if(at>=end)throw new Error('Truncated world snapshot run');const value=bytes[at++];if(value>m.maxBlockId||value===previous)throw new Error('Invalid world snapshot voxel');
  let length=0,factor=1,b=0,count=0;
  do{if(at>=end||count++>=4)throw new Error('Invalid world snapshot run length');b=bytes[at++];length+=(b&127)*factor;factor*=128;}while(b&128);
  if(length===0||count>1&&(b&127)===0||length>m.voxelLength-start)throw new Error('Invalid world snapshot run range');
  const next=start+length;data.fill(value,start,next);ends[run]=next;values[run]=value;start=next;previous=value;
 }
 if(start!==m.voxelLength||at!==end)throw new Error('Incomplete world snapshot');
 for(let i=0;i<surface.length;i++){const y=view.getUint16(end+i*2,true);if(y>m.height)throw new Error('Invalid world snapshot surface');surface[i]=y;}
 return {data,surface,baseline:{ends,values}};
}
async function boundedBody(body,max){
 const reader=body.getReader(),chunks=[];let total=0;
 try{for(;;){const {value,done}=await reader.read();if(done)break;total+=value.byteLength;if(total>max)throw new Error('World snapshot exceeds expected size');chunks.push(value);}const bytes=new Uint8Array(total);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.byteLength;}return bytes;}catch(error){await reader.cancel().catch(()=>{});throw error;}finally{reader.releaseLock();}
}
async function decompressGzip(bytes,max){
 if(typeof DecompressionStream!=='function')throw new Error('World snapshot decompression unavailable');
 return boundedBody(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')),max);
}
export async function loadWorldSnapshot(url,manifest,{fetch:fetchAsset=globalThis.fetch,decompress=decompressGzip,crypto=globalThis.crypto,timeoutMilliseconds=8000,expectedRevision=manifest?.revision}={}){
 const m=validateManifest(manifest);if(m.revision!==expectedRevision)throw new Error('World snapshot revision mismatch');
 if(typeof fetchAsset!=='function'||!crypto?.subtle?.digest)throw new Error('World snapshot APIs unavailable');
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),timeoutMilliseconds);
 const digest=async bytes=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),v=>v.toString(16).padStart(2,'0')).join('');
 try{
  const response=await fetchAsset(url,{cache:'force-cache',signal:controller.signal});if(!response.ok)throw new Error('World snapshot fetch failed');
  if(!response.body?.getReader)throw new Error('World snapshot streaming unavailable');
  const limit=Math.max(m.compressedByteLength,m.packedByteLength),body=await boundedBody(response.body,limit);
  // Some hosts transparently decode a .gz response. Its unpacked hash is still exact.
  const raw=body.byteLength===m.packedByteLength&&body.byteLength>=HEADER&&new DataView(body.buffer,body.byteOffset,body.byteLength).getUint32(0,true)===MAGIC;
  let packed=body;
  if(!raw){if(body.byteLength!==m.compressedByteLength||await digest(body)!==m.compressedSha256)throw new Error('World snapshot compressed hash mismatch');packed=await decompress(body,m.packedByteLength);}
  if(!(packed instanceof Uint8Array)||packed.byteLength!==m.packedByteLength||await digest(packed)!==m.packedSha256)throw new Error('World snapshot hash mismatch');
  return decodeWorldSnapshot(packed,m);
 }finally{clearTimeout(timer);}
}
