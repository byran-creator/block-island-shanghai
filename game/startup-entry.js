export function createStartupEntry({document,window,location,MutationObserver,setTimeout,clearTimeout,queueMicrotask}){
 const button=document.getElementById('play'),config=document.getElementById('game-entry'),root=document.documentElement;
 let phase='welcome',entry=null,retryText='',timer,autoEnter=false,closed=false;
 const detail=document.createElement('details'),message=document.createElement('p'),summary=document.createElement('summary');
 detail.hidden=true;detail.id='startup-help';detail.style.cssText='max-width:32rem;margin:12px auto;color:#fff;font-size:13px;line-height:1.6;text-align:left;overflow-wrap:anywhere';summary.textContent='加载帮助 / 错误详情';detail.appendChild(summary);detail.appendChild(message);button.parentNode.insertBefore(detail,button.nextSibling);
 const ready=()=>closed||root.dataset.gameReady==='true';
 function offer(text,reason){if(ready())return;retryText=text;button.textContent=text;button.disabled=false;button.setAttribute('data-startup-retry','true');message.textContent=reason+' 可等待继续加载，或点击上方重试。重试不会清除存档。';detail.hidden=false;}
 function failed(event){if(ready()||!entry)return;if(event.target!==entry&&(!event.filename||event.filename.split('?')[0]!==entry.src.split('?')[0]))return;offer('游戏加载失败 · 点击重新加载',event.message?String(event.message).slice(0,240):'游戏程序未能下载或执行，请检查网络连接。');}
 const observer=new MutationObserver(()=>{if(!retryText||button.textContent===retryText)return;retryText='';button.removeAttribute('data-startup-retry');button.disabled=autoEnter&&!ready();detail.hidden=true;});
 function proceed(){if(root.dataset.gameStarted==='true')return;button.click();}
 function finish(){
  closed=true;phase='ready';root.dataset.bootPhase='ready';clearTimeout(timer);observer.disconnect();detail.hidden=true;retryText='';button.removeAttribute('data-startup-retry');
  entry?.removeEventListener('error',failed);window.removeEventListener('error',failed);button.removeEventListener('click',click,true);document.removeEventListener('block-island-ready',finish);
  if(autoEnter)queueMicrotask(()=>{const notice=document.getElementById('update-dialog');if(notice?.open)notice.addEventListener('close',proceed,{once:true});else proceed();});
 }
 function requestEnter(){
  if(autoEnter)return;autoEnter=true;root.dataset.entryRequested='true';button.disabled=true;
  // Only the real start click activates audio. Preparing the original city
  // background on navigation does not request media playback.
  document.dispatchEvent(new window.Event('block-island-load-start'));
 }
 function start(enter=false){
  if(enter)requestEnter();if(phase!=='welcome')return;
  phase='loading';root.dataset.bootPhase='loading';button.disabled=autoEnter;button.textContent='正在加载城市与建筑…';
  entry=document.createElement('script');entry.id='game-runtime';entry.type='module';entry.src=new URL(config.dataset.src,document.baseURI).href;entry.addEventListener('error',failed);
  timer=setTimeout(()=>{if(ready()||retryText)return;if(button.textContent==='正在加载城市与建筑…')offer('程序下载较慢 · 点击重新加载','游戏主程序尚未完成加载。');else if(button.textContent==='正在初始化画面…')offer('画面初始化尚未完成 · 点击重新加载','当前浏览器还未完成画面初始化。');},30000);
  document.body.appendChild(entry);
 }
 function click(event){if(retryText&&!ready()){event.preventDefault();event.stopImmediatePropagation();location.reload();return;}if(phase!=='ready'){event.preventDefault();event.stopImmediatePropagation();start(true);}}
 window.addEventListener('error',failed);button.addEventListener('click',click,true);document.addEventListener('block-island-ready',finish);observer.observe(button,{childList:true,subtree:true,characterData:true});button.disabled=false;
 // Restore the original live city menu background without waiting for input.
 // Auto preparation never enters a save or activates sound on its own.
 start(false);
 return {start,get phase(){return phase;}};
}
if(typeof document!=='undefined'&&document.getElementById('game-entry')&&document.getElementById('play'))createStartupEntry({document,window,location,MutationObserver,setTimeout,clearTimeout,queueMicrotask});
