import {inSuzhou,suzhouCenter,suzhouHalfWidth,SUZHOU_WEST} from './waibaidu-layout.js';
import {buildJinganOffice} from './jingan-office.js';

const templeZ=z=>z-10;
const avenueZ=14;
export const JINGAN={
 bounds:{minX:-336,maxX:-218,minZ:-90,maxZ:43},
 temple:{minX:-321,maxX:-288,minZ:templeZ(-28),maxZ:templeZ(18)},
 arrival:{x:-303.5,y:26,z:templeZ(19.5),name:'静安寺 · 南京西路山门',viewTarget:{x:-303.5,y:35,z:templeZ(-9)}},
 signs:[
  [-303.5,30.1,templeZ(17.6),'静安寺 · 山门'],
  [-270.5,30.1,9.8,'久光百货'],
  [-317.5,30.1,32.2,'百乐门'],
  [-253.5,31,5.7,'静安嘉里中心'],
  [-298.5,29,31.6,'静安公园']
 ]
};

export const JINGAN_ROADS=[
 ['jingan-nanjing-west','南京西路',-331,avenueZ,-206,avenueZ,2],
 ['jingan-huashan','华山路',-326,-34,-326,42,2],
 ['jingan-changde','常德路',-281,-31,-281,42,2]
];

export const JINGAN_HALLS=[
 {id:'shanmen',x:-304,z:16,rx:7,rz:2,roof:33,layers:3,style:'xieshan'},
 {id:'drum',x:-317,z:10,rx:2,rz:2,roof:33,layers:2,style:'square',upperRoof:38,upperLayers:3},
 {id:'bell',x:-291,z:10,rx:2,rz:2,roof:33,layers:2,style:'square',upperRoof:38,upperLayers:3},
 {id:'west-cloister',x:-318,z:-3,rx:1,rz:9,roof:31,layers:2,style:'xieshan',noEaveDetail:true},
 {id:'east-cloister',x:-290,z:-3,rx:1,rz:9,roof:31,layers:2,style:'xieshan',noEaveDetail:true},
 {id:'mahavira',x:-304,z:-5,rx:9,rz:5,roof:33,layers:3,upper:true,upperRoof:39,upperLayers:5,style:'wudian'},
 {id:'dharma',x:-300,z:-21,rx:8,rz:4,roof:33,layers:3,upper:true,upperRoof:40,upperLayers:4,style:'xieshan'}
].map(hall=>({...hall,z:templeZ(hall.z)}));
export const JINGAN_TOWER={x:-316,z:templeZ(-23),firstTier:28,tiers:7};
export const JINGAN_ROOFS=[
 ...JINGAN_HALLS.flatMap(({id,x,z,rx,rz,roof:y,layers,style,upper,upperRoof,upperLayers,noEaveDetail})=>[
  {id,x,z,y,rx:rx+1,rz:rz+1,layers,style,chiwen:!noEaveDetail&&style!=='square',eaveDetail:!noEaveDetail},
  ...(upperRoof?[{id:id+'-upper',x,z,y:upperRoof,rx:style==='square'?rx+1:rx-(id==='mahavira'?0:1),rz:style==='square'?rz+1:rz+(id==='mahavira'?1:0),layers:upperLayers,style:upper?'wudian':style,chiwen:style!=='square',eaveDetail:true}]:[])
 ]),
 ...Array.from({length:JINGAN_TOWER.tiers},(_,i)=>{
  const {x,z,firstTier}=JINGAN_TOWER,r=i<2?3:2,h=i<3?3:2;
  const roofY=firstTier+(i<3?i*4:12+(i-3)*3)+h;
  return {id:'pagoda-'+i,x,z,y:roofY,rx:r+1,rz:r+1,layers:2,style:'square',chiwen:false,eaveDetail:i%2===0&&i<6};
 })
];
export const JINGAN_OFFICES=[
 {x:-312,z:-46,rx:7,rz:4,height:43,style:'ribbon'},
 {x:-271,z:2,rx:4,rz:6,height:10,style:'retail'},
 {x:-254,z:-3,rx:7,rz:7,height:46,style:'frame'},
 {x:-236,z:-6,rx:7,rz:6,height:36,style:'terrace'},
 {x:-237,z:-25,rx:6,rz:5,height:39,style:'fin'},
 {x:-270,z:-21,rx:5,rz:6,height:28,style:'split'},
 {x:-318,z:35,rx:3,rz:3,height:10,style:'ballroom'}
];

