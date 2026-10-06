// Original 96-second ambient score: Island Drift. No third-party recordings.
export const CHORDS=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,55,60],[40,47,55,59],[41,48,57,60],[38,45,53,57],[43,50,57,62],[48,55,60,64],[45,52,60,64],[41,48,55,60],[43,50,59,62]];
const MELODY=[[76,null,79,74,null,72,null,74],[72,null,76,null,79,76,null,72],[69,null,72,76,null,79,null,76],[74,null,79,null,81,79,null,74],[71,null,76,79,null,78,null,76],[72,null,76,null,81,79,null,76],[69,null,74,77,null,76,null,74],[71,null,74,null,79,81,null,79],[76,null,79,84,null,81,null,79],[76,null,72,null,79,76,null,72],[72,null,76,79,null,76,null,72],[74,null,71,null,67,null,null,null]];

export const TRACKS=[
 {id:'metro',name:'江底通勤',step:1.12,chords:[[45,52,55,60],[41,48,52,57],[43,50,55,59],[48,52,55,62]],melody:[[72,null,null,76,null,79,null,null],[69,null,72,null,null,76,null,null],[71,null,null,74,null,79,null,null],[72,null,76,null,null,79,null,null]]},
 {id:'river',name:'浦江晨光',step:.72,chords:[[48,52,55,59],[45,52,55,60],[50,53,57,60],[43,50,55,59],[48,55,59,64],[41,48,52,57],[45,52,55,60],[43,50,53,59],[48,52,55,62],[50,53,57,64],[41,48,55,60],[43,50,55,62]],melody:[[72,76,79,null,76,74,72,null],[69,null,72,76,79,null,76,72],[74,77,81,null,79,77,74,null],[71,null,74,79,81,79,74,null],[76,79,83,84,null,83,79,76],[72,76,77,null,81,79,76,null],[69,72,76,79,null,76,72,null],[71,74,77,79,81,79,74,null],[72,76,79,86,null,84,79,76],[74,77,81,88,null,86,81,null],[72,null,76,79,84,81,79,76],[74,79,83,86,79,74,72,null]]},
 {id:'neon',name:'霓虹夜航',step:.55,chords:[[45,52,55,59],[50,53,57,60],[43,50,53,59],[48,52,55,59],[41,48,52,57],[46,53,57,60],[40,47,50,55],[45,52,55,60]],melody:[[72,null,76,79,null,78,76,72],[74,77,null,81,null,79,77,null],[71,null,74,77,79,null,77,74],[72,76,79,null,83,81,79,null],[69,null,72,76,null,77,76,72],[70,74,null,77,null,81,77,null],[67,null,71,74,79,77,74,null],[69,72,76,79,81,79,76,null]]},
 {id:'deep',name:'深海梦境',step:1.25,chords:[[38,45,50,57],[41,48,53,60],[45,52,57,64],[43,50,55,62],[38,45,53,57],[40,47,55,59],[41,48,57,60],[43,50,57,62]],melody:[[69,null,null,74,null,null,77,null],[72,null,76,null,null,79,null,null],[76,null,null,81,null,79,null,null],[74,null,79,null,null,81,null,null],[69,null,null,77,null,null,74,null],[71,null,76,null,null,79,null,null],[72,null,null,81,null,79,null,null],[74,null,null,79,null,null,69,null]]},
 {id:'island',name:'小岛慢行',step:1,chords:CHORDS,melody:MELODY},
 {id:'shop',name:'南京路漫逛',step:.46,chords:[[48,52,55,59],[45,52,55,60],[50,53,57,60],[43,50,55,59]],melody:[[72,76,null,79,76,null,74,72],[69,null,72,76,null,79,76,null],[74,77,null,81,79,77,null,74],[71,null,74,79,null,77,74,null]]},
 {id:'dining',name:'龙凤茶叙',step:.94,chords:[[48,55,59,62],[41,48,52,57],[45,52,55,60],[43,50,57,62]],melody:[[76,null,79,null,74,null,72,null],[72,null,null,76,77,null,76,null],[69,null,72,null,76,null,79,null],[74,null,79,null,77,null,74,null]]}
];
export const frequency=midi=>440*Math.pow(2,(midi-69)/12);
export function createMusic(getContext){
 let ctx,master,bus,delay,feedback,echo,filter,timer=null,unlocked=false,enabled=true,volume=.28,sound=true,hidden=false,playing=false,night=false,festival=false,beat=0,next=0,lastGain=-1,trackId='river';
 let automatic=true,sceneTrack=null,sceneTime=0;
 const voices=new Set(),KEY='block-island-music-preferences';
 try{const p=JSON.parse(localStorage.getItem(KEY));if(p){if(TRACKS.some(t=>t.id===p.track))trackId=p.track;automatic=p.automatic!==false;enabled=p.enabled!==false;if(Number.isFinite(p.volume))volume=Math.max(0,Math.min(1,p.volume))}}catch{}
 function persist(){try{localStorage.setItem(KEY,JSON.stringify({enabled,volume,track:trackId,automatic}))}catch{}}
 function gain(){if(!ctx)return;const value=enabled&&sound&&!hidden?volume*(playing?.42:.17):0;if(value!==lastGain){master.gain.setTargetAtTime(value,ctx.currentTime,.18);lastGain=value}}
 function tone(midi,time,duration,level,soft=false,pan=0){
  const envelope=ctx.createGain(),panner=ctx.createStereoPanner?.();envelope.gain.setValueAtTime(.0001,time);envelope.gain.exponentialRampToValueAtTime(level,time+(soft?.65:.022));envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
  if(panner){panner.pan.value=pan;envelope.connect(panner);panner.connect(bus)}else envelope.connect(bus);
  for(const [multiple,amount] of (soft?[[1,1],[2,.07]]:[[1,1],[2,.18],[3,.045]])){const oscillator=ctx.createOscillator(),partial=ctx.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(frequency(midi)*multiple,time);partial.gain.value=amount;oscillator.connect(partial);partial.connect(envelope);voices.add(oscillator);oscillator.onended=()=>{voices.delete(oscillator);oscillator.disconnect();partial.disconnect();if(![...voices].some(v=>v._envelope===envelope)){envelope.disconnect();panner?.disconnect()}};oscillator._envelope=envelope;oscillator.start(time);oscillator.stop(time+duration+.02);}
 }
 function schedule(){
  if(!ctx||!unlocked||ctx.state!=='running')return;
  if(!enabled||!sound||hidden){next=ctx.currentTime+.08;return;}
  if(next<ctx.currentTime)next=ctx.currentTime+.08;
  while(next<ctx.currentTime+.4){const track=TRACKS.find(t=>t.id===trackId),bar=Math.floor(beat/8)%track.chords.length,index=beat%8,chord=track.chords[bar];
   if(index===0){for(const note of chord)tone(note,next,track.step*8+.4,.055,true,(note%3-1)*.3);tone(chord[0]-12,next,5,.075,true);}
   const note=track.melody[bar][index];if(note!==null)tone(note+(night&&!festival?-12:0),next,festival?2.3:3.7,festival?.15:night?.08:.115,trackId==='deep',Math.sin(beat*.8)*.35);
   if(festival&&index%2===1)tone(chord[index%4]+24,next+.5,1.2,.07,false,-.25);
   beat=(beat+1)%(track.chords.length*8);next+=track.step;
  }
 }
 function start(){try{ctx??=getContext();if(!ctx)return false;if(!bus){bus=ctx.createGain();master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=2800;bus.connect(filter);filter.connect(master);delay=ctx.createDelay(2);delay.delayTime.value=.75;feedback=ctx.createGain();feedback.gain.value=.23;echo=ctx.createGain();echo.gain.value=.24;filter.connect(delay);delay.connect(feedback);feedback.connect(delay);delay.connect(echo);echo.connect(master);next=ctx.currentTime+.08;}unlocked=true;const resume=ctx.resume();resume?.catch?.(()=>{});if(timer===null)timer=setInterval(schedule,200);gain();schedule();return true}catch{return false}}
 function update(state){playing=!!state.playing;night=!!state.night;festival=!!state.festival;hidden=!!state.hidden;if(automatic&&playing&&!hidden&&TRACKS.some(t=>t.id===state.sceneTrack)){if(sceneTrack!==state.sceneTrack){sceneTrack=state.sceneTrack;sceneTime=0;}sceneTime+=state.dt??0;if(sceneTime>=1.2&&trackId!==sceneTrack)changeTrack(sceneTrack);}gain()}
 function setEnabled(value){enabled=!!value;persist();if(enabled)start();gain()}
 function setVolume(value){volume=Math.max(0,Math.min(1,Number(value)||0));persist();if(volume>0&&enabled)start();gain()}
 function changeTrack(id){trackId=id;beat=0;next=ctx?ctx.currentTime+.12:0;for(const voice of voices){try{voice.stop(ctx.currentTime+.12)}catch{}}if(enabled&&unlocked)start();}
 function setTrack(id){if(!TRACKS.some(t=>t.id===id))return false;automatic=false;changeTrack(id);persist();if(enabled)start();return true;}
 function setAutomatic(value){automatic=!!value;sceneTime=0;persist();}
 function nextTrack(){const i=TRACKS.findIndex(t=>t.id===trackId);setTrack(TRACKS[(i+1)%TRACKS.length].id);return TRACKS.find(t=>t.id===trackId);}
 function setSound(value){sound=!!value;gain()}
 function dispose(){clearInterval(timer);timer=null;for(const voice of voices){try{voice.stop()}catch{}}voices.clear();master?.disconnect();bus?.disconnect();filter?.disconnect();delay?.disconnect();feedback?.disconnect();echo?.disconnect()}
 return {start,update,setEnabled,setVolume,setSound,setTrack,nextTrack,setAutomatic,dispose,schedule,get automatic(){return automatic},get track(){return TRACKS.find(t=>t.id===trackId)},get enabled(){return enabled},get volume(){return volume},get playing(){return unlocked&&enabled&&sound&&!hidden},get voiceCount(){return voices.size}};
}
