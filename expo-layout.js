import {riverEastEdge} from './shanghai-map.js';
import {CENTURY_PARK} from './century-park.js';
import {expoRoadAt} from './city-layout.js';
// Game coordinates, east +x / south +z.
const shore = [[173,216],[234,249],[259,267],[284,289],[308,293],[338,291],[357,299]];
function interpolate(points,z) {
 for (let i=1;i<points.length;i++) {
  const [az,ax]=points[i-1], [bz,bx]=points[i];
  if (z<=bz) return Math.round(ax+(bx-ax)*(z-az)/(bz-az));
 }
 return points.at(-1)[1];
}
export function expoBank(z) {
 return z<=234?Math.ceil(riverEastEdge(z))+2:interpolate(shore,z);
}
export function onExpoPromenade(x,z) {
 if(z<174||z>357)return false;
 const bank=expoBank(z);
 return x>=bank&&x<=bank+(z<214?3:10);
}

export const EXPO = {
 palace:{x:340,z:334,rx:23,rz:19,top:52},
 arena:{x:326,z:294,rx:21,rz:15,top:43},
 arrival:{x:377.5,y:26,z:303.5,name:'中华艺术宫 · 世博园',viewTarget:{x:340,y:39,z:334}},
 concert:{x:326.5,y:26,z:310.5,name:'梅赛德斯-奔驰文化中心',viewTarget:{x:326,y:31,z:294}},
 river:{x:296.5,y:26,z:315.5,name:'世博滨江 · 三道',viewTarget:{x:286,y:25,z:291}},
 bicycle:{x:302.5,z:316.5},
 bounds:{minX:215,maxX:394,minZ:173,maxZ:357},
 signs:[
  [215.5,28.6,174.5,'浦东滨江 · 南行：南浦大桥 / 世博园'],
  [244.5,28.7,218.5,'世博滨江 · 漫步道 / 跑步道 / 骑行道'],
  [298.5,28.6,314.5,'世博园 · 向东：中华艺术宫'],
  [304.5,28.4,271.5,'浦东南段 · 塘桥 / 南码头'],
  [276.5,29,246.5,'南码头 · 滨江艺术仓'],
  [326.5,29.5,308.5,'梅赛德斯-奔驰文化中心 · 南入口'],
  [332.5,30,319.5,'中华艺术宫 · 2010 上海世博会中国馆'],
  [309.5,29,326.5,'世博轴 · 世博源与阳光谷'],
  [319.5,30.3,350.5,'中华艺术宫站 · 地铁 8 号线 · 3号口地面标识']
 ]
};

export function expoChunk(cx,cz,size) {
 const b=EXPO.bounds;
 return (cx+1)*size>b.minX&&cx*size<=b.maxX&&(cz+1)*size>b.minZ&&cz*size<=b.maxZ;
}

export function addExpoLandmarkChunks(desired,point,size) {
 // An observer can approach the waterfront from the bridge or either bank.
 // Complete the footprint wherever part of the venue is already requested.
 for(const [venue,front,back] of [[EXPO.arena,15,17],[EXPO.palace,22,20]]){
  const minX=venue.x-venue.rx,maxX=venue.x+venue.rx,minZ=venue.z-front,maxZ=venue.z+back;
  const dx=Math.max(minX-point.x,point.x-maxX,0),dz=Math.max(minZ-point.z,point.z-maxZ,0);
  const limit=point.y>=38?164:145,keys=[];
  for(let x=Math.floor(minX/size);x<=Math.floor(maxX/size);x++){
   for(let z=Math.floor(minZ/size);z<=Math.floor(maxZ/size);z++)keys.push(x+','+z);
  }
  if(dx*dx+dz*dz<=limit*limit||keys.some(key=>desired.has(key)))for(const key of keys)desired.add(key);
 }
}

