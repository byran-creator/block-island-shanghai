// One small reusable shoe-impact buffer. No per-person loops or audio downloads.
export function createFootsteps(ctx,output){
 const buffer=ctx.createBuffer(1,2400,16000),data=buffer.getChannelData(0),sources=new Set();let seed=103,low=0,step=0,disposed=false;
 for(let i=0;i<data.length;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const t=i/16000,noise=seed/2147483648-1;low+=.24*(noise-low);
  const attack=Math.min(1,t/.003),heel=Math.sin(2*Math.PI*(105*t-100*t*t))*Math.exp(-t*45),sole=low*Math.exp(-t*32);
  data[i]=attack*(heel*.55+sole*.8)*Math.min(1,(.15-t)/.018);
 }
 function play({level=.22,pan=0,surface=3}={}){
  if(disposed||sources.size>=4||level<=0)return;
  const source=ctx.createBufferSource(),gain=ctx.createGain(),stereo=ctx.createStereoPanner();source.buffer=buffer;
  source.playbackRate.value=([4,7].includes(surface)?.82:[1,2,6].includes(surface)?.94:1.12)+(step++%2?.035:-.035);
  gain.gain.value=level;stereo.pan.value=Math.max(-1,Math.min(1,pan));source.connect(gain);gain.connect(stereo);stereo.connect(output);
  const clear=()=>{sources.delete(source);source.disconnect();gain.disconnect();stereo.disconnect();};source.onended=clear;sources.add(source);source.start();
 }
 function stop(){for(const source of sources){source.stop();const clear=source.onended;source.onended=null;clear();}}
 return {play,stop,dispose(){disposed=true;stop();}};
}

// Sample nearby walkers at 5 Hz; at most one quiet crowd step per sample.
// Only nearby motion is remembered, rather than creating audio nodes for a city.
export function createNearbyFootsteps(play){
 const nearby=new Map();let elapsed=0,epoch=0;
 function reset(){nearby.clear();elapsed=0;}
 function update(dt,people,pos,yaw=0){
  elapsed+=dt;if(elapsed<.2)return;elapsed=0;epoch++;let nearest=null,best=36;
  for(const actor of typeof people==='function'?people():people){
   if(!actor.person||actor.metroRole||actor.root.visible===false)continue;
   const q=actor.root.position,dx=q.x-pos.x,dz=q.z-pos.z,d2=dx*dx+dz*dz;
   if(d2>=36||Math.abs(q.y-pos.y)>1.6)continue;
   let entry=nearby.get(actor.root);
   if(!entry){entry={x:q.x,y:q.y,z:q.z,distance:0,epoch};nearby.set(actor.root,entry);}
   const travel=Math.hypot(q.x-entry.x,q.z-entry.z);
   if(travel>.015&&travel<1.5&&Math.abs(q.y-entry.y)<.3){entry.distance+=travel;if(entry.distance>=.8&&d2<best){nearest={entry,dx,dz,d2};best=d2;}}
   else entry.distance=0;
   entry.x=q.x;entry.y=q.y;entry.z=q.z;entry.epoch=epoch;
  }
  for(const [root,entry]of nearby)if(entry.epoch!==epoch)nearby.delete(root);
  if(nearest){nearest.entry.distance%=.8;const d=Math.sqrt(nearest.d2);play({level:.075*(1-d/6)**2,pan:(nearest.dx*Math.cos(yaw)-nearest.dz*Math.sin(yaw))/6});}
 }
 return {update,reset};
}
