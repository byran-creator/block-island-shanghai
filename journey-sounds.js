// Original short pentatonic task cues; no commercial game's audio is used.
export function createJourneySounds({getAudio,getSound=()=>true,getVolume=()=>.28}){
 const playing=new Set();
 function stop(){for(const n of [...playing]){try{n.stop();}catch{}}}
 function play(kind='accept'){
  if(!getSound()||getVolume()<=0)return;const c=getAudio?.();if(!c)return;stop();
  const notes=kind==='complete'?[659.25,783.99,987.77,1318.51]:kind==='reward'?[523.25,659.25,783.99,1046.5,1318.51]:[523.25,783.99,1046.5];
  notes.forEach((hz,i)=>{const n=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.095;n.type='sine';n.frequency.value=hz;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(.0001,Math.min(1,getVolume())*.12),t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+.42);n.connect(g);g.connect(c.destination);playing.add(n);n.onended=()=>{playing.delete(n);n.disconnect();g.disconnect();};n.start(t);n.stop(t+.45);});
 }return {play,stop};
}