// North of the southern shoreline, the whole east side is mainland.
export const PUDONG_LAND_START = -224;
export const EXPO_SHORE = Array.from({length:582},(_,i)=>{
 const z=i+PUDONG_LAND_START;
 return z<=234?Math.floor(riverEastEdge(z))+2:expoBank(z);
});

const inside = (x,z,b,extra=0)=>Math.abs(x-b.x)<=b.rx+extra&&Math.abs(z-b.z)<=b.rz+extra;
export function expoProtected(x,y,z) {
 return y>=25&&z>=235&&z<=357&&
  (x>=expoBank(z)&&x<=expoBank(z)+10||inside(x,z,EXPO.palace,2)||inside(x,z,EXPO.arena,2));
}

// Use the existing terrain atlas. These color multipliers run only while meshing Expo chunks.
const crownRed=[1.45,.43,.43], beamShadow=[1.02,.30,.28];
const trackRed=[1.06,.70,.64], cycleGreen=[.61,.91,.87];
const fascia=[.15,.23,.30], lowerHull=[.62,.67,.71], seats=[.18,.38,.88], arenaFloor=[.59,.53,.45];
const display=[.70,.80,1.65];
export function expoShade(x,y,z,id) {
 if (id===8&&y>=26&&inside(x,z,EXPO.palace)) return y>=36&&y%2===0?beamShadow:crownRed;
 if (id===8&&y>=32&&y<=34&&z===EXPO.palace.z-22&&Math.abs(x-EXPO.palace.x)<=20) return crownRed;
 if (inside(x,z,EXPO.arena)&&y>=25&&y<=42) {
  if(id===11) return fascia;
  if(id===7) return seats;
  if(id===6) return arenaFloor;
  if(id===3) return lowerHull;
  if(id===12) return display;
 }
 if (id===8&&y===25&&z>=174&&z<=357) {
  const offset=x-expoBank(z);
  if (offset>=4&&offset<=5) return trackRed;
 }
 if (id===3&&y===25&&z>=174&&z<=357) {
  const offset=x-expoBank(z);
  if (offset>=7&&offset<=9) return cycleGreen;
 }
}

function buildPromenade(w) {
 for (let z=174;z<=357;z++) {
  const bank=expoBank(z), prev=expoBank(z-1);
  // Existing waterfront plots pinch the northern approach. Separate the lanes
  // after that approach and the Nanpu underpass, where the full width is clear.
  const width=(z<214?3:10)+Math.max(0,prev-bank);
  for (let offset=0;offset<=width;offset++) {
   const x=bank+offset;
   if (z<=234&&w.get(x,25,z)===0) w.fill(x,21,z,x,24,z,3);
   const paving=offset===0?3:offset<=3?9:offset<=5?8:offset===6||offset===10?1:3;
   w.set(x,25,z,offset===8&&z%7<2?9:paving);
  }
  // Solid parapet, with a continuous footprint around the stepped shoreline.
  const next=expoBank(z+1);
  if (z>=179&&(z<195||z>213)&&(z<340||z>344)&&z!==357) {
   w.fill(bank,26,z,Math.max(bank,next-1),26,z,9);
   if (z%12===2) {
    w.fill(bank,27,z,bank,28,z,3);
    w.set(bank,29,z,12);
   }
  }
 }
}

