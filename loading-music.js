// Temporary playtest excerpt. Served with the game to avoid external redirects.
export const LOADING_SONG={title:'上海滩',artist:'叶丽仪',audio:new URL('./assets/audio/loading-shanghai-4297cd84acac.mp3',import.meta.url).href,source:'https://music.163.com/song?id=5284592'};
export function loadingMusicAllowed(location){return !location.pathname.split('/').at(-1).startsWith('__')&&new URLSearchParams(location.search).get('silent')!=='1';}

export function createLoadingMusic({audio,events,volume=.12,enabled=()=>true,onStatus=()=>{}}){
 let finished=false,armed=false,pending=false,failed=false;
 const gestures=['pointerdown','touchend','keydown','click'];
 function loop(){if(!finished&&audio.currentTime>=22)audio.currentTime=0;}
 function play(){
  if(finished||failed)return;
  if(events.hidden||!enabled()){audio.pause();onStatus(events.hidden?'hidden':'muted');return;}
  const level=typeof volume==='function'?volume():volume;audio.volume=Math.max(0,Math.min(.18,Number.isFinite(level)?level:.12));
  if(audio.volume===0){audio.pause();onStatus('muted');return;}
  if(pending||!audio.paused)return;
  if(!audio.src)audio.src=LOADING_SONG.audio;
  pending=true;
  onStatus('loading');
  try{Promise.resolve(audio.play()).then(()=>{if(finished||events.hidden||!enabled())audio.pause();else onStatus('playing');},error=>{if(finished)return;if(error?.name==='NotAllowedError')onStatus('blocked');else if(error?.name!=='AbortError'){failed=true;onStatus('error');}}).finally(()=>{pending=false;});}
  catch(error){pending=false;if(error?.name==='NotAllowedError')onStatus('blocked');else{failed=true;onStatus('error');}}
 }
 function dispose(){
  if(finished)return;finished=true;audio.pause();audio.removeAttribute('src');audio.load();
  for(const type of gestures)events.removeEventListener(type,play);
  events.removeEventListener('input',play);events.removeEventListener('change',play);
  events.removeEventListener('visibilitychange',play);events.removeEventListener('block-island-enter',dispose);audio.removeEventListener?.('timeupdate',loop);onStatus('stopped');
 }
 function start(){
  if(finished||armed)return;armed=true;audio.preload='metadata';audio.loop=true;
  for(const type of gestures)events.addEventListener(type,play,{passive:true});
  events.addEventListener('input',play);events.addEventListener('change',play);
  events.addEventListener('visibilitychange',play);events.addEventListener('block-island-enter',dispose);audio.addEventListener('timeupdate',loop);play();
 }
 return {start,dispose};
}

// Separate lightweight entry: audio can run while game.js builds the city.
if(typeof document!=='undefined'&&loadingMusicAllowed(location)&&document.getElementById('loading-music-credit')&&document.documentElement.dataset.gameStarted!=='true'){
 const preferences=()=>{try{return JSON.parse(localStorage.getItem('block-island-music-preferences')||'{}')??{};}catch{return {};}};
 const enabled=()=>preferences().enabled!==false&&document.getElementById('music-toggle')?.getAttribute('aria-pressed')!=='false'&&document.getElementById('sound')?.getAttribute('aria-pressed')!=='false';
 const volume=()=>{const saved=preferences().volume,slider=document.getElementById('music-volume');return (Number.isFinite(saved)?saved:slider?Number(slider.value)/100:.28)*.45;};
 const labels={loading:'正在准备配乐',playing:'配乐播放中',blocked:'浏览器等待声音许可 · 轻触任意位置启声',muted:'配乐已静音',hidden:'配乐已暂停',error:'配乐暂不可用',stopped:''};
 const onStatus=state=>{const node=document.getElementById('loading-music-state');if(node)node.textContent=labels[state]??'';};
 const music=createLoadingMusic({audio:new Audio(),events:document,volume,enabled,onStatus});music.start();
}
