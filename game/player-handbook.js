import {BLOCKS} from './world.js';
import {RECIPES} from './survival-state.js';
export function inventoryGroups(state,packed={},collectibles={}){
 const blocks=Array.from({length:12},(_,i)=>({id:i+1,name:BLOCKS[i+1].name,count:state.bag[i+1]??0,color:BLOCKS[i+1].color}));
 const supplies=[['food','熟食 / 浆果'],['raw','生肉 / 生鱼'],['wool','羊毛'],['pearls','海珍珠']].map(([id,name])=>({name,count:state[id]??0}));
 const gear=[state.pickaxe&&{name:state.pickaxe===2?'石镐':'木镐',note:'剩余 '+state.durability+' 次采集'},state.fishingRod&&{name:'鱼竿',note:'水边 G 抛线 / 收竿'},state.sword&&{name:'石剑',note:'看向夜影 Q 反击'},state.dive&&{name:'潜水套装',note:state.equipped?'已穿戴 · L 脱下':'L 穿戴'},state.glider&&{name:'滑翔伞',note:'P 展开 / 收起'}].filter(Boolean);
 const furnishings=Object.entries(RECIPES).filter(([id,r])=>r.item===id).map(([id,r])=>({name:r.name,count:(packed[id]??0)+(state.held===id?1:0),note:state.held===id?'手持一件 · E 放置':'C 中取出后 E 放置'})).filter(r=>r.count>0);
 return [{title:'方块材料',items:blocks},{title:'食材与资源',items:supplies},{title:'装备',items:gear},{title:'随身家具',items:furnishings},...Object.keys(collectibles).length?[{title:'旅行纪念与商品收藏',items:Object.entries(collectibles).map(([name,count])=>({name,count}))}]:[]];
}
export function createPlayerHandbook({getState,getPacked,getCollectibles=()=>({}),openCollectible=()=>false,selectBlock,craft,pause,resume,isPlaying,canOpen=()=>true,notify=()=>{}}){
 const $=id=>document.getElementById(id);let panel=null,wasPlaying=false;
 function close(restorePlay=true){if(!panel)return;$(panel).close();panel=null;const restore=wasPlaying;wasPlaying=false;if(restorePlay&&restore)resume();}
 function render(){const state=getState();$('backpack-mode').textContent=state.survival?'生存背包 · 显示实际数量':'创造模式 · 方块可无限使用，仍显示已收集数量';$('backpack-items').replaceChildren();
  for(const group of inventoryGroups(state,getPacked(),getCollectibles())){
   const section=document.createElement('section'),title=document.createElement('h3'),grid=document.createElement('div');title.textContent=group.title;grid.className='backpack-grid';section.append(title,grid);
   if(!group.items.length){const empty=document.createElement('p');empty.textContent='暂时没有，按 C 查看制作配方。';grid.append(empty);}
   for(const item of group.items){const card=document.createElement(item.id?'button':'div');card.className='backpack-item';const name=document.createElement('strong'),amount=document.createElement('span');name.textContent=item.name;amount.textContent=item.count===undefined?item.note:'× '+item.count+(item.note?' · '+item.note:'');card.append(name,amount);
    if(item.id){card.style.borderLeft='5px solid '+item.color;card.disabled=state.survival&&item.count<=0;card.title='选择这个方块';card.onclick=()=>{selectBlock(item.id);close();};}
    if(item.name==='沪上初游 · 旅行纪念卡'){card.setAttribute('role','button');card.tabIndex=0;card.title='打开旅行纪念卡与结算';const open=()=>{close(false);openCollectible(item.name);};card.onclick=open;card.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}};card.append(document.createTextNode(' · 点击查看旅程'));}
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
 $('backpack-craft').onclick=()=>{close(false);craft();};
 return {openBackpack:bag,openGuide:guide,close,isPanelOpen:()=>!!panel};
}
