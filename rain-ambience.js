// Original stereo rainfall: continuous patter plus irregular short drop tails.
// One looping buffer is reused for the whole session, independent of frame rate.
export function rainSamples(rate,seconds=7){
 const channels=[new Float32Array(Math.floor(rate*seconds)),new Float32Array(Math.floor(rate*seconds))];
 let seed=31075;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 const decay=Math.exp(-1/(rate*.006));
 for(const data of channels){let low=0,drop=0,slow=0;
  for(let i=0;i<data.length;i++){
   const white=random()*2-1;low+=(white-low)*.12;slow+=(random()-.5-slow)*.0003;
   if(random()<220/rate)drop+=.12+random()*.38;
   drop*=decay;
   data[i]=Math.max(-.95,Math.min(.95,(white-low)*(.28+slow*.12)+white*drop));
  }
 }
 return channels;
}

export function createRainAmbience(ctx,output){
 const rate=Math.min(ctx.sampleRate,24000),channels=rainSamples(rate),buffer=ctx.createBuffer(2,channels[0].length,rate);
 channels.forEach((data,i)=>buffer.getChannelData(i).set(data));
 const source=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
 source.buffer=buffer;source.loop=true;filter.type='lowpass';filter.frequency.value=6500;gain.gain.value=0;
 source.connect(filter);filter.connect(gain);gain.connect(output);source.start();
 return {update(rain,exposure=1){const level=Math.max(0,Math.min(1,rain));
  gain.gain.setTargetAtTime(level*.48*Math.max(0,Math.min(1,exposure)),ctx.currentTime,.45);
  filter.frequency.setTargetAtTime(exposure<.5?1400:6500,ctx.currentTime,.4);
 },dispose(){source.stop();source.disconnect();filter.disconnect();gain.disconnect();}};
}
