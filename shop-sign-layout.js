import {buildingStyle,buildingSection,facadeRuns} from './city-architecture.js';
// Find the actual wall at this height (including setbacks), not the ground-floor plot.
export function shopSignAnchor(b,y,dx=0){
 const s=buildingStyle(b),level=Math.max(0,Math.min(s.height-1,Math.floor(y-26))),q=buildingSection(b,s,level),side=b.entranceSide;
 const face=facadeRuns(q).filter(f=>f.axis==='z'&&f.side===side).sort((a,c)=>c.width-a.width)[0];
 const localX=Math.max(face.from,Math.min(face.to,dx));
 return {x:b.x+.5+localX,y,z:b.z+.5+face.zz+side*.045,angle:side>0?0:Math.PI,width:face.width};
}
