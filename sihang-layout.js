import {suzhouCenter,suzhouHalfWidth} from './waibaidu-layout.js';

const warehouse={west:-226,east:-211,north:-79,south:-49,top:47};
const plaza={west:-246,east:-227,north:-73,south:-55};
const bridge={x:-201,north:-42,south:-17,half:2};

// Each offset is a full voxel inside a shaped shell impact.
export const SIHANG_IMPACTS=[
 {z:-63,y:42,cells:[[0,0],[1,0],[0,1],[1,1],[2,1],[0,2],[1,2],[1,-1]]},
 {z:-55,y:39,cells:[[0,0],[1,0],[0,1],[1,1],[1,-1],[2,1]]},
 {z:-65,y:33,cells:[[0,0],[1,0],[1,1]]},
 {z:-75,y:37,cells:[[0,0],[0,1]]},
 {z:-70,y:41,cells:[[0,0]]},
 {z:-58,y:34,cells:[[0,0]]}
];

export const SIHANG={
 bounds:{minX:plaza.west,maxX:bridge.x+bridge.half,minZ:warehouse.north,maxZ:bridge.south},
 warehouse,bridge,
 arrival:{x:-241.5,y:26,z:-65.5,mapX:-219,mapZ:-63,name:'四行仓库 · 晋元纪念广场',viewTarget:{x:-225.9,y:35,z:-63}},
 signs:[[-216.5,29,-44.5,'光复路 · 四行仓库南入口']]
};

export function sihangProtected(x,y,z){
 return x>=warehouse.west&&x<=warehouse.east&&z>=warehouse.north&&z<=warehouse.south&&y>=25&&y<=warehouse.top+2||
  Math.abs(x-bridge.x)<=bridge.half&&z>=bridge.north&&z<=bridge.south&&y>=25&&y<=27;
}

function buildWarehouse(w){
 const {west,east,north,south,top}=warehouse;
 w.fill(west,25,north,east,top,south,9);
 w.fill(west+1,26,north+1,east-1,31,south-1,0);
 w.fill(west+1,25,north+1,east-1,25,south-1,3);
 for(const y of [27,32,36,40,44]){
  for(const x of [-224,-221,-218,-215])for(const z of [north,south]){
   w.fill(x,y,z,x+1,y+1,z,11);
   w.fill(x,y+2,z,x+1,y+2,z,6);
  }
  if(y>30)for(const z of [-76,-72,-68,-64,-60,-56,-52]){
   w.fill(east,y,z,east,y+1,z+1,11);
  }
 }
 // The regular south elevation faces Guangfu Road and the river.
 for(const x of [-225,-222,-219,-216,-213]){
  w.fill(x,26,south,x,45,south,6);
 }
 w.fill(-220,26,south,-218,29,south,0);
 w.fill(-222,30,south,-216,31,south,6);
 w.fill(west,46,south,east,46,south,6);
 w.fill(west,top+1,north,east,top+1,north,3);
 w.fill(west,top+1,south,east,top+1,south,3);
 for(const x of [west,east])w.fill(x,top+1,north,x,top+1,south,3);
 w.fill(-223,46,north+3,-215,top+2,south-3,9);
 w.fill(west+1,47,north,west+1,47,south,6);
 // Recessed damage stays backed by solid masonry. The material detail is painted on one plane.
 for(const {z,y,cells} of SIHANG_IMPACTS)for(const [dz,dy] of cells){
  w.set(west,y+dy,z+dz,0);
  w.set(west+1,y+dy,z+dz,8);
 }
 w.fill(west,26,-67,west,29,-65,0);
 w.fill(-225,26,-77,-222,26,-77,7);
 w.fill(-217,26,-77,-214,26,-77,7);
}

export function buildSihang(w){
 buildWarehouse(w);
 // Open the west square and river approach without moving the surveyed bank.
 for(let x=plaza.west;x<=bridge.x+2;x++){
  const bank=Math.ceil(suzhouCenter(x)-suzhouHalfWidth(x))-1;
  const edge=x<=plaza.east?plaza.south:bank;
  const start=x<=plaza.east?plaza.north:warehouse.south+1;
  for(let z=start;z<=Math.min(bank,edge);z++){
   if(w.get(x,25,z)&&!w.get(x,26,z))w.set(x,25,z,z===-66?6:9);
  }
 }
 w.fill(-241,26,-72,-236,27,-71,3);
 w.fill(bridge.x-bridge.half,25,bridge.north,bridge.x+bridge.half,25,bridge.south,9);
 for(const side of [-1,1]){
  const x=bridge.x+side*bridge.half;
  w.fill(x,26,bridge.north+1,x,26,bridge.south-1,3);
 }
 w.fill(bridge.x,20,-32,bridge.x,24,-31,3);
}

const ash=[.76,.76,.75],brick=[.82,.52,.42],windowTone=[.42,.52,.58];
export function sihangShade(x,y,z,id){
 if(x<warehouse.west||x>warehouse.east||z<warehouse.north||z>warehouse.south||y<26)return;
 if(id===9)return ash;
 if(id===8)return brick;
 if(id===11)return windowTone;
}

export function sihangChunk(cx,cz,size){
 const b=SIHANG.bounds;
 return (cx+1)*size>b.minX&&cx*size<=b.maxX&&(cz+1)*size>b.minZ&&cz*size<=b.maxZ;
}
