import {nanpuSurfaceAt} from './bridge-road.js';
// Game-scale Shanghai: east is +x, south is +z. Heights and distances are compressed.
export const MAP_REVISION=11;
export const MAP_BOUNDS={min:-224,max:400};
export const BUND_SHIFT=56;
export const CITY={jinmao:{x:191.5,z:78.5,top:99},swfc:{x:217.5,z:90.5,top:112},shanghai:{x:189.5,z:106.5,top:136}};
export const PEARL={x:126,z:42,top:108};
export const PERSONAL={dx:35,dz:280};
export const riverCenter=z=>z<0?136.125+1.05*Math.min(-z,64)+.42*Math.max(0,-z-64):z<=124?108+50*((z-48)/64)**2:108+50*(76/64)**2+(z-124)*.55;
// Broad navigation channel: translate the west city while keeping east-shore towers fixed.
export const riverWestEdge=z=>riverCenter(z)-18-BUND_SHIFT;
export const riverEastEdge=z=>riverCenter(z)+9;
export const MAGNOLIA={x:Math.round(riverCenter(-66)-122),z:-66,top:83};
export const inRiver=(x,z)=>x>=riverWestEdge(z)&&x<=riverEastEdge(z);
// Revision 8 moves the west city as a unit; east-side landmarks and the islands stay fixed.
export function migrateWestBankPoint(p){
 if(p&&p.z>=-160&&p.z<=242&&p.x<riverCenter(p.z)-10&&(p.z<202||p.x>=102)){p.x-=BUND_SHIFT;return true;}return false;
}
export function riverTerrain(x,z,h){
 // Two city shores share the river bend; the personal island sits offshore.
 if(Math.hypot(x-88,z-332)<65)h=Math.max(h,25-Math.floor(Math.max(0,Math.hypot(x-88,z-332)-59)*2));
 if(x>=254&&x<=266&&z>=219&&z<=236)return h; // Diving pier retains its descending water access.
 if(z>=MAP_BOUNDS.min&&z<=244){const d=x-riverCenter(z);
  if(inRiver(x,z))return 7+Math.floor(Math.abs((d+BUND_SHIFT/2+4.5)/(13.5+BUND_SHIFT/2))*5);
  if(x>=MAP_BOUNDS.min&&x<riverWestEdge(z)-1&&z<=242&&(z<202||x>=102-BUND_SHIFT))return 25;
  if(d>10&&x<(z<0?MAP_BOUNDS.max:317)&&z<=234)return 25;
 }
 return h;
}
const route=(id,name,points,width=2)=>({id,name,points,width});
export const BRIDGES=[
 route('nanpu','南浦风格斜拉桥',[[176-BUND_SHIFT,190,26],[176-BUND_SHIFT,206,26],[192-BUND_SHIFT,206,26],[212,206,31],[255,206,31],[275,206,26],[282,206,26]],3),
 route('city','陆家嘴滨江步道',[[124,54,26],[139,54,26],[139,110,26],[183,122,26],[215,174,26]]),
 route('mountain','长江风格山岛桥',[[312,42,26],[328,42,31],[328,80,33],[330,75,34]]),
 route('forest','翡翠跨海桥',[[278,216,26],[318,217,29],[330,228,31],[331,240,35]]),
 route('sand','金沙跨海桥',[[30,190,26],[30,204,26],[65,210,28],[65,230,29]]),
 route('home','生活岛连接桥',[[65,230,29],[50,257,29],[45,285,26],[45,329,26],[75,329,26]]),
 route('outer','远岛连接桥',[[353,278,29],[363,328,32],[350,355,30]])
];
export function bridgeSamples(b){const samples=[];for(let k=1;k<b.points.length;k++){const [ax,az,ay]=b.points[k-1],[bx,bz,by]=b.points[k],n=Math.max(Math.abs(bx-ax),Math.abs(bz-az))*2;for(let i=k===1?0:1;i<=n;i++){const t=i/n;samples.push({x:Math.round(ax+(bx-ax)*t),z:Math.round(az+(bz-az)*t),y:Math.round(ay+(by-ay)*t)});}}return samples;}
export function cityProtected(x,y,z){
 if(x>=206&&x<=257&&[208,255].some(px=>Math.abs(x-px)<=1)&&z>=200&&z<=212&&y>=10&&y<=59)return true;
 if(y>=25&&Object.values(CITY).some(p=>Math.abs(x+.5-p.x)<=12&&Math.abs(z+.5-p.z)<=13))return true;
 return BRIDGES.some(b=>b.samples.some(p=>Math.abs(x-p.x)<=b.width&&Math.abs(z-p.z)<=b.width&&y>=p.y-1&&y<=p.y+2));
}
for(const b of BRIDGES)b.samples=bridgeSamples(b);
function shiftWorld(w,dx,dz){return {set:(x,y,z,id)=>w.set(x+dx,y,z+dz,id),fill:(x,y,z,xx,yy,zz,id)=>w.fill(x+dx,y,z+dz,xx+dx,yy,zz+dz,id),disc:(x,y,z,r,id)=>w.disc(x+dx,y,z+dz,r,id)}}
// Turn the SWFC slab and its real opening toward the Bund on the west bank.
function rotatedSwfc(w){const set=(x,y,z,id)=>w.set(Math.floor(CITY.swfc.x)+z-71,y,Math.floor(CITY.swfc.z)-x+145,id);return {set,fill:(x,y,z,xx,yy,zz,id)=>{for(let a=x;a<=xx;a++)for(let b=y;b<=yy;b++)for(let c=z;c<=zz;c++)set(a,b,c,id);}};}
function plaza(w,x,z,r=10){for(let dx=-r;dx<=r;dx++)for(let dz=-r;dz<=r;dz++){const xx=x+dx,zz=z+dz;if(xx>riverCenter(zz)+9){w.fill(xx,15,zz,xx,24,zz,3);w.set(xx,25,zz,9);}}}
export function buildRiverfront(w){
 w.fill(110,23,116,124,28,121,0);w.fill(107,24,117,109,28,119,0);w.fill(104,25,117,106,28,119,0);
 // Clear the old path crossing the channel. The raised footbridge is built later.
 for(let z=MAP_BOUNDS.min;z<=236;z++)for(let x=Math.ceil(riverWestEdge(z));x<=riverEastEdge(z);x++){
  // Clear the entire navigation channel before constructing the raised bridge.
  w.fill(x,18,z,x,25,z,0);
 }
 plaza(w,CITY.jinmao.x-.5,CITY.jinmao.z-.5);plaza(w,CITY.swfc.x-.5,CITY.swfc.z-.5,11);
 {const w=shiftWorld(arguments[0],CITY.jinmao.x-123.5,CITY.jinmao.z-62.5);
 const j={x:123.5,z:62.5};
 // Jin Mao: an octagonal, stepped pagoda silhouette with silver cornices.
 for(let y=26;y<99;y++){const t=(y-26)/73,cornice=y%9===7||y%9===8,r=8-Math.floor(t*8)*.75+(cornice?1:0);
  for(let x=115;x<=131;x++)for(let z=54;z<=70;z++){const dx=Math.abs(x+.5-j.x),dz=Math.abs(z+.5-j.z),inside=Math.max(dx,dz)<=r&&dx+dz<=r*1.45,edge=Math.max(dx,dz)>=r-1||dx+dz>=r*1.45-1.4;if(inside&&(edge||cornice))w.set(x,y,z,cornice||dx===dz?9:11);}
 }
 w.fill(121,26,67,125,31,72,0);w.fill(122,25,69,124,25,72,12);
 w.disc(123,90,62,4,9);w.fill(121,91,60,125,94,64,0);w.fill(122,90,61,124,90,63,12);w.fill(123,96,62,123,99,62,9);
 // Keep the observatory clear inside, with an octagonal enclosure supporting its tapered finial.
 for(let y=91;y<=94;y++)for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)if(Math.abs(dx)+Math.abs(dz)<=5&&(Math.abs(dx)===3||Math.abs(dz)===3||Math.abs(dx)+Math.abs(dz)===5))w.set(123+dx,y,62+dz,dx===0||dz===0?9:11);
 w.fill(120,95,59,126,99,65,0);for(let y=95;y<=99;y++)w.disc(123,y,62,Math.max(.5,3.7-(y-95)*.8),9);
 }
 {const w=rotatedSwfc(arguments[0]),f={x:145.5,z:71.5};
 // SWFC: tapering glass slab and a genuine open trapezoid through the crown.
 for(let y=26;y<=111;y++){const t=(y-26)/85,rx=9-Math.floor(t*4),rz=7-Math.floor(t*4);
  for(let x=136;x<=154;x++)for(let z=64;z<=78;z++){const dx=Math.abs(x+.5-f.x),dz=Math.abs(z+.5-f.z);if(dx>rx||dz>rz)continue;const opening=y>=96&&y<=107&&dx<=3+(y-96)*.12;if(opening)continue;if(dx>=rx-1||dz>=rz-1||y%12===1||y===95||y>=108)w.set(x,y,z,dx>=rx-1||y>=108?9:11);}
 }
 w.fill(143,26,77,147,31,83,0);w.fill(144,25,80,146,25,84,12);
 // A walkable sky bridge spans the lower part of the opening.
 w.fill(141,103,70,149,103,72,12);w.fill(141,104,69,149,104,69,11);w.fill(141,104,73,149,104,73,11);
 }
 // The west-bank promenade is completed by the Bund builder.
 for(let z=64;z<=112;z++){const edge=Math.floor(riverWestEdge(z)-2);for(let x=edge-3;x<=edge-1;x++){w.set(x,25,z,9);w.fill(x,26,z,x,28,z,0);}if(z%12===4){w.fill(edge-1,26,z,edge-1,28,z,9);w.set(edge-1,29,z,12);}}
 w.fill(50-BUND_SHIFT,25,76,57-BUND_SHIFT,25,81,1);w.fill(50-BUND_SHIFT,26,76,57-BUND_SHIFT,29,81,0);
 // Entry plazas leave generous walking room between the three towers.
 for(const p of Object.values(CITY))plaza(w,p.x-.5,p.z-.5,13);

}
export function buildBridges(w,isRoad=()=>false){
 for(const b of BRIDGES){const samples=bridgeSamples(b);b.samples=samples;
  if(b.id==='nanpu'){
   // Build each column once: overlapping rounded samples formerly stacked stair treads.
   for(let x=117;x<=282;x++)for(let z=187;z<=209;z++){const h=nanpuSurfaceAt(x+.5,z+.5);if(h===null)continue;const floor=Math.floor(h+1e-6)-1;w.fill(x,floor+1,z,x,Math.min(143,floor+25),z,0);w.set(x,floor,z,9);}
   continue;
  }
  for(const p of samples){for(let dx=-b.width;dx<=b.width;dx++)for(let dz=-b.width;dz<=b.width;dz++){
   w.fill(p.x+dx,p.y,p.z+dz,p.x+dx,p.y+2,p.z+dz,0);w.set(p.x+dx,p.y-1,p.z+dz,b.id==='nanpu'?9:7);
  }}
  // Supports are outside the walking lane; the central river span stays navigable.
  for(let i=10;i<samples.length-10;i+=28){const p=samples[i],next=samples[Math.min(i+2,samples.length-1)],alongX=Math.abs(next.x-p.x)>=Math.abs(next.z-p.z);for(const side of [-1,1]){const x=p.x+(alongX?0:side*(b.width+1)),z=p.z+(alongX?side*(b.width+1):0);if(isRoad(x,z)||BRIDGES.some(other=>other.samples.some(t=>Math.abs(x-t.x)<=other.width&&Math.abs(z-t.z)<=other.width)))continue;w.fill(x,Math.min(w.surfaceAt(x,z),p.y-1),z,x,p.y-1,z,9);w.set(x,p.y,z,9);w.set(x,p.y+1,z,12);}}
 }
 // Two H pylons, with clear headroom over the carriageway.
 for(const x of [208,255]){for(const z of [201,211]){w.fill(x-1,10,z-1,x+1,59,z+1,9);w.fill(x,49,z,x,58,z,10);}w.fill(x-1,55,201,x+1,57,211,9);}
}
