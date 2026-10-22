import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import path from 'node:path';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
export function encodeWorldSnapshot(data,surface,{size,height}){
 if(!(data instanceof Uint8Array)||!(surface instanceof Uint16Array)||surface.length!==size*size||data.length!==surface.length*height)throw new Error('Invalid base world');
 let runCount=data.length?1:0;for(let i=1;i<data.length;i++)if(data[i]!==data[i-1])runCount++;
 const runs=new Uint8Array(runCount*6);let at=0,start=0;
 for(let i=1;i<=data.length;i++)if(i===data.length||data[i]!==data[i-1]){runs[at++]=data[i-1];let n=i-start;while(n>=128){runs[at++]=(n&127)|128;n>>>=7;}runs[at++]=n;start=i;}
 const packed=new Uint8Array(32+at+surface.byteLength),view=new DataView(packed.buffer);
 view.setUint32(0,0x53574942,true);view.setUint16(4,1,true);view.setUint16(6,32,true);for(const [offset,value]of [[8,size],[12,height],[16,data.length],[20,surface.length],[24,runCount],[28,at]])view.setUint32(offset,value,true);
 packed.set(runs.subarray(0,at),32);for(let i=0;i<surface.length;i++)view.setUint16(32+at+i*2,surface[i],true);
 return {packed,runCount};
}
export async function buildWorldSnapshot(gameDirectory='game',{revision}={}){
 if(typeof revision!=='string'||!revision)throw new Error('Base world revision is required');
 const {VoxelWorld,SIZE,HEIGHT,BLOCKS}=await import(pathToFileURL(path.resolve(gameDirectory,'world.js')).href),world=new VoxelWorld(),{packed,runCount}=encodeWorldSnapshot(world.data,world.surface,{size:SIZE,height:HEIGHT}),code=gzipSync(packed,{level:9}),compressedSha256=digest(code),name='world-snapshot-'+compressedSha256.slice(0,12)+'.bin.gz';
 const surfaceBytes=new Uint8Array(world.surface.byteLength),view=new DataView(surfaceBytes.buffer);for(let i=0;i<world.surface.length;i++)view.setUint16(i*2,world.surface[i],true);
 return {name,code,manifest:{file:name,format:1,revision,maxBlockId:BLOCKS.length-1,size:SIZE,height:HEIGHT,voxelLength:world.data.length,surfaceLength:world.surface.length,runCount,packedByteLength:packed.byteLength,compressedByteLength:code.byteLength,packedSha256:digest(packed),compressedSha256,voxelSha256:digest(world.data),surfaceSha256:digest(surfaceBytes)}};
}
