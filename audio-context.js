// The welcome click and the later game bundle share one context per page.
// The page owns it; opening/closing menus does not create or close contexts.
const key=Symbol.for('block-island.audio-context');
export function primeGameAudioContext(host=globalThis){
 let ctx=host[key];
 if(!ctx){const AudioContext=host.AudioContext||host.webkitAudioContext;if(!AudioContext)return null;ctx=new AudioContext();host[key]=ctx;}
 if(ctx.state==='suspended'||ctx.state==='interrupted')try{ctx.resume()?.catch(()=>{});}catch{}
 return ctx;
}
