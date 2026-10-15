// Lossless in-memory base map. Player saves still contain their ordinary edits.
export function createWorldBaseline(source){
 if(!(source instanceof Uint8Array))throw new TypeError('Expected voxel bytes');
 const length=source.length;let count=length?1:0;
 for(let i=1;i<length;i++)if(source[i]!==source[i-1])count++;
 if(count*5>=length){const bytes=source.slice();return {byteLength:bytes.byteLength,kind:'raw',get:i=>bytes[i],restore(target){if(!(target instanceof Uint8Array)||target.length!==length)throw new RangeError('Baseline size mismatch');target.set(bytes);}};}
 const ends=new Uint32Array(count),values=new Uint8Array(count);let run=0;
 for(let i=1;i<=length;i++)if(i===length||source[i]!==source[i-1]){ends[run]=i;values[run++]=source[i-1];}
 return {byteLength:ends.byteLength+values.byteLength,kind:'rle',get(i){if(!Number.isInteger(i)||i<0||i>=length)return undefined;let lo=0,hi=count-1;while(lo<hi){const mid=(lo+hi)>>>1;if(ends[mid]<=i)lo=mid+1;else hi=mid;}return values[lo];},restore(target){if(!(target instanceof Uint8Array)||target.length!==length)throw new RangeError('Baseline size mismatch');let start=0;for(let r=0;r<count;r++){target.fill(values[r],start,ends[r]);start=ends[r];}}};
}
