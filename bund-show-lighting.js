const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
// Six existing light groups form a single travelling cue across the Bund.
export function bundShowLevel(time,band){
 const t=Math.max(0,time);
 if(t<2)return 1-smooth(t/2);
 if(t<33){
  const cycle=(t-2)%16,position=cycle<8?cycle/8*5:(16-cycle)/8*5;
  const wave=(.04+.96*smooth(1-Math.abs(band-position)/1.5))*smooth(t-2);
  const ending=smooth((t-31)/2);
  return wave*(1-ending)+ending;
 }
 if(t<40){const pulse=.5+.5*Math.cos((t-33)*Math.PI);return .04+.96*smooth(pulse);}
 return .04+.96*smooth((t-40)/2);
}
