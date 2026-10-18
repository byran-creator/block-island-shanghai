import assert from 'node:assert/strict';
import {createCloudSaves} from '../game/cloud-saves.js';
const saved=n=>({version:6,savedAt:'2026-10-18T10:00:00Z',pos:{x:n,y:26,z:66},edits:[['-109,25,66',7]],placed:n,adventure:{state:{collected:[],best:null}},journey:{version:1,index:3}});
const response=data=>new Response(JSON.stringify(data),{headers:{'content-type':'application/json'}});
function fixture(hostname,fetcher,initial){
 const nodes=new Map(),memory=new Map(initial?[['block-island-unsynced-v4',JSON.stringify(initial)]]:[]),state={started:false,data:saved(1),applied:[],messages:[],quota:false,calls:[]};
 const node=()=>({children:[],append(...x){this.children.push(...x)},appendChild(x){this.children.push(x)},replaceChildren(){this.children=[]},addEventListener(){},showModal(){this.open=true},close(){this.open=false},click(){},files:[]});
 globalThis.document={getElementById:id=>{if(!nodes.has(id))nodes.set(id,node());return nodes.get(id)},createElement:node,querySelector:()=>null,addEventListener(){},hidden:false};
 globalThis.window={addEventListener(){}};globalThis.location={hostname,protocol:'https:'};globalThis.localStorage={getItem:k=>memory.get(k)??null,setItem(k,v){if(state.quota)throw Error('quota');memory.set(k,v)},removeItem:k=>memory.delete(k)};
 globalThis.fetch=async(url,options)=>{state.calls.push({url,options});return fetcher(url,options)};
 const app=createCloudSaves({capture:()=>state.data,hasStarted:()=>state.started,apply:d=>{state.applied.push(d);state.data=d;state.started=true},notify:m=>state.messages.push(m),pause:()=>false,resume(){}});
 return {app,state,nodes,memory};
}
let release,fail=false,posts=0;
const cloud=fixture('game.test',async(url,options)=>{if(options.method==='POST'){posts++;if(fail)throw Error('offline');return response({save:{id:'auto',kind:'auto',savedAt:saved(1).savedAt}});}if(url==='/api/saves')return new Promise(r=>release=()=>r(response({saves:[{id:'old',kind:'auto',savedAt:saved(9).savedAt}]})));return response(saved(9));});
const continuing=cloud.app.continueLatest();await new Promise(setImmediate);assert.equal(cloud.state.applied.length,0);release();assert.equal(await continuing,true);assert.equal(cloud.state.applied[0].pos.x,9,'A slow initial list must restore exactly once instead of starting a fresh world');
fail=true;await cloud.app.save('manual');fail=false;await cloud.app.save('manual');assert.equal(posts,2,'Network failure must not permanently disable cloud requests');assert(cloud.nodes.get('save-status').textContent.includes('云端已保存'));
const browser=fixture('byran-creator.github.io',()=>{throw Error('Static Pages must not request /api/saves')});assert.equal(await browser.app.continueLatest(),false);browser.state.started=true;assert.equal(await browser.app.save('manual'),true);assert.equal(browser.state.calls.length,0);assert.equal(browser.nodes.get('load-game').disabled,false);assert(browser.nodes.get('save-status').textContent.includes('不跨网址'));
browser.state.quota=true;assert.equal(await browser.app.save('manual'),false);assert(browser.nodes.get('save-status').textContent.includes('内存'));browser.state.quota=false;
const input=browser.nodes.get('import-save-file');input.files=[{size:100,text:async()=>JSON.stringify({...saved(7),pos:{x:1e300,y:26,z:66}})}];await input.onchange();assert.equal(browser.state.applied.length,0,'Reject unbounded coordinates before touching the world');
input.files=[{size:100,text:async()=>JSON.stringify(saved(7))}];await input.onchange();assert.equal(browser.state.applied.at(-1).pos.x,7);assert(browser.memory.has('block-island-before-import-v1'));assert.equal(JSON.parse(browser.memory.get('block-island-unsynced-v4')).pos.x,7);
const disk=fixture('localhost',async(url,options)=>options.method==='POST'?response({storage:'local',save:{id:'disk',savedAt:saved(1).savedAt}}):response({storage:'local',saves:[]}));await disk.app.continueLatest();disk.state.started=true;await disk.app.save('manual');await disk.app.save('manual');assert.equal(disk.state.calls.filter(r=>r.options.method==='POST').length,2,'Development disk saves must keep using their server');
console.log('PASS: delayed cloud restore, retry after failure, browser-only durable/quota states, safe import/backup, and development disk persistence.');
