export const TRAVEL_STAMPS=[
 {id:'bund',name:'初见外滩',mark:'江',note:'收下一张明信片，让江风为旅程开场。'},
 {id:'nanjing',name:'南京路烟火',mark:'街',note:'在街边挑一份自己喜欢的商品。'},
 {id:'lujiazui',name:'江的另一岸',mark:'城',note:'亲自坐地铁穿过黄浦江。'},
 {id:'sky',name:'云端上海',mark:'云',note:'从上海中心重新认识脚下的街道。'},
 {id:'garden',name:'海上名园',mark:'园',note:'领票入园，放慢脚步。'},
 {id:'window',name:'一窗借景',mark:'窗',note:'为圆窗中的几层风景停留。'},
 {id:'gallery',name:'水廊听鱼',mark:'廊',note:'沿水上长廊寻找锦鲤和倒影。'},
 {id:'tea',name:'一杯茶的时间',mark:'茶',note:'在湖心亭听完这一程的回声。'}
];
const stampIds=new Set(TRAVEL_STAMPS.map(s=>s.id));
const clean=(value,n)=>typeof value==='string'?value.slice(0,n):'';
export class TravelJournalState{
 constructor(){this.stamps=[];this.messages=[];this.photos=[];this.bundPhoto=false;}
 stamp(id){if(!stampIds.has(id)||this.stamps.includes(id))return false;this.stamps.push(id);return true;}
 message(id,name,text){if(typeof id!=='string'||typeof name!=='string'||typeof text!=='string'||!id||!name||!text||this.messages.some(m=>m.id===clean(id,100))||this.messages.length>=32)return false;this.messages.push({id:clean(id,100),name:clean(name,32),text:clean(text,500)});return true;}
 addPhoto(photo){if(this.photos.length>=12||!/^photo-[a-z0-9-]{1,80}$/.test(photo?.id)||this.photos.some(p=>p.id===photo.id))return false;this.photos.push({id:photo.id,title:clean(photo.title,60),at:clean(photo.at,32)});return true;}
 serialize(){return {version:1,stamps:[...this.stamps],messages:this.messages.map(m=>({...m})),photos:this.photos.map(p=>({...p})),bundPhoto:this.bundPhoto};}
 restore(data){this.stamps=[];this.messages=[];this.photos=[];this.bundPhoto=data?.bundPhoto===true;
  for(const id of Array.isArray(data?.stamps)?data.stamps.slice(0,8):[])this.stamp(id);
  for(const m of Array.isArray(data?.messages)?data.messages.slice(0,32):[])if(m&&typeof m.id==='string')this.message(m.id,m.name,m.text);
  for(const p of Array.isArray(data?.photos)?data.photos.slice(0,12):[])this.addPhoto(p);
 }
}
