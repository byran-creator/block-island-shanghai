export const XINTIANDI={
 bounds:{minX:-201,maxX:-136,minZ:155,maxZ:199},
 facade:{minX:-179,maxX:-149,minZ:165,frontZ:174,entryX:-158,doors:[-176,-170,-164,-158,-152]},
 arrival:{x:-158.5,y:26,z:188.5,name:'中共一大会址 · 兴业路',viewTarget:{x:-158,y:30.4,z:175}},
 signs:[[-139.5,29,179.5,'兴业路 · 中共一大会址'],[-176.5,28.8,193.5,'新天地 · 石库门里弄'],[-165.5,29,140,'新天地 · 太仓路街坊'],[-219,29,163,'新天地 · 马当路小院']]
};
const northBlock={minX:-204,maxX:-136,minZ:119,maxZ:140};
const westCourt={minX:-232,maxX:-218,minZ:151,maxZ:173};
const taicangSouth={minX:-201,maxX:-136,minZ:149,maxZ:158};
const blocks=[XINTIANDI.bounds,northBlock,westCourt,taicangSouth];

function inDistrict(x,z,margin=0){
 return blocks.some(b=>x>=b.minX-margin&&x<=b.maxX+margin&&z>=b.minZ-margin&&z<=b.maxZ+margin);
}
export function xintiandiReserved(x,z){return inDistrict(x,z);}
export function xintiandiChunk(cx,cz,size){
 return blocks.some(b=>(cx+1)*size>b.minX&&cx*size<=b.maxX&&(cz+1)*size>b.minZ&&cz*size<=b.maxZ);
}
function roof(w,x1,x2,z1,z2,eave){
 for(let tier=0;tier<=Math.floor((z2-z1)/2);tier++){
  w.fill(x1,eave+tier,z1+tier,x2,eave+tier,z2-tier,3);
 }
}
function masonry(w,x1,x2,z1,z2,top){
 for(const x of [x1,x2])w.fill(x,26,z1,x,top,z2,8);
 for(const z of [z1,z2]){
  w.fill(x1,26,z,x2,top,z,8);
  w.fill(x1,28,z,x2,28,z,7);
  w.fill(x1,top-1,z,x2,top-1,z,7);
 }
}
function stoneGate(w,x,z,open){
 for(const xx of [x-2,x+2])w.fill(xx,26,z,xx,30,z,9);
 w.fill(x-2,30,z,x+2,30,z,9);
 w.fill(x-1,31,z,x+1,31,z,7);
 w.set(x,32,z,7);
 w.fill(x-1,26,z-1,x+1,29,z-1,open?0:4);
}
function congressHouse(w){
 const {minX,maxX,minZ,frontZ,entryX,doors}=XINTIANDI.facade;
 masonry(w,minX,maxX,minZ,frontZ,35);
 roof(w,minX-1,maxX+1,minZ-1,frontZ+1,35);
 for(const x of doors){
  stoneGate(w,x,frontZ+1,x===entryX);
  w.fill(x-1,32,frontZ,x+1,33,frontZ,11);
  w.fill(x,32,frontZ,x,33,frontZ,4);
  w.fill(x-2,34,frontZ+1,x+2,34,frontZ+1,9);
 }
 // A small interpretation room reached through the east-central doorway.
 w.fill(-166,25,166,-150,25,173,7);
 w.fill(-166,26,166,-166,32,173,8);
 w.fill(-178,26,167,-167,32,173,8);
 w.fill(-165,31,166,-150,31,173,4);
 w.fill(-163,26,167,-155,26,168,4);
 for(const x of [-163,-160,-157])w.set(x,26,170,7);
}
function laneHouse(w,x,z,north){
 const z1=z-3,z2=z+3,face=north?z1:z2,side=north?-1:1;
 masonry(w,x-3,x+3,z1,z2,32);
 roof(w,x-4,x+4,z1-1,z2+1,32);
 w.fill(x-2,25,z1,x+2,25,z2,7);
 for(const wallX of [x-1,x+1])w.fill(wallX,26,face+side,wallX,29,face+side,9);
 w.fill(x-1,29,face+side,x+1,29,face+side,7);
 w.fill(x,26,face,x,28,face,4);
 w.fill(x-1,30,face,x+1,31,face,11);
 w.fill(x,30,face,x,31,face,4);
}
function planeTree(w,x,z,height){
 w.fill(x,26,z,x,25+height,z,4);
 w.disc(x,24+height,z,2,5);
 w.disc(x,25+height,z,3,5);
 w.disc(x,26+height,z,2,5);
}

