import {METRO_STATIONS,metroLineZ} from './metro-layout.js';
export const METRO_CYCLE=60,METRO_DWELL=12,METRO_TRAVEL=16;
const mod=t=>((t%METRO_CYCLE)+METRO_CYCLE)%METRO_CYCLE;
export function trainState(time,offset=0,direction=1){
 const t=mod(time+offset),origin=direction===1?0:1,destination=1-origin,cycle=Math.floor((time+offset)/METRO_CYCLE),arrival=METRO_DWELL+METRO_TRAVEL,end=arrival+METRO_DWELL;
 if(t<METRO_DWELL||t>=arrival&&t<end){const station=t<METRO_DWELL?origin:destination,part=t<METRO_DWELL?t:t-arrival;return {station,next:1-station,origin,direction,phase:'dwell',remaining:METRO_DWELL-part,open:part>=1.2&&part<METRO_DWELL-2,progress:station===origin?0:1,cycle,visible:true};}
 if(t<arrival){const u=(t-METRO_DWELL)/METRO_TRAVEL;return {station:origin,next:destination,origin,direction,phase:'travel',remaining:arrival-t,open:false,progress:u*u*(3-2*u),cycle,visible:true};}
 return {station:destination,next:origin,origin,direction,phase:'through',remaining:METRO_CYCLE-t,open:false,progress:1,cycle,visible:t<end+4||t>METRO_CYCLE-4,tail:t-end};
}
export function trainPose(state){const a=METRO_STATIONS[state.origin],b=METRO_STATIONS[1-state.origin],dx=state.direction;let x=a.x+(b.x-a.x)*state.progress;if(state.phase==='through')x=state.tail<4?b.x+dx*state.tail*10:a.x-dx*(METRO_CYCLE-2*METRO_DWELL-METRO_TRAVEL-state.tail)*10;const z=metroLineZ(x)-dx*8,yaw=-Math.atan2(metroLineZ(x+1)-metroLineZ(x-1),2);return {x,y:6,z,yaw,direction:dx};}
export function arrivalSeconds(time,station,offset=0,direction=1){const origin=direction===1?0:1,t=mod(time+offset),target=station===origin?0:METRO_DWELL+METRO_TRAVEL;return (target-t+METRO_CYCLE)%METRO_CYCLE;}
export function trainCrowd(state,index=0){const wave=((state.cycle+state.station+index)%5+5)%5;return {crowded:wave===1||wave===2,passengers:wave===1||wave===2?48:8,seats:wave===1||wave===2?0:40,full:false};}
