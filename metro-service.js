import {METRO_STATIONS,metroLineZ} from './metro-layout.js';
export const METRO_CYCLE=60,METRO_DWELL=12,METRO_ARRIVAL_GAP=5;
// Both directions share a cycle and half-cycle offset. This gives a five-second
// arrival gap at either station without extending the waiting interval.
export const METRO_TRAVEL=METRO_CYCLE/2-METRO_DWELL-METRO_ARRIVAL_GAP;
const mod=t=>((t%METRO_CYCLE)+METRO_CYCLE)%METRO_CYCLE;
export function trainState(time,offset=0,direction=1){
 const t=mod(time+offset),origin=direction===1?0:1,destination=1-origin,cycle=Math.floor((time+offset)/METRO_CYCLE),arrival=METRO_DWELL+METRO_TRAVEL,end=arrival+METRO_DWELL;
 if(t<METRO_DWELL||t>=arrival&&t<end){const station=t<METRO_DWELL?origin:destination,part=t<METRO_DWELL?t:t-arrival;return {station,next:1-station,origin,direction,phase:'dwell',remaining:METRO_DWELL-part,open:part>=1.2&&part<METRO_DWELL-2,progress:station===origin?0:1,cycle,visible:true};}
 if(t<arrival){const u=(t-METRO_DWELL)/METRO_TRAVEL;return {station:origin,next:destination,origin,direction,phase:'travel',remaining:arrival-t,open:false,progress:u*u*(3-2*u),cycle,visible:true};}
 return {station:destination,next:origin,origin,direction,phase:'through',remaining:METRO_CYCLE-t,open:false,progress:1,cycle,visible:t<end+4||t>METRO_CYCLE-4,tail:t-end};
}
export function trainPose(state,{stations=METRO_STATIONS,lineZ=metroLineZ}={}){const a=stations[state.origin],b=stations[1-state.origin],dx=state.direction;let x=a.x+(b.x-a.x)*state.progress;if(state.phase==='through')x=state.tail<4?b.x+dx*state.tail*10:a.x-dx*(METRO_CYCLE-2*METRO_DWELL-METRO_TRAVEL-state.tail)*10;const z=lineZ(x)-dx*8,yaw=-Math.atan2(lineZ(x+1)-lineZ(x-1),2);return {x,y:6,z,yaw,direction:dx};}
export function arrivalSeconds(time,station,offset=0,direction=1){const origin=direction===1?0:1,t=mod(time+offset),target=station===origin?0:METRO_DWELL+METRO_TRAVEL;return (target-t+METRO_CYCLE)%METRO_CYCLE;}
export function trainCrowd(state,index=0){const wave=((state.cycle+state.station+index)%5+5)%5;return {crowded:wave===1||wave===2,passengers:wave===1||wave===2?48:8,seats:wave===1||wave===2?0:40,full:false};}

export function createMetroService(stations,travel){
 const last=stations.length-1,arrivals=[0];
 for(const seconds of travel)arrivals.push(arrivals.at(-1)+METRO_DWELL+seconds);
 const activeTime=arrivals.at(-1)+METRO_DWELL,cycleLength=activeTime+22;
 const reverse=arrivals.map((_,i)=>arrivals.at(-1)-arrivals[last-i]);
 function state(time,offset=0,direction=1){
  const cycle=Math.floor((time+offset)/cycleLength),t=time+offset-cycle*cycleLength;
  const times=direction>0?arrivals:reverse,toIndex=i=>direction>0?i:last-i;
  const origin=toIndex(0);
  for(let i=0;i<=last;i++){
   const part=t-times[i],station=toIndex(i),next=toIndex(Math.min(last,i+1)),terminal=i===last;
   if(part<METRO_DWELL)return {station,next,origin,direction,terminal,phase:'dwell',remaining:METRO_DWELL-part,
    open:part>=1.2&&part<METRO_DWELL-2,progress:0,cycle,visible:true};
   if(!terminal&&t<times[i+1]){
    const u=(part-METRO_DWELL)/(times[i+1]-times[i]-METRO_DWELL);
    return {station,next,origin,direction,terminal:false,phase:'travel',remaining:times[i+1]-t,
     open:false,progress:u*u*(3-2*u),cycle,visible:true};
   }
  }
  const tail=t-activeTime;
  return {station:toIndex(last),next:origin,origin,direction,terminal:true,phase:'through',remaining:cycleLength-t,
   open:false,progress:1,cycle,visible:tail<4,tail};
 }
 function arrival(time,station,offset,direction){
  const target=direction>0?arrivals[station]:reverse[last-station];
  return ((target-time-offset)%cycleLength+cycleLength)%cycleLength;
 }
 return {state,arrival,cycle:cycleLength};
}
