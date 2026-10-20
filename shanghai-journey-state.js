import {TravelJournalState} from './travel-journal-state.js';
export const JOURNEY_CHAPTERS=[
 {id:'letter',title:'江风里的一张明信片',hint:'走近外滩的林阿姨，按 V 聊聊。'},
 {id:'taste',title:'南京路的第一口热气',hint:'沿南京路进入任一家营业店铺，按 V 打开柜台，购买一份商品。'},
 {id:'lujiazui-metro',title:'江的另一边',hint:'在南京东路乘2号线，完整抵达陆家嘴并下车。'},
 {id:'lujiazui-view',title:'从云端认识这座城',hint:'跟随黄色目标帮职员找回工牌、为游客拍照，再到上海中心登上巅峰观景台。'},
 {id:'return-nanjing',title:'再见，江对岸的灯火',hint:'乘观光电梯回到地面，再坐2号线从陆家嘴返回南京东路。'},
 {id:'metro',title:'地下也有一条街',hint:'从南京东路乘10号线到豫园；到站下车后正常刷闸出站。'},
 {id:'garden',title:'园门里的慢时光',hint:'和园门旁的顾先生聊聊，再领票、检票进入内园。'},
 {id:'view',title:'把风景留在窗里',hint:'先在圆窗内停留两秒，再沿水上长廊发现锦鲤与倒影，按 V 记入手账。'},
 {id:'tea',title:'一杯茶的时间',hint:'离园逛一间商铺，按 V 看看柜台，再沿九曲桥到湖心亭品茶。'},
 {id:'keepsake',title:'这一次，记住上海',hint:'走近湖心亭旁的沈伯，领取专属旅行纪念卡。'}
];
export const JOURNEY_SOUVENIR='沪上初游 · 旅行纪念卡';
export class ShanghaiJourneyState{
 constructor(){this.phase='new';this.index=0;this.tracked=true;this.seconds=0;this.gardenTalk=false;this.completedAt=null;this.memory='江风';this.pendingShopTalk=false;this.edition=3;this.encounters=[];this.officeErrand='new';this.touristPhoto='new';this.windowSeen=false;this.gallerySeen=false;this.bazaarSeen=false;this.journal=new TravelJournalState();}
 get chapter(){return JOURNEY_CHAPTERS[this.index]??null;}
 get unlocked(){return this.index>=2;}
 get complete(){return this.index===JOURNEY_CHAPTERS.length;}
 begin(){if(this.phase!=='new')return false;this.phase='opening';return true;}
 opened(){if(this.phase!=='opening')return false;this.phase='journey';return true;}
 advance(){const stamp={letter:'bund',taste:'nanjing','lujiazui-metro':'lujiazui','lujiazui-view':'sky',garden:'garden',view:'window',tea:'tea'}[this.chapter.id];if(stamp)this.journal.stamp(stamp);this.index++;if(this.complete)this.phase='ending';return true;}
 record(e){
  if(this.phase!=='journey'||!e)return false;
  switch(this.chapter.id){
   case 'letter':return e.type==='journey-talk'&&e.npc==='lin'?this.advance():false;
   case 'taste':if(e.type==='shop'){this.pendingShopTalk=true;return this.advance();}return false;
   case 'lujiazui-metro':return e.type==='metro'&&e.from==='nanjing'&&e.to==='lujiazui'&&e.departed===true?this.advance():false;
   case 'lujiazui-view':
    if(this.edition>=3){
     if(e.type==='journey-office-accept'&&this.officeErrand==='new'){this.officeErrand='search';return true;}
     if(e.type==='journey-office-pickup'&&this.officeErrand==='search'){this.officeErrand='return';return true;}
     if(e.type==='journey-office-return'&&this.officeErrand==='return'){this.officeErrand='done';return true;}
     if(e.type==='journey-photo-accept'&&this.touristPhoto==='new'){this.touristPhoto='ready';return true;}
     if(e.type==='journey-photo-complete'&&this.touristPhoto==='ready'){this.touristPhoto='done';return true;}
    }
    if(e.type==='city-conversation'&&e.district==='lujiazui'&&['office-walk','tower-visitor'].includes(e.kind)&&typeof e.name==='string'&&!this.encounters.some(p=>p.name===e.name||p.kind===e.kind)&&this.encounters.length<2){this.encounters.push({name:e.name.slice(0,32),kind:e.kind});return true;}
    return e.type==='sky'&&(this.edition<3||this.officeErrand==='done'&&this.touristPhoto==='done')&&(this.edition===1||this.encounters.some(p=>p.kind==='office-walk')&&this.encounters.some(p=>p.kind==='tower-visitor'))?this.advance():false;
   case 'return-nanjing':return e.type==='metro'&&e.from==='lujiazui'&&e.to==='nanjing'&&e.departed===true?this.advance():false;
   case 'metro':return e.type==='metro10'&&e.from==='nanjing'&&e.to==='yuyuan'&&e.departed===true?this.advance():false;
   case 'garden':if(e.type==='journey-talk'&&e.npc==='gu'){this.gardenTalk=true;return true;}return this.gardenTalk&&e.type==='yuyuan-entry'?this.advance():false;
   case 'view':
    if(e.type==='journey-view'&&e.visible===true&&e.seconds>=2||e.type==='yuyuan-riddle'&&e.solved===3){this.windowSeen=true;this.journal.stamp('window');return this.edition===1?this.advance():true;}
    if(e.type==='journey-gallery'&&this.windowSeen){this.gallerySeen=true;this.journal.stamp('gallery');return this.advance();}return false;
   case 'tea':if(e.type==='yuyuan-shop-visit'){if(this.bazaarSeen)return false;this.bazaarSeen=true;return true;}return e.type==='yuyuan-tea'&&(this.edition===1||this.bazaarSeen)?this.advance():false;
   case 'keepsake':if(e.type!=='journey-claim')return false;this.memory=['江风','灯火','茶香'].includes(e.memory)?e.memory:'江风';this.completedAt=typeof e.at==='string'?e.at:new Date().toISOString();return this.advance();
  }return false;
 }
 tick(dt){if(this.phase==='journey'&&Number.isFinite(dt)&&dt>0)this.seconds+=Math.min(dt,.25);}
 ended(){if(this.phase==='ending')this.phase='complete';}
 serialize(){return {version:1,edition:this.edition,officeErrand:this.officeErrand,touristPhoto:this.touristPhoto,phase:this.phase,index:this.index,tracked:this.tracked,seconds:this.seconds,gardenTalk:this.gardenTalk,completedAt:this.completedAt,memory:this.memory,pendingShopTalk:this.pendingShopTalk,encounters:this.encounters.map(p=>({...p})),windowSeen:this.windowSeen,gallerySeen:this.gallerySeen,bazaarSeen:this.bazaarSeen,journal:this.journal.serialize()};}
 restore(d){
  if(!d||d.version!==1){Object.assign(this,new ShanghaiJourneyState());this.tracked=false;return;}
  this.index=Number.isInteger(d.index)?Math.max(0,Math.min(JOURNEY_CHAPTERS.length,d.index)):0;
  this.phase=this.complete?'complete':d.phase==='new'?'new':'journey';
  this.tracked=d.tracked!==false;this.seconds=Number.isFinite(d.seconds)?Math.max(0,Math.min(1e7,d.seconds)):0;
  const gardenIndex=JOURNEY_CHAPTERS.findIndex(c=>c.id==='garden');this.gardenTalk=this.index>gardenIndex||this.index===gardenIndex&&d.gardenTalk===true;this.pendingShopTalk=this.index===2&&d.pendingShopTalk===true;
  this.completedAt=this.complete&&typeof d.completedAt==='string'?d.completedAt.slice(0,40):null;this.memory=['江风','灯火','茶香'].includes(d.memory)?d.memory:'江风';
  this.edition=[2,3].includes(d.edition)?d.edition:1;this.officeErrand=['search','return','done'].includes(d.officeErrand)?d.officeErrand:'new';this.touristPhoto=['ready','done'].includes(d.touristPhoto)?d.touristPhoto:'new';this.encounters=[];
  for(const p of Array.isArray(d.encounters)?d.encounters.slice(0,2):[])if(p&&typeof p.name==='string'&&['office-walk','tower-visitor'].includes(p.kind)&&!this.encounters.some(o=>o.name===p.name||o.kind===p.kind))this.encounters.push({name:p.name.slice(0,32),kind:p.kind});
  this.windowSeen=d.windowSeen===true;this.gallerySeen=d.gallerySeen===true;this.bazaarSeen=d.bazaarSeen===true;this.journal=new TravelJournalState();this.journal.restore(d.journal);
  if(!d.journal)for(const c of JOURNEY_CHAPTERS.slice(0,this.index)){const stamp={letter:'bund',taste:'nanjing','lujiazui-metro':'lujiazui','lujiazui-view':'sky',garden:'garden',view:'window',tea:'tea'}[c.id];if(stamp)this.journal.stamp(stamp);}
 }
 get inventory(){return this.complete?{[JOURNEY_SOUVENIR]:1}:{};}
}
