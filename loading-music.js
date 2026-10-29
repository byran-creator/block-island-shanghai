// Temporary playtest excerpt. Served with the game to avoid external redirects.
import {primeGameAudioContext} from './audio-context.js';
import {createMobileLayout} from './mobile-layout.js';
export const LOADING_SONG={title:'上海滩',artist:'叶丽仪',audio:new URL('./assets/audio/loading-shanghai-4297cd84acac.mp3',import.meta.url).href,source:'https://music.163.com/song?id=5284592'};
export function loadingMusicAllowed(location){const parts=location.pathname.split('/');return !parts[parts.length-1].startsWith('__')&&new URLSearchParams(location.search).get('silent')!=='1';}

export function createLoadingMusic({audio,events,volume=.12,enabled=()=>true,onStatus=()=>{},activationControl=null}){
 let finished=false,armed=false,pending=false,gesturePending=false,failed=false,attempt=0,bridgeTried=false;
 const gestures=['pointerdown','touchstart','touchend','keydown','click'];
 function loop(){if(!finished&&audio.currentTime>=22)audio.currentTime=0;}
 function play(fromGesture=false){
  if(finished||failed&&!fromGesture)return;
  if(fromGesture===true)failed=false;
  if(events.hidden||!enabled()){attempt++;pending=false;gesturePending=false;audio.pause();onStatus(events.hidden?'hidden':'muted');return;}
  const level=typeof volume==='function'?volume():volume;audio.volume=Math.max(0,Math.min(.18,Number.isFinite(level)?level:.12));
  if(audio.volume===0){attempt++;pending=false;gesturePending=false;audio.pause();onStatus('muted');return;}
  const gesture=fromGesture===true;
  if(pending&&(!gesture||gesturePending)||!pending&&!audio.paused)return;
  if(!audio.src)audio.src=LOADING_SONG.audio;
  const id=++attempt;pending=true;gesturePending=gesture;
  onStatus('loading');
  try{Promise.resolve(audio.play()).then(()=>{if(finished){audio.pause();return;}if(id!==attempt)return;if(events.hidden||!enabled())audio.pause();else onStatus('playing');},error=>{if(finished||id!==attempt)return;if(error?.name==='NotAllowedError')onStatus('blocked');else if(error?.name!=='AbortError'){failed=true;onStatus('error');}}).finally(()=>{if(id===attempt){pending=false;gesturePending=false;}});}
  catch(error){pending=false;if(error?.name==='NotAllowedError')onStatus('blocked');else{failed=true;onStatus('error');}}
 }
 function gesturePlay(){play(true);}
 // Some WeChat WebViews deliver media activation when their bridge becomes
 // ready. Try once in that callback; no SDK, permission calls or polling.
 // A rejection can still recover from the next normal page interaction.
 function bridgeReady(){if(bridgeTried)return;bridgeTried=true;play(true);}
 function dispose(){
  if(finished)return;finished=true;attempt++;audio.pause();audio.removeAttribute('src');audio.load();
  for(const type of gestures)events.removeEventListener(type,gesturePlay,true);
  activationControl?.removeEventListener('click',gesturePlay);
  events.removeEventListener('WeixinJSBridgeReady',bridgeReady);
  events.removeEventListener('input',play);events.removeEventListener('change',play);
  events.removeEventListener('visibilitychange',play);events.removeEventListener('block-island-enter',dispose);audio.removeEventListener?.('timeupdate',loop);onStatus('stopped');
 }
 function start(){
  if(finished||armed)return;armed=true;audio.preload='metadata';audio.loop=true;
  for(const type of gestures)events.addEventListener(type,gesturePlay,{passive:true,capture:true});
  activationControl?.addEventListener('click',gesturePlay);
  events.addEventListener('WeixinJSBridgeReady',bridgeReady);
  events.addEventListener('input',play);events.addEventListener('change',play);
  events.addEventListener('visibilitychange',play);events.addEventListener('block-island-enter',dispose);audio.addEventListener('timeupdate',loop);play();
 }
 return {start,dispose};
}

// Separate lightweight entry: audio can run while game.js builds the city.
if(typeof document!=='undefined'&&loadingMusicAllowed(location)&&(document.currentScript?.id==='loading-music-bootstrap'||document.getElementById('loading-music-credit'))&&document.documentElement.dataset.gameStarted!=='true'){
 const preferences=()=>{try{return JSON.parse(localStorage.getItem('block-island-music-preferences')||'{}')??{};}catch{return {};}};
 const enabled=()=>preferences().enabled!==false&&document.getElementById('music-toggle')?.getAttribute('aria-pressed')!=='false'&&document.getElementById('sound')?.getAttribute('aria-pressed')!=='false';
 const volume=()=>{const saved=preferences().volume,slider=document.getElementById('music-volume');return (Number.isFinite(saved)?saved:slider?Number(slider.value)/100:.28)*.45;};
 let status='';
 const paint=()=>{const credit=document.getElementById('loading-music-credit'),node=document.getElementById('loading-music-state');if(node)node.textContent=status==='playing'?'正在播放':status==='muted'?'配乐已静音':status==='error'?'音乐加载失败':status==='blocked'?'等待浏览器允许播放':'';if(credit)credit.hidden=status==='stopped';};
 const ready=()=>{document.removeEventListener('DOMContentLoaded',ready);paint();};
 const onStatus=state=>{status=state;document.documentElement.dataset.loadingMusicState=state;paint();if(state==='stopped')document.removeEventListener('DOMContentLoaded',ready);};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);
 const music=createLoadingMusic({audio:new Audio(),events:document,volume,enabled,onStatus});
 function begin(){
  document.removeEventListener('block-island-load-start',begin);
  document.removeEventListener('click',welcomeClick,true);
  music.start();
  try{primeGameAudioContext();}catch{}
  if(typeof navigator!=='undefined'&&(navigator.maxTouchPoints>0||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent)))try{
   const layout=createMobileLayout({body:document.body,view:()=>({width:innerWidth,height:innerHeight}),document,orientation:screen.orientation,storage:localStorage});void layout.requestNative();
  }catch{}
 }
 function welcomeClick(event){if(document.documentElement.dataset.gameStarted!=='true'&&event.target.closest?.('#play'))begin();}
 if(document.documentElement.dataset.startGated==='true'){document.addEventListener('click',welcomeClick,true);document.addEventListener('block-island-load-start',begin);}else music.start();
}
