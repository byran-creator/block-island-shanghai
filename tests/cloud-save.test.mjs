import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import {storageFixture} from './storage-fixture.mjs';
const {env,objects}=storageFixture(),origin='https://game.test';
const data={version:4,edits:[['40,10,55',7]],pos:{x:40,y:10,z:49},placed:7,adventure:{state:{collected:['village'],best:null},poster:'data:image/png;base64,aGVsbG8='}};
async function call(path='',{user='alice',method='GET',body,source=origin}={}){const headers={'Content-Type':'application/json',Origin:source};if(user)headers['oai-authenticated-user-id']=user;return worker.fetch(new Request(origin+'/api/saves'+path,{method,headers,body:body&&JSON.stringify(body)}),env)}
assert.equal((await call('',{user:null})).status,401);assert.equal((await call('',{method:'POST',source:'https://foreign.test',body:{data}})).status,403);assert.equal((await call('',{method:'POST',body:{data:{}}})).status,400);
const first=(await (await call('',{method:'POST',body:{data,kind:'manual'}})).json()).save;
assert.equal((await call('/'+first.id,{user:'bob'})).status,404);assert.equal((await (await call('',{user:'bob'})).json()).saves.length,0);
const loaded=await (await call('/'+first.id)).json();assert.deepEqual(loaded.edits,data.edits);assert.equal(loaded.adventure.poster,data.adventure.poster);
for(let i=0;i<12;i++){await new Promise(r=>setTimeout(r,2));assert.equal((await call('',{method:'POST',body:{data:{...data,placed:i},kind:'manual'}})).status,200)}
const a=(await (await call('',{method:'POST',body:{data,kind:'auto'}})).json()).save;const b=(await (await call('',{method:'POST',body:{data:{...data,placed:99},kind:'auto'}})).json()).save;assert.equal(a.id,b.id);
const records=(await (await call()).json()).saves;assert.equal(records.length,11);assert.equal(records.filter(r=>r.kind==='manual').length,10);assert.equal(objects.size,11);assert.equal((await call('/'+first.id)).status,404);assert.equal((await (await call('/'+a.id)).json()).placed,99);
assert.equal((await worker.fetch(new Request(origin+'/api/saves',{headers:{'oai-authenticated-user-id':'alice'}}),{})).status,503);
const expanded={...data,version:6,life:{mode:'survival',health:17,oxygen:120,dive:true,equipped:true,bag:{7:12},furniture:[{type:'chest',x:45.5,y:26,z:54.5,storage:{7:23}}],treasures:['temple']}};const latest=(await (await call('',{method:'POST',body:{data:expanded,kind:'auto'}})).json()).save;assert.deepEqual((await (await call('/'+latest.id)).json()).life,expanded.life);
console.log('PASS: real SQLite migration, durable snapshot round-trip, account isolation, origin checks, automatic overwrite, 10 manual records retained, removed blobs cleaned, recoverable storage failure.');

const northSave={...expanded,mapRevision:7,edits:[['-44,26,-25',7]],pos:{x:-44,y:26,z:-25}};
const northId=(await (await call('',{method:'POST',body:{data:northSave,kind:'manual'}})).json()).save.id;
assert.deepEqual((await (await call('/'+northId)).json()).edits,northSave.edits);
