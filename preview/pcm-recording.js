// Keep the shipped PCM rate instead of expanding to a 48/96kHz decoded buffer.
export function pcmRecordingBuffer(ctx,bytes){
 if(bytes.byteLength<44||bytes.byteLength>1300000)throw Error('Ambience recording exceeds budget');
 const data=new DataView(bytes),text=(at,n)=>String.fromCharCode(...new Uint8Array(bytes,at,n));
 if(text(0,4)!=='RIFF'||text(8,4)!=='WAVE')throw Error('Invalid ambience recording');
 let channels=0,rate=0,pcm=null;
 for(let at=12;at+8<=bytes.byteLength;){
  const size=data.getUint32(at+4,true),start=at+8;
  if(start+size>bytes.byteLength)throw Error('Truncated ambience recording');
  if(text(at,4)==='fmt '){
   if(size<16||data.getUint16(start,true)!==1||data.getUint16(start+14,true)!==16)throw Error('Unsupported ambience PCM');
   channels=data.getUint16(start+2,true);rate=data.getUint32(start+4,true);
   if(data.getUint16(start+12,true)!==channels*2)throw Error('Invalid rain alignment');
  }
  if(text(at,4)==='data')pcm={at:start,size};
  at=start+size+(size%2);
 }
 if(!pcm||channels<1||channels>2||rate<8000||rate>24000||pcm.size%(channels*2))throw Error('Invalid ambience format');
 const frames=pcm.size/(channels*2);
 if(frames/rate<8||frames/rate>22)throw Error('Invalid ambience duration');
 const buffer=ctx.createBuffer(channels,frames,rate);
 for(let c=0;c<channels;c++){const out=buffer.getChannelData(c);for(let i=0;i<frames;i++)out[i]=data.getInt16(pcm.at+(i*channels+c)*2,true)/32768;}
 return buffer;
}

