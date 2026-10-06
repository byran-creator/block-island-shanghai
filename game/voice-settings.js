const KEY='block-island-voice-settings',LANGUAGES=['zh-CN','en','bilingual'];
const defaults={metro:'auto',market:'auto',metroLanguage:'bilingual',marketLanguage:'zh-CN',captionsOnly:false};
export function voicePreferences(storage=globalThis.localStorage){try{const p=JSON.parse(storage?.getItem(KEY)||'{}')||{};return {...defaults,metro:typeof p.metro==='string'?p.metro:'auto',market:typeof p.market==='string'?p.market:'auto',metroLanguage:LANGUAGES.includes(p.metroLanguage)?p.metroLanguage:defaults.metroLanguage,marketLanguage:LANGUAGES.includes(p.marketLanguage)?p.marketLanguage:defaults.marketLanguage,captionsOnly:p.captionsOnly===true};}catch{return {...defaults};}}
export function voiceMatchesLanguage(voice,language='zh-CN'){
 const lang=(voice.lang||'').replaceAll('_','-').toLowerCase();
 if(language==='en')return /^en(?:-|$)/.test(lang);
 // zh-HK/zh-MO/yue are Cantonese, not Mandarin. Never fall back to a browser's default voice.
 return (/^zh-(cn|sg|tw)(?:-|$)/.test(lang)||/^cmn(?:-|$)/.test(lang))&&!/cantonese|粤语|廣東話|广东话|\byue\b/i.test(voice.name||'');
}
export function chooseVoice(speech,role='metro',preferences=voicePreferences(),language='zh-CN'){
 if(preferences.captionsOnly)return null;
 const voices=(speech?.getVoices?.()||[]).filter(v=>voiceMatchesLanguage(v,language)),chosen=voices.find(v=>(v.voiceURI||v.name)===preferences[role]);if(chosen)return chosen;
 const score=v=>(/natural|neural|online|xiaoxiao|yunxi|xiaoyi|xiaohan|xiaomeng/i.test(v.name||'')?5:v.localService?2:1)+(/^zh[-_]CN$/i.test(v.lang)?10:0);
 return [...voices].sort((a,b)=>score(b)-score(a))[0]||null;
}
export function announcementLines(speech,role,chinese,english,preferences=voicePreferences()){
 const mode=preferences[role+'Language']||defaults[role+'Language'],languages=mode==='bilingual'?['zh-CN','en']:[mode];
 return languages.map(language=>({text:language==='en'?english:chinese,voice:chooseVoice(speech,role,preferences,language)})).filter(line=>line.text);
}
export function speakVoiceLines(speech,Utterance,lines,{rate=.92,volume=.55,onEnd=()=>{}}={}){
 if(!speech||!Utterance||speech.speaking||speech.pending)return 0;
 const spoken=lines.filter(line=>line.voice);
 spoken.forEach((line,index)=>{const u=new Utterance(line.text);u.voice=line.voice;u.lang=line.voice.lang;u.rate=rate;u.volume=volume;if(index===spoken.length-1)u.onend=u.onerror=onEnd;speech.speak(u);});
 return spoken.length;
}
export function setVoicePreference(role,value,storage=globalThis.localStorage){const p=voicePreferences(storage);p[role]=value;try{storage?.setItem(KEY,JSON.stringify(p));}catch{}globalThis.speechSynthesis?.cancel();return p;}
export function mountVoiceSettings(){
 const speech=globalThis.speechSynthesis;
 const refresh=()=>{const p=voicePreferences();for(const role of ['metro','market']){const mode=p[role+'Language'];document.getElementById('voice-'+role+'-language').value=mode;const voices=(speech?.getVoices?.()||[]).filter(v=>mode==='bilingual'?voiceMatchesLanguage(v)||voiceMatchesLanguage(v,'en'):voiceMatchesLanguage(v,mode)),select=document.getElementById('voice-'+role);select.replaceChildren();for(const [value,label]of [['auto','自动选择普通话 / 英语嗓音'],...voices.map(v=>[v.voiceURI||v.name,v.name+' · '+(voiceMatchesLanguage(v,'en')?'English':'普通话')])]){const o=document.createElement('option');o.value=value;o.textContent=label;select.append(o);}select.value=[...select.options].some(o=>o.value===p[role])?p[role]:'auto';}document.getElementById('voice-captions').checked=p.captionsOnly;};
 for(const role of ['metro','market'])document.getElementById('voice-'+role).onchange=e=>setVoicePreference(role,e.target.value);
 for(const role of ['metro','market'])document.getElementById('voice-'+role+'-language').onchange=e=>{setVoicePreference(role+'Language',e.target.value);refresh();};
 document.getElementById('voice-captions').onchange=e=>setVoicePreference('captionsOnly',e.target.checked);
 speech?.addEventListener?.('voiceschanged',refresh);refresh();
}
