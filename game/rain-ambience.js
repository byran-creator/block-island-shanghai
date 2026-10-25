import {pcmRecordingBuffer as rainRecordingBuffer} from './pcm-recording.js';
export {rainRecordingBuffer};
const RAIN_URL=new URL('./assets/audio/rain-gentle-qk.wav',import.meta.url).href;

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
