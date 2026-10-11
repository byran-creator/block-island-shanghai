import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {collectSiteAssets} from '../scripts/site-assets.mjs';
import worker from '../worker/index.js';
import {createSettingsPanel} from '../game/settings-panel.js';

const assets=await collectSiteAssets();globalThis.SITE_ASSETS=assets;
const html=assets['/index.html'].body;
for(const match of html.matchAll(/<img\b[^>]*src="\.\/([^"?]+)"/g)){
 const name=match[1],response=await worker.fetch(new Request('https://island.test/'+name),{});
 assert.equal(response.status,200,'Built update image is served');assert.equal(response.headers.get('Content-Type'),'image/jpeg');
 assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile('game/'+name),'Binary bytes survive packaging and response');
}
const missing=await worker.fetch(new Request('https://island.test/assets/missing.jpg'),{});assert.equal(missing.status,404);
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,'Moved settings controls keep unique IDs');
let active=true,pauses=0,resumes=0;const events={};
const dialog={open:false,showModal(){this.open=true;},close(){this.open=false;},addEventListener(n,f){events[n]=f;}};
const panel=createSettingsPanel({dialog,isPlaying:()=>active,pause(){active=false;pauses++;},resume(){active=true;resumes++;}});
panel.open();assert(!active&&dialog.open);panel.open();assert.equal(pauses,1);events.cancel({preventDefault(){}});assert(active&&!dialog.open);assert.equal(resumes,1);
active=false;panel.open();panel.close();assert(!active,'Opening settings from the menu must not launch gameplay');
active=true;dialog.showModal=()=>{throw Error('unsupported dialog')};panel.open();assert(active,'Failed modal restores the previous playing state');
delete globalThis.SITE_ASSETS;
console.log('PASS: binary update images, unique control IDs, settings pause/resume/failure recovery.');
