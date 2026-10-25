export const RICKSHAW_LINES={warn:'借光，借光！车来喽！您慢着点儿！',mount:'客官，坐稳喽！咱们绕老街，走起！',arrive:'客官，您慢走！祝您游园愉快！'};
const CLIPS=Object.fromEntries(Object.keys(RICKSHAW_LINES).map(k=>[k,new URL(`./assets/audio/rickshaw-${k}.mp3`,import.meta.url).href]));

// A single nearby caller, not eight independent global speech queues.
export function createRickshawAudio({getPos,getAudio,getSound=()=>true,getVolume=()=>.28,fetchAudio=globalThis.fetch}={}){
 const clips=new Map();let elapsed=0,lastCall=-Infinity,retryAfter=0,playing=false,current=null,pending=null,sequence=0;
 function level(source){const p=getPos?.(),q=source?.();if(!p||!q||Math.abs(p.y-q.y)>3)return 0;const d=Math.hypot(p.x-q.x,p.z-q.z);return d>=8?0:Math.min(1,((8-d)/6)**2);}
 function allowed(source){return playing&&getSound()&&getVolume()>0&&level(source)>0;}
 function stop(){sequence++;pending=null;if(current){const old=current;current=null;try{old.source.stop();}catch{}old.source.disconnect();old.gain.disconnect();}}
 async function buffer(type,ctx){if(clips.has(type))return clips.get(type);const promise=(async()=>{const res=await fetchAudio(CLIPS[type]);if(!res.ok)throw Error('Voice unavailable');const bytes=await res.arrayBuffer();if(bytes.byteLength>200000)throw Error('Voice too large');const decoded=await ctx.decodeAudioData(bytes);if(decoded.duration>12||decoded.numberOfChannels>2)throw Error('Voice exceeds budget');return decoded;})();clips.set(type,promise);try{return await promise;}catch(e){clips.delete(type);throw e;}}
 function request(source,type='warn'){
  if(!CLIPS[type]||!allowed(source)||elapsed<retryAfter||(type==='warn'&&(current||pending||elapsed-lastCall<10)))return false;
  const ctx=getAudio?.();if(!ctx)return false;
  stop();const id=sequence;pending={source};lastCall=elapsed;
  buffer(type,ctx).then(decoded=>{if(id!==sequence||!allowed(source))return;pending=null;const node=ctx.createBufferSource(),gain=ctx.createGain();node.buffer=decoded;gain.gain.value=level(source)*Math.min(1,Math.max(0,getVolume()))*.85;node.connect(gain);gain.connect(ctx.destination);const item={source:node,gain,position:source};current=item;node.onended=()=>{if(current===item)current=null;node.disconnect();gain.disconnect();};node.start();}).catch(()=>{if(id===sequence){pending=null;retryAfter=elapsed+30;}});
  return true;
 }
 function tick(dt){playing=dt>0;elapsed+=Math.max(0,dt);const position=current?.position??pending?.source;if(position&&!allowed(position)){stop();return;}if(current)current.gain.gain.setTargetAtTime(level(position)*Math.min(1,Math.max(0,getVolume()))*.85,current.source.context.currentTime,.06);}
 return {request,tick,suspend(){playing=false;stop();},dispose(){playing=false;stop();clips.clear();}};
}
