import {LINE10_ORIGIN,LINE10_STATIONS,line10ToLocal,line10ToWorld} from './metro-line10-layout.js';

export const JINGAN_STATION={id:'jingan',name:'静安寺',english:"Jing'an Temple",x:-300,z:32,hallY:16,platformY:6,color:'#bdad79',
 exits:[{number:6,x:-300,z:23,dir:-1,width:1.3,label:'南京西路 · 静安寺山门'}]};

const R=24,bend=Math.PI*3/4,nw=Math.SQRT1_2;
const portal=296,turnEnd=portal+R*bend;
const turnZ=LINE10_ORIGIN.z+portal,westAtBend=-94+R*(Math.cos(bend)-1),southAtBend=turnZ+R*Math.sin(bend);
const xintiandiX=turnEnd+(166+westAtBend)/nw;
const northToLibrary=62,libraryBend=xintiandiX+northToLibrary;
const libraryJoin=libraryBend+R*Math.PI/4;
const libraryWorldX=-166-northToLibrary*nw-R*nw;
const libraryX=libraryJoin+263+libraryWorldX;

export const WEST_LINE10_STATIONS=[
 {id:'xintiandi',name:'一大会址·新天地',english:'Xintiandi',x:xintiandiX,z:0,platformLabel:'B2',color:'#a86352',
  exits:[{number:6,x:800,z:-9,dir:1,width:1.4,label:'兴业路 · 中共一大会址',separate:true}]},
 {id:'library',name:'上海图书馆',english:'Shanghai Library',x:libraryX,z:0,platformLabel:'B2',color:'#6e9091',
  exits:[{number:1,x:libraryX+9,z:southAtBend-(166+westAtBend)-northToLibrary*nw+R*(Math.sin(bend)-1)-201,
   dir:-1,width:1.4,label:'淮海中路 · 武康路'}]}
];
// Westward on Line 10, local +X follows the track and +Z stays to its left in Three coordinates.
export function westLine10Center(s){
 const exit=s=>({x:-94,z:LINE10_ORIGIN.z+s,dx:0,dz:1});
 if(s<=portal)return exit(s);
 if(s<=turnEnd){
  const a=(s-portal)/R;
  return {x:-94+R*(Math.cos(a)-1),z:turnZ+R*Math.sin(a),dx:-Math.sin(a),dz:Math.cos(a)};
 }
 if(s<=libraryBend){
  const d=(s-turnEnd)*nw;
  return {x:westAtBend-d,z:southAtBend-d,dx:-nw,dz:-nw};
 }
 const z=southAtBend-(libraryBend-turnEnd)*nw;
 if(s<=libraryJoin){
  const a=bend-(s-libraryBend)/R;
  return {x:-166-northToLibrary*nw-R*(Math.cos(a)-Math.cos(bend)),z:z-R*(Math.sin(a)-Math.sin(bend)),dx:-Math.sin(a),dz:Math.cos(a)};
 }
 return {x:libraryWorldX-(s-libraryJoin),z:z+R*(Math.sin(bend)-1),dx:-1,dz:0};
}

export const WEST_LINE10_RAMPS=WEST_LINE10_STATIONS.flatMap(s=>[
 ...s.exits.map(e=>({station:s.id,exit:e.number,...e,from:26,to:16,length:18,kind:'entrance'})),
 {station:s.id,x:s.x-12,z:3,dir:1,from:16,to:6,length:18,width:1.5,kind:'platform'}
]);
export const JINGAN_RAMPS=[
 ...JINGAN_STATION.exits.map(e=>({station:JINGAN_STATION.id,exit:e.number,...e,from:26,to:16,length:18,kind:'entrance'})),
 {station:JINGAN_STATION.id,x:JINGAN_STATION.x-12,z:JINGAN_STATION.z+3,dir:1,from:16,to:6,length:18,width:1.5,kind:'platform'}
];

