const RAIN_URL=new URL('./assets/audio/rain-gentle-qk.wav',import.meta.url).href;

// Keep the shipped PCM rate instead of expanding to a 48/96kHz decoded buffer.
export function rainRecordingBuffer(ctx,bytes){
 if(bytes.byteLength<44||bytes.byteLength>1300000)throw Error('Rain recording exceeds budget');
 const data=new DataView(bytes),text=(at,n)=>String.fromCharCode(...new Uint8Array(bytes,at,n));
 if(text(0,4)!=='RIFF'||text(8,4)!=='WAVE')throw Error('Invalid rain recording');
 let channels=0,rate=0,pcm=null;
 for(let at=12;at+8<=bytes.byteLength;){
  const size=data.getUint32(at+4,true),start=at+8;
  if(start+size>bytes.byteLength)throw Error('Truncated rain recording');
  if(text(at,4)==='fmt '){
   if(size<16||data.getUint16(start,true)!==1||data.getUint16(start+14,true)!==16)throw Error('Unsupported rain PCM');
   channels=data.getUint16(start+2,true);rate=data.getUint32(start+4,true);
   if(data.getUint16(start+12,true)!==channels*2)throw Error('Invalid rain alignment');
  }
  if(text(at,4)==='data')pcm={at:start,size};
  at=start+size+(size%2);
 }
 if(!pcm||channels<1||channels>2||rate<8000||rate>24000||pcm.size%(channels*2))throw Error('Invalid rain format');
 const frames=pcm.size/(channels*2);
 if(frames/rate<8||frames/rate>22)throw Error('Invalid rain duration');
 const buffer=ctx.createBuffer(channels,frames,rate);
 for(let c=0;c<channels;c++){const out=buffer.getChannelData(c);for(let i=0;i<frames;i++)out[i]=data.getInt16(pcm.at+(i*channels+c)*2,true)/32768;}
 return buffer;
}

// Q.K.'s CC0 field recording, softened and crossfaded offline. Fetch only on
// actual rain and cache one bounded buffer. No synthetic drop-click layer.
export function createRainAmbience(ctx,output,{fetchAudio=globalThis.fetch,url=RAIN_URL}={}){
 const filter=ctx.createBiquadFilter(),gain=ctx.createGain();let buffer,source,loading,disposed=false,retryAt=0,desired=0,lastGain=-1,lastFilter=-1;
 filter.type='lowpass';filter.frequency.value=4400;gain.gain.value=0;filter.connect(gain);gain.connect(output);
 function start(){if(disposed||source||!buffer||desired<=0)return;source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(filter);source.start();}
 function prepare(){
  if(disposed||buffer||loading||ctx.currentTime<retryAt||typeof fetchAudio!=='function')return;
  loading=(async()=>{const response=await fetchAudio(url);if(!response.ok)throw Error('Rain recording unavailable');
   const bytes=await response.arrayBuffer();if(disposed)return;buffer=rainRecordingBuffer(ctx,bytes);start();
  })().catch(()=>{retryAt=ctx.currentTime+15;}).finally(()=>{loading=null;});
 }
 return {update(rain,exposure=1){
  if(disposed)return;
  const level=Number.isFinite(rain)&&rain>.04?Math.min(1,rain):0,cover=Number.isFinite(exposure)?Math.max(0,Math.min(1,exposure)):0;
  desired=level*.32*cover;
  if(desired>0){prepare();start();}
  if(Math.abs(desired-lastGain)>.0001){gain.gain.setTargetAtTime(desired,ctx.currentTime,desired ? .45 : .1);lastGain=desired;}
  const frequency=cover<.5?1200:4400;if(frequency!==lastFilter){filter.frequency.setTargetAtTime(frequency,ctx.currentTime,.4);lastFilter=frequency;}
 },dispose(){disposed=true;desired=0;if(source){source.stop();source.disconnect();}filter.disconnect();gain.disconnect();buffer=null;},get pending(){return loading;},get level(){return desired;},get ready(){return !!buffer;}};
}
