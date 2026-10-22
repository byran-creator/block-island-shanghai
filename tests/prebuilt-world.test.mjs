import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {Worker as NodeWorker} from 'node:worker_threads';
import {mkdtemp,writeFile,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'esbuild';
import {bundleWorldWorker,worldWorkerReference,worldSnapshotPreload} from '../scripts/world-worker-build.mjs';
import {collectSiteAssets} from '../scripts/site-assets.mjs';
import {generateWorld} from '../game/world-generation.js';
import {createWorldBaseline,validBaselineRuns} from '../game/world-baseline.js';
import {WORLD_CACHE_REVISION,loadWorld} from '../game/world-cache.js';
import {VoxelWorld,SIZE,HEIGHT} from '../game/world.js';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),expected=new VoxelWorld(),voxelHash=hash(expected.data),surfaceHash=hash(new Uint8Array(expected.surface.buffer)),bundle=await bundleWorldWorker('game'),directory=await mkdtemp(path.join(tmpdir(),'block-island-prebuilt-'));
const file=path.join(directory,bundle.name.replace(/\.js$/,'.mjs')),assetPath=path.join(directory,bundle.snapshot.name),messages=[];
try{
 assert.equal(bundle.snapshot.manifest.revision,WORLD_CACHE_REVISION);assert.equal(bundle.buildId,bundle.snapshot.manifest.packedSha256);assert.equal(bundle.snapshot.manifest.voxelSha256,voxelHash);assert.equal(bundle.snapshot.manifest.surfaceSha256,surfaceHash);
 await writeFile(file,bundle.code);await writeFile(assetPath,bundle.snapshot.code);
 async function run(mode,{snapshot=true,generator=generateWorld,expectWorker=true}={}){
  let record,terminated=0,workerCreated=0,workerSnapshot;
  const world=await generator(()=>{
   workerCreated++;
   const worker=new NodeWorker(`const {parentPort,workerData}=require('node:worker_threads');const {readFile}=require('node:fs/promises');let fetches=0;globalThis.self={postMessage:(value,transfer)=>parentPort.postMessage({...value,qaFetches:fetches},transfer)};if(workerData.mode==='no-decompression')globalThis.DecompressionStream=undefined;globalThis.fetch=async url=>{fetches++;if(String(url)!==workerData.assetUrl)throw Error('Unexpected asset request');return workerData.mode==='missing'?new Response('',{status:404}):new Response(await readFile(workerData.assetPath));};import(workerData.moduleUrl).then(()=>parentPort.on('message',data=>self.onmessage({data}))).catch(error=>{throw error;});`,{eval:true,workerData:{mode,assetUrl:pathToFileURL(assetPath).href,assetPath,moduleUrl:pathToFileURL(file).href}});
   const timer=setTimeout(()=>{adapter.onerror?.(Error('Bounded worker test timed out'));worker.terminate();},10000),adapter={postMessage(message){workerSnapshot=message.snapshot;worker.postMessage(message);},terminate(){clearTimeout(timer);terminated++;worker.terminate();}};
   worker.on('message',data=>{record=data;adapter.onmessage?.({data});});worker.on('error',error=>adapter.onerror?.(error));return adapter;
  },{snapshot});
  assert.equal(terminated,expectWorker?1:0);assert.equal(workerCreated,expectWorker?1:0);assert.equal(world.generationWorker,expectWorker);assert.equal(hash(world.data),voxelHash);assert.equal(hash(new Uint8Array(world.surface.buffer)),surfaceHash);assert(validBaselineRuns(world.baseline,world.data.length));messages.push({mode,source:world.generationSource,fetches:record?.qaFetches??0,workerCreated});return {world,record,workerSnapshot};
 }
 const ready=await run('asset');assert.equal(ready.world.generationSource,'snapshot');assert.equal(ready.record.qaFetches,1);
 const baseline=createWorldBaseline(ready.world.data,ready.world.baseline);assert.equal(baseline.runs.ends,ready.world.baseline.ends,'Prepared baseline is reused without another full-map scan');
 const edits=[0,Math.floor(SIZE/2),SIZE*SIZE*26+100,ready.world.data.length-1];for(const i of edits){assert.equal(baseline.get(i),expected.data[i]);ready.world.data[i]=(expected.data[i]+1)%14;}baseline.restore(ready.world.data);assert.equal(hash(ready.world.data),voxelHash,'Player edits restore against the immutable prepared base');
 const cacheRecord={revision:WORLD_CACHE_REVISION,buildId:bundle.buildId,data:ready.world.data,surface:ready.world.surface,baseline:ready.world.baseline};
 const cached=await loadWorld(()=>{},{read:async()=>cacheRecord,write:async()=>{throw Error('Cache hit must not rewrite storage');}});assert.equal(cached.cacheHit,true);assert.equal(cached.baseline,ready.world.baseline);assert.equal(cached.data,ready.world.data);
 for(const mode of ['missing','no-decompression']){const result=await run(mode);assert.equal(result.world.generationSource,'generated');assert.equal(result.record.qaFetches,1);}
 const rebuilt=await run('asset',{snapshot:false});assert.equal(rebuilt.world.generationSource,'generated');assert.equal(rebuilt.record.qaFetches,0,'Explicit rebuild must not reuse the prebuilt asset');

 const generationSource=await readFile('game/world-generation.js','utf8'),rewritten=worldWorkerReference(generationSource,bundle.name,bundle.buildId,bundle.snapshot.manifest);assert(rewritten.includes('export const WORLD_BUILD_ID='+JSON.stringify(bundle.buildId)+';'));assert(rewritten.includes('export const WORLD_SNAPSHOT='+JSON.stringify(bundle.snapshot.manifest)+';'));assert(rewritten.includes("new URL('./"+bundle.name+"',import.meta.url)"));
 const generatedModule=await build({stdin:{contents:"export {generateWorld,WORLD_SNAPSHOT} from './game/world-generation.js';",resolveDir:process.cwd(),loader:'js'},bundle:true,format:'esm',platform:'node',write:false,plugins:[{name:'test-main-snapshot',setup(builder){builder.onLoad({filter:/[\\/]world-generation\.js$/},()=>({contents:rewritten,loader:'js',resolveDir:path.resolve('game')}));}}]}),mainPath=path.join(directory,'main-world.mjs');
 await writeFile(mainPath,generatedModule.outputFiles[0].text);const main=await import(pathToFileURL(mainPath).href);assert.equal(main.WORLD_SNAPSHOT.file,bundle.snapshot.name);
 const originalFetch=globalThis.fetch,originalDecompression=globalThis.DecompressionStream,mainVariants=[];
 try{for(const [mode,snapshot]of [['asset',true],['missing',true],['no-decompression',true],['asset',false]]){
  let fetches=0;globalThis.DecompressionStream=mode==='no-decompression'?undefined:originalDecompression;globalThis.fetch=async url=>{fetches++;assert.equal(String(url),pathToFileURL(assetPath).href,'Main fast path requests only the pinned local asset');return mode==='missing'?new Response('',{status:404}):new Response(bundle.snapshot.code);};
  const success=mode==='asset'&&snapshot,result=await run(mode,{snapshot,generator:main.generateWorld,expectWorker:!success});assert.equal(result.world.generationSource,success?'snapshot':'generated');assert.equal(fetches,snapshot?1:0);
  if(!success){assert.equal(result.workerSnapshot,false,'An attempted or disabled main snapshot must not download again in the worker');assert.equal(result.record.qaFetches,0);}
  mainVariants.push({mode,snapshot,mainFetches:fetches,workerFetches:result.record?.qaFetches??0,source:result.world.generationSource});
 }}finally{globalThis.fetch=originalFetch;globalThis.DecompressionStream=originalDecompression;}
 const compiled=await build({stdin:{contents:"export {validWorldCache} from './game/world-cache.js';",resolveDir:process.cwd(),loader:'js'},bundle:true,format:'esm',platform:'node',write:false,plugins:[{name:'pin-test-world-build',setup(builder){builder.onLoad({filter:/[\\/]world-generation\.js$/},()=>({contents:rewritten,loader:'js',resolveDir:path.resolve('game')}));}}]});
 const pinned=await import('data:text/javascript;base64,'+Buffer.from(compiled.outputFiles[0].text).toString('base64'));
 assert(pinned.validWorldCache(cacheRecord));assert(!pinned.validWorldCache({...cacheRecord,buildId:undefined}),'A cache created by an older build must regenerate');assert(!pinned.validWorldCache({...cacheRecord,buildId:'older-generator'}));
 const assets=await collectSiteAssets('game'),snapshot=assets['/'+bundle.snapshot.name];assert.equal(snapshot.type,'application/octet-stream');assert.equal(snapshot.encoding,'base64');assert.deepEqual(Buffer.from(snapshot.body,'base64'),bundle.snapshot.code);assert.equal(assets['/'+bundle.name].body,bundle.code);assert(!assets['/world-worker.js']);assert.equal(assets['/world-generation.js'].body,rewritten);assert(assets['/index.html'].body.includes(worldSnapshotPreload(bundle.snapshot.name)));
 const mainName=assets['/index.html'].body.match(/src="\.\/(game-[a-f0-9]{12}\.js)"/)?.[1];assert(mainName,'Sites HTML selects a content-hashed bundled entry');const mainAsset=assets['/'+mainName];assert(mainAsset);assert.equal(mainName,'game-'+hash(mainAsset.body).slice(0,12)+'.js');
 const parsedMain=await build({stdin:{contents:mainAsset.body,resolveDir:process.cwd(),loader:'js'},bundle:false,format:'esm',write:false,metafile:true});for(const output of Object.values(parsedMain.metafile.outputs))assert.equal(output.imports.length,0,'The bundled Sites entry has no external module imports');
 assert.equal(assets['/game.js'].body,await readFile('game/game.js','utf8'),'Original module routes remain available');assert.equal(assets['/cloud-saves.js'].body,await readFile('game/cloud-saves.js','utf8'));assert(!assets['/index.html'].body.includes('<meta name="block-island-storage" content="browser">'),'Sites retains its existing authenticated save mode');
 const routeAssets={'/index.html':{body:'<html></html>',type:'text/html'},'/game.js':{body:'module',type:'text/javascript'}};
 for(const name of [mainName,bundle.name,bundle.snapshot.name])routeAssets['/'+name]={body:'asset',type:'application/octet-stream'};
 const routeSource='const SITE_ASSETS='+JSON.stringify(routeAssets)+';\n'+await readFile('worker/index.js','utf8'),route=await import('data:text/javascript;base64,'+Buffer.from(routeSource).toString('base64'));
 for(const name of [mainName,bundle.name,bundle.snapshot.name])assert.equal((await route.default.fetch(new Request('https://game.test/'+name),{})).headers.get('Cache-Control'),'public, max-age=31536000, immutable');
 for(const name of ['', 'game.js'])assert.equal((await route.default.fetch(new Request('https://game.test/'+name),{})).headers.get('Cache-Control'),'no-cache','HTML and unhashed modules must see new releases');
 const unauthenticated=await route.default.fetch(new Request('https://game.test/api/saves'),{});assert.equal(unauthenticated.status,401);assert.equal(unauthenticated.headers.get('Cache-Control'),'no-store','Player save responses never share static caching');
 console.log(JSON.stringify({passed:true,workerVariants:messages,mainVariants,voxelHash,surfaceHash,compressedBytes:bundle.snapshot.code.byteLength,preparedBaselineReused:true,oldBuildCacheRejected:true,siteSnapshotAndPreloadMatch:true,siteBundledEntry:mainName,siteEntryExternalImports:0,staticCacheAndSavePrivacyPreserved:true}));
}finally{assert.equal(path.dirname(path.resolve(directory)),path.resolve(tmpdir()));assert(path.basename(directory).startsWith('block-island-prebuilt-'));await rm(directory,{recursive:true,force:true});}