const frameFor=(x,z,dx,dz,localX=0,localZ=0)=>({x,z,dx,dz,localX,localZ});
const stationFrames=new Map(WEST_LINE10_STATIONS.map(s=>{
 const p=westLine10Center(s.x);
 return [s.id,frameFor(p.x,p.z,p.dx,p.dz,s.x,0)];
}));
const separateRamp=WEST_LINE10_RAMPS.find(r=>r.separate);
const entranceFrame=frameFor(-158,203,-1,0,separateRamp.x,separateRamp.z);
export const westStationFrame=s=>stationFrames.get(s.id);
export const westRampFrame=r=>r.separate?entranceFrame:stationFrames.get(r.station);
// Integer block centers and continuous scene coordinates share this same frame.
export function projectMetroFrame(p,f){
 const x=p.x-f.localX,z=p.z-f.localZ;
 return {x:f.x+x*f.dx-z*f.dz,y:p.y,z:f.z+x*f.dz+z*f.dx};
}
export function unprojectMetroFrame(p,f){
 const x=p.x-f.x,z=p.z-f.z;
 return {x:f.localX+x*f.dx+z*f.dz,y:p.y,z:f.localZ-x*f.dz+z*f.dx};
}
export const westExitToWorld=(e,s)=>projectMetroFrame({...e,y:26},e.separate?entranceFrame:stationFrames.get(s.id));
export const nearWestLine10=(x,z)=>x>=-315&&x<=-116&&z>=150&&z<=283;

// Along the independent street ramp the coordinate origin changes before the
// passage enters the station's unpaid hall. The station itself stays rigid.
export function expandedLine10Local(p){
 if(!nearWestLine10(p.x,p.z)){
  const q=line10ToLocal(p);return q.x<=310?q:{x:-2000,y:p.y,z:-2000};
 }
 const e=unprojectMetroFrame(p,entranceFrame),d=(e.x-separateRamp.x)*separateRamp.dir;
 if(d>=-5&&d<=separateRamp.length+2.5&&Math.abs(e.z-separateRamp.z)<2.05&&
    p.y>=26-Math.max(0,d)*10/18-1.1)return e;
 for(const s of WEST_LINE10_STATIONS){
  const q=unprojectMetroFrame(p,stationFrames.get(s.id));
  if(Math.abs(q.x-s.x)<=37.5&&Math.abs(q.z)<=17.5)return q;
  if(!s.exits[0].separate&&Math.abs(q.z-s.exits[0].z)<2.8&&Math.abs(q.x-s.exits[0].x)<23)return q;
 }
 const q=line10ToLocal(p);
 return q.x<=310?q:{x:-2000,y:p.y,z:-2000};
}
export function expandedLine10World(p,ramp=null){
 if(ramp?.separate)return projectMetroFrame(p,entranceFrame);
 const s=WEST_LINE10_STATIONS.find(s=>Math.abs(p.x-s.x)<38);
 return s?projectMetroFrame(p,stationFrames.get(s.id)):line10ToWorld(p);
}
export const westLine10StationAt=p=>WEST_LINE10_STATIONS.find(s=>Math.abs(p.x-s.x)<37&&Math.abs(p.z)<17&&p.y>=2.7&&p.y<23);
export const westLine10RampAt=(x,z)=>WEST_LINE10_RAMPS.find(r=>{
 const d=(x-r.x)*r.dir;
 return d>=-2&&d<=r.length+2&&Math.abs(z-r.z)<r.width;
});
export const localRampHeight=(r,x)=>r?r.from+(r.to-r.from)*Math.max(0,Math.min(1,(x-r.x)*r.dir/r.length)):null;
export const westLine10Floor=(x,z)=>localRampHeight(westLine10RampAt(x,z),x);

