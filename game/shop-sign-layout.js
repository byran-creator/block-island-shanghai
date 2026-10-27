import {buildingStyle,buildingSection,facadeRuns} from './city-architecture.js';
// Match the physical lintel/pediment width in city-activity.js.
export function shopPlaqueHalfWidth(b,faceWidth){const variant=(b.streetIndex??0)%3;return variant===0?(Math.min(b.rx*1.5,faceWidth-1.2)+.18)/2:variant===1?(Math.min(b.rx*1.8,4.4)+.2)/2:(Math.min(b.rx*1.6,3.8)+.2)/2;}
// Find the actual wall at this height (including setbacks), not the ground-floor plot.
export function shopSignAnchor(b,y,dx=0){
 const s=buildingStyle(b),level=Math.max(0,Math.min(s.height-1,Math.floor(y-26))),q=buildingSection(b,s,level),side=b.entranceSide;
 const face=facadeRuns(q).filter(f=>f.axis==='z'&&f.side===side).sort((a,c)=>c.width-a.width)[0];
 const localX=Math.max(face.from,Math.min(face.to,dx));
 return {x:b.x+.5+localX,y,z:b.z+.5+face.zz+side*.045,angle:side>0?0:Math.PI,width:face.width};
}
