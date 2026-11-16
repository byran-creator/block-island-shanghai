import {STOREFRONT_GLASS_TILE} from './nanjing-west-layout.js';
import {buildStreetFrontage,streetFrontageLight} from './puxi-street-front.js';

// Frontages stop short of the existing pavements. Gaps line up with the
// walkable lanes in the older blocks on either side of Jiujiang and Hankou.
const parcels=[
 // Jiujiang: small infill beside the existing larger storefronts.
 [-156,-152,86,93,34,0],[-140,-135,86,93,36,1],
 [-117,-110,86,93,35,2],[-91,-83,86,93,34,1],
 [-26,-22,87,93,33,0],
 [-180,-175,112,106,34,0],[-160,-152,113,105,35,1],
 [-137,-129,112,105,33,2],[-117,-112,112,105,34,0],
 [-94,-91,111,106,33,2],[-86,-83,111,105,33,0],[-21,-15,111,105,36,1],
 // Hankou: a tighter street wall, with alternating brick and stone shopfronts.
 [-117,-112,116,120,34,0],[-108,-100,117,121,35,2],[-99,-91,116,120,34,1],
 [-86,-78,116,120,36,0],[-77,-72,117,121,33,2],
 [-67,-61,116,120,35,1],[-60,-54,116,120,33,0],
 [-49,-38,116,121,36,2],[-33,-20,116,120,34,0],
 [-116,-112,137,132,34,1],[-108,-100,137,132,35,0],[-99,-91,137,133,34,2],
 [-86,-78,137,132,33,0],[-77,-72,137,132,35,1],
 [-67,-60,137,133,34,2],[-59,-56,137,132,33,0],
 [-52,-44,137,132,35,1],[-40,-33,137,133,34,0],[-29,-20,137,132,36,2]
];

const bookshops=[
 [-116,-112,156,160,34,0],[-94,-90,156,160,34,2],[-67,-56,155,160,35,0],
 [-52,-44,156,160,34,2],[-40,-33,156,160,33,0],
 [-16,-7,156,160,35,2],[-3,6,156,160,34,0],[9,16,156,160,33,2],
 [-116,-112,173,168,33,2],[-94,-90,173,168,34,0],[-67,-56,173,168,34,2],
 [-52,-44,173,168,35,0],[-40,-33,173,168,33,0],[-29,-19,173,168,34,2],
 [-16,-7,173,168,34,0],[-3,6,173,168,35,2],[9,16,173,168,34,0]
];
const bookTile=27,bookLane={minX:-116,maxX:48};
export const JIUJIANG_HANKOU_BOUNDS={minX:-180,maxX:48,minZ:86,maxZ:173,minY:25,maxY:40};
export const JIUJIANG_HANKOU_PASSAGES=[-110,-88,-69,-51,-35];
export const HANKOU_SOUTH_PASSAGES=[-110,-88,-69,-54,-42,-31];
export const HISTORIC_STREET_SIGNS=[
 {bounds:{minX:-161,maxX:-120,minZ:86,maxZ:113},signs:[[-132.5,33.65,103.9,'九江路 · 旧银行街']]},
 {bounds:{minX:-104,maxX:-59,minZ:116,maxZ:137},signs:[[-81.5,32.7,121.14,'汉口路 · 报馆街']]},
 {bounds:{minX:-70,maxX:20,minZ:155,maxZ:173},signs:[[-61.5,30.64,161.16,'文汇书局'],[-22.5,30.64,167.84,'纸墨书房']]}
];

function bankFront(w,left,right,back,face,top){
 const side=Math.sign(face-back),middle=Math.floor((left+right)/2);
 w.fill(left,31,face,right,top,face,9);
 for(let x=left+1;x<right;x+=3){
  w.fill(x,32,face,x,top-1,face,11);
  w.set(x,top-1,face,6);
 }
 for(const x of [left,right]){
  w.fill(x,26,face,x,top,face,6);
  w.fill(x,30,face+side,x,top,face+side,9);
 }
 w.fill(middle,26,face,middle,29,face,3);
 w.fill(middle-1,30,face+side,middle+1,31,face+side,6);
 w.fill(left,top,face+side,right,top,face+side,6);
 w.fill(left,top+1,face,right,top+1,face,9);
}

function pressFront(w,left,right,back,face,top){
 const side=Math.sign(face-back),middle=Math.floor((left+right)/2);
 w.fill(left,30,face,right,top,face,8);
 for(let x=left+1;x<right-1;x+=4){
  w.fill(x,32,face,x+1,top-1,face,11);
  w.fill(x,31,face+side,x+1,31,face+side,6);
 }
 w.fill(left,top,face+side,right,top,face+side,8);
 const span=Math.min(3,Math.floor((right-left)/2));
 const near=Math.min(face,face-side),far=Math.max(face,face-side);
 w.fill(middle-span,top+1,near,middle+span,top+1,far,8);
 w.fill(middle-span+1,top+2,near,middle+span-1,top+2,far,8);
 w.set(middle,top+3,face,6);
}