function buildPalace(w) {
 const {x,z}=EXPO.palace;
 w.fill(x-23,25,z-20,x+23,25,z+20,9);
 for (const dx of [-9,9]) for (const dz of [-7,7]) {
  w.fill(x+dx-2,26,z+dz-2,x+dx+2,39,z+dz+2,8);
  w.fill(x+dx,27,z+dz-2,x+dx,36,z+dz-2,3);
  w.fill(x+dx,27,z+dz+2,x+dx,36,z+dz+2,3);
 }
 // The deep, visible underside is a lattice of cantilevers with recessed soffits.
 for (const [y,rx,rz] of [[37,11,9],[39,13,11],[41,15,13],[43,17,15],[45,19,16],[47,21,18],[49,23,19]]) {
  w.fill(x-rx+1,y+1,z-rz+1,x+rx-1,y+1,z+rz-1,3);
  for(const dx of [-9,-5,-1,4,8])w.fill(x+dx,y,z-rz,x+dx+1,y+1,z+rz,8);
  for(const dz of [-7,-3,2,6])w.fill(x-rx,y,z+dz,x+rx,y+1,z+dz+1,8);
  for(const side of [-1,1]){
   w.fill(x-rx,y+1,z+side*rz,x+rx,y+1,z+side*rz,8);
   w.fill(x+side*rx,y+1,z-rz,x+side*rx,y+1,z+rz,8);
  }
 }
 w.fill(x-23,51,z-19,x+23,51,z+19,8);
 w.fill(x-18,52,z-15,x+18,52,z+15,3);
 for(const dx of [-16,0,16]){
  w.fill(x+dx,26,z-22,x+dx,34,z-22,9);
  w.fill(x+dx+1,32,z-22,x+dx+4,34,z-22,8);
  w.set(x+dx+1,34,z-22,12);
 }
 w.fill(x-19,25,z-1,x+7,25,z+1,6);
}

function buildArena(w) {
 const {x,z,rx,rz}=EXPO.arena;
 for (const [y,scale,id] of [[26,.78,3],[27,.82,3],[28,.85,3],[29,.90,3],[30,.94,3],[31,.97,3],[32,1,9],[33,1,11],[34,1,11],[35,1,9],[36,.99,9],[37,.96,9],[38,.90,9],[39,.82,9],[40,.70,9],[41,.53,9],[42,.31,9]]) {
  const a=rx*scale,b=rz*scale;
  for (let dx=-Math.floor(a);dx<=a;dx++) for (let dz=-Math.floor(b);dz<=b;dz++) {
   const distance=(dx/a)**2+(dz/b)**2;
   if(distance>1)continue;
   const inner=(dx/(a-1.7))**2+(dz/(b-1.7))**2;
   if(y>=39||inner>1)w.set(x+dx,y,z+dz,id);
  }
 }
 for(let dx=-16;dx<=16;dx++)for(let dz=-12;dz<=12;dz++){
  const radius=Math.hypot(dx/16,dz/12);
  if(radius>1)continue;
  w.set(x+dx,25,z+dz,6);
  const aisle=Math.abs(dx)<=2&&dz>0;
  if(radius<.56||aisle||dz<-6&&Math.abs(dx)<=8)continue;
  const tier=Math.min(5,Math.floor((radius-.56)*13));
  if(tier)w.fill(x+dx,26,z+dz,x+dx,25+tier,z+dz,Math.abs(dz)<=1?9:7);
 }
 w.fill(x-2,26,z+7,x+2,29,z+15,0);
 w.fill(x-2,25,z+8,x+2,25,z+17,9);
 // The stage and hanging four-sided display are static voxels.
 w.fill(x-7,26,z-8,x+7,27,z-4,3);
 w.fill(x-6,28,z-8,x+6,32,z-8,11);
 w.fill(x-5,30,z-7,x+5,31,z-7,12);
 w.fill(x-2,35,z-2,x+2,37,z+2,3);
 for(const side of [-1,1]){
  w.fill(x-1,36,z+2*side,x+1,36,z+2*side,12);
  w.fill(x+2*side,36,z-1,x+2*side,36,z+1,12);
 }
}

