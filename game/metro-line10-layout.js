// The playable geography is compressed; +Z is south. Local +X follows Line 10.
export const LINE10_COLOR='#c6a6d8',LINE10_ORIGIN={x:-94,z:-40},LINE10_ROTATION=-Math.PI/2;
export const line10ToWorld=p=>({x:LINE10_ORIGIN.x-p.z,y:p.y,z:LINE10_ORIGIN.z+p.x});
export const line10ToLocal=p=>({x:p.z-LINE10_ORIGIN.z,y:p.y,z:LINE10_ORIGIN.x-p.x});
export const LINE10_STATIONS=[
 {id:'nanjing10',name:'南京东路',english:'East Nanjing Road',platformLabel:'B3',x:164,z:0,color:'#c6b3d0',exits:[]},
 {id:'yuyuan',name:'豫园',english:'Yuyuan Garden',platformLabel:'B2',x:256,z:0,color:'#ae5142',exits:[{number:1,x:252,z:-8,dir:1,width:1.4,label:'豫园西北门 · 河南南路'},{number:4,x:302,z:-8,dir:-1,width:1.4,label:'豫园西门 · 福佑路'}]}
];
export const LINE10_RAMPS=LINE10_STATIONS.flatMap(s=>[...s.exits.map(e=>({station:s.id,exit:e.number,...e,from:26,to:16,length:18,kind:'entrance'})),{station:s.id,x:s.x-12,z:3,dir:1,from:16,to:6,length:18,width:1.5,kind:'platform'}]);
export const LINE10_WORLD_STATIONS=LINE10_STATIONS.map(s=>({...s,...line10ToWorld({...s,y:16}),line:10,exits:s.exits.map(e=>({...e,...line10ToWorld({...e,y:26}),axis:'z'}))}));
export const TRANSFER_POINTS=[[-100,79],[-114,96],[-114,124],[-107,124]];
function segmentDistance(x,z,a,b){const dx=b[0]-a[0],dz=b[1]-a[1],t=Math.max(0,Math.min(1,((x-a[0])*dx+(z-a[1])*dz)/(dx*dx+dz*dz||1)));return Math.hypot(x-a[0]-t*dx,z-a[1]-t*dz);}
export const transferInterior=p=>p.y>=15.5&&p.y<22&&TRANSFER_POINTS.some((b,i)=>i&&segmentDistance(p.x,p.z,TRANSFER_POINTS[i-1],b)<2.15);
export const line10RampAt=(x,z)=>LINE10_RAMPS.find(r=>{const d=(x-r.x)*r.dir;return d>=-2&&d<=r.length+2&&Math.abs(z-r.z)<r.width;});
export const line10RampFloor=(x,z)=>{const r=line10RampAt(x,z);return r?r.from+(r.to-r.from)*Math.max(0,Math.min(1,(x-r.x)*r.dir/r.length)):null;};
export const line10StationAt=p=>LINE10_STATIONS.find(s=>Math.abs(p.x-s.x)<37&&Math.abs(p.z)<17&&p.y>=2.7&&p.y<23);
export const line10InteriorLocal=p=>!!line10StationAt(p)||!!line10RampAt(p.x,p.z)&&p.y<25.8||p.y>=2.7&&p.y<11&&p.x>127&&p.x<293&&Math.abs(p.z)<13;
export const line10Interior=p=>line10InteriorLocal(line10ToLocal(p));
export function line10MaintainedCell(x,y,z){const p=line10ToLocal({x,y,z});
 if(p.x>=127&&p.x<=293&&Math.abs(p.z)<=12&&y>=2&&y<=10)return true;
 if(LINE10_STATIONS.some(s=>Math.abs(p.x-s.x)<=36&&Math.abs(p.z)<=16&&y>=15&&y<=22))return true;
 if(LINE10_RAMPS.some(r=>{const d=(p.x-r.x)*r.dir,h=r.from+(r.to-r.from)*Math.max(0,Math.min(1,d/r.length));return d>=-3&&d<=r.length+3&&Math.abs(p.z-r.z)<=r.width+1&&y>=Math.floor(h)-1&&y<=Math.ceil(h)+3;}))return true;
 return y>=15&&y<=22&&TRANSFER_POINTS.some((b,i)=>i&&segmentDistance(x,z,TRANSFER_POINTS[i-1],b)<=3.1);
}
export function line10Direction(s,direction){const south=direction>0,atNanjing=s.id==='nanjing10';const [next,english,playable]=south?(atNanjing?['豫园','Yuyuan Garden',true]:['老西门','Laoximen',false]):(atNanjing?['天潼路','Tiantong Road',false]:['南京东路','East Nanjing Road',true]);return {next,english,playable,zh:south?'虹桥火车站 / 航中路方向':'基隆路方向',en:south?'To Hongqiao Railway St. / Hangzhong Rd.':'To Jilong Road'};}
export function buildLine10(w,builder,baseStations=[]){
 const proxy={set(x,y,z,id){const p=line10ToWorld({x,y,z});return w.set(p.x,y,p.z,id);},get(x,y,z){const p=line10ToWorld({x,y,z});return w.get(p.x,y,p.z);},fill(x1,y1,z1,x2,y2,z2,id){const a=line10ToWorld({x:x1,y:y1,z:z1}),b=line10ToWorld({x:x2,y:y2,z:z2});w.fill(Math.min(a.x,b.x),y1,Math.min(a.z,b.z),Math.max(a.x,b.x),y2,Math.max(a.z,b.z),id);}};
 builder(proxy,{stations:LINE10_STATIONS,ramps:LINE10_RAMPS,lineZ:()=>0,minX:127,maxX:293});
 const cells=new Map();for(let i=1;i<TRANSFER_POINTS.length;i++){const a=TRANSFER_POINTS[i-1],b=TRANSFER_POINTS[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])*2);for(let j=0;j<=n;j++){const x=Math.round(a[0]+(b[0]-a[0])*j/n),z=Math.round(a[1]+(b[1]-a[1])*j/n);cells.set(x+','+z,{x,z});}}
 for(const {x,z}of cells.values())w.fill(x-3,15,z-3,x+3,22,z+3,9);
 for(const {x,z}of cells.values()){w.fill(x-2,16,z-2,x+2,21,z+2,0);w.fill(x-2,15,z-2,x+2,15,z+2,9);}
 // Corridor end caps may overlap the existing station's open room. Retain its
 // original clear concourse while leaving the new door in the boundary wall.
 for(const s of baseStations)w.fill(s.x-35,16,s.z-15,s.x+35,21,s.z+15,0);
}
