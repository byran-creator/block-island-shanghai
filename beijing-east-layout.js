import {suzhouCenter,suzhouHalfWidth} from './waibaidu-layout.js';
import {STOREFRONT_GLASS_TILE} from './nanjing-west-layout.js';
import {buildStreetFrontage,streetFrontageLight} from './puxi-street-front.js';

// [left, right, rear, facade, cornice height, architectural style]
const parcels=[
 [-193,-183,3,7,35,0],[-182,-173,0,7,36,1],
 [-167,-159,3,7,37,2],[-158,-148,3,6,34,0],[-147,-132,3,7,36,1],
 [-126,-116,3,7,35,0],[-115,-103,3,6,37,2],[-102,-91,3,7,36,1],
 [-85,-75,3,7,34,0],[-74,-63,1,7,36,2],
 [-57,-46,3,7,37,1],[-45,-37,1,7,35,0],[-36,-31,3,7,34,2],
 [-198,-186,29,21,36,1],[-174,-163,29,21,35,0],[-157,-145,28,21,37,2],
 [-144,-132,29,22,36,1],[-131,-115,29,21,35,0],[-108,-96,28,21,36,1],
 [-85,-74,29,21,37,2],[-73,-68,29,21,34,0],[-51,-38,24,21,35,1]
];
export const BEIJING_EAST_BOUNDS={minX:-202,maxX:-31,minZ:-22,maxZ:40,minY:25,maxY:39};
export const BEIJING_EAST_NORTH_LANES=[-196,-170,-129,-88,-60];
export const BEIJING_EAST_SOUTH_LANES=[-160,-110,-88,-54];
export const beijingEastQuay=x=>Math.ceil(suzhouCenter(x)+suzhouHalfWidth(x))+2;

function pocketTree(w,x,z){
 w.fill(x,25,z-1,x,25,z+1,1);
 w.fill(x,26,z,x,29,z,4);
 w.disc(x,29,z,1,5);
 w.disc(x,30,z,2,5);
 w.disc(x,31,z,1,5);
}

export function buildBeijingEast(w,roadContains){
 for(let x=-201;x<=-31;x++)for(const z of [8,9,10,18,19,20]){
  const ground=w.get(x,25,z);
  if(ground&&ground!==3&&!roadContains(x,z)&&!w.get(x,26,z))w.set(x,25,z,9);
 }
 for(const parcel of parcels)buildStreetFrontage(w,parcel);
 for(const x of BEIJING_EAST_NORTH_LANES){
  for(let px=x-1;px<=x+1;px++)w.fill(px,25,beijingEastQuay(px),px,25,8,9);
 }
 for(const x of BEIJING_EAST_SOUTH_LANES)w.fill(x-1,25,19,x+1,25,39,9);
 for(const [x,z] of [[-200,6],[-93,22],[-57,21]])pocketTree(w,x,z);
}

export function beijingEastChunk(cx,cz,size){
 const b=BEIJING_EAST_BOUNDS,x=cx*size,z=cz*size;
 return x+size>b.minX&&x<=b.maxX&&z+size>b.minZ&&z<=b.maxZ;
}

export function beijingEastTile(x,y,z,id){
 if(id!==11||y<27||y>29||z!==6&&z!==7&&z!==21&&z!==22)return;
 if(parcels.some(([left,right,,face])=>z===face&&x>left&&x<right))return STOREFRONT_GLASS_TILE;
}

export const beijingEastLightSources=parcels.map(streetFrontageLight);
export const beijingEastLightBounds={...BEIJING_EAST_BOUNDS,minZ:5,maxZ:24,maxY:31};