export function buildXintiandi(w){
 const {minX,maxX,minZ,maxZ}=XINTIANDI.bounds;
 w.fill(minX,25,minZ,maxX,25,maxZ,9);
 // Xingye Road, rear alley and south pedestrian approaches use different paving.
 w.fill(minX,25,177,maxX,25,181,3);
 w.fill(minX+2,25,161,maxX-3,25,163,6);
 w.fill(-163,25,182,-154,25,199,6);
 w.fill(-185,25,189,-138,25,191,6);
 congressHouse(w);
 for(const [x,z,north] of [[-195,164,false],[-187,161,false],[-195,185,false],[-180,185,false],[-171,185,false],[-146,185,false],[-195,195,true],[-180,195,true],[-171,195,true],[-146,195,true]]){
  laneHouse(w,x,z,north);
 }
 w.fill(-192,25,171,-184,25,176,6);
 for(const [x,z,h] of [[-198,171,5],[-189,172,5],[-185,174,6],[-142,175,5],[-151,182,5],[-139,193,6],[-184,197,5]])planeTree(w,x,z,h);
 for(const x of [-182,-142])w.fill(x,26,184,x,26,185,7);
 buildNeighborBlocks(w);
 buildTaicangSouth(w);
}
function buildTaicangSouth(w){
 const {minX,maxX,minZ,maxZ}=taicangSouth;
 w.fill(minX,25,minZ,maxX,25,maxZ,9);
 w.fill(minX+1,25,149,maxX-1,25,150,6);
 for(const x of [-196,-181,-172,-154,-144])laneHouse(w,x,154,true);
 for(const x of [-165,-137]){
  w.fill(x-1,25,150,x+1,25,158,6);
  stoneGate(w,x,152,true);
 }
 planeTree(w,-189,152,4);
 planeTree(w,-160,152,5);
}
function buildNeighborBlocks(w){
 // Short frontage lanes and two entries from Taicang Road.
 const n=northBlock;
 w.fill(n.minX,25,n.minZ,n.maxX,25,n.maxZ,9);
 w.fill(n.minX+1,25,128,n.maxX-1,25,131,6);
 w.fill(n.minX+1,25,139,n.maxX-1,25,140,6);
 for(const x of [-198,-188,-176,-156,-145])laneHouse(w,x,123,false);
 for(const x of [-198,-188,-176,-157,-147])laneHouse(w,x,135,false);
 w.fill(-168,25,123,-164,25,140,6);
 stoneGate(w,-166,129,true);
 planeTree(w,-161,130,4);
 for(const x of [-166,-137]){
  w.fill(x-1,25,135,x+1,25,142,6);
  stoneGate(w,x,138,true);
 }
 planeTree(w,-169,136,5);
 planeTree(w,-141,136,4);
 // A smaller residential court across Madang Road with paired stone gates.
 const m=westCourt;
 w.fill(m.minX,25,m.minZ,m.maxX,25,m.maxZ,9);
 w.fill(-225,25,154,-220,25,171,6);
 w.fill(-222,25,161,-214,25,164,6);
 laneHouse(w,-228,155,false);
 laneHouse(w,-228,169,true);
 laneHouse(w,-220,168,true);
 planeTree(w,-230,162,5);
 planeTree(w,-219,154,4);
}

const blueBrick=[.38,1.00,1.60],redBands=[.98,.58,.54],slate=[.46,.57,.69],blackLacquer=[.35,.46,.55];
const oldStone=[.83,.85,.85],limestone=[1.02,.95,.83],warmGlass=[.61,.43,.40];
export function xintiandiShade(x,y,z,id){
 if(!inDistrict(x,z))return;
 if(id===8)return blueBrick;
 if(id===7&&y>=27)return redBands;
 if(id===3)return y>=32?slate:oldStone;
 if(id===4&&y<=34)return blackLacquer;
 if(id===9&&y>=26)return limestone;
 if(id===11)return warmGlass;
}
