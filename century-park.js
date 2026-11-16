export const CENTURY_PARK={
 bounds:{minX:316,maxX:383,minZ:45,maxZ:124},
 arrival:{x:321.5,y:26,z:58.5,name:'世纪公园 · 西入口',viewTarget:{x:331,y:27.8,z:66}},
 lake:{x:342,z:85},
 flowerClock:{minX:326,maxX:336,minZ:62,maxZ:71},
 bridge:{rails:[356,360],fromZ:82,toZ:96},
 signs:[
  [324.5,30.1,58.5,'世纪公园 · 镜天湖 / 世纪花钟'],
  [342.5,29.0,67.5,'镜天湖 · 湖滨观景台'],
  [358.5,29.4,80.5,'云帆桥 · 鸟类保护区'],
  [369.5,29.2,60.5,'乡土田园区 · 田埂与花圃'],
  [355.5,29.0,112.5,'疏林草坪 · 慢跑道']
 ]
};
const {bounds}=CENTURY_PARK;
export function addCenturyParkApproachChunks(desired,point,size,nearRadius){
 const firstX=bounds.minX-108,approachZ=8;
 if(point.x<firstX||point.x>=bounds.minX||point.z<bounds.minZ-approachZ||point.z>bounds.maxZ+approachZ)return;
 // Keep a continuous strip of inland terrain leading to the park's western trees.
 const start=Math.max(Math.floor(point.x/size)+nearRadius+1,Math.floor((bounds.minX-64)/size));
 const end=Math.floor((bounds.minX+14)/size);
 const centerZ=Math.floor(Math.max(bounds.minZ,Math.min(bounds.maxZ,point.z))/size);
 for(let x=start;x<=end;x++)for(let z=centerZ-1;z<=centerZ+1;z++)desired.add(x+','+z);
}

const oval=(x,z,cx,cz,rx,rz)=>((x-cx)/rx)**2+((z-cz)/rz)**2;
const ring=[[320,59],[335,59],[347,61],[354,66],[358,74],[358,99],[354,105],[347,111],[335,111],[327,105],[322,94],[321,77],[320,69],[320,59]];
const branches=[
 [[308,58],[323,58]],
 [[338,59],[341,67]],
 [[352,64],[359,57],[371,58],[378,65],[380,76],[380,97],[375,107],[367,111],[347,111]],
 [[353,115],[352,124],[352,127]],
 [[333,110],[344,118],[352,118]]
];
export const CENTURY_PARK_ROUTES={
 walking:[[321,69],[321,76],[322,92],[323,99],[328,104],[329,107],[324,107],[322,106],[321,102],[320,95],[319,87],[319,75],[321,69]],
 running:[[327,108],[334,115],[344,119],[357,119],[367,113],[366,109],[352,109],[337,108],[327,108]],
 cycling:[[358,74],[358,99],[362,104],[371,108],[378,102],[380,96],[380,74],[376,63],[370,59],[363,61],[358,67],[358,74]]
};

// The lake shares the world water plane. Its seabed, shelves and banks are real terrain.
export function centuryParkGround(x,z,base){
 if(x<bounds.minX||x>bounds.maxX||z<bounds.minZ||z>bounds.maxZ)return base;
 const jag=(Math.sin(x*1.2+z*.65)+Math.cos(z*.8-x*.4))*.026;
 const lake=Math.min(oval(x,z,342,85,13.8,17.8),oval(x,z,337,92,8.8,10.2));
 const marsh=oval(x,z,369,88,8.8,15.5);
 const island=oval(x,z,370,88,3.5,6.0)<=1+jag;
 const channel=oval(x,z,356,88,11.5,4.5);
 const basin=Math.min(lake,channel,island?Infinity:marsh)-jag;
 if(basin<.8)return 18;
 if(basin<=1)return 21;
 if(basin<1.13)return 24;
 return base;
}

const distanceToSegment=(x,z,ax,az,bx,bz)=>{
 const dx=bx-ax,dz=bz-az,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/(dx*dx+dz*dz)));
 return (x-ax-t*dx)**2+(z-az-t*dz)**2;
};
function trail(w,points,radius,id=6){
 for(let i=1;i<points.length;i++){
  const [ax,az]=points[i-1],[bx,bz]=points[i];
  for(let x=Math.floor(Math.min(ax,bx)-radius);x<=Math.max(ax,bx)+radius;x++){
   for(let z=Math.floor(Math.min(az,bz)-radius);z<=Math.max(az,bz)+radius;z++){
    const y=w.surfaceAt(x,z);
    if(y<25||distanceToSegment(x,z,ax,az,bx,bz)>radius**2)continue;
    w.fill(x,y-1,z,x,25,z,id);
   }
  }
 }
}

function tree(w,x,z,height,radius=2){
 if(w.get(x,25,z)!==1)return;
 w.fill(x,26,z,x,25+height,z,4);
 for(let y=height-1;y<=height+1;y++)w.disc(x,26+y,z,y===height-1?radius-.45:radius,5);
 w.set(x,28+height,z,5);
}

function gateAndClock(w){
 w.fill(316,25,54,333,25,61,9);
 for(const z of [54,62]){
  w.fill(318,26,z,319,30,z,9);
  w.fill(320,26,z,320,29,z,4);
 }
 w.fill(317,30,54,321,30,62,9);
 w.fill(318,31,55,320,31,61,3);
 // Two low terraces form the planter beneath the sloped floral clock.
 const {minX,maxX,minZ,maxZ}=CENTURY_PARK.flowerClock;
 w.fill(minX-1,25,minZ-1,maxX,25,maxZ,9);
 w.fill(minX,26,minZ,maxX-1,26,maxZ-1,5);
 w.fill(332,27,minZ,maxX-1,27,maxZ-1,5);
}

