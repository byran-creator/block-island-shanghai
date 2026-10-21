// Presentation-only budgets. Simulation dt is accumulated between drawn frames.
export function renderProfile({mobile=false,mode='smooth',dpr=1,width=844,height=390}){
 if(!mobile)return {pixelRatio:Math.min(dpr,1.25),fps:0,antialias:true};
 const clear=mode==='clear',limit=clear?1400:1000;
 return {pixelRatio:Math.min(dpr,clear?1.25:.9,limit/Math.max(1,width,height)),fps:clear?60:30,antialias:false};
}
export function createFramePacer(){
 let deadline=null;
 return {reset(){deadline=null;},skip(now,fps){if(!fps){deadline=null;return false;}const interval=1000/fps;if(deadline!==null&&now<deadline-.5)return true;deadline=deadline===null||now-deadline>interval?now+interval:deadline+interval;return false;}};
}
export function needsChunkPlan(previous,point,force=false,immediate=false){return force||immediate||!previous||Math.hypot(previous.x-point.x,previous.z-point.z)>=8;}
export const mobileChunkDistances={nearRadius:4,buildingRange:150,landmarkRange:240};
