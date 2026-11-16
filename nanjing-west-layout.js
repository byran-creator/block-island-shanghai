const centerX=-268, frontZ=29, towerZ=36;
export const STOREFRONT_GLASS_TILE=26;
const retail=[
 {left:-261,right:-247,back:5,front:7,doors:[-258,-250],accent:9},
 {left:-244,right:-229,back:1,front:7,doors:[-241,-232],accent:3},
 {left:-226,right:-215,back:1,front:7,doors:[-222],accent:9}
];

export const NANJING_WEST={
 bounds:{minX:-276,maxX:-215,minZ:1,maxZ:48},
 exhibition:{minX:-276,maxX:-246,minZ:20,maxZ:48},
 spire:{x:centerX+.5,y:59.95,z:towerZ+.5},
 arrival:{x:centerX+.5,y:26,z:22.5,name:'上海展览中心',viewTarget:{x:centerX+.5,y:39,z:towerZ+.5}},
 signs:[
  [centerX+.5,33.5,frontZ-2.15,'上海展览中心'],
  [-237.5,30.65,8.85,'恒隆广场']
 ]
};

function exhibition(w){
 const x=centerX,z=frontZ;
 // A level forecourt keeps the route from the sidewalk through the portico open.
 w.fill(x-8,25,20,x+6,25,z+3,9);
 w.fill(x-2,25,20,x+2,25,z+6,6);
 for(const side of [-1,1]){
  const px=x+side*5;
  w.fill(px-1,25,22,px+1,25,25,1);
  w.set(px,26,23,5);
  w.set(px,26,24,5);
 }

 // Main hall, eaves, and colonnaded north portal.
 w.fill(x-7,26,z+3,x+6,35,41,9);
 w.fill(x-5,26,z+3,x+4,31,39,0);
 w.fill(x-2,25,z+3,x+2,25,39,6);
 w.fill(x-6,32,z-1,x+6,33,z+3,9);
 w.fill(x-7,34,z-2,x+6,34,41,9);
 w.fill(x-6,35,z,x+5,35,40,6);
 for(const px of [x-6,x-4,x+4,x+6]){
  w.fill(px,26,z,px,31,z,9);
  w.set(px,26,z-1,6);
  w.set(px,31,z-1,6);
 }
 for(const px of [x-6,x-4,x+4,x+6])w.fill(px,28,z+3,px,30,z+3,3);
 w.fill(x-3,36,z+1,x+3,36,z+4,9);
 w.fill(x-2,37,z+2,x+2,37,z+4,6);

 // Low exhibition wing behind the street-front plot.
 const left=x-8,right=-246,near=35,far=48;
 w.fill(left,25,near,right,25,far,9);
 w.fill(left,26,42,right,31,far,9);
 w.fill(x+7,26,near,right,31,41,9);
 w.fill(left,32,42,right,32,far,6);
 w.fill(x+7,32,near,right,32,41,6);
 for(let px=x+8;px<right;px+=3)w.fill(px,27,near,px,29,near,3);
 for(let px=left+2;px<right;px+=3)w.fill(px,27,far,px,29,far,3);
 for(const px of [left+2,right-2]){
  w.fill(px-1,32,44,px+1,34,46,9);
  w.fill(px-1,35,44,px+1,35,46,7);
  w.set(px,36,45,7);
 }

 // The tiered central tower tapers to a gold spire.
 w.fill(x-3,36,towerZ-3,x+3,40,towerZ+3,9);
 w.fill(x-2,41,towerZ-2,x+2,45,towerZ+2,9);
 for(const pz of [towerZ-2,towerZ+2])for(const px of [x-1,x+1])w.fill(px,42,pz,px,44,pz,3);
 w.fill(x-3,45,towerZ-3,x+3,45,towerZ+3,6);
 w.fill(x-2,46,towerZ-2,x+2,47,towerZ+2,7);
 w.fill(x-1,48,towerZ-1,x+1,49,towerZ+1,7);
 w.fill(x,50,towerZ,x,58,towerZ,7);
}

function storefront(w,{left,right,back,front,doors,accent}){
 w.fill(left,25,back,right,25,front+1,9);
 w.fill(left,26,back,right,30,front,9);
 w.fill(left+1,26,back+1,right-1,29,front-1,0);
 w.fill(left,31,back,right,31,front-1,accent);
 for(let x=left+1;x<right;x++){
  if(doors.includes(x)){
   w.fill(x-1,26,front-1,x,28,front,0);
   continue;
  }
  if(doors.includes(x+1)||((x-left)%4===0&&!doors.includes(x-1)))continue;
  w.fill(x,27,front,x,29,front,11);
 }
 for(const x of doors)w.fill(x-2,29,front+1,x+1,29,front+1,accent);
}

export function buildNanjingWest(w){
 exhibition(w);
 for(const plot of retail)storefront(w,plot);
}

export const nanjingWestCanopies=retail.flatMap(({doors,front})=>doors.map(x=>[x,front+2]));

const inside=(bounds,x,z)=>x>=bounds.minX&&x<=bounds.maxX&&z>=bounds.minZ&&z<=bounds.maxZ;
export function nanjingWestChunk(cx,cz,size){
 const b=NANJING_WEST.bounds,x=cx*size,z=cz*size;
 return x+size>b.minX&&x<=b.maxX&&z+size>b.minZ&&z<=b.maxZ;
}
const limestone=[1.13,1.06,.91],gold=[1.64,1.2,.52],molding=[1.07,.98,.82],bronze=[.62,.64,.69];
const display=[1.16,1.05,.87];
export function nanjingWestTile(x,y,z,id){
 if(id===11&&y>=27&&y<=29&&z===7&&retail.some(plot=>x>plot.left&&x<plot.right))return STOREFRONT_GLASS_TILE;
}
export function drawNanjingWestTile(ctx){
 const x=(STOREFRONT_GLASS_TILE%14)*16,y=16;
 const glass=ctx.createLinearGradient(x,y,x,y+16);
 glass.addColorStop(0,'#4a565b');
 glass.addColorStop(.52,'#a18966');
 glass.addColorStop(1,'#ddd0a2');
 ctx.fillStyle=glass;ctx.fillRect(x,y,16,16);
 ctx.fillStyle='#434448';ctx.fillRect(x,y,1,16);ctx.fillRect(x,y+14,16,2);
 ctx.fillStyle='#e0ceb0';ctx.fillRect(x+1,y+1,14,1);
}
export function nanjingWestShade(x,y,z,id){
 if(y>=25&&inside(NANJING_WEST.exhibition,x,z)){
  if(id===9)return limestone;
  if(id===6)return molding;
  if(id===7&&y>=35)return gold;
  if(id===3&&y>25)return bronze;
 }
 if(nanjingWestTile(x,y,z,id)!==undefined)return display;
}
