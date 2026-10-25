import {pcmRecordingBuffer} from './pcm-recording.js';
const BIRDS_URL=new URL('./assets/audio/garden-birds-sadiquecat.wav',import.meta.url).href;

// CC0 park field recording. One bounded mono buffer, fetched on the first visit.
// Stop the source outside the garden; pause/dispose also prevent late fetch playback.
export function createGardenAmbience(ctx,output,{fetchAudio=globalThis.fetch,url=BIRDS_URL}={}){
 const gain=ctx.createGain();gain.gain.value=0;gain.connect(output);
 let buffer,source,loading,desired=0,lastGain=-1,retryAt=0,silentSince=-1,disposed=false;
 function stop(){if(source){source.stop();source.disconnect();source=null;}}
 function start(){if(disposed||!buffer||source||desired<=0)return;source=ctx.createBufferSource();source.buffer=buffer;source.loop=true;source.connect(gain);source.start();}
 function prepare(){
  if(disposed||buffer||loading||typeof fetchAudio!=='function'||ctx.currentTime<retryAt)return;
  loading=(async()=>{const response=await fetchAudio(url);if(!response.ok)throw Error('Garden recording unavailable');const bytes=await response.arrayBuffer();if(disposed)return;buffer=pcmRecordingBuffer(ctx,bytes);start();})().catch(()=>{retryAt=ctx.currentTime+20;}).finally(()=>{loading=null;});
 }
 function update(level){
  if(disposed)return;desired=Number.isFinite(level)?Math.max(0,Math.min(1,level)):0;
  if(desired>0){silentSince=-1;prepare();start();}
  else if(source){if(silentSince<0)silentSince=ctx.currentTime;else if(ctx.currentTime-silentSince>=1.5)stop();}
  if(desired!==lastGain){gain.gain.setTargetAtTime(desired,ctx.currentTime,.45);lastGain=desired;}
 }
 return {update,suspend(){update(0);stop();},dispose(){disposed=true;desired=0;stop();buffer=null;gain.disconnect();},get pending(){return loading;},get ready(){return !!buffer;}};
}
