// Geographic relationships retained at the existing city's compressed scale.
// 2号线: 南京东路（河南中路）— 黄浦江江底 — 陆家嘴（世纪大道、国金北侧）.
export const METRO_STATIONS=[
 {id:'nanjing',name:'南京东路',english:'East Nanjing Road',x:-94,z:66,hallY:16,platformY:6,color:'#8bc9b9',exits:[{number:1,x:-135,z:61.25,dir:1,width:.7,label:'南京东路北侧 · 河南中路'},{number:4,x:-99,z:70.75,dir:-1,width:.7,label:'南京东路南侧 · 往外滩'}]},
 {id:'lujiazui',name:'陆家嘴',english:'Lujiazui',x:174,z:31,hallY:16,platformY:6,color:'#c9b1c7',exits:[{number:1,x:153,z:24,dir:1,label:'世纪大道 · 东方明珠方向'},{number:3,x:205,z:24,dir:-1,label:'世纪大道 · 银城中路方向'}]}
];
// The security conveyor and adjacent fare gate lead east into the paid hall.
export const METRO_HALL={securityX:-22,securityZ:-8,gateX:-14,gateZ:-5.5};
export const METRO_RAMPS=METRO_STATIONS.flatMap(s=>[
 ...s.exits.map(e=>({station:s.id,exit:e.number,x:e.x,z:e.z,dir:e.dir,from:26,to:16,length:18,width:e.width??1.5,kind:'entrance'})),
 {station:s.id,x:s.x-12,z:s.z+3,dir:1,from:16,to:6,length:18,width:1.5,kind:'platform'}
]);
export function metroRampAt(x,z){return METRO_RAMPS.find(r=>{const d=(x-r.x)*r.dir;return d>=-2&&d<=r.length+2&&Math.abs(z-r.z)<r.width;});}
export function metroRampFloor(x,z){const r=metroRampAt(x,z);return r?r.from+(r.to-r.from)*Math.max(0,Math.min(1,(x-r.x)*r.dir/r.length)):null;}
export function metroStationAt(p){return METRO_STATIONS.find(s=>Math.abs(p.x-s.x)<37&&Math.abs(p.z-s.z)<17&&p.y>=2.7&&p.y<23);}
export function metroInterior(p){return !!metroStationAt(p)||!!metroRampAt(p.x,p.z)&&p.y<25.8||p.y>=2.7&&p.y<11&&p.x>-133&&p.x<212&&Math.abs(p.z-metroLineZ(p.x))<13;}
export function metroLineZ(x){const a=METRO_STATIONS[0],b=METRO_STATIONS[1],t=Math.max(0,Math.min(1,(x-(a.x+36))/(b.x-36-(a.x+36))));return a.z+(b.z-a.z)*(t*t*(3-2*t));}
export function metroProtected(x,y,z){return metroInterior({x,y,z})||METRO_RAMPS.some(r=>Math.abs(z-r.z)<2&&(x-r.x)*r.dir>=-2&&(x-r.x)*r.dir<=r.length+1&&y>=r.to-1&&y<=29);}
export function buildMetro(w){
 // Twin bores stay below the riverbed and retain the bedrock at y=0.
 for(let x=-133;x<=213;x++){const z=Math.round(metroLineZ(x));w.fill(x,2,z-12,x,10,z+12,3);w.fill(x,3,z-11,x,9,z+11,0);w.fill(x,5,z-5,x,5,z+5,9);}
 for(const s of METRO_STATIONS){w.fill(s.x-36,15,s.z-16,s.x+36,22,s.z+16,9);w.fill(s.x-35,16,s.z-15,s.x+35,21,s.z+15,0);w.fill(s.x-36,2,s.z-12,s.x+36,11,s.z+12,9);w.fill(s.x-35,3,s.z-11,s.x+35,10,s.z+11,0);w.fill(s.x-35,5,s.z-5,s.x+35,5,s.z+5,9);}
 // Open both track portals through the station end walls.
 for(const s of METRO_STATIONS)for(const x of [s.x-36,s.x+36])for(const side of [-1,1])w.fill(x,3,s.z+side*8-2,x,10,s.z+side*8+2,0);
 // A continuous analytic slope carries walkers. Clear its headroom and use mesh treads.
 for(const r of METRO_RAMPS)for(let i=-3;i<=r.length+3;i++){const x=r.x+i*r.dir,y=r.from+(r.to-r.from)*Math.max(0,Math.min(1,i/r.length)),landing=i<=0||i>=r.length;
  w.fill(x,Math.floor(y)-(landing?0:1),Math.floor(r.z)-1,x,Math.ceil(y)+3,Math.floor(r.z)+1,0);
  if(landing)w.fill(x,Math.floor(y)-1,Math.floor(r.z)-1,x,Math.floor(y)-1,Math.floor(r.z)+1,9);
 }
}
