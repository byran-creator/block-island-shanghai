export const YUYUAN_SHIFT=60;
const YUYUAN_LOCAL={x:-46,y:26,z:188,minX:-75,maxX:18,minZ:154,maxZ:244,entry:{x:-46.5,y:26,z:156.5,name:'豫园 · 北门'},tea:{x:-46,y:26,z:178},snack:{x:-26,y:26,z:212},riddle:{x:-62,y:26,z:203},arrival:{x:-43.5,y:26,z:159.5,name:'豫园 · 九曲桥与湖心亭'}};
export const YUYUAN={...YUYUAN_LOCAL,z:YUYUAN_LOCAL.z+YUYUAN_SHIFT,minZ:YUYUAN_LOCAL.minZ+YUYUAN_SHIFT,maxZ:YUYUAN_LOCAL.maxZ+YUYUAN_SHIFT,...Object.fromEntries(['entry','tea','snack','riddle','arrival'].map(k=>[k,{...YUYUAN_LOCAL[k],z:YUYUAN_LOCAL[k].z+YUYUAN_SHIFT}]))};
export const YUYUAN_WALKS=[[-35.5,70.5],[-46.5,216.5]],YUYUAN_STATION_WALK=[[-86,212],[-77,212],[-77,218],[-72,218]],YUYUAN_STATION_WALK_SOUTH=[[-86,262],[-77,262],[-77,265],[-70,265]];
export const WATER_CORRIDOR={x:-60,z1:170,z2:193,width:3};
export const GARDEN_BEDS=[{x1:-73,x2:-67,z1:155,z2:166},{x1:-41,x2:-32,z1:156,z2:165},{x1:-29,x2:-19,z1:177,z2:187},{x1:-72,x2:-67,z1:195,z2:202},{x1:-54,x2:-44,z1:198,z2:207},{x1:-39,x2:-30,z1:203,z2:208},{x1:-49,x2:-38,z1:219,z2:226}];
export const INNER_GARDEN={minX:-75,maxX:3,minZ:194,maxZ:216};
export const INNER_GARDEN_BOUNDARY=[[-75,194],[3,194],[3,216],[-18,216],[-18,208],[-75,208]];
export const INNER_GARDEN_EAST_PATH=[[-35,196],[-25,197],[-20,201],[-15,211],[-8,212],[-5,209],[-.5,207],[-.5,196],[-10,196],[-23,196],[-35,196]];
export function gardenPathContains(x,z,width){return pathContains(x,z,INNER_GARDEN_PATH,width)||pathContains(x,z,INNER_GARDEN_EAST_PATH,width);}
export function innerGardenContains(x,z){return x>-74.3&&x<2.8&&z>194.7&&z<(x<-18.2?207.8:215.8);}
export const INNER_GARDEN_PATH=[[-35,194],[-35,196],[-40,197.5],[-45,196.5],[-50,198],[-54,197.5],[-54,204],[-60,204],[-68,205],[-75,205]];
export const INNER_GATES=[{id:'north',axis:'z',x:-35,z:194},{id:'west',axis:'x',x:-75,z:205}];
export const GARDEN_WINDOWS=[{axis:'z',x:-46,z:194,y:28.5,r:1.1},{axis:'z',x:-46,z:208,y:28.5,r:1.1}];
export const GARDEN_PONDS=[{x1:-63.5,x2:-29.5,z1:169,z2:193},{x1:-70,x2:-57,z1:198,z2:202},{x1:-14,x2:-2,z1:198,z2:207}];
export function gardenBedContains(x,z,b){const cx=(b.x1+b.x2)/2,cz=(b.z1+b.z2)/2,rx=(b.x2-b.x1)/2,rz=(b.z2-b.z1)/2;return ((x-cx)/rx)**2+((z-cz)/rz)**2<.9+.1*Math.sin(x*1.3+z*.7)&&!gardenPathContains(x,z,1.6)&&!GARDEN_PONDS.some(p=>x>=p.x1-1&&x<=p.x2+1&&z>=p.z1-1&&z<=p.z2+1);}
export const JIUQU_BRIDGE=[[-64,173],[-58,173],[-58,176],[-54,176],[-54,184],[-51,184],[-51,178],[-40,178],[-40,184],[-35,184],[-35,192]];
export function pathContains(x,z,points,width=3){return points.some((b,i)=>{if(!i)return false;const a=points[i-1],dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz)<=width;});}
export function yuyuanReserved(x,z){return x>=YUYUAN.minX-2&&x<=YUYUAN.maxX+2&&z>=YUYUAN.minZ-2&&z<=YUYUAN.maxZ+2||pathContains(x,z,YUYUAN_STATION_WALK,2)||pathContains(x,z,YUYUAN_STATION_WALK_SOUTH,2);}
export const YUYUAN_BUILDINGS=[{id:'huxinting',x:-46,z:178,rx:4,rz:4,levels:2},{id:'tea-gallery',x:-65,z:163,rx:5,rz:3,levels:1},{id:'nanxiang',x:-26,z:214,rx:6,rz:4,levels:2},{id:'craft-shop',x:-62,z:214,rx:6,rz:4,levels:2},{id:'garden-pavilion',x:-25,z:164,rx:4,rz:3,levels:1},{id:'old-city-west',x:-103,z:196,rx:4,rz:7,levels:3},{id:'old-city-east',x:-5,z:178,rx:5,rz:8,levels:3},{id:'old-city-south',x:-49,z:233,rx:8,rz:3,levels:2},{id:'old-city-northeast',x:-5,z:146,rx:5,rz:5,levels:2},...Array.from({length:7},(_,i)=>({id:'yuyuan-street-'+i,x:12,z:162+i*12,rx:5,rz:4,levels:2})),{id:'yuyuan-south-west',x:-65,z:238,rx:5,rz:4,levels:2},{id:'yuyuan-south-east',x:-25,z:238,rx:5,rz:4,levels:2}];
export function buildYuyuan(world){
 // Restore the old-city land west of the Huangpu; the garden is part of an
 // urban block, not an isolated island off the former compressed shore.
 for(let x=-111;x<=18;x++)for(let z=80;z<=304;z++)if(!world.get(x,25,z)){world.fill(x,1,z,x,25,z,3);world.set(x,25,z,9);}
 for(const points of [YUYUAN_STATION_WALK,YUYUAN_STATION_WALK_SOUTH])for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];world.fill(Math.min(a[0],b[0])-2,25,Math.min(a[1],b[1])-2,Math.max(a[0],b[0])+2,25,Math.max(a[1],b[1])+2,9);world.fill(Math.min(a[0],b[0])-2,26,Math.min(a[1],b[1])-2,Math.max(a[0],b[0])+2,29,Math.max(a[1],b[1])+2,0);}
 const w={set:(x,y,z,id)=>world.set(x,y,z+YUYUAN_SHIFT,id),fill:(x1,y1,z1,x2,y2,z2,id)=>world.fill(x1,y1,z1+YUYUAN_SHIFT,x2,y2,z2+YUYUAN_SHIFT,id)};

 w.fill(YUYUAN_LOCAL.minX,1,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,25,YUYUAN_LOCAL.maxZ,3);w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,49,YUYUAN_LOCAL.maxZ,0);w.fill(YUYUAN_LOCAL.minX,25,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,25,YUYUAN_LOCAL.maxZ,9);
 // A real depression exposes the existing water plane; pond and bridge have solid bases.
 w.fill(-63,20,169,-30,20,192,3);w.fill(-63,21,169,-30,25,192,0);
 for(let i=1;i<JIUQU_BRIDGE.length;i++){const a=JIUQU_BRIDGE[i-1],b=JIUQU_BRIDGE[i];w.fill(Math.min(a[0],b[0])-1,25,Math.min(a[1],b[1])-1,Math.max(a[0],b[0])+1,25,Math.max(a[1],b[1])+1,7);}
 w.fill(-61,25,170,-59,25,193,7);for(const x of [-61,-59])for(const z of [170,176,181,186,192])w.fill(x,21,z,x,24,z,9);
 for(const b of GARDEN_BEDS)for(let x=b.x1;x<=b.x2;x++)for(let z=b.z1;z<=b.z2;z++)if(gardenBedContains(x+.5,z+.5,b))w.set(x,25,z,1);
 w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.minX,28,YUYUAN_LOCAL.maxZ,9);w.fill(YUYUAN_LOCAL.maxX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,28,YUYUAN_LOCAL.maxZ,9);w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.minZ,YUYUAN_LOCAL.maxX,28,YUYUAN_LOCAL.minZ,9);w.fill(YUYUAN_LOCAL.minX,26,YUYUAN_LOCAL.maxZ,YUYUAN_LOCAL.maxX,28,YUYUAN_LOCAL.maxZ,9);
 w.fill(-49,26,YUYUAN_LOCAL.minZ,-43,29,YUYUAN_LOCAL.minZ,0);w.fill(YUYUAN_LOCAL.minX,26,202,YUYUAN_LOCAL.minX,29,208,0);
 w.fill(YUYUAN_LOCAL.minX,26,157,YUYUAN_LOCAL.minX,29,162,0);
 const g=INNER_GARDEN;for(let i=0;i<INNER_GARDEN_BOUNDARY.length;i++){const a=INNER_GARDEN_BOUNDARY[i],b=INNER_GARDEN_BOUNDARY[(i+1)%INNER_GARDEN_BOUNDARY.length];w.fill(Math.min(a[0],b[0]),26,Math.min(a[1],b[1]),Math.max(a[0],b[0]),30,Math.max(a[1],b[1]),9);}
 // Geometry supplies the round outline; these slots leave room for the true
 // circular opening tested by the gate collision function, not a voxel square.
 for(const e of INNER_GATES){if(e.axis==='z')w.fill(e.x-3,26,e.z,e.x+3,31,e.z,0);else w.fill(e.x,26,e.z-3,e.x,31,e.z+3,0);}
 for(const e of GARDEN_WINDOWS)w.fill(e.x-2,27,e.z,e.x+2,30,e.z,0);
 for(const stream of GARDEN_PONDS.slice(1)){w.fill(stream.x1,20,stream.z1,stream.x2,20,stream.z2,3);w.fill(stream.x1,21,stream.z1,stream.x2,25,stream.z2,0);}
 for(let x=g.minX+1;x<g.maxX;x++)for(let z=g.minZ+1;z<g.maxZ;z++)if(gardenPathContains(x+.5,z+.5,1.2))w.set(x,25,z,9);
 for(const b of YUYUAN_BUILDINGS){w.fill(b.x-b.rx,25,b.z-b.rz,b.x+b.rx,25,b.z+b.rz,7);for(let y=26;y<26+b.levels*4;y++)for(let x=b.x-b.rx;x<=b.x+b.rx;x++)for(let z=b.z-b.rz;z<=b.z+b.rz;z++)if(x===b.x-b.rx||x===b.x+b.rx||z===b.z-b.rz||z===b.z+b.rz)w.set(x,y,z,9);if(b.id.startsWith('yuyuan-street-')){w.fill(b.x-b.rx,26,b.z-1,b.x-b.rx,28,b.z+1,0);for(const sign of [-1,1])w.fill(b.x-b.rx,27,b.z+sign*2+(sign<0?-2:0),b.x-b.rx,28,b.z+sign*2+(sign>0?2:0),0);}else{w.fill(b.x-1,26,b.z-b.rz,b.x+1,28,b.z-b.rz,0);w.fill(b.x-1,26,b.z+b.rz,b.x+1,28,b.z+b.rz,0);}if((['nanxiang','craft-shop','tea-gallery'].includes(b.id)||b.id.startsWith('yuyuan-south-')))for(const side of [-1,1])w.fill(b.x+side*2+(side<0?-2:0),27,b.z-b.rz,b.x+side*2+(side>0?2:0),28,b.z-b.rz,0);if(b.id==='huxinting'){w.fill(b.x-b.rx,26,b.z-1,b.x-b.rx,28,b.z+1,0);w.fill(b.x+b.rx,26,b.z-1,b.x+b.rx,28,b.z+1,0);}if(b.levels===2)w.fill(b.x-b.rx+1,29,b.z-b.rz+1,b.x+b.rx-1,29,b.z+b.rz-1,7);for(let level=1;level<=b.levels;level++)w.fill(b.x-b.rx-1,25+level*4,b.z-b.rz-1,b.x+b.rx+1,25+level*4,b.z+b.rz+1,7);}
}
