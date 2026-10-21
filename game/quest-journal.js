import {routeBearing,controlInstruction} from './quest-route-hint.js';
import {itemImage} from './item-catalog.js';
import {CITY_QUESTS,CityQuestState} from './city-quests.js';
import {BLOCKS} from './world.js';
import {questTarget} from './quest-guidance.js';
import * as THREE from './three.module.js';
export function createQuestJournal({pause,resume,grant,notify,onProgress=()=>{},canOpen=()=>true,scene=null,getContext=()=>null,getYaw=()=>0,getStory=()=>null,getJourney=()=>null,onJourneyAction=()=>{},onTrack=()=>{},openMap=()=>{}}){
 const $=id=>document.getElementById(id),state=new CityQuestState();let panel=false,clock=0,marker=null,selected=null,category='all',openedOnce=false;
 // Follow the real tracker height, including wrapping and manual dragging.
 // Observe layout changes rather than measuring during every game frame.
 const tracker=$('quest-tracker'),syncCoordinates=()=>{
  if(!tracker||tracker.hidden)return;
  document.documentElement.style.setProperty('--quest-coordinate-top',Math.min(tracker.getBoundingClientRect().bottom+12,innerHeight-28)+'px');
 };
 if(tracker&&typeof ResizeObserver!=='undefined')new ResizeObserver(syncCoordinates).observe(tracker);
 if(tracker&&typeof MutationObserver!=='undefined')new MutationObserver(syncCoordinates).observe(tracker,{attributes:true,attributeFilter:['style','hidden']});
 if(typeof window!=='undefined')window.addEventListener('resize',syncCoordinates);
 if(scene){
  const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');
  ctx.beginPath();ctx.moveTo(64,10);ctx.lineTo(118,64);ctx.lineTo(64,118);ctx.lineTo(10,64);ctx.closePath();
  ctx.lineJoin='round';ctx.shadowColor='#17202d';ctx.shadowBlur=8;ctx.strokeStyle='#94691f';ctx.lineWidth=13;ctx.stroke();ctx.shadowBlur=0;ctx.strokeStyle='#ffe49a';ctx.lineWidth=6;ctx.stroke();
  ctx.beginPath();ctx.moveTo(64,47);ctx.lineTo(81,64);ctx.lineTo(64,81);ctx.lineTo(47,64);ctx.closePath();ctx.fillStyle='#f7d474';ctx.fill();
  marker=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false,fog:false}));marker.name='tracked-quest-marker';marker.scale.set(.32,.32,1);marker.visible=false;scene.add(marker);
 }
 const rewards=r=>[...Object.entries(r.blocks??{}).map(([id,n])=>BLOCKS[id].name+' ×'+n),r.food&&'食物 ×'+r.food,r.wool&&'羊毛 ×'+r.wool,r.pearls&&'珍珠 ×'+r.pearls].filter(Boolean).join(' · ');
 function target(){const main=getStory();if(main?.goal)return main.goal;const context=getContext();return state.tracked&&!state.done(state.tracked)&&context?questTarget(state.tracked,context):null;}
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 function placeLabel(goal,fallback){const p=getContext()?.pos;return goal?goal.label+(p?' · 距你 '+Math.round(Math.hypot(goal.x-p.x,goal.z-p.z))+' 格':''):fallback;}
 function updateLauncher(){const done=CITY_QUESTS.filter(q=>state.done(q.id)).length,ready=CITY_QUESTS.filter(q=>state.done(q.id)&&!state.claimed.has(q.id)).length,j=getJourney();$('task-count').textContent=done+' / '+CITY_QUESTS.length;$('task-open').textContent=j&&!j.unlocked&&j.phase!=='new'?'I 新手旅程 · '+Math.min(j.index+1,2)+' / 2':'I 旅程与委托'+(ready?' · '+ready+'项奖励':'');return {done,ready,j};}
 function render(){
  const {done,ready,j}=updateLauncher();$('task-summary').textContent='主线与城市委托随当前存档保存 · 支线 '+done+' / '+CITY_QUESTS.length+' · 待领取 '+ready+' 项';
  const filters=$('task-categories');filters.replaceChildren();for(const [id,label]of [['all','全部'],['main','主线'],['city','城市'],['survival','生存'],['done','已完成']]){const b=el('button',label);b.setAttribute('aria-pressed',String(category===id));b.onclick=()=>{category=id;selected=null;render();};filters.append(b);}
  const rows=[];if(j&&(category==='all'||category==='main'||category==='done'&&j.complete))rows.push({id:'journey',name:'初到上海 · 一张明信片',kind:j.unlocked?'主线旅程':'新手引导',status:j.complete?'已完成 · 纪念卡已领取':j.phase==='new'?'旧存档可自由加入':j.chapter.title,progress:j.index+' / '+j.chapters.length});
  for(const q of CITY_QUESTS){const survival=q.id.startsWith('survival-'),finished=state.done(q.id);if(category==='main'||category==='city'&&survival||category==='survival'&&!survival||category==='done'&&!finished)continue;rows.push({id:q.id,name:q.title,kind:survival?'生存探索':'城市委托',status:state.claimed.has(q.id)?'已领取':finished?'可领取奖励':state.tracked===q.id?'正在追踪':'进行中',progress:Math.min(q.target,state.progress[q.id]??0)+' / '+q.target});}
  if(!rows.some(r=>r.id===selected))selected=rows[0]?.id;$('task-list').replaceChildren();
  for(const row of rows){const b=el('button',null,'quest-row');if(row.id==='journey')b.id='journey-journal';b.setAttribute('aria-current',String(selected===row.id));b.append(el('small',row.kind,'quest-kind'),el('strong',row.name),el('small',row.status+' · '+row.progress));b.onclick=()=>{selected=row.id;render();};$('task-list').append(b);}
  const detail=$('task-detail');detail.replaceChildren();if(!rows.length){detail.append(el('h3','暂时没有这一类任务'),el('p','可以切换分类，或继续自由探索。'));return;}
  const controls=el('div',null,'quest-detail-actions'),add=(text,fn,primary=false)=>{const b=el('button',text,primary?'primary':'');b.onclick=fn;controls.append(b);return b;};
  function rewardTiles(items,heading='任务奖励'){detail.append(el('h4',heading));const grid=el('div',null,'quest-rewards');for(const item of items){const tile=el('span',null,'quest-reward-tile');tile.append(itemImage(item.key),el('span',item.text));grid.append(tile);}detail.append(grid);}
  if(selected==='journey'){
   detail.append(el('small',j.unlocked?'主线旅程 / 初到上海':'新手引导 / 前两章'),el('h3',j.complete?'这一次，记住上海':j.chapter.title),el('p',placeLabel(j.goal,'旅程纪念册'),'quest-place'),el('p',j.complete?'十章旅程完成，纪念卡已在 O 背包。':j.goal?.instruction??j.chapter.hint,'quest-objective'),el('p',j.phase==='new'?'收下一张明信片，跟随外滩志愿者开始认识上海。已有建造与其他任务照常保留。':j.unlocked?'你已经可以自由安排旅程。逛南京路、去陆家嘴登高，再到豫园赏景品茶；主线不会因绕路而丢失。':'先和林阿姨打招呼，再到南京路买一份喜欢的商品。完成这两章后，可自由探索或继续主线。','quest-description'));
   rewardTiles([{key:'souvenir',text:j.reward+' × 1'},{key:'gift',text:'江风 / 灯火 / 茶香 · 自选纪念'}],'完成十章旅程后获得');
   const chapters=el('details'),summary=el('summary','查看十章旅程 · '+j.index+' / '+j.chapters.length);chapters.append(summary);for(const [i,c]of j.chapters.entries())chapters.append(el('p',(i<j.index?'✓ ':i===j.index?'◆ ':'○ ')+(i+1)+'. '+c.title));detail.append(chapters);
   const act=action=>{close();onJourneyAction(action);};if(j.phase==='new')add('开启新手旅程',()=>act('start'),true);else if(j.complete){add('查看纪念卡与结算',()=>act('recap'),true);add('重看终章',()=>act('film'));}else{add(j.unlocked?'继续主线':'继续新手引导',()=>act('track'),true);if(j.tracked)add('暂时收起追踪',()=>act('stop'));add('地图查看',()=>{onJourneyAction('track');close();openMap();});}
   if(!j.complete&&j.index<5)add(j.trailEnabled===false?'开启地面方向箭头':'收起地面方向箭头',()=>{onJourneyAction('trail');render();});add('上海旅行手账 · N',()=>act('book'));if(j.replaying)add('结束本次重游',()=>act('stop-replay'));
  }else{
   const q=CITY_QUESTS.find(q=>q.id===selected),goal=questTarget(q.id,getContext()??{}),finished=state.done(q.id),claimed=state.claimed.has(q.id);detail.append(el('small',q.id.startsWith('survival-')?'生存探索':'城市委托'),el('h3',q.title),el('p',placeLabel(goal,'完成后可在此领取'),'quest-place'),el('p',finished?'任务已完成':goal?.instruction??q.description,'quest-objective'),el('p',q.description,'quest-description'));rewardTiles([...Object.entries(q.reward.blocks??{}).map(([id,n])=>({key:'block:'+id,text:BLOCKS[id].name+' × '+n})),...['food','wool','pearls'].filter(k=>q.reward[k]).map(key=>({key,text:({food:'食物',wool:'羊毛',pearls:'海珍珠'})[key]+' × '+q.reward[key]}))]);if(finished){const b=add(claimed?'奖励已领取':'领取奖励',()=>{const r=state.claim(q.id);if(!r)return;grant(r);render();onProgress();notify('已领取「'+q.title+'」奖励：'+rewards(r));},true);b.disabled=claimed;}else{add(state.tracked===q.id?'停止追踪':'追踪目标',()=>{track(state.tracked===q.id?null:q.id);close();},true);add('地图查看',()=>{track(q.id);close();openMap();});}
  }detail.append(controls);
 }

 function track(id){const main=getStory();if(!state.track(id)&&!main)return;onTrack(id);render();onProgress();if(id)notify('已追踪「'+CITY_QUESTS.find(q=>q.id===id).title+'」 · M 地图看黄色目标');}
 function tick(dt,playing=true){
  const hud=$('quest-tracker');if(!playing){if(hud)hud.hidden=true;document.body.classList.remove('has-tracker');if(marker)marker.visible=false;return;}clock+=dt;if(clock<.2)return;clock=0;
  const main=getStory(),q=main?.goal?{title:main.title,description:main.goal.instruction}:CITY_QUESTS.find(q=>q.id===state.tracked),goal=target(),context=getContext();if(hud){hud.hidden=!q;document.body.classList.toggle('has-tracker',!!q);if(q){$('tracked-title').textContent=q.title;const bearing=routeBearing(goal,context?.pos,getYaw()),touch=document.body.classList.contains('touch')||document.body.classList.contains('force-landscape');const instruction=bearing.near&&goal?.arrivalAction==='talk'?(touch?'就在这里，点右侧「互动 V」开始对话。':'就在这里，按 V 开始对话。'):goal?.instruction??q.description;$('tracked-step').textContent=controlInstruction(state.done(q.id)?'任务完成！按 I 领取奖励，然后继续下一项。':instruction,touch);$('tracked-place').textContent=goal?bearing.text+' · '+goal.label:'I 领取奖励';if($('tracked-arrow'))$('tracked-arrow').style.transform=goal?'rotate('+bearing.angle+'deg)':'none';}}
  if(marker){marker.visible=!!goal&&!goal.npcTarget&&!!context?.pos&&Math.hypot(goal.x-context.pos.x,goal.z-context.pos.z)<90;if(goal)marker.position.set(goal.x,goal.y+2.48,goal.z);}
 }
 function changed(ok){if(!ok)return;render();onProgress();}
 function close(){if(!panel)return;panel=false;$('tasks-dialog').close();resume();}
 function open(){if(panel){close();return;}if(!canOpen())return;if(!openedOnce&&getJourney()){selected='journey';category='all';}openedOnce=true;pause();panel=true;render();$('tasks-dialog').showModal();}
 $('task-open').onclick=open;if($('tracked-title')){$('tracked-title').style.cursor='pointer';$('tracked-title').title='点击打开任务与委托 (快捷键 I)';$('tracked-title').onclick=open;}if(document.querySelector('.quest-tracker-icon')){document.querySelector('.quest-tracker-icon').style.cursor='pointer';document.querySelector('.quest-tracker-icon').onclick=open;}$('tasks-close').onclick=close;$('tasks-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});if($('quest-map'))$('quest-map').onclick=openMap;if($('quest-stop'))$('quest-stop').onclick=()=>track(null);render();
 return {refresh:()=>{if(panel)render();else updateLauncher();},state,open,close,track,tick,target,isPanelOpen:()=>panel,record:e=>changed(state.record(e)),setBuildCount:n=>changed(state.set('build',n)),serialize:()=>state.serialize(),restore:(d,legacy)=>{state.restore(d,legacy);render();}};
}
