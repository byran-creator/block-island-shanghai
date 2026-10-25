import {build} from 'esbuild';
import {cp,readFile,writeFile,mkdir,rm,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';import path from 'node:path';import assert from 'node:assert/strict';
import {bundleWorldWorker,worldWorkerReference,worldSnapshotPreload} from './world-worker-build.mjs';
const root=await realpath('.'),output=path.resolve(root,'dist/pages');assert.equal(path.dirname(output),path.resolve(root,'dist'));
try{assert.equal(await realpath(output),output);}catch(e){if(e.code!=='ENOENT')throw e;}
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
await cp('game',output,{recursive:true,filter:p=>!path.basename(p).startsWith('__')});
const worker=await bundleWorldWorker();await writeFile(path.join(output,worker.name),worker.code);await writeFile(path.join(output,worker.snapshot.name),worker.snapshot.code);await rm(path.join(output,'world-worker.js'));
const result=await build({entryPoints:['game/game.js'],bundle:true,minify:true,format:'esm',target:'es2022',outdir:output,entryNames:'game-[hash]',metafile:true,legalComments:'inline',plugins:[{name:'world-worker-url',setup(build){build.onLoad({filter:/[\\/]world-generation\.js$/},async args=>({contents:worldWorkerReference(await readFile(args.path,'utf8'),worker.name,worker.buildId,worker.snapshot.manifest),loader:'js',resolveDir:path.dirname(args.path)}));}}]});
const entry=Object.keys(result.metafile.outputs).find(p=>result.metafile.outputs[p].entryPoint==='game/game.js');assert(entry,'Missing bundled entry');
const loading=await build({entryPoints:['game/loading-music.js'],bundle:true,minify:true,format:'esm',target:'es2022',outdir:output,entryNames:'loading-music-[hash]',metafile:true,legalComments:'inline'});
const loadingEntry=Object.keys(loading.metafile.outputs).find(p=>loading.metafile.outputs[p].entryPoint==='game/loading-music.js');assert(loadingEntry,'Missing loading music entry');
let html=await readFile('game/index.html','utf8');
html=html.replace('src="./loading-music.js"','src="./'+path.basename(loadingEntry)+'"');
assert(/src="\.\/game\.js(?:\?[^\"]*)?"/.test(html));html=html.replace(/src="\.\/game\.js(?:\?[^\"]*)?"/,'src="./'+path.basename(entry)+'"');
const styles=[...html.matchAll(/href="\.\/([^"?]+\.css)(?:\?[^\"]*)?"/g)];
for(const match of styles){const data=await readFile(path.join('game',match[1])),hash=createHash('sha256').update(data).digest('hex').slice(0,12),name=match[1].replace(/\.css$/,`-${hash}.css`);await writeFile(path.join(output,name),data);html=html.replace(match[0],`href="./${name}"`);}
html=html.replace('<head>','<head>\n'+worldSnapshotPreload(worker.snapshot.name)+'\n<meta name="block-island-storage" content="browser">');
await writeFile(path.join(output,'index.html'),html);await writeFile(path.join(output,'.nojekyll'),'');
console.log('Built Pages with a bundled content-hashed entry, styles and explicit browser-only saves.');
