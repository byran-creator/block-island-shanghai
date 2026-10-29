import {primeStartupPointer} from './startup-pointer.js';
import {createWelcomeLayout} from './mobile-layout.js';
import {createWelcomeNotice} from './welcome-notice.js';
export function createStartupEntry({document,window,location,MutationObserver,setTimeout,clearTimeout,queueMicrotask}){
 const button=document.getElementById('play'),config=document.getElementById('game-entry'),root=document.documentElement;
 let phase='welcome',entry=null,retryText='',timer,autoEnter=false,closed=false;
 const detail=document.createElement('details'),message=document.createElement('p'),summary=document.createElement('summary');
 const progress=document.createElement('div'),fill=document.createElement('div');progress.hidden=true;progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','加载阶段进度');progress.style.cssText='height:5px;margin:10px 2px;border-radius:4px;background:#102b3780;overflow:hidden';fill.style.cssText='height:100%;width:0%;background:#d5fd87;transition:width .4s';progress.appendChild(fill);button.parentNode.insertBefore(progress,button.nextSibling);
 let lastStage='',stageAmount=0;function updateProgress(){const stage=button.textContent;if(stage===lastStage||retryText||ready())return;lastStage=stage;let amount=stage.includes('初始化画面')?10:stage.includes('读取城市缓存')?18:stage.includes('读取地图')?25:stage.includes('地貌')?35:stage.includes('外滩')?45:stage.includes('南京路')?60:stage.includes('豫园')?72:stage.includes('整理画面')?85:stage.includes('补齐')?92:0;stageAmount=Math.max(stageAmount,amount);fill.style.width=stageAmount+'%';progress.setAttribute('aria-valuenow',String(stageAmount));clearTimeout(timer);timer=setTimeout(()=>{if(!ready()&&!retryText)offer('加载暂时没有进展 · 点击重试','当前阶段长时间没有变化，可能是网络较慢或设备仍在处理。');},30000);}
 detail.hidden=true;detail.id='startup-help';detail.style.cssText='max-width:32rem;margin:12px auto;color:#fff;font-size:13px;line-height:1.6;text-align:left;overflow-wrap:anywhere';summary.textContent='加载帮助 / 错误详情';detail.appendChild(summary);detail.appendChild(message);button.parentNode.insertBefore(detail,button.nextSibling);
 const ready=()=>closed||root.dataset.gameReady==='true';
 function offer(text,reason){if(ready())return;retryText=text;button.textContent=text;button.disabled=false;button.setAttribute('data-startup-retry','true');message.textContent=reason+' 可等待继续加载，或点击上方重试。重试不会清除存档。';detail.hidden=false;}
 function failed(event){if(ready()||!entry)return;if(event.target!==entry&&(!event.filename||event.filename.split('?')[0]!==entry.src.split('?')[0]))return;offer('游戏加载失败 · 点击重新加载',event.message?String(event.message).slice(0,240):'游戏程序未能下载或执行，请检查网络连接。');}
 const observer=new MutationObserver(()=>{if(retryText){if(button.textContent===retryText)return;retryText='';button.removeAttribute('data-startup-retry');button.disabled=!ready();detail.hidden=true;}updateProgress();});
 function proceed(){if(root.dataset.gameStarted==='true')return;button.click();}
 function finish(){
  closed=true;phase='ready';progress.hidden=true;root.dataset.bootPhase='ready';clearTimeout(timer);observer.disconnect();detail.hidden=true;retryText='';button.removeAttribute('data-startup-retry');
  entry?.removeEventListener('error',failed);window.removeEventListener('error',failed);button.removeEventListener('click',click,true);document.removeEventListener('block-island-ready',finish);
  if(autoEnter)queueMicrotask(()=>{const notice=document.getElementById('update-dialog');if(notice?.open)notice.addEventListener('close',proceed,{once:true});else proceed();});
 }
 function start(enter=true){
  if(phase!=='welcome')return;
  phase='loading';autoEnter=enter;root.dataset.bootPhase='loading';root.dataset.entryRequested=String(enter);button.disabled=true;button.textContent='正在加载城市与建筑…';
  // Dispatch synchronously inside the real welcome click. The audio element
  // and WebAudio context are activated before any city request/evaluation.
  document.dispatchEvent(new window.Event('block-island-load-start'));
  if(enter)primeStartupPointer(document,window.navigator);
  // Native button focus can scroll the compact mobile card before this click.
  const menu=document.getElementById('menu');if(menu)menu.scrollTop=0;
  entry=document.createElement('script');entry.id='game-runtime';entry.type='module';entry.src=new URL(config.dataset.src,document.baseURI).href;entry.addEventListener('error',failed);
  progress.hidden=false;updateProgress();
  document.body.appendChild(entry);
 }
 function click(event){if(retryText&&!ready()){event.preventDefault();event.stopImmediatePropagation();location.reload();return;}if(phase==='welcome'){event.preventDefault();event.stopImmediatePropagation();start();}}
 window.addEventListener('error',failed);button.addEventListener('click',click,true);document.addEventListener('block-island-ready',finish);observer.observe(button,{childList:true,subtree:true,characterData:true});button.disabled=false;
 // Explicit diagnostic pages retain their existing auto-load/quiet readiness
 // contract. They never count as a successful user-gesture audio test.
 if(location.pathname.split('/').pop().startsWith('__'))start(false);
 return {start,get phase(){return phase;}};
}
if(typeof document!=='undefined'&&document.getElementById('game-entry')&&document.getElementById('play')){
 let noticeStorage;try{noticeStorage=window.localStorage;}catch{}createWelcomeNotice({document,storage:noticeStorage});
 try{let storage;try{storage=window.localStorage;}catch{}createWelcomeLayout({mobile:window.navigator.maxTouchPoints>0||/Android|iPhone|iPad|iPod|Mobile/i.test(window.navigator.userAgent),body:document.body,view:()=>({width:innerWidth,height:innerHeight}),document,orientation:screen.orientation,storage,events:window});}catch{}
 createStartupEntry({document,window,location,MutationObserver,setTimeout,clearTimeout,queueMicrotask});
}
