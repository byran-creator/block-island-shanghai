import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {bundleWorldWorker,worldWorkerReference,worldSnapshotPreload} from './world-worker-build.mjs';
import {inlineLoadingMusic} from './loading-music-build.mjs';
const binaryTypes={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.gif':'image/gif','.avif':'image/avif','.mp3':'audio/mpeg','.ogg':'audio/ogg','.wav':'audio/wav','.woff2':'font/woff2'};
const textTypes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.txt':'text/plain; charset=utf-8','.svg':'image/svg+xml'};
export async function collectSiteAssets(directory='game'){
 const assets={};
 async function collect(relative=''){
  for(const entry of await readdir(path.join(directory,relative),{withFileTypes:true})){
   const name=relative?relative+'/'+entry.name:entry.name;
   if(entry.isDirectory()){if(name==='assets'||name.startsWith('assets/'))await collect(name);continue;}
   if(!entry.isFile()||entry.name.startsWith('__'))continue;
   const ext=path.extname(name).toLowerCase(),type=binaryTypes[ext]||textTypes[ext];if(!type)continue;
   const bytes=await readFile(path.join(directory,name));
   assets['/'+name]={body:bytes.toString(binaryTypes[ext]?'base64':'utf8'),type,...(binaryTypes[ext]?{encoding:'base64'}:{})};
  }
 }
 await collect();
 const worker=await bundleWorldWorker(directory);assets['/world-generation.js'].body=worldWorkerReference(assets['/world-generation.js'].body,worker.name,worker.buildId,worker.snapshot.manifest);
 assets['/'+worker.snapshot.name]={body:worker.snapshot.code.toString('base64'),type:'application/octet-stream',encoding:'base64'};
 assets['/index.html'].body=assets['/index.html'].body.replace('<head>','<head>\n'+worldSnapshotPreload(worker.snapshot.name));
 // Match Pages' single content-hashed browser entry, while preserving the
 // original Site's authenticated saves and its existing asset routes.
 const entry=await build({entryPoints:[path.resolve(directory,'game.js')],bundle:true,minify:true,format:'esm',target:'es2022',write:false,legalComments:'inline',plugins:[{name:'site-world-worker-url',setup(builder){builder.onLoad({filter:/[\\/]world-generation\.js$/},async args=>({contents:worldWorkerReference(await readFile(args.path,'utf8'),worker.name,worker.buildId,worker.snapshot.manifest),loader:'js',resolveDir:path.dirname(args.path)}));}}]}),code=entry.outputFiles[0].text,name='game-'+createHash('sha256').update(code).digest('hex').slice(0,12)+'.js';
 assets['/'+name]={body:code,type:textTypes['.js']};
 assets['/index.html'].body=await inlineLoadingMusic(assets['/index.html'].body,directory);
 const index=assets['/index.html'].body;if(!/src="\.\/game\.js(?:\?[^\"]*)?"/.test(index))throw Error('Site browser entry anchor missing');assets['/index.html'].body=index.replace(/src="\.\/game\.js(?:\?[^\"]*)?"/,'src="./'+name+'"');
 delete assets['/world-worker.js'];assets['/'+worker.name]={body:worker.code,type:textTypes['.js']};return assets;
}