function buildAxis(w) {
 for (let z=314;z<=351;z++) w.fill(expoBank(z)+10,25,z,308,25,z,9);
 w.fill(302,25,314,310,25,351,9);
 for (const z of [319,345]) {
  // Open square-sided funnels evoke the glass sunlight valleys without an extra mesh.
  for (let i=0;i<4;i++) {
   const r=1+i, y=26+i*2;
   for (const side of [-1,1]) {
    w.fill(309-r,y,z+side*r,309+r,y+1,z+side*r,11);
    w.fill(309+side*r,y,z-r,309+side*r,y+1,z+r,11);
   }
  }
 }
 // Surface-only station pavilion. Floor-level circulation remains open.
 for (const x of [316,322]) w.fill(x,26,351,x,28,352,9);
 w.fill(316,29,351,322,29,352,11);
 w.fill(315,25,348,323,25,355,9);
 for (const [x,z] of [[305,333],[314,355]]) {
  w.fill(x-2,25,z-2,x+2,25,z+2,9);
  for (const dx of [-2,2]) for (const dz of [-2,2]) w.fill(x+dx,26,z+dz,x+dx,28,z+dz,3);
  w.fill(x-2,29,z-2,x+2,29,z+2,9);
 }
}

function buildPlazaEdge(w) {
 // Low public frontage keeps the arena and the Crown visible above the plaza.
 for (const [x,z,width,depth] of [[371,325,6,4],[368,345,7,4]]) {
  w.fill(x,25,z,x+width,25,z+depth,9);
  w.fill(x,29,z,x+width,29,z+depth,9);
  w.fill(x+1,30,z+1,x+width-1,30,z+depth-1,3);
  for (const dx of [0,width]) {
   w.fill(x+dx,26,z,x+dx,28,z+depth,9);
  }
  w.fill(x,26,z,x+width,28,z,11);
 }
 for (const [x,z] of [[304,327],[304,341],[372,319],[375,338]]) {
  w.fill(x,26,z,x,29,z,4);
  w.fill(x-1,29,z-1,x+1,30,z+1,5);
  w.set(x,31,z,5);
 }
}

const southBlocks=[
  [330,234,6,4,15],[345,234,5,4,18],[377,233,7,4,13],
  [333,259,7,5,12],[350,260,4,4,16],[378,258,7,5,11],
  [352,283,5,4,12],[380,282,8,5,8],
  [327,220,5,3,10],[345,220,5,3,12],[375,217,6,4,10],
  [322,241,4,3,8],[347,244,4,2,7],[370,243,5,3,11],
  [324,265,4,3,7],[371,265,4,2,8],[289,233,6,4,11],[299,256,5,5,12],
  [307,286,5,3,8],[380,319,6,3,10],[387,330,5,4,13],[385,348,6,4,9]
];
const eastBlocks=[
 [331,-114,6,4,11],[354,-106,7,5,14],[369,-89,5,4,17],[394,-63,4,5,13],
 [337,-39,6,4,14],[352,-43,5,5,19],[370,-22,5,4,11],[395,-21,3,5,16],
 [331,12,5,5,15],[350,16,7,5,14],[373,20,6,4,17],[391,23,5,5,12],
 [340,34,6,3,10],[369,34,5,4,11],[391,56,4,5,15],[392,87,4,5,12],
 [391,113,4,5,17],[335,143,6,5,16],[354,142,7,4,12],[377,143,6,4,15],
 [391,153,4,4,11],[329,166,5,4,16],[345,168,6,5,18],[371,171,7,5,13],
 [389,182,5,5,14],[329,192,5,4,12],[354,198,5,4,14],[373,198,6,5,12]
];

