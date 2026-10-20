import {TRAVEL_STAMPS} from './travel-journal-state.js';
import {travelPhoto,travelThumbnail,removeTravelPhoto} from './travel-photo-store.js';
import {itemImage,collectibleKey} from './item-catalog.js';
import {SHOP_PRODUCTS} from './city-products.js';

export function photoPlace(p){return p.x>125&&p.z<210?'陆家嘴 · '+(p.y>50?'云端一眼':'楼下的风'):p.x<40&&p.z>205&&p.z<340?'豫园 · 曲径与灯火':p.x<-10&&Math.abs(p.z-66)<12?'南京路 · 街头一刻':'外滩 · 江的两岸';}
export function createTravelJournal({getInfo,pause,resume,onProgress=()=>{},onReplay=()=>{},onFilm=()=>{},onStopReplay=()=>{},notify=()=>{}}){
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
 const panel=el('dialog',null,'game-dialog travel-journal');panel.id='travel-journal';panel.setAttribute('aria-labelledby','travel-journal-title');
 const header=el('header'),heading=el('div'),title=el('h2','上海旅行手账');title.id='travel-journal-title';heading.append(el('small','SHANGHAI / 把这一程收好'),title);const exit=el('button','返回游戏');header.append(heading,exit);
 const body=el('div',null,'travel-journal-layout'),nav=el('nav'),content=el('section',null,'travel-journal-page');nav.setAttribute('aria-label','手账分类');body.append(nav,content);panel.append(header,body);document.body.append(panel);
 let category='stamps',generation=0,urls=[];
 function release(){generation++;for(const url of urls)URL.revokeObjectURL(url);urls=[];}
 function close(restore=true){release();content.replaceChildren();if(!panel.open)return;panel.close();document.body.classList.remove('in-dialogue');if(restore)resume();}
 function button(parent,text,action){const b=el('button',text);b.onclick=action;parent.append(b);return b;}
 async function render(){
  release();const token=generation,info=getInfo(),journal=info.journal;content.replaceChildren();nav.replaceChildren();
  for(const [id,label]of [['stamps','旅途印章'],['people','人物留言'],['photos','我的相片'],['memories','纪念与重游']]){const b=button(nav,label,()=>{category=id;render();});b.setAttribute('aria-current',String(id===category));}
  content.append(el('small',info.complete?'这一程已完成，城市依旧等你探索':'每一步发现，都随当前存档记下'),el('h3',{stamps:'把地名走成记忆',people:'这座城，有人对你说过',photos:'留住自己眼中的上海',memories:'下一次，不必照着地图走'}[category]));
  if(info.replaying)button(content,'结束重游，保留通关进度',()=>{close(false);onStopReplay();});
  if(category==='stamps'){
   const grid=el('div',null,'travel-stamps');for(const stamp of TRAVEL_STAMPS){const earned=journal.stamps.includes(stamp.id),card=el('article',null,'travel-stamp'+(earned?' earned':''));const art=el('img',null,'travel-stamp-art');art.src='./assets/journey/stamps/'+stamp.id+'.svg';art.alt=({bund:'外滩钟楼、和平饭店与江上游船',nanjing:'南京路街面店招与漫步的人',lujiazui:'东方明珠和陆家嘴三件套',sky:'上海中心与云端城市',garden:'豫园亭阁、飞檐和拱桥',window:'月洞窗里的亭台竹石',gallery:'水上长廊与锦鲤',tea:'湖心亭与临水热茶'})[stamp.id];art.width=art.height=240;art.loading='lazy';card.append(art,el('small',earned?'已收集':'尚未发现','travel-stamp-status'),el('strong',stamp.name),el('p',stamp.note));grid.append(card);}content.append(grid);
   content.append(el('p','附近的发现：'+(info.nearby??'继续走走，I 看当前目标；靠近人物或柜台按 V。'),'travel-journal-tip'));
  }else if(category==='people'){
   content.append(el('small',`已收录 ${journal.messages.length} / 32 段不同留言`));
   if(!journal.messages.length)content.append(el('p','与人物聊完一段话，这里就会留下他的声音。靠近按 V，选一个话题，读完后再继续。'));
   for(const m of journal.messages){const card=el('article',null,'travel-message');card.append(el('h4',m.name),el('p',m.text));content.append(card);}
  }else if(category==='photos'){
   content.append(el('p','点击右上角 📷，切换自拍或拍景，拍摄后选“收入旅行手账”。每趟旅程最多12张小相片；照片保存在本机浏览器，原图仍可单独导出 PNG。跨设备导入存档会保留照片记录，图片需在原设备查看。'));
   if(!journal.photos.length)content.append(el('p','这一页还空着。第一张，你想拍江风，还是灯火？'));
   const grid=el('div',null,'travel-photos');content.append(grid);
   for(const photo of journal.photos){const card=el('article'),image=el('img');image.alt=photo.title;image.loading='lazy';const status=el('small','读取本机相片…');card.append(image,el('h4',photo.title),status);button(card,'移除这张本机相片',async()=>{try{await removeTravelPhoto(photo.id);if(getInfo().journal!==journal)return;journal.photos=journal.photos.filter(p=>p.id!==photo.id);onProgress();if(panel.open)render();}catch(error){notify(error.message);}});grid.append(card);
    try{const blob=await travelPhoto(photo.id);if(token!==generation||!panel.open)return;if(blob){const url=URL.createObjectURL(blob);urls.push(url);image.src=url;status.textContent=photo.at.slice(0,10);}else{image.hidden=true;status.textContent='相片在拍摄时的浏览器中；原图可另行导出保存。';}}catch{if(token===generation)status.textContent='本机相册暂时不可用，照片记录仍在。';}
   }
  }else{
   const items=Object.entries(info.collectibles??{}).filter(([,n])=>n>0);content.append(el('h4','带走的纪念'));for(const [name,count]of items){const row=el('p',null,'travel-keepsake');row.append(itemImage(collectibleKey(name)),el('span',`${SHOP_PRODUCTS[name]?.name??name} × ${count}`));content.append(row);}if(!items.length)content.append(el('p','逛店挑一份纪念，或完成旅程领取专属纪念卡。'));
   content.append(el('h4','回看这一程'),el('p','重游已走到的章节，只改变临时引导；原主线、建造与奖励记录保留。选第4章可体验陆家嘴的新相遇。原地开始，M 地图可前往陆家嘴。'));
   if(info.complete){button(content,'重看开场短片',()=>{close(false);onFilm('opening');});button(content,'重看终章短片',()=>{close(false);onFilm('ending');});}if(info.replayCount>0||info.complete){const chapters=el('div',null,'travel-replays');for(const [i,c]of info.chapters.slice(0,info.replayCount??info.chapters.length).entries())button(chapters,`${i+1} · ${c.title}`,()=>{close(false);onReplay(i);});content.append(chapters);}
  }
 }
 function open(){pause();document.body.classList.add('in-dialogue');if(!panel.open)panel.showModal();render();exit.focus();}
 exit.onclick=()=>close();panel.addEventListener('cancel',e=>{e.preventDefault();close();});
 for(const id of ['travel-book-free','travel-book-track','travel-book-handbook'])document.getElementById(id)?.addEventListener('click',open);
 return {open,close,get opened(){return panel.open;},async keepPhoto({blob,pos}){
  const journal=getInfo().journal;if(journal.photos.length>=12)throw Error('这一页已放满12张照片，可先导出并移除一张。');
  const thumb=await travelThumbnail(blob),id='photo-'+crypto.randomUUID();await travelPhoto(id,thumb);
  if(getInfo().journal!==journal){await removeTravelPhoto(id);throw Error('存档已切换，请重新收入照片。');}
  if(!journal.addPhoto({id,title:photoPlace(pos),at:new Date().toISOString()})){await removeTravelPhoto(id);throw Error('照片未收入，请重试。');}onProgress();return '已收入上海旅行手账 · N 或 I 中打开';
 }};
}
