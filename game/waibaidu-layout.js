// Geographic relationship: across the Suzhou River mouth, on the west side of Huangpu.
// The city is compressed; existing Bund and North Bund coordinates stay unchanged.
export const WAIBAIDU={x:50,z:-21,south:-3,north:-39,y:26,width:5};
export const suzhouCenter=x=>-21+.035*(x-62);
export const inSuzhou=(x,z)=>x<=88&&Math.abs(z-suzhouCenter(x))<=9;
export function waibaiduProtected(x,y,z){return Math.abs(x-WAIBAIDU.x)<=WAIBAIDU.width+2&&z>=WAIBAIDU.north-1&&z<=WAIBAIDU.south+1&&y>=24&&y<=37;}
export function buildWaibaidu(w,roads=[]){
 for(let x=-224;x<=88;x++)for(let z=-43;z<=-8;z++)if(inSuzhou(x,z)){w.fill(x,15,z,x,142,z,0);w.set(x,14,z,6);}
 // Keep the pre-existing upstream street crossing connected, with a plain low deck.
 for(const r of roads)for(const p of r.samples)if(inSuzhou(p.x,p.z)&&p.x<WAIBAIDU.x-12)for(let dx=-r.width;dx<=r.width;dx++)for(let dz=-r.width;dz<=r.width;dz++)w.set(Math.round(p.x)+dx,25,Math.round(p.z)+dz,9);
 const {x,north,south,width}=WAIBAIDU;
 for(let z=north;z<=south;z++){w.fill(x-width,25,z,x+width,25,z,9);w.fill(x-width,26,z,x+width,36,z,0);}
 // Stone abutments and a single pier between the two steel spans.
 for(const z of [north,-21,south])w.fill(x-width,14,z-1,x+width,24,z+1,9);
 for(const side of [-1,1])for(let z=north;z<=south;z++){w.set(x+side*(width+1),26,z,9);}
}
