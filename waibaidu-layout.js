// Geographic relationship: across the Suzhou River mouth, on the west side of Huangpu.
// The city is compressed; existing Bund and North Bund coordinates stay unchanged.
export const WAIBAIDU={x:50,z:-21,south:-3,north:-39,y:26,width:5};
export const SUZHOU_WEST={start:-336,join:-216};
const oldCenter=x=>-21+.035*(x-62);
const bends=[[-336,-65],[-308,-59],[-280,-64],[-252,-55],[-231,-40],[-216,oldCenter(-216)]];
const ease=t=>t*t*(3-2*t);
export function suzhouCenter(x){
 if(x>=SUZHOU_WEST.join)return oldCenter(x);
 for(let i=1;i<bends.length;i++){
  const [ax,az]=bends[i-1],[bx,bz]=bends[i];
  if(x<=bx)return az+(bz-az)*ease(Math.max(0,(x-ax)/(bx-ax)));
 }
}
export const suzhouHalfWidth=x=>6.5+2.5*ease(Math.max(0,Math.min(1,(x+254)/38)));
export const inSuzhou=(x,z)=>x<=88&&Math.abs(z-suzhouCenter(x))<=suzhouHalfWidth(x);
export function waibaiduProtected(x,y,z){return Math.abs(x-WAIBAIDU.x)<=WAIBAIDU.width+2&&z>=WAIBAIDU.north-1&&z<=WAIBAIDU.south+1&&y>=24&&y<=37;}
export function buildWaibaidu(w,roads=[],minX=-224){
 for(let x=minX;x<=88;x++){
  const center=suzhouCenter(x),halfWidth=suzhouHalfWidth(x);
  for(let z=Math.ceil(center-halfWidth);z<=Math.floor(center+halfWidth);z++){
   w.fill(x,15,z,x,142,z,0);
   w.set(x,14,z,6);
  }
 }
 // Keep the pre-existing upstream street crossing connected, with a plain low deck.
 for(const r of roads)for(const p of r.samples)if(inSuzhou(p.x,p.z)&&p.x<WAIBAIDU.x-12)for(let dx=-r.width;dx<=r.width;dx++)for(let dz=-r.width;dz<=r.width;dz++)w.set(Math.round(p.x)+dx,25,Math.round(p.z)+dz,9);
 const {x,north,south,width}=WAIBAIDU;
 for(let z=north;z<=south;z++){w.fill(x-width,25,z,x+width,25,z,9);w.fill(x-width,26,z,x+width,36,z,0);}
 // Stone abutments and a single pier between the two steel spans.
 for(const z of [north,-21,south])w.fill(x-width,14,z-1,x+width,24,z+1,9);
 for(const side of [-1,1])for(let z=north;z<=south;z++){w.set(x+side*(width+1),26,z,9);}
}
