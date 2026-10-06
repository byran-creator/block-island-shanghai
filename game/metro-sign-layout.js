import {metroRampFloor} from './metro-layout.js';
export function metroExitSign(exit){const x=exit.x+exit.dir*16,z=exit.z,floor=metroRampFloor(x,z);return {x,z,y:(floor??16)+3.1,width:5,height:.85};}
export const METRO_SECURITY_GUIDANCE={y:19.55,width:5.5,height:.9};
