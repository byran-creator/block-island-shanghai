export const JOURNEY_CHAPTERS=[
 {id:'letter',title:'江风里的一张明信片',hint:'走近外滩的林阿姨，按 V 聊聊。'},
 {id:'taste',title:'南京路的第一口热气',hint:'沿南京路进入任一家营业店铺，按 V 打开柜台，购买一份商品。'},
 {id:'lujiazui-metro',title:'江的另一边',hint:'在南京东路乘2号线，完整抵达陆家嘴并下车。'},
 {id:'lujiazui-view',title:'从云端认识这座城',hint:'走到上海中心，按 V 使用观光电梯登上巅峰观景台。'},
 {id:'return-nanjing',title:'再见，江对岸的灯火',hint:'乘观光电梯回到地面，再坐2号线从陆家嘴返回南京东路。'},
 {id:'metro',title:'地下也有一条街',hint:'从南京东路乘10号线到豫园；到站下车后正常刷闸出站。'},
 {id:'garden',title:'园门里的慢时光',hint:'和园门旁的顾先生聊聊，再领票、检票进入内园。'},
 {id:'view',title:'把风景留在窗里',hint:'到月洞窗内侧，面对窗外停留两秒；也可完成三道灯谜。'},
 {id:'tea',title:'一杯茶的时间',hint:'离开内园，沿九曲桥到湖心亭，按 V 品茶。'},
 {id:'keepsake',title:'这一次，记住上海',hint:'走近湖心亭旁的沈伯，领取专属旅行纪念卡。'}
];
export const JOURNEY_SOUVENIR='沪上初游 · 旅行纪念卡';
export class ShanghaiJourneyState{
 constructor(){this.phase='new';this.index=0;this.tracked=true;this.seconds=0;this.gardenTalk=false;this.completedAt=null;this.memory='江风';this.pendingShopTalk=false;}
 get chapter(){return JOURNEY_CHAPTERS[this.index]??null;}
 get unlocked(){return this.index>=2;}
 get complete(){return this.index===JOURNEY_CHAPTERS.length;}
 begin(){if(this.phase!=='new')return false;this.phase='opening';return true;}
 opened(){if(this.phase!=='opening')return false;this.phase='journey';return true;}
 advance(){this.index++;if(this.complete)this.phase='ending';return true;}
 record(e){
  if(this.phase!=='journey'||!e)return false;
  switch(this.chapter.id){
   case 'letter':return e.type==='journey-talk'&&e.npc==='lin'?this.advance():false;
   case 'taste':if(e.type==='shop'){this.pendingShopTalk=true;return this.advance();}return false;
   case 'lujiazui-metro':return e.type==='metro'&&e.from==='nanjing'&&e.to==='lujiazui'&&e.departed===true?this.advance():false;
   case 'lujiazui-view':return e.type==='sky'?this.advance():false;
   case 'return-nanjing':return e.type==='metro'&&e.from==='lujiazui'&&e.to==='nanjing'&&e.departed===true?this.advance():false;
   case 'metro':return e.type==='metro10'&&e.from==='nanjing'&&e.to==='yuyuan'&&e.departed===true?this.advance():false;
   case 'garden':if(e.type==='journey-talk'&&e.npc==='gu'){this.gardenTalk=true;return true;}return this.gardenTalk&&e.type==='yuyuan-entry'?this.advance():false;
   case 'view':return e.type==='journey-view'&&e.visible===true&&e.seconds>=2||e.type==='yuyuan-riddle'&&e.solved===3?this.advance():false;
   case 'tea':return e.type==='yuyuan-tea'?this.advance():false;
   case 'keepsake':if(e.type!=='journey-claim')return false;this.memory=['江风','灯火','茶香'].includes(e.memory)?e.memory:'江风';this.completedAt=typeof e.at==='string'?e.at:new Date().toISOString();return this.advance();
  }return false;
 }
 tick(dt){if(this.phase==='journey'&&Number.isFinite(dt)&&dt>0)this.seconds+=Math.min(dt,.25);}
 ended(){if(this.phase==='ending')this.phase='complete';}
 serialize(){return {version:1,phase:this.phase,index:this.index,tracked:this.tracked,seconds:this.seconds,gardenTalk:this.gardenTalk,completedAt:this.completedAt,memory:this.memory,pendingShopTalk:this.pendingShopTalk};}
 restore(d){
  if(!d||d.version!==1){Object.assign(this,new ShanghaiJourneyState());this.tracked=false;return;}
  this.index=Number.isInteger(d.index)?Math.max(0,Math.min(JOURNEY_CHAPTERS.length,d.index)):0;
  this.phase=this.complete?'complete':d.phase==='new'?'new':'journey';
  this.tracked=d.tracked!==false;this.seconds=Number.isFinite(d.seconds)?Math.max(0,Math.min(1e7,d.seconds)):0;
  const gardenIndex=JOURNEY_CHAPTERS.findIndex(c=>c.id==='garden');this.gardenTalk=this.index>gardenIndex||this.index===gardenIndex&&d.gardenTalk===true;this.pendingShopTalk=this.index===2&&d.pendingShopTalk===true;
  this.completedAt=this.complete&&typeof d.completedAt==='string'?d.completedAt.slice(0,40):null;this.memory=['江风','灯火','茶香'].includes(d.memory)?d.memory:'江风';
 }
 get inventory(){return this.complete?{[JOURNEY_SOUVENIR]:1}:{};}
}
