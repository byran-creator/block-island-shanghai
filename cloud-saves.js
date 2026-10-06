const $=id=>document.getElementById(id),DRAFT_KEY='block-island-unsynced-v4',OLD_KEY='block-island-pearl-v3';
export function createCloudSaves({capture,apply,hasStarted,pause,resume,notify}){
 let local=false;const tell=text=>notify(local?text.replaceAll('云端','本地'):text);
 let records=[],ready=false,busy=false,again=false,wasActive=false,lastSaved='',lastAuto=0,draft=null;
 const stamp=date=>new Date(date).toLocaleString('zh-CN',{hour12:false});
 function status(text){if(local)text=text.replaceAll('云端','本地').replaceAll('同步','保存');$('save-status').textContent=text;$('cloud-status').textContent=text;$('cloud-indicator').textContent=text;}
 async function api(path,options={}){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);try{const r=await fetch('/api/saves'+path,{...options,credentials:'same-origin',signal:controller.signal});const result=await r.json();if(result.storage==='local')local=true;if(!r.ok)throw new Error(result.error||'云端存档连接失败');return result;}finally{clearTimeout(timer)}}
 function cache(data){draft=data;try{localStorage.setItem(DRAFT_KEY,JSON.stringify(data))}catch{}}
 function render(){
  $('load-game').disabled=!records.length&&!draft;
  const list=$('save-list');list.replaceChildren();
  if(draft){const row=document.createElement('div');row.className='save-record';const text=document.createElement('p');text.textContent=`未同步的进度 · ${stamp(draft.savedAt)}（仅当前设备）`;const b=document.createElement('button');b.textContent=local?'恢复并保存':'恢复并同步';b.onclick=()=>{close();apply(draft);save('manual')};row.append(text,b);list.append(row)}
  for(const record of records){const row=document.createElement('div');row.className='save-record';const text=document.createElement('p');text.textContent=`${record.kind==='auto'?'自动存档':'手动存档'} · ${stamp(record.savedAt)}\n晶体 ${record.crystals} / 5 · 搭建 ${record.placed} 块${record.best?` · 跑酷 ${record.best.toFixed(2)} 秒`:''}`;const b=document.createElement('button');b.textContent='读取此记录';b.onclick=()=>load(record.id);row.append(text,b);list.append(row)}
  if(!records.length&&!draft){const p=document.createElement('p');p.textContent='还没有存档。开始游戏后每 30 秒自动保存，也可以随时手动保存。';list.append(p)}
 }
 async function refresh(){const result=await api('');records=result.saves||[];render();return records;}
 async function save(kind='auto'){
  if(!hasStarted())return;if(busy){again=kind==='manual'?'manual':again||'auto';cache(capture());return;}busy=true;const data=capture();cache(data);status('正在同步云端…');
  try{const result=await api('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,data})});lastSaved=result.save.savedAt;if(draft?.savedAt===data.savedAt){draft=null;try{localStorage.removeItem(DRAFT_KEY);localStorage.removeItem(OLD_KEY)}catch{}}records=[result.save,...records.filter(r=>r.id!==result.save.id)].slice(0,11);render();status(`云端已保存 · ${stamp(lastSaved)}`);if(kind==='manual')tell('云端存档已保存，记录里可以读取之前的进度。');}
  catch(error){status('同步失败 · 已保留待同步进度');render();if(kind==='manual')tell(error.message);}
  finally{busy=false;if(again){const queued=again;again=false;save(queued)}}
 }
 async function load(id){
  status('正在读取存档…');try{const data=await api('/'+encodeURIComponent(id));close(false);apply(data);draft=null;try{localStorage.removeItem(DRAFT_KEY)}catch{}status(`已读取 · ${stamp(data.savedAt)}`);render();}catch(error){status('读取失败 · 当前游戏保留');tell(error.message)}
 }
 function open(){wasActive=pause();$('saves-dialog').showModal();render();refresh().catch(error=>status(error.message));}
 function close(resumeGame=true){if($('saves-dialog').open)$('saves-dialog').close();if(wasActive&&resumeGame)resume();wasActive=false;}
 $('save-game').onclick=()=>save('manual');$('load-game').onclick=()=>draft?(close(false),apply(draft)):records[0]&&load(records[0].id);$('save-history').onclick=open;$('saves-close').onclick=()=>close();$('saves-dialog').addEventListener('cancel',e=>{e.preventDefault();close()});
 async function init(){
  try{draft=JSON.parse(localStorage.getItem(DRAFT_KEY));if(![3,4,6].includes(draft?.version))draft=null;}catch{}
  try{await refresh();ready=true;if(!records.length){let old;try{old=JSON.parse(localStorage.getItem(OLD_KEY))}catch{}if(old?.version===3){cache(old);render();status('发现旧版存档 · 可在记录里恢复并同步');}else status(draft?'发现待同步进度 · 可在记录里恢复':'自动云端存档已开启');}else status(`最近存档 · ${stamp(records[0].savedAt)}`);}
  catch(error){ready=true;status('云端暂时不可用 · 重连后会同步');render();}
 }
 function tick(dt){if(!ready||!hasStarted())return;lastAuto+=dt;if(lastAuto>=30){lastAuto=0;save('auto')}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&hasStarted())save('auto')});
 window.addEventListener('online',()=>{if(hasStarted())save('auto');else init()});
 const initialized=init();async function continueLatest(){await initialized;if(draft){close(false);apply(draft);status('已恢复待同步的进度');return true;}if(records[0]){await load(records[0].id);return true;}return false;}return {save,tick,open,continueLatest,get busy(){return busy}};
}
