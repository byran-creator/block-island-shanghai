// Original security cues, with attributed arrival recording and procedural fallback.
export function createMetroSounds({getAudio,allowed}){
 const sources=new Set(),buffers=new WeakMap(),recordings=new WeakMap(),loads=new WeakMap();
 function prepare(){if(!allowed())return Promise.resolve(false);try{const ctx=getAudio();if(typeof ctx.decodeAudioData!=='function')return Promise.resolve(false);if(!loads.has(ctx))loads.set(ctx,import('./metro-arrival-audio.js').then(({METRO_ARRIVAL_AUDIO})=>{const text=atob(METRO_ARRIVAL_AUDIO.split(',')[1]),bytes=Uint8Array.from(text,c=>c.charCodeAt(0));return ctx.decodeAudioData(bytes.buffer);}).then(buffer=>{recordings.set(ctx,buffer);return true;}).catch(()=>false));return loads.get(ctx);}catch{return Promise.resolve(false);}}
 function play(kind='station'){
  if(!allowed())return false;
  try{
   const ctx=getAudio();ctx.resume()?.catch?.(()=>{});
   const tone=(frequency,delay,duration,gain)=>{const o=ctx.createOscillator(),g=ctx.createGain(),at=ctx.currentTime+delay;o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(gain,at+.02);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(ctx.destination);sources.add(o);o.onended=()=>{sources.delete(o);o.disconnect();g.disconnect();};o.start(at);o.stop(at+duration+.02);};
   const notes=kind==='scan'?[392]:kind==='pass'?[659,880]:kind==='arrival'?[]:[659,784,523];
   notes.forEach((f,i)=>tone(f,i*.19,.3,kind==='scan'?.018:.03));
   if(kind==='arrival'){
    let buffer=recordings.get(ctx)??buffers.get(ctx);if(!buffer){buffer=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*5.6),ctx.sampleRate);const a=buffer.getChannelData(0);let seed=917;for(let i=0;i<a.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;a[i]=(seed/2**31-1)*(.78+.22*Math.sin(i/ctx.sampleRate*31));}buffers.set(ctx,buffer);}
    const o=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain(),at=ctx.currentTime;o.buffer=buffer;filter.type='lowpass';filter.frequency.setValueAtTime(350,at);filter.frequency.linearRampToValueAtTime(2800,at+3.6);filter.frequency.linearRampToValueAtTime(900,at+5.6);const peak=recordings.has(ctx)?.32:.07;g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(peak*.32,at+1);g.gain.linearRampToValueAtTime(peak,at+3.6);g.gain.linearRampToValueAtTime(.0001,at+5.6);o.connect(filter);filter.connect(g);g.connect(ctx.destination);sources.add(o);o.onended=()=>{sources.delete(o);o.disconnect();filter.disconnect();g.disconnect();};o.start(at);o.stop(at+5.6);
   }
   return true;
  }catch{return false;}
 }
 function suspend(){for(const o of sources){try{o.stop();}catch{}}sources.clear();}
 return {play,suspend,prepare};
}
