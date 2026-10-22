import assert from 'node:assert/strict';
import {gunzipSync} from 'node:zlib';
import {webcrypto,createHash} from 'node:crypto';
import {buildWorldSnapshot,encodeWorldSnapshot} from '../scripts/world-snapshot-build.mjs';
import {decodeWorldSnapshot,loadWorldSnapshot} from '../game/world-snapshot.js';
import {VoxelWorld,SIZE,HEIGHT} from '../game/world.js';
import {createWorldBaseline} from '../game/world-baseline.js';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex'),asset=await buildWorldSnapshot('game',{revision:'test-current'}),packed=gunzipSync(asset.code),actual=decodeWorldSnapshot(packed,asset.manifest),world=new VoxelWorld();
assert.deepEqual(actual.data,world.data);assert.deepEqual(actual.surface,world.surface);assert.equal(digest(actual.data),asset.manifest.voxelSha256);assert.equal(digest(Buffer.from(actual.surface.buffer)),asset.manifest.surfaceSha256);
const baseline=createWorldBaseline(world.data);for(const i of [0,1,SIZE-1,SIZE*SIZE,world.data.length-1,1234567]){let r=0;while(actual.baseline.ends[r]<=i)r++;assert.equal(actual.baseline.values[r],baseline.get(i));}
const original=actual.data[1234567];actual.data[1234567]=13;let begin=0;for(let r=0;r<actual.baseline.ends.length;r++){actual.data.fill(actual.baseline.values[r],begin,actual.baseline.ends[r]);begin=actual.baseline.ends[r];}assert.equal(actual.data[1234567],original,'baseline is independent of later player edits');
for(const change of [b=>b.subarray(1),b=>{new DataView(b.buffer,b.byteOffset,b.byteLength).setUint32(0,0,true);return b;},b=>{new DataView(b.buffer,b.byteOffset,b.byteLength).setUint32(8,SIZE+1,true);return b;},b=>{b[32]=255;return b;},b=>{b[33]=0;return b;},b=>{b.fill(255,33,38);return b;},b=>{new DataView(b.buffer,b.byteOffset,b.byteLength).setUint16(b.length-2,HEIGHT+1,true);return b;}])assert.throws(()=>decodeWorldSnapshot(change(Uint8Array.from(packed)),asset.manifest));
for(const manifest of [{...asset.manifest,runCount:0},{...asset.manifest,packedByteLength:2**30},{...asset.manifest,voxelLength:2**32},{...asset.manifest,surfaceLength:1},{...asset.manifest,height:0},{...asset.manifest,maxBlockId:-1},{...asset.manifest,maxBlockId:256},{...asset.manifest,maxBlockId:undefined}])assert.throws(()=>decodeWorldSnapshot(packed,manifest));
const fixture=new Uint8Array(256);fixture.fill(3,0,127);fixture.fill(4,127,255);fixture[255]=5;const surface=new Uint16Array([0,1,16,64]),encoded=encodeWorldSnapshot(fixture,surface,{size:2,height:64});const fm={...asset.manifest,size:2,height:64,voxelLength:256,surfaceLength:4,runCount:encoded.runCount,packedByteLength:encoded.packed.byteLength};assert.deepEqual(decodeWorldSnapshot(encoded.packed,fm).data,fixture,'127/128 length encoding boundaries');
const expanded=Uint8Array.from(encoded.packed);expanded[32]=255;assert.equal(decodeWorldSnapshot(expanded,{...fm,maxBlockId:255}).data[0],255,'future valid block IDs follow the built manifest');
const fetchAsset=async()=>new Response(asset.code);const loaded=await loadWorldSnapshot('https://test.invalid/base.gz',asset.manifest,{fetch:fetchAsset,crypto:webcrypto});assert.deepEqual(loaded.data,world.data);
const decodedResponse=await loadWorldSnapshot('https://test.invalid/base.gz',asset.manifest,{fetch:async()=>new Response(packed),crypto:webcrypto});assert.deepEqual(decodedResponse.surface,world.surface,'host-decoded gzip is accepted only by exact packed hash');
await assert.rejects(loadWorldSnapshot('x',asset.manifest,{fetch:fetchAsset,crypto:webcrypto,expectedRevision:'stale'}));
await assert.rejects(loadWorldSnapshot('x',{...asset.manifest,compressedSha256:'0'.repeat(64)},{fetch:fetchAsset,crypto:webcrypto}));
await assert.rejects(loadWorldSnapshot('x',{...asset.manifest,packedSha256:'0'.repeat(64)},{fetch:fetchAsset,crypto:webcrypto}));
await assert.rejects(loadWorldSnapshot('x',asset.manifest,{fetch:async()=>new Response(new Uint8Array(asset.manifest.packedByteLength+1)),crypto:webcrypto}));
await assert.rejects(loadWorldSnapshot('x',asset.manifest,{fetch:async()=>new Response('',{status:404}),crypto:webcrypto}));
console.log(JSON.stringify({passed:true,compressedBytes:asset.code.byteLength,packedBytes:packed.byteLength,voxelBytes:world.data.byteLength,runs:actual.baseline.ends.length,voxelSha256:asset.manifest.voxelSha256,surfaceSha256:asset.manifest.surfaceSha256}));
