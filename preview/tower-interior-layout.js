import {CITY} from './shanghai-map.js';

// Floor names follow Shanghai Tower; voxel elevations use the existing city scale.
export const TOWER_ROOMS={office:{id:'towerOffice',name:'办公体验层',y:46},books:{id:'duoyun',name:'52F · 朵云书院',y:66}};
export const TOWER_LOBBY={x:CITY.shanghai.x,y:26,z:CITY.shanghai.z-3};
export const TOWER_WORK_DOOR={id:'shanghai-tower-office',name:'上海中心 · 办公层',x:CITY.shanghai.x,y:26,z:CITY.shanghai.z+4.5};
export const TOWER_OFFICE_DESKS=[{x:CITY.shanghai.x-3.1,y:46,z:CITY.shanghai.z-1.7},{x:CITY.shanghai.x+3.1,y:46,z:CITY.shanghai.z-1.7}];
export const TOWER_READING_BOOKS=[
 {id:'river',title:'江风与高楼',x:-1.1,z:0,pages:['从外滩看向陆家嘴，老建筑与玻璃高楼隔江相望。你不必急着选择更喜欢哪一岸，江水把两种时间都留在了上海。','街道教人抬头，书页让人放慢。回想今天遇见的人：愿意讲一句故事的职员、请你帮忙拍照的游客，都让城市多了一点温度。','合上书，去窗边看看吧。同一条黄浦江，在地面是风，在高处是一笔弯弯的线。今天你走过的路，就在那条线旁。']},
 {id:'window',title:'一扇窗的上海',x:1.1,z:0,pages:['园林用一扇圆窗裁出几层风景，云端书院用一整面玻璃容纳一座城。窗的形状不同，看风景的耐心却相通。','先看近处的书架和树影，再看江面，最后寻找远处建筑的轮廓。把一幅风景分成远近，城市就不再是一团拥挤的线条。','窗外没有标准答案。白天的江水、傍晚的霞光、夜里的灯，都值得你坐一会儿。']},
 {id:'walk',title:'把城市慢慢走成家',x:0,z:2.2,pages:['第一次来上海，可以给自己定一条小小的路线：认识一个陌生人，尝一种街头味道，找一处愿意停留的地方。','记得自己走过的街角，比赶完所有地标更有意思。任务可以明天继续，背包里的纪念和手账里的留言，也不会因为绕路而丢失。','等你再次来到这里，也许你会认出一张脸、一盏灯，或窗外一幢楼。城市就是这样，慢慢从陌生变得亲切。']}
];
export function towerRoomBoundary(profile,y,x,z){const dx=x-CITY.shanghai.x,dz=z-CITY.shanghai.z;return profile(y+2,Math.atan2(dz,dx))-.5;}
export function buildTowerInteriors(w,profile){
 for(const room of Object.values(TOWER_ROOMS))for(let x=178;x<=201;x++)for(let z=95;z<=118;z++){
  const dx=x+.5-CITY.shanghai.x,dz=z+.5-CITY.shanghai.z,d=Math.hypot(dx,dz),a=Math.atan2(dz,dx),r=profile(room.y+2,a)-.5;
  if(d<=r+.1){w.set(x,room.y-1,z,9);w.set(x,room.y+5,z,9);}
  for(let y=room.y;y<room.y+5;y++)if(d<=profile(y,a)+.5)w.set(x,y,z,0);
 }
 // Ground level: a real walk-in lobby and an unobstructed south entry.
 for(let x=184;x<=195;x++)for(let z=101;z<=117;z++)if(Math.hypot(x+.5-CITY.shanghai.x,z+.5-CITY.shanghai.z)<6){w.fill(x,26,z,x,31,z,0);w.set(x,25,z,9);}
 w.fill(187,26,110,191,30,118,0);w.fill(187,25,110,191,25,118,9);
}
