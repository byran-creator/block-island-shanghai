import {metroInterior,metroRampFloor} from './metro-layout.js';

// Mesh ramp support tolerates tiny float errors. Before leaving that mesh,
// align the feet to the voxel floor so its edge does not become a false wall.
export function snapMetroFloor(world,p,velocity,{flying=false,gliding=false}={},floorAt=()=>null){
 if(flying||gliding||velocity>0||!metroInterior(p))return null;
 const ramp=metroRampFloor(p.x,p.z),hall=Math.abs(p.y-16)<.04&&world.get(Math.floor(p.x),15,Math.floor(p.z))?16:null;
 const floor=ramp??hall??floorAt(p.x,p.z);
 return Number.isFinite(floor)&&Math.abs(p.y-floor)<.04?floor:null;
}
