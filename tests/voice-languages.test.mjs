import assert from 'node:assert/strict';
import {voicePreferences,chooseVoice,voiceMatchesLanguage,announcementLines,speakVoiceLines,setVoicePreference} from '../game/voice-settings.js';
import {createSceneAudio} from '../game/scene-audio.js';
const memory=new Map(),storage={getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)};
const mandarin={name:'Xiaoxiao Natural',lang:'zh-CN',voiceURI:'mandarin'},english={name:'Jenny Natural',lang:'en-US',voiceURI:'english'},cantonese={name:'HiuGaai Natural',lang:'zh-HK',voiceURI:'cantonese'};
const voices=[cantonese,{name:'Cantonese Natural',lang:'yue-CN',voiceURI:'yue'},english,mandarin,{name:'Macau',lang:'zh-MO',voiceURI:'macau'},{name:'Taiwan Natural',lang:'zh-TW',voiceURI:'taiwan'}],spoken=[];
const speech={getVoices:()=>voices,speak:u=>spoken.push(u)},Utterance=class{constructor(text){this.text=text;}};
assert.equal(voicePreferences(storage).metroLanguage,'bilingual');assert.equal(voicePreferences(storage).marketLanguage,'zh-CN');
for(const role of ['metro','market']){assert.equal(chooseVoice(speech,role,voicePreferences(storage)),mandarin);setVoicePreference(role,'cantonese',storage);assert.equal(chooseVoice(speech,role,voicePreferences(storage)),mandarin,'Previously saved Cantonese must not override the Mandarin filter');}
assert(voiceMatchesLanguage({...mandarin,lang:'zh_CN'}));assert(voiceMatchesLanguage({...mandarin,lang:'cmn-Hans-CN'}));assert(!voiceMatchesLanguage({...mandarin,name:'Cantonese'}));assert(!voiceMatchesLanguage(english));
assert.equal(chooseVoice({getVoices:()=>[cantonese,english]},'metro',voicePreferences(storage)),null,'No Mandarin means no Chinese speech, never browser-default Cantonese');
const cn='下一站，陆家嘴。右侧车门将会打开。',en='Next station, Lujiazui. Doors will open on the right.';
let lines=announcementLines(speech,'metro',cn,en,voicePreferences(storage));assert.deepEqual(lines.map(l=>l.voice),[mandarin,english]);let ended=0;
assert.equal(speakVoiceLines(speech,Utterance,lines,{onEnd:()=>ended++}),2);assert.deepEqual(spoken.map(u=>[u.text,u.lang]),[[cn,'zh-CN'],[en,'en-US']]);assert.equal(spoken[0].onend,undefined);spoken[1].onend();assert.equal(ended,1);
assert.equal(speakVoiceLines({...speech,pending:true},Utterance,lines),0,'Do not overlap a pending broadcast');
setVoicePreference('marketLanguage','en',storage);lines=announcementLines(speech,'market','热乎的小笼生煎！','Fresh soup dumplings!',voicePreferences(storage));assert.deepEqual(lines.map(l=>[l.text,l.voice]),[['Fresh soup dumplings!',english]]);
setVoicePreference('metroLanguage','zh-CN',storage);assert.equal(announcementLines(speech,'metro',cn,en,voicePreferences(storage)).length,1);
setVoicePreference('captionsOnly',true,storage);assert.equal(speakVoiceLines(speech,Utterance,announcementLines(speech,'metro',cn,en,voicePreferences(storage))),0);
const unavailable=announcementLines({getVoices:()=>[cantonese]},'metro',cn,en,{...voicePreferences(storage),captionsOnly:false,metroLanguage:'bilingual'});assert.equal(unavailable.length,2,'Keep bilingual subtitles when matching voices are unavailable');assert.equal(speakVoiceLines(speech,Utterance,unavailable),0);
memory.set('block-island-voice-settings',JSON.stringify({metroLanguage:'yue',marketLanguage:'unknown',metro:'cantonese'}));assert.equal(voicePreferences(storage).metroLanguage,'bilingual');assert.equal(voicePreferences(storage).marketLanguage,'zh-CN');
const previousStorage=globalThis.localStorage;
try{
 globalThis.localStorage=storage;
 const param=()=>({value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},setTargetAtTime(){}}),node=()=>({gain:param(),frequency:param(),pan:param(),connect(){},disconnect(){},start(){},stop(){}});
 const ctx={currentTime:0,sampleRate:32,destination:{},resume(){},createGain:node,createOscillator:node,createStereoPanner:node,createBiquadFilter:node,createBufferSource:node,createBuffer:()=>({getChannelData:()=>new Float32Array(64)})};
 const state={playing:true,sound:true,pos:{x:-90,y:26,z:66},vendors:[{food:true,root:{position:{x:-89,y:26,z:66}}}],agents:[]};
 for(const [mode,languages] of [['zh-CN',['zh-CN']],['en',['en-US']],['bilingual',['zh-CN','en-US']]]){
  setVoicePreference('marketLanguage',mode,storage);spoken.length=0;
  const ambient=createSceneAudio(()=>ctx,{speech:{...speech,cancel(){}},Utterance});ambient.start();ambient.update(.1,state);
  assert.deepEqual(spoken.map(u=>u.lang),languages,'Merchant integration must follow the selected language');
  for(const u of spoken)assert(u.lang==='en-US'?u.text.includes('dumplings'):u.text.includes('生煎'));
  ambient.dispose();
 }
}finally{if(previousStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=previousStorage;}
console.log('PASS: Cantonese exclusion including saved choices, Mandarin/English defaults and switching, correct text-language pairing, ordered bilingual speech, pending/muted/unavailable voice guards.');