const avenueTrees=(xs,z)=>xs.map((x,i)=>[x,z,5+i%2]);
export const JINGAN_AVENUE_TREES=[
 ...avenueTrees([-278,-264,-255,-245,-234,-223,-212],avenueZ-4),
 ...avenueTrees([-320,-311,-297,-288,-277,-269,-263,-246,-236,-225,-218,-212],avenueZ+5)
];
const JINGAN_TREES=[
 ...JINGAN_AVENUE_TREES,
 [-311,40,4],[-299,38,5],[-289,38,5]
];
const inside=(b,x,z)=>x>=b.minX&&x<=b.maxX&&z>=b.minZ&&z<=b.maxZ;
export function jinganWestLand(x,z){
 if(x>=-288||x<-336||z<-104||z>43)return false;
 return x>=-336+Math.max(0,Math.floor((-96-z)/2));
}
export const jinganProtected=(x,y,z)=>y>=25&&inside(JINGAN.temple,x,z);
export function jinganChunk(cx,cz,size){
 const b=JINGAN.bounds,x=cx*size,z=cz*size;
 return x+size>b.minX&&x<=b.maxX&&z+size>b.minZ&&z<=b.maxZ;
}
export function addJinganBackdropChunks(desired,point,size,nearRadius){
 if(point.x<-341||point.x>-266||point.z<-31||point.z>44)return;
 const firstRow=Math.floor(-79/size);
 const lastRow=Math.min(Math.floor(-35/size),Math.floor(point.z/size)-nearRadius-1);
 // Keep the nearby roof and creek visible behind the temple from Nanjing West Road.
 for(let z=firstRow;z<=lastRow;z++){
  for(let x=Math.floor(JINGAN.bounds.minX/size);x<=Math.floor(-278/size);x++)desired.add(x+','+z);
 }
}
const gold=[1.55,1.16,.60],timber=[.77,.56,.39],wall=[.94,.69,.57],stone=[1.04,.98,.84];
const asphalt=[.37,.42,.43],steel=[.59,.76,.86],glass=[.67,1.03,1.2],mineral=[.93,.99,1.05];
export function jinganShade(x,y,z,id){
 if(!inside(JINGAN.bounds,x,z))return;
 const temple=inside(JINGAN.temple,x,z);
 if(id===7&&temple&&y>=31)return gold;
 if(id===4&&temple)return timber;
 if(id===8&&temple)return wall;
 if(id===9&&temple)return stone;
 if(id===3)return y===25?asphalt:steel;
 if(id===11)return glass;
 if(id===9&&y>25)return mineral;
}

function roof(w,x,z,y,rx,rz,layers,style='xieshan'){
 for(let i=0;i<layers;i++){
  const a=Math.max(0,rx-i),b=Math.max(style==='square'?0:1,rz-Math.floor((i+1)*.72));
  for(let xx=x-a;xx<=x+a;xx++)for(let zz=z-b;zz<=z+b;zz++){
   const edge=xx===x-a||xx===x+a||zz===z-b||zz===z+b;
   const corner=(xx===x-a||xx===x+a)&&(zz===z-b||zz===z+b);
   w.set(xx,y+i,zz,i===layers-1||corner||(i===0&&edge)?7:4);
  }
 }
 w.set(x,y,z,7);
 const topLayer=Math.max(0,rx-(layers-1));
 if(style==='square')w.set(x,y+layers,z,7);
 else w.fill(x-Math.max(1,topLayer-1),y+layers,z,x+Math.max(1,topLayer-1),y+layers,z,7);
 for(const sx of [-1,1])for(const sz of [-1,1]){
  w.set(x+sx*rx,y+1,z+sz*rz,7);
  if(layers>2&&rx>1)w.set(x+sx*(rx-1),y+2,z+sz*rz,7);
 }
}

