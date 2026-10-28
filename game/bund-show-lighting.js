const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Three broad groups, in geographic order; adjacent bands share a cue.
export function bundShowLevel(time,band){
 const t=Math.max(0,time),floor=.38;
 if(t<2)return 1-(1-floor)*smooth(t/2);
 if(t<33){
  const cycle=(t-2)%12,position=cycle<6?cycle/6*2:(12-cycle)/6*2;
  const highlight=band<0?.36:smooth(1-Math.abs(Math.floor(band/2)-position)/1.15);
  const wave=floor+(1-floor)*highlight*smooth(t-2);
  const ending=smooth((t-31)/2);
  return wave*(1-ending)+ending;
 }
 if(t<40){const pulse=.5+.5*Math.cos((t-33)*Math.PI);return floor+(1-floor)*smooth(pulse);}
 return floor+(1-floor)*smooth((t-40)/2);
}
