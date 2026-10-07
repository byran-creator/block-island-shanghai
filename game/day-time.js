// World phase 0 is sunrise (06:00); keep the existing 0..240 save format.
export function clockMinutes(phase){return ((Math.round(phase*6)+360)%1440+1440)%1440;}
export function phaseFromMinutes(minutes){return ((minutes-360)%1440+1440)%1440/6;}
export function clockLabel(phase){const m=clockMinutes(phase);return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');}
export function clockOptions(saved){return {cycleSeconds:[1200,2400,3600,7200].includes(saved?.cycleSeconds)?saved.cycleSeconds:1200,paused:saved?.paused===true};}
export function advanceDay(phase,dt,options){return ((phase+(options.paused?0:dt*240/options.cycleSeconds))%240+240)%240;}