function bookshopFront(w,[left,right,back,face,top,style]){
 const side=Math.sign(face-back),middle=Math.floor((left+right)/2);
 const canopy=style===0?4:8;
 w.fill(left+1,27,face,right-1,29,face,11);
 w.fill(middle,26,face,middle,29,face,4);
 w.fill(left,30,face+side,right,30,face+side,canopy);
 w.fill(left,30,face,right,30,face,7);
 w.fill(left+1,top+1,face,right-1,top+1,face,3);
}

function streetAnchors(w){
 // Taller limestone parapet on Jiujiang, contrasting with the stepped
 // red-brick gable and cream sill of the Hankou press building.
 w.fill(-137,35,105,-129,35,105,9);
 w.fill(-135,36,105,-131,37,106,9);
 w.fill(-134,38,105,-132,38,106,6);
 w.fill(-136,30,105,-135,34,105,9);
 w.fill(-131,30,105,-130,34,105,9);
 w.fill(-85,37,119,-79,37,120,8);
 w.fill(-84,38,119,-80,38,120,8);
 w.fill(-83,39,119,-81,39,120,8);
 w.fill(-82,40,119,-82,40,120,9);
 w.fill(-85,32,120,-79,32,120,6);
}

function pave(w,x,z,roadContains,id=9){
 const ground=w.get(x,25,z);
 if(ground&&ground!==3&&!roadContains(x,z)&&!w.get(x,26,z))w.set(x,25,z,id);
}

export function buildJiujiangHankou(w,roadContains){
 for(const parcel of parcels){
  buildStreetFrontage(w,parcel);
  const [left,right,back,face,top]=parcel;
  const front=face<110?bankFront:pressFront;
  front(w,left,right,back,face,top);
 }
 streetAnchors(w);
 for(const [left,right,back,face,top,style] of bookshops){
  const shop=[left,right,back,face,top-2,style];
  buildStreetFrontage(w,shop);bookshopFront(w,shop);
 }
 for(let x=bookLane.minX;x<=bookLane.maxX;x++)for(let z=161;z<=167;z++){
  pave(w,x,z,roadContains,z===164?6:9);
 }
 for(const [columns,north,south] of [[JIUJIANG_HANKOU_PASSAGES,104,122],[HANKOU_SOUTH_PASSAGES,131,137]]){
  for(const x of columns)for(let px=x-1;px<=x+1;px++)for(let z=north;z<=south;z++){
   pave(w,px,z,roadContains);
  }
 }
 for(const x of HANKOU_SOUTH_PASSAGES)for(let px=x-1;px<=x+1;px++)for(let z=138;z<=160;z++)pave(w,px,z,roadContains);
}

export function jiujiangHankouChunk(cx,cz,size){
 const b=JIUJIANG_HANKOU_BOUNDS,x=cx*size,z=cz*size;
 return x+size>b.minX&&x<=b.maxX&&z+size>b.minZ&&z<=b.maxZ;
}

export function jiujiangHankouTile(x,y,z,id){
 if(id!==11||y<27||y>29)return;
 if(z===160||z===168)return bookshops.some(([left,right,,face])=>z===face&&x>left&&x<right)?bookTile:undefined;
 if(parcels.some(([left,right,,face])=>z===face&&x>left&&x<right))return STOREFRONT_GLASS_TILE;
}

export function drawBookshopTile(ctx){
 const x=(bookTile%14)*16,y=16;
 const colors=['#9e6651','#c6a77a','#608283','#d9bf92','#784957'];
 ctx.fillStyle='#48433b';ctx.fillRect(x,y,16,16);
 for(const shelf of [0,7]){
  for(let i=0;i<5;i++){
   const height=3+(i+shelf)%3;
   ctx.fillStyle=colors[(i+shelf)%colors.length];ctx.fillRect(x+1+3*i,y+7+shelf-height,2,height);
  }
  ctx.fillStyle='#8d6e49';ctx.fillRect(x+1,y+7+shelf,14,1);
 }
 ctx.fillStyle='#3a312a';ctx.fillRect(x,y,1,16);ctx.fillRect(x+15,y,1,16);
}
export const jiujiangHankouLightSources=[...parcels,...bookshops].map(streetFrontageLight);
export const jiujiangHankouLightBounds={...JIUJIANG_HANKOU_BOUNDS,minZ:88,maxZ:173,maxY:31};