const xintiandi=WEST_LINE10_STATIONS[0],frame=stationFrames.get('xintiandi');
const hallPoint=(dx,z)=>{
 const q=projectMetroFrame({x:xintiandi.x+dx,y:16,z},frame);
 return [q.x,q.z];
};
export const WEST_LINE10_PASSAGE=[[-176,203],[-179,203],[-179,199],hallPoint(32,24),hallPoint(-22,24),hallPoint(-22,13)];
function segmentDistance(x,z,a,b){
 const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));
 return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);
}
export const westTransferInterior=p=>p.y>=15&&p.y<22.5&&WEST_LINE10_PASSAGE.some((b,i)=>i&&segmentDistance(p.x,p.z,WEST_LINE10_PASSAGE[i-1],b)<3.5);
export function westLine10Interior(p){
 if(!nearWestLine10(p.x,p.z)||p.y<2.7||p.y>=25.8)return false;
 const q=expandedLine10Local(p);
 return !!westLine10StationAt(q)||!!westLine10RampAt(q.x,q.z)&&p.y<25.8||westTransferInterior(p);
}
export const METRO_WEST_TRAVEL=[
 {...JINGAN_STATION.exits[0],id:'metro-jingan',line:2,name:'2号线 · 静安寺',x:-297,y:26,z:23},
 ...WEST_LINE10_STATIONS.map(s=>{
  const e=s.exits[0],p=westExitToWorld({...e,x:e.x-3*e.dir},s);
  return {...p,id:'metro-10-'+s.id,name:'10号线 · '+s.name,line:10};
 })
];
export const COMPLETE_LINE10_STATIONS=[...LINE10_STATIONS,...WEST_LINE10_STATIONS];

export function westLine2Z(x){
 const t=Math.max(0,Math.min(1,(-130-x)/134));
 return 66+(JINGAN_STATION.z-66)*t*t*(3-2*t);
}
export function jinganRampAt(x,z){
 return JINGAN_RAMPS.find(r=>{const d=(x-r.x)*r.dir;return d>=-2&&d<=r.length+2&&Math.abs(z-r.z)<r.width;});
}
export function jinganStationAt(p){
 return Math.abs(p.x-JINGAN_STATION.x)<37&&Math.abs(p.z-JINGAN_STATION.z)<17&&p.y>=2.7&&p.y<23?JINGAN_STATION:undefined;
}
export function westLine2Interior(p){
 return !!jinganStationAt(p)||!!jinganRampAt(p.x,p.z)&&p.y<25.8||
  p.y>=2.7&&p.y<11&&p.x>=-335&&p.x<=-130&&Math.abs(p.z-westLine2Z(p.x))<13;
}

const key=(x,z)=>x+','+z;
function rasterTube(start,end,center,offsets,innerRadius,outerRadius){
 const cells=new Map();
 for(let s=start;s<=end;s+=.35){
  const p=center(s);
  for(const n of offsets){
   const xx=p.x-p.dz*n,zz=p.z+p.dx*n;
   for(let x=Math.floor(xx-outerRadius);x<=xx+outerRadius;x++)for(let z=Math.floor(zz-outerRadius);z<=zz+outerRadius;z++){
    const d=(x+.5-xx)**2+(z+.5-zz)**2;
    if(d<=outerRadius**2){
     const id=key(x,z),previous=cells.get(id);
     if(!previous)cells.set(id,{x,z,inner:d<=innerRadius**2});
     else if(d<=innerRadius**2)previous.inner=true;
    }
   }
  }
 }
 return cells;
}
let westTube;
const tube=()=>westTube??=rasterTube(284,libraryX+37,westLine10Center,[-8,8],3.5,4.5);
export function westRailInterior(p){
 return p.y>=2.7&&p.y<11&&p.z>=153&&p.z<=295&&p.x<=-76&&p.x>=-306&&!!tube().get(key(Math.floor(p.x),Math.floor(p.z)))?.inner;
}
export function westMetroMaintainedCell(x,y,z){
 if(y<2||y>30)return false;
 if(x>=-336&&x<=-130&&y>=2&&y<=11&&Math.abs(z-Math.round(westLine2Z(x)))<=13)return true;
 if((westLine2Interior({x,y,z})||westLine10Interior({x,y,z}))&&y>=2&&y<=25)return true;
 if(y>=2&&y<=10&&x<=-76&&x>=-306&&z>=153&&z<=295&&tube().has(key(x,z)))return true;
 if(y>=15&&y<=22&&WEST_LINE10_PASSAGE.some((b,i)=>i&&segmentDistance(x+.5,z+.5,WEST_LINE10_PASSAGE[i-1],b)<=3.5))return true;
 if(nearWestLine10(x,z)){
  for(const s of WEST_LINE10_STATIONS){
   const q=unprojectMetroFrame({x:x+.5,y,z:z+.5},stationFrames.get(s.id));
   if(y<=22&&q.x>=s.x-37&&q.x<s.x+38&&q.z>=-16&&q.z<17)return true;
  }
 }
 const q=expandedLine10Local({x:x+.5,y,z:z+.5}),r=westLine10RampAt(q.x,q.z)??jinganRampAt(x+.5,z+.5);
 if(r){
  const h=localRampHeight(r,r.station==='jingan'?x+.5:q.x);
  if(y>=Math.floor(h)-1&&y<=Math.ceil(h)+3)return true;
 }
 return y>=15&&((x>=-277&&x<=-249&&z>=199&&z<=203)||(x>=-181&&x<=-154&&z>=202&&z<=204));
}

