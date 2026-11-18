import {CENTURY_PARK} from './century-park.js';
import {JINGAN} from './jingan-layout.js';
import {FUXING_PARK} from './puxi-south-layout.js';
import {SIHANG} from './sihang-layout.js';
import {WUKANG} from './wukang-layout.js';
import {XINTIANDI} from './xintiandi-layout.js';

const {west,east,north,south}=SIHANG.warehouse;
const {minX,maxX,minZ,frontZ}=XINTIANDI.facade;
const footprints=[
 {bounds:CENTURY_PARK.bounds,range:106,elevatedRange:146},
 {bounds:JINGAN.temple,range:72,elevatedRange:110,prioritizeElevated:true},
 {bounds:{minX:west,maxX:east,minZ:north,maxZ:south},range:72},
 {bounds:WUKANG.mansion.bounds,range:72},
 {bounds:{minX,maxX,minZ,maxZ:frontZ+2},range:72},
 {bounds:FUXING_PARK.bounds,range:72}
];

export function addScenicLandmarkChunks(desired,point,size,priority){
 const additions=[];
 for(const {bounds,range,elevatedRange=range,prioritizeElevated} of footprints){
  const dx=Math.max(bounds.minX-point.x,point.x-bounds.maxX,0);
  const dz=Math.max(bounds.minZ-point.z,point.z-bounds.maxZ,0);
  const limit=point.y>=60?elevatedRange:range;
  const withinRange=dx*dx+dz*dz<=limit*limit;
  const airbornePriority=priority&&prioritizeElevated&&point.y>=60&&withinRange&&dx*dx+dz*dz>range*range;
  const missing=[];let partial=false;
  for(let x=Math.floor(bounds.minX/size);x<=Math.floor(bounds.maxX/size);x++){
   for(let z=Math.floor(bounds.minZ/size);z<=Math.floor(bounds.maxZ/size);z++){
    const key=x+','+z;
    if(airbornePriority)priority.add(key);
    if(desired.has(key))partial=true;
    else missing.push(key);
   }
  }
  if(partial||withinRange)additions.push(...missing);
 }
 // Compare each landmark with the original terrain plan. Newly added chunks
 // cannot pull in a second landmark just because their footprints touch.
 for(const key of additions)desired.add(key);
}
