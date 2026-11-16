export const FUXING_PARK={
 bounds:{minX:-244,maxX:-215,minZ:215,maxZ:248},
 arrival:{x:-228.5,y:26,z:219.5,name:'复兴公园 · 北入口',viewTarget:{x:-228.5,y:27,z:231}},
 signs:[[-228.5,29.5,218,'复兴公园 · 玫瑰花坛']]
};

export const PUXI_SOUTH_ROADS=[
 ['fuxing-middle','复兴中路',-248,209,-138,209,2],
 ['sinan-road','思南路',-249,209,-249,298,2],
 ['jinan-road','济南路',-151,209,-151,298,2],
 ['jianguo-middle','建国中路',-249,253,-138,253,2],
 ['taikang-road','泰康路',-249,298,-151,298,2]
];

export function puxiSouthLand(x,z){
 if(z<202||z>326||x<-258||x>-131)return false;
 const setback=Math.max(0,Math.floor((z-304)/3));
 return x>=-258+setback&&x<=-131-setback;
}

// Plots leave continuous footways next to the shared road layout.
const homes=[
 [-195,225,8,7,15,8],[-173,226,8,8,10,9],[-135,227,3,6,13,8],
 [-192,241,7,5,12,9],[-170,241,8,5,16,8],[-135,242,3,5,11,9],
 [-233,268,9,6,13,9],[-232,284,9,5,11,8],[-194,267,8,6,12,8],
 [-174,268,7,7,16,9],[-191,284,10,5,15,9],[-170,284,6,5,11,8],
 [-135,272,3,8,13,9],[-135,291,3,5,11,8],
 [-230,311,9,5,12,8],[-190,312,9,5,15,9],[-169,311,8,5,11,8]
];

function residence(w,[x,z,rx,rz,height,wall]){
 const left=x-rx,right=x+rx,north=z-rz,south=z+rz,top=25+height;
 w.fill(left-1,25,north-1,right+1,25,south+1,9);
 for(const xx of [left,right])w.fill(xx,26,north,xx,top,south,wall);
 for(const zz of [north,south])w.fill(left,26,zz,right,top,zz,wall);
 w.fill(left+1,25,north+1,right-1,25,south-1,7);
 w.fill(x-1,26,north,x+1,28,north,0);
 w.fill(x-2,29,north-1,x+2,29,north,9);
 for(let y=29;y<top-1;y+=4){
  for(const zz of [north,south])for(let xx=left+2;xx<right-1;xx+=3){
   w.fill(xx,y+1,zz,xx+1,y+2,zz,11);
   w.fill(xx-1,y,zz+(zz===north?-1:1),xx+1,y,zz+(zz===north?-1:1),9);
  }
  for(const xx of [left,right])for(let zz=north+2;zz<south-1;zz+=3)w.fill(xx,y+1,zz,xx,y+2,zz,11);
  w.fill(left+1,y,north+1,right-1,y,south-1,7);
 }
 w.fill(left-1,top+1,north-1,right+1,top+1,south+1,9);
 if(wall===8){
  for(let tier=0;tier<=3;tier++)w.fill(left,top+2+tier,north+tier,right,top+2+tier,south-tier,8);
 }else{
  w.fill(left+2,top+2,north+2,right-2,top+2,south-2,3);
  w.fill(x-1,top+2,z-1,x+1,top+4,z+1,9);
 }
}

function tree(w,x,z){
 w.fill(x,26,z,x,30,z,4);
 w.disc(x,29,z,2,5);
 w.disc(x,30,z,3,5);
 w.disc(x,31,z,2,5);
}

