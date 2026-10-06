export const SHOW_DURATION=42;
export const SHOW_SECTIONS=['金色开场','冰蓝星海','玫红花雨','金柳谢幕'];
const hues=[.115,.55,.92,.115];
export function showCue(time){
 const section=Math.min(3,Math.floor(Math.max(0,time)/10.5)),next=Math.min(3,section+1),mix=Math.max(0,Math.min(1,(time-section*10.5-8.7)/1.8));
 const delta=((hues[next]-hues[section]+1.5)%1)-.5,hue=(hues[section]+delta*mix+1)%1;
 return {section,name:SHOW_SECTIONS[section],hue,brightness:.72+.28*(.5+.5*Math.sin(time*Math.PI/1.2)),beat:time/1.2};
}
