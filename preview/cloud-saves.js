const $=id=>document.getElementById(id),DRAFT_KEY='block-island-unsynced-v4',OLD_KEY='block-island-pearl-v3',BACKUP_KEY='block-island-before-import-v1';
export function createCloudSaves({capture,apply,hasStarted,pause,resume,notify}){
 const browserOnly=typeof location!=='undefined'&&(location.hostname.endsWith('.github.io')||location.protocol==='file:')||document.querySelector?.('meta[name="block-island-storage"]')?.content==='browser';
 let local=browserOnly,remoteReady=false,sessionResolved=false;
 const tell=text=>notify(local?text.replaceAll('云端','本地'):text);
 let records=[],ready=false,busy=false,again=false,wasActive=false,lastSaved='',lastAuto=0,draft=null,importBackup=null;
 const stamp=date=>new Date(date).toLocaleString('zh-CN',{hour12:false});
 function status(text){if(local)text=text.replaceAll('云端','本地').replaceAll('同步','保存');$('save-status').textContent=text;$('cloud-status').textContent=text;$('cloud-indicator').textContent=text;}
 async function api(path,options={}){
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
  try{
   const r=await fetch('/api/saves'+path,{...options,credentials:'same-origin',signal:controller.signal});
   const ct=r.headers?.get?.('content-type')||'';
   if(!ct.includes('json'))throw new Error('存档服务暂时不可用，当前进度会保留在本机。');
   const result=await r.json();
   if(result.storage==='local')local=true;
   if(!r.ok)throw new Error(result.error||'云端存档连接失败');
   return result;
  }finally{clearTimeout(timer);}
 }
 function cache(data){draft=data;try{localStorage.setItem(DRAFT_KEY,JSON.stringify(data));return true;}catch{return false;}}
 function render(){
  $('load-game').disabled=!records.length&&!draft;
  const list=$('save-list');list.replaceChildren();
  if(draft){const row=document.createElement('div');row.className='save-record';const text=document.createElement('p');text.textContent=`${browserOnly?'本机进度':'待同步的进度'} · ${stamp(draft.savedAt)}（仅当前设备）`;const b=document.createElement('button');b.textContent=local?'继续游玩':'恢复并同步';b.onclick=()=>{sessionResolved=true;close(false);apply(draft);save('manual')};row.append(text,b);list.append(row)}
  if(importBackup){const row=document.createElement('div'),p=document.createElement('p'),b=document.createElement('button');row.className='save-record';p.textContent='导入前的本机备份 · '+stamp(importBackup.savedAt);b.textContent='恢复导入前的进度';b.onclick=()=>{close(false);apply(importBackup);sessionResolved=true;const durable=cache(importBackup);render();status(durable?'已恢复导入前的进度':'已恢复 · 本机空间不足，请导出存档');};row.append(p,b);list.append(row);}
  for(const record of records){const row=document.createElement('div');row.className='save-record';const text=document.createElement('p');text.textContent=`${record.kind==='auto'?'自动存档':'手动存档'} · ${stamp(record.savedAt)}\n晶体 ${record.crystals} / 5 · 搭建 ${record.placed} 块${record.best?` · 跑酷 ${record.best.toFixed(2)} 秒`:''}`;const b=document.createElement('button');b.textContent='读取此记录';b.onclick=()=>load(record.id);row.append(text,b);list.append(row)}
  if(!records.length&&!draft){const p=document.createElement('p');p.textContent='还没有存档。开始游戏后每 30 秒自动保存，也可以随时手动保存。';list.append(p)}
 }
 async function refresh(){if(browserOnly){render();return records;}const result=await api('');records=result.saves||[];remoteReady=true;render();return records;}
 async function save(kind='auto'){
  if(!hasStarted())return;
  const data=capture(),durable=cache(data);render();
  if(browserOnly){lastSaved=data.savedAt||new Date().toISOString();status(durable?`本机已保存 · ${stamp(lastSaved)} · 不跨网址同步`:'本机存储空间不足 · 进度仅在内存，请导出存档');if(kind==='manual')tell(durable?'本机存档已保存，也可导出文件备份。':'本机保存失败，请先导出存档。');return durable;}
  if(busy){again=kind==='manual'?'manual':again||'auto';return;}
  busy=true;status('正在同步云端…');
  try{if(!remoteReady)await refresh();if(kind==='auto'&&!sessionResolved&&records.length)throw new Error('发现原有云端记录，请先读取；当前游玩进度已保留在本机。');const result=await api('',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind,data})});sessionResolved=true;lastSaved=result.save.savedAt;if(draft===data){draft=null;try{localStorage.removeItem(DRAFT_KEY);localStorage.removeItem(OLD_KEY)}catch{}}records=[result.save,...records.filter(r=>r.id!==result.save.id)].slice(0,11);render();status(`云端已保存 · ${stamp(lastSaved)}`);if(kind==='manual')tell('云端存档已保存，记录里可以读取之前的进度。');}
  catch(error){status(durable?'同步失败 · 已保留本机待同步进度':'同步失败且本机存储已满 · 请导出存档');render();if(kind==='manual')tell(error.message);}
  finally{busy=false;if(again){const queued=again;again=false;save(queued)}}
 }
 async function load(id){
  status('正在读取存档…');try{const data=await api('/'+encodeURIComponent(id));if(!valid(data))throw new Error('存档内容不完整。');close(false);apply(data);sessionResolved=true;draft=null;try{localStorage.removeItem(DRAFT_KEY)}catch{}status(`已读取 · ${stamp(data.savedAt)}`);render();return true;}catch(error){status('读取失败 · 当前游戏保留');tell(error.message);return false;}
 }
 function open(){wasActive=pause();$('saves-dialog').showModal();render();refresh().catch(error=>status(error.message));}
 function close(resumeGame=true){if($('saves-dialog').open)$('saves-dialog').close();if(wasActive&&resumeGame)resume();wasActive=false;}
 $('save-game').onclick=()=>save('manual');$('load-game').onclick=()=>draft?(sessionResolved=true,close(false),apply(draft)):records[0]&&load(records[0].id);$('save-history').onclick=open;$('saves-close').onclick=()=>close();$('saves-dialog').addEventListener('cancel',e=>{e.preventDefault();close()});
 async function init(){
  try{draft=JSON.parse(localStorage.getItem(DRAFT_KEY));if(!valid(draft))draft=null;importBackup=JSON.parse(localStorage.getItem(BACKUP_KEY));if(!valid(importBackup))importBackup=null;}catch{}
  if($('save-description'))$('save-description').textContent=browserOnly?'本网址保留当前浏览器的最新进度，不与其他网址自动同步。切换网址或设备前请导出文件，在另一个入口导入；导入前的进度会保留一份本机备份。':'每30秒自动保存，云端保留最近10条手动记录。两个网址不自动同步，导出、导入可用于迁移，原存档也可继续在本网址读取。';
  if(browserOnly){ready=true;render();$('save-game').textContent='手动本机保存';status(draft?'发现本机进度 · 可继续游玩':'本机存档已就绪 · 可导出文件，两个网址不自动同步');return;}
  try{await refresh();ready=true;if(!records.length){let old;try{old=JSON.parse(localStorage.getItem(OLD_KEY))}catch{}if(old?.version===3){cache(old);render();status('发现旧版存档 · 可在记录里恢复并同步');}else status(draft?'发现待同步进度 · 可在记录里恢复':'自动云端存档已开启');}else status(`最近存档 · ${stamp(records[0].savedAt)}`);}
  catch(error){ready=true;status('云端暂时不可用 · 保留本机进度，恢复网络后重试');render();}
 }
 function tick(dt){if(!ready||!hasStarted())return;lastAuto+=dt;if(lastAuto>=30){lastAuto=0;save('auto')}}
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&hasStarted())save('auto')});
 window.addEventListener('online',()=>{if(hasStarted())save('auto');else init()});
 const initialized=init();
 async function continueLatest(){
  if(draft){sessionResolved=true;close(false);apply(draft);status('已恢复本机进度');return true;}
  await initialized;
  if(draft){sessionResolved=true;close(false);apply(draft);return true;}
  if(records[0]){if(await load(records[0].id))return true;throw new Error('存档读取失败，请重试“继续最近存档”。');}
  sessionResolved=remoteReady||browserOnly;
  return false;
 }
 function valid(data){return [3,4,6].includes(data?.version)&&data.pos&&['x','y','z'].every(k=>Number.isFinite(data.pos[k])&&Math.abs(data.pos[k])<10000)&&Array.isArray(data.edits)&&data.edits.length<=60000&&data.edits.every(e=>Array.isArray(e)&&e.length===2&&typeof e[0]==='string'&&/^-?\d+,-?\d+,-?\d+$/.test(e[0])&&e[0].split(',').every(v=>Number.isSafeInteger(Number(v))&&Math.abs(Number(v))<10000)&&Number.isInteger(e[1])&&e[1]>=0&&e[1]<256)&&Array.isArray(data.adventure?.state?.collected);}
 const exportButton=$('export-save'),importButton=$('import-save'),fileInput=$('import-save-file');
 if(exportButton)exportButton.onclick=async()=>{await initialized;let data=hasStarted()?capture():draft;if(!data&&records[0])try{data=await api('/'+encodeURIComponent(records[0].id));}catch(error){tell(error.message);return;}if(!valid(data)){tell('当前还没有可导出的完整存档。');return;}const url=URL.createObjectURL(new Blob([JSON.stringify(data)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download='上海小岛-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 if(importButton&&fileInput){importButton.onclick=()=>fileInput.click();fileInput.onchange=async()=>{const file=fileInput.files?.[0];if(!file)return;try{if(file.size>3000000)throw new Error('存档文件过大。');const data=JSON.parse(await file.text());if(!valid(data))throw new Error('请选择从小岛导出的完整存档文件。');const previous=hasStarted()?capture():draft;if(valid(previous)){try{localStorage.setItem(BACKUP_KEY,JSON.stringify(previous));importBackup=previous;}catch{throw new Error('无法保留导入前备份，请先导出现有进度并释放本机存档空间。');}}close(false);apply(data);sessionResolved=true;const durable=cache(data);render();status(durable?'已导入本机进度 · 可继续游玩或手动保存':'已导入 · 本机空间不足，请保留原文件');}catch(error){tell(error.message);}finally{fileInput.value='';}};}
 return {save,tick,open,continueLatest,get busy(){return busy}};
}
