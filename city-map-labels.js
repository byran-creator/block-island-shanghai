import {EXPO} from './expo-layout.js';
import {CENTURY_PARK} from './century-park.js';
import {LANDMARKS} from './world.js';
import {TRAVEL_POINTS} from './map-travel.js';

const bund=TRAVEL_POINTS.find(p=>p.id==='bund');
const primary=[
 ['南京路步行街',-105,66.5],
 ['豫园',-46,238],
 ['中共一大会址',LANDMARKS.xintiandi.x,LANDMARKS.xintiandi.z],
 ['武康大楼',LANDMARKS.wukang.mapX,LANDMARKS.wukang.mapZ],
 ['静安寺',LANDMARKS.jingan.x,LANDMARKS.jingan.z],
 ['四行仓库',LANDMARKS.sihang.mapX,LANDMARKS.sihang.mapZ],
 ['外滩',bund.x,bund.z],
 ['陆家嘴',181,59],
 ['中华艺术宫',EXPO.palace.x,EXPO.palace.z],
 ['梅赛德斯-奔驰文化中心',EXPO.arena.x,EXPO.arena.z,21],
 ['世纪公园',CENTURY_PARK.lake.x+8,CENTURY_PARK.lake.z],
 ['南浦大桥',239,206.5],
 ['外白渡桥',LANDMARKS.waibaidu.x,LANDMARKS.waibaidu.z],
 ['黄浦江',85,117]
];
const hiddenTravelIds=new Set(['expo','expoArena','bund','nanjing','waibaidu','yuyuan','centuryPark','xintiandi','wukang','jingan','sihang']);
const shorter={
 shanghai:'上海中心',duoyun:'朵云书院',tower:'东方明珠',southPark:'陆家嘴绿地',
 helipad:'白玉兰停机坪',expoRiver:'世博滨江',puxiResidences:'衡复里',fuxingPark:'复兴公园'
};
const secondary=TRAVEL_POINTS.filter(p=>!hiddenTravelIds.has(p.id)&&!p.id.startsWith('metro-')&&!/(套房|私邸)/.test(p.name))
 .map(p=>[shorter[p.id]??p.name,p.mapX??p.x,p.mapZ??p.z]);
for(const id of ['mountain','outer','survivalCamp']){
 const p=LANDMARKS[id];
 secondary.push([p.name,p.x,p.z]);
}
const offsets=[
 [0,-24],[0,25],[0,-39],[0,40],[-34,-24],[34,-24],[-34,25],[34,25],[-60,0],[60,0],[0,-57],[0,57],
 [-53,-42],[53,-42],[-53,42],[53,42],[-84,-28],[84,-28],[-84,28],[84,28],[-62,58],[62,58],
 [-31,-75],[31,-75],[-31,75],[31,75],[-96,-58],[96,-58],[-96,58],[96,58]
];

export function layoutCityMapLabels(ctx,toPixel,size,toZ=toPixel,heightLimit=size){
 const labels=[];
 const boxes=TRAVEL_POINTS.map(p=>({x:toPixel(p.mapX??p.x)-9,y:toZ(p.mapZ??p.z)-9,w:18,h:18}));
 for(const [group,defaultFont] of [[primary,25],[secondary,20]]){
  for(const [name,x,z,font=defaultFont] of group){
   ctx.font=`700 ${font}px sans-serif`;
   const width=(ctx.measureText?.(name)?.width??name.length*font)+6,height=font+4;
   const px=toPixel(x),pz=toZ(z);
   let position;
   for(const [dx,dz] of offsets){
    const sx=Math.max(width/2+2,Math.min(size-width/2-2,px+dx));
    const sy=Math.max(height/2+2,Math.min(heightLimit-height/2-2,pz+dz));
    const box={x:sx-width/2,y:sy-height/2,w:width,h:height};
    if(boxes.some(b=>b.x<box.x+box.w&&b.x+b.w>box.x&&b.y<box.y+box.h&&b.y+b.h>box.y))continue;
    position={sx,sy};boxes.push(box);break;
   }
   if(position)labels.push({name,font,px,pz,...position});
  }
 }
 return labels;
}

export function drawCityMapLabels(ctx,labels){
 ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.strokeStyle='#e7f2ea90';ctx.lineWidth=1;
 for(const {px,pz,sx,sy} of labels){
  if(Math.hypot(sx-px,sy-pz)<75)continue;
  ctx.beginPath();ctx.moveTo(px,pz);ctx.lineTo(sx,sy);ctx.stroke();
 }
 ctx.lineJoin='round';ctx.lineWidth=4;ctx.strokeStyle='#15323d';ctx.fillStyle='#fff8e4';
 for(const {name,font,sx,sy} of labels){
  ctx.font=`700 ${font}px sans-serif`;
  ctx.strokeText(name,sx,sy);ctx.fillText(name,sx,sy);
 }
 ctx.restore();
}
