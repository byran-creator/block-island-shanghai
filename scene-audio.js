import {announcementLines,speakVoiceLines} from './voice-settings.js';
import {metroInterior} from './metro-layout.js';
import {DENSE_BUILDINGS,NANJING_WEST,roadX} from './city-layout.js';
import {PEACE,PEACE_DINING} from './peace-restaurant.js';
import {riverWestEdge,riverEastEdge} from './shanghai-map.js';

const shops=DENSE_BUILDINGS.filter(b=>b.id.startsWith('nanjing-'));
export function soundScene(p,night=false){
 if(metroInterior(p))return {name:'地铁2号线',track:'metro',traffic:0,water:0};
 if(p.y<22)return {name:'水下',track:'deep',water:.7,traffic:0};
 if(Math.abs(p.x-PEACE.x)<PEACE.rx&&Math.abs(p.z-PEACE.z)<PEACE.rz&&Math.abs(p.y-PEACE_DINING.y)<2)return {name:'龙凤厅',track:'dining',dining:1,traffic:0};
 if(p.y>=25&&p.y<30&&shops.some(b=>Math.abs(p.x-b.x)<b.rx&&Math.abs(p.z-b.z)<b.rz))return {name:'南京路店铺',track:'shop',shop:1,traffic:.05};
 if(p.y>=24&&p.y<32&&p.x>=NANJING_WEST&&p.x<roadX(66)-4&&Math.abs(p.z-66)<6)return {name:'南京路步行街',track:'shop',market:1,traffic:.12};
 if(p.z>=270)return {name:'生活岛',track:'island',water:.15,traffic:0};
 const distance=Math.min(Math.abs(p.x-riverWestEdge(p.z)),Math.abs(p.x-riverEastEdge(p.z)));
 return {name:distance<18?'浦江岸边':'城市街区',track:night?'neon':'river',water:Math.max(0,1-distance/22)*.45,traffic:p.y<36?1:.12};
}
export function nearbyTraffic(agents,p,yaw=0){let best=null;for(const a of agents){const q=a.root.position,d=Math.hypot(q.x-p.x,q.z-p.z,(q.y-p.y)*2);if(d<24&&(!best||d<best.distance))best={actor:a,distance:d,level:(1-d/24)**2,pan:Math.max(-1,Math.min(1,((q.x-p.x)*Math.cos(yaw)-(q.z-p.z)*Math.sin(yaw))/12))};}return best;}