function buildFuxingPark(w){
 const {minX,maxX,minZ,maxZ}=FUXING_PARK.bounds;
 w.fill(minX,25,minZ,maxX,25,maxZ,1);
 for(const x of [minX,maxX])w.fill(x,26,minZ,x,26,maxZ,5);
 for(const z of [minZ,maxZ]){
  w.fill(minX,26,z,-231,26,z,5);
  w.fill(-226,26,z,maxX,26,z,5);
  for(const x of [-231,-226])w.fill(x,26,z,x,28,z,9);
 }
 w.fill(-230,25,212,-227,25,250,9);
 w.fill(minX+1,25,230,maxX-1,25,233,9);
 for(const z of [220,243])w.fill(minX+2,25,z,maxX-2,25,z+1,6);
 for(const x of [minX+2,maxX-2])w.fill(x,25,219,x+1,25,244,6);
 for(const x of [-237,-221])for(const z of [225,238])parterre(w,x,z,x<-229?-1:1);
 fountain(w,-222,231);
 for(const [x,z,h] of [[-242,217,6],[-217,217,5],[-242,246,6],[-217,246,5],[-242,231,4],[-216,233,6]]){
  tree(w,x,z);
  w.fill(x,31,z,x,25+h,z,4);
  w.disc(x,26+h,z,3,5);
  w.disc(x,27+h,z,2,5);
  w.disc(x-1,25+h,z+1,2.4,5);
 }
 for(const [x,z] of [[-235,218],[-221,218],[-236,245],[-222,245]]){
  w.disc(x,26,z,1.45,5);
  w.set(x,27,z,5);
 }
 for(const [x,z] of [[-238,230],[-237,245],[-224,244],[-219,235]])w.fill(x-1,26,z,x+1,26,z,7);
}

function parterre(w,cx,cz,mirror){
 for(let x=cx-6;x<=cx+6;x++)for(let z=cz-4;z<=cz+4;z++){
  const u=(x-cx)*mirror/5.5,v=(z-cz)/3.75,r=Math.hypot(u,v);
  if(r>1.12)continue;
  const turn=Math.atan2(v,u),scroll=.22+(turn+Math.PI)*.095;
  const hedge=r>.87||Math.abs(r-scroll)<.15;
  w.set(x,25,z,hedge?5:r<.16?9:10);
  if(r>.87&&r<1&&Math.abs(v)<.45&&Math.abs(u)>.76)w.set(x,26,z,5);
 }
}

function fountain(w,cx,cz){
 for(let x=cx-3;x<=cx+3;x++)for(let z=cz-3;z<=cz+3;z++){
  const r=Math.hypot(x-cx,z-cz);
  if(r<=2)w.set(x,25,z,11);
  else if(r<=2.85)w.set(x,26,z,9);
 }
 w.set(cx,26,cz,9);
 w.set(cx,27,cz,9);
}

export function fuxingParkChunk(cx,cz,size){
 const b=FUXING_PARK.bounds,x=cx*size,z=cz*size;
 return x+size>b.minX&&x<=b.maxX&&z+size>b.minZ&&z<=b.maxZ;
}
export function fuxingParkTile(x,y,z,id){
 const b=FUXING_PARK.bounds;
 if(x<b.minX||x>b.maxX||z<b.minZ||z>b.maxZ||y<25)return;
 if(id===10)return (x+z)%3===0?23:22;
 if(id===5&&y<=27)return 24;
 if(id===11&&y===25)return 25;
}
export function drawFuxingParkTiles(ctx){
 function flower(id,colors){
  const ax=(id%14)*16;
  ctx.fillStyle='#547645';ctx.fillRect(ax,16,16,16);
  for(let i=0;i<17;i++){
   const x=(i*7+id)%14,z=(i*11+3)%14;
   ctx.fillStyle=colors[i%3];ctx.fillRect(ax+x,16+z,2,2);
   ctx.fillStyle='#ffead0';ctx.fillRect(ax+x+1,16+z,1,1);
  }
 }
 flower(22,['#bd335b','#fc8395','#d15479']);
 flower(23,['#eed9c8','#ffe8e1','#b14f72']);
 const hedge=(24%14)*16,water=(25%14)*16;
 ctx.fillStyle='#6b9539';ctx.fillRect(hedge,16,16,16);
 for(let i=0;i<22;i++){
  ctx.fillStyle=i%2?'#89a949':'#547c30';
  ctx.fillRect(hedge+(i*7)%15,16+(i*11)%15,1,1);
 }
 const still=ctx.createLinearGradient(water,16,water,32);
 still.addColorStop(0,'#a0d1bd');still.addColorStop(1,'#6f9e91');
 ctx.fillStyle=still;ctx.fillRect(water,16,16,16);
}

export function buildPuxiSouth(w){
 // Continue existing pedestrian routes through the seam south of Xingye Road.
 w.fill(-160,25,200,-156,25,206,6);
 w.fill(-230,25,200,-227,25,206,6);
 for(const home of homes)residence(w,home);
 buildFuxingPark(w);
 for(const [x,z] of [[-202,224],[-163,225],[-202,242],[-158,244],[-223,262],[-201,277],[-161,277],[-242,308],[-202,308]])tree(w,x,z);
}
