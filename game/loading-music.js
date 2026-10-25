// Official external playback, not a redistributed or cached recording.
export const LOADING_SONG={title:'上海滩',artist:'叶丽仪',audio:'https://music.163.com/song/media/outer/url?id=5284592.mp3',source:'https://music.163.com/song?id=5284592'};
export function loadingMusicAllowed(location){return !location.pathname.split('/').at(-1).startsWith('__')&&new URLSearchParams(location.search).get('silent')!=='1';}

export function createLoadingMusic({audio,events,volume=.12,enabled=()=>true}){
 let finished=false,armed=false,pending=false,failed=false;
 const gestures=['pointerdown','touchend','keydown','click'];
 function loop(){if(!finished&&audio.currentTime>=22)audio.currentTime=0;}
 function play(){
  if(finished||failed)return;
  if(events.hidden||!enabled()){audio.pause();return;}
  const level=typeof volume==='function'?volume():volume;audio.volume=Math.max(0,Math.min(.18,Number.isFinite(level)?level:.12));
  if(audio.volume===0){audio.pause();return;}
  if(pending||!audio.paused)return;
  pending=true;
  try{Promise.resolve(audio.play()).then(()=>{if(finished||events.hidden||!enabled())audio.pause();},error=>{if(!finished&&error?.name!=='NotAllowedError'&&error?.name!=='AbortError')failed=true;}).finally(()=>{pending=false;});}
  catch(error){pending=false;if(error?.name!=='NotAllowedError')failed=true;}
 }
 function dispose(){
  if(finished)return;finished=true;audio.pause();audio.removeAttribute('src');audio.load();
  for(const type of gestures)events.removeEventListener(type,play);
  events.removeEventListener('input',play);events.removeEventListener('change',play);
  events.removeEventListener('visibilitychange',play);events.removeEventListener('block-island-ready',dispose);audio.removeEventListener?.('timeupdate',loop);
 }
 function start(){
  if(finished||armed)return;armed=true;audio.preload='none';audio.loop=true;audio.src=LOADING_SONG.audio;
  for(const type of gestures)events.addEventListener(type,play,{passive:true});
  events.addEventListener('input',play);events.addEventListener('change',play);
  events.addEventListener('visibilitychange',play);events.addEventListener('block-island-ready',dispose);audio.addEventListener('timeupdate',loop);play();
 }
 return {start,dispose};
}

// Separate lightweight entry: audio can run while game.js builds the city.
if(typeof document!=='undefined'&&loadingMusicAllowed(location)&&document.getElementById('loading-music-credit')&&document.documentElement.dataset.gameReady!=='true'){
 const preferences=()=>{try{return JSON.parse(localStorage.getItem('block-island-music-preferences')||'{}')??{};}catch{return {};}};
 const enabled=()=>preferences().enabled!==false&&document.getElementById('music-toggle')?.getAttribute('aria-pressed')!=='false'&&document.getElementById('sound')?.getAttribute('aria-pressed')!=='false';
 const volume=()=>{const saved=preferences().volume,slider=document.getElementById('music-volume');return (Number.isFinite(saved)?saved:slider?Number(slider.value)/100:.28)*.45;};
 const music=createLoadingMusic({audio:new Audio(),events:document,volume,enabled});music.start();
}
