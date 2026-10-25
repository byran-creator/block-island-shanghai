// One small reusable shoe-impact buffer. No per-person loops or audio downloads.
export function createFootsteps(ctx,output){
 const buffer=ctx.createBuffer(1,2400,16000),data=buffer.getChannelData(0),sources=new Set(),playerBuffers=new Map();let seed=103,low=0,step=0,disposed=false;
 for(let i=0;i<data.length;i++){
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;const t=i/16000,noise=seed/2147483648-1;low+=.24*(noise-low);
  const attack=Math.min(1,t/.003),heel=Math.sin(2*Math.PI*(105*t-100*t*t))*Math.exp(-t*45),sole=low*Math.exp(-t*32);
  data[i]=attack*(heel*.55+sole*.8)*Math.min(1,(.15-t)/.018);
 }
 function shoeBuffer(surface){
  const kind=surface===4||surface===7?'wood':surface===1||surface===2||surface===6?'soft':'stone';if(playerBuffers.has(kind))return playerBuffers.get(kind);
  const b=ctx.createBuffer(1,2400,16000),samples=b.getChannelData(0),soft=kind==='soft';let random=105,colored=0,bass=0,peak=0;
  for(let i=0;i<samples.length;i++){
   random=(Math.imul(random,1664525)+1013904223)>>>0;const t=i/16000,noise=random/2147483648-1;
   colored+=(soft?.5:kind==='wood'?.22:.34)*(noise-colored);bass+=(soft?.16:.09)*(colored-bass);
   const heel=Math.exp(-Math.pow((t-.018)/.010,2))*(soft?.12:.32),brush=Math.exp(-Math.pow((t-.052)/.026,2))*(soft?.40:.22);
   samples[i]=(colored-bass)*(heel+brush)*Math.min(1,t/.006);peak=Math.max(peak,Math.abs(samples[i]));
  }
  const scale=(soft?.22:kind==='wood'?.26:.30)/Math.max(.001,peak);for(let i=0;i<samples.length;i++)samples[i]*=scale;
  playerBuffers.set(kind,b);return b;
 }
 function play({level=.10,pan=0,surface=3,profile='npc'}={}){
  if(disposed||sources.size>=4||level<=0)return;
  const source=ctx.createBufferSource(),gain=ctx.createGain(),stereo=ctx.createStereoPanner();source.buffer=profile==='player'?shoeBuffer(surface):buffer;
  source.playbackRate.value=([4,7].includes(surface)?.82:[1,2,6].includes(surface)?.94:1.12)+(step++%2?.035:-.035);
  gain.gain.value=level;stereo.pan.value=Math.max(-1,Math.min(1,pan));source.connect(gain);gain.connect(stereo);stereo.connect(output);
  const clear=()=>{sources.delete(source);source.disconnect();gain.disconnect();stereo.disconnect();};source.onended=clear;sources.add(source);source.start();
 }
 function stop(){for(const source of sources){source.stop();const clear=source.onended;source.onended=null;clear();}}
 return {play,stop,dispose(){disposed=true;stop();playerBuffers.clear();}};
}

// A footfall at movement onset, then one impact per stride. Brief contact gaps
// pause the gait rather than losing all accumulated progress on a single frame.
export function createStepCadence(play){
 let clock=0,next=0,distance=0,idle=0,moving=false;
 function reset(){distance=0;idle=0;moving=false;next=clock;}
 function update(dt,travel,walking=true){
  if(!(dt>0))return;clock+=dt;
  if(!walking||!(travel>.002&&travel<3)){idle+=dt;if(idle>=.12)reset();return;}
  idle=0;
  const onset=!moving;moving=true;distance+=travel;
  const stride=Math.max(.8,Math.min(1.45,travel/dt*.30));
  if((onset||distance+1e-8>=stride)&&clock+1e-8>=next){distance=onset?0:Math.max(0,distance-stride);next=clock+.20;play();}
 }
 return {update,reset};
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
   const leg=actor.legs?.[0]?.rotation.x,sign=Number.isFinite(leg)&&Math.abs(leg)>.025?Math.sign(leg):0;
   let entry=nearby.get(actor.root);
   if(!entry){entry={x:q.x,y:q.y,z:q.z,distance:0,sign,epoch};nearby.set(actor.root,entry);}
   const travel=Math.hypot(q.x-entry.x,q.z-entry.z);
   if(travel>.015&&travel<1.5&&Math.abs(q.y-entry.y)<.3){entry.distance+=travel;const contact=Number.isFinite(leg)?sign&&entry.sign&&sign!==entry.sign:entry.distance>=.65;if(contact&&d2<best){nearest={entry,dx,dz,d2};best=d2;}}
   else entry.distance=0;
   entry.x=q.x;entry.y=q.y;entry.z=q.z;entry.epoch=epoch;if(sign)entry.sign=sign;
  }
  for(const [root,entry]of nearby)if(entry.epoch!==epoch)nearby.delete(root);
  if(nearest){nearest.entry.distance%=.65;const d=Math.sqrt(nearest.d2);play({level:.026*(1-d/6)**2,pan:(nearest.dx*Math.cos(yaw)-nearest.dz*Math.sin(yaw))/6});}
 }
 return {update,reset};
}
