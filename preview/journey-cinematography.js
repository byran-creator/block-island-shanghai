// Small documentary-style rails; no post-processing buffers or video assets.
export function sampleJourneyShot(shot,seconds){
 const u=Math.max(0,Math.min(1,seconds/shot.duration)),t=u*u*(3-2*u);
 const position=shot.from.map((v,i)=>shot.control?(1-t)*(1-t)*v+2*(1-t)*t*shot.control[i]+t*t*shot.to[i]:v+(shot.to[i]-v)*t);
 const look=shot.look.map((v,i)=>v+((shot.lookTo??shot.look)[i]-v)*t);
 const lens=shot.lens??[58,58];
 return {position,look,fov:lens[0]+(lens[1]-lens[0])*t,shade:Math.max(0,1-Math.min(seconds,shot.duration-seconds)/.35),caption:Math.max(0,Math.min(1,seconds/.7,(shot.duration-seconds)/.4))};
}
