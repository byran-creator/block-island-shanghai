import assert from 'node:assert/strict';import {createQuestIntro} from '../game/quest-intro.js';
const classes=new Set(),span={},hint={hidden:true,setAttribute(){},querySelector:()=>span,remove(){this.removed=true;}},tracker={appendChild(){},classList:{add:x=>classes.add(x),remove:x=>classes.delete(x)}},doc={createElement:()=>hint};
const coach=createQuestIntro(tracker,doc);coach.tick(5,{eligible:true,playing:false});assert(hint.hidden);coach.tick(.2,{eligible:true,playing:true});assert(!hint.hidden&&classes.has('quest-intro-highlight'));assert(span.textContent.includes('按 I'));
coach.tick(10,{eligible:true,playing:false});assert(hint.hidden,'Dialogue and cinematics do not show or consume the hint');coach.tick(.2,{eligible:true,playing:true,touch:true});assert(!hint.hidden&&span.textContent.includes('点任务标题'));
coach.tick(12,{eligible:true,playing:true});assert(hint.hidden&&!classes.size);coach.tick(1,{eligible:true,playing:true});assert(hint.hidden,'The cue does not restart every frame');
const dismissed=createQuestIntro(tracker,doc);dismissed.tick(.2,{eligible:true,playing:true});dismissed.dismiss();dismissed.tick(.2,{eligible:true,playing:true});assert(hint.hidden);dismissed.dispose();assert(hint.removed);
const later=createQuestIntro(tracker,doc);later.tick(1,{eligible:false,playing:true});assert(hint.hidden,'Existing players after chapter one are not sent through the tutorial again');
console.log('PASS: finite chapter-one coach, pause/resume, desktop/touch wording, dismiss and cleanup.');