function hall(w,h){
 const {id,x,z,rx,rz,roof:top,layers,style,upperRoof,upperLayers}=h;
 const left=x-rx,right=x+rx,north=z-rz,south=z+rz;
 w.fill(left,25,north,right,25,south,9);
 if(id==='shanmen'){
  w.fill(left,26,north,right,29,south,9);
  for(const ax of [0,-4,4]){
   w.fill(x+ax-1,26,north,x+ax+1,28,south,0);
   if(ax!==0)w.fill(x+ax-1,26,z,x+ax+1,28,z,8);
  }
  w.fill(left+1,30,north+1,right-1,32,south-1,8);
  for(let xx=left+1;xx<=right-1;xx+=2)for(const zz of [north,south])w.fill(xx,30,zz,xx,32,zz,4);
  roof(w,x,z,top,rx+1,rz+1,layers,style);
  return;
 }
 if(id==='bell'||id==='drum'){
  w.fill(left,26,north,right,29,south,9);
  w.fill(x-1,30,z-1,x+1,32,z+1,8);
  roof(w,x,z,top,rx+1,rz+1,layers,'square');
  for(const cx of [x-1,x+1])for(const cz of [z-1,z+1])w.fill(cx,35,cz,cx,37,cz,4);
  roof(w,x,z,upperRoof,rx+1,rz+1,upperLayers,'square');
  return;
 }
 if(id==='west-cloister'||id==='east-cloister'){
  const innerSide=id==='west-cloister'?1:-1;
  w.fill(left,26,north,right,30,south,8);
  for(let zz=north;zz<=south;zz+=3)w.fill(x+innerSide,26,zz,x+innerSide,30,zz,4);
  roof(w,x,z,top,rx+1,rz+1,layers,style);
  return;
 }
 if(id==='mahavira'){
  w.fill(left-1,26,north-1,right+1,27,south+1,9);
  w.fill(left+1,28,north+1,x-2,32,south-1,8);
  w.fill(x+2,28,north+1,right-1,32,south-1,8);
  w.fill(x-2,28,north+1,x+2,32,north+1,8);
  w.fill(x-2,32,south-1,x+2,32,south-1,4);
  for(let xx=left;xx<=right;xx+=3)if(xx!==x)for(const zz of [north,south])w.fill(xx,28,zz,xx,32,zz,4);
  w.fill(x-1,26,north-1,x+1,28,south+1,0);
  roof(w,x,z,top,rx+1,rz+1,layers,'wudian');
  const upRx=rx-2,upRz=rz-1;
  w.fill(x-upRx,36,z-upRz,x+upRx,38,z+upRz,8);
  for(let xx=x-upRx;xx<=x+upRx;xx+=3)w.fill(xx,36,z+upRz,xx,38,z+upRz,4);
  roof(w,x,z,upperRoof,upRx+2,upRz+2,upperLayers,'wudian');
  return;
 }
 if(id==='dharma'){
  w.fill(left,26,north,right,27,south,9);
  w.fill(left+1,28,north+1,right-1,32,south-1,8);
  w.fill(-305,26,north+1,-303,28,south+1,0);
  roof(w,x,z,top,rx+1,rz+1,layers,'xieshan');
  const upRx=rx-3,upRz=rz-2;
  w.fill(x-upRx,36,z-upRz,x+upRx,39,z+upRz,8);
  roof(w,x,z,upperRoof,upRx+2,upRz+2,upperLayers,'wudian');
 }
}

function pagoda(w,{x,z,firstTier,tiers}){
 w.fill(x-3,26,z-3,x+3,27,z+3,9);
 let py=firstTier;
 for(let i=0;i<tiers;i++){
  const r=i<2?3:2,h=i<3?3:2;
  w.fill(x-r,py,z-r,x+r,py+h-1,z+r,8);
  const roofY=py+h;
  roof(w,x,z,roofY,r+1,r+1,2,'square');
  py+=h+1;
 }
 w.fill(x-2,py,z-2,x+2,py+1,z+2,7);
 w.fill(x,py+2,z,x,py+6,z,7);
}

function tree(w,x,z,height){
 w.fill(x,26,z,x,25+height,z,4);
 for(const step of [1,2])for(const side of [-1,1])w.set(x+side*step,24+height+step,z,4);
 w.disc(x,25+height,z,2,5);
 w.disc(x,26+height,z,3,5);
 w.disc(x,27+height,z,2,5);
 w.set(x,25+height,z,4);
}

function canBuild(w,{x,z,rx,rz},roadContains){
 for(let xx=x-rx-1;xx<=x+rx+1;xx++)for(let zz=z-rz-1;zz<=z+rz+1;zz++){
  if(!w.get(xx,25,zz)||inSuzhou(xx,zz)||w.get(xx,26,zz)||w.get(xx,28,zz)||roadContains(xx,zz))return false;
 }
 return true;
}

