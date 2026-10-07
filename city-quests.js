export const CITY_QUESTS=[
 {id:'hello',title:'认识岛上的朋友',description:'靠近奶龙，按 G 打招呼。',target:1,reward:{blocks:{7:8}}},
 {id:'build',title:'给新家添砖加瓦',description:'成功放置10块方块，受保护区域和失败放置不计数。',target:10,reward:{blocks:{4:8,7:16}}},
 {id:'security',title:'第一次地铁安检',description:'在南京东路或陆家嘴站放包，等待完整安检结束。',target:1,reward:{food:2}},
 {id:'metro',title:'2号线过江通勤',description:'乘车从南京东路到陆家嘴，或反方向完整到站下车。走入车厢或按 V 均可；传送不计。',target:1,reward:{blocks:{9:12},food:2}},
 {id:'ferry',title:'黄浦江摆渡人',description:'在渡口登船，随轮渡航行并抵达另一岸。',target:1,reward:{blocks:{11:12},pearls:1}},
 {id:'shop',title:'南京路逛吃',description:'与南京路商贩交易，成功购买一份餐点或纪念品。',target:1,reward:{food:3}},
 {id:'meal',title:'和平饭店江景午餐',description:'进入八楼龙凤厅，成功点一份餐。只进入餐厅不计。',target:1,reward:{blocks:{7:12},wool:1}},
 {id:'sky',title:'上海中心登顶',description:'使用上海中心观光电梯到达巅峰观景台。',target:1,reward:{blocks:{12:8},pearls:1}}
];
const station=id=>['nanjing','lujiazui'].includes(id);
export class CityQuestState{
 constructor(){this.progress={};this.claimed=new Set();this.tracked=null;}
 track(id){if(id!==null&&!CITY_QUESTS.some(q=>q.id===id)||id===this.tracked)return false;this.tracked=id;return true;}
 set(id,value){const q=CITY_QUESTS.find(q=>q.id===id);if(!q||!Number.isFinite(value))return false;const next=Math.min(q.target,Math.max(this.progress[id]??0,Math.floor(value),0));if(next===(this.progress[id]??0))return false;this.progress[id]=next;return true;}
 record(event){if(!event)return false;const {type,from,to}=event;if(type==='hello')return this.set('hello',1);if(type==='security'&&station(event.station))return this.set('security',1);if(type==='metro'&&station(from)&&station(to)&&from!==to&&event.departed===true)return this.set('metro',1);if(type==='ferry'&&[0,1].includes(from)&&to===1-from&&event.departed===true)return this.set('ferry',1);if(['shop','meal','sky'].includes(type))return this.set(type,1);return false;}
 done(id){const q=CITY_QUESTS.find(q=>q.id===id);return !!q&&(this.progress[id]??0)>=q.target;}
 claim(id){const q=CITY_QUESTS.find(q=>q.id===id);if(!q||!this.done(id)||this.claimed.has(id))return null;this.claimed.add(id);if(this.tracked===id)this.tracked=null;return q.reward;}
 serialize(){return {version:2,progress:{...this.progress},claimed:[...this.claimed],tracked:this.tracked};}
 restore(data,legacy={}){this.progress={};this.claimed.clear();for(const q of CITY_QUESTS)this.set(q.id,Number(data?.progress?.[q.id])||0);this.set('hello',legacy.talkDone?1:0);this.set('build',Number(legacy.placed)||0);for(const id of Array.isArray(data?.claimed)?data.claimed:[])if(this.done(id))this.claimed.add(id);this.tracked=CITY_QUESTS.some(q=>q.id===data?.tracked)&&!this.claimed.has(data.tracked)?data.tracked:null;}
}
