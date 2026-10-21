import {ALL_BUILDINGS} from './city-layout.js';
const peace=ALL_BUILDINGS.find(b=>b.id==='peace'),tomson=ALL_BUILDINGS.find(b=>b.id==='pudong-infill-southeast-2');
export const PRIVATE_SUITES=[{id:'peace-suite',name:'我的外滩总统套房',x:peace.x,z:peace.z,y:47,rx:6,rz:5,view:1,balcony:true,balconyDepth:3,lobby:{x:peace.x+3.5,y:26,z:peace.z+.5},target:{x:189.5,y:80,z:106.5}}, {id:'tomson-suite',name:'我的汤臣一品江景套房',x:tomson.x,z:tomson.z,y:77,rx:4,rz:6,view:-1,balcony:true,balconyDepth:2,lobby:{x:tomson.front-1.5,y:26,z:tomson.z+.5},target:{x:55,y:31,z:137}}];
export const suiteArrival=s=>({id:s.id,name:s.name,viewTarget:s.target,x:s.x+.5,y:s.y,z:s.z+.5});
export function buildPrivateSuites(w){for(const s of PRIVATE_SUITES){const {x,z,y,rx,rz}=s;w.fill(x-rx,y-1,z-rz,x+rx,y+4,z+rz,9);w.fill(x-rx+1,y,z-rz+1,x+rx-1,y+3,z+rz-1,0);w.fill(x+s.view*rx,y,z-rz+1,x+s.view*rx,y+3,z+rz-1,0);w.fill(x-1,y,z-rz,x+1,y+2,z-rz,0);if(s.balcony){const edge=x+s.view*rx,out=edge+s.view*s.balconyDepth;w.fill(Math.min(edge,out),y-1,z-rz+1,Math.max(edge,out),y-1,z+rz-1,9);w.fill(Math.min(edge,out),y,z-rz+1,Math.max(edge,out),y+3,z+rz-1,0);}}
 // Ground-floor entrance and the actual lift cabin retain a clear approach.
 w.fill(peace.x+2,26,peace.z-3,peace.x+5,29,peace.z+2,0);
}
export function suiteProtected(x,y,z){return PRIVATE_SUITES.some(s=>y>=s.y-1&&y<=s.y+4&&Math.abs(x-s.x)<=s.rx+(s.balconyDepth??0)&&Math.abs(z-s.z)<=s.rz);}
