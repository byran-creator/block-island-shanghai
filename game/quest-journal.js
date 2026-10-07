import {CITY_QUESTS,CityQuestState} from './city-quests.js';
import {BLOCKS} from './world.js';
import {questTarget} from './quest-guidance.js';
import * as THREE from './three.module.js';
export function createQuestJournal({pause,resume,grant,notify,onProgress=()=>{},canOpen=()=>true,scene=null,getContext=()=>null,getYaw=()=>0,openMap=()=>{}}){
 const $=id=>document.getElementById(id),state=new CityQuestState();let panel=false,clock=0,marker=null;
 if(scene){const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#1b333bd9';ctx.fillRect(25,25,78,78);ctx.fillStyle='#ffdb69';ctx.font='bold 82px sans-serif';ctx.textAlign='center';ctx.fillText('◆',64,94);marker=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthWrite:false,fog:false}));marker.name='tracked-quest-marker';marker.scale.set(1.2,1.2,1);marker.visible=false;scene.add(marker);}
 const rewards=r=>[...Object.entries(r.blocks??{}).map(([id,n])=>BLOCKS[id].name+' ×'+n),r.food&&'食物 ×'+r.food,r.wool&&'羊毛 ×'+r.wool,r.pearls&&'珍珠 ×'+r.pearls].filter(Boolean).join(' · ');
 function target(){const context=getContext();return state.tracked&&!state.done(state.tracked)&&context?questTarget(state.tracked,context):null;}
 function render(){
  const done=CITY_QUESTS.filter(q=>state.done(q.id)).length,ready=CITY_QUESTS.filter(q=>state.done(q.id)&&!state.claimed.has(q.id)).length;
  $('task-count').textContent=done+' / '+CITY_QUESTS.length;$('task-summary').textContent='已完成 '+done+' / '+CITY_QUESTS.length+' · 待领取 '+ready+' 项';$('task-open').textContent='I 城市任务 '+done+'/'+CITY_QUESTS.length+(ready?' · '+ready+'项奖励':'');$('task-list').replaceChildren();
  for(const q of CITY_QUESTS){
   const row=document.createElement('article');row.className='task-card'+(state.done(q.id)?' done':'')+(state.tracked===q.id?' tracked':'');const title=document.createElement('h3');title.textContent=q.title;const desc=document.createElement('p');desc.textContent=q.description;const reward=document.createElement('p');reward.className='task-reward';reward.textContent='奖励：'+rewards(q.reward);const status=document.createElement('span');status.textContent=Math.min(q.target,state.progress[q.id]??0)+' / '+q.target;
   const follow=document.createElement('button');follow.id='track-'+q.id;follow.className='task-track';follow.textContent=state.tracked===q.id?'停止追踪':'追踪目标';follow.disabled=state.claimed.has(q.id);follow.onclick=()=>{track(state.tracked===q.id?null:q.id);};
   const map=document.createElement('button');map.className='task-map';map.textContent='地图查看';map.disabled=state.done(q.id);map.onclick=()=>{track(q.id);close();openMap();};
   const button=document.createElement('button');button.textContent=state.claimed.has(q.id)?'已领取':state.done(q.id)?'领取奖励':'进行中';button.disabled=!state.done(q.id)||state.claimed.has(q.id);button.onclick=()=>{const r=state.claim(q.id);if(!r)return;grant(r);render();onProgress();notify('已领取「'+q.title+'」奖励：'+rewards(r));};
   row.append(title,desc,reward,follow,map,status,button);$('task-list').appendChild(row);
  }
 }
 function track(id){if(!state.track(id))return;render();onProgress();if(id)notify('已追踪「'+CITY_QUESTS.find(q=>q.id===id).title+'」 · M 地图看黄色目标');}
 function tick(dt,playing=true){
  const hud=$('quest-tracker');if(!playing){if(hud)hud.hidden=true;if(marker)marker.visible=false;return;}clock+=dt;if(clock<.2)return;clock=0;
  const q=CITY_QUESTS.find(q=>q.id===state.tracked),goal=target(),context=getContext();if(hud){hud.hidden=!q;if(q){$('tracked-title').textContent=q.title;$('tracked-step').textContent=state.done(q.id)?'任务完成！按 I 领取奖励，然后继续下一项。':goal?.instruction??q.description;const d=goal&&context?.pos?Math.round(Math.hypot(goal.x-context.pos.x,goal.z-context.pos.z)):0;$('tracked-place').textContent=goal?goal.label+' · '+d+'格':'I 领取奖励';if($('tracked-arrow'))$('tracked-arrow').style.transform=goal?'rotate('+((Math.atan2(goal.x-context.pos.x,-(goal.z-context.pos.z))+getYaw())*180/Math.PI)+'deg)':'none';}}
  if(marker){marker.visible=!!goal&&!!context?.pos&&Math.hypot(goal.x-context.pos.x,goal.z-context.pos.z)<90;if(goal)marker.position.set(goal.x,goal.y+1.8,goal.z);}
 }
 function changed(ok){if(!ok)return;render();onProgress();}
 function close(){if(!panel)return;panel=false;$('tasks-dialog').close();resume();}
 function open(){if(panel){close();return;}if(!canOpen())return;pause();panel=true;render();$('tasks-dialog').showModal();}
 $('task-open').onclick=open;$('tasks-close').onclick=close;$('tasks-dialog').addEventListener('cancel',e=>{e.preventDefault();close();});if($('quest-map'))$('quest-map').onclick=openMap;if($('quest-stop'))$('quest-stop').onclick=()=>track(null);render();
 return {state,open,close,track,tick,target,isPanelOpen:()=>panel,record:e=>changed(state.record(e)),setBuildCount:n=>changed(state.set('build',n)),serialize:()=>state.serialize(),restore:(d,legacy)=>{state.restore(d,legacy);render();}};
}