function waterfront(w){
 w.fill(339,25,64,343,25,72,7);
 for(const z of [68,71])for(const x of [339,343]){
  w.fill(x,w.surfaceAt(x,z)-1,z,x,26,z,4);
 }
 w.fill(339,26,72,343,26,72,4);
 for(const x of [339,343]){
  w.fill(x,26,69,x,26,72,4);
 }
 // The fabric sides and mast bases have real collision via these voxel supports.
 const {rails,fromZ,toZ}=CENTURY_PARK.bridge;
 for(let z=fromZ-2;z<=toZ+1;z++){
  for(let x=357;x<=359;x++)w.fill(x,24,z,x,25,z,9);
  if(z>=fromZ&&z<toZ)for(const x of rails)w.set(x,26,z,9);
 }
 for(const z of [fromZ+1,toZ-2])for(const x of rails){
  w.fill(x,w.surfaceAt(x,z)-1,z,x,27,z,9);
 }
 // Pebble beaches on the lake shelves, denser reeds on the quiet wetland side.
 for(let z=69;z<=103;z++)for(let x=327;x<=378;x++){
  if(w.surfaceAt(x,z)!==25||w.get(x,25,z))continue;
  if(x<356)w.set(x,24,z,(x*3+z*5)%7<2?3:6);
  else{
   w.set(x,24,z,2);
   if((x+z*3)%5<2)w.set(x,25,z,5);
  }
 }
}

function fieldsAndWoodland(w){
 for(const [x,z,h,r] of [
  [321,49,6,2],[326,49,5,2],[338,52,6,2],[345,52,5,2],[352,52,6,2],[359,49,5,2],
  [317,73,7,2],[318,81,6,2],[325,84,5,2],[317,89,6,2],[318,101,7,2],
  [321,113,6,2],[328,117,7,2],[338,120,5,2],[363,120,6,2],[376,115,5,2],
  [371,86,5,2],[369,90,5,2],[376,69,5,2],[374,51,6,2],[379,49,5,2]
 ])tree(w,x,z,h,r);
 for(let x=324;x<=330;x+=3)for(const z of [99,105,113]){
  if(w.get(x,25,z)===1)tree(w,x,z,4,2);
 }
 for(const [x,z,h] of [[326,96,5],[327,102,5],[332,107,5],[331,111,6],[333,115,5]])tree(w,x,z,h,2.4);
 for(const [x,z,h] of [[334,70,5],[349,66,6],[352,102,6],[364,76,5],[374,100,6]]){
  tree(w,x,z,h,2.6);
  if(w.get(x,26,z)!==4)continue;
  for(const [dx,dz] of [[-2,0],[2,0],[0,2]]){
   w.set(x+dx,25+h,z+dz,5);
   w.set(x+dx,24+h,z+dz,5);
  }
 }
 for(let x=363;x<=372;x+=2)for(let z=47;z<=54;z++){
  w.set(x,25,z,2);
  if((z+x)%3!==1)w.set(x,26,z,12);
 }
 // A small field pavilion and benches frame the lawn while its middle stays open.
 for(const x of [372,377])for(const z of [110,113])w.fill(x,26,z,x,29,z,4);
 w.fill(371,29,109,378,29,114,9);
 w.fill(372,30,110,377,30,113,4);
 w.fill(372,25,110,377,25,113,7);
 for(const [x,z] of [[333,72],[347,62],[345,114],[363,120]]){
  if(w.surfaceAt(x,z)!==26)continue;
  w.fill(x-1,26,z,x+1,26,z,7);
 }
}

export function buildCenturyPark(w){
 // The surrounding city builder paves generic blocks before the park owns them.
 for(let x=bounds.minX;x<=bounds.maxX;x++)for(let z=bounds.minZ;z<=bounds.maxZ;z++){
  const y=w.surfaceAt(x,z);
  if(y>=25)w.set(x,y-1,z,1);
 }
 trail(w,ring,1.45);
 for(const points of branches)trail(w,points,1.35);
 trail(w,CENTURY_PARK_ROUTES.walking,1.2);
 trail(w,CENTURY_PARK_ROUTES.running,1.4,8);
 trail(w,CENTURY_PARK_ROUTES.cycling,1.35,3);
 gateAndClock(w);
 waterfront(w);
 fieldsAndWoodland(w);
}

export function centuryParkChunk(cx,cz,size){
 return (cx+1)*size>308&&cx*size<=bounds.maxX&&(cz+1)*size>bounds.minZ&&cz*size<=127;
}
const cherry=[2.55,.70,1.65],sunflower=[1.1,.83,.11],trailTone=[.88,.82,.74],sail=[1.13,1.17,1.24];
const runningTone=[1.12,.72,.65],cycleTone=[.62,.90,.80];
export function centuryParkShade(x,y,z,id){
 if(x<308||x>bounds.maxX||z<bounds.minZ||z>127)return;
 if(id===6&&y===25)return trailTone;
 if(id===8&&y===25)return runningTone;
 if(id===3&&y===25&&x>350&&x<382&&z<=bounds.maxZ)return cycleTone;
 if(id===9&&x>=356&&x<=360&&z>=82&&z<96&&y>=24&&y<=27)return sail;
 if(id===5&&x>=322&&x<=335&&z>=95&&z<=117&&y>=29)return cherry;
 if(id===12&&x>=363&&x<=372&&z>=47&&z<=54&&y===26)return sunflower;
}