function stampStation(world,builder,station){
 const frame=stationFrames.get(station.id),f={...frame,localX:0};
 const values=new Int8Array(80*42*31).fill(-1),idx=(x,y,z)=>(y*42+z+21)*80+x+40;
 const plan={fill(x1,y1,z1,x2,y2,z2,id){
  for(let x=x1;x<=x2;x++)for(let z=z1;z<=z2;z++)for(let y=y1;y<=y2;y++)values[idx(x,y,z)]=id;
 }};
 const ramps=WEST_LINE10_RAMPS.filter(r=>r.station===station.id&&!r.separate).map(r=>({...r,x:Math.round(r.x-station.x)}));
 builder(plan,{stations:[{...station,x:0}],ramps,minX:-37,maxX:37,lineZ:()=>0});
 // The unrotated westbound station uses the same nearest-cell conversion as
 // the diagonal station. Rasterize backward so diagonal walls stay solid.
 for(let x=Math.floor(f.x)-42;x<=f.x+42;x++)for(let z=Math.floor(f.z)-42;z<=f.z+42;z++){
  const at=unprojectMetroFrame({x:x+.5,z:z+.5},f),lx=Math.floor(at.x),lz=Math.floor(at.z);
  if(lx<-40||lx>=40||lz<-21||lz>=21)continue;
  for(let y=2;y<=29;y++){const id=values[idx(lx,y,lz)];if(id>=0)world.set(x,y,z,id);}
 }
}

function buildWestPassage(w){
 const points=WEST_LINE10_PASSAGE;
 const cells=new Map();
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i];
  for(let x=Math.floor(Math.min(a[0],b[0])-4);x<=Math.max(a[0],b[0])+4;x++){
   for(let z=Math.floor(Math.min(a[1],b[1])-4);z<=Math.max(a[1],b[1])+4;z++){
    const d=segmentDistance(x+.5,z+.5,a,b);
    if(d<3.5){const id=key(x,z);cells.set(id,{x,z,inner:cells.get(id)?.inner||d<2.55});}
   }
  }
 }
 for(const {x,z,inner} of cells.values()){
  const local=unprojectMetroFrame({x:x+.5,z:z+.5},frame);
  if(!inner&&Math.abs(local.x-xintiandi.x)<35&&local.z>=-15&&local.z<16)continue;
  w.set(x,15,z,9);w.set(x,22,z,9);
  w.fill(x,16,z,x,21,z,inner?0:9);
 }
}
export function buildMetroWest(world,builder){
 builder(world,{stations:[JINGAN_STATION],ramps:JINGAN_RAMPS,lineZ:westLine2Z,minX:-335,maxX:-130});
 for(const {x,z,inner} of tube().values()){
  // Open the new bore into the existing straight throat without stamping
  // the rounded raster cap over the working platform approach.
  if(x>-110&&z<246)continue;
  world.set(x,2,z,3);world.set(x,5,z,3);world.set(x,10,z,3);
  world.fill(x,3,z,x,4,z,inner?0:3);
  world.fill(x,6,z,x,9,z,inner?0:3);
 }
 for(const s of WEST_LINE10_STATIONS)stampStation(world,builder,s);
 buildWestPassage(world);
 builder(world,{stations:[],ramps:[{...separateRamp,x:-158,z:203,dir:-1}],minX:1,maxX:0});
}
