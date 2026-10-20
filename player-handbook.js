import {BLOCKS} from './world.js';
import {RECIPES} from './survival-state.js';
import {itemDetails,itemImage,collectibleKey} from './item-catalog.js';
export function inventoryGroups(state,packed={},collectibles={}){
 const blocks=Array.from({length:12},(_,i)=>({id:i+1,name:BLOCKS[i+1].name,count:state.bag[i+1]??0,color:BLOCKS[i+1].color}));
 const supplies=[['food','熟食 / 浆果'],['raw','生肉 / 生鱼'],['wool','羊毛'],['pearls','海珍珠']].map(([key,name])=>({key,name,count:state[key]??0}));
 const gear=[state.pickaxe&&{name:state.pickaxe===2?'石镐':'木镐',note:'剩余 '+state.durability+' 次采集'},state.fishingRod&&{name:'鱼竿',note:'水边 G 抛线 / 收竿'},state.sword&&{name:'石剑',note:'看向夜影 Q 反击'},state.dive&&{name:'潜水套装',note:state.equipped?'已穿戴 · L 脱下':'L 穿戴'},state.glider&&{name:'滑翔伞',note:'P 展开 / 收起'}].filter(Boolean);
 const gearKeys=[state.pickaxe&&(state.pickaxe===2?'stonepick':'woodpick'),state.fishingRod&&'fishingrod',state.sword&&'sword',state.dive&&'dive',state.glider&&'glider'].filter(Boolean);gear.forEach((item,i)=>item.key=gearKeys[i]);
 const furnishings=Object.entries(RECIPES).filter(([id,r])=>r.item===id).map(([id,r])=>({key:id,name:r.name,count:(packed[id]??0)+(state.held===id?1:0),note:state.held===id?'手持一件 · E 放置':'C 中取出后 E 放置'})).filter(r=>r.count>0);
 return [{title:'方块材料',items:blocks},{title:'食材与资源',items:supplies},{title:'装备',items:gear},{title:'随身家具',items:furnishings},...Object.values(collectibles).some(n=>n>0)?[{title:'旅行纪念与商品收藏',items:Object.entries(collectibles).filter(([,n])=>n>0).map(([name,count])=>({key:collectibleKey(name),name,count}))}]:[]];
}
export function createPlayerHandbook({getState,getPacked,getCollectibles=()=>({}),openCollectible=()=>false,openTravelJournal=()=>{},selectBlock,craft,pause,resume,isPlaying,canOpen=()=>true,notify=()=>{}}){
 const $=id=>document.getElementById(id);let panel=null,wasPlaying=false,selectedGroup=0;
 function close(restorePlay=true){if(!panel)return;$(panel).close();panel=null;const restore=wasPlaying;wasPlaying=false;if(restorePlay&&restore)resume();}
 function render(){const state=getState();$('backpack-mode').textContent=state.survival?'生存背包 · 显示实际数量':'创造模式 · 方块可无限使用，仍显示已收集数量';$('backpack-items').replaceChildren();const info=$('backpack-detail');info.hidden=false;const categories=$('backpack-categories'),groups=inventoryGroups(state,getPacked(),getCollectibles());categories.replaceChildren();selectedGroup=Math.min(selectedGroup,groups.length-1);let selectedCard=null;const sections=[],tabs=[];
  if(groups.length===4)groups.push({title:'旅行纪念与商品收藏',items:[]});
  const emptyInfo=()=>{info.replaceChildren();const heading=document.createElement('h3'),note=document.createElement('p');heading.textContent='挑选一件随身物品';note.textContent='点选物品格子，查看用途、获取方式和可用操作。相同材料已自动累计。';info.append(heading,note);};emptyInfo();
  const selectGroup=index=>{selectedGroup=index;sections.forEach((section,i)=>{section.hidden=i!==index;});tabs.forEach((tab,i)=>tab.setAttribute('aria-selected',String(i===index)));if(selectedCard)selectedCard.setAttribute('aria-pressed','false');selectedCard=null;emptyInfo();};
  for(const [groupIndex,group]of groups.entries()){
   const section=document.createElement('section'),title=document.createElement('h3'),grid=document.createElement('div');title.textContent=group.title;grid.className='backpack-grid';section.id='backpack-group-'+groupIndex;section.setAttribute('role','tabpanel');section.setAttribute('aria-labelledby','backpack-tab-'+groupIndex);section.hidden=groupIndex!==selectedGroup;section.append(title,grid);sections.push(section);
   const tab=document.createElement('button');tab.id='backpack-tab-'+groupIndex;tab.type='button';tab.setAttribute('role','tab');tab.setAttribute('aria-controls',section.id);tab.setAttribute('aria-selected',String(groupIndex===selectedGroup));tab.textContent=['材料','资源','装备','家具','纪念'][groupIndex]??group.title;tab.onclick=()=>selectGroup(groupIndex);tabs.push(tab);categories.append(tab);
   if(!group.items.length){const empty=document.createElement('p');empty.textContent=groupIndex===4?'还没有纪念品。逛逛上海商铺，或完成旅程领取纪念卡。':'暂时没有，可前往制作查看配方。';grid.append(empty);}
   for(const item of group.items){const card=document.createElement('button'),details=itemDetails(item);card.className='backpack-item';const name=document.createElement('strong'),amount=document.createElement('span');name.textContent=details.name;amount.textContent=item.count===undefined?item.note:'× '+item.count+(item.note?' · '+item.note:'');card.append(itemImage(details.key),name,amount);card.title='查看'+details.name+'的用途与获取方式';card.setAttribute('aria-pressed','false');card.setAttribute('aria-label',details.name+' · '+(item.count===undefined?item.note:'持有 '+item.count));amount.className='backpack-amount';amount.textContent=item.count===undefined?'已拥有':String(item.count);card.classList.toggle('is-empty',item.count===0);
    card.onclick=()=>{if(selectedCard)selectedCard.setAttribute('aria-pressed','false');selectedCard=card;card.setAttribute('aria-pressed','true');info.replaceChildren();info.hidden=false;const heading=document.createElement('h3');heading.textContent=details.name;info.append(itemImage(details.key),heading);for(const text of [item.count===undefined?item.note:'持有数量：'+item.count,details.description,'获得方式：'+details.source,'操作：'+details.controls]){const p=document.createElement('p');p.textContent=text;info.append(p);}const dismiss=document.createElement('button');dismiss.textContent='收起说明';dismiss.onclick=()=>{emptyInfo();card.setAttribute('aria-pressed','false');selectedCard=null;card.focus();};info.append(dismiss);
     if(item.id){const use=document.createElement('button');use.textContent=state.survival&&item.count<=0?'尚未拥有这个材料':'选择为手持方块';use.disabled=state.survival&&item.count<=0;use.onclick=()=>{selectBlock(item.id);close();};info.append(use);}
     else if(details.key==='souvenir'){const open=document.createElement('button');open.textContent='查看旅程纪念卡';open.onclick=()=>{close(false);openCollectible(item.name);};info.append(open);}
     else if(['装备','随身家具'].includes(group.title)){const make=document.createElement('button');make.textContent='打开制作 / 取出家具';make.onclick=()=>{close(false);craft();};info.append(make);}heading.tabIndex=-1;heading.focus();
    };
    grid.append(card);
   }$('backpack-items').append(section);
  }
 }
 function open(kind){const id=kind==='backpack'?'backpack-dialog':'handbook-dialog';if(panel===id){close();return;}if(!panel&&!canOpen())return;const playing=panel?wasPlaying:isPlaying();close(false);wasPlaying=playing;
  try{pause();if(kind==='backpack')render();$(id).showModal();panel=id;}catch{panel=null;wasPlaying=false;if(playing)resume();notify('说明或背包暂时无法打开，请重试。');}
 }
 const bag=()=>open('backpack'),guide=()=>open('guide');
 for(const id of ['backpack-open','touch-backpack'])$(id)?.addEventListener('click',bag);
 for(const id of ['handbook-open','handbook-menu'])$(id)?.addEventListener('click',guide);
 for(const id of ['backpack-close','handbook-close'])$(id)?.addEventListener('click',()=>close());
 for(const id of ['backpack-dialog','handbook-dialog'])$(id).addEventListener('cancel',e=>{e.preventDefault();close();});
 $('travel-book-backpack')?.addEventListener('click',()=>{close(false);openTravelJournal();});
 $('backpack-craft').onclick=()=>{close(false);craft();};
 return {openBackpack:bag,openGuide:guide,close,isPanelOpen:()=>!!panel};
}