function office(w,{x,z,rx,rz,height,style}){
 const top=25+height;
 w.fill(x-rx,25,z-rz,x+rx,25,z+rz,9);
 for(let y=26;y<=top;y++){
  const a=rx,b=rz,ledge=y===29||y===top;
  for(let xx=x-a;xx<=x+a;xx++)for(const zz of [z-b,z+b]){
   const glass=y>=28&&!ledge&&xx>x-a&&xx<x+a&&(xx-x+a)%3!==0;
   w.set(xx,y,zz,glass?11:style==='ballroom'?8:9);
  }
  for(let zz=z-b+1;zz<z+b;zz++)for(const xx of [x-a,x+a]){
   w.set(xx,y,zz,!ledge&&y>=30&&(zz-z+b)%3!==0?11:9);
  }
  if(y===top||y===29)w.fill(x-a+1,y,z-b+1,x+a-1,y,z+b-1,9);
 }
 w.fill(x-2,top+1,z-1,x+2,top+2,z+1,3);
 if(style==='retail'||style==='ballroom'){
  const side=style==='ballroom'?-1:1,front=z+side*rz;
  w.fill(x-2,26,front,x+2,28,front,0);
  w.fill(x-rx,30,front+side,x+rx,30,front+side,9);
 }
}

export function buildJingan(w,roadContains){
 const b=JINGAN.temple;
 w.fill(b.minX,25,b.minZ,b.maxX,25,b.maxZ+1,9);
 for(const x of [b.minX,b.maxX])w.fill(x,26,b.minZ,x,29,b.maxZ-1,8);
 w.fill(b.minX,26,b.minZ,b.maxX,29,b.minZ,8);
 for(const h of JINGAN_HALLS)hall(w,h);
 pagoda(w,JINGAN_TOWER);
 // Southeast Ashoka Pillar (正法久住梵幢 / 阿育王柱)
 const ax=-290,az=7;
 w.fill(ax-1,26,az-1,ax+1,27,az+1,9);
 w.fill(ax,28,az,ax,40,az,9);
 w.set(ax,41,az,7);
 w.fill(-314,25,30,-287,25,42,1);
 w.fill(-308,25,30,-304,25,42,9);
 w.fill(-311,25,35,-289,25,37,6);
 for(const [x,z,height] of JINGAN_TREES)tree(w,x,z,height);
 for(const plot of JINGAN_OFFICES){
  if(!canBuild(w,plot,roadContains))continue;
  if(plot.height>20)buildJinganOffice(w,plot);
  else office(w,plot);
 }
}

export function buildJinganBanks(w,roadContains){
 for(let x=SUZHOU_WEST.start;x<=-232;x++){
  const z=suzhouCenter(x),r=suzhouHalfWidth(x);
  for(const bank of [-1,1]){
   const edge=bank<0?Math.ceil(z-r)-1:Math.floor(z+r)+1;
   w.fill(x,19,edge,x,24,edge,9);
   for(let step=0;step<3;step++)w.set(x,25,edge+bank*step,9);
  }
 }
 // The footbridge follows Huashan Road and leaves the channel open underneath.
 const north=-84,south=-35;
 w.fill(-328,25,north,-324,25,south,9);
 for(const side of [-1,1]){
  const x=-326,edge=Math.round(suzhouCenter(x)+side*(suzhouHalfWidth(x)+2));
  w.fill(-328,19,edge,-324,24,edge,9);
 }
 for(const x of [-328,-324])for(let z=north;z<=south;z++)if(inSuzhou(x,z))w.set(x,26,z,9);
 for(const x of [-310,-291,-272,-252,-234])for(const bank of [-1,1]){
  const rx=4,rz=3,edges=[];
  for(let xx=x-rx-1;xx<=x+rx+1;xx++)edges.push(suzhouCenter(xx)+bank*suzhouHalfWidth(xx));
  const bankEdge=bank<0?Math.floor(Math.min(...edges)):Math.ceil(Math.max(...edges));
  // Set the north-bank filler back from the west-facing memorial wall.
  const location=x===-234&&bank===-1?{x:-262,z:-90}:{x,z:bankEdge+bank*(rz+4)};
  const plot={...location,rx,rz,height:10+(x+336)%7,style:'frame'};
  if(canBuild(w,plot,roadContains))office(w,plot);
 }
}
