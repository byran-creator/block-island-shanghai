import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {installTouchCalloutGuard} from '../game/touch-callout.js';
const events=new Map();let touch=true;
const doc={addEventListener(type,fn){events.set(type,fn);},removeEventListener(type,fn){assert.equal(events.get(type),fn);events.delete(type);}};
const dispose=installTouchCalloutGuard(doc,{isTouch:()=>touch});
function event({editable=false,control=true}={}){return {prevented:false,target:{closest(selector){return selector.startsWith('input')?editable:control;}},preventDefault(){this.prevented=true;}};}
for(const type of ['contextmenu','selectstart']){
 const held=event();events.get(type)(held);assert(held.prevented);
 const input=event({editable:true});events.get(type)(input);assert(!input.prevented,'Typing, selecting and pasting in form fields stays native');
 const outside=event({control:false});events.get(type)(outside);assert(!outside.prevented,'Other content and photo download links keep native behavior');
 touch=false;const desktop=event();events.get(type)(desktop);assert(!desktop.prevented);touch=true;
}
assert(!events.has('pointerdown')&&!events.has('touchstart'),'The guard must not consume joystick, button clicks or scrolling');dispose();assert.equal(events.size,0);
const css=await readFile('game/style.css','utf8'),game=await readFile('game/game.js','utf8');assert(css.includes('-webkit-touch-callout:none'));assert(css.includes('body.touch :is(input,textarea,select'));assert(game.includes('installTouchCalloutGuard(document,{isTouch:()=>touch})'));
console.log('PASS: mobile held controls block selection/callouts, form editing and desktop remain native, pointer controls untouched, listeners removable.');
