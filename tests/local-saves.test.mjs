import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Readable} from 'node:stream';
import {createLocalSaves} from '../scripts/local-saves.mjs';
const dir=await mkdtemp(join(tmpdir(),'island-saves-'));
const data={version:6,mapRevision:7,edits:[['-40,26,-15',7]],pos:{x:-40,y:26,z:-15},placed:1,adventure:{state:{collected:[],best:null},poster:'data:image/png;base64,aGVsbG8='}};
async function call(handler,url='/api/saves',method='GET',body,origin='http://localhost:5173'){let result;const req=Readable.from(body?[JSON.stringify(body)]:[]);Object.assign(req,{url,method,headers:{host:'localhost:5173',origin}});const res={setHeader(){},end(text){result={status:this.statusCode,json:JSON.parse(text)}}};await handler(req,res,()=>{throw Error('API fell through')});return result}
try{
 const handler=createLocalSaves(dir);assert.equal((await call(handler)).json.saves.length,0);
 assert.equal((await call(handler,undefined,'POST',{data},'http://foreign.test')).status,403);
 assert.equal((await call(handler,undefined,'POST',{data:{}})).status,400);
 await Promise.all(Array.from({length:12},(_,i)=>call(handler,undefined,'POST',{data:{...data,placed:i},kind:'manual'})));
 await call(handler,undefined,'POST',{data,kind:'auto'});await call(handler,undefined,'POST',{data:{...data,placed:90},kind:'auto'});
 const reopened=createLocalSaves(dir),list=(await call(reopened)).json;assert.equal(list.storage,'local');assert.equal(list.saves.length,11);assert.equal(list.saves.filter(s=>s.kind==='auto').length,1);
 const restored=await call(reopened,'/api/saves/local-auto');assert.equal(restored.json.placed,90);assert.deepEqual(restored.json.edits,data.edits);
 assert.equal((await call(reopened,'/api/saves/missing')).status,404);
 console.log('PASS: local disk saves survive service restart, concurrent writes, automatic overwrite, ten manual snapshots, signed coordinates and origin validation.');
}finally{await rm(dir,{recursive:true,force:true})}
