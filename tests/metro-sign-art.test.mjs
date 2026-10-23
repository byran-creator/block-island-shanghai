import assert from 'node:assert/strict';
import {createMetroSignArt} from '../game/metro-sign-art.js';
const old=globalThis.document;let canvases=0;
globalThis.document={createElement(){canvases++;const calls=[],context={calls,fillRect(...v){calls.push(['rect',this.fillStyle,...v]);},fillText(...v){calls.push(['text',this.fillStyle,this.font,...v]);},measureText:t=>({width:t.length*16})};return {getContext:()=>context};}};
try{
 const pool=createMetroSignArt(),lines=['南京东路','East Nanjing Road'],opts={layout:'station',lineNumber:2,lineColor:'#92c83e'},a=pool.acquire(lines,opts,768,256,'#fff','#171a1b'),b=pool.acquire([...lines],{...opts},768,256,'#fff','#171a1b');
 assert.equal(a,b);assert.equal(canvases,1,'Identical immutable signs retain one canvas and one GPU texture');const drawing=JSON.stringify(a.context.calls),version=a.texture.version;
 assert.equal(pool.repaint(a,lines),a);assert.equal(a.texture.version,version,'Unchanged content does not schedule a texture upload');
 const own=pool.repaint(a,['陆家嘴','Lujiazui']);assert.notEqual(own.texture,a.texture);assert.equal(JSON.stringify(a.context.calls),drawing,'Repainting one board cannot alter a shared board');assert.equal(a.texture.version,version);const ownVersion=own.texture.version;
 assert.equal(pool.repaint(own,['豫园','Yuyuan']),own);assert(own.texture.version>ownVersion,'A detached board reuses its private canvas for subsequent changes');
 const arrival={layout:'arrival'},one=pool.acquire(['下一班','1分30秒'],arrival,1024,256,'#fff','#171a1b',false),two=pool.acquire(['下一班','1分30秒'],arrival,1024,256,'#fff','#171a1b',false);assert.notEqual(one.texture,two.texture);pool.repaint(one,['下一班','1分29秒']);assert(!two.context.calls.some(v=>v.includes('1分29秒')));
 const left=pool.acquire(['出口'],{arrow:'←'},768,256,'#fff','#171a1b'),right=pool.acquire(['出口'],{arrow:'→'},768,256,'#fff','#171a1b');assert.notEqual(left.texture,right.texture,'Opposite-face arrows are distinct artwork');
 assert.notEqual(pool.acquire(lines,{...opts,lineNumber:10,lineColor:'#c5a2ce'},768,256,'#fff','#171a1b').texture,a.texture);
 assert.notEqual(pool.acquire(lines,opts,1024,256,'#fff','#171a1b').texture,a.texture,'Physical canvas dimensions remain part of the key');assert.notEqual(createMetroSignArt().acquire(lines,opts,768,256,'#fff','#171a1b').texture,a.texture,'Pools belong to individual metro roots, not a global cache');
}finally{globalThis.document=old;}
console.log('PASS: immutable sign sharing, unchanged upload suppression, independent repaint/dynamic screens, arrows/lines/size separation and per-root ownership.');