function buildQuarterBlock(w,roadContains,x,z,rx,rz,height,style){
 const top=25+height,brick=style===1,wall=brick?8:9;
 // Respect roads and earlier landmarks when filling parcels near city edges.
 for(let px=x-rx-1;px<=x+rx+1;px++)for(let pz=z-rz-1;pz<=z+rz+1;pz++){
  // The regional roads are already paved at their exact widths. Use that
  // footprint below so the wider navigation margin cannot erase nearby plots.
  if(roadContains(px,pz)&&!expoRoadAt(px,pz,2)||!w.get(px,25,pz)||w.get(px,26,pz)||w.get(px,28,pz))return;
  if(Math.abs(px-x)<=rx&&Math.abs(pz-z)<=rz&&w.get(px,25,pz)===3)return;
 }
 w.fill(x-rx,25,z-rz,x+rx,25,z+rz,9);
 w.fill(x-rx,26,z-rz,x+rx,top,z+rz,wall);
 w.fill(x-rx+1,top+1,z-rz+1,x+rx-1,top+1,z+rz-1,style===2?9:3);
 for(let y=28;y<top-1;y+=3){
  for(const side of [-1,1]){
   // Residential ribbon windows, brick terraces or pale stone bays.
   for(let dx=1-rx;dx<rx-1;dx+=3){
    w.fill(x+dx,y,z+side*rz,x+dx+1,y+1,z+side*rz,11);
    if(style===0&&y>29&&dx%2===0)w.fill(x+dx,y-1,z+side*(rz+1),x+dx+1,y-1,z+side*(rz+1),9);
   }
   for(let dz=1-rz;dz<rz;dz+=3)w.set(x+side*rx,y,z+dz,11);
   if(brick)w.fill(x-rx,y-1,z+side*rz,x+rx,y-1,z+side*rz,9);
  }
 }
 if(style===2){
  w.fill(x-rx,26,z+rz,x+rx,28,z+rz,11);
  for(const dx of [-rx,0,rx])w.fill(x+dx,26,z+rz,x+dx,29,z+rz,3);
  w.fill(x-rx,29,z+rz,x+rx,29,z+rz+1,9);
 }
 if(brick){
  for(let dz=1-rz;dz<rz;dz++){
   const roofY=top+rz-Math.abs(dz);
   w.fill(x-rx+1,top+1,z+dz,x+rx-1,roofY,z+dz,8);
  }
 }
}

function buildPudongQuarters(w,roadContains) {
 const park=CENTURY_PARK.bounds;
 // Frame the park with the adjacent street grid.
 w.fill(park.minX-3,25,park.minZ-3,park.maxX+3,25,park.minZ-2,3);
 w.fill(park.minX-3,25,park.maxZ+2,park.maxX+3,25,park.maxZ+3,3);
 w.fill(park.minX-3,25,park.minZ-2,park.minX-2,25,park.maxZ+2,3);
 w.fill(park.maxX+2,25,park.minZ-2,park.maxX+3,25,park.maxZ+2,3);
 for(const [i,block] of [...southBlocks,...eastBlocks].entries())buildQuarterBlock(w,roadContains,...block,i%3);
 // Industrial waterfront silhouette inspired by the converted coal bunkers.
 const x=276,z=239;
 w.fill(x-5,25,z-6,x+5,25,z+6,9);
 for(const dz of [-4,0,4]){
  w.fill(x-3,26,z+dz-1,x+3,34,z+dz+1,3);
  w.fill(x-4,34,z+dz-1,x+4,35,z+dz+1,9);
 }
 w.fill(x-4,30,z-6,x-4,32,z+6,11);
 w.fill(x-5,33,z-6,x-3,33,z+6,9);
 w.fill(x+3,36,z-5,x+3,39,z-4,8);
}

export function buildExpo(w,roadContains) {
 buildPromenade(w);
 // The signposted plaza connects the arena, promenade and museum entrances.
 w.fill(298,25,311,325,25,318,9);
 w.fill(310,25,317,316,25,348,9);
 w.fill(325,25,305,332,25,318,9);
 w.fill(310,25,346,320,25,360,9);
 buildPalace(w);
 buildArena(w);
 buildAxis(w);
 buildPlazaEdge(w);
 buildPudongQuarters(w,roadContains);
 // Keep the running lane legible where the arena plaza meets the waterfront.
 for(let z=311;z<=315;z++){
  const x=expoBank(z)+5;
  w.set(x,25,z,8);
 }
}