// Original synthesized ambience; spoken calls use explicitly matched Mandarin/English voices.
export function createSceneAudio(getContext,{speech=globalThis.speechSynthesis,Utterance=globalThis.SpeechSynthesisUtterance}={}){
 let ctx,master,water,engine,engineOsc,engineHarmonic,panner,noise,enabled=true,clock=0,lastStep=0,lastDetail=0,lastCall=-25,lastHorn=-5,previous=null,previousScene='',ownSpeech=false;
 const effects=new Set(),KEY='block-island-ambient-preferences';try{enabled=localStorage.getItem(KEY)!=='off';}catch{}
 function cancelCall(){if(ownSpeech){speech?.cancel();ownSpeech=false;}}
 function start(){try{ctx??=getContext();if(!ctx)return false;if(!master){master=ctx.createGain();master.gain.value=0;master.connect(ctx.destination);const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);let seed=1743;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=seed/2147483648-1;}noise=ctx.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=470;water=ctx.createGain();water.gain.value=0;noise.connect(filter);filter.connect(water);water.connect(master);noise.start();engine=ctx.createGain();engine.gain.value=0;panner=ctx.createStereoPanner();engine.connect(panner);panner.connect(master);engineOsc=ctx.createOscillator();engineOsc.type='triangle';engineOsc.connect(engine);engineHarmonic=ctx.createOscillator();engineHarmonic.type='sine';engineHarmonic.connect(engine);engineOsc.start();engineHarmonic.start();}ctx.resume()?.catch?.(()=>{});return true;}catch{return false;}}
 function tone(frequency,duration,level,type='sine',pan=0){if(!ctx||!master||!enabled)return;const osc=ctx.createOscillator(),gain=ctx.createGain(),stereo=ctx.createStereoPanner(),t=ctx.currentTime;osc.type=type;osc.frequency.value=frequency;gain.gain.setValueAtTime(.0001,t);gain.gain.exponentialRampToValueAtTime(Math.max(.0001,level),t+.012);gain.gain.exponentialRampToValueAtTime(.0001,t+duration);stereo.pan.value=pan;osc.connect(gain);gain.connect(stereo);stereo.connect(master);effects.add(osc);osc.onended=()=>{effects.delete(osc);osc.disconnect();gain.disconnect();stereo.disconnect();};osc.start(t);osc.stop(t+duration+.02);}
 function update(dt,{playing,hidden,sound=true,volume=.28,pos,yaw=0,agents=[],vendors=[],riding=false,dialogue=false,night=false,rain=0}){
  const audible=playing&&!hidden&&sound&&enabled;
  if(master)master.gain.setTargetAtTime(audible?volume:.0,ctx.currentTime,.12);
  if(!audible){cancelCall();previous=pos?{...pos}:null;return;}
  const area=soundScene(pos,night);clock+=dt;
  if(!master){previous={...pos};return;}
  const near=nearbyTraffic(agents,pos,yaw),speed=Math.abs(near?.actor.travelSpeed??0);
  water.gain.setTargetAtTime((area.water??0)*.08+rain*.035,ctx.currentTime,.45);
  engine.gain.setTargetAtTime((near?.level??0)*(area.traffic??0)*(speed>.05?.014:.003),ctx.currentTime,.16);
  engineOsc.frequency.setTargetAtTime(42+speed*9,ctx.currentTime,.18);engineHarmonic.frequency.setTargetAtTime(84+speed*18,ctx.currentTime,.18);panner.pan.setTargetAtTime(near?.pan??0,ctx.currentTime,.12);
  const travel=previous?Math.hypot(pos.x-previous.x,pos.z-previous.z):0;previous={...pos};
  if(!riding&&pos.y>=25&&pos.y<30&&travel>.002&&travel<3){lastStep+=travel;if(lastStep>.85){lastStep=0;tone(95+Math.sin(clock)*12,.085,.016,'triangle');}}
  if(area.name!==previousScene){if(area.shop)for(const hz of [1047,1319])tone(hz,.45,.018);previousScene=area.name;}
  if(clock-lastDetail>3.5){lastDetail=clock;if(area.dining)tone(1500+Math.sin(clock)*250,.15,.012,'sine',Math.sin(clock));else if(area.market||area.shop)tone(390,.07,.006,'triangle',Math.sin(clock));else if(near?.actor.kind==='bus'&&near.actor.dwell>0){tone(880,.22,.02,'sine',near.pan);tone(1175,.3,.012,'sine',near.pan);}}
  if(dialogue){cancelCall();return;}
  if(clock-lastCall>24&&Utterance&&speech&&!speech.speaking&&!speech.pending){const vendor=vendors.find(v=>Math.abs(pos.y-v.root.position.y)<3&&Math.hypot(pos.x-v.root.position.x,pos.z-v.root.position.z)<10);if(vendor){lastCall=clock;const lines=announcementLines(speech,'market',vendor.food?'热乎的小笼生煎，来尝尝！':'海派纪念品，欢迎来看看！',vendor.food?'Fresh soup dumplings and pan-fried buns! Come and try some!':'Shanghai souvenirs! Come and take a look!');ownSpeech=speakVoiceLines(speech,Utterance,lines,{rate:.94,volume:Math.min(1,volume*.6),onEnd:()=>ownSpeech=false})>0;}}
 }
 function horn(){if(!master||!enabled||clock-lastHorn<3)return;lastHorn=clock;tone(320,.22,.018,'triangle');tone(400,.2,.012,'triangle');}
 function setEnabled(value){enabled=!!value;try{localStorage.setItem(KEY,enabled?'on':'off');}catch{}if(!enabled){cancelCall();master?.gain.setTargetAtTime(0,ctx.currentTime,.08);}}
 function suspend(){cancelCall();previous=null;master?.gain.setTargetAtTime(0,ctx.currentTime,.08);}
 function dispose(){cancelCall();for(const node of [noise,engineOsc,engineHarmonic,...effects]){try{node?.stop();}catch{}node?.disconnect();}master?.disconnect();}
 return {start,update,horn,setEnabled,suspend,dispose,get enabled(){return enabled;}};
}
