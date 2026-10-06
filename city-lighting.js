// Stable occupancy groups keep rooms consistent across reloads and limit rendering batches.
export function windowLightGroup(b,floor,bay,face){
 let hash=2166136261;for(const c of `${b.id}:${floor}:${bay}:${face}`)hash=Math.imul(hash^c.charCodeAt(0),16777619);
 const use=b.kind==='hotel'?'hotel':b.kind==='mall'?'retail':b.bank==='west'&&b.kind!=='glass'?'home':'office';
 return `${use}:${(hash>>>0)%16}`;
}
export function lightGroupVisible(group,night,dayClock){
 if(!night)return false;
 const [use,bucket]=group.split(':'),hour=(dayClock/10+6)%24,late=hour<6||hour>=24,evening=hour<22&&hour>=16;
 const density=use==='hotel'?(late?.22:evening?.55:.38):use==='home'?(late?.08:evening?.48:.3):use==='retail'?(late?0:evening?.7:.16):(late?.05:evening?.36:.17);
 return (+bucket+.5)/16<density;
}
