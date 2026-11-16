import {line10RampAt,line10RampFloor,line10ToLocal,line10Interior,line10MaintainedCell,transferInterior} from './metro-line10-layout.js';
import {expandedLine10Local,JINGAN_STATION,JINGAN_RAMPS,jinganStationAt,jinganRampAt,localRampHeight,westLine2Z,westLine2Interior,westLine10Interior,westLine10RampAt,westRailInterior,westMetroMaintainedCell} from './metro-west-layout.js';
// Geographic relationships retained at the existing city's compressed scale.
// 2号线: 南京东路（河南中路）— 黄浦江江底 — 陆家嘴（世纪大道、国金北侧）.
export const METRO_STATIONS=[
 {id:'nanjing',name:'南京东路',english:'East Nanjing Road',x:-94,z:66,hallY:16,platformY:6,color:'#8bc9b9',exits:[{number:1,x:-135,z:61.35,dir:1,width:.7,label:'南京东路北侧 · 河南中路'},{number:4,x:-107,z:70.65,dir:-1,width:.7,label:'南京东路南侧 · 往外滩'}]},
 {id:'lujiazui',name:'陆家嘴',english:'Lujiazui',x:174,z:31,hallY:16,platformY:6,color:'#c9b1c7',exits:[{number:1,x:153,z:24,dir:1,label:'世纪大道 · 东方明珠方向'},{number:3,x:205,z:24,dir:-1,label:'世纪大道 · 银城中路方向'}]}
];
export const CENTURY_PARK_STATION={
 id:'centuryPark',name:'世纪公园',english:'Century Park',x:349,z:47,hallY:16,platformY:6,color:'#91b38e',
 exits:[{number:2,x:315,z:34,dir:1,width:1.4,label:'世纪公园 · 西入口'}],
 localGuide:['世纪公园怎么走？','从2号口出站，向南沿人行道走到世纪公园西入口，可去世纪花钟和镜天湖。']
};
// The north entrance corridor and west security hall are unpaid; only the
// southeast concourse contains the B2 escalator. All four street ramps land
// outside this L-shaped fare boundary without changing their street locations.
export const METRO_HALL={securityX:-22,securityZ:-8,gateX:-14,gateZ:0,boundaryZ:-4};
export function metroPaidHall(s,x,z){return x>s.x+METRO_HALL.gateX&&z>s.z+METRO_HALL.boundaryZ;}
export function metroFarePartitions(s){const gx=s.x+METRO_HALL.gateX,gz=s.z+METRO_HALL.gateZ,north=s.z+METRO_HALL.boundaryZ,south=s.z+15.5,gap=1.1;return [
 {x:gx,z:(north+gz-gap)/2,w:.1,d:gz-gap-north},
 {x:gx,z:(gz+gap+south)/2,w:.1,d:south-gz-gap},
 {x:(gx+s.x+35)/2,z:north,w:35-METRO_HALL.gateX,d:.1}
];}
const stationRamps=s=>[
 ...s.exits.map(e=>({station:s.id,exit:e.number,x:e.x,z:e.z,dir:e.dir,from:26,to:16,length:18,width:e.width??1.5,kind:'entrance'})),
 {station:s.id,x:s.x-12,z:s.z+3,dir:1,from:16,to:6,length:18,width:1.5,kind:'platform'}
];
export const METRO_RAMPS=METRO_STATIONS.flatMap(stationRamps);
const CENTURY_PARK_RAMPS=stationRamps(CENTURY_PARK_STATION);
export const EXPANDED_LINE2_STATIONS=[JINGAN_STATION,...METRO_STATIONS,CENTURY_PARK_STATION];
export const EXPANDED_LINE2_RAMPS=[...JINGAN_RAMPS,...METRO_RAMPS,...CENTURY_PARK_RAMPS];
const rampAt=(ramps,x,z)=>ramps.find(r=>{const d=(x-r.x)*r.dir;return d>=-2&&d<=r.length+2&&Math.abs(z-r.z)<r.width;});
export function metro2RampAt(x,z){return rampAt(METRO_RAMPS,x,z);}
export function metro2RampFloor(x,z){const r=metro2RampAt(x,z);return r?r.from+(r.to-r.from)*Math.max(0,Math.min(1,(x-r.x)*r.dir/r.length)):null;}
export function metroStationAt(p){return METRO_STATIONS.find(s=>Math.abs(p.x-s.x)<37&&Math.abs(p.z-s.z)<17&&p.y>=2.7&&p.y<23);}
export function metro2Interior(p){return !!metroStationAt(p)||!!metro2RampAt(p.x,p.z)&&p.y<25.8||p.y>=2.7&&p.y<11&&p.x>-133&&p.x<212&&Math.abs(p.z-metroLineZ(p.x))<13;}
export function metroLineZ(x){const a=METRO_STATIONS[0],b=METRO_STATIONS[1],t=Math.max(0,Math.min(1,(x-(a.x+36))/(b.x-36-(a.x+36))));return a.z+(b.z-a.z)*(t*t*(3-2*t));}
const EAST_RAIL_START=214,EAST_RAIL_END=CENTURY_PARK_STATION.x+36;
export function expandedLine2Z(x){
 if(x<-94)return westLine2Z(x);
 if(x<EAST_RAIL_START)return metroLineZ(x);
 const z=METRO_STATIONS[1].z,t=Math.min(1,(x-EAST_RAIL_START)/(CENTURY_PARK_STATION.x-36-EAST_RAIL_START));
 return z+(CENTURY_PARK_STATION.z-z)*t*t*(3-2*t);
}
function eastStationAt(p){
 const s=CENTURY_PARK_STATION;
 return Math.abs(p.x-s.x)<37&&Math.abs(p.z-s.z)<17&&p.y>=2.7&&p.y<23?s:undefined;
}
export function expandedLine2StationAt(p){return metroStationAt(p)??jinganStationAt(p)??eastStationAt(p);}
export function expandedLine2RampAt(x,z){return metro2RampAt(x,z)??jinganRampAt(x,z)??rampAt(CENTURY_PARK_RAMPS,x,z);}
export function expandedLine2Floor(x,z){return localRampHeight(expandedLine2RampAt(x,z),x);}
export function expandedLine2Interior(p){
 return metro2Interior(p)||westLine2Interior(p)||!!eastStationAt(p)||
  p.y<25.8&&p.y>=15&&!!rampAt(CENTURY_PARK_RAMPS,p.x,p.z)||
  p.x>=EAST_RAIL_START-2&&p.x<=EAST_RAIL_END+1&&p.y>=2.7&&p.y<11&&Math.abs(p.z-expandedLine2Z(p.x))<13;
}
export function eastMetroMaintainedCell(x,y,z){
 if(x<EAST_RAIL_START||x>EAST_RAIL_END||y<2||y>29)return false;
 const {x:sx,z:sz}=CENTURY_PARK_STATION;
 if(y<=10&&Math.abs(z-Math.round(expandedLine2Z(x)))<=12)return true;
 if(Math.abs(x-sx)<=36&&(y>=15&&y<=22&&Math.abs(z-sz)<=16||y<=11&&Math.abs(z-sz)<=12))return true;
 return CENTURY_PARK_RAMPS.some(r=>{
  const d=(x-r.x)*r.dir;
  if(d<-3||d>r.length+3||Math.abs(z-Math.floor(r.z))>1)return false;
  const h=localRampHeight(r,x);
  return y>=Math.floor(h)-1&&y<=Math.ceil(h)+3;
 });
}
export function metroProtected(x,y,z){return line10MaintainedCell(x,y,z)||westMetroMaintainedCell(x,y,z)||eastMetroMaintainedCell(x,y,z)||metroInterior({x,y,z})||METRO_RAMPS.some(r=>Math.abs(z-r.z)<2&&(x-r.x)*r.dir>=-2&&(x-r.x)*r.dir<=r.length+1&&y>=r.to-1&&y<=29);}
export function buildMetro(w,{stations=METRO_STATIONS,ramps=METRO_RAMPS,lineZ=metroLineZ,minX=-133,maxX=213}={}){
 // Twin bores stay below the riverbed and retain the bedrock at y=0.
 for(let x=minX;x<=maxX;x++){const z=Math.round(lineZ(x));w.fill(x,2,z-12,x,10,z+12,3);w.fill(x,3,z-11,x,9,z+11,0);w.fill(x,5,z-5,x,5,z+5,9);}
 for(const s of stations){w.fill(s.x-36,15,s.z-16,s.x+36,22,s.z+16,9);w.fill(s.x-35,16,s.z-15,s.x+35,21,s.z+15,0);w.fill(s.x-36,2,s.z-12,s.x+36,11,s.z+12,9);w.fill(s.x-35,3,s.z-11,s.x+35,10,s.z+11,0);w.fill(s.x-35,5,s.z-5,s.x+35,5,s.z+5,9);}
 // Open both track portals through the station end walls.
 for(const s of stations)for(const x of [s.x-36,s.x+36])for(const side of [-1,1])w.fill(x,3,s.z+side*8-2,x,10,s.z+side*8+2,0);
 // A continuous analytic slope carries walkers. Clear its headroom and use mesh treads.
 for(const r of ramps)for(let i=-3;i<=r.length+3;i++){
  const x=r.x+i*r.dir,y=r.from+(r.to-r.from)*Math.max(0,Math.min(1,i/r.length)),landing=i<=0||i>=r.length;
  const isNarrow=r.kind==='entrance'&&(r.width??1.5)<1,zWalk=Math.floor(r.z);
  if(isNarrow){
   const minSideZ=zWalk===61?59:68,maxSideZ=zWalk===61?63:73;
   if(i<=0){
    w.fill(x,26,zWalk-1,x,29,zWalk+1,0);
    w.fill(x,25,minSideZ,x,25,maxSideZ,9);
   }else if(i>=r.length){
    w.fill(x,15,zWalk-1,x,15,zWalk+1,9);
    w.fill(x,16,zWalk-1,x,21,zWalk+1,0);
    w.fill(x,22,minSideZ,x,25,maxSideZ,9);
   }else{
    w.fill(x,26,zWalk,x,29,zWalk,0);
    for(let sz=minSideZ;sz<=maxSideZ;sz++){
     if(sz===zWalk)continue;
     w.set(x,25,sz,9);
    }
    if(i<=6){
     w.fill(x,Math.floor(y)-1,zWalk,x,Math.ceil(y)+3,zWalk,0);
    }else{
     w.set(x,25,zWalk,9);
     const tunnelRoof=Math.min(24,Math.ceil(y)+3);
     w.fill(x,Math.floor(y)-1,zWalk,x,tunnelRoof,zWalk,0);
     if(tunnelRoof<24)w.fill(x,tunnelRoof+1,zWalk,x,24,zWalk,3);
    }
   }
  }else{
   w.fill(x,Math.floor(y)-(landing?0:1),Math.floor(r.z)-1,x,Math.ceil(y)+3,Math.floor(r.z)+1,0);
   if(landing)w.fill(x,Math.floor(y)-1,Math.floor(r.z)-1,x,Math.floor(y)-1,Math.floor(r.z)+1,9);
  }
 }
 // Street paving must never extend down into the original B1 concourse.
 // Ramp roofs/side infill can overlap it, so re-open the original room last.
 // Keep its floor, ceiling and boundary walls intact.
 for(const s of stations)w.fill(s.x-35,16,s.z-15,s.x+35,21,s.z+15,0);
}
export function buildMetroEast(world){
 buildMetro(world,{stations:[CENTURY_PARK_STATION],ramps:CENTURY_PARK_RAMPS,lineZ:expandedLine2Z,minX:EAST_RAIL_START,maxX:EAST_RAIL_END});
}

export function metroRampAt(x,z){
 const r=expandedLine2RampAt(x,z);if(r)return r;
 const p=line10ToLocal({x,z,y:0}),other=line10RampAt(p.x,p.z);
 if(other)return {...other,line:10,axis:'z'};
 const q=expandedLine10Local({x,z,y:26}),west=westLine10RampAt(q.x,q.z);
 return west?{...west,line:10}:null;
}
export function metroRampFloor(x,z){
 const floor=expandedLine2Floor(x,z);
 if(floor!==null)return floor;
 const p=line10ToLocal({x,z,y:0}),height=line10RampFloor(p.x,p.z);
 if(height!==null)return height;
 const q=expandedLine10Local({x,z,y:26});
 return localRampHeight(westLine10RampAt(q.x,q.z),q.x);
}
export function metroInterior(p){return expandedLine2Interior(p)||line10Interior(p)||transferInterior(p)||westLine10Interior(p)||westRailInterior(p);}
